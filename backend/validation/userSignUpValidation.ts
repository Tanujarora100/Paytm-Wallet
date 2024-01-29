import { z } from "zod";
const userSchemaValidator = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  firstname: z.string().min(3).max(20),
  lastname: z.string().min(3).max(20),
});
export default userSchemaValidator