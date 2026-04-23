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

export class WompiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'WompiApiError';
  }
}

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
    throw new WompiApiError(
      `Failed to fetch Wompi transaction: ${reason}`,
      response.status,
    );
  }

  return payload.data;
}
