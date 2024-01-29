import mongoose from "mongoose";
import logger from "../../config/logger";
import User from "../../models/User";
import signJWT from "../../utils/jwtSignature";
import userSchemaValidator from "../../validation/userSignUpValidation";
import { Response, Request } from "express";
import StatusCode from "../../utils/statusCode";

const userSignUpController = async (req: Request, res: Response) => {
  const session = mongoose.startSession();
  try {
    (await session).startTransaction();
    logger.info("transaction started");
    const { username, password, firstname, lastname } = req.body;
    const { success } = userSchemaValidator.safeParse(req.body);
    if (!success) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: responseMessages.BAD_REQUEST,
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
    res.status(StatusCode.CREATED).json({
      message: responseMessages.SUCCESS,
      token: token,
    });
  } catch (err) {
    (await session).abortTransaction();
    logger.info("Transaction aborted");
    logger.info(err);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: responseMessages.SERVER_ERROR });
  } finally {
    logger.info("Transaction completed");
    (await session).endSession();
  }
};

export default userSignUpController;
