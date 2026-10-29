# SE-SD2 / SD1 Lab

This repository is a hands-on learning workspace for full-stack web development, covering both backend and frontend topics in a structured lab format.

It includes:
- Node.js + Express backend lessons
- Database connectivity and service-layer architecture
- Drizzle ORM integration
- React + Vite frontend lessons
- Styling, routing, hooks, props, events, conditional rendering, and API use

## Repository structure

### Backend
The backend section focuses on building a Node/Express API step by step.

- [Backend/1.1 Setup Express](./Backend/1.1%20Setup%20Express) — basic Express app setup
- [Backend/1.2 ESmodule and run script](./Backend/1.2%20ESmodule%20and%20run%20script) — ES modules and script execution
- [Backend/2 routes and controllers](./Backend/2%20routes%20and%20controllers) — routes and controllers pattern
- [Backend/3 connect DB](./Backend/3%20connect%20DB) — database connection setup
- [Backend/4 services layer](./Backend/4%20services%20layer) — separating business logic from controllers
- [Backend/5 drizzle orm](./Backend/5%20drizzle%20orm) — using Drizzle ORM with a database

### Frontend
The frontend section contains React training exercises using Vite.

- [FrontEnd/readme.md](./FrontEnd/readme.md) — roadmap for React topics
- [FrontEnd/2.Tailwind initilaized](./FrontEnd/2.Tailwind%20initilaized) — Tailwind CSS setup
- [FrontEnd/3.Routes](./FrontEnd/3.Routes) — React routing
- [FrontEnd/4.Reusable Components](./FrontEnd/4.Reusable%20Components) — reusable UI components
- [FrontEnd/5.PROPS](./FrontEnd/5.PROPS) — props and component communication
- [FrontEnd/6.Hooks](./FrontEnd/6.Hooks) — hook-based state and logic
- [FrontEnd/7.EventHandling-UserInteraction](./FrontEnd/7.EventHandling-UserInteraction) — events and user interactions
- [FrontEnd/8.ConditionalAndList](./FrontEnd/8.ConditionalAndList) — conditional rendering and list rendering
- [FrontEnd/9.1.RealAPICallwithSingleuseEffect](./FrontEnd/9.1.RealAPICallwithSingleuseEffect) — single useEffect API fetch example
- [FrontEnd/9.2.RealAPICallwithSeparateuseEffect](./FrontEnd/9.2.RealAPICallwithSeparateuseEffect) — separate effect patterns
- [FrontEnd/9.3.AxiosImplementation9.2](./FrontEnd/9.3.AxiosImplementation9.2) — Axios-based API calls

## Learning path

A suggested order is:

1. Start with backend setup and API fundamentals
2. Move into routes, controllers, and database connectivity
3. Learn service-layer architecture and organization
4. Practice Drizzle ORM for database models and queries
5. Continue with frontend fundamentals: components, props, state, and events
6. Learn routing, hooks, conditional rendering, and list rendering
7. Finish with real API integration using fetch and Axios

## How to run the projects

Each subfolder is a separate mini-project and usually includes its own `package.json`.

To run a project:

```bash
cd <project-folder>
npm install
npm start
```

For Vite React projects, you may also use:

```bash
npm install
npm run dev
```

## Notes

- This repository is for education and practice.
- Many modules are designed as step-by-step lab exercises.
- The project names and folder names are intentionally descriptive and may include spaces or older naming conventions.

## Goal

The goal of this lab is to help learners understand how to build modern web applications from both the backend and frontend sides, with practical exercises that span setup, architecture, data access, and UI development.
