import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check for demo session in request headers or cookies
  const isDemoSession = req.headers.get("x-demo-session") === "true" || req.cookies.get("demo_session")?.value

  // Get the pathname
  const pathname = req.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth", "/auth/reset-password", "/returns"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If it's a demo session, allow access to admin routes
  if (isDemoSession && pathname.startsWith("/admin")) {
    return res
  }

  // Check Supabase auth for non-demo sessions
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to auth if accessing protected route without session
  if (!session && pathname.startsWith("/admin")) {
    const redirectUrl = new URL("/auth", req.url)
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
