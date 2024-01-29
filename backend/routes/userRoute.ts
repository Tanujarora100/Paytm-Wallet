import { Router } from "express";
import checkExistingUser from "../middleware/checkExistingUser";
import checkUserExist from "../middleware/checkUserExist";
const userRouter = Router();
import { validateUserSignIn } from "../validation/userSignInValidation";
import authenticateUser from "../middleware/Auth";

import userSignInController from "../controllers/user/userSignInController";
import userSignUpController from "../controllers/user/userSignUpController";
import userUpdateController from "../controllers/user/userUpdateController";
import userDeletionController from "../controllers/user/userDeletionController";
import getUsersController from "../controllers/user/bulkUserController";
userRouter.get("/signin", checkUserExist, userSignInController);
// http://localhost:3000/api/v1/user/signup
userRouter.post(
  "/signup",
  validateUserSignIn,
  checkExistingUser,
  userSignUpController,
);
userRouter.put("/", authenticateUser, userUpdateController),
  userRouter.delete("/", authenticateUser, userDeletionController),
  //get users with a specific substring in their username
  userRouter.get("/bulk", getUsersController);

export default userRouter;
