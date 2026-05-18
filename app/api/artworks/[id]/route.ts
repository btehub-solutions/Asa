import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { AVAILABILITY, PUBLICATION_STATUS } from "@/lib/categories";

async function verifyAdmin() {
  const cookieToken = (await cookies()).get("asa_admin")?.value;
  return Boolean(process.env.ADMIN_UPLOAD_TOKEN && cookieToken === process.env.ADMIN_UPLOAD_TOKEN);
}

const optionalNullableString = z.preprocess((value) => {
  if (value === "") return null;
  return value;
}, z.string().nullable().optional());

const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value == null) return null;
  return value;
}, z.coerce.number().nullable().optional());

const stringArrayFromForm = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fall through to comma-separated parsing for tags and legacy form values.
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}, z.array(z.string()));

const patchSchema = z.object({
  availability: z.enum(AVAILABILITY).optional(),
  publication_status: z.enum(PUBLICATION_STATUS).optional(),
  price: optionalNullableNumber,
  title: z.string().min(1).optional(),
  artist_name: z.string().min(1).optional(),
  medium: z.string().optional(),
  year_created: optionalNullableString,
  dimensions: optionalNullableString,
  cultural_roots: optionalNullableString,
  artist_bio: optionalNullableString,
  artist_story: optionalNullableString,
  artist_quote: optionalNullableString,
  cultural_significance: optionalNullableString,
  piece_story: optionalNullableString,
  yoruba_connection: optionalNullableString,
  admin_notes: optionalNullableString,
  commission_rate: optionalNullableNumber,
  nationality: optionalNullableString,
  city_base: optionalNullableString,
  year_active: optionalNullableString,
  categories: stringArrayFromForm.optional(),
  tags: stringArrayFromForm.optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const isFormData = request.headers.get("content-type")?.includes("multipart/form-data");
  const form = isFormData ? await request.formData() : null;
  const body = form ? Object.fromEntries(form) : await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", details: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const updateData: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };

  if (form) {
    const image = form.get("image");

    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ error: "A valid artwork image is required." }, { status: 400 });
      }

      const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "artworks";
      try {
        updateData.image_url = await uploadImage(supabase, bucket, image);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Could not upload artwork image." }, { status: 500 });
      }
    }
  }

  const updateClient = supabase as ReturnType<typeof supabaseAdmin> & {
    from(table: "artworks"): {
      update(value: unknown): {
        eq(column: string, value: string): {
          select(columns: string): { single(): Promise<{ data: unknown; error: unknown }> };
        };
      };
    };
  };

  const { data, error } = await updateClient
    .from("artworks")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not update artwork." }, { status: 500 });
  }

  return NextResponse.json({ artwork: data });
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = supabaseAdmin();

  const queryClient = supabase as ReturnType<typeof supabaseAdmin> & {
    from(table: "artworks"): {
      select(columns: string): {
        eq(column: string, value: string): {
          single(): Promise<{ data: { image_url: string; extra_image_urls: string[]; artist_image_url: string | null } | null; error: unknown }>;
        };
      };
      delete(): {
        eq(column: string, value: string): Promise<{ error: unknown }>;
      };
    };
  };

  // Fetch image URLs before deleting so we can clean up storage
  const { data: artwork } = await queryClient
    .from("artworks")
    .select("image_url, extra_image_urls, artist_image_url")
    .eq("id", id)
    .single();

  const { error } = await queryClient.from("artworks").delete().eq("id", id);

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
