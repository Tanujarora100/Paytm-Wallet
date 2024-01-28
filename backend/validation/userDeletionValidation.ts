import { z } from "zod";

export const userDeletionValidator = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});
