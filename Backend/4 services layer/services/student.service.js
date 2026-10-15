import pool from "../db.js";
import db from "../drizzle.js";

export const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM test_table");
  return result.rows;
};

