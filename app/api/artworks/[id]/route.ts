import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { AVAILABILITY, PUBLICATION_STATUS } from "@/lib/categories";
import { invalidOrigin, isAdminRequest, isSameOriginRequest, unauthorized } from "@/lib/admin-auth";
import {
  categoryArraySchema,
  optionalNullableNumber,
  optionalNullableString,
  stringArrayFromForm,
  tagArraySchema,
  validateImageFile
} from "@/lib/artwork-validation";
import { removeArtworkImages, storagePathFromPublicUrl, uploadArtworkImage } from "@/lib/storage";

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
  commission_rate: optionalNullableNumber.refine((value) => value == null || value <= 100, "Commission cannot exceed 100."),
  nationality: optionalNullableString,
  city_base: optionalNullableString,
  year_active: optionalNullableString,
  categories: stringArrayFromForm.pipe(categoryArraySchema).optional(),
  tags: stringArrayFromForm.pipe(tagArraySchema).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(request)) {
    return invalidOrigin();
  }

  if (!(await isAdminRequest())) {
    return unauthorized();
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
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "artworks";
  let newImagePath: string | null = null;
  let oldImagePath: string | null = null;

  if (form) {
    const image = form.get("image");

    if (image instanceof File && image.size > 0) {
      const imageError = validateImageFile(image, "Artwork image");
      if (imageError) {
        return NextResponse.json({ error: imageError }, { status: 400 });
      }

      try {
        const queryClient = supabase as ReturnType<typeof supabaseAdmin> & {
          from(table: "artworks"): {
            select(columns: string): {
              eq(column: string, value: string): {
                single(): Promise<{ data: { image_url: string } | null; error: unknown }>;
              };
            };
          };
        };
        const { data: current } = await queryClient.from("artworks").select("image_url").eq("id", id).single();
        oldImagePath = current?.image_url ? storagePathFromPublicUrl(current.image_url, bucket) : null;
        const upload = await uploadArtworkImage(supabase, bucket, image);
        newImagePath = upload.path;
        updateData.image_url = upload.url;
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
    if (newImagePath) {
      await removeArtworkImages(supabase, bucket, [newImagePath]);
    }
    console.error(error);
    return NextResponse.json({ error: "Could not update artwork." }, { status: 500 });
  }

  if (newImagePath && oldImagePath && oldImagePath !== newImagePath) {
    const cleanupError = await removeArtworkImages(supabase, bucket, [oldImagePath]);
    if (cleanupError) console.error(cleanupError);
  }

  return NextResponse.json({ artwork: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(request)) {
    return invalidOrigin();
  }

  if (!(await isAdminRequest())) {
    return unauthorized();
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

  if (artwork) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "artworks";
    const allUrls = [
      artwork.image_url,
      artwork.artist_image_url,
      ...(artwork.extra_image_urls ?? []),
    ].filter(Boolean) as string[];

    const paths = allUrls.map((url) => storagePathFromPublicUrl(url, bucket)).filter(Boolean) as string[];
    const storageError = await removeArtworkImages(supabase, bucket, paths);
    if (storageError) {
      console.error(storageError);
      return NextResponse.json({ error: "Could not remove artwork images." }, { status: 500 });
    }
  }

  const { error } = await queryClient.from("artworks").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete artwork." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
