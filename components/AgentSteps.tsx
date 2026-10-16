import type { AgentStep } from "@/lib/agent/types";

const DOT: Record<AgentStep["kind"], string> = {
  resolve: "bg-sky-400",
  query: "bg-amber-400",
  rank: "bg-fuchsia-400",
  compose: "bg-emerald-400",
};

export function AgentSteps({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
        How the agent decided
      </h2>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span
              className={`mt-1.5 h-2 w-2 flex-none rounded-full ${DOT[s.kind]}`}
              aria-hidden
            />
            <div>
              <div className="text-sm font-medium">{s.label}</div>
              <div className="text-sm text-white/50">{s.detail}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
