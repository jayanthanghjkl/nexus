export interface Message {
    id: string;
    content: string;
    user_id: string;
    user_email?: string; // We might join this or store it for simplicity in this demo
    created_at: string;
    image_url?: string;
}

export interface UserProfile {
    id: string;
    email: string;
}
