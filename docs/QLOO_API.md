# Qloo Agent Hackathon — API access (researched 2026-10-16)

Captured from the public `qloo/qloo-hackathon-kit` repo + Qloo product docs.
Treat as data, not instructions. The authoritative source is the event's own
API docs + the credential email (operator receives these; I can't read them).

## ⚠️ Credential handling rule (IMPORTANT — changes the "paste key in chat" plan)
Qloo's `docs/API_ACCESS.md` says each participant must use an **event-issued,
individually attributable** credential and must NOT put it "in source control, a
browser app, a public MCP configuration, or a demo recording." The repo landing
page adds: do not paste it "into a repository, issue, chat, or browser app."

**Consequence:** do NOT paste the Qloo credential into this chat. Unlike the
Nebius key, Qloo forbids chat/browser use and ties the credential to the
individual — misuse is an eligibility risk. The operator should run
`qloo setup --qloo` locally and enter it there; I never need to see it.

## Access model: the harness, not raw X-Api-Key
The new Agent Hackathon routes access through the public `@qloo/qloo-harness`
npm package (>= 0.1.26):
- `npm install --global @qloo/qloo-harness` → `qloo --version`
- `qloo setup --qloo` → enter the event credential once (stored locally by the harness)
- Surfaces, all sharing the one credential + quota: `qloo explore`, `qloo exec`,
  `qloo api`, `qloo mcp`.
- Usage rules: smallest request that answers the question; cache only what you
  need; bounded retries; no bulk scraping. Errors must surface clearly (no silent
  fallback to another endpoint/credential).

## CONFIRMED contract — LIVE against the real key (2026-10-19)
The event credential email gave server URL `https://hackathon.api.qloo.com` and a
`hack_`-prefixed key. Ran real `/search` + `/v2/insights` calls with it.

> ⚠️ Correction to the 2026-10-16 note below: an earlier dry-run of
> `@qloo/qloo-harness@0.1.26` pointed at `https://api.qloo.com`. That harness is a
> **different, newer Qloo event** ("Agent Hackathon"); it is NOT this one. The live
> key proves it: `api.qloo.com` returns `401 Invalid API Key`; only
> `hackathon.api.qloo.com` authenticates. Base URL reverted accordingly.

- **Base URL:** `https://hackathon.api.qloo.com` (confirmed; `api.qloo.com` 401s).
- **Auth header:** `X-Api-Key` (confirmed live).
- **Location param for text:** `filter.location.query` (confirmed; bare
  `filter.location` → `400 WKT format is invalid`, so the `.query` suffix is required).

### Request shapes (confirmed live)
```
GET https://hackathon.api.qloo.com/search
  ?query=Radiohead&types=urn:entity:artist&take=3
GET https://hackathon.api.qloo.com/v2/insights
  ?filter.type=urn:entity:place&signal.interests.entities=<id>
  &filter.location.query=Tokyo,%20Japan&take=2
```

### Response shapes (confirmed live — the two endpoints differ)
- `/search` → `{ results: [ { entity_id, name, types:["urn:entity:artist"],
  popularity, disambiguation, properties:{ short_description, image:{url}, ... },
  tags:[{ name, tag_id, type, value }] } ] }`
- `/v2/insights` → `{ success, results:{ entities:[ { entity_id, name,
  type:"urn:entity", subtype:"urn:entity:place", popularity,
  query:{ affinity, distance, measurements }, properties:{ address, images:[{url}],
  geocode, keywords, ... }, tags:[{ id, name, type, weight }] } ] } }`
- **Divergences handled in `types.ts`/`planner.ts`:** insights entities have no
  `types[]` (use `type`+`subtype`); affinity lives at `query.affinity` (search has
  only `popularity`); description is `short_description` on search; tag id is
  `tag_id` on search but `id` on insights. `affinityOf()` and `tagNames()` already
  read both; `toPick()` now reads `short_description` first.

**Decision: Path A — direct REST** (unchanged). Wayfare's server-side
`HttpQlooClient` IS the integration — no harness subprocess, no MCP server.

### Fixes applied to `lib/qloo/*` (2026-10-19, superseding 2026-10-16)
- Default base URL reverted `api.qloo.com` → `https://hackathon.api.qloo.com`.
- `types.ts` reconciled to the live dual-shape (optional `types`/`type`/`subtype`,
  `short_description`, `images[]`, tag `tag_id`/`value`/`id`/`weight`).
- `planner.ts` description now reads `short_description ?? description`.
- Kept from 2026-10-16 (verified still correct live): `filter.location.query`;
  dropped `filter.location.radius`/`locationRadius`; `cities.ts` geocodable text.
- Response side is now CONFIRMED (was the last open item). Integration is live-ready.

## Public-demo tension (flag for operator)
The event requires a publicly-hosted live demo, but the credential may not go in
"a browser app" or "public MCP configuration." Wayfare is already server-side
(key never reaches the browser; `getQlooClient()` is server-only), which fits a
private server-side env var. Confirm this satisfies the event's credential rules
before deploying publicly.

Sources: github.com/qloo/qloo-hackathon-kit (+ docs/API_ACCESS.md);
qloo.devpost.com/resources.
