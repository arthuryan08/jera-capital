# Prompt 010 - Dark Mode Support

**Date**: 2026-04-09

---

Add dark mode support to the project:

1. On the frontend, install and configure next-themes. In the root layout.tsx, wrap the app with ThemeProvider with attribute="class" and defaultTheme="system" (enableSystem=true).

2. In tailwind config, confirm that darkMode is set to "class".

3. Create a ThemeToggle component that uses useTheme() from next-themes. Render a button with the Sun/Moon icon from lucide-react that toggles between light/dark/system. It can be a simple button that toggles between dark and light, or a dropdown with the 3 options (Light, Dark, System).

4. Place the ThemeToggle in the header, next to the user menu.

5. Ensure that the shadcn/ui components and the Recharts chart respect dark mode via CSS variables in shadcn (they already use hsl(var(--...)) so it should work automatically).
