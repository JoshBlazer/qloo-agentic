import type { QlooClient } from "./types";
import { HttpQlooClient } from "./http-client";
import { MockQlooClient } from "./mock-client";

export type { QlooClient } from "./types";

/**
 * Picks the Qloo backend. The live client is used only when a key is present and the
 * mock isn't explicitly forced; otherwise the app falls back to fixtures so it runs with
 * zero configuration. Server-only — never import into a client component.
 */
export function getQlooClient(): QlooClient {
  const key = process.env.QLOO_API_KEY;
  const forceMock = process.env.QLOO_USE_MOCK === "1";
  if (key && !forceMock) {
    return new HttpQlooClient(key, process.env.QLOO_API_URL || undefined);
  }
  return new MockQlooClient();
}
