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

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=> {
        setIsMounted(true)
    }, [])

    if (!isMounted){
        return null
    }

    return (
        <div>
            <Dialog open>
                <DialogContent className='bg-white text-black p-0 sm:max-w-[425px] overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        <DialogTitle className='text-2xl text-center font-bold'>
                            Customize your server
                        </DialogTitle>

                        <DialogDescription className='text-center text-zinc-500'>
                            Give your server a personality with a name and an image. You can always change it later.
                        </DialogDescription>
                    </DialogHeader>

                    <ServerForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}