import { createClient } from "@supabase/supabase-js";
import type { Artwork, JoinApplication } from "./types";

type Database = {
  public: {
    Tables: {
      artworks: {
        Row: Artwork;
        Insert: Omit<Artwork, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Artwork>;
      };
      join_applications: {
        Row: JoinApplication;
        Insert: Omit<JoinApplication, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<JoinApplication>;
      };
    };
  };
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseConfig() {
  return Boolean(url && anonKey);
}

export function supabaseBrowser() {
  if (!url || !anonKey) throw new Error("Missing Supabase public environment variables.");
  return createClient<Database>(url, anonKey, {
    global: {
      fetch: (input, init) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        return fetch(input, {
          ...init,
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
      }
    }
  });
}

export function supabaseAdmin() {
  if (!url || !serviceKey) throw new Error("Missing Supabase admin environment variables.");
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        return fetch(input, {
          ...init,
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
      }
    }
  });
}
