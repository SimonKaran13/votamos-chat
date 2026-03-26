import GithubIcon from '@/components/icons/github-icon';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function GitHubCard({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div
      className={`flex flex-col rounded-md border border-border${
        fullWidth ? ' md:col-span-2' : ''
      }`}
    >
      <div className="flex grow flex-col justify-between p-4">
        <div>
          <h2 className="font-bold">
            El código de <span className="underline">votamos.chat</span>
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            ¿Quieres saber cómo funciona{' '}
            <span className="underline">votamos.chat</span> o incluso colaborar
            en su desarrollo? Todo el código es Open Source y está disponible en
            GitHub.
          </p>
        </div>
        <Button asChild variant="secondary" className="w-full">
          <Link
            href="https://github.com/SimonKaran13/votamos-chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="size-5" />
            GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default GitHubCard;
