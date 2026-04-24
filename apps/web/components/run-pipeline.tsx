type PipelineStep = {
  agent: string;
  status: string;
  reservedTokens: number;
};

const statusStyles: Record<string, string> = {
  pending: "bg-slate-100 text-slate-600",
  running: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  blocked: "bg-violet-100 text-violet-700",
  cancelled: "bg-slate-200 text-slate-700"
};

export function RunPipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.agent} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step {index + 1}</p>
              <h3 className="text-sm font-semibold text-slate-900">{step.agent}</h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[step.status] ?? statusStyles.pending}`}
            >
              {step.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Reserved tokens: {step.reservedTokens.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
