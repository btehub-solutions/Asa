import { demoArtworks } from "./demo-data";
import { hasSupabaseConfig, supabaseAdmin, supabaseBrowser } from "./supabase";
import type { Artwork } from "./types";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PUBLIC_ARTWORK_COLUMNS = [
  "id",
  "title",
  "slug",
  "artist_name",
  "artist_image_url",
  "artist_bio",
  "artist_quote",
  "cultural_roots",
  "artist_story",
  "nationality",
  "city_base",
  "year_active",
  "image_url",
  "extra_image_urls",
  "medium",
  "year_created",
  "dimensions",
  "categories",
  "price",
  "availability",
  "cultural_significance",
  "piece_story",
  "yoruba_connection",
  "tags",
  "publication_status",
  "created_at",
  "updated_at"
].join(",");

function toPublicArtwork(artwork: Omit<Artwork, "commission_rate" | "admin_notes">): Artwork {
  return {
    ...artwork,
    commission_rate: null,
    admin_notes: null
  };
}

export async function listPublishedArtworks() {
  if (!hasSupabaseConfig()) return demoArtworks;

  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("artworks")
    .select(PUBLIC_ARTWORK_COLUMNS)
    .eq("publication_status", "Published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return demoArtworks;
  }

  return (data ?? []).map((artwork) => toPublicArtwork(artwork));
}

// Public-facing artwork fetch — only returns Published artworks
export async function getArtwork(idOrSlug: string) {
  if (!hasSupabaseConfig()) {
    return demoArtworks.find((art) => art.id === idOrSlug || art.slug === idOrSlug) ?? null;
  }

  try {
    const supabase = supabaseBrowser();
    const query = supabase
      .from("artworks")
      .select(PUBLIC_ARTWORK_COLUMNS);

    const { data, error } = await (uuidPattern.test(idOrSlug)
      ? query.eq("id", idOrSlug)
      : query.eq("slug", idOrSlug)
    ).maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data ? toPublicArtwork(data) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Admin-only artwork fetch — bypasses RLS, returns any status (Draft, Published, Archived)
export async function getArtworkAdmin(idOrSlug: string) {
  if (!hasSupabaseConfig()) {
    return demoArtworks.find((art) => art.id === idOrSlug || art.slug === idOrSlug) ?? null;
  }

  try {
    const supabase = supabaseAdmin();
    const query = supabase
      .from("artworks")
      .select("*");

    const { data, error } = await (uuidPattern.test(idOrSlug)
      ? query.eq("id", idOrSlug)
      : query.eq("slug", idOrSlug)
    ).maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
