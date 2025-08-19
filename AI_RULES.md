# AI Rules for Doce Emergência Application

This document outlines the core technologies used in this project and provides guidelines for their usage to ensure consistency, maintainability, and best practices.

## Tech Stack Overview

*   **React:** The primary JavaScript library for building the user interface.
*   **TypeScript:** Used for type safety across the entire codebase, enhancing code quality and developer experience.
*   **Vite:** The build tool that provides a fast development server and bundles the application for production.
*   **Tailwind CSS:** A utility-first CSS framework used for all styling, enabling rapid UI development and consistent design.
*   **shadcn/ui:** A collection of reusable UI components built with Radix UI and styled with Tailwind CSS, providing a consistent and accessible design system.
*   **React Router DOM:** Manages client-side routing, allowing for navigation between different pages without full page reloads.
*   **Supabase:** Provides backend services including authentication, a PostgreSQL database, and serverless functions (via RPC calls) for data management.
*   **React Query (@tanstack/react-query):** Used for efficient data fetching, caching, synchronization, and managing server state throughout the application.
*   **Lucide React:** A library providing a set of beautiful, customizable SVG icons for use across the UI.
*   **Sonner & shadcn/ui Toast:** Two distinct toast notification systems are available. `Sonner` is used for general, modern toast notifications, while `shadcn/ui/toast` (via `useToast` hook) is also available for specific UI component integrations.

## Library Usage Guidelines

To maintain a clean and efficient codebase, please adhere to the following rules when making changes:

*   **UI Components:** Always prioritize using components from `shadcn/ui`. If a required component is not available or needs significant custom behavior, create a new component in `src/components/`. **Do not modify existing `shadcn/ui` files directly.**
*   **Styling:** All styling must be done using **Tailwind CSS classes**. Avoid inline styles or creating new, separate CSS files for components. Global styles are defined in `src/index.css`.
*   **Routing:** Use `react-router-dom` for all navigation within the application. All main routes should be defined in `src/App.tsx`.
*   **Backend Interactions:** All authentication, database operations, and calls to serverless functions must be handled through the `supabase` client from `src/integrations/supabase/client.ts`.
*   **Data Management:** For fetching, caching, and updating server data, utilize `@tanstack/react-query`.
*   **Icons:** Use icons provided by the `lucide-react` library.
*   **Notifications:** For user feedback and notifications, use `sonner` for general toasts and `shadcn/ui/toast` for specific UI-related notifications where appropriate.
*   **File Structure:**
    *   **Pages:** Place top-level page components in `src/pages/`.
    *   **Components:** Place reusable UI components in `src/components/`.
    *   **Hooks:** Place custom React hooks in `src/hooks/`.
    *   **Integrations:** Place third-party service configurations (like Supabase client) in `src/integrations/`.
    *   **Utilities:** Place general utility functions in `src/lib/`.
    *   **Assets:** Store static assets like images in `public/` or `src/assets/`.
*   **Code Quality:** Ensure all new code is written in TypeScript, follows existing coding conventions, and is well-structured for readability and maintainability. Keep components focused and small (ideally under 100 lines).