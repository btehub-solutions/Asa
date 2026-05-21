import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return unauthorized();
  }

  const { id } = await params;
  
  try {
    const { demoArtworks } = await import("@/lib/demo-data");
    const demoItem = demoArtworks.find((item) => item.id === id || item.slug === id);

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.warn(`Supabase fetch artwork ${id} failed:`, error);
      if (demoItem) {
        return NextResponse.json({ artwork: demoItem, isMock: true });
      }
      return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
    }

    return NextResponse.json({ artwork: data });
  } catch (err) {
    console.warn(`Exception during fetch artwork ${id}:`, err);
    const { demoArtworks } = await import("@/lib/demo-data");
    const demoItem = demoArtworks.find((item) => item.id === id || item.slug === id);
    if (demoItem) {
      return NextResponse.json({ artwork: demoItem, isMock: true });
    }
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }
}
