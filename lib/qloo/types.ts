// Types mirror the public Qloo API shapes (docs.qloo.com).
// Kept deliberately close to the wire format so the HTTP client needs no translation
// layer once the live key is wired in.

/** Supported `filter.type` entity URNs we query. (Qloo supports more.) */
export type EntityTypeUrn =
  | "urn:entity:artist"
  | "urn:entity:book"
  | "urn:entity:brand"
  | "urn:entity:movie"
  | "urn:entity:person"
  | "urn:entity:place"
  | "urn:entity:podcast"
  | "urn:entity:tv_show"
  | "urn:entity:videogame";

/** A Qloo entity as returned by /search and /v2/insights. */
export interface QlooEntity {
  entity_id: string;
  name: string;
  types: string[];
  /** Free-form on the wire; we read a few known keys defensively. */
  properties?: {
    description?: string;
    image?: { url?: string };
    address?: string;
    [key: string]: unknown;
  };
  /** 0..1 global popularity, present on most entities. */
  popularity?: number;
  /** Present on /v2/insights results: per-query measures incl. affinity. */
  query?: {
    affinity?: number;
    [key: string]: unknown;
  };
  /** Tags attached to the entity (genres, keywords). */
  tags?: Array<{ id?: string; name?: string; type?: string }>;
}

/** GET /search response. */
export interface QlooSearchResponse {
  results: QlooEntity[];
}

/** GET /v2/insights response. */
export interface QlooInsightsResponse {
  success: boolean;
  results: {
    entities: QlooEntity[];
  };
  duration?: number;
}

/** Parameters for GET /v2/insights (subset we use). */
export interface InsightsParams {
  /** Required. Entity type to return. */
  filterType: EntityTypeUrn;
  /** Seed entity IDs the recommendation is conditioned on. */
  signalEntities?: string[];
  /** Seed tag IDs (e.g. urn:tag:genre:media:horror). */
  signalTags?: string[];
  /** Hard filter tags, e.g. a place category urn:tag:category:place:restaurant. */
  filterTags?: string[];
  /** Lat/lon "40.74,-74.00", a WKT POINT, a locality name via query, or a Qloo ID. */
  location?: string;
  /** Search radius in meters (default Qloo 15000, max 800000). */
  locationRadius?: number;
  /** Page size, Qloo default 20, max 50. */
  take?: number;
  demographics?: {
    age?: string; // e.g. "36_to_55"
    gender?: "male" | "female";
  };
}

export interface SearchParams {
  query: string;
  /** Narrow to one or more entity types. */
  types?: EntityTypeUrn[];
  take?: number;
}

/** The single seam the rest of the app depends on. */
export interface QlooClient {
  search(params: SearchParams): Promise<QlooEntity[]>;
  insights(params: InsightsParams): Promise<QlooEntity[]>;
  /** Which backend answered — surfaced in the UI so a mock run is never mistaken for live. */
  readonly mode: "live" | "mock";
}
