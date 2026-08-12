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

    def unmapped_names(self, raw_names: list[str], codes: dict[str, str] | None = None) -> list[str]:
        """Raw names with no resolution through either layer."""
        codes = codes or {}
        out = []
        for name in raw_names:
            _, status = self.resolve(name, codes.get(name, ""))
            if status == "unmapped":
                out.append(name)
        return out
