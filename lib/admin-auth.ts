import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function isAdminRequest() {
  const token = process.env.ADMIN_UPLOAD_TOKEN;
  const cookieToken = (await cookies()).get("asa_admin")?.value;
  return Boolean(token && cookieToken === token);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export function invalidOrigin() {
  return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
}

export function isSameOriginRequest(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");

  if (origin) {
    return origin === requestOrigin;
  }

  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    return new URL(referer).origin === requestOrigin;
  } catch {
    return false;
  }
}
