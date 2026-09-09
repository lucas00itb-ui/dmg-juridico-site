/* Automatic rotation resumes after touch/navigation; no persistent pause state. */
document.querySelectorAll('[data-carousel]').forEach((track) => {
  const items = [...track.children];
  if (items.length < 2) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frame = document.createElement('div');
  frame.className = 'dmg-carousel';
  frame.setAttribute('role', 'region');
  frame.setAttribute('aria-roledescription', 'carrossel');
  frame.setAttribute('aria-label', track.dataset.carousel);
  track.before(frame); frame.append(track);
  track.classList.add('dmg-track'); track.tabIndex = 0;
  track.setAttribute('aria-label', `${track.dataset.carousel}: use as setas para navegar`);
  const controls = document.createElement('div'); controls.className = 'dmg-controls';
  const count = document.createElement('span'); count.className = 'dmg-count';
  const button = (text, label) => {
    const el = document.createElement('button'); el.type = 'button';
    el.textContent = text; el.setAttribute('aria-label', label); return el;
  };
  const prev = button('←', 'Itens anteriores');
  const next = button('→', 'Próximos itens');
  controls.append(count, prev, next); frame.append(controls);
  let timer, touching = false;
  const interval = 2500;
  track.dataset.interval = String(interval);
  const step = () => items[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  const update = () => {
    const width = step(); if (!width) return;
    const first = Math.max(0, Math.round(track.scrollLeft / width));
    const shown = Math.max(1, Math.round((track.clientWidth + 16) / width));
    count.textContent = `${first + 1}–${Math.min(items.length, first + shown)} de ${items.length}`;
  };
  const move = (direction) => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    if (max < 2) return;
    let left = track.scrollLeft + direction * step();
    if (direction > 0 && track.scrollLeft >= max - 3) left = 0;
    if (direction < 0 && track.scrollLeft <= 3) left = max;
    track.scrollTo({left: Math.max(0, Math.min(left, max)), behavior: reduced.matches ? 'instant' : 'smooth'});
  };
  const start = () => {
    clearInterval(timer);
    if (document.hidden || reduced.matches) return;
    timer = setInterval(() => {
      if (touching) return;
      const rect = track.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) move(1);
    }, interval);
  };
  prev.onclick = () => { move(-1); start(); };
  next.onclick = () => { move(1); start(); };
  track.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); start();
  });
  track.addEventListener('pointerdown', () => { touching = true; });
  const release = () => { if (touching) { touching = false; start(); } };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', start);
  reduced.addEventListener('change', start);
  track.addEventListener('scroll', update, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  else window.addEventListener('resize', update);
  update(); start();
});
