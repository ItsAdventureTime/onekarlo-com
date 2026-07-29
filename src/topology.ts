/* ==========================================================================
   Topology Inspector Component - Perfect Baseline Alignment - onekarlo.com
   ========================================================================== */

import { TOPOLOGY_NODES, TopoNode } from './data';

export class TopologyInspector {
  private gridEl: HTMLElement;
  private detailEl: HTMLElement;

  constructor(gridId: string, detailId: string) {
    const grid = document.getElementById(gridId);
    const detail = document.getElementById(detailId);
    if (!grid || !detail) throw new Error('Topology DOM elements not found');

    this.gridEl = grid;
    this.detailEl = detail;

    this.renderNodes();
    this.selectNode(TOPOLOGY_NODES[0].id);
  }

  private renderNodes() {
    this.gridEl.innerHTML = TOPOLOGY_NODES.map(node => `
      <div class="topo-node" data-id="${node.id}" tabindex="0" role="button" aria-label="Inspect ${node.name}">
        <div class="topo-icon-wrapper">
          <span class="topo-icon">${node.icon}</span>
        </div>
        <div class="topo-name">${node.name}</div>
        <div class="topo-sub">${node.subtitle}</div>
      </div>
    `).join('');

    this.gridEl.querySelectorAll('.topo-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) this.selectNode(id);
      });

      nodeEl.addEventListener('keydown', (e: Event) => {
        const keyEv = e as KeyboardEvent;
        if (keyEv.key === 'Enter' || keyEv.key === ' ') {
          keyEv.preventDefault();
          const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
          if (id) this.selectNode(id);
        }
      });
    });
  }

  public selectNode(id: string) {
    const node = TOPOLOGY_NODES.find(n => n.id === id) || TOPOLOGY_NODES[0];

    // Highlight active node
    this.gridEl.querySelectorAll('.topo-node').forEach(el => {
      if (el.getAttribute('data-id') === id) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Render detail card with clean iOS slide-fade-in animation
    this.renderDetailCard(node);
  }

  private renderDetailCard(node: TopoNode) {
    this.detailEl.classList.remove('fade-slide-in');
    
    void this.detailEl.offsetWidth;

    this.detailEl.innerHTML = `
      <div class="topology-detail-card fade-slide-in">
        <div class="topo-detail-header">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2.25rem;">${node.icon}</span>
            <div>
              <h3 style="font-size: 1.45rem;">${node.name}</h3>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">${node.subtitle}</span>
            </div>
          </div>
          <span class="topo-detail-badge">● ${node.status}</span>
        </div>
        <p class="topo-detail-desc">
          ${node.details}
        </p>
        <div class="topo-specs-section">
          <h4 class="topo-specs-heading">
            Key Specifications & Security Controls
          </h4>
          <div class="topo-specs-container">
            ${node.specs.map(spec => `<span class="topo-spec-badge">✓ ${spec}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    this.detailEl.classList.add('fade-slide-in');
  }
}
