import { Router } from "express";
import {
  getUser,
  postLogin,
  postRefreshToken,
  postSignIn,
} from "../controllers/auth-controller"

export function authRouter(app) {
  const authRouter = Router();

  authRouter.post("/signin", postSignIn);
  authRouter.post("/login", postLogin);
  authRouter.post("/refresh-token", postRefreshToken);

  authRouter.get("/user", isAuth, getUser);

  app.use("/api/auth/", authRouter)
}

