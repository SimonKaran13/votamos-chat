import {
  getCurrentUser,
  getUsersChatSessions,
} from '@/lib/firebase/firebase-server';
import SidebarHistory from './sidebar-history';

type Props = {
  contextId: string;
};

async function getChatHistory() {
  const user = await getCurrentUser();
  if (!user) return;

  return getUsersChatSessions(user.uid);
}

async function SidebarHistorySr({ contextId }: Props) {
  const history = await getChatHistory();

  return <SidebarHistory history={history} contextId={contextId} />;
}

export default SidebarHistorySr;
