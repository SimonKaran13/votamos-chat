import ChatGroupPartySelectContent from './chat-group-party-select-content';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from './responsive-drawer-dialog';

type Props = {
  children: React.ReactNode;
  onNewChat?: (partyIds: string[]) => void;
  selectedPartyIdsInStore?: string[];
  addPartiesToChat?: boolean;
  contextId?: string;
};

function ChatGroupPartySelect({
  children,
  onNewChat,
  selectedPartyIdsInStore,
  addPartiesToChat,
  contextId,
}: Props) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Selecciona candidaturas</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {addPartiesToChat
              ? 'Cambia las candidaturas seleccionadas.'
              : 'Elige hasta siete candidaturas con las que quieres iniciar el chat.'}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ChatGroupPartySelectContent
          selectedPartyIdsInStore={selectedPartyIdsInStore}
          onNewChat={onNewChat}
          addPartiesToChat={addPartiesToChat}
          contextId={contextId}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default ChatGroupPartySelect;
