import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import logger from "../config/logger";
import StatusCode from "../utils/statusCode";

async function checkExistingUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.info(`User with ${username} sent a request`);
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ error: responseMessages.BAD_REQUEST });
    }
    next();
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: responseMessages.SERVER_ERROR });
  }
}

export default checkExistingUser;
