# Àṣà Art Marketplace

Production-ready MVP for **Àṣà**, a curated African/Yoruba art marketplace.

## Stack

- Next.js App Router for Vercel
- Supabase Postgres + Storage
- Server routes for admin upload, join applications, and AI coach
- OpenAI Responses API for the AI art coach

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   copy .env.example .env.local
   ```

3. In Supabase, run `supabase/schema.sql`, then create a public Storage bucket named `artworks`.

4. Fill `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   SUPABASE_STORAGE_BUCKET=artworks
   ADMIN_UPLOAD_TOKEN=
   OPENAI_API_KEY=
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

Without Supabase variables, the public gallery uses demo data so the UI can still be reviewed.

## Vercel

Add the same environment variables in Vercel Project Settings. The app is designed for Vercel serverless routes, so no separate FastAPI backend is required for the MVP.
