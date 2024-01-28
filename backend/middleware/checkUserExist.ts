import User from "../models/User";
import logger from "../config/logger";
import { NextFunction, Request, Response } from "express";

async function checkUserExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.body;
    const response = await User.findOne({ username });

    if (!response) {
      return res.send(400).json({ error: "User does not exist" });
    }
    logger.info(`User with ${username} send a request`);
    next();
  } catch (err) {
    logger.error(err);
    return res.send(500).json({ error: "Server Error" });
  }
}

export default checkUserExist;
