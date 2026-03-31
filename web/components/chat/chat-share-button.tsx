'use client';

import { useChatStore } from '@/components/providers/chat-store-provider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShareIcon } from 'lucide-react';
import ChatShareLinkInputForm from './chat-share-link-input-form';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from './responsive-drawer-dialog';

type Props = {
  contextId: string;
};

function ChatShareButton({ contextId }: Props) {
  const sharePrivateSession = useChatStore(
    (state) => state.messages.length > 0,
  );

  return (
    <ResponsiveDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ShareIcon />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Compartir chat</TooltipContent>
      </Tooltip>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {sharePrivateSession
              ? 'Compartir este chat'
              : 'Compartir votamos.chat'}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {sharePrivateSession
              ? 'Cualquier persona con este enlace podra ver este chat.'
              : 'Comparte votamos.chat con tus amistades y familia.'}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="p-4 md:p-0">
          <ChatShareLinkInputForm
            sharePrivateSession={sharePrivateSession}
            contextId={contextId}
          />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default ChatShareButton;
