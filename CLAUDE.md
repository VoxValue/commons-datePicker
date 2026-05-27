# @voxvalue/commons — CLAUDE.md

## Project Overview

Shared React component library consumed by VoxValue SPAs. Provides authentication (AWS Cognito via
Amplify), notifications, base inputs, locale loading, and a root layout that wires all providers
together.

- **Package name:** `@voxvalue/commons`
- **Source root:** `src/`
- **Published exports:** `./authentication`, `./notification`, `./components`, `./testing`,
  `./locales`, `./layout`

---

## Technology Stack

| Layer                | Technology                                                |
| -------------------- | --------------------------------------------------------- |
| UI framework         | React 19 (peer dependency)                                |
| Language             | TypeScript 6                                              |
| Styling              | Tailwind CSS (applied by consumers)                       |
| Authentication       | AWS Amplify v6 + AWS Cognito                              |
| Internationalization | react-intl 10                                             |
| Headless components  | @headlessui/react 2 (peer dependency)                     |
| Icons                | @heroicons/react 2, FontAwesome Pro 7 (peer dependencies) |
| Logging              | loglevel                                                  |
| Unit testing         | Jest 30 + @testing-library/react 16                       |
| Test data            | @faker-js/faker 8                                         |

---

## Commands

```bash
# Run all unit tests (Jest)
npm test

# Run a single test file
npx jest src/authentication/components/__tests__/toSignIn.test.tsx
```

The `@config` path alias resolves to `build-config.dev.json` at test time.

---

## Coding Standards

### Naming Conventions

| Kind                            | Convention                            | Examples                                                                |
| ------------------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| React components                | PascalCase                            | `SignIn`, `BaseInput`, `ProfileLayout`                                  |
| Variables (objects/complex)     | camelCase, prefix `o`                 | `oConfiguration`, `oUserAttributes`, `oErrorData`                       |
| Parameters / function arguments | camelCase, prefix `a`                 | `aError`, `aEmail`, `aPassword`, `aResponse`                            |
| Handler / action functions      | verb+noun camelCase                   | `signInAction`, `signUpAction`, `toLoad`, `toSave`                      |
| Modal/dialog components         | `to` prefix                           | `toSignIn`, `toSignUp`, `toSignOut`, `toSignAway`, `toReinitMyPassword` |
| Context objects                 | PascalCase + `Context` suffix         | `AuthenticationContext`, `NotificationContext`                          |
| Custom hooks                    | `use` prefix camelCase                | `useAuthentication`, `useNotificationContext`                           |
| TypeScript interfaces           | PascalCase + `Type` or `Props` suffix | `AuthenticationContextType`, `InputProps`                               |

### TypeScript

- Strict mode is enabled (`tsconfig.json`).
- All props must be typed via interfaces.
- No `any` unless genuinely unavoidable.
- Path alias: `@config` → `build-config.dev.json` (Cognito pool config injected at build time).

### React

- Functional components only (no class components).
- Use `useActionState` (React 19) for all form submissions with async side effects.
- Memoize context values with `useMemo` to avoid unnecessary re-renders.
- Sub-components (e.g. `SubmitButton`, `CancelButton`) may be defined inside the same file when only
  used there.
- All user-facing strings must go through `<FormattedMessage>` or `intl.formatMessage()` — no
  hardcoded text.

---

## Architecture

### Provider Nesting

The root `Layout` (exported from `./layout`) wraps children in this fixed order:

```

```

### Context Pattern

Every context follows this structure:

```typescript
// 1. Interface
export interface FooContextType { ... }

// 2. createContext with null default
const FooContext = createContext<FooContextType | null>(null);

// 3. Provider component (memoize value)
export const Provider = ({ children }: { children: ReactNode }) => { ... };

// 4. Custom hook (throws if used outside provider)
export const useFoo = () => {
    const oContext = useContext(FooContext);
    if (!oContext) throw new Error('useFoo must be used within a FooProvider');
    return oContext;
};
```

### Form Pattern (React 19 actions)

```typescript
// Handler signature
async function signInAction(aPrevState: AuthState, aFormData: FormData): Promise<AuthState> { ... }

// Component usage
const [oState, formAction, isPending] = useActionState(signInAction, initialState);
```

### Modal/Dialog Pattern

All authentication modals use a native `<dialog>` element controlled by a `ref`:

- `modalRef.current?.showModal()` to open
- `modalRef.current?.close()` to close
- 3-column grid layout: logo | title/form | (labels in rows)

---

## File Structure

```
src/
├──
```

---

## Testing

### Unit Tests (Jest)

- Tests live in `__tests__/` directories colocated with the source they test.
- Setup file: `jest.setup.tsx` — mocks react-intl, aws-amplify, loglevel, FontAwesome, fetch,
  ResizeObserver, crypto.
- Use `@testing-library/react` (`render`, `screen`, `fireEvent`, `act`).
- Mock native dialog APIs: `HTMLDialogElement.prototype.showModal = jest.fn()`.
- Use `jest.useFakeTimers()` for timer-dependent behavior (e.g. notification auto-dismiss).
- Use `TestingProvider` from `./testing` to wrap components under test with all required providers.

```bash
npm test
# single file:
npx jest src/authentication/components/__tests__/toSignIn.test.tsx
```

### Test IDs

All interactive elements that are tested must have a `data-testid` attribute. Use the `testIdPrefix`
prop on shared input components, which generates `data-testid="{testIdPrefix}-input"` etc.

---

## Requirements Traceability

All feature requirements live in `requirements/` and use `REQ-{AREA}-{SUB}-{NUMBER}` identifiers
(e.g. `REQ-SIGNIN-FRM-01`, `REQ-INP-EMAIL-01`). When implementing or modifying a component, consult
the corresponding requirements file to ensure conformance.

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

---

## Build Config

Build-time AWS config is injected via `build-config.dev.json` / `build-config.prod.json` through the
`@config` alias:

```json
{
    "AWS_COGNITO_POOL_ID": "",
    "AWS_COGNITO_APP_ID": ""
}
```
