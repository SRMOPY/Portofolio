/* ============================================================
   KiRom Portfolio — main.js
   Author: Hafizh Ikraam Ghazali
   ============================================================ */

'use strict';

/* ── cursor tracking ─────────────────────────────────────────── */
(function initCursor() {
  const dot   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');

  if (!dot || !trail) return;

  // use transform instead of left/top — GPU-composited, triggers no layout
  let mx = -100, my = -100;
  let tx = -100, ty = -100;
  let rafId = null;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  function loopTrail() {
    tx += (mx - tx) * 0.10;
    ty += (my - ty) * 0.10;
    trail.style.transform = `translate(calc(${tx}px - 50%), calc(${ty}px - 50%))`;
    rafId = requestAnimationFrame(loopTrail);
  }

  loopTrail();

  // pause the loop when tab is hidden — saves CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      loopTrail();
    }
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
})();


/* ── loader ──────────────────────────────────────────────────── */
(function initLoader() {
  const loader     = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  if (!loader) return;

  const steps = [
    'INITIALIZING...',
    'LOADING ASSETS...',
    'MOUNTING INTERFACE...',
    'READY.',
  ];

  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (loaderText && steps[i]) loaderText.textContent = steps[i];
    if (i >= steps.length - 1) clearInterval(interval);
  }, 450);

  // dismiss after bar animation completes (~2s)
  setTimeout(() => {
    loader.classList.add('hidden');
    // remove from DOM after transition so it can't block events
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 2100);
})();


/* ── nav scroll state ────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const tick = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();


/* ── typed text effect ───────────────────────────────────────── */
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

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? 44 : 68);
  }

  // start after loader clears
  setTimeout(tick, 2300);
})();


/* ── scroll reveal (IntersectionObserver) ────────────────────── */
(function initScrollReveal() {
  // everything that should animate in as it enters the viewport
  const targets = document.querySelectorAll(
    '.section-header, .about-text, .about-skills, .stats-row, ' +
    '.proj-card, .cert-card, .contact-left, .contact-form, ' +
    '.skill-item, .stat-card'
  );

  targets.forEach(el => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // if the element itself is the target, reveal it
      entry.target.classList.add('visible');

      // also reveal any scroll-reveal children with a stagger
      const children = entry.target.querySelectorAll('.scroll-reveal');
      children.forEach((child, idx) => {
        setTimeout(() => child.classList.add('visible'), idx * 70);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ── stat counter animation ──────────────────────────────────── */
(function initCounters() {
  const cards = document.querySelectorAll('.stat-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('[data-target]');
      if (!numEl) return;

      const target = parseInt(numEl.dataset.target, 10);
      if (isNaN(target) || target === 0) return;

      let current = 0;
      const step  = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        numEl.textContent = current;
      }, 35);

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  cards.forEach(card => observer.observe(card));
})();


/* ── contact form ────────────────────────────────────────────── */
(function initForm() {
  const form  = document.getElementById('contact-form');
  const label = document.getElementById('submit-label');
  if (!form || !label) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    label.textContent = 'Message Sent ✓';
    form.querySelector('.cf-submit').style.background = '#34d399';
    form.querySelector('.cf-submit').style.borderColor = '#34d399';
    form.querySelector('.cf-submit').style.color = '#060912';

    setTimeout(() => {
      label.textContent = 'Send Message';
      form.querySelector('.cf-submit').style.cssText = '';
      form.reset();
    }, 3000);
  });
})();


/* ── cert modal ──────────────────────────────────────────────── */
(function initCertModal() {
  const overlay  = document.getElementById('cert-overlay');
  const cards    = document.querySelectorAll('.cert-card');
  const closeBtn = document.getElementById('cert-close');
  const closeBtn2= document.getElementById('cert-close-2');

  if (!overlay || !cards.length) return;

  const cmName = document.getElementById('cm-name');
  const cmOrg  = document.getElementById('cm-org');
  const cmDate = document.getElementById('cm-date');
  const cmDesc = document.getElementById('cm-desc');
  const cmLink = document.getElementById('cm-link');

  function openModal(card) {
    const name = card.dataset.name || '';
    const org  = card.dataset.org  || '';
    const date = card.dataset.date || '';
    const desc = card.dataset.desc || '';
    const url  = card.dataset.url  || '';

    cmName.textContent = name;
    cmOrg.textContent  = org;
    cmDate.textContent = date;
    cmDesc.textContent = desc;

    if (url) {
      cmLink.href = url;
      overlay.classList.remove('no-link');
    } else {
      cmLink.href = '#';
      overlay.classList.add('no-link');
    }

    overlay.classList.add('open');
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    // keyboard accessible
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  if (closeBtn)  closeBtn.addEventListener('click',  closeModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();


/* ── terminal ────────────────────────────────────────────────── */
(function initTerminal() {
  const overlay  = document.getElementById('terminal-overlay');
  const termBody = document.getElementById('term-body');
  const termIn   = document.getElementById('term-input');
  const openBtn  = document.getElementById('open-terminal');
  const closeBtn = document.getElementById('term-close');

  if (!overlay || !termBody || !termIn) return;

  let cmdHistory = [];
  let histPtr    = -1;

  /* ── command definitions ── */
  const commands = {
    help() {
      return [
        { cls: 'tl-info',    text: '┌─────────────────────────────────────┐' },
        { cls: 'tl-info',    text: '│           available commands         │' },
        { cls: 'tl-info',    text: '└─────────────────────────────────────┘' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-success', text: '  whoami     who is KiRom?' },
        { cls: 'tl-success', text: '  skills     current tool arsenal' },
        { cls: 'tl-success', text: '  scan       simulated recon demo' },
        { cls: 'tl-success', text: '  ctf        CTF profile & platforms' },
        { cls: 'tl-success', text: '  contact    how to reach me' },
        { cls: 'tl-success', text: '  github     open GitHub profile' },
        { cls: 'tl-success', text: '  clear       clear the terminal' },
        { cls: 'tl-success', text: '  exit        close this window' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-out',     text: '  ↑/↓ arrow keys for command history' },
      ];
    },

    whoami() {
      return [
        { cls: 'tl-info',    text: '[*] querying operator profile...' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-success', text: '  name     : Hafizh Ikraam Ghazali' },
        { cls: 'tl-out',     text: '  alias    : KiRom' },
        { cls: 'tl-out',     text: '  github   : github.com/SRMOPY' },
        { cls: 'tl-out',     text: '  role     : HS student / offensive sec' },
        { cls: 'tl-out',     text: '  origin   : Indonesia 🇮🇩' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-warn',    text: '  [!] open to: internships, CTF teams,' },
        { cls: 'tl-warn',    text: '       uni connections, collabs' },
      ];
    },

    skills() {
      return [
        { cls: 'tl-info',    text: '[*] loading arsenal...' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-success', text: '  web exploitation   ████████░░  80%' },
        { cls: 'tl-success', text: '  network recon      ███████░░░  70%' },
        { cls: 'tl-success', text: '  python scripting   ███████░░░  70%' },
        { cls: 'tl-success', text: '  linux / bash       ██████░░░░  65%' },
        { cls: 'tl-success', text: '  OSINT              ██████░░░░  60%' },
        { cls: 'tl-success', text: '  burp suite         █████░░░░░  55%' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-warn',    text: '  [*] still leveling up — check back.' },
      ];
    },

    scan() {
      return [
        { cls: 'tl-info',    text: '[*] launching recon on target.ctf.local' },
        { cls: 'tl-out',     text: '$ nmap -sC -sV -T4 target.ctf.local' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-out',     text: 'Starting Nmap 7.94...' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-success', text: 'PORT      STATE  SERVICE   VERSION' },
        { cls: 'tl-success', text: '22/tcp    open   ssh       OpenSSH 8.9p1' },
        { cls: 'tl-success', text: '80/tcp    open   http      Apache 2.4.54' },
        { cls: 'tl-success', text: '443/tcp   open   https     nginx 1.22.1' },
        { cls: 'tl-success', text: '8080/tcp  open   http-alt  Werkzeug 2.2.2' },
        { cls: 'tl-warn',    text: '' },
        { cls: 'tl-warn',    text: '  [!] Apache version outdated — CVE lookup?' },
        { cls: 'tl-warn',    text: '  [!] Werkzeug debug mode? Check /console' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-accent',  text: '  [demo only — no real hosts were scanned]' },
      ];
    },

    ctf() {
      return [
        { cls: 'tl-info',    text: '[*] fetching CTF profile...' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-out',     text: '  platforms  : HackTheBox, TryHackMe' },
        { cls: 'tl-out',     text: '  focus      : web, linux privesc, recon' },
        { cls: 'tl-out',     text: '  write-ups  : github.com/SRMOPY' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-warn',    text: '  [!] flag count: classified 🚩' },
      ];
    },

    contact() {
      return [
        { cls: 'tl-info',    text: '[*] contact info:' },
        { cls: 'tl-out',     text: '' },
        { cls: 'tl-out',     text: '  github   : github.com/SRMOPY' },
        { cls: 'tl-out',     text: '  email    : update in index.html' },
        { cls: 'tl-out',     text: '  linkedin : update in index.html' },
      ];
    },

    github() {
      window.open('https://github.com/SRMOPY', '_blank', 'noopener');
      return [
        { cls: 'tl-success', text: '[+] opening github.com/SRMOPY...' },
      ];
    },

    clear() {
      termBody.innerHTML = '';
      return [];
    },

    exit() {
      setTimeout(closeTerminal, 250);
      return [{ cls: 'tl-out', text: 'connection closed.' }];
    },
  };

  /* ── print helpers ── */
  function printLines(lines, baseDelay = 0) {
    lines.forEach((line, idx) => {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'tl ' + (line.cls || 'tl-out');
        el.textContent = line.text;
        termBody.appendChild(el);
        termBody.appendChild(document.createTextNode('\n'));
        termBody.scrollTop = termBody.scrollHeight;
      }, baseDelay + idx * 38);
    });
  }

  function printPromptLine(raw) {
    const el = document.createElement('span');
    el.className = 'tl';
    el.innerHTML =
      `<span class="tl-prompt">kirom@kali:~$</span> <span class="tl-cmd">${escHtml(raw)}</span>`;
    termBody.appendChild(el);
    termBody.appendChild(document.createTextNode('\n'));
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── banner printed on open ── */
  const BANNER = [
    { cls: 'tl-info',    text: '╔══════════════════════════════════════════╗' },
    { cls: 'tl-info',    text: '║   kirom@kali  —  personal shell  v2.0   ║' },
    { cls: 'tl-info',    text: '╚══════════════════════════════════════════╝' },
    { cls: 'tl-out',     text: '' },
    { cls: 'tl-success', text: "[+] session established  127.0.0.1:4444" },
    { cls: 'tl-out',     text: "[*] type 'help' for available commands." },
    { cls: 'tl-out',     text: '' },
  ];

  /* ── open / close ── */
  function openTerminal() {
    overlay.classList.add('open');
    termBody.innerHTML = '';
    printLines(BANNER);
    setTimeout(() => termIn.focus(), 80);
  }

  function closeTerminal() {
    overlay.classList.remove('open');
  }

  if (openBtn)  openBtn.addEventListener('click',  openTerminal);
  if (closeBtn) closeBtn.addEventListener('click',  closeTerminal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeTerminal();
  });

  /* ── keyboard input ── */
  termIn.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = termIn.value.trim();
      if (!raw) return;

      cmdHistory.unshift(raw);
      histPtr = -1;

      printPromptLine(raw);
      termIn.value = '';

      const fn = commands[raw.toLowerCase()];
      if (fn) {
        const out = fn();
        if (out && out.length) printLines(out, 20);
      } else {
        printLines([
          { cls: 'tl-err', text: `bash: ${raw}: command not found. try 'help'.` }
        ], 0);
      }

      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      histPtr = Math.min(histPtr + 1, cmdHistory.length - 1);
      termIn.value = cmdHistory[histPtr] || '';
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      histPtr = Math.max(histPtr - 1, -1);
      termIn.value = histPtr === -1 ? '' : cmdHistory[histPtr];
    }
  });

  /* ── global keyboard shortcut  Ctrl+` ── */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeTerminal();
    }
  });
})();