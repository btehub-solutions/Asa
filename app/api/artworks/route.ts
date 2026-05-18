import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { AVAILABILITY, PUBLICATION_STATUS } from "@/lib/categories";
import { slugify } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value == null) return undefined;
  return value;
}, z.coerce.number().optional());

const artworkSchema = z.object({
  artist_name: z.string().min(1),
  title: z.string().min(1),
  medium: z.string().min(1),
  year_created: z.string().optional(),
  dimensions: z.string().optional(),
  price: optionalNumber,
  nationality: z.string().optional(),
  city_base: z.string().optional(),
  year_active: z.string().optional(),
  cultural_roots: z.string().optional(),
  artist_quote: z.string().optional(),
  artist_bio: z.string().optional(),
  artist_story: z.string().optional(),
  cultural_significance: z.string().optional(),
  piece_story: z.string().optional(),
  yoruba_connection: z.string().optional(),
  tags: z.string().optional(),
  admin_notes: z.string().optional(),
  commission_rate: optionalNumber,
  availability: z.enum(AVAILABILITY),
  publication_status: z.enum(PUBLICATION_STATUS),
  intent_status: z.enum(PUBLICATION_STATUS).optional(),
  categories: z.string().default("[]")
});

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const token = String(form.get("admin_token") ?? "");
    const cookieToken = (await cookies()).get("asa_admin")?.value;
    if (!process.env.ADMIN_UPLOAD_TOKEN || (token !== process.env.ADMIN_UPLOAD_TOKEN && cookieToken !== process.env.ADMIN_UPLOAD_TOKEN)) {
      return NextResponse.json({ error: "Invalid admin token." }, { status: 401 });
    }

    const image = form.get("image");
    if (!(image instanceof File) || !image.type.startsWith("image/")) {
      return NextResponse.json({ error: "A valid artwork image is required." }, { status: 400 });
    }

    const parsed = artworkSchema.parse(Object.fromEntries(form));
    const categories = JSON.parse(parsed.categories) as string[];
    const supabase = supabaseAdmin();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "artworks";
    const imageUrl = await uploadImage(supabase, bucket, image);
    const artistImage = form.get("artist_image");
    const artistImageUrl = artistImage instanceof File && artistImage.size > 0 ? await uploadImage(supabase, bucket, artistImage) : null;
    const extraImageUrls = await Promise.all([0, 1, 2, 3].map(async (index) => {
      const extra = form.get(`extra_image_${index}`);
      if (!(extra instanceof File) || extra.size === 0) return null;
      return uploadImage(supabase, bucket, extra);
    }));
    const baseSlug = slugify(parsed.title);
    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    const insertClient = supabase as ReturnType<typeof supabaseAdmin> & {
      from(table: "artworks"): {
        insert(value: unknown): {
          select(columns: string): { single(): Promise<{ data: unknown; error: unknown }> };
        };
      };
    };

    const { data, error } = await insertClient
      .from("artworks")
      .insert({
        artist_name: parsed.artist_name,
        title: parsed.title,
        slug,
        medium: parsed.medium,
        year_created: parsed.year_created || null,
        dimensions: parsed.dimensions || null,
        price: parsed.price ?? null,
        nationality: parsed.nationality || null,
        city_base: parsed.city_base || null,
        year_active: parsed.year_active || null,
        cultural_roots: parsed.cultural_roots || null,
        artist_quote: parsed.artist_quote || null,
        artist_bio: parsed.artist_bio || null,
        artist_story: parsed.artist_story || null,
        image_url: imageUrl,
        extra_image_urls: extraImageUrls.filter(Boolean),
        categories,
        availability: parsed.availability,
        cultural_significance: parsed.cultural_significance || null,
        piece_story: parsed.piece_story || null,
        yoruba_connection: parsed.yoruba_connection || null,
        tags: parsed.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [],
        commission_rate: parsed.commission_rate ?? null,
        admin_notes: parsed.admin_notes || null,
        publication_status: parsed.intent_status ?? parsed.publication_status,
        artist_image_url: artistImageUrl
      })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ artwork: data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save artwork." }, { status: 500 });
  }
}

async function uploadImage(supabase: ReturnType<typeof supabaseAdmin>, bucket: string, image: File) {
  const ext = image.name.split(".").pop() || "webp";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, image, { contentType: image.type, upsert: false });

  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
