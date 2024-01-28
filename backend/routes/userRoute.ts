import { Router } from "express";
import checkExistingUser from "../middleware/checkExistingUser";
import userSchemaValidator from "../validation/userSignUpValidation";
import User from "../models/User";
import jwt_secret from "../config/jwt_secret";
import { JWT_EXPIRY_SECONDS } from "../config/jwt_secret";
import jwt, { Secret } from "jsonwebtoken";
import logger from "../config/logger";
import checkUserExist from "../middleware/checkUserExist";
const userRouter = Router();
import { Request, Response } from "express";
import { validateUserSignIn } from "../validation/userSignInValidation";

userRouter.get(
  "/signin",
  checkUserExist,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (user && user.password !== password) {
        return res.send(400).json({ error: "Incorrect Password" });
      }
      const userId = user?._id;
      logger.info(`User with ${username} send a request`);
      const token = jwt.sign({ userId }, jwt_secret as unknown as Secret, {
        expiresIn: JWT_EXPIRY_SECONDS,
      });
      res.status(200).json({
        message: "user signed in successfully",
        token: token,
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  },
);

userRouter.post(
  "/signup",
  validateUserSignIn,
  checkExistingUser,
  async (req: Request, res: Response) => {
    try {
      const { username, password, firstname, lastname } = req.body;
      const { success } = userSchemaValidator.safeParse(req.body);
      if (!success) {
        return res.send(411).json({
          message: "Incorrect Inputs",
        });
      }
      const newUser = await User.create({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
      });

      const userId = newUser._id;
      logger.info(`User with ${username} created`);
      const token = jwt.sign({ userId }, jwt_secret as unknown as Secret, {
        expiresIn: JWT_EXPIRY_SECONDS,
      });

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
