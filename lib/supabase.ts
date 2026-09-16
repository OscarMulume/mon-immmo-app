import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client non contraint : `database.types.ts` est en cours de resynchronisation
// avec le schéma réel (tables annonces/districts, colonnes is_admin...).
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)