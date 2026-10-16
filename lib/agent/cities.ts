// Fixed destination list for the MVP. Each city carries a lat/lon so the agent can pass
// a real `filter.location` to Qloo (no geocoding SDK needed). `id` keys the mock fixtures.

export interface City {
  id: string;
  name: string;
  country: string;
  /** "lat,lon" — passed straight to Qloo as filter.location. */
  location: string;
  blurb: string;
}

export const CITIES: City[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    location: "35.6762,139.6503",
    blurb: "Dense, layered, and endlessly specific — rewards taste that runs deep.",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    location: "38.7223,-9.1393",
    blurb: "Faded-grand and sun-bleached, with a quietly experimental underside.",
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    location: "19.4326,-99.1332",
    blurb: "Maximalist, design-forward, and hungry at every hour.",
  },
];

export function findCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

export function cityByLocation(location: string): City | undefined {
  return CITIES.find((c) => c.location === location);
}
