import type { Pick, TripPlan } from "@/lib/agent/types";

function Affinity({ value }: { value: number }) {
  return (
    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-300">
      {value.toFixed(2)}
    </span>
  );
}

function PickCard({ pick }: { pick: Pick }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium">{pick.name}</div>
        <Affinity value={pick.affinity} />
      </div>
      {pick.description && (
        <p className="mt-1 text-sm text-white/60">{pick.description}</p>
      )}
      {pick.address && (
        <p className="mt-1 text-xs text-white/40">{pick.address}</p>
      )}
      <p className="mt-2 text-xs italic text-sky-300/80">{pick.why}</p>
    </div>
  );
}

export function Itinerary({ plan }: { plan: TripPlan }) {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold">
            {plan.city.name}, {plan.city.country}
          </h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              plan.mode === "live"
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-white/10 text-white/50"
            }`}
          >
            {plan.mode === "live" ? "live Qloo" : "mock data"}
          </span>
        </div>
        <p className="mt-1 text-white/60">{plan.city.blurb}</p>
      </header>

      {plan.stay && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">
            Where to stay
          </h3>
          <PickCard pick={plan.stay} />
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">
          Your days
        </h3>
        <div className="space-y-5">
          {plan.dayPlans.map((d) => (
            <div key={d.day} className="rounded-2xl border border-white/10 p-4">
              <div className="mb-3 text-sm font-semibold text-amber-300">
                Day {d.day}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {d.eat && <PickCard pick={d.eat} />}
                {d.drink && <PickCard pick={d.drink} />}
                {d.do && <PickCard pick={d.do} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {plan.reads.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">
            What to read
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.reads.map((r) => (
              <PickCard key={r.entityId} pick={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
