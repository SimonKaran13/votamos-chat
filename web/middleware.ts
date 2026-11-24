import { type NextRequest, NextResponse } from 'next/server';

const PAUSED_PATH = '/hasta-pronto';

// Pages that keep working while the chat backend is paused.
const ALLOWED_PATHS = [
  PAUSED_PATH,
  '/about-us',
  '/donar',
  '/donate',
  '/impressum',
  '/privacidad',
];

export function middleware(request: NextRequest) {
  if (process.env.SITE_PAUSED !== 'true') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isAllowed = ALLOWED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isAllowed) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = PAUSED_PATH;
  url.search = '';
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip API routes, Next.js internals and static files (anything with an extension).
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
