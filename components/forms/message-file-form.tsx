"use client"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import axios from "axios"
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
import { useRouter } from 'next/navigation'



const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachments required"
    }),
})



export const MessageFileForm = ({apiUrl, query, onClose}: {
    apiUrl?: string;
    query?: Record<string, any>;
    onClose: () => void;
}) => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });
            form.reset();
            router.refresh();
            onClose();
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
                            name='fileUrl'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="messageFile"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <Button variant='primary' disabled={isLoading}>
                        Send
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
