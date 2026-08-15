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
  email: 'jk@onekarlo.com',
  bio: `I build and run workflow software, Linux container platforms, and self-hosted AI services. For the past several years, I've worked across the full delivery cycle: mapping workflows, designing backends and audit trails, deploying rootless Podman services on Fedora CoreOS, and keeping production systems reliable.`
};

export const PHILOSOPHY_STEPS: PhilosophyStep[] = [
  {
    stepNum: 1,
    phase: 'Provision',
    title: 'Deploy and isolate',
    desc: 'Set up clean, repeatable environments with declarative rootless Podman Quadlets on an immutable host.'
  },
  {
    stepNum: 2,
    phase: 'Stress',
    title: 'Test boundaries',
    desc: 'Load-test edge cases, send malformed input, and check SELinux under concurrent load.'
  },
  {
    stepNum: 3,
    phase: 'Telemetry',
    title: 'Read the signals',
    desc: 'Read systemd journal logs, container output, and HTTP headers to see what the system is doing.'
  },
  {
    stepNum: 4,
    phase: 'Analysis',
    title: 'Find the root cause',
    desc: 'Trace failures through networking, database locks, and memory instead of hiding them with a workaround.'
  },
  {
    stepNum: 5,
    phase: 'Security',
    title: 'Fix and harden',
    desc: 'Make structural fixes, close unused ports, mount volumes read-only, and keep an audit trail.'
  },
  {
    stepNum: 6,
    phase: 'Lifecycle',
    title: 'Document and verify',
    desc: 'Write runbooks, add health checks, and verify the system after launch.'
  }
];

export const TOPOLOGY_NODES: TopoNode[] = [
  {
    id: 'cdn',
    name: 'Anycast CDN',
    subtitle: 'Global edge network and DDoS protection',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    status: 'Edge active',
    statusType: 'online',
    details: 'The CDN handles public HTTPS requests across a global Anycast network. It applies DDoS mitigation, edge caching, and Brotli/Zstd compression before requests reach the origin.',
    specs: ['Global Anycast routing', 'TLS 1.3 and HTTP/3 termination', 'Brotli and Zstd compression', 'DDoS rate limiting and origin shielding'],
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
    id: 'caddy',
    name: 'Caddy Server',
    subtitle: 'Reverse proxy and automatic TLS',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    status: 'Quadlet service',
    statusType: 'systemd',
    details: 'Caddy is an extensible web server with a clear configuration format and automatic certificate management. It runs unprivileged in a rootless Podman container managed by user-level systemd.',
    specs: ['Rootless Podman service', 'Automatic Let\'s Encrypt or ZeroSSL TLS', 'Strict content security policy (CSP)', 'Immutable cache headers for static assets'],
    configSnippetTitle: 'quadlet/Caddyfile',
    configSnippet: `onekarlo.com {
  root * /srv/onekarlo-com
  encode zstd gzip
  file_server

  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    Content-Security-Policy "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';"
  }
}`
  },
  {
    id: 'coreos',
    name: 'Fedora CoreOS',
    subtitle: 'Immutable Linux host',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    status: 'Atomic and enforcing',
    statusType: 'immutable',
    details: 'Fedora CoreOS is an immutable, container-focused Linux distribution. It applies OS upgrades atomically through rpm-ostree and protects the host with SELinux in enforcing mode.',
    specs: ['Atomic rpm-ostree updates', 'SELinux mandatory access control in enforcing mode', 'Declarative Ignition provisioning', 'Systemd user lingering for service persistence'],
    configSnippetTitle: 'rpm-ostree deployment state',
    configSnippet: `● fedora:fedora/x86_64/coreos/stable
         Version: 40.2026.3.0 (2026-07-21T03:14:02Z)
      BaseCommit: a3f890c21e7ce734076a0b1a37f8a97c875c07037c
          GPGPub: Fedora (40) <fedora-40-primary@fedoraproject.org>
          OSTree: atomic deployment (read-only /usr)
         SELinux: Enforcing (Targeted mode)`
  },
  {
    id: 'quadlets',
    name: 'Podman Quadlets',
    subtitle: 'Rootless systemd services',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    status: 'Active systemd services',
    statusType: 'systemd',
    details: 'Podman Quadlets translate declarative .container and .volume files into native systemd user services. This keeps service definitions inspectable while enforcing unprivileged user namespaces.',
    specs: ['Declarative .container and .volume units', 'Rootless user namespaces and UID mapping', 'Native systemctl and journalctl lifecycle hooks', 'SELinux :Z volume labeling'],
    configSnippetTitle: '~/.config/containers/systemd/caddy/caddy.container',
    configSnippet: `[Unit]
Description=Caddy rootless edge web server
After=network-online.target

[Container]
ContainerName=caddy
Image=docker.io/library/caddy:alpine
PublishPort=80:80/tcp
PublishPort=443:443/tcp
Volume=/home/jk/onekarlo-com:/srv/onekarlo-com:ro,Z
Volume=/home/jk/caddy/conf:/etc/caddy:ro,Z
LogDriver=journald

[Service]
Restart=always
TimeoutStartSec=300

[Install]
WantedBy=default.target`
  },
  {
    id: 'vllm',
    name: 'AI Model Engine',
    subtitle: 'PyTorch, vLLM, and Go routing',
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 3.36 2.07 6.24 5 7.42V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.58c2.93-1.18 5-4.06 5-7.42a8 8 0 0 0-8-8z"></path><line x1="10" y1="14" x2="14" y2="14"></line></svg>`,
    status: 'GPU node online',
    statusType: 'active',
    details: 'A self-hosted model-serving platform on cloud GPU instances. It uses vLLM for continuous batching and a Go proxy for side-by-side, multi-model evaluation.',
    specs: ['vLLM PagedAttention engine', 'Go proxy and request router', 'Side-by-side model evaluation UI', 'Dynamic routing across hosted and self-hosted models'],
    configSnippetTitle: 'bifrost-router.json',
    configSnippet: `{
  "listen": "0.0.0.0:8080",
  "backends": [
    { "name": "vllm-local", "url": "http://127.0.0.1:8000/v1", "weight": 100 },
    { "name": "openrouter-fallback", "url": "https://openrouter.ai/api/v1", "weight": 0 }
  ],
  "streaming": true,
  "telemetry": "prometheus"
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
  }
];
