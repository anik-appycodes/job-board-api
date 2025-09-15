import { Router } from "express";
import {
  signup,
  login,
  googleLogin,
  googleSignup,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/google-signup", googleSignup);

export default router;
