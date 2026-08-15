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
            <button class="terminal-tab" id="terminal-tab-systemctl" role="tab" aria-selected="false" aria-controls="terminal-panel" tabindex="-1" data-tab="systemctl">
              <span class="tab-icon" aria-hidden="true">&gt;</span>
              <span>systemctl</span>
            </button>
            <button class="terminal-tab" id="terminal-tab-quadlet" role="tab" aria-selected="false" aria-controls="terminal-panel" tabindex="-1" data-tab="quadlet">
              <span class="tab-icon" aria-hidden="true">[]</span>
              <span>caddy.container</span>
            </button>
            <button class="terminal-tab" id="terminal-tab-ostree" role="tab" aria-selected="false" aria-controls="terminal-panel" tabindex="-1" data-tab="ostree">
              <span class="tab-icon" aria-hidden="true">#</span>
              <span>rpm-ostree</span>
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
          <button class="chip-btn" data-cmd="status">status</button>
          <button class="chip-btn" data-cmd="rpm-ostree status">rpm-ostree</button>
          <button class="chip-btn" data-cmd="quadlet">quadlet</button>
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
    } else if (tabKey === 'systemctl') {
      this.bodyEl.innerHTML = '';
      this.executeCommand('status');
    } else if (tabKey === 'quadlet') {
      this.bodyEl.innerHTML = '';
      this.executeCommand('quadlet');
    } else if (tabKey === 'ostree') {
      this.bodyEl.innerHTML = '';
      this.executeCommand('rpm-ostree status');
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
    this.appendLine(`<span class="term-dim">[SYSTEM] Fedora CoreOS 40.2026.3.0 stable (rpm-ostree) | Podman Quadlets active</span>
<span class="term-dim">Type </span><b class="term-accent">help</b><span class="term-dim"> to see available commands, or use the shortcuts above.</span>`);
  }

  public executeCommand(cmdRaw: string) {
    const cmd = cmdRaw.toLowerCase().trim();

    // Echo command line
    this.appendLine(`<span class="terminal-prompt">jk@onekarlo:~$</span> <b class="term-bright">${this.escapeHtml(cmdRaw)}</b>`);

    switch (cmd) {
      case 'help':
        this.appendLine(`<span class="term-accent term-heading">Available commands:</span>
  <b class="term-emerald">help</b>               Show the command index
  <b class="term-emerald">status</b>             systemctl --user status caddy.service
  <b class="term-emerald">rpm-ostree status</b>  Inspect immutable Fedora CoreOS deployment
  <b class="term-emerald">quadlet</b>            View the declarative Podman .container unit
  <b class="term-emerald">cat bio.md</b>         Read the short bio
  <b class="term-emerald">skills</b>             List technical strengths
  <b class="term-emerald">architecture</b>       Inspect the edge-to-hosting pipeline
  <b class="term-emerald">contact</b>            Connect on LinkedIn and GitHub
  <b class="term-emerald">clear</b>              Clear terminal buffer`);
        break;

      case 'status':
      case 'systemctl':
      case 'systemctl status caddy':
        this.appendLine(`<span class="term-emerald">● caddy.service - Caddy TLS web server (Podman Quadlet)</span>
   Loaded: loaded (/home/jk/.config/containers/systemd/caddy/caddy.container; enabled)
   Active: <b class="term-emerald">active (running)</b> since Tue 2026-07-21 03:14:02; 5d ago
     Docs: https://caddyserver.com/docs/
 Main PID: 14820 (caddy)
    Tasks: 8 (limit: 18432)
   Memory: 24.8M (limit: 16.0G)
      CPU: 42ms
   CGroup: /user.slice/user-1000.slice/user@1000.service/app.slice/caddy.service
           └─14820 /usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile`);
        break;

      case 'rpm-ostree status':
      case 'rpm-ostree':
      case 'ostree':
        this.appendLine(`<span class="term-emerald">State: idle</span>
Deployments:
● fedora:fedora/x86_64/coreos/stable
                  Version: <b class="term-cyan">40.2026.3.0</b> (2026-07-21T03:14:02Z)
               BaseCommit: a3f890c21e7ce734076a0b1a37f8a97c875c07037c
                   GPGPub: Fedora (40) &lt;fedora-40-primary@fedoraproject.org&gt;
                   OSTree: rpm-ostree atomic deployment (read-only /usr)
                  SELinux: Enforcing (Targeted mode)`);
        break;

      case 'quadlet':
      case 'cat caddy.container':
        this.appendLine(`<span class="term-dim"># /home/jk/.config/containers/systemd/caddy/caddy.container</span>
[Unit]
Description=Caddy rootless edge web server
After=network-online.target

[Container]
ContainerName=caddy
Image=docker.io/library/caddy:alpine
PublishPort=80:80/tcp
PublishPort=443:443/tcp
PublishPort=443:443/udp
Volume=/home/jk/onekarlo-com:/srv/onekarlo-com:ro,Z
Volume=/home/jk/caddy/conf:/etc/caddy:ro,Z
LogDriver=journald

[Service]
Restart=always
TimeoutStartSec=300

[Install]
WantedBy=default.target`);
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
  Systems:            Logistics audits and financial controls, medical supply inventory, workshop operations
  Web stack:          React, TypeScript, Vite, Python FastAPI, PostgreSQL, REST APIs

<span class="term-emerald">[AI infrastructure and model serving]</span>
  Inference:          PyTorch and vLLM for continuous batching and PagedAttention
  Gateway:             Go API router for model selection and fallback
  Interface:           Side-by-side model evaluation
  Compute:             Cloud GPU instances running Ubuntu

<span class="term-amber">[Platform engineering and Linux]</span>
  Host OS:            Fedora CoreOS with atomic rpm-ostree updates and SELinux
  Containers:         Rootless Podman Quadlets
  Edge:               Caddy web server and an Anycast CDN`);
        break;

      case 'architecture':
        this.appendLine(`<span class="term-cyan">[Production routing and security pipeline]</span>
  Layer 1 (Edge):        Anycast CDN (TLS 1.3, Brotli/Zstd, DDoS filtering)
  Layer 2 (Web server):  Caddy in rootless Podman (automatic HTTPS, CSP)
  Layer 3 (Host):        Fedora CoreOS 40 (atomic rpm-ostree, SELinux)
  Layer 4 (Services):    Native systemd Quadlets (rootless user services)
  Layer 5 (AI engine):   Cloud GPU nodes (vLLM, PyTorch, Go proxy)`);
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
