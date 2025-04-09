import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "./routes/auth";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import cookieParser from "cookie-parser";
import { AUTHROUTE } from "./utils/constants";
import cors from "cors";

const app = express();

const PORT = process.env.PORT;

app.use(express.json()); // express.json() middleware to parse req.body to a usable json format.
app.use(cookieParser()); // cookie-parser middleware to parse cookies from req.headers.
// Enable CORS for all routes, allowing requests from your frontend (localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow the necessary methods
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

app.use(AUTHROUTE, authRouter);

//? Error handlers - middleware
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
