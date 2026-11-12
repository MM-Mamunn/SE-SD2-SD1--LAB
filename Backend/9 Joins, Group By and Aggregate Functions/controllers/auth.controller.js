import {
  findUserByEmailService,
  createUserService,
  getAllUsersService,
} from "../services/auth.service.js";

// 1. Register a new user
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

    // Save user to database
    const newUser = await createUserService({
      ...(id !== undefined && { id: Number(id) }),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: String(password).trim(),
      role: role ? String(role).trim() : "customer",
    });

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

// 2. Login an existing user
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

    // Check if user exists by email
    const user = await findUserByEmailService(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    if (user.password !== String(password).trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Safe user object (omit password before returning)
    const { password: _excludedPassword, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Get all registered users (passwords excluded)
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
