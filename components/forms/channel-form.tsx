"use client"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import axios from "axios"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import qs from 'query-string'

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
import { useParams, useRouter } from 'next/navigation'
import { ChannelType, Server } from '@prisma/client';
import { useEffect } from 'react'


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general'"
        }
    ),

    type: z.nativeEnum(ChannelType)
})




export const ChannelForm = ({ channelType }: { channelType?: ChannelType }) => {
    const router = useRouter();
    const params = useParams();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || ChannelType.TEXT 
        }
    })

    useEffect(() => {
        if (channelType){
            form.setValue("type", channelType);
        } else {
            form.setValue("type", ChannelType.TEXT);
        }
    }, [channelType, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels`,
                query: {
                    serverId: params?.serverId
                }
            })
            await axios.post(url, values);
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
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                    Channel Name
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                        placeholder='Enter Channel Name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                >Channel Type</FormLabel>
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'
                                        >
                                            <SelectValue placeholder="Select a Channel Type" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {Object.values(ChannelType).map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className='capitalize'
                                            >
                                                {type.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>


                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <Button variant='primary' disabled={isLoading}>
                        Create
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
