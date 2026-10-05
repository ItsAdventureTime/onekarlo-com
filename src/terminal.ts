/* ==========================================================================
   Terminal Emulator Component - Konsole Linux Terminal Simulation - onekarlo.com
   ========================================================================== */

import { PROFILE_DATA } from './data';
import { copyText } from './clipboard';

// Map to track active scramble intervals on elements to prevent race conditions & leaks
const activeScrambles = new WeakMap<HTMLElement, number>();

export function triggerHackerScramble(element: HTMLElement, originalText?: string) {
  const targetText = originalText || element.innerText;
  const chars = '01#$@%&*!?>/\\][{}<>';
  let iteration = 0;
  const totalFrames = 8;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = targetText;
    return;
  }

  // Clear existing active interval on this element
  if (activeScrambles.has(element)) {
    clearInterval(activeScrambles.get(element));
    activeScrambles.delete(element);
  }

  const intervalId = window.setInterval(() => {
    element.innerText = targetText
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return targetText[index];
        }
        if (char === ' ' || char === '\n') return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    if (iteration >= targetText.length) {
      clearInterval(intervalId);
      activeScrambles.delete(element);
      element.innerText = targetText;
    }
    iteration += Math.max(1, targetText.length / totalFrames);
  }, 25);

  activeScrambles.set(element, intervalId);
}

export class TerminalEmulator {
  private container: HTMLElement;
  private bodyEl!: HTMLElement;
  private inputEl!: HTMLInputElement;
  private activeTab: string = 'bash';

  private commandHistory: string[] = [];
  private historyIndex: number = -1;
  private activeStreamInterval: number | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Terminal container #${containerId} not found`);
    this.container = el;

    this.renderContainer();
    this.bindEvents();
    this.printWelcome();
  }

  private renderContainer() {
    this.container.innerHTML = `
      <div class="terminal-container" role="region" aria-label="Interactive Linux terminal">
        <!-- Terminal Headerbar & Konsole Controls -->
        <div class="terminal-header">
          <div class="terminal-tabs" role="tablist" aria-label="Terminal views" aria-orientation="horizontal">
            <button class="terminal-tab active" id="terminal-tab-bash" role="tab" aria-selected="true" aria-controls="terminal-panel" tabindex="0" data-tab="bash">
              <span class="tab-icon" aria-hidden="true">$</span>
              <span>bash</span>
            </button>
            <button class="terminal-tab" id="terminal-tab-docker" role="tab" aria-selected="false" aria-controls="terminal-panel" tabindex="-1" data-tab="docker">
              <span class="tab-icon" aria-hidden="true">[]</span>
              <span>docker ps</span>
            </button>
            <button class="terminal-tab" id="terminal-tab-tunnel" role="tab" aria-selected="false" aria-controls="terminal-panel" tabindex="-1" data-tab="tunnel">
              <span class="tab-icon" aria-hidden="true">&gt;</span>
              <span>tunnel</span>
            </button>
            <button class="terminal-tab" id="terminal-tab-system" role="tab" aria-selected="false" aria-controls="terminal-panel" tabindex="-1" data-tab="system">
              <span class="tab-icon" aria-hidden="true">#</span>
              <span>homelab</span>
            </button>
          </div>

          <div class="terminal-actions">
            <button class="terminal-copy-btn" id="terminal-copy-btn" title="Copy terminal output" aria-label="Copy terminal output">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span class="copy-text">Copy</span>
            </button>
            <span class="terminal-copy-feedback" role="status" aria-live="polite"></span>
            <div class="terminal-win-dots">
              <span class="win-dot min"></span>
              <span class="win-dot max"></span>
              <span class="win-dot close"></span>
            </div>
          </div>
        </div>

        <!-- Quick Execution Chips -->
        <div class="terminal-chips" aria-label="Command shortcuts">
          <button class="chip-btn" data-cmd="help">help</button>
          <button class="chip-btn" data-cmd="docker ps">docker ps</button>
          <button class="chip-btn" data-cmd="tunnel">tunnel</button>
          <button class="chip-btn" data-cmd="status">status</button>
          <button class="chip-btn" data-cmd="cat bio.md">cat bio.md</button>
          <button class="chip-btn" data-cmd="skills">skills</button>
          <button class="chip-btn" data-cmd="architecture">architecture</button>
          <button class="chip-btn" data-cmd="contact">contact</button>
          <button class="chip-btn" data-cmd="clear">clear</button>
        </div>

        <!-- Terminal Output Body -->
        <div class="terminal-body" id="terminal-panel" tabindex="0" role="tabpanel" aria-labelledby="terminal-tab-bash" aria-live="polite"></div>

        <!-- Terminal Interactive Input Prompt -->
        <div class="terminal-input-row" id="terminal-input-row">
          <span class="terminal-prompt">jk@onekarlo:~$</span>
          <div class="terminal-input-wrapper">
            <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false" value="" aria-label="Terminal command prompt" />
            <span class="terminal-cursor" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    `;

    this.bodyEl = this.container.querySelector('#terminal-panel') as HTMLElement;
    this.inputEl = this.container.querySelector('#terminal-input') as HTMLInputElement;

    const inputRow = this.container.querySelector('#terminal-input-row') as HTMLElement;
    if (inputRow) {
      inputRow.addEventListener('click', () => this.inputEl.focus());
    }

    this.updateInputWidth();
  }

  private updateInputWidth() {
    const valLength = this.inputEl.value.length;
    const sizeClasses = ['input-size-empty', 'input-size-short', 'input-size-medium', 'input-size-long', 'input-size-full'];
    this.inputEl.classList.remove(...sizeClasses);

    const size = valLength === 0
      ? 'empty'
      : valLength <= 8
        ? 'short'
        : valLength <= 20
          ? 'medium'
          : valLength <= 36
            ? 'long'
            : 'full';

    this.inputEl.classList.add(`input-size-${size}`);
  }

  private bindEvents() {
    // Input keydown handler
    this.inputEl.addEventListener('input', () => this.updateInputWidth());

    this.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const cmd = this.inputEl.value.trim();
        if (cmd) {
          this.executeCommand(cmd);
          this.commandHistory.push(cmd);
          this.historyIndex = this.commandHistory.length;
          this.inputEl.value = '';
          this.updateInputWidth();
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.commandHistory[this.historyIndex];
          this.updateInputWidth();
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.commandHistory[this.historyIndex];
          this.updateInputWidth();
        } else {
          this.historyIndex = this.commandHistory.length;
          this.inputEl.value = '';
          this.updateInputWidth();
        }
      }
    });

    // Chip buttons
    this.container.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget as HTMLElement;
        const cmd = targetBtn.getAttribute('data-cmd');
        triggerHackerScramble(targetBtn);

        if (cmd) {
          this.inputEl.value = cmd;
          this.updateInputWidth();
          this.executeCommand(cmd);
          this.commandHistory.push(cmd);
          this.historyIndex = this.commandHistory.length;
          this.inputEl.value = '';
          this.updateInputWidth();
        }
      });
    });

    // Tab buttons
    this.container.querySelectorAll('.terminal-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget as HTMLElement;
        const tabKey = targetTab.getAttribute('data-tab');
        if (tabKey && tabKey !== this.activeTab) {
          this.switchTab(tabKey);
        }
      });

      tab.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent;
        const tabButtons = Array.from(this.container.querySelectorAll<HTMLButtonElement>('.terminal-tab'));
        const currentIndex = tabButtons.indexOf(keyEvent.currentTarget as HTMLButtonElement);
        if (currentIndex < 0) return;

        let nextIndex = currentIndex;
        if (keyEvent.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabButtons.length;
        if (keyEvent.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        if (keyEvent.key === 'Home') nextIndex = 0;
        if (keyEvent.key === 'End') nextIndex = tabButtons.length - 1;
        if (nextIndex === currentIndex) return;

        keyEvent.preventDefault();
        const nextTab = tabButtons[nextIndex];
        const tabKey = nextTab.getAttribute('data-tab');
        if (tabKey) {
          this.switchTab(tabKey);
          nextTab.focus();
        }
      });
    });

    // Copy Output button
    const copyBtn = this.container.querySelector('#terminal-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyOutput());
    }
  }

  private switchTab(tabKey: string) {
    this.activeTab = tabKey;
    this.container.querySelectorAll('.terminal-tab').forEach(t => {
      const isCurrent = t.getAttribute('data-tab') === tabKey;
      t.classList.toggle('active', isCurrent);
      t.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      t.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });
    this.bodyEl.setAttribute('aria-labelledby', `terminal-tab-${tabKey}`);

    if (tabKey === 'bash') {
      this.bodyEl.innerHTML = '';
      this.printWelcome();
    } else if (tabKey === 'docker') {
      this.bodyEl.innerHTML = '';
      this.executeCommand('docker ps');
    } else if (tabKey === 'tunnel') {
      this.bodyEl.innerHTML = '';
      this.executeCommand('tunnel');
    } else if (tabKey === 'system') {
      this.bodyEl.innerHTML = '';
      this.executeCommand('status');
    }
  }

  private async copyOutput() {
    const text = this.bodyEl.innerText;
    const copyTextEl = this.container.querySelector('.copy-text');
    const feedbackEl = this.container.querySelector('.terminal-copy-feedback');

    if (!text.trim()) {
      if (feedbackEl) {
        feedbackEl.textContent = 'There is no output to copy yet';
        feedbackEl.className = 'terminal-copy-feedback is-error';
      }
      return;
    }

    const copied = await copyText(text);
    if (copyTextEl) copyTextEl.textContent = copied ? 'Copied' : 'Could not copy';
    if (feedbackEl) {
      feedbackEl.textContent = copied ? 'Output copied' : 'Could not copy the output. Select it and copy it manually';
      feedbackEl.className = `terminal-copy-feedback ${copied ? 'is-success' : 'is-error'}`;
    }

    window.setTimeout(() => {
      if (copyTextEl) copyTextEl.textContent = 'Copy';
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.className = 'terminal-copy-feedback';
      }
    }, 2400);
  }

  private printWelcome() {
    this.appendLine(`<span class="term-dim">[SYSTEM] Mac mini M1 (Apple Silicon) | OrbStack Docker active | Cloudflare Tunnel connected</span>
<span class="term-dim">Type </span><b class="term-accent">help</b><span class="term-dim"> to see available commands, or use the shortcuts above.</span>`);
  }

  public executeCommand(cmdRaw: string) {
    const cmd = cmdRaw.toLowerCase().trim();

    // Echo command line
    this.appendLine(`<span class="terminal-prompt">jk@onekarlo:~$</span> <b class="term-bright">${this.escapeHtml(cmdRaw)}</b>`);

    switch (cmd) {
      case 'help':
        this.appendLine(`<span class="term-accent term-heading">Available commands:</span>
  <b class="term-emerald">help</b>          Show the command index
  <b class="term-emerald">docker ps</b>     Inspect active OrbStack containers
  <b class="term-emerald">tunnel</b>        Check Cloudflare Tunnel connection state
  <b class="term-emerald">status</b>        View Mac mini M1 homelab telemetry
  <b class="term-emerald">cat bio.md</b>    Read the short bio
  <b class="term-emerald">skills</b>        List technical strengths
  <b class="term-emerald">architecture</b>  Inspect the edge-to-homelab pipeline
  <b class="term-emerald">contact</b>       Connect on LinkedIn and GitHub
  <b class="term-emerald">clear</b>         Clear terminal buffer`);
        break;

      case 'docker':
      case 'docker ps':
      case 'docker compose ps':
        this.appendLine(`<span class="term-cyan">CONTAINER ID   IMAGE                    COMMAND                  STATUS         PORTS                    NAMES</span>
e9b21a48c1f0   caddy:alpine             "caddy run --config…"   Up 3 days      127.0.0.1:3000->80/tcp   homelab-gateway
8f1c42b90d23   cloudflare/cloudflared   "cloudflared tunnel…"   Up 3 days                               homelab-tunnel
7a3b819f201d   node:22-alpine           "node dist/index.js"    Up 3 days      127.0.0.1:8080->8080/tcp app-internal-tools`);
        break;

      case 'tunnel':
      case 'cloudflared':
      case 'tunnel status':
      case 'cloudflared tunnel info':
        this.appendLine(`<span class="term-cyan">● cloudflared - Cloudflare Tunnel Daemon (outbound TLS)</span>
   Tunnel Name:  homelab-mini (active)
   Status:       <b class="term-emerald">HEALTHY (4 active edge connections)</b>
   Connectors:   sjc01 (San Jose), hkg02 (Hong Kong), nrt01 (Tokyo), sin01 (Singapore)
   Routes:       onekarlo.com -> http://127.0.0.1:3000
                 lab.onekarlo.com -> http://127.0.0.1:8080
   Security:     Zero open router ports | Outbound-only TLS pipe`);
        break;

      case 'status':
      case 'system':
      case 'uname':
      case 'specs':
        this.appendLine(`<span class="term-emerald">● host-telemetry - Apple Silicon Homelab Node</span>
   Hardware:   Mac mini (M1, 2020)
   OS:         macOS Darwin (arm64)
   Memory:     16 GB unified architecture
   Storage:    Internal APFS NVMe with encrypted local snapshots
   Runtime:    OrbStack Linux container virtualization & Docker Compose
   Power:      Under 10W idle power draw (silent, 24/7 continuous operation)
   State:      <b class="term-emerald">online (load average: 0.18, 0.22, 0.19)</b>`);
        break;

      case 'rpm-ostree status':
      case 'rpm-ostree':
      case 'ostree':
      case 'quadlet':
      case 'systemctl':
        this.appendLine(`<span class="term-dim">[MIGRATION NOTE]</span> Previously hosted on a VPS with Fedora CoreOS Quadlets; now fully migrated to a dedicated Mac mini M1 homelab running OrbStack Docker containers and Cloudflare Tunnels.`);
        break;

      case 'cat bio.md':
      case 'bio':
        this.appendLine(`<span class="term-cyan"># Juan Karlo "JK" de Guzman</span>

<b>Role:</b>      ${PROFILE_DATA.title}
<b>LinkedIn:</b>  ${PROFILE_DATA.linkedin}
<b>GitHub:</b>    ${PROFILE_DATA.github}

<b>About:</b>
${PROFILE_DATA.bio}`);
        break;

      case 'skills':
      case 'skills --all':
        this.appendLine(`<span class="term-cyan">[Product engineering and architecture]</span>
  Systems:            Storefront and retail operations, logistics audits, financial controls, medical inventory
  Web stack:          React, TypeScript, Vite, Hono, Python FastAPI, PostgreSQL, SQLite (Cloudflare D1), REST APIs

<span class="term-emerald">[AI infrastructure and model serving]</span>
  Inference:          PyTorch and vLLM for continuous batching and PagedAttention
  Gateway:            Go API router for model selection and fallback
  Evaluation:         Side-by-side model comparison interfaces

<span class="term-amber">[Platform engineering and homelab]</span>
  Homelab host:       Mac mini M1 (Apple Silicon) with low-power continuous operation
  Containers:         OrbStack native container virtualization and Docker Compose
  Edge network:       Cloudflare Workers, Anycast CDN, and Cloudflare Tunnels (zero open inbound ports)`);
        break;

      case 'architecture':
        this.appendLine(`<span class="term-cyan">[Production routing and security pipeline]</span>
  Layer 1 (Edge):        Cloudflare Edge CDN (TLS 1.3, Brotli/Zstd, DDoS mitigation)
  Layer 2 (Tunnel):      Cloudflare Tunnel (cloudflared outbound-only encrypted pipe)
  Layer 3 (Hardware):    Mac mini M1 Homelab (Apple Silicon, low power, quiet local compute)
  Layer 4 (Container):   OrbStack Docker engine (fast, lightweight Linux containers)
  Layer 5 (Services):    Self-hosted application backends and model gateways`);
        break;

      case 'contact':
        this.appendLine(`<span class="term-emerald">Connect:</span>
  LinkedIn: <a class="term-link" href="${PROFILE_DATA.linkedin}" target="_blank" rel="noopener noreferrer">${PROFILE_DATA.linkedin}</a>
  GitHub:   <a class="term-link" href="${PROFILE_DATA.github}" target="_blank" rel="noopener noreferrer">${PROFILE_DATA.github}</a>
  Email:    <a class="term-link" href="mailto:${PROFILE_DATA.email}">${PROFILE_DATA.email}</a>`);
        break;

      case 'clear':
        if (this.activeStreamInterval !== null) {
          clearInterval(this.activeStreamInterval);
          this.activeStreamInterval = null;
        }
        this.bodyEl.innerHTML = '';
        break;

      default:
        this.appendLine(`<span class="term-error">Unknown command: ${this.escapeHtml(cmdRaw)}</span>. Type <b class="term-emerald">help</b> to see available commands.`);
        break;
    }

    this.scrollToBottom();
  }

  private appendLine(htmlContent: string) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = htmlContent;
    this.bodyEl.appendChild(line);
    this.scrollToBottom();
  }

  private scrollToBottom() {
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
