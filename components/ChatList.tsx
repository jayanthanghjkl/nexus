'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types/message'
import MessageBubble from './MessageBubble'

interface ChatListProps {
    messages: Message[];
    currentUserId: string;
}

export default function ChatList({ messages, currentUserId }: ChatListProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.user_id === currentUserId}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    )
}
