# Real Life API Example

A beginner-friendly guide to fetching and displaying real API data in React using two separate `useEffect` hooks.

---

## 1. What is an API?

An **API** (Application Programming Interface) is a way for two programs to talk to each other.

Think of it like a waiter at a restaurant:
- You (the client) ask the waiter (the API) for food.
- The waiter goes to the kitchen (the server) and brings back your order (the data).

In web development, APIs usually send data as **JSON** — a simple text format that looks like a JavaScript object.

```json
{
  "name": "Mamun Mahmud",
  "point": 140
}
```

---

## 2. What is a GET Request?

There are different types of API requests. The most common one is **GET**.

- **GET** means: *"Give me some data."*
- You are only **reading** data — you are not creating, updating, or deleting anything.
- When you type a URL in your browser, you are making a GET request.

---

## 3. The Two APIs Used in This Example

### API 1: Top Contributors
```
GET https://iiuc-resources-management-api.vercel.app/api/info/topcontributor
```
Returns a list of top contributors. Each item has a name, ID, points, resource count, and profile picture URL.

### API 2: Teachers
```
GET https://iiuc-resources-management-api.vercel.app/api/info/teacher
```
Returns a list of teachers. Each item has a name, designation, phone, email, code, and type.

Both APIs return a JSON object containing a `rows` array. The actual data lives inside that array.

```json
{
  "rows": [
    { "name": "Alice", "point": 140 },
    { "name": "Bob",   "point": 57  }
  ]
}
```

---

## 4. How `fetch()` Works

`fetch()` is a built-in browser function that makes HTTP requests.

We use it with `async/await` to keep the code readable:

```js
const response = await fetch("https://example.com/api/data");
const data = await response.json();
console.log(data);
```

- `await fetch(url)` — sends the request and waits for the server to respond.
- `await response.json()` — reads the response and converts it to a JavaScript object.

---

## 5. Why Two Separate `useEffect` Hooks?

In this example, the two APIs are **completely independent** — the contributors data has nothing to do with the teachers data.

By using **two separate `useEffect` hooks**, each API call:
- Has its own loading state
- Has its own error state
- Fetches and displays independently of the other

This is easier to read and easier to explain step by step. If one API fails, the other section still works.

---

## 6. First `useEffect` — Top Contributors API

The first `useEffect` is responsible for fetching **only** the contributors data.

```js
// State for this API
const [contributors, setContributors] = useState([]);
const [contributorsLoading, setContributorsLoading] = useState(true);
const [contributorsError, setContributorsError] = useState(null);

// First useEffect: runs once when the component mounts
useEffect(() => {
  async function fetchContributors() {
    try {
      const response = await fetch(
        "https://iiuc-resources-management-api.vercel.app/api/info/topcontributor"
      );
      const data = await response.json();
      setContributors(data.rows); // save the array into state
    } catch (err) {
      setContributorsError("Failed to load contributors.");
    } finally {
      setContributorsLoading(false); // always stop loading
    }
  }

  fetchContributors();
}, []); // [] = run only once, on mount
```

**Basic flow:**
```
useEffect → fetchContributors() → fetch() → response.json() → setContributors(data.rows)
```

---

## 7. Second `useEffect` — Teachers API

The second `useEffect` is responsible for fetching **only** the teachers data.

```js
// State for this API
const [teachers, setTeachers] = useState([]);
const [teachersLoading, setTeachersLoading] = useState(true);
const [teachersError, setTeachersError] = useState(null);

// Second useEffect: also runs once when the component mounts
useEffect(() => {
  async function fetchTeachers() {
    try {
      const response = await fetch(
        "https://iiuc-resources-management-api.vercel.app/api/info/teacher"
      );
      const data = await response.json();
      setTeachers(data.rows); // save the array into state
    } catch (err) {
      setTeachersError("Failed to load teachers.");
    } finally {
      setTeachersLoading(false); // always stop loading
    }
  }

  fetchTeachers();
}, []); // [] = run only once, on mount
```

**Basic flow:**
```
useEffect → fetchTeachers() → fetch() → response.json() → setTeachers(data.rows)
```

Both `useEffect` hooks have an empty `[]` dependency array, so both run once when the component first appears on screen. They run at the same time but are completely independent of each other.

---

## 8. How Each API Response Is Stored in a Separate `useState`

Each API has its own set of three state variables:

| State variable         | Initial value | Purpose                        |
|------------------------|---------------|-------------------------------|
| `contributors`         | `[]`          | Holds the contributors array  |
| `contributorsLoading`  | `true`        | Shows loading text while waiting |
| `contributorsError`    | `null`        | Holds the error message if fetch fails |
| `teachers`             | `[]`          | Holds the teachers array      |
| `teachersLoading`      | `true`        | Shows loading text while waiting |
| `teachersError`        | `null`        | Holds the error message if fetch fails |

After a successful fetch, `data.rows` is saved into the array state, and the loading flag is set to `false`.

---

## 9. How `.map()` Renders Each API's `rows`

`.map()` loops over an array and returns a JSX element for each item.

**Contributors example:**
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

**Teachers example:**
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

- The `key` prop must be unique for each item. We use `contributor.id` for contributors.
- For teachers, `teacher.code` can be an empty string `""`, so we fall back to the loop `index` as the key.
- Empty strings and `null` values (like `teacher.phone` or `teacher.type`) are handled with `|| "N/A"` or `|| "---"`.

---

## 10. Basic Loading and Error Handling

Each section handles its own loading and error state independently.

```jsx
{/* Show while waiting */}
{contributorsLoading && <p>Loading contributors...</p>}

{/* Show if something went wrong */}
{contributorsError && <p>{contributorsError}</p>}

{/* Show only when data is ready */}
{!contributorsLoading && !contributorsError && (
  <div>
    {contributors.map((contributor) => ( ... ))}
  </div>
)}
```

The same pattern is repeated for the teachers section with `teachersLoading` and `teachersError`.

Because the two sections are independent, if the contributors API fails, the teachers section will still load and display correctly.

---

## 11. The Full Flow (Both APIs)

```
Component mounts
    │
    ├─ useEffect #1 runs → fetchContributors()
    │       │
    │       ├─ fetch(contributors URL)
    │       ├─ response.json()
    │       ├─ setContributors(data.rows)   ← state updated → re-render
    │       └─ setContributorsLoading(false)
    │
    └─ useEffect #2 runs → fetchTeachers()
            │
            ├─ fetch(teachers URL)
            ├─ response.json()
            ├─ setTeachers(data.rows)       ← state updated → re-render
            └─ setTeachersLoading(false)
```

Each time a `setState` call runs, React re-renders the component so the new data appears on screen.

---

## 12. Why This Pattern Is Useful in Real-World React Apps

This pattern — one `useEffect` per data source — is a common and practical approach in real React applications:

| Concept              | Purpose                                       |
|----------------------|-----------------------------------------------|
| `useState`           | Store the fetched data and UI state           |
| `useEffect`          | Trigger a fetch when the component loads      |
| `fetch()`            | Make the HTTP GET request to the API          |
| `async/await`        | Write async code in a readable, linear style  |
| `.map()`             | Render a list of items from the API response  |
| Separate loading/error states | Each section fails or loads independently |

Once you understand this pattern, you can add as many independent API calls as you need — each with its own `useEffect` and `useState`.
