# Integration Guide: React, Tailwind CSS, TypeScript, and shadcn/ui

This guide explains how to set up the React component environment, install required dependencies, and integrate the `AuroraBackground` component into your project.

---

## 1. Project Requirements & Setup

Since the main project is currently a static HTML site (`/site`), to run React components like `<AuroraBackground />` and `<AuroraBackgroundDemo />`, you need a React-compatible build pipeline. 

We recommend **Vite + React + TypeScript** or **Next.js** for modern setups.

### Setup via Vite (Quickest for React Components)
1. Initialize a React TypeScript project in a folder (e.g. `react-app`):
   ```bash
   npm create vite@latest react-app -- --template react-ts
   cd react-app
   ```
2. Install Tailwind CSS and its peer dependencies:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

### Setup via Next.js (Recommended for Full Sites)
If you want to migrate the entire website to React:
```bash
npx create-next-app@latest react-app --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd react-app
```

---

## 2. Setting Up shadcn/ui

Once you have a React TypeScript Tailwind project ready:

1. Run the shadcn/ui CLI initialization script:
   ```bash
   npx shadcn-ui@latest init
   ```
2. The CLI will ask configuration questions. Recommended options:
   - **Style**: Default
   - **Base color**: Slate
   - **CSS variables**: Yes
   - **tailwind.config.js location**: `tailwind.config.js` (or `tailwind.config.ts` if Next.js)
   - **Configure import alias**: `Yes` -> `@/*`

---

## 3. Directory Layout and the Importance of `/components/ui`

### Path Resolution
- **Default Path for UI Components**: `/components/ui`
- **Default Path for Styles**: `/app/globals.css` (Next.js) or `/src/index.css` (Vite)

### Why the `/components/ui` folder is crucial:
1. **shadcn/ui CLI Automation**: The CLI automatically writes downloaded reusable atomic components (like buttons, dialogs, inputs) directly into `/components/ui` (or `@/components/ui`). If this directory is moved or missing, the CLI commands will fail to resolve imports properly.
2. **Separation of Concerns**:
   - `/components/ui/` stores raw, unstyled/minimal styled primitives (e.g., buttons, inputs, backgrounds).
   - `/components/` (outside `ui`) stores your custom composite layout components (e.g., headers, contact forms, navigation bars).

---

## 4. Installing External Dependencies

For this component, run the following command to install required runtime dependencies:
```bash
npm install clsx tailwind-merge framer-motion lucide-react
```

---

## 5. Integrating the Component Code

All files have been set up in your root directory:
1. `components/ui/aurora-background.tsx` — The core animation wrapper.
2. `components/ui/demo.tsx` — The demonstration layout using Framer Motion.
3. `lib/utils.ts` — The class-name merge utility.
4. `tailwind.config.js` — The extended configuration with keyframes and global color variables injector plugin.

---

## 6. How to Use the Demo

To render the `AuroraBackgroundDemo` in your React project, import it into your entry point (e.g., `App.tsx` or `page.tsx`):

```tsx
import { AuroraBackgroundDemo } from "./components/ui/demo";

export default function App() {
  return (
    <div>
      <AuroraBackgroundDemo />
    </div>
  );
}
```

### Unsplash Stock Images Integration
If you wish to use high-quality backgrounds or inline images inside `<AuroraBackground>`, you can reference these stock Unsplash URLs:
- Abstract Background: `https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80`
- Nature/Calm: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80`

### Lucide Icons Integration
To use Lucide React icons inside the component button or layout, import the icon and use it inside the button:
```tsx
import { ShieldCheck } from "lucide-react";

// inside component:
<button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 flex items-center gap-2">
  Debug now <ShieldCheck className="w-4 h-4" />
</button>
```
