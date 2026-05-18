import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).delete("asa_admin");
  return NextResponse.json({ ok: true });
}
