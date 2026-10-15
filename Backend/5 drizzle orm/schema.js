import { pgTable, bigint, varchar, real, timestamp, text } from "drizzle-orm/pg-core";

export const testTable = pgTable("test_table", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name"),
  cgpa: real("cgpa"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  password: text("password"),
});
