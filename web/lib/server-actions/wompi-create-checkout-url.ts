'use server';

import { getSiteUrl } from '@/lib/site-url';
import {
  MIN_DONATION_AMOUNT_COP,
  WOMPI_CURRENCY,
  getWompiCheckoutUrl,
  getWompiPublicKey,
} from '@/lib/wompi/wompi-config';
import { amountToCents } from '@/lib/wompi/wompi-helpers';
import {
  createDonationReference,
  createIntegritySignature,
} from '@/lib/wompi/wompi-signature';
import { headers } from 'next/headers';

function parseDonationAmount(rawAmount: FormDataEntryValue | null) {
  const amount = Number(rawAmount);

  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    throw new Error('Donation amount must be a whole number.');
  }

  if (amount < MIN_DONATION_AMOUNT_COP) {
    throw new Error(
      `Donation amount must be at least ${MIN_DONATION_AMOUNT_COP} COP.`,
    );
  }

  return amount;
}

async function getRedirectBaseUrl() {
  const headersList = await headers();
  const origin = headersList.get('origin');

  if (origin) {
    return origin;
  }

  const forwardedHost = headersList.get('x-forwarded-host');
  const host = forwardedHost ?? headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'https';

  if (host) {
    return `${protocol}://${host}`;
  }

  return getSiteUrl();
}

export async function createWompiCheckoutUrl(data: FormData): Promise<{
  url: string;
}> {
  const amountInCop = parseDonationAmount(data.get('amount'));
  const amountInCents = amountToCents(amountInCop);
  const reference = createDonationReference();
  const redirectUrl = new URL(
    '/donar/resultado',
    await getRedirectBaseUrl(),
  ).toString();
  const signature = createIntegritySignature({
    reference,
    amountInCents,
  });

  const checkoutUrl = new URL(getWompiCheckoutUrl());
  checkoutUrl.searchParams.set('public-key', getWompiPublicKey());
  checkoutUrl.searchParams.set('currency', WOMPI_CURRENCY);
  checkoutUrl.searchParams.set('amount-in-cents', String(amountInCents));
  checkoutUrl.searchParams.set('reference', reference);
  checkoutUrl.searchParams.set('signature:integrity', signature);
  checkoutUrl.searchParams.set('redirect-url', redirectUrl);

  return {
    url: checkoutUrl.toString(),
  };
}
