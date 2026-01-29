'use client';

import { useChatSessionParam } from '@/lib/hooks/use-chat-session-param';
import { createChatStore } from '@/lib/stores/chat-store';
import type { ChatStore } from '@/lib/stores/chat-store.types';
import {type ReactNode, createContext, useContext, useRef, useEffect} from 'react';
import { useStore } from 'zustand';
import {
  captureProlificParams,
  getWahlChatSessionMessageCount
} from "@/lib/prolific-study/prolific-metadata";
import {useSearchParams} from "next/navigation";

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<ChatStoreApi | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
  contextId?: string;
};

export const ChatStoreProvider = ({ children, contextId }: Props) => {
  const sessionId = useChatSessionParam();
  const searchParams = useSearchParams();
  const storeRef = useRef<ChatStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createChatStore({
      chatSessionId: sessionId,
      contextId,
    });
  }

  useEffect(() => {
    console.log("Capturing Prolific metadata")
    const metadata = captureProlificParams(searchParams);
    if (metadata && storeRef.current) {
      storeRef.current.getState().setProlificMetadata(metadata);

      const count = getWahlChatSessionMessageCount();
      storeRef.current.getState().setProlificMessageCount(count);
    }
  }, [])

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatStoreContext.Provider>
  );
};

export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const chatStoreContext = useContext(ChatStoreContext);

  if (!chatStoreContext) {
    throw new Error(`useChatStore must be used within ChatStoreProvider`);
  }

  return useStore(chatStoreContext, selector);
};
