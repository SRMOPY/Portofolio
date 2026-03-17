/* ============================================================
   KiRom Portfolio — main.js  (redesign v2)
   Author: Hafizh Ikraam Ghazali
   ============================================================ */

'use strict';

/* ── cursor ──────────────────────────────────────────────── */
(function initCursor() {
  const dot   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !trail) return;

  let mx = -100, my = -100, tx = -100, ty = -100, rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  function loopTrail() {
    tx += (mx - tx) * .1;
    ty += (my - ty) * .1;
    trail.style.transform = `translate(calc(${tx}px - 50%), calc(${ty}px - 50%))`;
    rafId = requestAnimationFrame(loopTrail);
  }
  loopTrail();

  document.addEventListener('visibilitychange', () => {
    document.hidden ? cancelAnimationFrame(rafId) : loopTrail();
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
})();


/* ── loader ──────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const pct    = document.getElementById('loader-pct');
  if (!loader) return;

  // animate the percentage counter
  let n = 0;
  const ticker = setInterval(() => {
    n = Math.min(n + Math.random() * 8, 100);
    if (pct) pct.textContent = Math.floor(n) + '%';
    if (n >= 100) clearInterval(ticker);
  }, 80);

  // dismiss after bar animation (~2s)
  setTimeout(() => {
    if (pct) pct.textContent = '100%';
    loader.classList.add('out');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 2200);
})();


/* ── nav scroll state ────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();


/* ── typed text ──────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'offensive security enthusiast.',
    'web exploitation learner.',
    'CTF competitor.',
    'Python tool builder.',
    'bug hunter in training.',
    'always be hacking (ethically).',
  ];

  let pi = 0, ci = 0, del = false;

  function tick() {
    const w = phrases[pi];
    del ? ci-- : ci++;
    el.textContent = w.slice(0, ci);

    if (!del && ci === w.length) { del = true; return setTimeout(tick, 1600); }
    if (del && ci === 0)         { del = false; pi = (pi + 1) % phrases.length; }

    setTimeout(tick, del ? 44 : 68);
  }

  // start after loader clears
  setTimeout(tick, 2400);
})();


/* ── scroll reveal ───────────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ── stat counters ───────────────────────────────────────── */
(function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target.querySelector('[data-target]');
      if (!el) return;

      const target = parseInt(el.dataset.target, 10);
      if (!target) return;

      let cur = 0;
      const step = Math.ceil(target / 40);
      const id = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(id);
      }, 35);

      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  // observe parent containers that hold the counter elements
  document.querySelectorAll('.ss-i, .stat-card').forEach(el => obs.observe(el));
})();


/* ── contact form ────────────────────────────────────────── */
(function initForm() {
  const form  = document.getElementById('contact-form');
  const label = document.getElementById('submit-label');
  if (!form || !label) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-fill');
    label.textContent = 'Message Sent ✓';
    btn.style.background = '#22c55e';
    btn.style.borderColor = '#22c55e';

    setTimeout(() => {
      label.textContent = 'Send Message';
      btn.style.cssText = '';
      form.reset();
    }, 3000);
  });
})();


/* ── cert modal ──────────────────────────────────────────── */
(function initCertModal() {
  const overlay    = document.getElementById('cert-overlay');
  const cards      = document.querySelectorAll('.cert-card');
  const closeBtn   = document.getElementById('cert-close');
  const closeBtn2  = document.getElementById('cert-close-2');

  const cmEmoji    = document.getElementById('cm-emoji');
  const cmBadge    = document.getElementById('cm-badge-lbl');
  const cmName     = document.getElementById('cm-name');
  const cmOrg      = document.getElementById('cm-org');
  const cmDate     = document.getElementById('cm-date');
  const cmDesc     = document.getElementById('cm-desc');
  const cmImgWrap  = document.getElementById('cm-img-wrap');
  const cmImg      = document.getElementById('cm-img');
  const cmNoImg    = document.getElementById('cm-no-img');
  const cmZoom     = document.getElementById('cm-zoom');

  const fsOverlay  = document.getElementById('img-fullscreen');
  const fsImg      = document.getElementById('fs-img');
  const fsClose    = document.getElementById('fs-close');

  if (!overlay || !cards.length) return;

  let currentImgSrc = '';

  function openModal(card) {
    const name = card.dataset.name || '';
    const org  = card.dataset.org  || '';
    const date = card.dataset.date || '';
    const desc = card.dataset.desc || '';
    const img  = card.dataset.img  || '';

    const isCTF = card.querySelector('.cc-badge.ctf') !== null;
    const emoji = card.querySelector('.cc-emoji')?.textContent || '🏅';

    cmEmoji.textContent = emoji;
    cmBadge.textContent = isCTF ? 'CTF' : 'VERIFIED';
    cmBadge.className   = 'cm-badge' + (isCTF ? ' ctf' : '');
    cmName.textContent  = name;
    cmOrg.textContent   = org;
    cmDate.textContent  = date;
    cmDesc.textContent  = desc;

    if (img) {
      cmImg.src = img;
      cmImg.alt = name;
      currentImgSrc = img;
      cmImgWrap.style.display = 'flex';
      cmNoImg.style.display   = 'none';
    } else {
      currentImgSrc = '';
      cmImgWrap.style.display = 'none';
      cmNoImg.style.display   = 'flex';
    }

    overlay.classList.add('open');
  }

  function closeModal() { overlay.classList.remove('open'); }

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
  });

  closeBtn?.addEventListener('click',  closeModal);
  closeBtn2?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // fullscreen — click image or zoom button
  function openFS() {
    if (!currentImgSrc) return;
    fsImg.src = currentImgSrc;
    fsOverlay.classList.add('open');
  }
  function closeFS() { fsOverlay.classList.remove('open'); }

  cmImg?.addEventListener('click',  openFS);
  cmZoom?.addEventListener('click', openFS);
  fsClose?.addEventListener('click', closeFS);
  fsOverlay?.addEventListener('click', e => { if (e.target !== fsImg) closeFS(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (fsOverlay?.classList.contains('open')) { closeFS(); return; }
    if (overlay.classList.contains('open'))    { closeModal(); }
  });
})();


/* ── terminal ────────────────────────────────────────────── */
(function initTerminal() {
  const overlay  = document.getElementById('terminal-overlay');
  const termBody = document.getElementById('term-body');
  const termIn   = document.getElementById('term-input');
  const openBtn  = document.getElementById('open-terminal');
  const closeBtn = document.getElementById('term-close');
  if (!overlay || !termBody || !termIn) return;

  let history = [], hPtr = -1;

  /* ── commands ── */
  const cmds = {
    help: () => [
      { c: 'tl-info', t: '┌──────────────────────────────────────┐' },
      { c: 'tl-info', t: '│        available commands            │' },
      { c: 'tl-info', t: '└──────────────────────────────────────┘' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-ok',   t: '  whoami     who is KiRom?' },
      { c: 'tl-ok',   t: '  skills     current tool arsenal' },
      { c: 'tl-ok',   t: '  scan       simulated recon demo' },
      { c: 'tl-ok',   t: '  ctf        CTF profile' },
      { c: 'tl-ok',   t: '  projects   list projects' },
      { c: 'tl-ok',   t: '  contact    reach out' },
      { c: 'tl-ok',   t: '  github     open GitHub profile' },
      { c: 'tl-ok',   t: '  clear      clear terminal' },
      { c: 'tl-ok',   t: '  exit       close this window' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-out',  t: '  ↑ / ↓ arrows for command history' },
    ],

    whoami: () => [
      { c: 'tl-info', t: '[*] querying operator profile...' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-ok',   t: '  name     : Hafizh Ikraam Ghazali' },
      { c: 'tl-out',  t: '  alias    : KiRom' },
      { c: 'tl-out',  t: '  github   : github.com/SRMOPY' },
      { c: 'tl-out',  t: '  role     : SHS student / offensive sec' },
      { c: 'tl-out',  t: '  origin   : Indonesia 🇮🇩' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-warn', t: '  [!] open to: internships, CTF teams, collab' },
    ],

    skills: () => [
      { c: 'tl-info', t: '[*] loading arsenal...' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-ok',   t: '  web exploitation   ████████░░  80%' },
      { c: 'tl-ok',   t: '  network recon      ███████░░░  70%' },
      { c: 'tl-ok',   t: '  python scripting   ███████░░░  70%' },
      { c: 'tl-ok',   t: '  linux / bash       ██████░░░░  65%' },
      { c: 'tl-ok',   t: '  OSINT              ██████░░░░  60%' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-warn', t: '  [*] actively leveling up.' },
    ],

    scan: () => [
      { c: 'tl-info', t: '[*] running recon on target.ctf.local' },
      { c: 'tl-out',  t: '$ nmap -sC -sV -T4 target.ctf.local' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-ok',   t: 'PORT      STATE  SERVICE   VERSION' },
      { c: 'tl-ok',   t: '22/tcp    open   ssh       OpenSSH 8.9p1' },
      { c: 'tl-ok',   t: '80/tcp    open   http      Apache 2.4.54' },
      { c: 'tl-ok',   t: '443/tcp   open   https     nginx 1.22.1' },
      { c: 'tl-ok',   t: '8080/tcp  open   http-alt  Werkzeug 2.2.2' },
      { c: 'tl-warn', t: '' },
      { c: 'tl-warn', t: '  [!] Apache version likely outdated' },
      { c: 'tl-warn', t: '  [!] Werkzeug debug mode? Check /console' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-acc',  t: '  [demo — no real hosts were scanned]' },
    ],

    ctf: () => [
      { c: 'tl-info', t: '[*] fetching CTF profile...' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-out',  t: '  platforms  : HackTheBox, TryHackMe' },
      { c: 'tl-out',  t: '  events     : NiteCTF 2024' },
      { c: 'tl-out',  t: '  focus      : web, linux privesc, recon' },
      { c: 'tl-warn', t: '' },
      { c: 'tl-warn', t: '  [!] flag count: classified 🚩' },
    ],

    projects: () => [
      { c: 'tl-info', t: '[*] listing projects...' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-ok',   t: '  01  ReconX   — github.com/SRMOPY/reconx' },
      { c: 'tl-out',  t: '      automated recon tool (subdomain, ports, headers)' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-ok',   t: '  02  CveScaf  — github.com/SRMOPY/CveScaf' },
      { c: 'tl-out',  t: '      CVE research assistant, PoC finder, notes generator' },
    ],

    contact: () => [
      { c: 'tl-info', t: '[*] contact:' },
      { c: 'tl-out',  t: '' },
      { c: 'tl-out',  t: '  github  : github.com/SRMOPY' },
      { c: 'tl-out',  t: '  email   : ikraamm.bussiness@gmail.com' },
    ],

    github: () => {
      window.open('https://github.com/SRMOPY', '_blank', 'noopener');
      return [{ c: 'tl-ok', t: '[+] opening github.com/SRMOPY...' }];
    },

    clear: () => { termBody.innerHTML = ''; return []; },

    exit: () => {
      setTimeout(closeTerm, 250);
      return [{ c: 'tl-out', t: 'connection closed.' }];
    },
  };

  const BANNER = [
    { c: 'tl-info', t: '╔═══════════════════════════════════════════╗' },
    { c: 'tl-info', t: '║   kirom@kali  ·  personal shell  v2.0    ║' },
    { c: 'tl-info', t: '╚═══════════════════════════════════════════╝' },
    { c: 'tl-out',  t: '' },
    { c: 'tl-ok',   t: "[+] session established  127.0.0.1:4444" },
    { c: 'tl-out',  t: "[*] type 'help' for available commands." },
    { c: 'tl-out',  t: '' },
  ];

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function printLines(lines, delay = 0) {
    lines.forEach((l, i) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.className = 'tl ' + (l.c || 'tl-out');
        span.textContent = l.t;
        termBody.appendChild(span);
        termBody.appendChild(document.createTextNode('\n'));
        termBody.scrollTop = termBody.scrollHeight;
      }, delay + i * 36);
    });
  }

  function printPrompt(raw) {
    const span = document.createElement('span');
    span.className = 'tl';
    span.innerHTML = `<span class="tl-prompt">kirom@kali:~$</span> <span class="tl-cmd">${esc(raw)}</span>`;
    termBody.appendChild(span);
    termBody.appendChild(document.createTextNode('\n'));
  }

  function openTerm() {
    overlay.classList.add('open');
    termBody.innerHTML = '';
    printLines(BANNER);
    setTimeout(() => termIn.focus(), 80);
  }

  function closeTerm() { overlay.classList.remove('open'); }

  openBtn?.addEventListener('click', openTerm);
  closeBtn?.addEventListener('click', closeTerm);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeTerm(); });

  termIn.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = termIn.value.trim();
      if (!raw) return;
      history.unshift(raw); hPtr = -1;
      printPrompt(raw);
      termIn.value = '';

      const fn = cmds[raw.toLowerCase()];
      if (fn) {
        const out = fn();
        if (out?.length) printLines(out, 20);
      } else {
        printLines([{ c: 'tl-err', t: `bash: ${raw}: command not found. try 'help'.` }]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      hPtr = Math.min(hPtr + 1, history.length - 1);
      termIn.value = history[hPtr] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hPtr = Math.max(hPtr - 1, -1);
      termIn.value = hPtr === -1 ? '' : history[hPtr];
    }
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeTerm() : openTerm();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeTerm();
  });
})();