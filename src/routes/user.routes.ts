import { Router } from "express";
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { catchAsync } from "../helpers/api.helper.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation.js";

const router = Router();

// Public routes
router.post("/", validate(createUserSchema), catchAsync(addUser));

router.use(requireAuth);

// Protected routes
router.get("/", catchAsync(getUsers));
router.get("/:id", catchAsync(getUserById));
router.put("/:id", validate(updateUserSchema), catchAsync(updateUser));
router.delete("/:id", catchAsync(deleteUser));

export default router;
