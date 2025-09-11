import { Router } from "express";
import {
  getUsers,
  addUser,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
