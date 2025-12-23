# Copilot Instructions

## Project Overview
This is a React 19 + TypeScript + Vite UI boilerplate using **shadcn/ui** component system with Tailwind CSS v4. The project uses `pnpm` for package management and follows the shadcn/ui "new-york" style conventions.

## Tech Stack
- **React 19** with TypeScript and StrictMode enabled
- **Vite** with SWC for fast builds and HMR
- **Tailwind CSS v4** (via @tailwindcss/vite plugin, NOT the old PostCSS approach)
- **shadcn/ui components** with Radix UI primitives
- **lucide-react** for icons
- **react-router v7** for routing (installed but not yet configured)

## Architecture & File Structure

### Component Organization
```
src/components/
├── ui/           # shadcn/ui components (button.tsx, etc.)
└── layout/       # Layout components (Sidebar.tsx, Main.tsx)
```

- **`src/components/ui/`**: Auto-managed by shadcn/ui CLI. Components follow the shadcn/ui pattern with CVA (class-variance-authority) for variant management
- **`src/components/layout/`**: Custom layout components (currently empty, ready for implementation)

### Path Aliases
All imports use the `@/` alias pointing to `src/`:
- `@/components` → `src/components`
- `@/lib/utils` → `src/lib/utils`
- `@/components/ui` → `src/components/ui`

**Always use `@/` imports** instead of relative paths.

## Styling Conventions

### Tailwind CSS v4 Setup
- CSS is imported via `@import "tailwindcss"` in [src/index.css](src/index.css) (NOT the old `@tailwind` directives)
- Uses Tailwind CSS v4's `@theme inline` for custom design tokens
- Custom radius variables (`--radius-sm` through `--radius-4xl`) are derived from base `--radius: 0.625rem`
- Color tokens use OKLCH format for better color perception
- Dark mode via custom variant: `@custom-variant dark (&:is(.dark *))`

### Component Styling Pattern
All UI components use the `cn()` utility from [src/lib/utils.ts](src/lib/utils.ts) which combines `clsx` and `tailwind-merge` for conflict-free className merging:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-classes", conditionalClass && "conditional", className)} />
```

### shadcn/ui Component Pattern
Components use CVA for variants, Radix UI for primitives, and support `asChild` pattern:

```tsx
// Example from button.tsx
const buttonVariants = cva(baseStyles, { variants, defaultVariants })

function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

- All UI components expose their variants helper (e.g., `buttonVariants`)
- Use `data-*` attributes for component identification (`data-slot`, `data-variant`, `data-size`)
- Support `asChild` prop to render as child element via `@radix-ui/react-slot`

## Developer Workflows

### Commands
- **Dev server**: `pnpm dev` (Vite dev server with HMR)
- **Build**: `pnpm build` (TypeScript check + Vite build)
- **Lint**: `pnpm lint` (ESLint with React Hooks plugin)
- **Preview**: `pnpm preview` (Preview production build)

### Adding New shadcn/ui Components
Use the shadcn/ui CLI (configuration in [components.json](components.json)):
```bash
npx shadcn@latest add <component-name>
```
This auto-installs to `src/components/ui/` with correct imports and styling.

### TypeScript Configuration
- Uses project references splitting app code ([tsconfig.app.json](tsconfig.app.json)) and tooling ([tsconfig.node.json](tsconfig.node.json))
- Path aliases configured in [tsconfig.json](tsconfig.json) with `"@/*": ["./src/*"]`

## Key Patterns & Conventions

### Import Order
1. React/third-party imports
2. Component imports (using `@/` aliases)
3. Utility/lib imports
4. Type imports

### Component File Naming
- UI components: lowercase with extension (e.g., `button.tsx`)
- Layout/page components: PascalCase (e.g., `Sidebar.tsx`, `Main.tsx`)
- Always use `.tsx` for components, `.ts` for utilities

### Current State Notes
- [App.tsx](src/App.tsx) is minimal (single Button demo)
- Layout components ([Sidebar.tsx](src/components/layout/Sidebar.tsx), [Main.tsx](src/components/layout/Main.tsx)) exist but are empty
- React Router v7 is installed but not yet integrated into the app
- Only one UI component exists: [button.tsx](src/components/ui/button.tsx)

## What to Avoid
- Don't use old Tailwind CSS v3 patterns (PostCSS config, `@tailwind` directives)
- Don't manually edit components in `src/components/ui/` without understanding shadcn/ui update implications
- Don't use `npm` or `yarn` - this project uses `pnpm`
- Don't use relative imports like `../../` - use `@/` aliases
