import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "./routes/auth";

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

app.use("/auth", authRouter);
