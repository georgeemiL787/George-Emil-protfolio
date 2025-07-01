document.addEventListener('DOMContentLoaded', function() {
  const faders = document.querySelectorAll('.fade-in-section');
  const appearOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});

// Highlight nav link based on scroll position
const navLinks = document.querySelectorAll('.main-nav ul li a');
const sections = [
  document.getElementById('about'),
  document.getElementById('skills'),
  document.getElementById('projects'),
  document.getElementById('contact')
];
const sectionIds = ['about', 'skills', 'projects', 'contact'];

window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.pageYOffset;

  sections.forEach((section, idx) => {
    if (section && section.offsetTop - 80 <= scrollY) {
      current = sectionIds[idx];
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Typewriter effect for subtitle
const typewriterText = ["Autonomous Systems Developer", "AI Enthusiast", "Data Scientist", "Innovator"];
const typewriterElem = document.getElementById('typewriter');
let typeIdx = 0, charIdx = 0, isDeleting = false;
function typeWriter() {
  if (!typewriterElem) return;
  const current = typewriterText[typeIdx % typewriterText.length];
  if (isDeleting) {
    typewriterElem.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      typeIdx++;
      setTimeout(typeWriter, 600);
      return;
    }
  } else {
    typewriterElem.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1200);
      return;
    }
  }
  setTimeout(typeWriter, isDeleting ? 40 : 90);
}
typeWriter();

// Smooth scroll for nav links
const navLinksSmooth = document.querySelectorAll('.main-nav ul li a');
navLinksSmooth.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Scroll to top button
const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = 'block';
    scrollBtn.classList.add('show');
    scrollBtn.classList.remove('hide');
  } else {
    scrollBtn.classList.add('hide');
    scrollBtn.classList.remove('show');
    setTimeout(() => { scrollBtn.style.display = 'none'; }, 300);
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark mode toggle
const darkToggle = document.getElementById('dark-mode-toggle');
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Contact form validation and feedback
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    feedback.textContent = 'Please fill in all fields.';
    feedback.className = 'error';
    feedback.style.display = 'block';
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    feedback.textContent = 'Please enter a valid email address.';
    feedback.className = 'error';
    feedback.style.display = 'block';
    return;
  }
  feedback.textContent = 'Sending...';
  feedback.className = '';
  feedback.style.display = 'block';
  try {
    const response = await fetch('https://formspree.io/f/xjkrpnkj', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    });
    if (response.ok) {
      feedback.textContent = 'Message sent successfully!';
      feedback.className = 'success';
      contactForm.reset();
    } else {
      feedback.textContent = 'There was an error sending your message. Please try again later.';
      feedback.className = 'error';
    }
  } catch (error) {
    feedback.textContent = 'There was an error sending your message. Please try again later.';
    feedback.className = 'error';
  }
  setTimeout(() => { feedback.style.display = 'none'; }, 3500);
});

// Animate skill progress bars when in view
function animateSkillBars() {
  document.querySelectorAll('.skill-progress').forEach(bar => {
    const percent = bar.getAttribute('data-skill');
    const skillBar = bar.querySelector('.skill-bar');
    if (bar.getBoundingClientRect().top < window.innerHeight - 40) {
      skillBar.style.width = percent + '%';
    }
  });
}
window.addEventListener('scroll', animateSkillBars);
window.addEventListener('DOMContentLoaded', animateSkillBars);

// Certificate modal logic
const certModal = document.getElementById('cert-modal');
const certEmbed = document.getElementById('cert-embed');
const certImg = document.getElementById('cert-img');
const certClose = document.querySelector('.cert-modal-close');
document.querySelectorAll('.training-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const cert = this.getAttribute('data-cert');
    if (!cert) return;
    certModal.classList.add('show');
    if (cert.endsWith('.pdf')) {
      certEmbed.src = cert;
      certEmbed.style.display = 'block';
      certImg.style.display = 'none';
    } else {
      certImg.src = cert;
      certImg.style.display = 'block';
      certEmbed.style.display = 'none';
    }
  });
});
certClose.addEventListener('click', () => {
  certModal.classList.remove('show');
  certEmbed.src = '';
  certImg.src = '';
});
window.addEventListener('click', (e) => {
  if (e.target === certModal) {
    certModal.classList.remove('show');
    certEmbed.src = '';
    certImg.src = '';
  }
});

// Project modal logic
const projectModal = document.getElementById('project-modal');
const projectTitle = document.getElementById('modal-project-title');
const projectDesc = document.getElementById('modal-project-description');
const projectLink = document.getElementById('modal-project-link');
const projectClose = document.querySelector('.project-modal-close');
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Prevent link click from opening modal
    if (e.target.tagName === 'A') return;
    projectTitle.textContent = card.getAttribute('data-title');
    projectDesc.textContent = card.getAttribute('data-description');
    projectLink.href = card.getAttribute('data-link');
    if (card.getAttribute('data-link').endsWith('.pdf')) {
      projectLink.setAttribute('target', '_blank');
    } else {
      projectLink.setAttribute('target', '_blank'); // keep default for other links
    }
    projectModal.classList.add('show');
  });
});
projectClose.addEventListener('click', () => {
  projectModal.classList.remove('show');
});
window.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove('show');
  }
}); 