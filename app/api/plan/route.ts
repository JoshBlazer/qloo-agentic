import { NextResponse } from "next/server";
import { getQlooClient } from "@/lib/qloo/client";
import { planTrip } from "@/lib/agent/planner";
import type { TasteSeed, TripRequest } from "@/lib/agent/types";

export const runtime = "nodejs";

const KINDS = new Set(["artist", "movie", "book", "brand"]);

function parseSeeds(input: unknown): TasteSeed[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((s): s is { name: unknown; kind: unknown } => typeof s === "object" && s !== null)
    .map((s) => ({
      name: String((s as { name: unknown }).name ?? "").trim(),
      kind: (KINDS.has(String((s as { kind: unknown }).kind)) ? (s as { kind: string }).kind : "artist") as TasteSeed["kind"],
    }))
    .filter((s) => s.name.length > 0)
    .slice(0, 6);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = body as { seeds?: unknown; cityId?: unknown; days?: unknown };
  const seeds = parseSeeds(b.seeds);
  const cityId = String(b.cityId ?? "");
  const days = Number.isFinite(Number(b.days)) ? Number(b.days) : 3;

  if (seeds.length === 0) {
    return NextResponse.json(
      { error: "Add at least one thing you love." },
      { status: 400 },
    );
  }
  if (!cityId) {
    return NextResponse.json({ error: "Pick a destination." }, { status: 400 });
  }

  const req: TripRequest = { seeds, cityId, days };
  try {
    const client = getQlooClient();
    const plan = await planTrip(client, req);
    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Planning failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
