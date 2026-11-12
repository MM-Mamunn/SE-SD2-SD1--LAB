# 9. Mastering SQL JOINs, GROUP BY, HAVING, Aggregate Functions & User Authentication

Welcome to this comprehensive, hands-on backend guide! In this lecture, we extend our Express, Drizzle ORM, and PostgreSQL backend to learn how modern relational databases connect multiple tables, manage user credentials, and perform analytical queries.

---

## Table of Contents
1. [Introduction to Relational Databases](#1-introduction-to-relational-databases)
2. [Understanding the Three Schemas](#2-understanding-the-three-schemas)
3. [Creating the Schemas in Drizzle ORM](#3-creating-the-schemas-in-drizzle-orm)
4. [Database Push (Schema Synchronization)](#4-database-push-schema-synchronization)
5. [User Authentication (Registration & Login)](#5-user-authentication-registration--login)
6. [Understanding SQL JOINs](#6-understanding-sql-joins)
7. [Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)](#7-aggregate-functions)
8. [GROUP BY: Aggregating Data by Category](#8-group-by)
9. [HAVING: Filtering Aggregated Groups](#9-having)
10. [Step-by-Step API Testing with Postman](#10-step-by-step-api-testing-with-postman)
11. [Complete Request Lifecycle](#11-complete-request-lifecycle)
12. [Summary & Quick Reference Comparison Tables](#12-summary--quick-reference-comparison-tables)

---

## 1. Introduction to Relational Databases

### What is a Relational Database?
A **Relational Database Management System (RDBMS)** stores information in structured, two-dimensional tables consisting of rows and columns. What makes relational databases powerful is that data across different tables can be logically linked using common values known as **Keys**.

### Why Not Store Everything in a Single Giant Table?
Imagine trying to build an e-commerce or university management system using a single flat table:

```
| student_id | student_name | student_email | order_id | product_name | price | payment_id | payment_method |
| 1          | Alice        | alice@test.com| 101      | Laptop       | 999.0 | 5001       | Credit Card    |
| 1          | Alice        | alice@test.com| 102      | Mouse        | 25.0  | 5002       | Bkash          |
```

This "flat file" approach introduces three major database anomalies:
1. **Redundancy & Bloat:** Alice's name, email, and password hash are duplicated for every single purchase.
2. **Update Anomalies:** If Alice updates her email address, every row containing her previous orders must be modified. If even one row is missed, data becomes inconsistent.
3. **Deletion Anomalies:** If you delete Alice's only order, you accidentally delete Alice's entire customer account from the database!

### The Solution: Table Normalization & Relationships
By splitting data into three distinct, related entities:
- **`users`**: Stores user identity and login credentials once.
- **`orders`**: Stores transactions placed by a user.
- **`payments`**: Stores financial settlement records for an order.

### Primary Keys vs. Foreign Keys
- **Primary Key (PK):** A unique identifier for every record in a table (e.g., `users.id`, `orders.id`). A primary key must never be `NULL` and can never contain duplicate values.
- **Foreign Key (FK):** A column in a child table that points directly to the Primary Key of a parent table (e.g., `orders.user_id` points to `users.id`). This creates **Referential Integrity**, ensuring you cannot create an order for a user who does not exist.

---

## 2. Understanding the Three Schemas

Our application implements three tightly related tables:

1. **`users` (`userTable`)**:
   - Represents registered accounts.
   - Holds the user's name, unique email address, password, role, and registration timestamp.
2. **`orders` (`orderTable`)**:
   - Represents purchases or course orders placed by a user.
   - Contains a Foreign Key `user_id` pointing to `users.id`.
   - Stores product name, quantity, price, order status, and order date.
3. **`payments` (`paymentTable`)**:
   - Represents the monetary payment transaction for an order.
   - Contains a Foreign Key `order_id` pointing to `orders.id` AND a Foreign Key `user_id` pointing to `users.id`.
   - Stores payment amount, payment method (e.g., `"credit_card"`, `"bkash"`), status, and timestamp.

### Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "places (1:N)"
    USERS ||--o{ PAYMENTS : "makes (1:N)"
    ORDERS ||--o{ PAYMENTS : "paid via (1:N)"

    USERS {
        bigserial id PK "Primary Key"
        varchar name "Full Name"
        varchar email UK "Unique Email Address"
        text password "User Password"
        varchar role "Role (customer/student)"
        timestamp created_at "Registration Time"
    }

    ORDERS {
        bigserial id PK "Primary Key"
        bigint user_id FK "References users.id"
        varchar product_name "Item or Course Title"
        integer quantity "Item Count"
        real price "Item / Order Price"
        varchar status "pending/completed"
        timestamp created_at "Order Timestamp"
    }

    PAYMENTS {
        bigserial id PK "Primary Key"
        bigint order_id FK "References orders.id"
        bigint user_id FK "References users.id"
        real amount "Amount Paid"
        varchar payment_method "Card / Bkash / Cash"
        varchar status "completed/failed"
        timestamp created_at "Payment Timestamp"
    }
```

---

## 3. Creating the Schemas in Drizzle ORM

We define these tables in [schema.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/schema.js) alongside our existing tables (`testTable` and `courseTable`).

### Complete Schema Code in `schema.js`:

```javascript
import { pgTable, bigint, varchar, real, timestamp, text, integer, bigserial } from "drizzle-orm/pg-core";

// 1. Existing table (preserved unchanged)
export const testTable = pgTable("test_table", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name"),
  cgpa: real("cgpa"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  password: text("password"),
});

// 2. Existing table (preserved unchanged)
export const courseTable = pgTable("courses", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  title: varchar("title"),
  code: varchar("code"),
});

// ==========================================
// NEW RELATED SCHEMAS: Users, Orders, Payments
// ==========================================

// 3. User Schema (Authentication & Base Entity)
export const userTable = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).default("customer"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 4. Order Schema (Related to Users)
export const orderTable = pgTable("orders", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  product_name: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: real("price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 5. Payment Schema (Related to Orders and Users)
export const paymentTable = pgTable("payments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  order_id: bigint("order_id", { mode: "number" })
    .notNull()
    .references(() => orderTable.id),
  user_id: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => userTable.id),
  amount: real("amount").notNull(),
  payment_method: varchar("payment_method", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

### Explaining the Data Types and Constraints:
- `bigserial("id", { mode: "number" }).primaryKey()`: An auto-incrementing 64-bit integer. PostgreSQL creates a sequence so you don't have to provide an ID manually when inserting rows. `{ mode: "number" }` ensures JavaScript handles the values as standard numbers.
- `varchar("email", { length: 255 }).notNull().unique()`: Restricts the email to 255 characters, prevents `null` values, and enforces uniqueness across the entire database.
- `text("password").notNull()`: A variable-length text field to store the user's password.
- `real("price")` and `real("amount")`: 4-byte single-precision floating point numbers ideal for currency, scores, and mathematical calculations.
- `.references(() => userTable.id)`: Sets up a strict Foreign Key relationship in PostgreSQL. If someone tries to insert an order with a non-existent `user_id`, PostgreSQL immediately rejects it with a Foreign Key Violation error.

---

## 4. Database Push (Schema Synchronization)

### What is `drizzle-kit push`?
In development, rather than creating separate `.sql` migration files for every small change, Drizzle Kit provides a rapid synchronization command: `drizzle-kit push`.
It connects directly to the database specified in your `.env` (`DATABASE_URL`), compares your live PostgreSQL schema against `schema.js`, and applies the necessary `CREATE TABLE` and `ADD CONSTRAINT` statements automatically!

### The Command for This Project
In [package.json](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/package.json), the script is pre-configured:

```bash
# Recommended project script:
npm run db:push

# Equivalent direct CLI command:
npx drizzle-kit push
```

### How to Execute:
1. Ensure your `.env` file contains your active database connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
   ```
2. Open your terminal in the project directory and run:
   ```bash
   npm run db:push
   ```
3. Drizzle Kit will prompt you to confirm the creation of the tables (`users`, `orders`, `payments`). Press **Enter** to accept.

### How to Verify the Tables Exist:
1. **Option A (Supabase / Database Console):** Open your Supabase Dashboard → **Table Editor** to view `users`, `orders`, and `payments`.
2. **Option B (Drizzle Studio):** Run `npx drizzle-kit studio` in your terminal to open a local visual database browser in your browser at `https://local.drizzle.studio`.

---

## 5. User Authentication (Registration & Login)

In this section, we implement core user authentication—**Registration** and **Login**—following our 3-layer architecture (**Route → Controller → Service**).

> 💡 **Educational Note on Passwords:**  
> To keep this lecture focused on relational databases, SQL queries, and beginner-friendly backend flow, we are using straightforward credential handling without external dependencies for now. Industry-standard password hashing (such as **bcrypt** and cryptographic salting) will be introduced in an upcoming security-focused lecture!

---

### How Authentication Works:
1. **Registration (`POST /api/auth/register`):**
   - The client sends `{ name, email, password, role }`.
   - The controller checks that required fields exist (returns `400 Bad Request` if missing).
   - The controller verifies that the email address is not already taken (returns `409 Conflict` if duplicate).
   - The service inserts the new record into the `users` table and returns the user info without exposing sensitive details.
2. **Login (`POST /api/auth/login`):**
   - The client sends `{ email, password }`.
   - The controller checks if an account exists with that email (returns `401 Unauthorized` if not found).
   - The controller verifies that the provided password matches the stored password (returns `401 Unauthorized` if incorrect).
   - Upon a match, it returns `200 OK` with the user profile (omitting the password).

---

### Code Implementation: Service Layer ([services/auth.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/auth.service.js))

```javascript
import db from "../drizzle.js";
import { userTable } from "../schema.js";
import { eq } from "drizzle-orm";

// 1. Find user by unique email
export const findUserByEmailService = async (email) => {
  const result = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email.toLowerCase().trim()));
  return result[0] || null;
};

// 2. Create a user record
export const createUserService = async (userData) => {
  const result = await db
    .insert(userTable)
    .values(userData)
    .returning({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      created_at: userTable.created_at,
    });
  return result[0];
};

// 3. Get all users (safely excluding password)
export const getAllUsersService = async () => {
  return await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      created_at: userTable.created_at,
    })
    .from(userTable);
};
```

---

### Code Implementation: Controller Layer ([controllers/auth.controller.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/controllers/auth.controller.js))

```javascript
import {
  findUserByEmailService,
  createUserService,
  getAllUsersService,
} from "../services/auth.service.js";

// 1. Register User
export const registerController = async (req, res) => {
  try {
    const { id, name, email, password, role } = req.body;

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

    // Save to database
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

// 2. Login User
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const user = await findUserByEmailService(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password match
    if (user.password !== String(password).trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Strip password from returned payload
    const { password: _excluded, ...safeUser } = user;

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
```

---

## 6. Understanding SQL JOINs

A **JOIN** clause is used in SQL to combine rows from two or more tables based on a related column between them (typically `Foreign Key = Primary Key`).

```
          ┌────────────────┐               ┌────────────────┐
          │     users      │               │     orders     │
          ├────────────────┤               ├────────────────┤
          │ id (PK)   ◄────┼───────────────┼── user_id (FK) │
          │ name           │               │ product_name   │
          │ email          │               │ price          │
          └────────────────┘               └────────────────┘
```

---

### A. Basic INNER JOIN
An **INNER JOIN** returns only the rows that have matching values in **both** tables. If a user has never placed an order, they will **not** appear in the result. If an order has no valid user, it will not appear.

#### SQL Equivalent:
```sql
SELECT 
  orders.id AS "orderId",
  orders.product_name AS "productName",
  orders.price AS "price",
  orders.quantity AS "quantity",
  orders.status AS "status",
  users.name AS "customerName",
  users.email AS "customerEmail"
FROM orders
INNER JOIN users ON orders.user_id = users.id;
```

#### Drizzle ORM Implementation ([services/order.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/order.service.js)):
```javascript
export const getOrdersInnerJoinService = async () => {
  return await db
    .select({
      orderId: orderTable.id,
      productName: orderTable.product_name,
      quantity: orderTable.quantity,
      price: orderTable.price,
      status: orderTable.status,
      customerName: userTable.name,
      customerEmail: userTable.email,
    })
    .from(orderTable)
    .innerJoin(userTable, eq(orderTable.user_id, userTable.id));
};
```

---

### B. LEFT JOIN (Left Outer Join)
A **LEFT JOIN** returns **all** records from the left table (`users`), and the matched records from the right table (`orders`). If a user has not placed any orders, the order fields will return as `null`.

#### Why is LEFT JOIN useful?
It allows you to identify inactive users (e.g. users where `orderId IS NULL`), display user profiles with optional purchase history, or generate comprehensive audits.

#### SQL Equivalent:
```sql
SELECT 
  users.id AS "userId",
  users.name AS "userName",
  users.email AS "userEmail",
  orders.id AS "orderId",
  orders.product_name AS "productName",
  orders.price AS "price",
  orders.status AS "orderStatus"
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

#### Drizzle ORM Implementation ([services/order.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/order.service.js)):
```javascript
export const getUsersLeftJoinOrdersService = async () => {
  return await db
    .select({
      userId: userTable.id,
      userName: userTable.name,
      userEmail: userTable.email,
      orderId: orderTable.id,
      productName: orderTable.product_name,
      price: orderTable.price,
      orderStatus: orderTable.status,
    })
    .from(userTable)
    .leftJoin(orderTable, eq(userTable.id, orderTable.user_id));
};
```

---

### C. JOIN with WHERE Filtering
You can filter the joined results using a `WHERE` clause. This allows you to combine relational data and only return records matching specific criteria (e.g., only `"completed"` orders).

#### SQL Equivalent:
```sql
SELECT 
  orders.id AS "orderId",
  orders.product_name AS "productName",
  orders.price AS "price",
  orders.status AS "status",
  users.name AS "customerName",
  users.email AS "customerEmail"
FROM orders
INNER JOIN users ON orders.user_id = users.id
WHERE orders.status = 'completed';
```

#### Drizzle ORM Implementation ([services/order.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/order.service.js)):
```javascript
export const getOrdersWithWhereService = async (status = "completed") => {
  return await db
    .select({
      orderId: orderTable.id,
      productName: orderTable.product_name,
      price: orderTable.price,
      status: orderTable.status,
      customerName: userTable.name,
      customerEmail: userTable.email,
    })
    .from(orderTable)
    .innerJoin(userTable, eq(orderTable.user_id, userTable.id))
    .where(eq(orderTable.status, status));
};
```

---

## 7. Aggregate Functions

An **Aggregate Function** performs a calculation on multiple values across a column and returns a single summary value.

The 5 fundamental SQL aggregate functions are:
1. **`COUNT(column)`**: Returns the total number of rows.
2. **`SUM(column)`**: Returns the mathematical sum of all numeric values.
3. **`AVG(column)`**: Returns the average (mean) of all numeric values.
4. **`MIN(column)`**: Returns the smallest value in the column.
5. **`MAX(column)`**: Returns the largest value in the column.

#### SQL Equivalent:
```sql
SELECT 
  COUNT(orders.id) AS "totalOrders",
  SUM(orders.price) AS "totalRevenue",
  AVG(orders.price) AS "averagePrice",
  MIN(orders.price) AS "minPrice",
  MAX(orders.price) AS "maxPrice"
FROM orders;
```

#### Drizzle ORM Implementation ([services/order.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/order.service.js)):
```javascript
import { count, sum, avg, min, max } from "drizzle-orm";

export const getOrderAggregatesService = async () => {
  const result = await db
    .select({
      totalOrders: count(orderTable.id),
      totalRevenue: sum(orderTable.price),
      averagePrice: avg(orderTable.price),
      minPrice: min(orderTable.price),
      maxPrice: max(orderTable.price),
    })
    .from(orderTable);

  const row = result[0] || {};
  return {
    totalOrders: Number(row.totalOrders || 0),
    totalRevenue: row.totalRevenue !== null ? Number(row.totalRevenue) : 0,
    averagePrice: row.averagePrice !== null ? Number(Number(row.averagePrice).toFixed(2)) : 0,
    minPrice: row.minPrice !== null ? Number(row.minPrice) : 0,
    maxPrice: row.maxPrice !== null ? Number(row.maxPrice) : 0,
  };
};
```

---

## 8. GROUP BY

### What Does `GROUP BY` Do?
The `GROUP BY` statement groups rows that have the same values in specified columns into summary rows (e.g. "Find the total money spent by *each* customer").

> ⚠️ **The Golden Rule of GROUP BY:**  
> Every column in your `SELECT` list that is **not** wrapped inside an aggregate function (`COUNT`, `SUM`, etc.) **MUST** be included in your `GROUP BY` clause!

### How the Query Works Step-by-Step:
1. It joins `users` and `orders`.
2. It groups all orders by `users.id`, `users.name`, and `users.email`.
3. For each unique user, it calculates `COUNT(orders.id)` and `SUM(orders.price)`.

#### SQL Equivalent:
```sql
SELECT 
  users.id AS "userId",
  users.name AS "userName",
  users.email AS "userEmail",
  COUNT(orders.id) AS "orderCount",
  SUM(orders.price) AS "totalSpent"
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name, users.email;
```

#### Drizzle ORM Implementation ([services/order.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/order.service.js)):
```javascript
export const getOrdersGroupByUserService = async () => {
  return await db
    .select({
      userId: userTable.id,
      userName: userTable.name,
      userEmail: userTable.email,
      orderCount: count(orderTable.id),
      totalSpent: sum(orderTable.price),
    })
    .from(userTable)
    .innerJoin(orderTable, eq(userTable.id, orderTable.user_id))
    .groupBy(userTable.id, userTable.name, userTable.email);
};
```

---

## 9. HAVING

### What Does `HAVING` Do?
The `HAVING` clause filters groups created by `GROUP BY`.

### The Crucial Difference: `WHERE` vs. `HAVING`
- **`WHERE`** filters individual rows **BEFORE** aggregation happens. (You *cannot* use aggregate functions like `WHERE COUNT(*) > 1`—SQL will throw a syntax error!).
- **`HAVING`** filters aggregated summary groups **AFTER** `GROUP BY` has collapsed the rows.

```
Individual Rows ──► [ WHERE Filter ] ──► [ GROUP BY ] ──► [ Aggregate Calculation ] ──► [ HAVING Filter ] ──► Final Result
```

### Demonstration: Find Repeat Customers Who Placed More Than 1 Order
We want to list only users whose order count exceeds `1`:

#### SQL Equivalent:
```sql
SELECT 
  users.id AS "userId",
  users.name AS "userName",
  users.email AS "userEmail",
  COUNT(orders.id) AS "orderCount",
  SUM(orders.price) AS "totalSpent"
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name, users.email
HAVING COUNT(orders.id) > 1;
```

#### Drizzle ORM Implementation ([services/order.service.js](file:///c:/Users/USER/Desktop/T/Resources/Backend/3%20connect%20DB%20Connected/services/order.service.js)):
```javascript
import { gt, count } from "drizzle-orm";

export const getOrdersHavingFilterService = async (minOrders = 1) => {
  return await db
    .select({
      userId: userTable.id,
      userName: userTable.name,
      userEmail: userTable.email,
      orderCount: count(orderTable.id),
      totalSpent: sum(orderTable.price),
    })
    .from(userTable)
    .innerJoin(orderTable, eq(userTable.id, orderTable.user_id))
    .groupBy(userTable.id, userTable.name, userTable.email)
    .having(gt(count(orderTable.id), minOrders));
};
```

---

## 10. Step-by-Step API Testing with Postman

Ensure your server is running (`npm run dev`) before testing!

### Test 1: Register User 1 (Alice)
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
    -d '{"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "password": "secretpassword123"}'
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

---

### Test 2: Register User 2 (Bob)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body (raw JSON):**
  ```json
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "password": "bobpassword456",
    "role": "customer"
  }
  ```
- **Expected Status:** `201 Created`

---

### Test 3: Register User 3 (Charlie - Inactive User with 0 Orders)
*(Charlie will be used to demonstrate how LEFT JOIN captures users with no orders!)*
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body (raw JSON):**
  ```json
  {
    "id": 3,
    "name": "Charlie Brown",
    "email": "charlie@example.com",
    "password": "charliepass789"
  }
  ```
- **Expected Status:** `201 Created`

---

### Test 4: User Login Verification
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (raw JSON):**
  ```json
  {
    "email": "alice@example.com",
    "password": "secretpassword123"
  }
  ```
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
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

### Test 5: Create Orders for Users
Create 3 sample orders so we have rich data to join and aggregate:

#### Order 1 (Alice buys Laptop for \$999.00):
- **POST** `http://localhost:3000/api/orders`
- **Body:** `{"id": 101, "user_id": 1, "product_name": "Laptop", "quantity": 1, "price": 999.0, "status": "completed"}`

#### Order 2 (Alice buys Wireless Mouse for \$25.00):
- **POST** `http://localhost:3000/api/orders`
- **Body:** `{"id": 102, "user_id": 1, "product_name": "Wireless Mouse", "quantity": 1, "price": 25.0, "status": "completed"}`

#### Order 3 (Bob buys Mechanical Keyboard for \$75.00):
- **POST** `http://localhost:3000/api/orders`
- **Body:** `{"id": 103, "user_id": 2, "product_name": "Mechanical Keyboard", "quantity": 1, "price": 75.0, "status": "pending"}`

---

### Test 6: Create Payment Record
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/orders/payment`
- **Body (raw JSON):**
  ```json
  {
    "id": 501,
    "order_id": 101,
    "user_id": 1,
    "amount": 999.0,
    "payment_method": "credit_card",
    "status": "completed"
  }
  ```
- **Expected Status:** `201 Created`

---

### Test 7: Execute INNER JOIN
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/inner-join`
- **cURL:** `curl -X GET http://localhost:3000/api/orders/inner-join`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "description": "INNER JOIN: Orders matched with their corresponding User",
    "count": 3,
    "data": [
      {
        "orderId": 101,
        "productName": "Laptop",
        "quantity": 1,
        "price": 999,
        "status": "completed",
        "customerName": "Alice Johnson",
        "customerEmail": "alice@example.com"
      },
      {
        "orderId": 102,
        "productName": "Wireless Mouse",
        "quantity": 1,
        "price": 25,
        "status": "completed",
        "customerName": "Alice Johnson",
        "customerEmail": "alice@example.com"
      },
      {
        "orderId": 103,
        "productName": "Mechanical Keyboard",
        "quantity": 1,
        "price": 75,
        "status": "pending",
        "customerName": "Bob Smith",
        "customerEmail": "bob@example.com"
      }
    ]
  }
  ```

---

### Test 8: Execute LEFT JOIN (Notice Charlie!)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/left-join`
- **cURL:** `curl -X GET http://localhost:3000/api/orders/left-join`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "description": "LEFT JOIN: All Users returned, with orders attached or null if none",
    "count": 4,
    "data": [
      {
        "userId": 1,
        "userName": "Alice Johnson",
        "userEmail": "alice@example.com",
        "orderId": 101,
        "productName": "Laptop",
        "price": 999
      },
      {
        "userId": 1,
        "userName": "Alice Johnson",
        "userEmail": "alice@example.com",
        "orderId": 102,
        "productName": "Wireless Mouse",
        "price": 25
      },
      {
        "userId": 2,
        "userName": "Bob Smith",
        "userEmail": "bob@example.com",
        "orderId": 103,
        "productName": "Mechanical Keyboard",
        "price": 75
      },
      {
        "userId": 3,
        "userName": "Charlie Brown",
        "userEmail": "charlie@example.com",
        "orderId": null,
        "productName": null,
        "price": null
      }
    ]
  }
  ```
*(Notice: Charlie has never ordered, but appears in the result with `orderId: null`!)*

---

### Test 9: Execute JOIN with WHERE Filtering
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/with-where?status=completed`
- **Expected Status:** `200 OK`
- **Expected Output:** Returns only Alice's orders (`Laptop` and `Wireless Mouse`), excluding Bob's `pending` keyboard.

---

### Test 10: Execute Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/aggregates`
- **cURL:** `curl -X GET http://localhost:3000/api/orders/aggregates`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "description": "Aggregate functions: COUNT, SUM, AVG, MIN, MAX over all orders",
    "data": {
      "totalOrders": 3,
      "totalRevenue": 1099,
      "averagePrice": 366.33,
      "minPrice": 25,
      "maxPrice": 999
    }
  }
  ```

---

### Test 11: Execute GROUP BY
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/group-by-user`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "description": "GROUP BY: Orders grouped by User to compute count and total spent per user",
    "count": 2,
    "data": [
      {
        "userId": 1,
        "userName": "Alice Johnson",
        "userEmail": "alice@example.com",
        "orderCount": 2,
        "totalSpent": 1024
      },
      {
        "userId": 2,
        "userName": "Bob Smith",
        "userEmail": "bob@example.com",
        "orderCount": 1,
        "totalSpent": 75
      }
    ]
  }
  ```

---

### Test 12: Execute HAVING Filter (Repeat Customers)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/having-filter?minOrders=1`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "success": true,
    "description": "HAVING: Groups filtered by HAVING COUNT(orders.id) > 1",
    "filter": {
      "minOrders": 1
    },
    "count": 1,
    "data": [
      {
        "userId": 1,
        "userName": "Alice Johnson",
        "userEmail": "alice@example.com",
        "orderCount": 2,
        "totalSpent": 1024
      }
    ]
  }
  ```
*(Bob is excluded because his order count is 1, not strictly greater than 1!)*

---

### Test 13: Execute 3-Table Multi-JOIN
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/orders/full-details`
- **Expected Status:** `200 OK`
- **Expected Output:** Orders joined with Customers and Payment settlement details.

---

## 11. Complete Request Lifecycle

Here is the exact journey of a request when a client executes a complex query:

```
1. Client (Postman)
      │  Sends: GET /api/orders/group-by-user
      ▼
2. Express App Entry Point (`index.js`)
      │  Routes /api/orders requests to order.route.js
      ▼
3. Router Layer (`routes/order.route.js`)
      │  Matches "GET /group-by-user" ──► invokes getOrdersGroupByUserController
      ▼
4. Controller Layer (`controllers/order.controller.js`)
      │  Validates request context, calls getOrdersGroupByUserService()
      ▼
5. Service Layer (`services/order.service.js`)
      │  Constructs Drizzle query:
      │  db.select({ ... }).from(userTable).innerJoin(orderTable).groupBy(...)
      ▼
6. ORM & Query Generation (Drizzle ORM)
      │  Translates JavaScript query builder into raw SQL:
      │  SELECT users.name, COUNT(orders.id), SUM(orders.price) ... GROUP BY ...
      ▼
7. Database Engine (PostgreSQL via node-postgres pool)
      │  Executes query plan, merges indexes, aggregates rows, returns recordset
      ▼
8. Controller Layer (`controllers/order.controller.js`)
      │  Formats result: res.status(200).json({ success: true, count: ..., data: ... })
      ▼
9. Client Receives Response (HTTP 200 OK + Formatted JSON Payload)
```

---

## 12. Summary & Quick Reference Comparison Tables

### Comparison 1: INNER JOIN vs. LEFT JOIN

| Feature | INNER JOIN | LEFT JOIN (LEFT OUTER JOIN) |
|---|---|---|
| **Matching Behavior** | Returns only rows that match in **both** tables. | Returns **all** rows from left table, plus matching rows from right table. |
| **Unmatched Rows** | Omitted entirely from the result set. | Preserved; columns from the right table are filled with `null`. |
| **Row Count** | Always $\le$ row count of either table. | Always $\ge$ row count of the left table. |
| **Typical Use Case** | Displaying orders that belong to an active customer. | Displaying a customer list including members who have never ordered. |

---

### Comparison 2: WHERE vs. HAVING

| Feature | `WHERE` Clause | `HAVING` Clause |
|---|---|---|
| **Execution Timing** | Filters rows **before** any grouping or aggregation. | Filters groups **after** `GROUP BY` aggregation. |
| **Aggregate Functions** | **Cannot** use aggregate functions (`WHERE COUNT(*) > 1` is illegal). | **Designed** to filter aggregates (`HAVING COUNT(*) > 1`). |
| **Applied To** | Individual table rows. | Summarized group rows. |
| **Performance** | Faster; reduces rows before grouping. | Slower; operates on grouped records after full table scan. |

---

### Comparison 3: The 5 Core Aggregate Functions

| Aggregate Function | Return Value | Ignores `NULL`? | Typical Example |
|---|---|---|---|
| **`COUNT(column)`** | Total number of non-null records. | Yes (unless `COUNT(*)`). | `COUNT(orderTable.id)` → Number of orders. |
| **`SUM(column)`** | Mathematical sum of all values. | Yes | `SUM(orderTable.price)` → Total sales revenue. |
| **`AVG(column)`** | Arithmetic mean of values. | Yes | `AVG(orderTable.price)` → Average basket value. |
| **`MIN(column)`** | Smallest value in column. | Yes | `MIN(orderTable.price)` → Cheapest item purchased. |
| **`MAX(column)`** | Largest value in column. | Yes | `MAX(orderTable.price)` → Most expensive item purchased. |

---

### Comparison 4: GROUP BY Purpose & Execution Rule

- **Purpose:** Collapses multiple individual rows that share common identifier values into a single categorized summary row.
- **Fundamental SQL Law:** Any column present in your `SELECT` list that is **not** passed through an aggregate function must be explicitly specified in your `GROUP BY` clause.
- **Example in Drizzle:**
  ```javascript
  // Selecting id, name, and email requires all three in groupBy:
  db.select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      total: sum(orderTable.price)
    })
    .from(userTable)
    .innerJoin(orderTable, eq(userTable.id, orderTable.user_id))
    .groupBy(userTable.id, userTable.name, userTable.email);
  ```

---

## Key Takeaways for Students

1. **Clean Authentication Architecture:** We implement clear separation of concerns (Route → Controller → Service) for registration and login; external password hashing libraries (like bcrypt) can easily be integrated later without altering your database schema or routes.
2. **Never expose passwords in responses:** Always strip or exclude password fields before returning user data to the client.
3. **Use INNER JOIN for mandatory associations:** When you only care about records that definitely have linked children.
4. **Use LEFT JOIN for inclusive reports:** When parent records must be visible regardless of whether child records exist.
5. **Remember the order of operations:**
   `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`.
