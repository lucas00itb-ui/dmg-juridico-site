from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
GESTOR_ORIGIN = "https://gestor.dmgjuridico.com.br/"


class ExternalPresentationRefs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "script":
            src = values.get("src", "")
            if src.startswith(GESTOR_ORIGIN):
                self.refs.append(("JavaScript", src))
        if tag == "link":
            rel = (values.get("rel") or "").lower().split()
            href = values.get("href", "")
            if "stylesheet" in rel and href.startswith(GESTOR_ORIGIN):
                self.refs.append(("CSS", href))


expected_cname = "dmgjuridico.com.br"
cname = (ROOT / "CNAME").read_text(encoding="utf-8").strip()
if cname != expected_cname:
    errors.append(f"CNAME inesperado: {cname!r}")

publications = (ROOT / "assets/js/publicacoes.js").read_text(encoding="utf-8")
expected_feed = "https://gestor.dmgjuridico.com.br/api/publicacoes/"
if expected_feed not in publications:
    errors.append("Publicações não aponta para o contrato público esperado do Gestor 360.")
if "AbortController" not in publications or "setTimeout" not in publications:
    errors.append("Publicações perdeu o timeout/fallback de indisponibilidade temporária.")
if ".catch(" not in publications or "Não foi possível carregar as publicações agora" not in publications:
    errors.append("Publicações perdeu o fallback visual quando a API do Gestor está indisponível.")

portal_link = (ROOT / "assets/js/portal-link.js").read_text(encoding="utf-8")
expected_portal = "https://gestor.dmgjuridico.com.br/cliente/entrar/"
if expected_portal not in portal_link:
    errors.append("Área do Cliente não aponta para a rota pública esperada do Gestor 360.")

# Links e redirecionamentos ao Gestor são permitidos.
# CSS e JavaScript do site devem permanecer locais, isolando a apresentação institucional.
for html in sorted(ROOT.rglob("*.html")):
    if ".git" in html.parts:
        continue
    parser = ExternalPresentationRefs()
    parser.feed(html.read_text(encoding="utf-8"))
    for kind, ref in parser.refs:
        errors.append(
            f"{html.relative_to(ROOT)}: carrega {kind} diretamente do Gestor 360 ({ref})"
        )

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("Integração isolada: site institucional usa API/link aprovados sem compartilhar CSS/JS com o Gestor 360.")
