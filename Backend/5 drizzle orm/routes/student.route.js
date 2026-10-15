import express from "express";
import { profileFunction, detailsFunction, detailsFunctionByDrizzle } from "../controllers/student.controller.js";

const router = express.Router();

router.get(
  "/profile", profileFunction
);
router.get(
  "/details", detailsFunction
);
router.get(
  "/detailsbydrizzle", detailsFunctionByDrizzle
);

export default router;