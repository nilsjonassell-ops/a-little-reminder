/* ==========================================================
   A LITTLE REMINDER — script.js
   Vanilla JS, keine Abhängigkeiten.
   ========================================================== */
(() => {
  "use strict";

  /* ---------- Zeitplan (Millisekunden) ----------
     Hier lässt sich das Tempo der Szenen anpassen. */
  const TIMING = {
    skyIn:        150,   // Himmel blendet ein
    hello:       1100,   // „Hey, du.“
    shootingStar: 3300,  // Sternschnuppe startet
    shootingDur:  1500,  // Dauer der Sternschnuppe
    subline:     5000,   // „Ich wollte dir etwas schicken …“
    star:        6900,   // der besondere Stern erscheint
    starReady:   7600,   // Stern ist antippbar
    hint:        8200,   // „Tippe auf den Stern.“
    // nach dem Tippen:
    toMessage:   1050,   // Wechsel zur Nachricht
    lineStep:     750,   // Abstand zwischen den Absätzen
    pauseExtra:   350,   // kleine Kunstpause vor „Mehr wollte ich …“
    outroDelay:   900,   // „Take care.“ nach dem letzten Absatz
    ambientMin: 10000,   // gelegentliche Sternschnuppen im Endzustand
    ambientMax: 18000
  };

  const TIMING_REDUCED = {
    skyIn: 0, hello: 250, subline: 1100, star: 1900, starReady: 1900, hint: 2100,
    toMessage: 450, lineStep: 300, pauseExtra: 0, outroDelay: 300
  };

  /* ---------- Elemente ---------- */
  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const canvas = $("stars");
  const ctx = canvas.getContext("2d");
  const intro = $("intro");
  const hello = $("hello");
  const subline = $("subline");
  const hint = $("hint");
  const star = $("wishStar");
  const message = $("message");
  const messageText = $("messageText");
  const replayBtn = $("replay");
  const msgLines = Array.from(message.querySelectorAll(".line"));

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;

  /* ==========================================================
     STERNENHIMMEL (ein Canvas, ein requestAnimationFrame-Loop)
     ========================================================== */
  let W = 0, H = 0, DPR = 1;
  let stars = [];
  let shooters = [];
  let rafId = 0;
  let lastT = 0;
  let boost = 0;            // kurzes Aufleuchten beim Tippen
  let builtForArea = 0;

  // Vorgerenderte Leuchtpunkte (sehr günstig zu zeichnen)
  function makeSprite(r, g, b) {
    const s = 64;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const x = c.getContext("2d");
    const grd = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0,    `rgba(255,255,255,1)`);
    grd.addColorStop(0.12, `rgba(${r},${g},${b},0.9)`);
    grd.addColorStop(0.32, `rgba(${r},${g},${b},0.22)`);
    grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);
    x.fillStyle = grd;
    x.fillRect(0, 0, s, s);
    return c;
  }
  const SPRITES = [
    makeSprite(221, 230, 255),  // kühles Weiß
    makeSprite(255, 255, 255),  // weiß
    makeSprite(255, 236, 214),  // warm
    makeSprite(190, 180, 240)   // leicht violett
  ];

  const rand = (a, b) => a + Math.random() * (b - a);

  function buildStars() {
    const area = W * H;
    const count = Math.round(Math.min(520, Math.max(140, area / 1500)));
    stars = [];
    for (let i = 0; i < count; i++) {
      // drei Tiefenebenen: fern (viele, klein, langsam) bis nah (wenige, größer)
      const roll = Math.random();
      const layer = roll < 0.62 ? 0 : roll < 0.9 ? 1 : 2;
      const size = layer === 0 ? rand(0.35, 0.8) : layer === 1 ? rand(0.7, 1.2) : rand(1.1, 1.9);
      const twinkles = Math.random() < (layer === 0 ? 0.3 : 0.55);
      const spriteRoll = Math.random();
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: size,
        a: layer === 0 ? rand(0.25, 0.6) : layer === 1 ? rand(0.45, 0.85) : rand(0.7, 1),
        speed: [0.003, 0.006, 0.011][layer],           // Bildschirmbreiten pro Sekunde (sehr langsam)
        tw: twinkles ? rand(0.25, 0.6) : 0,
        tws: rand(0.6, 1.8),
        ph: Math.random() * Math.PI * 2,
        sp: spriteRoll < 0.55 ? 0 : spriteRoll < 0.8 ? 1 : spriteRoll < 0.93 ? 2 : 3
      });
    }
    builtForArea = area;
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Nur neu verteilen, wenn sich die Fläche deutlich ändert
    // (z. B. nicht, wenn Safari die Adressleiste ein-/ausblendet).
    const area = W * H;
    if (!stars.length || Math.abs(area - builtForArea) / builtForArea > 0.35) buildStars();
    if (reduced || !rafId) draw(performance.now(), 0);
  }

  /* ---------- Sternschnuppen ---------- */
  function launchShootingStar(opts = {}) {
    if (reduced) return;
    const fromRight = opts.fromRight ?? Math.random() < 0.6;
    const x0 = fromRight ? W * rand(0.72, 0.95) : W * rand(0.05, 0.28);
    const y0 = H * (opts.high ? rand(0.04, 0.08) : rand(0.06, 0.2));
    const len = Math.min(W, H) * rand(0.75, 0.95) * (opts.scale ?? 1);
    const deg = opts.high ? rand(22, 27) : rand(26, 34);
    const angle = (fromRight ? 180 - deg : deg) * Math.PI / 180;
    shooters.push({
      x0, y0,
      x1: x0 + Math.cos(angle) * len,
      y1: y0 + Math.sin(angle) * len,
      t0: performance.now(),
      dur: opts.dur ?? TIMING.shootingDur,
      intensity: opts.intensity ?? 1,
      width: opts.width ?? 1.6
    });
  }

  // sanftes Beschleunigen & Abbremsen
  const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

  function drawShooter(s, now) {
    const t = (now - s.t0) / s.dur;
    if (t >= 1) return false;
    const head = easeInOut(Math.max(0, t));
    const tail = easeInOut(Math.max(0, t - 0.28));
    const hx = s.x0 + (s.x1 - s.x0) * head;
    const hy = s.y0 + (s.y1 - s.y0) * head;
    const tx = s.x0 + (s.x1 - s.x0) * tail;
    const ty = s.y0 + (s.y1 - s.y0) * tail;
    const life = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.7) * s.intensity;

    const grd = ctx.createLinearGradient(tx, ty, hx, hy);
    grd.addColorStop(0, "rgba(221,230,255,0)");
    grd.addColorStop(0.7, `rgba(221,230,255,${0.35 * life})`);
    grd.addColorStop(1, `rgba(255,255,255,${0.95 * life})`);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = grd;
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(hx, hy);
    ctx.stroke();

    // weicher Kopf
    const g = 16 * (0.6 + 0.4 * s.intensity);
    ctx.globalAlpha = life;
    ctx.drawImage(SPRITES[0], hx - g / 2, hy - g / 2, g, g);
    return true;
  }

  /* ---------- Zeichnen ---------- */
  function draw(now, dt) {
    ctx.clearRect(0, 0, W, H);
    const tSec = now / 1000;
    const b = 1 + boost;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!reduced && dt) {
        // langsame Drift nach links oben, unendlich umlaufend
        s.x -= s.speed * dt;
        s.y -= s.speed * 0.35 * dt;
        if (s.x < -0.02) s.x += 1.04;
        if (s.y < -0.02) s.y += 1.04;
      }
      let a = s.a;
      if (s.tw && !reduced) a *= 1 - s.tw * (0.5 + 0.5 * Math.sin(tSec * s.tws + s.ph));
      a = Math.min(1, a * b);
      const size = s.r * 7;
      ctx.globalAlpha = a;
      ctx.drawImage(SPRITES[s.sp], s.x * W - size / 2, s.y * H - size / 2, size, size);
    }

    if (shooters.length) shooters = shooters.filter((s) => drawShooter(s, now));
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0;
    lastT = now;
    if (boost > 0) boost = Math.max(0, boost - dt * 0.6);
    draw(now, dt);
    rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (reduced || rafId) return;
    lastT = 0;
    rafId = requestAnimationFrame(loop);
  }
  function stopLoop() {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  /* ==========================================================
     ABLAUF / SZENEN
     ========================================================== */
  let timers = [];
  let ambientTimer = 0;
  let opened = false;

  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const T = () => (reduced ? { ...TIMING, ...TIMING_REDUCED } : TIMING);
  const show = (el) => el.classList.add("is-visible");

  function runIntro(isReplay) {
    const t = T();
    const offset = isReplay ? Math.max(0, t.hello - 600) : 0;   // beim Wiederholen kein Warten auf den Himmel
    later(() => body.classList.add("sky-in"), t.skyIn);
    later(() => show(hello), t.hello - offset);
    if (!reduced) later(() => launchShootingStar({ fromRight: true, high: true, scale: 0.75, width: 1.8 }), t.shootingStar - offset);
    later(() => show(subline), t.subline - offset);
    later(() => show(star), t.star - offset);
    later(() => {
      star.disabled = false;
      star.classList.add("is-ready");
    }, t.starReady - offset);
    later(() => show(hint), t.hint - offset);
  }

  function openMessage() {
    if (opened || star.disabled) return;
    opened = true;
    const t = T();
    const focusAfter = document.activeElement === star;

    star.classList.remove("is-ready");
    star.classList.add("is-burst");
    boost = reduced ? 0 : 0.35;
    later(() => intro.classList.add("is-leaving"), reduced ? 0 : 280);

    later(() => {
      intro.hidden = true;
      message.hidden = false;
      body.classList.remove("is-locked");
      window.scrollTo(0, 0);
      if (focusAfter) messageText.focus({ preventScroll: true });

      let at = 0;
      const lastTextIdx = msgLines.length - 3;   // die letzten beiden sind „Take care.“ + Button
      msgLines.forEach((line, i) => {
        if (line.classList.contains("line--pause")) at += t.pauseExtra;
        if (i === lastTextIdx + 1) at += t.outroDelay - t.lineStep;
        const when = at;
        later(() => {
          show(line);
          keepInView(line);
        }, when + 40);
        at += t.lineStep;
      });
      later(scheduleAmbient, at + 2500);
    }, t.toMessage);
  }

  // Falls der Bildschirm sehr klein ist: neu erscheinende Zeilen sanft ins Bild holen
  function keepInView(el) {
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 16) {
      el.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    }
  }

  function scheduleAmbient() {
    clearTimeout(ambientTimer);
    if (reduced) return;
    ambientTimer = setTimeout(() => {
      if (!document.hidden) {
        launchShootingStar({ intensity: 0.45, scale: 0.6, dur: 1300, width: 1.1 });
      }
      scheduleAmbient();
    }, rand(TIMING.ambientMin, TIMING.ambientMax));
  }

  function reset() {
    clearTimers();
    clearTimeout(ambientTimer);
    opened = false;
    shooters = [];
    boost = 0;

    message.hidden = true;
    msgLines.forEach((l) => l.classList.remove("is-visible"));

    intro.hidden = false;
    intro.classList.remove("is-leaving");
    [hello, subline, hint, star].forEach((el) => el.classList.remove("is-visible"));
    star.classList.remove("is-ready", "is-burst", "is-pressed");
    star.disabled = true;

    body.classList.add("is-locked");
    window.scrollTo(0, 0);
  }

  function replay() {
    reset();
    // kurzer Frame-Abstand, damit die Übergänge neu starten
    requestAnimationFrame(() => runIntro(true));
  }

  /* ---------- Ereignisse ---------- */
  star.addEventListener("click", openMessage);
  star.addEventListener("pointerdown", () => { if (!star.disabled) star.classList.add("is-pressed"); });
  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
    star.addEventListener(ev, () => star.classList.remove("is-pressed"))
  );
  replayBtn.addEventListener("click", replay);

  let resizeRaf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLoop();
    else startLoop();
  });

  const onMotionChange = (e) => {
    reduced = e.matches;
    if (reduced) { stopLoop(); shooters = []; draw(performance.now(), 0); }
    else startLoop();
  };
  if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);
  else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);

  // Fehler bei bfcache-Rückkehr (Zurück-Taste) vermeiden
  window.addEventListener("pageshow", (e) => { if (e.persisted) startLoop(); });

  /* ---------- Start ---------- */
  body.classList.remove("is-loading");
  body.classList.add("is-locked");
  resize();
  startLoop();
  runIntro(false);

  // kleine Test-/Debug-Schnittstelle (ohne Wirkung für Besucher)
  window.__reminder = { openMessage, replay, launchShootingStar };
})();
