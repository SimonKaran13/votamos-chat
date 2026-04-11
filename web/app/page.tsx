import { redirect } from 'next/navigation';

const DEFAULT_CONTEXT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_CONTEXT_ID ??
  'elecciones-presidenciales-2026-primera-vuelta';

export default function HomePage() {
  redirect(`/${DEFAULT_CONTEXT_ID}`);
}
