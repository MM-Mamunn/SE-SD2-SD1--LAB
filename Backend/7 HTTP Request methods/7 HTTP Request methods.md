# 7. Understanding the 5 Basic HTTP Request Methods (CRUD API)

Welcome to this lecture on HTTP request methods! In this guide, you will learn how a client (like a web browser, mobile app, or Postman) communicates with an Express backend using the five most common HTTP methods:

- **GET** (Read)
- **POST** (Create)
- **PUT** (Full Replace)
- **PATCH** (Partial Update)
- **DELETE** (Delete)

We will use our actual project codebase—built with **Express.js**, **Drizzle ORM**, and **PostgreSQL**—as the live teaching example.

---

## A. Introduction

### What is an HTTP Request?
When you browse the web or use an app, your device (the **Client**) sends a formatted text message over the internet to a server (the **Backend**). This message is called an **HTTP Request**.

An HTTP request consists of three main parts:
1. **Method (Verb):** What action you want the server to perform (e.g., `GET`, `POST`).
2. **URL / Path:** What specific resource you are targeting (e.g., `/api/students/1`).
3. **Body (Payload):** Optional JSON data you send with the request (e.g., student name and CGPA).

The server processes the request and sends back an **HTTP Response** with a status code (like `200 OK`, `201 Created`, or `404 Not Found`) and data (usually formatted as JSON).

### What are HTTP Methods?
HTTP methods are standardized action words that tell the server the *intent* of your request. By convention, web APIs follow the **REST** pattern, where different HTTP methods perform CRUD operations (Create, Read, Update, Delete) on the same resource URL:

```
          ┌─────────────┐
          │   Client    │
          │  (Postman)  │
          └──────┬──────┘
                 │
       HTTP Request (Method + URL + Body)
                 │
                 ▼
          ┌─────────────┐
          │   Backend   │
          │ (Express.js)│
          └──────┬──────┘
                 │
       Database Query via Drizzle ORM
                 │
                 ▼
          ┌─────────────┐
          │ PostgreSQL  │
          │ (Supabase)  │
          └─────────────┘
```

---

## B. Project Architecture & Folder Structure

Our backend follows a clean, 3-layer architecture: **Routes → Controllers → Services**.

```
project/
├── routes/
│   └── student.route.js      ← Defines endpoints & URL patterns
├── controllers/
│   └── student.controller.js ← Extracts params/body & returns HTTP status/JSON
├── services/
│   └── student.service.js    ← Executes database queries via Drizzle ORM
├── schema.js                 ← Database table blueprints
├── drizzle.js                ← Drizzle database instance
└── index.js                  ← App entry point & middleware
```

### Responsibility of Each Layer:

| Layer | File | Responsibility |
|---|---|---|
| **Entry Point** | `index.js` | Starts server, enables `express.json()` to parse request bodies, and mounts routers. |
| **Route Layer** | `student.route.js` | Directs URLs (`/api/students`, `/:id`) and HTTP methods (`GET`, `POST`, etc.) to controller functions. |
| **Controller Layer** | `student.controller.js` | Validates input (`req.params`, `req.body`), calls services, and sends HTTP status codes and responses. |
| **Service Layer** | `student.service.js` | Contains database operations using Drizzle ORM (`db.select()`, `db.insert()`, `db.update()`, `db.delete()`). |
| **Schema Layer** | `schema.js` | Defines the columns and types of the table in PostgreSQL (`testTable`). |

---

## C. GET Request (Read Data)

### 1. Purpose of GET
The **GET** method is used exclusively to **retrieve data** from the server. It should never modify or add data to the database.

### 2. Endpoints
We have two GET endpoints:
- `GET /api/students`: Retrieves all students.
- `GET /api/students/:id`: Retrieves one specific student by their ID.

### 3. Understanding `req.params`
In the route `/api/students/:id`, the `:id` is a dynamic placeholder called a **route parameter**.  
Express automatically extracts dynamic route values and places them inside the `req.params` object:
```javascript
// If a user calls GET /api/students/1
const { id } = req.params; // id will be "1"
```

### 4. Code Implementation

#### Service (`services/student.service.js`):
```javascript
// Retrieve all students
export const getAllStudentsService = async () => {
  return await db.select().from(testTable);
};

// Retrieve a single student by ID
export const getStudentByIdService = async (id) => {
  const result = await db
    .select()
    .from(testTable)
    .where(eq(testTable.id, Number(id)));
  return result[0] || null;
};
```

#### Controller (`controllers/student.controller.js`):
```javascript
export const getStudentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await getStudentByIdService(id);

    // If no student exists with this ID, return 404 Not Found
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`,
      });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
```

### 5. Example Postman Call: Retrieve Student by ID

- **HTTP Method:** `GET`
- **URL:** `http://localhost:3000/api/students/1`
- **Body Tab:** `none` *(GET requests do not send a request body)*
- **Headers:** *(Default Postman headers)*

#### 1-Click Postman Import (cURL):
```bash
curl -X GET http://localhost:3000/api/students/1
```

#### Expected Response in Postman:
- **Status:** `200 OK`
- **Response Body (Pretty → JSON):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice",
    "cgpa": 3.5,
    "created_at": "2026-10-15T04:04:14.530Z",
    "password": "123"
  }
}
```

---

## D. POST Request (Create Data)

### 1. Purpose of POST
The **POST** method is used to **submit new data** to the server to create a new database record.

### 2. Understanding `req.body`
When sending a POST request, data is sent as JSON inside the request body. Because we enabled `app.use(express.json())` in `index.js`, Express parses the incoming JSON and makes it accessible as `req.body`.

### 3. Basic Validation
Before saving data, the controller validates required fields (`id` and `name`). If missing, it immediately rejects the request with HTTP `400 Bad Request`. If the ID already exists, it returns HTTP `409 Conflict`.

### 4. Code Implementation

#### Service (`services/student.service.js`):
```javascript
export const createStudentService = async (studentData) => {
  const result = await db
    .insert(testTable)
    .values(studentData)
    .returning();
  return result[0];
};
```

#### Controller (`controllers/student.controller.js`):
```javascript
export const createStudentController = async (req, res) => {
  try {
    const { id, name, cgpa, password } = req.body;

    // Validate required fields
    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "id and name are required fields",
      });
    }

    // Check if ID already exists
    const existing = await getStudentByIdService(id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Student with ID ${id} already exists`,
      });
    }

    const newStudent = await createStudentService({
      id: Number(id),
      name,
      cgpa: cgpa !== undefined ? Number(cgpa) : null,
      password: password !== undefined ? String(password) : null,
    });

    // 201 Created indicates successful resource creation
    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
```

### 5. Example Postman Call: Create a Student

- **HTTP Method:** Select `POST` from the method dropdown
- **Request URL:** `http://localhost:3000/api/students`
- **Headers Tab:**
  - `Content-Type`: `application/json` *(Postman automatically sets this when you choose JSON body)*
- **Body Tab Configuration:**
  1. Click on the **Body** tab underneath the URL bar.
  2. Select the **raw** radio button.
  3. Change the dropdown on the far right from **Text** to **JSON**.
- **Request Body (Paste into the editor):**
```json
{
  "id": 10,
  "name": "Charlie",
  "cgpa": 3.9,
  "password": "secret123"
}
```

#### 1-Click Postman Import (cURL):
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"id": 10, "name": "Charlie", "cgpa": 3.9, "password": "secret123"}'
```

#### Expected Response in Postman:
- **Status:** `201 Created`
- **Response Body (Pretty → JSON):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 10,
    "name": "Charlie",
    "cgpa": 3.9,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "secret123"
  }
}
```

---

## E. PUT Request (Complete Replacement)

### 1. Purpose of PUT
The **PUT** method is used to **completely replace** an existing record.  
In HTTP semantics, PUT expects you to send the **complete set** of updatable fields. Any field you do not provide is reset to `null` or its default value.

### 2. Code Implementation

#### Service (`services/student.service.js`):
```javascript
export const replaceStudentService = async (id, studentData) => {
  const result = await db
    .update(testTable)
    .set({
      name: studentData.name,
      cgpa: studentData.cgpa !== undefined ? studentData.cgpa : null,
      password: studentData.password !== undefined ? studentData.password : null,
    })
    .where(eq(testTable.id, Number(id)))
    .returning();
  return result[0] || null;
};
```

#### Controller (`controllers/student.controller.js`):
```javascript
export const replaceStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cgpa, password } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required to replace the student record",
      });
    }

    const updatedStudent = await replaceStudentService(id, {
      name,
      cgpa: cgpa !== undefined ? Number(cgpa) : null,
      password: password !== undefined ? String(password) : null,
    });

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student replaced successfully",
      data: updatedStudent,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
```

### 3. Example Postman Call: Replace Complete Student Data

- **HTTP Method:** Select `PUT` from the method dropdown
- **Request URL:** `http://localhost:3000/api/students/10`
- **Headers Tab:**
  - `Content-Type`: `application/json`
- **Body Tab Configuration:**
  1. Click the **Body** tab.
  2. Select the **raw** radio button.
  3. Ensure format dropdown is set to **JSON**.
- **Request Body (Paste all updatable fields):**
```json
{
  "name": "Charlie Brown",
  "cgpa": 3.95,
  "password": "newpassword"
}
```

#### 1-Click Postman Import (cURL):
```bash
curl -X PUT http://localhost:3000/api/students/10 \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie Brown", "cgpa": 3.95, "password": "newpassword"}'
```

#### Expected Response in Postman:
- **Status:** `200 OK`
- **Response Body (Pretty → JSON):**
```json
{
  "success": true,
  "message": "Student replaced successfully",
  "data": {
    "id": 10,
    "name": "Charlie Brown",
    "cgpa": 3.95,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "newpassword"
  }
}
```

---

## F. PATCH Request (Partial Update)

### 1. Purpose of PATCH
The **PATCH** method is used to make a **partial update**.  
Unlike PUT, PATCH only modifies the specific fields provided in `req.body`. All other existing fields remain completely untouched.

### 2. PUT vs. PATCH: The Big Difference

```
Original Student: { id: 10, name: "Charlie", cgpa: 3.9, password: "123" }

If you send body: { "cgpa": 4.0 }

• With PUT (Replacement):
  Result: { id: 10, name: null, cgpa: 4.0, password: null }
  (Missing fields get wiped out or rejected!)

• With PATCH (Partial Update):
  Result: { id: 10, name: "Charlie", cgpa: 4.0, password: "123" }
  (Only cgpa changed, name & password stayed safe!)
```

### 3. Code Implementation

#### Service (`services/student.service.js`):
```javascript
export const updateStudentService = async (id, partialData) => {
  const result = await db
    .update(testTable)
    .set(partialData)
    .where(eq(testTable.id, Number(id)))
    .returning();
  return result[0] || null;
};
```

#### Controller (`controllers/student.controller.js`):
```javascript
export const updateStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cgpa, password } = req.body;

    // Collect ONLY the fields the user provided
    const partialData = {};
    if (name !== undefined) partialData.name = name;
    if (cgpa !== undefined) partialData.cgpa = Number(cgpa);
    if (password !== undefined) partialData.password = String(password);

    if (Object.keys(partialData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const updatedStudent = await updateStudentService(id, partialData);

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
```

### 4. Example Postman Call: Partial Student Update

- **HTTP Method:** Select `PATCH` from the method dropdown
- **Request URL:** `http://localhost:3000/api/students/10`
- **Headers Tab:**
  - `Content-Type`: `application/json`
- **Body Tab Configuration:**
  1. Click the **Body** tab.
  2. Select the **raw** radio button.
  3. Ensure format dropdown is set to **JSON**.
- **Request Body (Only the single field to change):**
```json
{
  "cgpa": 4.0
}
```

#### 1-Click Postman Import (cURL):
```bash
curl -X PATCH http://localhost:3000/api/students/10 \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 4.0}'
```

#### Expected Response in Postman:
- **Status:** `200 OK`
- **Response Body (Pretty → JSON):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 10,
    "name": "Charlie Brown",
    "cgpa": 4,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "newpassword"
  }
}
```

---

## G. DELETE Request (Remove Data)

### 1. Purpose of DELETE
The **DELETE** method is used to **remove a resource** from the database by its identifier (`:id`).

### 2. Code Implementation

#### Service (`services/student.service.js`):
```javascript
export const deleteStudentService = async (id) => {
  const result = await db
    .delete(testTable)
    .where(eq(testTable.id, Number(id)))
    .returning();
  return result[0] || null;
};
```

#### Controller (`controllers/student.controller.js`):
```javascript
export const deleteStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await deleteStudentService(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
```

### 3. Example Postman Call: Delete a Student

- **HTTP Method:** Select `DELETE` from the method dropdown
- **Request URL:** `http://localhost:3000/api/students/10`
- **Body Tab:** `none` *(DELETE requests targeting a URL parameter do not need a body)*

#### 1-Click Postman Import (cURL):
```bash
curl -X DELETE http://localhost:3000/api/students/10
```

#### Expected Response in Postman:
- **Status:** `200 OK`
- **Response Body (Pretty → JSON):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 10,
    "name": "Charlie Brown",
    "cgpa": 4,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "newpassword"
  }
}
If you call `GET /api/students/10` right after, the server returns:
```json
{
  "success": false,
  "message": "Student with ID 10 not found"
}
```
with status **`404 Not Found`**.

---

## H. Complete API Testing (Step-by-Step Postman Guide)

To test these APIs properly in **Postman** (or VS Code's **Thunder Client**), follow this exact UI guide.

### 📌 How to Configure Postman for JSON Requests (Important!)
Whenever you send data with **POST**, **PUT**, or **PATCH**, you **MUST** configure the Body tab correctly:
1. Open a new request tab in Postman by clicking the **`+`** button.
2. Select the **HTTP Method** from the dropdown menu to the left of the URL bar (`POST`, `PUT`, `PATCH`, etc.).
3. Type the request URL (e.g. `http://localhost:3000/api/students`).
4. Click on the **Body** tab underneath the URL.
5. Select the **`raw`** radio button.
6. Look at the dropdown on the far right (it defaults to `Text`): change it to **`JSON`**.
7. Paste your JSON data into the editor.
8. Click the blue **Send** button and view the response below.

> 💡 **Pro-Tip (1-Click Import):** In Postman, you can click the **Import** button in the top-left corner, paste any of the `curl` commands below, and Postman will automatically set up the method, URL, headers, and JSON body for you!

---

### Request 1: GET All Students
Fetches the entire list of students currently saved in the database.

| Postman Setting | Value |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/students` |
| **Body** | `none` |

#### cURL Command:
```bash
curl -X GET http://localhost:3000/api/students
```

#### Expected Response (`200 OK`):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Alice",
      "cgpa": 3.5,
      "created_at": "2026-10-15T04:04:14.530Z",
      "password": "123"
    },
    {
      "id": 2,
      "name": "Bob",
      "cgpa": 3.3,
      "created_at": "2026-10-15T04:04:28.142Z",
      "password": "1234"
    }
  ]
}
```

---

### Request 2: GET Student by ID
Fetches a single student using a dynamic URL path parameter (`:id`).

| Postman Setting | Value |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/students/1` |
| **Body** | `none` |

#### cURL Command:
```bash
curl -X GET http://localhost:3000/api/students/1
```

#### Expected Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice",
    "cgpa": 3.5,
    "created_at": "2026-10-15T04:04:14.530Z",
    "password": "123"
  }
}
```

---

### Request 3: POST Create a New Student
Creates a brand new student in the database.

| Postman Setting | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:3000/api/students` |
| **Headers** | `Content-Type: application/json` |
| **Body Format** | `raw` → `JSON` |

#### Request Body (JSON):
```json
{
  "id": 10,
  "name": "Charlie",
  "cgpa": 3.9,
  "password": "secret123"
}
```

#### cURL Command:
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"id": 10, "name": "Charlie", "cgpa": 3.9, "password": "secret123"}'
```

#### Expected Response (`201 Created`):
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 10,
    "name": "Charlie",
    "cgpa": 3.9,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "secret123"
  }
}
```

---

### Request 4: PUT Replace an Entire Student Record
Replaces all updatable fields (`name`, `cgpa`, `password`) of an existing student.

| Postman Setting | Value |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:3000/api/students/10` |
| **Headers** | `Content-Type: application/json` |
| **Body Format** | `raw` → `JSON` |

#### Request Body (JSON):
```json
{
  "name": "Charlie Brown",
  "cgpa": 3.95,
  "password": "newpassword"
}
```

#### cURL Command:
```bash
curl -X PUT http://localhost:3000/api/students/10 \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie Brown", "cgpa": 3.95, "password": "newpassword"}'
```

#### Expected Response (`200 OK`):
```json
{
  "success": true,
  "message": "Student replaced successfully",
  "data": {
    "id": 10,
    "name": "Charlie Brown",
    "cgpa": 3.95,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "newpassword"
  }
}
```

---

### Request 5: PATCH Partially Update a Student
Updates only specific fields (for example, just the `cgpa`) without modifying the other fields.

| Postman Setting | Value |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:3000/api/students/10` |
| **Headers** | `Content-Type: application/json` |
| **Body Format** | `raw` → `JSON` |

#### Request Body (JSON):
```json
{
  "cgpa": 4.0
}
```

#### cURL Command:
```bash
curl -X PATCH http://localhost:3000/api/students/10 \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 4.0}'
```

#### Expected Response (`200 OK`):
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 10,
    "name": "Charlie Brown",
    "cgpa": 4,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "newpassword"
  }
}
```

---

### Request 6: DELETE a Student
Removes a student record by ID.

| Postman Setting | Value |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:3000/api/students/10` |
| **Body** | `none` |

#### cURL Command:
```bash
curl -X DELETE http://localhost:3000/api/students/10
```

#### Expected Response (`200 OK`):
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 10,
    "name": "Charlie Brown",
    "cgpa": 4,
    "created_at": "2026-11-05T05:57:20.568Z",
    "password": "newpassword"
  }
}
```

---

### Request 7: Verifying Deletion (Negative Test Case)
Send a GET request to the deleted ID to verify that the server properly responds with a 404 status.

| Postman Setting | Value |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:3000/api/students/10` |
| **Body** | `none` |

#### Expected Response (`404 Not Found`):
```json
{
  "success": false,
  "message": "Student with ID 10 not found"
}
```

---

## I. Complete Request Lifecycle

Here is the exact journey of a request through our application layers:

```
1. Client (Postman)
      │  Sends: POST /api/students with JSON body
      ▼
2. Express Middleware (`index.js`)
      │  express.json() parses body into `req.body`
      ▼
3. Router (`routes/student.route.js`)
      │  Matches "POST /" → calls `createStudentController`
      ▼
4. Controller (`controllers/student.controller.js`)
      │  Validates `req.body.id` & `req.body.name`
      │  Calls `createStudentService()`
      ▼
5. Service (`services/student.service.js`)
      │  Executes `db.insert(testTable).values(...).returning()`
      ▼
6. Database (PostgreSQL via Drizzle ORM)
      │  Inserts row into `test_table` and returns inserted data
      ▼
7. Controller sends response
      │  `res.status(201).json({ success: true, data: newStudent })`
      ▼
8. Client receives: Status 201 Created + JSON body
```

---

## J. Summary: Comparison Table of HTTP Methods

| HTTP Method | CRUD Operation | Example URL | Request Body? | Status on Success | When to use |
|---|---|---|---|---|---|
| **GET** | **R**ead | `/api/students` or `/:id` | No | `200 OK` | Fetching resources without changing anything |
| **POST** | **C**reate | `/api/students` | Yes (JSON) | `201 Created` | Creating a brand new record |
| **PUT** | **U**pdate (Replace) | `/api/students/:id` | Yes (All fields) | `200 OK` | Completely replacing an existing record |
| **PATCH** | **U**pdate (Partial) | `/api/students/:id` | Yes (Some fields)| `200 OK` | Modifying only selected fields of a record |
| **DELETE** | **D**elete | `/api/students/:id` | No | `200 OK` | Removing an existing record |

---

## Key Takeaways for Students

1. **GET is safe & idempotent:** Calling GET 100 times changes nothing in the database.
2. **POST creates new resources:** Always returns `201 Created` when successful.
3. **PUT replaces, PATCH updates:** Use PUT when submitting the entire form/resource; use PATCH when changing just a single property (like toggling a status or updating a CGPA).
4. **Always use appropriate status codes:**
   - `200 OK`: Successful read, update, or delete.
   - `201 Created`: Successful creation.
   - `400 Bad Request`: Client sent missing or invalid data.
   - `404 Not Found`: Target record doesn't exist.
   - `500 Internal Server Error`: Unexpected server/database crash.
