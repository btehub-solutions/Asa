import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { invalidOrigin, isSameOriginRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return invalidOrigin();
  }

  const form = await request.formData();
  const token = String(form.get("admin_token") ?? "");

  if (!process.env.ADMIN_UPLOAD_TOKEN || token !== process.env.ADMIN_UPLOAD_TOKEN) {
    return NextResponse.json({ error: "Invalid admin token." }, { status: 401 });
  }

  (await cookies()).set("asa_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ ok: true });
}
