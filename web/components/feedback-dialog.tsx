import { MailIcon, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from './chat/responsive-drawer-dialog';
import { Button } from './ui/button';
type Props = {
  children: React.ReactNode;
};

function FeedbackDialog({ children }: Props) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>

      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Comentarios</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Nos encantaría recibir tus comentarios sobre votamos.chat.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex w-full flex-col gap-2 p-4 md:p-0">
          <Button asChild variant="outline">
            <Link href="mailto:info@wahl.chat">
              <MailIcon />
              Escríbenos un correo
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://forms.fillout.com/t/cGozfJUor9us"
              target="_blank"
            >
              <MessageSquareHeart />
              Completa nuestro formulario
            </Link>
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default FeedbackDialog;
