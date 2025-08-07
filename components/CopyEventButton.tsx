'use client'

import { VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import { CopyIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
type CopyState = 'idle' | 'copied' | 'error'

interface CopyEventButtonProps extends Omit<React.ComponentProps<'button'>, 'children' | 'onClick'>,
    VariantProps<typeof buttonVariants> {
    eventId: string
    clerkUserId: string
}
function getCopyLabel(state: CopyState) {
    switch (state) {
        case 'copied':
            return 'copied'
        case 'error':
            return 'error'
        case 'idle':
        default:
            return 'copy link'
    }
}
export function CopyEventButton({
    eventId,
    clerkUserId,
    className,
    variant,
    size,
    ...props
}: CopyEventButtonProps) {
    const [copyState, setCopyState] = useState<CopyState>('idle')
    const handleCopy = () => {
        const url = `${location.origin}/book/${clerkUserId}/${eventId}`
        navigator.clipboard.writeText(url).then(() => {
            setCopyState('copied')
            toast('link copied successfully', {
                duration: 3000
            })
            setTimeout(() => setCopyState('idle'), 2000)
        }).catch(() => {
            setCopyState('error')
            setTimeout(() => setCopyState('idle'), 2000)
        })
    }
    return (
        <Button onClick={handleCopy}
            className={cn(buttonVariants({ variant, size }), 'cursor-pointe', className)} variant={variant}
            size={size} {...props}>
            <CopyIcon className='size-4 mr-2'></CopyIcon>{getCopyLabel(copyState)}
        </Button>
    )
}