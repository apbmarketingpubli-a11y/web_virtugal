// ============================================================
// VIRTUGAL — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──────────────────────────────────────────
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  });

  function animateCursor() {
    if (ring) {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ── Navbar scroll ──────────────────────────────────────────
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  // ── Hamburger menu ─────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // ── Scroll Reveal ──────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // ── Smooth scroll for anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Counter animation ─────────────────────────────────────
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const counters = e.target.querySelectorAll('[data-count]');
        counters.forEach(c => {
          animateCounter(c, parseInt(c.dataset.count), c.dataset.suffix || '');
        });
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.hero-stats, .stats-row').forEach(el => statsObserver.observe(el));

  // ── Contact Form ──────────────────────────────────────────
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const status = document.getElementById('formStatus');
    const privacyCheck = document.getElementById('privacyCheck');

    if (!privacyCheck?.checked) {
      showStatus('error', 'Debes aceptar la política de privacidad para continuar.');
      return;
    }

    btn.textContent = 'ENVIANDO...';
    btn.disabled = true;

    // Simulate send (replace with actual endpoint)
    await new Promise(r => setTimeout(r, 1500));

    btn.textContent = 'ENVIAR MENSAJE';
    btn.disabled = false;
    form.reset();
    showStatus('success', '✓ Mensaje enviado correctamente. Te responderemos pronto.');

    function showStatus(type, msg) {
      if (!status) return;
      status.className = 'form-status ' + type;
      status.textContent = msg;
      setTimeout(() => status.className = 'form-status', 5000);
    }
  });

  // ── Cookie Banner ──────────────────────────────────────────
  const banner = document.getElementById('cookieBanner');
  if (banner && !localStorage.getItem('vg_cookie')) {
    setTimeout(() => banner.classList.add('show'), 1500);
  }
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('vg_cookie', 'accepted');
    banner?.classList.remove('show');
  });
  document.getElementById('cookieReject')?.addEventListener('click', () => {
    localStorage.setItem('vg_cookie', 'rejected');
    banner?.classList.remove('show');
  });

  // ── Modals ─────────────────────────────────────────────────
  function openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(el.dataset.modal); });
  });
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) {
        const overlay = el.closest('.modal-overlay') || el;
        closeModal(overlay.id);
      }
    });
  });
  document.querySelector('.modal')?.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
    }
  });

  // Expose globally
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ── Blog filtering (future-proof) ─────────────────────────
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.blog-card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = match ? '1' : '0.3';
        card.style.pointerEvents = match ? 'auto' : 'none';
      });
    });
  });

  // ── Parallax on hero orb ──────────────────────────────────
  const heroOrb = document.querySelector('.hero-orb');
  window.addEventListener('scroll', () => {
    if (heroOrb) heroOrb.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  });

  // ── Year in footer ────────────────────────────────────────
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
