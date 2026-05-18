import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const cookieToken = (await cookies()).get("asa_admin")?.value;
  if (!process.env.ADMIN_UPLOAD_TOKEN || cookieToken !== process.env.ADMIN_UPLOAD_TOKEN) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not fetch artworks." }, { status: 500 });
  }

  return NextResponse.json({ artworks: data ?? [] });
}
