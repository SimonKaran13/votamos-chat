'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

type Props = {
  disabled?: boolean;
};

export function DonateSubmitButton({ disabled = false }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending || disabled} type="submit">
      {pending ? 'Redirigiendo a Wompi...' : 'Donar con Wompi'}
    </Button>
  );
}
