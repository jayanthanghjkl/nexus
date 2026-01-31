# Nexus Chat

A production-ready Realtime Chat Application built with Next.js 15 (App Router), Supabase, and Tailwind CSS + ShadCN UI.

## Features

- 🔐 **Authentication**: Secure email/password login via Supabase Auth.
- 💬 **Realtime Messaging**: Instant message delivery using Supabase Realtime subscriptions.
- 🖼️ **Image Sharing**: Upload and share images via Supabase Storage.
- 🎨 **Modern UI**: Polished, responsive interface inspired by Discord/WhatsApp.
- 🌙 **Dark Mode**: Fully supported out of the box.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- A Supabase project (Free tier is fine)

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration (SQL)

Run the following SQL in your Supabase SQL Editor to set up the database and storage:

```sql
-- 1. Create Messages Table
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  content text not null,
  user_id uuid references auth.users not null,
  user_email text, -- Optional: Store email for display simplicity
  image_url text
);

-- 2. Enable Realtime
alter publication supabase_realtime add table messages;

-- 3. Enable RLS
alter table messages enable row level security;

-- 4. RLS Policies
-- Allow anyone signed in to view messages
create policy "Authenticated users can view messages"
on messages for select
to authenticated
using (true);

-- Allow users to insert their own messages
create policy "Users can insert their own messages"
on messages for insert
to authenticated
with check (auth.uid() = user_id);

-- 5. Storage Setup (Run this in SQL or create bucket manually)
insert into storage.buckets (id, name, public) values ('chat-images', 'chat-images', true);

-- Storage Policies
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'chat-images' );

create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'chat-images' );
```

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
/app
  /login    - Authentication page
  /chat     - Main chat interface
  /page.tsx - Landing page
  /layout.tsx - Root layout
/components
  /ui       - Reusable UI components (Button, Input, etc.)
  ChatInput.tsx
  ChatList.tsx
  MessageBubble.tsx
/lib
  supabaseClient.ts - Supabase configuration
  auth.ts           - Auth helpers
/styles
  globals.css       - Global styles & Tailwind
/types
  message.ts        - TypeScript interfaces
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel settings.
4. Deploy!

"# nexus" 
