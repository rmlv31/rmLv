/* rmLv heart hover effect: gradient hearts float from every clickable item; click turns them red. */
(() => {
  if (window.__rmlvHeartHoverInstalled) return;
  window.__rmlvHeartHoverInstalled = true;

  const style = document.createElement('style');
  style.textContent = `
    .rmlv-heart-layer { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; overflow: visible; }
    .rmlv-hover-heart {
      position: fixed; pointer-events: none; user-select: none;
      color: #222; background: linear-gradient(135deg, #050505 0%, #292929 35%, #777 68%, #c2c2c2 82%, #171717 100%);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      font-family: Arial, sans-serif; font-size: var(--heart-size, 15px);
      line-height: 1; font-weight: 900;
      filter: drop-shadow(0 1px 1px rgba(255,255,255,.22));
      transform: translate(-50%, 0) scale(.55); opacity: 0;
      animation: rmlvHeartFloat var(--heart-duration, 1050ms) ease-out forwards;
    }
    .rmlv-hover-heart.is-red {
      background: none; color: #ef233c; -webkit-text-fill-color: #ef233c;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,.3));
    }
    @keyframes rmlvHeartFloat {
      0% { opacity: 0; transform: translate(-50%, 2px) scale(.45) rotate(-12deg); }
      14% { opacity: 1; transform: translate(-50%, -5px) scale(1.08) rotate(8deg); }
      100% { opacity: 0; transform: translate(calc(-50% + var(--heart-drift, 14px)), -42px) scale(.72) rotate(var(--heart-rotate, 18deg)); }
    }
    @media (prefers-reduced-motion: reduce) { .rmlv-hover-heart { animation-duration: 450ms; } }
  `;
  document.head.appendChild(style);

  // Include native links/buttons, accessible controls, common clickable card patterns,
  // and elements explicitly marked with navigation/action attributes.
  const selector = [
    'a[href]', 'area[href]', 'button', '[role="button"]', '[role="link"]',
    'input[type="button"]', 'input[type="submit"]', 'input[type="reset"]',
    'summary', '[onclick]', '[data-href]', '[data-url]', '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const layer = document.createElement('div');
  layer.className = 'rmlv-heart-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.addEventListener('DOMContentLoaded', () => {
    if (!layer.isConnected) document.body.appendChild(layer);
  }, { once: true });
  if (document.body) document.body.appendChild(layer);

  let active = null;
  function spawnHeart(el) {
    if (!el || !el.isConnected) return;
    if (!layer.isConnected && document.body) document.body.appendChild(layer);
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) return;
    const heart = document.createElement('span');
    heart.className = 'rmlv-hover-heart' + (el.dataset.rmlvHeartClicked === '1' ? ' is-red' : '');
    heart.textContent = '♥';
    const side = Math.random() < .5 ? -1 : 1;
    const x = side < 0 ? rect.left + Math.random() * Math.min(18, rect.width * .25) : rect.right - Math.random() * Math.min(18, rect.width * .25);
    const y = rect.top + rect.height * (.18 + Math.random() * .64);
    heart.style.left = Math.max(2, Math.min(window.innerWidth - 2, x)) + 'px';
    heart.style.top = Math.max(2, Math.min(window.innerHeight - 2, y)) + 'px';
    heart.style.setProperty('--heart-size', (11 + Math.random() * 10) + 'px');
    heart.style.setProperty('--heart-duration', (850 + Math.random() * 450) + 'ms');
    heart.style.setProperty('--heart-drift', (Math.random() * 34 - 17) + 'px');
    heart.style.setProperty('--heart-rotate', (Math.random() * 70 - 35) + 'deg');
    layer.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
  function stop() {
    if (!active) return;
    clearInterval(active.timer);
    active = null;
  }
  function closestClickable(target) { return target instanceof Element ? target.closest(selector) : null; }

  document.addEventListener('pointerover', event => {
    const el = closestClickable(event.target);
    if (!el || el.contains(event.relatedTarget)) return;
    if (active?.el === el) return;
    stop();
    el.dataset.rmlvHeartClicked = '0';
    spawnHeart(el);
    active = { el, timer: setInterval(() => spawnHeart(el), 185) };
  });
  document.addEventListener('pointerout', event => {
    const el = closestClickable(event.target);
    if (!el || el.contains(event.relatedTarget)) return;
    if (active?.el === el) stop();
  });
  document.addEventListener('click', event => {
    const el = closestClickable(event.target);
    if (!el) return;
    el.dataset.rmlvHeartClicked = '1';
    el.querySelectorAll('.rmlv-hover-heart').forEach(heart => heart.classList.add('is-red'));
  }, true);
})();
