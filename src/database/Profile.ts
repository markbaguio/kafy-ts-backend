import supabaseClient from "../utils/supabaseClient";
import { Tables } from "./supabase";

export type Profile = Tables<"profiles">;

export async function getProfile(id: string): Promise<Profile> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error) {
    throw new Error("Failed to fetch profile");
  }

  return data[0];
}
