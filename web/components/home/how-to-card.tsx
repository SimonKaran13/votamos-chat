import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { BookMarkedIcon } from 'lucide-react';

function HowToCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border md:col-span-2">
      <div className="flex flex-col p-4">
        <h2 className="font-bold">
          ¿Cómo usar <span className="underline">votamos.chat</span>?
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Aprende qué puedes hacer con{' '}
          <span className="underline">votamos.chat</span> y qué funciones tiene.
        </p>
        <Button asChild variant="secondary">
          <Link href="/how-to">
            <BookMarkedIcon />
            Guía
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default HowToCard;
