import express from "express";
import {
  registerController,
  loginController,
  getProfileController,
  getAllUsersController,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// 1. POST /api/auth/register - Register a new user with bcrypt password hashing
router.post("/register", registerController);

// 2. POST /api/auth/login - Login user with bcrypt password verification and JWT token generation
router.post("/login", loginController);

// 3. GET /api/auth/profile - Protected API endpoint requiring valid JWT Bearer token
router.get("/profile", verifyToken, getProfileController);

// 4. GET /api/auth/users - Retrieve all users (excluding passwords)
router.get("/users", getAllUsersController);

export default router;
