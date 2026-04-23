'use client';

import { DonateSubmitButton } from '@/components/donate-submit-button';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { createWompiCheckoutUrl } from '@/lib/server-actions/wompi-create-checkout-url';
import { cn } from '@/lib/utils';
import { MIN_DONATION_AMOUNT_COP } from '@/lib/wompi/wompi-config';
import { formatCopAmount } from '@/lib/wompi/wompi-helpers';
import NumberFlow from '@number-flow/react';
import { track } from '@vercel/analytics/react';
import { EqualIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_AMOUNTS = [10_000, 20_000, 50_000, 100_000, 500_000];

function DonationForm() {
  const [amount, setAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState('50000');

  const parsedCustomAmount = Number(customAmountInput);
  const effectiveAmount =
    customAmount &&
    Number.isFinite(parsedCustomAmount) &&
    customAmountInput !== ''
      ? Math.floor(parsedCustomAmount)
      : customAmount
        ? 0
        : amount;

  const handleDonate = async (data: FormData) => {
    try {
      track('donation_started', { amount: effectiveAmount });
      const result = await createWompiCheckoutUrl(data);
      window.location.assign(result.url);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos iniciar el pago. Inténtalo de nuevo.',
      );
    }
  };

  const handleSetAmount = (nextAmount: number) => {
    setAmount(nextAmount);
    setCustomAmount(false);
    setCustomAmountInput(String(nextAmount));
  };

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
    if (customAmount) {
      setCustomAmount(false);
    }
  };

  return (
    <form action={handleDonate}>
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Mantén{' '}
          <Link className="underline" href="/">
            votamos.chat
          </Link>{' '}
          vivo
        </CardTitle>
        <CardDescription className="text-center">
          Actualmente financiamos{' '}
          <Link className="underline" href="/">
            votamos.chat
          </Link>{' '}
          de nuestro propio bolsillo. Tu donación nos ayuda a cubrir costos de
          servidores, de la IA y mantenimiento para que la plataforma siga
          siendo abierta y útil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
          <div className="mb-8 mt-4 flex flex-col items-center justify-center">
            {customAmount ? (
              <Input
                type="number"
                min={MIN_DONATION_AMOUNT_COP}
                step="1000"
                className="mb-2 h-16 w-44 text-center !text-3xl font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={customAmountInput}
                onChange={(event) => {
                  setCustomAmountInput(
                    event.target.value.replace(/[^\d]/g, ''),
                  );
                }}
                onBlur={() => {
                  if (customAmountInput === '') {
                    return;
                  }

                  const value = Math.max(
                    MIN_DONATION_AMOUNT_COP,
                    Math.floor(Number(customAmountInput) || 0),
                  );
                  setCustomAmountInput(String(value));
                  setAmount(value);
                }}
              />
            ) : (
              <h1 className="text-center text-4xl font-bold">
                <NumberFlow value={effectiveAmount} />{' '}
                <span className="text-lg text-muted-foreground">COP</span>
              </h1>
            )}
            <p className="text-center text-sm text-muted-foreground">
              donación única
            </p>
          </div>
          <EqualIcon className="text-3xl" />
          <div className="mb-8 mt-4 flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold">
              <NumberFlow value={Math.round(effectiveAmount / 80)} />
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              Personas que podemos ayudar informadas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {DEFAULT_AMOUNTS.map((currentAmount) => (
            <Button
              key={currentAmount}
              variant="outline"
              type="button"
              className={cn(
                amount === currentAmount &&
                  'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90',
              )}
              onClick={() => handleSetAmount(currentAmount)}
            >
              {formatCopAmount(currentAmount)}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            className={cn(
              customAmount &&
                'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90',
            )}
            onClick={() => {
              setCustomAmount(true);
              setCustomAmountInput(String(amount));
            }}
          >
            Otro valor
          </Button>
        </div>

        <Slider
          className="my-8"
          min={MIN_DONATION_AMOUNT_COP}
          max={500_000}
          step={1_000}
          value={[effectiveAmount || MIN_DONATION_AMOUNT_COP]}
          onValueChange={handleSliderChange}
        />

        <p className="text-center text-sm text-muted-foreground">
          Mínimo {formatCopAmount(MIN_DONATION_AMOUNT_COP)}. Pago procesado por
          Wompi.
        </p>

        <input type="hidden" name="amount" value={effectiveAmount} />
      </CardContent>
      <CardFooter>
        <DonateSubmitButton
          disabled={effectiveAmount < MIN_DONATION_AMOUNT_COP}
        />
      </CardFooter>
    </form>
  );
}

export default DonationForm;
