'use client'

import { eventFormSchema } from "@/schema/events"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useTransition } from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
export default function EventForm({ event, }: {

    event?: {
        id: string
        name: string
        description?: string
        durationInMinutes: number
        isActive: boolean
    }
}
) {
    const router = useRouter()
    const [isDeletePending, startDeleteTransition] = useTransition()
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event
            ? {
                ...event,
            } : {
                isActive: true, durationInMinutes: 30,
                description: '',
                name: ''
            }
    })
    // async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    //     const action = event == null ? createEvent : updateEvent.bind(null, event.id)
    //     const data = await action(values)
    //     if (data?.error) {
    //         form.setError('root', {
    //             message: 'there was an error saving your event'
    //         })
    //     }

    // }
    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action = event == null ? createEvent : updateEvent.bind(null, event.id)
        try {
            await action(values)
            router.push('/events')
        } catch (error: any) {
            form.setError('root', {
                message: `there was an error ${error.message}`
            })
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col">
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                <FormField control={form.control} name='name' render={({ field }) => (
                    <FormItem>
                        <FormLabel>event name</FormLabel>
                        <FormControl>
                            <Input {...field}></Input>
                        </FormControl>
                        <FormDescription>
                            the name users will see
                        </FormDescription>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}>
                </FormField>
                <FormField
                    control={form.control} name='durationInMinutes' render={({ field }) => (
                        <FormItem>
                            <FormLabel>duration</FormLabel>
                            <FormControl>
                                <Input type='number'  {...field}></Input>
                            </FormControl>
                            <FormDescription>in minutes</FormDescription>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                <FormField
                    control={form.control} name='description' render={({ field }) => (
                        <FormItem>
                            <FormLabel>description</FormLabel>
                            <FormControl>
                                <Textarea className='resize-none h-32' {...field}></Textarea>
                            </FormControl>
                            <FormDescription>
                                optional description
                            </FormDescription>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                <FormField control={form.control} name='isActive' render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Switch checked={field.value}
                                    onCheckedChange={field.onChange}></Switch>
                            </FormControl>
                            <FormLabel>active</FormLabel>
                        </div>
                        <FormDescription>
                            inactive events will not be visible
                        </FormDescription>
                    </FormItem>
                )}></FormField>
                <div className="flex gap-2 justify-end">
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className='cursor-pointer hover:scale-105 hover:bg-red-700' variant='destructive'
                                    disabled={isDeletePending || form.formState.isSubmitting}>
                                    delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>are you sure</AlertDialogTitle>
                                    <AlertDialogDescription>this action cannot be undone</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className='bg-red-500 hover:bg-red-700 cursor-pointer'
                                        disabled={isDeletePending || form.formState.isSubmitting}
                                        onClick={() => {
                                            startDeleteTransition(async () => {
                                                try {
                                                    await deleteEvent(event.id)
                                                    router.push('/events')
                                                } catch (error: any) {
                                                    form.setError('root', {
                                                        message: `there was an error deleting: ${error.message}`
                                                    })
                                                }
                                            })
                                        }}>delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button disabled={isDeletePending || form.formState.isSubmitting} type='button'
                        asChild variant='outline'>
                        <Link href='/events'>cancel</Link>
                    </Button>
                    <Button className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600"
                        disabled={isDeletePending || form.formState.isSubmitting} type="submit">save</Button>
                </div>
            </form>
        </Form>
    )
}

