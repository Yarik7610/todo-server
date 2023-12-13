import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./routers/auth.router.js";
import { userRouter } from "./routers/user.router.js";

dotenv.config();
const PORT = process.env.PORT;
const URL = process.env.URL;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/images/", express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to db");
    app.listen(PORT, (e) =>
      console.log(e ? `Port problem: ${e}` : `App listening port: ${PORT}`)
    );
  } catch (e) {
    console.log(`Can't connect to db: ${e}`);
  }
};
start();
