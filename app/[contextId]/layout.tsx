import { ContextProvider } from '@/components/providers/context-provider';
import { DEFAULT_CONTEXT_ID } from '@/lib/constants';
import {
  getContext,
  getContexts,
  getPartiesForContext,
} from '@/lib/firebase/firebase-server';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 3600;

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

  // If context doesn't exist, redirect to default context
  if (!context) {
    // Avoid infinite redirect loop if default context also doesn't exist
    if (contextId === DEFAULT_CONTEXT_ID) {
      notFound();
    }
    redirect(`/${DEFAULT_CONTEXT_ID}`);
  }

  // Sort parties randomly for display
  const shuffledParties = [...parties].sort(() => Math.random() - 0.5);

  return (
    <ContextProvider
      context={context}
      contexts={contexts}
      parties={shuffledParties}
    >
      {children}
    </ContextProvider>
  );
}

export default ContextLayout;
