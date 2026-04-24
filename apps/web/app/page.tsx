import { SectionCard } from "@mass/ui";
import { RunPipeline } from "../components/run-pipeline";
import { TokenDashboard } from "../components/token-dashboard";
import { demoDashboard, demoRun } from "../lib/demo-data";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sea">MASS MVP Workspace</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              Multi-agent software delivery with transparent tokens and controlled SDLC.
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Prompt in, orchestrated SDLC out. The workspace shows what is happening, who is working, what has already
              been produced, and how many tokens the run has consumed.
            </p>
          </div>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Open token dashboard</button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.9fr_1fr]">
          <SectionCard title="Prompt Workspace">
            <div className="space-y-4">
              <textarea
                className="min-h-64 w-full rounded-3xl border border-slate-200 bg-mist p-5 text-sm outline-none ring-0"
                defaultValue="Create a secure RU-first MVP for multi-agent code generation. Include auth, billing, MCP, orchestration, live run status, token dashboard, run history, and cloud-ready deployment for Selectel/Yandex/Sber-compatible platforms."
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Policy: RU-first | User budget: 1,000,000 tokens</div>
                <button className="rounded-full bg-sea px-5 py-3 text-sm font-semibold text-white">Start generation</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="SDLC Timeline">
            <RunPipeline steps={demoRun.steps} />
          </SectionCard>

          <SectionCard title="Artifacts And Usage">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Planner reserved budget and published the run graph.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ready artifacts</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  <li>Run charter</li>
                  <li>Token budget plan</li>
                  <li>Provider routing policy</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Usage</p>
                <p className="mt-2 text-sm text-slate-600">Prompt: 4,420 | Completion: 1,280 | Cost: $2.13</p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-8">
          <SectionCard title="Token Dashboard">
            <TokenDashboard data={demoDashboard} />
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
