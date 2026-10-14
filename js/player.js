/* ============================================================
   全站唯一播放器：切页不断声。
   - 音频文件存在 → 真实播放
   - 音频文件缺失 → 以“占位 · 模拟进度”演示交互，并提示一次
   ============================================================ */
(function () {
  const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };

  const Player = {
    tracks: {}, cur: null, audio: null, sim: false, t: 0, dur: 0,
    playing: false, timer: null, queue: [], muted: false, subs: [], onSim: null,
    fmt,

    register(list) { list.forEach((t) => { this.tracks[t.key] = t; }); },
    on(fn) { this.subs.push(fn); },
    emit() { this.subs.forEach((f) => f(this)); },

    _clear() {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      if (this.audio) {
        this.audio.onended = this.audio.onerror = this.audio.ontimeupdate = this.audio.onloadedmetadata = null;
        try { this.audio.pause(); } catch (e) { /* noop */ }
        this.audio = null;
      }
    },

    _startSim() {
      this.sim = true;
      this.dur = this.cur.dur || 30;
      if (this.onSim) this.onSim(this.cur);
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (!this.playing) return;
        this.t += 0.25;
        if (this.t >= this.dur) { this._ended(); return; }
        this.emit();
      }, 250);
      this.emit();
    },

    _ended() {
      this.t = 0;
      if (!this.next()) { this.playing = false; this._clear(); }
      this.emit();
    },

    play(key, queue) {
      const tr = this.tracks[key];
      if (!tr) return;
      if (queue) this.queue = queue;
      this._clear();
      this.cur = tr; this.t = 0; this.sim = false; this.dur = tr.dur || 30; this.playing = true;
      const a = new Audio();
      a.preload = 'auto';
      a.muted = this.muted;
      a.onloadedmetadata = () => { if (isFinite(a.duration)) { this.dur = a.duration; this.emit(); } };
      a.ontimeupdate = () => { this.t = a.currentTime; this.emit(); };
      a.onended = () => this._ended();
      a.onerror = () => { if (this.audio === a) { this._clear(); this._startSim(); } };
      this.audio = a;
      a.src = tr.src;
      const p = a.play();
      if (p && p.catch) {
        p.catch((err) => {
          if (this.audio !== a) return;
          if (err && err.name === 'NotAllowedError') { this.playing = false; this.emit(); return; }
          this._clear(); this._startSim();
        });
      }
      this.emit();
    },

    resume() {
      if (!this.cur) return;
      this.playing = true;
      if (this.audio && !this.sim) { const p = this.audio.play(); if (p && p.catch) p.catch(() => {}); }
      this.emit();
    },

    pause() {
      this.playing = false;
      if (this.audio && !this.sim) this.audio.pause();
      this.emit();
    },

    stop() {                       // 关闭全局声音条：停止播放并清空当前曲目
      this._clear();
      this.cur = null; this.playing = false; this.t = 0; this.dur = 0; this.sim = false; this.queue = [];
      this.emit();
    },

    toggle(key, queue) {
      if (this.cur && this.cur.key === key) { this.playing ? this.pause() : this.resume(); }
      else this.play(key, queue);
    },

    seek(r) {
      if (!this.cur) return;
      r = Math.min(1, Math.max(0, r));
      let d = this.dur;
      if (this.audio && !this.sim && isFinite(this.audio.duration) && this.audio.duration > 0) d = this.audio.duration;
      if (!(d > 0)) d = this.cur.dur || 30;
      this.dur = d;
      this.t = r * d;
      if (this.audio && !this.sim) {
        try { this.audio.currentTime = this.t; } catch (e) { /* not ready yet */ }
      }
      this.emit();
    },

    next() {
      if (!this.cur || !this.queue.length) return false;
      const i = this.queue.indexOf(this.cur.key);
      if (i < 0 || i >= this.queue.length - 1) return false;
      this.play(this.queue[i + 1]);
      return true;
    },

    setMuted(m) { this.muted = m; if (this.audio) this.audio.muted = m; this.emit(); }
  };

  window.Player = Player;
})();
