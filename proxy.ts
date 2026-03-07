import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils';

const AUTH_PAGES   = ['/login', '/signup'];
const PUBLIC_PATHS = ['/api', '/_next', '/favicon.ico'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let static assets, Next internals, and API routes pass through untouched
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });

  const isAuthPage = AUTH_PAGES.includes(pathname);

  // Already logged in → don't let them see login/signup again
  if (authenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Not logged in → send to login (except when already going there)
  if (!authenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
