import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Allow public paths and API/auth callbacks without redirect
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname) || pathname.startsWith("/auth/")) {
    return response;
  }

  // Protected routes — if no user, redirect to login (session check done via supabase middleware's getUser)
  // Detailed role-based redirects are handled in dashboard layouts/server components
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
