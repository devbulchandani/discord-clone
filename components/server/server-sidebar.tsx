import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import { RedirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from '@prisma/client';
import ServerHeader from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { channel } from 'diagnostics_channel';


interface ServerSidebarProps {
    serverId: string;
}

interface ServerSearchProps{
    data: {
        label: string;
        type: "channel" | "member",
        data: {
            icon: React.ReactNode,
            name: string;
            id: string;
        }[] | undefined
    }[]
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: <></>, // Return a valid ReactNode even if empty
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: (
        <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
    ),
};
const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile();
    if (!profile) {
        return <RedirectToSignIn />
    }
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) =>
        channel.type === ChannelType.TEXT
    );
    const audioChannels = server?.channels.filter((channel) =>
        channel.type === ChannelType.AUDIO
    );
    const videoChannels = server?.channels.filter((channel) =>
        channel.type === ChannelType.VIDEO
    );
    const members = server?.members.filter((member) =>
        member.profileId !== profile.id
    );

    if (!server) {
        redirect('/')
    }

    const role = server.members.find((members) =>
        members.profileId === profile.id
    )?.role;


    const ServerSearchData: ServerSearchProps["data"] = [
        {
            label: "Text Channels",
            type: "channel",
            data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
            })),
        },
        {
            label: "Voice Channels",
            type: "channel",
            data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
            })),
        },
        {
            label: "Video Channels",
            type: "channel",
            data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
            })),
        },
        {
            label: "Members",
            type: "member",
            data: members?.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role],
            })),
        },
    ]


    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea
                className='flex-1 px-3'
            >
                <div className="mt-2">
                    <ServerSearch
                        data={ServerSearchData}

                    />
                </div>
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar



