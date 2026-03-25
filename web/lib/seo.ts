import type { Context } from '@/lib/firebase/firebase.types';
import type { Metadata } from 'next';

const DEFAULT_BASE_URL = 'http://localhost:3000';
const BASE_URL = process.env.SITE_URL ?? DEFAULT_BASE_URL;

const IS_PRODUCTION =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV === 'production';

export const productionRobots = IS_PRODUCTION
  ? 'index, follow'
  : 'noindex, nofollow';

export function buildContextMetadata(
  context: Context,
  pageSuffix?: string,
  noIndex?: boolean,
): Metadata {
  const title = pageSuffix
    ? `${pageSuffix} – ${context.name}`
    : `${context.name} – Parteipositionen im Chat vergleichen`;

  const description =
    context.date !== null && context.date.length > 0
      ? `Vergleiche die Positionen der Parteien zur ${context.name} (${context.location_name}). Stelle Fragen zu politischen Themen und erhalte quellengestützte Antworten.`
      : `Vergleiche die Positionen der Parteien in ${context.location_name}. Stelle Fragen zu politischen Themen und erhalte quellengestützte Antworten.`;

  const url = `${BASE_URL}/${context.context_id}`;

  return {
    title,
    description,
    robots: productionRobots,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
    ...(noIndex && {
      robots: 'noindex',
    }),
  };
}

export function buildContextJsonLd(context: Context) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${context.name} – votamos`,
    description:
      context.date !== null && context.date.length > 0
        ? `Parteipositionen für ${context.name} in ${context.location_name} vergleichen.`
        : `Parteipositionen in ${context.location_name} vergleichen.`,
    url: `${BASE_URL}/${context.context_id}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'votamos',
      url: BASE_URL,
    },
  };
}
