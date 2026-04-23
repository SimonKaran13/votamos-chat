import { Card } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donar',
  description:
    'Apoya a votamos.chat con una donación a través de Wompi para mantener la plataforma disponible durante las elecciones en Colombia.',
  robots: 'noindex',
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container flex h-full flex-col items-center justify-center py-4">
      <Card className="w-full max-w-lg border-0 md:border">{children}</Card>
    </section>
  );
}

export default Layout;
