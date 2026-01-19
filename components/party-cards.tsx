'use client';

import PartyCard from '@/components/party-card';
import { useElectionContext } from '@/components/providers/context-provider';
import { cn } from '@/lib/utils';
import { CircleXIcon, EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Logo from './chat/logo';
import LoadingPartyCards from './home/loading-party-cards';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

type Props = {
  className?: string;
  selectedPartyIds?: string[];
  onPartyClicked?: (partyId: string) => void;
  selectable?: boolean;
  gridColumns?: number;
  showWahlChatButton?: boolean;
  contextId: string;
};

function PartyCards({
  className,
  selectedPartyIds,
  onPartyClicked,
  selectable = true,
  gridColumns = 4,
  showWahlChatButton = false,
  contextId,
}: Props) {
  const { parties } = useElectionContext();
  const smallParties = parties?.filter((p) => p.is_small_party);
  const largeParties = parties?.filter((p) => !p.is_small_party);

  const defaultShowMore = !!smallParties?.find((p) =>
    selectedPartyIds?.includes(p.party_id),
  );

  const [showMore, setShowMore] = useState(defaultShowMore);

  if (!parties) {
    return (
      <LoadingPartyCards
        // TODO: make more dynamic
        partyCount={gridColumns === 3 ? 9 : 8}
        className={className}
        gridColumns={gridColumns}
      />
    );
  }

  return (
    <Collapsible open={showMore} onOpenChange={setShowMore} asChild>
      <section
        className={cn('grid w-full grid-cols-4 gap-2', className)}
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
        }}
      >
        {showWahlChatButton && (
          <Button
            className={cn(
              'flex aspect-square size-full items-center justify-center rounded-md',
              'border border-muted-foreground/20 bg-background dark:bg-zinc-900 hover:bg-muted p-0',
            )}
            type="button"
            tooltip="wahl.chat"
            asChild
          >
            <Link
              href={`/${contextId}/session`}
              onClick={() => onPartyClicked?.('wahl.chat')}
            >
              <Logo className="!size-10" />
            </Link>
          </Button>
        )}
        {largeParties?.map((party) => (
          <PartyCard
            id={party.party_id}
            key={party.party_id}
            party={party}
            isSelected={selectedPartyIds?.includes(party.party_id)}
            onPartyClicked={onPartyClicked}
            selectable={selectable}
            contextId={contextId}
          />
        ))}
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            className={cn(
              'flex aspect-square items-center justify-center',
              'w-full h-fit border border-muted-foreground/20 overflow-hidden md:hover:bg-zinc-200 dark:md:hover:bg-zinc-700',
              'text-center whitespace-normal text-muted-foreground flex flex-col items-center justify-center',
              'text-xs md:text-sm gap-1 md:gap-2',
            )}
          >
            {showMore ? (
              <CircleXIcon className="size-4" />
            ) : (
              <EllipsisIcon className="size-4" />
            )}
            {gridColumns >= 4 && `${showMore ? 'Weniger' : 'Mehr'} Parteien`}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent asChild>
          <div
            className="col-span-4 grid gap-2"
            style={{
              gridColumn: `span ${gridColumns} / span ${gridColumns}`,
              gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            }}
          >
            {smallParties?.map((party) => (
              <PartyCard
                id={party.party_id}
                key={party.party_id}
                party={party}
                isSelected={selectedPartyIds?.includes(party.party_id)}
                onPartyClicked={onPartyClicked}
                selectable={selectable}
                contextId={contextId}
              />
            ))}
          </div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}

export default PartyCards;
