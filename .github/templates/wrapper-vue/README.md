# Vue wrapper template

[`component.ts.tmpl`](./component.ts.tmpl) is the full layout of a
`packages/devextreme-vue/src/<name>.ts` file, as the retired `devextreme-internal-tools`
Vue generator produced it. The rules below are that generator's rules. Fill the template
from the component's `.d.ts`; don't reverse-engineer them from other wrappers.

**Budget:** read the component's `.d.ts` (and, when needed, the base `.d.ts` files it
extends) and this folder. You don't need to open other wrappers. If a case is unclear, open
**one** reference from §8. Never open `data-grid.ts`, `tree-list.ts`, `card-view.ts`,
`chart.ts`, etc.

The Vue wrapper is simpler than the React one. **Every** public option, events included,
becomes a prop and an `update:` emit. There are no independent, narrowed or subscribable
lists and no templates metadata.

## 0. Steps

1. Collect the props (§1), their runtime types (§2) and the nested components (§5) from
   `packages/devextreme/js/<module>.d.ts`.
2. Copy `component.ts.tmpl` to `packages/devextreme-vue/src/<kebab-name>.ts`. Resolve the
   `//#if` / `//#each` directives, replace the `__PLACEHOLDERS__`, and delete every `//#`
   line.
3. Register it in `packages/devextreme-vue/src/index.ts`:
   `export { Dx<Name> } from "./<kebab-name>";`, in alphabetical order. Nothing else needs to
   be registered.
4. Verify (§7).

Names: the file is `tab-panel.ts`, the widget default import is `TabPanel`, the component
is `DxTabPanel`, and `__module__` is `ui/tab_panel`.

## 1. Props: which options

Include every option of `Properties`, own and inherited (`WidgetOptions`, `EditorOptions`,
`CollectionWidgetOptions`, …), with these exceptions:

- Leave out `@hidden` options and options removed with `Omit`. `@hidden` is decided **per
  option**, by its most-derived declaration: `DOMComponentOptions` is `@hidden` as an
  interface, but its fields are public. The most-derived declaration also decides the type
  (`value?: string` in `dxTextBoxOptions`, not the base `any`).
- **Also check the widget's `.js` file** (`js/ui/<module>.js`). It can hide inherited
  options with JSDoc blocks such as `@name dxTabsOptions.activeStateEnabled` followed by
  `@hidden`, so Tabs has no `activeStateEnabled` prop. The same applies to nested types
  (`@name dxTabsItem.<field>`).
- `readonly` / `@readonly` options (`isDirty`, `text`) are **included**.
- Leave out the option named `key` (reserved in Vue).
- **Include** all `onX` events, including `onOptionChanged` and `onSelectionChanged`. This
  differs from React.
- **Include** template options (`template`, `itemTemplate`, …) and nested object/array
  options (`items`, `position`, …).

Sort alphabetically, ignoring case: `items` comes before `itemTemplate`. Use the same
order in `AccessibleOptions`, `props` and `emits`.

## 2. Prop runtime type

The prop value is `JsTypes` or `JsTypes as PropType<TsTypes>`. Check the JSDoc `@type`
first: when it is present it overrides the TS type, just as in React. For example,
`items` has `@type Array<string | dxTabsItem | any>`.

**Step 1: JS constructors.** Map each member of the type union:

| Member | JS |
|---|---|
| `string`, string-literal union, or a type alias of strings (`LabelMode`, `ButtonType`, `Position`, …) | `String` |
| `number` | `Number` |
| `boolean` | `Boolean` |
| `Date` / `RegExp` | `Date` / `RegExp` |
| `Array<…>` / `T[]` | `Array` |
| function type | `Function` |
| interface, object literal, `Record<…>`, widget options (`dxButtonOptions`), `PositionConfig`, … | `Object` |
| `DataSource` (default import from `devextreme/data/data_source`), `DataSourceOptions` (`devextreme/common/data`), `Store` (`devextreme/data/store`) | `Object` |
| `null`, `undefined` | *(dropped)* |
| **top-level** `any`, `unknown`, `template`, `UserDefinedElement`/`DxElement`, a bare type param (`TItem`) | the whole prop becomes **`{}`** |

An `any` **inside** a generic (`Array<any | dxTabsItem | string>`) doesn't count; it stays
as written.

**Ordering, for both lists:** first sort the TS members case-insensitively. That applies
inside `Array<…>` too, so `@type Array<string | dxTabsItem | any>` becomes
`Array<any | dxTabsItem | string>`. Then write the JS constructors in the order of those
sorted members, with duplicates removed. One constructor is written as `String`; several
are written as `[Number, String]`:

- `string | number | null` becomes `[Number, String] as PropType<null | number | string>`.
- `PositionAlignment | PositionConfig | Function` becomes
  `[Function, String, Object] as PropType<((() => void)) | PositionAlignment | PositionConfig | Record<string, any>>`.

A bare `Function` is written as `(() => void)`. Generic params inside function types
become `any`: `keyExpr` gives `(((item: any) => any))`.

**Step 2: PropType.** Add `as PropType<…>` **unless** the TS members, after dropping
`undefined`, are exactly the same primitives as the JS list. For example,
`hint?: string | undefined` becomes `String`, and `height?: number | string` becomes
`[Number, String]`.

- The TS members keep `null` and drop only `undefined`.
- Type args of the component's own generics are dropped from event and item types
  (`ItemClickEvent`, not `ItemClickEvent<TItem, TKey>`). For widget-options types they
  become `<any>` (`dxTextBoxOptions<any>`).
- If any member is an object type with documented fields (`PositionConfig`,
  `dxButtonOptions`, `DataSourceOptions`, …), append `| Record<string, any>` **at the very
  end, after sorting**: `Object as PropType<PositionConfig | Record<string, any>>`. An
  inline object literal becomes just `Object as PropType<Record<string, any>>`.
- When there are several members, wrap any member whose top level contains `=>` or `|` in
  parentheses. This includes an already-parenthesized function, which gets doubled
  parentheses: `((() => void))`, `(Array<…>)`.

**Events** always use the function member only, with the component's own named event type,
even when the declaration also allows `| string | null`:

```ts
onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
```

Examples:

```ts
accessKey: String,                                                   // string | undefined
height: [Number, String],                                            // number | string | undefined
maxLength: [Number, String] as PropType<null | number | string>,
labelMode: String as PropType<LabelMode>,
type: String as PropType<ButtonType | string>,
elementAttr: Object as PropType<Record<string, any>>,                // { [key: string]: any }
buttons: Array as PropType<Array<string | TextBoxPredefinedButton | TextEditorButton>>,
validationErrors: Array as PropType<Array<any> | null>,
options: Object as PropType<dxButtonOptions | Record<string, any>>,  // @type dxButtonOptions | undefined
position: [Function, String, Object] as PropType<((() => void)) | PositionAlignment | PositionConfig | Record<string, any>>,
template: {},                                                        // template
selectedItem: {},                                                    // TItem | null
inputAttr: {},                                                       // any
dataSource: [Array, Object, String] as PropType<(Array<any | dxTabsItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
items: Array as PropType<Array<any | dxTabsItem | string>>,          // @type Array<string | dxTabsItem | any>
```

The event types used here come from the `/// #DEBUG` `Events` block and the
`@type_function_param1 e:{ui/x:YEvent}` tags. Exported event types with no matching option
(e.g. `KeyPressEvent`) are ignored. Events in a **nested** component use the event types
of that nested type's own module, aliased per §3 (for example, `DxOptions` uses the
button module's types).

## 3. Imports

The fixed header is `PropType`, `defineComponent`, `prepareComponentConfig` (or
`prepareExtensionComponentConfig` for EXTENSION), and `import <Name>, { Properties }`. After
that come the type imports for every named type used in any `PropType<…>`, root or nested:

- **Default imports** come first, e.g. `DataSource` from `devextreme/data/data_source`.
  Write them as `import  DataSource from "…";`, with **two** spaces after `import`.
- **Named imports** follow: one block per module, one type per line, each line starting
  with a single space and ending with `,`:
  ```ts
  import {
   TextBoxType,
   ChangeEvent,
  } from "devextreme/ui/text_box";
  ```
  Order the blocks, and the names inside each block, by first use: walk the root props A→Z,
  then the nested components A→Z, field by field. The order doesn't affect behavior.
- Import each type from the module that **declares** it, not from a module that
  re-exports it. For example, `LabelMode`, `ButtonType` and `TabsStyle` come from
  `devextreme/common`, even though `ui/text_box` or `ui/tabs` also re-export them.
  Imported-but-local types such as `dxTabsItem` or `TextBoxType` come from the component's
  module. This import block is separate from the header `import <Name>, { Properties }`
  line.
- Import from public module paths only (`devextreme/common`, `devextreme/common/data`,
  `devextreme/data/store`, `devextreme/ui/<x>`, …). Never import from `__internal`.
- **Aliasing** is decided per type name: you only alias a name when that same name is
  imported from a **second** module. The
  first module keeps the plain name. Later ones get the PascalCase last path segment as a
  prefix: `ContentReadyEvent as ButtonContentReadyEvent` from `devextreme/ui/button`. Vue
  component names start with `Dx`, so they never collide with type names. This differs
  from React.
- `import { prepareConfigurationComponentConfig } from "./core/index";` is the last import,
  and only when NESTED.

## 4. Flags

| Flag | Rule |
|---|---|
| GENERIC | `Properties` has type params. This only adds `export { ExplicitTypes } from "devextreme/<module>";` as the first line. Don't add it to non-generic components. `AccessibleOptions`/`Dx<Name>` stay non-generic. |
| EDITOR | The widget class JSDoc has `@isEditor` (`dxTextBox`, `dxCheckBox`, `dxSwitch`, `dxDropDownBox`, …). Then add `model: { prop: "value", event: "update:value" },`. |
| SYNC_TMPL | Only `DxDataGrid`, `DxScheduler`, `DxTreeList` set `$_hasAsyncTemplate = false`. Every other component sets `true`, whether or not it has templates. |
| EXTENSION | Only `dxValidator`. It uses `prepareExtensionComponentConfig`. |

## 5. Nested configuration components

The nested components are the same ones the React wrapper has, with the same metadata. The
rules are repeated here so you don't have to read the React README.

### 5.1 What becomes nested

A nested component is an option, at root level or inside another nested type, whose type
(or JSDoc `@type`) is, or is an array of, a **documented object type**. That means an
interface or type literal whose fields have `@docid`, such as `dxTabsItem`,
`PositionConfig`, `AnimationConfig`, `Font`, `dxButtonOptions`, or `TextEditorButton`.
Apply this recursively.

These are **not** nested: primitives, enums, functions, `any`, `Record<string, any>`,
`DataSource`/`Store`, elements, and templates.

The option itself **also** stays a normal prop of its parent (e.g. `buttons: Array as
PropType<…>`).

### 5.2 Naming

- Non-array option: `Dx` + `PascalCase(optionName)`, e.g. `DxPosition`, `DxOptions`.
- Array option (COLLECTION_ITEM): the singular form, e.g. `DxItem`, `DxButton`,
  `DxToolbarItem`.
- The same option with the same type under several parents is **one** component.
- The same option name with a different type needs a parent prefix: `DxGroupLabel`,
  `DxTooltipBorder`.

### 5.3 Fields (props of the nested config)

- Include every public field of the nested type, including inherited ones, sorted
  alphabetically. Map each one with §2.
- Nested fields that are nested components themselves are included too. For example,
  `DxButton` has an `options` prop.
- Emits: `update:isActive`, `update:hoveredElement`, then `update:<field>` for every field.
- In nested configs, **`emits` comes before `props`**. At the root, `props` comes first.

### 5.4 `$_expectedChildren`

- The root lists its **direct** nested children in `beforeCreate`. A nested component lists
  its own direct children with `(DxX as any).$_expectedChildren = { … };`.
- Key: the component name without `Dx`, first letter lower-cased (`toolbarItem`,
  `boundaryOffset`). The exception is §5.5 variants, which keep PascalCase keys
  (`RequiredRule`).
- Value: `{ isCollectionItem: <bool>, optionName: "<option name in the parent>" }`. Note
  the key order: `isCollectionItem` comes first. This differs from React.
- Sort case-insensitively. The last entry has no trailing comma.

### 5.5 `$_predefinedProps`

These apply to typed collection variants: `validationRules` via `type`, and form `items`
via `itemType`. There is one generic component (`DxValidationRule`) plus one per variant
(`DxRequiredRule`, …). Each variant has the shared `$_optionName`,
`$_isCollectionItem = true`, and `$_predefinedProps = { type: "required" };`. This is rare
in new components.

## 6. Exports and footer

```ts
export default Dx<Name>;
export {
  Dx<Name>,
  Dx<Nested>,       // for each nested component, A→Z; no comma after the last line
};
import type * as Dx<Name>Types from "devextreme/<module>_types";
export { Dx<Name>Types };
```

Note the double quotes (React uses single quotes here). The file ends with a single `\n`.

## 7. Verify

From `packages/devextreme-vue`, type-check the package. This needs the built
`devextreme/artifacts`, so ask the developer to confirm their `pnpm run dev` build
finished.

```bash
../../node_modules/.bin/tsc --noEmit -p tsconfig.json
```

Check that there are no leftover placeholders or directives:

```bash
grep -nE "__[A-Za-z_]+__|^//#" src/<name>.ts
```

## 8. Reference wrappers (open at most one, only if unsure)

| Case | File | Lines |
|---|---|---|
| Minimal widget | `load-indicator.ts` | ~80 |
| EDITOR (`model`), nested collection + nested `*Options`, import alias | `text-box.ts` | ~340 |
| GENERIC collection, `items`, `DataSource` default import | `tabs.ts` | ~220 |
| Deep nesting, multiple owners | `popup.ts` | ~570 |
| EXTENSION, `$_predefinedProps` | `validator.ts` | ~430 |

## 9. Known mistakes

- Leaving out events (`onOptionChanged`, `onSelectionChanged`) or template options from
  props. Vue includes **everything**.
- Setting `$_hasAsyncTemplate` only "when the widget has templates". It is always `true`,
  except in DataGrid, Scheduler and TreeList.
- Putting `props` before `emits` in a nested config.
- Leaving out `update:isActive`/`update:hoveredElement`. They are the first two emits
  everywhere.
- Adding `export { ExplicitTypes }` to a non-generic component.
- Forgetting `model` for an `@isEditor` widget.
- Forgetting `index.ts`, or losing its alphabetical order.
