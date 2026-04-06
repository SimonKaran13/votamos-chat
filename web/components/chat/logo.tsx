import { cn } from '@/lib/utils';
import Image, { type ImageProps } from 'next/image';

type LogoVariant = 'small' | 'large' | 'default';

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  alt?: string;
  variant?: LogoVariant;
};

const LOGO_ASSETS: Record<
  LogoVariant,
  {
    height: number;
    src: string;
    width: number;
  }
> = {
  small: {
    src: '/logos/logo-small.svg',
    width: 349,
    height: 350,
  },
  default: {
    src: '/logos/logo-default.svg',
    width: 11302,
    height: 5216,
  },
  large: {
    src: '/logos/logo-large.svg',
    width: 17398,
    height: 4160,
  },
};

function Logo({
  alt = 'votamos.chat logo',
  className,
  variant = 'default',
  ...props
}: Props) {
  const asset = LOGO_ASSETS[variant];

  return (
    <Image
      {...props}
      alt={props['aria-hidden'] ? '' : alt}
      className={cn(className)}
      height={asset.height}
      src={asset.src}
      unoptimized
      width={asset.width}
    />
  );
}

export default Logo;
