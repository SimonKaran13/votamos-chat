import ContactCard from '@/components/home/contact-card';
import ElectionPartySelector from '@/components/home/election-party-selector';
import GitHubCard from '@/components/home/github-card';
import HomeInput from '@/components/home/home-input';
import HowToCard from '@/components/home/how-to-card';
import KnownFrom from '@/components/home/known-from';
import OpenCallCard, {
  getAvailableOpenCallUrl,
} from '@/components/home/open-call-card';
import {
  getHomeInputProposedQuestions,
  getSystemStatus,
} from '@/lib/firebase/firebase-server';
import { IS_EMBEDDED } from '@/lib/utils';

type Props = {
  params: Promise<{
    contextId: string;
  }>;
};

export default async function ContextHome({ params }: Props) {
  const { contextId } = await params;

  const [wahlChatQuestions, systemStatus, openCallUrl] = await Promise.all([
    getHomeInputProposedQuestions(),
    getSystemStatus(),
    getAvailableOpenCallUrl(),
  ]);

  return (
    <>
      <div className="mt-4 w-full">
        <ElectionPartySelector contextId={contextId} />
      </div>

      <HomeInput
        className="hidden md:block"
        questions={wahlChatQuestions}
        initialSystemStatus={systemStatus}
        contextId={contextId}
      />

      {!IS_EMBEDDED && <KnownFrom />}

      {IS_EMBEDDED ? (
        <section className="mt-4">
          <HowToCard />
        </section>
      ) : (
        <section className="grid w-full grid-cols-1 flex-wrap gap-2 md:grid-cols-2 md:gap-2">
          <ContactCard />
          <GitHubCard fullWidth={!openCallUrl} />
          {openCallUrl && <OpenCallCard url={openCallUrl} />}
          <HowToCard />
        </section>
      )}

      <HomeInput
        className="md:hidden"
        questions={wahlChatQuestions}
        initialSystemStatus={systemStatus}
        contextId={contextId}
      />
    </>
  );
}
