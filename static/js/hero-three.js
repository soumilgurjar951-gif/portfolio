/* ============================================================
   HERO THREE.JS — subtle neon particle field + grid + orbs
   Performance: auto-degrades on mobile / reduced-motion / low FPS
   Tune: PARTICLE_COUNT, speeds, or set ?static=1 for fallback
   ============================================================ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = new URLSearchParams(location.search);
  if (reduced || qs.has('static')) { canvas.style.display = 'none'; return; }

  const isMobile = Math.min(screen.width, screen.height) < 700 || /Android|iPhone|iPad/i.test(navigator.userAgent);
  // PERFORMANCE knobs — lower these on weak devices:
  let PARTICLE_COUNT = isMobile ? 350 : 900;
  const COLORS = [0x22d3ee, 0x8b5cf6, 0xff2fb3];

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile, powerPreference: 'low-power' });
  } catch (e) { canvas.style.display = 'none'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060e, 0.055);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0.6, 9);

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  // --- particle field ---
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 34;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    tmp.setHex(COLORS[i % COLORS.length]);
    col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // --- neon grid floor (perspective, Tron-like) ---
  const grid = new THREE.GridHelper(60, 60, 0x22d3ee, 0x2a2f6b);
  grid.position.y = -4.2;
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  scene.add(grid);

  // --- glow orbs ---
  const orbs = [];
  [[-7, 1.5, -4, 0x8b5cf6], [7, -0.5, -6, 0x22d3ee], [0, 2.5, -9, 0xff2fb3]].forEach(([x, y, z, c]) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 24, 24),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    m.position.set(x, y, z); scene.add(m); orbs.push(m);
  });

  // --- connecting lines (sparse, cheap) ---
  let lines = null;
  if (!isMobile) {
    const N = 60, lp = new Float32Array(N * 2 * 3);
    const p = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const a = Math.floor(Math.random() * PARTICLE_COUNT), b = Math.floor(Math.random() * PARTICLE_COUNT);
      lp.set([p[a*3], p[a*3+1], p[a*3+2], p[b*3], p[b*3+1], p[b*3+2]], i * 6);
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
    lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x3b4a8f, transparent: true, opacity: 0.25 }));
    scene.add(lines);
  }

  // --- mouse parallax ---
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => {
    tx = (e.clientX / innerWidth - 0.5);
    ty = (e.clientY / innerHeight - 0.5);
  }, { passive: true });

  // --- auto quality: drop particles if FPS low ---
  let frames = 0, lastQ = performance.now(), degraded = false;
  function autoQuality(now) {
    frames++;
    if (now - lastQ > 2500) {
      const fps = frames * 1000 / (now - lastQ);
      frames = 0; lastQ = now;
      if (fps < 28 && !degraded) {
        degraded = true;
        PARTICLE_COUNT = Math.floor(PARTICLE_COUNT / 2);
        geo.setDrawRange(0, PARTICLE_COUNT); // halve draw, no realloc
        if (lines) lines.visible = false;
      }
    }
  }

  // --- pause when tab hidden / hero off-screen ---
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  let heroVisible = true;
  if ('IntersectionObserver' in window) {
    const hero = document.querySelector('.hero');
    if (hero) new IntersectionObserver(en => { heroVisible = en[0].isIntersecting; }).observe(hero);
  }

  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible || !heroVisible) return;
    const t = clock.getElapsedTime();
    autoQuality(performance.now());

    const arr = geo.attributes.position.array;
    const speed = isMobile ? 0.25 : 0.5;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += Math.sin(t * speed + i) * 0.0016;   // drift
      arr[i * 3] += Math.cos(t * speed * 0.7 + i * 0.5) * 0.0012;
    }
    geo.attributes.position.needsUpdate = true;

    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    camera.position.x = mx * 1.6;
    camera.position.y = 0.6 - my * 1.0;
    camera.lookAt(0, 0, 0);

    grid.position.z = (t * 0.35) % 1;
    orbs.forEach((o, i) => { o.position.y += Math.sin(t * 0.8 + i * 2) * 0.002; });
    points.rotation.y = t * 0.02;

    // fade canvas slightly after scrolling past hero for perf + readability
    const fade = Math.max(0.25, 1 - scrollY / (innerHeight * 1.6));
    canvas.style.opacity = fade.toFixed(2);

    renderer.render(scene, camera);
  })();
})();
