"use client";

import React, { useState } from "react";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerForm } from "../forms/server-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckIcon, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";


export function InviteModal() {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const { server } = data;
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }

    const onNew = async () => {
        try {
            setIsLoading(true);
            const res = await axios.patch(`/api/server/${server?.id}/invite-code`)

            onOpen('invite', {server: res.data});
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }


    const handleClose = () => {
        onClose();
    };

    return (
        <div className="z-40">
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Invite Friends
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Server Invite Url
                        </Label>
                        <div className="flex items-center mt-2 gap-x-2">
                            <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                value={inviteUrl}
                                disabled={isLoading}
                            />

                            <Button disabled={isLoading} onClick={onCopy} size="icon">
                                {copied
                                    ? <CheckIcon className="w-4 h-4" />
                                    : <Copy className="w-4 h-4" />}
                            </Button>

                        </div>

                        <Button
                            onClick={onNew}
                            variant='link'
                            size='sm'
                            className="text-xs text-zinc-500 mt-4"
                            disabled={isLoading}
                        >
                            Generate a new link
                            <RefreshCw className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>
        </div>

    );
}