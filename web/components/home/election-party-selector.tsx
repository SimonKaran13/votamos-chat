'use client';

import ChatGroupPartySelect from '@/components/chat/chat-group-party-select';
import ElectionSelect from '@/components/home/election-select';
import HomePartyCards from '@/components/home/home-party-cards';
import LoadingPartyCards from '@/components/home/loading-party-cards';
import SecondRoundFaceOff, {
  SecondRoundFaceOffSkeleton,
} from '@/components/home/second-round-face-off';
import { useElectionContext } from '@/components/providers/context-provider';
import { Button } from '@/components/ui/button';
import { GitCompareIcon, MousePointerClickIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  contextId: string;
};

export function ElectionPartySelector({ contextId }: Props) {
  const { partyCount, parties } = useElectionContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // A runoff (segunda vuelta) with exactly two candidacies gets the
  // head-to-head treatment instead of the generic party grid
  const isRunoff = partyCount === 2;

  return (
    <div
      className="flex w-full flex-col gap-6"
      role="group"
      aria-label="Selección de elección y partido"
    >
      {/* Election Context Banner */}
      <section aria-labelledby="election-context">
        <span id="election-context" className="sr-only">
          Elección actual
        </span>
        <ElectionSelect />
      </section>

      {/* Party Selection - Main Focus */}
      {isRunoff ? (
        !parties || isLoading ? (
          <SecondRoundFaceOffSkeleton />
        ) : (
          <SecondRoundFaceOff contextId={contextId} />
        )
      ) : (
        <section
          className="flex flex-col gap-3"
          aria-labelledby="party-selection"
        >
          <h2
            id="party-selection"
            className="flex items-center justify-center gap-2 text-center text-base font-semibold text-foreground"
          >
            <MousePointerClickIcon
              className="size-7 shrink-0"
              aria-hidden="true"
            />
            Escoge una candidatura y chatea
          </h2>

          {!parties || isLoading ? (
            <LoadingPartyCards
              partyCount={Math.min(partyCount || 0, 8)}
              className="mt-1"
              gridColumns={4}
            />
          ) : (
            <HomePartyCards contextId={contextId} />
          )}

          <ChatGroupPartySelect contextId={contextId}>
            <Button
              className="w-full max-w-xl whitespace-normal border border-border"
              variant="secondary"
              disabled={isLoading}
              aria-label="Escoger múltiples candidaturas para compararlas"
            >
              <GitCompareIcon aria-hidden="true" />
              Preguntar a múltiples candidaturas
            </Button>
          </ChatGroupPartySelect>
        </section>
      )}
    </div>
  );
}

export default ElectionPartySelector;
