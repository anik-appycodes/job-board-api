import { Router } from "express";
import {
  getJobs,
  addJob,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation.js";

const router = Router();

router.get("/", getJobs);
router.post("/", validate(createJobSchema), addJob);
router.get("/:id", getJobById);
router.put("/:id", validate(updateJobSchema), updateJob);
router.delete("/:id", deleteJob);

export default router;
