---
applyTo: "**/packages/devextreme/js/{ui,viz}/**/*.{d.ts,js}"
---

# Public API changes must be propagated to the framework wrappers

The Angular, React, and Vue wrappers are **no longer regenerated** from
`devextreme-metadata` / `devextreme-internal-tools`. They are maintained by hand (with the
help of local AI agents). This means **every public API change in a wrapped component's
`.d.ts` or public `.js` JSDoc must be applied, in the same pull request, to all three
wrappers**.

This file applies to the public API surface: the `.d.ts` files in `js/ui/**` and
`js/viz/**`, and the public `.js` entry files next to them. Those `.js` files contain only
re-exports and JSDoc blocks such as `@name dxTabsOptions.activeStateEnabled` + `@hidden`,
which also decide the wrapper surface. Use this file both when editing the API and when
reviewing an API change.

## What counts as a wrapper-affecting change

A change to any of the following in a component's options interface (e.g. `dxButtonOptions`,
its `Properties` alias, or a nested option type such as `dxDataGridColumn`) affects the
wrappers:

- **Options** — a property added, removed, renamed, or retyped on the options interface.
- **Events** — an `onX` callback added, removed, renamed, or whose event type changed.
- **Event types** — a `*Event` type (e.g. `ClickEvent`) whose shape changed.
- **Nested option types** — a collection/object option type (e.g. `columns`, `items`,
  `toolbar`) added, removed, renamed, or restructured.
- **Template options** — a `template` option added or removed.
- **Visibility** — an option or nested field hidden or un-hidden: `@hidden` added or removed
  (including `@hidden false`) in a `.d.ts`, **or** in a `@name <Interface>.<option>` block
  of the widget's or a base class's `.js` file (e.g. `ui/tabs.js`, `ui/editor/editor.js`,
  `ui/widget/ui.widget.js`). A base-class change affects **every** widget that inherits
  the option.
- **Wrapper-relevant JSDoc tags** — the templates read these, so changing them changes the
  wrappers:
  - `@type` (overrides the TS type);
  - `@fires` (two-way binding in React/Angular);
  - `@type_function_param1 e:{module:XEvent}` (narrowed/typed events);
  - `@docid` (Angular doc IDs);
  - `@deprecated` on an option;
  - `@isEditor` (Vue `model`);
  - `@hasTranscludedContent` (Angular `<ng-content>`).

Purely internal changes do **not** require a wrapper change: implementation in
`js/__internal/**`, changes to the import/re-export lines of a public `.js` file, and JSDoc
edits that touch only descriptions or other tags not listed above.

## Where each change lands in the wrappers

| Public API element | Angular | React | Vue |
|---|---|---|---|
| Option `foo?: T` | `@Input() get foo()/set foo()` in `ui/<comp>/index.ts`, plus `@Output() fooChange` and a `{ emit: 'fooChange' }` entry | **nothing** for an ordinary option: it arrives through `Properties`. Only if it is two-way bindable (`@fires`): `defaultFoo`/`onFooChange` in the `& { … }` block of `IXOptions` plus `subscribableOptions`/`defaults` entries; see [template README](../templates/wrapper-react/README.md) §4 | entry in `props` (correct runtime type + `PropType<T>`) and `emits` `update:foo` |
| Event `onX?: (e: XEvent) => void` | `@Output() onX: EventEmitter<XEvent>` + `{ subscribe, emit }` entry | entry in `independentEvents` (unless the name contains `Changed` without `Value`, e.g. `onOptionChanged`) + narrowed field in `IXOptionsNarrowedEvents` if its JSDoc is `e:{module:XEvent}`; see [template README](../templates/wrapper-react/README.md) §2–§3 | `onX` prop typed `Function as PropType<(e: XEvent) => void>` |
| Nested option type | the component's own `ui/<component>/nested/*` files; do **not** edit the shared `ui/nested/**` (deprecated, removed in a parallel PR) | `NestedOption` config component | configuration component via `prepareConfigurationComponentConfig` |
| Template option | template input | entry in `templateProps` plus `<x>Render`/`<x>Component` fields in `IXOptions`; see [template README](../templates/wrapper-react/README.md) §5 | `template` prop |

The per-framework anatomy and rules live in
[wrapper-angular.instructions.md](./wrapper-angular.instructions.md),
[wrapper-react.instructions.md](./wrapper-react.instructions.md), and
[wrapper-vue.instructions.md](./wrapper-vue.instructions.md).

## Reviewer checklist

When a PR changes a wrapped component's public `.d.ts`, or a wrapper-relevant JSDoc block in
a public `.js` file (see "What counts"), verify and comment inline if any is missing:

1. **Completeness** — every added, removed, or renamed option/event is reflected in
   **all three** wrappers (`devextreme-angular/src`, `devextreme-react/src`,
   `devextreme-vue/src`), as the table above requires. A change present in one or two
   wrappers but not the third is a defect — flag the missing wrapper(s) by name.
   This includes visibility changes made only in a `.js` file (see "What counts"): check
   the widget and all widgets that inherit from a changed base class.
   Exception: an ordinary React option (not two-way bindable, not a template, not an event,
   not nested) needs **no** React change, because it arrives through `Properties`.
2. **Type fidelity** — the wrapper carries the same type as the API (including union
   members, generics, and the correct Vue runtime type + `PropType`).
3. **Breaking changes** — explicitly label these as **breaking** in a review comment:
   - an option or event **removed** or **renamed**, including one newly `@hidden` in a
     `.d.ts` or `.js` file (it disappears from all three wrappers);
   - an option/event **type narrowed** or otherwise changed incompatibly;
   - a nested option type removed or restructured.
   Confirm the wrappers reflect the same removal/rename so they stay in sync; do not let a
   breaking API change land with stale wrapper surface.

Only comment on the wrappers and the API contract. Do not propose regenerating the wrappers
or restoring the metadata pipeline — that workflow is retired.
