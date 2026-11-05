import pool from "../db.js";
import db from "../drizzle.js";
import { testTable } from "../schema.js";

export const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM test_table");
  return result.rows;
};

export const getAllStudentsByDrizzle = async () => {
  const result = await db.select().from(testTable);
  return result;
};
