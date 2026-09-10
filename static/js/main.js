/* ============================================================
   MAIN — preloader, nav, GSAP reveals, filters, modal, tilt,
   cursor, form guard, toTop. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---------- preloader ---------- */
  const pre = document.getElementById('preloader');
  const fill = document.getElementById('loadFill');
  const pct = document.getElementById('loadPct');
  let p = 0;
  const tickLoad = setInterval(() => {
    p = Math.min(100, p + Math.random() * 22);
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = Math.floor(p) + '%';
    if (p >= 100) { clearInterval(tickLoad); setTimeout(() => pre && pre.classList.add('done'), 250); }
  }, 120);
  // safety: never trap user
  setTimeout(() => pre && pre.classList.add('done'), 3500);

  /* ---------- nav ---------- */
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    nav && nav.classList.toggle('scrolled', scrollY > 24);
    toTop && toTop.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop && toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  burger && burger.addEventListener('click', () => links.classList.toggle('open'));
  links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // active link highlight
  const secs = ['work', 'about', 'skills', 'contact'].map(id => document.getElementById(id));
  const navAs = links ? [...links.querySelectorAll('a.nl')] : [];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href').includes(e.target.id)));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(s => s && io.observe(s));
  }

  /* ---------- custom cursor ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && matchMedia('(hover:hover)').matches) {
    let x = 0, y = 0, rx = 0, ry = 0;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; });
    (function loop() { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.querySelectorAll('a,button,.proj,.pill,.filter').forEach(el => {
      el.addEventListener('pointerenter', () => document.body.classList.add('link-hover'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('link-hover'));
    });
  }

  /* ---------- hero entrance (cinematic split reveal) ---------- */
  if (hasGSAP && !reduced) {
    const tl = gsap.timeline({ delay: 0.55, defaults: { ease: 'power4.out' } });
    tl.from('#heroTitle .line-inner', { yPercent: 110, duration: 1.1, stagger: 0.12 })
      .from('[data-hero="pill"]', { y: -18, opacity: 0, duration: 0.7 }, '-=0.8')
      .from('[data-hero="sub"]', { y: 26, opacity: 0, duration: 0.8 }, '-=0.7')
      .from('[data-hero="ctas"]', { y: 26, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('[data-hero="chips"] .chip', { y: 16, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=0.55')
      .from('[data-hero="meta"]', { opacity: 0, duration: 0.8 }, '-=0.4')
      .from('[data-hero="visual"]', { y: 50, opacity: 0, scale: 0.96, duration: 1.1 }, '-=1.0');

    // scroll-driven: hero content drifts + fades (cinematic exit)
    gsap.to('.hero-grid', {
      y: -90, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // section reveals: fade/slide + stagger cards
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    // staggered project cards
    ScrollTrigger.batch('.proj', {
      start: 'top 90%', once: true,
      onEnter: batch => gsap.fromTo(batch, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', overwrite: true })
    });
    gsap.set('.proj', { opacity: 0 }); // initial (batch reveals); no-JS fallback keeps visible via .reveal? handled below
    // section headings: subtle char glow sweep
    gsap.utils.toArray('.h2').forEach(h => {
      gsap.from(h, { letterSpacing: '0.04em', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- project filters ---------- */
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.proj');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.category === f;
      c.classList.toggle('hide', !show);
      if (show && hasGSAP && !reduced) gsap.fromTo(c, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
      else if (show) { c.style.opacity = 1; }
    });
    if (hasGSAP && typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 100);
  }));

  /* ---------- case-study modal ---------- */
  let PROJECTS = [];
  try { PROJECTS = JSON.parse(document.getElementById('projects-data').textContent); } catch (e) { PROJECTS = []; }
  const back = document.getElementById('modalBack');
  const $ = id => document.getElementById(id);
  function openModal(slug) {
    const pr = PROJECTS.find(x => x.slug === slug);
    if (!pr) { location.href = '/work/' + slug + '/'; return; }
    $('mTitle').textContent = pr.title;
    $('mTag').textContent = pr.tagline;
    $('mProblem').textContent = pr.problem;
    $('mSolution').textContent = pr.solution;
    $('mRole').textContent = pr.role;
    $('mOutcome').textContent = pr.outcome;
    $('mLearn').textContent = pr.learnings;
    $('mTags').innerHTML = (pr.stack || []).map(s => `<span class="tag">${s}</span>`).join('');
    $('mRepo').href = pr.repo;
    $('mPage').href = '/work/' + pr.slug + '/';
    back.classList.add('open');
    document.body.style.overflow = 'hidden';
    history.replaceState(null, '', '#' + slug);
  }
  function closeModal() {
    back.classList.remove('open');
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname);
  }
  document.querySelectorAll('.proj').forEach(card => {
    const open = e => { if (e.target.closest('a')) return; openModal(card.dataset.project); };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.project); } });
  });
  $('mClose') && $('mClose').addEventListener('click', closeModal);
  back && back.addEventListener('click', e => { if (e.target === back) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  // deep-link: #connect-hub opens modal on load
  if (location.hash.length > 1) {
    const slug = location.hash.slice(1);
    if (PROJECTS.some(x => x.slug === slug)) setTimeout(() => openModal(slug), 900);
  }

  /* ---------- 3D tilt on cards + holo ---------- */
  if (matchMedia('(hover:hover)').matches && !reduced) {
    document.querySelectorAll('.proj, #tiltCard').forEach(card => {
      let raf = null;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px) scale(1.015)`;
        });
      });
      card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); card.style.transform = ''; });
    });
  }

  /* ---------- contact form guard ---------- */
  const form = document.getElementById('contactForm');
  form && form.addEventListener('submit', e => {
    const n = document.getElementById('fName').value.trim();
    const em = document.getElementById('fEmail').value.trim();
    const m = document.getElementById('fMsg').value.trim();
    if (!n || !em || !m || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
      e.preventDefault();
      alert('Please add your name, a valid email, and a message.');
    }
  });
})();
