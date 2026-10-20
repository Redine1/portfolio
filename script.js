/**
 * ================================================================
 * REDINE KYLE V. ELEJORDE — PORTFOLIO  |  script.js
 * Vanilla JS matching letsch.dev's behaviour patterns:
 * · "Contact" nav button scrolls to #contact
 * · "Email" hero button scrolls to #contact
 * · Active nav link tracking
 * · Textarea auto-resize
 * · Contact form validation + mailto handler
 * · Pixelated overlay height sync
 * · Footer year
 * ================================================================
 */

'use strict';

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);

/* ----------------------------------------------------------------
   0. LIGHT / DARK THEME TOGGLE
   ---------------------------------------------------------------- */
(function initTheme() {
  const toggleBtn = $('#theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // Initial theme (default dark, respect stored preference or system)
  const initialTheme = storedTheme ? storedTheme : (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', initialTheme);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  });
})();

/* ----------------------------------------------------------------
   0.1 CODE EDITOR COPY BUTTON
   ---------------------------------------------------------------- */
(function initCopyCode() {
  const btn = $('#btn-copy-tech');
  if (!btn) return;

  const rawJson = `// core technologies & toolbelt
{
  "languages": [ "Java", "Python", "C", "C++", "C#", "Kotlin", "JavaScript" ],
  "databases": [ "MySQL", "MongoDB", "SQLite" ],
  "mobile": [ "Kotlin", "Android Studio" ],
  "web_backend": [ "HTML5", "CSS3", "JavaScript", "FastAPI" ],
  "desktop_gui": [ "JavaSwing", "JavaFX" ],
  "embedded_iot": [ "ESP32", "Arduino", "Circuit Design", "IoT" ],
  "ai_tools": [ "ChatGPT", "Claude", "Gemini" ]
}`;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(rawJson);
      const textSpan = btn.querySelector('.copy-text');
      if (textSpan) textSpan.textContent = 'Copied!';
      btn.style.borderColor = 'var(--green)';
      btn.style.color = 'var(--green)';

      setTimeout(() => {
        if (textSpan) textSpan.textContent = 'Copy';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2000);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  });
})();

/* ----------------------------------------------------------------
   1. NAV CONTACT BUTTON  (letsch.dev: clicks scroll to #contact)
   ---------------------------------------------------------------- */
(function initNavContact() {
  const btn = $('#nav-contact-button');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const contact = $('#contact');
    if (!contact) return;

    contact.scrollIntoView({ behavior: 'smooth' });

    // Auto-focus the email field on hover-capable devices (letsch.dev pattern)
    if (matchMedia('(hover: hover)').matches) {
      setTimeout(() => {
        $('#sender-email')?.focus();
      }, 600);
    }
  });
})();

/* ----------------------------------------------------------------
   2. HERO EMAIL BUTTON  (scrolls to #contact, same as letsch.dev)
   ---------------------------------------------------------------- */
(function initEmailButton() {
  const btn = $('#email-button');
  if (!btn) return;

  btn.addEventListener('mouseup', () => {
    $('#contact')?.scrollIntoView({ behavior: 'smooth' });

    // Brief blink animation on the email contact-value (letsch.dev pattern)
    const emailLink = $('.contact-value-link');
    if (emailLink) {
      emailLink.style.animationName = 'blink-highlight';
      setTimeout(() => { emailLink.style.animationName = ''; }, 1800);
    }
  });
})();

/* ----------------------------------------------------------------
   3. ACTIVE NAV LINK  (IntersectionObserver)
   ---------------------------------------------------------------- */
(function initActiveNavLinks() {
  const sections = $$('section[id], div[id]');
  const navLinks = $$('.nav-link');
  if (!navLinks.length) return;

  // Build id → link map
  const linkMap = new Map();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      linkMap.set(href.slice(1), link);
    }
  });

  function setActive(id) {
    navLinks.forEach(l => l.classList.remove('active'));
    linkMap.get(id)?.classList.add('active');
  }

  // Use IntersectionObserver for efficient tracking
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      rootMargin: '-80px 0px -40% 0px',
      threshold: 0.2,
    }
  );

  sections.forEach(s => { if (s.id) observer.observe(s); });
})();

/* ----------------------------------------------------------------
   4. SMOOTH SCROLL  (anchor links that start with #)
   ---------------------------------------------------------------- */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.pushState(null, '', `#${id}`);
  });
})();

/* ----------------------------------------------------------------
   5. TEXTAREA AUTO-RESIZE  (letsch.dev uses this)
   ---------------------------------------------------------------- */
(function initTextareaResize() {
  const textarea = $('#sender-message');
  if (!textarea) return;

  function resize() {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight + 8) + 'px';
  }

  textarea.addEventListener('input', resize);
  resize(); // run once on load
})();

/* ----------------------------------------------------------------
   6. CONTACT FORM  (Formspree fetch + mailto fallback)
   ----------------------------------------------------------------

   HOW TO ACTIVATE REAL EMAIL DELIVERY (takes ~2 minutes):
   ─────────────────────────────────────────────────────────
   Step 1 → Go to https://formspree.io and sign up free.
   Step 2 → Click "New Form", name it anything.
   Step 3 → Set the destination email: kriyuchi13@gmail.com
   Step 4 → Copy the endpoint URL  →  looks like:
               https://formspree.io/f/xabc1234
   Step 5 → Paste it below as FORMSPREE_ENDPOINT value.
   Step 6 → Save script.js, then check your Gmail for a
            confirmation email from Formspree → click "Confirm".

   Until step 5 is done the form falls back to mailto: so
   nothing is ever broken.
   ---------------------------------------------------------------- */

// ⬇️  PASTE YOUR FORMSPREE ENDPOINT HERE (keep the quotes)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkjoeqqg';       // e.g. 'https://formspree.io/f/xabc1234'
const FALLBACK_EMAIL     = 'kriyuchi13@gmail.com';

(function initContactForm() {
  const form       = $('#contact-form');
  const emailInput = $('#sender-email');
  const subjInput  = $('#sender-subject');
  const msgInput   = $('#sender-message');
  const sendBtn    = $('#send-button');
  const statusEl   = $('#form-status');

  if (!form || !emailInput || !msgInput) return;

  // --- Inline error helpers ---
  function showErr(input, errId, msg) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const el = document.getElementById(errId);
    if (el) el.textContent = msg;
  }

  function clearErr(input, errId) {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    const el = document.getElementById(errId);
    if (el) el.textContent = '';
  }

  // Live clear on input
  emailInput.addEventListener('input', () => clearErr(emailInput, 'email-error'));
  subjInput?.addEventListener('input', () => clearErr(subjInput,  'subject-error'));
  msgInput.addEventListener('input',   () => clearErr(msgInput,   'message-error'));

  // --- Validators ---
  function validateEmail() {
    const v = emailInput.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v)          { showErr(emailInput, 'email-error', 'Please enter your email.'); return false; }
    if (!re.test(v)) { showErr(emailInput, 'email-error', 'Please enter a valid email.'); return false; }
    clearErr(emailInput, 'email-error');
    return true;
  }

  function validateSubject() {
    if (!subjInput) return true;
    const v = subjInput.value.trim();
    if (!v) { showErr(subjInput, 'subject-error', 'Please enter a subject.'); return false; }
    clearErr(subjInput, 'subject-error');
    return true;
  }

  function validateMessage() {
    const v = msgInput.value.trim();
    if (!v)           { showErr(msgInput, 'message-error', 'Please write a message.'); return false; }
    if (v.length < 10){ showErr(msgInput, 'message-error', 'Message too short (min 10 chars).'); return false; }
    clearErr(msgInput, 'message-error');
    return true;
  }

  // --- Status banner ---
  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className   = `form-status ${type}`;
    statusEl.hidden      = false;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- Button helpers ---
  function setSending() {
    sendBtn.disabled    = true;
    sendBtn.textContent = 'Sending…';
  }

  function resetButton(label = 'Send Message') {
    sendBtn.disabled    = false;
    sendBtn.textContent = label;
  }

  // --- mailto: fallback (opens local mail client) ---
  function mailtoFallback(email, subject, message) {
    const body   = `From: ${email}\n\n${message}`;
    const mailto = `mailto:${FALLBACK_EMAIL}`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(body)}`;
    const a = document.createElement('a');
    a.href = mailto;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --- Reset form + textarea height ---
  function resetForm() {
    form.reset();
    if (msgInput) msgInput.style.height = '';
  }

  // --- Submit handler ---
  let isSending = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSending) return;

    // Clear previous status
    statusEl.hidden    = true;
    statusEl.className = 'form-status';

    // Run all validators
    const okEmail   = validateEmail();
    const okSubject = validateSubject();
    const okMessage = validateMessage();

    if (!okEmail || !okSubject || !okMessage) {
      [emailInput, subjInput, msgInput]
        .find(f => f?.classList.contains('error'))?.focus();
      return;
    }

    isSending = true;
    setSending();

    const email   = emailInput.value.trim();
    const subject = subjInput ? subjInput.value.trim() : 'Portfolio Contact';
    const message = msgInput.value.trim();

    // ── PATH A: Formspree (real email delivery) ──────────────────
    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:   email,
            subject: subject,
            message: message,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // ✅ Success
          showStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
          resetForm();
          resetButton('Sent ✓');
          setTimeout(() => resetButton(), 3000);
        } else {
          // Formspree returned an error (e.g. not confirmed yet)
          const errMsg = data?.errors?.map(err => err.message).join(', ')
            || 'Something went wrong. Trying your mail client instead…';
          console.warn('Formspree error:', errMsg);
          // ⬇️ Fall through to mailto
          mailtoFallback(email, subject, message);
          showStatus(
            `⚠️ Formspree: ${errMsg} — your mail client opened as a backup.`,
            'error-msg'
          );
          resetButton();
        }
      } catch (networkErr) {
        // Network failure → fall back to mailto
        console.warn('Formspree network error:', networkErr);
        mailtoFallback(email, subject, message);
        showStatus(
          '⚠️ Network error — your mail client opened as a backup.',
          'error-msg'
        );
        resetButton();
      }

    // ── PATH B: No Formspree configured → mailto fallback ────────
    } else {
      mailtoFallback(email, subject, message);
      showStatus(
        '📬 Your mail client should open now. To enable direct sending, '
        + 'add your Formspree endpoint to script.js (see instructions at top of file).',
        'success'
      );
      resetForm();
      resetButton();
    }

    isSending = false;
  });
})();

/* ----------------------------------------------------------------
   7. PIXELATED OVERLAY HEIGHT SYNC  (letsch.dev uses ResizeObserver)
   ---------------------------------------------------------------- */
(function initOverlayResize() {
  const overlay = $('.pixelated-overlay');
  if (!overlay) return;

  function syncHeight() {
    overlay.style.height = document.documentElement.scrollHeight + 'px';
  }

  const ro = new ResizeObserver(syncHeight);
  ro.observe(document.documentElement);
  syncHeight();
})();

/* ----------------------------------------------------------------
   8. BLINK HIGHLIGHT ANIMATION  (injected for email button effect)
   ---------------------------------------------------------------- */
(function injectBlink() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink-highlight {
      0%, 100% { color: var(--green); }
      25%, 75%  { color: #fff; text-shadow: 0 0 12px var(--green); }
    }
  `;
  document.head.appendChild(style);
})();

/* ----------------------------------------------------------------
   9. PDF CV DOWNLOAD INTEGRATION
   Handles click, visual feedback and triggers download of assets/pdfs/resume.pdf
   ---------------------------------------------------------------- */
(function initCvDownload() {
  const cvBtn = document.getElementById('download-cv-btn');
  if (!cvBtn) return;

  cvBtn.addEventListener('click', function () {
    const textEl = cvBtn.querySelector('.cv-btn-text');
    const iconDl = cvBtn.querySelector('.cv-icon-download');
    const iconCk = cvBtn.querySelector('.cv-icon-check');

    if (!textEl) return;

    // Phase 1: Downloading feedback
    textEl.textContent = 'Downloading...';
    cvBtn.classList.add('downloading');

    setTimeout(function () {
      // Phase 2: Downloaded feedback
      textEl.textContent = 'Downloaded \u2713';
      cvBtn.classList.remove('downloading');
      cvBtn.classList.add('downloaded');
      if (iconDl) iconDl.style.display = 'none';
      if (iconCk) iconCk.style.display = 'inline-block';

      setTimeout(function () {
        // Phase 3: Reset
        textEl.textContent = 'Download CV';
        cvBtn.classList.remove('downloaded');
        if (iconDl) iconDl.style.display = 'inline-block';
        if (iconCk) iconCk.style.display = 'none';
      }, 2500);
    }, 700);
  });
})();

/* ----------------------------------------------------------------
   10. ENHANCED MULTI-COLOR TECH STACK INTERACTION
   Synchronizes hover highlight state across:
   - IDE JSON tokens (.tech-token[data-tech])
   - Categorized badges (.tech-badge[data-tech])
   - Project tag chips (.chip--tech[data-tech])
   ---------------------------------------------------------------- */
(function initTechStackHoverSync() {
  var allTechEls = document.querySelectorAll('[data-tech]');
  if (!allTechEls.length) return;

  allTechEls.forEach(function (el) {
    var techName = el.getAttribute('data-tech');
    if (!techName) return;

    el.addEventListener('mouseenter', function () {
      document.querySelectorAll('[data-tech="' + techName + '"]')
        .forEach(function (item) { item.classList.add('is-highlighted'); });
    });

    el.addEventListener('mouseleave', function () {
      document.querySelectorAll('[data-tech="' + techName + '"]')
        .forEach(function (item) { item.classList.remove('is-highlighted'); });
    });
  });

  // Staggered entrance animation when Tech Stack section scrolls into view
  var techSection = document.getElementById('tech-stack');
  if (!techSection || !('IntersectionObserver' in window)) return;

  var entranceObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var badges = techSection.querySelectorAll('.tech-badge');
      badges.forEach(function (badge, idx) {
        setTimeout(function () {
          badge.classList.add('is-highlighted');
          setTimeout(function () { badge.classList.remove('is-highlighted'); }, 480);
        }, idx * 45);
      });
      entranceObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  entranceObserver.observe(techSection);
})();



/* ----------------------------------------------------------------
   11. STARS & METEORITE CANVAS ANIMATION
   - Dark mode : bright white/cyan stars + vivid glowing meteor streaks
   - Light mode: very soft indigo/slate ghost stars + faint silver meteors
   - Uses requestAnimationFrame (GPU composited) — zero layout/CLS impact
   - Respects prefers-reduced-motion
   ---------------------------------------------------------------- */
(function initStarsCanvas() {
  'use strict';

  const canvas  = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme-aware palette ─────────────────────────────────── */
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function getPalette(theme) {
    if (theme === 'light') {
      return {
        starColors   : ['rgba(99,102,241,', 'rgba(148,163,184,', 'rgba(79,70,229,', 'rgba(100,116,139,'],
        starAlphaMax : 0.35,   // very subtle in light mode
        meteorColor  : 'rgba(99,102,241,',
        meteorAlpha  : 0.45,
        meteorGlow   : 'rgba(99,102,241,0.12)',
        meteorTailLen: 90,
      };
    }
    return {
      starColors   : ['rgba(255,255,255,', 'rgba(186,230,253,', 'rgba(167,243,208,', 'rgba(196,181,253,'],
      starAlphaMax : 0.9,
      meteorColor  : 'rgba(186,230,253,',
      meteorAlpha  : 0.9,
      meteorGlow   : 'rgba(186,230,253,0.25)',
      meteorTailLen: 160,
    };
  }

  /* ── Resize handler ──────────────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Star pool ───────────────────────────────────────────── */
  const STAR_COUNT = Math.min(220, Math.floor(window.innerWidth * window.innerHeight / 5000));

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function makeStar() {
    return {
      x        : Math.random() * window.innerWidth,
      y        : Math.random() * window.innerHeight,
      r        : randBetween(0.3, 1.6),
      alpha    : randBetween(0.15, 1.0),
      alphaDir : Math.random() < 0.5 ? 1 : -1,
      alphaSpd : randBetween(0.002, 0.007),
      colorIdx : Math.floor(Math.random() * 4),
    };
  }

  const stars = Array.from({ length: STAR_COUNT }, makeStar);

  /* ── Meteor pool ─────────────────────────────────────────── */
  const MAX_METEORS = 3;
  const meteors     = [];

  function spawnMeteor() {
    // Start from a random point along the top or right edge
    const fromTop  = Math.random() < 0.6;
    const startX   = fromTop ? Math.random() * window.innerWidth : window.innerWidth + 20;
    const startY   = fromTop ? -20 : Math.random() * (window.innerHeight * 0.5);
    const angle    = randBetween(30, 55); // degrees downward
    const rad      = (angle * Math.PI) / 180;
    const speed    = randBetween(6, 14);

    meteors.push({
      x    : startX,
      y    : startY,
      vx   : -Math.cos(rad) * speed,
      vy   :  Math.sin(rad) * speed,
      len  : randBetween(80, 180),
      alpha: randBetween(0.5, 1.0),
      width: randBetween(1, 2.2),
      life : 1.0,          // fades from 1 → 0
      decay: randBetween(0.008, 0.018),
    });
  }

  // Stagger initial meteor spawns
  let meteorTimer = 0;
  const METEOR_INTERVAL = reduced ? Infinity : randBetween(120, 280); // frames

  /* ── Draw one frame ──────────────────────────────────────── */
  function draw(timestamp) {
    const theme   = getTheme();
    const palette = getPalette(theme);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── Stars ──
    if (!reduced) {
      for (const s of stars) {
        // Twinkle
        s.alpha += s.alphaSpd * s.alphaDir;
        const cap = palette.starAlphaMax;
        if (s.alpha >= cap) { s.alpha = cap; s.alphaDir = -1; }
        if (s.alpha <= 0.05) { s.alpha = 0.05; s.alphaDir = 1; }

        const col = palette.starColors[s.colorIdx];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = col + s.alpha.toFixed(3) + ')';
        ctx.fill();

        // Tiny glow for bigger stars in dark mode
        if (theme === 'dark' && s.r > 1.1) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          grd.addColorStop(0, col + (s.alpha * 0.5).toFixed(3) + ')');
          grd.addColorStop(1, col + '0)');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }
    } else {
      // reduced-motion: static dots only
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = palette.starColors[s.colorIdx] + (palette.starAlphaMax * 0.6).toFixed(3) + ')';
        ctx.fill();
      }
    }

    // ── Meteors ──
    if (!reduced) {
      meteorTimer++;
      if (meteorTimer >= METEOR_INTERVAL && meteors.length < MAX_METEORS) {
        spawnMeteor();
        meteorTimer = 0;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m   = meteors[i];
        m.x      += m.vx;
        m.y      += m.vy;
        m.life   -= m.decay;

        if (m.life <= 0 || m.x < -200 || m.y > canvas.height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - m.vx * (m.len / (Math.abs(m.vx) || 1));
        const tailY = m.y - m.vy * (m.len / (Math.abs(m.vy) || 1));

        // Head glow
        const grd = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6);
        grd.addColorStop(0, palette.meteorColor + (m.alpha * m.life).toFixed(3) + ')');
        grd.addColorStop(1, palette.meteorGlow);
        ctx.beginPath();
        ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Streak / tail
        const trailGrd = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        trailGrd.addColorStop(0, palette.meteorColor + (m.alpha * m.life).toFixed(3) + ')');
        trailGrd.addColorStop(1, palette.meteorColor + '0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = trailGrd;
        ctx.lineWidth   = m.width * m.life;
        ctx.lineCap     = 'round';
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
