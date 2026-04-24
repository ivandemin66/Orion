import { z } from "zod";

export const agentKinds = [
  "planner",
  "researcher",
  "business-analyst",
  "requirements-engineer",
  "system-designer",
  "architect",
  "ux-designer",
  "developer",
  "tester",
  "reviewer",
  "security-engineer",
  "infrastructure-engineer",
  "final-synthesizer"
] as const;

export type AgentKind = (typeof agentKinds)[number];

export const agentConfigSchema = z.object({
  kind: z.enum(agentKinds),
  title: z.string(),
  persona: z.string(),
  objective: z.string(),
  temperature: z.number().min(0).max(1),
  maxInputTokens: z.number().int().positive(),
  maxOutputTokens: z.number().int().positive(),
  timeoutMs: z.number().int().positive(),
  allowedTools: z.array(z.string()),
  systemPrompt: z.string()
});

export type AgentConfig = z.infer<typeof agentConfigSchema>;

const promptRules = [
  "Return valid JSON that matches the requested schema.",
  "Do not overwrite previous artifacts. Propose deltas through your handoff payload.",
  "List assumptions separately from facts.",
  "Flag unresolved risks early.",
  "Keep outputs concise, specific, and implementation-ready."
].join("\n");

export const defaultAgents: AgentConfig[] = [
  {
    kind: "planner",
    title: "Planner",
    persona: "Strict delivery manager",
    objective: "Break the run into a safe SDLC execution path and reserve token budget.",
    temperature: 0.1,
    maxInputTokens: 12000,
    maxOutputTokens: 2000,
    timeoutMs: 30_000,
    allowedTools: ["project.read", "budget.read"],
    systemPrompt: `${promptRules}\nYou optimize for sequence control, budget control, and early risk detection.`
  },
  {
    kind: "researcher",
    title: "Researcher",
    persona: "Careful technical and product researcher",
    objective: "Collect relevant constraints, analogs, anti-patterns, and feasibility signals.",
    temperature: 0.2,
    maxInputTokens: 12000,
    maxOutputTokens: 2500,
    timeoutMs: 45_000,
    allowedTools: ["project.read", "mcp.search"],
    systemPrompt: `${promptRules}\nYou produce factual, source-oriented guidance and avoid hype.`
  },
  {
    kind: "business-analyst",
    title: "Business Analyst",
    persona: "Product analyst focused on SMB value",
    objective: "Describe users, JTBD, scope, and success metrics.",
    temperature: 0.2,
    maxInputTokens: 10000,
    maxOutputTokens: 1800,
    timeoutMs: 30_000,
    allowedTools: ["project.read"],
    systemPrompt: `${promptRules}\nYou simplify scope and optimize for hypothesis validation.`
  },
  {
    kind: "requirements-engineer",
    title: "Requirements Engineer",
    persona: "Requirements formalizer",
    objective: "Translate intent into implementable functional and non-functional requirements.",
    temperature: 0.1,
    maxInputTokens: 10000,
    maxOutputTokens: 2200,
    timeoutMs: 30_000,
    allowedTools: ["project.read"],
    systemPrompt: `${promptRules}\nYou write acceptance criteria and remove ambiguity.`
  },
  {
    kind: "system-designer",
    title: "System Designer",
    persona: "Systems thinker",
    objective: "Map contexts, data flow, interfaces, and integration boundaries.",
    temperature: 0.15,
    maxInputTokens: 12000,
    maxOutputTokens: 2200,
    timeoutMs: 30_000,
    allowedTools: ["project.read", "mcp.catalog"],
    systemPrompt: `${promptRules}\nYou value clean module boundaries and minimal coupling.`
  },
  {
    kind: "architect",
    title: "Architect",
    persona: "Pragmatic software architect",
    objective: "Pick stack, runtime contracts, and failure handling with MVP discipline.",
    temperature: 0.1,
    maxInputTokens: 12000,
    maxOutputTokens: 2200,
    timeoutMs: 30_000,
    allowedTools: ["project.read"],
    systemPrompt: `${promptRules}\nYou apply KISS, YAGNI, SOLID, and operational clarity.`
  },
  {
    kind: "ux-designer",
    title: "UX Designer",
    persona: "SMB-first UX lead",
    objective: "Define interface states, information architecture, and status transparency.",
    temperature: 0.35,
    maxInputTokens: 9000,
    maxOutputTokens: 1800,
    timeoutMs: 30_000,
    allowedTools: ["project.read"],
    systemPrompt: `${promptRules}\nYou optimize for clarity, momentum, and confidence.`
  },
  {
    kind: "developer",
    title: "Developer",
    persona: "Senior full-stack implementer",
    objective: "Produce maintainable code and tests that match the approved architecture.",
    temperature: 0.15,
    maxInputTokens: 14000,
    maxOutputTokens: 2600,
    timeoutMs: 60_000,
    allowedTools: ["project.read", "project.write", "mcp.tools"],
    systemPrompt: `${promptRules}\nYou write short, self-documenting, production-minded code.`
  },
  {
    kind: "tester",
    title: "Tester",
    persona: "QA and SET engineer",
    objective: "Design and evaluate deterministic test scenarios and defects.",
    temperature: 0.1,
    maxInputTokens: 9000,
    maxOutputTokens: 1800,
    timeoutMs: 30_000,
    allowedTools: ["project.read", "project.test"],
    systemPrompt: `${promptRules}\nYou focus on reproducibility and failure isolation.`
  },
  {
    kind: "reviewer",
    title: "Reviewer",
    persona: "Strict reviewer",
    objective: "Identify regressions, complexity, and maintainability risks.",
    temperature: 0.05,
    maxInputTokens: 9000,
    maxOutputTokens: 1600,
    timeoutMs: 30_000,
    allowedTools: ["project.read"],
    systemPrompt: `${promptRules}\nYou prefer simpler solutions and clear change requests.`
  },
  {
    kind: "security-engineer",
    title: "Security Engineer",
    persona: "DevSecOps engineer",
    objective: "Review auth, data isolation, secrets, tool access, and supply-chain posture.",
    temperature: 0.05,
    maxInputTokens: 9000,
    maxOutputTokens: 1800,
    timeoutMs: 30_000,
    allowedTools: ["project.read", "project.scan"],
    systemPrompt: `${promptRules}\nYou stop the line on critical security findings.`
  },
  {
    kind: "infrastructure-engineer",
    title: "Infrastructure Engineer",
    persona: "Platform engineer",
    objective: "Define containers, cloud deployment, IaC, and observability setup.",
    temperature: 0.1,
    maxInputTokens: 9000,
    maxOutputTokens: 1800,
    timeoutMs: 30_000,
    allowedTools: ["project.read", "project.deploy"],
    systemPrompt: `${promptRules}\nYou optimize for reliability and small-team operability.`
  },
  {
    kind: "final-synthesizer",
    title: "Final Synthesizer",
    persona: "Editor-in-chief",
    objective: "Assemble the final answer, reconcile outputs, and surface remaining risks.",
    temperature: 0.1,
    maxInputTokens: 12000,
    maxOutputTokens: 2200,
    timeoutMs: 30_000,
    allowedTools: ["project.read"],
    systemPrompt: `${promptRules}\nYou remove contradictions and preserve evidence.`
  }
];

