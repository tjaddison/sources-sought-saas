// import { NextResponse, type NextRequest } from "next/server";
// import { auth0 } from "./lib/auth0";

// export async function middleware(request: NextRequest) {
//   try {
//     // For non-dashboard routes, skip auth check
//     if (!request.nextUrl.pathname.startsWith('/dashboard')) {
//       return NextResponse.next();
//     }
    
//     // For auth routes, let them pass through
//     if (request.nextUrl.pathname.startsWith('/auth/')) {
//       return NextResponse.next();
//     }
    
//     // Only apply Auth0 middleware to dashboard routes
//     return await auth0.middleware(request);
//   } catch (error) {
//     console.error("Auth middleware error:", error);
    
//     // On error, redirect to login for dashboard routes
//     if (request.nextUrl.pathname.startsWith('/dashboard')) {
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
    
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

import type { NextRequest } from "next/server"
import { auth0 } from "./lib/auth0"

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
} 