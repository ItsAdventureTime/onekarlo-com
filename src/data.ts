/* ==========================================================================
   Data Module - Static Content & Telemetry - onekarlo.com
   ========================================================================== */

export interface TopoNode {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  status: string;
  details: string;
  specs: string[];
}

export interface PhilosophyStep {
  stepNum: number;
  title: string;
  desc: string;
}

export const PROFILE_DATA = {
  name: 'Juan Karlo "JK" de Guzman',
  title: 'Full-Stack Product Engineer & Solutions Consultant',
  location: 'Marikina City, Philippines (Remote / Worldwide)',
  linkedin: 'https://www.linkedin.com/in/juan-karlo-de-guzman-51b79517/',
  bio: `I design, build, deploy, and operate purpose-built business applications and AI infrastructure. As CTO across multiple active software projects (PIMASCOR under BRIDGE, Accustandard, Le Mans, and Borgs Technology), I lead full-stack engineering, rootless Podman Quadlet deployments on Fedora CoreOS, vLLM inference pipelines with Bifrost Go routing, and operational systems architecture.`
};

export const PHILOSOPHY_STEPS: PhilosophyStep[] = [
  {
    stepNum: 1,
    title: 'Deploy',
    desc: 'Spin up a clean, reproducible environment using rootless Podman Quadlet container files.'
  },
  {
    stepNum: 2,
    title: 'Test Boundaries',
    desc: 'Run edge-case stress tests, mock invalid user inputs, and check security boundaries under load.'
  },
  {
    stepNum: 3,
    title: 'Inspect Logs',
    desc: 'Read exact journalctl logs, container tracebacks, and raw HTTP headers to see what really happened.'
  },
  {
    stepNum: 4,
    title: 'Isolate Root Cause',
    desc: 'Identify the exact failing component without guessing or making quick symptom patches.'
  },
  {
    stepNum: 5,
    title: 'Fix & Harden',
    desc: 'Resolve the underlying bug, update system configurations, and enforce SELinux & CSP rules.'
  },
  {
    stepNum: 6,
    title: 'Document & Verify',
    desc: 'Record the exact fix, run automated tests, and document the solution so it stays fixed.'
  }
];

export const TOPOLOGY_NODES: TopoNode[] = [
  {
    id: 'cdn',
    name: 'Bunny.net CDN',
    subtitle: 'Global Edge & Cache',
    icon: '⚡',
    status: 'Active / Edge',
    details: 'Handles public HTTPS requests at the edge. Provides DDoS protection, smart caching, and low-latency static asset delivery worldwide before traffic reaches the origin server.',
    specs: ['Global Anycast IP', 'Brotli & Zstd Compression', 'Edge TLS 1.3']
  },
  {
    id: 'caddy',
    name: 'Caddy Server',
    subtitle: 'Human-Readable Config',
    icon: '🔒',
    status: 'Running / Systemd',
    details: 'Extensible web server featuring clean, human-readable Caddyfile configuration and automatic HTTPS certificate management. Runs inside a rootless Podman container managed natively by systemd Quadlets.',
    specs: ['Human-Readable Caddyfile', 'Automatic HTTPS / TLS', 'Rootless Podman Service']
  },
  {
    id: 'coreos',
    name: 'Fedora CoreOS',
    subtitle: 'Immutable Linux Host',
    icon: '🐧',
    status: 'Immutable / Stable',
    details: 'An immutable, container-focused Linux distribution. Operating system updates are applied atomically via rpm-ostree, ensuring host configuration remains clean and reproducible.',
    specs: ['rpm-ostree Atomic Updates', 'SELinux Enforcing Mode', 'Systemd Quadlet Native']
  },
  {
    id: 'quadlets',
    name: 'Podman Engine',
    subtitle: 'Native Systemd Quadlets',
    icon: '📦',
    status: 'Systemd Managed',
    details: 'Rootless container engine leveraging Podman Quadlets, a native Podman feature that parses declarative container unit files (.container & .volume) into native systemd user services.',
    specs: ['Podman Native Quadlets', 'Rootless Container Execution', 'Systemd Lifecycle Control']
  },
  {
    id: 'vllm',
    name: 'AI Model Engine',
    subtitle: 'Ubuntu, vLLM & Bifrost',
    icon: '🧠',
    status: 'Active / GPU Engine',
    details: 'PyTorch and vLLM inference engine hosted on Ubuntu cloud GPUs via RunPod and Hyperstack. Uses Bifrost, a lightweight Go proxy router, to feed model output into big-AGI for side-by-side multi-model streaming, backed by OpenRouter and Hugging Face.',
    specs: ['Ubuntu & PyTorch Foundation', 'vLLM & Bifrost Go Router', 'big-AGI Multi-Model UI']
  }
];

export interface ProjectItem {
  id: string;
  title: string;
  category: 'ai' | 'devops' | 'biz' | 'edu';
  categoryLabel: string;
  description: string;
  tags: string[];
  metrics: string[];
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Logistics & Operational Audit Platform (PIMASCOR)',
    category: 'biz',
    categoryLabel: 'Product Engineering',
    description: 'Serving as CTO under BRIDGE, designed and deployed an enterprise logistics and financial application to replace error-prone spreadsheet workflows with strict approval chains, automated budget liquidations, and immutable audit logs. Built with FastAPI, React, PostgreSQL, and Caddy running inside isolated rootless Podman containers.',
    tags: ['FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Rootless Podman', 'Caddy Server', 'REST API', 'Audit Logs'],
    metrics: [
      '100% Financial Audit Traceability',
      'Immutable Ledger & Audit Snapshots',
      'Zero Unapproved Financial Edits'
    ]
  },
  {
    id: 'p2',
    title: 'Medical Supply Chain Platform (Accustandard)',
    category: 'biz',
    categoryLabel: 'Product Engineering',
    description: 'Serving as CTO, leading product architecture and engineering for an operational medical supply chain application. Streamlines approved supplier setup, purchasing, receiving inspections, lot/serial inventory controls, quotation workflows, sales orders, and delivery tracking.',
    tags: ['Product Architecture', 'React', 'TypeScript', 'Inventory Control', 'Lot & Serial Traceability', 'Supplies Management'],
    metrics: [
      'End-to-End Inventory & Lot Control',
      'Quotations to Delivery Traceability',
      'Purpose-Built Medical Supply SOPs'
    ]
  },
  {
    id: 'p3',
    title: 'Automotive Repair & Service Application (Le Mans)',
    category: 'biz',
    categoryLabel: 'Product Engineering',
    description: 'Serving as CTO, engineered a purpose-built workshop management application for automotive repair and maintenance workflows. Features customer intake, vehicle inspections, instant estimates, job tracking, technician assignments, supplier parts costs, and quality release checks.',
    tags: ['Workshop Operations', 'React', 'TypeScript', 'Vehicle Intake', 'Work Orders', 'Parts Costing'],
    metrics: [
      'Vehicle Intake to Release Workflow',
      'Technician Job & Estimate Tracking',
      'Real-Time Parts & Labor Transparency'
    ]
  },
  {
    id: 'p4',
    title: 'Self-Hosted AI Model Engine',
    category: 'ai',
    categoryLabel: 'AI Infrastructure',
    description: 'Constructed a multi-model AI serving platform hosted on Ubuntu cloud GPUs rented via RunPod and Hyperstack. Combines PyTorch and vLLM for high-throughput model inference, Bifrost (a lightweight Go proxy router) for traffic management, and a big-AGI frontend for side-by-side model evaluation, with OpenRouter and Hugging Face API routing.',
    tags: ['PyTorch', 'vLLM', 'Bifrost (Go)', 'big-AGI', 'Ubuntu Cloud', 'OpenRouter', 'RunPod', 'Hugging Face'],
    metrics: [
      'big-AGI Multi-Model Side-by-Side UI',
      'Bifrost Go Proxy & OpenRouter API',
      'Ubuntu GPUs on RunPod & Hyperstack'
    ]
  },
  {
    id: 'p5',
    title: 'Automated Linux Server Platform',
    category: 'devops',
    categoryLabel: 'Platform Engineering',
    description: 'Engineered an automated server platform through an enterprise Linux evolution: starting with Ubuntu LTS, adopting CentOS with Control WebPanel (CWP Pro) for NGINX and PHP-FPM stacks, migrating to AlmaLinux, Rocky Linux, and RHEL developer subscriptions, transitioning from Docker to Podman Quadlets with SELinux, and standardizing on immutable Fedora CoreOS for atomic rpm-ostree updates.',
    tags: ['Fedora CoreOS', 'Podman Quadlets', 'RHEL / Rocky / Alma', 'Control WebPanel', 'SELinux', 'Systemd', 'Docker', 'rpm-ostree'],
    metrics: [
      'Ubuntu to RHEL & Fedora CoreOS Progression',
      'Native Podman Quadlet & Systemd Integration',
      'Atomic Immutable rpm-ostree OS Base'
    ]
  },
  {
    id: 'p6',
    title: 'ESL Program Operations & Language Coaching',
    category: 'edu',
    categoryLabel: 'Education & Operations',
    description: 'Managed operations, curriculum design, and instruction for online English education platforms and language institutes. Prepared candidates for global English certifications including IELTS, TOEFL, LanguageCert International ESOL, and Cambridge Business English (BEC / Linguaskill).',
    tags: ['IELTS', 'TOEFL', 'LanguageCert', 'Cambridge Business English', 'Pedagogy', 'Public Speaking'],
    metrics: [
      '1,200+ Students & Candidates Trained',
      'IELTS, TOEFL & LanguageCert Prep',
      'Cambridge Business English Coaching'
    ]
  }
];
