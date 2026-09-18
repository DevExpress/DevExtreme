---
applyTo: "**/packages/devextreme-angular/src/**"
---

# Maintaining the DevExtreme Angular wrapper by hand

The files under `packages/devextreme-angular/src/` are **no longer generated**. Edit them
directly to keep them in sync with the public API in
`packages/devextreme/js/{ui,viz}/**/*.d.ts`. See
[public-api-wrappers.instructions.md](./public-api-wrappers.instructions.md) for when a
wrapper change is required and what the reviewer checks.

## Do not edit

- `packages/devextreme-angular/src/core/**` — hand-written base classes
  (`DxComponent`, `NestedOptionHost`, template/integration modules). Never change these to
  accommodate a single component.
- `packages/devextreme-angular/src/ui/nested/**` — the legacy nested option components
  ("old nesteds"). This folder is **deprecated and being removed in a parallel PR**. Do not
  add, edit, or reference files here, even when a nested/collection option changes.

## Adding a new component

Fastest path: **clone the closest existing wrapper and rename**, rather than writing a file
from scratch. For a plain Widget-based component copy `ui/load-indicator/index.ts`; for one
with many options/events copy `ui/button/index.ts`; for a container with nested options copy
`ui/sortable/` (the component plus its `nested/` folder).

Files to create and register (keep every list alphabetical):

- `packages/devextreme-angular/src/ui/<name>/index.ts` — the component (see anatomy below).
- `packages/devextreme-angular/src/ui/<name>/ng-package.json` —
  `{ "lib": { "entryFile": "index.ts" } }`.
- `packages/devextreme-angular/src/index.ts` — add
  `export { Dx<Name>Component, Dx<Name>Module } from 'devextreme-angular/ui/<name>';`.
- `packages/devextreme-angular/src/ui/all.ts` — add the `import` **and** add `Dx<Name>Module`
  to **both** the declarations and exports arrays (the two arrays are identical; anchor on the
  neighboring entries to place it in each).
- For a component with nested/object options, also create the `ui/<name>/nested/` folder
  (cloning `ui/sortable/nested/` is the fastest way) and wire its module into the component's
  `@NgModule` plus `export * from 'devextreme-angular/ui/<name>/nested';`.

Do **not** create anything under `src/metadata/generated/**` — it is gitignored generated
output, not source.

## Component file anatomy (`ui/<component>/index.ts`)

Use the widget's options interface (e.g. `dxButtonOptions` and its `WidgetOptions` base) as
the source of truth. A component file contains, in order:

1. **Imports** — Angular symbols (`Component`, `Input`, `Output`, `EventEmitter`,
   `NgModule`, `OnDestroy`, …), `type` imports of the event types and enum/union types from
   `devextreme/ui/<widget>` and `devextreme/common`, the default widget import
   (`import DxButton from 'devextreme/ui/button'`), and base classes from
   `devextreme-angular/core`.
2. **`@Component` decorator** — `selector: 'dx-<name>'`, `template` (`<ng-content>` for
   container widgets, empty otherwise), `imports: [ DxIntegrationModule ]`, and the standard
   `providers` (`DxTemplateHost`, `WatcherHelper`, `NestedOptionHost`).
3. **Class** `Dx<Name>Component extends DxComponent implements OnDestroy` with
   `instance: Dx<Name> = null;`.
4. **One `@Input()` getter/setter pair per option**, in the same order as the options
   interface (including inherited `WidgetOptions`/`DOMComponentOptions`):
   ```ts
   @Input()
   get text(): string { return this._getOption('text'); }
   set text(value: string) { this._setOption('text', value); }
   ```
   The getter/setter type must match the option's type exactly (keep `| undefined` and
   union members).
5. **Events** — one `@Output()` per `onX` callback, named exactly as the option and typed
   with the event type:
   ```ts
   @Output() onClick: EventEmitter<ClickEvent>;
   ```
6. **Two-way binding outputs** — one `@Output() <option>Change: EventEmitter<T>;` for **every**
   `@Input` option (type matches the input).
7. **Constructor** — calls `this._createEventEmitters([...])` with one entry per emitter:
   `{ subscribe: '<widgetEventName>', emit: 'on<Event>' }` for events (the widget event name
   is the `onX` name without the `on` prefix, camelCased: `onClick` → `click`) and
   `{ emit: '<option>Change' }` for every option.
8. **`_createInstance(element, options)`** — returns `new Dx<Name>(element, options)`.
9. **`ngOnDestroy()`** — `this._destroyWidget();`.
10. **`@NgModule`** exporting the component (and `DxTemplateModule`).
11. **Types reexport** — `import type * as Dx<Name>Types from "devextreme/ui/<widget>_types"; export { Dx<Name>Types };`

## Applying an API change

- **Option added** → add the `@Input` getter/setter, its `<option>Change` output, and the
  `{ emit: '<option>Change' }` entry in `_createEventEmitters`.
- **Option removed/renamed** → remove/rename all three (input, change output, emitter entry).
- **Event added** → add the `@Output() onX`, and a `{ subscribe, emit }` entry.
- **Nested/collection option** → do **not** touch `ui/nested/**` (deprecated, see "Do not
  edit"). Leave nested option handling to the parallel removal PR.

Keep import lists, option order, and emitter order aligned with the options interface so
diffs stay reviewable.
