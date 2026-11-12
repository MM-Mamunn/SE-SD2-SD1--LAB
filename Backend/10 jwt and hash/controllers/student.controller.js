import {
  getAllStudents,
  getAllStudentsByDrizzle,
  getAllStudentsService,
  getStudentByIdService,
  createStudentService,
  replaceStudentService,
  updateStudentService,
  deleteStudentService,
} from "../services/student.service.js";

// --- Previous controllers (kept for backward compatibility) ---
const profileFunction = async (req, res) => {
  try {
    const message = "Name: XYZ, ID: 12345, Course: ABC";
    return res.status(200).json({ message });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

const detailsFunction = async (req, res) => {
  try {
    const data = await getAllStudents();
    return res.status(200).json({ data });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

const detailsFunctionByDrizzle = async (req, res) => {
  try {
    const data = await getAllStudentsByDrizzle();
    return res.status(200).json({ data });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// --- CRUD Controllers for 5 HTTP Methods ---

// 1. GET /api/students - Retrieve all students
const getAllStudentsController = async (req, res) => {
  try {
    const students = await getAllStudentsService();
    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err) {
    console.error("GET all error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. GET /api/students/:id - Retrieve a single student by ID
const getStudentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await getStudentByIdService(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    console.error("GET by ID error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. POST /api/students - Create a new student
const createStudentController = async (req, res) => {
  try {
    const { id, name, cgpa, password } = req.body;

    // Basic validation for required fields
    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "id and name are required fields",
      });
    }

    // Check if a student with this ID already exists
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

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (err) {
    console.error("POST error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. PUT /api/students/:id - Replace/update a student's complete data
const replaceStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cgpa, password } = req.body;

    // In PUT, we require the complete set of updatable fields
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
    console.error("PUT error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 5. PATCH /api/students/:id - Update only specified student fields
const updateStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cgpa, password } = req.body;

    // Collect only provided fields
    const partialData = {};
    if (name !== undefined) partialData.name = name;
    if (cgpa !== undefined) partialData.cgpa = Number(cgpa);
    if (password !== undefined) partialData.password = String(password);

    // Validate that at least one field was supplied
    if (Object.keys(partialData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update (name, cgpa, or password)",
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
    console.error("PATCH error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 6. DELETE /api/students/:id - Delete a student
const deleteStudentController = async (req, res) => {
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
    console.error("DELETE error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  profileFunction,
  detailsFunction,
  detailsFunctionByDrizzle,
  getAllStudentsController,
  getStudentByIdController,
  createStudentController,
  replaceStudentController,
  updateStudentController,
  deleteStudentController,
};
