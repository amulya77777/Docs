import { auth, currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';

import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';

// Ensure this route always runs on the Node.js runtime (required by @liveblocks/node)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Validate required env vars early and clearly
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const liveblocksSecret = process.env.LIVEBLOCKS_SECRET_KEY;

    if (!convexUrl) {
      return NextResponse.json({ error: 'Server misconfiguration: NEXT_PUBLIC_CONVEX_URL missing' }, { status: 500 });
    }

    if (!liveblocksSecret) {
      return NextResponse.json({ error: 'Server misconfiguration: LIVEBLOCKS_SECRET_KEY missing' }, { status: 500 });
    }

    if (!liveblocksSecret.startsWith('sk_')) {
      return NextResponse.json(
        { error: 'Server misconfiguration: LIVEBLOCKS_SECRET_KEY must be a secret key (starts with "sk_")' },
        { status: 500 },
      );
    }

    // Lazy initialize SDKs to avoid module-level crashes when envs are missing
    const convex = new ConvexHttpClient(convexUrl);
    const liveblocks = new Liveblocks({ secret: liveblocksSecret });

    const { sessionClaims } = await auth();
    const user = await currentUser();

    if (!sessionClaims || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body defensively; return JSON errors if invalid
    let room: string | undefined;
    try {
      const body = await req.json();
      room = body?.room;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!room || typeof room !== 'string') {
      return NextResponse.json({ error: 'Missing room id' }, { status: 400 });
    }

    const docIdStr = room.replace(/^(doc:|room:)/, '');
    const docId = docIdStr as Id<'documents'>;

    const document = await convex.query(api.documents.getById, { id: docId });

    if (!document) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isOwner = document.ownerId === user.id;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === sessionClaims.org_id);

    if (!isOwner && !isOrganizationMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Anonymous';
    const nameToNumber = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name,
        avatar: user.imageUrl,
        color,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    return new NextResponse(body, { status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
