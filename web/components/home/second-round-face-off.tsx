'use client';

import { useElectionContext } from '@/components/providers/context-provider';
import { Button } from '@/components/ui/button';
import type { PartyDetails } from '@/lib/party-details';
import { buildPartyImageUrl, cn, hexDataURL } from '@/lib/utils';
import { track } from '@vercel/analytics/react';
import { SwordsIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

type Props = {
  contextId: string;
};

// Colombian flag palette for the face-off backdrop: yellow fades in from
// the left, blue anchors the VS center, red fades in from the right
const FLAG_YELLOW = '#C7950A';
const FLAG_BLUE = '#003893';
const FLAG_RED = '#CE1126';

type SideProps = {
  party: PartyDetails;
  side: 'left' | 'right';
  washColor: string;
  // Yellow needs a stronger mix than red to read over the card background
  washStrength?: number;
  contextId: string;
};

function CandidateSide({
  party,
  side,
  washColor,
  washStrength = 42,
  contextId,
}: SideProps) {
  const color = party.background_color ?? '#d4d4d8';

  const handleClick = () => {
    track('home_page_party_clicked', {
      party: party.party_id,
      context: contextId,
    });
  };

  return (
    <Link
      href={`/${contextId}/session?party_id=${party.party_id}`}
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col items-center gap-3 rounded-xl px-2 pb-4 pt-5 outline-none md:px-5',
        'focus-visible:ring-2 focus-visible:ring-ring',
        side === 'left' ? 'animate-face-off-left' : 'animate-face-off-right',
      )}
      aria-label={`Iniciar chat con ${party.name}`}
    >
      {/* Extra flag pigment on hover, on top of the shared tricolor backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-60"
        style={{
          background:
            side === 'left'
              ? `linear-gradient(105deg, color-mix(in srgb, ${washColor} ${washStrength}%, transparent) 0%, transparent 95%)`
              : `linear-gradient(255deg, color-mix(in srgb, ${washColor} ${washStrength}%, transparent) 0%, transparent 95%)`,
        }}
      />

      <div
        className={cn(
          'relative size-28 shrink-0 overflow-hidden rounded-xl border border-muted-foreground/20 shadow-sm md:size-40',
          'transition-transform duration-300 ease-out group-hover:scale-[1.04]',
        )}
        style={{ backgroundColor: color }}
      >
        <Image
          alt=""
          aria-hidden="true"
          blurDataURL={hexDataURL(color)}
          src={buildPartyImageUrl(party.party_id)}
          placeholder="blur"
          sizes="(min-width: 768px) 10rem, 7rem"
          className="object-contain"
          fill
        />
      </div>

      <div className="relative flex min-w-0 grow flex-col items-center gap-1 text-center">
        {party.candidate && (
          <span className="text-balance text-sm font-bold leading-snug text-foreground md:text-base">
            {party.candidate}
          </span>
        )}
        <span
          className={cn(
            'mt-auto rounded-full border border-muted-foreground/30 px-3 py-0.5 text-xs font-medium text-foreground',
            'transition-colors duration-200 group-hover:bg-foreground group-hover:text-background',
          )}
        >
          Chatear
        </span>
      </div>
    </Link>
  );
}

export function SecondRoundFaceOff({ contextId }: Props) {
  const { parties } = useElectionContext();

  // Deterministic order so left/right doesn't change between visits
  // (reverse alphabetical puts Pacto left and ADLE right, matching the
  // yellow-to-red flow of the flag backdrop)
  const [left, right] = useMemo(
    () =>
      [...(parties ?? [])].sort((a, b) => b.party_id.localeCompare(a.party_id)),
    [parties],
  );

  if (!left || !right) {
    return null;
  }

  const compareSearchParams = new URLSearchParams();
  compareSearchParams.append('party_id', left.party_id);
  compareSearchParams.append('party_id', right.party_id);
  const compareHref = `/${contextId}/session?${compareSearchParams.toString()}`;

  const handleCompareClick = () => {
    track('home_page_compare_clicked', {
      party_ids: `${left.party_id},${right.party_id}`,
      context: contextId,
    });
  };

  return (
    <section
      className="flex w-full flex-col gap-3"
      aria-label="Segunda vuelta presidencial: escoge una candidatura y chatea"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-stretch p-2 md:p-3">
          {/* Continuous flag backdrop: yellow into blue into red, fading down */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              background: `linear-gradient(100deg, color-mix(in srgb, ${FLAG_YELLOW} 60%, transparent) 0%, color-mix(in srgb, ${FLAG_YELLOW} 28%, transparent) 32%, color-mix(in srgb, ${FLAG_BLUE} 26%, transparent) 50%, color-mix(in srgb, ${FLAG_RED} 28%, transparent) 68%, color-mix(in srgb, ${FLAG_RED} 55%, transparent) 100%)`,
              maskImage:
                'linear-gradient(to bottom, black 10%, transparent 95%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black 10%, transparent 95%)',
            }}
          />

          <CandidateSide
            party={left}
            side="left"
            washColor={FLAG_YELLOW}
            washStrength={65}
            contextId={contextId}
          />

          {/* VS divider */}
          <div
            className="relative flex items-center justify-center px-1"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 rotate-[14deg]"
              style={{
                background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${FLAG_BLUE} 55%, transparent), transparent)`,
              }}
            />
            <span
              className={cn(
                'relative z-10 flex size-10 items-center justify-center rounded-full md:size-12',
                'border-2 border-background bg-foreground text-sm font-black italic tracking-tighter text-background shadow-lg md:text-base',
                'animate-vs-pop',
              )}
            >
              VS
            </span>
          </div>

          <CandidateSide
            party={right}
            side="right"
            washColor={FLAG_RED}
            contextId={contextId}
          />
        </div>
      </div>

      <Button className="w-full whitespace-normal" size="lg" asChild>
        <Link
          href={compareHref}
          onClick={handleCompareClick}
          aria-label={`Comparar a ${left.name} y ${right.name} en un chat conjunto`}
        >
          <SwordsIcon aria-hidden="true" />
          <span className="flex items-center -space-x-1.5" aria-hidden="true">
            {[left, right].map((party) => (
              <span
                key={party.party_id}
                className="relative size-5 overflow-hidden rounded-full border border-background"
                style={{
                  backgroundColor: party.background_color ?? '#d4d4d8',
                }}
              >
                <Image
                  alt=""
                  src={buildPartyImageUrl(party.party_id)}
                  sizes="1.25rem"
                  className="object-contain"
                  fill
                />
              </span>
            ))}
          </span>
          Compáralos frente a frente
        </Link>
      </Button>
    </section>
  );
}

export function SecondRoundFaceOffSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3" aria-hidden="true">
      <div className="h-[264px] w-full animate-pulse rounded-2xl border border-border bg-muted md:h-[300px]" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export default SecondRoundFaceOff;
