import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwt_secret } from "../utils/jwtSignature";
import StatusCode from "../utils/statusCode";
function authenticateUser(req: Request, res: Response, next: NextFunction) {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;
  // If the header is missing or doesn't start with "Bearer ", return an Unauthorized error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ error: responseMessages.UNAUTHORIZED });
  }
  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
    if (decoded) {
      req.body.username = decoded.username;
      next();
    } else {
      // If the token is invalid, return an Unauthorized error
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ error: responseMessages.UNAUTHORIZED });
    }
  } catch (err) {
    // If there's an error verifying or decoding the token, return an Unauthorized error
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ error: responseMessages.UNAUTHORIZED });
  }
}

export default authenticateUser;
