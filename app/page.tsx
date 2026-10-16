"use client";

import { useState } from "react";
import { TasteForm, type FormValue } from "@/components/TasteForm";
import { AgentSteps } from "@/components/AgentSteps";
import { Itinerary } from "@/components/Itinerary";
import type { TripPlan } from "@/lib/agent/types";

export default function Home() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(v: FormValue) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setPlan(data as TripPlan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
      <header className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Wayfare
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          Tell it what you love.
          <br className="hidden sm:block" /> Get a city that fits.
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Wayfare is an AI concierge that turns your taste in music, film, and books into
          a taste-matched trip — and shows you the cross-domain taste chain behind every
          pick, drawn live from Qloo&apos;s cultural graph.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-6">
          <TasteForm onSubmit={run} loading={loading} />
          {plan && <AgentSteps steps={plan.steps} />}
        </div>

        <div>
          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          {!plan && !error && (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/40">
              {loading
                ? "Consulting the taste graph…"
                : "Your taste-matched itinerary will appear here."}
            </div>
          )}
          {plan && <Itinerary plan={plan} />}
        </div>
      </div>

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/30">
        Recommendations and affinity scores are produced by Qloo&apos;s taste graph. Running
        in mock mode until a Qloo API key is configured.
      </footer>
    </main>
  );
}
