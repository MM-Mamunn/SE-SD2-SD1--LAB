import express from "express";
import {
  profileFunction,
  detailsFunction,
  detailsFunctionByDrizzle,
  getAllStudentsController,
  getStudentByIdController,
  createStudentController,
  replaceStudentController,
  updateStudentController,
  deleteStudentController,
} from "../controllers/student.controller.js";

const router = express.Router();

// Previous Endpoints ---
router.get("/profile", profileFunction);
router.get("/details", detailsFunction);
router.get("/detailsbydrizzle", detailsFunctionByDrizzle);

// --- RESTful CRUD Endpoints for 5 HTTP Methods ---
// 1. GET /api/students - Retrieve all students
router.get("/", getAllStudentsController);

// 2. GET /api/students/:id - Retrieve one student by ID
router.get("/:id", getStudentByIdController);

// 3. POST /api/students - Create a new student
router.post("/", createStudentController);

// 4. PUT /api/students/:id - Replace an entire student record
router.put("/:id", replaceStudentController);

// 5. PATCH /api/students/:id - Partially update specific fields of a student
router.patch("/:id", updateStudentController);

// 6. DELETE /api/students/:id - Delete a student by ID
router.delete("/:id", deleteStudentController);

export default router;
