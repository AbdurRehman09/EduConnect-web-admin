import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the user is authenticated (you might want to check for a token in cookies/localStorage)
    const isAuthenticated = request.cookies.get('auth');

    // If trying to access dashboard without auth, redirect to login
    if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If authenticated and trying to access login page, redirect to dashboard
    if (isAuthenticated && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};
