/* ==========================================================================
   Project Showcase Component & Case Study Modal - onekarlo.com
   ========================================================================== */

import { PROJECTS_DATA, ProjectItem } from './data';

export class ProjectShowcase {
  private filterBar: HTMLElement;
  private gridEl: HTMLElement;
  private modalRoot: HTMLElement | null;
  private currentFilter: string = 'all';
  private modalTrigger: HTMLElement | null = null;
  private backgroundElements: Array<{ element: HTMLElement; ariaHidden: string | null; inert: boolean }> = [];

  constructor(filterBarId: string, gridId: string, modalRootId: string = 'project-modal-root') {
    const filter = document.getElementById(filterBarId);
    const grid = document.getElementById(gridId);
    if (!filter || !grid) throw new Error('Project DOM elements not found');

    this.filterBar = filter;
    this.gridEl = grid;
    this.modalRoot = document.getElementById(modalRootId);

    this.renderFilters();
    this.initialRenderProjects();
    this.bindModalEvents();
  }

  private renderFilters() {
    const categories = [
      { id: 'all', label: 'All projects' },
      { id: 'biz', label: 'Workflow software' },
      { id: 'ai', label: 'AI systems' },
      { id: 'devops', label: 'Platform work' },
      { id: 'edu', label: 'Learning systems' },
      { id: 'mobile', label: 'Mobile apps' }
    ];

    this.filterBar.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat.id === this.currentFilter ? 'active' : ''}" type="button" data-filter="${cat.id}" aria-pressed="${cat.id === this.currentFilter ? 'true' : 'false'}">
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
          this.applyFilter();
        }
      });
    });
  }

  private updateActiveFilterBtn() {
    this.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      const isCurrent = btn.getAttribute('data-filter') === this.currentFilter;
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });
  }

  private initialRenderProjects() {
    this.gridEl.innerHTML = PROJECTS_DATA.map((p, index) => this.createCardHtml(p, index)).join('');
    this.bindCardActions();
  }

  private applyFilter() {
    const cards = Array.from(this.gridEl.querySelectorAll('.project-card')) as HTMLElement[];
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const isVisible = this.currentFilter === 'all' || cardCategory === this.currentFilter;

      if (isVisible) {
        card.classList.remove('is-hidden');
        visibleCount += 1;
      } else {
        card.classList.add('is-hidden');
      }
    });

    const existingEmptyState = this.gridEl.querySelector('.projects-empty-state');
    if (visibleCount === 0 && !existingEmptyState) {
      this.gridEl.insertAdjacentHTML('beforeend', `
        <p class="projects-empty-state" role="status">
          No projects match this filter yet. Try another category.
        </p>
      `);
    } else if (visibleCount > 0) {
      existingEmptyState?.remove();
    }
  }

  private createCardHtml(p: ProjectItem, index: number): string {
    return `
      <article class="project-card" data-category="${p.category}" data-id="${p.id}" tabindex="0" aria-label="${p.title}">
        <div class="project-card-meta">
          <span class="project-index tabular-nums">${String(index + 1).padStart(2, '0')}</span>
          <span class="project-state">Current work</span>
        </div>
        <div class="project-card-top">
          <div class="project-header-row">
            <span class="project-category cat-${p.category}">${p.categoryLabel}</span>
            <button class="project-deepdive-btn" data-project-id="${p.id}" type="button" aria-label="Open details for ${p.title}">
              <span>View details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
          </div>
        </div>

        <div class="project-card-bottom">
          <div class="project-metrics-divider">
            <div class="project-metrics-heading">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              <span>What matters</span>
            </div>
            <div class="project-metrics-list">
              ${p.metrics.map(m => `
                <div class="project-metric-item">
                  <span class="metric-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  <span class="metric-text tabular-nums">${m}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  private bindCardActions() {
    this.gridEl.querySelectorAll('.project-deepdive-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetBtn = e.currentTarget as HTMLElement;
        const projectId = targetBtn.getAttribute('data-project-id');
        if (projectId) this.openCaseStudyModal(projectId, targetBtn);
      });
    });

    this.gridEl.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent opening if user clicked a link inside
        if ((e.target as HTMLElement).closest('a')) return;
        const projectId = card.getAttribute('data-id');
        if (projectId) this.openCaseStudyModal(projectId, card);
      });

      card.addEventListener('keydown', (e: Event) => {
        const keyEv = e as KeyboardEvent;
        if (keyEv.key === 'Enter' || keyEv.key === ' ') {
          if ((e.target as HTMLElement).closest('button, a')) return;
          keyEv.preventDefault();
          const projectId = card.getAttribute('data-id');
          if (projectId) this.openCaseStudyModal(projectId, card);
        }
      });
    });
  }

  public openCaseStudyModal(projectId: string, trigger?: HTMLElement) {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project || !this.modalRoot) return;

    this.modalTrigger = trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    const cs = project.caseStudy;

    this.modalRoot.innerHTML = `
      <div class="project-modal-backdrop" id="modal-backdrop">
        <div class="project-modal-container" id="project-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description" tabindex="-1">
          <div class="project-modal-header">
            <div>
              <span class="project-category cat-${project.category}">${project.categoryLabel}</span>
              <h2 class="project-modal-title" id="modal-title">${project.title}</h2>
            </div>
            <button class="modal-close-btn" id="modal-close-btn" type="button" aria-label="Close project details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="project-modal-body">
            <!-- Overview -->
            <div class="modal-section">
              <h4 class="modal-section-title">Overview</h4>
               <p class="modal-text" id="modal-description">${cs.overview}</p>
            </div>

            <!-- Challenge & Solution Grid -->
            <div class="modal-grid-two">
              <div class="modal-callout challenge">
                <div class="modal-callout-header">
                  <span class="modal-callout-icon" aria-hidden="true">!</span>
                  <h4>The challenge</h4>
                </div>
                <p>${cs.challenge}</p>
              </div>

              <div class="modal-callout solution">
                <div class="modal-callout-header">
                  <span class="modal-callout-icon">✓</span>
                  <h4>The approach</h4>
                </div>
                <p>${cs.solution}</p>
              </div>
            </div>

            <!-- Architecture Highlights -->
            <div class="modal-section">
              <h4 class="modal-section-title">Design notes</h4>
              <ul class="modal-bullet-list">
                ${cs.architectureHighlights.map(h => `
                  <li>
                    <span class="bullet-check">✓</span>
                    <span>${h}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Tech Stack Breakdown -->
            <div class="modal-section">
              <h4 class="modal-section-title">Built with</h4>
              <div class="modal-stack-grid">
                ${cs.techStack.map(stack => `
                  <div class="modal-stack-group">
                    <span class="modal-stack-label">${stack.label}</span>
                    <div class="modal-stack-pills">
                      ${stack.items.map(i => `<span class="tag-badge">${i}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Verified Metrics -->
            <div class="modal-section">
              <h4 class="modal-section-title">Signals</h4>
              <div class="modal-metrics-pills">
                ${project.metrics.map(m => `
                  <div class="modal-metric-badge">
                    <span class="metric-icon">✔</span>
                    <span class="tabular-nums">${m}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="project-modal-footer">
            <button class="modal-action-btn primary" id="modal-footer-close" type="button">Close details</button>
          </div>
        </div>
      </div>
    `;

    document.body.classList.add('modal-open');
    this.setBackgroundInert(true);

    const closeBtn = document.getElementById('modal-close-btn');
    const footerCloseBtn = document.getElementById('modal-footer-close');
    const backdrop = document.getElementById('modal-backdrop');

    const closeModal = () => this.closeCaseStudyModal();

    closeBtn?.addEventListener('click', closeModal);
    footerCloseBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    closeBtn?.focus();
  }

  private bindModalEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.modalRoot?.querySelector('[role="dialog"]')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeCaseStudyModal();
      } else if (e.key === 'Tab') {
        this.trapModalFocus(e);
      }
    });
  }

  private closeCaseStudyModal() {
    if (!this.modalRoot?.querySelector('[role="dialog"]')) return;

    this.modalRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    this.setBackgroundInert(false);
    const trigger = this.modalTrigger;
    this.modalTrigger = null;
    if (trigger?.isConnected) trigger.focus();
  }

  private setBackgroundInert(isInert: boolean) {
    if (isInert) {
      this.backgroundElements = Array.from(document.body.children)
        .filter(child => child !== this.modalRoot)
        .map(child => {
          const element = child as HTMLElement & { inert?: boolean };
          const state = {
            element,
            ariaHidden: element.getAttribute('aria-hidden'),
            inert: Boolean(element.inert)
          };
          element.setAttribute('aria-hidden', 'true');
          element.inert = true;
          return state;
        });
      return;
    }

    this.backgroundElements.forEach(({ element, ariaHidden, inert }) => {
      if (ariaHidden === null) element.removeAttribute('aria-hidden');
      else element.setAttribute('aria-hidden', ariaHidden);
      element.inert = inert;
    });
    this.backgroundElements = [];
  }

  private trapModalFocus(event: KeyboardEvent) {
    const dialog = this.modalRoot?.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) return;

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
