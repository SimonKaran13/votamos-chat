import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { NavbarItemDetails } from './navbar-item';
import NavbarItem from './navbar-item';

type Props = {
  mobileClose?: () => void;
};

function MobileNavbarItems({ mobileClose }: Props) {
  const tabs: NavbarItemDetails[] = [
    {
      label: 'Inicio',
      href: '/',
    },
    {
      label: 'Guía',
      href: '/how-to',
    },
    // {
    //   label: 'Wahl Swiper',
    //   href: '/swiper',
    //   highlight: true,
    //   icon: <SparklesIcon className="size-3" />,
    // },
    {
      label: 'Sobre nosotros',
      href: '/about-us',
    },
  ];

  return (
    <nav
      className={cn(
        'flex flex-col md:flex-row items-center justify-center gap-2',
      )}
    >
      {tabs.map((tab) => (
        <NavbarItem key={tab.href} details={tab} mobileClose={mobileClose} />
      ))}
      <Separator orientation="horizontal" className="my-4 w-1/2" />
    </nav>
  );
}

export default MobileNavbarItems;
