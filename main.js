/* Pip's Midnight Nursery — interactions. Vanilla JS, zero dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- sound engine (Web Audio, created only on user gesture) ---------- */
  var actx = null;
  var muted = storeGet("pip-muted") === "1";
  function ac() {
    if (!actx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  function tone(freq, t0, dur, type, vol) {
    if (muted) return;
    try {
      var c = ac(); if (!c) return;
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) {}
  }
  function pop() {
    if (muted) return;
    try { var c = ac(); if (c) tone(520, c.currentTime, 0.08, "triangle", 0.1); } catch (e) {}
  }
  function giggle() {
    if (muted) return;
    try {
      var c = ac(); if (!c) return;
      var t = c.currentTime;
      [660, 780, 920, 780, 660].forEach(function (f, i) { tone(f, t + i * 0.09, 0.12, "sine", 0.09); });
    } catch (e) {}
  }

  /* click sounds on interactive elements */
  document.addEventListener("click", function (e) {
    if (e.target.closest("button, a")) pop();
  });

  /* ---------- mute toggle (required, always visible) ---------- */
  var muteBtn = $("#muteBtn");
  function renderMute() {
    if (!muteBtn) return;
    muteBtn.textContent = muted ? "🔇" : "🔊";
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.title = muted ? "Unmute sounds" : "Mute sounds";
  }
  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      muted = !muted;
      storeSet("pip-muted", muted ? "1" : "0");
      renderMute();
      if (!muted) pop();
    });
    renderMute();
  }

  /* ---------- lullaby lab: generative music-box melody ---------- */
  var MELODY = [261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0,
                349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63];
  var playing = false;
  var lullabyBtn = $("#lullabyBtn"), lullabyStatus = $("#lullabyStatus");
  if (lullabyBtn) {
    lullabyBtn.addEventListener("click", function () {
      if (playing) return;
      if (muted && lullabyStatus) {
        lullabyStatus.textContent = "🔇 Muted — tap the speaker button (bottom-right) to hear it!";
        return;
      }
      playing = true;
      lullabyBtn.textContent = "♫ playing…";
      try {
        var c = ac(); if (!c) throw 0;
        var t0 = c.currentTime + 0.06;
        MELODY.forEach(function (f, i) {
          tone(f, t0 + i * 0.42, 0.95, "triangle", 0.11);
          tone(f * 2, t0 + i * 0.42, 0.5, "sine", 0.035);
        });
      } catch (e) {}
      setTimeout(function () {
        playing = false;
        lullabyBtn.innerHTML = "▶ Play tonight's lullaby";
        if (lullabyStatus) lullabyStatus.textContent = "Sweet dreams. Pip will compose a new one tomorrow.";
      }, MELODY.length * 420 + 700);
    });
  }

  /* ---------- Pip hero: tilt toward cursor + click giggle + easter egg ---------- */
  var pipHero = $("#pipHero"), eggMsg = $("#eggMsg");
  var pipClicks = 0, eggDone = false;
  function secretLullaby() {
    confetti();
    if (eggMsg) eggMsg.hidden = false;
    try {
      var c = ac(); if (!c) return;
      var t0 = c.currentTime + 0.05;
      [523.25, 587.33, 659.25, 783.99, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone(f, t0 + i * 0.3, 0.65, "triangle", 0.11);
      });
    } catch (e) {}
    if (eggMsg) eggMsg.scrollIntoView({ block: "nearest", behavior: prefersReduced ? "auto" : "smooth" });
  }
  if (pipHero) {
    pipHero.addEventListener("click", function () {
      pipHero.classList.remove("boing");
      void pipHero.offsetWidth; /* restart animation */
      pipHero.classList.add("boing");
      giggle();
      pipClicks++;
      if (pipClicks >= 5 && !eggDone) { eggDone = true; secretLullaby(); }
    });
    if (finePointer && !prefersReduced) {
      var tx = 0, ty = 0, cx = 0, cy = 0;
      window.addEventListener("pointermove", function (e) {
        tx = e.clientX / window.innerWidth - 0.5;
        ty = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
      (function loop() {
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
        pipHero.style.transform = "translate(" + (cx * 24) + "px," + (cy * 18) + "px) rotate(" + (cx * 7) + "deg)";
        requestAnimationFrame(loop);
      })();
    } else {
      pipHero.classList.add("floaty"); /* touch fallback: gentle bob */
    }
  }

  /* ---------- confetti (hand-rolled, no library) ---------- */
  var cvs = $("#confetti"), parts = [], rafId = null, ctx = null;
  if (cvs) ctx = cvs.getContext("2d");
  function confetti() {
    if (!ctx) return;
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;
    var colors = ["#a34063", "#f5c542", "#7bc96f", "#5aa9e6", "#ffffff"];
    for (var i = 0; i < 90; i++) {
      parts.push({
        x: Math.random() * cvs.width, y: -20 - Math.random() * cvs.height * 0.3,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
        c: colors[i % colors.length],
        vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3,
        r: Math.random() * Math.PI, vr: -0.1 + Math.random() * 0.2
      });
    }
    if (!rafId) tick();
  }
  function tick() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    parts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    parts = parts.filter(function (p) { return p.y < cvs.height + 30; });
    if (parts.length) { rafId = requestAnimationFrame(tick); }
    else { rafId = null; ctx.clearRect(0, 0, cvs.width, cvs.height); }
  }

  /* ---------- sparkle cursor trail (skips touch + reduced motion) ---------- */
  if (finePointer && !prefersReduced) {
    var last = 0;
    var sparkColors = ["#a34063", "#f5c542", "#8a6fbf"];
    window.addEventListener("pointermove", function (e) {
      var now = performance.now();
      if (now - last < 45) return;
      last = now;
      var s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = "✦";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.color = sparkColors[(Math.random() * sparkColors.length) | 0];
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 950);
    }, { passive: true });
  }

  /* ---------- hit counter odometer ---------- */
  var hitEl = $("#hitCounter");
  if (hitEl) {
    var visits = parseInt(storeGet("pip-visits") || "0", 10) || 0;
    visits++;
    storeSet("pip-visits", String(visits));
    var fmt = function (n) { return String(n).padStart(6, "0"); };
    if (prefersReduced) { hitEl.textContent = fmt(visits); }
    else {
      var t0 = performance.now(), dur = 1200;
      var step = function (t) {
        var p = Math.min(1, (t - t0) / dur);
        hitEl.textContent = fmt(Math.round(visits * p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  /* ---------- guestbook: Firebase live wall, localStorage fallback ---------- */
  var GB_KEY = "pip-guestbook";
  var wall = $("#gbWall"), gbForm = $("#gbForm");
  var SEEDS = [
    { n: "Luna the moth", w: "wish: extra-fluffy clouds over Willow Lane tonight" },
    { n: "Grumble the gremlin", w: "wish: a lullaby with no scary verse (there is no scary verse)" }
  ];

  function gbEntryNode(en) {
    var li = document.createElement("li");
    var b = document.createElement("strong"); b.textContent = "💭 " + en.n;
    var p = document.createElement("p"); p.textContent = en.w;
    li.appendChild(b); li.appendChild(p);
    return li;
  }
  function gbRenderList(list) {
    if (!wall) return;
    wall.innerHTML = "";
    var seen = {};
    list.slice(0, 30).forEach(function (en) {
      var k = (en.n || "") + "|" + (en.w || "");
      if (seen[k]) return; /* hide duplicate seeds from the first-visitor race */
      seen[k] = true;
      wall.appendChild(gbEntryNode(en));
    });
  }
  function gbLocalLoad() {
    var entries = null;
    try { entries = JSON.parse(storeGet(GB_KEY) || "null"); } catch (e) { entries = null; }
    return (entries && entries.length) ? entries : SEEDS.slice();
  }

  /* Firebase is live only when the SDK loaded AND real config values are pasted in. */
  var firebaseOK = false;
  try {
    firebaseOK = typeof firebase !== "undefined" &&
      typeof PIP_FIREBASE_CONFIG !== "undefined" &&
      PIP_FIREBASE_CONFIG.apiKey.indexOf("PASTE") !== 0;
  } catch (e) { firebaseOK = false; }

  if (firebaseOK) {
    try {
      firebase.initializeApp(PIP_FIREBASE_CONFIG);
      var dbRef = firebase.database().ref("guestbook");
      dbRef.limitToLast(30).on("value", function (snap) {
        var list = [];
        snap.forEach(function (child) { list.push(child.val()); });
        list.reverse(); /* newest first */
        if (!list.length) {
          /* first visitor seeds the wall; fixed keys make simultaneous seeds idempotent */
          SEEDS.forEach(function (s, i) {
            try {
              var p = dbRef.child("seed-" + i).set({ n: s.n, w: s.w, t: firebase.database.ServerValue.TIMESTAMP });
              if (p && p.catch) p.catch(function () {});
            } catch (e) {}
          });
          gbRenderList(SEEDS);
        } else {
          gbRenderList(list);
        }
      }, function () { gbRenderList(gbLocalLoad()); /* read failed → local fallback */ });
    } catch (e) { firebaseOK = false; gbRenderList(gbLocalLoad()); }
  } else {
    gbRenderList(gbLocalLoad());
  }

  if (gbForm) {
    gbForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#gbName").value.trim().slice(0, 24);
      var wish = $("#gbWish").value.trim().slice(0, 140);
      if (!name || !wish) return;
      var pushed = false;
      if (firebaseOK) {
        try {
          firebase.database().ref("guestbook").push({
            n: name, w: wish, t: firebase.database.ServerValue.TIMESTAMP
          });
          pushed = true; /* the live listener re-renders automatically */
        } catch (err) { pushed = false; }
      }
      if (!pushed) {
        var entries = gbLocalLoad();
        entries.unshift({ n: name, w: wish });
        storeSet(GB_KEY, JSON.stringify(entries.slice(0, 50)));
        gbRenderList(entries);
      }
      gbForm.reset();
      pop();
    });
  }

  /* ---------- growth chart: bars grow on scroll, tap a bar for its story ---------- */
  var growthWall = $("#growthWall"), growthFact = $("#growthFact");
  if (growthWall) {
    try {
      var gio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) { growthWall.classList.add("grown"); gio.disconnect(); }
        });
      }, { threshold: 0.25 });
      gio.observe(growthWall);
    } catch (e) { growthWall.classList.add("grown"); }
    /* click sound comes from the global button handler; here we only swap the fact text */
    $$(".grow-row", growthWall).forEach(function (row) {
      row.addEventListener("click", function () {
        if (growthFact) growthFact.textContent = "📏 " + row.getAttribute("data-fact");
      });
    });
  }

  /* ---------- block tower mini-game ---------- */
  var towerWrap = $("#towerWrap"), towerInner = $("#towerInner"),
      towerBtn = $("#towerBtn"), towerScore = $("#towerScore"),
      towerBest = $("#towerBest"), towerMsg = $("#towerMsg"), towerTip = $("#towerTip");
  var BLOCK_H = 26, MIN_W = 10, PERFECT_PX = 8;
  var TCOLORS = ["#a34063", "#f5c542", "#7bc96f", "#5aa9e6", "#b388eb"];
  var TG = null, movingEl = null, rafT = null;

  function tBestGet() { return parseInt(storeGet("pip-tower-best") || "0", 10) || 0; }
  function tAreaW() { return towerWrap ? towerWrap.clientWidth : 300; }
  function tTone(f, d, type, v) {
    if (muted) return;
    try { var c = ac(); if (c) tone(f, c.currentTime, d, type, v); } catch (e) {}
  }
  function tBlockEl(x, w, color, bottom) {
    var d = document.createElement("div");
    d.className = "tower-block";
    d.style.left = x + "px"; d.style.width = w + "px";
    d.style.bottom = bottom + "px"; d.style.background = color;
    return d;
  }
  function tCamera() {
    if (!TG || !towerWrap) return;
    var need = TG.blocks.length * BLOCK_H - (towerWrap.clientHeight - 80);
    towerInner.style.transform = need > 0 ? "translateY(" + need + "px)" : "";
  }
  function tFloat(text) {
    var f = document.createElement("div");
    f.className = "tower-float"; f.textContent = text;
    towerWrap.appendChild(f);
    setTimeout(function () { f.remove(); }, 950);
  }
  function tSpawnMoving() {
    var W = tAreaW(), prev = TG.blocks[TG.blocks.length - 1];
    TG.col = TCOLORS[TG.blocks.length % TCOLORS.length];
    var startLeft = Math.random() < 0.5;
    TG.mx = startLeft ? 0 : W - prev.w;
    TG.dir = startLeft ? 1 : -1;
    TG.speed = Math.min(6, 2 + TG.score * 0.15);
    movingEl = tBlockEl(TG.mx, prev.w, TG.col, TG.blocks.length * BLOCK_H);
    towerInner.appendChild(movingEl);
  }
  function tLoop() {
    if (!TG || !TG.playing) return;
    var W = tAreaW(), prev = TG.blocks[TG.blocks.length - 1];
    TG.mx += TG.dir * TG.speed;
    if (TG.mx <= 0) { TG.mx = 0; TG.dir = 1; }
    if (TG.mx + prev.w >= W) { TG.mx = W - prev.w; TG.dir = -1; }
    if (movingEl) movingEl.style.left = TG.mx + "px";
    rafT = requestAnimationFrame(tLoop);
  }
  function tGameOver() {
    TG.playing = false;
    if (movingEl) { movingEl.remove(); movingEl = null; }
    if (rafT) cancelAnimationFrame(rafT);
    var best = tBestGet();
    if (TG.score > best) { storeSet("pip-tower-best", String(TG.score)); best = TG.score; }
    towerBest.textContent = best;
    tTone(400, 0.15, "triangle", 0.12);
    setTimeout(function () { tTone(300, 0.15, "triangle", 0.12); }, 140);
    setTimeout(function () { tTone(200, 0.28, "triangle", 0.12); }, 280);
    towerMsg.innerHTML = "";
    var t1 = document.createElement("div");
    t1.textContent = "🌙 Tower tumbled at " + TG.score + " blocks!";
    var t2 = document.createElement("div");
    t2.textContent = "Pip says: \"again! again!\"";
    towerMsg.appendChild(t1); towerMsg.appendChild(t2);
    towerMsg.hidden = false;
    towerBtn.textContent = "↻ Stack again";
    towerBtn.disabled = false;
  }
  function tDrop() {
    if (!TG || !TG.playing || !movingEl) return;
    var prev = TG.blocks[TG.blocks.length - 1];
    var x = TG.mx, w = prev.w;
    var newX, newW, perfect = false;
    if (Math.abs(x - prev.x) < PERFECT_PX) { newX = prev.x; newW = w; perfect = true; }
    else {
      var left = Math.max(x, prev.x), right = Math.min(x + w, prev.x + prev.w);
      if (right - left < MIN_W) { tGameOver(); return; }
      newX = left; newW = right - left;
      var cutX = x < prev.x ? x : right;
      var cutW = x < prev.x ? left - x : (x + w) - right;
      if (cutW > 1) {
        var cut = tBlockEl(cutX, cutW, TG.col, TG.blocks.length * BLOCK_H);
        towerInner.appendChild(cut);
        requestAnimationFrame(function () { cut.classList.add("falling"); });
        setTimeout(function () { cut.remove(); }, 700);
      }
    }
    movingEl.remove(); movingEl = null;
    TG.blocks.push({ x: newX, w: newW });
    towerInner.appendChild(tBlockEl(newX, newW, TG.col, (TG.blocks.length - 1) * BLOCK_H));
    TG.score++;
    towerScore.textContent = TG.score;
    if (perfect) {
      tTone(880, 0.15, "sine", 0.12);
      setTimeout(function () { tTone(1174, 0.22, "sine", 0.1); }, 90);
      tFloat("✨ Perfect!");
    } else { tTone(180, 0.12, "triangle", 0.14); }
    tCamera();
    tSpawnMoving();
  }
  function tStart() {
    if (!towerWrap || !towerInner) return;
    if (rafT) cancelAnimationFrame(rafT);
    towerInner.innerHTML = "";
    towerMsg.hidden = true;
    var W = tAreaW();
    var bw = Math.min(200, Math.floor(W * 0.62));
    TG = { blocks: [{ x: Math.floor((W - bw) / 2), w: bw }], score: 0,
           playing: true, mx: 0, dir: 1, speed: 2, col: TCOLORS[1] };
    towerInner.appendChild(tBlockEl(TG.blocks[0].x, bw, TCOLORS[0], 0));
    towerScore.textContent = "0";
    towerBest.textContent = tBestGet();
    towerBtn.textContent = "⬇ Tap the tower to drop";
    towerBtn.disabled = true;
    if (towerTip) towerTip.textContent = "👆 Tap the tower area to drop each swinging block. Line them up!";
    tCamera();
    tSpawnMoving();
    tLoop();
  }
  if (towerWrap && towerBtn) {
    towerBest.textContent = tBestGet();
    towerBtn.addEventListener("click", tStart);
    towerWrap.addEventListener("click", tDrop);
  }

  /* ---------- day / night mode ---------- */
  function setNight(on) {
    document.body.classList.toggle("night", on);
    storeSet("pip-night", on ? "1" : "0");
    ["#dayNightBtn", "#dayNightBtn2"].forEach(function (id) {
      var b = $(id);
      if (b) { b.textContent = on ? "☀️ Day mode" : "🌙 Night mode"; b.setAttribute("aria-pressed", String(on)); }
    });
  }
  ["#dayNightBtn", "#dayNightBtn2"].forEach(function (id) {
    var b = $(id);
    if (b) b.addEventListener("click", function () { setNight(!document.body.classList.contains("night")); });
  });
  setNight(storeGet("pip-night") === "1");

  /* ---------- chaos mode ---------- */
  var chaosBtn = $("#chaosBtn");
  function setChaos(on) {
    document.body.classList.toggle("chaos", on);
    storeSet("pip-chaos", on ? "1" : "0");
    if (chaosBtn) {
      chaosBtn.textContent = on ? "🌀 Calm it down" : "🌀 Chaos mode";
      chaosBtn.setAttribute("aria-pressed", String(on));
    }
  }
  if (chaosBtn) chaosBtn.addEventListener("click", function () { setChaos(!document.body.classList.contains("chaos")); });
  setChaos(storeGet("pip-chaos") === "1");

  /* ---------- scroll reveals ---------- */
  try {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } catch (e) {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }
})();
