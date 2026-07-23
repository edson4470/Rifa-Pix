import { createClient } from '@supabase/supabase-js';

// Puxando as chaves escondidas do seu arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança: Avisa se esquecer de colocar as chaves no .env
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("⚠️ Faltam as variáveis de ambiente do Supabase. Verifique o arquivo .env");
}

// Criando a conexão oficial!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);