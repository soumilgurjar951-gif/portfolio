import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../data.js';

const FILTERS = [
  ['all', 'All'],
  ['web-apps', 'Web Apps'],
  ['ecommerce', 'E-Commerce'],
  ['social', 'Social'],
  ['others', 'Others'],
];

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function CaseModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-back"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="modal"
        initial={{ y: 40, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 24, scale: 0.98, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="modal-head">
          <div>
            <h3>{project.title}</h3>
            <p className="sub">{project.tagline}</p>
          </div>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="tags">
            {project.stack.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="case-grid">
            <div className="case"><h4>Problem</h4><p>{project.problem}</p></div>
            <div className="case"><h4>Solution</h4><p>{project.solution}</p></div>
            <div className="case"><h4>Your role</h4><p>{project.role}</p></div>
            <div className="case"><h4>Outcome</h4><p>{project.outcome}</p></div>
            <div className="case full"><h4>Learnings</h4><p>{project.learnings}</p></div>
          </div>
          <div className="modal-ctas">
            <a className="btn btn-primary btn-sm" href={project.repo} target="_blank" rel="noreferrer">
              View on GitHub ↗
            </a>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              ← Back to work
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const [filter, setFilter] = useState('all');
  const [openSlug, setOpenSlug] = useState(() =>
    window.location.hash.length > 1 ? window.location.hash.slice(1) : null
  );
  const openProject = PROJECTS.find((p) => p.slug === openSlug) || null;
  const visible = PROJECTS.filter((p) => filter === 'all' || p.category === filter);

  return (
    <section id="work">
      <div className="wrap">
        <motion.div
          className="section-head"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="kicker">01 // Selected Work</div>
          <h2 className="h2">
            Projects that <span className="grad">actually ship.</span>
          </h2>
          <p className="lead">
            Seven real builds across education, commerce, social, business, healthcare, finance and freelancing.
            Click any card for the full case study.
          </p>
        </motion.div>

        <div className="filters">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              className={'filter' + (filter === key ? ' active' : '')}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <motion.div className="proj-grid" layout>
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.article
                layout
                key={p.slug}
                className="proj"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.015 }}
                onClick={() => {
                  setOpenSlug(p.slug);
                  history.replaceState(null, '', '#' + p.slug);
                }}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpenSlug(p.slug)}
                role="button"
                aria-label={'Open ' + p.title + ' case study'}
              >
                <div className={'proj-thumb thumb-' + p.accent}>
                  <div className="thumb-grid" />
                  <span className="glyph">{p.icon}</span>
                  <span className="proj-cat">{p.categoryLabel}</span>
                </div>
                <div className="proj-body">
                  <h3>{p.title}</h3>
                  <p>{p.tagline}</p>
                  <div className="tags">
                    {p.stack.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <div className="proj-foot">
                    <a
                      className="proj-link"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub ↗
                    </a>
                    <span className="proj-open">Case study →</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openProject && (
          <CaseModal
            project={openProject}
            onClose={() => {
              setOpenSlug(null);
              history.replaceState(null, '', window.location.pathname);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
