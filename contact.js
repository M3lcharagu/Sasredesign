// ---------- Contact form validation + simulated submission ----------
const quoteForm = document.getElementById('quote-form');
const formCard = document.getElementById('contact-form-card');
const successPanel = document.getElementById('contact-success');
const sendAnotherBtn = document.getElementById('send-another');

function setFieldError(fieldId, hasError) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.toggle('has-error', hasError);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const message = document.getElementById('f-message').value.trim();

    let valid = true;

    if (!name) { setFieldError('field-name', true); valid = false; } else { setFieldError('field-name', false); }
    if (!email || !isValidEmail(email)) { setFieldError('field-email', true); valid = false; } else { setFieldError('field-email', false); }
    if (!message) { setFieldError('field-message', true); valid = false; } else { setFieldError('field-message', false); }

    if (!valid) return;

    // No backend is connected on this static build — we simulate submission
    // and surface a confirmation, with direct phone/email as a fallback.
    formCard.classList.add('is-submitted');
    successPanel.classList.add('is-visible');
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

if (sendAnotherBtn) {
  sendAnotherBtn.addEventListener('click', () => {
    quoteForm.reset();
    ['field-name', 'field-email', 'field-message'].forEach(id => setFieldError(id, false));
    formCard.classList.remove('is-submitted');
    successPanel.classList.remove('is-visible');
    document.getElementById('f-name').focus();
  });
}

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
