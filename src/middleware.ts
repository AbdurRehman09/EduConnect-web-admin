import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the Firebase auth token from cookies
    const authToken = request.cookies.get('firebase-token');

    // If trying to access dashboard without auth, redirect to login
    if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If authenticated and trying to access login page, redirect to dashboard
    if (authToken && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};
