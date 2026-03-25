import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const siteUrl = process.env.SITE_URL;
const siteHostname = siteUrl ? new URL(siteUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: siteHostname
      ? [
          {
            protocol: siteUrl?.startsWith('http://') ? 'http' : 'https',
            hostname: siteHostname,
            port: '',
            pathname: '/images/**',
          },
        ]
      : [],
  },
  webpack: (config: { resolve: { alias: { [key: string]: boolean } } }) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
