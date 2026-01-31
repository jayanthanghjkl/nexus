'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { AuthService } from '@/lib/auth'
import ChatList from '@/components/ChatList'
import ChatInput from '@/components/ChatInput'
import { Message } from '@/types/message'
import { Button } from '@/components/ui/button'
import { LogOut, MessageSquare } from 'lucide-react'
import { toast } from 'sonner' // If I had installed sonner, but I'll use simple fallback or assume generic toast if not present. I'll stick to a simple custom toast or console for now, maybe just consistent UI. Note: I will just use console.error for errors to ensure code runs without missing deps crash.

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await AuthService.getUser()
            if (!currentUser) {
                router.push('/auth')
                return
            }
            setUser(currentUser)
            setLoading(false)
            fetchMessages()
        }

        checkUser()

        // Realtime subscription
        const channel = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new as Message
                    // Optimistic update check (if we already added it locally? No, we just append from server to be safe or dedup)
                    setMessages((prev) => [...prev, newMessage])

                    // Sound effect could go here
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [router])

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(50) // Load last 50

        if (error) {
            console.error('Error fetching messages:', error)
        } else {
            setMessages(data || [])
        }
    }

    const handleSendMessage = async (content: string, imageUrl?: string) => {
        if (!user) return

        const newMessage = {
            content,
            user_id: user.id,
            user_email: user.email,
            image_url: imageUrl
        }

        // Optimistic update?
        // Let's just wait for realtime event or insertion response.
        // Ideally we insert and let realtime update us, but for faster UI we can append local temp.
        // For this simple app, waiting for realtime is usually fast enough (~100ms).

        // Debug log
        console.log('Sending message:', { payload: newMessage, authUser: user })

        const { error } = await supabase
            .from('messages')
            .insert([newMessage])

        if (error) {
            console.error('Error sending message detailed:', JSON.stringify(error, null, 2))
            alert(`Failed to send message: ${error.message || 'Unknown error'}`)
        }
    }

    const handleLogout = async () => {
        await AuthService.signOut()
        router.push('/auth')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-background">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <MessageSquare className="h-12 w-12 text-primary opacity-50" />
                    <p className="text-muted-foreground text-sm">Loading Chat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-background relative selection:bg-primary/20">
            {/* Header */}
            <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 sm:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Nexus Chat</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">Logged in as</p>
                        <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full border-x border-border/30 bg-card/30 shadow-2xl">
                <ChatList messages={messages} currentUserId={user.id} />
                <ChatInput onSendMessage={handleSendMessage} />
            </main>
        </div>
    )
}
