'use client';

import ContextSwitcher from '@/components/context/context-switcher';

export function ChatContextSelector() {
  return (
    <ContextSwitcher
      buildHref={(contextId) => `/${contextId}`}
      navigationTargetLabel="zur Startseite weitergeleitet"
    />
  );
}

export default ChatContextSelector;
