import { z } from "zod";
const passwordSchema = z.object({
  password: z.string().min(6),
});
export const userPasswordUpdationValidator = (password: string): boolean => {
  const { success } = passwordSchema.safeParse({ password });
  return success ? true : false;
};
const userSchema = z.object({
  name: z.string().min(3),
});
export const nameUpdationValidator = (name: string): boolean => {
  const { success } = userSchema.safeParse({ name });
  return success ? true : false;
};
