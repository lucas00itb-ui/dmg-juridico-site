from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

expected_cname = "dmgjuridico.com.br"
cname = (ROOT / "CNAME").read_text(encoding="utf-8").strip()
if cname != expected_cname:
    errors.append(f"CNAME inesperado: {cname!r}")

publications = (ROOT / "assets/js/publicacoes.js").read_text(encoding="utf-8")
expected_feed = 'https://gestor.dmgjuridico.com.br/api/publicacoes/'
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

# O site institucional pode consumir API e links do Gestor, mas nunca CSS/JS do Gestor.
# Assim, um deploy do Gestor não consegue trocar a apresentação visual do site.
for html in sorted(ROOT.rglob("*.html")):
    if ".git" in html.parts:
        continue
    content = html.read_text(encoding="utf-8")
    if re.search(r'<script[^>]+src=["\']https://gestor\.dmgjuridico\.com\.br/', content, re.I):
        errors.append(f"{html.relative_to(ROOT)}: carrega JavaScript diretamente do Gestor 360")
    if re.search(r'<link[^>]+href=["\']https://gestor\.dmgjuridico\.com\.br/', content, re.I):
        errors.append(f"{html.relative_to(ROOT)}: carrega CSS/recurso de apresentação diretamente do Gestor 360")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("Integração isolada: site institucional usa apenas API/link aprovados do Gestor 360.")
