'use client';

import { Button } from '@/components/ui/button';
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type WompiTransaction,
  formatCopAmountFromCents,
  isFinalWompiStatus,
} from '@/lib/wompi/wompi-helpers';
import {
  CircleCheckIcon,
  Clock3Icon,
  FrownIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  transactionId: string;
  initialTransaction: WompiTransaction | null;
};

function DonationStatusCard({ transactionId, initialTransaction }: Props) {
  const [transaction, setTransaction] = useState(initialTransaction);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!transactionId) {
      return;
    }

    if (transaction && isFinalWompiStatus(transaction.status)) {
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      try {
        setIsRefreshing(true);
        const response = await fetch(
          `/api/wompi/transactions/${transactionId}`,
          {
            cache: 'no-store',
          },
        );
        const payload = (await response.json()) as { data?: WompiTransaction };

        if (!cancelled && payload.data) {
          setTransaction(payload.data);
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [transactionId, transaction]);

  if (!transaction) {
    return (
      <>
        <CardHeader className="flex flex-col items-center justify-center">
          <FrownIcon className="size-16" />
          <CardTitle className="pt-4 text-center">
            No pudimos verificar tu donación
          </CardTitle>
          <CardDescription className="pt-2 text-center">
            Intenta nuevamente o escríbenos si el problema persiste.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/donar">Volver a donar</Link>
          </Button>
        </CardFooter>
      </>
    );
  }

  if (transaction.status === 'APPROVED') {
    return (
      <>
        <CardHeader className="flex flex-col items-center justify-center">
          <CircleCheckIcon className="size-16" />
          <CardTitle className="pt-4 text-center">
            Tu donación fue aprobada
          </CardTitle>
          <CardDescription className="pt-2 text-center">
            Gracias por apoyar a votamos.chat con{' '}
            {formatCopAmountFromCents(transaction.amount_in_cents)}.
            <br />
            Tu aporte refuerza la democracia.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardFooter>
      </>
    );
  }

  if (transaction.status === 'PENDING') {
    return (
      <>
        <CardHeader className="flex flex-col items-center justify-center">
          {isRefreshing ? (
            <LoaderCircleIcon className="size-16 animate-spin" />
          ) : (
            <Clock3Icon className="size-16" />
          )}
          <CardTitle className="pt-4 text-center">
            Estamos confirmando tu donación
          </CardTitle>
          <CardDescription className="pt-2 text-center">
            Wompi aún reporta esta transacción como pendiente. Esta página se
            actualiza automáticamente hasta recibir el estado final.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild variant="secondary">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardHeader className="flex flex-col items-center justify-center">
        <FrownIcon className="size-16" />
        <CardTitle className="pt-4 text-center">
          La donación no fue aprobada
        </CardTitle>
        <CardDescription className="pt-2 text-center">
          {transaction.status_message ?? 'Puedes intentarlo nuevamente.'}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/donar">Intentar de nuevo</Link>
        </Button>
      </CardFooter>
    </>
  );
}

export default DonationStatusCard;
