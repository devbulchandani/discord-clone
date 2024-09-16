"use client";

import React, { useEffect } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerForm } from "../forms/server-form";


export function EditServerModal() {
    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;
    const isModalOpen = isOpen && type === "editServer";


    const handleClose = () => {
        onClose();
    };

    return (
        <div className="z-40">
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Edit your server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                            Give your server a personality with a name and an image. You can
                            always change it later.
                        </DialogDescription>
                    </DialogHeader>
                    <ServerForm server={server}/>
                </DialogContent>
            </Dialog>
        </div>

    );
}