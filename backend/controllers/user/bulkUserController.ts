import logger from "../../config/logger";
import IUser from "../../interfaces/IUser";
import User from "../../models/User";
import { Request, Response } from "express";
import StatusCode from "../../utils/statusCode";
const getUsersController = async (req: Request, res: Response) => {
  try {
    const userSubstring = req.query.filter || "";
    const users: IUser[] = await User.find({
      //basically an array of objects in which it will match the objects.
      $or: [
        { firstname: { $regex: userSubstring, $options: "i" } },
        { lastname: { $regex: userSubstring, $options: "i" } },
      ],
    });
    return res.json({
      users: users.map((user) => ({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      })),
    });
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: responseMessages.SERVER_ERROR });
  }
};

export default getUsersController;
