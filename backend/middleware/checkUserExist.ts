import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import logger from "../config/logger";
import StatusCode from "../utils/statusCode";

async function checkUserExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.body;
    const response = await User.findOne({ username });

    if (!response) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ error: responseMessages.BAD_REQUEST });
    }

    logger.info(`User with ${username} sent a request`);
    next();
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: responseMessages.SERVER_ERROR });
  }
}

export default checkUserExist;
