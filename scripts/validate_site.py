from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SKIP = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "#")
errors = []


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        for key in ("href", "src"):
            if values.get(key):
                self.refs.append(values[key])


for html in sorted(ROOT.rglob("*.html")):
    if ".git" in html.parts:
        continue
    content = html.read_text(encoding="utf-8")
    if re.search(r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b", content):
        errors.append(f"{html.relative_to(ROOT)}: contém CPF formatado")
    if "Página em construção" in content:
        errors.append(f"{html.relative_to(ROOT)}: contém aviso de construção")
    parser = References()
    parser.feed(content)
    for ref in parser.refs:
        if ref.startswith(SKIP) or "{{" in ref or "{%" in ref:
            continue
        path = unquote(urlsplit(ref).path)
        if not path:
            continue
        target = ROOT / path.lstrip("/") if path.startswith("/") else html.parent / path
        target = target.resolve()
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            errors.append(f"{html.relative_to(ROOT)}: referência ausente {ref}")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("Site validado: referências locais, páginas e dados públicos estão consistentes.")
