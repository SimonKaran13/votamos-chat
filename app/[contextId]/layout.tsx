import Footer from '@/components/footer';
import Header from '@/components/header';
import { ContextProvider } from '@/components/providers/context-provider';
import { DEFAULT_CONTEXT_ID } from '@/lib/constants';
import {
  getContext,
  getContexts,
  getPartiesForContext,
} from '@/lib/firebase/firebase-server';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    contextId: string;
  }>;
};

async function ContextLayout({ children, params }: Props) {
  const { contextId } = await params;

  const [context, contexts, parties] = await Promise.all([
    getContext(contextId),
    getContexts(),
    getPartiesForContext(contextId),
  ]);

  // If context doesn't exist and it's not the default, return 404
  if (!context) {
    // Try the default context as fallback
    const defaultContext = await getContext(DEFAULT_CONTEXT_ID);
    if (!defaultContext) {
      notFound();
    }
    // Context doesn't exist, let middleware handle redirect
    notFound();
  }

  // Sort parties randomly for display
  const shuffledParties = [...parties].sort(() => Math.random() - 0.5);

  return (
    <ContextProvider
      context={context}
      contexts={contexts}
      parties={shuffledParties}
    >
      <div className="relative flex w-full flex-col">
        <Header />
        <main className="mx-auto min-h-[calc(100vh-var(--header-height)-var(--footer-height))] w-full max-w-xl grow px-4 pb-8 md:px-0">
          {children}
        </main>
        <Footer />
      </div>
    </ContextProvider>
  );
}

export default ContextLayout;
