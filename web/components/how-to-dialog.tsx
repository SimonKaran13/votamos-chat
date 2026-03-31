import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from './chat/responsive-drawer-dialog';
import HowTo from './how-to';

type Props = {
  children: React.ReactNode;
};

function HowToDialog({ children }: Props) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="flex max-h-[95dvh] flex-col overflow-hidden">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Que puedo hacer con <span className="underline">votamos.chat</span>?
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Consejos para aprovechar mejor votamos.chat.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="grow overflow-y-auto px-4 md:px-0">
          <HowTo />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default HowToDialog;
