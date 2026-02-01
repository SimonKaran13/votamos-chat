'use client';

import ChatGroupPartySelect from '@/components/chat/chat-group-party-select';
import ElectionSelect from '@/components/home/election-select';
import HomePartyCards from '@/components/home/home-party-cards';
import LoadingPartyCards from '@/components/home/loading-party-cards';
import { useElectionContext } from '@/components/providers/context-provider';
import { Button } from '@/components/ui/button';
import { GitCompareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  contextId: string;
};

function StepHeader({
  step,
  children,
  id,
}: {
  step: number;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
        aria-hidden="true"
      >
        {step}
      </span>
      <h2 id={id} className="text-sm font-semibold text-foreground">
        <span className="sr-only">Schritt {step}: </span>
        {children}
      </h2>
    </div>
  );
}

export function ElectionPartySelector({ contextId }: Props) {
  const { partyCount, parties } = useElectionContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div
      className="flex w-full flex-col gap-8"
      role="group"
      aria-label="Wahl und Parteiauswahl"
    >
      {/* Step 1: Election Selection */}
      <section className="flex flex-col gap-4" aria-labelledby="step-election">
        <StepHeader step={1} id="step-election">
          Wähle die Wahl aus
        </StepHeader>
        <ElectionSelect />
      </section>

      {/* Step 2: Party Selection */}
      <section className="flex flex-col gap-2" aria-labelledby="step-party">
        <StepHeader step={2} id="step-party">
          Wähle eine Partei und starte den Chat
        </StepHeader>

        {!parties || isLoading ? (
          <LoadingPartyCards
            partyCount={partyCount || 8}
            className="mt-2"
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
            aria-label="Mehrere Parteien zum Vergleichen auswählen"
          >
            <GitCompareIcon aria-hidden="true" />
            Wähle mehrere Parteien zum Vergleichen
          </Button>
        </ChatGroupPartySelect>
      </section>
    </div>
  );
}

export default ElectionPartySelector;
