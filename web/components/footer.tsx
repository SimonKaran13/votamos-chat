'use client';

import Link from 'next/link';
import Logo from './chat/logo';
import { ThemeModeToggle } from './chat/theme-mode-toggle';
import FeedbackDialog from './feedback-dialog';
import { useCurrentContext } from './providers/context-provider';

function Footer() {
  const context = useCurrentContext({ optional: true });
  const sourcesHref = context ? `/${context.context_id}/sources` : '/sources';

  return (
    <footer className="flex h-footer w-full flex-col items-center justify-center gap-4 border-t p-4 text-xs text-muted-foreground md:flex-row">
      <Logo className="size-5" variant="small" />

      <section className="flex grow flex-wrap items-center justify-center gap-2 underline md:justify-end">
        <Link href="/how-to">Guía</Link>
        <Link href="/about-us">Sobre nosotros</Link>
        <Link href={sourcesHref}>Fuentes</Link>
        {/*<Link href={PRESS_LINK} target="_blank">*/}
        {/*  Prensa*/}
        {/*</Link>*/}
        <FeedbackDialog>
          <button type="button">Feedback</button>
        </FeedbackDialog>
        <Link href="/impressum">Aviso legal</Link>
        {/*<Link href="/datenschutz">Privacidad</Link>*/}
      </section>

      <ThemeModeToggle />
    </footer>
  );
}

export default Footer;
