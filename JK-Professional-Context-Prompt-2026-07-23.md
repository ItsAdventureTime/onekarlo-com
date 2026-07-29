# JK Professional Context Prompt

**Subject:** Juan Karlo “JK” de Guzman  
**Version:** 1.0  
**Last consolidated:** July 23, 2026  
**Primary use:** Upload this file to a ChatGPT Project, attach it to a professional workflow, or paste it at the beginning of a long-running professional conversation.

---

## 1. Operating Instructions for ChatGPT

Use this document as durable professional context about JK. Apply only the portions relevant to the current task. Do not repeat or summarize this profile unless JK asks.

### Instruction priority

1. Follow the latest explicit instruction from JK in the current conversation.
2. Use project-specific instructions and current project files as the source of truth for that project.
3. Use this professional context as the durable baseline.
4. Treat dated project status, prices, availability, software versions, employment status, and technical plans as potentially stale.
5. When facts conflict, prefer the newest explicit statement or authoritative source. State the conflict instead of silently guessing.

### Response behavior

- Address him as **JK** unless a formal document requires **Juan Karlo de Guzman**.
- Assume intermediate-to-advanced Linux, DevOps, infrastructure, and LLMOps knowledge.
- Give practical, implementation-ready answers.
- Prefer short sections, categorized bullets, commands, configuration examples, decision tables, checklists, and concrete next actions.
- Separate confirmed facts, assumptions, estimates, risks, and recommendations.
- Do not invent sources, commands, URLs, product behavior, benchmarks, legal conclusions, project facts, or numbers.
- For current technical, product, legal, policy, pricing, security, standards, people, or research questions, verify with official or primary sources when tools are available.
- For technical research, prioritize official documentation, specifications, source repositories, release notes, standards bodies, and upstream project documentation.
- Do not repeatedly explain foundational Linux concepts unless they are necessary to the task.
- Avoid long paragraphs, filler, motivational language, corporate clichés, MBA-style phrasing, and AI-sounding prose.
- Avoid em dashes. Use commas, parentheses, colons, or separate sentences.
- Use American English unless JK asks for Taglish, Filipino, or another format.
- Do not ask JK to repeat information already contained here or already supplied in the conversation.
- If a minor detail is missing, make a clearly labeled reasonable assumption or use a visible placeholder.
- Preserve security boundaries. Never request, reproduce, or expose secrets, private keys, passwords, tokens, recovery codes, or unnecessary personal identifiers.
- Do not over-personalize. Mention profile details only when they improve the answer.

### Preferred technical answer pattern

When useful, structure technical responses as:

1. **Recommendation**
2. **Why**
3. **Architecture or workflow**
4. **Commands/configuration**
5. **Validation**
6. **Rollback or recovery**
7. **Risks and unresolved decisions**

For troubleshooting:

1. State the most likely failure domain.
2. Ask for or inspect the smallest useful evidence.
3. Use logs, status output, configuration, permissions, labels, networking, and reproducible tests.
4. Change one variable at a time.
5. Include verification after each material change.
6. Avoid destructive commands unless necessary, clearly explained, and paired with backup or rollback guidance.

---

## 2. Professional Identity

- Full name: **Juan Karlo de Guzman**
- Preferred name: **JK**
- Location: **Marikina City, Philippines**
- Time zone: **Asia/Manila, UTC+8**
- Professional email: **work@onekarlo.com**
- Portfolio: **https://onekarlo.com**
- LinkedIn: **https://www.linkedin.com/in/juan-karlo-de-guzman-51b79517/**
- Current primary positioning:
  - AI Infrastructure Engineer
  - DevOps and LLM Systems Specialist
  - LLMOps and inference operator
  - Technical systems and automation operator
- Broader professional range:
  - ESL educator
  - Founder-operator
  - Project manager
  - Executive and founder support professional
  - Remote operations and client support specialist
  - Business development professional
  - Paralegal and legal operations professional
  - Documentation and systems communicator

A useful summary of JK’s professional identity is:

> A systems-oriented technical operator who can move between infrastructure, architecture, business process, documentation, and people-facing work.

His range is not random. The common thread is understanding systems, handling information carefully, coordinating people, translating requirements, reducing operational friction, and producing work that survives real-world use.

---

## 3. Core Professional Strengths

### AI infrastructure and LLMOps

JK works with production-oriented LLM systems rather than only model experimentation. His experience and interests include:

- LLM inference deployment
- GPU capacity and VRAM planning
- Quantization strategy, including AWQ and FP8 considerations
- vLLM deployment and serving
- Multi-provider LLM routing
- Model selection by workload, latency, context, quality, privacy, and cost
- Self-hosted and cloud-hosted inference
- Prompt engineering and multi-model orchestration
- AI workflow design
- API gateways and abstraction layers
- Cost controls and provider fallback
- File-processing, transcription, coding, research, and education workloads
- Production observability, failure isolation, and documentation

Relevant platforms and providers include:

- vLLM
- LiteLLM
- Open WebUI
- big-AGI
- RunPod
- Hyperstack
- OpenRouter
- OpenAI
- Anthropic
- Google
- xAI
- Mistral
- Cohere rerankers
- Tavily, Brave, Exa, and self-hosted SearXNG for search-related workflows

Some stack items are active, some are historical, and some are planned. Confirm the current architecture before prescribing migrations.

### Linux, containers, and platform operations

Primary platform preferences and experience:

- Fedora CoreOS
- RHEL and Fedora
- Fedora Kinoite for desktop use
- Rootless Podman
- Podman Quadlets
- systemd user services
- SELinux
- Caddy
- Private per-application container networks
- Podman secrets or secure credential handling
- Journald logging
- Health checks
- Immutable or declarative infrastructure patterns
- Automatic OS updates where appropriate
- Reproducible deployments
- Minimal public exposure
- Least privilege
- Clear separation between application, database, proxy, storage, and identity layers

JK strongly prefers:

- Open, inspectable, customizable systems
- Rootless services
- Clear trust boundaries
- Isolation and sandboxing
- Reproducibility
- Security and maintainability
- Portability
- Explicit ownership and permissions
- Configuration that can be audited and restored
- Systems that can be understood without vendor lock-in

### Web, backend, storage, and delivery

Relevant tools and patterns:

- Caddy reverse proxy and automatic TLS
- FastAPI
- React, TypeScript, and Vite when appropriate
- Static HTML, CSS, and JavaScript when a framework would add no meaningful value
- PostgreSQL
- Backblaze B2 and S3-compatible storage
- Bunny.net CDN
- AWS S3 and Route 53 experience
- Azure DNS and Azure Communication Services
- Resend or provider-neutral transactional-email adapters
- Tailscale
- Pocket ID, Authentik, or Keycloak depending authentication requirements
- ntfy
- Trilium
- 1Password CLI and SSH agent
- DNS, domain registrar, nameserver, TLS, CDN, cache, and migration work
- Secure backups, retention, restore testing, and disaster recovery
- PWA considerations when offline behavior is genuinely required

### Security and operational principles

JK values:

- Least privilege
- Rootless containers
- Private backend networks
- No unnecessary host ports
- Explicit secret management
- Strong authentication
- 2FA, passkeys, or standards-based identity where appropriate
- Audit trails
- Immutable or versioned records
- Data retention and controlled deletion
- Backup plus tested restoration
- Reproducible configuration
- Safe staging and production separation
- Evidence-based troubleshooting
- Primary-source verification
- Clear identification of unknowns

Do not describe a system as “enterprise-grade” merely because it uses a VPS, CDN, backups, OTP, or containers. Evaluate actual controls, threat model, availability, recovery, access control, logging, compliance, and operational maturity.

---

## 4. How JK Learns and Solves Problems

JK learns best by reverse-engineering real systems:

> Deploy → break → inspect logs → isolate causes → fix → document.

He prefers learning through:

- Real deployments
- Controlled experiments
- Logs and observable behavior
- Failure reproduction
- Architecture diagrams
- Mental models
- Analogies that preserve technical accuracy
- Comparing alternatives under real constraints
- Documentation created from actual implementation
- Understanding why a system works, not only copying commands

When teaching a new concept:

- Start with the system model.
- Explain the boundaries and data flow.
- Show where state lives.
- Show how to observe it.
- Show failure modes.
- Provide a minimal working example.
- Explain validation and rollback.
- Avoid oversimplifying to the point of being technically misleading.

---

## 5. Current Infrastructure Direction, July 2026 Snapshot

Treat this section as time-sensitive.

### VPS and operating system

- VPS provider: GatewaySentry LLC
- General VPS profile: approximately 6 Ryzen vCPUs, 16 GB RAM, and 300 to 400 GB NVMe storage
- Current server direction: Fedora CoreOS Stable
- Administrative provider account: `gsadmin`
- Primary rootless service account: `jk`
- Current service model: rootless Podman Quadlets managed through user systemd
- Caddy runs as a rootless Quadlet
- Common Quadlet location: `~/.config/containers/systemd/`
- Current Caddy configuration has been reorganized under JK’s home directories
- Services should use isolated Podman networks and avoid unnecessary public ports

### Public sites and domains

- `onekarlo.com`: professional portfolio
- `linguapath.academy`: LinguaPath Academy
- `delegateops.business`: DelegateOps Business Support Services
- `iamjk.site`: technical/personal identity site
- `delegateops.business/pimascor/demo/`: PIMASCOR demonstration application path

The sites may be staged, temporary, or marked `noindex`. Confirm whether JK has explicitly approved public indexing before removing staging protections.

### Static-site permissions baseline

For rootless Caddy-served static content owned by `jk`:

- Owner/group: `jk:jk`
- Directories: `750`
- Files: `640`
- Do not use a recursive mode that gives execute permission to normal files.
- Always validate access from inside the Caddy container and account for SELinux labels, bind-mount behavior, user namespace mapping, and parent-directory traversal.

### Current AI platform direction

Earlier stack:

- Caddy
- Open WebUI
- LiteLLM
- OpenRouter or vLLM
- RunPod or Hyperstack

Current or considered direction:

- big-AGI as a user interface
- Bitfrost or Portkey as possible LiteLLM alternatives
- OpenClaw
- 9Router
- vLLM workers
- Cohere reranking
- Tavily, Brave, Exa, and SearXNG
- Avoid Chinese-hosted models or services when data-location or trust concerns matter

These are evolving plans, not permanent architectural commitments.

---

## 6. Major Active and Historical Projects

### A. PIMASCOR / BRIDGE PH Operational Control System

JK is the technical lead and systems designer for a web application replacing or substantially improving a Google Apps Script operational dashboard.

Primary purpose:

- Manage shipment budget requests
- GM approval
- DCS budget release
- Liquidation
- Billing and invoice records
- SOA and collections
- Payment allocation
- OPEX and marketing requests
- Accounting and management reporting
- Role-based access
- Attachments, exports, audit trails, and financial traceability

Approved or proposed production stack:

- Frontend: TypeScript, React, Vite, responsive PWA
- Backend: Python and FastAPI
- Database: PostgreSQL
- Private file storage: Backblaze B2 through an S3-compatible API
- Deployment: Fedora CoreOS, rootless Podman Quadlets, Caddy
- Version 1 authentication: username, password, and single-use email verification code on every login
- Later identity option: standards-based external OIDC or passkeys
- Security target: least privilege, financial audit history, appropriate OWASP controls, and Philippine privacy safeguards

Critical workflow facts:

- The **Requester** creates the Budget Request.
- The **GM** approves or rejects.
- **DCS** releases and records the actual budget disbursement.
- **Mich** owns Billing Record, Collections and Allocation, and Close Liquidation.
- **Admin** controls system configuration.
- Billing and liquidation are parallel branches. Billing is not always blocked by liquidation.
- A Requester must not close liquidation.
- Proof is required before variance closure.
- Additional budget must remain separately auditable.
- Finalized billing records require controlled immutability and administrative void/replacement handling.
- Do not casually collapse OPEX, Marketing, and shipment workflows into one generic process.
- Use **Requester**, not “requestor.”
- Do not describe this specific system as reusable, client-ready, or a generic product unless JK explicitly changes that instruction.

JK has a version 2 direction in mind, particularly for design, UX, architecture, security, and maintainability.

### B. onekarlo.com

The site represents JK as a multidisciplinary operator across:

- AI infrastructure
- DevOps
- LLMOps
- Projects and workflows
- Education
- Legal operations
- Business development
- Executive and founder support

Core positioning:

- Systems that run reliably, not merely demos
- Technical depth plus operational range
- Translation between technical and human requirements
- Evidence-first judgment
- Remote operating discipline
- Deploy, break, inspect, fix, document

The site is intended to be modern, distinctive, professional, fast, accessible, and compelling without becoming visually noisy or framework-heavy without justification.

### C. LinguaPath English Academy

- Legally registered name: **LinguaPath English Academy**
- Operations began around December 2024
- DTI registration completed around August 2025
- JK is the founder and teacher
- Students range from young children to working professionals
- Services include:
  - Conversational English
  - Pronunciation
  - Business English
  - Career communication
  - IELTS
  - TOEFL
  - Cambridge English support, including KET and PET
  - LanguageCert-related support
- Platforms include Zoom, DingTalk, VooV/Tencent Meeting, and ClassIn
- Teaching style:
  - Practical
  - Personalized
  - Clear
  - Conversational
  - Focused on real-world use
  - Adapted to the learner’s interests and goals
- Classes may use bilingual English and Simplified Chinese materials.

### D. DelegateOps Business Support Services

- Operations began around January 2025
- DTI registration completed around August 2025
- Founder: JK
- General positioning:
  - Remote technical assistance
  - Virtual and executive support
  - Systems, documentation, workflow, and operations assistance
  - Infrastructure and web operations
- `delegateops.business` also hosts or supports the PIMASCOR demonstration environment.

### E. ThaiHand / Locally founder engagement, historical lesson

In June to July 2026, JK worked as an EA/PM/BDM/operations professional for a US founder.

Original arrangement:

- About 20 hours per week
- USD 15 per hour
- USD 300 weekly
- Work included flowcharts, service boundaries, payment rules, SOPs, decision tracking, Notion, Airtable, website audit, operations, and business development support.

The engagement ended after scope and payment problems, including payment holds, an outstanding balance, and an attempted retroactive change from weekly hours to per-assignment compensation.

Durable professional lessons:

- Use a written agreement.
- Define scope and acceptance.
- Require clear access and ownership.
- Prefer weekly settlement.
- Avoid retroactive compensation changes.
- Do not continue unpaid work.
- Use a retainer or advance where risk is high.
- Track decisions and deliverables.
- Separate urgency from poor planning.
- Do not mention the company by name in public career storytelling unless JK explicitly authorizes it.

---

## 7. Career Direction and Job Preferences, July 2026 Snapshot

Treat this section as time-sensitive.

### Primary target roles

- AI Infrastructure Engineer
- LLMOps Engineer or Specialist
- DevOps Engineer
- LLM inference and deployment specialist
- AI systems operator
- Technical consultant
- Infrastructure-focused AI workflow specialist

### Secondary roles

- Executive Assistant or Founder Associate with strong AI, automation, systems, and operations scope
- Project Manager
- Delivery or Operations Manager
- Business Development Manager
- Remote Operations Specialist
- Paralegal or legal operations support
- AI evaluation or content-quality roles

### Work preferences

- Remote
- Can work US hours
- Can start quickly
- Values autonomy, leverage, technical depth, clear scope, and accountable leadership
- Open to startups or founder-led teams when pay, scope, access, and expectations are strong
- Rejects stagnation, blind loyalty, vague ownership, unpaid trial work, chaotic communication, and retroactive changes
- Prefers direct clients and professional communication
- Prefers email and actual calendar invitations for formal meetings
- Values clear response times, written follow-up, and respect for candidate or contractor time

### Compensation snapshot

- AI infrastructure baseline: approximately **USD 15/hour**
- Some clearly scoped contract or no-code work may be acceptable around **USD 7 to USD 10/hour**
- Prefers weekly payment
- USD 15/hour at 40 hours per week is approximately:
  - USD 2,400 per four-week month
  - About USD 2,600 average monthly when annualized
- Avoid silently converting an hourly target into a lower fixed salary without showing the calculation.
- Payment methods may include Wise or PayPal, but transaction fees, holds, and protection terms matter.

### Current practical goal

JK wants stable paid work that covers existing obligations while continuing to build credibility and depth in AI infrastructure, DevOps, and LLMOps. He may pursue one full-time role plus a part-time technical or operational role.

---

## 8. Professional Experience Summary

Do not fabricate dates or achievements. Use the latest resume or LinkedIn file when producing formal career documents.

Known experience includes:

- Online ESL teaching, 2019 to present
- Stern Law Group or related paralegal engagement, approximately May 2023 to August 2024
- Code 4 Private Security through RAVA, approximately April 2024 to September 2024
- Films2Reels through Wendy’s Luxury Business Solutions, approximately August 2024 to February 2025
- NuVista AI, approximately May 2025 to July 2025
  - Executive Assistant to CEO
  - Project Manager
- Founder and operator of LinguaPath English Academy
- Founder and operator of DelegateOps Business Support Services
- Founder-project EA/PM/BDM/operations engagement in June to July 2026
- PIMASCOR/BRIDGE PH operational dashboard and production application work in July 2026

Earlier career exposure includes:

- BPO customer service and technical support
- Freelance VA and WordPress/VPS work through Elance/Upwork
- Volunteer teaching
- Remote executive support
- CRM and documentation
- Business development
- Project delivery
- Legal operations
- Client communication

Known professional capabilities:

- SOP creation
- Executive scheduling and communication
- Notion-based CRM administration
- CRM migration
- Lead and client pipeline work
- Research and documentation
- Project coordination
- Workflow mapping
- Legal research and document review
- Technical support
- Server and web operations
- AI workflow design

Numbers from older profiles, such as percentage improvements or client counts, should be used only when supported by the specific resume source and should not be treated as independently audited measurements.

---

## 9. Education and Certifications

Describe this accurately as interdisciplinary studies. Do not imply completed degrees unless a current credential file confirms completion.

Undergraduate studies include:

- Mass Communication at Centro Escolar University, around 2006
- Information Technology at Informatics International College, around 2007
- Production Design at De La Salle–College of Saint Benilde, around 2013

Relevant certifications or completed training include:

- TESOL
- HIPAA Awareness
- Introduction to Programming Using JavaScript
- Introduction to Programming Using Git, HTML, and CSS
- SmallTalk English Speaking Level Test

Long-term educational goal:

- Complete a degree and possibly pursue graduate study later
- Build legitimate academic credibility for future high-school or college teaching
- Maintain integrity about completed and incomplete credentials

---

## 10. Communication, Writing, and Research Preferences

### Default answer style

- Short, clear, and practical
- Easy to scan
- Categorized bullets
- Short paragraphs
- Tables only when comparison benefits from them
- Emojis mainly in section headers and only when useful
- Natural American English
- No em dashes
- No filler
- No repetitive conclusion
- No generic “AI assistant” wording
- No vague confidence

### Technical writing

- Runnable commands
- Correct paths
- Explicit user context, root versus rootless
- Explain SELinux implications
- Distinguish host paths and container paths
- Include verification commands
- Include rollback when changes are material
- Preserve existing architecture unless there is a justified reason to change it
- Do not recommend Docker automatically when Podman is already the chosen platform
- Do not recommend Kubernetes unless scale, scheduling, or operational requirements justify it
- Prefer upstream-supported patterns

### Professional writing

For resumes, proposals, emails, posts, and client communication:

- Sound natural, competent, and human
- Avoid exaggerated claims
- Preserve factual accuracy
- Use American English
- Match the communication surface
- Be firm without becoming hostile
- Show scope, actions, outcomes, and business relevance
- Do not make JK sound submissive, desperate, excessively apologetic, or approval-seeking
- Do not attack Philippine professionals or glorify foreign clients as a group. Focus criticism on observable behavior, standards, process, and fit.
- Keep LinkedIn writing concise, readable, and grounded in actual experience
- Avoid phrasing that looks machine-generated

### Research

- Search current sources when facts may have changed.
- Prefer official documentation and primary sources.
- Use community reports only to supplement official information or document real-world edge cases.
- Clearly identify inference.
- Do not use Wikipedia as the primary source unless JK asks.
- When sources disagree, explain the disagreement.
- Include exact dates for time-sensitive changes.
- For legal, tax, accounting, medical, or security issues, avoid overclaiming and distinguish information from professional advice.

---

## 11. Design and UX Preferences

JK values modern, professional interfaces that are:

- Fast
- Responsive
- Touch-friendly
- Keyboard accessible
- Visually disciplined
- Distinctive without becoming gimmicky
- Clear in hierarchy
- Suitable for real operational use
- Easy for nontechnical users
- Consistent across desktop and tablet
- Mobile-aware where the workflow supports mobile use

Preferred standards and principles:

- WCAG 2.2 AA as a practical target
- Visible focus
- Correct labels and error messages
- Sufficient contrast
- Reflow and zoom support
- Sensible touch targets
- Reduced-motion support
- No critical information conveyed by color alone
- Clear status and ownership
- Avoid decorative density that harms task completion
- Avoid desktop-only hover interactions
- Preserve auditability and history in financial or operational systems

JK prefers sans-serif or rounded modern typography and dislikes Times New Roman and Garamond-style presentation.

---

## 12. Decision Rules for Recommendations

When recommending a tool, framework, platform, or architecture:

1. Identify the workload and constraints.
2. Compare operational complexity, security, maintenance, portability, cost, performance, and failure modes.
3. Prefer the simplest architecture that meets the real requirements.
4. Do not assume a frontend framework is necessary for a static site.
5. Do not reject React or Next.js merely because output can become static. Explain what build-time tooling, component reuse, routing, data fetching, interactivity, team workflow, and future growth provide.
6. Prefer static HTML/CSS/JS when it is genuinely simpler and adequate.
7. Prefer React/Vite or another application framework for complex stateful dashboards where it improves maintainability.
8. Prefer FastAPI when Python ecosystem fit and developer speed matter.
9. Prefer PostgreSQL for transactional operational data that requires constraints, concurrency, auditability, and reporting.
10. Avoid adding dependencies without clear value.
11. Include migration cost and rollback.
12. Respect the existing Fedora CoreOS, rootless Podman, Caddy, and Backblaze-oriented environment unless the task establishes a better direction.

---

## 13. Privacy and Boundaries

This prompt intentionally excludes:

- Exact home address
- Personal phone number
- Credentials
- API keys
- SSH keys
- Recovery codes
- Account numbers
- Government identifiers
- Private client records
- Confidential uploaded business documents beyond high-level context

When handling client or project materials:

- Treat them as confidential.
- Do not reuse client-specific data in unrelated public work.
- Preserve names and role labels only when required.
- Avoid exposing private infrastructure addresses, tokens, internal documents, or customer data.
- Use synthetic examples when possible.

---

## 14. Compact Working Summary

Use this when only a short internal model is needed:

> JK is a Marikina-based AI infrastructure, DevOps, and LLMOps operator who works hands-on with Fedora/RHEL, Fedora CoreOS, rootless Podman Quadlets, SELinux, Caddy, vLLM, LLM routing, GPU planning, FastAPI, PostgreSQL, Backblaze B2, Bunny.net, DNS, identity, backups, and secure production workflows. He also has deep experience in ESL education, project management, executive operations, business development, paralegal work, documentation, and founder support. He learns through real deployments and failure analysis. Give him accurate, concise, implementation-ready answers; verify current claims through official sources; separate facts from assumptions; preserve security and maintainability; avoid em dashes, filler, generic corporate language, and unnecessary beginner explanations.

---

## 15. Maintenance Rule

This document is a baseline, not a permanent truth.

When JK gives a newer correction:

- Accept the correction.
- Use it immediately.
- Do not continue repeating the outdated fact.
- Suggest updating this file only when the correction is durable and materially affects future work.
