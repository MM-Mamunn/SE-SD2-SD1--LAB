import db from "../drizzle.js";
import { userTable } from "../schema.js";
import { eq } from "drizzle-orm";

// 1. Find a user by their unique email address
export const findUserByEmailService = async (email) => {
  const result = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email.toLowerCase().trim()));
  return result[0] || null;
};

// 2. Find a user by their primary key ID
export const findUserByIdService = async (id) => {
  const result = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      created_at: userTable.created_at,
    })
    .from(userTable)
    .where(eq(userTable.id, Number(id)));
  return result[0] || null;
};

// 3. Create a new user with hashed password
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

// 4. Retrieve all users (excluding passwords for safety)
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
