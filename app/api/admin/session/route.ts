import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.ADMIN_UPLOAD_TOKEN;
  const cookieToken = (await cookies()).get("asa_admin")?.value;
  return NextResponse.json({ isAdmin: Boolean(token && cookieToken === token) });
}
