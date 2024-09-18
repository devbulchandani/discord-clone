import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type PatchRequestBody = {
    name: string;
    imageUrl: string;
}

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
        });

        return NextResponse.json(server);

    } catch (err: any) {
        console.error("[SERVER_ID_DELETE]:", err.message || err);
        
        if (err.name === 'PrismaClientKnownRequestError') {
            return new NextResponse("Database error", { status: 500 });
        }

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        // Fetch the current authenticated profile
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Parse the request body
        const { name, imageUrl }: PatchRequestBody = await req.json();

        // Update the server with the new data
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });
        
        return NextResponse.json(server);

    } catch (err: any) {
        console.error("[SERVER_ID_CRASH]:", err.message || err);
        
        if (err.name === 'PrismaClientKnownRequestError') {
            return new NextResponse("Database error", { status: 500 });
        }

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
