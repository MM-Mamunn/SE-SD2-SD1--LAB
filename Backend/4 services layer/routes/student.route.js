import express from "express";
import { profileFunction, detailsFunction } from "../controllers/student.controller.js";

const router = express.Router();

router.get(
  "/profile", profileFunction
);
router.get(
  "/details", detailsFunction
);

export default router;