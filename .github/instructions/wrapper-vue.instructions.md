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

## Component file anatomy (`<component>.ts`)

The widget's `Properties` type (alias of `dx<Widget>Options`) is the source of truth.

1. **Imports** — `PropType` and `defineComponent` from `vue`, `prepareComponentConfig` from
   `./core/index`, the default widget import and `Properties`
   (`import Button, { Properties } from "devextreme/ui/button"`), the event types from
   `devextreme/ui/<widget>`, and any enum/union types from `devextreme/common`.
2. **`AccessibleOptions`** — `Pick<Properties, "opt1" | "opt2" | …>` listing every exposed
   option and event, followed by `interface Dx<Name> extends AccessibleOptions { readonly instance?: <Widget>; }`.
3. **`componentConfig`** object:
   - **`props`** — one entry per option, mapped to the Vue runtime type:
     - `string` → `String`; `boolean` → `Boolean`; `number` → `Number`;
     - `number | string` → `[Number, String]`; object → `Object as PropType<T>`;
     - union/enum → `String as PropType<ButtonType | string>`;
     - callback → `Function as PropType<((e: XEvent) => void)>`;
     - `template` → `{}`.
   - **`emits`** — `"update:<prop>": null` for **every** prop (plus widget read-only
     subscribable options such as `"update:isActive"`), enabling `v-model:prop`.
   - **`computed.instance`** returning `(this as any).$_instance`.
   - **`beforeCreate`** setting `$_WidgetClass = <Widget>` and `$_hasAsyncTemplate = true`
     (when the widget has templates).
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
