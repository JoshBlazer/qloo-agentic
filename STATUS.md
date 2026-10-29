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
- [x] M2 (must) **Live Qloo** — request AND response contract now CONFIRMED LIVE against the
      event key (2026-10-19). Base URL corrected to `https://hackathon.api.qloo.com` (the earlier
      `api.qloo.com` was from a different Qloo event's harness and 401s this key); auth `X-Api-Key`;
      location `filter.location.query`. Reconciled real response shapes in types.ts/planner.ts
      (insights uses `type`+`subtype`, affinity at `query.affinity`, tags differ per endpoint,
      description via `short_description`). See docs/QLOO_API.md. Code is live-ready; operator just
      sets `QLOO_API_KEY` in `.env.local` to flip the running app off mock.
- [x] M3 (should) **Deployed to Vercel** — https://qloo-agentic.vercel.app (Next.js preset,
      QLOO_API_KEY server-side). Live Qloo flow verified end-to-end 2026-10-29 ("live Qloo"
      badge, 3/3 seeds, real affinity-ranked Tokyo itinerary). Screenshot in submission/screenshots/.
- [~] SHIP (ship) Live demo up + SUBMISSION.md filled. Remaining (operator): make repo PUBLIC,
      then submit on Devpost before 2026-10-31 03:45Z.

## Open questions — OPERATOR
- [~] **Qloo API key** — RECEIVED (hackathon email, hostname `hackathon.api.qloo.com`). Validated
      live; integration confirmed (M2 done). To run the app live: `cp .env.example .env.local`,
      add `QLOO_API_KEY=<your key>`, `npm run dev`. NOTE: the key was pasted into chat despite
      Qloo's attributable-credential rule — consider regenerating it in the Qloo portal after the
      event. Keep it out of source control / the browser bundle (it stays server-side already).
- [ ] **Public hosting choice** — Vercel free tier recommended (one-click, keeps key server-side).
      Operator makes the production deploy and sets the repo public.

## Log
- 2026-10-06 accepted from @_HEISEMMA Oct roundup.
- 2026-10-16 /check PASS (deadline/prize/eligibility/requirements confirmed).
- 2026-10-16 M1 built: Wayfare scaffold + keyless agent skeleton; tests + build green.
- 2026-10-16 M2 request-contract verified via official harness dry-run; fixed base URL,
  filter.location.query, dropped radius; docs/QLOO_API.md captured. Tests 7/7, build green.
- 2026-10-19 M2 DONE — live-validated against event key. Corrected base URL back to
  hackathon.api.qloo.com (api.qloo.com 401s this key; the dry-run was a different event).
  Reconciled live response shapes (type/subtype, query.affinity, tag_id vs id, short_description).
  Tests 7/7, build green. Key received but came through chat — flagged for post-event rotation.
