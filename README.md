# Wayfare

**An AI travel concierge agent that turns your taste into a taste-matched city trip —
powered end-to-end by [Qloo](https://qloo.com)'s cultural taste graph.**

You tell Wayfare a handful of things you love — bands, films, books, brands — and it
plans where to stay, eat, drink, read, and spend a day in a city. For **every** pick it
shows the cross-domain taste chain that justifies it ("Because you like Radiohead +
Murakami → this listening bar, affinity 0.89"). The itinerary is never generic: two
people with different taste get visibly different cities.

Built for the [Qloo Agentic Hackathon](https://qloo.devpost.com/).

---

## How Qloo is used (and why it's load-bearing)

Qloo is the engine, not a garnish. The agent makes no recommendation Qloo didn't rank.

| Agent step | Qloo call | What it supplies |
|---|---|---|
| **Resolve taste** | `GET /search` | Canonical `entity_id` for each band / film / book / brand you name |
| **Rank each facet** | `GET /v2/insights` | Affinity-ranked entities of a target type (`urn:entity:place`, `urn:entity:book`) conditioned on your seed entities via `signal.interests.entities`, narrowed by `filter.tags` (place category) and `filter.location` (the city) |
| **Justify each pick** | insights affinity + shared tags | The affinity score and the tag/seed overlap *are* the explanation shown in the UI |

Remove Qloo and there is no ranking, no cross-domain leap, and no justification — only a
city name and a list of words. The cross-domain correlation (your *music* taste implying
*restaurant* and *neighborhood* affinities) is something only Qloo's graph can do.

The agent itself is a deterministic multi-step loop (resolve → query per facet → rank →
compose → justify), so it runs with **zero keys** against local fixtures and swaps to the
live graph by setting a single environment variable.

## Architecture

```
app/
  page.tsx            UI container (form + agent steps + itinerary)
  api/plan/route.ts   POST /api/plan — runs the agent server-side (key stays server-side)
components/           TasteForm, AgentSteps, Itinerary
lib/
  qloo/
    types.ts          API-faithful request/response types + the QlooClient interface
    http-client.ts    live client (X-Api-Key, hackathon base URL)
    mock-client.ts    offline client backed by fixtures
    fixtures.ts       curated mock data (shapes match the live API exactly)
    client.ts         factory: live when QLOO_API_KEY is set, else mock
  agent/
    planner.ts        the agent: resolve → query → rank → compose → justify
    facets.ts         trip facets mapped to Qloo entity types + category tags
    cities.ts         destinations with baked lat/lon for filter.location
tests/
  planner.test.ts     end-to-end agent run against the mock
```

## Setup

Requires Node 18+.

```bash
npm install
npm run dev          # http://localhost:3000 — runs in MOCK mode, no keys needed
```

### Go live with Qloo

```bash
cp .env.example .env.local
# set QLOO_API_KEY=<your hackathon key>
npm run dev
```

With a key present the app calls the live Qloo API; the itinerary header switches from a
`mock data` badge to a `live Qloo` badge. Set `QLOO_USE_MOCK=1` to force fixtures even
with a key (handy for offline demos).

### Test & build

```bash
npm test             # agent runs end-to-end against the mock
npm run build        # production build
```

## Environment variables

See [`.env.example`](./.env.example). Only `QLOO_API_KEY` is needed to go live; the app
runs without it. Secrets live in `.env.local`, which is gitignored.

## License

[MIT](./LICENSE) © 2026 Joshua Willie.
