import { AnonymousAuthProvider } from '@/components/anonymous-auth';
import { Toaster } from '@/components/ui/sonner';

import AuthServiceWorkerProvider from '@/components/providers/auth-service-worker-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import TenantProvider from '@/components/providers/tenant-provider';
import { productionRobots } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site-url';
import { IS_EMBEDDED } from '@/lib/utils';
import { LazyMotion, domAnimation } from 'motion/react';

const SITE_URL = getSiteUrl();
const APP_NAME = 'votamos.chat';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} | Elecciones presidenciales de Colombia 2026`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'Compara propuestas y posturas de las candidaturas en las elecciones presidenciales de Colombia 2026. Conversa con programas de gobierno, haz preguntas sobre los temas que te importan y revisa respuestas con fuentes.',
  applicationName: APP_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  keywords: [
    'votamos.chat',
    'elecciones Colombia',
    'elecciones presidenciales Colombia',
    'política Colombia',
    'candidatos Colombia',
    'partidos políticos Colombia',
    'programas de gobierno',
    'chat político',
    'IA política',
    'asistente político',
    'comparar partidos',
    'comparar propuestas',
    'elecciones 2026',
    'Colombia 2026',
    'elecciones presidenciales 2026 primera vuelta',
    '31 de mayo de 2026',
    'inteligencia artificial',
    'Chatbot',
    'chat electoral',
    'decisión de voto',
    'informarse para votar',
    'IA para votar',
    'IA Colombia 2026',
  ],
  robots: productionRobots,
  openGraph: {
    title: {
      default: `${APP_NAME} | Elecciones presidenciales de Colombia 2026`,
      template: `%s | ${APP_NAME}`,
    },
    description:
      'Compara propuestas y posturas de las candidaturas en las elecciones presidenciales de Colombia 2026. Conversa con programas de gobierno, haz preguntas sobre los temas que te importan y revisa respuestas con fuentes.',
    images: [`${SITE_URL}/images/logo.webp`],
    url: SITE_URL,
    siteName: APP_NAME,
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} | Elecciones presidenciales de Colombia 2026`,
    description:
      'Compara propuestas y posturas de las candidaturas en las elecciones presidenciales de Colombia 2026. Conversa con programas de gobierno, haz preguntas sobre los temas que te importan y revisa respuestas con fuentes.',
    images: [`${SITE_URL}/images/logo.webp`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: APP_NAME,
                  url: SITE_URL,
                  description:
                    'Plataforma de información política para comparar propuestas y conversar con candidaturas y programas de gobierno en Colombia.',
                },
                {
                  '@type': 'WebSite',
                  name: APP_NAME,
                  url: SITE_URL,
                  inLanguage: 'es-CO',
                  description:
                    'Compara propuestas y posturas de las candidaturas en las elecciones presidenciales de Colombia 2026.',
                },
              ],
            }),
          }}
        />
      </head>
      <AuthServiceWorkerProvider />
      <TooltipProvider>
        <AnonymousAuthProvider user={null}>
          <TenantProvider>
            <body>
              <LazyMotion features={domAnimation}>
                <ThemeProvider
                  attribute="class"
                  enableSystem={!IS_EMBEDDED}
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
                <Toaster expand duration={1500} position="top-right" />
                {/* <LoginReminderToast /> */}
                {/* TODO: implement again when problems are fixed <IframeChecker /> */}
                <Analytics />
              </LazyMotion>
            </body>
          </TenantProvider>
        </AnonymousAuthProvider>
      </TooltipProvider>
    </html>
  );
}
