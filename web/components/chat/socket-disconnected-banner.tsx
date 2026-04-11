'use client';

import { useChatStore } from '@/components/providers/chat-store-provider';
import { CircleAlertIcon } from 'lucide-react';

function SocketDisconnectedBanner() {
  const isSocketConnected = useChatStore((state) => state.socket.connected);

  if (isSocketConnected === true || isSocketConnected === undefined)
    return null;

  return (
    <div className="flex items-center justify-center bg-red-500 py-2 text-center text-xs text-white">
      <CircleAlertIcon className="mr-2 size-4" />
      El chat no está disponible. Espera un momento o recarga la página.
    </div>
  );
}

export default SocketDisconnectedBanner;
