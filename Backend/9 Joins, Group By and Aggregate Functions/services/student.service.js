import pool from "../db.js";
import db from "../drizzle.js";
import { testTable } from "../schema.js";
import { eq } from "drizzle-orm";

// --- Previous functions (kept for backward compatibility) ---
export const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM test_table");
  return result.rows;
};

export const getAllStudentsByDrizzle = async () => {
  const result = await db.select().from(testTable);
  return result;
};

// --- CRUD Services using Drizzle ORM ---

// 1. GET: Retrieve all students
export const getAllStudentsService = async () => {
  return await db.select().from(testTable);
};

// 2. GET: Retrieve a single student by ID
export const getStudentByIdService = async (id) => {
  const result = await db
    .select()
    .from(testTable)
    .where(eq(testTable.id, Number(id)));
  return result[0] || null;
};

// 3. POST: Create a new student
export const createStudentService = async (studentData) => {
  const result = await db
    .insert(testTable)
    .values(studentData)
    .returning();
  return result[0];
};

// 4. PUT: Replace an entire student record
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

// 5. PATCH: Partially update a student record
export const updateStudentService = async (id, partialData) => {
  const result = await db
    .update(testTable)
    .set(partialData)
    .where(eq(testTable.id, Number(id)))
    .returning();
  return result[0] || null;
};

// 6. DELETE: Delete a student by ID
export const deleteStudentService = async (id) => {
  const result = await db
    .delete(testTable)
    .where(eq(testTable.id, Number(id)))
    .returning();
  return result[0] || null;
};
