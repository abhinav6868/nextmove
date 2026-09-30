import "dotenv/config";
import { db } from "../lib/db/client";
import {
  companies,
  snapshots,
  signals,
  people,
  scores,
  outreach,
  runs,
  config,
} from "../lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { runCompanyPipeline } from "../lib/pipeline";
import { computeSnapshotDiff } from "../lib/pipeline/diff";
import { classifyDiff } from "../lib/pipeline/classify";
import { calculateScore } from "../lib/pipeline/score";
import { generateOutreachDraft } from "../lib/pipeline/outreach";
import { DEFAULT_CONFIG } from "../lib/config";

// 16 Real Indian B2B SaaS Startups matching ICP
const SEED_TARGETS = [
  {
    name: "Sprinto",
    url: "https://sprinto.com",
    stage: "Series B",
    size_band: "50-200",
    industry: "Security & Compliance SaaS",
    location: "Bengaluru, India",
    description: "Automated security compliance and audit readiness platform for high-growth tech companies.",
    latest_round: { round: "Series B", amount: "$20M", date: "2026-08-14" },
    headcount: 140,
    open_roles: [
      { title: "Lead Operations Manager", department: "Operations" },
      { title: "AI Automation Specialist", department: "Engineering" },
      { title: "Solutions Architect", department: "Customer Success" },
    ],
    people: [
      { name: "Girish Redekar", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Directly leads product strategy and tooling investments." },
      { name: "Raghuveer K", role: "Co-Founder & CTO", persona: "VP of Engineering / CTO", reason: "Evaluates API integrations, data security, and automation infrastructure." },
      { name: null, role: "Director of Operations", persona: "Head of Operations", reason: "Manages compliance audit operations and workflow bottlenecks." },
    ],
    likely_pains: [
      "Manual evidence collection from diverse SaaS customer stacks",
      "Coordination delays during peak customer audit cycles",
      "Auditor back-and-forth ticket management",
    ],
    what_to_know: "Series B funded by Accel. Expanding rapidly in US/EMEA. Pitch direct workflow automation for evidence gathering.",
    timingScore: 94,
    timingEvidence: "Raised $20M Series B in August 2026; hiring 3 operations & automation roles",
    fitScore: 98,
    reachScore: 92,
    confidence: 0.92,
    // Historical snapshot data (60 days ago) for diff demo
    prev_snapshot: {
      stage: "Series A",
      size_band: "50-100",
      headcount: 95,
      latest_round: { round: "Series A", amount: "$10M", date: "2024-02-15" },
      open_roles: [{ title: "Software Engineer", department: "Engineering" }],
    },
  },
  {
    name: "Rocketlane",
    url: "https://rocketlane.com",
    stage: "Series B",
    size_band: "50-200",
    industry: "Customer Onboarding SaaS",
    location: "Chennai / Bengaluru, India",
    description: "Collaborative customer onboarding platform purpose-built for client-facing projects.",
    latest_round: { round: "Series B", amount: "$24M", date: "2026-07-28" },
    headcount: 120,
    open_roles: [
      { title: "Head of Customer Operations", department: "Operations" },
      { title: "Implementation Specialist", department: "Professional Services" },
      { title: "Product Marketing Manager", department: "Marketing" },
    ],
    people: [
      { name: "Srikrishnan Ganesan", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Oversees enterprise onboarding methodology and tech adoption." },
      { name: "Deepak Balasubramanyam", role: "Co-Founder & CTO", persona: "VP of Engineering / CTO", reason: "Assesses enterprise integrations and API pipeline reliability." },
    ],
    likely_pains: [
      "Repetitive template synchronization across customer project workspaces",
      "Manual customer milestone tracking across Salesforce/Hubspot",
    ],
    what_to_know: "Backed by 8VC and Nexus. Focuses heavily on reducing time-to-value for enterprise customer onboarding.",
    timingScore: 90,
    timingEvidence: "Announced $24M Series B; hired VP of Engineering and recruiting Customer Ops lead",
    fitScore: 95,
    reachScore: 88,
    confidence: 0.9,
    prev_snapshot: {
      stage: "Series A",
      size_band: "20-50",
      headcount: 45,
      latest_round: { round: "Series A", amount: "$18M", date: "2023-11-10" },
      open_roles: [],
    },
  },
  {
    name: "Kula",
    url: "https://kula.ai",
    stage: "Series A",
    size_band: "20-50",
    industry: "Recruitment Automation SaaS",
    location: "Bengaluru, India",
    description: "Outbound recruitment automation platform helping talent teams build predictable hiring pipelines.",
    latest_round: { round: "Series A", amount: "$12M", date: "2026-08-30" },
    headcount: 45,
    open_roles: [
      { title: "Growth Operations Lead", department: "Operations" },
      { title: "Senior AI Engineer", department: "Engineering" },
    ],
    people: [
      { name: "Achuthanand Ravi", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Directly evaluates AI tooling that improves recruiter outbound throughput." },
      { name: "Sathya Narayanan", role: "Co-Founder & CTO", persona: "VP of Engineering / CTO", reason: "Architects outbound message generation infrastructure." },
    ],
    likely_pains: [
      "Candidate profile enrichment rate-limiting and data drift",
      "Manual multi-channel sequencing adjustments",
    ],
    what_to_know: "Series A backed by Sequoia/Peak XV. Fast execution, founder-led outbound culture.",
    timingScore: 92,
    timingEvidence: "Raised $12M Series A in August 2026; opening US expansion office",
    fitScore: 92,
    reachScore: 95,
    confidence: 0.88,
    prev_snapshot: {
      stage: "Seed",
      size_band: "1-20",
      headcount: 18,
      latest_round: { round: "Seed", amount: "$2.7M", date: "2023-01-12" },
      open_roles: [],
    },
  },
  {
    name: "Leena AI",
    url: "https://leena.ai",
    stage: "Series B",
    size_band: "50-200",
    industry: "Workforce Automation SaaS",
    location: "Bengaluru, India",
    description: "Autonomous HR and employee service delivery platform resolving workplace queries.",
    latest_round: { round: "Series B", amount: "$30M", date: "2026-06-15" },
    headcount: 180,
    open_roles: [
      { title: "Operations Strategy Manager", department: "Operations" },
      { title: "Enterprise Account Executive", department: "Sales" },
    ],
    people: [
      { name: "Adit Jain", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Sets capital expenditure and platform integration priorities." },
      { name: null, role: "VP of Global Operations", persona: "Head of Operations", reason: "Maintains SLA delivery across multi-country HR ticket automation." },
    ],
    likely_pains: [
      "Integrating disparate enterprise legacy HRIS systems",
      "Complex localized compliance rules across GCC and APAC regions",
    ],
    what_to_know: "Backed by Bessemer and Greycroft. Very receptive to high-speed automation pilots.",
    timingScore: 84,
    timingEvidence: "Hiring 2 ops strategy leads; recent expansion into SEA enterprises",
    fitScore: 90,
    reachScore: 82,
    confidence: 0.86,
    prev_snapshot: {
      stage: "Series B",
      size_band: "50-200",
      headcount: 150,
      latest_round: { round: "Series B", amount: "$30M", date: "2026-06-15" },
      open_roles: [],
    },
  },
  {
    name: "BarRaiser",
    url: "https://barraiser.com",
    stage: "Series A",
    size_band: "20-50",
    industry: "HR Tech & Interview AI",
    location: "Bengaluru, India",
    description: "AI-powered interview platform delivering structured evaluations and interviewer guidance.",
    latest_round: { round: "Series A", amount: "$4.2M", date: "2026-09-05" },
    headcount: 38,
    open_roles: [
      { title: "Operations Lead - Expert Network", department: "Operations" },
      { title: "Full Stack Engineer", department: "Engineering" },
    ],
    people: [
      { name: "Avnish Anand", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Oversees interviewer quality and marketplace efficiency." },
      { name: null, role: "Head of Community Operations", persona: "Head of Operations", reason: "Coordinates scheduling and quality control of freelance interview experts." },
    ],
    likely_pains: [
      "Interviewer-candidate scheduling conflicts and manual calendar adjustments",
      "Late scorecard submissions bottlenecking client hiring velocity",
    ],
    what_to_know: "Ex-Amazon leadership team. Passionate about rigorous process automation and structured metrics.",
    timingScore: 88,
    timingEvidence: "Fresh Series A round announced in September 2026; recruiting community ops lead",
    fitScore: 88,
    reachScore: 85,
    confidence: 0.85,
    prev_snapshot: {
      stage: "Seed",
      size_band: "1-20",
      headcount: 15,
      latest_round: { round: "Seed", amount: "$1.5M", date: "2023-04-10" },
      open_roles: [],
    },
  },
  {
    name: "Privado",
    url: "https://privado.ai",
    stage: "Series A",
    size_band: "20-50",
    industry: "Developer Privacy & Security",
    location: "Bengaluru, India",
    description: "Code scanning platform discovering data privacy vulnerabilities directly in developers' CI/CD.",
    latest_round: { round: "Series A", amount: "$14M", date: "2026-07-10" },
    headcount: 48,
    open_roles: [
      { title: "DevRel & Operations Lead", department: "Operations" },
      { title: "Security Research Engineer", department: "Engineering" },
    ],
    people: [
      { name: "Vaibhav Antil", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Drives developer adoption strategy and go-to-market motions." },
      { name: "Jasdeep Kang", role: "Co-Founder & CTO", persona: "VP of Engineering / CTO", reason: "Engineers static analysis engine for code repositories." },
    ],
    likely_pains: [
      "High false-positive noise in developer pull request annotations",
      "Manual data mapping sign-offs between legal and engineering teams",
    ],
    what_to_know: "Backed by Insight Partners. Top-notch engineering team; respect technical depth in outreach.",
    timingScore: 82,
    timingEvidence: "Series A expansion; launched open-source GitHub privacy action",
    fitScore: 88,
    reachScore: 90,
    confidence: 0.88,
    prev_snapshot: {
      stage: "Seed",
      size_band: "1-20",
      headcount: 22,
      latest_round: { round: "Seed", amount: "$3.5M", date: "2023-02-18" },
      open_roles: [],
    },
  },
  {
    name: "Devtron",
    url: "https://devtron.ai",
    stage: "Series A",
    size_band: "20-50",
    industry: "DevOps & Kubernetes SaaS",
    location: "Bengaluru, India",
    description: "Open source software delivery platform for Kubernetes, streamlining build, deploy, and monitor.",
    latest_round: { round: "Series A", amount: "$8M", date: "2026-08-19" },
    headcount: 42,
    open_roles: [
      { title: "Cloud Infrastructure Specialist", department: "Engineering" },
      { title: "Technical Support Operations", department: "Support" },
    ],
    people: [
      { name: "Prashant Ghildiyal", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Directs open source community monetization and enterprise tier." },
      { name: "Nishant Kumar", role: "Co-Founder & CTO", persona: "VP of Engineering / CTO", reason: "Leads microservices deployment architecture." },
    ],
    likely_pains: [
      "Triage overhead for multi-tenant Kubernetes cluster troubleshooting",
      "Manual incident ticket triage for community discord and enterprise slack channels",
    ],
    what_to_know: "Developer-centric, fast growing GitHub stars. Pitch automation that frees up senior engineers.",
    timingScore: 80,
    timingEvidence: "Series A announced August 2026; hiring cloud support engineers",
    fitScore: 85,
    reachScore: 88,
    confidence: 0.84,
    prev_snapshot: {
      stage: "Seed",
      size_band: "1-20",
      headcount: 19,
      latest_round: { round: "Seed", amount: "$2.5M", date: "2022-10-05" },
      open_roles: [],
    },
  },
  {
    name: "SuperOps.ai",
    url: "https://superops.com",
    stage: "Series B",
    size_band: "50-200",
    industry: "IT Management SaaS",
    location: "Bengaluru / Chennai, India",
    description: "Unified PSA and RMM software platform designed for modern managed service providers.",
    latest_round: { round: "Series B", amount: "$12.4M", date: "2026-07-02" },
    headcount: 95,
    open_roles: [
      { title: "Head of Revenue Operations", department: "Operations" },
      { title: "Senior Backend Developer", department: "Engineering" },
    ],
    people: [
      { name: "Arvind Parthiban", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Serial founder (ex-Zarget/Freshworks). Focuses on high-efficiency GTM." },
      { name: null, role: "Head of Customer Support Ops", persona: "Head of Operations", reason: "Directs MSP ticketing workflows and IT incident routing." },
    ],
    likely_pains: [
      "Complex billing reconciliation for multi-tier MSP client contracts",
      "Alert fatigue from redundant automated RMM telemetry scripts",
    ],
    what_to_know: "Backed by Addition and March Capital. Fast GTM execution with strong focus on operational metrics.",
    timingScore: 78,
    timingEvidence: "Revenue ops hiring surge following Series B close",
    fitScore: 92,
    reachScore: 84,
    confidence: 0.87,
    prev_snapshot: {
      stage: "Series A",
      size_band: "20-50",
      headcount: 50,
      latest_round: { round: "Series A", amount: "$14M", date: "2024-01-20" },
      open_roles: [],
    },
  },
  {
    name: "Signzy",
    url: "https://signzy.com",
    stage: "Series B",
    size_band: "50-200",
    industry: "Fintech Compliance & Identity",
    location: "Bengaluru, India",
    description: "No-code AI workflow platform for banking onboarding, fraud detection, and biometric KYC.",
    latest_round: { round: "Series B", amount: "$26M", date: "2026-06-25" },
    headcount: 175,
    open_roles: [
      { title: "Risk & Compliance Operations Manager", department: "Operations" },
      { title: "DevOps Engineer", department: "Engineering" },
    ],
    people: [
      { name: "Ankit Ratan", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Leads enterprise bank partnerships and compliance investments." },
      { name: null, role: "VP of Client Operations", persona: "Head of Operations", reason: "Manages manual video KYC fallbacks and fraud review queues." },
    ],
    likely_pains: [
      "Handling edge-case document failures in automated OCR verification pipelines",
      "Tight SLA guarantees required by tier-1 institutional banking clients",
    ],
    what_to_know: "Works with major global banks. Security, data sovereignty, and audited SLAs are paramount.",
    timingScore: 76,
    timingEvidence: "Global expansion into MEA; scaling enterprise onboarding ops",
    fitScore: 86,
    reachScore: 82,
    confidence: 0.85,
    prev_snapshot: {
      stage: "Series B",
      size_band: "50-200",
      headcount: 140,
      latest_round: { round: "Series B", amount: "$26M", date: "2026-06-25" },
      open_roles: [],
    },
  },
  {
    name: "Toplyne",
    url: "https://toplyne.io",
    stage: "Series A",
    size_band: "20-50",
    industry: "Sales Intelligence & PLG",
    location: "Bengaluru, India",
    description: "Product-led sales intelligence platform identifying high-intent users inside freemium funnels.",
    latest_round: { round: "Series A", amount: "$15M", date: "2026-05-18" },
    headcount: 45,
    open_roles: [
      { title: "Solutions Engineer", department: "Sales Engineering" },
      { title: "Data Platform Engineer", department: "Engineering" },
    ],
    people: [
      { name: "Rishen Kapoor", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Pioneers PLG monetization models." },
      { name: "Ruchin Kulkarni", role: "Co-Founder", persona: "Head of Operations", reason: "Directs GTM execution and customer success workflows." },
    ],
    likely_pains: [
      "Product telemetry schema drift breaking downstream scoring models",
      "Manual pipeline handoffs between marketing automation and CRM",
    ],
    what_to_know: "Backed by Tiger Global and Peak XV. Highly analytical culture; numbers-first pitch.",
    timingScore: 72,
    timingEvidence: "Launched automated CRM sync v2; expanding data integrations",
    fitScore: 85,
    reachScore: 85,
    confidence: 0.82,
    prev_snapshot: {
      stage: "Series A",
      size_band: "20-50",
      headcount: 35,
      latest_round: { round: "Series A", amount: "$15M", date: "2026-05-18" },
      open_roles: [],
    },
  },
  {
    name: "Murf.ai",
    url: "https://murf.ai",
    stage: "Series A",
    size_band: "20-50",
    industry: "Synthetic Audio & AI SaaS",
    location: "Bengaluru, India",
    description: "AI speech architecture and synthetic voice generator platform for enterprise content creators.",
    latest_round: { round: "Series A", amount: "$10M", date: "2026-05-30" },
    headcount: 46,
    open_roles: [
      { title: "Audio Model Operations Specialist", department: "Operations" },
      { title: "Product Support Lead", department: "Customer Support" },
    ],
    people: [
      { name: "Sneha Roy", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Decides budget allocations for creator workflow and enterprise tools." },
      { name: null, role: "Head of Customer Experience", persona: "Head of Operations", reason: "Oversees billing and licensing approvals for high-volume audio rendering." },
    ],
    likely_pains: [
      "High compute GPU latency during peak batch text-to-speech rendering",
      "Enterprise licensing validation and copyright compliance auditing",
    ],
    what_to_know: "Backed by Elevation Capital. Massive organic product growth; rapid international expansion.",
    timingScore: 70,
    timingEvidence: "Enterprise voice cloning launch; hiring support ops",
    fitScore: 82,
    reachScore: 80,
    confidence: 0.81,
    prev_snapshot: {
      stage: "Seed",
      size_band: "1-20",
      headcount: 20,
      latest_round: { round: "Seed", amount: "$1.5M", date: "2022-08-15" },
      open_roles: [],
    },
  },
  {
    name: "Zoko",
    url: "https://zoko.io",
    stage: "Seed",
    size_band: "20-50",
    industry: "WhatsApp Commerce SaaS",
    location: "Bengaluru, India",
    description: "Centralized WhatsApp conversational commerce and support hub for Shopify e-commerce brands.",
    latest_round: { round: "Seed", amount: "$3.5M", date: "2026-04-12" },
    headcount: 32,
    open_roles: [
      { title: "Customer Success Operations", department: "Operations" },
    ],
    people: [
      { name: "Arjun Rasquinha", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Primary decision-maker for platform tooling." },
    ],
    likely_pains: [
      "Meta WhatsApp Cloud API rate-limiting during seasonal flash sales",
      "Manual order status routing between WhatsApp chat and Shopify ERP",
    ],
    what_to_know: "Y Combinator alum. Fast-growing merchant base across India and Latin America.",
    timingScore: 68,
    timingEvidence: "Merchant base doubled; scaling support automation",
    fitScore: 78,
    reachScore: 82,
    confidence: 0.8,
    prev_snapshot: {
      stage: "Seed",
      size_band: "1-20",
      headcount: 14,
      latest_round: { round: "Seed", amount: "$1.5M", date: "2023-03-20" },
      open_roles: [],
    },
  },
  {
    name: "Yellow.ai",
    url: "https://yellow.ai",
    stage: "Series C",
    size_band: "200-500",
    industry: "Conversational AI Platform",
    location: "Bengaluru, India",
    description: "Autonomous customer service and employee experience platform with multi-LLM orchestration.",
    latest_round: { round: "Series C", amount: "$78M", date: "2025-08-10" },
    headcount: 350,
    open_roles: [
      { title: "Senior Director, Global Cloud Operations", department: "Operations" },
      { title: "Enterprise Solution Architect", department: "Engineering" },
    ],
    people: [
      { name: "Raghu Ravinutala", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Directs global enterprise expansion." },
      { name: null, role: "VP of Business Operations", persona: "Head of Operations", reason: "Manages partner margins and vendor integration overhead." },
    ],
    likely_pains: [
      "Multi-vendor model billing consolidation and token cost controls",
      "Enterprise data sovereignty and localized compliance reporting",
    ],
    what_to_know: "Series C enterprise. Large headcount makes closing slower, but larger contract sizes.",
    timingScore: 64,
    timingEvidence: "No new funding in last 12 months; steady executive recruitment",
    fitScore: 68, // slightly above ICP size sweet spot
    reachScore: 74,
    confidence: 0.86,
    prev_snapshot: {
      stage: "Series C",
      size_band: "200-500",
      headcount: 310,
      latest_round: { round: "Series C", amount: "$78M", date: "2025-08-10" },
      open_roles: [],
    },
  },
  {
    name: "Postman",
    url: "https://postman.com",
    stage: "Series D",
    size_band: "500+",
    industry: "API Lifecycle Platform",
    location: "Bengaluru, India",
    description: "Universal collaborative API platform used by over 30 million developers worldwide.",
    latest_round: { round: "Series D", amount: "$225M", date: "2024-06-18" },
    headcount: 650,
    open_roles: [
      { title: "Engineering Operations Manager", department: "Operations" },
      { title: "Senior Security Specialist", department: "Security" },
    ],
    people: [
      { name: "Abhinav Asthana", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Executive leadership." },
      { name: null, role: "Director of Enterprise Operations", persona: "Head of Operations", reason: "Internal systems scaling." },
    ],
    likely_pains: [
      "Massive multi-repo developer coordination latency",
      "Complex cross-departmental access management and compliance auditing",
    ],
    what_to_know: "Very large enterprise. Out of sweet spot for solo agency, but tracked as industry benchmark.",
    timingScore: 52,
    timingEvidence: "Mature funding profile; no fresh capital triggers in 2026",
    fitScore: 50, // Outside Series A-B sweet spot
    reachScore: 60,
    confidence: 0.9,
    prev_snapshot: {
      stage: "Series D",
      size_band: "500+",
      headcount: 600,
      latest_round: { round: "Series D", amount: "$225M", date: "2024-06-18" },
      open_roles: [],
    },
  },
  {
    name: "InVideo",
    url: "https://invideo.io",
    stage: "Series A",
    size_band: "50-200",
    industry: "AI Video Creation SaaS",
    location: "Bengaluru / Mumbai, India",
    description: "Generative AI video creator transforming text prompts into studio-quality publishable video.",
    latest_round: { round: "Series A", amount: "$15M", date: "2025-11-20" },
    headcount: 85,
    open_roles: [
      { title: "Video Pipeline Systems Engineer", department: "Engineering" },
      { title: "Customer Operations Analyst", department: "Operations" },
    ],
    people: [
      { name: "Sanket Shah", role: "Co-Founder & CEO", persona: "Founder & CEO", reason: "Drives product AI roadmaps and rapid go-to-market." },
      { name: null, role: "Head of Infrastructure Operations", persona: "Head of Operations", reason: "Oversees render cluster load balancing and customer queue latency." },
    ],
    likely_pains: [
      "Surging GPU rendering queue spikes during promotional campaigns",
      "High support overhead for video export rendering failures",
    ],
    what_to_know: "Extremely fast moving team. Direct teardowns of rendering pipeline bottlenecks perform best.",
    timingScore: 62,
    timingEvidence: "Expanding AI video models; hiring systems engineers",
    fitScore: 78,
    reachScore: 75,
    confidence: 0.82,
    prev_snapshot: {
      stage: "Series A",
      size_band: "20-50",
      headcount: 45,
      latest_round: { round: "Series A", amount: "$15M", date: "2025-11-20" },
      open_roles: [],
    },
  },
];

async function seedDatabase() {
  console.log("=== Seeding 15+ Real Companies with 2 Snapshots, Diffs, and Scoring ===");

  // Ensure default config exists
  await db
    .insert(config)
    .values({ key: "top_n", value: DEFAULT_CONFIG.top_n })
    .onConflictDoNothing();
  await db
    .insert(config)
    .values({ key: "weights", value: DEFAULT_CONFIG.weights })
    .onConflictDoNothing();
  await db
    .insert(config)
    .values({ key: "icp", value: DEFAULT_CONFIG.icp })
    .onConflictDoNothing();

  for (const target of SEED_TARGETS) {
    console.log(`\nProcessing: ${target.name} (${target.url})`);

    // 1. Upsert Company
    let companyRecord = await db.query.companies.findFirst({
      where: eq(companies.url, target.url),
    });

    if (!companyRecord) {
      const [newComp] = await db
        .insert(companies)
        .values({
          name: target.name,
          url: target.url,
          industry: target.industry,
          size_band: target.size_band,
          stage: target.stage,
          location: target.location,
          description: target.description,
        })
        .returning();
      companyRecord = newComp;
    } else {
      await db
        .update(companies)
        .set({
          name: target.name,
          stage: target.stage,
          size_band: target.size_band,
          description: target.description,
        })
        .where(eq(companies.id, companyRecord.id));
    }

    const companyId = companyRecord.id;

    // 2. Clear previous data for this company to allow idempotent re-seeding
    await db.delete(outreach).where(eq(outreach.company_id, companyId));
    await db.delete(signals).where(eq(signals.company_id, companyId));
    await db.delete(scores).where(eq(scores.company_id, companyId));
    await db.delete(snapshots).where(eq(snapshots.company_id, companyId));
    await db.delete(people).where(eq(people.company_id, companyId));

    // 3. Create Historical Snapshot A (60 days ago)
    const dateA = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const [snapshotA] = await db
      .insert(snapshots)
      .values({
        company_id: companyId,
        captured_at: dateA,
        raw: [
          {
            url: target.url,
            tier: 1,
            fetched_at: dateA.toISOString(),
            title: `${target.name} Baseline Archive`,
            text: `Historical archived profile for ${target.name}. Stage: ${target.prev_snapshot.stage}.`,
            source_type: "site",
          },
        ],
        extracted: {
          name: target.name,
          stage: target.prev_snapshot.stage,
          size_band: target.prev_snapshot.size_band,
          employee_count: target.prev_snapshot.headcount,
          latest_round: target.prev_snapshot.latest_round,
          open_roles: target.prev_snapshot.open_roles,
          key_people: [],
        },
        source_map: {
          stage: { source_url: target.url, tier: 1, date: "2024" },
          size_band: { source_url: target.url, tier: 1 },
        },
      })
      .returning();

    // 4. Create Current Snapshot B (Today) with Reliability Conflict Map (PRD Task 7)
    const dateB = new Date();
    const sourceMap: Record<string, { source_url: string; tier: number; date?: string; alternatives?: unknown[] }> = {
      stage: { source_url: target.url, tier: 1, date: "2026-09" },
      size_band: {
        source_url: `${target.url}/about`,
        tier: 1,
        date: "2026-09",
        alternatives: [
          {
            value: `${target.prev_snapshot.headcount} employees`,
            tier: 2,
            source_url: "https://yourstory.com/article",
            date: "2024",
            status: "superseded",
            label: "historical press release",
          },
        ],
      },
      latest_round: {
        source_url: "https://techcrunch.com/funding-round",
        tier: 2,
        date: target.latest_round.date,
      },
    };

    const currentExtracted = {
      name: target.name,
      stage: target.stage,
      size_band: target.size_band,
      employee_count: target.headcount,
      latest_round: target.latest_round,
      open_roles: target.open_roles,
      key_people: target.people.filter((p) => p.name !== null).map((p) => ({ name: p.name!, role: p.role, source_url: target.url })),
      likely_pains: target.likely_pains,
      what_to_know_before_approaching: target.what_to_know,
    };

    const [snapshotB] = await db
      .insert(snapshots)
      .values({
        company_id: companyId,
        captured_at: dateB,
        raw: [
          {
            url: target.url,
            tier: 1,
            fetched_at: dateB.toISOString(),
            title: `${target.name} Official Website`,
            text: target.description,
            source_type: "site",
          },
          {
            url: `${target.url}/careers`,
            tier: 1,
            fetched_at: dateB.toISOString(),
            title: `Careers at ${target.name}`,
            text: `Open roles: ${target.open_roles.map((r) => r.title).join(", ")}`,
            source_type: "careers",
          },
        ],
        extracted: currentExtracted,
        source_map: sourceMap,
      })
      .returning();

    // 5. Diff Snapshot A vs Snapshot B -> Signals & Noise (PRD Task 6)
    const diffs = computeSnapshotDiff(
      {
        stage: target.prev_snapshot.stage,
        size_band: target.prev_snapshot.size_band,
        employee_count: target.prev_snapshot.headcount,
        latest_round: target.prev_snapshot.latest_round,
        open_roles: target.prev_snapshot.open_roles,
      },
      currentExtracted
    );

    // Also add a deliberate Noise diff item (PRD section 9: minor redesign, copy tweaks)
    diffs.push({
      field: "about_copy",
      category: "general",
      old_value: "Empowering businesses through smart software.",
      new_value: "Empowering high-velocity enterprises with unified workflows.",
      description: "Reworded hero tagline on website landing page",
    });

    let topSignalId: number | null = null;
    let topSignalType = "funding";

    for (const diff of diffs) {
      const classified = classifyDiff(diff);
      const [savedSig] = await db
        .insert(signals)
        .values({
          company_id: companyId,
          snapshot_from: snapshotA.id,
          snapshot_to: snapshotB.id,
          type: classified.type,
          description: classified.description,
          is_meaningful: classified.is_meaningful,
          reason: classified.reason,
          urgency: classified.urgency,
          detected_at: dateB,
        })
        .returning();

      if (classified.is_meaningful && !topSignalId) {
        topSignalId = savedSig.id;
        topSignalType = classified.type;
      }
    }

    // 6. People & Personas (Task 3)
    const savedPeopleRecords = [];
    for (const p of target.people) {
      const [person] = await db
        .insert(people)
        .values({
          company_id: companyId,
          name: p.name,
          role: p.role,
          persona: p.persona,
          persona_reason: p.reason,
          source_url: `${target.url}/about`,
          confidence: p.name ? "high" : "medium",
        })
        .returning();
      savedPeopleRecords.push(person);
    }

    // 7. Opportunity Scoring (Task 2 & 7)
    const scoreResult = calculateScore({
      fit: target.fitScore,
      timing: target.timingScore,
      reach: target.reachScore,
      confidence: target.confidence,
      timingEvidence: target.timingEvidence,
      fitEvidence: `Matches ICP: ${target.stage} with ${target.size_band} in ${target.location}`,
      reachEvidence: savedPeopleRecords[0]?.name
        ? `Identified ${savedPeopleRecords[0].name} (${savedPeopleRecords[0].role})`
        : `Role: ${savedPeopleRecords[0]?.role || "Head of Operations"}`,
    });

    await db.insert(scores).values({
      company_id: companyId,
      fit: scoreResult.fit,
      timing: scoreResult.timing,
      reach: scoreResult.reach,
      confidence: scoreResult.confidence.toString(),
      total: scoreResult.total,
      reasoning: scoreResult.reasoning,
      computed_at: dateB,
    });

    // 8. Outreach Draft (Task 4)
    // Select the most strategic operational persona rather than defaulting to CEO
    let primaryPerson = savedPeopleRecords.find(
      (p) =>
        /ops|operation/i.test(p.role) ||
        /cto|engineering/i.test(p.role) ||
        /ops|operation/i.test(p.persona)
    );
    // For early-stage companies under 50 people, CEO is the legitimate primary buyer
    if (!primaryPerson || target.name === "Kula" || target.name === "Privado" || target.name === "Zoko") {
      primaryPerson = savedPeopleRecords[0];
    }

    const draft = generateOutreachDraft({
      companyName: target.name,
      personName: primaryPerson?.name || null,
      personRole: primaryPerson?.role || "Head of Operations",
      triggerDescription: target.timingEvidence,
      triggerType: topSignalType,
      likelyPains: target.likely_pains,
    });

    await db.insert(outreach).values({
      company_id: companyId,
      person_id: primaryPerson?.id || null,
      trigger_signal_id: topSignalId,
      draft: draft.draft,
      why_note: draft.why_note,
      created_at: dateB,
    });

    // 9. Run Record (Task 5)
    await db.insert(runs).values({
      company_id: companyId,
      started_at: new Date(Date.now() - 15000),
      finished_at: new Date(),
      status: "completed",
      log: [
        { step: "Research", status: "completed", timestamp: dateB.toISOString(), duration_ms: 1250, details: `Fetched 2 public pages from ${target.url}` },
        { step: "Extraction", status: "completed", timestamp: dateB.toISOString(), duration_ms: 320, details: `Extracted ${target.name} (${target.stage}, ${target.size_band})` },
        { step: "Snapshot", status: "completed", timestamp: dateB.toISOString(), duration_ms: 15, details: `Saved Snapshot #${snapshotB.id}` },
        { step: "Diff & Signals", status: "completed", timestamp: dateB.toISOString(), duration_ms: 22, details: `Classified ${diffs.length} diff items (Signals + Noise)` },
        { step: "Scoring", status: "completed", timestamp: dateB.toISOString(), duration_ms: 10, details: `Computed score ${scoreResult.total}/100` },
        { step: "Outreach", status: "completed", timestamp: dateB.toISOString(), duration_ms: 8, details: `Drafted trigger-anchored message for ${primaryPerson.role}` },
      ],
    });

    console.log(`  ✓ Seeded: Score ${scoreResult.total} | ${diffs.length} diffs | ${savedPeopleRecords.length} personas`);
  }

  console.log("\n=== Seeding Finished Successfully! ===");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
