'use client';

import { useAnonymousAuth } from '@/components/anonymous-auth';
import { useChatStore } from '@/components/providers/chat-store-provider';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { DEFAULT_CONTEXT_ID } from '@/lib/constants';
import { listenToHistory } from '@/lib/firebase/firebase';
import type { ChatSession } from '@/lib/firebase/firebase.types';
import { cn } from '@/lib/utils';
import { MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  history?: ChatSession[];
  contextId: string;
};

function SidebarHistory({ history: initialHistory, contextId }: Props) {
  const { user } = useAnonymousAuth();
  const [history, setHistory] = useState<ChatSession[]>(initialHistory ?? []);
  const chatSessionId = useChatStore((state) => state.chatSessionId);
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenToHistory(user.uid, (history) => {
      setHistory(history);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  function handleClick() {
    setOpenMobile(false);
  }

  if (history.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Historie</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {history.map((item) => {
            // Use session's context_id if available, otherwise use current context
            const sessionContextId = item.context_id ?? DEFAULT_CONTEXT_ID;
            const isFromDifferentContext = sessionContextId !== contextId;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(chatSessionId === item.id && 'bg-muted')}
                >
                  <Link
                    href={`/${sessionContextId}/session/${item.id}`}
                    onClick={handleClick}
                  >
                    {isFromDifferentContext && (
                      <MapPinIcon className="size-3 shrink-0 text-muted-foreground" />
                    )}
                    <span className="w-full truncate">
                      {item.title ||
                        item.party_ids?.join(',') ||
                        item.party_id ||
                        'wahl.chat'}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default SidebarHistory;
