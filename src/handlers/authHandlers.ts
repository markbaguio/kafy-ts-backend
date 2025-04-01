import { Request, Response } from "express";
import supabaseClient from "../utils/supabaseClient";

export async function signUpNewUser(request: Request, response: Response) {
  //Extract user data from the request.body
  const { firstName, lastName, email, password } = request.body;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  // handle error.
  if (error) {
    response
      .status(error.status || 500)
      .json({ error, message: error.message });
  }

  // handle success
  response.status(200).json({
    user: data,
  });
}
