# 10. Authentication with bcrypt Password Hashing & JWT (JSON Web Tokens)

Welcome to this comprehensive, beginner-friendly guide! In this lecture, we introduce industry-standard security to our Express backend:
1. **Password Hashing with bcrypt:** Never storing plain-text passwords in our database.
2. **Stateless Authentication with JWT (JSON Web Tokens):** Issuing digitally signed tokens upon login.
3. **Route Protection with Express Middleware:** Protecting private API endpoints using the `Authorization: Bearer <token>` header.

---

## Table of Contents
1. [Introduction to Authentication](#1-introduction-to-authentication)
2. [Understanding bcrypt & Password Hashing](#2-understanding-bcrypt--password-hashing)
3. [Understanding JSON Web Tokens (JWT)](#3-understanding-json-web-tokens-jwt)
4. [Installing Required Dependencies](#4-installing-required-dependencies)
5. [Environment Configuration (`.env`)](#5-environment-configuration-env)
6. [Updating Registration with bcrypt](#6-updating-registration-with-bcrypt)
7. [Updating Login with bcrypt & JWT](#7-updating-login-with-bcrypt--jwt)
8. [Creating the JWT Authentication Middleware](#8-creating-the-jwt-authentication-middleware)
9. [Creating a Protected API Endpoint](#9-creating-a-protected-api-endpoint)
10. [Step-by-Step API Testing with Postman](#10-step-by-step-api-testing-with-postman)
11. [The Complete Authentication Architecture Flow](#11-the-complete-authentication-architecture-flow)
12. [Summary & Quick Reference Comparison Tables](#12-summary--quick-reference-comparison-tables)

---

## 1. Introduction to Authentication

### What is Authentication?
**Authentication** is the process of verifying identity: confirming that a user is truly who they claim to be. In web applications, this is traditionally accomplished when a user provides an **identifier** (their email address) and a **secret** (their password).

### Authentication vs. Authorization
While often confused, they solve two different problems:
- **Authentication:** *"Who are you?"* (e.g., logging in with email and password).
- **Authorization:** *"What permissions do you have?"* (e.g., an ordinary customer cannot access the admin dashboard).

### Why Do We Need Password Hashing and JWT?
1. **Password Hashing:** Protects user credentials *at rest* inside the database. If your database server is ever compromised or leaked, attackers will only find mathematically irreversible hash strings, not real user passwords.
2. **JSON Web Tokens (JWT):** Protects requests *in transit*. HTTP is a **stateless** protocol—the server forgets who you are the moment a request completes. A JWT acts as a digital, tamper-proof ID card that the client sends with every subsequent request.

---

## 2. Understanding bcrypt & Password Hashing

### The Danger of Storing Plain-Text Passwords
If a database stores plain-text passwords:
- A malicious database administrator, rogue developer, or hacker can see all passwords directly.
- Because over 70% of internet users reuse the same password across multiple websites (Google, banking, social media), a breach in your app compromises their entire digital life.

### What is a Cryptographic Hash Function?
A **hash function** is a one-way mathematical algorithm that takes input data (such as a password) of any length and transforms it into a fixed-length string of characters (a digest).

```
Plain Text: "mypassword123" ───► Hash Function ───► "$2b$10$wT8KkC8hY8sZ..."
```

#### Key Properties of Cryptographic Hashing:
1. **One-Way (Irreversible):** It is computationally impossible to reconstruct `"mypassword123"` from the hash.
2. **Deterministic:** The exact same input processed with the same salt always generates the same output.
3. **Avalanche Effect:** Changing even a single character (e.g., `"Mypassword123"`) produces a completely unrecognizable, radically different hash.

---

### What Makes bcrypt Special?

#### 1. Automatic Salting (Defense Against Rainbow Tables)
A **Salt** is a sequence of cryptographically secure random bytes generated before hashing and blended into the password. 

```
Password: "password123" + Salt: "x9$k2!pL" ───► Hash: "$2b$10$x9k2pL..."
```

Even if 1,000 users all choose `"password123"`, bcrypt generates a unique salt for each user, so all 1,000 stored hashes are completely different. Attackers cannot use precomputed lookup tables (Rainbow Tables) to crack them.

#### 2. Adaptive Cost Factor (Work Factor)
Fast algorithms like MD5 or SHA-256 can calculate billions of hashes per second, making brute-force attacks easy. **bcrypt is intentionally slow**. The cost factor (`10`) represents $2^{10} = 1,024$ computational rounds. This negligible 0.1-second delay for a human login makes brute-forcing millions of guesses computationally infeasible for attackers.

---

### The Two Core bcrypt Functions

#### 1. `bcrypt.hash(password, saltRounds)`
Used during **Registration**:
```javascript
import bcrypt from "bcrypt";

const saltRounds = 10;
const hashedPassword = await bcrypt.hash("secret123", saltRounds);
// Result: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```
The resulting 60-character string embeds the algorithm identifier (`$2b$`), the cost factor (`10`), the 22-character salt, and the 31-character hash.

#### 2. `bcrypt.compare(candidatePassword, storedHash)`
Used during **Login**:
```javascript
const isMatch = await bcrypt.compare("secret123", storedHash);
// Returns: true if the password matches, false otherwise
```

> ⚠️ **Why Password Hashes are NEVER Decrypted:**  
> Beginners often ask: *"How do we decrypt the hash to check the password?"*  
> **You don't!** You cannot decrypt a hash. Instead, `bcrypt.compare()` extracts the original salt from the stored hash, hashes the candidate password entered by the user using that exact same salt, and compares whether the two hashes are identical!

---

## 3. Understanding JSON Web Tokens (JWT)

A **JSON Web Token (JWT)** (defined in RFC 7519) is a compact, URL-safe standard for securely transmitting verified claims between two parties.

### Why is JWT Used for Web APIs?
In traditional web apps, servers stored session IDs in memory or Redis and sent back a cookie. In modern distributed systems, mobile apps, and microservices:
- **Stateless:** The server does not store active sessions in a database.
- Everything needed to verify the user is securely encoded inside the token itself.
- Any backend server with the secret key can verify the token without querying a central session cache.

---

### Anatomy of a JWT

A JWT consists of three parts separated by periods (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSJ9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
└──────────────────┬─────────────────┘ └──────────────────────┬──────────────────────┘ └──────────────────────┬──────────────────────┘
               1. HEADER                                 2. PAYLOAD                                3. SIGNATURE
```

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER (Base64Url Encoded JSON)                                     │
│    { "alg": "HS256", "typ": "JWT" }                                    │
│    Tells which cryptographic algorithm is used.                        │
├────────────────────────────────────────────────────────────────────────┤
│ 2. PAYLOAD (Base64Url Encoded JSON)                                    │
│    { "id": 1, "email": "alice@example.com", "iat": 1700000000 }       │
│    Contains the claims (e.g. user ID). Visible to anyone!              │
├────────────────────────────────────────────────────────────────────────┤
│ 3. SIGNATURE (Cryptographic Verification Hash)                         │
│    HMACSHA256(Base64Url(Header) + "." + Base64Url(Payload), SecretKey) │
│    Guarantees the token has not been tampered with.                    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Why Can't a User Fake Their User ID in the Payload?
The payload is only Base64-encoded, not encrypted—anyone can read it. **However, nobody can modify it!**  
If a user changes `"id": 1` to `"id": 2`, the digital **Signature** will no longer match the payload when verified with the server's secret key. The server detects the tampering and immediately rejects the request.

---

### The Two Core JWT Functions

#### 1. `jwt.sign(payload, secretKey, options)`
Used during **Login** to issue a token:
```javascript
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user.id, email: user.email }, // Payload claims
  process.env.JWT_SECRET,             // Secret key
  { expiresIn: "1h" }                 // Expires in 1 hour
);
```

#### 2. `jwt.verify(token, secretKey)`
Used in **Middleware** to authenticate requests:
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Returns: { id: 1, email: "alice@example.com", iat: 1700000000, exp: 1700003600 }
// Throws an error if the token is forged, expired, or invalid!
```

---

## 4. Installing Required Dependencies

We need two production packages:
- `bcrypt`: For hashing passwords and verifying login hashes.
- `jsonwebtoken`: For generating and verifying JSON Web Tokens.

### Installation Command:
Run this command in your project terminal:

```bash
npm install bcrypt jsonwebtoken
```

### Verifying `package.json`:
Open [package.json](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/package.json). You will now see both dependencies listed:

```json
{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "dotenv": "^18.0.8",
    "drizzle-orm": "^0.45.4",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.23.1"
  }
}
```

---

## 5. Environment Configuration (`.env`)

A JWT's security depends entirely on keeping the signing key secret. If an attacker discovers your `JWT_SECRET`, they can forge valid authentication tokens for any user in your system!

### Configuring `.env`:
Open [.env](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/.env) and add `JWT_SECRET`:

```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=supersecretjwtkey123
```

> 🔒 **Security Rules for Secrets:**
> 1. **Never hardcode secrets:** Never write your secret directly into JavaScript files.
> 2. **Never commit `.env` to Git:** Keep `.env` listed inside `.gitignore`.
> 3. **Production Secrets:** In production, use a long, cryptographically random string (e.g. 64 random characters).

---

## 6. Updating Registration with bcrypt

When a user registers:
1. Validate required fields (`name`, `email`, `password`).
2. Check if a user with that email already exists in the database.
3. Hash the plain-text password using `bcrypt.hash(password, 10)`.
4. Insert the user into PostgreSQL using the hashed password.
5. Return the created user object **without** the password or hash.

### Controller Code ([controllers/auth.controller.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/controllers/auth.controller.js)):

```javascript
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmailService,
  findUserByIdService,
  createUserService,
  getAllUsersService,
} from "../services/auth.service.js";

// 1. POST /api/auth/register - Register with bcrypt hashing
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

    // Hash the password with bcrypt (10 rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save to database with the hashed password
    const newUser = await createUserService({
      ...(id !== undefined && { id: Number(id) }),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role ? String(role).trim() : "customer",
    });

    // Notice: password is NEVER returned in the response!
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
```

---

## 7. Updating Login with bcrypt & JWT

When a user logs in:
1. Validate that `email` and `password` are provided.
2. Find the user record in PostgreSQL by email.
3. Compare the candidate password with the stored hash using `bcrypt.compare()`.
4. If invalid, return `401 Unauthorized`.
5. If valid, sign a JWT containing the user's `id` and `email` in its payload.
6. Return the signed `token` and the user profile (excluding the password).

### Controller Code ([controllers/auth.controller.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/controllers/auth.controller.js)):

```javascript
// 2. POST /api/auth/login - Login with bcrypt verification & JWT generation
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

    // Verify password with bcrypt.compare()
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token with user ID in payload
    const secretKey = process.env.JWT_SECRET || "supersecretjwtkey123";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    // Strip password from returned payload
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
```

---

## 8. Creating the JWT Authentication Middleware

### What is Express Middleware?
In Express.js, middleware is a function that sits between an incoming HTTP request and your final route controller:

```
Request ──► Middleware 1 ──► Middleware 2 (verifyToken) ──► Controller ──► Response
```

A middleware function receives three arguments: `(req, res, next)`:
- `req`: The incoming request object.
- `res`: The outgoing response object.
- `next`: A callback function that passes control to the next handler in the chain.

---

### Understanding the `Authorization: Bearer <token>` Header
When sending requests to protected routes, clients pass their JWT in the standard HTTP `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
The word `Bearer` indicates that the presenter (bearer) of this token has authorization.

---

### Middleware Implementation:
Create the directory `middleware/` and add [middleware/auth.middleware.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/middleware/auth.middleware.js):

```javascript
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

    // 4. Extract the token string after "Bearer "
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is missing.",
      });
    }

    // 5. Verify the token using the secret key from .env
    const secretKey = process.env.JWT_SECRET || "supersecretjwtkey123";
    const decoded = jwt.verify(token, secretKey);

    // 6. Attach authenticated user payload (contains user ID) to req.user
    req.user = decoded;

    // 7. Call next() to allow execution to proceed to the controller!
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
```

---

## 9. Creating a Protected API Endpoint

Now we wire our `verifyToken` middleware into an endpoint in [routes/auth.route.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/routes/auth.route.js).

### Route Definition ([routes/auth.route.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/routes/auth.route.js)):

```javascript
import express from "express";
import {
  registerController,
  loginController,
  getProfileController,
  getAllUsersController,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes:
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/users", getAllUsersController);

// Protected Route (Requires valid JWT):
// Notice: verifyToken runs BEFORE getProfileController!
router.get("/profile", verifyToken, getProfileController);

export default router;
```

---

### Controller Code for Protected Endpoint:
Inside [controllers/auth.controller.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/controllers/auth.controller.js):

```javascript
// 3. GET /api/auth/profile - Protected route requiring JWT
export const getProfileController = async (req, res) => {
  try {
    // req.user was securely attached by verifyToken middleware!
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
```

---

## 10. Step-by-Step API Testing with Postman

Ensure your server is running before testing:
```bash
npm run dev
```

---

### Step 1: Register a New User with bcrypt Hashing
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "secretpassword123",
    "role": "customer"
  }
  ```
- **cURL Command:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "password": "secretpassword123", "role": "customer"}'
  ```
- **Expected Status:** `201 Created`
- **Expected Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "customer",
      "created_at": "2026-11-12T05:00:00.000Z"
    }
  }
  ```
*(Notice: The password is NEVER returned in the API response!)*

---

### Step 2: Verify Password is Hashed in the Database
If you inspect the PostgreSQL database (via Supabase or `drizzle-kit studio`), the `password` column for Alice contains a 60-character bcrypt hash, such as:
```
$2b$10$2BBsSFWt9QpzPjJB8wn6KeJBzXXCGPmJVPtew7veF/cIxDd7YZDAS
```
The plain-text password `"secretpassword123"` is nowhere in the database!

---

### Step 3: Log In to Receive a JWT Token
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "alice@example.com",
    "password": "secretpassword123"
  }
  ```
- **cURL Command:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "alice@example.com", "password": "secretpassword123"}'
  ```
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTczMTM5ODQ1MCwiZXhwIjoxNzMxNDAyMDUwfQ.YOUR_TOKEN_SIGNATURE",
    "data": {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "customer",
      "created_at": "2026-11-12T05:00:00.000Z"
    }
  }
  ```

---

### Step 4: Copy the Returned JWT Token
Copy the value of the `"token"` field from the login response. You will need it for the next tests.

---

### Step 5: Access Protected Route WITHOUT a Token (Negative Test)
Try accessing the protected route without providing any authorization header.

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/profile`
- **Headers:** `(None)`
- **cURL Command:**
  ```bash
  curl -X GET http://localhost:3000/api/auth/profile
  ```
- **Expected Status:** `401 Unauthorized`
- **Expected Response:**
  ```json
  {
    "success": false,
    "message": "Access denied. No token provided."
  }
  ```

---

### Step 6: Access Protected Route with an INVALID Token (Negative Test)
Send a fake or modified token string.

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/profile`
- **Headers:** `Authorization: Bearer invalid_fake_token_123`
- **cURL Command:**
  ```bash
  curl -X GET http://localhost:3000/api/auth/profile \
    -H "Authorization: Bearer invalid_fake_token_123"
  ```
- **Expected Status:** `401 Unauthorized`
- **Expected Response:**
  ```json
  {
    "success": false,
    "message": "Invalid or expired token."
  }
  ```

---

### Step 7: Access Protected Route WITH the Valid JWT Token (Positive Test)
Now send the valid token obtained in Step 3.

#### In Postman:
1. Open a new request tab and select **GET**.
2. Enter the URL: `http://localhost:3000/api/auth/profile`.
3. Click the **Authorization** tab underneath the URL bar.
4. Set the **Type** dropdown to **Bearer Token**.
5. Paste your copied token in the **Token** field.
6. Click the blue **Send** button.

#### Using cURL:
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Step 8: Verify the Protected API Response
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Access granted to protected route",
    "userId": 1,
    "data": {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "customer",
      "created_at": "2026-11-12T05:00:00.000Z"
    }
  }
  ```
The middleware successfully verified the token signature, extracted Alice's user ID (`1`), attached it to `req.user`, and the controller safely retrieved Alice's profile!

---

## 11. The Complete Authentication Architecture Flow

Here is how all the pieces connect across our three core workflows:

### Flow 1: User Registration
```
Client (Postman)
   │  Sends: POST /api/auth/register { name, email, password }
   ▼
Router (`routes/auth.route.js`)
   │  Directs to registerController
   ▼
Controller (`controllers/auth.controller.js`)
   │  1. Validates input
   │  2. Checks duplicate email via findUserByEmailService()
   │  3. Hashes password: bcrypt.hash(password, 10)
   ▼
Service Layer (`services/auth.service.js`)
   │  Inserts row into PostgreSQL: db.insert(userTable).values(...)
   ▼
Database (PostgreSQL)
   │  Stores: id, name, email, password_hash ($2b$10$...)
   ▼
Controller returns Response
   │  res.status(201).json({ success: true, data: userWithoutPassword })
```

---

### Flow 2: User Login & Token Generation
```
Client (Postman)
   │  Sends: POST /api/auth/login { email, password }
   ▼
Router (`routes/auth.route.js`)
   │  Directs to loginController
   ▼
Controller (`controllers/auth.controller.js`)
   │  1. Queries DB by email via findUserByEmailService()
   │  2. Verifies credentials: bcrypt.compare(password, user.password)
   │  3. Signs JWT: jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1h" })
   ▼
Controller returns Response
   │  res.status(200).json({ success: true, token: "eyJhbG...", data: safeUser })
```

---

### Flow 3: Protected Request Execution
```
Client (Postman)
   │  Sends: GET /api/auth/profile
   │  Header: Authorization: Bearer eyJhbG...
   ▼
Router (`routes/auth.route.js`)
   │  Invokes middleware first: verifyToken
   ▼
Middleware (`middleware/auth.middleware.js`)
   │  1. Extracts token string from Authorization header
   │  2. Verifies cryptographic signature: jwt.verify(token, secretKey)
   │  3. Attaches decoded claims to request: req.user = { id: 1, email: "..." }
   │  4. Calls next() to proceed
   ▼
Controller (`controllers/auth.controller.js` -> getProfileController)
   │  1. Reads req.user.id
   │  2. Retrieves profile data: findUserByIdService(req.user.id)
   ▼
Controller returns Response
   │  res.status(200).json({ success: true, userId: 1, data: userProfile })
```

---

## 12. Summary & Quick Reference Comparison Tables

### Comparison 1: Hashing vs. Encryption

| Property | Hashing (bcrypt) | Encryption (AES / RSA) |
|---|---|---|
| **Direction** | **One-way** operation. | **Two-way** operation. |
| **Reversibility** | Mathematically impossible to reverse. | Can be decrypted back into plain text with a key. |
| **Primary Purpose** | Password verification & data integrity. | Confidential message transmission. |
| **Ideal For** | Passwords, PINs, file checksums. | Banking details, emails, encrypted file storage. |

---

### Comparison 2: `bcrypt.hash()` vs. `bcrypt.compare()`

| Feature | `bcrypt.hash()` | `bcrypt.compare()` |
|---|---|---|
| **When It Is Used** | User **Registration** or password change. | User **Login**. |
| **Inputs** | `(plainPassword, saltRounds)` | `(candidatePassword, storedHash)` |
| **What It Does** | Generates a new random salt and calculates hash. | Re-hashes candidate using embedded salt and compares. |
| **Output** | 60-character bcrypt hash string. | Boolean (`true` or `false`). |

---

### Comparison 3: JWT Payload vs. JWT Signature

| Part | JWT Payload | JWT Signature |
|---|---|---|
| **Location** | Middle part of token (between 1st and 2nd dot). | Final part of token (after 2nd dot). |
| **Content** | User claims (`id`, `email`, `role`, `exp`). | Cryptographic hash of Header + Payload + Secret. |
| **Visibility** | **Public:** Anyone can decode and read it. | **Private:** Created using the server's secret key. |
| **Purpose** | Transmitting identity claims to the server. | Guaranteeing the payload was not tampered with. |

---

### Comparison 4: Public API vs. Protected API

| Property | Public API | Protected API |
|---|---|---|
| **Access** | Open to anyone on the internet. | Restricted to authenticated users. |
| **Authorization Header** | Not required. | Required (`Authorization: Bearer <token>`). |
| **Middleware** | None. | Guarded by `verifyToken` middleware. |
| **Examples** | `POST /api/auth/register`, `POST /api/auth/login`. | `GET /api/auth/profile`, `POST /api/orders`. |

---

### Comparison 5: Authentication vs. Authorization

| Concept | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| **Question Answered** | *"Who are you?"* | *"What are you allowed to do?"* |
| **Mechanism** | Email, password, bcrypt, JWT token generation. | Roles, permissions (`admin`, `customer`, `student`). |
| **Order** | Always happens **first**. | Always happens **second** (after identity is proven). |
| **HTTP Status Code** | `401 Unauthorized` (identity unverified). | `403 Forbidden` (identity known, but access denied). |

---

## Key Takeaways for Students

1. **Never store plain text passwords:** Storing raw passwords in a database is negligence. Always use `bcrypt.hash()` with at least 10 salt rounds.
2. **Never return passwords or hashes:** Always sanitize user objects before sending JSON responses back to the client.
3. **JWTs are for verification, not secrecy:** The JWT payload is only Base64-encoded. Never put sensitive secrets (like passwords or credit card numbers) inside a JWT payload.
4. **Protect your secrets:** Keep `JWT_SECRET` in `.env` and never commit it to source control.
5. **Middleware guards routes:** The `verifyToken` middleware halts unauthenticated requests at the door with HTTP `401`, keeping your controller logic clean, safe, and focused.
