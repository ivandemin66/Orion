import type { PropsWithChildren } from "react";

export function SectionCard({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
