"use client";

import { useState } from "react";
import type { TasteSeed } from "@/lib/agent/types";
import { CITIES } from "@/lib/agent/cities";

const KINDS: TasteSeed["kind"][] = ["artist", "movie", "book", "brand"];

const EXAMPLE: TasteSeed[] = [
  { name: "Radiohead", kind: "artist" },
  { name: "Lost in Translation", kind: "movie" },
  { name: "Haruki Murakami", kind: "book" },
];

export interface FormValue {
  seeds: TasteSeed[];
  cityId: string;
  days: number;
}

export function TasteForm({
  onSubmit,
  loading,
}: {
  onSubmit: (v: FormValue) => void;
  loading: boolean;
}) {
  const [seeds, setSeeds] = useState<TasteSeed[]>([
    { name: "", kind: "artist" },
    { name: "", kind: "movie" },
    { name: "", kind: "book" },
  ]);
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [days, setDays] = useState(3);

  function setSeed(i: number, patch: Partial<TasteSeed>) {
    setSeeds((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addSeed() {
    setSeeds((prev) => (prev.length >= 6 ? prev : [...prev, { name: "", kind: "artist" }]));
  }
  function removeSeed(i: number) {
    setSeeds((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  function submit() {
    const cleaned = seeds.filter((s) => s.name.trim().length > 0);
    onSubmit({ seeds: cleaned, cityId, days });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <label className="mb-2 block text-sm font-medium text-white/70">
        Things you love
      </label>
      <div className="space-y-2">
        {seeds.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={s.name}
              onChange={(e) => setSeed(i, { name: e.target.value })}
              placeholder="e.g. Radiohead"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
            />
            <select
              value={s.kind}
              onChange={(e) => setSeed(i, { kind: e.target.value as TasteSeed["kind"] })}
              className="rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-sm outline-none focus:border-white/30"
              aria-label="Kind"
            >
              {KINDS.map((k) => (
                <option key={k} value={k} className="bg-ink">
                  {k}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeSeed(i)}
              className="rounded-lg border border-white/10 px-3 text-sm text-white/50 hover:text-white"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={addSeed}
          className="text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          + add another
        </button>
        <button
          type="button"
          onClick={() => setSeeds(EXAMPLE)}
          className="text-white/40 underline-offset-4 hover:text-white hover:underline"
        >
          use an example
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/70">
            Destination
          </label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/30"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink">
                {c.name}, {c.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white/70">
            Days: {days}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-ink transition hover:bg-amber-300 disabled:opacity-50"
      >
        {loading ? "Planning…" : "Plan my trip"}
      </button>
    </div>
  );
}
