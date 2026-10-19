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
