import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { invalidOrigin, isSameOriginRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return invalidOrigin();
  }

  (await cookies()).delete("asa_admin");
  return NextResponse.json({ ok: true });
}
