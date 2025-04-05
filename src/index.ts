import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "./routes/auth";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";

const app = express();

const PORT = process.env.PORT;

app.use(express.json()); // express.json() middleware to parse req.body to a usable json format.

app.use("/auth", authRouter);

//? Error handlers - middleware
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
