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

---

## 2026-05-27 — Replace Rollup with tsdown, remove Husky

### Summary

Migrated the library build pipeline from Rollup 4 to tsdown 0.22 (backed by rolldown v1 / Rust).
Removed Husky pre-commit hooks and all related tooling (`husky`, `pinst`, `lint-staged`).

### Files changed

| File | Change |
| --- | --- |
| `package.json` | Removed `rollup`, `@rollup/plugin-*`, `husky`, `pinst`, `lint-staged`. Added `tsdown ^0.22.0`. Updated `main`/`module`/`types` to new output filenames. Added `exports` conditional map. Updated `build`/`watch`/`clean` scripts. Removed `prepare` script. |
| `tsdown.config.ts` | New — tsdown config: entry `src/index.tsx`, formats CJS+ESM, `deps.neverBundle` for react+dayjs, DTS enabled, sourcemaps, points to `tsconfig.build.json`. |
| `tsconfig.build.json` | New — renamed from `tsconfig.rollup.json`; extends `tsconfig.base.json` with `"jsx": "react-jsx"` for the build pipeline. |
| `tsconfig.rollup.json` | Deleted — superseded by `tsconfig.build.json`. |
| `rollup.config.js` | Deleted. |
| `.husky/pre-commit` | Deleted. |
| `.husky/pre-push` | Deleted. |
| `CLAUDE.md` | Updated Technology Stack table, Published exports, and Build Pipeline section. |

### Decisions

- **tsdown over tsup/esbuild**: tsdown is backed by rolldown (Rust, fast) and is the explicit
  replacement requested. It produces `.cjs`/`.mjs` outputs with paired `.d.cts`/`.d.mts`
  declarations, which is the modern dual-format standard.
- **`exports` conditional map added**: Required so TypeScript consumers correctly resolve types for
  the format they import. `"types"` field kept as CJS fallback for older tools.
- **`deps.neverBundle` instead of `external`**: `external` was deprecated in tsdown 0.22; the
  replacement is `deps.neverBundle`.
- **`tsconfig.build.json` kept**: `tsconfig.json` must retain `"jsx": "preserve"` for Next.js;
  a separate build tsconfig with `"jsx": "react-jsx"` is still needed.
- **Husky removed without replacing**: No alternative pre-commit hook mechanism was introduced;
  `lint` and `format` scripts remain available for manual use.

### Testing

- `npm run build` — lint passed, tsdown produced `dist/index.cjs`, `dist/index.mjs`,
  `dist/index.d.cts`, `dist/index.d.mts` without errors.

---

## 2026-05-27 — Drop CJS output, ESM-only

### Summary

Removed CJS format from the build pipeline. The package now ships ESM only.

### Files changed

| File | Change |
| --- | --- |
| `tsdown.config.ts` | `format` changed from `["cjs", "esm"]` to `["esm"]`. |
| `package.json` | Removed `"main"` (CJS entrypoint). Added `"type": "module"`. Updated `"types"` to `dist/index.d.mts`. Removed `require` branch from `exports` map. |
| `CLAUDE.md` | Updated Published exports and Build Pipeline section. |

### Decisions

- **`"type": "module"` added**: The package is now ESM-only so this is the correct declaration;
  it also eliminates the tsdown config-reparsing warning introduced previously.
- **`"main"` removed**: `"main"` is the CJS entrypoint field; it has no meaning for an ESM-only
  package. Consumers use `"exports"` or `"module"` instead.

### Testing

- `npm run build` — tsdown produced `dist/index.mjs` and `dist/index.d.mts` without errors or warnings.
