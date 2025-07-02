import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse } from "../utils/ApiReponse";
import { Menu } from "../database/Menu";
import { ITEMS_PER_PAGE } from "../utils/constants";

type MenuRouteParameters = {
  page: number;
};

export async function getMenu(
  request: Request<{}, {}, {}, MenuRouteParameters>,
  response: Response,
  next: NextFunction
) {
  const currentPage = request.query.page || 1;
  console.log(request.query.page);
  try {
    const { data, count, error } = await supabaseClient
      .from("products")
      .select("*", { count: "exact" })
      .range(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE - 1
      );

    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

    if (error) {
      next(error);
    }

    console.log(`current page: ${currentPage}`);
    console.log(`total items: ${count}`);
    console.log(`items per page: ${ITEMS_PER_PAGE}`);
    console.log(`total pages: ${totalPages}`);

    const res: ApiResponse<Menu[]> = {
      statusCode: 200,
      data: data,
    };
    response.json(res);
  } catch (error) {
    next(error);
  }
}
