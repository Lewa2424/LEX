# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

p = Path(
    r"e:\Programming\Sites\LEX\development data\lecture-work\maps\_extract_cache"
    r"\12_vedennia-dokumentatsii-ta-navchannia-z-okhorony-pr\29e3020c96781cb7.json"
)
d = json.loads(p.read_text(encoding="utf-8"))
out = []
for page in d["pages"]:
    t = re.sub(r"\s+", " ", page["text"] or "").strip()
    if len(t) < 40:
        continue
    if re.search(
        r"інструктаж|вступн|первинн|повторн|позапланов|цільов|звільнен",
        t,
        re.I,
    ):
        out.append(f"--- p{page['page']} ---\n{t}\n")
out_path = Path(
    r"e:\Programming\Sites\LEX\development data\lecture-work\sections"
    r"\01_preparation_admission\_lec6_instr.txt"
)
out_path.write_text("\n".join(out), encoding="utf-8")
print("pages", len(out), "->", out_path)
