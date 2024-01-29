import { Router } from "express";
import userRouter from "./userRoute";
import accountRouter from "./accountRoute";
const appRouter = Router();

export default appRouter;

//all the routing will go to the user router itself.
appRouter.use("/user", userRouter);
appRouter.use("/account", accountRouter);
