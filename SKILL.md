# react-tailwindcss-datepicker — SKILL.md

Curated list of Claude Code skills useful for this project, grouped by activity. Invoke any skill
with `/skill-name` in the Claude Code CLI.

---

## Daily Engineering

### `/engineering:code-review`

Review code changes for security, performance, and correctness.

**Why it matters here:** Every PR touches TypeScript 6 strict-mode code, React functional component
patterns (`useCallback`, `useMemo`, context), dayjs date utilities, and Tailwind CSS utility
classes. The skill checks for N+1 renders, incorrect memoization dependencies, incorrect date
boundary logic, and Tailwind dynamic class pitfalls (class names must be static strings — no string
interpolation).

**Typical triggers:** Before merging a PR, after adding a new date-selection behaviour or a new prop
to `DatepickerType`, when adding new color variants to the constant maps.

---

### `/engineering:debug`

Structured debugging session — reproduce, isolate, diagnose, fix.

**Why it matters here:** Bugs in this project typically span multiple layers: React render cycles,
`useCallback`/`useMemo` dependency arrays, dayjs locale loading (async `import()`), or
`useOnClickOutside` event propagation. The skill provides a systematic approach to isolate the
faulty layer.

**Typical triggers:** A date range is not selected correctly; a locale is not applied; the popover
position is wrong; clicking outside does not close the picker.

---

## Testing

### `/engineering:testing-strategy`

Design test strategies and test plans.

**Why it matters here:** The project currently has no test suite. The skill helps design the first
Jest + `@testing-library/react` unit tests, decide what to cover (date selection logic,
disabled-date filtering, keyboard navigation, i18n locale switching), and establish conventions for
`__tests__/` colocated test files.

**Typical triggers:** Before adding the first tests, when deciding what to cover for a new feature,
when the absence of tests causes a regression.

---

### `/design:accessibility-review`

Run a WCAG 2.1 AA accessibility audit on a design or component.

**Why it matters here:** The datepicker is an interactive widget with keyboard navigation, focus
management, and screen-reader concerns. The skill catches missing `aria-label`, `aria-selected`,
`role="grid"` semantics, and keyboard trap issues before they ship.

**Typical triggers:** After modifying `Calendar/Days.tsx`, `Input.tsx`, `Shortcuts.tsx`, or the
popover open/close logic.

---

## Design System & UX

### `/design:design-system`

Audit, document, or extend the design system.

**Why it matters here:** The project uses Tailwind CSS 3 with static color class maps in
`src/constants/index.ts` (`BG_COLOR`, `TEXT_COLOR`, `BORDER_COLOR`, `RING_COLOR`, `BUTTON_COLOR`).
Tailwind requires static class strings — dynamic interpolation silently produces broken styles. The
skill helps maintain the maps, prevent missing color variants, and document the pattern for
contributors.

**Typical triggers:** Adding a new primary color variant, changing a state color (hover, focus,
active), adding a new component that needs its own color map.

---

### `/design:ux-copy`

Write or review UX copy — microcopy, button labels, placeholder text.

**Why it matters here:** The datepicker exposes `placeholder`, `configs.footer.cancel`,
`configs.footer.apply`, and shortcut labels through props. The skill ensures new copy is clear,
consistent, and works across the supported `i18n` locales (dayjs locale strings).

**Typical triggers:** Changing default placeholder text, adding new shortcut labels, updating the
footer button labels.

---

### `/design:design-handoff`

Generate developer handoff specs from a design.

**Why it matters here:** When new visual variants or layout changes arrive, the skill produces
layout specs (grid, spacing, color tokens) and component prop changes aligned with the existing
Tailwind utilities, accelerating translation from design to code.

**Typical triggers:** Receiving a mockup for a new layout variant, a new popover direction, or a
redesigned month/year picker overlay.

---

## Documentation & Requirements

### `/engineering:documentation`

Write and maintain technical documentation.

**Why it matters here:** `CLAUDE.md` is the authoritative reference for contributors. The skill
helps keep it accurate as the architecture evolves, and helps write `requirements/` documents when
formal traceability is needed.

**Typical triggers:** Adding a new prop to `DatepickerType`, changing the build pipeline,
documenting a non-obvious design decision.

---

### `/engineering:architecture`

Create or evaluate an Architecture Decision Record (ADR).

**Why it matters here:** Significant decisions (e.g. replacing dayjs with a different date library,
adding SSR support, supporting multiple simultaneous datepickers on a page, switching from Rollup to
a different bundler) affect many components. The skill produces ADRs with trade-offs and
consequences.

**Typical triggers:** Evaluating a new date library, adding a new provider or context layer,
redesigning the popover positioning strategy.

---

## Deployment & Quality

### `/engineering:deploy-checklist`

Pre-deployment verification checklist.

**Why it matters here:** The library build (`npm run build`) runs lint, cleans `dist/`, then runs
Rollup. The checklist covers lint passage, successful Rollup compilation, declaration file
generation, and `package.json` `files` field correctness before publishing to npm.

**Typical triggers:** Before tagging a release or publishing a new version to npm.

---

### `/engineering:tech-debt`

Identify, categorize, and prioritize technical debt.

**Why it matters here:** Technical debt can accumulate around the Tailwind color maps (missing
variants), incorrect `useCallback`/`useMemo` deps, the large `loadLanguageModule` switch statement
in `src/libs/date.ts`, and divergence from the naming conventions in `CLAUDE.md`.

**Typical triggers:** At the start of a maintenance cycle, before a major feature addition, when
code review flags repeated issues.

---

## Productivity

### `/productivity:task-management`

Simple task management using a shared `TASKS.md` file.

**Why it matters here:** Feature work and bug fixes can be tracked against requirement IDs. The
skill keeps implementation tasks and open issues in a single file that Claude Code can reference
across sessions.

**Typical triggers:** Starting work on a new feature, triaging bugs from user reports, planning a
maintenance sprint.

---

### `/productivity:memory-management`

Two-tier memory system for cross-session continuity.

**Why it matters here:** The project has non-obvious conventions (static Tailwind class maps, dayjs
async locale loading, Rollup + Next.js dual tsconfig setup) that must be applied consistently across
multiple Claude Code sessions. The skill ensures these are retained and surfaced correctly.

**Typical triggers:** Starting a new session on an ongoing feature.

---

## Reference

| Skill                             | Category         | Frequency                       |
| --------------------------------- | ---------------- | ------------------------------- |
| `/engineering:code-review`        | Engineering      | Every PR                        |
| `/engineering:debug`              | Engineering      | On demand                       |
| `/engineering:testing-strategy`   | Testing          | New features / first tests      |
| `/design:accessibility-review`    | Testing / Design | Every interactive change        |
| `/design:design-system`           | Design           | New color variants / CSS change |
| `/design:ux-copy`                 | Design           | New copy / placeholder changes  |
| `/design:design-handoff`          | Design           | New designs received            |
| `/engineering:documentation`      | Documentation    | New props or architecture       |
| `/engineering:architecture`       | Documentation    | Significant decisions           |
| `/engineering:deploy-checklist`   | Deployment       | Pre-release                     |
| `/engineering:tech-debt`          | Quality          | Maintenance cycles              |
| `/productivity:task-management`   | Productivity     | Sprint / issue planning         |
| `/productivity:memory-management` | Productivity     | Session start                   |
