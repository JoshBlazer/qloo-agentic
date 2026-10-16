import type { EntityTypeUrn, QlooEntity } from "@/lib/qloo/types";

/** A taste seed the user supplies (a thing they love). */
export interface TasteSeed {
  name: string;
  /** What kind of thing it is, so we resolve it against the right Qloo type. */
  kind: "artist" | "movie" | "book" | "brand";
}

export interface TripRequest {
  seeds: TasteSeed[];
  cityId: string;
  days: number;
}

/** A seed after resolution against the Qloo graph. */
export interface ResolvedSeed extends TasteSeed {
  entityId: string;
  resolved: boolean;
}

/** One recommendation, with the taste chain that justifies it. */
export interface Pick {
  facetId: string;
  facetLabel: string;
  name: string;
  entityId: string;
  affinity: number;
  description: string;
  address?: string;
  tags: string[];
  /** Human-readable justification tracing back to the user's seeds. */
  why: string;
}

/** A visible step in the agent's reasoning, streamed to the UI. */
export interface AgentStep {
  kind: "resolve" | "query" | "rank" | "compose";
  label: string;
  detail: string;
}

export interface DayPlan {
  day: number;
  eat?: Pick;
  drink?: Pick;
  do?: Pick;
}

export interface TripPlan {
  city: { id: string; name: string; country: string; blurb: string };
  mode: "live" | "mock";
  days: number;
  seeds: ResolvedSeed[];
  stay?: Pick;
  reads: Pick[];
  dayPlans: DayPlan[];
  steps: AgentStep[];
}

export const KIND_TO_TYPE: Record<TasteSeed["kind"], EntityTypeUrn> = {
  artist: "urn:entity:artist",
  movie: "urn:entity:movie",
  book: "urn:entity:book",
  brand: "urn:entity:brand",
};

export type { QlooEntity };
