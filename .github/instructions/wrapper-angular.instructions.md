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
  accommodate a single component. **One exception:** `src/core/tokens/index.ts`, where a
  new collection option name gets its `PROPERTY_TOKEN_<name>` (see "Adding a new
  component").
- `packages/devextreme-angular/src/ui/nested/**` — the legacy nested option components
  ("old nesteds"). This folder is **deprecated and being removed in a parallel PR**. Do not
  add, edit, or reference files here, even when a nested/collection option changes.

## Adding a new component

Use the templates at
[`.github/templates/wrapper-angular/`](../templates/wrapper-angular/README.md):
`component.ts.tmpl` for `ui/<name>/index.ts` and `nested.ts.tmpl` for each file in
`ui/<name>/nested/`. Fill them from the component's `.d.ts` by following the README's rules.
They are the exact rules of the retired generator: property and output lists, type
strings, doc IDs, editor/collection flags, nested naming, and tokens.
You don't need to read other wrappers. Never open the large ones (`data-grid`, `tree-list`,
`card-view`, `chart`) to learn the pattern.

Files to create and register (keep every list alphabetical):

- `packages/devextreme-angular/src/ui/<name>/index.ts` — the component (see anatomy below).
- `packages/devextreme-angular/src/ui/<name>/ng-package.json` —
  `{ "lib": { "entryFile": "index.ts" } }`.
- `packages/devextreme-angular/src/index.ts` — add
  `export { Dx<Name>Component, Dx<Name>Module } from 'devextreme-angular/ui/<name>';`.
- `packages/devextreme-angular/src/ui/all.ts`: add the `import`, **and** add
  `Dx<Name>Module` to **both** the `imports` and the `exports` array of `DevExtremeModule`.
  The two arrays are identical; anchor on the neighboring entries to place it in each.
- For a component with nested/object options, also create the `ui/<name>/nested/` folder
  (one file per nested component, plus `index.ts` and `ng-package.json`; see the template
  README §0 and §5). Wire every nested module into the component's `@NgModule` and add
  `export * from 'devextreme-angular/ui/<name>/nested';`.
- If a new collection option name has no `PROPERTY_TOKEN_<name>` in
  `src/core/tokens/index.ts`, add one. It is the single exception to "Do not edit
  `src/core/**`", because that file used to be generator output.

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
4. **One `@Input()` getter/setter pair per non-event option**, own and inherited
   (`WidgetOptions`/`DOMComponentOptions`), sorted **alphabetically**:
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
10. **`@NgModule`** with an `imports` array (`Dx<Name>Component`, each nested
    `Dxo…Module`/`Dxi…Module`, `DxIntegrationModule`, `DxTemplateModule`) and an `exports`
    array (`Dx<Name>Component`, each nested module, `DxTemplateModule`).
11. **Types reexport** — `import type * as Dx<Name>Types from "devextreme/ui/<widget>_types"; export { Dx<Name>Types };`

## Applying an API change

- **Option added** → add the `@Input` getter/setter, its `<option>Change` output, and the
  `{ emit: '<option>Change' }` entry in `_createEventEmitters`.
- **Option removed/renamed** → remove/rename all three (input, change output, emitter entry).
- **Event added** → add the `@Output() onX`, and a `{ subscribe, emit }` entry.
- **Nested/collection option** → do **not** touch `ui/nested/**` (deprecated, see "Do not
  edit"). Update the component's own `ui/<name>/nested/` files instead (template README §5).
  A **new collection-item** option also needs its `PROPERTY_TOKEN_<name>` in
  `src/core/tokens/index.ts` if that name isn't there yet (the one allowed `src/core` edit).

Keep options, events, and emitter entries in the generator's order (alphabetical within
each group; see template README §3–§4) so diffs stay reviewable.
