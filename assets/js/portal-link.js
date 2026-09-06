(() => {
  const portalUrl = 'https://gestor.dmgjuridico.com.br/cliente/entrar/';
  document.querySelectorAll('a[href*="area-do-cliente"]').forEach((link) => {
    link.href = portalUrl;
    link.target = '_blank';
    link.rel = 'noopener';
  });
})();
