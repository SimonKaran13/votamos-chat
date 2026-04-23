const WOMPI_CHECKOUT_URL = 'https://checkout.wompi.co/p/';
const WOMPI_SANDBOX_API_URL = 'https://sandbox.wompi.co/v1';
const WOMPI_PRODUCTION_API_URL = 'https://production.wompi.co/v1';

function getRequiredEnv(name: keyof NodeJS.ProcessEnv) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getWompiPublicKey() {
  return getRequiredEnv('NEXT_PUBLIC_WOMPI_PUBLIC_KEY');
}

export function getWompiIntegritySecret() {
  return getRequiredEnv('WOMPI_INTEGRITY_SECRET');
}

export function getWompiCheckoutUrl() {
  return WOMPI_CHECKOUT_URL;
}

export function getWompiApiBaseUrl() {
  return getWompiPublicKey().startsWith('pub_test_')
    ? WOMPI_SANDBOX_API_URL
    : WOMPI_PRODUCTION_API_URL;
}

export const WOMPI_CURRENCY = 'COP';
export const MIN_DONATION_AMOUNT_COP = 5000;
