import logger from "../../config/logger";
import IUser from "../../interfaces/IUser";
import User from "../../models/User";
import { Request, Response } from "express";
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
    return res.status(500).json({ error: "Server Error" });
  }
};

export default getUsersController;
