# 3.3 Connect DB (Supabase + PostgreSQL)

Connect a Node/Express app to a **Supabase** Postgres database using the `pg` package.

---

## What We Need

| Package  | Purpose                                  |
| -------- | ---------------------------------------- |
| `pg`     | PostgreSQL client for Node.js            |
| `dotenv` | Loads `.env` variables into `process.env`|

Install both:

```bash
npm install pg dotenv
```

---

## Step 1 — Create `.env`

Add your Supabase connection string (found in **Supabase → Settings → Database → Connection string → URI**):

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
```

> **Never commit `.env` to git.** Add it to `.gitignore`.

---

## Step 2 — Create `db.js`

```js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to check database connection
export const checkDBConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");
    client.release();
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err.message);
  }
};

export default pool;
```

**Key points:**

- `pg.Pool` keeps a pool of connections (reuses them, much faster than connecting every time).
- `dotenv.config()` reads `.env` automatically.
- `checkDBConnection()` tries to grab a client from the pool — if it works, the DB is reachable. The client is released right after.
- Call `checkDBConnection()` from `index.js` on startup to verify the connection.

---

## Step 3 — Call `checkDBConnection()` in `index.js`

Import and call it so the connection is verified on startup:

```js
import { checkDBConnection } from "./db.js";

checkDBConnection();
```

---

## Step 4 — Use `pool` Anywhere

Import `pool` in any controller or route to run queries:

```js
import pool from "../db.js";

// example: get all students
const result = await pool.query("SELECT * FROM students");
```

---

## Step 5 — Run & Verify

```bash
npm run dev
```

If connected, you'll see:

```
✅ Database connected successfully!
Example app listening on port 3000
```

---

## Recreate Checklist

1. `npm install pg dotenv`
2. Create `.env` with your `DATABASE_URL`
3. Create `db.js` (copy above)
4. Call `checkDBConnection()` in `index.js`
5. Import `pool` from `db.js` wherever you need to query
6. `npm run dev` — look for **"✅ Database connected successfully!"** in the console
