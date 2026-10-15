import express from "express";
import { profileFunction } from "../controllers/student.controller.js";

const router = express.Router();

router.get(
  "/profile",profileFunction
);

export default router;