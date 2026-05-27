# react-tailwindcss-datepicker — CLAUDE.md

## Project Overview

Standalone React date-picker / date-range-picker component library published to npm. Consumers apply
Tailwind CSS utility classes; the component ships no stylesheet of its own.

- **Package name:** `react-tailwindcss-datepicker`
- **Source root:** `src/`
- **Published exports:** `dist/index.mjs` (ESM) · `dist/index.d.mts` (TypeScript declarations)
- **Default export:** `<Datepicker>` component
- **Named exports:** all types from `src/types/index.ts`

---

## Technology Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| UI framework    | React 17 / 18 / 19 (peer dependency)     |
| Language        | TypeScript 6                             |
| Styling         | Tailwind CSS 4 (applied by consumers)    |
| Date utilities  | dayjs ≥ 1.11 (peer dependency)           |
| Library bundler | tsdown 0.22 (`tsdown.config.ts`)         |
| Dev / demo app  | Next.js 15 (`app/` directory, port 8888) |
| Linting         | ESLint 8 + Prettier 3                    |
| Unit testing    | **none yet** — see Testing section       |

---

## Commands

```bash
# Development server (Next.js demo app)
npm run dev          # http://localhost:8888

# Build the library (lint → clean → rollup)
npm run build

# Lint only
npm run lint

# Format (Prettier + ESLint auto-fix)
npm run format
```

---

## Coding Standards

### Naming Conventions

| Kind                       | Convention             | Examples                                        |
| -------------------------- | ---------------------- | ----------------------------------------------- |
| React components           | PascalCase             | `Datepicker`, `Calendar`, `Shortcuts`, `Footer` |
| Props interfaces           | PascalCase + `Type`    | `DatepickerType`, `ButtonProps`, `IconProps`    |
| Context store interface    | PascalCase             | `DatepickerStore`                               |
| Type aliases               | PascalCase + `Type`    | `DateType`, `DateRangeType`, `ColorKeys`        |
| Utility / helper functions | camelCase, verb prefix | `dateIsValid`, `dateFormat`, `nextMonthBy`      |
| Constants                  | UPPER_SNAKE_CASE       | `DEFAULT_COLOR`, `DATE_FORMAT`, `LANGUAGE`      |
| Color map objects          | UPPER_SNAKE_CASE       | `BG_COLOR`, `TEXT_COLOR`, `BORDER_COLOR`        |

### TypeScript

- Strict mode is enabled (`tsconfig.base.json`).
- All component props typed via `*Type` or `*Props` interfaces in `src/types/index.ts`.
- No `any` unless genuinely unavoidable.
- Tailwind color maps cannot use string interpolation — they must be static string literals (see
  `src/constants/index.ts` comments).

### React

- Functional components only (no class components).
- Memoize context values with `useMemo` to avoid unnecessary re-renders.
- Event-handler callbacks must be wrapped with `useCallback`.
- No hardcoded color or class strings outside `src/constants/index.ts`.

---

## Architecture

### Context

A single `DatepickerContext` (in `src/contexts/DatepickerContext.ts`) holds the entire shared state
for a mounted `<Datepicker>` instance. The context value is created and memoized inside the
`Datepicker` component and passed to all child components via `DatepickerContext.Provider`.

```
<Datepicker>
  └── DatepickerContext.Provider
        ├── <Input>
        └── popup div
              ├── <Arrow>
              ├── [<Shortcuts>]
              ├── <Calendar date={firstDate} …>
              │     ├── <Week>
              │     ├── <Days>
              │     ├── <Months>
              │     └── <Years>
              ├── [<VerticalDash>]
              ├── [<Calendar date={secondDate} …>]   ← only when useRange
              └── [<Footer>]                          ← only when showFooter
```

### File Structure

```
src/
├── index.tsx                     # Public entry — re-exports types + default Datepicker
├── components/
│   ├── Datepicker.tsx            # Root component, owns state + context
│   ├── Calendar/
│   │   ├── index.tsx             # Month header + navigation
│   │   ├── Days.tsx              # Day grid
│   │   ├── Months.tsx            # Month picker overlay
│   │   ├── Week.tsx              # Weekday header row
│   │   └── Years.tsx             # Year picker overlay
│   ├── Footer.tsx                # Cancel / Apply buttons
│   ├── Input.tsx                 # Text input + toggle button
│   ├── PrimaryButton.tsx
│   ├── RoundedButton.tsx
│   ├── SecondaryButton.tsx
│   ├── Shortcuts.tsx             # Pre-defined period shortcuts
│   ├── ToggleButton.tsx
│   ├── VerticalDash.tsx
│   └── icons/
│       ├── Arrow.tsx
│       ├── ChevronLeftIcon.tsx
│       ├── ChevronRightIcon.tsx
│       ├── CloseIcon.tsx
│       ├── DateIcon.tsx
│       ├── DoubleChevronLeftIcon.tsx
│       └── DoubleChevronRightIcon.tsx
├── constants/
│   ├── index.ts                  # Colors, defaults, Tailwind class maps
│   └── shortcuts.ts
├── contexts/
│   └── DatepickerContext.ts      # createContext + DatepickerStore interface
├── helpers/
│   └── index.ts                  # classNames, generateArrayNumber, ucFirst, shortString
├── hooks/
│   └── index.ts                  # useOnClickOutside
├── libs/
│   └── date.ts                   # dayjs wrappers (dateFormat, dateIsValid, …)
└── types/
    └── index.ts                  # All exported TypeScript types / interfaces
```

### Build Pipeline

```
tsdown (tsdown.config.ts) — backed by rolldown v1
  └── tsconfig.build.json ("jsx": "react-jsx")
        → dist/index.mjs      (ES Module)
        → dist/index.d.mts    (TypeScript declarations)
```

`tsconfig.build.json` extends `tsconfig.base.json` and sets `"jsx": "react-jsx"`. `tsconfig.json`
extends `tsconfig.base.json` and sets `"jsx": "preserve"` for Next.js IDE support.

---

## Testing

### Current Status

**No unit tests exist.** The `package.json` includes no Jest or other test runner.

When adding tests, the recommended approach is Jest + `@testing-library/react`, colocated in
`__tests__/` directories next to the files they cover.

---

## Requirements Traceability

Feature requirements (if any) should be placed in `requirements/` using `REQ-{AREA}-{SUB}-{NUMBER}`
identifiers (e.g. `REQ-DP-RANGE-01`).

---

## Session Memory

See `WORKLOG.md` for a chronological log of changes made by Claude Code. Always read it before
starting work and append a new entry after significant changes.

## Claude Code Instructions

After completing any significant task:

1. Append a dated entry to `WORKLOG.md` summarizing:
    - What was changed and in which files
    - Any bugs fixed (use BUG-\* identifiers)
    - Any requirements implemented (use REQ-\* identifiers)
    - Decisions made with brief rationale
2. Update component status in this file if architecture changed
3. Never rewrite history — only append

## Context Recovery

If WORKLOG.md is ambiguous, run `git log --oneline -20` and `git diff HEAD~5` to recover recent
context before proceeding.
