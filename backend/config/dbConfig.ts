import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";
dotenv.config();

const DB_URL = process.env.DB_URL!;

export const connectToDb = () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      logger.info("Connected to database");
    })
    .catch((error) => {
      logger.error("error connecting to DB", error);
    });
};
