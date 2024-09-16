"use client"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import axios from "axios"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '../ui/dialog'
import { FileUpload } from '../file-upload'
import { useRouter } from 'next/navigation'
import { Server } from '@prisma/client';
import { useEffect } from 'react'

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required"
    }),

    imageUrl: z.string().min(1, {
        message: "Server image is required"
    }),
})

interface ServerFormProps {
    server?: Server
}

export const ServerForm = ({ server }: ServerFormProps) => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    })

    useEffect(() => {
        if (server) {
            form.setValue('name', server.name);
            form.setValue('imageUrl', server.imageUrl);
        }
    }, [server, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (server) {
                // Handle update logic (onSave)
                await axios.patch(`/api/server/${server?.id}`, values);
            } else {
                // Handle creation logic (onSubmit)
                await axios.post("/api/server", values);
            }

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Form {...form}> 
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className="space-y-8 px-6">
                    <div className="flex items-center justify-center text-center">
                        <FormField
                            control={form.control}
                            name='imageUrl'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="serverImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                    Server Name
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                        placeholder='Enter Server Name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <Button variant='primary' disabled={isLoading}>
                        {server ? 'Save' : 'Create'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
