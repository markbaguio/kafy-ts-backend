import { Router } from "express";
import { addToFavorites, getUserFavorites } from "../handlers/favoriteHandlers";

const favoritesRouter = Router();

favoritesRouter.post("/favorites", addToFavorites);
favoritesRouter.get("/favorites", getUserFavorites);

export default favoritesRouter;
