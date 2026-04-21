import { getWompiTransaction } from '@/lib/wompi/get-wompi-transaction';
import { NextResponse } from 'next/server';

type Props = {
  params: Promise<{
    transactionId: string;
  }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const { transactionId } = await params;
    const transaction = await getWompiTransaction(transactionId);

    return NextResponse.json({ data: transaction });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch transaction.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
