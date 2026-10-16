import type { QlooClient } from "@/lib/qloo/client";
import type { QlooEntity } from "@/lib/qloo/types";
import { findCity } from "./cities";
import { FACETS, type Facet } from "./facets";
import {
  type TripRequest,
  type TripPlan,
  type Pick,
  type ResolvedSeed,
  type AgentStep,
  type DayPlan,
  KIND_TO_TYPE,
} from "./types";

const TAKE_PER_FACET = 3;

/**
 * The agent. Runs a multi-step loop over the Qloo graph:
 *   1. resolve each taste seed to a graph entity (/search)
 *   2. for each trip facet, query the graph conditioned on those seeds (/v2/insights)
 *   3. rank the returned entities by affinity
 *   4. compose a day-by-day itinerary and justify every pick
 *
 * Deterministic and keyless-capable: with the mock client it runs fully offline; with
 * the live client every recommendation and score comes straight from Qloo.
 */
export async function planTrip(
  client: QlooClient,
  req: TripRequest,
): Promise<TripPlan> {
  const city = findCity(req.cityId);
  if (!city) throw new Error(`Unknown city: ${req.cityId}`);

  const steps: AgentStep[] = [];
  const days = Math.min(Math.max(req.days, 1), 5);

  // Step 1 — resolve taste seeds to entities.
  const resolved: ResolvedSeed[] = [];
  for (const seed of req.seeds) {
    const hits = await client.search({
      query: seed.name,
      types: [KIND_TO_TYPE[seed.kind]],
      take: 1,
    });
    const hit = hits[0];
    resolved.push({
      ...seed,
      entityId: hit?.entity_id ?? "",
      resolved: Boolean(hit?.entity_id),
    });
  }
  const seedIds = resolved.filter((s) => s.resolved).map((s) => s.entityId);
  const seedNames = resolved.map((s) => s.name);
  steps.push({
    kind: "resolve",
    label: "Resolved your taste in the graph",
    detail: `Matched ${seedIds.length}/${req.seeds.length} seeds: ${seedNames.join(", ")}`,
  });

  // Step 2 + 3 — query + rank each facet.
  const picksByFacet = new Map<string, Pick[]>();
  for (const facet of FACETS) {
    const entities = await client.insights({
      filterType: facet.filterType,
      signalEntities: seedIds,
      filterTags: facet.categoryTag ? [facet.categoryTag] : undefined,
      location: facet.located ? city.location : undefined,
      take: TAKE_PER_FACET,
    });
    const ranked = [...entities].sort(
      (a, b) => affinityOf(b) - affinityOf(a),
    );
    const picks = ranked.map((e) => toPick(facet, e, seedNames));
    picksByFacet.set(facet.id, picks);
    steps.push({
      kind: "query",
      label: `Queried Qloo for ${facet.label.toLowerCase()}`,
      detail:
        picks.length > 0
          ? `Top match: ${picks[0].name} (affinity ${picks[0].affinity.toFixed(2)})`
          : "No matches returned",
    });
  }

  // Step 4 — compose.
  const stay = picksByFacet.get("stay")?.[0];
  const reads = picksByFacet.get("browse") ?? [];
  const dayPlans = composeDays(days, picksByFacet);
  steps.push({
    kind: "compose",
    label: "Composed your itinerary",
    detail: `${days}-day plan for ${city.name}, ${city.country}`,
  });

  return {
    city: { id: city.id, name: city.name, country: city.country, blurb: city.blurb },
    mode: client.mode,
    days,
    seeds: resolved,
    stay,
    reads,
    dayPlans,
    steps,
  };
}

function affinityOf(e: QlooEntity): number {
  return e.query?.affinity ?? e.popularity ?? 0;
}

function tagNames(e: QlooEntity): string[] {
  return (e.tags ?? []).map((t) => t.name).filter((n): n is string => Boolean(n));
}

function toPick(facet: Facet, e: QlooEntity, seedNames: string[]): Pick {
  const tags = tagNames(e);
  const affinity = affinityOf(e);
  return {
    facetId: facet.id,
    facetLabel: facet.label,
    name: e.name,
    entityId: e.entity_id,
    affinity,
    description: e.properties?.description ?? "",
    address: e.properties?.address,
    tags,
    why: explain(seedNames, tags, affinity),
  };
}

/** Build the taste-chain justification shown under each pick. */
export function explain(
  seedNames: string[],
  tags: string[],
  affinity: number,
): string {
  const seeds =
    seedNames.length > 2
      ? `${seedNames.slice(0, 2).join(", ")} and ${seedNames.length - 2} more`
      : seedNames.join(" and ");
  const overlap = tags.slice(0, 2).join(" + ");
  const score = `affinity ${affinity.toFixed(2)}`;
  if (!seeds) return `Taste-matched (${score}).`;
  if (!overlap) return `Because you like ${seeds} (${score}).`;
  return `Because you like ${seeds} → ${overlap} (${score}).`;
}

function composeDays(
  days: number,
  picksByFacet: Map<string, Pick[]>,
): DayPlan[] {
  const eat = picksByFacet.get("eat") ?? [];
  const drink = picksByFacet.get("drink") ?? [];
  const doing = picksByFacet.get("do") ?? [];
  const plans: DayPlan[] = [];
  for (let d = 0; d < days; d++) {
    plans.push({
      day: d + 1,
      eat: eat[d % Math.max(eat.length, 1)],
      drink: drink[d % Math.max(drink.length, 1)],
      do: doing[d % Math.max(doing.length, 1)],
    });
  }
  return plans;
}
