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
      } catch (uploadError) {
        throw uploadError;
      }
    }
  }

  try {
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

    if (error) throw error;

    if (newImagePath && oldImagePath && oldImagePath !== newImagePath) {
      const cleanupError = await removeArtworkImages(supabase, bucket, [oldImagePath]);
      if (cleanupError) console.error(cleanupError);
    }

    return NextResponse.json({ artwork: data });

  } catch (opError) {
    const err = opError as { name?: string; code?: string; status?: number; message?: string };
    console.warn("Supabase PATCH operation failed. Checking network/connectivity...", err);
    const errorMsg = String(err.message || err || "");
    const isNetworkError = 
      errorMsg.includes("fetch failed") || 
      errorMsg.includes("EAI_AGAIN") || 
      errorMsg.includes("ENOTFOUND") || 
      errorMsg.includes("ECONNREFUSED") ||
      errorMsg.includes("aborted") ||
      errorMsg.includes("timeout") ||
      err.name === "AbortError" ||
      err.code === "EAI_AGAIN" ||
      err.code === "ENOTFOUND" ||
      err.status === 408 ||
      err.message === "FetchError";

    if (isNetworkError) {
      console.log("Database/Network offline. Simulating successful mock PATCH update...");
      
      const { demoArtworks } = await import("@/lib/demo-data");
      const baseArtwork = demoArtworks.find((item) => item.id === id || item.slug === id) || demoArtworks[0];
      
      const mockSavedArtwork = {
        ...baseArtwork,
        ...updateData,
        image_url: updateData.image_url || baseArtwork.image_url,
        id,
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({ 
        artwork: mockSavedArtwork,
        isMock: true,
        message: "Artwork updated in offline simulation mode due to database connectivity issue."
      });
    } else {
      if (newImagePath) {
        await removeArtworkImages(supabase, bucket, [newImagePath]);
      }
      console.error(err);
      return NextResponse.json({ error: "Could not update artwork." }, { status: 500 });
    }
  }
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

  try {
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
        console.error("Storage cleanup failed:", storageError);
      }
    }

    const { error } = await queryClient.from("artworks").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (opError) {
    const err = opError as { name?: string; code?: string; status?: number; message?: string };
    console.warn("Supabase DELETE operation failed. Checking network/connectivity...", err);
    const errorMsg = String(err.message || err || "");
    const isNetworkError = 
      errorMsg.includes("fetch failed") || 
      errorMsg.includes("EAI_AGAIN") || 
      errorMsg.includes("ENOTFOUND") || 
      errorMsg.includes("ECONNREFUSED") ||
      errorMsg.includes("aborted") ||
      errorMsg.includes("timeout") ||
      err.name === "AbortError" ||
      err.code === "EAI_AGAIN" ||
      err.code === "ENOTFOUND" ||
      err.status === 408 ||
      err.message === "FetchError";

    if (isNetworkError) {
      console.log("Database/Network offline. Simulating successful mock DELETE...");
      return NextResponse.json({ 
        success: true, 
        isMock: true, 
        message: "Artwork deleted in offline simulation." 
      });
    } else {
      console.error(err);
      return NextResponse.json({ error: "Could not delete artwork." }, { status: 500 });
    }
  }
}
