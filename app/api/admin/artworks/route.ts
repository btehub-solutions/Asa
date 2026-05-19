import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminRequest())) {
    return unauthorized();
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
