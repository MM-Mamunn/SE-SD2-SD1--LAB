# Real Life API Example

A beginner-friendly guide to fetching and displaying real API data in React.

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

Other types exist (POST, PUT, DELETE), but for this example we only use GET.

---

## 3. The Two APIs Used in This Example

### API 1: Top Contributors
```
GET https://iiuc-resources-management-api.vercel.app/api/info/topcontributor
```
Returns a list of top contributors with their name, ID, points, resource count, and profile picture.

### API 2: Teachers
```
GET https://iiuc-resources-management-api.vercel.app/api/info/teacher
```
Returns a list of teachers with their name, designation, phone, email, code, and type.

Both APIs return a JSON object with a `rows` array. The `rows` array holds the actual data items.

---

## 4. How `fetch()` Works

`fetch()` is a built-in browser function that makes HTTP requests.

```js
// Basic example
fetch("https://example.com/api/data")
  .then(response => response.json())  // convert response to JSON
  .then(data => console.log(data));   // use the data
```

In this project, we use `async/await` which is easier to read:

```js
const response = await fetch("https://example.com/api/data");
const data = await response.json();
console.log(data);
```

- `await fetch(url)` — sends the request and waits for the response
- `await response.json()` — reads the response body and converts it to a JavaScript object

---

## 5. How `useEffect()` Calls the APIs When the Component Loads

`useEffect` is a React hook that lets you run code **after** the component appears on the screen.

```js
useEffect(() => {
  // This code runs once when the component first loads
  fetchData();
}, []); // The empty [] means: run only once
```

- The function inside `useEffect` runs after the component renders.
- The `[]` at the end is the **dependency array**. An empty array means the effect runs only once — when the component first mounts.

---

## 6. How API Responses Are Stored Using `useState`

`useState` lets a component remember data between renders.

```js
const [contributors, setContributors] = useState([]);
const [teachers, setTeachers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

- `contributors` and `teachers` start as empty arrays `[]`.
- After the API responds, we call `setContributors(data.rows)` to save the data.
- React then automatically re-renders the component to show the new data.

---

## 7. How `.map()` Displays the API Data

`.map()` is a JavaScript array method that transforms each item in an array.

In React, we use it to create a list of JSX elements from an array of data:

```jsx
{contributors.map((contributor) => (
  <div key={contributor.id}>
    <p>{contributor.name}</p>
    <p>Points: {contributor.point}</p>
  </div>
))}
```

- For **each** contributor in the array, we return a `<div>` card.
- The `key` prop must be unique — we use `contributor.id`.
- React uses the `key` to efficiently update the list later.

---

## 8. Basic Loading and Error Handling

Before the API responds, we show a **loading message**.
If the request fails (e.g., no internet), we show an **error message**.

```jsx
// While waiting for the API
if (loading) {
  return <div>Loading data from APIs...</div>;
}

// If something went wrong
if (error) {
  return <div>{error}</div>;
}

// Normal render — data is ready
return <div>... show the data ...</div>;
```

We use a `try/catch/finally` block inside the fetch function:

```js
try {
  // attempt the fetch
} catch (err) {
  setError("Failed to fetch data. Please try again later.");
} finally {
  setLoading(false); // always runs, success or failure
}
```

---

## 9. Understanding the Response Structure (`rows`)

Both APIs return a JSON object that has a `rows` property:

```json
{
  "rows": [
    { "name": "Alice", "point": 140 },
    { "name": "Bob",   "point": 57  }
  ]
}
```

So after fetching, we do:

```js
const data = await response.json();
setContributors(data.rows); // we only want the array inside "rows"
```

The Teachers API also includes a `pagination` object, but we ignore it for this example and only use `data.rows`.

---

## 10. Why This Pattern Is Useful in Real-World React Apps

Almost every real-world React app fetches data from an API. This pattern — fetch on mount, store in state, render with `.map()` — is used everywhere:

| Concept | Purpose |
|---|---|
| `useState` | Store the fetched data so React can re-render |
| `useEffect` | Trigger the fetch when the component loads |
| `fetch()` | Make the HTTP request to the API |
| `async/await` | Write asynchronous code in a readable way |
| `.map()` | Render a list of items from the API response |
| Loading state | Show a spinner or message while waiting |
| Error state | Handle network failures gracefully |

Once you understand this pattern, you can fetch data from any API — whether it is a weather API, a news API, a product catalogue, or your own backend.

---

## Quick Reference: Component Structure

```
RealLifeApi
├── useState  →  contributors, teachers, loading, error
├── useEffect →  calls fetchData() on mount
│   └── fetchData()
│       ├── Promise.all → fetches both APIs at once
│       ├── sets contributors & teachers on success
│       └── sets error on failure
└── render
    ├── loading? → show loading message
    ├── error?   → show error message
    └── normal   → map over contributors & teachers
```
