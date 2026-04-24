const providers = [
  { name: "Sber", status: "Enabled" },
  { name: "YandexGPT", status: "Enabled" },
  { name: "Selectel", status: "Standby" }
];

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.26em] text-sea">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Founder workspace</h1>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-slate-500">Current balance</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">1,000,000 tokens</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-slate-500">Security</p>
              <p className="mt-2">Argon2id password storage, rotating refresh sessions, RBAC user/admin.</p>
            </div>
          </div>
        </section>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.26em] text-sea">Providers</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Connected LLM routing</h2>
          <div className="mt-6 space-y-3">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <span className="text-sm font-medium text-slate-900">{provider.name}</span>
                <span className="text-sm text-slate-600">{provider.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

