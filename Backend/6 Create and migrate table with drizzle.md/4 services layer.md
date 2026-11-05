# 4. Services Layer & `/api/student/details` Endpoint

## What we did

We completed the `/api/student/details` endpoint.  
It fetches **all rows** from `test_table` in the database and sends them back as JSON.

We also created a new **services** folder to keep database logic separate from controllers.

---

## Folder Structure (new stuff marked with ✅)

```
project/
├── controllers/
│   └── student.controller.js   (updated ✅)
├── services/                   (new folder ✅)
│   └── student.service.js      (new file ✅)
├── routes/
│   └── student.route.js        (updated ✅)
├── db.js
└── index.js
```

---

## How it works (step by step)

### Step 1 — Service (talks to the database)

📄 `services/student.service.js`

```js
import pool from "../db.js";

export const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM test_table");
  return result.rows;
};
```

- We import the `pool` (database connection) from `db.js`.
- We run a raw SQL query: `SELECT * FROM test_table`.
- We return the rows.

---

### Step 2 — Controller (handles request & response)

📄 `controllers/student.controller.js`

```js
const detailsFunction = async (req, res) => {
  try {
    const data = await getAllStudents();
    return res.status(200).json({ data });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};
```

- Calls the service function.
- If it works → sends the data back with status `200`.
- If it fails → catches the error and sends status `500`.

---

### Step 3 — Route (connects URL to controller)

📄 `routes/student.route.js`

```js
router.get("/details", detailsFunction);
```

- When someone visits `/api/student/details`, it calls `detailsFunction`.

---

## The flow

```
Browser/Postman hits GET /api/student/details
        ↓
   Route → calls detailsFunction (controller)
        ↓
   Controller → calls getAllStudents (service)
        ↓
   Service → runs "SELECT * FROM test_table" (database)
        ↓
   Data goes back up: Service → Controller → Response
```

---

## Try it

1. Make sure your database has a table called `test_table` with some data.
2. Run the server: `npm run dev`
3. Open browser or Postman: `http://localhost:3000/api/student/details`
4. You should see all rows from `test_table` as JSON.
