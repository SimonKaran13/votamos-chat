import ContactCard from '@/components/home/contact-card';
import GitHubCard from '@/components/home/github-card';
import SupportUsCard from '@/components/home/support-us-card';
import { CalendarCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Hasta pronto',
  description:
    'Las elecciones presidenciales de Colombia 2026 terminaron. votamos.chat está en pausa y volverá para las próximas elecciones.',
};

const FLAG_YELLOW = '#C7950A';
const FLAG_BLUE = '#003893';
const FLAG_RED = '#CE1126';

const SCREENSHOT_WIDTH = 1200;
const SCREENSHOT_HEIGHT = 945;

function HastaPronto() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            background: `linear-gradient(100deg, color-mix(in srgb, ${FLAG_YELLOW} 45%, transparent) 0%, color-mix(in srgb, ${FLAG_YELLOW} 18%, transparent) 35%, color-mix(in srgb, ${FLAG_BLUE} 18%, transparent) 55%, color-mix(in srgb, ${FLAG_RED} 18%, transparent) 75%, color-mix(in srgb, ${FLAG_RED} 40%, transparent) 100%)`,
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, transparent 90%)',
          }}
        />

        <div className="relative flex flex-col items-start gap-4 p-6 md:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <CalendarCheckIcon className="size-3.5" />
            Elecciones presidenciales 2026 · Finalizadas
          </span>

          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Nos vemos en las próximas elecciones
          </h1>

          <div className="space-y-3 text-muted-foreground">
            <p>
              Las elecciones presidenciales de Colombia 2026 ya terminaron. Por
              ahora, <span className="underline">votamos.chat</span> está en
              pausa y no responde preguntas.
            </p>
            <p>
              Volveremos para las próximas elecciones con los programas y
              propuestas de las nuevas candidaturas, para que puedas informarte
              con fuentes antes de votar.
            </p>
            <p className="font-medium text-foreground">
              Gracias a todas las personas que usaron votamos.chat en 2026.
            </p>
          </div>
        </div>
      </section>

      <figure className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div
            className="flex items-center gap-3 border-b border-border bg-muted/60 px-3 py-2"
            aria-hidden="true"
          >
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="grow truncate rounded-md bg-background px-3 py-0.5 text-center text-xs text-muted-foreground">
              votamos.chat
            </span>
            <div className="w-[46px]" />
          </div>
          <Image
            src="/images/votamos-chat-2026-light.webp"
            alt="Página de inicio de votamos.chat durante la segunda vuelta presidencial de 2026"
            width={SCREENSHOT_WIDTH}
            height={SCREENSHOT_HEIGHT}
            sizes="(max-width: 768px) 100vw, 576px"
            className="h-auto w-full dark:hidden"
            priority
          />
          <Image
            src="/images/votamos-chat-2026-dark.webp"
            alt="Página de inicio de votamos.chat durante la segunda vuelta presidencial de 2026"
            width={SCREENSHOT_WIDTH}
            height={SCREENSHOT_HEIGHT}
            sizes="(max-width: 768px) 100vw, 576px"
            className="hidden h-auto w-full dark:block"
          />
        </div>
        <figcaption className="text-center text-xs text-muted-foreground">
          Así se veía votamos.chat durante la segunda vuelta presidencial de
          2026.
        </figcaption>
      </figure>

      <section className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <SupportUsCard fullWidth />
        <ContactCard />
        <GitHubCard />
      </section>
    </div>
  );
}

export default HastaPronto;
