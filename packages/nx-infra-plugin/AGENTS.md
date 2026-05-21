# nx-infra-plugin

Nx workspace plugin providing build-pipeline executors for the DevExtreme monorepo. Each executor follows a two-tier impl pattern.

## Commands

```bash
pnpm --workspace-root nx test devextreme-nx-infra-plugin
pnpm --workspace-root nx lint devextreme-nx-infra-plugin
pnpm --filter devextreme-nx-infra-plugin run build
pnpm --filter devextreme-nx-infra-plugin exec tsc --noEmit -p tsconfig.lib.json
pnpm --filter devextreme-nx-infra-plugin exec jest src/executors/<name>/executor.e2e.spec.ts
pnpm --filter devextreme-nx-infra-plugin exec prettier --write .
```

All tests must pass before commit.

## Structure

Each executor lives at `src/executors/<name>/`:

- `executor.ts` — thin re-export: `export { default } from './<name>.impl';`
- `<name>.impl.ts` — business logic via `createExecutor` + named exports for cross-executor reuse
- `schema.ts`, `schema.json`, `executor.e2e.spec.ts`, optional `defaults.ts`

Each cross-executor concern (license banner, glob-aware copy, file concatenation, debug-block stripping, etc.) is owned by exactly ONE executor and exposed via named exports from its `*.impl.ts`. Discover what is available by reading the named exports of the relevant executor; do not re-implement. The full executor catalogue is in `executors.json`; generic primitives live in `src/utils/`.

## Conventions

- Wrap every executor with `createExecutor` (see `src/utils/create-executor.ts`). Do not duplicate project-root resolution or try/catch.
- Expose reusable logic as named exports from `<name>.impl.ts`; consumers import from `../<owner>/<owner>.impl`.
- Collapse `src/utils/X.ts` files that exist only because an executor's logic was needed elsewhere — move into the owner executor's impl.
- Throw inside `resolve` and `run`; the wrapper converts to `{ success: false }`.
- Keep the default export shape `PromiseExecutor<T>`. Tests import `from './executor'`.
- Use `logger.verbose(...)` from `@nx/devkit` for diagnostic output in executors. Never use `console.log` or `logger.info` for routine progress messages — they pollute every run; `logger.verbose` surfaces only when callers pass `--verbose`.

## Constraints

- NEVER edit `executors.json` for refactors; it points to `./src/executors/<name>/executor` and the build script rewrites paths in `dist`. Re-export from `executor.ts` instead.
- NEVER call another executor's `default` export from a sibling; import the named function from its `*.impl.ts` instead.
- NEVER use `runExecutor` from `@nx/devkit` for in-plugin composition; reserve it for cross-target / cross-project orchestration.

## Testing

Each behavior is owned by exactly ONE executor's canonical tests; consumers must not re-test owned behavior. Consumers test wiring + their own unique logic only.

- When a consumer executor uses another's named function, write ONE smoke test that verifies the option is forwarded (one artifact-presence assertion). Don't re-assert the helper's behavior — that is the owner's test job.
- Drop "should not modify X when option is omitted" negative tests; absence of behavior is implied by code structure and the createExecutor wrapper.
- Don't repeat the same assertion across multiple fixtures — pick one representative per code path.
- Test setup (license template literal, mock context, temp dirs) goes through helpers from `../../utils/test-utils`. Don't reinvent.

## Add a new executor

1. Create `src/executors/<new-name>/` with `schema.json`, `schema.ts`, `<new-name>.impl.ts` using `createExecutor`, `executor.ts` re-exporting `default` plus any named functions, and `executor.e2e.spec.ts` using `createMockContext` + `createTempDir` from `../../utils/test-utils`.
2. Register in `executors.json`: `implementation: ./src/executors/<new-name>/executor`, `schema: ./src/executors/<new-name>/schema.json`.
3. Validate: tsc → jest → lint. All tests must still pass.

## Refactor an existing executor

1. Run `grep -rn "<idiom>" src/executors/`. If 3+ executors share a pattern, it is a centralization candidate.
2. If the pattern belongs to an existing executor's domain, add a named export there. Otherwise add to `src/utils/`.
3. Preserve exact functional parity. Verify with the executor's e2e spec before and after.
4. Update consumer imports in one batch.
5. Run the full validation pipeline.
