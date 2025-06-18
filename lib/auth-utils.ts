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
    // Auth0Client.getSession() without parameters gets the session from cookies
    const session = await auth0.getSession();
    
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

type RouteContext = {
  params?: Promise<Record<string, string>>;
};

export function requireAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<Response>
): (req: NextRequest) => Promise<Response>;

export function requireAuth<T extends RouteContext>(
  handler: (req: NextRequest, user: AuthUser, context: T) => Promise<Response>
): (req: NextRequest, context: T) => Promise<Response>;

export function requireAuth<T extends RouteContext>(
  handler: (req: NextRequest, user: AuthUser, context?: T) => Promise<Response>
) {
  return async (req: NextRequest, context?: T): Promise<Response> => {
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

    return handler(req, user, context as T);
  };
}