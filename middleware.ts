import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Assume a cookie 'demo_authenticated' is set on successful login
  const isAuthenticated = request.cookies.get('demo_authenticated')?.value === 'true';
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Path: ${pathname}, Authenticated: ${isAuthenticated}`);

  // If user is not authenticated and trying to access a protected demo route
  const protectedPaths = ['/dashboard', '/matching', '/analysis', '/response', '/pipeline'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (!isAuthenticated && isProtected) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and tries to access the login page again, redirect to dashboard
  if (isAuthenticated && pathname === '/login') {
     console.log(`[Middleware] Redirecting authenticated user from /login to /dashboard`);
     const dashboardUrl = new URL('/dashboard', request.url);
     return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to proceed if none of the above conditions are met
  console.log(`[Middleware] Allowing request for ${pathname}`);
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Matcher specifies which routes the middleware should run on
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     * - / (the root path, handled separately or allow access)
     * - Other public pages (e.g., /vision, /features, /about, /feedback, /waitlist, /faq)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|/$|vision|features|about|feedback|waitlist|faq).*)',
    // Explicitly include /login to handle redirecting already logged-in users
    '/login',
  ],
} 