import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LOCATION, RESUME_URL } from '../data.js';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const lineUp = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { y: 26, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  // 3D tilt on the holo card via Framer Motion values (no manual rAF needed)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const rY = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });

  return (
    <header className="hero" id="top">
      <div className="hero-grid">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <span className="status-pill">
              <span className="status-dot" /> OPEN TO INTERNSHIP · DJANGO / FULL-STACK ROLES
            </span>
          </motion.div>
          <h1>
            {['Soumil Gurjar', 'AI & Full-Stack', 'Developer'].map((line, i) => (
              <span key={line} style={{ display: 'block', overflow: 'hidden' }}>
                <motion.span
                  variants={lineUp}
                  style={{ display: 'block' }}
                  className={i === 1 ? 'glitch' : undefined}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-sub" variants={fadeUp}>
            <strong>Django backend &amp; full-stack developer</strong> building real web apps &amp;
            AI tools. Based in {LOCATION} — I ship working products, not just tutorials.
          </motion.p>
          <motion.div className="hero-ctas" variants={fadeUp}>
            <a href="#work" className="btn btn-primary">
              View My Work ↓
            </a>
            <a href={RESUME_URL} className="btn btn-ghost" download>
              ⤓ Download Resume
            </a>
          </motion.div>
          <motion.div className="chips" variants={fadeUp}>
            <span className="chip">Django</span>
            <span className="chip">Python</span>
            <span className="chip">Full-Stack</span>
            <span className="chip hot">● Open to Internship</span>
          </motion.div>
          <motion.div className="hero-meta" variants={fadeUp}>
            <div><b>7</b> shipped apps</div>
            <div><b>7</b> projects · edu → freelance</div>
            <div><b>24–48h</b> reply time</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ y: 50, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            px.set((e.clientX - r.left) / r.width);
            py.set((e.clientY - r.top) / r.height);
          }}
          onPointerLeave={() => {
            px.set(0.5);
            py.set(0.5);
          }}
        >
          <motion.div className="holo-card" style={{ rotateX: rX, rotateY: rY }}>
            <div className="holo-top">
              <i style={{ background: '#ff5f57' }} />
              <i style={{ background: '#febc2e' }} />
              <i style={{ background: '#28c840' }} />
              <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
                soumil@dev — portfolio.py
              </span>
            </div>
            <div className="holo-body">
              <span className="k">class</span> <span className="s">FullStackDev</span>:{'\n'}
              {'    '}name = <span className="s">"Soumil Gurjar"</span>{'\n'}
              {'    '}base = <span className="s">"Indore, India"</span>{'\n'}
              {'    '}stack = [<span className="s">"Django"</span>, <span className="s">"React"</span>,{' '}
              <span className="s">"DRF"</span>]{'\n\n'}
              {'    '}<span className="k">def</span> <span className="f">ship</span>(self, idea):{'\n'}
              {'        '}<span className="k">return</span> self.models(idea).views().deploy(){'\n\n'}
              <span className="f">&gt;&gt;&gt; dev.ship</span>(<span className="s">"your_next_feature"</span>){'\n'}
              <span className="s">✓ deployed &amp; working</span>
            </div>
            <div className="holo-foot">
              <span>● django · live</span>
              <span>lat 22.72 / lon 75.86</span>
            </div>
          </motion.div>
          <motion.div
            className="float-badge"
            style={{ top: -18, right: 24 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <b>◈</b> Django · DRF · ORM
          </motion.div>
          <motion.div
            className="float-badge"
            style={{ bottom: -18, left: 24 }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <b>⬢</b> 7 real projects on GitHub
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
