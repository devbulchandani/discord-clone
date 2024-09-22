"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerForm } from "../forms/server-form";
import { ChannelForm } from "../forms/channel-form";


export function CreateChannelModal() {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "createChannel";

    const { channelType } = data


    const handleClose = () => {
        onClose();
    };

    return (
        <div className="z-40">
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Create Channel
                        </DialogTitle>
                    </DialogHeader>
                    <ChannelForm channelType={channelType} />
                </DialogContent>
            </Dialog>
        </div>

    );
}