/* ==========================================================================
   Main Application Entry Point & Micro-Interactions - onekarlo.com
   ========================================================================== */

import './styles/main.css';
import './styles/components.css';

import { PHILOSOPHY_STEPS } from './data';
import { TerminalEmulator, triggerHackerScramble } from './terminal';
import { TopologyInspector } from './topology';
import { ProjectShowcase } from './projects';

document.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  initCursorGlow();
  initNavSlider();
  initHeaderScrollShrink();
  initClickRipples();
  initCardSpotlights();
  initScrollReveal();
  initPhilosophyPipeline();
  initTerminal();
  initTopology();
  initProjects();
});

/* --------------------------------------------------------------------------
   Header Shrink on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScrollShrink() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shrunk');
    } else {
      header.classList.remove('shrunk');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Interactive Click Ripple Animation
   -------------------------------------------------------------------------- */
function initClickRipples() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const clickable = target.closest<HTMLElement>('button, .pillar-card, .topo-node, .project-card, .pipeline-step, .nav-link, .chip-btn');
    
    if (!clickable) return;

    const rect = clickable.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;

    const existing = clickable.querySelector('.ripple');
    if (existing) existing.remove();

    clickable.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   Dynamic Animated Navigation Active Indicator Slider
   -------------------------------------------------------------------------- */
function initNavSlider() {
  const menu = document.getElementById('nav-menu');
  const slider = document.getElementById('nav-slider');
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  if (!menu || !slider || !links.length) return;

  function updateSlider(activeLink: HTMLAnchorElement) {
    links.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');

    const menuRect = menu!.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const left = linkRect.left - menuRect.left;
    const width = linkRect.width;

    slider!.style.transform = `translateX(${left}px)`;
    slider!.style.width = `${width}px`;
  }

  const initialActive = document.querySelector<HTMLAnchorElement>('.nav-link.active') || links[0];
  setTimeout(() => updateSlider(initialActive), 100);

  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      const currentActive = document.querySelector<HTMLAnchorElement>('.nav-link.active') || links[0];
      updateSlider(currentActive);
    });
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector<HTMLAnchorElement>('.nav-link.active') || links[0];
    updateSlider(currentActive);
  });

  // IntersectionObserver for scroll-driven nav highlighting
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0.1
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const matchingLink = document.querySelector<HTMLAnchorElement>(`.nav-link[href="#${id}"]`);
        if (matchingLink) {
          updateSlider(matchingLink);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // Smooth scroll and slider update on click
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetEl = e.currentTarget as HTMLAnchorElement;
      const href = targetEl.getAttribute('href');
      updateSlider(targetEl);
      triggerHackerScramble(targetEl);

      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });

          const titleEl = targetSection.querySelector<HTMLElement>('.section-title, .hero-title');
          if (titleEl) {
            triggerHackerScramble(titleEl);
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Background Cyber Canvas (Decelerated Ambient Floating Drift)
   -------------------------------------------------------------------------- */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
  }

  const particleCount = Math.min(Math.floor(width / 24), 40);
  const particles: Particle[] = [];
  const colors = ['rgba(56, 189, 248, ', 'rgba(16, 185, 129, ', 'rgba(129, 140, 248, '];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx!.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = p.color + '0.7)';
      ctx!.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(p2.x, p2.y);
          ctx!.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 140)})`;
          ctx!.lineWidth = 0.8;
          ctx!.stroke();
        }
      }

      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 180) {
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(mouseX, mouseY);
        ctx!.strokeStyle = `rgba(16, 185, 129, ${0.18 * (1 - mdist / 180)})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   Cursor Glow Follower
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Card Mouse Spotlight Micro-Interactions
   -------------------------------------------------------------------------- */
function initCardSpotlights() {
  const cards = document.querySelectorAll<HTMLElement>('.pillar-card, .project-card, .pipeline-step, .topo-node');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animations (Simultaneous iOS Slide Reveals)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Module Initializations
   -------------------------------------------------------------------------- */
function initPhilosophyPipeline() {
  const container = document.getElementById('philosophy-pipeline');
  if (!container) return;

  container.innerHTML = PHILOSOPHY_STEPS.map(step => `
    <div class="pipeline-step" tabindex="0" role="article">
      <div class="step-num">0${step.stepNum}</div>
      <h3 class="step-title">${step.title}</h3>
      <p class="step-desc">${step.desc}</p>
    </div>
  `).join('');
}

function initTerminal() {
  try {
    new TerminalEmulator('terminal-app');
  } catch (err) {
    console.error('Failed to initialize terminal:', err);
  }
}

function initTopology() {
  try {
    new TopologyInspector('topology-nodes', 'topology-detail');
  } catch (err) {
    console.error('Failed to initialize topology:', err);
  }
}

function initProjects() {
  try {
    new ProjectShowcase('projects-filter-bar', 'projects-grid');
  } catch (err) {
    console.error('Failed to initialize project showcase:', err);
  }
}
