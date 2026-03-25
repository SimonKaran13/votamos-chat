import { redirect } from 'next/navigation';

const DEFAULT_CONTEXT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_CONTEXT_ID ??
  'landtagswahl-baden-wuerttemberg-2026';

export default function HomePage() {
  redirect(`/${DEFAULT_CONTEXT_ID}`);
}
