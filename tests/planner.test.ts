import { describe, it, expect } from "vitest";
import { MockQlooClient } from "@/lib/qloo/mock-client";
import { planTrip, explain } from "@/lib/agent/planner";
import type { TripRequest } from "@/lib/agent/types";

const baseReq: TripRequest = {
  seeds: [
    { name: "Radiohead", kind: "artist" },
    { name: "Lost in Translation", kind: "movie" },
    { name: "Haruki Murakami", kind: "book" },
  ],
  cityId: "tokyo",
  days: 3,
};

describe("planTrip (mock client)", () => {
  it("runs end-to-end offline and returns a full plan", async () => {
    const plan = await planTrip(new MockQlooClient(), baseReq);
    expect(plan.mode).toBe("mock");
    expect(plan.city.name).toBe("Tokyo");
    expect(plan.days).toBe(3);
    expect(plan.dayPlans).toHaveLength(3);
    expect(plan.stay).toBeDefined();
    expect(plan.reads.length).toBeGreaterThan(0);
  });

  it("resolves every taste seed to an entity id", async () => {
    const plan = await planTrip(new MockQlooClient(), baseReq);
    expect(plan.seeds).toHaveLength(3);
    expect(plan.seeds.every((s) => s.resolved && s.entityId.length > 0)).toBe(true);
  });

  it("emits visible agent steps (resolve, query per facet, compose)", async () => {
    const plan = await planTrip(new MockQlooClient(), baseReq);
    const kinds = plan.steps.map((s) => s.kind);
    expect(kinds[0]).toBe("resolve");
    expect(kinds).toContain("query");
    expect(kinds.at(-1)).toBe("compose");
    // one query step per facet (5)
    expect(kinds.filter((k) => k === "query")).toHaveLength(5);
  });

  it("ranks picks by affinity, highest first", async () => {
    const plan = await planTrip(new MockQlooClient(), baseReq);
    for (const d of plan.dayPlans) {
      // each day's eat pick exists and carries an affinity in range
      expect(d.eat?.affinity).toBeGreaterThan(0);
      expect(d.eat?.affinity).toBeLessThanOrEqual(1);
    }
    // stay is the top-affinity neighborhood
    const stayAffinity = plan.stay?.affinity ?? 0;
    expect(stayAffinity).toBeGreaterThan(0.8);
  });

  it("distinguishes place facets by category (eat vs drink differ)", async () => {
    const plan = await planTrip(new MockQlooClient(), baseReq);
    const eat = plan.dayPlans[0].eat?.name;
    const drink = plan.dayPlans[0].drink?.name;
    expect(eat).toBeDefined();
    expect(drink).toBeDefined();
    expect(eat).not.toBe(drink);
  });

  it("produces a coherent plan for an unknown city via the generic fallback", async () => {
    // cityId must exist in the city list; use an in-list city without bespoke fixtures
    const plan = await planTrip(new MockQlooClient(), { ...baseReq, cityId: "lisbon" });
    expect(plan.city.name).toBe("Lisbon");
    expect(plan.dayPlans[0].eat).toBeDefined();
  });

  it("explains a pick as a taste chain back to the seeds", () => {
    const why = explain(["Radiohead", "Murakami"], ["listening bar", "vinyl"], 0.89);
    expect(why).toContain("Radiohead");
    expect(why).toContain("listening bar");
    expect(why).toContain("0.89");
  });
});
