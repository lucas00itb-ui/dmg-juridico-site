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
