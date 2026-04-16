import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno de Supabase. Revisa tu archivo .env");
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // 👈 Esto es lo que faltaba para que no se "olvide" de Eduardo
    autoRefreshToken: true,    // Mantiene la conexión viva
    detectSessionInUrl: true
  }
})