import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = process.env.ADMIN_UPLOAD_TOKEN;
  const cookieToken = request.cookies.get("asa_admin")?.value;
  const isLogin = request.nextUrl.pathname === "/admin-access";

  if (isLogin) return NextResponse.next();

  if (!token || cookieToken !== token) {
    const loginUrl = new URL("/admin-access", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"]
};
