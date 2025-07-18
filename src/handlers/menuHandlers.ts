import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse } from "../utils/ApiReponse";
import { Menu } from "../database/Menu";
import { ITEMS_PER_PAGE } from "../utils/constants";
import { MenuQueryParams, MenuQueryParamsSchema } from "../utils/types";

export async function getMenu(
  request: Request<{}, {}, {}, MenuQueryParams>,
  response: Response,
  next: NextFunction
) {
  const parsedMenuQueryParams = MenuQueryParamsSchema.safeParse(request.query);

  if (!parsedMenuQueryParams.success) {
    next(parsedMenuQueryParams.error);
    return;
  }

  try {
    // const { data, count, error } = await supabaseClient
    //   .from("products")
    //   .select("*", { count: "exact" })
    //   .range(
    //     (parsedMenuQueryParams.data.page - 1) * ITEMS_PER_PAGE,
    //     parsedMenuQueryParams.data.page * ITEMS_PER_PAGE - 1
    //   );

    const from =
      (parseInt(parsedMenuQueryParams.data.page) - 1) * ITEMS_PER_PAGE;
    const to = parseInt(parsedMenuQueryParams.data.page) * ITEMS_PER_PAGE - 1;

    let query = supabaseClient
      .from("products")
      .select("*", { count: "exact" })
      .range(from, to);

    if (parsedMenuQueryParams.data.category) {
      query = query.eq("category", parsedMenuQueryParams.data.category);
    }

    const { data, count, error } = await query;

    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

    if (error) {
      next(error);
    }

    const res: ApiResponse<Menu[]> = {
      statusCode: 200,
      pagination: {
        currentPage: Number(parsedMenuQueryParams.data.page),
        totalPages: totalPages,
        totalItems: count || 0,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNextPage: parseInt(parsedMenuQueryParams.data.page) < totalPages,
      },
      data: data,
    };
    console.log("Menu Response:", res);
    response.json(res);
  } catch (error) {
    next(error);
  }
}
