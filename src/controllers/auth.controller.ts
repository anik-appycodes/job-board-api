import type { Request, Response } from "express";
import { catchAsync, sendResponse } from "../helpers/api.helper.js";
import { authService } from "../services/auth.service.js";
import { AppError } from "../middlewares/error.middleware.js";
import { Role } from "@prisma/client";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role, company_id } = req.body;

  if (!name || !email || !password || !role)
    throw new AppError("Missing fields", 400);

  const result = await authService.signupWithEmail(
    name,
    email,
    password,
    role as Role,
    company_id
  );

  return sendResponse(res, 201, "Signup successful", result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError("Missing fields", 400);

  const result = await authService.loginWithEmail(email, password);

  return sendResponse(res, 200, "Login successful", result);
});

export const googleSignup = catchAsync(async (req: Request, res: Response) => {
  const { idToken, role, company_id } = req.body;
  if (!idToken || !role) throw new AppError("Missing fields", 400);

  const result = await authService.signupWithGoogle(
    idToken,
    role as Role,
    company_id
  );

  return sendResponse(res, 201, "Google signup successful", result);
});

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { idToken, role } = req.body;
  if (!idToken) throw new AppError("idToken is required", 400);

  const result = await authService.loginWithGoogle(idToken, role as Role);

  return sendResponse(res, 200, "Google login successful", result);
});
