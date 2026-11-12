import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmailService,
  findUserByIdService,
  createUserService,
  getAllUsersService,
} from "../services/auth.service.js";

// 1. POST /api/auth/register - Register a new user with bcrypt password hashing
export const registerController = async (req, res) => {
  try {
    const { id, name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required fields",
      });
    }

    // Check for duplicate email
    const existingUser = await findUserByEmailService(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `User with email "${email}" already exists`,
      });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user to database with hashed password (never store plain-text password)
    const newUser = await createUserService({
      ...(id !== undefined && { id: Number(id) }),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role ? String(role).trim() : "customer",
    });

    // Return response without password or password hash
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. POST /api/auth/login - Login user with bcrypt.compare() and generate JWT
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required credentials
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    // Find user by email
    const user = await findUserByEmailService(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare submitted password with stored bcrypt hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token containing the user's ID
    const secretKey = process.env.JWT_SECRET || "supersecretjwtkey123";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    // Safe user object (exclude password hash before returning)
    const { password: _excludedPassword, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: safeUser,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. GET /api/auth/profile - Protected route requiring JWT
export const getProfileController = async (req, res) => {
  try {
    // req.user was populated by the verifyToken middleware
    const userId = req.user.id;

    // Fetch user details from database by ID
    const user = await findUserByIdService(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Access granted to protected route",
      userId: userId,
      data: user,
    });
  } catch (err) {
    console.error("Profile error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. GET /api/auth/users - Retrieve all registered users (passwords excluded)
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("Get all users error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
