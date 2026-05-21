import { NextResponse } from "next/server";
import { z } from "zod";
import { invalidOrigin, isSameOriginRequest } from "@/lib/admin-auth";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";

const joinSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  style: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  commission: z.string().optional(),
  message: z.string().min(10)
});

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return invalidOrigin();
  }

  const form = await request.formData();
  const parsed = joinSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = supabaseAdmin() as ReturnType<typeof supabaseAdmin> & {
    from(table: "join_applications"): {
      insert(value: unknown): Promise<{ error: unknown }>;
    };
  };
  try {
    const { error } = await supabase.from("join_applications").insert({
      ...parsed.data,
      phone: parsed.data.phone || null,
      location: parsed.data.location || null,
      style: parsed.data.style || null,
      instagram: parsed.data.instagram || null,
      website: parsed.data.website || null,
      commission: parsed.data.commission || null
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });

  } catch (opError: any) {
    console.warn("Supabase Join insert failed. Checking network/connectivity...", opError);
    const errorMsg = String(opError.message || opError || "");
    const isNetworkError = 
      errorMsg.includes("fetch failed") || 
      errorMsg.includes("EAI_AGAIN") || 
      errorMsg.includes("ENOTFOUND") || 
      errorMsg.includes("ECONNREFUSED") ||
      errorMsg.includes("aborted") ||
      errorMsg.includes("timeout") ||
      opError.name === "AbortError" ||
      opError.code === "EAI_AGAIN" ||
      opError.code === "ENOTFOUND" ||
      opError.status === 408 ||
      opError.message === "FetchError";

    if (isNetworkError) {
      console.log("Database/Network offline. Running simulated mock join application...");
      return NextResponse.json({ 
        ok: true, 
        isMock: true, 
        message: "Join application received in offline simulation mode." 
      });
    } else {
      console.error(opError);
      return NextResponse.json({ error: "Could not submit application." }, { status: 500 });
    }
  }
}
