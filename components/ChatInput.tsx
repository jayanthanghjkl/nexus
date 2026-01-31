'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import ImageUploader from './ImageUploader'

interface ChatInputProps {
    onSendMessage: (content: string, imageUrl?: string) => Promise<void>;
    disabled?: boolean;
}
        
export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || loading) return

        setLoading(true)
        try {
            await onSendMessage(message)
            setMessage('')
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (url: string) => {
        setLoading(true)
        try {
            await onSendMessage('Sent an image', url)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-4 bg-background/50 backdrop-blur-md border-t border-border/50 sticky bottom-0 z-10"
        >
            <ImageUploader onUploadComplete={handleImageUpload} disabled={disabled || loading} />

            <Input
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                disabled={disabled || loading}
            />

            <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || disabled || loading}
                className="shrink-0 bg-primary hover:bg-primary/90 transition-all rounded-full"
            >
                <Send className="h-4 w-4" />
            </Button>
        </form>
    )
}
