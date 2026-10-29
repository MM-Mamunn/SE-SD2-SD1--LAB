# Organizing Routes and Controllers in Express.js

This guide explains how to organize an Express.js backend using **routes** and **controllers**, the basic HTTP methods, and `express.json()`.

## 1. Routes directory

Create a `routes` directory to group related URLs into separate files.

The current project has a `student.route.js` file for student routes. In a larger project, you could add separate route files for other resources.

- `student.route.js` contains routes related to students.
- `teacher.route.js` contains routes related to teachers.
- `classroom.route.js` contains routes related to classrooms.

This keeps the project's URLs organized and easier to maintain.

### Example: `routes/student.route.js`

```javascript
import express from "express";
import { profileFunction } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/profile", profileFunction);

export default router;
```

What the code does:

- `express.Router()` creates a router for this group of routes.
- `router.get("/profile", profileFunction)` connects a GET request to `/profile` with the `profileFunction` controller. This is the route currently implemented in this project.
- `export default router` lets `index.js` import and use this router.

## 2. Controllers directory

Create a `controllers` directory to group the logic that handles requests.

The current project has a `student.controller.js` file. In a larger project, you could add separate controllers for other resources.

- `student.controller.js` contains logic related to student requests.
- `teacher.controller.js` contains logic related to teacher requests.
- `classroom.controller.js` contains logic related to classroom requests.

### Example: `controllers/student.controller.js`

```javascript
const profileFunction = async (req, res) => {
  try {
    const message = "Name: XYZ, ID: 12345, Course: ABC";

    return res.status(200).json({ message });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

export { profileFunction };
```

What the code does:

- `req` contains information about the incoming request.
- `res` is used to send a response to the client.
- `res.status(200).json({ message })` sends a successful response as JSON.
- `try...catch` lets the code handle errors.
- `export { profileFunction }` makes the function available to the route file.

## 3. Connect the route in `index.js`

The current `index.js` imports the student router and mounts it at `/api/student`:

```javascript
import express from "express";
import studentRoutes from "./routes/student.route.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

Express combines the mount path (`/api/student`) with the router path (`/profile`). The implemented profile endpoint is:

```text
GET http://localhost:3000/api/student/profile
```

Call it with:

```sh
curl http://localhost:3000/api/student/profile
```

The controller currently returns this JSON response:

```json
{
  "message": "Name: XYZ, ID: 12345, Course: ABC"
}
```

The app also has a separate root endpoint, `GET http://localhost:3000/`, which responds with `Hello World!!`.

## 4. Common HTTP methods

HTTP methods describe what the client wants the server to do. These are their common uses:

| Method | Basic purpose | Example |
|---|---|---|
| `GET` | Read or retrieve data. | Get a student's profile. |
| `POST` | Send data to create something or perform an action. | Create a student. |
| `PUT` | Replace an existing resource, usually with a complete updated version. | Replace a student's profile. |
| `PATCH` | Update part of an existing resource. | Change only a student's course. |
| `DELETE` | Delete a resource. | Delete a student record. |

### Basic route examples (not implemented in this project)

```javascript
router.get("/students", getStudents);
router.post("/students", createStudent);
router.put("/students/:id", replaceStudent);
router.patch("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
```

These are illustrative patterns only; the current project implements only `GET /api/student/profile` (plus the root `GET /`). To add one of these routes, define and import its controller function. The `:id` part is a URL parameter that can be read using `req.params.id`.

## 5. Why use `app.use(express.json())`?

```javascript
app.use(express.json());
```

This middleware tells Express to parse incoming JSON request bodies. The parsed data becomes available in `req.body`.

For example, a future create-student endpoint might accept this JSON request body:

```json
{
  "name": "XYZ",
  "id": 12345,
  "course": "ABC"
}
```

A controller for that hypothetical endpoint could then read the values:

```javascript
const createStudent = (req, res) => {
  const { name, id, course } = req.body;

  res.status(201).json({
    message: "Student data received",
    student: { name, id, course }
  });
};
```

Place `app.use(express.json())` **before the routes that need to read JSON bodies**. It is commonly used with `POST`, `PUT`, and `PATCH` requests. It does not create or save data by itself; your route/controller must handle that.

## Quick recap

- **Routes** organize URLs and connect each URL/method to a controller.
- **Controllers** contain the code that handles requests and sends responses.
- **HTTP methods** describe the action requested: read, create, replace, partially update, or delete.
- **`app.use(express.json())`** lets Express parse incoming JSON so your controller can access it through `req.body`.
