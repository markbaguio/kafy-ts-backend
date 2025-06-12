import { PostgrestError } from "@supabase/supabase-js";
import supabaseClient from "../utils/supabaseClient";
import { Tables } from "./supabase";

export type Profile = Tables<"profiles">;

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new PostgrestError({
      message: "test",
      code: "1",
      details: "test",
      hint: "miau",
    });
  }

  return data;
}

// export async function getProfile(id: string): Promise<Profile> {
//   const { data, error } = await supabaseClient
//     .from("profiles")
//     .select("*")
//     .eq("id", id)
//     .limit(1);

//   if (error) {
//     throw error;
//   }

//   return data[0];
// }
