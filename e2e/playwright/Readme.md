# Playwright E2E

This project is designed for running end-to-end tests using Playwright inside a Docker container.

## Test Development

- Write all Playwright tests in the `tests` folder.
- Import `test` and `expect` from `../fixtures/fixtures` in your test files.

## Main Commands

- **test**  
  Runs Playwright tests locally.
  ```bash
  pnpm run test
  ```

- **test:docker**  
  Runs Playwright tests locally in docker. 

  Full cycle: copies artifacts, builds the Docker image, and runs tests in the container.
  ```bash
  pnpm run test:docker
  ```

- **start**  
  Starts a local server for viewing test results and managing snapshots via a web interface.
  ```bash
  pnpm run start
  ```

## Updating Screenshots

If you want to update all screenshots (snapshots), run:
```bash
pnpm run test -u
```

## Other Commands

- **test:ui**  
  Launches Playwright UI mode for interactive test selection and execution.
  ```bash
  pnpm run test:ui
  ```

- **lint**  
  Runs ESLint to check test code.
  ```bash
  pnpm run lint
  ```

- **docker:copy-artifacts**  
  Copies required artifacts for tests.
  ```bash
  pnpm run docker:copy-artifacts
  ```

- **docker:build**  
  Builds the Docker image for running tests.
  ```bash
  pnpm run docker:build
  ```

- **docker:test**  
  Runs tests in a Docker container, mounting folders for reports, results, and snapshots.
  ```bash
  pnpm run docker:test
  ```

- **docker:test:ci**  
  Same as docker:test, but with the environment variable CI=1 (for CI/CD).
  ```bash
  pnpm run docker:test:ci
  ```

## Notes

- Docker must be installed to use Docker commands.
- Test artifacts (reports, results, snapshots) will be available in the corresponding folders after tests complete.
