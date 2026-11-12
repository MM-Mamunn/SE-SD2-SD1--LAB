import { pgTable, bigint, varchar, real, timestamp, text, integer, bigserial } from "drizzle-orm/pg-core";

export const testTable = pgTable("test_table", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name"),
  cgpa: real("cgpa"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  password: text("password"),
});


// New table: courses
export const courseTable = pgTable("courses", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  title: varchar("title"),
  code: varchar("code"),
});

// export const teacherTable = pgTable("teachers", {
//   id: bigint("id", { mode: "number" }).primaryKey(),
//    name: varchar("name"),
//    designation: varchar("designation"),
//   phone: varchar("phone"),
//   created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   password: text("password"),
// });

// ==========================================
// NEW RELATED SCHEMAS: Users, Orders, Payments
// ==========================================

// 1. User Schema (Authentication & Base Entity)
export const userTable = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).default("customer"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 2. Order Schema (Related to Users)
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

// 3. Payment Schema (Related to Orders and Users)
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

