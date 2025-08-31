// 'use client';

// import { ClientSideSuspense, useOthers, useSelf } from '@liveblocks/react/suspense';

// import { Separator } from '@/components/ui/separator';

// const AVATAR_SIZE = 36;

// export const Avatars = () => {
//   return (
//     <ClientSideSuspense fallback={null}>
//       <AvatarStack />
//     </ClientSideSuspense>
//   );
// };

// const AvatarStack = () => {
//   const users = useOthers();
//   const currentUser = useSelf();

//   if (users.length === 0) return null;

//   return (
//     <>
//       <div className="flex items-center">
//         {currentUser && (
//           <div className="relative ml-2">
//             <Avatar src={currentUser.info.avatar} name="You" />
//           </div>
//         )}

//         <div className="flex">
//           {users.map(({ connectionId, info }) => (
//             <Avatar key={connectionId} src={info.avatar} name={info.name} />
//           ))}
//         </div>
//       </div>

//       <Separator orientation="vertical" className="h-6" />
//     </>
//   );
// };

// interface AvatarProps {
//   src: string;
//   name: string;
// }

// const Avatar = ({ src, name }: AvatarProps) => {
//   return (
//     <div
//       className="group relative -ml-2 flex shrink-0 place-content-center rounded-full border-4 border-white bg-gray-400"
//       style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
//     >
//       <div className="absolute top-full z-10 mt-2.5 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
//         {name}
//       </div>

//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img alt={name} src={src} className="size-full rounded-full" />
//     </div>
//   );
// };

// src/app/documents/[documentId]/avatars.tsx
'use client';

import { ClientSideSuspense, useOthers, useSelf } from '@liveblocks/react/suspense';

import { Separator } from '@/components/ui/separator';

// 'use client';

// import { ClientSideSuspense, useOthers, useSelf } from '@liveblocks/react/suspense';

// import { Separator } from '@/components/ui/separator';

// const AVATAR_SIZE = 36;

// export const Avatars = () => {
//   return (
//     <ClientSideSuspense fallback={null}>
//       <AvatarStack />
//     </ClientSideSuspense>
//   );
// };

// const AvatarStack = () => {
//   const users = useOthers();
//   const currentUser = useSelf();

//   if (users.length === 0) return null;

//   return (
//     <>
//       <div className="flex items-center">
//         {currentUser && (
//           <div className="relative ml-2">
//             <Avatar src={currentUser.info.avatar} name="You" />
//           </div>
//         )}

//         <div className="flex">
//           {users.map(({ connectionId, info }) => (
//             <Avatar key={connectionId} src={info.avatar} name={info.name} />
//           ))}
//         </div>
//       </div>

//       <Separator orientation="vertical" className="h-6" />
//     </>
//   );
// };

// interface AvatarProps {
//   src: string;
//   name: string;
// }

// const Avatar = ({ src, name }: AvatarProps) => {
//   return (
//     <div
//       className="group relative -ml-2 flex shrink-0 place-content-center rounded-full border-4 border-white bg-gray-400"
//       style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
//     >
//       <div className="absolute top-full z-10 mt-2.5 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
//         {name}
//       </div>

//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img alt={name} src={src} className="size-full rounded-full" />
//     </div>
//   );
// };

// src/app/documents/[documentId]/avatars.tsx

const AVATAR_SIZE = 36;

type UserInfo = {
  name?: string;
  avatar?: string;
  color?: string;
};

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};

const AvatarStack = () => {
  // Select & type the data we actually use to avoid '{}' errors
  const users = useOthers((others) =>
    others.map((o) => ({
      connectionId: o.connectionId,
      info: o.info as UserInfo | undefined,
    })),
  );

  const currentInfo = useSelf((me) => me.info as UserInfo | undefined);

  if (users.length === 0) return null;

  return (
    <>
      <div className="flex items-center">
        {currentInfo?.avatar && (
          <div className="relative ml-2">
            <Avatar src={currentInfo.avatar} name="You" />
          </div>
        )}

        <div className="flex">
          {users.map(({ connectionId, info }) =>
            info?.avatar ? <Avatar key={connectionId} src={info.avatar} name={info.name ?? 'User'} /> : null,
          )}
        </div>
      </div>

      <Separator orientation="vertical" className="h-6" />
    </>
  );
};

interface AvatarProps {
  src: string;
  name: string;
}

const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      className="group relative -ml-2 flex shrink-0 place-content-center rounded-full border-4 border-white bg-gray-400"
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <div className="absolute top-full z-10 mt-2.5 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={name} src={src} className="size-full rounded-full" />
    </div>
  );
};
