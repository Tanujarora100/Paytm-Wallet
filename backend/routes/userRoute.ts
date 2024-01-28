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
import authenticateUser from "../middleware/Auth";
import { userUpdateValidator } from "../validation/userUpdateValidation";
import IUser from "../interfaces/IUser";
import Account from "../models/Account";
import mongoose from "mongoose";
import { userDeletionValidator } from "../validation/userDeletionValidation";
userRouter.get(
  "/signin",
  checkUserExist,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username:username });
      logger.info(`User with ${username} send a sign in request`);
      if (!user) {
        logger.info(`User with ${username} sent an incorrect username`);
        return res.status(400).json({ error: "Incorrect Username" });
      }
      logger.info(`User with ${username} sent an correct username`);
      const result = await user.comparePassword(password);

      if (!result) {
        logger.info(`User with ${username} sent an incorrect password`);
        return res.status(400).json({ error: "Incorrect Password India" });
      }
      
      const userId = user?._id;
      logger.info(`User with ${username} sent an logged in`);
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
    const session = mongoose.startSession();
    try {
      (await session).startTransaction();
      logger.info("transaction started");
      const { username, password, firstname, lastname } = req.body;
      const { success } = userSchemaValidator.safeParse(req.body);
      if (!success) {
        return res.status(411).json({
          message: "Incorrect Inputs",
        });
      }
      logger.info("input validation completed");
      //create a new User
      const newUser = await User.create({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
      });
      const token = signJWT({ userId: newUser._id });
      logger.info("token signing completed");

      //hashing the password and the account creation is taken care of by mongoose middleware
      //Dir- c:/Users/tanuj/Development/PaytmFulLStack/backend/models/User.ts
      logger.info(`User with ${newUser.username} created`);

      (await session).commitTransaction();
      logger.info("Transaction committed");
      res.status(201).json({
        message: "user created successfully",
        token: token,
      });
    } catch (err) {
      (await session).abortTransaction();
      logger.info("Transaction aborted");
      logger.info(err);
      return res.status(500).json({ error: "Server Error" });
    } finally {
      logger.info("Transaction completed");
      (await session).endSession();
    }
  },

  userRouter.put("/", authenticateUser, async (req: Request, res: Response) => {
    const { success } = userUpdateValidator.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Error while updating information",
      });
    }

    try {
      const updatedUser = await User.updateOne(
        {
          username: req.body.username,
        },
        { $set: req.body },
      );

      if (updatedUser.modifiedCount > 0) {
        return res.status(200).json({
          message: "User updated successfully",
        });
      } else {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        message: "Internal server error",
        err: err.message,
      });
    }
  }),

  userRouter.delete(
    "/",
    authenticateUser,
    async (req: Request, res: Response) => {
      const { success } = userDeletionValidator.safeParse(req.body);
      logger.info(`User deletion request for ${req.body.username}`);
      if (!success) {
        return res.status(411).json({
          message: "Invalid Input Given for User Deletion",
        });
      }
      try {
        const { username } = req.body;
        const deletedUser = await User.deleteOne({ username });
        if (deletedUser.deletedCount > 0) {
          return res.status(200).json({
            message: "User deleted successfully",
          });
        } else {
          return res.status(404).json({
            message: "User not found",
          });
        }
      } catch (err: any) {
        return res.status(500).json({
          message: "Internal server error",
          err: err.message,
        });
      }
    },
  ),

  //get users with a specific substring in their username
  userRouter.get("/bulk", async (req: Request, res: Response) => {
    try {
      const userSubstring = req.query.filter || "";
      const users: IUser[] = await User.find({
        //basically an array of objects in which it will match the objects.
        $or: [
          { firstname: { $regex: userSubstring, $options: "i" } },
          { lastname: { $regex: userSubstring, $options: "i" } },
        ],
      });
      return res.json({
        users: users.map((user) => ({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
        })),
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  }),
);

export default userRouter;
