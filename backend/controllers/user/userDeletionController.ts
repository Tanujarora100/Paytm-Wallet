import logger from "../../config/logger";
import User from "../../models/User";
import { userDeletionValidator } from "../../validation/userDeletionValidation";
import { Response, Request } from "express";
const userDeletionController = async (req: Request, res: Response) => {
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
};

export default userDeletionController;
