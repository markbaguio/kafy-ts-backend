import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse } from "../utils/ApiReponse";
import { Menu } from "../database/Menu";

export async function getMenu(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { data, count, error } = await supabaseClient
      .from("products")
      .select("*", { count: "exact" })
      .range(0, 5);

    if (error) {
      next(error);
    }

    console.log(count);
    const res: ApiResponse<Menu[]> = {
      statusCode: 200,
      data: data,
    };
    response.json(res);
  } catch (error) {
    next(error);
  }
}
