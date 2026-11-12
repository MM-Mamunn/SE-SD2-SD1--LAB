import express from "express";
import {
  registerController,
  loginController,
  getAllUsersController,
} from "../controllers/auth.controller.js";

const router = express.Router();

// 1. POST /api/auth/register - Register a new user
router.post("/register", registerController);

// 2. POST /api/auth/login - Login user with credential verification
router.post("/login", loginController);

// 3. GET /api/auth/users - Retrieve all users (excluding passwords)
router.get("/users", getAllUsersController);

export default router;
