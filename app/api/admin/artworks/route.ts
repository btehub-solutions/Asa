import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch artworks failed, falling back to demo data:", error);
      const { demoArtworks } = await import("@/lib/demo-data");
      return NextResponse.json({ artworks: demoArtworks, isMock: true });
    }

    return NextResponse.json({ artworks: data ?? [] });
  } catch (err) {
    console.warn("Exception during fetch artworks, falling back to demo data:", err);
    const { demoArtworks } = await import("@/lib/demo-data");
    return NextResponse.json({ artworks: demoArtworks, isMock: true });
  }
}
