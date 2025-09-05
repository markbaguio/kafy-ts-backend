import { Router } from "express";
import { addToFavorites } from "../handlers/favoriteHandlers";

const favoritesRouter = Router();

favoritesRouter.post("/favorites", addToFavorites);
