/* ==========================================================================
   Terminal Emulator Component - Realistic Terminal Simulation - onekarlo.com
   ========================================================================== */

import { PROFILE_DATA } from './data';

// Helper: Hacker / Cyber Decipher Text Scramble Animation for Elements
export function triggerHackerScramble(element: HTMLElement, originalText?: string) {
  const targetText = originalText || element.innerText;
  const chars = '01#$@%&*!?>/\\][{}<>';
  let iteration = 0;
  const totalFrames = 10;

  const interval = setInterval(() => {
    element.innerText = targetText
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return targetText[index];
        }
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    if (iteration >= targetText.length) {
      clearInterval(interval);
      element.innerText = targetText;
    }
    iteration += targetText.length / totalFrames;
  }, 25);
}

export class TerminalEmulator {
  private container: HTMLElement;
  private bodyEl!: HTMLElement;
  private inputEl!: HTMLInputElement;

  private commandHistory: string[] = [];
  private historyIndex: number = -1;

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
      <div class="terminal-container">
        <div class="terminal-header">
          <div class="terminal-title-wrapper">
            <span class="kde-konsole-icon">🐚</span>
            <div class="terminal-title">konsole | jk@onekarlo-com:~ (Fedora CoreOS 40.2026.3.0 stable)</div>
          </div>
          <div class="kde-window-controls">
            <button class="kde-win-btn minimize" aria-label="Minimize Window">─</button>
            <button class="kde-win-btn maximize" aria-label="Maximize Window">□</button>
            <button class="kde-win-btn close" aria-label="Close Window">✕</button>
          </div>
        </div>

        <div class="terminal-chips">
          <button class="chip-btn" data-cmd="help">help</button>
          <button class="chip-btn" data-cmd="status">status</button>
          <button class="chip-btn" data-cmd="rpm-ostree status">rpm-ostree status</button>
          <button class="chip-btn" data-cmd="cat bio.md">cat bio.md</button>
          <button class="chip-btn" data-cmd="skills">skills</button>
          <button class="chip-btn" data-cmd="architecture">architecture</button>
          <button class="chip-btn" data-cmd="contact">contact</button>
          <button class="chip-btn" data-cmd="clear">clear</button>
        </div>

        <div class="terminal-body" id="terminal-body"></div>

        <div class="terminal-input-row" id="terminal-input-row">
          <span class="terminal-prompt">jk@onekarlo-com:~$</span>
          <div class="terminal-input-wrapper">
            <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false" value="" />
            <span class="terminal-cursor"></span>
          </div>
        </div>
      </div>
    `;

    this.bodyEl = this.container.querySelector('#terminal-body') as HTMLElement;
    this.inputEl = this.container.querySelector('#terminal-input') as HTMLInputElement;

    const inputRow = this.container.querySelector('#terminal-input-row') as HTMLElement;
    if (inputRow) {
      inputRow.addEventListener('click', () => this.inputEl.focus());
    }

    this.updateInputWidth();
  }

  private updateInputWidth() {
    const valLength = this.inputEl.value.length;
    this.inputEl.style.width = Math.max(1, valLength) + 'ch';
  }

  private bindEvents() {
    // Input input & keydown handler
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

    // Chip buttons click handler with Cyber Hacker Scramble animation
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
  }

  private printWelcome() {
    this.appendStreamLine(`<span style="color: var(--text-muted);">[SYSTEM] Linux v2.4 (Fedora CoreOS 40.2026.3.0 stable / rpm-ostree)</span>
<span style="color: var(--text-muted);">Type </span><b style="color: var(--accent-emerald);">help</b><span style="color: var(--text-muted);"> to list available commands. Click preset chips above for telemetry.</span>`);
  }

  public executeCommand(cmdRaw: string) {
    const cmd = cmdRaw.toLowerCase().trim();

    // Echo command line immediately
    this.appendLine(`<span class="terminal-prompt">jk@onekarlo-com:~$</span> <b>${this.escapeHtml(cmdRaw)}</b>`);

    switch (cmd) {
      case 'help':
        this.appendStreamLine(`<span style="color: var(--text-primary); font-weight: 600;">Available System Commands:</span>
  <b style="color: var(--accent-cyan);">help</b>               - Show command menu
  <b style="color: var(--accent-cyan);">status</b>             - Show systemctl status caddy.container (systemd Quadlet)
  <b style="color: var(--accent-cyan);">rpm-ostree status</b>  - Inspect Fedora CoreOS atomic OS deployment version
  <b style="color: var(--accent-cyan);">cat bio.md</b>         - Output profile markdown file
  <b style="color: var(--accent-cyan);">skills</b>             - Output technical skill inventory
  <b style="color: var(--accent-cyan);">architecture</b>       - Output server infrastructure pipeline mapping
  <b style="color: var(--accent-cyan);">contact</b>            - Output LinkedIn connection URL
  <b style="color: var(--accent-cyan);">clear</b>              - Clear terminal buffer screen`);
        break;

      case 'status':
        this.appendStreamLine(`<span style="color: var(--accent-emerald);">● caddy.service - Caddy TLS Web Server (Podman Quadlet)</span>
   Loaded: loaded (/home/jk/.config/containers/systemd/caddy.container; enabled)
   Active: <b style="color: var(--accent-emerald);">active (running)</b> since Tue 2026-07-21 03:14:02 PHT; 5d ago
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
        this.appendStreamLine(`<span style="color: var(--accent-emerald);">State: idle</span>
Deployments:
● fedora:fedora/x86_64/coreos/stable
                  Version: <b style="color: var(--accent-cyan);">40.2026.3.0</b> (2026-07-21T03:14:02Z)
               BaseCommit: a3f890c21e7ce734076a0b1a37f8a97c875c07037c
                   GPGPub: Fedora (40) &lt;fedora-40-primary@fedoraproject.org&gt;
                   OSTree: rpm-ostree atomic deployment (read-only /usr)
                  SELinux: Enforcing (Targeted mode)`);
        break;

      case 'cat /etc/os-release':
      case 'os-release':
        this.appendStreamLine(`NAME="Fedora Linux"
VERSION="40.2026.3.0 (CoreOS Stable)"
ID=fedora
VERSION_ID=40
VARIANT="CoreOS"
VARIANT_ID=coreos
PRETTY_NAME="Fedora CoreOS 40.2026.3.0 (stable)"
CPE_NAME="cpe:/o:fedoraproject:fedora:40"
HOME_URL="https://fedoraproject.org/coreos/"
DOCUMENTATION_URL="https://docs.fedoraproject.org/en-US/fedora-coreos/"`);
        break;

      case 'cat bio.md':
      case 'bio':
        this.appendStreamLine(`<span style="color: var(--accent-cyan);"># Juan Karlo "JK" de Guzman</span>

<b>Positioning:</b> ${PROFILE_DATA.title}
<b>Location:</b>    ${PROFILE_DATA.location}
<b>LinkedIn:</b>    ${PROFILE_DATA.linkedin}

<b>Bio:</b>
${PROFILE_DATA.bio}`);
        break;

      case 'skills':
      case 'skills --all':
        this.appendStreamLine(`<span style="color: var(--accent-cyan);">[FULL-STACK PRODUCT ENGINEERING & CTO]</span>
  Headline Role:      Full-Stack Product Engineer & Solutions Consultant
  Active Applications: PIMASCOR (BRIDGE logistics/finance), Accustandard (medical), Le Mans (auto repair), Borgs Technology
  Web Stack:          React, TypeScript, Vite, FastAPI, PostgreSQL, REST APIs

<span style="color: var(--accent-indigo);">[AI INFRASTRUCTURE & SERVING]</span>
  Inference Engine:   PyTorch & vLLM (High-Throughput Model Serving)
  Proxy Router:       Bifrost (Lightweight Go API Router)
  Frontend UI:        big-AGI (Simultaneous Multi-Model Streaming)
  Cloud GPUs:         RunPod & Hyperstack (Ubuntu Instance Nodes)
  Model Sources:      OpenRouter API & Hugging Face Repository

<span style="color: var(--accent-emerald);">[LINUX PLATFORM & DEVOPS]</span>
  Host OS:            Fedora CoreOS (Immutable Systemd Distribution)
  Container Runtime:  Rootless Podman Engine (Systemd Quadlet Units)
  Web Server & Edge:  Caddy Web Server & Bunny.net Anycast CDN
  Security Baseline:  SELinux Enforcing Mode & systemd lingering

<span style="color: var(--accent-amber);">[ESL & OPERATIONS]</span>
  Operations:         ESL Operations & Program Director for Online English Education Platforms
  Certifications:     IELTS, TOEFL, LanguageCert ESOL & Cambridge BEC`);
        break;

      case 'architecture':
        this.appendStreamLine(`<span style="color: var(--accent-cyan);">[PRODUCTION ROUTING & SECURITY PIPELINE]</span>
  Stage 1 (Edge CDN):          Bunny.net Anycast Edge & DDoS Filter
  Stage 2 (Web Server):        Caddy Server (Human-Readable Caddyfile)
  Stage 3 (Linux Host):        Fedora CoreOS (Immutable Systemd Node)
  Stage 4 (Container Runtime): Rootless Podman Engine (Systemd Quadlets)
  Stage 5 (AI Serving Core):    PyTorch & vLLM on Ubuntu Cloud GPUs
                               Bifrost Go Proxy Router & big-AGI UI`);
        break;

      case 'contact':
        this.appendStreamLine(`<span style="color: var(--accent-emerald);">LinkedIn:</span> <a href="${PROFILE_DATA.linkedin}" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">${PROFILE_DATA.linkedin}</a>`);
        break;

      case 'clear':
        this.bodyEl.innerHTML = '';
        break;

      default:
        this.appendStreamLine(`<span style="color: #ef4444;">zsh: command not found: ${this.escapeHtml(cmdRaw)}</span>. Type <b style="color: var(--accent-emerald);">help</b> for valid commands.`);
        break;
    }

    this.scrollToBottom();
  }

  private appendLine(htmlContent: string) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = htmlContent;
    this.bodyEl.appendChild(line);
  }

  private appendStreamLine(htmlContent: string) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    this.bodyEl.appendChild(line);

    // Matrix Decipher Text Scramble Animation on Output Lines
    const textPlain = htmlContent.replace(/<[^>]*>/g, '');
    const chars = '01#$@%&*!?>/\\][{}<>';
    let iteration = 0;
    const totalFrames = 12;

    const interval = setInterval(() => {
      const scrambled = textPlain
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return char;
          }
          if (char === '\n' || char === ' ') return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      line.innerText = scrambled;

      if (iteration >= textPlain.length) {
        clearInterval(interval);
        line.innerHTML = htmlContent; // Restore full HTML styling
        this.scrollToBottom();
      }
      iteration += textPlain.length / totalFrames;
      this.scrollToBottom();
    }, 20);

    this.scrollToBottom();
  }

  private scrollToBottom() {
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
