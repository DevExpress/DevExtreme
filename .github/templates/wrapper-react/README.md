# React wrapper template

[`component.ts.tmpl`](./component.ts.tmpl) is the full layout of a
`packages/devextreme-react/src/<name>.ts` file, as the retired `devextreme-internal-tools`
generator produced it. The rules below are that generator's rules. Fill the template from the
component's `.d.ts`; don't reverse-engineer them from other wrappers.

**Budget:** read the component's `.d.ts` (and, when needed, the base `.d.ts` files it
extends) and this folder. You don't need to open other wrappers. If a case is unclear, open
**one** reference from §10. Never open `data-grid.ts`, `tree-list.ts`, `card-view.ts`,
`chart.ts`, etc. They are thousands of lines long and add no rules.

## 0. Steps

1. Collect the facts listed in §1–§7 from `packages/devextreme/js/<module>.d.ts`.
2. Copy `component.ts.tmpl` to `packages/devextreme-react/src/<kebab-name>.ts`. Resolve the
   `//#if` / `//#each` directives, replace the `__PLACEHOLDERS__`, and delete every `//#`
   line.
3. Register it in `packages/devextreme-react/src/index.ts`:
   `export { <Name> } from "./<kebab-name>";`, in alphabetical order. Nothing else needs to
   be registered.
4. Verify (§9).

The file name is the kebab-case component name: `TabPanel` becomes `tab-panel.ts`, and
`dxDateRangeBox` becomes `date-range-box.ts`. `__module__` is the `.d.ts` path under
`js/` without the extension, for example `ui/tab_panel` or `viz/bullet`.

## 1. Collect: options interface

Use the `Properties` alias from the module. Include everything it inherits
(`WidgetOptions`, `EditorOptions`, `CollectionWidgetOptions`, `dxOverlayOptions`, …) in each
check below.

| Fact | Where it comes from |
|---|---|
| **GENERIC** | `Properties` has type parameters, e.g. `Properties<TItem, TKey>`. Then `__TP__ = <TItem, TKey>` and `__TPD__ = <TItem = any, TKey = any>` (use the same parameter names). Otherwise both are empty. |
| `export { ExplicitTypes }` | **Only if GENERIC.** A non-generic component doesn't get this line, even if its `.d.ts` exports `ExplicitTypes`. |
| **PORTAL** | Widget is one of `dxLoadPanel`, `dxOverlay`, `dxPopover`, `dxPopup`, `dxToast`, `dxTooltip`, `dxValidationMessage`. |
| **RAF** | Widget is one of `dxChart`, `dxDateBox`, `dxDataGrid`, `dxFilterBuilder`. |
| **EXTENSION** | The component attaches to another widget instead of rendering its own element. Today only `dxValidator` does this. |

For a new component, PORTAL, RAF and EXTENSION are normally all false.

## 2. `independentEvents`

This is every option (own or inherited) that meets **all** of these conditions:

- its name starts with `on`;
- its type contains a function;
- its name does **not** contain `Changed`, unless it also contains `Value`.

So `onValueChanged` and `onSelectAllValueChanged` are included. `onOptionChanged`,
`onSelectionChanged` and `onFocusedRowChanged` are **excluded**.

Sort alphabetically and render as `["onA","onB"]`, with no spaces after the commas. Every
widget has at least `"onDisposing","onInitialized"`, and usually also `"onContentReady"`.

## 3. Narrowed events

A narrowed event is an event from §2 whose JSDoc names an exported event type with braces:

```ts
/**
 * @type_function_param1 e:{ui/button:ClickEvent}     ← braces = narrowed
 */
onClick?: ((e: ClickEvent) => void) | undefined;
```

`@type_function_param1 e:object` means the event is not narrowed. This is why `popup.ts`
has no narrowed events. For inherited `onContentReady`/`onDisposing`/`onInitialized`, the
`{…}` annotations are in the module's `/// #DEBUG` `type Events = { … }` block.

To write each line of `I<Name>OptionsNarrowedEvents`:

- Keep only the function member of the declared type, with the parameter name used in the
  JSDoc (`validatedInfo` for `onValidated`, otherwise `e`).
- The declaration that decides this is the one next to the `{…}` annotation: the options
  interface for the component's own events, or the module's `Events` block for inherited
  events. Never use the base declarations in `WidgetOptions`, `DOMComponentOptions` or
  `ComponentOptions`. In practice, `onContentReady`, `onDisposing`, `onInitialized` and
  `onOptionChanged` never get `| undefined`.
- If that declaration contains `| undefined`, add `| undefined`. Drop `| string`, `| null`
  and any other member.
- For a GENERIC component, pass the type arguments: `((e: ItemClickEvent<TItem, TKey>) => void)`.

```ts
onClick?: ((e: ClickEvent) => void) | undefined;                              // declared `| undefined`
onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);                    // declared `| string | null`
onValidated?: ((validatedInfo: ValidatedEvent) => void);
```

Sort alphabetically. If there are no narrowed events, NARROWED is false: drop
`ReplaceFieldTypes` and the `…NarrowedEvents` type, and use `Properties__TP__` directly.

For a new component, its `.d.ts` should export `ContentReadyEvent`, `DisposingEvent`,
`InitializedEvent` and `OptionChangedEvent`, like every other widget does, and annotate them
in the `Events` block. Otherwise `onDisposing` and `onInitialized` stay un-narrowed.

## 4. Subscribable (two-way) options

An option is subscribable when its JSDoc has `@fires …`. Inherited ones count too:

| Base | Subscribable options |
|---|---|
| `EditorOptions` | `value` |
| `CollectionWidgetOptions` | `items`, `selectedIndex`, `selectedItem`, `selectedItemKeys`, `selectedItems` |
| `dxOverlayOptions` | `position`, `visible` (and in `dxPopup`, also `height`, `width`) |
| `dxDropDownEditorOptions` | `opened` |

`@fires` is inherited. Re-declaring an option in a subclass (e.g. `value?: string` in
`dxTextBoxOptions`) does **not** cancel it. An option stops being subscribable only when the
component no longer exposes it publicly, either because it is `Omit`ted or because it is
`@hidden`. For example, `dxList` doesn't expose `selectedIndex` or `selectedItem`, so it
keeps only `items`, `selectedItemKeys` and `selectedItems`.

- **ROOT_SUBSCRIBABLE** covers the component's own top-level subscribable options. Each one
  generates `default<Opt>?: T` and `on<Opt>Change?: (value: T) => void` in the `& { … }`
  block: all `default*` lines first, then all `on*Change` lines. It also generates a
  `default<Opt>: "<opt>"` entry in `defaults`.
- **SUBSCRIBABLE** (the `subscribableOptions` array) covers the root options, plus
  `"<nestedOption>.<field>"` for each subscribable field of a **non-collection** nested
  option. Skip nested options whose name ends in `Options` (`searchEditorOptions`,
  `dropDownOptions`, …). Their subscribable fields go only into that nested component's
  `DefaultsProps` (§6).
- `T` is the option's type, written using the rules in §6.3. Use the most derived
  declaration (`value?: string` in `dxTextBoxOptions` gives `string`, not the base `any`).
  For example, `items` has JSDoc `@type Array<string | dxTabsItem | any>`, so `T` is
  `Array<any | dxTabsItem | string>`, and `position` gives
  `(() => void) | PositionAlignment | PositionConfig`.

Sort alphabetically.

## 5. Templates

Each option whose name ends in `Template`, or is exactly `template`, and whose type includes
`template` from `devextreme/common` gets:

| `tmplOption` | `render` | `component` |
|---|---|---|
| `template` | `render` | `component` |
| `itemTemplate` | `itemRender` | `itemComponent` |
| `contentTemplate` | `contentRender` | `contentComponent` |

Rule: replace the trailing `Template` with `Render`/`Component`, and lower-case the first
letter. The same rule applies to template fields inside nested option types (§6).

## 6. Nested option components

### 6.1 What becomes a nested component

A nested component is an option (at root level or inside another nested type) whose type is,
or is an array of, a **documented object type**. That means an interface or type literal
whose fields carry `@docid`, such as `dxTabsItem`, `PositionConfig`, `AnimationConfig`,
`Font`, `Format`, `dxButtonOptions`, or a local `SkeletonComplexType`. Apply this
recursively to the fields of that type.

Check the JSDoc `@type` first. A generic collection is typed `items?: Array<TItem>` in
TypeScript, and its item type appears only in the JSDoc, e.g.
`@type Array<string | dxTabsItem | any>`. That `dxTabsItem` is what makes `Item` a nested
component. In the same way, `@type dxButtonOptions | undefined` makes `options` a nested
component.

These are **not** nested components: primitives, enums/string unions, functions, `any`,
`Record<string, any>`, `DataSource`/`Store` types, `UserDefinedElement`, and template types.

If the component has none, NESTED is false. Then drop `NestedComponentMeta`, `NestedOption`
and all nested blocks.

### 6.2 Naming

- Non-array option: `PascalCase(optionName)`. For example, `position` becomes `Position`,
  `rootComplexOption` becomes `RootComplexOption`, and `searchEditorOptions` becomes
  `SearchEditorOptions`.
- Array option (**COLLECTION_ITEM**): the singular form. For example, `items` becomes `Item`,
  `buttons` becomes `Button`, and `toolbarItems` becomes `ToolbarItem`.
- The same option name with the same type under several parents is **one** component. It
  lists all parents under `// owners:`. For example, `Position` is owned by `From`, `To` and
  `Popup`.
- The same option name with a **different** type under different parents needs a parent
  prefix: `GroupLabel`, `TileLabel`, `TooltipBorder`.

### 6.3 `I<Nested>Props` fields

- Fields can also be hidden in the **`.js`** files of the widget or of a base class
  (`js/ui/<module>.js`, `js/ui/widget/ui.widget.js`, …), by a
  JSDoc block such as `@name dxTabsItem.<field>` followed by `@hidden`. The same applies
  to root options (`@name dxTabsOptions.activeStateEnabled @hidden`), but root options
  reach React only through `Properties`. Leave those fields out.
- List **every** public field of the type, including inherited ones, sorted alphabetically.
  Every field is optional (`?:`), even if it is required in the `.d.ts`. `@hidden` fields
  and methods are left out.
- Each field's type is the `.d.ts` type, rewritten with these rules:
  - If the field has a JSDoc `@type`, use it instead of the TS type:
    `options?: dxButtonOptions | undefined`, not `ButtonProperties | undefined`.
  - Keep `| undefined` as declared.
  - Write `{ [key: string]: any }` and `object` as `Record<string, any>`.
  - Write DOM and element types (`DxElement`, `UserDefinedElement`, `HTMLElement`,
    `dxElement`, jQuery) as `any`. This keeps the imports small.
  - Replace `this` in inherited item types with the documented base item type, e.g.
    `CollectionWidgetItem` from `devextreme/ui/collection/ui.collection_widget.base`.
  - Drop generic arguments (`CollectionWidgetItem`, not `CollectionWidgetItem<TItem>`), or
    replace them with `any`.
  - Event fields (`onX`) in nested props follow §3, using **that type's** module: its
    narrowed event types, aliased per §8. `onOptionChanged` is included here, because
    nested props list all fields.
  - Template fields are written as `((<params>) => string | any) | template`. The parameter
    names and types come from the JSDoc `@type_function_param*` tags, with elements as
    `any`, e.g. `((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template`.
    Any signature compatible with the `.d.ts` type-checks.
- After the fields: for each subscribable field (`@fires`), add the pair
  `default<Field>?: T; on<Field>Change?: (value: T) => void;`. Then, for each template
  field, add `<x>Render?` and `<x>Component?`.

### 6.4 `expectedChildren` / `ExpectedChildren`

- The root `expectedChildren` holds one entry per **direct** nested child of the component.
  A nested block's `ExpectedChildren` holds one entry per direct child of that option.
- Key: the child component name with its first letter lower-cased (`toolbarItem`,
  `boundaryOffset`). The exception is §6.5 variants, which keep PascalCase keys
  (`RequiredRule`).
- Value: `{ optionName: "<option name in the parent>", isCollectionItem: <true if array> }`.
- Sort case-insensitively. The last entry has no trailing comma.

### 6.5 `PredefinedProps` (typed collection variants)

These apply when a collection accepts a discriminated union: `validationRules` via
`type`, or form `items` via `itemType`. There is one generic component (`ValidationRule`)
plus one component per variant (`RequiredRule`, `EmailRule`, …). Each variant has
`OptionName` set to the shared collection, `IsCollectionItem: true`, and
`PredefinedProps: { type: "required" }`. See `validator.ts`. This is rare in new
components.

## 7. Exports and footer

```ts
export default <Name>;
export {
  <Name>,
  I<Name>Options,
  <Name>Ref,
  <Nested>,          // for each nested component, alphabetical…
  I<Nested>Props     // …followed by its props type; no comma after the last line
};
import type * as <Name>Types from 'devextreme/<module>_types';
export { <Name>Types };
```

Every wrapper has the `_types` re-export. The file ends with `export { <Name>Types };`
followed by **one empty line**, i.e. the file ends in `\n\n`.

Blank-line and comma conventions (the template already encodes them):

- `subscribableOptions` and `independentEvents` sit on consecutive lines, followed by one
  empty line.
- Entries in `defaults` and `templateProps` **keep** a trailing comma after the last item.
- Entries in `expectedChildren`, `ExpectedChildren`, `DefaultsProps` and `PredefinedProps`
  do **not**.
- `__TPD__` drops constraints on purpose: `<TItem = any, TKey = any>`, even though the
  `.d.ts` has `TItem extends ItemLike`.

## 8. Type imports

- There is one `import type { … } from "devextreme/<module>"` line per module that supplies
  a type **used in the file**: narrowed event types, types in `default*`/`on*Change`, and
  types in nested props. The component's own module comes first. Order within a line
  doesn't matter.
- Import from the public module path (`devextreme/common`, `devextreme/common/charts`,
  `devextreme/common/core/animation`, `devextreme/ui/<x>`). Never import from
  `__internal`.
- **Aliasing:** a type name must be aliased when it matches a nested component name in the
  file, or when the same name is imported from two modules. The alias prefix is the
  PascalCase last segment of the module path. The first import of a name keeps its name,
  unless it matches a nested component name. The component's own imports
  (`Properties`, its event types) always keep their names.
  ```ts
  import type { ContentReadyEvent as ButtonContentReadyEvent } from "devextreme/ui/button"; // text-box.ts
  import type { Font as ChartsFont } from "devextreme/common/charts";                          // nested `Font` exists
  import type { Format as CommonFormat } from "devextreme/common";
  import type { Format as LocalizationFormat } from "devextreme/common/core/localization";
  ```

## 9. Verify

From `packages/devextreme-react`, type-check the package (about 10 s). This resolves
`devextreme/*` from `../devextreme/artifacts/npm/devextreme`, so the new `.d.ts` must be
built first. The developer's `pnpm run dev` build does this; ask them to confirm it
finished.

```bash
../../node_modules/.bin/tsc --noEmit -p tsconfig.json
```

Check that there are no leftover `__` placeholders and no `//#` lines:

```bash
grep -nE "__[A-Za-z_]+__|^//#" src/<name>.ts
```

## 10. Reference wrappers (open at most one, only if unsure)

| Case | File | Lines |
|---|---|---|
| Minimal widget | `load-indicator.ts` | 62 |
| `template` option | `button.ts` | 75 |
| Subscribable `value`, nested collection, nested `*Options`, type alias | `text-box.ts` | 169 |
| GENERIC collection widget, `itemTemplate`, `items` | `tabs.ts` | 146 |
| PORTAL, no narrowed events, deep nesting, multiple owners | `popup.ts` | 452 |
| EXTENSION, PredefinedProps variants | `validator.ts` | 392 |
| Viz widget (Font/Format/Border nesting, aliases) | `bullet.ts` | 282 |

## 11. Known mistakes

- Adding `export { ExplicitTypes }` to a non-generic component (seen in the `skeleton.ts`
  trial).
- Leaving out inherited events (`onDisposing`, `onInitialized`) from `independentEvents`.
- Adding `onOptionChanged` or `onSelectionChanged` to `independentEvents` or to the narrowed
  events.
- Writing `required` fields in nested props. They are all optional.
- Putting a nested `*Options` component's subscribable fields into the root
  `subscribableOptions`.
- Forgetting `index.ts`, or losing its alphabetical order.
