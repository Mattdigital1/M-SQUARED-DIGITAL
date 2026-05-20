'use strict';

// Nav scroll
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Nav color switching based on section under nav
const darkSectionEls = document.querySelectorAll('.stats-bar, .cta-section');
if (darkSectionEls.length && nav) {
  function updateNavColor() {
    const navBottom = nav.offsetHeight;
    let isDark = false;
    darkSectionEls.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navBottom && rect.bottom > 0) {
        isDark = true;
      }
    });
    nav.classList.toggle('nav-dark', isDark);
  }
  window.addEventListener('scroll', updateNavColor, { passive: true });
  updateNavColor();
}

// Hamburger
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');
let menuOpen = false;
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach((el, i) => {
  if (!el.dataset.delay) el.dataset.delay = i % 4;
  observer.observe(el);
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Contact form
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // SMS consent is optional — track value but never block submission
    const consentBox = form.querySelector('#sms-consent');
    const smsConsent = consentBox ? consentBox.checked : false;

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1200));
    form.style.display = 'none';
    const success = document.getElementById('form-success');
    if (success) success.classList.add('show');
  });
}

// Smooth scroll with nav offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = (nav ? nav.offsetHeight : 68) + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
