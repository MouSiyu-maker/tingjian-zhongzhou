/* ============================================================
   听见中轴 · 线上博物馆  视图与路由
   路由：#/home #/dig #/explain #/sound/NN #/create[/music|ip|events[/sleep|script|gen]] #/show
   ============================================================ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = (t) => String(t || '').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
  const pad = (n) => String(n).padStart(2, '0');
  const IMG = 'assets/img/';
  /* GitHub Pages 不展开 LFS（只会下发指针文件），线上改走 media 域名 */
  const VIDEO = (name) => ((location.hostname || '').endsWith('github.io')
    ? `https://media.githubusercontent.com/media/MouSiyu-maker/tingjian-zhongzhou/main/assets/video/${name}`
    : `assets/video/${name}`);

  const PLAY = '<svg class="i-play" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z"/></svg><svg class="i-pause" viewBox="0 0 16 16"><path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z"/></svg>';
  const playBtn = (key, cls = '') => `<button class="pbtn ${cls}" type="button" data-play="${key}" aria-label="播放 / 暂停">${PLAY}</button>`;

  /* ---------- 数据整理 ---------- */
  const SEG = {}; SEGMENTS.forEach((s) => { SEG[s.id] = s; });
  const TEXT = window.SOUND_TEXT || {};
  SOUNDS.forEach((s) => { s.id = pad(s.no); s.key = 's' + s.id; s.text = TEXT[s.no] || {}; });
  const byNo = (n) => SOUNDS.find((s) => s.no === +n);
  const sortKey = (s) => s.no;
  const segSounds = (id) => SOUNDS.filter((s) => s.seg === id).sort((a, b) => sortKey(a) - sortKey(b));
  const ORDER = SEGMENTS.flatMap((g) => segSounds(g.id));          // 页面顺序：由南向北
  const TRACK_KEYS = TRACKS.map((t) => t.id);

  /* 音频扩展名：多数为 mp3；桌面源中 s10/s13–s15 为 m4a */
  const AUDIO_EXT = { s10: 'm4a', s13: 'm4a', s14: 'm4a', s15: 'm4a' };
  const audioSrc = (key) => `assets/audio/${key}.${AUDIO_EXT[key] || 'mp3'}`;
  Player.register(SOUNDS.map((s) => ({ key: s.key, title: s.name, sub: `${SEG[s.seg].name} · ${s.place}`, href: `#/sound/${s.id}`, src: audioSrc(s.key), dur: 30 })));
  Player.register(TRACKS.map((t) => ({ key: t.id, title: t.title, sub: `二创音乐 · ${SEG[t.seg].name}`, href: '#/create/music', src: audioSrc(t.id), dur: t.dur })));

  const seal = (lv) => `<span class="seal ${lv.kind}">${esc(lv.text)}</span>`;
  const ph = (label, ratio = '16/9', cls = '') => `<div class="ph ${cls}" style="aspect-ratio:${ratio}"><span>${esc(label)}</span><em>待导入</em></div>`;
  const phTag = '<span class="tag-ph">待补</span>';
  /* 景点照片：assets/img/places/pNN.jpg，缺失时自动回退为占位 */
  const photo = (s, cls = '') => `<div class="pic ${cls}"><span class="pic-ph" aria-hidden="true"><b>${esc(s.place)}</b><em>照片待导入</em></span><img src="${IMG}places/p${pad(s.no)}.jpg" alt="${esc(s.place)}" onerror="this.remove()"></div>`;
  /* 声景长卷：各声音在金色天际线上的位置（0 = 最南，1 = 最北） */
  const POS = { 1: .06, 2: .14, 3: .21, 4: .28, 5: .35, 6: .42, 7: .48, 8: .54, 9: .60, 10: .66, 11: .72, 12: .78, 13: .85, 14: .91, 15: .97 };
  /* 调研图片张数：仅列出有实图的声音（no → 张数）；无条目则整块不展示 */
  const SURVEY = { 1: 4, 9: 4, 11: 4 };
  const BARW = [.26, .24, .18, .14, .18];                 // 滑动条各段的显示宽度（与 SEGSPAN 分段一一对应）
  const SEGSPAN = [['south', 0, .31, '南段'], ['midSouth', .31, .57, '中段南部'], ['midNorth', .57, .69, '中段北部'], ['north', .69, .82, '北段'], ['newNorth', .82, 1, '新北段']];

  /* ---------- 视图 ---------- */
  function home() {
    const P = window.PROJECT_TEXT;
    const steps = [
      ['挖', '挖掘', '沿中轴“四段一新”，采集十五种声音', '#/dig'],
      ['阐', '阐释', '从“听见”到“听懂”，把声音转译为公众可读的知识', '#/explain'],
      ['创', '创化', '六大类创化成果：二创音乐 · IP 与文创 · 三大场景活动', '#/create'],
      ['传', '传播', '展览、音乐厅与社区，让成果在真实场景中持续发生价值', '#/show']
    ].map((s) => `<a class="step" href="${s[3]}"><span class="c">${s[0]}</span><span><b>${s[1]}</b><small>${s[2]}</small></span><span class="ar">›</span></a>`).join('');
    const meaning = P.meaning.map((m) => `<details><summary>${esc(m.k)}</summary><div>${paras(m.t)}</div></details>`).join('');
    const B = P.introBrief;
    LB.length = 0;
    LB.push({ src: IMG + 'mindmap.jpg', name: '思维导图' });
    return `
    <div class="home">
    <div class="home-map" aria-hidden="true">
      <i id="home-map"></i>
      <div class="mrail">${HOME_STOPS.map(() => '<u></u>').join('')}</div>
    </div>
    <div class="home-in">
    <section class="hero">
      <div class="en">Sound Scape Intelligent Creation Workshop</div>
      <h1>听见中轴</h1>
      <div class="sub">声景智创工作坊</div>
      <div class="flow"><span>挖掘</span><span>阐释</span><span>创化</span><span>传播</span></div>
    </section>

    <section class="intro">
      <div class="kicker">工作坊项目简介</div>
      <p class="body intro-lead">${esc(B.lead)}</p>
      <div class="intro-fold" id="intro-fold"><div class="intro-more">${B.more.map((t) => `<p class="body">${esc(t)}</p>`).join('')}</div></div>
      <button type="button" class="intro-tg" id="intro-tg" aria-expanded="false" aria-controls="intro-fold"><span class="o">展开全文</span><span class="c">收起</span><i></i></button>
    </section>

    <div class="gap" aria-hidden="true"></div>
    <div class="steps">${steps}</div>

    <div class="gap" aria-hidden="true"></div>
    <section class="sec">
      <div class="kicker">思维导图展示</div>
      <figure class="mm" data-lb="0" role="button" tabindex="0" aria-label="放大查看思维导图"><img src="${IMG}mindmap.jpg" alt="“听见中轴”声景智创工作坊思维导图" loading="lazy" decoding="async"><span class="mm-z">点击放大</span></figure>
    </section>

    <div class="gap" aria-hidden="true"></div>
    <section class="sec">
      <div class="kicker">纪实视频展示</div>
      <div class="vid" id="vid"><button type="button" class="vid-play" id="vid-play" aria-label="播放工作坊纪实视频"><img src="assets/video/workshop-poster.jpg" alt="" loading="lazy" decoding="async"><i></i><span>工作坊纪实视频<small>点击播放 · 约 7 分 51 秒</small></span></button></div>
    </section>

    <div class="gap" aria-hidden="true"></div>
    <section class="sec">
      <div class="kicker">项目意义</div>
      <div class="mean">${meaning}</div>
      <p class="body creed-q">${esc(P.creed)}</p>
    </section>

    <div class="home-end">
      <div class="strip"><img src="${IMG}skyline.png" alt=""></div>
      ${footer()}
    </div>
    </div>
    </div>`;
  }

  /* 序：背景地图“镜头”——随滚动由北向南推移 / 缩放；简介展开 / 收起
     地图坐标均为占整图的比例（x 自西向东，y 自北向南） */
  const HOME_ASPECT = 3507 / 1800;
  const HOME_ZMAX = 2.4;
  const HOME_STOPS = [[.50, .25, 2.2], [.52, .31, 2.4], [.52, .43, 2.2], [.53, .57, 2.4], [.54, .71, 2.2], [.64, .86, 2.0]];
  function initHome(sig) {
    const map = $('#home-map'), box = map && map.parentElement;
    if (map) {
      const dots = $$('.mrail u', box);
      const still = Motion.reduce.matches;
      let vw = 0, vh = 0, W = 0, H = 0, cur = -1, tgt = 0, raf = 0;
      const size = () => {
        vw = box.clientWidth; vh = box.clientHeight; W = vw * HOME_ZMAX; H = W * HOME_ASPECT;
        map.style.width = W + 'px'; map.style.height = H + 'px';
      };
      const ease = (t) => t * t * (3 - 2 * t);
      const draw = (p) => {
        const n = HOME_STOPS.length - 1, f = Math.min(n - 1e-6, Math.max(0, p * n)), i = Math.floor(f), t = ease(f - i);
        const a = HOME_STOPS[i], b = HOME_STOPS[i + 1];
        const fx = a[0] + (b[0] - a[0]) * t, fy = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t;
        const k = z / HOME_ZMAX, Wk = W * k, Hk = H * k;
        const tx = Math.min(0, Math.max(vw - Wk, vw / 2 - fx * Wk));
        const ty = Math.min(0, Math.max(vh - Hk, vh / 2 - fy * Hk));
        map.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${k.toFixed(4)})`;
        const on = Math.round(p * n);
        dots.forEach((d, j) => d.classList.toggle('is-on', j === on));
      };
      const loop = () => {
        raf = 0;
        cur = still ? tgt : cur + (tgt - cur) * 0.16;
        if (Math.abs(tgt - cur) < 0.0004) cur = tgt; else raf = requestAnimationFrame(loop);
        draw(cur);
      };
      const upd = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        tgt = Math.min(1, Math.max(0, scrollY / max));
        if (cur < 0) cur = tgt;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      size(); upd();
      addEventListener('scroll', upd, { passive: true, signal: sig });
      addEventListener('resize', () => { size(); upd(); }, { signal: sig });
      sig.addEventListener('abort', () => { if (raf) cancelAnimationFrame(raf); });
    }
    initVideo(sig);
    const tg = $('#intro-tg'), fold = $('#intro-fold');
    if (tg && fold) {
      tg.addEventListener('click', () => {
        const open = !fold.classList.contains('is-open');
        fold.classList.toggle('is-open', open);
        tg.classList.toggle('is-open', open);
        tg.setAttribute('aria-expanded', String(open));
        if (!open) {
          const top = $('.intro').getBoundingClientRect().top;
          if (top < 60) window.scrollBy({ top: top - 70, behavior: Motion.reduce.matches ? 'auto' : 'smooth' });
        }
      }, { signal: sig });
    }
  }

  /* 纪实视频：点击才创建 <video>，页面加载时不请求视频；离开视野 / 离开页面即暂停并释放，避免占用带宽与解码 */
  function initVideo(sig) {
    const box = $('#vid'), btn = $('#vid-play');
    if (!box || !btn) return;
    let v = null, io = null;
    const release = () => {
      if (io) { io.disconnect(); io = null; }
      if (v) { try { v.pause(); } catch (e) { /* noop */ } v.removeAttribute('src'); try { v.load(); } catch (e) { /* noop */ } v = null; }
    };
    btn.addEventListener('click', () => {
      Player.pause();
      v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.preload = 'metadata'; v.setAttribute('playsinline', '');
      v.poster = 'assets/video/workshop-poster.jpg';
      v.setAttribute('aria-label', '“听见中轴”工作坊纪实视频');
      v.src = VIDEO('workshop.mp4');
      v.addEventListener('play', () => Player.pause());
      v.addEventListener('error', () => { release(); box.innerHTML = '<div class="vid-err">视频暂时无法加载，请稍后再试</div>'; });
      box.replaceChildren(v);
      const pr = v.play(); if (pr && pr.catch) pr.catch(() => { /* 需要用户手动点播放 */ });
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver((en) => { if (v && !en[0].isIntersecting && !v.paused) v.pause(); }, { threshold: 0.15 });
        io.observe(box);
      }
    }, { signal: sig });
    sig.addEventListener('abort', release);
  }

  function nodeHtml(s) {
    const seg = SEG[s.seg];
    return `
    <div class="node ${s.deep ? 'deep' : ''} ${s.placeholder ? 'is-ph' : ''}">
      <span class="mk">${pad(s.no)}</span>
      <div class="card ${s.placeholder ? '' : 'has-pic'}" role="link" tabindex="0" data-go="#/sound/${s.id}">
        ${s.placeholder ? '' : photo(s, 'card-pic')}
        <div class="row">
          <div class="tx">
            <div class="nm">${esc(s.name)}</div>
            <div class="pl">${esc(s.place)}</div>
            <div class="mt">${seal(s.level)}<span class="chip">${esc(s.type)}</span>${s.deep ? '<span class="chip deep">深度阐释</span>' : ''}</div>
          </div>
          ${playBtn(s.key)}
        </div>
      </div>
    </div>`;
  }

  function scrollMap() {
    const list = SOUNDS.filter((s) => !s.placeholder && POS[s.no] != null);
    const pins = list.map((s) => {
      const x = (POS[s.no] * 100).toFixed(2) + '%';
      return `<div class="pin" data-no="${s.id}" data-pos="${POS[s.no]}" style="left:${x}">
        <button class="pin-tag" type="button" data-pin="${s.id}" aria-label="${esc(s.name)}"><span>${esc(s.name)}</span></button>
        <i class="pin-line"></i>
        <button class="pin-pic" type="button" data-pin="${s.id}" aria-label="查看 ${esc(s.name)}">${photo(s)}</button>
        <small>${esc(s.place.split(/ · | — /)[0])}</small>
      </div>`;
    }).join('');
    const bar = SEGSPAN.map(([id, a, b, n], i) => `<div class="sb" data-seg="${id}" style="flex:${BARW[i]}"><i class="tr"><u></u></i><span>${n}</span></div>`).join('');
    return `
    <section class="smap" aria-label="声景长卷">
      <div class="smap-vw">
        <div class="smap-sc" id="smap">
          <div class="smap-in">
            <img class="strip base" src="${IMG}skyline-scroll.png" alt="中轴沿线建筑与乐器剪影">
            <img class="strip lit" src="${IMG}skyline-scroll.png" alt="" aria-hidden="true">
            ${pins}
          </div>
        </div>
      </div>
      <div class="sbar" id="sbar" role="slider" tabindex="0" aria-label="长卷位置，左右拖动" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="南段">
        <div class="sb-row">${bar}<b class="sb-th" id="sb-th"></b></div>
      </div>
    </section>
    <div class="pincard" id="pincard" aria-live="polite"><div class="pc-in" id="pincard-in"></div><button type="button" class="pc-x" data-pc-close aria-label="关闭">×</button></div>`;
  }

  /* 通用折叠：展开 / 收起（按钮在正文下方） */
  const fold = (id, label, html) => `<div class="intro-fold" id="${id}"><div class="intro-more">${html}</div></div><button type="button" class="intro-tg" data-fold="${id}" aria-expanded="false" aria-controls="${id}"><span class="o">${label}</span><span class="c">收起</span><i></i></button>`;

  function dig() {
    const full = window.PROJECT_TEXT.dig;
    const brief = full.slice(0, 40).replace(/[，、；：]$/, '') + '…';
    return `
    <div class="dig-page" id="dig-page">
      <section class="pagehead compact dig-head" data-no="01">
        <div class="ph-row"><h1 class="h1">中轴声景长卷</h1>
          <button type="button" class="smap-go" id="smap-go" aria-label="沿中轴自动行进"><i></i><b>沿线行进</b></button></div>
        <p class="dig-lead" id="dig-lead">${esc(brief)}<button type="button" class="dig-more" data-dig-open aria-expanded="false" aria-controls="dig-ov">展开<i></i></button></p>
      </section>
      ${scrollMap()}
      <div class="dig-ov" id="dig-ov" role="region" aria-label="挖掘的方法与过程" aria-hidden="true" data-dig-close>
        <div class="ov-body"><p>${esc(full)}</p><button type="button" class="dig-less" data-dig-close>收起<i></i></button></div>
      </div>
    </div>`;
  }

  function digOv(on) {
    const ov = $('#dig-ov'), lead = $('#dig-lead'); if (!ov) return;
    if (on) { ov.style.top = Math.max(0, lead.getBoundingClientRect().top - ov.parentElement.getBoundingClientRect().top - 6) + 'px'; }
    ov.classList.toggle('is-open', on);
    ov.setAttribute('aria-hidden', !on);
    const b = $('.dig-more'); if (b) b.setAttribute('aria-expanded', on);
  }

  /* 分段浏览（阐释 · 列表）：沿轴线由南向北排布，按声音单元分段 */
  function segList() {
    const segs = SEGMENTS.map((g) => {
      const list = segSounds(g.id);
      if (!list.length) return '';
      return `
      <section class="seg" id="seg-${g.id}" data-seg="${g.id}" data-c="${g.color}">
        <div class="seg-head">
          <i class="dia"></i>
          <div><div class="nm">${esc(g.name)}</div><div class="tg">${esc(g.tag)}</div><div class="rg">${esc(g.range)}</div></div>
          <img src="${IMG}ip-char-${g.mascot}.png" alt="">
        </div>
        <p class="seg-note">${esc(g.note)}</p>
        ${list.map(nodeHtml).join('')}
      </section>`;
    }).join('');
    const nav = SEGMENTS.map((g, i) => `<button type="button" class="${i === 0 ? 'is-on' : ''}" data-jump="seg-${g.id}">${esc(g.name)}</button>`).join('');
    return `<nav class="segbar" id="segbar" aria-label="分段跳转">${nav}</nav>
    <div class="ex-scroll" id="ex-scroll"><div class="axis">${segs}</div></div>`;
  }

  const exBody = () => (exMode === 'card' ? carousel() : segList());
  function explain() {
    const full = window.PROJECT_TEXT.explain;
    const brief = full.slice(0, 40).replace(/[，、；：]$/, '') + '…';
    const modes = `<div class="modes" role="tablist" aria-label="浏览方式"><button type="button" role="tab" data-mode="card" class="${exMode === 'card' ? 'is-on' : ''}">卡片</button><button type="button" role="tab" data-mode="list" class="${exMode === 'list' ? 'is-on' : ''}">列表</button></div>`;
    return `
    <div class="dig-page ex-page" id="ex-page">
      <section class="pagehead compact dig-head" data-no="02">
        <div class="ph-row"><h1 class="h1">声音与场所</h1>${modes}</div>
        <p class="dig-lead" id="dig-lead">${esc(brief)}<button type="button" class="dig-more" data-dig-open aria-expanded="false" aria-controls="dig-ov">展开<i></i></button></p>
      </section>
      <div class="ex-body" id="ex-body">${exBody()}</div>
      <div class="dig-ov" id="dig-ov" role="region" aria-label="阐释的方法与过程" aria-hidden="true" data-dig-close>
        <div class="ov-body"><p>${esc(full)}</p><button type="button" class="dig-less" data-dig-close>收起<i></i></button></div>
      </div>
    </div>`;
  }

  /* 阐释：卡片 / 列表切换——页头与说明不动，只淡入淡出下方内容 */
  let exCtl = null;
  function initEx() {
    if (exCtl) exCtl.abort();
    exCtl = new AbortController();
    if (exMode === 'card') initCarousel(exCtl.signal);
    buildRail(exMode === 'list');
  }
  function swapEx() {
    const body = $('#ex-body'); if (!body) return;
    $$('.modes button').forEach((b) => { const on = b.dataset.mode === exMode; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const put = () => { body.innerHTML = exBody(); initEx(); sync(); };
    if (reduce || !body.animate) { put(); return; }
    body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
      put();
      body.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'none' });
      body.getAnimations().forEach((a) => { if (a.effect.getComputedTiming().fill === 'forwards') a.cancel(); });
    };
  }

  /* 阐释 · 卡片模式：横滑莲瓣圆章，背景随声音单元渐变 */
  const SHORT = { south: '南段', midSouth: '中南', midNorth: '中北', north: '北段', newNorth: '新北' };
  function carousel() {
    const items = ORDER.map((s, i) => {
      return `<article class="cf-item" data-i="${i}" data-seg="${s.seg}" data-no="${s.id}">
        <div class="cf-med"><img class="cf-ring" src="${IMG}petal-ring.svg" alt=""><div class="cf-photo">${photo(s)}</div><span class="cf-no">${s.id}</span></div>
        <div class="cf-info">
          <h3>${esc(s.name)}</h3>
          <div class="mt">${seal(s.level)}<span class="chip">${esc(s.type)}</span></div>
          <div class="cf-act">${playBtn(s.key)}<a class="cf-more" href="#/sound/${s.id}">查看详情 ›</a></div>
        </div>
      </article>`;
    }).join('');
    const bgs = SEGMENTS.map((g) => `<i class="cf-bg" data-seg="${g.id}" style="background-image:url(${IMG}ex-card-bg.webp)"></i>`).join('');
    const bar = SEGSPAN.map(([id, a, b, n], i) => `<div class="sb" data-seg="${id}" style="flex:${BARW[i]}"><i class="tr"><u></u></i><span>${n}</span></div>`).join('');
    return `
    <section class="cf" id="cf" data-seg="south">
      <div class="cf-bgs" aria-hidden="true">${bgs}</div>
      <div class="cf-count"><b id="cf-cur">01</b><span>/ ${pad(ORDER.length)}</span><em id="cf-tag">南段 · 皇家礼乐</em></div>
      <div class="cf-track" id="cf-track">${items}</div>
      <div class="sbar cf-bar" id="cf-bar" role="slider" tabindex="0" aria-label="声音位置，左右拖动" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="南段">
        <div class="sb-row">${bar}<b class="sb-th" id="cf-th"></b></div>
      </div>
    </section>`;
  }
  const segVar = (c) => ({ cream: 'var(--cream)', pink: 'var(--pink)', brown: 'var(--brown)', orange: 'var(--orange)', red: 'var(--red)' }[c] || 'var(--red)');


  /* ---------- 声音页（挖掘 → 详情）：只放与音频相关的内容 ---------- */
  function audio(no) {
    const s = byNo(no);
    if (!s || s.placeholder) return `<section class="au-miss"><p>没有找到这个声音。</p><a class="btn sm" href="#/dig">回到挖掘</a></section>`;
    const seg = SEG[s.seg], T = s.text || {};
    const i = ORDER.indexOf(s), prev = ORDER[i - 1], next = ORDER[i + 1];
    const ph = (cls, label, src) => `<div class="au-ph ${cls}"><i class="ring"></i><b>${esc(s.name.slice(0, 1))}</b><em>${esc(label)}</em>${src ? `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">` : ''}</div>`;
    /* 调研图：仅有实图的声音展示（中和韶乐 / 昆曲 / 鸽哨）；无图不占位 */
    const surveyN = SURVEY[s.no] || 0;
    const slides = [
      `<div class="au-slide is-on">${photo(s, 'au-media')}</div>`,
      ...Array.from({ length: surveyN }, (_, k) =>
        `<div class="au-slide"><img class="au-media" src="${IMG}survey/${s.id}-${k + 1}.jpg" alt="${esc(s.name)} · 调研 ${pad(k + 1)}"></div>`
      ),
      `<div class="au-slide"><img class="au-media" src="${IMG}ip-scene-${seg.mascot}.jpg" alt="凸嘟 · ${esc(seg.name)}"></div>`
    ];
    const bars = Array.from({ length: 42 }, (_, k) => {
      const h = 22 + 70 * Math.abs(Math.sin(k * .62 + s.no) * .6 + Math.sin(k * .21 + s.no * 1.7) * .4);
      return `<u style="height:${h.toFixed(0)}%;--k:${k}"></u>`;
    }).join('');
    const card = [['声音编号', 'NO.' + s.id], ['声音类别', s.type], ['所属段落', `${seg.name} · ${seg.tag}`], ['声音级别', s.level.text]]
      .map((r) => `<div><small>${r[0]}</small><b>${esc(r[1])}</b></div>`).join('');
    LB.length = 0;
    const surveyBlock = surveyN ? (() => {
      const tiles = Array.from({ length: surveyN }, (_, k) => {
        const src = `${IMG}survey/${s.id}-${k + 1}.jpg`;
        const name = `${s.name} · 调研 ${pad(k + 1)}`;
        LB.push({ src, name });
        return `<figure class="au-tile" data-lb="${k}" role="button" tabindex="0" aria-label="放大查看${esc(name)}"><img src="${src}" alt="${esc(name)}" loading="lazy"></figure>`;
      }).join('');
      return `<h3 class="au-h3">调研图片</h3><div class="au-row">${tiles}</div>`;
    })() : '';
    return `
    <section class="au" data-seg="${s.seg}">
      <div class="au-stage" id="au-stage">
        <div class="au-slides">${slides.join('')}</div>
        <i class="au-shade"></i>
        <a class="au-back" href="#/dig">‹ 挖掘</a>
        <span class="au-cnt"><b id="au-cur">01</b> / ${pad(slides.length)}</span>
        <div class="au-cap">
          <div class="au-no">NO.${s.id}<em>${esc(seg.name)} · ${esc(seg.tag)}</em></div>
          <h1>${esc(s.name)}</h1>
          <div class="au-place">${esc(s.place)}</div>
        </div>
        <div class="au-dots" id="au-dots">${slides.map((_, k) => `<button type="button" class="${k ? '' : 'is-on'}" data-au="${k}" aria-label="第 ${k + 1} 张"></button>`).join('')}</div>
      </div>

      <div class="au-deck">
        <img class="au-mascot" src="${IMG}ip-char-${seg.mascot}.png" alt="">
        <div class="au-pl">
          <div class="au-play">${playBtn(s.key, 'au-pb')}</div>
          <div class="au-ctl">
            <div class="au-t">聆听<span>${esc(s.name)}</span></div>
            <div class="au-wave" data-scrub data-key="${s.key}"><i><span class="bars">${bars}</span></i><span class="bars base">${bars}</span><b></b></div>
            <div class="au-tm"><span data-tcur="${s.key}">00:00</span><span data-tdur="${s.key}">00:30</span></div>
          </div>
        </div>
      </div>

      <section class="au-sec au-intro">
        <h2 class="au-h"><i></i>声音介绍</h2>
        <p class="au-pl-n">${esc(s.place)}</p>
        ${T.scene_note ? `<p class="au-sn">${esc(T.scene_note)}</p>` : ''}
        <div class="au-body">${paras(T.basis)}</div>
        <div class="au-card">${card}</div>
      </section>

      <section class="au-sec">
        <h2 class="au-h"><i></i>声音现场</h2>
        <figure class="au-scene">${ph('au-wide', '图片待导入', `${IMG}scene/${s.id}.jpg`)}<figcaption>景色场地<span>${esc(s.place)}</span></figcaption></figure>
        ${surveyBlock}
      </section>

      <nav class="au-pager" aria-label="相邻声音">
        <a class="pv ${prev ? '' : 'off'}" href="${prev ? '#/audio/' + prev.id : '#/dig'}"><small>‹ 往南</small><b>${prev ? esc(prev.name) : '回到长卷'}</b></a>
        <a class="nx ${next ? '' : 'off'}" href="${next ? '#/audio/' + next.id : '#/dig'}"><small>往北 ›</small><b>${next ? esc(next.name) : '回到长卷'}</b></a>
      </nav>
    </section>`;
  }

  /* 声音页：对应图片自动轮播（切页 / 触碰 / 页面隐藏时暂停） */
  function initAudio(sig) {
    const stage = $('#au-stage'); if (!stage) return;
    const slides = $$('.au-slide', stage), dots = $$('#au-dots button'), cur = $('#au-cur');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0, timer = 0, hold = 0;
    const show = (k) => {
      idx = (k + slides.length) % slides.length;
      slides.forEach((e, j) => e.classList.toggle('is-on', j === idx));
      dots.forEach((e, j) => e.classList.toggle('is-on', j === idx));
      cur.textContent = pad(idx + 1);
    };
    const tick = () => { if (document.hidden || performance.now() < hold) return; show(idx + 1); };
    if (!reduce && slides.length > 1) timer = setInterval(tick, 4200);
    stage.addEventListener('click', (e) => { const b = e.target.closest('[data-au]'); if (b) { show(+b.dataset.au); hold = performance.now() + 7000; } }, { signal: sig });
    stage.addEventListener('pointerdown', () => { hold = performance.now() + 7000; }, { signal: sig });
    sig.addEventListener('abort', () => clearInterval(timer));
  }

  function sound(no) {
    const s = byNo(no);
    if (!s) return `<section class="sec"><p class="lead">没有找到这个声音。</p><a class="btn sm" style="margin-top:14px" href="#/explain">回到阐释</a></section>`;
    const seg = SEG[s.seg], T = s.text || {}, ex = EXTRAS[s.no] || {};
    const music = s.music && TRACKS.find((t) => t.id === s.music);
    const i = ORDER.indexOf(s);
    const prev = ORDER[i - 1], next = ORDER[i + 1];

    const hero = s.placeholder
      ? ph('京味白噪音 · 示意图', '4/3', 'dark')
      : photo(s, 'hero-pic');

    let textBlock = '';
    if (T.copy) {
      textBlock = `<div class="quote">${T.title ? `<h2>${esc(T.title)}</h2>` : ''}<div class="body">${paras(T.copy)}</div></div>`;
    } else if (T.overview) {
      const sum = s.no === 11 ? T.overview_text : T.basis;
      textBlock = `<div class="quote"><h2>资料摘要${phTag.replace('待补', '展览文案待补')}</h2><div class="body">${paras(sum)}</div></div>`;
    } else if (s.placeholder) {
      textBlock = `<div class="quote"><h2>穿插在整条线路里的京味声音</h2><div class="body"><p>这一部分的声音穿插在整条线路中，附上寻找声源的线索，如钟鼓楼回音等与中轴相关的声音，只需声音名字与对应地点，用于丰富展览呈现。</p></div></div>`;
    }

    const blocks = [];
    if (T.history) blocks.push(`<details class="blk"><summary>申报与认定历程</summary><div class="body">${paras(T.history)}</div></details>`);

    if (ex.eightSounds) {
      const rows = ex.eightSounds.rows.map((r) => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('');
      blocks.push(`<details class="blk" open><summary>八音乐器体系</summary><div><p class="body" style="margin-bottom:8px">${esc(ex.eightSounds.lead)}</p><table class="tbl"><thead><tr><th></th><th>乐器</th><th>数量</th><th>功能</th></tr></thead><tbody>${rows}</tbody></table></div></details>`);
    }
    if (ex.cries) {
      const li = (TEXT.cries || []).map((c) => `<li><span>${esc(c)}</span></li>`).join('');
      blocks.push(`<details class="blk" open><summary>叫卖词例 · ${(TEXT.cries || []).length} 则</summary><div><ul class="cries" style="padding:0;margin:0">${li}</ul></div></details>`);
    }
    if (ex.stages) {
      blocks.push(`<details class="blk" open><summary>戏台与机构</summary><div>${ex.stages.map((r) => `<div class="stage"><b>${esc(r[0])}</b><p>${esc(r[1])}</p></div>`).join('')}</div></details>`);
      const rows = ex.calendar.map((r) => `<tr><td style="width:auto;font-size:13px">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
      blocks.push(`<details class="blk"><summary>宫廷月令承应</summary><div><table class="tbl"><thead><tr><th>节令</th><th>剧目</th><th>寓意</th></tr></thead><tbody>${rows}</tbody></table></div></details>`);
    }
    if (ex.kinds) {
      const rows = ex.kinds.map((r) => `<tr><td style="width:4.5em">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');
      blocks.push(`<details class="blk" open><summary>鸽哨的四类形制</summary><div><table class="tbl"><tbody>${rows}</tbody></table></div></details>`);
    }
    if (ex.whiteNoise) {
      const rows = ex.whiteNoise.map((r) => `<tr><td style="width:auto;font-size:14px">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');
      blocks.push(`<details class="blk" open><summary>声音与地点${phTag}</summary><div><table class="tbl"><thead><tr><th>声音</th><th>对应地点</th></tr></thead><tbody>${rows}</tbody></table></div></details>`);
    }

    const rel = music ? `<a class="related" href="#/create/music"><div class="tx"><small>关联二创音乐</small><b>《${esc(music.title)}》</b><span class="muted">${esc(seg.name)} · AI 二创主题音乐</span></div><span style="color:var(--red);font-size:20px">›</span></a>` : '';

    return `
    <section class="s-hero">
      <a class="back" href="#/explain" aria-label="返回阐释"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a>
      <div class="round">${hero}</div>
      <div class="banner"><h1>${esc(s.name)}</h1><i></i></div>
      <div class="sw-tip" aria-hidden="true">‹ 往南<em>左右滑动</em>往北 ›</div>
    </section>
    <section class="s-body xs">
      <div class="xs-id"><span class="no">NO.${s.id}</span><span class="of">/ ${pad(ORDER.length)}</span><i></i><span class="sg">${esc(seg.name)} · ${esc(seg.tag)}</span></div>
      <div class="s-place">${esc(s.place)}</div>
      <div class="s-meta">${seal(s.level)}<span class="chip">${esc(s.type)}</span>${s.deep ? '<span class="chip deep">深度阐释</span>' : ''}</div>

      <div class="xs-listen">
        ${playBtn(s.key, 'ghost')}
        <div class="xs-ls">
          <div class="t"><b>聆听 · ${esc(s.name)}</b><span><em data-tcur="${s.key}">00:00</em> / <em data-tdur="${s.key}">00:30</em></span></div>
          <div class="scrub" data-scrub data-key="${s.key}"><i></i><b></b></div>
        </div>
      </div>

      ${textBlock}
      ${blocks.join('')}
      ${rel}
    </section>
    <nav class="pager">
      <a class="pv ${prev ? '' : 'off'}" href="${prev ? '#/sound/' + prev.id : '#/explain'}"><small>↑ 往南</small><b>${prev ? esc(prev.name) : '已是最南'}</b></a>
      <a class="nx ${next ? '' : 'off'}" href="${next ? '#/sound/' + next.id : '#/explain'}"><small>往北 ↓</small><b>${next ? esc(next.name) : '已是最北'}</b></a>
    </nav>`;
  }

  /* ============================================================
     创化：二创音乐（唱片舞台）/ IP 与文创（视差轮播 + 图集）/ 场景活动（叠牌）
     三个分页在同一外壳内左右滑动切换，页签指示条跟随
     ============================================================ */
  const SUBS = [['music', '二创音乐', 'Music'], ['ip', 'IP · 文创', 'IP'], ['events', '场景活动', 'Scenes']];
  const subIdx = (s) => Math.max(0, SUBS.findIndex((x) => x[0] === s));
  let muIdx = 0;                                    // 当前选中的二创曲目（TRACKS 顺序 = 由南向北）

  const SUB_SHORT = { music: '二创音乐', ip: 'IP 文创', events: '场景活动' };
  const SUB_LEAD = {
    music: 'AI 创作的四段二创主题音乐，将本次工作坊所选非遗的声音特征转译为表达当代审美音乐的代表性成果。',
    ip: '品牌 IP“凸嘟”、AI 动画《寻声》与装饰、实用、声音交互、教育科普四类文创矩阵。',
    events: '三大核心应用场景活动，让创化成果在真实生活中持续发生价值，并面向儿童、青年、长者全龄开放。'
  };

  /* 创化 = 总览（三类成果）→ 详情（一类成果）→ 场景活动三级页 */
  function create(sub, detail) {
    if (!sub || !SUBS.some((s) => s[0] === sub)) return createHub();
    if (sub === 'events' && detail) {
      if (!EVENT_DETAIL[detail]) return create('events');
      return `<a class="cd-fab" href="#/create/events">‹ 场景活动</a><div class="cwrap"><div id="cbody">${eventDetailBody(detail)}</div></div>`;
    }
    return `<a class="cd-fab" href="#/create">‹ 创化</a><div class="cwrap"><div id="cbody">${createBody(sub)}</div></div>`;
  }
  const cdHead = (sub) => {
    const k = subIdx(sub);
    if (sub === 'music') {
      return `<header class="cd-hd cd-hd-mu">
        <div class="cd-hd-row"><h1>${SUBS[k][1]}<small>${SUBS[k][2]}</small></h1>
          <button type="button" class="smap-go" data-playall="ns" aria-label="全程连播，由北向南"><i></i><b>全程连播</b></button></div>
        <p>${SUB_LEAD[sub]}</p></header>`;
    }
    return `<header class="cd-hd"><h1>${SUBS[k][1]}<small>${SUBS[k][2]}</small></h1><p>${SUB_LEAD[sub]}</p></header>`;
  };
  const cdNext = (sub) => {
    const k = subIdx(sub), n = SUBS[k + 1];
    return n
      ? `<a class="cd-next" href="#/create/${n[0]}"><small>下一类成果 · ${pad(k + 2)}</small><b>${n[1]}</b><i>›</i></a>`
      : '<a class="cd-next" href="#/create"><small>三类成果已看完</small><b>回到创化总览</b><i>›</i></a>';  };
  const createBody = (sub) => {
    if (sub === 'music') return musicBody(); /* 标题叠在地图渐变上，避免图文间大片空白 */
    if (sub === 'ip') return ipBody(); /* 自带首图轮播；不挂下一类成果 */
    return eventsBody(); /* 海报叠牌，不挂页头长文与“回到总览” */
  };

  /* 总览：三类成果入口 */
  function createHub() {
    const bars = Array.from({ length: 7 }, (_, k) => `<i style="--k:${k}"></i>`).join('');
    const card = (cls, href, vis, no, en, name, desc, meta) => `
      <a class="hub-c ${cls}" href="${href}">
        <div class="hc-fr"><div class="hc-in">
          <div class="hc-vis">${vis}</div>
          <div class="hc-tx">
            <div class="hc-top"><span class="hc-no">${no}</span><small>${en}</small></div>
            <h2>${name}</h2>
            <p>${desc}</p>
            <div class="hc-meta">${meta}</div>
          </div>
          <i class="hc-go">›</i>
        </div></div>
      </a>`;
    return `
    <div class="dig-page hub-page">
      <section class="pagehead compact dig-head hub-head" data-no="03">
        <h1 class="h1">六大类创化成果</h1>
        <p class="sub">二创音乐、IP 形象及其 AI 动画、文创产品，以及睡眠音乐会、沉浸式剧本游、代际声享传习行动三大场景活动。</p>
      </section>
      <section class="hub">
        ${card('hc-mu', '#/create/music', `<div class="hc-disc"><img src="${IMG}ip-char-zhonghe.png" alt=""></div>`, '01', 'Music', '二创音乐', 'AI 创作的四段二创主题音乐', `<span class="hc-bars">${bars}</span>${TRACKS.length} 段主题音乐`)}
        ${card('hc-ip', '#/create/ip', `<img src="${IMG}ip-char-kunqu.png" alt=""><img src="${IMG}ip-char-jiaomai.png" alt="">`, '02', 'IP · Merchandise', 'IP · 文创', '品牌 IP“凸嘟”、动画《寻声》与文创', `${FORMS.length} 种声音元素 · 四类文创矩阵`)}
        ${card('hc-ev', '#/create/events', EVENTS.map((e) => {
          const p = EVENT_DETAIL[e.id]?.photos?.poster || `events/${e.id}/poster.jpg`;
          return `<img src="${IMG}${p}" alt="${esc(e.name)}">`;
        }).join(''), '03', 'Scenes', '场景活动', '三大核心应用场景活动', `${EVENTS.length} 项 · 儿童 · 青年 · 长者`)}
      </section>
    </div>`;
  }

  /* ---- 二创音乐 ---- */
  const MU_COL = { south: '#B04E34', midSouth: '#E28450', midNorth: '#C9A15B', north: '#FDBCB8' };
  const waveBars = (key) => {
    let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const bars = [];
    for (let k = 0; k < 48; k++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      const env = Math.sin((k / 47) * Math.PI) * .55 + .35;
      bars.push(`<i style="height:${Math.round((env * (0.45 + (h % 100) / 180)) * 100)}%;--k:${k}"></i>`);
    }
    return bars.join('');
  };
  /* 二创音乐：中轴图按宽铺满原比例；卡片锚定北段/中北/中南/南段地理位 */
  const MU_ASPECT = 1024 / 339;
  /* 焦点 y（图顶北→底南 0→1），展示序：北段 → 中北 → 中南 → 南段 */
  const MU_FOCUS = [.11, .35, .55, .81];
  const MU_VIEW = () => TRACKS.map((_, i) => i).reverse();   // TRACKS 索引：北→南
  function musicBody() {
    if (Player.cur && TRACK_KEYS.includes(Player.cur.key)) muIdx = TRACK_KEYS.indexOf(Player.cur.key);
    const order = MU_VIEW();
    const stops = order.map((ti, vi) => {
      const t = TRACKS[ti], seg = SEG[t.seg];
      return `
      <section class="mu-stop${ti === muIdx ? ' is-on' : ''}" id="mu-stop-${ti}" data-mu-i="${ti}" data-mu-v="${vi}" data-seg="${t.seg}" data-fy="${MU_FOCUS[vi]}" style="--fy:${MU_FOCUS[vi]};--mc:${MU_COL[t.seg]};--mt:${MU_COL[t.seg]}">
        <article class="mu-pin">
          <div class="mu-pin-top"><span>${SHORT[t.seg]}</span><em><b>${pad(vi + 1)}</b> / ${pad(TRACKS.length)}</em></div>
          <div class="mu-dw" aria-hidden="true">
            <i class="mu-rip"></i><i class="mu-rip"></i><i class="mu-rip"></i>
            <img class="mu-ring" src="${IMG}petal-ring.svg" alt="">
            <div class="mu-disc"><div class="mu-label"><img src="${IMG}ip-char-${seg.mascot}.png" alt=""></div></div>
          </div>
          <div class="mu-info">
            <h2>《${esc(t.title)}》</h2>
            <p>${esc(t.brief)}</p>
          </div>
          <div class="mu-playrow">
            <div class="wave" data-wave="${t.id}" data-scrub-wave>${waveBars(t.id)}</div>
            <button class="pbtn lg mu-play" type="button" data-play="${t.id}" aria-label="播放 / 暂停">${PLAY}</button>
          </div>
          <details class="mu-pin-note"><summary>创作说明</summary><p class="body">${esc(t.note)}</p></details>
        </article>
      </section>`;
    }).join('');
    return `
    <section class="mu" id="mu" data-seg="${TRACKS[muIdx].seg}">
      <div class="mu-map" aria-hidden="true"><i id="mu-map"></i><div class="mrail">${TRACKS.map(() => '<u></u>').join('')}</div></div>
      ${cdHead('music')}
      <div class="mu-in" id="mu-in">${stops}</div>
      <div class="mu-tail">
        <div class="sleep">
          <h3>创作过程</h3>
          <p>创化阶段以真实声源与文化研究成果为素材，先由人工智能完成声音的解析、分离与素材重组，再以生成式人工智能依据特定音色、调式与情绪的描述协同创作《中和雅韶》《京韵烟火》《昆韵清雅》《鸽哨市井》四段主题音乐。</p>
          <p>AI 生成结果常与预期音色偏离，团队通过反复细化描述、在多轮生成中由创作者筛选校准方获满意成果，这印证了人在协同中的主导地位不可或缺。</p>
          <div class="hint-s">人工智能提供可能性，人做出选择。</div>
        </div>
      </div>
    </section>`;
  }

  /* ---- IP · 文创 ---- */
  /* 凸嘟：撷取叫卖、鸽哨、中和韶乐、昆曲、空竹五种典型声音元素（由南向北排列） */
  const FORMS = [['zhonghe', '中和韶乐', '中和韶乐', 'south'], ['jiaomai', '叫卖', '叫卖', 'midSouth'], ['kunqu', '昆曲', '昆曲', 'midNorth'], ['gengshao', '鸽哨', '鸽哨', 'north'], ['kongzhu', '空竹', '空竹', 'newNorth']];
  const LB = [];                                    // 图集：灯箱用的扁平列表
  function ipBody() {
    LB.length = 0;
    const slides = FORMS.map((f, i) => `
      <article class="ip-slide" data-i="${i}" data-seg="${f[3]}">
        <div class="ip-bg"><img src="${IMG}ip-scene-${f[0]}.jpg" alt=""></div>
        <div class="ip-charw"><img class="ip-char" src="${IMG}ip-char-${f[0]}.png" alt="凸嘟 · ${esc(f[1])}"></div>
        <div class="ip-banner"><h3>${esc(f[2])}</h3><i></i></div>
        <div class="ip-cap"><small>对应 ${esc(SEG[f[3]].name)} · ${esc(SEG[f[3]].tag)}</small><b>凸嘟 · ${esc(f[1])}</b></div>
      </article>`).join('');
    const pick = FORMS.map((f, i) => `<button type="button" data-ip-i="${i}" aria-label="${esc(f[1])}"><img src="${IMG}ip-char-${f[0]}.png" alt=""></button>`).join('');
    const pal = [['#A71F2D', '#FFF6E4'], ['#E28450', '#FFF6E4'], ['#FFE8A5', '#682E2A'], ['#FDBCB8', '#682E2A'], ['#682E2A', '#FFF6E4']]
      .map((c) => `<button type="button" data-copy="${c[0]}" style="background:${c[0]};color:${c[1]}"><span>${c[0]}</span></button>`).join('');
    const lb = (src, name) => { LB.push({ src, name }); return LB.length - 1; };
    const goods = GOODS.map((g) => `
      <div class="grp-h">${esc(g.group)}<em>${g.items.length}</em></div>
      <div class="gal-row">${g.items.map((it) => `<figure class="gal-card ${it.wide ? 'wide' : ''}" data-lb="${lb(IMG + it.img, it.name)}"><div class="gi"><img src="${IMG}${it.img}" alt="${esc(it.name)}" loading="lazy"></div><figcaption>${esc(it.name)}</figcaption></figure>`).join('')}</div>`).join('');
    const st = lb(IMG + 'wc-stickers.jpg', '凸嘟表情包');
    return `
    <section class="ipx" id="ipx" data-seg="south">
      <div class="ip-hero">
        <div class="ip-track" id="ip-track">${slides}</div>
      </div>
      <div class="ip-pick" id="ip-pick">${pick}<i class="ip-dot"></i></div>
    </section>
    <section class="sec ip-sec" style="padding-bottom:0">
      <h2 class="ip-ht">品牌 IP</h2>
      <h3 class="ip-name">凸嘟</h3>
      <p class="body ip-about">品牌 IP“凸嘟”的外形取自北京老城“凸”字形城市轮廓，他的不同面部形象和道具撷取叫卖、鸽哨、中和韶乐、昆曲、空竹五种纵贯轴线的典型声音元素，融汇了整条中轴线的空间形态与声音记忆，因而成为体系天然的视觉核心与情感纽带。</p>
      <div class="pal2" id="pal">${pal}</div>
      <div class="muted" style="margin-top:6px">轻点色块复制色值</div>
      <div class="grp-h">表情包</div>
      <figure class="stk" data-lb="${st}"><img src="${IMG}wc-stickers.jpg" alt="凸嘟表情包" loading="lazy"></figure>
      <div class="grp-h">AI 动画《寻声》</div>
      <div class="ip-vid" id="ip-vid">
        <div class="ip-vid-frame">
          <video id="ip-vid-el" playsinline webkit-playsinline preload="metadata" poster="${IMG}ip-scene-kunqu.jpg" aria-label="AI 动画《寻声》"></video>
          <button type="button" class="ip-vid-play" id="ip-vid-play" aria-label="播放《寻声》"><i></i></button>
        </div>
        <div class="ip-vid-bar">
          <button type="button" class="ip-vid-toggle pbtn" id="ip-vid-toggle" aria-label="播放 / 暂停">${PLAY}</button>
          <div class="scrub ip-vid-scrub" id="ip-vid-scrub" role="slider" aria-label="播放进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i><b></b></div>
          <span class="ip-vid-time" id="ip-vid-time">0:00 / 0:00</span>
        </div>
      </div>
      <p class="body" style="margin-top:12px">以凸嘟为主角、运用生成式人工智能创作的动画短片《寻声》，讲述声音精灵凸嘟月夜启程、飞临轴线上空，循声走入胡同深处辨认鸽哨与叫卖、在坛庙殿陛前聆听中和韶乐的金声玉振，又将一路收集的声音化作漫天光点撒回城市，最终落进四合院中祖孙围坐、共听收音机的日常时刻，引领观众完成一次对听得见的中轴线的想象性漫游。</p>
      <h2 class="ip-ht">文创产品</h2>
      <p class="body" style="margin-top:10px">围绕凸嘟打造的装饰、实用、声音交互、教育科普四类文创矩阵——NFC 冰箱贴、AR 明信片、凸版印刷书签、八音盒、DIY 材料包等，将声音藏于日常之物，并深度嵌入睡眠音乐会、剧本研学、代际传习三大消费场景。</p>
      ${goods}
    </section>`;
  }

  /* ---- 场景活动：海报叠牌 ---- */
  const EV_SCENE = { sleep: 'gengshao', script: 'jiaomai', gen: 'kunqu' };
  function eventsBody() {
    const cards = EVENTS.map((e, i) => {
      const d = EVENT_DETAIL[e.id];
      const cover = (d && d.photos && (d.photos.poster || d.photos.hero))
        || `ip-scene-${EV_SCENE[e.id]}.jpg`;
      return `
      <article class="evc" style="--i:${i}" data-go="#/create/events/${e.id}" role="link" tabindex="0" aria-label="查看${esc(e.name)}详情">
        <div class="evc-in evc-poster">
          <img src="${IMG}${cover}" alt="${esc(e.name)}">
          <div class="evc-mask">
            <span class="evc-no">0${i + 1}</span>
            <div class="evc-cap">
              <b>${esc(e.name)}</b>
              <small>${esc(e.kind)}</small>
            </div>
            <span class="evc-go">查看详情 ›</span>
          </div>
        </div>
      </article>`;
    }).join('');
    return `
    <section class="evs" id="evs">
      <div class="ev-stack" id="ev-stack">${cards}</div>
    </section>`;
  }

  /* 场景活动二级页 · 照片叙事 */
  function eventDetailBody(id) {
    const base = EVENTS.find((e) => e.id === id), d = EVENT_DETAIL[id];
    if (!base || !d) return '<section class="sec"><p class="body">活动详情暂缺</p></section>';
    const ph = d.photos || {};
    LB.length = 0;
    const seen = Object.create(null);
    const lb = (src, name) => {
      if (seen[src] != null) return seen[src];
      LB.push({ src: IMG + src, name });
      return (seen[src] = LB.length - 1);
    };
    const shot = (src, name, cls) => {
      const i = lb(src, name);
      return `<figure class="${cls}" data-lb="${i}" role="button" tabindex="0" aria-label="放大查看${esc(name)}"><img src="${IMG}${src}" alt="${esc(name)}" loading="lazy" decoding="async"></figure>`;
    };
    const heroI = ph.hero ? lb(ph.hero, base.name) : -1;
    const posterI = ph.poster ? lb(ph.poster, `${base.name} 海报`) : -1;
    const film = (ph.film || []).map((src, i) => shot(src, `${base.name} · ${pad(i + 1)}`, 'evd-film-i')).join('');
    const mosaic = (ph.mosaic || []).map((src, i) => shot(src, `${base.name} 现场 ${i + 1}`, 'evd-tile' + (i % 5 === 1 || i % 5 === 3 ? ' tall' : ''))).join('');
    const goods = (ph.goods || []).map((src, i) => shot(src, `${base.name} 成果 ${i + 1}`, 'evd-good')).join('');
    const steps = d.flow.steps.map((s) => {
      const pic = s.pic ? shot(s.pic, s.name, 'evd-step-pic') : '';
      return `<li class="evd-step${pic ? ' has-pic' : ''}">${pic}<div><b>${esc(s.name)}</b><small>${esc(s.meta)}</small><p>${esc(s.body)}</p></div></li>`;
    }).join('');
    const reel = d.content.items.map((it, i) => `
      <li class="evd-reel-i">
        <i class="evd-reel-dot" aria-hidden="true">${pad(i + 1)}</i>
        <div>
          <header><h3>${esc(it.name)}</h3><span>${esc(it.meta)}</span></header>
          <p>${esc(it.body)}</p>
        </div>
      </li>`).join('');
    const outs = d.outcomes.map((o) => `<li><b>${esc(o.name)}</b><p>${esc(o.body)}</p></li>`).join('');
    const pts = d.sustain.points.map((p) => `<li>${esc(p)}</li>`).join('');
    const paras = d.insight.paras.map((p) => `<p>${esc(p)}</p>`).join('');
    const nFilm = (ph.film || []).length;
    return `
    <section class="evd" id="evd" data-ev="${id}">
      <header class="evd-hero">
        <div class="evd-cover" ${heroI >= 0 ? `data-lb="${heroI}"` : ''} role="button" tabindex="0" aria-label="放大查看主视觉">
          <img src="${IMG}${ph.hero || `ip-scene-${EV_SCENE[id]}.jpg`}" alt="${esc(base.name)}">
          <div class="evd-cover-fade"></div>
        </div>
        <div class="evd-hero-tx">
          <div class="evc-kd">${esc(base.kind)}</div>
          <h1>${esc(base.name)}</h1>
          <p class="evd-note">${esc(base.nameNote)}</p>
          <p class="evd-pitch">${esc(d.pitch)}</p>
        </div>
      </header>

      ${film ? `<section class="evd-film" aria-label="现场照片长卷">
        <div class="evd-film-meta"><span>现场长卷</span><em>${nFilm} 帧 · 左右滑动</em></div>
        <div class="evd-film-track">${film}</div>
      </section>` : ''}

      <section class="sec evd-sec">
        <p class="body evd-lead">${esc(d.lead)}</p>
        <dl class="evc-fact evd-fact"><div><dt>面向</dt><dd>${esc(base.audience)}</dd></div><div><dt>落地</dt><dd>${esc(base.done)}</dd></div></dl>
        <div class="gd" style="margin-top:12px">${base.tags.map((g) => `<span class="chip">${esc(g)}</span>`).join('')}</div>

        <h2 class="evd-h">${esc(d.insight.title)}</h2>
        <div class="evd-split">
          <div>
            <h3 class="evd-sh">${esc(d.insight.why)}</h3>
            <div class="body">${paras}</div>
          </div>
          ${ph.poster ? `<aside class="evd-aside" data-lb="${posterI}" role="button" tabindex="0"><img src="${IMG}${ph.poster}" alt="" loading="lazy"><span>点按放大</span></aside>` : ''}
        </div>

        <h2 class="evd-h">${esc(d.flow.title)}</h2>
        <p class="evd-sub">${esc(d.flow.sub)}</p>
        <p class="body">${esc(d.flow.layers)}</p>
        <ol class="evd-steps">${steps}</ol>

        <h2 class="evd-h">${esc(d.content.title)}</h2>
        <p class="evd-sub">${esc(d.content.sub)}</p>
        <p class="body">${esc(d.content.intro)}</p>
        <ol class="evd-reel" aria-label="内容时间卷轴">${reel}</ol>

        <h2 class="evd-h">${esc(d.proof.title)}</h2>
        <dl class="evc-fact evd-fact">
          <div><dt>时间</dt><dd>${esc(d.proof.when)}</dd></div>
          <div><dt>地点</dt><dd>${esc(d.proof.where)}</dd></div>
        </dl>
        <p class="body" style="margin-top:10px">${esc(d.proof.note)}</p>
        ${mosaic ? `<div class="evd-mosaic" aria-label="实践现场">${mosaic}</div>` : ''}

        <h2 class="evd-h">伍 · 成果展示</h2>
        ${goods ? `<div class="evd-goods" aria-label="成果物料">${goods}</div>` : ''}
        <ul class="evd-out">${outs}</ul>

        <h2 class="evd-h">${esc(d.sustain.title)}</h2>
        <p class="evd-cost">${esc(d.sustain.cost)}</p>
        <ul class="evd-points">${pts}</ul>
      </section>
    </section>`;
  }

  /* 传播：展区设计方案（PDF） */
  function show() {
    const X = window.PROJECT_TEXT.exhibit;
    LB.length = 0;
    const lb = (src, name) => { LB.push({ src: IMG + src, name }); return LB.length - 1; };
    const shot = (src, name, cls = 'exb-fig') => {
      const i = lb(src, name);
      return `<figure class="${cls}" data-lb="${i}" role="button" tabindex="0" aria-label="放大查看${esc(name)}"><img src="${IMG}${src}" alt="${esc(name)}" loading="lazy" decoding="async"><figcaption>${esc(name)}</figcaption></figure>`;
    };
    const route = [['遇见中轴', '挖掘'], ['聆听中轴', '阐释'], ['看见中轴', '创化'], ['共创中轴', '传播']]
      .map((r) => `<li><b>${r[0]}</b><small>${r[1]}</small></li>`).join('');
    const zones = X.zones.map((z, i) => `<details><summary><span>${pad(i + 1)}<b>${esc(z.k)}</b></span></summary><div>${paras(z.t)}</div></details>`).join('');
    const details = [
      ['exhibit/detail_00.jpg', '展位正面全景'],
      ['exhibit/detail_01.jpg', '展位左侧视点'],
      ['exhibit/detail_02.jpg', '声景卷轴与听筒'],
      ['exhibit/detail_03.jpg', '睡眠音乐会体验间'],
      ['exhibit/detail_04.jpg', '创化成果与文创'],
      ['exhibit/detail_05.jpg', '方格展台与互动'],
      ['exhibit/detail_06.jpg', '展位右侧视点'],
      ['exhibit/detail_07.jpg', '展位俯视示意']
    ].map(([src, name]) => shot(src, name, 'exb-tile')).join('');
    const cast = ['kongzhu', 'gengshao', 'kunqu', 'jiaomai', 'zhonghe']
      .map((k) => `<img src="${IMG}ip-char-${k}.png" alt="" decoding="async">`).join('');
    /* 现场图片：头接尾无限滑动（轨内容复制一份，动画移 -50%） */
    const fieldN = 10;
    const fieldOnce = Array.from({ length: fieldN }, (_, k) => {
      const src = `field/${pad(k + 1)}.jpg`;
      const name = `现场 ${pad(k + 1)}`;
      const i = lb(src, name);
      return `<figure class="exb-marq-i" data-lb="${i}" role="button" tabindex="0" aria-label="放大查看${esc(name)}"><img src="${IMG}${src}" alt="${esc(name)}" loading="lazy" decoding="async" draggable="false"></figure>`;
    }).join('');
    /* 两组相同内容；每组右侧留与图间距相等的 padding，保证 -50% 无缝接尾 */
    const fieldSet = `<div class="exb-marq-set">${fieldOnce}</div>`;
    return `
    <div class="exb">
      <header class="exb-splash">
        <i class="exb-axis" aria-hidden="true"></i>
        <div class="exb-splash-tx">
          <div class="evc-kd">古建藏音</div>
          <h1>现场传播</h1>
          <p class="exb-tip">走进展场，沿中轴听见北京<small>沉浸式体验展 · 「遇见—聆听—看见—共创」</small></p>
        </div>
        <div class="exb-cast" aria-hidden="true">${cast}</div>
      </header>

      <section class="sec exb-sec exb-field">
        <div class="kicker">现场图片</div>
        <div class="exb-marq" aria-label="现场图片展示">
          <div class="exb-marq-track">${fieldSet}${fieldSet}</div>
        </div>
      </section>

      <section class="sec exb-sec">
        <div class="kicker">壹 · 展览定位与空间意象</div>
        <p class="body" style="margin-top:12px">${esc(X.pos)}</p>
        ${X.posMore ? `<details class="more exb-more"><summary><span class="o">展开空间意象</span><span class="c">收起空间意象</span></summary><div class="body">${esc(X.posMore)}</div></details>` : ''}
        ${shot('exhibit/pos.jpg', '图1 · 展览定位', 'exb-fig exb-hero')}
      </section>

      <section class="sec exb-sec">
        <div class="kicker">贰 · 叙事动线</div>
        <ol class="route">${route}</ol>
        <p class="body" style="margin-top:12px">${esc(X.route)}</p>
      </section>

      <section class="sec exb-sec" style="padding-bottom:0">
        <div class="kicker">叁 · 分区设计</div>
      </section>
      <div class="mean">${zones}</div>
      <section class="sec exb-sec">
        ${shot('exhibit/plan.jpg', '图2 · 展览分区说明', 'exb-fig exb-plan')}
      </section>

      <section class="sec exb-sec">
        <div class="kicker">肆 · 展览细节</div>
        <p class="exb-hint">图3 · 展览细节示意图 · 点按放大</p>
        <div class="exb-grid">${details}</div>
      </section>

      <section class="sec exb-sec">
        <div class="kicker">伍 · 总结</div>
        <p class="body" style="margin-top:12px">${esc(X.summary)}</p>
      </section>

      <div class="exb-end"><img src="${IMG}skyline.png" alt=""></div>

      <section class="about">
        <div class="kicker">关于</div>
        <dl>
          <dt>项目</dt><dd>“听见中轴”声景智创工作坊，以北京中轴线遗产区及缓冲区内具有代表性的声音类名录及非名录非物质文化遗产为对象，以“数智创化”为主要方法，遵循“挖掘—阐释—创化—传播”四步实践路径，探索声音文化遗产的当代表达与创新传播。</dd>
          <dt>组织形态</dt><dd>以高校青年团队为创作主体、以非遗传承人为知识源点、以街道社区与文化场馆为落地场景的共创型实践。</dd>
          <dt>声音与图像来源${phTag}</dt><dd>各声音的采集来源、图片出处与授权信息待补。</dd>
          <dt>AI 使用说明</dt><dd>二创音乐、IP 形象“凸嘟”、品牌动画《寻声》及文创设计等均由人工智能协同生成；人工智能提供可能性，审美判断与文化转译始终由团队创作者主导。</dd>
          <dt>团队${phTag}</dt><dd>待补。</dd>
          <dt>致谢${phTag}</dt><dd>待补。</dd>
        </dl>
      </section>
      ${footer()}
    </div>`;
  }

  function footer() {
    return `<footer class="foot"><img src="${IMG}logo-v.png" alt="听见中轴"><p>声景智创工作坊 · Sound Scape Intelligent Creation Workshop</p></footer>`;
  }

  /* ---------- 路由 ---------- */
  const view = $('#view'), app = $('#app');
  let spy = null;
  let exMode = 'card';
  let cfStart = 0;
  let last = null;                                   // 上一次路由 { r, a, b }
  const RANK = { '': 0, home: 1, dig: 2, explain: 3, sound: 3, create: 4, show: 5 };

  /* 转场类型：一级页签按先后上/下翻页；进入/离开声音详情、声音之间横向切换 */
  function transType(cur, prev) {
    if (!prev) return 'none';
    if (cur.r === prev.r) {
      if (cur.r === 'sound' || cur.r === 'audio') { const a = byNo(cur.a), b = byNo(prev.a); return a && b && ORDER.indexOf(a) < ORDER.indexOf(b) ? 'right' : 'left'; }
      if (cur.r === 'create') {
        if (cur.a === 'events' && (cur.b || prev.b) && cur.a === prev.a) return cur.b ? 'left' : 'right';
        return cur.a && !prev.a ? 'left' : !cur.a && prev.a ? 'right' : 'fade';
      }
      return 'fade';
    }
    if (cur.r === 'sound' || cur.r === 'audio') return 'left';
    if (prev.r === 'sound' && cur.r === 'explain') return 'right';
    if (prev.r === 'audio') return cur.r === 'dig' ? 'right' : (RANK[cur.r] >= RANK.dig ? 'up' : 'down');
    return RANK[cur.r] >= RANK[prev.r] ? 'up' : 'down';
  }

  function render(opt = {}) {
    const h = location.hash || '';
    if (!h || h === '#') { location.hash = '#/home'; return; }
    const [, r = '', a, b] = h.split('/');
    /* 创化内部切换（music/ip/events 之间）：只换内容区；进入活动详情走整页转场 */
    if (r === 'create' && last && last.r === 'create' && last.a && a && last.a !== a && !b && !last.b && $('#cbody') && !opt.vt) {
      const from = last.a;
      last = { r, a, b };
      swapCreate(from, a);
      return;
    }
    teardownCreate();
    if (showFieldAbort) showFieldAbort();
    let html = '', tab = r;
    if (r === 'home') html = home();
    else if (r === 'dig') html = dig();
    else if (r === 'explain') html = explain();
    else if (r === 'sound') { html = sound(a); tab = 'explain'; }
    else if (r === 'audio') { html = audio(a); tab = 'dig'; }
    else if (r === 'create') html = create(a, b);
    else if (r === 'show') html = show();
    else { location.hash = '#/home'; return; }
    const cur = { r, a, b };
    const type = opt.vt || transType(cur, last);
    const y = window.scrollY;
    /* 从声音详情返回阐释：轮播停在刚看过的那一个 */
    cfStart = (r === 'explain' && last && last.r === 'sound' && byNo(last.a)) ? Math.max(0, ORDER.indexOf(byNo(last.a))) : (opt.keepScroll ? cfStart : 0);
    last = cur;
    Motion.go(type, () => {
      app.classList.remove('is-splash');
      app.classList.toggle('is-dig', r === 'dig');
      /* 无地图/全屏图底的页面：叠入宣纸山水底图（总览、二创音乐除外） */
      app.classList.toggle('has-paper', r !== 'home' && !(r === 'create' && a === 'music'));
      view.innerHTML = html;
      $$('#tabs a').forEach((el) => el.classList.toggle('is-on', el.dataset.tab === tab));
      Motion.tabInk(tab);
      app.classList.toggle('is-one', r === 'explain' || (r === 'create' && !a));
      window.scrollTo(0, opt.keepScroll ? y : 0);
      if (r === 'dig') initMap();
      if (r === 'home') { createCtl = new AbortController(); initHome(createCtl.signal); }
      if (r === 'explain') initEx();
      if (r === 'audio') { createCtl = new AbortController(); initAudio(createCtl.signal); }
      if (r === 'create') initCreate(a, b);
      if (r === 'show') initShowField();
      sync();
      Motion.after(r, view, type);
    });
  }

  /* 传播页：现场图 — 自动快滑；手指横滑时暂停，松手后继续 */
  let showFieldAbort = null;
  function initShowField() {
    if (showFieldAbort) showFieldAbort();
    const marq = $('.exb-marq'); if (!marq) return;
    const track = $('.exb-marq-track', marq); if (!track) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const half = () => track.scrollWidth / 2;
    const wrap = () => {
      const h = half(); if (h < 8) return;
      if (marq.scrollLeft >= h) marq.scrollLeft -= h;
      else if (marq.scrollLeft < 0) marq.scrollLeft += h;
    };
    let raf = 0, paused = false, idle = 0, drag = false, moved = false, sx = 0, sl = 0;
    /* ≈ 18s 滚完半轨（约 3 倍于原先） */
    const pxPerMs = () => Math.max(0.09, half() / 18000);
    const tick = (t) => {
      if (!paused && !reduce) {
        if (!tick.t0) tick.t0 = t;
        const dt = Math.min(48, t - tick.t0); tick.t0 = t;
        marq.scrollLeft += dt * pxPerMs();
        wrap();
      } else tick.t0 = t;
      raf = requestAnimationFrame(tick);
    };
    const pause = (ms = 1200) => {
      paused = true; clearTimeout(idle);
      idle = setTimeout(() => { paused = false; tick.t0 = 0; }, ms);
    };
    marq.addEventListener('scroll', () => { wrap(); }, { passive: true });
    /* 触控交给系统横滑，只暂停自动；鼠标仍可拖（勿在 scroll 里 pause，否则自动滚也会被掐掉） */
    marq.addEventListener('pointerdown', (e) => {
      pause(999999);
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = true; moved = false; sx = e.clientX; sl = marq.scrollLeft;
      marq.classList.add('is-drag');
      try { marq.setPointerCapture(e.pointerId); } catch (_) {}
    });
    marq.addEventListener('touchstart', () => pause(999999), { passive: true });
    marq.addEventListener('touchend', () => pause(900), { passive: true });
    marq.addEventListener('touchcancel', () => pause(900), { passive: true });
    marq.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      marq.scrollLeft = sl - dx;
      wrap();
    });
    const endDrag = () => {
      const was = drag;
      drag = false; marq.classList.remove('is-drag');
      pause(was && moved ? 1000 : 800);
    };
    marq.addEventListener('pointerup', endDrag);
    marq.addEventListener('pointercancel', endDrag);
    marq.addEventListener('wheel', () => pause(1200), { passive: true });
    marq.addEventListener('click', (e) => {
      if (!moved) return;
      e.preventDefault(); e.stopPropagation(); moved = false;
    }, true);
    if (!reduce) raf = requestAnimationFrame(tick);
    showFieldAbort = () => {
      cancelAnimationFrame(raf); clearTimeout(idle); showFieldAbort = null;
    };
  }

  /* ---------- 创化：切换 / 初始化 / 清理 ---------- */
  let createCtl = null;
  function teardownCreate() { if (createCtl) { createCtl.abort(); createCtl = null; } }

  function swapCreate(from, to) {
    teardownCreate();
    app.classList.toggle('has-paper', to !== 'music');
    const wrap = $('.cwrap'), body = $('#cbody'), bar = $('.cdbar') || $('.cd-fab');
    if (!wrap || !body) return;
    const dir = subIdx(to) >= subIdx(from) ? 1 : -1;
    const lim = Math.max(0, wrap.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight : 0) - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-h'), 10) || 52));
    if (window.scrollY > lim) window.scrollTo(0, lim);
    const done = () => { initCreate(to); Motion.reveal(body, true); sync(); };
    if (Motion.reduce.matches || !body.animate) { body.innerHTML = createBody(to); done(); return; }
    const ghost = body.cloneNode(true);
    ghost.removeAttribute('id'); $$('[id]', ghost).forEach((e) => e.removeAttribute('id'));
    ghost.setAttribute('aria-hidden', 'true'); ghost.setAttribute('inert', '');
    Object.assign(ghost.style, { position: 'absolute', left: '0', top: '0', width: '100%', pointerEvents: 'none' });
    wrap.appendChild(ghost);
    body.innerHTML = createBody(to);
    wrap.classList.add('swapping');
    const w = wrap.clientWidth, opt = { duration: 380, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'both' };
    const a1 = body.animate([{ transform: `translateX(${dir * w * .55}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], opt);
    ghost.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-dir * w * .3}px)`, opacity: 0 }], opt);
    let fin = false;
    const end = () => { if (fin) return; fin = true; a1.cancel(); ghost.remove(); wrap.classList.remove('swapping'); };
    a1.onfinish = end; setTimeout(end, 520);
    done();
  }

  function initCreate(sub, detail) {
    teardownCreate();
    createCtl = new AbortController();
    const sig = createCtl.signal;
    if (sub === 'music') initMusic(sig);
    else if (sub === 'ip') { initIp(sig); initIpVid(sig); }
    else if (sub === 'events' && !detail) initEvents(sig);
  }

  /* 二创音乐：卡片按地理 y 锚定；滚动时图与贴点 1:1 对齐 */
  function initMusic(sig) {
    const mu = $('#mu'), map = $('#mu-map'), track = $('#mu-in'); if (!mu || !map || !track) return;
    const box = map.parentElement, dots = $$('.mrail u', box), stops = $$('.mu-stop', mu);
    const still = Motion.reduce.matches;
    const viewOf = (ti) => TRACKS.length - 1 - ti;
    const trackOf = (vi) => TRACKS.length - 1 - vi;
    let vh = 0, H = 0, pad = 0, bleedTop = 0, bleedBot = 0, raf = 0, lock = 0;
    const topOf = (el) => el.getBoundingClientRect().top + scrollY;
    const size = () => {
      const vw = box.clientWidth; vh = box.clientHeight; H = vw * MU_ASPECT;
      /* 上少下多出血：标题直接压在图上，底部仍可对准南段 */
      const gaps = MU_FOCUS.slice(1).map((f, i) => (f - MU_FOCUS[i]) * H);
      const gap = Math.min(...gaps);
      const disc = Math.round(Math.min(86, Math.max(64, gap * 0.28)));
      pad = Math.round(Math.max(disc * 0.9, vh * 0.08));
      bleedTop = 0;
      bleedBot = 0;
      map.style.width = vw + 'px';
      map.style.height = H + 'px';
      map.style.backgroundPosition = '0 0';
      map.style.backgroundSize = '100% auto';
      map.style.removeProperty('--fade-top');
      map.style.removeProperty('--fade-bot');
      track.style.height = H + 'px';
      track.style.paddingTop = pad + 'px';
      track.style.paddingBottom = pad + 'px';
      mu.style.setProperty('--mu-disc', disc + 'px');
      stops.forEach((el) => { el.style.top = (pad + (+el.dataset.fy) * H) + 'px'; });
    };
    /* 图与轨 1:1（上少下多出血） */
    const mapTy = () => {
      const full = H + bleedTop + bleedBot;
      return Math.min(0, Math.max(vh - full, topOf(track) + pad - scrollY - bleedTop));
    };
    const fyFromScroll = () => {
      const mid = scrollY + innerHeight * 0.42;
      return Math.min(1, Math.max(0, (mid - (topOf(track) + pad)) / Math.max(1, H)));
    };
    const nearestVi = (fy) => {
      let best = 0, bd = 9;
      MU_FOCUS.forEach((f, i) => { const d = Math.abs(f - fy); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const draw = () => {
      map.style.transform = `translate3d(0, ${mapTy().toFixed(1)}px, 0)`;
      dots.forEach((d, j) => d.classList.toggle('is-on', j === nearestVi(fyFromScroll())));
    };
    const upd = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); });
      if (Date.now() < lock) return;
      const i = trackOf(nearestVi(fyFromScroll()));
      if (i !== muIdx) setActive(i, false);
    };
    const setActive = (i, scrollTo) => {
      muIdx = i;
      mu.dataset.seg = TRACKS[i].seg;
      stops.forEach((el) => el.classList.toggle('is-on', +el.dataset.muI === i));
      if (scrollTo) {
        lock = Date.now() + 700;
        const el = $(`#mu-stop-${i}`);
        if (el) {
          const y = topOf(el) + el.offsetHeight / 2 - innerHeight * 0.42;
          window.scrollTo({ top: Math.max(0, y), behavior: still ? 'auto' : 'smooth' });
        }
      }
    };
    window.__setTrack = (i) => {
      i = Math.max(0, Math.min(TRACKS.length - 1, i));
      setActive(i, true);
      upd();
      sync();
    };
    /* 展开创作说明时放开卡片高度，避免正文被裁切 */
    mu.addEventListener('toggle', (e) => {
      const d = e.target.closest?.('details.mu-pin-note');
      if (!d) return;
      d.closest('.mu-pin')?.classList.toggle('is-open', d.open);
    }, { signal: sig, capture: true });
    size(); draw(); upd();
    window.addEventListener('scroll', upd, { passive: true, signal: sig });
    window.addEventListener('resize', () => { size(); draw(); upd(); }, { signal: sig });
    setActive(muIdx, false);
    if (viewOf(muIdx) > 0) {
      requestAnimationFrame(() => { lock = Date.now() + 400; setActive(muIdx, true); upd(); });
    }
  }
  function muStep(d) {
    /* d>0：往南（展示序向后）；d<0：往北 */
    const vi = Math.max(0, Math.min(TRACKS.length - 1, viewOf(muIdx) + d));
    const i = trackOf(vi);
    window.__setTrack(i);
    const keys = [...TRACK_KEYS].reverse();
    if (Player.playing && Player.cur && TRACK_KEYS.includes(Player.cur.key)) Player.play(TRACKS[i].id, keys);
  }
  function viewOf(ti) { return TRACKS.length - 1 - ti; }
  function trackOf(vi) { return TRACKS.length - 1 - vi; }
  function muPick(i) {
    if (i === muIdx) return;
    window.__setTrack(i);
    const keys = [...TRACK_KEYS].reverse();
    if (Player.playing && Player.cur && TRACK_KEYS.includes(Player.cur.key)) Player.play(TRACKS[i].id, keys);
  }

  /* IP：AI 动画《寻声》——可拖进度 */
  function initIpVid(sig) {
    const box = $('#ip-vid'), v = $('#ip-vid-el'), scrub = $('#ip-vid-scrub');
    const playBig = $('#ip-vid-play'), toggle = $('#ip-vid-toggle'), timeEl = $('#ip-vid-time');
    if (!box || !v || !scrub) return;
    const fmt = (s) => {
      s = Math.max(0, Math.floor(s || 0));
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    };
    const fill = scrub.querySelector('i'), knob = scrub.querySelector('b');
    let dragging = false, ready = false;
    const paint = () => {
      const d = v.duration || 0, t = v.currentTime || 0;
      const p = d ? Math.min(1, Math.max(0, t / d)) : 0;
      fill.style.width = (p * 100) + '%';
      knob.style.left = (p * 100) + '%';
      scrub.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      timeEl.textContent = fmt(t) + ' / ' + fmt(d);
    };
    const setPlaying = (on) => {
      box.classList.toggle('is-playing', on);
      toggle.classList.toggle('is-playing', on);
      playBig.hidden = on;
    };
    const ensureSrc = () => {
      if (ready) return;
      v.src = VIDEO('xunsheng.mp4');
      ready = true;
    };
    const play = () => {
      ensureSrc();
      Player.pause();
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => { /* 需用户手势 */ });
    };
    const pause = () => { try { v.pause(); } catch (e) { /* noop */ } };
    const seekAt = (clientX) => {
      const rc = scrub.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientX - rc.left) / Math.max(1, rc.width)));
      if (v.duration) v.currentTime = p * v.duration;
      paint();
    };
    playBig.addEventListener('click', () => play(), { signal: sig });
    toggle.addEventListener('click', () => { v.paused ? play() : pause(); }, { signal: sig });
    v.addEventListener('play', () => setPlaying(true), { signal: sig });
    v.addEventListener('pause', () => setPlaying(false), { signal: sig });
    v.addEventListener('ended', () => setPlaying(false), { signal: sig });
    v.addEventListener('timeupdate', () => { if (!dragging) paint(); }, { signal: sig });
    v.addEventListener('loadedmetadata', paint, { signal: sig });
    v.addEventListener('error', () => {
      box.classList.add('is-err');
      timeEl.textContent = '视频加载失败';
    }, { signal: sig });
    scrub.addEventListener('pointerdown', (e) => {
      ensureSrc();
      dragging = true;
      scrub.classList.add('is-drag');
      scrub.setPointerCapture(e.pointerId);
      seekAt(e.clientX);
      e.preventDefault();
    }, { signal: sig });
    scrub.addEventListener('pointermove', (e) => { if (dragging) seekAt(e.clientX); }, { signal: sig });
    const endDrag = () => { dragging = false; scrub.classList.remove('is-drag'); };
    scrub.addEventListener('pointerup', endDrag, { signal: sig });
    scrub.addEventListener('pointercancel', endDrag, { signal: sig });
    /* 离页清理 */
    sig.addEventListener('abort', () => { pause(); v.removeAttribute('src'); try { v.load(); } catch (e) { /* noop */ } });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { if (!en[0].isIntersecting && !v.paused) pause(); }, { threshold: 0.12 });
      io.observe(box);
      sig.addEventListener('abort', () => io.disconnect());
    }
    paint();
  }

  /* IP：视差轮播 + 自动连播 */
  function initIp(sig) {
    const root = $('#ipx'), tr = $('#ip-track'); if (!root) return;
    const slides = $$('.ip-slide', tr), pick = $$('#ip-pick button');
    const reduce = Motion.reduce.matches;
    let idx = -1, ticking = false, timer = 0, pauseUntil = 0;
    const slideLeft = (i) => slides[i].offsetLeft - (parseFloat(getComputedStyle(tr).paddingLeft) || 0);
    const update = () => {
      ticking = false;
      const w = tr.clientWidth; let best = 0, bd = 9;
      slides.forEach((s, i) => {
        const p = (s.offsetLeft - tr.scrollLeft) / Math.max(1, s.offsetWidth);                   // -1..1：0 为居中
        s.style.setProperty('--p', p.toFixed(3)); s.style.setProperty('--ap', Math.min(1, Math.abs(p)).toFixed(3));
        if (Math.abs(p) < bd) { bd = Math.abs(p); best = i; }
      });
      if (best !== idx) {
        idx = best;
        slides.forEach((s, i) => s.classList.toggle('is-on', i === idx));
        pick.forEach((b, i) => b.classList.toggle('is-on', i === idx));
        root.dataset.seg = FORMS[idx][3];
        $('#ip-pick').style.setProperty('--i', idx);
      }
    };
    const to = (i, smooth = true) => {
      const n = (i + slides.length) % slides.length;
      tr.scrollTo({ left: slideLeft(n), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    };
    const bump = () => { pauseUntil = performance.now() + 5200; };
    const arm = () => {
      clearInterval(timer);
      if (reduce || slides.length < 2) return;
      timer = setInterval(() => {
        if (performance.now() < pauseUntil) return;
        if (document.hidden) return;
        to(idx + 1);
      }, 3400);
    };
    sig.addEventListener('abort', () => clearInterval(timer));
    tr.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal: sig });
    tr.addEventListener('pointerdown', bump, { passive: true, signal: sig });
    pick.forEach((b, i) => b.addEventListener('click', () => { bump(); to(i); }, { signal: sig }));
    /* 点角色：弹一下 */
    tr.addEventListener('click', (e) => {
      const c = e.target.closest('.ip-charw'); if (!c || !c.closest('.ip-slide.is-on')) return;
      const img = $('.ip-char', c); img.classList.remove('poke'); void img.offsetWidth; img.classList.add('poke');
      const n = document.createElement('i'); n.className = 'ip-note'; n.textContent = '♪'; n.style.left = (30 + Math.random() * 40) + '%';
      c.appendChild(n); setTimeout(() => n.remove(), 1200);
    }, { signal: sig });
    /* 鼠标拖动（桌面预览） */
    let down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; tr.classList.add('drag'); bump(); }, { signal: sig });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; tr.scrollLeft = sl - dx; }, { signal: sig });
    window.addEventListener('pointerup', () => {
      if (!down) return; down = false; tr.classList.remove('drag');
      if (moved) {
        const w = slides[0].offsetWidth + 12;
        to(Math.round(tr.scrollLeft / Math.max(1, w)));
      }
    }, { signal: sig });
    tr.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, { capture: true, signal: sig });
    update();
    arm();
  }

  /* 场景活动：叠牌 —— 前一张被后一张压住时缩小、变暗 */
  function initEvents(sig) {
    const cards = $$('.evc'); if (!cards.length) return;
    /* 卡片整卡可点进二级页 */
    const topPx = () => (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-h'), 10) || 52) + 48;
    let ticking = false;
    const update = () => {
      ticking = false;
      const base = topPx();
      cards.forEach((c, i) => {
        const nx = cards[i + 1];
        let k = 0;
        if (nx) {
          const stick = base + (i + 1) * 14, d = nx.getBoundingClientRect().top - stick;         // 0 = 刚好压上
          k = Math.max(0, Math.min(1, 1 - d / (c.offsetHeight * .8)));
        }
        c.style.setProperty('--k', k.toFixed(3));
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal: sig });
    window.addEventListener('resize', update, { signal: sig });
    update();
  }

  /* 图集灯箱：整张展示；双指 / 滚轮缩放，双击放大 / 还原，放大后可拖动；未放大时左右滑切换、下拉关闭 */
  let lbI = 0;
  const lbZ = { s: 1, x: 0, y: 0 };
  const LB_MAX = 5;
  function lbApply(anim) {
    const el = $('#lb'); if (!el) return;
    const z = $('.lb-z', el);
    if (anim) { z.classList.add('anim'); setTimeout(() => z.classList.remove('anim'), 260); }
    z.style.transform = `translate3d(${lbZ.x.toFixed(1)}px,${lbZ.y.toFixed(1)}px,0) scale(${lbZ.s.toFixed(3)})`;
    el.classList.toggle('zoomed', lbZ.s > 1.02);
  }
  function lbClamp() {
    const el = $('#lb'); if (!el) return;
    const st = $('.lb-stage', el), img = $('img', el);
    const mx = Math.max(0, (img.offsetWidth * lbZ.s - st.clientWidth) / 2), my = Math.max(0, (img.offsetHeight * lbZ.s - st.clientHeight) / 2);
    lbZ.x = Math.min(mx, Math.max(-mx, lbZ.x)); lbZ.y = Math.min(my, Math.max(-my, lbZ.y));
  }
  function lbZoomAt(ns, cx, cy, anim) {           // cx / cy：相对舞台中心的缩放锚点
    ns = Math.min(LB_MAX, Math.max(1, ns));
    const k = ns / lbZ.s;
    lbZ.x = cx - (cx - lbZ.x) * k; lbZ.y = cy - (cy - lbZ.y) * k; lbZ.s = ns;
    if (ns < 1.01) { lbZ.s = 1; lbZ.x = 0; lbZ.y = 0; }
    lbClamp(); lbApply(anim);
  }
  function lbReset() { lbZ.s = 1; lbZ.x = 0; lbZ.y = 0; lbApply(); }
  function lbBind(el) {
    const st = $('.lb-stage', el);
    const ptrs = new Map();
    let pinch = null, start = null, moved = false, lastTap = 0, lastPt = null;
    const rel = (x, y) => { const r = st.getBoundingClientRect(); return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 }; };
    st.addEventListener('pointerdown', (e) => {
      try { st.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: lbZ.s }; start = null;
      } else if (ptrs.size === 1) {
        start = { x: e.clientX, y: e.clientY, ox: lbZ.x, oy: lbZ.y }; moved = false;
      }
    });
    st.addEventListener('pointermove', (e) => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2 && pinch) {
        const [a, b] = [...ptrs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y), m = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
        lbZoomAt(pinch.s * d / pinch.d, m.x, m.y); moved = true;
      } else if (ptrs.size === 1 && start) {
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        if (lbZ.s > 1.02) { lbZ.x = start.ox + dx; lbZ.y = start.oy + dy; lbClamp(); lbApply(); }
      }
    });
    const up = (e) => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.delete(e.pointerId);
      if (pinch && ptrs.size < 2) { pinch = null; start = null; if (lbZ.s < 1.05) lbReset(); return; }
      if (ptrs.size || !start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y, zoomed = lbZ.s > 1.02;
      start = null;
      if (!zoomed && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { lbStep(dx < 0 ? 1 : -1); return; }
      if (!zoomed && dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) { lbClose(); return; }
      if (moved || e.type === 'pointercancel') return;
      const now = Date.now();
      if (now - lastTap < 320 && lastPt && Math.hypot(e.clientX - lastPt.x, e.clientY - lastPt.y) < 28) {
        lastTap = 0;
        if (zoomed) { lbZ.s = 1; lbZ.x = 0; lbZ.y = 0; lbApply(true); }
        else { const r = rel(e.clientX, e.clientY); lbZoomAt(2.6, r.x, r.y, true); }
      } else { lastTap = now; lastPt = { x: e.clientX, y: e.clientY }; }
    };
    st.addEventListener('pointerup', up);
    st.addEventListener('pointercancel', up);
    st.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = rel(e.clientX, e.clientY);
      lbZoomAt(lbZ.s * Math.exp(-e.deltaY * 0.0016), r.x, r.y);
    }, { passive: false });
  }
  function lbOpen(i) {
    lbI = i;
    let el = $('#lb');
    if (!el) {
      el = document.createElement('div'); el.id = 'lb'; el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      el.innerHTML = '<button class="lb-x" type="button" data-lb-x aria-label="关闭">×</button><div class="lb-stage"><div class="lb-z"><img alt="" draggable="false"></div></div><div class="lb-cap"></div><div class="lb-h">双指缩放 · 双击放大</div><div class="lb-n"></div><button class="lb-pv" type="button" data-lb-d="-1" aria-label="上一张">‹</button><button class="lb-nx" type="button" data-lb-d="1" aria-label="下一张">›</button>';
      app.appendChild(el);
      lbBind(el);
    }
    lbShow(0);
    requestAnimationFrame(() => el.classList.add('on'));
    document.body.style.overflow = 'hidden';
  }
  function lbShow(d) {
    const el = $('#lb'), it = LB[lbI]; if (!el || !it) return;
    const img = $('img', el), cap = $('.lb-cap', el);
    el.classList.toggle('one', LB.length < 2);
    lbReset();
    img.style.setProperty('--dx', (d * 40) + 'px');
    img.classList.remove('sw'); void img.offsetWidth;
    img.src = it.src; img.alt = it.name; cap.textContent = it.name;
    img.classList.add('sw');
    $('.lb-n', el).textContent = `${lbI + 1} / ${LB.length}`;
  }
  function lbStep(d) { if (LB.length < 2) return; lbI = (lbI + d + LB.length) % LB.length; lbShow(d); }
  function lbClose() {
    const el = $('#lb'); if (!el) return;
    el.classList.remove('on'); document.body.style.overflow = '';
    setTimeout(() => { if (!el.classList.contains('on')) el.remove(); }, 260);
  }

  /* ---------- 挖掘 · 声景长卷：自动行进 / 点亮 / 选点 ---------- */
  let mapAbort = null;
  function initMap() {
    if (mapAbort) mapAbort();
    const m = $('#smap'); if (!m) return;
    const inner = $('.smap-in', m), go = $('#smap-go'), bar = $('#sbar'), th = $('#sb-th');
    const pins = $$('.pin', m), sbs = $$('.sb', bar);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* 挖掘页锁死纵向滑动，仅长卷横向与展开文案可滑 */
    const lockY = (e) => {
      if (!app.classList.contains('is-dig')) return;
      const t = e.target;
      if (t.closest && (t.closest('.smap-sc') || t.closest('.ov-body') || t.closest('.pincard'))) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', lockY, { passive: false });
    /* 长卷高度随屏幕自适应：标题 + 长卷 + 滑动条一屏收齐 */
    const fit = () => {
      inner.style.zoom = 1;
      const h0 = inner.offsetHeight, vw = m.parentElement;
      const top = vw.getBoundingClientRect().top + scrollY;
      const tabs = $('.tabs');
      const mini = $('#mini'), mh = mini && !mini.hidden ? mini.offsetHeight : 0;
      const avail = innerHeight - top - bar.offsetHeight - (tabs ? tabs.offsetHeight : 58) - mh - 6;
      inner.style.zoom = Math.max(.52, Math.min(1, avail / h0)).toFixed(3);
    };
    /* 滑动条：长卷位置 ↔ 条上位置（按分段分段线性映射，保证段名与长卷位置一一对应） */
    const bc = BARW.reduce((a, w) => (a.push(a[a.length - 1] + w), a), [0]);
    const toBar = (f) => { f = Math.max(0, Math.min(1, f)); const i = Math.max(0, SEGSPAN.findIndex(([, a, b]) => f <= b)); const [, a, b] = SEGSPAN[i]; return bc[i] + (f - a) / (b - a) * BARW[i]; };
    const fromBar = (g) => { g = Math.max(0, Math.min(1, g)); let i = bc.findIndex((c, k) => k > 0 && g <= c) - 1; if (i < 0) i = 0; const [, a, b] = SEGSPAN[i]; return a + (g - bc[i]) / BARW[i] * (b - a); };
    m.scrollLeft = 0;                                   // 从最南端开始，向北展开
    /* 长卷始终全彩：不再用 --lit / .lit 做灰→金揭示 */
    inner.style.setProperty('--lit', '100%');
    pins.forEach((p) => p.classList.add('lit'));
    let reach = 0, raf = 0, auto = false, cur = -1;
    const upd = () => {
      const sw = m.scrollWidth, l = m.scrollLeft / sw, r = (m.scrollLeft + m.clientWidth) / sw;
      const gl = toBar(l), gr = toBar(r);
      th.style.left = (gl * 100) + '%'; th.style.width = ((gr - gl) * 100) + '%';
      const mid = (l + r) / 2, k = Math.max(0, SEGSPAN.findIndex(([, , b]) => mid <= b));
      if (k !== cur) { cur = k; sbs.forEach((e, i) => e.classList.toggle('is-on', i === k)); bar.setAttribute('aria-valuetext', SEGSPAN[k][3]); }
      bar.setAttribute('aria-valuenow', Math.round(gl * 100));
      if (r > reach) {                                                       // 目光所及的最北处（仅更新分段进度条）
        reach = r;
        SEGSPAN.forEach(([, a, b], i) => { sbs[i].firstElementChild.firstElementChild.style.width = (Math.max(0, Math.min(1, (reach - a) / (b - a))) * 100).toFixed(1) + '%'; });
      }
    };
    const stop = () => { auto = false; cancelAnimationFrame(raf); go.classList.remove('is-on'); go.querySelector('b').textContent = '沿线行进'; };
    const run = () => {
      stop();
      const max = m.scrollWidth - m.clientWidth, from = m.scrollLeft >= max - 4 ? 0 : m.scrollLeft;
      if (from === 0) { m.scrollLeft = 0; reach = 0; $$('.tr u', bar).forEach((u) => { u.style.width = '0%'; }); }
      const dur = Math.max(2500, (max - from) / max * 11000), t0 = performance.now();
      auto = true; go.classList.add('is-on'); go.querySelector('b').textContent = '停下';
      const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const step = (now) => {
        if (!auto) return;
        const k = Math.min(1, (now - t0) / dur);
        m.scrollLeft = from + (max - from) * ease(k);
        if (k < 1) raf = requestAnimationFrame(step); else stop();
      };
      raf = requestAnimationFrame(step);
    };
    fit(); upd();
    const onResize = () => { fit(); upd(); };
    window.addEventListener('resize', onResize);
    m.addEventListener('scroll', upd, { passive: true });
    /* 滑动条：点按 / 拖动即可定位长卷 */
    const scrub = (e) => { const rc = $('.sb-row', bar).getBoundingClientRect(); const f = fromBar((e.clientX - rc.left) / rc.width); m.scrollLeft = f * m.scrollWidth - m.clientWidth / 2; };
    let sd = false;
    bar.addEventListener('pointerdown', (e) => { stop(); closePin(); sd = true; bar.setPointerCapture(e.pointerId); scrub(e); e.preventDefault(); });
    bar.addEventListener('pointermove', (e) => { if (sd) scrub(e); });
    ['pointerup', 'pointercancel'].forEach((ev) => bar.addEventListener(ev, () => { sd = false; }));
    bar.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { stop(); m.scrollBy({ left: d * m.clientWidth * .5, behavior: 'smooth' }); e.preventDefault(); } });
    ['pointerdown', 'touchstart', 'wheel'].forEach((ev) => m.addEventListener(ev, () => { if (auto) stop(); }, { passive: true }));
    go.addEventListener('click', () => { auto ? stop() : run(); });
    /* 鼠标拖动 */
    let down = false, sx = 0, sl = 0, moved = false;
    m.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = m.scrollLeft; });
    const mv = (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; m.scrollLeft = sl - dx; };
    const up = () => { down = false; };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    m.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    /* 进入视野后自动行进一次（用户未触碰时） */
    let io = null, timer = 0;
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); timer = setTimeout(() => { if (!auto && m.scrollLeft < 8) run(); }, 700); } }, { threshold: .6 });
      io.observe(m);
    }
    mapAbort = () => {
      stop(); clearTimeout(timer); io && io.disconnect();
      document.removeEventListener('touchmove', lockY);
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('resize', onResize);
      mapAbort = null;
    };
    window.__map = { m, stop, upd, fit };
    if (Player.cur && isSnd(Player.cur.key)) { const ps = SOUNDS.find((x) => x.key === Player.cur.key); if (ps) pickPin(ps.id); }   // 带着正在播放的声音进入：弹出对应信息卡
  }

  const isSnd = (k) => /^s\d\d$/.test(k || '');
  function closePin() {
    const pc = $('#pincard'); if (pc) pc.classList.remove('on');
    $$('.pin.is-sel').forEach((p) => p.classList.remove('is-sel'));
    if (Player.cur && isSnd(Player.cur.key)) Player.stop();          // 挖掘页以弹窗代替全局条：关掉弹窗 = 停止播放
  }
  /* 点击景点：居中 + 底部信息卡 */
  function pickPin(id) {
    const s = byNo(id), m = $('#smap'); if (!s || !m) return;
    if (window.__map) window.__map.stop();
    const pin = $(`.pin[data-no="${s.id}"]`, m);
    $$('.pin.is-sel', m).forEach((p) => p.classList.remove('is-sel'));
    pin.classList.add('is-sel'); pin.classList.add('lit');
    const x = pin.getBoundingClientRect().left - m.getBoundingClientRect().left + m.scrollLeft - m.clientWidth / 2;
    m.scrollTo({ left: Math.max(0, x), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    const seg = SEG[s.seg];
    $('#pincard-in').innerHTML = `
      <div class="pc-pic">${photo(s)}</div>
      <div class="pc-tx"><small>NO.${s.id} · ${esc(seg.name)} · ${esc(seg.tag)}</small><b>${esc(s.name)}</b><span>${esc(s.place)}</span></div>
      ${playBtn(s.key)}
      <i class="pc-bar" data-scrub data-key="${s.key}"><i></i><b></b></i>
      <a class="pc-go" href="#/audio/${s.id}" aria-label="查看 ${esc(s.name)} 详情">详情<i>›</i></a>`;
    $('#pincard').classList.add('on');
    sync();
  }

  /* ---------- 阐释 · 卡片轮播（Coverflow） ---------- */
  function initCarousel(sig) {
    const root = $('#cf'), tr = $('#cf-track'); if (!root) return;
    const items = $$('.cf-item', tr);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = -1, ticking = false;
    const mid = () => tr.scrollLeft + tr.clientWidth / 2;
    const centerOf = (el) => el.offsetLeft + el.offsetWidth / 2;
    /* 卡片模式锁上下滑 */
    const lockY = (e) => {
      if (!$('#cf')) return;
      const t = e.target;
      if (t.closest && (t.closest('.cf-track') || t.closest('.ov-body'))) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', lockY, { passive: false, signal: sig });
    const update = () => {
      ticking = false;
      const c = mid(); let best = 0, bd = 1e9;
      items.forEach((el, i) => {
        const d = (centerOf(el) - c) / (el.offsetWidth * .92);
        const ad = Math.abs(d);
        el.style.setProperty('--k', (1 - Math.min(1, ad)).toFixed(3));
        if (ad < bd) { bd = ad; best = i; }
      });
      if (best !== idx) setActive(best);
      /* 当前卡强制满亮，避免首尾因对不齐中心而发灰 */
      if (items[idx]) items[idx].style.setProperty('--k', '1');
      barUpd();
    };
    const setActive = (i) => {
      idx = i; const s = ORDER[i], seg = SEG[s.seg];
      items.forEach((el, k) => {
        el.classList.toggle('is-on', k === i);
        if (k === i) el.style.setProperty('--k', '1');
      });
      root.dataset.seg = s.seg;
      $('#cf-cur').textContent = pad(i + 1);
      $('#cf-tag').textContent = `${seg.name} · ${seg.tag}`;
      const k = SEGSPAN.findIndex((x) => x[0] === s.seg);
      sbs.forEach((e, j) => e.classList.toggle('is-on', j === k));
      bar.setAttribute('aria-valuetext', SEGSPAN[k][3]);
    };
    /* 底部滑动条（与挖掘同一组件）：15 张卡片按 BARW 的分段宽度均分，滑块 = 当前卡片所占位置 */
    const bar = $('#cf-bar'), th = $('#cf-th'), sbs = $$('.sb', bar);
    const N = items.length;
    const bc = BARW.reduce((a, w) => (a.push(a[a.length - 1] + w), a), [0]);
    const sIdx = ORDER.map((s) => SEGSPAN.findIndex((x) => x[0] === s.seg));
    const cnt = BARW.map((_, i) => sIdx.filter((x) => x === i).length);
    const first = BARW.map((_, i) => sIdx.indexOf(i));
    const slotW = sIdx.map((i) => BARW[i] / cnt[i]);
    const slotC = sIdx.map((i, k) => bc[i] + BARW[i] * (k - first[i] + .5) / cnt[i]);
    const lerp = (a, b, t) => a + (b - a) * t;
    const cens = () => items.map(centerOf);
    let reachG = 0;
    const barUpd = () => {
      const cs = cens(), c = mid();
      let k = 0; while (k < N - 1 && c >= cs[k + 1]) k++;
      const t = k >= N - 1 ? 0 : Math.max(0, Math.min(1, (c - cs[k]) / (cs[k + 1] - cs[k])));
      const k2 = Math.min(N - 1, k + 1);
      const g = lerp(slotC[k], slotC[k2], t), w = lerp(slotW[k], slotW[k2], t);
      th.style.left = ((g - w / 2) * 100) + '%'; th.style.width = (w * 100) + '%';
      bar.setAttribute('aria-valuenow', Math.round((g - w / 2) * 100));
      if (g + w / 2 > reachG) {
        reachG = g + w / 2;
        BARW.forEach((bw, i) => { sbs[i].firstElementChild.firstElementChild.style.width = (Math.max(0, Math.min(1, (reachG - bc[i]) / bw)) * 100).toFixed(1) + '%'; });
      }
    };
    const scrub = (e) => {
      const rc = $('.sb-row', bar).getBoundingClientRect();
      const x = Math.max(slotC[0], Math.min(slotC[N - 1], (e.clientX - rc.left) / rc.width));
      let k = 0; while (k < N - 2 && x > slotC[k + 1]) k++;
      const t = (x - slotC[k]) / (slotC[k + 1] - slotC[k]), cs = cens();
      tr.scrollLeft = lerp(cs[k], cs[k + 1], Math.max(0, Math.min(1, t))) - tr.clientWidth / 2;
    };
    let sd = false;
    bar.addEventListener('pointerdown', (e) => { sd = true; tr.classList.add('drag'); bar.setPointerCapture(e.pointerId); scrub(e); e.preventDefault(); });
    bar.addEventListener('pointermove', (e) => { if (sd) scrub(e); });
    ['pointerup', 'pointercancel'].forEach((ev) => bar.addEventListener(ev, () => {
      if (!sd) return; sd = false; tr.classList.remove('drag');
      const cs = cens(), c = mid(); let b = 0, bd = 1e9; cs.forEach((x, i) => { const d = Math.abs(x - c); if (d < bd) { bd = d; b = i; } });
      to(b);
    }));
    bar.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { to(idx + d); e.preventDefault(); } });
    const to = (i, smooth = true) => {
      const el = items[Math.max(0, Math.min(items.length - 1, i))];
      const left = Math.max(0, Math.min(tr.scrollWidth - tr.clientWidth, centerOf(el) - tr.clientWidth / 2));
      tr.scrollTo({ left, behavior: smooth && !reduce ? 'smooth' : 'auto' });
      setActive(Math.max(0, Math.min(items.length - 1, i)));
    };
    tr.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    tr.addEventListener('click', (e) => {
      if (e.target.closest('a, [data-play]')) return;
      const it = e.target.closest('.cf-item'); if (!it) return;
      const i = +it.dataset.i;
      if (i !== idx) to(i); else location.hash = '#/sound/' + it.dataset.no;
    });
    /* 鼠标拖动（桌面预览） */
    let down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; tr.classList.add('drag'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; tr.scrollLeft = sl - dx; }, { signal: sig });
    window.addEventListener('pointerup', () => { if (!down) return; down = false; tr.classList.remove('drag'); if (moved) to(idx < 0 ? 0 : (() => { let b = 0, bd = 1e9; items.forEach((el, i) => { const d = Math.abs(centerOf(el) - mid()); if (d < bd) { bd = d; b = i; } }); return b; })()); }, { signal: sig });
    tr.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    requestAnimationFrame(() => { to(cfStart, false); update(); });
  }

  function buildRail(on) {
    if (spy) { spy.disconnect(); spy = null; }
    if (!on) return;
    spy = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { $$('#segbar button').forEach((b) => b.classList.toggle('is-on', b.dataset.jump === e.target.id)); } });
    }, { root: $('#ex-scroll'), rootMargin: '0px 0px -75% 0px' });
    $$('.seg').forEach((el) => spy.observe(el));
  }

  /* ---------- 播放状态同步 ---------- */
  function sync() {
    const cur = Player.cur;
    $$('[data-play]').forEach((b) => b.classList.toggle('is-playing', !!cur && b.dataset.play === cur.key && Player.playing));
    const mini = $('#mini');
    mini.hidden = !cur;
    const offMini = !!cur && isSnd(cur.key) && app.classList.contains('is-dig');   // 挖掘页：声音由信息卡弹窗承担，不出全局条
    mini.classList.toggle('is-snd', offMini);
    app.classList.toggle('has-mini', !!cur && !offMini);
    if (window.__map && $('#smap')) window.__map.fit();
    if (cur) {
      $('#mini-title').textContent = cur.title;
      $('#mini-sub').textContent = cur.sub;
      $('#mini-info').setAttribute('href', cur.href);
      $('#mini-btn').classList.toggle('is-playing', Player.playing);
      $('#mini-fill').style.width = (Player.dur ? (Player.t / Player.dur) * 100 : 0) + '%';
    }
    const ratio = cur && Player.dur ? Player.t / Player.dur : 0;
    $$('[data-scrub]').forEach((el) => {
      const on = cur && el.dataset.key === cur.key;
      const r = on ? ratio : 0;
      el.firstElementChild.style.width = (r * 100) + '%';
      el.lastElementChild.style.left = (r * 100) + '%';
    });
    $$('[data-wave]').forEach((el) => {
      const on = cur && el.dataset.wave === cur.key;
      const n = el.children.length, k = on ? Math.round(ratio * n) : 0;
      Array.from(el.children).forEach((c, i) => c.classList.toggle('on', i < k));
    });
    $$('[data-tcur]').forEach((el) => { el.textContent = cur && el.dataset.tcur === cur.key ? Player.fmt(Player.t) : '00:00'; });
    $$('[data-tdur]').forEach((el) => {
      const t = Player.tracks[el.dataset.tdur];
      el.textContent = cur && el.dataset.tdur === cur.key ? Player.fmt(Player.dur) : Player.fmt(t ? t.dur : 0);
    });
    /* 创化 · 二创音乐：贴点跟随播放队列 */
    const mu = $('#mu');
    if (mu && window.__setTrack) {
      const isTrack = !!cur && TRACK_KEYS.includes(cur.key);
      if (isTrack && cur.key !== muFollow) {
        muFollow = cur.key;
        const i = TRACK_KEYS.indexOf(cur.key);
        if (i !== muIdx) { window.__setTrack(i); return; }
      }
      mu.classList.toggle('is-playing', isTrack && Player.playing);
      $$('.mu-stop', mu).forEach((el, k) => el.classList.toggle('is-playing', isTrack && k === muIdx && Player.playing));
    }
  }
  let muFollow = null;
  Player.on(sync);

  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400);
  }
  const toasted = {};
  Player.onSim = (tr) => { if (!toasted[tr.key]) { toasted[tr.key] = 1; toast(`「${tr.title}」音频待导入，已用模拟进度演示`); } };

  /* 进度条 / 波形：支持点击与拖动 seek */
  function seekOnEl(el, clientX) {
    const key = el.dataset.key || el.dataset.wave;
    if (!key) return;
    const rc = el.getBoundingClientRect();
    const r = Math.min(1, Math.max(0, (clientX - rc.left) / Math.max(1, rc.width)));
    if (!(Player.cur && Player.cur.key === key)) {
      if (TRACK_KEYS.includes(key)) Player.play(key, TRACK_KEYS);
      else Player.play(key);
    }
    Player.seek(r);
  }
  let scrubDrag = null;
  document.addEventListener('pointerdown', (e) => {
    if (e.button != null && e.button !== 0) return;
    const el = e.target.closest('[data-scrub], [data-wave]');
    if (!el) return;
    e.preventDefault();
    scrubDrag = el;
    el.classList.add('is-drag');
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    seekOnEl(el, e.clientX);
  });
  document.addEventListener('pointermove', (e) => {
    if (!scrubDrag) return;
    seekOnEl(scrubDrag, e.clientX);
  });
  const endScrubDrag = () => {
    if (!scrubDrag) return;
    scrubDrag.classList.remove('is-drag');
    scrubDrag = null;
  };
  document.addEventListener('pointerup', endScrubDrag);
  document.addEventListener('pointercancel', endScrubDrag);

  /* ---------- 事件 ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    let el;
    if ((el = t.closest('[data-play]'))) {
      e.preventDefault(); e.stopPropagation();
      const key = el.dataset.play;
      Player.toggle(key, TRACK_KEYS.includes(key) ? TRACK_KEYS : []);
      return;
    }
    if ((el = t.closest('[data-playall]'))) {
      const keys = el.dataset.playall === 'ns' ? [...TRACK_KEYS].reverse() : TRACK_KEYS;
      Player.play(keys[0], keys);
      return;
    }
    if ((el = t.closest('[data-mu]'))) { muStep(el.dataset.mu === 'next' ? 1 : -1); return; }
    /* 波形 / 进度条上的点击由 pointer 处理，勿当成切站 */
    if ((el = t.closest('[data-mu-i]')) && !t.closest('[data-wave], [data-scrub], [data-play]')) {
      muPick(+el.dataset.muI); return;
    }
    if ((el = t.closest('[data-copy]'))) {
      const v = el.dataset.copy;
      const ok = () => { toast(`已复制 ${v}`); el.classList.remove('copied'); void el.offsetWidth; el.classList.add('copied'); };
      try { navigator.clipboard.writeText(v).then(ok, ok); } catch (err) { ok(); }
      return;
    }
    if ((el = t.closest('[data-lb]'))) { lbOpen(+el.dataset.lb); return; }
    if ((el = t.closest('[data-lb-x]'))) { lbClose(); return; }
    if ((el = t.closest('[data-lb-d]'))) { lbStep(+el.dataset.lbD); return; }
    if (t.classList && t.classList.contains('lb')) { lbClose(); return; }
    if ((el = t.closest('[data-toast]'))) { toast(el.dataset.toast); return; }
    if ((el = t.closest('[data-go]'))) { location.hash = el.dataset.go; return; }
    if ((el = t.closest('[data-mode]'))) { if (exMode !== el.dataset.mode) { exMode = el.dataset.mode; swapEx(); } return; }
    if ((el = t.closest('[data-fold]'))) { const f = document.getElementById(el.dataset.fold), on = !f.classList.contains('is-open'); f.classList.toggle('is-open', on); el.classList.toggle('is-open', on); el.setAttribute('aria-expanded', on); return; }
    if ((el = t.closest('[data-dig-open]'))) { digOv(true); return; }
    if ((el = t.closest('[data-dig-close]'))) { if (t.closest('#dig-ov p')) return; digOv(false); return; }
    if ((el = t.closest('[data-pc-close]'))) { closePin(); return; }
    if ((el = t.closest('[data-pin]'))) { pickPin(el.dataset.pin); return; }
    if ((el = t.closest('[data-jump]'))) { const target = document.getElementById(el.dataset.jump); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-go]')) { e.preventDefault(); location.hash = e.target.dataset.go; }
  });

  $('#mini-btn').addEventListener('click', () => { if (Player.cur) Player.toggle(Player.cur.key); });
  $('#mini-close').addEventListener('click', () => Player.stop());
  $('#mini-next').addEventListener('click', () => { if (!Player.next()) toast('已是最后一段'); });
  function syncSnd() {
    const b = $('#snd');
    b.classList.toggle('is-off', Player.muted);
    b.querySelector('span').textContent = Player.muted ? '声音 关' : '声音 开';
  }
  $('#snd').addEventListener('click', () => { Player.setMuted(!Player.muted); syncSnd(); });

  window.addEventListener('hashchange', () => render());
  syncSnd();
  render();
})();
