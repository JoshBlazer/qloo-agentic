# PLAN — Wayfare

Source of truth for scope. Don't build anything not listed here without operator sign-off.

## Stack
- **Next.js 14 (App Router) + TypeScript** — one app, one deploy (Vercel free tier).
- **Tailwind CSS** — fast, consistent UI.
- **Server route `/api/plan`** — runs the agent server-side so the Qloo key never
  reaches the browser.
- **Vitest** — unit tests for the agent against the mock Qloo client.
- **Qloo** behind a `QlooClient` interface with two implementations: `HttpQlooClient`
  (live, `X-Api-Key`) and `MockQlooClient` (fixtures). A factory picks the mock when
  `QLOO_API_KEY` is absent or `QLOO_USE_MOCK=1`, so the app runs fully offline.

## MVP scope (BUILD)
1. **Qloo client layer** — `search`, `insights`, typed to the real API shape. Live +
   mock + factory. All network isolated here.
2. **Fixtures** — realistic mock responses for 2 seeded example trips (Tokyo, Lisbon)
   plus a generic fallback, so any input returns a coherent plan offline.
3. **Agent planner** — multi-step orchestration:
   resolve seeds → per-facet insights queries → affinity ranking → itinerary
   composition → per-pick justification. Emits an ordered list of agent "steps" for the
   UI. Deterministic; no LLM required.
4. **Facet config** — the 5 facets (Stay / Eat / Drink / Browse / Do) mapped to Qloo
   `filter.type` URNs and day-plan slots.
5. **UI** — taste-seed + city form; agent-steps "thinking" view; itinerary cards with
   affinity badges and "why this" chains; empty/loading/error states; 390px mobile.
6. **Docs + hygiene** — README (what/setup/how-Qloo-is-used), `.env.example` (Qloo
   names only), MIT LICENSE, `.gitignore`.

## Build vs cut
| Item | Decision |
|---|---|
| Deterministic agent core over Qloo | **BUILD** (load-bearing, keyless demo) |
| Agent-steps visibility in UI | **BUILD** (sells the "agent" framing) |
| Per-pick affinity + justification | **BUILD** (sells "genuine personalization") |
| 2 rich fixture cities + fallback | **BUILD** |
| LLM narration layer | **CUT for MVP** (stub seam only; off by default) |
| User accounts / saved trips | **CUT** |
| Real maps / geocoding SDK | **CUT** (city picker from a fixed list; lat/lon baked) |
| Multi-city / date-aware availability | **CUT** |
| Mobile app / PWA | **CUT** |

## Milestones
- **M1 — Concept + scaffold (this milestone):** STRATEGY/PLAN, Next.js scaffold,
  Qloo client interface + mock + fixtures, agent planner, runnable UI against the mock,
  README/LICENSE/.env.example, tests green, `next build` green. **← target now.**
- **M2 — Live Qloo:** operator supplies `QLOO_API_KEY`; validate `HttpQlooClient`
  against the live hackathon API; reconcile real response fields with the typed shape;
  tune facet queries. *(Blocked on key.)*
- **M3 — Demo polish + deploy:** copy pass, hero example, deploy to Vercel, capture
  screenshots to `submission/`. *(Deploy is the operator's call.)*
- **SHIP:** fill `SUBMISSION.md`, pre-flight against `RULES.md`, operator submits.

## Definition of done for M1
`npm install && npm test` passes and `npm run build` succeeds; `npm run dev` serves a
working trip plan from the mock with no keys set; README explains how Qloo is used and
what the operator must supply to go live.
