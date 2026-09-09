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
  const makeButton = (text, label) => {
    const button = document.createElement('button'); button.type = 'button';
    button.textContent = text; button.setAttribute('aria-label', label); return button;
  };
  const prev = makeButton('←', 'Itens anteriores');
  const next = makeButton('→', 'Próximos itens');
  const pause = makeButton('Pausar', 'Pausar rotação automática'); pause.className = 'dmg-pause';
  controls.append(count, prev, next, pause); frame.append(controls);
  let paused = reduced.matches, hovered = false, visible = false, timer;
  const step = () => items[1].offsetLeft - items[0].offsetLeft;
  const update = () => {
    const first = Math.round(track.scrollLeft / step());
    const shown = Math.max(1, Math.round((track.clientWidth + 16) / step()));
    count.textContent = `${first + 1}–${Math.min(items.length, first + shown)} de ${items.length}`;
  };
  const move = (direction) => {
    const max = track.scrollWidth - track.clientWidth;
    let left = track.scrollLeft + direction * step();
    if (direction > 0 && track.scrollLeft >= max - 3) left = 0;
    if (direction < 0 && track.scrollLeft <= 3) left = max;
    track.scrollTo({left, behavior: reduced.matches ? 'instant' : 'smooth'});
  };
  const schedule = () => {
    clearInterval(timer);
    pause.textContent = paused ? 'Reproduzir' : 'Pausar';
    pause.setAttribute('aria-label', paused ? 'Iniciar rotação automática' : 'Pausar rotação automática');
    if (!paused && !hovered && visible && !document.hidden && !frame.contains(document.activeElement))
      timer = setInterval(() => move(1), Number(track.dataset.interval));
  };
  prev.onclick = () => { paused = true; move(-1); schedule(); };
  next.onclick = () => { paused = true; move(1); schedule(); };
  pause.onclick = () => { paused = !paused; schedule(); };
  track.addEventListener('keydown', (e) => {
    if (!['ArrowLeft','ArrowRight'].includes(e.key)) return;
    e.preventDefault(); paused = true; move(e.key === 'ArrowRight' ? 1 : -1); schedule();
  });
  track.addEventListener('pointerdown', () => { paused = true; schedule(); }, {passive:true});
  frame.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  frame.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  frame.addEventListener('focusin', schedule);
  frame.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { paused = reduced.matches; schedule(); });
  track.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(track);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold:.25}).observe(frame);
  update(); schedule();
});
