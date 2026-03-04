import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/account'];

// Routes that should redirect to /account if already logged in
const authRoutes = ['/login', '/signup', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for Appwrite session cookie
  // Appwrite stores session as a cookie starting with 'a_session_'
  const hasSession = request.cookies.getAll().some(
    (cookie) => cookie.name.startsWith('a_session_')
  );

  // Redirect to login if accessing protected route without session
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to account if accessing auth routes with session
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/login', '/signup', '/forgot-password'],
};
