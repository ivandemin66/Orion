type DashboardData = {
  totalTokens: number;
  totalCost: number;
  byProvider: Array<{ provider: string; totalTokens: number; estimatedCostUsd: number; errors: number }>;
  byAgent: Array<{ agent: string; tokens: number }>;
  burnRateDaily: number;
  burnRateWeekly: number;
};

export function TokenDashboard({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric title="Total tokens" value={data.totalTokens.toLocaleString()} />
        <Metric title="Estimated cost" value={`$${data.totalCost.toFixed(2)}`} />
        <Metric title="Weekly burn" value={data.burnRateWeekly.toLocaleString()} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold">By provider</h3>
          <div className="mt-4 space-y-3">
            {data.byProvider.map((item) => (
              <div key={item.provider} className="flex items-center justify-between text-sm">
                <span>{item.provider}</span>
                <span>{item.totalTokens.toLocaleString()} tok / ${item.estimatedCostUsd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold">By agent</h3>
          <div className="mt-4 space-y-3">
            {data.byAgent.map((item) => (
              <div key={item.agent} className="flex items-center justify-between text-sm">
                <span>{item.agent}</span>
                <span>{item.tokens.toLocaleString()} tok</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
