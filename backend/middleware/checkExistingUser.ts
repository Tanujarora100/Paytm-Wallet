import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import logger from "../config/logger";

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
      return res.status(400).json({ error: "user already exist" });
    }
    next();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}

export default checkExistingUser;
