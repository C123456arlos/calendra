'use client'

import { meetingFormSchema } from "@/schema/meetings"
import { createMeeting } from "@/server/actions/meetings"
import { zodResolver } from "@hookform/resolvers/zod"
import { toZonedTime } from "date-fns-tz"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { SelectTrigger } from "@radix-ui/react-select"
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select"
import { formatDate, formatTimeString, formatTimezoneOffset } from "@/lib/formatters"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import Link from "next/link"
import { Input } from "../ui/input"
import { isSameDay } from "date-fns"
import Booking from "../Booking"


export default function MeetingForm({
    validTimes, eventId, clerkUserId
}: {
    validTimes: Date[]
    eventId: string
    clerkUserId: string
}) {
    const router = useRouter()
    const form = useForm<z.infer<typeof meetingFormSchema>>({
        resolver: zodResolver(meetingFormSchema),
        defaultValues: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            guestName: '',
            guestEmail: '',
            guestNotes: ''
        }
    })
    const timezone = form.watch('timezone')
    const date = form.watch('date')
    const validTimesInTimezone = useMemo(() => {
        return validTimes.map(date => toZonedTime(date, timezone))
    }, [validTimes, timezone])
    async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
        try {
            const meetingData = await createMeeting({
                ...values, eventId, clerkUserId
            })
            const path = `/book/${meetingData.clerkUserId}/${meetingData.eventId}/success?startTime=${meetingData.startTime.toISOString()}`
            router.push(path)
        } catch (error: any) {
            form.setError('root', {
                message: `there was an unknown error: ${error.message}`
            })
        }
    }
    if (form.formState.isSubmitting) return <Booking></Booking>
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col">
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                <FormField
                    control={form.control}
                    name='timezone' render={({ field }) => (
                        <FormItem>
                            <FormLabel>timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue></SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Intl.supportedValuesOf('timeZone').map(timezone => (
                                        <SelectItem key={timezone} value={timezone}>
                                            {timezone}{`(${formatTimezoneOffset(timezone)})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                <div className="flex gap-4 flex-col md:flex-row">
                    <FormField control={form.control} name='date' render={({ field }) => (
                        <Popover>
                            <FormItem className='flex-1'>
                                <FormLabel>date</FormLabel>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant='outline'
                                            className={cn('pl-3 text-left font-normal flex w-full',
                                                !field.value && 'text-muted-foreground'
                                            )}>
                                            {field.value ? (formatDate(field.value)) : (
                                                <span>pick date</span>
                                            )}
                                            <CalendarIcon className='ml-auto h-4 opacity-50'></CalendarIcon>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single' selected={field.value} onSelect={field.onChange}
                                        disabled={date => !validTimesInTimezone.some(time =>
                                            isSameDay(date, time)
                                        )} initialFocus></Calendar>
                                </PopoverContent>
                                <FormMessage></FormMessage>
                            </FormItem>
                        </Popover>
                    )}></FormField>
                    <FormField control={form.control} name='startTime' render={({ field }) =>
                    (<FormItem className='flex-1'>
                        <FormLabel>time</FormLabel>
                        <Select disabled={date == null || timezone == null}
                            onValueChange={value => field.onChange(new Date(Date.parse(value)))} defaultValue={field.value?.toISOString()}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={date == null || timezone == null ? 'select a date/timezone' : 'select time'}></SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {validTimesInTimezone.filter(time => isSameDay(time, date)).map(time => (
                                    <SelectItem key={time.toISOString()} value={time.toISOString()}>
                                        {formatTimeString(time)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage></FormMessage>
                    </FormItem>)}></FormField>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                    <FormField control={form.control} name='guestName' render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormLabel>your name</FormLabel>
                            <FormControl>
                                <Input {...field}></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                    <FormField control={form.control} name='guestEmail' render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormLabel>your email</FormLabel>
                            <FormControl>
                                <input type="email" {...field}></input>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                </div>
                <FormField control={form.control} name='guestNotes' render={({ field }) => (
                    <FormItem>
                        <FormLabel>notes</FormLabel>
                        <FormControl>
                            <Textarea className='resize-none' {...field}></Textarea>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}></FormField>
                <div className="flex gap-2 justify-end">
                    <Button disabled={form.formState.isSubmitting} type='button' asChild variant='outline'>
                        <Link href={`/book/${clerkUserId}`}>cancel</Link>
                    </Button>
                    <Button className='cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600'
                        disabled={form.formState.isSubmitting} type='submit'>book event</Button>
                </div>
            </form>
        </Form>
    )

}





