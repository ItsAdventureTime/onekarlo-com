/* ==========================================================================
   Project Showcase Component - Clean Editorial Layout & Spacing - onekarlo.com
   ========================================================================== */

import { PROJECTS_DATA, ProjectItem } from './data';

export class ProjectShowcase {
  private filterBar: HTMLElement;
  private gridEl: HTMLElement;
  private currentFilter: string = 'all';

  constructor(filterBarId: string, gridId: string) {
    const filter = document.getElementById(filterBarId);
    const grid = document.getElementById(gridId);
    if (!filter || !grid) throw new Error('Project DOM elements not found');

    this.filterBar = filter;
    this.gridEl = grid;

    this.renderFilters();
    this.initialRenderProjects();
  }

  private renderFilters() {
    const categories = [
      { id: 'all', label: 'All Disciplines' },
      { id: 'ai', label: 'AI Infra & LLMOps' },
      { id: 'devops', label: 'DevOps & Linux' },
      { id: 'biz', label: 'Systems & Ops' },
      { id: 'edu', label: 'ESL & Operations' }
    ];

    this.filterBar.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat.id === this.currentFilter ? 'active' : ''}" type="button" data-filter="${cat.id}">
        ${cat.label}
      </button>
    `).join('');

    this.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = (e.currentTarget as HTMLElement).getAttribute('data-filter');
        if (filter && filter !== this.currentFilter) {
          this.currentFilter = filter;
          this.updateActiveFilterBtn();
          this.applyFilterWithSmoothTransition();
        }
      });
    });
  }

  private updateActiveFilterBtn() {
    this.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.getAttribute('data-filter') === this.currentFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  private initialRenderProjects() {
    this.gridEl.innerHTML = PROJECTS_DATA.map(p => this.createCardHtml(p)).join('');
  }

  private applyFilterWithSmoothTransition() {
    // Step 1: Lock current grid height to prevent page scroll shifts
    const currentHeight = this.gridEl.getBoundingClientRect().height;
    this.gridEl.style.minHeight = `${currentHeight}px`;

    const cards = Array.from(this.gridEl.querySelectorAll('.project-card')) as HTMLElement[];

    // Step 2: Smoothly fade out cards being hidden with Android MD3 curve
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const isVisible = this.currentFilter === 'all' || cardCategory === this.currentFilter;

      if (!isVisible) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px) scale(0.96)';
        card.style.pointerEvents = 'none';
      }
    });

    // Step 3: Switch display states and trigger double-frame RAF transition for silky 120fps entrance
    setTimeout(() => {
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const isVisible = this.currentFilter === 'all' || cardCategory === this.currentFilter;

        if (isVisible) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
              card.style.pointerEvents = 'auto';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });

      // Step 4: Gracefully release minHeight after MD3 curve completes
      setTimeout(() => {
        this.gridEl.style.minHeight = 'auto';
      }, 240);
    }, 180);
  }

  private createCardHtml(p: ProjectItem): string {
    return `
      <article class="project-card" data-category="${p.category}" style="transition: opacity 220ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 220ms cubic-bezier(0.05, 0.7, 0.1, 1), border-color 150ms ease-out, box-shadow 150ms ease-out;">
        <div class="project-card-top">
          <div class="project-category">${p.categoryLabel}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
          </div>
        </div>
        <div class="project-card-bottom">
          <div class="project-metrics-divider">
            <div class="project-metrics-heading">
              Key Impact Metrics
            </div>
            <div class="project-metrics-list">
              ${p.metrics.map(m => `
                <div class="project-metric-item">
                  <span class="metric-icon">✔</span>
                  <span class="metric-text">${m}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </article>
    `;
  }
}
