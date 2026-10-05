/* ==========================================================================
   Data Module - Static Content, Architecture & Case Studies - onekarlo.com
   ========================================================================== */

export interface TopoNode {
  id: string;
  name: string;
  subtitle: string;
  iconSvg: string;
  status: string;
  statusType: 'online' | 'active' | 'systemd' | 'immutable';
  details: string;
  specs: string[];
  configSnippetTitle?: string;
  configSnippet?: string;
}

export interface PhilosophyStep {
  stepNum: number;
  phase: string;
  title: string;
  desc: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'ai' | 'devops' | 'biz' | 'edu' | 'mobile';
  categoryLabel: string;
  description: string;
  tags: string[];
  metrics: string[];
  caseStudy: {
    overview: string;
    challenge: string;
    solution: string;
    architectureHighlights: string[];
    techStack: { label: string; items: string[] }[];
  };
}

export const PROFILE_DATA = {
  name: 'Juan Karlo "JK" de Guzman',
  title: 'Full-stack product engineer',
  linkedin: 'https://www.linkedin.com/in/juan-karlo-de-guzman-51b79517/',
  github: 'https://github.com/ItsAdventureTime',
  email: 'work@onekarlo.com',
  bio: `I build and run workflow software, internal tools, and self-hosted services. Over the years, my infrastructure evolved from VPS nodes in Singapore and the United States to a dedicated Mac mini M1 homelab. Today I run container workloads with OrbStack and route edge traffic through Cloudflare Tunnels and Workers. I work across the full delivery cycle, from mapping business processes and writing backend APIs to keeping systems stable, responsive, and low maintenance.`
};

export const PHILOSOPHY_STEPS: PhilosophyStep[] = [
  {
    stepNum: 1,
    phase: 'Provision',
    title: 'Deploy and isolate',
    desc: 'Set up clean, repeatable environments with Docker Compose and container definitions running in OrbStack on a local host.'
  },
  {
    stepNum: 2,
    phase: 'Stress',
    title: 'Test boundaries',
    desc: 'Load-test edge cases, send malformed input, and verify error boundaries under concurrent load.'
  },
  {
    stepNum: 3,
    phase: 'Telemetry',
    title: 'Read the signals',
    desc: 'Read container logs, network traces, and HTTP headers to see what the system is doing in real time.'
  },
  {
    stepNum: 4,
    phase: 'Analysis',
    title: 'Find the root cause',
    desc: 'Trace failures through networking, database locks, and memory instead of hiding them behind workarounds.'
  },
  {
    stepNum: 5,
    phase: 'Security',
    title: 'Fix and harden',
    desc: 'Make structural fixes, isolate network routes, mount storage read-only where possible, and keep an audit trail.'
  },
  {
    stepNum: 6,
    phase: 'Lifecycle',
    title: 'Document and verify',
    desc: 'Write runbooks, add automated health checks, and verify service recovery after deployment.'
  }
];

export const TOPOLOGY_NODES: TopoNode[] = [
  {
    id: 'cdn',
    name: 'Cloudflare Edge',
    subtitle: 'Global Anycast network and edge security',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    status: 'Edge active',
    statusType: 'online',
    details: 'Cloudflare handles public HTTPS traffic at the edge across an Anycast network. It inspects incoming requests, applies rate limiting and SSL termination, and routes authorized traffic through secure tunnels.',
    specs: ['Global Anycast edge routing', 'TLS 1.3 and HTTP/3 termination', 'Automated DDoS mitigation', 'Origin shielding with zero public inbound ports'],
    configSnippetTitle: 'Edge routing policy',
    configSnippet: `zone "onekarlo.com" {
  origin_shield = true
  tls_min_version = "1.3"
  brotli_compression = enabled
  cache_expiration = 300s
  force_ssl = true
}`
  },
  {
    id: 'tunnel',
    name: 'Cloudflare Tunnel',
    subtitle: 'Encrypted inbound connection via cloudflared',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>`,
    status: 'Tunnel connected',
    statusType: 'systemd',
    details: 'A persistent, outbound-only tunnel daemon (cloudflared) connects the local homelab to Cloudflare edge infrastructure. No public IP address or forwarded router ports are exposed to the public internet.',
    specs: ['Outbound-only encrypted TLS connections', 'Zero open router ports or static public IP required', 'Automatic failover and session multiplexing', 'Local ingress routing to OrbStack services'],
    configSnippetTitle: '~/.cloudflared/config.yml',
    configSnippet: `tunnel: homelab-mini
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - hostname: onekarlo.com
    service: http://127.0.0.1:3000
  - hostname: lab.onekarlo.com
    service: http://127.0.0.1:8080
  - service: http_status:404`
  },
  {
    id: 'homelab',
    name: 'Mac mini M1 Homelab',
    subtitle: 'Energy-efficient Apple Silicon host',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    status: 'Host online',
    statusType: 'immutable',
    details: 'A dedicated Apple Silicon M1 machine serves as the central hardware node. It provides low power draw, silent operation, unified memory architecture, and sustained local compute for containers and demo environments.',
    specs: ['Apple M1 8-core CPU and 16GB unified memory', 'Under 10W idle power consumption', 'Local NVMe storage with automated remote backup snapshots', 'Protected behind hardware firewall and private subnet'],
    configSnippetTitle: 'host-telemetry.json',
    configSnippet: `{
  "hardware": "Mac mini (M1, 2020)",
  "memory": "16 GB unified",
  "storage": "APFS encrypted internal NVMe",
  "power_idle_watts": 6.8,
  "role": "Homelab core server",
  "uptime": "99.9% local target"
}`
  },
  {
    id: 'orbstack',
    name: 'OrbStack Docker',
    subtitle: 'Fast container runtime for macOS',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    status: 'Engine running',
    statusType: 'active',
    details: 'OrbStack provides a lightweight, native Linux container engine on macOS. It starts containers in milliseconds, consumes minimal background memory, and integrates directly with Docker Compose workflows.',
    specs: ['Docker CLI and Docker Compose compatibility', 'Instant container startup with low memory footprint', 'Two-way macOS filesystem binding at native speed', 'Isolated virtual networking per project stack'],
    configSnippetTitle: 'docker-compose.yml',
    configSnippet: `services:
  gateway:
    image: caddy:alpine
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
  api:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production`
  },
  {
    id: 'workloads',
    name: 'Self-Hosted Services',
    subtitle: 'Containerized apps and evaluation models',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 3.36 2.07 6.24 5 7.42V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.58c2.93-1.18 5-4.06 5-7.42a8 8 0 0 0-8-8z"></path><line x1="10" y1="14" x2="14" y2="14"></line></svg>`,
    status: 'Services healthy',
    statusType: 'online',
    details: 'Internal and demonstration workloads run inside dedicated Compose project boundaries. Services include web application backends, lightweight inference evaluation proxies, automated sync routines, and local telemetry.',
    specs: ['Dedicated private Docker networks', 'Isolated persistent volumes for databases', 'Environment variables managed via secure local keychains', 'Prometheus metrics and local health probes'],
    configSnippetTitle: 'service-stack.json',
    configSnippet: `{
  "active_stacks": [
    { "name": "internal-tools", "containers": 3, "status": "running" },
    { "name": "model-gateway", "containers": 2, "status": "running" },
    { "name": "demo-storefront", "containers": 1, "status": "running" }
  ],
  "monitoring": "local-health-check"
}`
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Service operations and job costing system',
    category: 'biz',
    categoryLabel: 'Workflow product',
    description: 'A role-based operations system that links estimates, work orders, purchasing, expenses, billing, and margin review to one traceable record.',
    tags: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Approval workflows', 'Audit trail'],
    metrics: [
      'One work order anchors the record',
      'Approvals run from request to payment',
      'Estimated and actual costs stay visible'
    ],
    caseStudy: {
      overview: 'An anonymized service operations system that follows work from intake through completion, payment, and margin review.',
      challenge: 'Spreadsheets and handoffs made status, spend, approvals, and actual costs hard to track.',
      solution: 'The system links quotes, work orders, technician progress, purchase requests, supplier invoices, expenses, billing, and collections to one operational record.',
      architectureHighlights: [
        'Purchases and expenses have clear approval boundaries',
        'Supplier invoice lines can map to multiple work orders',
        'Inspection, receipt, and invoice files stay with the source record',
        'Cost sheets compare planned and actual labor, parts, and direct expenses'
      ],
      techStack: [
        { label: 'Application', items: ['React', 'TypeScript', 'Vite'] },
        { label: 'Data layer', items: ['FastAPI', 'PostgreSQL', 'Role-aware API services'] },
        { label: 'Runtime', items: ['Rootless Podman', 'TLS reverse proxy', 'Automated backups'] }
      ]
    }
  },
  {
    id: 'p2',
    title: 'Supply chain traceability system',
    category: 'biz',
    categoryLabel: 'Workflow product',
    description: 'A domain-specific inventory system for regulated supplies and equipment. It covers suppliers, receiving, lot tracking, and dispatch.',
    tags: ['React', 'TypeScript', 'Lot tracking', 'Serial traceability', 'Expiry controls', 'PostgreSQL'],
    metrics: [
      'Lot history stays connected to dispatch',
      'Expiry rules guide allocation',
      'Receiving works with handheld scanners'
    ],
    caseStudy: {
      overview: 'An anonymized supply chain workspace that follows items from approved supplier through receiving, allocation, and delivery.',
      challenge: 'Generic inventory flows hid expiry risk, supplier batch history, and warehouse actions behind slow or disconnected screens.',
      solution: 'The system combines lot and expiry checks, barcode-ready intake, supplier records, and quote-to-dispatch workflows in one inventory model.',
      architectureHighlights: [
        'Allocation rules account for expiry windows',
        'Lot and serial history stays connected from receiving through dispatch',
        'Quotes use reusable pricing and approval rules',
        'Keyboard-first intake supports handheld scanners'
      ],
      techStack: [
        { label: 'Application', items: ['React', 'TypeScript', 'State-driven workflows'] },
        { label: 'Data layer', items: ['PostgreSQL', 'RESTful API services', 'Audit events'] },
        { label: 'Platform', items: ['Linux containers', 'Rootless Podman', 'Automated TLS'] }
      ]
    }
  },
  {
    id: 'p3',
    title: 'Workshop work order system',
    category: 'biz',
    categoryLabel: 'Workflow product',
    description: 'A shared workboard helps service teams manage intake, inspections, estimates, technician assignments, parts, approvals, and release checks.',
    tags: ['React', 'TypeScript', 'Work orders', 'Bay scheduling', 'Parts costing', 'Touch-friendly UI'],
    metrics: [
      'Work moves from intake to release in one flow',
      'Technicians can see assignments and progress',
      'Parts and labor costs stay visible'
    ],
    caseStudy: {
      overview: 'An anonymized workshop system that gives service advisors, parts teams, and technicians one live view of active work.',
      challenge: 'Paper repair orders and informal handoffs led to idle time, missing parts records, unclear estimates, and early releases.',
      solution: 'The workboard combines visual scheduling, photo intake, estimate approvals, parts costing, and a final quality checklist.',
      architectureHighlights: [
        'A live workboard handles assignments and status changes across service bays',
        'Estimate generation includes digital approval checkpoints',
        'Parts catalog links apply markup rules and inventory deductions',
        'A release checklist keeps quality review in the workflow'
      ],
      techStack: [
        { label: 'Client', items: ['React', 'TypeScript', 'Touch-friendly interaction'] },
        { label: 'Backend', items: ['FastAPI', 'PostgreSQL', 'Document generation'] },
        { label: 'Hosting', items: ['Rootless containers', 'TLS reverse proxy'] }
      ]
    }
  },
  {
    id: 'p4',
    title: 'Self-hosted model evaluation system',
    category: 'ai',
    categoryLabel: 'AI infrastructure',
    description: 'An open-model environment for GPU inference, request routing, streaming output, and side-by-side comparison.',
    tags: ['PyTorch', 'vLLM', 'GPU inference', 'Model gateway', 'Streaming', 'Telemetry'],
    metrics: [
      'Models can be evaluated side by side',
      'The gateway supports streaming and fallback paths',
      'GPU capacity matches the workload'
    ],
    caseStudy: {
      overview: 'A self-hosted inference and evaluation environment for comparing open models while keeping routing, capacity, and telemetry visible.',
      challenge: 'Single-provider workflows made model comparison, data boundaries, and compute costs hard to inspect side by side.',
      solution: 'The platform combines PyTorch and vLLM serving with a lightweight gateway, streaming responses, fallback paths, and a comparison interface.',
      architectureHighlights: [
        'Continuous batching supports high-throughput inference',
        'Gateway routing handles model selection, token tracking, and failover',
        'The interface compares generation across model targets',
        'GPU provisioning follows the workload and exposes runtime telemetry'
      ],
      techStack: [
        { label: 'Inference', items: ['vLLM', 'PyTorch', 'CUDA', 'GPU kernels'] },
        { label: 'Routing and UI', items: ['Go gateway', 'Streaming API', 'Evaluation interface'] },
        { label: 'Compute', items: ['Cloud GPU nodes', 'Linux', 'Runtime telemetry'] }
      ]
    }
  },
  {
    id: 'p5',
    title: 'Immutable application hosting',
    category: 'devops',
    categoryLabel: 'Platform engineering',
    description: 'A repeatable hosting pattern for web apps built on immutable Linux, rootless Podman services, declarative systemd units, and clear runtime boundaries.',
    tags: ['Immutable Linux', 'Podman Quadlets', 'SELinux', 'Systemd', 'Atomic updates', 'TLS edge'],
    metrics: [
      'Services use declarative definitions',
      'Containers run within rootless boundaries',
      'Host updates have a rollback path'
    ],
    caseStudy: {
      overview: 'An application hosting pattern that keeps the host predictable and each service lifecycle easy to inspect.',
      challenge: 'Mutable servers collect configuration drift, package conflicts, and upgrade paths that are hard to reproduce or roll back.',
      solution: 'The platform uses immutable Linux hosts, rootless containers, systemd user services, and policy checks around each workload.',
      architectureHighlights: [
        'Web-facing services run as rootless containers',
        'Systemd manages declarative .container and .volume units',
        'SELinux isolates mounted volumes',
        'Atomic host updates have a defined rollback path'
      ],
      techStack: [
        { label: 'Host', items: ['Immutable Linux', 'Atomic updates', 'Ignition-style provisioning', 'SELinux'] },
        { label: 'Runtime', items: ['Podman Quadlets', 'Systemd user services', 'Read-only mounts'] },
        { label: 'Edge', items: ['HTTP/3', 'QUIC', 'TLS 1.3'] }
      ]
    }
  },
  {
    id: 'p6',
    title: 'Language learning operations',
    category: 'edu',
    categoryLabel: 'Learning operations',
    description: 'An operating model for language programs covering diagnostics, curriculum planning, teacher onboarding, learner progress, and feedback.',
    tags: ['CEFR rubrics', 'Speaking diagnostics', 'Writing feedback', 'Teacher onboarding', 'Program ops'],
    metrics: [
      'Diagnostic rubrics connect to learning outcomes',
      'Remote delivery follows clear routines',
      'Progress is tracked across learning cycles'
    ],
    caseStudy: {
      overview: 'A language program system that links curriculum, teaching routines, diagnostics, and learner progress.',
      challenge: 'Learners and instructors lacked a consistent way to connect rubric feedback, practice, and progress over time.',
      solution: 'The system combines diagnostic rubrics, targeted speaking and writing practice, teacher onboarding routines, and lightweight progress tracking.',
      architectureHighlights: [
        'Curriculum aligns with CEFR proficiency bands',
        'Rubrics guide speaking and writing diagnostics',
        'Standard procedures support remote teacher onboarding',
        'Audio and written feedback support fluency development'
      ],
      techStack: [
        { label: 'Methodology', items: ['Task-based instruction', 'CEFR rubric diagnostics', 'SOPs'] },
        { label: 'Delivery', items: ['Learning management workflows', 'Audio feedback', 'Progress reviews'] },
        { label: 'Operations', items: ['Remote onboarding', 'Curriculum planning', 'Quality checks'] }
      ]
    }
  },
  {
    id: 'p7',
    title: 'Field companion apps',
    category: 'mobile',
    categoryLabel: 'Mobile systems',
    description: 'Focused iOS and Android apps give field teams access to the records they need for capture, review, approvals, and status updates.',
    tags: ['iOS', 'Android', 'Mobile-first workflows', 'Role-based access', 'Explicit sync states', 'API contracts'],
    metrics: [
      'Web and mobile share the same records',
      'Task views fit field work',
      'Versioned API contracts protect releases'
    ],
    caseStudy: {
      overview: 'A companion app pattern for operational teams that need focused mobile workflows alongside web dashboards.',
      challenge: 'Field users need short, reliable actions without carrying a full desktop workflow onto a small screen.',
      solution: 'The apps use shared domain records, clear role boundaries, attachment capture, and explicit sync states.',
      architectureHighlights: [
        'Task views follow field roles instead of desktop navigation',
        'Shared record contracts keep web and mobile states aligned',
        'Capture flows support photos, notes, approvals, and status changes',
        'Loading, empty, error, and sync states are explicit'
      ],
      techStack: [
        { label: 'Clients', items: ['iOS', 'Android', 'Touch-first interaction'] },
        { label: 'Domain', items: ['Shared API contracts', 'Role-aware records', 'Attachment flows'] },
        { label: 'Release', items: ['Versioned payloads', 'Environment separation', 'Telemetry hooks'] }
      ]
    }
  },
  {
    id: 'p8',
    title: 'Project controls and progress billing',
    category: 'biz',
    categoryLabel: 'Workflow product',
    description: 'An accounting-ready workspace that connects budgets, procurement, progress billing, retention, variations, supplier obligations, and audit history.',
    tags: ['Project controls', 'Procurement approvals', 'Progress billing', 'Retention tracking', 'Accounting exports', 'Audit history'],
    metrics: [
      'Budgets stay connected to payments',
      'Spend follows an approval matrix',
      'Accounting exports keep a stable format'
    ],
    caseStudy: {
      overview: 'An anonymized project controls system linking commitments, procurement, billing, collections, and profitability review.',
      challenge: 'Project, purchasing, and accounting records lived apart, so commitments and cash position were hard to reconcile.',
      solution: 'The system maps project records to approval stages, progress claims, retention and variation rules, supplier obligations, and stable accounting exports.',
      architectureHighlights: [
        'Budget and commitment views link to work packages',
        'An approval matrix covers requests, purchase orders, and expenses',
        'Progress billing tracks retention and variations',
        'Audit history supports formula-safe interchange files'
      ],
      techStack: [
        { label: 'Application', items: ['React', 'TypeScript', 'Role-aware workflows'] },
        { label: 'Financial model', items: ['Budget controls', 'Progress claims', 'Collections'] },
        { label: 'Data exchange', items: ['CSV', 'Excel-ready files', 'JSON interchange'] }
      ]
    }
  },
  {
    id: 'p9',
    title: 'Storefront and inventory management platform',
    category: 'biz',
    categoryLabel: 'Workflow product',
    description: 'A full-stack ecommerce and administrative management system built for an Information Systems demonstration, featuring a customer catalog, voucher promotions, and real-time stock control.',
    tags: ['React', 'TypeScript', 'Vite', 'Hono', 'Cloudflare Workers', 'Cloudflare D1', 'SQLite', 'Admin workflows'],
    metrics: [
      '100 seeded catalog products with category filters',
      'Simulated multi-channel checkout and instant order tracking',
      'Comprehensive back-office inventory and demo reset controls'
    ],
    caseStudy: {
      overview: 'A full-stack ecommerce storefront and back-office operations suite designed as a realistic educational demonstration for an Information Systems curriculum.',
      challenge: 'Coursework demonstrations often rely on static mockups or disconnected toy databases that fail to show how customer cart actions, voucher discounts, and warehouse inventory interact under real business rules.',
      solution: 'Built a cohesive single-page application and edge API architecture using React, Hono, and Cloudflare D1. The system gives shoppers an authentic checkout experience while providing administrators full visibility over inventory adjustments, campaign promotions, and order status transitions.',
      architectureHighlights: [
        'Edge-native API built with Hono and deployed to Cloudflare Workers with embedded D1 SQLite storage',
        'Dual-role interface separating customer storefront browsing from administrative catalog controls',
        'Atomic inventory deductions during checkout with rollback protection and instant stock replenishment',
        'Isolated demo reset mechanism allowing instructors and students to restore catalog and order data cleanly'
      ],
      techStack: [
        { label: 'Client application', items: ['React', 'TypeScript', 'Vite', 'Responsive CSS'] },
        { label: 'Edge backend', items: ['Hono framework', 'Cloudflare Workers', 'Cloudflare D1 (SQLite)', 'Role-based routing'] },
        { label: 'Operations & data', items: ['Deterministic SQL migrations', 'Simulated payment flows', 'Automated test suite'] }
      ]
    }
  }
];
