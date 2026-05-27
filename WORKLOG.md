# WORKLOG

Chronological log of significant changes made by Claude Code.

---

## 2026-05-27 — TypeScript 6 upgrade + CLAUDE.md / SKILL.md alignment

### Summary

Upgraded TypeScript from `^5.5.4` to `^6.0.3` and updated project documentation to accurately
reflect the actual codebase.

### Files changed

| File                                | Change                                                                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `package.json`                      | `typescript` dev-dependency bumped to `^6.0.3`                                                                                                                           |
| `tsconfig.base.json`                | `moduleResolution` changed from `"node"` → `"bundler"`; removed unused `baseUrl: "src/"` ; added `next-env.d.ts` to `include`                                            |
| `src/components/Calendar/index.tsx` | Converted `baseUrl`-relative import `from "types"` to `from "../../types"`; moved `DateType` import into the correct ESLint `import/order` group                         |
| `src/components/Calendar/Years.tsx` | Converted `baseUrl`-relative import `from "contexts/DatepickerContext"` to `from "../../contexts/DatepickerContext"`; reordered imports to satisfy ESLint `import/order` |
| `CLAUDE.md`                         | Rewritten to describe the actual `react-tailwindcss-datepicker` package (was describing the parent `@voxvalue/commons` auth library)                                     |
| `SKILL.md`                          | Rewritten to remove invalid references (`/simplify`, Playwright E2E, AWS Cognito, Tailwind CSS 4, wrong project title)                                                   |

### Decisions

- **`moduleResolution: "bundler"`**: TypeScript 6 deprecated `"node"` (aliased to `"node10"`).
  `"bundler"` is the correct setting for a Rollup + Next.js project and matches the
  `"module": "esnext"` target already in use.
- **Removed `baseUrl`**: TypeScript 6 deprecated `baseUrl` when used without `paths`. The two source
  files that relied on it (`Calendar/index.tsx`, `Calendar/Years.tsx`) were converted to relative
  imports — the rest of the codebase already used relative imports exclusively.

### Testing

No unit test suite exists in this project. The following verifications were performed manually:

- `./node_modules/.bin/tsc --noEmit` — 0 errors after config changes
- `npm run build` — lint passed, Rollup produced `dist/index.cjs.js` and `dist/index.esm.js` without
  errors
