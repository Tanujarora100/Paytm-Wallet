import User from "../../models/User";
import StatusCode from "../../utils/statusCode";
import { userUpdateValidator } from "../../validation/userUpdateValidation";
import { Response, Request } from "express";
const userUpdateController = async (req: Request, res: Response) => {
  const { success } = userUpdateValidator.safeParse(req.body);
  if (!success) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: responseMessages.BAD_REQUEST,
    });
  }

  try {
    const updatedUser = await User.updateOne(
      {
        username: req.body.username,
      },
      { $set: req.body },
    );

    if (updatedUser.modifiedCount > 0) {
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
export default userUpdateController;
