import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const userSignInSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export function validateUserSignIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { success } = userSignInSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Sign-In Inputs",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      message: "Incorrect Sign-In Inputs",
    });
  }
}
