(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Rotating hero roles
  const roleEl = document.getElementById('role');
  const roles = ['Discord bots', 'websites', 'community tools', 'new ideas'];
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  function typeRole() {
    if (reduce || !roleEl) return;
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    roleEl.textContent = word.slice(0, Math.max(0, charIndex));
    let delay = deleting ? 45 : 85;
    if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 250; }
    else if (charIndex >= roles[roleIndex].length) { deleting = true; delay = 1250; }
    setTimeout(typeRole, delay);
  }
  if (!reduce) setTimeout(typeRole, 1300);

  // Mobile navigation
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Scroll reveal
  const revealTargets = document.querySelectorAll('.section-heading, .about-lead, .terminal, .service-card, .project-card, .gallery-shot, .contact-section');
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add('visible'));

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const closeLightbox = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); };
  document.getElementById('galleryOpen')?.addEventListener('click', () => {
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
  });
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Subtle star field
  const canvas = document.getElementById('stars');
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    let stars = [], width = 0, height = 0, dpr = 1;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(95, Math.floor(width * height / 10500)) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.2 + .25, p: Math.random() * 6.28,
        s: Math.random() * .012 + .003
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => {
        s.p += s.s;
        ctx.globalAlpha = .18 + Math.abs(Math.sin(s.p)) * .5;
        ctx.fillStyle = '#e8d9a9';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(draw);
    }
    window.addEventListener('resize', size);
    size(); draw();
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();