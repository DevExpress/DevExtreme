---
applyTo: "**/apps/demos/Demos/**/Angular/**"
---

# Writing Angular demos

Angular demos run without zone.js. Change detection is driven by signals, so state that the
template reads and that changes at runtime must be a signal. New demos start from
`pnpm run add-demo` (template: `apps/demos/utils/templates/Angular/`).

## Rules

1. **Standalone component.** One `AppComponent` with `imports: [...]`, started with
   `bootstrapApplication(AppComponent)`. No `NgModule`, `platformBrowserDynamic`,
   `BrowserModule`, `CommonModule`, `provideZoneChangeDetection` or `NgZone`.
2. **DI.** Use `inject()` instead of constructor parameters, also in services.
3. **State.** Use `signal()` for state that the template reads and that changes at runtime.
   Read it as `x()` in the template, update it with `set()` / `update()`. Use plain
   `readonly` fields or module constants for static data.
4. **Derived values.** Use `computed()` instead of getters.
5. **Two-way bindings.** Bind a signal: `[(value)]="selected"`, without `()`. Everywhere
   else in the template, call it: `[disabled]="!selected()"`.
6. **Control flow.** `@if` / `@for (item of items; track item.id)` / `@switch` instead of
   `*ngIf` / `*ngFor` / `ngSwitch`. `@if (current(); as item)` keeps the inner markup the same.
7. **No `ChangeDetectorRef`.** Make the state a signal instead of calling `detectChanges()` /
   `markForCheck()`.
8. **Streams.** Keep RxJS only for real streams (for example, SignalR pushes) and add
   `takeUntilDestroyed()`. Otherwise use signals or `toSignal()`.
9. **Inputs, outputs, queries.** `input()` / `input.required()`, `output()`,
   `viewChild()` / `viewChild.required()` instead of `@Input`, `@Output` + `EventEmitter`,
   `@ViewChild`.
10. **Constructors.** If a constructor only assigns fields, replace it with field
    initializers. Initializers run in declaration order, so a field can use only fields
    declared above it. Keep a constructor (without parameters) only for real work at startup.
11. **Type imports.** Import types with `import type { ... }` (`verbatimModuleSyntax` is on).

## Checks

From `apps/demos`:

```bash
pnpm exec eslint Demos/<Widget>/<Demo>/Angular
pnpm exec prettier --check Demos/<Widget>/<Demo>/Angular
DEMO_BUNDLE_FILTER=<Widget>/<Demo> node utils/server/demo-bundle-angular.js
pnpm run ts-check-ng   # strict template type check; no new errors in the changed demos
```

`DEMO_BUNDLE_FILTER` is matched as a substring of `<Widget>/<Demo>`, so do not add a
trailing slash.
Then open the demo (`pnpm run demos:start` from the repo root) and click through it.
