import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import logger from "../config/logger";

async function checkUserExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.body;
    const response = await User.findOne({ username });

    if (!response) {
      return res.status(400).json({ error: "User does not exist" });
    }

    logger.info(`User with ${username} sent a request`);
    next();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}

export default checkUserExist;
