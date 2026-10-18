---
applyTo: "**/packages/devextreme-vue/src/**"
---

# Maintaining the DevExtreme Vue wrapper by hand

The files under `packages/devextreme-vue/src/` are **no longer generated**. Edit them
directly to keep them in sync with the public API in
`packages/devextreme/js/{ui,viz}/**/*.d.ts`. See
[public-api-wrappers.instructions.md](./public-api-wrappers.instructions.md) for when a
wrapper change is required and what the reviewer checks.

## Do not edit

- `packages/devextreme-vue/src/core/**` — hand-written base
  (`prepareComponentConfig`, `prepareConfigurationComponentConfig`, component/config
  helpers). Never change these for a single component.

## Adding a new component

Use the template at
[`.github/templates/wrapper-vue/`](../templates/wrapper-vue/README.md). Fill
`component.ts.tmpl` from the component's `.d.ts` by following the README's rules. They are
the exact rules of the retired generator: which options become props, how their runtime
types are mapped to `PropType`, what becomes a configuration component, and how imports are
aliased. You don't need to read other wrappers. Never open the large ones (`data-grid.ts`,
`tree-list.ts`, `card-view.ts`, `chart.ts`) to learn the pattern.

Files to create and register (keep every list alphabetical):

- `packages/devextreme-vue/src/<name>.ts` — the component (see anatomy below), including any
  configuration components in the same file.
- `packages/devextreme-vue/src/index.ts` — add `export { Dx<Name> } from "./<name>";`.

## Component file anatomy (`<component>.ts`)

The widget's `Properties` type (alias of `dx<Widget>Options`) is the source of truth.

1. **Imports** — `PropType` and `defineComponent` from `vue`, `prepareComponentConfig` from
   `./core/index`, the default widget import and `Properties`
   (`import Button, { Properties } from "devextreme/ui/button"`), the event types from
   `devextreme/ui/<widget>`, and any enum/union types from `devextreme/common`.
2. **`AccessibleOptions`** — `Pick<Properties, "opt1" | "opt2" | …>` listing every exposed
   option and event, followed by `interface Dx<Name> extends AccessibleOptions { readonly instance?: <Widget>; }`.
3. **`componentConfig`** object:
   - **`props`**: one entry per option. Each **member** of the option's type union maps to
     its own runtime constructor, and the prop lists all of them. See template README §2 for
     ordering and the exact `PropType` rules.
     - `string`, a string-literal union, or a string alias (`LabelMode`, `ButtonType`)
       → `String`. Only a union whose members are **all** string-valued becomes a single
       `String`: `type: String as PropType<ButtonType | string>`.
     - `number` → `Number`, `boolean` → `Boolean`, array → `Array`, function → `Function`,
       object/interface → `Object`. `null` and `undefined` are dropped.
     - Mixed unions give one constructor per member kind:
       `height: [Number, String]`,
       `position: [Function, String, Object] as PropType<…>`,
       `dataSource: [Array, Object, String] as PropType<…>`.
     - Add `as PropType<…>` unless the TS members are exactly the plain primitives
       (`hint: String`, `height: [Number, String]`). A documented object type also gets
       `| Record<string, any>` at the end:
       `options: Object as PropType<dxButtonOptions | Record<string, any>>`.
     - Events → `Function as PropType<((e: XEvent) => void)>`.
     - A top-level `any`, a template, or an element type → `{}`.
   - **`emits`**: `"update:isActive": null` and `"update:hoveredElement": null` first, then
     `"update:<prop>": null` for **every** prop. This enables `v-model:prop`.
   - **`computed.instance`** returning `(this as any).$_instance`.
   - **`beforeCreate`** setting `$_WidgetClass = <Widget>` and `$_hasAsyncTemplate = true`
     (always; only DataGrid, Scheduler and TreeList use `false`).
4. **`prepareComponentConfig(componentConfig);`** then
   `const Dx<Name> = defineComponent(componentConfig);`.
5. **Exports** — `export default Dx<Name>;`, `export { Dx<Name> };`, then
   `import type * as Dx<Name>Types from "devextreme/ui/<widget>_types"; export { Dx<Name>Types };`.

## Nested option components (configuration components)

Nested/object options are separate configuration components whose config is finalized with
`prepareConfigurationComponentConfig(...)` (instead of `prepareComponentConfig`). Each
declares its own `props`/`emits` and identifies its parent option name; collection options
are marked as such in the base config. Keep these in sync with the nested option types.

## Applying an API change

- **Option added** → add it to `AccessibleOptions`, to `props` (with the correct runtime
  type + `PropType`), and add `"update:<prop>": null` to `emits`.
- **Option removed/renamed** → remove/rename it in all three places.
- **Event added/removed/renamed** → update `AccessibleOptions`, the `props` entry
  (`Function as PropType<...>`), and the `emits` entry.
- **Nested option added/changed** → add/update the configuration component and the parent's
  wiring.
- **Type change** → update the event/enum type imports and the `PropType<...>` to match.
