import { Router } from "express";
import {
  addToFavorites,
  getUserFavorites,
  removeFavorite,
} from "../handlers/favoriteHandlers";

const favoritesRouter = Router();

favoritesRouter.post("/favorites", addToFavorites);
favoritesRouter.get("/favorites", getUserFavorites);
favoritesRouter.delete("/favorites/:product_id", removeFavorite);

export default favoritesRouter;
