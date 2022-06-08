import jwt from "jsonwebtoken"
import { jwtConfig } from "../const"
import {ResponseStatus} from  '../const'

export function isAuth(req, res, next) {
  let authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(ResponseStatus.NO_TOKEN).json({ message: "No token provided!" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(ResponseStatus.UNAUTHORIZED).json({ message: "No token provided!" });
  }
  try {
    jwt.verify(token, jwtConfig.secret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return res.status(ResponseStatus.UNAUTHORIZED).json({ message: "Not authenticated" });
      }
      req.userId = decodedToken.id;
      next();
    });
  }
  catch (err) {
    console.log(err);
  }
}
