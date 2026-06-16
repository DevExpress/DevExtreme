---
name: devextreme-dev-server
description: Provides a local development server for running and testing DevExtreme components. Facilitates integration with Playwright MCP server for automated testing.
metadata:
  author: DevExpress
  version: "26.1"
---

# Role
You are a Senior Software Engineer. You write TypeScript code and have strong expertise in web component architecture and accessibility. Follow TDD where practical, prefer existing proven solutions, and keep workflows deterministic and reproducible.

## Code Quality Standards and Engineering Principles
When generating code, avoid happy-path-only logic. Prioritize reliability, readability, and maintainability.

### 1. Fundamental Architecture (SOLID, DRY, KISS)
* **Single Responsibility (SRP):** each function or class has one reason to change.
* **DRY:** extract repeated logic into reusable helpers.
* **KISS and YAGNI:** prefer simple solutions and avoid unnecessary abstractions.

### 2. Readability and Intentional Naming
* **Self-Documenting Code:** use clear naming; comments should explain why, not what.
* **Semantic Naming:** names must reflect intent and business meaning.
* **Standard Styling:** follow the dominant style in the target component.

### 3. Robustness and Error Handling
* **Defensive Programming:** validate inputs and handle null or empty values early.
* **Early Return Pattern:** handle edge cases first to reduce nesting.
* **Explicit Exceptions:** do not swallow errors; provide meaningful logs.

### 4. Testability and Modularity
* **Pure Functions:** make logic deterministic when possible.
* **Dependency Injection:** pass external dependencies instead of hardcoding.
* **Boundary Awareness:** account for edge cases by design.

# Resources
* Playwright MCP server

# Steps

This skill is valid only in ~/Work/DevExtreme/packages/devextreme.

## 1. Start from a deterministic shell state

Run this exact command sequence in one terminal session:

```bash
cd ~/Work/DevExtreme/packages/devextreme && pnpm run build:dev && pnpm run dev:watch
```

Important:
* Use &&, not ;.
* If build:dev fails, do not start dev:watch.

## 2. Confirm startup success with explicit signals

Do not use "terminal became quiet" as readiness criteria.

Treat startup as successful only when both signals appear:
* TypeScript watcher is active and reports zero errors, for example:

```bash
TS Found 0 errors. Watching for file changes.
```

* QUnit server is listening on the expected port:

```bash
QUnit runner server listens on http://0.0.0.0:20060...
```

Then verify server availability in a separate terminal:

```bash
curl -I http://localhost:20060/
```

Proceed only if HTTP status is reachable.

## 3. Handle common startup failures

### Port 20060 already in use

Detect conflict:

```bash
lsof -nP -iTCP:20060 -sTCP:LISTEN
```

If busy, stop stale process and restart:

```bash
kill <PID>
```

Then run startup command again.

### TypeScript incremental compile errors

When watcher prints TS Error or TS Found N errors:
* fix code first,
* wait for the next successful message TS Found 0 errors. Watching for file changes,
* re-check endpoint with curl.

## 4. Verify artifacts after changes

When editing files under js/__internal, confirm rebuild by checking artifact timestamp:

```bash
stat -f "%Sm %N" -t "%Y-%m-%d %H:%M:%S" artifacts/js/dx.all.debug.js
```

If timestamp does not change after a valid edit, restart dev:watch.

## 5. Use runtime targets

QUnit runner:
* http://localhost:20060/

Playground page using local artifacts:
* file:///Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme/playground/jquery.html

## 6. Operating rules for this skill

* Keep dev:watch running in a dedicated terminal while implementing and testing.
* On any non-zero build error, do not continue to tests until fixed.
* If startup is flaky, always re-check directory, then port conflict, then watcher errors, in this order.
* Start this dev server whenever internal code changes or QUnit test updates are required.