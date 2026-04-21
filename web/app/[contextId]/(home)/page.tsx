import ContactCard from '@/components/home/contact-card';
import ElectionPartySelector from '@/components/home/election-party-selector';
import GitHubCard from '@/components/home/github-card';
import HomeInput from '@/components/home/home-input';
import HowToCard from '@/components/home/how-to-card';
import SupportUsCard from '@/components/home/support-us-card';
import {
  getHomeInputProposedQuestions,
  getProposedQuestionsForContext,
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

  const [homeQuestions, systemStatus] = await Promise.all([
    getHomeInputProposedQuestions(),
    getSystemStatus(),
  ]);
  const homePageQuestions =
    homeQuestions.length > 0
      ? homeQuestions
      : await getProposedQuestionsForContext(contextId);

  return (
    <>
      <div className="mt-4 w-full">
        <ElectionPartySelector contextId={contextId} />
      </div>

      <HomeInput
        className="hidden md:block"
        questions={homePageQuestions}
        initialSystemStatus={systemStatus}
        contextId={contextId}
      />

      {/*{!IS_EMBEDDED && <KnownFrom />}*/}

      {IS_EMBEDDED ? (
        <section className="mt-4">
          <HowToCard />
        </section>
      ) : (
        <section className="grid w-full grid-cols-1 flex-wrap gap-2 md:grid-cols-2 md:gap-2">
          <SupportUsCard />
          <HowToCard />
          <ContactCard />
          <GitHubCard fullWidth={false} />
        </section>
      )}

      <HomeInput
        className="md:hidden"
        questions={homePageQuestions}
        initialSystemStatus={systemStatus}
        contextId={contextId}
      />
    </>
  );
}
