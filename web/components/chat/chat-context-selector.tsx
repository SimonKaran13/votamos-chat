'use client';

import ContextSwitcher from '@/components/context/context-switcher';

export function ChatContextSelector() {
  return (
    <ContextSwitcher
      buildHref={(contextId) => `/${contextId}`}
      navigationTargetLabel="iras a la pagina de inicio"
      currentAreaLabel="este chat"
    />
  );
}

export default ChatContextSelector;
