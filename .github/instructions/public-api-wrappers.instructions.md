---
applyTo: "**/packages/devextreme/js/{ui,viz}/**/*.d.ts"
---

# Public API changes must be propagated to the framework wrappers

The Angular, React, and Vue wrappers are **no longer regenerated** from
`devextreme-metadata` / `devextreme-internal-tools`. They are maintained by hand (with the
help of local AI agents). This means **every public API change in a wrapped component's
`.d.ts` must be applied, in the same pull request, to all three wrappers**.

This file applies to the public API surface (`js/ui/**/*.d.ts`, `js/viz/**/*.d.ts`). Use it
both when editing the API and when reviewing an API change.

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

Purely internal changes (implementation in `js/__internal/**`, JSDoc-only edits that do not
change types or names) do **not** require a wrapper change.

## Where each change lands in the wrappers

| Public API element | Angular | React | Vue |
|---|---|---|---|
| Option `foo?: T` | `@Input() get foo()/set foo()` in `ui/<comp>/index.ts` | field in the component's options type (`IXOptions`) | entry in `props` (correct runtime type + `PropType<T>`) and `emits` `update:foo` |
| Event `onX?: (e: XEvent) => void` | `@Output() onX: EventEmitter<XEvent>` + `{ subscribe, emit }` entry | narrowed field in `IXOptionsNarrowedEvents` + entry in `independentEvents` | `onX` prop typed `Function as PropType<(e: XEvent) => void>` |
| Nested option type | do **not** edit `ui/nested/**` (deprecated, removed in a parallel PR) | `NestedOption` config component | configuration component via `prepareConfigurationComponentConfig` |
| Template option | template input | entry in `templateProps` | `template` prop |

The per-framework anatomy and rules live in
[wrapper-angular.instructions.md](./wrapper-angular.instructions.md),
[wrapper-react.instructions.md](./wrapper-react.instructions.md), and
[wrapper-vue.instructions.md](./wrapper-vue.instructions.md).

## Reviewer checklist

When a PR changes a wrapped component's public `.d.ts`, verify and comment inline if any is
missing:

1. **Completeness** — every added, removed, or renamed option/event is reflected in
   **all three** wrappers (`devextreme-angular/src`, `devextreme-react/src`,
   `devextreme-vue/src`). A change present in one or two wrappers but not the third is a
   defect — flag the missing wrapper(s) by name.
2. **Type fidelity** — the wrapper carries the same type as the API (including union
   members, generics, and the correct Vue runtime type + `PropType`).
3. **Breaking changes** — explicitly label these as **breaking** in a review comment:
   - an option or event **removed** or **renamed**;
   - an option/event **type narrowed** or otherwise changed incompatibly;
   - a nested option type removed or restructured.
   Confirm the wrappers reflect the same removal/rename so they stay in sync; do not let a
   breaking API change land with stale wrapper surface.

Only comment on the wrappers and the API contract. Do not propose regenerating the wrappers
or restoring the metadata pipeline — that workflow is retired.
