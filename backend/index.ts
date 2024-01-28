import express from "express";
import { connectToDb } from "./config/dbConfig";
import appRouter from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();
// import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

connectToDb();

// app.use(cors);
app.use(express.json());

// Add your API routes with a base URL
app.use("/api/v1", appRouter);

// Listening on the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
