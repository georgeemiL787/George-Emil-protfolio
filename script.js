const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const nav = document.querySelector('.main-nav');
const navLinks = [...nav.querySelectorAll('ul a')];
const sections = [...document.querySelectorAll('main > section[id]')];

// Keep offsets accurate when the mobile navigation wraps.
function updateActiveSection() {
  let current = '';
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= nav.offsetHeight + 40) current = section.id;
  }
  for (const link of navLinks) {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

// Theme preference stays on this device; the editorial dark theme is the default.
const themeButton = document.getElementById('dark-mode-toggle');
function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  themeButton.innerHTML = `${dark ? 'Light' : 'Dark'} <span aria-hidden="true">◐</span>`;
  const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#111b20' : '#efeee7';
}
try { applyTheme(localStorage.getItem('portfolio-theme') !== 'light'); } catch { applyTheme(true); }
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark-mode');
  applyTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* Storage may be disabled. */ }
});

// Native anchors retain working navigation without JavaScript.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (link.hash.length < 2) return;
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20;
    const pauseMotion = reducedMotion.matches || document.body.classList.contains('motion-paused');
    window.scrollTo({ top, behavior: pauseMotion ? 'instant' : 'smooth' });
    history.replaceState(null, '', link.hash);
  });
});

const filters = document.querySelector('.project-filters');
const grid = document.getElementById('project-grid');
const cards = [...grid.querySelectorAll('.project-card')];
const count = document.getElementById('project-count');
filters.hidden = false;
filters.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
    grid.classList.toggle('is-filtered', category !== 'all');
    filters.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    const visible = cards.filter(card => !card.hidden).length;
    count.textContent = category === 'all' ? `${visible} projects` : `${visible} / ${cards.length} projects`;
  });
});

// Native dialogs provide Escape handling, focus trapping, and focus restoration.
const projectDialog = document.getElementById('project-modal');
cards.forEach(card => {
  card.querySelector('.project-details').addEventListener('click', () => {
    document.getElementById('modal-project-title').textContent = card.dataset.title;
    document.getElementById('modal-project-description').textContent = card.dataset.description;
    document.getElementById('modal-project-link').href = card.dataset.link;
    projectDialog.showModal();
  });
});
const certDialog = document.getElementById('cert-modal');
document.querySelectorAll('.training-link[data-cert]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('cert-embed').src = link.dataset.cert;
    document.getElementById('cert-link').href = link.dataset.cert;
    certDialog.showModal();
  });
  link.href = link.dataset.cert;
});
certDialog.addEventListener('close', () => document.getElementById('cert-embed').removeAttribute('src'));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

// Keep the existing contact endpoint and provide persistent, accessible feedback.
const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const submit = form.querySelector('button[type="submit"]');
  if (submit.disabled) return;
  const values = ['name', 'email', 'message'].map(id => document.getElementById(id).value.trim());
  feedback.hidden = false;
  if (values.some(value => !value)) {
    feedback.className = 'error';
    feedback.textContent = 'Please complete each field before sending.';
    return;
  }
  submit.disabled = true;
  feedback.className = '';
  feedback.textContent = 'Sending your message…';
  try {
    const response = await fetch(form.action, {method:'POST', headers:{Accept:'application/json'}, body:new FormData(form)});
    if (!response.ok) throw new Error('Request failed');
    feedback.textContent = 'Message sent. Thank you for reaching out!';
    form.reset();
  } catch {
    feedback.className = 'error';
    feedback.textContent = 'The message could not be sent. Please try again or email me directly.';
  } finally { submit.disabled = false; }
});
