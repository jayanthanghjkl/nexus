import { supabase } from './supabaseClient'
import { Message } from '@/types/message'

export const RealtimeService = {
    subscribeToMessages(callback: (payload: any) => void) {
        return supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    callback(payload.new as Message)
                }
            )
            .subscribe()
    }
}
