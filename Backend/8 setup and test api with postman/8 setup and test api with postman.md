# 8. Setting Up Postman and Testing CRUD APIs (Complete Guide)

Welcome to this comprehensive hands-on guide! In the previous lecture ([7 HTTP Request methods.md](./7%20HTTP%20Request%20methods.md)), you learned the theory, architecture, and backend implementation of the 5 core HTTP request methods (**GET**, **POST**, **PUT**, **PATCH**, **DELETE**) using Express.js, Drizzle ORM, and PostgreSQL.

In this guide, you will learn:
1. **Part 1:** How to download, install, and configure **Postman** on Windows.
2. **Part 2:** How to perform complete, end-to-end API testing of all our backend endpoints using Postman.

---

## Part 1: Download & Setup Postman on Windows

### 1. What is Postman and Why Do We Need It?
When developing backend APIs, you need a way to send HTTP requests to test if your routes, controllers, and database queries are working properly.

#### Why isn't a web browser enough?
- When you type a URL into a web browser address bar (e.g. `http://localhost:3000/api/students`), the browser can **only** send a **`GET`** request.
- Browsers cannot easily send **`POST`**, **`PUT`**, **`PATCH`**, or **`DELETE`** requests with custom JSON request bodies or headers unless you write a complete frontend application with HTML forms and JavaScript (`fetch()` or `axios`).

**Postman** is an industry-standard API client that allows developers to:
- Send any HTTP request (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.) to any URL.
- Attach custom headers (like `Content-Type: application/json` or auth tokens).
- Send JSON request bodies easily with syntax highlighting.
- Inspect the server's response: HTTP status code, response time, response size, and formatted JSON data.
- Organize requests into reusable **Collections**.

---

### 2. How to Download Postman on Windows

You have two easy ways to install Postman on Windows:

#### Option A: Download via Official Website (Recommended for beginners)
1. Open your web browser and go to the official Postman download page:  
   👉 **[https://www.postman.com/downloads/](https://www.postman.com/downloads/)**
2. The website will automatically detect Windows. Click the blue **Download Windows 64-bit** button (or choose ARM64 if using an ARM-based Windows PC).
3. The installer executable file named `Postman-win64-Setup.exe` will be downloaded to your `Downloads` folder.

#### Option B: Fast Install via Windows Terminal / PowerShell (Using `winget`)
If you prefer the command line, open PowerShell or Windows Terminal and run:
```powershell
winget install Postman.Postman
```
Windows Package Manager will automatically download and install Postman for you.

---

### 3. Installing Postman on Windows

1. Locate the downloaded file `Postman-win64-Setup.exe` in your **Downloads** folder.
2. **Double-click** the `.exe` file to start the installation.
3. Postman installs silently into your user directory (no complicated setup wizard required).
4. Once installation completes, Postman will launch automatically and create a desktop shortcut.

---

### 4. First-Time Setup & Account Configuration

When Postman opens for the first time, you will see a welcome/sign-in screen:

```
┌────────────────────────────────────────────────────────┐
│                      POSTMAN                           │
│                                                        │
│   Create a free account to sync your work in cloud     │
│                                                        │
│   [ Sign In with Google ]                              │
│   [ Create Free Account ]                              │
│                                                        │
│   Skip and take me straight to the desktop app ───────┼──> (Click here to use offline!)
└────────────────────────────────────────────────────────┘
```

1. **Option 1 (Recommended):** Sign in with your Google account or create a free Postman account. This automatically backs up your requests and collections to the cloud.
2. **Option 2 (Fastest / No Account):** Click **"Skip and take me straight to the desktop app"** or **"Continue with lightweight API client"** at the bottom of the window. You can start testing immediately without signing in!

---

### 5. Understanding the Postman Interface

Familiarize yourself with the main layout of Postman:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Postman  [My Workspace]                                           [+]  [-]  │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ SIDEBAR      │ REQUEST BUILDER                                              │
│              │                                                              │
│ 📁 Collections│ [GET    ▼] [ http://localhost:3000/api/students      ] [Send]│
│ 🕒 History    ├──────────────────────────────────────────────────────────────┤
│ 🌐 Environ.  │ Params  |  Authorization  |  Headers  |  Body (● raw JSON)   │
│              │ {                                                            │
│              │   "name": "Charlie",                                         │
│              │   "cgpa": 3.9                                                │
│              │ }                                                            │
│              ├──────────────────────────────────────────────────────────────┤
│              │ RESPONSE PANEL                                               │
│              │ Status: 200 OK   Time: 42 ms   Size: 1.2 KB                  │
│              │ Pretty  Raw  Preview  [JSON ▼]                               │
│              │ {                                                            │
│              │   "success": true,                                           │
│              │   "data": [ ... ]                                            │
│              │ }                                                            │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

#### Key Sections:
1. **HTTP Method Dropdown:** Located to the left of the URL bar. Click to select `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`.
2. **URL Bar:** Where you enter your API endpoint (e.g., `http://localhost:3000/api/students`).
3. **Send Button:** Sends the HTTP request to your running backend server.
4. **Request Configuration Tabs:**
   - **Params:** For query parameters (e.g. `?page=1&limit=10`).
   - **Headers:** HTTP headers (e.g. `Content-Type: application/json`).
   - **Body:** Where you supply data for `POST`, `PUT`, and `PATCH` requests.
5. **Response Panel (Bottom):** Displays the server's reply:
   - **Status Code:** e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Server Error`.
   - **Time & Size:** Response latency and data payload size.
   - **Body Viewer:** Toggle between **Pretty** (colorized), **Raw**, and set format to **JSON**.

---

### 6. Setting Up a Postman Collection for Our Project

A **Collection** groups related requests into a single folder so you don't have to retype URLs every time.

1. On the left sidebar, click **Collections**.
2. Click the **`+`** (Create Collection) button.
3. Rename the collection to: **`Student Management API`**.
4. Inside this collection, click **Add a request** whenever you want to save a new test case.

---

### 7. Prerequisite: Make Sure Your Backend Server is Running!

Before you can test any API in Postman, your Express server must be actively running in your terminal:

```powershell
# Open terminal in project root and run:
npm run dev
```

You should see:
```
Server is running on port 3000
Database connected successfully
```

> ⚠️ **Important:** If your backend server is **not** running, Postman will return the error:  
> `Could not send request: Error: connect ECONNREFUSED 127.0.0.1:3000`.

---

## Part 2: Step-by-Step API Testing with Postman

We will test all 5 HTTP methods on our `/api/students` endpoint in logical CRUD order:
1. **GET** All Students (Read list)
2. **GET** Student by ID (Read single item)
3. **POST** Create New Student (Create item)
4. **PUT** Full Update / Replace Student (Replace all fields)
5. **PATCH** Partial Update Student (Update single field)
6. **DELETE** Remove Student (Delete item)
7. **GET** Verify Deletion (Negative test case / 404)

---

### 📌 Critical Skill: How to Configure Postman for JSON Request Bodies

Whenever sending data with **POST**, **PUT**, or **PATCH**, you **MUST** follow these 4 steps in the Body tab:

1. Click on the **Body** tab underneath the URL input bar.
2. Select the **`raw`** radio button.
3. On the far right, change the format dropdown from `Text` to **`JSON`**.  
   *(Notice: Postman automatically adds the header `Content-Type: application/json` for you!)*
4. Paste your valid JSON payload into the code editor.

```
  Params    Auth    Headers    Body (●)
  ○ none   ○ form-data   ○ x-www-form-urlencoded   ● raw   ○ binary   [ JSON ▼ ]
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 1 {                                                                    │
  │ 2   "id": 10,                                                          │
  │ 3   "name": "Charlie",                                                 │
  │ 4   "cgpa": 3.9                                                        │
  │ 5 }                                                                    │
  └────────────────────────────────────────────────────────────────────────┘
```

> 💡 **Pro-Tip (1-Click cURL Import):**  
> In Postman, click the **Import** button (top-left) or press `Ctrl + O`, paste any of the `curl` commands provided in each test below, and Postman will automatically set the Method, URL, Headers, and JSON Body for you!

---

### Test Case 1: GET All Students

Retrieve the entire list of student records from PostgreSQL.

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `GET` |
| **Request URL** | `http://localhost:3000/api/students` |
| **Body Tab** | `none` *(GET requests do not have a body)* |

#### 2. 1-Click Import (cURL):
```bash
curl -X GET http://localhost:3000/api/students
```

#### 3. Execution:
Click the blue **Send** button.

#### 4. Expected Response:
- **Status:** `200 OK`
- **Response Body (Pretty → JSON):**
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

### Test Case 2: GET Student by ID

Retrieve a single student record using the dynamic URL parameter (`/:id`).

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `GET` |
| **Request URL** | `http://localhost:3000/api/students/1` |
| **Body Tab** | `none` |

#### 2. 1-Click Import (cURL):
```bash
curl -X GET http://localhost:3000/api/students/1
```

#### 3. Expected Response:
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

### Test Case 3: POST Create a New Student

Create a brand new student record in the database by sending a JSON payload.

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `POST` |
| **Request URL** | `http://localhost:3000/api/students` |
| **Headers Tab** | `Content-Type: application/json` |
| **Body Tab** | Select **`raw`** → dropdown **`JSON`** |

#### 2. Request Body (JSON):
```json
{
  "id": 10,
  "name": "Charlie",
  "cgpa": 3.9,
  "password": "secret123"
}
```

#### 3. 1-Click Import (cURL):
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"id": 10, "name": "Charlie", "cgpa": 3.9, "password": "secret123"}'
```

#### 4. Expected Response:
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

#### 5. Negative Testing / Validation Checks:
Try testing invalid input to ensure the controller's validation guards work:
- **Test 3A (Missing `name`):** Send `{"id": 11}` without a name.  
  - **Expected Status:** `400 Bad Request`  
  - **Message:** `"id and name are required fields"`
- **Test 3B (Duplicate `id`):** Send the exact same request with `id: 10` a second time.  
  - **Expected Status:** `409 Conflict`  
  - **Message:** `"Student with ID 10 already exists"`

---

### Test Case 4: PUT Replace an Entire Student Record

Completely replace an existing student's data. All updatable fields (`name`, `cgpa`, `password`) are sent.

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `PUT` |
| **Request URL** | `http://localhost:3000/api/students/10` |
| **Headers Tab** | `Content-Type: application/json` |
| **Body Tab** | Select **`raw`** → dropdown **`JSON`** |

#### 2. Request Body (JSON):
```json
{
  "name": "Charlie Brown",
  "cgpa": 3.95,
  "password": "newpassword"
}
```

#### 3. 1-Click Import (cURL):
```bash
curl -X PUT http://localhost:3000/api/students/10 \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie Brown", "cgpa": 3.95, "password": "newpassword"}'
```

#### 4. Expected Response:
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

### Test Case 5: PATCH Partially Update a Student

Update **only** the `cgpa` field of student `10` without modifying `name` or `password`.

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `PATCH` |
| **Request URL** | `http://localhost:3000/api/students/10` |
| **Headers Tab** | `Content-Type: application/json` |
| **Body Tab** | Select **`raw`** → dropdown **`JSON`** |

#### 2. Request Body (JSON):
```json
{
  "cgpa": 4.0
}
```

#### 3. 1-Click Import (cURL):
```bash
curl -X PATCH http://localhost:3000/api/students/10 \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 4.0}'
```

#### 4. Expected Response:
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
*(Notice that `name` remained `"Charlie Brown"` and `password` remained intact!)*

---

### Test Case 6: DELETE a Student

Remove student `10` from the database.

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `DELETE` |
| **Request URL** | `http://localhost:3000/api/students/10` |
| **Body Tab** | `none` *(Target identifier is in the URL)* |

#### 2. 1-Click Import (cURL):
```bash
curl -X DELETE http://localhost:3000/api/students/10
```

#### 3. Expected Response:
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
```

---

### Test Case 7: Verifying Deletion (Negative Test Case)

Send a `GET` request for student `10` immediately after deletion to verify that the record no longer exists.

#### 1. Configuration in Postman:
| Field | Value |
|---|---|
| **HTTP Method** | `GET` |
| **Request URL** | `http://localhost:3000/api/students/10` |
| **Body Tab** | `none` |

#### 2. 1-Click Import (cURL):
```bash
curl -X GET http://localhost:3000/api/students/10
```

#### 3. Expected Response:
- **Status:** `404 Not Found`
- **Response Body (Pretty → JSON):**
```json
{
  "success": false,
  "message": "Student with ID 10 not found"
}
```

---

## Part 3: API Testing Summary Table

Here is the quick reference card for all the test cases we executed:

| Test # | Goal | HTTP Method | URL | Body Format | Expected Status |
|---|---|---|---|---|---|
| **1** | Get All Students | `GET` | `http://localhost:3000/api/students` | `none` | `200 OK` |
| **2** | Get Student by ID | `GET` | `http://localhost:3000/api/students/1` | `none` | `200 OK` |
| **3** | Create Student | `POST` | `http://localhost:3000/api/students` | `raw` → `JSON` | `201 Created` |
| **4** | Replace Student (Full) | `PUT` | `http://localhost:3000/api/students/10` | `raw` → `JSON` | `200 OK` |
| **5** | Update Student (Partial)| `PATCH` | `http://localhost:3000/api/students/10` | `raw` → `JSON` | `200 OK` |
| **6** | Delete Student | `DELETE` | `http://localhost:3000/api/students/10` | `none` | `200 OK` |
| **7** | Verify Deletion | `GET` | `http://localhost:3000/api/students/10` | `none` | `404 Not Found` |

---

## Part 4: Common Postman Errors & Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| **`Error: connect ECONNREFUSED 127.0.0.1:3000`** | Your Express backend is not running. | Run `npm run dev` in your project terminal and ensure the server says `Server is running on port 3000`. |
| **`404 Cannot GET /students`** | Missing route prefix in the URL. | Make sure the URL includes `/api/students` (not just `/students`). |
| **`400 Bad Request` or JSON SyntaxError** | Malformed JSON in the Body tab. | Ensure you use double quotes (`"`) around keys and string values, and no trailing commas. |
| **Postman keeps loading forever (hangs)** | The controller did not return a response (`res.status().json()`). | Check your controller functions to make sure `return res.status(...)` is called in both `try` and `catch` blocks. |
| **`req.body` is `undefined` on server** | Missing JSON parser middleware. | Ensure `app.use(express.json())` is placed before mounting routes in `index.js`. |
