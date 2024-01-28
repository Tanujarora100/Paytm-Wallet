import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwt_secret } from "../utils/jwtSignature";
function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;
  // If the header is missing or doesn't start with "Bearer ", return an Unauthorized error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  // Verify the token using the jwt_secret and decode it
  try {
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
    // If the token is valid, set the username in the request body and call the next middleware
    if (decoded) {
      req.body.username = decoded.username;
      next();
    } else {
      // If the token is invalid, return an Unauthorized error
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    // If there's an error verifying or decoding the token, return an Unauthorized error
    return res.status(403).json({ error: "Unauthorized" });
  }
}

export default verifyToken;
