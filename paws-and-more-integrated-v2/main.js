/* ============================================================
   PAWS & MORE — main.js
   ============================================================ */

/* ── 1. DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 2. CART BADGE ── */
  updateCartBadge();

  /* ── 3. NEWSLETTER ── */
  const nlBtn   = document.getElementById('nl-btn');
  const nlInput = document.getElementById('nl-email');

  if (nlBtn && nlInput) {
    nlBtn.addEventListener('click', () => {

      const email = nlInput.value.trim();

      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        nlBtn.textContent = '✓ Subscribed!';
        nlBtn.style.backgroundColor = 'var(--success)';
        nlInput.value = '';

        setTimeout(() => {
          nlBtn.textContent = 'Subscribe';
          nlBtn.style.backgroundColor = '';
        }, 3000);

      } else {
        nlInput.style.borderColor = 'var(--error)';
        setTimeout(() => { nlInput.style.borderColor = ''; }, 2000);
      }

    });
  }

  /* ── 4. CONTACT FORM ── */
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  /* ── 5. MOBILE NAV ── */
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

});

/* ── CART BADGE ── */
function updateCartBadge() {
  const cart  = JSON.parse(localStorage.getItem('pawsCart') || '[]');
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('nav-cart-count');
  if (badge) {
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/* ── CONTACT FORM VALIDATION ── */
function showError(input, msg) {
  clearError(input);
  input.style.borderColor = 'var(--error)';
  const err = document.createElement('span');
  err.className   = 'field-error';
  err.textContent = msg;
  err.style.cssText = 'display:block;color:var(--error);font-size:0.82rem;margin-top:4px;font-weight:700;';
  const wrap = input.closest('.field-wrap');
  if (wrap) { wrap.appendChild(err); } else { input.insertAdjacentElement('afterend', err); }
}

function clearError(input) {
  input.style.borderColor = '';
  const wrap = input.closest('.field-wrap');
  const container = wrap || input.parentElement;
  const existing = container.querySelector('.field-error');
  if (existing) existing.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function showBanner(show) {
  let banner = document.getElementById('form-error-banner');
  if (show) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'form-error-banner';
      banner.style.cssText = 'background-color:#fde8eb;border:2px solid var(--error);color:var(--error);border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px;font-weight:700;font-size:0.9rem;text-align:center;';
      banner.textContent = '⚠ Please fill in all fields correctly before sending.';
      const form = document.querySelector('.contact-form');
      if (form) form.prepend(banner);
    }
  } else {
    if (banner) banner.remove();
  }
}

function sendMessage() {
  const nameEl    = document.getElementById('contact-name');
  const emailEl   = document.getElementById('contact-email');
  const messageEl = document.getElementById('contact-message');
  const btn       = document.getElementById('send-btn');

  if (!nameEl || !emailEl || !messageEl) return;

  [nameEl, emailEl, messageEl].forEach(clearError);

  let valid = true;

  if (!nameEl.value.trim()) {
    showError(nameEl, 'Please enter your name.');
    valid = false;
  }
  if (!emailEl.value.trim()) {
    showError(emailEl, 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(emailEl.value.trim())) {
    showError(emailEl, 'Please enter a valid email (e.g. name@example.com).');
    valid = false;
  }
  if (!messageEl.value.trim()) {
    showError(messageEl, 'Please enter a message.');
    valid = false;
  }

  showBanner(!valid);
  if (!valid) return;

  btn.textContent = '✓ Message Sent!';
  btn.style.backgroundColor = 'var(--success)';
  nameEl.value    = '';
  emailEl.value   = '';
  messageEl.value = '';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.backgroundColor = '';
  }, 3000);
}