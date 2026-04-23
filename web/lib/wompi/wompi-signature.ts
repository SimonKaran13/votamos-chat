import { createHash, randomUUID } from 'node:crypto';
import {
  WOMPI_CURRENCY,
  getWompiIntegritySecret,
} from '@/lib/wompi/wompi-config';

export function createDonationReference() {
  return `DON-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function createIntegritySignature(params: {
  reference: string;
  amountInCents: number;
  expirationTime?: string;
}) {
  const base = `${params.reference}${params.amountInCents}${WOMPI_CURRENCY}`;
  const payload = params.expirationTime
    ? `${base}${params.expirationTime}${getWompiIntegritySecret()}`
    : `${base}${getWompiIntegritySecret()}`;

  return createHash('sha256').update(payload).digest('hex');
}
