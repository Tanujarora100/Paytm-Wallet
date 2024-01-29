import logger from "../../config/logger";
import User from "../../models/User";
import StatusCode from "../../utils/statusCode";
import { userDeletionValidator } from "../../validation/userDeletionValidation";
import { Response, Request } from "express";
const userDeletionController = async (req: Request, res: Response) => {
  const { success } = userDeletionValidator.safeParse(req.body);
  logger.info(`User deletion request for ${req.body.username}`);
  if (!success) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: responseMessages.BAD_REQUEST,
    });
  }
  try {
    const { username } = req.body;
    const deletedUser = await User.deleteOne({ username });
    if (deletedUser.deletedCount > 0) {
      return res.status(StatusCode.OK).json({
        message: responseMessages.SUCCESS,
      });
    } else {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessages.NOT_FOUND,
      });
    }
  } catch (err: any) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: responseMessages.SERVER_ERROR,
      err: err.message,
    });
  }
};

export default userDeletionController;
