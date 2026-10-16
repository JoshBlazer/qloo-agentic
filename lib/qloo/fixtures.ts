import type { QlooEntity } from "./types";

// Offline fixtures so the whole app runs with zero keys. The shapes match the live API
// exactly (entity_id, query.affinity, tags, properties) so the mock and live paths are
// interchangeable. Content is hand-curated per city/facet to make demos coherent.

function place(
  id: string,
  name: string,
  affinity: number,
  description: string,
  address: string,
  tagNames: string[],
): QlooEntity {
  return {
    entity_id: id,
    name,
    types: ["urn:entity:place"],
    properties: { description, address },
    popularity: Math.min(0.99, affinity + 0.03),
    query: { affinity },
    tags: tagNames.map((t) => ({ name: t, type: "urn:tag:genre" })),
  };
}

function book(
  id: string,
  name: string,
  affinity: number,
  description: string,
  tagNames: string[],
): QlooEntity {
  return {
    entity_id: id,
    name,
    types: ["urn:entity:book"],
    properties: { description },
    popularity: Math.min(0.99, affinity + 0.02),
    query: { affinity },
    tags: tagNames.map((t) => ({ name: t, type: "urn:tag:genre" })),
  };
}

// Books are taste-global (not location-bound), shared across destinations.
const BOOKS: QlooEntity[] = [
  book("bk_wind_up_bird", "The Wind-Up Bird Chronicle", 0.91, "Murakami's spiraling, surreal Tokyo epic.", ["literary fiction", "surreal", "japan"]),
  book("bk_severance", "Severance", 0.86, "A deadpan, melancholy office apocalypse.", ["literary fiction", "satire", "dystopia"]),
  book("bk_flights", "Flights", 0.83, "Olga Tokarczuk's fragmentary meditation on travel.", ["literary fiction", "travel", "essay"]),
  book("bk_invisible_cities", "Invisible Cities", 0.8, "Calvino's imagined cities as prose poems.", ["literary fiction", "surreal", "cities"]),
];

type FacetMap = Record<string, QlooEntity[]>;

const TOKYO: FacetMap = {
  stay: [
    place("pl_tk_shimokita", "Shimokitazawa", 0.9, "Low-rise, record-shop-dense, vintage-heavy neighborhood.", "Setagaya, Tokyo", ["indie", "vintage", "music"]),
    place("pl_tk_yanaka", "Yanaka", 0.84, "Old-town lanes, galleries, slow mornings.", "Taito, Tokyo", ["artisan", "quiet", "historic"]),
    place("pl_tk_nakameguro", "Nakameguro", 0.81, "Canal-side, design-forward, coffee-serious.", "Meguro, Tokyo", ["design", "coffee", "riverside"]),
  ],
  eat: [
    place("pl_tk_den", "Den", 0.92, "Playful, warm kaiseki that breaks the rules.", "Jingumae, Tokyo", ["kaiseki", "inventive", "warm"]),
    place("pl_tk_afuri", "Afuri", 0.85, "Yuzu-bright ramen in a minimalist room.", "Ebisu, Tokyo", ["ramen", "minimalist", "citrus"]),
    place("pl_tk_bear", "Bear Pond Espresso", 0.82, "Obsessive single-origin espresso, Shimokita.", "Kitazawa, Tokyo", ["coffee", "obsessive", "indie"]),
  ],
  drink: [
    place("pl_tk_trunk", "Trunk (Hotel) Bar", 0.88, "Design-hotel bar, local spirits, good records.", "Jingumae, Tokyo", ["cocktails", "design", "vinyl"]),
    place("pl_tk_jbs", "JBS (Jazz Blues Soul)", 0.86, "A listening bar built around one man's vinyl.", "Dogenzaka, Tokyo", ["listening bar", "vinyl", "jazz"]),
    place("pl_tk_fuglen", "Fuglen Tokyo", 0.8, "Oslo coffee by day, cocktails by night.", "Tomigaya, Tokyo", ["coffee", "cocktails", "nordic"]),
  ],
  do: [
    place("pl_tk_teamlab", "teamLab Planets", 0.87, "Immersive light-and-water digital art.", "Toyosu, Tokyo", ["digital art", "immersive", "design"]),
    place("pl_tk_disk", "Disk Union Shinjuku", 0.85, "Floors of records for the obsessive.", "Shinjuku, Tokyo", ["records", "music", "crate-digging"]),
    place("pl_tk_nezu", "Nezu Museum", 0.79, "Antiquities and a famously calm garden.", "Minami-Aoyama, Tokyo", ["art", "garden", "quiet"]),
  ],
  browse: BOOKS,
};

const LISBON: FacetMap = {
  stay: [
    place("pl_lx_principe", "Príncipe Real", 0.89, "Leafy, design-shop-dense, quietly stylish.", "Príncipe Real, Lisbon", ["design", "leafy", "stylish"]),
    place("pl_lx_alfama", "Alfama", 0.83, "Oldest quarter: fado, tiled stairs, river light.", "Alfama, Lisbon", ["historic", "fado", "atmospheric"]),
    place("pl_lx_marvila", "Marvila", 0.8, "Warehouses turned breweries and galleries.", "Marvila, Lisbon", ["industrial", "art", "emerging"]),
  ],
  eat: [
    place("pl_lx_prado", "Prado", 0.9, "Natural wine and farm-driven plates in a bright room.", "Baixa, Lisbon", ["natural wine", "seasonal", "bright"]),
    place("pl_lx_time_out", "Time Out Market", 0.82, "Curated food hall of the city's best stalls.", "Cais do Sodré, Lisbon", ["food hall", "varied", "lively"]),
    place("pl_lx_fabrica", "Fábrica Coffee Roasters", 0.79, "Serious third-wave coffee downtown.", "Baixa, Lisbon", ["coffee", "third-wave", "indie"]),
  ],
  drink: [
    place("pl_lx_pensao", "Pensão Amor", 0.86, "Bordello-turned-bar, velvet and books.", "Cais do Sodré, Lisbon", ["cocktails", "eclectic", "literary"]),
    place("pl_lx_park", "Park", 0.85, "Rooftop bar on a car-park deck, sunset crowd.", "Bairro Alto, Lisbon", ["rooftop", "sunset", "views"]),
    place("pl_lx_copenhagen", "Copenhagen Coffee Lab", 0.78, "Nordic-minimal cafe with good pastries.", "Príncipe Real, Lisbon", ["coffee", "nordic", "minimal"]),
  ],
  do: [
    place("pl_lx_gulbenkian", "Calouste Gulbenkian Museum", 0.88, "A jewel-box collection in a modernist garden.", "Avenidas Novas, Lisbon", ["art", "garden", "modernist"]),
    place("pl_lx_lx_factory", "LX Factory", 0.84, "Industrial complex of bookshops and studios.", "Alcântara, Lisbon", ["design", "bookshop", "creative"]),
    place("pl_lx_ler_devagar", "Ler Devagar", 0.82, "Cathedral-scale bookshop in LX Factory.", "Alcântara, Lisbon", ["bookshop", "architecture", "literary"]),
  ],
  browse: BOOKS,
};

const MEXICO_CITY: FacetMap = {
  stay: [
    place("pl_mx_roma", "Roma Norte", 0.9, "Art-nouveau, cafe-dense, gallery-rich.", "Cuauhtémoc, CDMX", ["design", "cafes", "art"]),
    place("pl_mx_condesa", "Condesa", 0.85, "Leafy deco streets and long dinners.", "Cuauhtémoc, CDMX", ["deco", "leafy", "dining"]),
    place("pl_mx_juarez", "Juárez", 0.8, "Fast-changing, design-forward, central.", "Cuauhtémoc, CDMX", ["emerging", "design", "central"]),
  ],
  eat: [
    place("pl_mx_contramar", "Contramar", 0.91, "The long-lunch seafood institution.", "Roma Norte, CDMX", ["seafood", "lively", "institution"]),
    place("pl_mx_rosetta", "Rosetta", 0.87, "Italian-Mexican in a townhouse, candlelit.", "Roma Norte, CDMX", ["italian", "romantic", "seasonal"]),
    place("pl_mx_panaderia", "Panadería Rosetta", 0.82, "Pastries and coffee, perpetual queue.", "Roma Norte, CDMX", ["bakery", "coffee", "beloved"]),
  ],
  drink: [
    place("pl_mx_licoreria", "Licorería Limantour", 0.88, "World-list cocktail bar, home-city classic.", "Roma Norte, CDMX", ["cocktails", "acclaimed", "lively"]),
    place("pl_mx_baltra", "Baltra Bar", 0.84, "Tiny, Galápagos-themed, inventive drinks.", "Condesa, CDMX", ["cocktails", "intimate", "inventive"]),
    place("pl_mx_cafe_nin", "Café Nin", 0.78, "All-day cafe from the Rosetta team.", "Juárez, CDMX", ["coffee", "all-day", "design"]),
  ],
  do: [
    place("pl_mx_tamayo", "Museo Tamayo", 0.87, "Contemporary art in a brutalist landmark.", "Bosque de Chapultepec, CDMX", ["contemporary art", "brutalist", "design"]),
    place("pl_mx_casa_luis", "Casa Luis Barragán", 0.86, "The architect's color-saturated house.", "Miguel Hidalgo, CDMX", ["architecture", "color", "modernist"]),
    place("pl_mx_lago", "Bosque de Chapultepec", 0.77, "Vast city park, lake, museums.", "Miguel Hidalgo, CDMX", ["park", "lake", "outdoors"]),
  ],
  browse: BOOKS,
};

export const INSIGHTS_FIXTURES: Record<string, FacetMap> = {
  tokyo: TOKYO,
  lisbon: LISBON,
  "mexico-city": MEXICO_CITY,
};

// Generic fallback for any city not in the fixture set, so unknown input still works.
export const GENERIC_FACETS: FacetMap = {
  stay: [
    place("pl_gen_stay1", "The design district", 0.82, "A walkable, creative quarter.", "City center", ["design", "walkable"]),
    place("pl_gen_stay2", "The old town", 0.76, "Historic streets and slow mornings.", "Old town", ["historic", "quiet"]),
  ],
  eat: [
    place("pl_gen_eat1", "A seasonal bistro", 0.81, "Market-driven, unfussy, warm.", "City center", ["seasonal", "bistro"]),
    place("pl_gen_eat2", "A specialty coffee bar", 0.75, "Single-origin, careful brewing.", "City center", ["coffee", "indie"]),
  ],
  drink: [
    place("pl_gen_drink1", "A listening bar", 0.8, "Low light, good records, real cocktails.", "City center", ["listening bar", "vinyl"]),
    place("pl_gen_drink2", "A rooftop at sunset", 0.74, "Views and an easy crowd.", "City center", ["rooftop", "views"]),
  ],
  do: [
    place("pl_gen_do1", "The contemporary art museum", 0.8, "The city's most forward collection.", "City center", ["art", "contemporary"]),
    place("pl_gen_do2", "An independent bookshop", 0.73, "Curated shelves worth an hour.", "City center", ["bookshop", "literary"]),
  ],
  browse: BOOKS,
};

/** Deterministic fake entity id for a searched taste seed (stable per name). */
export function seedEntityId(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `seed_${h.toString(16)}`;
}
