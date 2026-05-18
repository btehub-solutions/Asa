import { demoArtworks } from "./demo-data";
import { hasSupabaseConfig, supabaseAdmin, supabaseBrowser } from "./supabase";

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

export async function getArtwork(idOrSlug: string) {
  if (!hasSupabaseConfig()) {
    return demoArtworks.find((art) => art.id === idOrSlug || art.slug === idOrSlug) ?? null;
  }

  // Use admin client so draft artworks are accessible for admin previews
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
