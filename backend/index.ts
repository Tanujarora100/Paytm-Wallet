import express from "express";
import { connectToDb } from "./config/dbConfig";
import appRouter from "./routes/routes";
import dotenv from "dotenv";
import accountRouter from "./routes/accountRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectToDb();

app.use(express.json());

// Add your API routes with a base URL
app.use("/api/v1/user", appRouter);
app.use("/api/v1/account", accountRouter);

// Listening on the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
