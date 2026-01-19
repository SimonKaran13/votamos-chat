import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  CONTEXT_ID_HEADER,
  DEFAULT_CONTEXT_ID,
  REGION_TO_CONTEXT,
  TENANT_ID_HEADER,
} from './lib/constants';

// Static pages that should remain at root level (not context-specific)
const STATIC_PAGES = [
  '/impressum',
  '/datenschutz',
  '/about-us',
  '/how-to',
  '/budget-spent',
  '/login',
  '/donate',
  '/topics',
  '/api',
  '/pdf',
];

// Check if the pathname is a static page
function isStaticPage(pathname: string): boolean {
  return STATIC_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );
}

// Get context ID from Vercel geo headers or fallback to default
function getContextIdFromGeo(request: NextRequest): string {
  // Only consider German regions for now
  const country = request.headers.get('x-vercel-ip-country');
  if (country !== 'DE') {
    return DEFAULT_CONTEXT_ID;
  }

  const region = request.headers.get('x-vercel-ip-country-region');
  if (region && REGION_TO_CONTEXT[region]) {
    return REGION_TO_CONTEXT[region];
  }

  return DEFAULT_CONTEXT_ID;
}

// Known context ID patterns (will be validated against actual contexts)
function looksLikeContextId(segment: string): boolean {
  // Context IDs are like: bundestagswahl-2025, bw2026, europawahl-2029
  return /^[a-z]{2,}\d{4}$|^[a-z]+-[a-z]+-\d{4}$|^[a-z]+wahl-\d{4}$/.test(
    segment,
  );
}

export async function middleware(request: NextRequest) {
  const budgetSpent = process.env.BUDGET_SPENT === 'true';

  if (budgetSpent) {
    return NextResponse.redirect(new URL('/budget-spent', request.url));
  }

  const pathname = request.nextUrl.pathname;

  // Handle tenant ID from search params
  const tenantIdSearchParam = request.nextUrl.searchParams.get('tenant_id');
  const requestHeaders = new Headers(request.headers);

  if (tenantIdSearchParam) {
    requestHeaders.set(TENANT_ID_HEADER, tenantIdSearchParam);
  }

  // Skip middleware for static pages
  if (isStaticPage(pathname)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Handle legacy /chat routes
  if (pathname.startsWith('/chat')) {
    if (pathname === '/chat') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const secondPart = pathname.split('/')[2];
    const newPath = `/session?party_id=${secondPart}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Root path: detect context and redirect
  if (pathname === '/') {
    const contextId = getContextIdFromGeo(request);
    const searchParams = request.nextUrl.searchParams.toString();
    const redirectUrl = new URL(
      `/${contextId}${searchParams ? `?${searchParams}` : ''}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Legacy /session routes without context: use default context
  if (pathname === '/session' || pathname.startsWith('/session/')) {
    const contextId = DEFAULT_CONTEXT_ID;
    const restPath = pathname.replace('/session', '');
    const searchParams = request.nextUrl.searchParams.toString();
    const redirectUrl = new URL(
      `/${contextId}/session${restPath}${searchParams ? `?${searchParams}` : ''}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Legacy /swiper route without context
  if (pathname === '/swiper' || pathname.startsWith('/swiper/')) {
    const contextId = DEFAULT_CONTEXT_ID;
    const restPath = pathname.replace('/swiper', '');
    const searchParams = request.nextUrl.searchParams.toString();
    const redirectUrl = new URL(
      `/${contextId}/swiper${restPath}${searchParams ? `?${searchParams}` : ''}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Legacy /share route without context
  if (pathname === '/share') {
    const contextId = DEFAULT_CONTEXT_ID;
    const searchParams = request.nextUrl.searchParams.toString();
    const redirectUrl = new URL(
      `/${contextId}/share${searchParams ? `?${searchParams}` : ''}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Legacy /sources route without context
  if (pathname === '/sources') {
    const contextId = DEFAULT_CONTEXT_ID;
    return NextResponse.redirect(new URL(`/${contextId}/sources`, request.url));
  }

  // Extract context ID from path for context-specific routes
  const segments = pathname.split('/').filter(Boolean);
  const potentialContextId = segments[0];

  if (potentialContextId && looksLikeContextId(potentialContextId)) {
    requestHeaders.set(CONTEXT_ID_HEADER, potentialContextId);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/',
    '/chat/:path*',
    '/session/:path*',
    '/swiper/:path*',
    '/share',
    '/sources',
    '/:contextId',
    '/:contextId/:path*',
  ],
};
