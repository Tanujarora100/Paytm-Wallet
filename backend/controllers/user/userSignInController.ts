import { Request, Response } from "express";
import User from "../../models/User";
import logger from "../../config/logger";
import signJWT from "../../utils/jwtSignature";
const userSignInController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    logger.info(`User with ${username} send a sign in request`);
    if (!user) {
      logger.info(`User with ${username} sent an incorrect username`);
      return res.status(400).json({ error: "Incorrect Username" });
    }
    logger.info(`User with ${username} sent a correct username`);
    const result = user.comparePassword(password);

    if (!result) {
      logger.info(`User with ${username} sent an incorrect password`);
      return res.status(400).json({ error: "Incorrect Password" });
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
};
export default userSignInController;
