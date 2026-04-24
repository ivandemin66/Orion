const registry = [
  { key: "sber", mode: "primary", tools: "yes", json: "yes" },
  { key: "yandexgpt", mode: "secondary", tools: "no", json: "yes" },
  { key: "selectel", mode: "fallback", tools: "yes", json: "yes" }
];

export default function AdminProvidersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.26em] text-sea">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Provider routing and governance</h1>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full bg-white text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Tools</th>
                <th className="px-4 py-3">JSON mode</th>
              </tr>
            </thead>
            <tbody>
              {registry.map((row) => (
                <tr key={row.key} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.key}</td>
                  <td className="px-4 py-3 text-slate-600">{row.mode}</td>
                  <td className="px-4 py-3 text-slate-600">{row.tools}</td>
                  <td className="px-4 py-3 text-slate-600">{row.json}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

