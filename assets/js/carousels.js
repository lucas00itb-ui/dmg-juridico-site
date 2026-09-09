/* DMG editorial carousel: a featured card with quiet neighboring previews. */
document.querySelectorAll('[data-carousel]').forEach((track) => {
  const items = [...track.children];
  if (items.length < 2) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frame = document.createElement('div');
  frame.className = 'dmg-carousel dmg-featured';
  frame.setAttribute('role','region');
  frame.setAttribute('aria-roledescription','carrossel');
  frame.setAttribute('aria-label',track.dataset.carousel);
  track.before(frame); frame.append(track);
  track.classList.add('dmg-track'); track.tabIndex = 0;
  track.setAttribute('aria-label',`${track.dataset.carousel}: use as setas para navegar`);
  const controls=document.createElement('div'); controls.className='dmg-controls';
  const make=(text,label)=>{const b=document.createElement('button'); b.type='button';b.textContent=text;b.setAttribute('aria-label',label);return b;};
  const prev=make('←','Item anterior'), next=make('→','Próximo item');
  const dots=document.createElement('div');dots.className='dmg-dots';
  const buttons=items.map((item,i)=>{const b=make('',`Mostrar ${item.querySelector('h2,h3')?.textContent || `item ${i+1}`}`);dots.append(b);return b;});
  controls.append(prev,dots,next);frame.append(controls);
  let active=0,timer,startX=null;
  const interval=1500;track.dataset.interval=String(interval);
  const render=()=>{
    items.forEach((item,i)=>{
      let pos=(i-active+items.length)%items.length;
      if(pos===items.length-1)pos=-1;
      item.classList.toggle('is-current',pos===0);
      item.classList.toggle('is-before',pos===-1);
      item.classList.toggle('is-after',pos===1);
      item.classList.toggle('is-away',Math.abs(pos)>1);
      item.setAttribute('aria-hidden',String(pos!==0));item.inert=pos!==0;
      buttons[i].setAttribute('aria-current',String(pos===0));
    });
  };
  const move=(d)=>{active=(active+d+items.length)%items.length;render();};
  const start=()=>{
    clearInterval(timer);if(document.hidden||reduced.matches)return;
    timer=setInterval(()=>{const r=track.getBoundingClientRect();if(startX===null&&r.bottom>0&&r.top<window.innerHeight)move(1);},interval);
  };
  prev.onclick=()=>{move(-1);start();};next.onclick=()=>{move(1);start();};
  buttons.forEach((b,i)=>b.onclick=()=>{active=i;render();start();});
  track.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();move(e.key==='ArrowRight'?1:-1);start();});
  track.addEventListener('pointerdown',e=>{startX=e.clientX;});
  window.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)>40)move(dx<0?1:-1);start();});
  const release=()=>{startX=null;start();};window.addEventListener('pointercancel',release);window.addEventListener('blur',release);
  document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);
  render();start();
});
