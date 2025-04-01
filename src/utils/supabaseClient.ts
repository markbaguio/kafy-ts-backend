import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseProjUrl: string = process.env.SUPABASE_PROJ_URL!;
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY!;

const supabaseClient: SupabaseClient = createClient(
  supabaseProjUrl,
  supabaseAnonKey
);

export default supabaseClient;
