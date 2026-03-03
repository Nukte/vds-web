import { redirect } from 'next/navigation';

/**
 * Root page (/) — should never be seen in production.
 * The middleware redirects / → /tr before this component renders.
 * This redirect acts as a belt-and-suspenders fallback.
 */
export default function RootPage() {
  redirect('/tr');
}
