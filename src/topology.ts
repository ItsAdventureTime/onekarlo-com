/* ==========================================================================
   Topology Inspector Component - Infrastructure Diagram & Specs - onekarlo.com
   ========================================================================== */

import { TOPOLOGY_NODES, TopoNode } from './data';
import { copyText } from './clipboard';

export class TopologyInspector {
  private gridEl: HTMLElement;
  private detailEl: HTMLElement;
  private selectedNodeId: string = TOPOLOGY_NODES[0].id;

  constructor(gridId: string, detailId: string) {
    const grid = document.getElementById(gridId);
    const detail = document.getElementById(detailId);
    if (!grid || !detail) throw new Error('Topology DOM elements not found');

    this.gridEl = grid;
    this.detailEl = detail;
    this.gridEl.setAttribute('role', 'group');
    this.gridEl.setAttribute('aria-label', 'Production topology layers');

    this.renderNodes();
    this.selectNode(TOPOLOGY_NODES[0].id);
  }

  private renderNodes() {
    this.gridEl.innerHTML = TOPOLOGY_NODES.map(node => `
      <button class="topo-node ${node.id === this.selectedNodeId ? 'active' : ''}" data-id="${node.id}" type="button" aria-pressed="${node.id === this.selectedNodeId ? 'true' : 'false'}" aria-label="Inspect ${node.name}">
        <div class="topo-node-status-indicator status-${node.statusType}"></div>
        <div class="topo-icon-wrapper">
          <span class="topo-icon-svg">${node.iconSvg}</span>
        </div>
        <div class="topo-name">${node.name}</div>
        <div class="topo-sub">${node.subtitle}</div>
        <div class="topo-status-tag status-${node.statusType}">${node.status}</div>
      </button>
    `).join('');

    this.gridEl.querySelectorAll('.topo-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) this.selectNode(id);
      });
    });
  }

  public selectNode(id: string) {
    this.selectedNodeId = id;
    const node = TOPOLOGY_NODES.find(n => n.id === id) || TOPOLOGY_NODES[0];

    // Update active class & ARIA
    this.gridEl.querySelectorAll('.topo-node').forEach(el => {
      const isCurrent = el.getAttribute('data-id') === id;
      el.classList.toggle('active', isCurrent);
      el.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });

    this.renderDetailCard(node);
  }

  private renderDetailCard(node: TopoNode) {
    this.detailEl.innerHTML = `
      <div class="topology-detail-card fade-slide-in">
        <div class="topo-detail-header">
          <div class="topo-detail-brand">
            <div class="topo-detail-icon">${node.iconSvg}</div>
            <div>
              <h3 class="topo-detail-title">${node.name}</h3>
              <div class="topo-detail-sub">${node.subtitle}</div>
            </div>
          </div>
          <span class="topo-detail-badge status-${node.statusType}">● ${node.status}</span>
        </div>

        <p class="topo-detail-desc">
          ${node.details}
        </p>

        <div class="topo-specs-section">
          <h4 class="topo-specs-heading">Production specifications and security controls</h4>
          <div class="topo-specs-container">
            ${node.specs.map(spec => `
              <span class="topo-spec-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ${spec}
              </span>
            `).join('')}
          </div>
        </div>

        ${node.configSnippet ? `
          <div class="topo-config-section">
            <div class="topo-config-header">
              <span class="topo-config-title">${node.configSnippetTitle || 'Configuration'}</span>
              <button class="topo-config-copy" data-config="${encodeURIComponent(node.configSnippet)}" type="button" aria-label="Copy configuration">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy configuration</span>
              </button>
              <span class="topo-copy-feedback" role="status" aria-live="polite"></span>
            </div>
            <pre class="topo-config-code"><code>${this.escapeHtml(node.configSnippet)}</code></pre>
          </div>
        ` : ''}
      </div>
    `;

    // Bind copy button
    const copyBtn = this.detailEl.querySelector('.topo-config-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const encoded = target.getAttribute('data-config');
        if (encoded) {
          const raw = decodeURIComponent(encoded);
          const copyButtonLabel = target.querySelector('span');
          const feedback = target.parentElement?.querySelector('.topo-copy-feedback');
          copyText(raw).then(copied => {
            if (copyButtonLabel) copyButtonLabel.textContent = copied ? 'Copied' : 'Could not copy';
            if (feedback) {
              feedback.textContent = copied ? 'Configuration copied' : 'Could not copy the configuration. Select it and copy it manually';
              feedback.className = `topo-copy-feedback ${copied ? 'is-success' : 'is-error'}`;
            }
            window.setTimeout(() => {
              if (copyButtonLabel) copyButtonLabel.textContent = 'Copy configuration';
              if (feedback) {
                feedback.textContent = '';
                feedback.className = 'topo-copy-feedback';
              }
            }, 2400);
          });
        }
      });
    }
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
