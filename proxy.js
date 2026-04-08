// Blocks all /api routes and rewrites root to about-landing in production or when LANDING_REWRITE is true
// Lets us have a static landing page without needing a separate project or build step

import { NextResponse } from 'next/server';

const isLandingMode =
    process.env.NODE_ENV === 'production' ||
    process.env.LANDING_REWRITE === 'true';

export function proxy(request) {
    if (!isLandingMode) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // Block all /api routes
    if (pathname.startsWith('/api')) {
        return new NextResponse(null, { status: 404 });
    }

    // Block app pages
    if (pathname.startsWith('/alerts') || pathname.startsWith('/projects')) {
        return new NextResponse(null, { status: 404 });
    }

    // Rewrite root to about-landing
    if (pathname === '/') {
        return NextResponse.rewrite(new URL('/about-landing', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/api/:path*', '/alerts/:path*', '/alerts', '/projects/:path*', '/projects'],
};
