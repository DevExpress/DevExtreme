---
applyTo: "**/packages/devextreme-react/src/**"
---

# Maintaining the DevExtreme React wrapper by hand

The files under `packages/devextreme-react/src/` are **no longer generated**. Edit them
directly to keep them in sync with the public API in
`packages/devextreme/js/{ui,viz}/**/*.d.ts`. See
[public-api-wrappers.instructions.md](./public-api-wrappers.instructions.md) for when a
wrapper change is required and what the reviewer checks.

## Do not edit

- `packages/devextreme-react/src/core/**` — hand-written base
  (`Component as BaseComponent`, `NestedOption`, `NestedComponentMeta`, `IHtmlOptions`,
  `ComponentRef`). Never change these for a single component.

## Adding a new component

Use the template at
[`.github/templates/wrapper-react/`](../templates/wrapper-react/README.md). Fill
`component.ts.tmpl` from the component's `.d.ts` by following the README's rules. They are
the exact rules of the retired generator: which events are independent or narrowed, which
options are subscribable, what becomes a nested component, and how names and type aliases
are formed. You don't need to read other wrappers. Never open the large ones (`data-grid.ts`,
`tree-list.ts`, `card-view.ts`, `chart.ts`) to learn the pattern.

Files to create and register (keep every list alphabetical):

- `packages/devextreme-react/src/<name>.ts` — the component (see anatomy below), including any
  nested config components in the same file.
- `packages/devextreme-react/src/index.ts` — add `export { <Name> } from "./<name>";`.

## Component file anatomy (`<component>.ts`)

The widget's `Properties` type (alias of `dx<Widget>Options`) is the source of truth.

1. **`"use client"`** directive on line 1, then React imports (`memo`, `forwardRef`,
   `useImperativeHandle`, `useRef`, `useMemo`, …), the default widget import and its
   `Properties` (`import dxButton, { Properties } from "devextreme/ui/button"`), the base
   (`Component as BaseComponent`, `IHtmlOptions`, `ComponentRef`, and `NestedOption`/
   `NestedComponentMeta` if there are nested options), and `type` imports of the event types.
2. **`ReplaceFieldTypes`** helper (copied verbatim).
3. **`I<Name>OptionsNarrowedEvents`** — one field per `onX` event, typed
   `((e: XEvent) => void)`, so the wrapper exposes the concrete event type.
4. **`I<Name>Options`** — `React.PropsWithChildren<ReplaceFieldTypes<Properties,
   I<Name>OptionsNarrowedEvents> & IHtmlOptions & { render?...; component?... }>` (template
   props included only if the widget has a `template`).
5. **`<Name>Ref`** interface exposing `instance: () => dx<Widget>`.
6. **Component** — `memo(forwardRef((props, ref) => { … }))`. Inside:
   - `useImperativeHandle` returning `{ instance() { return baseRef.current?.getInstance(); } }`;
   - `useMemo` arrays describing widget behavior, each derived from the API:
     - `independentEvents` — the list of every `onX` event name;
     - `subscribableOptions` / `defaults` — for two-way–bindable options (`defaultX` maps to `x`);
     - `expectedChildren` — nested option components (`{ optionName, isCollectionItem }`);
     - `templateProps` — `{ tmplOption, render, component }` per `template` option;
   - `React.createElement(BaseComponent<…>, { WidgetClass: dx<Widget>, ref: baseRef, …arrays, ...props })`.
7. **Exports** — `export default <Name>;`, `export { <Name>, I<Name>Options, <Name>Ref };`,
   then `import type * as <Name>Types from 'devextreme/ui/<widget>_types'; export { <Name>Types };`.

## Nested option components (config components)

For each nested/object option, a config component is defined and exported:
```ts
const _componentColumn = (props: IColumnProps) =>
  React.createElement(NestedOption<IColumnProps>, {
    ...props,
    elementDescriptor: { OptionName: "columns", /* ExpectedChildren for deeper nesting */ },
  });
const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
  componentType: "option",
});
```
`OptionName` is the parent option; `isCollectionItem: true` (in the owner's
`expectedChildren`) marks array options.

## Applying an API change

- **Option added** → it flows in through `Properties`; add it to `subscribableOptions`/
  `defaults` only if it is two-way bindable, and to `templateProps` if it is a template.
- **Event added/removed/renamed** → update `I<Name>OptionsNarrowedEvents` and the
  `independentEvents` array.
- **Nested option added/changed** → add/update the `_component*` + `Object.assign` export and
  the owner's `expectedChildren` entry.
- **Type change** → the concrete event/enum type imports must be updated to match.
