# React Learning 

A brief roadmap of all React topics covered in this project.

---

### 1. React & Project Setup
- React + Vite project structure
- `main.jsx` entry point, `App.jsx` root component
- HMR (Hot Module Replacement) in development
- ESLint configuration

### 2. Styling
- Tailwind CSS setup and usage
- Utility classes for layout, spacing, typography, and borders
- Responsive design with Tailwind breakpoints

### 3. Components & Props
- Creating functional components
- Reusable components (`Navbar`, `Footer`)
- Passing data with props (parent to child)
- Props are read-only in the child

### 4. State & User Interaction
- `useState` -- remembering data across renders
- Updating state with the setter function
- Simulating async behavior with `setTimeout`
- Event handling: `onClick`, `onChange`, `onSubmit`
- Two-way data binding with controlled inputs
- `e.preventDefault()` to stop form page refresh

### 5. Routing
- Installing and configuring `react-router-dom`
- Wrapping the app in `BrowserRouter`
- Defining routes with `Routes` and `Route`
- Navigating with `Link` without page reload

### 6. Rendering Lists & Conditions
- Conditional rendering with `&&` (logical AND)
- Conditional rendering with `? :` (ternary operator)
- Rendering lists with `.map()`
- The `key` prop and why it matters

### 7. Working with APIs
- What an API is and what a GET request means
- Fetching data with `fetch()` + `async/await`
- Fetching data with `axios.get()`
- `useEffect` to trigger API calls on component mount
- `useState` to store API responses
- Rendering API data with `.map()`
- Independent loading and error states per API
- `fetch()` vs Axios: key differences
