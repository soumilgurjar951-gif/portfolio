import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Work', '#work'],
    ['About', '#about'],
    ['Skills', '#skills'],
    ['Contact', '#contact'],
  ];
  return (
    <motion.nav
      className="nav"
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-inner">
        <a className="logo" href="#top">
          <span className="logo-mark">S</span>
          <span>
            Soumil Gurjar<small>AI · FULL-STACK</small>
          </span>
        </a>
        <div className="nav-links" style={open ? { display: 'flex' } : undefined}>
          {links.map(([label, href]) => (
            <a key={href} className="nl" href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
        <a href="#contact" className="btn btn-primary nav-cta">
          Let&rsquo;s Work Together ↗
        </a>
        <button className="burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          ☰
        </button>
      </div>
    </motion.nav>
  );
}
