import { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE, EMAIL, GITHUB_URL, LINKEDIN_URL, LOCATION, SKILL_GROUPS } from '../data.js';
import { fadeUp } from './Work.jsx';

// Shared scroll-reveal wrapper: whileInView replaces GSAP ScrollTrigger.
export function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">02 // About</div>
          <h2 className="h2">
            Builder from <span className="grad">Indore.</span>
          </h2>
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <div className="photo-frame">
              <div className="photo-ph">
                <div className="avatar">SG</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
                  SOUMIL_GURJAR.JPG · placeholder
                </div>
              </div>
              <div className="cap">
                <span>📍 {LOCATION}</span>
                <span>● available</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="about-copy" delay={0.1}>
            <span className="badge-open">● OPEN TO INTERNSHIP</span>
            <p>
              I&rsquo;m <strong>Soumil</strong>, an engineering student from Indore who loves
              building <strong>real web applications with Django and Python</strong>.
            </p>
            <p>
              I focus on <strong>backend and full-stack development</strong>, turning ideas into
              working products — models, auth, feeds, carts, scheduling, deployments.
            </p>
            <p>
              I&rsquo;m currently looking for <strong>internship opportunities</strong> where I can
              contribute to real Django / full-stack projects.
            </p>
            <div className="do-grid">
              <div className="do"><div className="ico">⚙️</div><h4>Backend</h4><p>Django, DRF, ORM, auth, REST APIs that stay clean.</p></div>
              <div className="do"><div className="ico">◈</div><h4>Full-Stack</h4><p>React or templates + responsive UI on solid models.</p></div>
              <div className="do"><div className="ico">✦</div><h4>AI Direction</h4><p>Wiring API-driven AI features into Django apps.</p></div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary btn-sm" href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a className="btn btn-ghost btn-sm" href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">03 // Arsenal</div>
          <h2 className="h2">
            Skills &amp; <span className="grad">technologies.</span>
          </h2>
          <p className="lead">
            Hover any chip to see where I&rsquo;ve actually used it. Everything maps to a shipped repo.
          </p>
        </Reveal>
        <div className="skills-grid">
          {SKILL_GROUPS.map((g, gi) => (
            <motion.div
              key={g.title}
              className="skill-group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: gi * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <h3>{g.title}</h3>
              <div className="skill-pills">
                {g.skills.map(([name, tip]) => (
                  <span key={name} className="pill">
                    {name}
                    <span className="tip">{tip}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', opportunity: 'internship', message: '' });
  const [status, setStatus] = useState(null); // {ok, text}
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || !form.message.trim()) {
      setStatus({ ok: false, text: 'Please add your name, a valid email, and a message.' });
      return;
    }
    setSending(true);
    try {
      // Headless Django API (proxied in dev; VITE_API_URL in prod)
      const res = await fetch(API_BASE + '/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Send failed');
      setStatus({ ok: true, text: data.detail });
      setForm({ name: '', email: '', opportunity: 'internship', message: '' });
    } catch (err) {
      // Fallback: Django not reachable (e.g. static preview) → mailto
      setStatus({
        ok: false,
        text: 'Backend unreachable — email me directly instead.',
      });
      window.location.href =
        'mailto:' + EMAIL + '?subject=' +
        encodeURIComponent('[Portfolio] ' + form.opportunity + ' — ' + form.name) +
        '&body=' + encodeURIComponent(form.message + '\n\n— ' + form.name);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">04 // Contact</div>
          <h2 className="h2">
            Let&rsquo;s build <span className="grad">something.</span>
          </h2>
          <p className="lead">
            I&rsquo;m open to <strong style={{ color: '#fff' }}>internship</strong> and{' '}
            <strong style={{ color: '#fff' }}>full-stack / Django developer</strong> roles. If you
            need someone who can own features end-to-end in Django and ship real products,
            let&rsquo;s talk.
          </p>
        </Reveal>
        <div className="contact-grid">
          <Reveal>
            <div className="form-card">
              {status && (
                <div className={'flash ' + (status.ok ? 'success' : 'error')}>{status.text}</div>
              )}
              <form onSubmit={submit} noValidate>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="fName">Name</label>
                    <input
                      id="fName" placeholder="Your name" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="fEmail">Email</label>
                    <input
                      id="fEmail" type="email" placeholder="you@company.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} required
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="fOpp">Opportunity type</label>
                  <select
                    id="fOpp" value={form.opportunity}
                    onChange={(e) => setForm({ ...form, opportunity: e.target.value })}
                  >
                    <option value="internship">Internship</option>
                    <option value="fulltime">Full-time</option>
                    <option value="collab">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="fMsg">Message</label>
                  <textarea
                    id="fMsg" placeholder="Hi Soumil — we have a Django internship…" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} required
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
                  {sending ? 'Sending…' : 'Send Message ✦'}
                </button>
              </form>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="direct-card">
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 6px' }}>Direct lines</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 18px' }}>
                Prefer email or DMs? Reach me here — fastest response on email.
              </p>
              <a className="row" href={'mailto:' + EMAIL}><span className="ric">✉</span><span><small>EMAIL</small><b>{EMAIL}</b></span></a>
              <a className="row" href={LINKEDIN_URL} target="_blank" rel="noreferrer"><span className="ric">in</span><span><small>LINKEDIN</small><b>linkedin.com/in/soumil-gurjar</b></span></a>
              <a className="row" href={GITHUB_URL} target="_blank" rel="noreferrer"><span className="ric">⬡</span><span><small>GITHUB</small><b>github.com/soumilgurjar951-gif</b></span></a>
              <div className="reply-note">
                ◉ I usually reply within 24–48 hours.<br />
                ◉ Currently: <b style={{ color: '#a7f3d0' }}>Open to Internship · Open to Full-Stack / Django Roles</b>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="foot">
        <div>
          © 2026 Soumil Gurjar · {LOCATION} ·{' '}
          <span style={{ color: '#a7f3d0' }}>Open to Internship</span> · React edition
        </div>
        <div className="socials">
          <a className="soc" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">⬡</a>
          <a className="soc" href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          <a className="soc" href={'mailto:' + EMAIL} aria-label="Email">✉</a>
        </div>
      </div>
    </footer>
  );
}
