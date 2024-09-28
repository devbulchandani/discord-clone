"use client";
import { useEffect, useState } from "react";

import {
    VideoConference,
    LiveKitRoom,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({
    chatId,
    video,
    audio
}: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) {
            return;
        }
        const name = `${user.firstName} ${user.lastName}`;
        (async () => {
            try {
                const resp = await fetch(
                    `/api/get-participant-token?room=${chatId}&username=${name}`
                );
                if (!resp.ok) {
                    throw new Error("Failed to fetch token");
                }
                const data = await resp.json();
                console.log("Data: " + JSON.stringify(data));
                console.log("Token received: ", data.token); // Log the token
                setToken(data.token);
            } catch (e) {
                console.error("Error fetching token: ", e);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);



    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>);
    }

    return (
        <LiveKitRoom
            video={video}
            audio={audio}
            token={token}
            connect={true}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
        >
            <VideoConference />
        </LiveKitRoom>
    )
}