import {
  getContext,
  getShareableChatSessionSnapshot,
} from '@/lib/firebase/firebase-server';
import type { Metadata } from 'next';
import Link from 'next/link';
import ShareRedirect from './share-redirect';

type Props = {
  params: Promise<{
    contextId: string;
  }>;
  searchParams: Promise<{
    snapshot_id?: string;
  }>;
};

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:3000';
const APP_NAME = 'votamos.chat';

function buildShareDescription(
  contextName: string,
  snapshotQuestion?: string,
  snapshotTitle?: string,
) {
  if (snapshotQuestion) {
    return `${snapshotQuestion} Explora esta conversación compartida en ${APP_NAME} sobre ${contextName}.`;
  }

  if (snapshotTitle) {
    return `Explora la conversación "${snapshotTitle}" compartida en ${APP_NAME} sobre ${contextName}.`;
  }

  return `Explora una conversación compartida en ${APP_NAME} sobre ${contextName}.`;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { contextId } = await params;
  const { snapshot_id } = await searchParams;

  const [context, snapshot] = await Promise.all([
    getContext(contextId),
    snapshot_id
      ? getShareableChatSessionSnapshot(snapshot_id)
      : Promise.resolve(undefined),
  ]);

  const contextName = context?.name ?? 'Elecciones Presidenciales 2026';
  const snapshotQuestion = snapshot?.question?.trim();
  const snapshotTitle = snapshot?.title?.trim();
  const title = snapshotQuestion
    ? `${snapshotQuestion} | ${APP_NAME}`
    : snapshotTitle
      ? `${snapshotTitle} | ${APP_NAME}`
      : `Conversación compartida | ${contextName} | ${APP_NAME}`;
  const description = buildShareDescription(
    contextName,
    snapshotQuestion,
    snapshotTitle,
  );
  const url = new URL(`/${contextId}/share`, SITE_URL);

  if (snapshot_id) {
    url.searchParams.set('snapshot_id', snapshot_id);
  }

  const ogImage = new URL('/api/share-og', SITE_URL);
  ogImage.searchParams.set('context', contextName);

  if (snapshotQuestion || snapshotTitle) {
    ogImage.searchParams.set('title', snapshotQuestion ?? snapshotTitle ?? '');
  }

  return {
    title,
    description,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: url.toString(),
    },
    openGraph: {
      title,
      description,
      url: url.toString(),
      siteName: APP_NAME,
      locale: 'es_CO',
      type: 'article',
      images: [
        {
          url: ogImage.toString(),
          width: 1200,
          height: 630,
          alt: `${APP_NAME} - conversación compartida`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.toString()],
    },
  };
}

async function SharePage({ params, searchParams }: Props) {
  const { contextId } = await params;
  const { snapshot_id } = await searchParams;
  const destinationUrl = new URL(`/${contextId}`, SITE_URL);

  if (snapshot_id) {
    destinationUrl.searchParams.set('snapshot_id', snapshot_id);
  }

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <ShareRedirect href={destinationUrl.toString()} />
      <h1 className="text-2xl font-bold">Abriendo conversación compartida</h1>
      <p className="text-muted-foreground">
        Si no se abre automáticamente, continúa en{' '}
        <Link href={destinationUrl.toString()} className="underline">
          {APP_NAME}
        </Link>
        .
      </p>
    </main>
  );
}

export default SharePage;
