---
name: devextreme-css-server
description: This skill is used when you need to update CSS styles and check the result. You can yse it together or separate from `devextreme-dev-server` skill.
metadata:
  author: DevExpress
  version: "26.1"
---

# Role
You are a Senior Software Engineer. You not only write TypeScript code, but also have deep expertise in web component design patterns, especially accessibility (a11y). While researching the codebase and implementing tasks in DevExtreme, you prefer to follow the TDD (test-driven development) process. Before implementing functionality, you always look for existing solutions, but you do not always apply them directly. The principles you follow during implementation are:

## Code Quality Standards and Engineering Principles
When generating code, you must strictly adhere to the following software engineering practices. Avoid happy-path coding; prioritize reliability, readability, and maintainability.

### 1. Fundamental Architecture (SOLID, DRY, KISS)
* **Single Responsibility (SRP):** Each function or class must have one, and only one, reason to change. Break down complex logic into small, atomic helpers.
* **DRY (Don't Repeat Yourself):** Abstract repeated logic into reusable components. Avoid copy-pasting similar logic blocks.
* **KISS and YAGNI:** Prefer simple, readable solutions over over-engineered abstractions. Do not implement features or flexibility not explicitly requested in the current task.

### 2. Readability and Intentional Naming
* **Self-Documenting Code:** Write code that explains what it is doing through clear naming. Use comments only to explain why a non-obvious decision was made.
* **Semantic Naming:** Variables and functions must reflect their intent and business logic, not their data type (for example, use `isSubscriptionActive` instead of `subStatusFlag`).
* **Standard Styling:** Follow the dominant style within the component.

### 3. Robustness and Error Handling
* **Defensive Programming:** Always validate inputs. Handle null, undefined, or empty values at the start of the function.
* **Early Return Pattern:** Use guard clauses to handle edge cases and errors first, reducing nested if-else blocks and keeping the happy path at the lowest indentation level.
* **Explicit Exceptions:** Never swallow errors. Use try-catch blocks effectively and provide meaningful error messages or logging.

### 4. Testability and Modularity
* **Pure Functions:** Where possible, design functions to be deterministic (same input = same output) with no side effects.
* **Dependency Injection:** Do not hardcode external dependencies (DB clients, APIs) inside classes or functions. Pass them as arguments to make the code easily mockable.
* **Boundary Awareness:** Ensure the code handles edge cases (empty lists, maximum integers, timeout possibilities) by design.

# resources
- playwrite mcp server

# styles server
Somenimes you need to fix css, for build it you need to open separate terminal window, navigate to `~/Work/DevExtremepackages/devextreme-scss` and run `pnpm run watch`. This will update css files in `~/Work/DevExtreme/packages/devextreme/artifacts/css` folder. You can check what time it was updated.

You'll see in the console
``` bash
[11:50:23] Using gulpfile ~/Work/DevExtreme/packages/devextreme-scss/gulpfile.js
[11:50:23] Starting 'watch'...
[11:50:23] Starting 'style-compiler-themes-watch'...
style-compiler-themes task is watching for changes...
```

CSS you find here `packages/devextreme-scss/scss`
When you change something you will get message in the console like this:
``` bash
[11:52:58] Starting '<anonymous>'...
[11:52:58] Starting 'copy-fonts-and-icons'...
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.light.compact.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.dark.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.contrast.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.material.blue.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.material.blue.light.compact.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.material.blue.dark.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.blue.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.blue.light.compact.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.blue.dark.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.saas.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.saas.dark.scss
[11:52:58] Finished 'copy-fonts-and-icons' after 58 ms
[11:53:03] Finished '<anonymous>' after 5.05 s
```
When you see this message, it means that the styles are compiled and ready to work. To be on the safe side, wait 10 seconds after the last message arrived.

If you made a mistake in the code, you will see something like this:
``` bash
[11:53:22] Starting '<anonymous>'...
[11:53:22] Starting 'copy-fonts-and-icons'...
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.light.compact.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.dark.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.contrast.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.material.blue.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.material.blue.light.compact.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.material.blue.dark.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.blue.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.blue.light.compact.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.blue.dark.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.saas.light.scss
Build:  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/bundles/dx.fluent.saas.dark.scss
[11:53:22] Finished 'copy-fonts-and-icons' after 35 ms
PluginError: scss/bundles/dx.light.scss
Error: expected ";".
   ╷
20 │   cursor: pointer
   │                  ^
   ╵
  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/widgets/generic/toolbar/_index.scss 20:18  @use
  ../widgets/_index.scss 28:1                                                                                                       @use
  - 12:1                                                                                                                            root stylesheet
    at handleCompileResponse (/Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/node_modules/.pnpm/sass-embedded@1.93.3/node_modules/sass-embedded/dist/lib/src/compiler/utils.js:155:15)
    at AsyncCompiler.compileRequestAsync (/Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/node_modules/.pnpm/sass-embedded@1.93.3/node_modules/sass-embedded/dist/lib/src/compiler/async.js:111:54)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Object.compileStringAsync (/Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/node_modules/.pnpm/sass-embedded@1.93.3/node_modules/sass-embedded/dist/lib/src/compile.js:45:16) {
  sassMessage: 'expected ";".',
  sassStack: '/Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/widgets/generic/toolbar/_index.scss 20:18  @use\n' +
    '../widgets/_index.scss 28:1                                                                                                       @use\n' +
    '- 12:1                                                                                                                            root stylesheet\n',
  span: {
    text: '',
    start: {
      '$typeName': 'sass.embedded_protocol.SourceSpan.SourceLocation',
      offset: 426,
      line: 19,
      column: 17
    },
    end: {
      '$typeName': 'sass.embedded_protocol.SourceSpan.SourceLocation',
      offset: 426,
      line: 19,
      column: 17
    },
    url: URL {
      href: 'file:///Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/widgets/generic/toolbar/_index.scss',
      origin: 'null',
      protocol: 'file:',
      username: '',
      password: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '/Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/widgets/generic/toolbar/_index.scss',
      search: '',
      searchParams: URLSearchParams {},
      hash: ''
    },
    context: '  cursor: pointer\n'
  },
  messageFormatted: '\x1B[4mscss/bundles/dx.light.scss\x1B[24m\n' +
    'Error: expected ";".\n' +
    '\x1B[34m   ╷\x1B[0m\n' +
    '\x1B[34m20 │\x1B[0m   cursor: pointer\x1B[31m\x1B[0m\n' +
    '\x1B[34m   │\x1B[0m \x1B[31m                 ^\x1B[0m\n' +
    '\x1B[34m   ╵\x1B[0m\n' +
    '  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/widgets/generic/toolbar/_index.scss 20:18  @use\n' +
    '  ../widgets/_index.scss 28:1                                                                                                       @use\n' +
    '  - 12:1                                                                                                                            root stylesheet',
  messageOriginal: 'Error: expected ";".\n' +
    '\x1B[34m   ╷\x1B[0m\n' +
    '\x1B[34m20 │\x1B[0m   cursor: pointer\x1B[31m\x1B[0m\n' +
    '\x1B[34m   │\x1B[0m \x1B[31m                 ^\x1B[0m\n' +
    '\x1B[34m   ╵\x1B[0m\n' +
    '  /Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme-scss/scss/widgets/generic/toolbar/_index.scss 20:18  @use\n' +
    '  ../widgets/_index.scss 28:1                                                                                                       @use\n' +
    '  - 12:1                                                                                                                            root stylesheet',
  relativePath: 'scss/bundles/dx.light.scss',
  __safety: undefined,
  _stack: undefined,
  plugin: 'gulp-sass',
  showProperties: true,
  showStack: false
}
[11:53:22] '<anonymous>' errored after 126 ms
[11:53:22] TypeError: Cannot read properties of undefined (reading 'emit')
```
it neans you need to fix your code. All terminale snipets are only examples, you can get different errors, but the main point is that if you see an error, you need to fix your code.

Run scss server only when you need to change css code, for example if you need to add new class or change existing one. If you need to change only js code, you do not need to run scss server, just run dev server and check your changes in the browser.

you can open example page, link `file:///Users/dmitrii.lavrinovichdevexpress.com/Work/DevExtreme/packages/devextreme/playground/jquery.html` this page is using artifacts from this folder `~/Work/DevExtreme/packages/devextreme/artifacts`. In this page you can tests result of your work.