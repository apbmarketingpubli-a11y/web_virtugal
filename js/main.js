document.addEventListener('DOMContentLoaded', () => {
  // Year
  document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

  // Navbar scroll + active links
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 110) current = s.id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Hamburger
  const ham = document.querySelector('.hamburger');
  const mob = document.querySelector('.mobile-menu');
  ham?.addEventListener('click', () => { ham.classList.toggle('open'); mob?.classList.toggle('open'); });
  mob?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham?.classList.remove('open'); mob.classList.remove('open');
  }));

  // Smooth scroll (skip modal links)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.dataset.modal) return;
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 55);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Cookies
  const banner = document.getElementById('cookieBanner');
  if (!localStorage.getItem('vg_cookie')) setTimeout(() => banner?.classList.add('show'), 1800);
  document.getElementById('cOk')?.addEventListener('click', () => { localStorage.setItem('vg_cookie','ok'); banner?.classList.remove('show'); });
  document.getElementById('cNo')?.addEventListener('click', () => { localStorage.setItem('vg_cookie','no'); banner?.classList.remove('show'); });

  // Modals
  function oM(id) { const el = document.getElementById(id); if(el){el.classList.add('open'); document.body.style.overflow='hidden';} }
  function cM(id) { const el = document.getElementById(id); if(el){el.classList.remove('open'); document.body.style.overflow='';} }
  document.querySelectorAll('[data-modal]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); oM(el.dataset.modal); }));
  document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target===o) cM(o.id); }));
  document.addEventListener('keydown', e => { if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(o=>cM(o.id)); });
  window.cM = cM; window.oM = oM;
});
