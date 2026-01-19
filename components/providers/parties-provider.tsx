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
  // Try context provider first, fall back to PartiesProvider
  let contextParties: PartyDetails[] | undefined;
  try {
    const electionContext = useElectionContext();
    contextParties = electionContext.parties;
  } catch {
    // Context provider not available, try PartiesProvider
    const legacyContext = useContext(PartiesContext);
    contextParties = legacyContext?.parties;
  }

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
