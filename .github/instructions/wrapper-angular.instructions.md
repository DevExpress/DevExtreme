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
