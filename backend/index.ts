import express from "express";
import { connectToDb } from "./config/dbConfig";
const app = express();

connectToDb();
app.listen(3000, () => {
  console.log("server started");
});
