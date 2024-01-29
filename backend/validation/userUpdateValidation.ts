import { z } from "zod";
export const userUpdateValidator = z.object({
  password: z.string().min(6).optional(),
  firstname: z.string().min(3).optional(),
  lastname: z.string().min(3).optional(),
});
