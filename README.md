# DMG | Advogados Associados — Site institucional

Site institucional estático da DMG | Advogados Associados, preparado para publicação gratuita pelo GitHub Pages.

## Arquitetura

```text
GitHub (branch main)
        ↓
GitHub Pages
        ↓
dmgjuridico.com.br  ← domínio definitivo após validação
```

O Gestor Jurídico 360 permanece em repositório e infraestrutura separados. O site apenas direciona a Área do Cliente para o ambiente do Gestor.

## Estrutura

- `index.html` — página institucional principal;
- `assets/css/style.css` — identidade visual e responsividade;
- `assets/js/site.js` — menu mobile, acessibilidade e animações leves;
- `assets/images/` — retratos otimizados da equipe;
- `area-do-cliente/` — página intermediária do Portal do Cliente;
- `favicon.svg` e `site.webmanifest` — identidade no navegador/dispositivo;
- `robots.txt` e `sitemap.xml` — indexação;
- `google1b0cbc4ee144b506.html` — verificação do Google Search Console;
- `.nojekyll` — publicação estática direta pelo GitHub Pages.

## Organização do conteúdo

Menu principal:

`Início | Quem somos | Áreas de atuação | Área do cliente | Contato`

`Quem somos` reúne Escritório, Equipe e Localização/Atendimento. `Contato` reúne WhatsApp, Instagram e acesso ao cliente, reduzindo repetição de informações.

## Publicação

O GitHub Pages deve usar:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Cada alteração enviada à `main` gera uma nova publicação do site.

## Edições futuras

Mudanças pequenas podem ser feitas diretamente nos arquivos correspondentes. Para alterações maiores, recomenda-se criar uma branch, revisar a versão e só então integrar à `main`.

## Domínio personalizado

O domínio `dmgjuridico.com.br` só deve ser apontado para o GitHub Pages depois da validação completa da URL temporária do GitHub. Não alterar o DNS antes dessa etapa.

## Observação

O conteúdo do site é institucional e informativo. Informações de contato e dados profissionais devem ser mantidos atualizados e conferidos antes da publicação definitiva no domínio.
