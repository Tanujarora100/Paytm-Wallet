import { Router } from "express";
import checkExistingUser from "../middleware/checkExistingUser";
import userSchemaValidator from "../validation/userSignUpValidation";
import User from "../models/User";
import jwt_secret from "../config/jwt_secret";
import { JWT_EXPIRY_SECONDS } from "../config/jwt_secret";
import jwt, { Secret } from "jsonwebtoken";
import logger from "../config/logger";
const userRouter = Router();

userRouter.post("/signup", checkExistingUser, async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;
    const { success } = userSchemaValidator.safeParse(req.body);
    if (!success) {
      return res.send(411).json({
        message: "Incorrect Inputs",
      });
    }
    const newUser = await User.create({
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
    });

    const userId = newUser._id;

    const token = jwt.sign({ userId }, jwt_secret as unknown as Secret, {
      expiresIn: JWT_EXPIRY_SECONDS,
    });

    res.status(201).json({
      message: "user created successfully",
      token: token,
    });
  } catch (err) {
    logger.info(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

export default userRouter;
