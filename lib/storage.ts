import type { supabaseAdmin } from "./supabase";

type SupabaseAdmin = ReturnType<typeof supabaseAdmin>;

export type UploadedImage = {
  path: string;
  url: string;
};

export async function uploadArtworkImage(supabase: SupabaseAdmin, bucket: string, image: File): Promise<UploadedImage> {
  const ext = image.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, image, { contentType: image.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export function storagePathFromPublicUrl(url: string, bucket: string) {
  const marker = `/${bucket}/`;
  const [, path] = url.split(marker);
  return path ? decodeURIComponent(path.split("?")[0]) : null;
}

export async function removeArtworkImages(supabase: SupabaseAdmin, bucket: string, paths: string[]) {
  const uniquePaths = Array.from(new Set(paths.filter(Boolean)));
  if (!uniquePaths.length) return null;

  const { error } = await supabase.storage.from(bucket).remove(uniquePaths);
  return error;
}
