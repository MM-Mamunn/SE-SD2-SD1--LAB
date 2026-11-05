import { pgTable, bigint, varchar, real, timestamp, text } from "drizzle-orm/pg-core";

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
