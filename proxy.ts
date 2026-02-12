import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/src/auth";

/**
 * Next.js 16+ Proxy for route protection
 *
 * Uses full session validation with database checks.
 * This approach is more secure than cookie-only checks.
 */
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to sign-in if no valid session
  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/goals", "/goals/:path*", "/notes", "/notes/:path*"],
};
