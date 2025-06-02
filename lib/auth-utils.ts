import { NextRequest } from 'next/server';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

const auth0 = new Auth0Client();

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
}

export async function getAuthenticatedUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const session = await auth0.getSession(req);
    
    if (!session?.user?.sub || !session?.user?.email) {
      return null;
    }

    return {
      userId: session.user.sub,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export function requireAuth(
  handler: (req: NextRequest, user: AuthUser, context?: { params?: Record<string, string> }) => Promise<Response>
) {
  return async (req: NextRequest, context?: { params?: Record<string, string> }): Promise<Response> => {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return handler(req, user, context);
  };
}