import type { WahlChatUser } from '@/components/anonymous-auth';
import type {
  GroupedMessage,
  MessageFeedback,
  MessageItem,
  VotingBehavior,
} from '@/lib/stores/chat-store.types';
import { firestoreTimestampToDate, generateUuid } from '@/lib/utils';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
import type { ChatSession, LlmSystemStatus } from './firebase.types';
import type {ProlificMetadata} from "@/lib/prolific-study/prolific-metadata";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

export async function createChatSession(
  userId: string,
  partyIds: string[],
  sessionId: string,
  tenantId?: string,
  contextId?: string,
  prolificMetadata?: ProlificMetadata,
): Promise<void> {
  await setDoc(doc(db, 'chat_sessions', sessionId), {
    user_id: userId,
    party_ids: partyIds,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
    ...(tenantId ? { tenant_id: tenantId } : {}),
    ...(contextId ? { context_id: contextId } : {}),
    ...(prolificMetadata
      ? { prolific_metadata: prolificMetadata, is_prolific_study: true }
      : {}),
  });
}

export async function getUsersChatHistory(uid: string): Promise<ChatSession[]> {
  const history = await getDocs(
    query(
      collection(db, 'chat_sessions'),
      where('user_id', '==', uid),
      orderBy('updated_at', 'desc'),
      orderBy('created_at', 'desc'),
      limit(30),
    ),
  );

  return history.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatSession[];
}

export function listenToHistory(
  uid: string,
  callback: (history: ChatSession[]) => void,
) {
  const unsubscribe = onSnapshot(
    query(
      collection(db, 'chat_sessions'),
      where('user_id', '==', uid),
      orderBy('updated_at', 'desc'),
      orderBy('created_at', 'desc'),
      limit(15),
    ),
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatSession[],
      );
    },
  );

  return unsubscribe;
}

export function listenToSystemStatus(
  callback: (status: LlmSystemStatus) => void,
) {
  const unsubscribe = onSnapshot(
    doc(db, 'system_status', 'llm_status'),
    (snapshot) => {
      callback({
        is_at_rate_limit: snapshot.data()?.is_at_rate_limit ?? false,
      });
    },
  );

  return unsubscribe;
}

export async function getChatSession(sessionId: string) {
  const session = await getDoc(doc(db, 'chat_sessions', sessionId));
  return {
    id: session.id,
    ...session.data(),
  } as ChatSession;
}

export async function getChatSessionMessages(sessionId: string) {
  const messagesRef = query(
    collection(db, 'chat_sessions', sessionId, 'messages'),
    orderBy('created_at', 'asc'),
  );

  const snapshot = await getDocs(messagesRef);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      messages: data.messages.map((message: MessageItem) => ({
        ...message,
        created_at: firestoreTimestampToDate(message.created_at),
      })),
    } as GroupedMessage;
  });
}

export async function updateChatSession(
  sessionId: string,
  data: Partial<ChatSession>,
) {
  await updateDoc(doc(db, 'chat_sessions', sessionId), data);
}

export async function addMessageToGroupedMessageOfChatSession(
  sessionId: string,
  groupedMessageId: string,
  message: MessageItem,
) {
  await setDoc(
    doc(db, 'chat_sessions', sessionId, 'messages', groupedMessageId),
    {
      id: groupedMessageId,
      messages: arrayUnion(message),
      created_at: Timestamp.now(),
    },
    { merge: true },
  );
}

async function getGroupedMessage(sessionId: string, groupedMessageId: string) {
  const groupedMessage = await getDoc(
    doc(db, 'chat_sessions', sessionId, 'messages', groupedMessageId),
  );
  return {
    id: groupedMessage.id,
    ...groupedMessage.data(),
  } as GroupedMessage;
}

export async function addProConPerspectiveToMessage(
  sessionId: string,
  groupedMessageId: string,
  messageId: string,
  proConPerspective: MessageItem,
) {
  const groupedMessage = await getGroupedMessage(sessionId, groupedMessageId);

  const groupedMessageRef = doc(
    db,
    'chat_sessions',
    sessionId,
    'messages',
    groupedMessageId,
  );

  await updateDoc(groupedMessageRef, {
    messages: groupedMessage.messages.map((message: MessageItem) => {
      if (message.id === messageId) {
        return {
          ...message,
          pro_con_perspective: proConPerspective,
        };
      }

      return message;
    }),
  });
}

export async function addVotingBehaviorToMessage(
  sessionId: string,
  groupedMessageId: string,
  messageId: string,
  votingBehavior: VotingBehavior,
) {
  const groupedMessage = await getGroupedMessage(sessionId, groupedMessageId);

  const groupedMessageRef = doc(
    db,
    'chat_sessions',
    sessionId,
    'messages',
    groupedMessageId,
  );

  await updateDoc(groupedMessageRef, {
    messages: groupedMessage.messages.map((message: MessageItem) => {
      if (message.id === messageId) {
        return {
          ...message,
          voting_behavior: votingBehavior,
        };
      }

      return message;
    }),
  });
}

export async function addUserMessageToChatSession(
  sessionId: string,
  message: string,
) {
  const messageId = generateUuid();

  await setDoc(doc(db, 'chat_sessions', sessionId, 'messages', messageId), {
    id: messageId,
    messages: [
      {
        id: generateUuid(),
        content: message,
        sources: [],
        created_at: Timestamp.now(),
        role: 'user',
      },
    ],
    quick_replies: [],
    role: 'user',
    created_at: Timestamp.now(),
  } satisfies GroupedMessage);
}

export async function updateQuickRepliesOfMessage(
  sessionId: string,
  messageId: string,
  quickReplies: string[],
) {
  // Use setDoc with merge to handle race condition where quick_replies_and_title_ready
  // fires before the message document is created by party_response_complete
  await setDoc(
    doc(db, 'chat_sessions', sessionId, 'messages', messageId),
    { quick_replies: quickReplies },
    { merge: true },
  );
}

export async function updateTitleOfMessage(sessionId: string, title: string) {
  await updateDoc(doc(db, 'chat_sessions', sessionId), {
    title,
  });
}

export async function updateMessageInChatSession(
  sessionId: string,
  messageId: string,
  data: Partial<GroupedMessage>,
) {
  await updateDoc(
    doc(db, 'chat_sessions', sessionId, 'messages', messageId),
    data,
  );
}

export async function updateMessageFeedback(
  sessionId: string,
  groupedMessageId: string,
  messageId: string,
  feedback: MessageFeedback,
) {
  const groupedMessage = await getGroupedMessage(sessionId, groupedMessageId);

  const groupedMessageRef = doc(
    db,
    'chat_sessions',
    sessionId,
    'messages',
    groupedMessageId,
  );

  await updateDoc(groupedMessageRef, {
    messages: groupedMessage.messages.map((message: MessageItem) => {
      if (message.id === messageId) {
        return {
          ...message,
          feedback,
        };
      }

      return message;
    }),
  });
}

export async function getUser(uid: string) {
  const user = await getDoc(doc(db, 'users', uid));

  const data = user.data();

  return {
    id: user.id,
    ...data,
    survey_status: data?.survey_status
      ? {
          state: data.survey_status.state,
          timestamp: firestoreTimestampToDate(data.survey_status.timestamp),
        }
      : undefined,
  } as WahlChatUser;
}

export async function updateUser(uid: string, data: Partial<WahlChatUser>) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function userAllowNewsletter(uid: string, allowed: boolean) {
  await setDoc(
    doc(db, 'users', uid),
    {
      newsletter_allowed: allowed,
    },
    { merge: true },
  );
}
