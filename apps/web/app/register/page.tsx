export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.26em] text-sea">Register</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create an account</h1>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" />
          <button className="w-full rounded-full bg-sea px-4 py-3 text-sm font-semibold text-white">Create account</button>
        </form>
      </div>
    </main>
  );
}

