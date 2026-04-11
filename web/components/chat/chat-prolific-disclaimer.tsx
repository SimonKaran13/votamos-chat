'use client';

import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/chat/responsive-drawer-dialog';
import { useChatStore } from '@/components/providers/chat-store-provider';
import { Button } from '@/components/ui/button';

type Props = {
  minInteractions: number;
};

function ChatProlificDisclaimer({ minInteractions }: Props) {
  const prolificDisclaimerDismissed = useChatStore(
    (state) => state.prolificDisclaimerDismissed,
  );
  const setProlificDisclaimerDismissed = useChatStore(
    (state) => state.setProlificDisclaimerDismissed,
  );

  const open = !prolificDisclaimerDismissed;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(o) => !o && setProlificDisclaimerDismissed(true)}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Bienvenido al estudio</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Información importante
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="px-4 text-sm md:px-0">
          <p className="mb-4">
            Gracias por participar en nuestro estudio. Para completarlo, debes
            enviar al menos <strong>{minInteractions} mensajes</strong> al chat.
          </p>
          <div className="rounded-md border border-border bg-muted p-4">
            <p className="font-semibold text-foreground">
              No cierres esta pestaña del navegador antes de recibir el código
              final.
            </p>
            <p className="mt-2 text-muted-foreground">
              El código aparecerá cuando hayas enviado suficientes mensajes y es
              necesario para terminar el estudio.
            </p>
          </div>
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button className="w-full">Entendido, empecemos</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default ChatProlificDisclaimer;
