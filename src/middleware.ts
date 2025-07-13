import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function validateSession(sessionCookie: string): Promise<boolean> {
  try {
    const response = await fetch('https://dashboard.42paris.fr/api/attendance', {
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': `session=${sessionCookie}`,
        'referer': 'https://dashboard.42paris.fr/attendance',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  console.log('Middleware - pathname:', request.nextUrl.pathname);
  console.log('Middleware - sessionCookie:', sessionCookie ? 'exists' : 'missing');
  console.log('Middleware - isLoginPage:', isLoginPage);

  if (!sessionCookie && !isLoginPage) {
    console.log('Middleware - Redirecting to /login (no session)');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionCookie && !isLoginPage) {
    console.log('Middleware - Validating session...');
    const isValid = await validateSession(sessionCookie.value);
    console.log('Middleware - Session valid:', isValid);

    if (!isValid) {
      console.log('Middleware - Invalid session, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (sessionCookie && isLoginPage) {
    console.log('Middleware - Validating session for login page...');
    const isValid = await validateSession(sessionCookie.value);
    console.log('Middleware - Session valid for login page:', isValid);

    if (isValid) {
      console.log('Middleware - Redirecting to / (has valid session on login page)');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  console.log('Middleware - Continuing to page');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

