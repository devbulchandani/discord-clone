'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { ServerForm } from '@/components/forms/server-form'
import { useEffect, useState } from 'react'
import { useModal } from '@/hooks/use-modal-store'
import { MessageFileForm } from '../forms/message-file-form'

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === 'messageFile';

    const handleClose = () => {
        onClose();
    }

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className='bg-white text-black p-0 sm:max-w-[425px] overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        Add Attachment
                        <DialogDescription className='text-center text-zinc-500'>
                            Send a file as a message
                        </DialogDescription>
                    </DialogHeader>

                    <MessageFileForm 
                    apiUrl={data.apiUrl} 
                    query={data.query}
                    onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}