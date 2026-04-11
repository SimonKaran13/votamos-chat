import type { Context } from '@/lib/firebase/firebase.types';
import type { Metadata } from 'next';

const DEFAULT_BASE_URL = 'http://localhost:3000';
const BASE_URL = process.env.SITE_URL ?? DEFAULT_BASE_URL;
const APP_NAME = 'votamos.chat';

const IS_PRODUCTION =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV === 'production';

export const productionRobots = IS_PRODUCTION
  ? 'index, follow'
  : 'noindex, nofollow';

function formatContextDate(date: string | null): string | null {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate);
}

export function buildContextMetadata(
  context: Context,
  pageSuffix?: string,
  noIndex?: boolean,
): Metadata {
  const formattedDate = formatContextDate(context.date);
  const title = pageSuffix
    ? `${pageSuffix} | ${context.name}`
    : `${context.name} | ${APP_NAME}`;

  const description =
    context.type === 'election' && formattedDate
      ? `Compara propuestas y posturas de las candidaturas para ${context.name} en ${context.location_name}. Haz preguntas sobre los temas que te importan y revisa respuestas con fuentes. Jornada electoral: ${formattedDate}.`
      : `Compara propuestas y posturas políticas en ${context.location_name}. Haz preguntas sobre los temas que te importan y revisa respuestas con fuentes en ${APP_NAME}.`;

  const url = `${BASE_URL}/${context.context_id}`;

  return {
    title,
    description,
    robots: productionRobots,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(noIndex && {
      robots: 'noindex',
    }),
  };
}

export function buildContextJsonLd(context: Context) {
  const formattedDate = formatContextDate(context.date);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${context.name} | ${APP_NAME}`,
    description:
      context.type === 'election' && formattedDate
        ? `Compara propuestas y posturas para ${context.name} en ${context.location_name}. La jornada electoral está prevista para el ${formattedDate}.`
        : `Compara propuestas y posturas políticas en ${context.location_name}.`,
    url: `${BASE_URL}/${context.context_id}`,
    inLanguage: 'es-CO',
    isPartOf: {
      '@type': 'WebSite',
      name: APP_NAME,
      url: BASE_URL,
    },
    ...(context.type === 'election' && context.date
      ? {
          about: {
            '@type': 'Election',
            name: context.name,
            startDate: context.date,
            location: {
              '@type': 'Country',
              name: context.location_name,
            },
          },
        }
      : {}),
  };
}
