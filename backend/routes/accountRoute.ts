import { Router } from "express";
import authenticateUser from "../middleware/Auth";
const accountRouter = Router();
import balanceController from "../controllers/account/balanceController";
import transferController from "../controllers/account/transferController";
accountRouter.get("/balance", authenticateUser, balanceController);
accountRouter.post("/transfer", authenticateUser, transferController);
export default accountRouter;
