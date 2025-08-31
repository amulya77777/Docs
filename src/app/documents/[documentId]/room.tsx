'use client';

import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense';
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { Id } from '@/../convex/_generated/dataModel';
import { FullscreenLoader } from '@/components/fullscreen-loader';
import { editorMargin } from '@/config/editor';

import { getDocuments, getUsers } from './actions';

interface RoomProps {
  roomId: string;
}

type User = { id: string; name: string; avatar: string; color: string };

export const Room = ({ children, roomId }: PropsWithChildren<RoomProps>) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list.map((list) => ({ ...list, color: '' })));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to fetch users!');
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      authEndpoint={async () => {
        const endpoint = '/api/liveblocks-auth';
        const room = roomId;

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            cache: 'no-store',
            body: JSON.stringify({ room }),
          });

          const text = await response.text();

          if (!response.ok) {
            throw new Error(`Liveblocks auth HTTP ${response.status}: ${text || response.statusText}`);
          }

          try {
            return JSON.parse(text);
          } catch {
            throw new Error('Liveblocks auth failed: non-JSON response from server');
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown network error';
          throw new Error(`Liveblocks Authentication failed: ${message}`);
        }
      }}
      throttle={16}
      resolveUsers={({ userIds }) => {
        return userIds.map((userId) => users.find((user) => user.id === userId) ?? undefined);
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()));
        }

        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<'documents'>[]);

        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider id={roomId} initialStorage={{ leftMargin: editorMargin, rightMargin: editorMargin }}>
        <ClientSideSuspense fallback={<FullscreenLoader label="Loading Document..." />}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};



// "use client";

// import { ReactNode } from "react";
// import {
//   LiveblocksProvider,
//   RoomProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense";

// export function Room({ children }: { children: ReactNode }) {

//   const params = useParams();

//   return (
//     <LiveblocksProvider publicApiKey={"pk_dev_vmw91Eyvtk4aF6rCMcRYshbr_bribiS9vEzDfPdTVtuQttRR5GzcL7_ronIpLUK4"}>
//       <RoomProvider id={params.documentId as string}>
//         <ClientSideSuspense fallback={<div>Loading…</div>}>
//           {children}
//         </ClientSideSuspense>
//       </RoomProvider>
//     </LiveblocksProvider>
//   );
// }