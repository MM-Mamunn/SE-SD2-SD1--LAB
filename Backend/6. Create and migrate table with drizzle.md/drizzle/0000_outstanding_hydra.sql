CREATE TABLE IF NOT EXISTS "test_table" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar,
	"cgpa" real,
	"created_at" timestamp with time zone DEFAULT now(),
	"password" text
);
