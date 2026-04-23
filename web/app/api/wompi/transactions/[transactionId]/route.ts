import {
  WompiApiError,
  getWompiTransaction,
} from '@/lib/wompi/get-wompi-transaction';
import { NextResponse } from 'next/server';

type Props = {
  params: Promise<{
    transactionId: string;
  }>;
};

const TRANSACTION_ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;

export async function GET(_: Request, { params }: Props) {
  const { transactionId } = await params;

  if (!TRANSACTION_ID_RE.test(transactionId)) {
    return NextResponse.json(
      { error: 'Invalid transaction ID.' },
      { status: 400 },
    );
  }

  try {
    const transaction = await getWompiTransaction(transactionId);

    return NextResponse.json({
      data: {
        id: transaction.id,
        reference: transaction.reference,
        status: transaction.status,
        status_message: transaction.status_message,
        amount_in_cents: transaction.amount_in_cents,
        currency: transaction.currency,
        payment_method_type: transaction.payment_method_type,
        finalized_at: transaction.finalized_at,
      },
    });
  } catch (error) {
    if (error instanceof WompiApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to fetch transaction.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
