import {
  getWompiApiBaseUrl,
  getWompiPublicKey,
} from '@/lib/wompi/wompi-config';
import type { WompiTransaction } from '@/lib/wompi/wompi-helpers';

type WompiTransactionResponse = {
  data?: WompiTransaction;
  error?: {
    type?: string;
    reason?: string;
    messages?: Array<{ property?: string; message?: string }>;
  };
};

export async function getWompiTransaction(transactionId: string) {
  const response = await fetch(
    `${getWompiApiBaseUrl()}/transactions/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${getWompiPublicKey()}`,
      },
      cache: 'no-store',
    },
  );

  const payload = (await response.json()) as WompiTransactionResponse;

  if (!response.ok || !payload.data) {
    const reason =
      payload.error?.reason ??
      payload.error?.messages?.[0]?.message ??
      'Unknown error';
    throw new Error(`Failed to fetch Wompi transaction: ${reason}`);
  }

  return payload.data;
}
