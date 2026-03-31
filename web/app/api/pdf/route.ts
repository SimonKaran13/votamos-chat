import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get('url');

  if (!sourceUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(sourceUrl);
  } catch {
    return new Response('Invalid url parameter', { status: 400 });
  }

  const range = request.headers.get('range');
  const upstreamResponse = await fetch(upstreamUrl, {
    headers: range ? { Range: range } : undefined,
  });

  if (!upstreamResponse.ok) {
    return new Response('Failed to fetch PDF', {
      status: upstreamResponse.status,
    });
  }

  const headers = new Headers();
  const contentType =
    upstreamResponse.headers.get('content-type') ?? 'application/pdf';
  headers.set('content-type', contentType);

  const contentLength = upstreamResponse.headers.get('content-length');
  if (contentLength) {
    headers.set('content-length', contentLength);
  }

  const contentRange = upstreamResponse.headers.get('content-range');
  if (contentRange) {
    headers.set('content-range', contentRange);
  }

  const acceptRanges = upstreamResponse.headers.get('accept-ranges');
  if (acceptRanges) {
    headers.set('accept-ranges', acceptRanges);
  }

  headers.set('cache-control', 'private, max-age=3600');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
