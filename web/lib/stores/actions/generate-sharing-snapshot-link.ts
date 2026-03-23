import type { ChatStoreActionHandlerFor } from '@/lib/stores/chat-store.types';

export const generateSharingSnapshotLink: ChatStoreActionHandlerFor<
  'generateSharingSnapshotLink'
> = (get, set) => async () => {
  set((state) => {
    state.sharingSnapshot = undefined;
  });

  throw new Error('Sharing is disabled in this deployment.');
};
