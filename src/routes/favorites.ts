import { Router } from "express";
import {
  addToFavorites,
  getUserFavoriteProducts,
} from "../handlers/favoriteHandlers";

const favoritesRouter = Router();

favoritesRouter.post("/favorites", addToFavorites);
favoritesRouter.get("/favorites", getUserFavoriteProducts);

export default favoritesRouter;
