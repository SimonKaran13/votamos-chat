'use client';

import { useAnonymousAuth } from '@/components/anonymous-auth';
import { useChatStore } from '@/components/providers/chat-store-provider';
import { useCurrentContext } from '@/components/providers/context-provider';
import type { ProposedQuestion } from '@/lib/firebase/firebase.types';
import type { PartyDetails } from '@/lib/party-details';
import { buildPartyImageUrl } from '@/lib/utils';
import Image from 'next/image';
import GroupChatEmptyView from './group-chat-empty-view';
import InitialSuggestionBubble from './initial-suggestion-bubble';
import Logo from './logo';

type Props = {
  parties?: PartyDetails[];
  proposedQuestions?: ProposedQuestion[];
};

function ChatEmptyView({ parties, proposedQuestions }: Props) {
  const { user } = useAnonymousAuth();
  const addUserMessage = useChatStore((state) => state.addUserMessage);
  const currentContext = useCurrentContext({ optional: true });
  const currentContextName = currentContext?.name ?? 'esta elección';

  function handleSuggestionClick(suggestion: string) {
    if (!user?.uid) return;

    addUserMessage(user.uid, suggestion);
  }

  if (parties && parties.length > 1) {
    return (
      <GroupChatEmptyView
        parties={parties}
        proposedQuestions={proposedQuestions}
      />
    );
  }

  const party = parties?.[0];

  return (
    <div className="flex grow flex-col items-center justify-center gap-4 px-8">
      <div
        style={{ backgroundColor: party?.background_color }}
        className="relative flex size-28 items-center justify-center rounded-md border border-muted-foreground/20 bg-background md:size-36"
      >
        {party ? (
          <Image
            alt={party.name}
            src={buildPartyImageUrl(party.party_id)}
            fill
            sizes="(max-width: 768px) 40vw, 20vw"
            className="object-contain p-4"
          />
        ) : (
          <Logo className="size-full p-4" />
        )}
      </div>
      {party ? (
        <p className="text-center">
          Hazle preguntas al programa de gobierno de{' '}
          <span className="font-semibold">{party.name}</span> y compara sus
          respuestas con las de otras candidaturas.
        </p>
      ) : (
        <p className="text-center">
          Haz preguntas sobre cualquier tema relacionado con{' '}
          <span className="font-semibold">{currentContextName}</span> o consulta
          directamente a las candidaturas sobre sus posiciones en el programa de
          gobierno.
        </p>
      )}
      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {proposedQuestions?.map((question) => (
          <InitialSuggestionBubble
            key={question.id}
            onClick={() => handleSuggestionClick(question.content)}
          >
            {question.content}
          </InitialSuggestionBubble>
        ))}
      </div>
    </div>
  );
}

export default ChatEmptyView;
