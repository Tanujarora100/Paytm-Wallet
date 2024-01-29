import { Request, Response } from "express";
import User from "../../models/User";
import logger from "../../config/logger";
import signJWT from "../../utils/jwtSignature";
import StatusCode from "../../utils/statusCode";
const userSignInController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    logger.info(`User with ${username} send a sign in request`);
    if (!user) {
      logger.info(`User with ${username} sent an incorrect username`);
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ error: responseMessages.BAD_REQUEST });
    }
    logger.info(`User with ${username} sent a correct username`);
    const result = user.comparePassword(password);

    if (!result) {
      logger.info(`User with ${username} sent an incorrect password`);
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ error: responseMessages.BAD_REQUEST });
    }

    const userId = user?._id;
    logger.info(`User with ${username} sent an logged in`);
    const token = signJWT({ useId: userId });
    res.status(StatusCode.OK).json({
      token: token,
    });
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: responseMessages.SERVER_ERROR });
  }
};
export default userSignInController;
