"use client";

import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";

import axios from "axios";
import { useRouter } from "next/navigation";

export function DeleteServerModal() {
    const router = useRouter()
    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;

    const isModalOpen = isOpen && type === "deleteServer";

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/server/${server?.id}`)

            onClose();

            router.refresh();
            router.push("/");
            window.location.reload();

        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="z-40">
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Delete Server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                            Are you sure you want to do this? <br />
                            <span className="font-semibold text-indigo-500">
                                {server?.name} will be permanently deleted
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between w-full">
                            <Button
                                disabled={isLoading}
                                onClick={onClose}
                                variant='ghost'
                            >
                                Cancel
                            </Button>

                            <Button
                                disabled={isLoading}
                                onClick={onClick}
                                variant='primary'
                            >
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </div>

    );
}