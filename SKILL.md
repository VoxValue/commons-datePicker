# panelManagement-Client — SKILL.md

Curated list of Claude Code skills useful for this project, grouped by activity. Invoke any skill
with `/skill-name` in the Claude Code CLI.

---

## Daily Engineering

### `/engineering:code-review`

Review code changes for security, performance, and correctness.

**Why it matters here:** Every PR touches TypeScript 6 strict-mode code, React 19 patterns
(`useActionState`, context hooks), AWS Cognito calls, and Tailwind CSS utilities. The skill checks
for N+1 issues, security holes (XSS, injection), and correctness against the existing patterns
documented in `CLAUDE.md`.

**Typical triggers:** Before merging a PR, after implementing a new authentication flow or REST
handler, when adding a new form with validation.

---

### `/engineering:debug`

Structured debugging session — reproduce, isolate, diagnose, fix.

**Why it matters here:** Debugging in this project often spans multiple layers: React render cycles,
`useActionState` async state, AWS Amplify SDK responses, Playwright E2E failures, or locale loading
issues. The skill provides a systematic approach to isolate the faulty layer.

**Typical triggers:** A unit test passes but the E2E fails; a Cognito auth step hangs; a form does
not submit despite valid input; a locale is not loading.

---

### `/simplify`

Review changed code for reuse, quality, and efficiency, then fix issues found.

**Why it matters here:** React 19 patterns (`useMemo`, `useActionState`, context) are easy to
over-engineer or duplicate. The skill ensures new code reuses `BaseInput`, `BaseSelect`, existing
context hooks, and the established handler patterns before introducing new abstractions.

**Typical triggers:** After implementing a new component or handler, when a component file grows
large, when a pattern seems to be repeated across files.

---

## Testing

### `/engineering:testing-strategy`

Design test strategies and test plans.

**Why it matters here:** The project has two distinct test layers (Jest unit tests + Playwright E2E)
with strict conventions:

- Unit tests colocated in `__tests__/`, mocking Amplify and react-intl via `jest.setup.tsx`
- E2E tests following Page Object Model in `tests/pages/`, with locale strings loaded dynamically
  (never hardcoded), running across 6 locale variants

The skill helps decide _what_ to test at each layer for a new feature and ensures coverage aligns
with the `TC-NNN` / `FR-{AREA}-NNN` identifiers from
`requirements/testing/e2eTests/requirements.md`.

**Typical triggers:** Before adding a new authentication step, a new profile field, or a new modal
dialog.

---

### `/design:accessibility-review`

Run a WCAG 2.1 AA accessibility audit on a design or page.

**Why it matters here:** Accessibility is a first-class requirement. The project uses
`@axe-core/playwright` in `tests/specs/accessibility/` and mandates `aria-live`, `aria-invalid`,
`aria-describedby`, `sr-only` labels, and `focus:ring` on all interactive elements. The skill
catches violations before they reach the automated test suite.

**Typical triggers:** After adding or modifying a modal (`toSignIn`, `toSignUp`, etc.), any form
input, or the notification component.

---

## Design System & UX

### `/design:design-system`

Audit, document, or extend the design system.

**Why it matters here:** The project uses Tailwind CSS 4 with a custom `@theme` block and `@utility`
groups (`form-layout-*`, `input-color-*`, `modal-*`, `btn-*`). CSS comments reference `REQ-*` IDs
for traceability. The skill helps maintain naming consistency (`{component}-{section}-{state}`),
prevent duplicate utilities, and document new tokens or variants.

**Typical triggers:** Adding a new component with custom CSS, changing color tokens, introducing a
new layout variant.

---

### `/design:ux-copy`

Write or review UX copy — microcopy, error messages, empty states, CTAs.

**Why it matters here:** Every user-facing string is an `intl` message ID in a locale JSON file
under `src/js/locales/languages/`. The project targets 6+ locales (fr-FR, fr-CA, en-US, en-CA,
etc.). The skill ensures new message IDs follow the existing key naming scheme, that error messages
are clear and actionable, and that CTA labels are consistent across the authentication flows.

**Typical triggers:** Adding new form validation error messages, creating new button labels, writing
empty-state copy for a profile section, updating notification messages.

---

### `/design:design-handoff`

Generate developer handoff specs from a design.

**Why it matters here:** When new screens or component variants arrive from design, the skill
produces layout specs (grid, spacing, color tokens), component props, and interaction states aligned
with the existing Tailwind utilities and `requirements/` structure, accelerating the translation of
designs into REQ-\* compliant code.

**Typical triggers:** Receiving a Figma or mockup for a new feature before implementation starts.

---

## Documentation & Requirements

### `/engineering:documentation`

Write and maintain technical documentation.

**Why it matters here:** The project has a formal requirements structure (`requirements/` with
`REQ-{AREA}-{SUB}-{NUMBER}` IDs) and a growing set of components. The skill helps write or update
requirement files, component-level docs, and runbooks while maintaining consistency with the
existing format.

**Typical triggers:** Adding a new component that needs a requirement document, updating layout
specs after a design change, writing a runbook for the deployment process.

---

### `/engineering:architecture`

Create or evaluate an Architecture Decision Record (ADR).

**Why it matters here:** Significant decisions (e.g. switching state management approach, adding a
new provider to the nesting chain, changing the API authentication strategy) affect many components.
The skill produces ADRs with trade-offs and consequences, providing a lightweight paper trail
alongside the `requirements/` documents.

**Typical triggers:** Evaluating a new library, changing the provider nesting order, redesigning the
notification system, adding SSR support.

---

## Deployment & Quality

### `/engineering:deploy-checklist`

Pre-deployment verification checklist.

**Why it matters here:** The production build (`npm run build-prod`) uses a different config
(`build-config.prod.json`, which omits `AWS_RUM_IDENTITY_POOL_ID`), and the locale files must be
copied (`npm run build-locales`) before E2E tests or deployment. The skill generates a checklist
covering build steps, environment variable verification, test passage, and asset readiness.

**Typical triggers:** Before tagging a release or deploying to production.

---

### `/engineering:tech-debt`

Identify, categorize, and prioritize technical debt.

**Why it matters here:** The codebase spans React 19 patterns, TypeScript strict mode, and a custom
esbuild pipeline. Technical debt can accumulate around handler duplication, CSS utility sprawl, or
divergence from the `CLAUDE.md` naming conventions. The skill surfaces and prioritizes items for
cleanup sprints.

**Typical triggers:** At the start of a maintenance cycle, before a major feature addition, when
code review flags repeated issues.

---

## Productivity

### `/productivity:task-management`

Simple task management using a shared `TASKS.md` file.

**Why it matters here:** Features are tracked against `FR-{AREA}-NNN` functional requirements and
`TC-NNN` test cases. The skill keeps implementation tasks, open test cases, and bug fixes in a
single file that Claude Code can reference across sessions.

**Typical triggers:** Starting a new sprint, triaging bugs from a test run, planning work against a
set of requirement IDs.

---

### `/productivity:memory-management`

Two-tier memory system for cross-session continuity.

**Why it matters here:** The project has nuanced conventions (naming prefixes, provider ordering,
API request pattern, locale test constraints) that must be applied consistently across multiple
Claude Code sessions. The skill ensures these are retained and surfaced correctly without re-reading
`CLAUDE.md` each time.

**Typical triggers:** Starting a new session on an ongoing feature, switching between worktrees
(e.g. `practical-swartz`, `festive-morse`).

---

## Reference

| Skill                             | Category         | Frequency                      |
| --------------------------------- | ---------------- | ------------------------------ |
| `/engineering:code-review`        | Engineering      | Every PR                       |
| `/engineering:debug`              | Engineering      | On demand                      |
| `/simplify`                       | Engineering      | After implementation           |
| `/engineering:testing-strategy`   | Testing          | New features                   |
| `/design:accessibility-review`    | Testing / Design | Every modal or input change    |
| `/design:design-system`           | Design           | New CSS utilities              |
| `/design:ux-copy`                 | Design           | New locale message IDs         |
| `/design:design-handoff`          | Design           | New designs received           |
| `/engineering:documentation`      | Documentation    | New components or requirements |
| `/engineering:architecture`       | Documentation    | Significant decisions          |
| `/engineering:deploy-checklist`   | Deployment       | Pre-release                    |
| `/engineering:tech-debt`          | Quality          | Maintenance cycles             |
| `/productivity:task-management`   | Productivity     | Sprint planning                |
| `/productivity:memory-management` | Productivity     | Session start                  |
