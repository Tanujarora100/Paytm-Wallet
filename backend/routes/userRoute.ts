import { Router } from "express";
import checkExistingUser from "../middleware/checkExistingUser";
import userSchemaValidator from "../validation/userSignUpValidation";
import User from "../models/User";
import logger from "../config/logger";
import checkUserExist from "../middleware/checkUserExist";
const userRouter = Router();
import { Request, Response } from "express";
import { validateUserSignIn } from "../validation/userSignInValidation";
import signJWT from "../utils/jwtSignature";

userRouter.get(
  "/signin",
  checkUserExist,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (user && user.password !== password) {
        return res.status(400).json({ error: "Incorrect Password" });
      }
      const userId = user?._id;
      logger.info(`User with ${username} send a request`);
      const token = signJWT({ useId: userId });
      res.status(200).json({
        token: token,
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  },
);
// http://localhost:3000/api/v1/user/signup
userRouter.post(
  "/signup",
  validateUserSignIn,
  checkExistingUser,
  async (req: Request, res: Response) => {
    try {
      const { username, password, firstname, lastname } = req.body;
      const { success } = userSchemaValidator.safeParse(req.body);
      if (!success) {
        return res.status(411).json({
          message: "Incorrect Inputs",
        });
      }
      //create a new User
      const newUser = await User.create({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
      });

      //hash the password
      newUser.password = newUser.hashPassword(password);
      //using hashsync so it will return a string

      //Save the user in DB

      const token = signJWT({ userId: newUser._id });

      //sign a jwt token and send it to the user.
      logger.info(`User with ${newUser.username} created`);
      res.status(201).json({
        message: "user created successfully",
        token: token,
      });
    } catch (err) {
      logger.info(err);
      return res.status(500).json({ error: "Server Error" });
    }
  },
);

export default userRouter;
