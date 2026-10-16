# STATUS — Qloo Agentic (Wayfare)

Legend: `[ ]` todo · `[x]` done · `[!]` blocked · `[-]` cut
Tags: `must` · `should` · `cut-first` · `ship`

## Milestones
- [x] M0 (must) **/check the rules page** — done 2026-10-16 (PASS, see RULES.md changelog).
      Deadline Oct 31 04:45 WAT · $25k ($15k/$6k/$4k) · Nigeria eligible · live demo + public
      repo + OSI license required · Qloo integration mandatory & load-bearing · no video.
- [x] M1 (must) **Concept locked + scaffold + keyless skeleton.**
      Concept: **Wayfare** (taste-matched travel concierge agent). See STRATEGY.md / PLAN.md.
      - [x] Next.js 14 + TS + Tailwind app scaffolded; `next build` green.
      - [x] Qloo client behind an interface: live `HttpQlooClient` (X-Api-Key) + `MockQlooClient`
            + factory; API-faithful types (/search, /v2/insights).
      - [x] Agent planner (resolve → query per facet → rank → compose → justify), deterministic.
      - [x] UI: taste form, agent-steps view, itinerary with affinity badges + "why" chains;
            loading/empty/error states; mobile-friendly.
      - [x] Fixtures for 3 cities + generic fallback; app runs fully offline, zero keys.
      - [x] README, MIT LICENSE, Qloo-only .env.example, .gitignore.
      - [x] Verified: `npm test` 7/7 green · `npm run build` green · server serves / (200) and
            /api/plan returns a coherent plan (mock) · empty-seed request → 400.
- [!] M2 (must) **Live Qloo** — wire operator's `QLOO_API_KEY`, validate HttpQlooClient against
      the live hackathon API, reconcile real response fields, tune facet queries. **BLOCKED on key.**
- [ ] M3 (should) Demo polish + deploy (Vercel) + screenshots to submission/.
- [ ] SHIP (ship) Deploy, fill SUBMISSION.md, pre-flight — run `/ship`. (Operator submits.)

## Open questions — OPERATOR
- [ ] **Qloo API key** — needed to leave mock mode (M2). Set `QLOO_API_KEY` in `.env.local`.
- [ ] **Public hosting choice** — Vercel free tier recommended (one-click, keeps key server-side).
      Operator makes the production deploy and sets the repo public.

## Log
- 2026-10-06 accepted from @_HEISEMMA Oct roundup.
- 2026-10-16 /check PASS (deadline/prize/eligibility/requirements confirmed).
- 2026-10-16 M1 built: Wayfare scaffold + keyless agent skeleton; tests + build green.
