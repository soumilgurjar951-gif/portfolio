import Backdrop from './components/Backdrop.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Chatbot from './components/Chatbot.jsx';
import { About, Skills, Contact, Footer } from './components/Sections.jsx';

function Marquee() {
  const text = (
    <span>
      <b>DJANGO</b> · PYTHON · <b>REACT</b> · DRF · POSTGRESQL · <b>JAVASCRIPT</b> · FRAMER MOTION
      · AUTH · CRUD · ORM · <b>OPEN TO INTERNSHIP</b> ·&nbsp;
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {text}
        {text}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
