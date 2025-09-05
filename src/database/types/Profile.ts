import { PostgrestError } from "@supabase/supabase-js";
import supabaseClient from "../../utils/supabaseClient";
import { Tables } from "../supabase";
import { addToFavoritesParametersSchema } from "../../schemas/ProductSchema";
import z from "zod";

export type Profile = Tables<"profiles">;

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new PostgrestError({ ...error });
  }

  return data;
}

export type AddToFavoritesParameters = z.infer<
  typeof addToFavoritesParametersSchema
>;
