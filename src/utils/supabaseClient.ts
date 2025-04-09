import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/supabase";

const supabaseProjUrl: string = process.env.SUPABASE_PROJ_URL!;
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY!;

const supabaseClient = createClient<Database>(supabaseProjUrl, supabaseAnonKey);

export default supabaseClient;
