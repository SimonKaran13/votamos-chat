import { Button } from '@/components/ui/button';
import { GraduationCapIcon } from 'lucide-react';
import Link from 'next/link';

const OPEN_CALL_PATH =
  'public/additional_documents/hiring/WahlChatOpenCall.pdf';
const OPEN_CALL_URL = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(OPEN_CALL_PATH)}?alt=media`;

function OpenCallCard() {
  return (
    <div className="flex flex-col rounded-md border border-border">
      <div className="flex grow flex-col justify-between p-4">
        <div>
          <h2 className="font-bold">Masterarbeiten mit Impact</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Du willst mit deiner Masterarbeit politische Transparenz und die
            Überprüfbarkeit von Wahlversprechen erforschen und umsetzen? Dann
            bewirb dich jetzt!
          </p>
        </div>
        <Button asChild variant="secondary" className="w-full">
          <Link href={OPEN_CALL_URL} target="_blank" rel="noopener noreferrer">
            <GraduationCapIcon className="size-5" />
            Open Call
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default OpenCallCard;
