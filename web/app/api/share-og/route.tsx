import { getSiteUrl } from '@/lib/site-url';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = truncate(
    searchParams.get('title')?.trim() || 'Conversación compartida',
    100,
  );
  const context = truncate(
    searchParams.get('context')?.trim() || 'Elecciones Presidenciales 2026',
    60,
  );
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/web-app-manifest-512x512.png`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background:
          'linear-gradient(135deg, rgb(7, 43, 38) 0%, rgb(14, 74, 63) 55%, rgb(10, 98, 78) 100%)',
        color: 'white',
        padding: '52px',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(3, 23, 20, 0.18)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          padding: '46px',
          alignItems: 'center',
          gap: '36px',
        }}
      >
        <div
          style={{
            width: '164px',
            height: '164px',
            borderRadius: '32px',
            background: 'rgba(255,255,255,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
          }}
        >
          <img
            src={logoUrl}
            alt="votamos.chat"
            width="120"
            height="120"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '18px',
          }}
        >
          <div
            style={{
              fontSize: '26px',
              color: 'rgba(220,255,245,0.78)',
            }}
          >
            votamos.chat
          </div>
          <div
            style={{
              fontSize: '56px',
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '30px',
              color: 'rgba(220,255,245,0.88)',
            }}
          >
            {context}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
