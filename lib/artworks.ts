import { demoArtworks } from "./demo-data";
import { hasSupabaseConfig, supabaseAdmin, supabaseBrowser } from "./supabase";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function listPublishedArtworks() {
  if (!hasSupabaseConfig()) return demoArtworks;

  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("publication_status", "Published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return demoArtworks;
  }

  return data ?? [];
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
