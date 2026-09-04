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

/* WhatsApp — identidade oficial nos botões de ícone em todas as páginas. */
const whatsappIconSvg = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M12.04 2C6.5 2 2 6.36 2 11.74c0 1.72.46 3.4 1.34 4.87L2 22l5.55-1.43a10.2 10.2 0 0 0 4.49 1.05h.01c5.54 0 10.04-4.36 10.04-9.74S17.58 2 12.04 2Zm0 17.98h-.01a8.55 8.55 0 0 1-4.36-1.17l-.31-.18-3.3.85.88-3.12-.2-.32a7.97 7.97 0 0 1-1.26-4.3c0-4.48 3.84-8.12 8.57-8.12 4.72 0 8.56 3.64 8.56 8.12 0 4.48-3.84 8.12-8.56 8.12Zm4.7-6.07c-.26-.12-1.53-.73-1.77-.81-.24-.09-.41-.12-.59.12-.17.24-.68.81-.83.98-.15.16-.3.18-.56.06-.26-.12-1.1-.39-2.09-1.24-.77-.67-1.29-1.5-1.44-1.75-.15-.24-.02-.37.11-.49.12-.11.26-.29.39-.43.13-.14.17-.24.26-.41.09-.16.04-.31-.02-.43-.06-.12-.59-1.38-.81-1.89-.21-.5-.43-.43-.59-.44h-.5c-.17 0-.46.06-.7.31-.24.24-.92.87-.92 2.12 0 1.25.94 2.46 1.07 2.63.13.16 1.84 2.72 4.46 3.81.62.26 1.11.41 1.49.52.63.19 1.2.16 1.65.1.5-.07 1.53-.61 1.75-1.19.22-.58.22-1.08.15-1.19-.06-.1-.24-.16-.5-.28Z"/>
  </svg>`;

if (!document.querySelector('style[data-dmg-whatsapp-brand]')) {
  const whatsappStyle = document.createElement('style');
  whatsappStyle.dataset.dmgWhatsappBrand = 'true';
  whatsappStyle.textContent = `
    a.whatsapp-brand-icon{
      background:#25D366 !important;
      color:#fff !important;
      border-color:#25D366 !important;
      box-shadow:0 10px 28px rgba(37,211,102,.24) !important;
    }
    a.whatsapp-brand-icon:hover,
    a.whatsapp-brand-icon:focus-visible{
      background:#1fbd5b !important;
      color:#fff !important;
      border-color:#1fbd5b !important;
      outline:none !important;
    }
    a.whatsapp-brand-icon svg{
      width:24px !important;
      height:24px !important;
      display:block !important;
    }
    a.whatsapp-float.whatsapp-brand-icon{
      border-radius:50% !important;
    }
    a.whatsapp-text-icon{
      display:inline-flex !important;
      align-items:center !important;
      justify-content:center !important;
      gap:10px !important;
    }
    a.whatsapp-text-icon .whatsapp-inline-icon{
      width:20px !important;
      height:20px !important;
      flex:0 0 20px !important;
      color:#25D366 !important;
      display:block !important;
    }
  `;
  document.head.appendChild(whatsappStyle);
}

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  const iconOnly = link.classList.contains('whatsapp-float') ||
    link.classList.contains('chat') ||
    (link.textContent.trim() === '' && link.querySelector('svg'));

  if (!iconOnly) return;

  link.classList.add('whatsapp-brand-icon');
  link.innerHTML = whatsappIconSvg;
  if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', 'Falar pelo WhatsApp');
  link.setAttribute('title', 'WhatsApp');
});

/* Botões textuais do WhatsApp: mantém a frase e adiciona o símbolo antes do texto. */
document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  const label = link.textContent.replace(/\s+/g, ' ').trim();
  if (!label.toLowerCase().includes('falar com a dmg')) return;
  if (link.querySelector('.whatsapp-inline-icon')) return;

  link.classList.add('whatsapp-text-icon');
  const icon = whatsappIconSvg.replace('<svg ', '<svg class="whatsapp-inline-icon" ');
  link.insertAdjacentHTML('afterbegin', icon);
});

/* Página LicitaPará: rótulo com pontuação correta. */
const licitaInfoEyebrow = document.querySelector('.lp-info .eyebrow');
if (licitaInfoEyebrow && licitaInfoEyebrow.textContent.trim().toLowerCase() === 'o que é o licitapará') {
  licitaInfoEyebrow.textContent = 'O que é o LicitaPará?';
}

/* Marca LicitaPará da HOME: arquivo externo leve, sem base64 e sem interferir na página específica. */
if (siteScript) {
  const scriptUrl = new URL(siteScript.src, document.baseURI);
  const rootUrl = scriptUrl.href.replace(/assets\/js\/site\.js(?:\?.*)?$/, '');

  document.querySelectorAll('.lp-signature').forEach((brand) => {
    brand.innerHTML = '';
    brand.removeAttribute('aria-hidden');
    brand.classList.add('lp-official-brand');
    const image = document.createElement('img');
    image.src = new URL('assets/images/licitapara-logo.svg', rootUrl).href;
    image.alt = 'LicitaPará — Inteligência em Licitações';
    image.className = 'lp-brand-image';
    brand.appendChild(image);
  });
}

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