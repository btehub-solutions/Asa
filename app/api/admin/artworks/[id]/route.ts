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
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  return NextResponse.json({ artwork: data });
}
