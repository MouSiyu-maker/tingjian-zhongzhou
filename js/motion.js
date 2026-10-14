/* ============================================================
   听见中轴 · 动效与手势
   参照“北京中轴线”官网手机端：整屏翻页、手势进入、渐进点亮、轮播联动。
   - Motion.go(type, fn)   页面转场（up/down/left/right/fade/none），旧页克隆为“幽灵层”滑出
   - Motion.after(r, view) 渲染后：滚动入场、手势绑定
   - Motion.tabInk(tab)    底部标签滑动指示
   全部使用 Web Animations API，无依赖；prefers-reduced-motion 下自动降级为直接切换。
   ============================================================ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const html = document.documentElement;
  const EASE = 'cubic-bezier(.22,.7,.2,1)';

  /* ---------- 页面转场 ---------- */
  let running = null;
  function finish() { if (running) { running.end(); running = null; } }

  function go(type, fn) {
    const v = $('#view'), app = $('#app');
    finish();
    if (type === 'none' || reduce.matches || !v.animate) { fn(); return; }

    const r = v.getBoundingClientRect(), vh = window.innerHeight, vw = r.width;
    const ghost = v.cloneNode(true);
    ghost.removeAttribute('id');
    $$('[id]', ghost).forEach((e) => e.removeAttribute('id'));
    ghost.setAttribute('aria-hidden', 'true'); ghost.setAttribute('inert', '');
    $$('a, button', ghost).forEach((e) => { e.tabIndex = -1; });
    const above = type === 'down' || type === 'right';                 // 旧页在上（向外滑出）
    Object.assign(ghost.style, {
      position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px',
      margin: '0', overflow: 'hidden', pointerEvents: 'none', background: '#F6EFDB', zIndex: above ? '25' : '20'
    });
    app.appendChild(ghost);

    fn();                                                               // 渲染新页（含回到顶部）

    Object.assign(v.style, { position: 'relative', background: '#F6EFDB', zIndex: above ? '10' : '22' });
    html.style.overflow = 'hidden';

    const K = {
      up:    { i: [{ transform: `translateY(${vh}px)` }, { transform: 'none' }], o: [{ transform: 'none', opacity: 1 }, { transform: `translateY(${-vh * .28}px)`, opacity: .5 }] },
      down:  { i: [{ transform: `translateY(${-vh * .28}px)`, opacity: .5 }, { transform: 'none', opacity: 1 }], o: [{ transform: 'none' }, { transform: `translateY(${vh}px)` }] },
      left:  { i: [{ transform: `translateX(${vw}px)` }, { transform: 'none' }], o: [{ transform: 'none', opacity: 1 }, { transform: `translateX(${-vw * .25}px)`, opacity: .5 }] },
      right: { i: [{ transform: `translateX(${-vw * .25}px)`, opacity: .5 }, { transform: 'none', opacity: 1 }], o: [{ transform: 'none' }, { transform: `translateX(${vw}px)` }] },
      fade:  { i: [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], o: [{ opacity: 1 }, { opacity: 0 }] }
    }[type] || { i: [{ opacity: 0 }, { opacity: 1 }], o: [{ opacity: 1 }, { opacity: 0 }] };
    const dur = type === 'fade' ? 240 : 380;
    const a1 = v.animate(K.i, { duration: dur, easing: EASE, fill: 'both' });
    const a2 = ghost.animate(K.o, { duration: dur, easing: EASE, fill: 'both' });

    let done = false;
    const end = () => {
      if (done) return; done = true;
      a1.cancel(); a2.cancel(); ghost.remove();
      v.style.position = ''; v.style.background = ''; v.style.zIndex = '';
      html.style.overflow = '';
      if (running && running.end === end) running = null;
    };
    a1.onfinish = end;
    running = { end };
    setTimeout(end, dur + 120);                                         // 兜底
  }

  /* ---------- 滚动入场 ---------- */
  const RV = '.card, .step, .trk, .ev, .related, .blk, .quote, .seg-head, .seg-note, .list-seg > header, .gallery figure, .cast-row figure, .sleep, .mean details, .pager a, .player, .au-deck, .au-sec, .au-pager a, .creed, .vids > *, .about dl > *, .end-cap, .grp-h, .mainchar, .pal, .ipfig, .hub-c, .cd-hd, .cd-next';
  let rvIOs = [];
  function reveal(scope, keep) {
    if (!keep) { rvIOs.forEach((o) => o.disconnect()); rvIOs = []; }
    if (reduce.matches || !('IntersectionObserver' in window)) return;
    const els = $$(RV, scope).filter((e) => !e.closest('.smap, .cf, .evc, .ipx, .mu'));
    let batch = 0, timer = 0;
    const rvIO = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target;
        t.style.setProperty('--d', Math.min(batch++, 5) * 60 + 'ms');
        t.classList.add('in');
        rvIO.unobserve(t);
      });
      clearTimeout(timer); timer = setTimeout(() => { batch = 0; }, 90);
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    rvIOs.push(rvIO);
    els.forEach((e) => { e.classList.add('rv'); rvIO.observe(e); });
  }

  /* ---------- 手势 ---------- */
  let cfg = null;                                                       // 当前页面的手势回调
  let sx = 0, sy = 0, st = 0, skip = false;
  const NOSWIPE = '.au-row, .au-wave, .cf-track, .smap-sc, .filters, .cast-row, .tbl, .scrub, .wave, input, textarea, .gallery, .ip-track, .gal-row, .mu, .lb, .exb-marq';
  document.addEventListener('touchstart', (e) => {
    if (!cfg || e.touches.length !== 1) { skip = true; return; }
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now();
    skip = !!(e.target.closest && e.target.closest(NOSWIPE));
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!cfg || skip) return;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy, ax = Math.abs(dx), ay = Math.abs(dy);
    if (Date.now() - st > 700) return;
    if (cfg.x && ax > 64 && ax > ay * 1.6) { const f = dx < 0 ? cfg.x.left : cfg.x.right; if (f) f(); }
    else if (cfg.y && ay > 56 && ay > ax * 1.4 && dy < 0 && cfg.y.up) cfg.y.up();
  }, { passive: true });
  let wheelAt = 0;
  document.addEventListener('wheel', (e) => {
    if (!cfg || !cfg.y || !cfg.y.up || e.deltaY < 24 || Date.now() - wheelAt < 900) return;
    wheelAt = Date.now(); cfg.y.up();
  }, { passive: true });
  document.addEventListener('keydown', (e) => {
    if (!cfg) return;
    if (cfg.y && cfg.y.up && e.key === 'ArrowDown') cfg.y.up();
    if (cfg.x && e.key === 'ArrowLeft' && cfg.x.right) cfg.x.right();
    if (cfg.x && e.key === 'ArrowRight' && cfg.x.left) cfg.x.left();
  });

  function after(r, view) {
    reveal(view);
    cfg = null;
    if (r === 'sound') {                                                // 声音详情：左右滑动 = 往北 / 往南
      const nx = () => { const a = $('.pager a.nx:not(.off)'); if (a) location.hash = a.getAttribute('href'); };
      const pv = () => { const a = $('.pager a.pv:not(.off)'); if (a) location.hash = a.getAttribute('href'); };
      cfg = { x: { left: nx, right: pv } };
    } else if (r === 'audio') {                                         // 声音页：左右滑动 = 往北 / 往南
      const nx = () => { const a = $('.au-pager a.nx:not(.off)'); if (a) location.hash = a.getAttribute('href'); };
      const pv = () => { const a = $('.au-pager a.pv:not(.off)'); if (a) location.hash = a.getAttribute('href'); };
      cfg = { x: { left: nx, right: pv } };
    } else if (r === 'create') {                                        // 创化：左右滑动 = 切换分页
      const go2 = (d) => () => {
        const tabs = $$('.cd-sw a'), i = tabs.findIndex((a) => a.classList.contains('is-on')), n = tabs[i + d];
        if (n) location.hash = n.getAttribute('href');
      };
      cfg = $('.cd-sw') ? { x: { left: go2(1), right: go2(-1) } } : null;
    }
  }

  /* ---------- 底部标签滑动指示 ---------- */
  const TABS = ['home', 'dig', 'explain', 'create', 'show'];
  function tabInk(tab) {
    const el = $('#tabs-ink'); if (!el) return;
    const i = TABS.indexOf(tab);
    el.style.opacity = i < 0 ? '0' : '1';
    if (i >= 0) el.style.setProperty('--i', i);
  }

  window.Motion = { go, after, tabInk, reduce, reveal };
})();
