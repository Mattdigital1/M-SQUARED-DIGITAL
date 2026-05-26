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
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const firstName = form.querySelector('#first-name').value.trim();
    const lastName  = form.querySelector('#last-name').value.trim();
    const smsTransactional = form.querySelector('#sms-transactional') ? form.querySelector('#sms-transactional').checked : false;
    const smsMarketing = form.querySelector('#sms-marketing') ? form.querySelector('#sms-marketing').checked : false;

    const payload = {
      firstName,
      lastName,
      fullName: firstName + ' ' + lastName,
      email:       form.querySelector('#email').value.trim(),
      phone:       form.querySelector('#phone').value.trim(),
      companyName: form.querySelector('#business').value.trim(),
      service:     form.querySelector('#service').value,
      budget:      form.querySelector('#budget').value,
      message:     form.querySelector('#message').value.trim(),
      smsTransactional,
      smsMarketing,
      smsConsent: smsTransactional || smsMarketing,
      source:      'Contact Page',
      submittedAt: new Date().toISOString()
    };

    try {
      await fetch('https://services.leadconnectorhq.com/hooks/NJbNOm6MMu7bUAmukRIU/webhook-trigger/39335947-02ff-4416-a421-ffe4c22da8de', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (_) {}

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
