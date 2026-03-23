import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{
    contextId: string;
  }>;
  searchParams: Promise<{
    snapshot_id: string;
    ref?: InternalReferrers;
  }>;
};

async function SharePage({ params, searchParams }: Props) {
  const { contextId } = await params;
  await searchParams;
  redirect(`/${contextId}`);
}

export default SharePage;
