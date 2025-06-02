import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { auth0: string } }) {
  const action = context.params.auth0;
  
  switch (action) {
    case 'login':
      return auth0.startInteractiveLogin({
        returnTo: '/dashboard'
      });
      
    case 'logout': {
      // For logout, redirect to Auth0 logout URL
      const logoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(process.env.AUTH0_BASE_URL || 'http://localhost:3000')}`;
      return NextResponse.redirect(logoutUrl);
    }
    
    case 'callback': {
      // Handle the callback - you might need to implement this based on your needs
      const session = await auth0.getSession(request);
      if (session) {
        return NextResponse.redirect('/dashboard');
      } else {
        return NextResponse.redirect('/login?error=callback_failed');
      }
    }
    
    case 'me': {
      const userSession = await auth0.getSession(request);
      if (userSession) {
        return NextResponse.json(userSession);
      } else {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }
    
    default:
      return new NextResponse('Not Found', { status: 404 });
  }
}