"""The two-layer, persistent outlet mapping library (spec section 4.3).

Layer 1  Name -> Group : raw Name string  -> canonical outlet.
Layer 2  Code -> Group : invoice code or fragment -> canonical outlet, used when
         the Name cell is missing, numeric, or unresolvable.

Both layers persist to JSON so they carry across future monthly uploads.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

from .parser import looks_like_code_name


@dataclass
class CodeRule:
    """A Code->Group rule. exact=True matches the whole code; otherwise substring."""

    pattern: str
    group: str
    exact: bool = False

    def matches(self, code: str) -> bool:
        code = (code or "").strip().upper()
        pattern = self.pattern.strip().upper()
        if not code or not pattern:
            return False
        return code == pattern if self.exact else pattern in code


@dataclass
class MappingLibrary:
    name_to_group: dict[str, str] = field(default_factory=dict)
    code_rules: list[CodeRule] = field(default_factory=list)

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
        )

    def save(self, path: str | Path) -> None:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(
            json.dumps(
                {
                    "name_to_group": self.name_to_group,
                    "code_rules": [r.__dict__ for r in self.code_rules],
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

        for rule in self.code_rules:
            if rule.matches(code):
                return rule.group, "mapped-code"

        if name and not looks_like_code_name(name) and key not in self.name_to_group:
            return name, "unmapped"

        return name or (code or "").strip() or "UNKNOWN", "unmapped"

    def unmapped_names(self, raw_names: list[str], codes: dict[str, str] | None = None) -> list[str]:
        """Raw names with no resolution through either layer."""
        codes = codes or {}
        out = []
        for name in raw_names:
            _, status = self.resolve(name, codes.get(name, ""))
            if status == "unmapped":
                out.append(name)
        return out
