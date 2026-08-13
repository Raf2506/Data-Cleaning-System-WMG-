"""The two-layer, persistent outlet mapping library (spec section 4.3).

Layer 1  Name -> Group : raw Name string  -> canonical outlet.
Layer 2  Code -> Group : invoice code or fragment -> canonical outlet, used when
         the Name cell is missing, numeric, or unresolvable.

Both layers persist to JSON so they carry across future monthly uploads.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from .parser import looks_like_code_name


@dataclass
class CodeRule:
    """A keyword rule: a fragment of the invoice code *or* the raw name.

    Branch keywords come in both kinds — `C0084` and `SNWG` identify the branch
    through its code, while `KLUANG PERDANA` and `BANGI` appear in the name — so
    a fragment rule tries both. exact=True still means the whole code, which is
    the only way to pin a rule to one specific account.
    """

    pattern: str
    group: str
    exact: bool = False

    def matches(self, code: str, name: str = "") -> bool:
        pattern = self.pattern.strip().upper()
        if not pattern:
            return False
        code = (code or "").strip().upper()
        if self.exact:
            return bool(code) and code == pattern
        if code and pattern in code:
            return True
        # Names match on whole words only. A loose substring makes SENA match
        # SENAI, and BM match any name containing those letters — silently
        # moving revenue to the wrong branch.
        name = (name or "").strip().upper()
        return bool(name) and re.search(rf"(?<![A-Z0-9]){re.escape(pattern)}(?![A-Z0-9])", name) is not None


@dataclass
class MappingLibrary:
    name_to_group: dict[str, str] = field(default_factory=dict)
    code_rules: list[CodeRule] = field(default_factory=list)
    # Branch (Outlet) -> OutletGroup (chain). A branch with no entry is its own
    # group, which is how the big single-account chains behave.
    branch_to_chain: dict[str, str] = field(default_factory=dict)
    # Chain-name fragment -> OutletGroup, found in the raw name itself, e.g.
    # "SOON CHEONG MARINE PRODUCT SDN BHD KL" carries the chain but no branch.
    # This is what makes a row count as LKA even when the branch is unnamed.
    chain_keywords: dict[str, str] = field(default_factory=dict)

    # --- persistence -----------------------------------------------------
    @classmethod
    def load(cls, path: str | Path) -> "MappingLibrary":
        p = Path(path)
        if not p.exists():
            return cls()
        data = json.loads(p.read_text(encoding="utf-8"))
        return cls(
            name_to_group={k.upper(): v for k, v in data.get("name_to_group", {}).items()},
            code_rules=[CodeRule(**r) for r in data.get("code_rules", [])],
            branch_to_chain={k.upper(): v for k, v in data.get("branch_to_chain", {}).items()},
            chain_keywords={k.upper(): v for k, v in data.get("chain_keywords", {}).items()},
        )

    def save(self, path: str | Path) -> None:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(
            json.dumps(
                {
                    "name_to_group": self.name_to_group,
                    "code_rules": [r.__dict__ for r in self.code_rules],
                    "branch_to_chain": self.branch_to_chain,
                    "chain_keywords": self.chain_keywords,
                },
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

    # --- editing ---------------------------------------------------------
    def set_name(self, raw_name: str, group: str) -> None:
        self.name_to_group[raw_name.strip().upper()] = group.strip()

    def delete_name(self, raw_name: str) -> None:
        self.name_to_group.pop(raw_name.strip().upper(), None)

    def set_code(self, pattern: str, group: str, exact: bool = False) -> None:
        pattern = pattern.strip()
        for rule in self.code_rules:
            if rule.pattern.upper() == pattern.upper():
                rule.group, rule.exact = group.strip(), exact
                return
        self.code_rules.append(CodeRule(pattern=pattern, group=group.strip(), exact=exact))

    def delete_code(self, pattern: str) -> None:
        self.code_rules = [r for r in self.code_rules if r.pattern.upper() != pattern.strip().upper()]

    def merge_suggestions(self, suggestions: dict[str, str]) -> int:
        """Add draft Name->Group pairs without overwriting user-confirmed ones."""
        added = 0
        for raw, group in suggestions.items():
            key = raw.strip().upper()
            if key not in self.name_to_group:
                self.name_to_group[key] = group
                added += 1
        return added

    # --- resolution ------------------------------------------------------
    def resolve(self, raw_name: str, code: str) -> tuple[str, str]:
        """Return (canonical outlet, mapping status).

        Status is one of: mapped-name, mapped-code, unmapped.
        Name is tried first; a numeric/code-like Name skips straight to the code
        layer. Anything still unresolved keeps its raw value and is flagged —
        never silently dropped, never silently renamed.
        """
        name = (raw_name or "").strip()
        key = name.upper()

        if name and not looks_like_code_name(name) and key in self.name_to_group:
            return self.name_to_group[key], "mapped-name"

        # Longest keyword first, so a specific rule beats a shorter one that is a
        # prefix of it — KLUANG PERDANA must win over KLUANG.
        for rule in sorted(self.code_rules, key=lambda r: -len(r.pattern.strip())):
            if rule.matches(code, name):
                return rule.group, "mapped-code"

        # Nothing detected. Fall back to the invoice code, which is stable and
        # unique per account — a branch name like "10094 KUBANG KERIAN" carries
        # an internal number that changes between systems, so the code is the
        # safer label. Still flagged unmapped so it stays in the queue.
        fallback = (code or "").strip()
        if fallback:
            return fallback, "unmapped"
        return name or "UNKNOWN", "unmapped"

    def chain_of(self, branch: str) -> str:
        """The OutletGroup for a resolved branch; the branch itself if none."""
        return self.branch_to_chain.get((branch or "").strip().upper(), branch)

    # --- store names (the OutletGroup universe) --------------------------
    def set_store(self, keyword: str, store: str) -> None:
        self.chain_keywords[keyword.strip().upper()] = store.strip()

    def delete_store(self, keyword: str) -> None:
        self.chain_keywords.pop(keyword.strip().upper(), None)

    def store_of(self, raw_name: str, code: str = "") -> str:
        """The Store Name (OutletGroup) a row belongs to, or "" if none.

        A store keyword is matched against the raw name and the invoice code,
        longest first. This is what decides inclusion: a row that matches no
        store is out of scope. The keyword can be a company fragment found in the
        name ("SOON CHEONG", "ST"), or a code fragment ("300-C") for accounts the
        export never names.
        """
        name = (raw_name or "").strip().upper()
        code = (code or "").strip().upper()
        fragments = sorted(self.chain_keywords, key=len, reverse=True)

        # Code matches first: an invoice code is a per-account key, so a code
        # rule is a specific override and must win over any name fragment — the
        # account 300-S0257 belongs to SOON CHEONG even though its name reads
        # "ST ROSYAM MART". A code fragment matches as a plain substring.
        if code:
            for fragment in fragments:
                frag = fragment.strip().upper()
                if frag and frag in code:
                    return self.chain_keywords[fragment]

        # Then name matches: anchored on word boundaries with an optional trailing
        # plural, so "CS BROTHER" matches "CS BROTHERS" but "ST" never bleeds into
        # "STAR".
        if name:
            for fragment in fragments:
                frag = fragment.strip().upper()
                if frag and re.search(rf"(?<![A-Z0-9]){re.escape(frag)}S?(?![A-Z0-9])", name):
                    return self.chain_keywords[fragment]
        return ""

    # Kept for callers that only look at the name.
    def chain_in_name(self, raw_name: str) -> str:
        return self.store_of(raw_name, "")

    def branch_of(self, raw_name: str, code: str) -> tuple[str, bool]:
        """The branch label for a row, and whether a keyword named it.

        A Branch Names keyword matches the invoice code or the raw name, longest
        first, so "300-H.LGT" -> Langat and "USJ" -> USJ. When nothing matches,
        the branch is the invoice code itself — a stable per-account key the user
        can later assign a nicer keyword to.
        """
        name = (raw_name or "").strip()
        for rule in sorted(self.code_rules, key=lambda r: -len(r.pattern.strip())):
            if rule.matches(code, name):
                return rule.group, True
        return (code or "").strip() or name or "UNKNOWN", False

    OUT_OF_SCOPE = "(not a store)"

    def group_and_branch(self, raw_name: str, code: str) -> tuple[str, str, str]:
        """Resolve to (OutletGroup, Branch, status).

        The store comes from the raw name or code via the Store Names keywords —
        "ST ROSYAM..." is SRI TERNAK for every one of its branches, so a store
        like CLC that no raw name matches simply never appears. A row matching no
        store is out of scope and dropped. The branch is a Branch Names keyword
        when one matches, otherwise the invoice code.
        """
        store = self.store_of(raw_name, code)
        branch, _ = self.branch_of(raw_name, code)
        if not store:
            return self.OUT_OF_SCOPE, branch, "out-of-scope"
        return store, branch, "mapped"

    def unmapped_names(self, raw_names: list[str], codes: dict[str, str] | None = None) -> list[str]:
        """Raw names with no resolution through either layer."""
        codes = codes or {}
        out = []
        for name in raw_names:
            _, status = self.resolve(name, codes.get(name, ""))
            if status == "unmapped":
                out.append(name)
        return out
