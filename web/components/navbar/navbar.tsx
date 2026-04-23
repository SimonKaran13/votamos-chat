import { Separator } from '@/components/ui/separator';
import { IS_EMBEDDED, cn } from '@/lib/utils';
import type { NavbarItemDetails } from './navbar-item';
import NavbarItem from './navbar-item';

type Props = {
  className?: string;
};

export default async function NavBar({ className }: Props) {
  const tabs: NavbarItemDetails[] = [
    {
      label: 'Inicio',
      href: '/',
    },
    // {
    //   label: 'Wahl Swiper',
    //   href: '/swiper',
    //   highlight: true,
    //   icon: <SparklesIcon className="size-3" />,
    // },
    {
      label: 'Guía',
      href: '/how-to',
    },
    {
      label: 'Donar',
      href: '/donar',
    },
  ];

  return (
    <nav
      className={cn(
        'flex flex-col md:flex-row items-center justify-center gap-2',
        className,
      )}
    >
      {!IS_EMBEDDED && (
        <>
          {tabs.map((tab) => (
            <NavbarItem key={tab.href} details={tab} />
          ))}
          <Separator orientation="vertical" className="hidden h-8 md:block" />
        </>
      )}
    </nav>
  );
}
