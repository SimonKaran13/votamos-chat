const LOCAL_SITE_URL = 'http://localhost:3000';

function normalizeSiteUrl(siteUrl?: string | null) {
  if (!siteUrl) return null;

  const trimmedSiteUrl = siteUrl.trim();
  if (trimmedSiteUrl.length === 0) return null;

  const normalizedSiteUrl = /^https?:\/\//i.test(trimmedSiteUrl)
    ? trimmedSiteUrl
    : `https://${trimmedSiteUrl}`;

  return normalizedSiteUrl.replace(/\/+$/, '');
}

export function getSiteUrl() {
  return (
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    LOCAL_SITE_URL
  );
}
