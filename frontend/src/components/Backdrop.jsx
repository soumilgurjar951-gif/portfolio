import { useEffect, useRef } from 'react';

// Lightweight 2D neon particle network (no three.js needed).
// Respects prefers-reduced-motion + shrinks on mobile. Pure canvas, ~60 lines.
export default function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }
    const ctx = canvas.getContext('2d');
    const isMobile = Math.min(window.screen.width, window.screen.height) < 700;
    const N = isMobile ? 45 : 90;
    const COLORS = ['34,211,238', '139,92,246', '255,47,179'];
    let w, h, pts, raf, mx = 0.5, my = 0.5;

    const seed = () => {
      pts = Array.from({ length: N }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        c: COLORS[i % 3],
        r: Math.random() * 1.8 + 0.6,
      }));
    };
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      seed();
    };
    const onMove = (e) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx + (mx - 0.5) * 0.3;
        p.y += p.vy + (my - 0.5) * 0.3;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.8)`;
        ctx.shadowColor = `rgba(${p.c},0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      // sparse links
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(90,110,220,${(1 - d / 130) * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else tick();
    };
    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <div className="bg-scene" />
      <canvas id="bg-canvas" ref={ref} aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-scanlines" aria-hidden="true" />
    </>
  );
}
