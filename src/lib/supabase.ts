/**
 * Cliente Supabase para Server Components
 * Usa placeholders quando env vars não estão configuradas (ex: build na Vercel)
 */
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
