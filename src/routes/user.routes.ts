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

const router = Router();

router.get("/", getUsers);
router.post("/", validate(createUserSchema), addUser);
router.get("/:id", getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
