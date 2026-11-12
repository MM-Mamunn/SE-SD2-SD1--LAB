import jwt from "jsonwebtoken";

// Middleware to verify JWT from the Authorization header
export const verifyToken = (req, res, next) => {
  try {
    // 1. Read the Authorization header
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    // 2. Check if the header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 3. Expect format: "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format. Expected 'Bearer <token>'.",
      });
    }

    // 4. Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is missing.",
      });
    }

    // 5. Verify the token using the secret key from environment variables
    const secretKey = process.env.JWT_SECRET || "supersecretjwtkey123";
    const decoded = jwt.verify(token, secretKey);

    // 6. Attach authenticated user information (contains user id) to the request object
    req.user = decoded;

    // 7. Proceed to the next middleware or controller function
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
