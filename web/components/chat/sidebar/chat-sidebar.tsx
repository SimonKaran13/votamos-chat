import Logo from '@/components/chat/logo';
import { ThemeModeToggle } from '@/components/chat/theme-mode-toggle';
import FeedbackDialog from '@/components/feedback-dialog';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { HomeIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import ChatSidebarGroupSelect from './chat-sidebar-group-select';
import SidebarHistorySr from './sidebar-history-sr';
import SidebarNewChatButtons from './sidebar-new-chat-buttons';

import { DEFAULT_CONTEXT_ID } from '@/lib/constants';

type Props = {
  contextId?: string;
};

async function ChatSidebar({ contextId = DEFAULT_CONTEXT_ID }: Props) {
  return (
    <Sidebar
      mobileVisuallyHiddenTitle="votamos.chat"
      mobileVisuallyHiddenDescription="Inicia un nuevo chat o elige una conversación anterior."
    >
      <SidebarHeader className="flex h-chat-header flex-row items-center justify-between border-b border-b-muted pl-4 pr-2">
        <Link href={`/${contextId}`} className="flex items-center gap-4">
          <Logo variant="small" className="size-6" />
        </Link>
        <div className="flex flex-row items-center gap-1">
          <ThemeModeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="size-8"
            tooltip="Inicio"
          >
            <Link href={`/${contextId}`}>
              <HomeIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Nuevo chat</SidebarGroupLabel>
            <SidebarNewChatButtons contextId={contextId} />

            <ChatSidebarGroupSelect contextId={contextId} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Comentarios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <FeedbackDialog>
                  <SidebarMenuButton>
                    <MessageCircleIcon className="size-4 text-blue-400" />
                    <span>Comentarios</span>
                  </SidebarMenuButton>
                </FeedbackDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Suspense
          fallback={
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <LoadingSpinner />
              <p>Cargando historial...</p>
            </div>
          }
        >
          <SidebarHistorySr />
        </Suspense>
        <SidebarGroup>
          <SidebarGroupLabel>Información</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/about-us">Sobre votamos.chat</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/how-to">¿Cómo funciona votamos.chat?</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${contextId}/sources`}>Fuentes</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/impressum">Aviso legal</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/datenschutz">Privacidad</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default ChatSidebar;
