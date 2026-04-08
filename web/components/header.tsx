import Logo from '@/components/chat/logo';
import { IS_EMBEDDED } from '@/lib/utils';
import Link from 'next/link';
import MobileNavbar from './navbar/mobile-navbar';
import NavBar from './navbar/navbar';

async function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background px-4 py-2 md:px-0">
      <div className="relative mx-auto flex max-w-xl items-center justify-between gap-2 md:flex-row">
        <Link href="/">
          <Logo className="h-12 w-auto md:h-16" />
        </Link>

        {!IS_EMBEDDED && <MobileNavbar />}
        <NavBar className="hidden md:flex" />
      </div>
    </header>
  );
}

export default Header;
