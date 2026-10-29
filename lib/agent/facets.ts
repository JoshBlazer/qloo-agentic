import type { EntityTypeUrn } from "@/lib/qloo/types";

/** A facet is one dimension of a trip the agent plans for, mapped to a Qloo entity type. */
export interface Facet {
  id: string;
  label: string;
  /** Qloo filter.type to query for this facet. */
  filterType: EntityTypeUrn;
  /**
   * Qloo category tag that narrows a place query to this subtype (hotel/restaurant/...).
   * Place facets all share urn:entity:place, so the category tag is what distinguishes
   * them — exactly as it does against the live API. Null for non-place facets.
   */
  categoryTag: string | null;
  /** Whether this facet is location-bound (place-like) or taste-global (books, etc.). */
  located: boolean;
  /** One-line intent used in the agent-step log and the itinerary section header. */
  intent: string;
}

export const FACETS: Facet[] = [
  {
    id: "stay",
    label: "Where to stay",
    filterType: "urn:entity:place",
    categoryTag: "urn:tag:category:place:hotel",
    located: true,
    intent: "a place to stay whose character matches the texture of your taste",
  },
  {
    id: "eat",
    label: "Where to eat",
    filterType: "urn:entity:place",
    categoryTag: "urn:tag:category:place:restaurant",
    located: true,
    intent: "restaurants whose crowd and style line up with what you love",
  },
  {
    id: "drink",
    label: "Where to drink",
    filterType: "urn:entity:place",
    categoryTag: "urn:tag:category:place:bar",
    located: true,
    intent: "bars and cafes that feel like your kind of room",
  },
  {
    id: "browse",
    label: "What to read",
    filterType: "urn:entity:book",
    categoryTag: null,
    located: false,
    intent: "books to carry with you, drawn from your cross-domain taste",
  },
  {
    id: "do",
    label: "What to do",
    filterType: "urn:entity:place",
    categoryTag: "urn:tag:category:place:tourist_attraction",
    located: true,
    intent: "a daytime activity that fits the way you see things",
  },
];

export function facetById(id: string): Facet | undefined {
  return FACETS.find((f) => f.id === id);
}
