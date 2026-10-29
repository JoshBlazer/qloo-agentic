# SUBMISSION — Wayfare (Qloo Agentic)

Copy each field into the Devpost form. **You** click submit, then run `/submitted`.

Submission page: https://qloo.devpost.com/

## Fields

**Project name:** Wayfare

**Tagline:** A taste-matched travel concierge agent — it turns the things you love into a city itinerary, powered by Qloo's cultural-intelligence graph.

**Description / Story:**
Most travel tools ask where you're going. Wayfare asks what you *love* — your favorite
artists, films, shows, cuisines — and plans a trip around your taste.

You give Wayfare a few seed interests and a destination. An autonomous agent then:
1. **Resolves** each seed to a real entity in Qloo's graph (`/search`).
2. **Queries taste affinities** facet by facet — places to eat, see, stay, and read —
   conditioning each recommendation on your seeds and the city (`/v2/insights` with
   `signal.interests.entities` + `filter.location.query`).
3. **Ranks** every candidate by Qloo affinity, **composes** a day-by-day itinerary, and
   **justifies** each pick with a "why" chain back to the seeds that earned it.

Every recommendation carries a Qloo affinity badge and an explanation, so the plan is
legible, not a black box. The agent's reasoning steps are shown live in the UI.

**How Qloo is load-bearing:** Qloo *is* the recommendation engine. Without it there are no
entities, no affinities, no cross-domain taste links — the itinerary cannot be built. We use
Qloo `/search` to resolve seeds and `/v2/insights` to generate every ranked suggestion. The
integration is live and server-side (the key never reaches the browser).

**Built with:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Qloo Taste AI™ API
(`/search` + `/v2/insights`), Node server routes, Vitest.

**Tracks:** Main (agentic Qloo application) + applicable bounties.

**Repo URL:** https://github.com/JoshBlazer/qloo-agentic  *(must be PUBLIC before submit — MIT licensed)*

**Demo URL:** https://qloo-agentic.vercel.app  *(live; Qloo end-to-end verified 2026-10-29 — "live Qloo" badge, 3/3 seeds resolved, real affinity-ranked Tokyo itinerary)*

**Team:** Solo (Joshua Willie)

**AI disclosure:** Not required by the rules (ai_policy: allowed). Standard build-assistant use.

## Assets
- Screenshots: `submission/screenshots/`  *(capture from the live deploy: form → agent steps → itinerary with affinity badges + why-chains; incl. 390px mobile)*
- Video: not required.

## Pre-flight (against RULES.md)
- [x] Qloo integration mandatory & load-bearing — YES, `/search` + `/v2/insights`, live-validated 2026-10-19.
- [x] `npm test` green (7/7) · `npm run build` green.
- [x] **Externally-hosted live demo** — https://qloo-agentic.vercel.app (Vercel, Next.js preset, `QLOO_API_KEY` server-side; live Qloo flow verified 2026-10-29).
- [x] Demo URL recorded above.
- [ ] **Public repo + OSI license** — make github.com/JoshBlazer/qloo-agentic public (MIT present). *(operator)*
- [ ] Submit on Devpost before 2026-10-31 03:45Z (04:45 WAT). *(operator)*
