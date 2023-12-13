import { Router } from "express";
import { check } from "express-validator";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRouter = Router();

authRouter.post(
  "/registration",
  [
    check(
      "nickname",
      "Nickname should minimum 1 symbol and not more than 50 symbols"
    ).isLength({
      min: 1,
      max: 50,
    }),
    check(
      "password",
      "Nickname should be 5 or more symbols and not more than 50 symbols"
    ).isLength({ min: 5, max: 50 }),
  ],
  authController.registration
);
authRouter.post("/login", authController.login);
authRouter.get("/me", authMiddleware, authController.getMe);
