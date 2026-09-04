const siteScript = document.querySelector('script[src*="assets/js/site.js"]');
if (siteScript) {
  const scriptUrl = new URL(siteScript.src, document.baseURI);
  const rootUrl = scriptUrl.href.replace(/assets\/js\/site\.js(?:\?.*)?$/, '');

  if (!document.querySelector('link[data-dmg-final-tuning]')) {
    const finalTuning = document.createElement('link');
    finalTuning.rel = 'stylesheet';
    finalTuning.href = new URL('assets/css/final-tuning.css', rootUrl).href;
    finalTuning.dataset.dmgFinalTuning = 'true';
    document.head.appendChild(finalTuning);
  }
}

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

/* Ordem institucional aprovada: ... Áreas de atuação | Contato | LicitaPará */
if (menu) {
  const menuLinks = Array.from(menu.querySelectorAll('a'));
  const licitaLink = menuLinks.find((link) => link.classList.contains('external-nav') || link.textContent.trim() === 'LicitaPará');
  const contactLink = menuLinks.find((link) => link.textContent.trim() === 'Contato');
  if (licitaLink && contactLink && contactLink.nextElementSibling !== licitaLink) {
    menu.insertBefore(contactLink, licitaLink);
  }
}

function closeMenu() {
  if (!menuButton || !menu) return;
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });
}

const year = document.querySelector('#ano');
if (year) year.textContent = String(new Date().getFullYear());

/* Identidade visual fornecida pelo usuário: mapa do Pará + LicitaPará + slogan */
const licitaParaBrand = 'data:image/png;base64,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';

document.querySelectorAll('.lp-signature, .lp-page-mark').forEach((brand) => {
  brand.innerHTML = '';
  brand.removeAttribute('aria-hidden');
  brand.classList.add('lp-official-brand');
  const image = document.createElement('img');
  image.src = licitaParaBrand;
  image.alt = 'LicitaPará — Inteligência em Licitações';
  image.className = brand.classList.contains('lp-page-mark') ? 'lp-page-brand-image' : 'lp-brand-image';
  brand.appendChild(image);
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const officeValues = document.querySelectorAll('.office-value');
if (officeValues.length) {
  const activateOfficeValue = (current) => {
    officeValues.forEach((item) => item.classList.toggle('is-active', item === current));
  };

  officeValues.forEach((item) => {
    item.addEventListener('click', () => activateOfficeValue(item));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateOfficeValue(item);
      }
    });
  });
}

/*
 * O menu e o bloco da home devem apresentar primeiro a página institucional
 * da DMG sobre o LicitaPará. O redirecionamento externo fica apenas dentro
 * dessa página, após a explicação da parceria e da atuação jurídica.
 */
if (siteScript) {
  const scriptUrl = new URL(siteScript.src, document.baseURI);
  const rootUrl = scriptUrl.href.replace(/assets\/js\/site\.js(?:\?.*)?$/, '');
  const internalLicitaUrl = new URL('licitapara/', rootUrl).href;
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const licitaPath = new URL(internalLicitaUrl).pathname.replace(/\/+$/, '');

  if (currentPath !== licitaPath) {
    document.querySelectorAll('.external-nav, .licita-footer, .licitapara-link').forEach((link) => {
      if (link instanceof HTMLAnchorElement && link.href.includes('licitapara.com.br')) {
        link.href = internalLicitaUrl;
        link.removeAttribute('target');
        link.removeAttribute('rel');
        link.setAttribute('aria-label', 'Conhecer a parceria DMG e LicitaPará');
      }
    });
  }
}
