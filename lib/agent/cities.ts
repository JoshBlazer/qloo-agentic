// Fixed destination list for the MVP. Each city carries a geocodable text location so the
// agent can pass a real `filter.location.query` to Qloo (no geocoding SDK needed — Qloo
// resolves the text itself, which is the path its official harness uses). `id` keys the
// mock fixtures.

export interface City {
  id: string;
  name: string;
  country: string;
  /** Geocodable text, e.g. "Tokyo, Japan" — passed to Qloo as filter.location.query. */
  location: string;
  blurb: string;
}

export const CITIES: City[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    location: "Tokyo, Japan",
    blurb: "Dense, layered, and endlessly specific — rewards taste that runs deep.",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    location: "Lisbon, Portugal",
    blurb: "Faded-grand and sun-bleached, with a quietly experimental underside.",
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    location: "Mexico City, Mexico",
    blurb: "Maximalist, design-forward, and hungry at every hour.",
  },
];

export function findCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

export function cityByLocation(location: string): City | undefined {
  return CITIES.find((c) => c.location === location);
}
