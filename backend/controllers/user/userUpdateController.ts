import User from "../../models/User";
import { userUpdateValidator } from "../../validation/userUpdateValidation";
import { Response, Request } from "express";
const userUpdateController = async (req: Request, res: Response) => {
  const { success } = userUpdateValidator.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
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
      return res.status(200).json({
        message: "User updated successfully",
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
export default userUpdateController;
