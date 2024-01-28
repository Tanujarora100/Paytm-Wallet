import jwt, { Secret } from "jsonwebtoken";
import { JWT_EXPIRY_SECONDS } from "../config/jwt_secret";
export const jwt_secret = "tanuj-arora";
function signJWT(payload: any) {
  const token = jwt.sign(payload, jwt_secret as Secret, {
    expiresIn: JWT_EXPIRY_SECONDS,
  });
  return token;
}
export default signJWT;
