/* ==========================================================================
   Main Application Entry Point & Micro-Interactions - onekarlo.com
   ========================================================================== */

import './styles/main.css';
import './styles/components.css';

import { PHILOSOPHY_STEPS } from './data';
import { TerminalEmulator, triggerHackerScramble } from './terminal';
import { TopologyInspector } from './topology';
import { ProjectShowcase } from './projects';
import { animate } from 'motion/mini';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
  initSectionStaggeredReveal();
  initHashNavigation();
  initKeyboardShortcuts();
});

/* --------------------------------------------------------------------------
   Header Shrink on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScrollShrink() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
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
   Dynamic Navigation Active Indicator Slider
   -------------------------------------------------------------------------- */
function initNavSlider() {
  const navContainer = document.querySelector('.nav-menu-container') as HTMLElement;
  const slider = document.getElementById('nav-slider');
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  if (!navContainer || !slider || !links.length) return;

  function updateSlider(activeLink: HTMLAnchorElement) {
    links.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');

    const containerRect = navContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    slider!.style.transform = `translateX(${left}px)`;
    slider!.style.width = `${width}px`;
  }

  const initialActive = document.querySelector<HTMLAnchorElement>('.nav-link.active') || links[0];
  if (prefersReducedMotion()) updateSlider(initialActive);
  else setTimeout(() => updateSlider(initialActive), 120);

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
          targetSection.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Stable Initial Hash Position
   -------------------------------------------------------------------------- */
function initHashNavigation() {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#')) return;

  let targetId: string;
  try {
    targetId = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) return;

  const alignTarget = () => {
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  // Dynamic project and philosophy content changes document height during
  // startup. Re-align after two frames so a direct section link lands reliably.
  const settleLayout = () => {
    requestAnimationFrame(() => requestAnimationFrame(alignTarget));
  };

  if ('fonts' in document) {
    document.fonts.ready.then(settleLayout);
  } else {
    settleLayout();
  }
}

/* --------------------------------------------------------------------------
   Background Ambient Cyber Particles (Optimized with Visibility Pause & RAF Tracking)
   -------------------------------------------------------------------------- */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let isRunning = !prefersReducedMotion();
  let rafId: number | null = null;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const startLoop = () => {
    stopLoop();
    if (isRunning) {
      rafId = requestAnimationFrame(animate);
    }
  };

  // Pause animation when tab is inactive to save battery and GPU cycles
  document.addEventListener('visibilitychange', () => {
    const shouldRun = !document.hidden && !prefersReducedMotion();
    if (shouldRun !== isRunning) {
      isRunning = shouldRun;
      if (isRunning) {
        startLoop();
      } else {
        stopLoop();
      }
    }
  });

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
  }

  const particleCount = Math.min(Math.floor(width / 35), 25);
  const particles: Particle[] = [];
  const colors = ['rgba(16, 185, 129, ', 'rgba(6, 182, 212, '];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate() {
    if (!isRunning) {
      rafId = null;
      return;
    }

    ctx!.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = p.color + '0.45)';
      ctx!.fill();
    }

    rafId = requestAnimationFrame(animate);
  }

  if (isRunning) startLoop();
}

/* --------------------------------------------------------------------------
   Cursor Glow Follower
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || prefersReducedMotion()) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Card Spotlight Micro-Interactions
   -------------------------------------------------------------------------- */
function initCardSpotlights() {
  document.addEventListener('mousemove', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.pillar-card, .project-card, .pipeline-step, .topo-node');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animations
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
   SmoothUI-inspired Section Stagger (vanilla DOM + Motion)
   -------------------------------------------------------------------------- */
function initSectionStaggeredReveal() {
  const groups = document.querySelectorAll<HTMLElement>('[data-reveal-stagger]');
  if (!groups.length) return;

  // The composition pattern is borrowed from SmoothUI, but stays framework-free:
  // Motion handles transform/opacity only, while CSS keeps content visible without JS.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const group = entry.target as HTMLElement;
      observer.unobserve(group);

      if (prefersReducedMotion()) return;

      Array.from(group.children).forEach((child, index) => {
        const element = child as HTMLElement;

        // Set styles only when the group is ready to animate; never reserve layout space.
        element.style.opacity = '0';
        element.style.transform = 'translateY(14px)';

        animate(
          element,
          { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
          { duration: 0.42, delay: index * 0.07, ease: 'easeOut' }
        );
      });
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  groups.forEach(group => observer.observe(group));
}

/* --------------------------------------------------------------------------
   Philosophy Pipeline Rendering
   -------------------------------------------------------------------------- */
function initPhilosophyPipeline() {
  const container = document.getElementById('philosophy-pipeline');
  if (!container) return;

  container.innerHTML = PHILOSOPHY_STEPS.map(step => `
    <div class="pipeline-step">
      <div class="step-header-row">
        <span class="step-num tabular-nums">0${step.stepNum}</span>
        <span class="step-phase">${step.phase}</span>
      </div>
      <h3 class="step-title">${step.title}</h3>
      <p class="step-desc">${step.desc}</p>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   Global Keyboard Shortcuts
   -------------------------------------------------------------------------- */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Press '/' to focus terminal input if not typing inside an input/textarea
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const terminalInput = document.getElementById('terminal-input') as HTMLInputElement;
      if (terminalInput) {
        terminalInput.focus();
        terminalInput.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      }
    }
  });
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
    new ProjectShowcase('projects-filter-bar', 'projects-grid', 'project-modal-root');
  } catch (err) {
    console.error('Failed to initialize project showcase:', err);
  }
}
