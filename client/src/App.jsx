import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronUp,
  Github,
  ExternalLink,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Twitter
} from "lucide-react";
import { portfolioData } from "./data/portfolioData";
import SpaceBackground from "./components/SpaceBackground";
import sleepingPhoto from "./assets/sleeping.jpg";

export default function App() {
  const [portfolio] = useState(portfolioData);
  const [showBottomDock, setShowBottomDock] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [displayedRole, setDisplayedRole] = useState("");

  const handleProjectsScroll = (event) => {
    event.preventDefault();
    const section = document.getElementById("projects");

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "#projects");
    }
  };

  useEffect(() => {
    let previousScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 32) {
        setShowBottomDock(true);
      } else if (currentScrollY > previousScrollY) {
        setShowBottomDock(false);
      } else if (currentScrollY < previousScrollY) {
        setShowBottomDock(true);
      }

      previousScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const roles = [
      "Web Developer",
      "Freelancer",
      "CS Undergrad",
      "AI Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let pauseTicks = 0;

    const timer = window.setInterval(() => {
      const currentRole = roles[roleIndex];

      if (pauseTicks > 0) {
        pauseTicks -= 1;
        if (pauseTicks === 0) {
          deleting = true;
        }
        return;
      }

      if (!deleting) {
        charIndex += 1;
        setDisplayedRole(currentRole.slice(0, charIndex));

        if (charIndex === currentRole.length) {
          pauseTicks = 12;
        }
      } else {
        charIndex -= 1;
        setDisplayedRole(currentRole.slice(0, Math.max(charIndex, 0)));

        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }
    }, 170);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const socialLinks = useMemo(() => {
    if (!portfolio?.links) {
      return [];
    }

    return [
      {
        label: "Email",
        href: `mailto:${portfolio.links.email}`,
        icon: <Mail size={18} />
      },
      {
        label: "LinkedIn",
        href: portfolio.links.linkedin,
        icon: <Linkedin size={18} />
      },
      {
        label: "Twitter",
        href: portfolio.links.twitter,
        icon: <Twitter size={18} />
      },
      {
        label: "GitHub",
        href: portfolio.links.github,
        icon: <Github size={18} />
      }
    ];
  }, [portfolio]);

  return (
    <div className="app-shell">
      <SpaceBackground darkMode={darkMode} />

      <main className="content">
        <section className="hero-shell">
          <div className="hero">
            <div className="hero-intro-mobile-wrap">
              <img className="hero-inline-pic" src={sleepingPhoto} alt="Binod Gogoi" />
              <div className="hero-heading-stack">
                <p className="hero-name">
                  <span className="hero-greeting">Hey, I&apos;m</span>
                  <span className="hero-name-main">{portfolio.hero.name}</span>
                  <span className="hero-suffix">a</span>
                </p>
                <h1 className="hero-role">
                  <span className="typewriter-role">{displayedRole || "\u00A0"}</span>
                </h1>
              </div>
            </div>

            <p className="about-text">{portfolio.about}</p>

            <div className="hero-actions">
              <a href="#projects" className="primary-link" onClick={handleProjectsScroll}>
                View My Work <ArrowUpRight size={18} />
              </a>
              <a href={`mailto:${portfolio.links.email}`} className="secondary-link">
                <Mail size={18} /> Email
              </a>
            </div>
          </div>

          <div className="hero-photo-panel" aria-label="Profile photo">
            <div className="hero-photo-ring">
              <img className="hero-photo-slot" src={sleepingPhoto} alt="Binod Gogoi" />
            </div>
          </div>

        </section>

        <section id="tech-stack" className="info-section tech-stack-section">
          <h2>Tech Stack</h2>
          <div className="tech-categories">
            {Object.entries(portfolio.techStack).map(([category, skills]) => (
              <div key={category} className="category">
                <h3>{category}</h3>
                <div className="skill-tags">
                  {skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="info-section">
          <h2>Experience</h2>
          <div className="experience-list">
            {portfolio.experience.map((item) => (
              <article key={`${item.title}-${item.period}`} className="experience-card">
                <div className="card-header">
                  <h3>{item.title}</h3>
                  <p>{item.period}</p>
                </div>
                <p className="company">{item.company}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="info-section projects-section">
          <h2>Selected Work</h2>
          <div className="projects-grid">
            {portfolio.projects.slice(0, 4).map((project) => (
              <article key={project.name} className="project-grid-card">
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                      <Github size={16} />
                    </a>
                    <a href={project.live} target="_blank" rel="noreferrer" aria-label="Live Demo">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                <p>{project.description}</p>
                <div className="tech-list">
                  {project.tech.map((stack) => (
                    <span key={`${project.name}-${stack}`}>{stack}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="more-projects-container">
            <a href="https://github.com/gogoib477" target="_blank" rel="noreferrer" className="more-projects-btn">
              More Projects <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        <section id="when-offline" className="info-section when-offline-section">
          <h2>When I Am Offline</h2>
          <div className="hobbies-grid">
            {portfolio.whenOffline.map((hobby) => (
              <div key={hobby.title} className="hobby-card">
                <span className="hobby-emoji">{hobby.emoji}</span>
                <h3>{hobby.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">

        <button
          type="button"
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top <ChevronUp size={18} />
        </button>
      </footer>

      <nav className={`bottom-dock ${showBottomDock ? "show" : "hide"}`} aria-label="Social links">
        {socialLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </a>
        ))}
        <span className="separator-pipe" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          className="dock-mode-button"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle theme"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>
    </div>
  );
}
