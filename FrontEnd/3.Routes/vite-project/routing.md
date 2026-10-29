# React Routing

## 1. Install

To use routing in React, you first need to install the `react-router-dom` package.
Run the following command in your terminal:

```bash
npm install react-router-dom
```

## 2. Folder Structure

We organized our components into folders so they are easy to find:
```text
src/
├── group1/
│   ├── Home.jsx
│   └── About.jsx
├── group2/
│   └── Dashboard.jsx
├── App.jsx
└── main.jsx
```

## 3. Changes Made

1. **`main.jsx`**: Wrapped our `<App />` component in a `<BrowserRouter>`. This enables routing features for the entire app.
2. **`App.jsx`**: Added `<Link>` components to create navigation buttons and a `<Routes>` area where the active component is displayed.
3. **Component Folders**: Created the `group1` and `group2` folders and added simple components (`Home`, `About`, `Dashboard`) to render when routes are matched.

## 4. Available Routes

- `/group1/home` -> Renders `Home.jsx`
- `/group1/about` -> Renders `About.jsx`
- `/group2/dashboard` -> Renders `Dashboard.jsx`

## 5. How It Works

1. `App.jsx` uses `<Link>` to navigate between paths without reloading the browser page.
2. The `<Routes>` component acts like a container. It looks at the current URL and finds the `<Route>` that matches.
3. Once matched, it renders the `element` passed to that route (e.g., `<Home />`).

## 6. How to Run

Start the development server with:
```bash
npm run dev
```
Open the provided local link in your browser and click on the navigation links to see the content update instantly!
