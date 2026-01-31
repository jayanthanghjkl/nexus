'use client'

import { Message } from '@/types/message'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "flex w-full mb-4",
                isOwn ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "max-w-[75%] flex flex-col group",
                isOwn ? "items-end" : "items-start"
            )}>
                {!isOwn && (
                    <span className="text-xs text-muted-foreground ml-1 mb-1 block">
                        {message.user_email?.split('@')[0]}
                    </span>
                )}

                <div className={cn(
                    "px-4 py-2 rounded-2xl shadow-sm text-sm relative overflow-hidden transition-all",
                    isOwn
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50",
                    // Add optional image styling if needed
                    message.image_url ? "p-0 bg-transparent border-0 shadow-none" : ""
                )}>
                    {/* If it's an image, show explicitly, otherwise text  */}
                    {message.image_url ? (
                        <img
                            src={message.image_url}
                            alt="Shared"
                            className="rounded-lg max-w-[200px] sm:max-w-[300px] border border-border"
                        />
                    ) : (
                        <p className="break-words leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                </div>

                <span className={cn(
                    "text-[10px] text-muted-foreground/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                    isOwn ? "mr-1" : "ml-1"
                )}>
                    {format(new Date(message.created_at), 'HH:mm')}
                </span>
            </div>
        </motion.div>
    )
}
