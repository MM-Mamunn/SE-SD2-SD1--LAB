# 5. Introducing Drizzle ORM

## What is Drizzle ORM?

Drizzle is a **lightweight ORM** (Object-Relational Mapping) for JavaScript/TypeScript.

Instead of writing raw SQL like this:
```js
pool.query("SELECT * FROM test_table")
```

Drizzle lets you write it in JavaScript like this:
```js
db.select().from(testTable)
```

**Both do the exact same thing** — but Drizzle gives you autocomplete, type safety, and cleaner code.

---

## Installation

Only one package needed:

```bash
npm install drizzle-orm
```

> **Note:** We already have `pg` installed. Drizzle uses it under the hood — it doesn't replace `pg`, it **wraps around it**.

---

## What files we created

```
project/
├── drizzle.js          ← (NEW) creates the drizzle instance
├── schema.js           ← (NEW) describes our table in JavaScript
├── services/
│   └── student.service.js   ← (UPDATED) added drizzle version
├── controllers/
│   └── student.controller.js ← (UPDATED) added drizzle version
└── routes/
    └── student.route.js      ← (already had the route)
```

---

## Step-by-Step: How we set it up

### Step 1 — Create the Drizzle instance (`drizzle.js`)

```js
import { drizzle } from "drizzle-orm/node-postgres";
import pool from "./db.js";

const db = drizzle(pool);

export default db;
```

**What's happening:**
- We import `drizzle` from the `drizzle-orm/node-postgres` package.
- We pass our **existing `pool`** (from `db.js`) into `drizzle()`.
- Drizzle now wraps around our pool — **no new database connection needed**.
- We export `db` so other files can use it.

---

### Step 2 — Define the table schema (`schema.js`)

```js
import { pgTable, bigint, varchar, real, timestamp, text } from "drizzle-orm/pg-core";

export const testTable = pgTable("test_table", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name"),
  cgpa: real("cgpa"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  password: text("password"),
});
```

**What's happening (matching Postgres / Supabase types):**
- `pgTable("test_table", {...})` — tells Drizzle the name of the table in PostgreSQL.
- `bigint("id", { mode: "number" }).primaryKey()` — matches `int8` (bigint) in Postgres and marks it as primary key. Setting `{ mode: "number" }` lets JavaScript treat it as a standard number.
- `varchar("name")` — matches `varchar`.
- `real("cgpa")` — matches `float4` (single-precision float).
- `timestamp("created_at", { withTimezone: true }).defaultNow()` — matches `timestamptz` with default `now()`.
- `text("password")` — matches `text`.

> **Note:** This does **not** create the table. It describes the existing table so Drizzle knows which columns to select and map.

---

### Step 3 — Service: the Drizzle query (`services/student.service.js`)

```js
import db from "../drizzle.js";
import { testTable } from "../schema.js";

// Raw SQL version (already existed)
export const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM test_table");
  return result.rows;
};

// Drizzle version (NEW)
export const getAllStudentsByDrizzle = async () => {
  const result = await db.select().from(testTable);
  return result;
};
```

**Comparison:**

| Raw SQL | Drizzle |
|---------|---------|
| `pool.query("SELECT * FROM test_table")` | `db.select().from(testTable)` |
| Returns `result.rows` | Returns the rows directly |
| You write SQL as a string | You write JavaScript |

---

### Step 4 — Controller (`controllers/student.controller.js`)

```js
const detailsFunctionByDrizzle = async (req, res) => {
  try {
    const data = await getAllStudentsByDrizzle();
    return res.status(200).json({ data });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};
```

**Exactly the same pattern** as the raw SQL controller — only the service function name changes.

---

### Step 5 — Route (`routes/student.route.js`)

```js
router.get("/detailsbydrizzle", detailsFunctionByDrizzle);
```

---

## The complete flow

```
GET /api/student/detailsbydrizzle
        ↓
   Route → calls detailsFunctionByDrizzle (controller)
        ↓
   Controller → calls getAllStudentsByDrizzle (service)
        ↓
   Service → db.select().from(testTable)   ← Drizzle turns this into SQL
        ↓
   Drizzle internally runs: "SELECT * FROM test_table"
        ↓
   Data comes back as JSON
```

---

## Try it

1. Run the server: `npm run dev`
2. Raw SQL version: `http://localhost:3000/api/student/details`
3. Drizzle version: `http://localhost:3000/api/student/detailsbydrizzle`
4. **Both should return the exact same data.**

---

## Quick summary

| Thing | What it does |
|-------|-------------|
| `drizzle-orm` | The ORM package (npm install) |
| `drizzle.js` | Creates the drizzle `db` instance using our existing pool |
| `schema.js` | Describes the table structure in JavaScript |
| `db.select().from(testTable)` | The Drizzle way to do `SELECT * FROM test_table` |

---

## Why use Drizzle?

- ✅ **No raw SQL strings** — less chance of typos
- ✅ **Autocomplete** — your editor helps you write queries
- ✅ **Same pool** — doesn't create extra database connections
- ✅ **Lightweight** — much simpler than Prisma or Sequelize
- ✅ **SQL-like syntax** — if you know SQL, Drizzle feels familiar
