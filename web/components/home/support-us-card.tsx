import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeartHandshakeIcon, UsersRoundIcon } from 'lucide-react';
import Link from 'next/link';

function SupportUsCard({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-md border border-border',
        fullWidth && 'md:col-span-2',
      )}
    >
      <div className="flex flex-col p-4">
        <h2 className="font-bold">Ayúdanos a sostener votamos.chat</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Tu aporte cubre infraestructura y costos de IA para mantener esta
          herramienta abierta durante las elecciones en Colombia.
        </p>
        <div className="flex w-full flex-row gap-2 [&_a]:w-full">
          <Button asChild>
            <Link href="/donar">
              <HeartHandshakeIcon />
              Donar
            </Link>
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link href="/about-us">
              <UsersRoundIcon />
              Sobre nosotros
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SupportUsCard;
