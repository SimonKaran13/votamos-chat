'use client';

import { useEffect } from 'react';

type Props = {
  href: string;
};

function ShareRedirect({ href }: Props) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return null;
}

export default ShareRedirect;
