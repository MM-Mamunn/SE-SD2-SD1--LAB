# Real Life API Example — Axios Version

A beginner-friendly guide to fetching and displaying real API data in React using **Axios**.

This is the Axios version of the same example that uses `fetch()` in `realLifeApi.jsx`. The two files are kept separate so you can compare them side by side.

---

## 1. What is Axios?

**Axios** is a popular JavaScript library for making HTTP requests. It works in both the browser and Node.js.

You can think of it as a smarter, more convenient version of `fetch()`. The biggest beginner-friendly advantage is:

- With `fetch()`, you have to call `.json()` manually to read the response.
- With Axios, the response data is **already parsed as JSON** and lives at `response.data`. No extra step needed.

---

## 2. How to Install Axios

Axios is not built into the browser, so you need to install it first.

Run this command in your project folder:

```bash
npm install axios
```

Then import it at the top of your component:

```js
import axios from "axios";
```

---

## 3. How `axios.get()` Works

`axios.get()` sends a GET request to a URL and returns a **response object**.

```js
const response = await axios.get("https://example.com/api/data");
console.log(response.data); // the JSON data is here
```

Key point: the actual data from the API is at **`response.data`**, not just `response`.

Compare this with `fetch()`:

```js
// fetch() — two steps needed
const response = await fetch("https://example.com/api/data");
const data = await response.json(); // extra step to parse JSON

// axios — one step
const response = await axios.get("https://example.com/api/data");
const data = response.data; // JSON is already parsed
```

---

## 4. First `useEffect` — Top Contributors API

The first `useEffect` handles **only** the contributors data.

```js
// State for this API
const [contributors, setContributors] = useState([]);
const [contributorsLoading, setContributorsLoading] = useState(true);
const [contributorsError, setContributorsError] = useState(null);

useEffect(() => {
  async function fetchContributors() {
    try {
      const response = await axios.get(
        "https://iiuc-resources-management-api.vercel.app/api/info/topcontributor"
      );
      // response.data is the full JSON object, response.data.rows is the array
      setContributors(response.data.rows);
    } catch (err) {
      setContributorsError("Failed to load contributors.");
    } finally {
      setContributorsLoading(false);
    }
  }

  fetchContributors();
}, []); // [] = run only once, on mount
```

**Basic flow:**
```
useEffect → fetchContributors() → axios.get() → response.data → setContributors(response.data.rows)
```

---

## 5. Second `useEffect` — Teachers API

The second `useEffect` handles **only** the teachers data.

```js
// State for this API
const [teachers, setTeachers] = useState([]);
const [teachersLoading, setTeachersLoading] = useState(true);
const [teachersError, setTeachersError] = useState(null);

useEffect(() => {
  async function fetchTeachers() {
    try {
      const response = await axios.get(
        "https://iiuc-resources-management-api.vercel.app/api/info/teacher"
      );
      setTeachers(response.data.rows);
    } catch (err) {
      setTeachersError("Failed to load teachers.");
    } finally {
      setTeachersLoading(false);
    }
  }

  fetchTeachers();
}, []); // [] = run only once, on mount
```

**Basic flow:**
```
useEffect → fetchTeachers() → axios.get() → response.data → setTeachers(response.data.rows)
```

Both `useEffect` hooks are completely independent. They both run once when the component mounts. If one fails, the other section still works normally.

---

## 6. How Each API Response Is Stored with `useState`

Each API has its own set of three state variables:

| State variable        | Initial value | Purpose                              |
|-----------------------|---------------|--------------------------------------|
| `contributors`        | `[]`          | Holds the contributors array         |
| `contributorsLoading` | `true`        | Shows loading text while waiting     |
| `contributorsError`   | `null`        | Holds the error message on failure   |
| `teachers`            | `[]`          | Holds the teachers array             |
| `teachersLoading`     | `true`        | Shows loading text while waiting     |
| `teachersError`       | `null`        | Holds the error message on failure   |

After a successful Axios call, we save `response.data.rows` into the array state and set loading to `false`.

---

## 7. How `.map()` Displays the API Data

`.map()` loops over the array in state and renders a card for each item.

**Contributors:**
```jsx
{contributors.map((contributor) => (
  <div key={contributor.id}>
    <img src={contributor.profilePic} alt={contributor.name} />
    <p>{contributor.name}</p>
    <p>ID: {contributor.id}</p>
    <p>Points: {contributor.point}</p>
    <p>Resources: {contributor.resourceCount}</p>
  </div>
))}
```

**Teachers:**
```jsx
{teachers.map((teacher, index) => (
  <div key={teacher.code || index}>
    <p>{teacher.name}</p>
    <p>{teacher.desig}</p>
    <p>Phone: {teacher.phone || "N/A"}</p>
    <p>Email: {teacher.email || "N/A"}</p>
    <p>Code: {teacher.code || "---"}</p>
    <p>Type: {teacher.type || "---"}</p>
  </div>
))}
```

- `key` must be unique per item. For contributors we use `contributor.id`.
- For teachers, `teacher.code` can be an empty string, so we fall back to the loop `index`.
- Empty or `null` values are handled with `|| "N/A"` or `|| "---"`.

---

## 8. Basic Loading and Error Handling

Each section manages its own loading and error display.

```jsx
{/* Show while the request is in progress */}
{contributorsLoading && <p>Loading contributors...</p>}

{/* Show if the request failed */}
{contributorsError && <p>{contributorsError}</p>}

{/* Show only when data is ready */}
{!contributorsLoading && !contributorsError && (
  <div>
    {contributors.map((contributor) => ( ... ))}
  </div>
)}
```

Axios automatically throws an error for failed HTTP responses (e.g. 404, 500), so the `catch` block will handle both network failures and bad server responses.

---

## 9. The Full Flow (Both APIs)

```
Component mounts
    │
    ├─ useEffect #1 runs → fetchContributors()
    │       │
    │       ├─ axios.get(contributors URL)
    │       ├─ response.data.rows  ← data is already parsed JSON
    │       ├─ setContributors(response.data.rows)   → re-render
    │       └─ setContributorsLoading(false)
    │
    └─ useEffect #2 runs → fetchTeachers()
            │
            ├─ axios.get(teachers URL)
            ├─ response.data.rows  ← data is already parsed JSON
            ├─ setTeachers(response.data.rows)        → re-render
            └─ setTeachersLoading(false)
```

---

## 10. `fetch()` vs Axios — Key Difference

| | `fetch()` (realLifeApi.jsx) | Axios (axiosRealLifeApi.jsx) |
|---|---|---|
| Import needed? | No — built into the browser | Yes — `npm install axios` |
| Make a GET request | `fetch(url)` | `axios.get(url)` |
| Read JSON data | `await response.json()` — extra step | `response.data` — already parsed |
| Error on bad status | ❌ Does NOT throw on 404/500 | ✅ Automatically throws an error |
| Overall code | Slightly more steps | Slightly cleaner and shorter |

In this example, the structure of both components is identical. The only real difference is:

```js
// fetch() version
const response = await fetch(url);
const data = await response.json();
setContributors(data.rows);

// Axios version
const response = await axios.get(url);
setContributors(response.data.rows);
```

Both approaches are valid. Axios is often preferred in larger projects because it is more concise and handles errors more predictably.
