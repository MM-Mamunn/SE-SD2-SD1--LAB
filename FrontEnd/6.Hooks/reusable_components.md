# Reusable Components in React

## What are reusable components?
Reusable components are individual pieces of UI that you create once and can use over and over again in different parts of your application. Instead of copying and pasting the same code on multiple pages, you extract the code into its own component file and import it wherever you need it.

## Why do we use them?
- **Saves Time:** You write the code once.
- **Easier Maintenance:** If you need to update the navigation bar or footer, you only change it in one place, and every page updates automatically.
- **Cleaner Code:** Your page components become smaller and much easier to read.

## Where are Navbar and Footer located?
We created a dedicated folder for shared components:
```text
src/
└── components/
    ├── Navbar.jsx
    └── Footer.jsx
```

## How they are imported and reused
Instead of keeping the `Navbar` code in `App.jsx` or duplicating it, we moved the navigation links into `Navbar.jsx` and created a new `Footer.jsx`. 

Now, individual pages like `Home.jsx`, `About.jsx`, and `Dashboard.jsx` import these shared components. Because they are imported into each page, the same layout wraps the different content across the app.

### Example Usage
Here is how multiple pages import and use the same components:

```jsx
// src/group1/Home.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      {/* 1. Use the Navbar at the top */}
      <Navbar />
      
      <h1 className="text-2xl font-bold">Home Component</h1>
      <p>This is the home page in Group 1.</p>
      
      {/* 2. Use the Footer at the bottom */}
      <Footer />
    </div>
  );
}
```
By structuring our app this way, we have achieved a core React concept: **Create once → Import anywhere → Reuse across pages**.
