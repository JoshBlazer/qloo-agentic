import type {
  QlooClient,
  QlooEntity,
  QlooInsightsResponse,
  QlooSearchResponse,
  SearchParams,
  InsightsParams,
} from "./types";

/**
 * Live Qloo client. Talks to the real API over HTTPS with the operator's key.
 *
 * Base URL defaults to the hackathon host; override with QLOO_API_URL for production
 * (`https://api.qloo.com`). The key is read server-side only — this module must never
 * be imported into a client component.
 */
export class HttpQlooClient implements QlooClient {
  readonly mode = "live" as const;

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = "https://hackathon.api.qloo.com",
  ) {
    if (!apiKey) throw new Error("HttpQlooClient requires a Qloo API key.");
  }

  private async get<T>(path: string, params: Record<string, string>): Promise<T> {
    const url = new URL(path, this.baseUrl);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
    const res = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": this.apiKey, Accept: "application/json" },
      // Qloo data is stable within a session; cache briefly at the edge.
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Qloo ${path} ${res.status}: ${body.slice(0, 300)}`);
    }
    return (await res.json()) as T;
  }

  async search(params: SearchParams): Promise<QlooEntity[]> {
    const q: Record<string, string> = { query: params.query };
    if (params.types?.length) q.types = params.types.join(",");
    if (params.take) q.take = String(params.take);
    const data = await this.get<QlooSearchResponse>("/search", q);
    return data.results ?? [];
  }

  async insights(params: InsightsParams): Promise<QlooEntity[]> {
    const q: Record<string, string> = { "filter.type": params.filterType };
    if (params.signalEntities?.length)
      q["signal.interests.entities"] = params.signalEntities.join(",");
    if (params.signalTags?.length)
      q["signal.interests.tags"] = params.signalTags.join(",");
    if (params.filterTags?.length) q["filter.tags"] = params.filterTags.join(",");
    if (params.location) q["filter.location"] = params.location;
    if (params.locationRadius) q["filter.location.radius"] = String(params.locationRadius);
    if (params.take) q.take = String(params.take);
    if (params.demographics?.age) q["signal.demographics.age"] = params.demographics.age;
    if (params.demographics?.gender)
      q["signal.demographics.gender"] = params.demographics.gender;
    const data = await this.get<QlooInsightsResponse>("/v2/insights", q);
    return data.results?.entities ?? [];
  }
}
