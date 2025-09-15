import { Router } from "express";
import {
  getUsers,
  addUser,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getUsers);
router.get("/:id", requireAuth, getUserById);

router.post("/", requireAuth, validate(createUserSchema), addUser);
router.put("/:id", requireAuth, validate(updateUserSchema), updateUser);
router.delete("/:id", requireAuth, deleteUser);

export default router;
