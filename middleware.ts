import { NextResponse, type NextRequest } from "next/server"
import { auth0 } from './lib/auth0'
import { getUserProfile } from './lib/dynamodb'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log(`🔍 Middleware processing: ${pathname}`)
  
  try {
    // Apply Auth0 middleware first
    console.log(`📋 Applying Auth0 middleware for: ${pathname}`)
    const response = await auth0.middleware(request)
    if (response) {
      console.log(`✅ Auth0 middleware returned response for: ${pathname}`)
      return response
    }
    console.log(`➡️ Auth0 middleware passed through for: ${pathname}`)

    // Let auth and api routes pass through
    if (
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/auth/') ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/about') ||
      request.nextUrl.pathname.startsWith('/features') ||
      request.nextUrl.pathname.startsWith('/pricing') ||
      request.nextUrl.pathname.startsWith('/faq') ||
      request.nextUrl.pathname.startsWith('/terms') ||
      request.nextUrl.pathname.startsWith('/privacy')
    ) {
      console.log(`🚪 Allowing public route to pass through: ${pathname}`)
      return NextResponse.next()
    }

    console.log(`🔐 Protected route detected, checking session: ${pathname}`)
    const session = await auth0.getSession(request)
    
    // Redirect to login if not authenticated
    if (!session?.user) {
      console.log(`❌ No session found, redirecting to login from: ${pathname}`)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    console.log(`👤 User authenticated: ${session.user.sub}, checking onboarding status`)

    // For authenticated users, check onboarding status
    try {
      const profile = await getUserProfile(session.user.sub)
      console.log(`📊 Profile retrieved for ${session.user.sub}:`, profile ? 'exists' : 'not found')
      
      // If no profile exists, redirect to onboarding
      if (!profile) {
        if (!request.nextUrl.pathname.startsWith('/onboarding')) {
          console.log(`🆕 No profile found, redirecting to onboarding from: ${pathname}`)
          return NextResponse.redirect(new URL('/onboarding', request.url))
        } else {
          console.log(`🆕 No profile found, but already on onboarding page: ${pathname}`)
        }
      } else {
        console.log(`📋 Profile found - onboardingCompleted: ${profile.onboardingCompleted}, onboardingSkipped: ${profile.onboardingSkipped}`)
        
        // If onboarding not completed and not skipped, redirect to onboarding
        if (!profile.onboardingCompleted && !profile.onboardingSkipped) {
          if (!request.nextUrl.pathname.startsWith('/onboarding')) {
            console.log(`⏳ Onboarding incomplete, redirecting to onboarding from: ${pathname}`)
            return NextResponse.redirect(new URL('/onboarding', request.url))
          } else {
            console.log(`⏳ Onboarding incomplete, but already on onboarding page: ${pathname}`)
          }
        } else {
          console.log(`✅ Onboarding completed or skipped, checking for redirects`)
          
          // If onboarding is done, redirect away from onboarding page to dashboard
          if (request.nextUrl.pathname.startsWith('/onboarding')) {
            console.log(`🔄 Onboarding complete, redirecting away from onboarding to dashboard`)
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
          }
          
          // If user tries to access root protected areas, redirect to dashboard
          if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname === '/admin/') {
            console.log(`🔄 Redirecting from admin root to dashboard: ${pathname}`)
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
          }
          
          console.log(`✅ All checks passed, allowing access to: ${pathname}`)
        }
      }
    } catch (error) {
      console.error(`💥 Error checking onboarding status for ${session.user.sub}:`, error)
      // On error, redirect to onboarding to be safe
      if (!request.nextUrl.pathname.startsWith('/onboarding')) {
        console.log(`🚨 Error occurred, redirecting to onboarding as fallback from: ${pathname}`)
        return NextResponse.redirect(new URL('/onboarding', request.url))
      } else {
        console.log(`🚨 Error occurred, but already on onboarding page: ${pathname}`)
      }
    }

    console.log(`➡️ Middleware complete, proceeding to: ${pathname}`)
    return NextResponse.next()
  } catch (error) {
    console.error(`💥 Middleware error for ${pathname}:`, error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}