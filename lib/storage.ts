import { supabase } from './supabaseClient'

export const StorageService = {
    async uploadImage(file: File) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
            .from('chat-images')
            .upload(filePath, file)

        if (error) {
            throw error
        }

        const { data: { publicUrl } } = supabase.storage
            .from('chat-images')
            .getPublicUrl(filePath)

        return publicUrl
    }
}
