const rows = [
  { id: "RUN-001", status: "completed", tokens: "32,104", project: "Marketplace MVP" },
  { id: "RUN-002", status: "failed", tokens: "4,220", project: "Gov portal prototype" },
  { id: "RUN-003", status: "running", tokens: "12,901", project: "Mental health assistant" }
];

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-sea">History</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Run history and token spend</h1>
          </div>
          <div className="text-sm text-slate-500">Filter by status, date, project, spend</div>
        </div>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full bg-white text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Run</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.id}</td>
                  <td className="px-4 py-3 text-slate-600">{row.project}</td>
                  <td className="px-4 py-3 text-slate-600">{row.status}</td>
                  <td className="px-4 py-3 text-slate-600">{row.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

