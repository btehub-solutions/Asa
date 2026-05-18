import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { AVAILABILITY, PUBLICATION_STATUS } from "@/lib/categories";
import type { Artwork } from "@/lib/types";

async function verifyAdmin() {
  const cookieToken = (await cookies()).get("asa_admin")?.value;
  return Boolean(process.env.ADMIN_UPLOAD_TOKEN && cookieToken === process.env.ADMIN_UPLOAD_TOKEN);
}

const patchSchema = z.object({
  availability: z.enum(AVAILABILITY).optional(),
  publication_status: z.enum(PUBLICATION_STATUS).optional(),
  price: z.coerce.number().nullable().optional(),
  title: z.string().min(1).optional(),
  artist_name: z.string().min(1).optional(),
  medium: z.string().optional(),
  year_created: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  cultural_roots: z.string().nullable().optional(),
  artist_bio: z.string().nullable().optional(),
  artist_story: z.string().nullable().optional(),
  artist_quote: z.string().nullable().optional(),
  cultural_significance: z.string().nullable().optional(),
  piece_story: z.string().nullable().optional(),
  yoruba_connection: z.string().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  commission_rate: z.coerce.number().nullable().optional(),
  nationality: z.string().nullable().optional(),
  city_base: z.string().nullable().optional(),
  year_active: z.string().nullable().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", details: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const updatePayload: Partial<Artwork> = {
    ...parsed.data,
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabase
    .from("artworks")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not update artwork." }, { status: 500 });
  }

  return NextResponse.json({ artwork: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = supabaseAdmin();

  // Fetch image URLs before deleting so we can clean up storage
  const { data: artwork } = await supabase
    .from("artworks")
    .select("image_url, extra_image_urls, artist_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("artworks").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete artwork." }, { status: 500 });
  }

  // Clean up storage images in the background
  if (artwork) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "artworks";
    const allUrls = [
      artwork.image_url,
      artwork.artist_image_url,
      ...(artwork.extra_image_urls ?? []),
    ].filter(Boolean) as string[];

    const paths = allUrls.map((url) => url.split(`/${bucket}/`)[1]).filter(Boolean);
    if (paths.length > 0) {
      await supabase.storage.from(bucket).remove(paths);
    }
  }

  return NextResponse.json({ success: true });
}
