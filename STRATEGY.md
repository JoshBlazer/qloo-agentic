# STRATEGY — Wayfare (Qloo Agentic)

## The concept (locked 2026-10-16)
**Wayfare** is an AI travel concierge agent that turns your *taste* — a handful of
bands, films, books, and brands you love — into a taste-matched city trip. You never
type "restaurants near me." You tell it what you love, and the agent plans where to
stay, eat, drink, browse, and spend a day — and for **every** pick it shows the
cross-domain taste chain that justifies it ("Because you like Radiohead + Murakami →
this listening bar in Shimokitazawa, affinity 0.89").

The hero is not the itinerary. The hero is **explainable cross-domain taste reasoning**:
music/film/book taste → places, venues, and brands in a city you've never been to.

## Why it wins

1. **It showcases the one thing only Qloo can do.** Qloo's taste graph correlates
   affinities *across* domains (what your music taste implies about restaurants,
   neighborhoods, and shops). A generic LLM or a TripAdvisor scrape cannot produce a
   defensible affinity score linking "you like A24 films" to "this specific wine bar."
   Wayfare makes that leap the entire product.

2. **It is unmistakably an agent, not a form.** The planner runs a real multi-step
   loop: resolve fuzzy taste seeds to graph entities → query the graph per facet
   (stay / eat / drink / browse / do) under the destination's location filter →
   rank by affinity → compose a day-by-day plan → emit a justification per pick.
   Each step is visible in the UI as the agent "thinks."

3. **The personalization is legible, which is the judging bar.** The brief asks for
   "genuinely personalized decisions." Wayfare doesn't just personalize — it *proves*
   personalization by surfacing the affinity score and the seed entities behind every
   recommendation. Two users with different taste get visibly different cities.

4. **It demos in 10 seconds and hosts in one click.** Type three things you love, pick
   a city, watch the agent build a trip. Single Next.js app → Vercel free tier, Qloo
   key stays server-side. No video required; the live demo carries itself.

## How Qloo is load-bearing (remove it and the product dies)

| Agent step | Qloo endpoint | What it supplies |
|---|---|---|
| Resolve taste seeds to entities | `GET /search` | Canonical `entity_id` for each band/film/book/brand the user names |
| Rank picks per facet in the city | `GET /v2/insights` | Affinity-ranked entities of a target `filter.type` (`urn:entity:place`, `urn:entity:book`, etc.) conditioned on the user's seed entities as `signal.interests.entities` + `filter.location` |
| Justify each pick | insights affinity + shared tags | The score and the tag/seed overlap that *is* the explanation |

Strip Qloo out and there is no ranking, no cross-domain leap, and no justification —
only a city name and a list of words. Qloo is the engine, not a garnish.

## Scope discipline
Deterministic agent core (rules + Qloo), so the demo runs end-to-end with **zero keys**
against a local mock and swaps to live by setting one env var. An optional LLM narration
layer is strictly cosmetic and off by default — it never makes a recommendation, so the
entry can never be dismissed as "an LLM with a Qloo logo."
