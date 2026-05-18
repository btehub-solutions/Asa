import type { Artwork } from "./types";

export const demoArtworks: Artwork[] = [
  {
    id: "demo-omi-tutu",
    title: "Omi Tutu",
    slug: "omi-tutu",
    artist_name: "Adunola Okafor",
    artist_image_url: null,
    artist_bio:
      "Adunola Okafor is a textile artist whose work studies memory, water, womanhood, and the quiet power of Yoruba domestic ritual.",
    artist_quote: "I use indigo as a language for remembering.",
    cultural_roots: "Yoruba, Abeokuta",
    artist_story: "Her practice draws from adire dye houses and family stories passed down through cloth.",
    nationality: "Nigerian",
    city_base: "Abeokuta, Nigeria",
    year_active: "2012 to present",
    image_url:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80",
    extra_image_urls: [],
    medium: "Adire on indigo-dyed cotton",
    year_created: "2024",
    dimensions: "120 x 100 cm",
    categories: ["Adire Artists", "Textile Artists", "Yoruba Cultural Artists"],
    price: 850,
    availability: "For Sale",
    cultural_significance:
      "The work references cool water as blessing, renewal, and the soft force of ancestral protection.",
    piece_story: "Made after the first rain of the season, the piece is a meditation on returning home.",
    yoruba_connection: "'Omi Tutu' means cool water in Yoruba.",
    tags: ["adire", "indigo", "Yoruba", "Abeokuta"],
    commission_rate: null,
    admin_notes: null,
    publication_status: "Published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-ile-ife-memory",
    title: "Ile-Ife Memory",
    slug: "ile-ife-memory",
    artist_name: "Tunde Balogun",
    artist_image_url: null,
    artist_bio:
      "Tunde Balogun works across bronze, clay, and recovered wood to examine kingship, migration, and sacred form.",
    artist_quote: "Tradition is not still. It keeps walking with us.",
    cultural_roots: "Ile-Ife, Osun State",
    artist_story: null,
    nationality: "Nigerian",
    city_base: "Lagos, Nigeria",
    year_active: "2009 to present",
    image_url:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80",
    extra_image_urls: [],
    medium: "Bronze and carved wood",
    year_created: "2023",
    dimensions: "58 x 32 x 24 cm",
    categories: ["Sculptors", "Traditional African Artists", "African Heritage Artists"],
    price: 2400,
    availability: "For Sale",
    cultural_significance:
      "This sculpture nods to classical Ife portraiture while making room for a contemporary, fractured silhouette.",
    piece_story: null,
    yoruba_connection: "Ile-Ife is regarded in Yoruba tradition as a sacred origin city.",
    tags: ["bronze", "Ile-Ife", "sculpture"],
    commission_rate: null,
    admin_notes: null,
    publication_status: "Published",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];
