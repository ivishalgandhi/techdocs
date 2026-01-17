# TechDocs Project Guidelines

This document provides a set of guidelines for agents working on this Docusaurus-based project.

## Development Commands

- **Start development server:** `npm run start`
- **Build the project:** `npm run build`
- **Clear Docusaurus cache:** `npm run clear`

There are no specific linting or testing commands in `package.json`.

## Code Style

- **Formatting:** This project uses Prettier for code formatting, which is run on save. No manual formatting is needed.
- **Imports:** Use ES6 `import/export` syntax. Organize imports with React imports first, then other libraries, and finally local components.
- **Components:** Components should be functional and use React Hooks. Class components are not allowed.
- **Naming Conventions:**
  - `camelCase` for variables and functions.¬
  - `PascalCase` for components and files.
  - `kebab-case` for CSS classes.
- **Styling:** This project uses CSS Modules for styling. All styles should be defined in `.module.css` files.
- **Error Handling:** Use `try/catch` for async operations and proper error boundaries in React components.
- **Types:** While this is a JavaScript project, use JSDoc for type annotations where possible.
