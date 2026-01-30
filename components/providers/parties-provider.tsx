'use client';
import type { PartyDetails } from '@/lib/party-details';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useElectionContext } from './context-provider';

type PartiesContextType = {
  parties?: PartyDetails[];
  partyCount: number;
};

export const PartiesContext = createContext<PartiesContextType | undefined>(
  undefined,
);

export type Props = {
  children: React.ReactNode;
  parties: PartyDetails[];
};

export const useParties = (partyIds?: string[]) => {
  // Always call both hooks unconditionally to satisfy rules-of-hooks
  const electionContext = useElectionContext({ optional: true });
  const legacyContext = useContext(PartiesContext);

  // Prefer election context parties, fall back to legacy context
  const contextParties = electionContext?.parties ?? legacyContext?.parties;

  const parties = useMemo(() => {
    if (partyIds && contextParties) {
      return contextParties.filter((p) => partyIds.includes(p.party_id));
    }
    return contextParties;
  }, [contextParties, partyIds]);

  return parties;
};

export const useParty = (partyId: string) => {
  const parties = useParties([partyId]);

  if (!parties) {
    return undefined;
  }

  return parties[0];
};

export const PartiesProvider = ({ children, parties }: Props) => {
  const [randomizedParties, setRandomizedParties] = useState<
    PartyDetails[] | undefined
  >();

  useEffect(() => {
    setRandomizedParties([...parties].sort(() => Math.random() - 0.5));
  }, [parties]);

  return (
    <PartiesContext.Provider
      value={{ parties: randomizedParties, partyCount: parties?.length }}
    >
      {children}
    </PartiesContext.Provider>
  );
};
