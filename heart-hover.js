/* rmLv heart hover effect: black hearts float while hovering; click turns them red. */
(() => {
  if (window.__rmlvHeartHoverInstalled) return;
  window.__rmlvHeartHoverInstalled = true;

  const style = document.createElement('style');
  style.textContent = `
    .rmlv-heart-host { position: relative !important; overflow: visible !important; }
    .rmlv-hover-heart {
      position: absolute; z-index: 9999; pointer-events: none; user-select: none;
      color: #222; background: linear-gradient(135deg, #050505 0%, #343434 42%, #a6a6a6 72%, #171717 100%);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      font-family: Arial, sans-serif; font-size: var(--heart-size, 15px);
      line-height: 1; font-weight: 900; filter: drop-shadow(0 1px 1px rgba(255,255,255,.2));
      transform: translate(-50%, 0) scale(.55); opacity: 0;
      animation: rmlvHeartFloat var(--heart-duration, 1050ms) ease-out forwards;
    }
    .rmlv-hover-heart.is-red {
      background: none; color: #ef233c; -webkit-text-fill-color: #ef233c;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,.25));
    }
    @keyframes rmlvHeartFloat {
      0% { opacity: 0; transform: translate(-50%, 2px) scale(.45) rotate(-12deg); }
      14% { opacity: 1; transform: translate(-50%, -5px) scale(1.08) rotate(8deg); }
      100% { opacity: 0; transform: translate(calc(-50% + var(--heart-drift, 14px)), -42px) scale(.72) rotate(var(--heart-rotate, 18deg)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .rmlv-hover-heart { animation-duration: 450ms; }
    }
  `;
  document.head.appendChild(style);

  const selector = 'a[href], area[href], button, [role="button"], [role="link"], input[type="button"], input[type="submit"], input[type="reset"], summary, [onclick]';
  let active = null;

  function spawnHeart(el) {
    if (!el.isConnected) return;
    const heart = document.createElement('span');
    heart.className = 'rmlv-hover-heart' + (el.dataset.rmlvHeartClicked === '1' ? ' is-red' : '');
    heart.textContent = '♥';
    const rect = el.getBoundingClientRect();
    const edge = Math.random() < .5 ? 0 : rect.width;
    const x = Math.max(4, Math.min(rect.width - 4, edge + (Math.random() * 18 - 9)));
    const y = Math.max(0, rect.height * (Math.random() * .7 + .1));
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.setProperty('--heart-size', (11 + Math.random() * 10) + 'px');
    heart.style.setProperty('--heart-duration', (850 + Math.random() * 450) + 'ms');
    heart.style.setProperty('--heart-drift', (Math.random() * 34 - 17) + 'px');
    heart.style.setProperty('--heart-rotate', (Math.random() * 70 - 35) + 'deg');
    el.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }

  function stop() {
    if (!active) return;
    clearInterval(active.timer);
    active.el.dataset.rmlvHeartClicked = '0';
    active = null;
  }

  document.addEventListener('pointerover', event => {
    const el = event.target.closest?.(selector);
    if (!el || el.contains(event.relatedTarget)) return;
    if (active?.el === el) return;
    stop();
    el.classList.add('rmlv-heart-host');
    el.dataset.rmlvHeartClicked = '0';
    spawnHeart(el);
    active = { el, timer: setInterval(() => spawnHeart(el), 185) };
  });

  document.addEventListener('pointerout', event => {
    const el = event.target.closest?.(selector);
    if (!el || el.contains(event.relatedTarget)) return;
    if (active?.el === el) stop();
  });

  document.addEventListener('click', event => {
    const el = event.target.closest?.(selector);
    if (!el) return;
    el.classList.add('rmlv-heart-host');
    el.dataset.rmlvHeartClicked = '1';
    el.querySelectorAll('.rmlv-hover-heart').forEach(heart => heart.classList.add('is-red'));
  }, true);
})();
