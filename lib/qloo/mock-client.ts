import type { QlooClient, QlooEntity, SearchParams, InsightsParams } from "./types";
import { INSIGHTS_FIXTURES, GENERIC_FACETS, seedEntityId } from "./fixtures";
import { cityByLocation } from "@/lib/agent/cities";
import { FACETS } from "@/lib/agent/facets";

// category tag -> facet id, so the mock disambiguates place subtypes the same way the
// live API does (via filter.tags). Non-place facets are matched by filter.type.
const CATEGORY_TO_FACET = new Map<string, string>(
  FACETS.filter((f) => f.categoryTag).map((f) => [f.categoryTag as string, f.id]),
);

/**
 * Offline Qloo client backed by fixtures. Honors the same interface as the live client,
 * so swapping between them is invisible to the agent. It infers the city from the
 * `filter.location` lat/lon and the facet from `filter.tags` / `filter.type`, then
 * returns curated, affinity-ranked entities — enough to run the full agent flow with
 * zero keys.
 */
export class MockQlooClient implements QlooClient {
  readonly mode = "mock" as const;

  async search(params: SearchParams): Promise<QlooEntity[]> {
    const type = params.types?.[0] ?? "urn:entity:artist";
    // Return a single resolved entity for the searched name, as live /search would for a
    // confident match.
    return [
      {
        entity_id: seedEntityId(params.query.toLowerCase()),
        name: params.query,
        types: [type],
        popularity: 0.6,
        tags: [],
      },
    ];
  }

  async insights(params: InsightsParams): Promise<QlooEntity[]> {
    const city = params.location ? cityByLocation(params.location) : undefined;
    const facetMap = city ? INSIGHTS_FIXTURES[city.id] ?? GENERIC_FACETS : GENERIC_FACETS;

    const facetId =
      params.filterTags?.map((t) => CATEGORY_TO_FACET.get(t)).find(Boolean) ??
      FACETS.find((f) => f.filterType === params.filterType && !f.categoryTag)?.id;

    const list = facetId ? facetMap[facetId] ?? [] : [];
    return typeof params.take === "number" ? list.slice(0, params.take) : list;
  }
}
