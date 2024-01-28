import { z } from "zod";
export const userSignInValidator = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});
