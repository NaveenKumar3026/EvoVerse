import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";
import { AuthRequest }
from "../middleware/auth.middleware";


export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } =
      req.body;

    const result =
      await loginUser(
        email,
        password
      );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const me = async (
  req: AuthRequest,
  res: Response
) => {
  res.json({
    success: true,
    user: req.user,
  });
};