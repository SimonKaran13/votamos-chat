'use client';

import ContextSwitcher from '@/components/context/context-switcher';

export function ChatContextSelector() {
  return (
    <ContextSwitcher
      buildHref={(contextId) => `/${contextId}`}
      navigationTargetLabel="irás a la página de inicio"
      currentAreaLabel="este chat"
    />
  );
}

export default ChatContextSelector;
