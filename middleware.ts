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

import { NextResponse, type NextRequest } from "next/server"
// import { getSession } from '@auth0/nextjs-auth0/edge'
import { getUserProfile } from './lib/dynamodb'

import { Auth0Client } from "@auth0/nextjs-auth0/server"
export const auth0 = new Auth0Client()


export async function middleware(request: NextRequest) {
  try {
    // Let auth and api routes pass through
    if (
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/auth/') ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname === '/' ||
      !request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/onboarding')
    ) {
      return NextResponse.next()
    }

    const session = await auth0.getSession(request)
    
    // Redirect to login if not authenticated
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check onboarding status for protected routes
    if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/onboarding')) {
      try {
        const profile = await getUserProfile(session.user.sub)
        
        // If no profile exists, redirect to onboarding
        if (!profile) {
          if (!request.nextUrl.pathname.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
          }
        } else {
          // If onboarding not completed and not skipped, redirect to onboarding
          if (!profile.onboardingCompleted && !profile.onboardingSkipped) {
            if (!request.nextUrl.pathname.startsWith('/onboarding')) {
              return NextResponse.redirect(new URL('/onboarding', request.url))
            }
          } else {
            // If onboarding is done, redirect away from onboarding page
            if (request.nextUrl.pathname.startsWith('/onboarding')) {
              return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // On error, allow the request to proceed
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
} 