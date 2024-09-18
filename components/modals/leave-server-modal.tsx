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

export function LeaveServerModal() {
    const router = useRouter()
    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;

    const isModalOpen = isOpen && type === "leaveServer";

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/server/${server?.id}/leave`)

            onClose();

            router.refresh();
            router.push("/");
            window.location.reload();

        }catch (e){
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
                            Leave Server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                            Are you sure you want to leave <span className="font-semibold text-indigo-500">
                                {server?.name}
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