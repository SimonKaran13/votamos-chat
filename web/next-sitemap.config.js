const normalizeSiteUrl = (siteUrl) => {
  if (!siteUrl) return null;

  const trimmedSiteUrl = siteUrl.trim();
  if (!trimmedSiteUrl) return null;

  const normalizedSiteUrl = /^https?:\/\//i.test(trimmedSiteUrl)
    ? trimmedSiteUrl
    : `https://${trimmedSiteUrl}`;

  return normalizedSiteUrl.replace(/\/+$/, '');
};

module.exports = {
  siteUrl:
    normalizeSiteUrl(process.env.SITE_URL) ||
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeSiteUrl(process.env.VERCEL_URL) ||
    'http://localhost:3000',
  generateRobotsTxt: true,
  sitemapSize: 7000,
};
