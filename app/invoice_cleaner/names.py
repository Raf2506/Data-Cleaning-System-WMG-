"""Turn an ERP customer name into a store name and a branch.

The Store Names keyword list is the user's own grouping layer, but it only knows
the chains they have already entered. A fresh export from another company (West
Malayan Distribution, say) matches none of them, and before this module every one
of its rows was dropped as out of scope — the upload looked like it had done
nothing at all.

So every name also gets a derived fallback. The rules here are the ones the user
applies by hand in their own cleaned workbooks: drop the legal suffix, lift the
branch out of the brackets, and keep whatever is left as the store.

    99 SPEED MART SDN BHD                      -> 99 SPEED MART        /
    AOMORI MART SDN BHD (JELAPANG)             -> AOMORI MART          / JELAPANG
    SST APPAREL SDN BHD c/o Coffeehub          -> SST APPAREL          / COFFEEHUB
    MOHAMED MEERA SAHIB (M) SDN.BHD. (405938-H)-> MOHAMED MEERA SAHIB (M) /
"""
from __future__ import annotations

import re

# Stripped from the end of a name, longest first so "SENDIRIAN BERHAD" is not
# left as a stray "SENDIRIAN" by the shorter "BERHAD" rule.
LEGAL_SUFFIXES = (
    "SENDIRIAN BERHAD",
    "SDN. BHD.",
    "SDN.BHD.",
    "SDN BHD.",
    "SDN. BHD",
    "SDN.BHD",
    "SDN BHD",
    "BERHAD",
    "S/B",
    "BHD.",
    "BHD",
    "PLT",
    "LLP",
)

# A bracketed company registration number: digits, optionally with a dash and a
# check letter. A branch never looks like this, and "(M)" — part of a trade name
# — never matches because it does not start with a digit.
_REG_NUMBER = re.compile(r"\(\s*\d[\d\s\-/]*[A-Z]?\s*\)", re.I)

# "c/o Coffeehub", "CAWANGAN SENAWANG", "BRANCH USJ" — all name the branch.
_CARE_OF = re.compile(r"\bC\s*/\s*O\s+(.+)$", re.I)
_BRANCH_WORD = re.compile(r"\b(?:CAWANGAN|BRANCH|CAW\.?)\s+(.+)$", re.I)

# A trailing bracket that is not a registration number, e.g. "(JELAPANG)".
_TRAILING_BRACKET = re.compile(r"\(([^()]{2,})\)\s*$")

# Some invoices name the customer only by an internal outlet number and a place:
# "10058 KLEBANG", "10106 BATU GAJAH". The chain is never written on these rows —
# they are ECONSAVE outlets, confirmed by the user — and the place after the
# number is the outlet name to use.
NUMBERED_OUTLET_CHAIN = "ECONSAVE"
_NUMBERED_OUTLET = re.compile(r"^\d{3,}\s+(.+)$")


def numbered_outlet(raw_name: str) -> str:
    """The place in a "10058 KLEBANG" style name, or "" when it is not one."""
    found = _NUMBERED_OUTLET.match(_squash(raw_name))
    return _squash(found.group(1)) if found else ""


def _squash(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip()).upper()


def _strip_legal(name: str) -> str:
    """Peel legal suffixes off the end until none is left."""
    out = name
    changed = True
    while changed:
        changed = False
        for suffix in LEGAL_SUFFIXES:
            if out.endswith(suffix) and len(out) > len(suffix):
                out = out[: -len(suffix)].strip(" ,.-")
                changed = True
                break
    return out


def split_customer(raw_name: str) -> tuple[str, str]:
    """Return (store name, branch) derived from a raw customer name.

    Branch is "" when the name carries none — the caller falls back to the
    invoice code, which is the user's own convention for unnamed branches.
    """
    name = _squash(raw_name)
    if not name:
        return "", ""

    name = _REG_NUMBER.sub(" ", name)
    name = _squash(name)

    branch = ""
    for pattern in (_CARE_OF, _BRANCH_WORD):
        found = pattern.search(name)
        if found:
            branch = _squash(found.group(1))
            name = _squash(name[: found.start()])
            break

    if not branch:
        found = _TRAILING_BRACKET.search(name)
        if found:
            branch = _squash(found.group(1))
            name = _squash(name[: found.start()])

    # "ECONSAVE - AMPANG BARU": the chain, then the branch.
    if not branch and " - " in name:
        head, _, tail = name.partition(" - ")
        if head.strip():
            branch, name = _squash(tail), _squash(head)

    store = _strip_legal(name).strip(" ,.-")
    # Stripping everything (a name that was only a suffix) means the original
    # was the best label available.
    return (store or name, branch)


def derive_store(raw_name: str) -> str:
    return split_customer(raw_name)[0]


def derive_branch(raw_name: str) -> str:
    return split_customer(raw_name)[1]
