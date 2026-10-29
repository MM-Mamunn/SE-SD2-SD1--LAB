# Conditional Rendering & Lists in React

## 1. Conditional Rendering

### What it means
Conditional rendering simply means deciding whether to show (render) something on the screen based on a condition, like whether a user is logged in or out.

### The Logical `&&` Operator
You can use `&&` (AND) when you want to show something **only if** a condition is true. If the condition is false, React ignores it and shows nothing.
```jsx
// This only shows "Welcome!" if isLoggedIn is true
{isLoggedIn && <p>Welcome!</p>}
```

### The Ternary `? :` Operator
You can use `? :` when you have **two different things** to show: one for when the condition is true, and one for when it's false.
```jsx
// Shows "Logged In" if true, OR "Please Log In" if false
{isLoggedIn ? <p>Logged In</p> : <p>Please Log In</p>}
```

---

## 2. Rendering Lists

### What `.map()` does
`.map()` is a JavaScript array method. In React, we use it to transform an array of data (like a list of names) into an array of UI elements (like HTML tags).

### Displaying Multiple Items
Instead of manually typing out elements for each item, we use `.map()` to loop through the array and automatically create an element for every item.

```jsx
const students = ["Alice", "Bob", "Charlie"];

// This creates a <p> tag for every student in the array!
{students.map((student) => (
  <p key={student}>{student}</p>
))}
```

### The `key` Prop
Notice the `key` attribute on the `<p>` tag above. 
Whenever you create a list of elements in React, you **must** give each element a unique `key`.

### Why keys are important
React needs keys to know exactly which items have changed, been added, or been removed. It helps React update the list efficiently without redrawing everything on the screen. The key should always be something completely unique to that specific item, like an ID number.
