export const dynamic = 'force-dynamic';


import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { DirectMessage, Message } from "@prisma/client";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(
    req: Request,
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get('cursor');
        const conversationId = searchParams.get('conversationId');

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation Id Missing", { status: 400 });
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            console.log("Cursor:", cursor);
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        }
        // console.log("Messages: " + messages);

        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor,
        });

    } catch (err) {
        console.error('[DIRECT_MESSAGES_GET]', err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
