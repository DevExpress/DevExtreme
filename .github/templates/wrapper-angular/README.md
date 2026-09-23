# Angular wrapper template

[`component.ts.tmpl`](./component.ts.tmpl) and [`nested.ts.tmpl`](./nested.ts.tmpl) are
the full layouts of `packages/devextreme-angular/src/ui/<path>/index.ts` and of each file in
`ui/<path>/nested/`, as the retired `devextreme-internal-tools` Angular generator produced
them. The rules below are that generator's rules. Fill the templates from the component's
`.d.ts`; don't reverse-engineer them from other wrappers.

**Budget:** read the component's `.d.ts` (and, when needed, the base `.d.ts` files it
extends) and this folder. You don't need to open other wrappers. If a case is unclear, open
**one** reference from §9. Never open `data-grid`, `tree-list`, `card-view`, `chart`, etc.

**Whitespace:** the generated files contain lines made of exactly four spaces, inside doc
comments and after some blocks. The templates contain them too. Copy them, and don't run a
"trim trailing whitespace" step on the output.

The Angular wrapper doesn't use the legacy shared `ui/nested/**` modules for new
components. That folder is deprecated and is being removed. Older components import from
it; don't copy that. Extension components (only `dxValidator`) are not covered here.

## 0. Steps and files

For a component `dxTabPanel` (`__Name__` = `TabPanel`, `__path__` = `tab-panel`,
`__module__` = `ui/tab_panel`):

1. `src/ui/<path>/index.ts`: from `component.ts.tmpl`.
2. `src/ui/<path>/ng-package.json`, exactly as below, with **no** trailing newline:
   ```
   {
     "lib": {
       "entryFile": "index.ts"
     }
   }
   ```
3. Only if there are nested components (§5):
   - `src/ui/<path>/nested/<file>.ts`: one file per nested component, from
     `nested.ts.tmpl`.
   - `src/ui/<path>/nested/index.ts`: one `export * from './<file>';` line per file, sorted
     by file name, followed by one empty line (the file ends in `\n\n`).
   - `src/ui/<path>/nested/ng-package.json`: same as step 2.
4. `src/index.ts`: add
   `export { Dx<Name>Component, Dx<Name>Module } from 'devextreme-angular/ui/<path>';`, in
   alphabetical order.
5. `src/ui/all.ts`: add
   `import { Dx<Name>Module } from 'devextreme-angular/ui/<path>';`, and add
   `Dx<Name>Module,` to **both** the `imports` and the `exports` array. Keep alphabetical
   order, anchoring on the neighbouring entries in each array.
6. **Tokens:** check whether each CO_PROPERTY (§5.5) has a
   `PROPERTY_TOKEN_<optionName>` in `src/core/tokens/index.ts`. If one doesn't, add
   `export const PROPERTY_TOKEN_<optionName> = new InjectionToken<string>('property-token-<optionName>');`.
   This file used to be generator output, and it is the only allowed edit under
   `src/core/`. Mention it to the developer.
7. Verify (§8).

The folder, the selector (`dx-<path>`) and the file names are all kebab-case. The widget
import is `Dx<Name>` (`import DxTabPanel from 'devextreme/ui/tab_panel'`).

## 1. Flags (`component.ts.tmpl`)

| Flag | Rule |
|---|---|
| GENERIC | `Properties` has type params. Type params on the widget **class** alone (`dxTextBox<TProperties>`) don't count. This adds `export type { ExplicitTypes }` and `<TItem = any, TKey = any>` on the class, and `instance: DxX<TItem, TKey>`. |
| EDITOR | The options (own or inherited) include **`onValueChanged`**. This is a different rule from Vue's `@isEditor`. It adds `ControlValueAccessor`, the `onBlur` output, the `HostListener`s and the `writeValue`/`register*` methods. |
| COLL | At least one COLLECTION PROPERTY (§3). |
| CO | At least one nested **collection-item** component (§5). CO implies COLL. |
| NESTED | At least one nested component. |
| TRANSCLUDED | The widget class JSDoc has `@hasTranscludedContent`. Then `template: '<ng-content></ng-content>'`. |
| VIZ | `__module__` starts with `viz/`. Then add the `styles` line. |
| NO_DISABLED | Only `dxRangeSelector`. It has no `setDisabledState`. |

`__IMPLEMENTS__` is `OnDestroy`, then `, ControlValueAccessor` if EDITOR, then
`, OnChanges, DoCheck` if COLL. For example, `OnDestroy, ControlValueAccessor, OnChanges, DoCheck`.

## 2. Type strings

This applies to every `get x(): T` / `set x(value: T)`, to every `EventEmitter<T>` of a
`<prop>Change` output, and to nested fields.

- Take the JSDoc `@type` if present, otherwise the TS type. Use the **most-derived**
  declaration.
- Sort union members case-insensitively. This applies inside `Array<…>` too:
  `Array<any | dxTabsItem | string>`.
- **Keep** `undefined` and `null`, and sort them together with everything else:
  `number | string | undefined`, `any | null`, `null | number | string` (from
  `string | number | null`).
- A type name from the JSDoc `@type` is used as written, even if that type is deprecated
  (`dxTabsItem`, not its replacement `Item`).
- Generic params become `any`, and type args are dropped: `((item: any) => any)`,
  `dxTabsItem`.
- A member `(() => void)` or `(() => any)` becomes `Function`. Other functions are written
  wrapped in parentheses: `((item: any) => any) | null | string`.
- An option whose **name contains `template`** (any case) is typed `any`.
- An **anonymous object literal** type is written inline, with fields sorted A→Z, all
  optional, and separated by commas: `{ hide?: AnimationConfig, show?: AnimationConfig }`.
  An array of such literals gets `[]`. It can sit in a union:
  `PositionAlignment | { x?: HorizontalAlignment, y?: VerticalAlignment }`.
- Named types (interfaces, aliases, widget options) are written by name:
  `PositionConfig`, `dxButtonOptions`, `AnimationConfig`.
- `{ [key: string]: any }` becomes `Record<string, any>`. Element types
  (`UserDefinedElement`, `DxElement`, …) become `any`.

```ts
height: number | string | undefined
hint: string | undefined
elementAttr: Record<string, any>
buttons: Array<string | TextBoxPredefinedButton | TextEditorButton> | undefined
dataSource: Array<any | dxTabsItem | string> | DataSource | DataSourceOptions | null | Store | string
keyExpr: ((item: any) => any) | null | string
selectedItem: any | null
itemTemplate: any
animation: { hide?: AnimationConfig, show?: AnimationConfig }
position: Function | PositionAlignment | PositionConfig
```

## 3. Properties (`@Input`s of the component)

- Include every public option that is **not an event**, own or inherited. An event is an
  option whose name starts with `on`, whose type has a function, and that has no `@fires`.
- Leave out options that are `@hidden` or `Omit`ted. `@hidden` is decided per option, by
  the most-derived declaration.
- **Also check the `.js` files**, of the widget **and of each base class**
  (`js/ui/<module>.js`, `js/ui/editor/editor.js`, `js/ui/widget/ui.widget.js`, …). A block
  such as `@name dxTabsOptions.activeStateEnabled` followed by `@hidden` hides that option.
  Such a block applies only to the interface it names. A more-derived `.d.ts`
  redeclaration, or `@hidden false`, makes the option public again. For example, `name`
  and `onFocusIn` are public in TextBox, and `selectionMode` is public in Tabs.
- `readonly` options (`isDirty`, `text`) are **included**.
- Sort alphabetically, ignoring case.
- **docID** (in `[descr:…]`): the explicit `@docid X` of the declaration if it has one.
  Otherwise use `<interface docid>.<option>` of the most-derived declaration. The interface
  docid is the interface's own `@docid` value if it has one (`dxTabsBaseOptions` has
  `@docid dxTabsOptions`), and otherwise its name. For example:
  `DOMComponentOptions.height`, `WidgetOptions.hint`, `dxTextEditorOptions.buttons`,
  `dxTextBoxOptions.value`.
- For a `@deprecated` option (only an **option-level** `@deprecated` counts; a deprecated
  options *interface* such as `dxTextBoxOptions` doesn't), add
  `     * @deprecated [depNote:<docID>]` and then a four-space line after the
  `[descr:…]` line.
- **COLLECTION PROPERTY**: the option is `dataSource`, or its (JSDoc) type **starts with**
  `Array<`, e.g. `items`, `selectedItemKeys`, `buttons`, `validationErrors`. These go into
  COLL_PROPERTY (`ngOnChanges`/`ngDoCheck`), sorted A→Z.

## 4. Outputs and `_createEventEmitters`

The outputs come in three groups, in this order:

1. **Events**: every event option (§3), sorted A→Z. That includes `onOptionChanged`,
   `onSelectionChanged` and everything else; there are no exclusions (this differs from
   React).
   - The output is `@Output() onX: EventEmitter<XEvent>;`. `XEvent` is the type named in
     `@type_function_param1 e:{ui/x:XEvent}`, without type args.
   - The docID is the event's `@docid` in the module's `/// #DEBUG` `Events` block (e.g.
     `dxLoadIndicatorOptions.onContentReady`), or the declaring interface for the
     component's own events.
   - The emitter entry is `{ subscribe: '<x>', emit: 'onX' }`, where `<x>` is the name
     without `on`, with a lower-case first letter: `onItemClick` becomes `itemClick`.
   - Older wrappers have `EventEmitter<Object>` or `EventInfo<any>` for events with
     `e:object` JSDoc. That's a generator artifact. For a new component, make the `.d.ts`
     annotate every event with `e:{ui/<module>:XEvent}`, and use that type.
2. **`<prop>Change`**, one for **every** property of §3, in the same order. It is typed
   `EventEmitter<<property type>>` and uses the "internal infrastructure" doc text. The
   emitter entry is `{ emit: '<prop>Change' }`.
3. **`onBlur`** (EDITOR only): `EventEmitter<any>` with `[descr:undefined]`. The emitter
   entry is `{ emit: 'onBlur' }`.

The last `_createEventEmitters` entry has no trailing comma.

## 5. Nested option components

### 5.1 What becomes nested

The rules are the same as for the React and Vue wrappers. A nested component is an option
(at any depth) whose type (or JSDoc `@type`) is, or is an array of, a documented object
type. Examples are `dxTabsItem`, `PositionConfig`, `AnimationConfig`, `dxButtonOptions`,
`TextEditorButton`, and anonymous object literals with documented fields.

These are **not** nested: primitives, enums, functions, `any`, `Record<string, any>`,
`DataSource`/`Store`, elements, and templates.

All nested components of a widget, **at any depth**, are flat files in one
`ui/<path>/nested/` folder, and **all** of them are listed in the root component's imports
and `@NgModule`. The parent-child link comes only from `_optionPath` and Angular DI.

### 5.2 Naming

The base name is the same as the React/Vue nested name. A non-array option gives
`PascalCase(optionName)`, and an array option gives the singular form (`items` → `Item`).
The same name with a different type under different parents needs a parent prefix
(`TooltipBorder`).

| | non-collection | collection item (ITEM) |
|---|---|---|
| class | `Dxo` + `<Path>` + `<Name>`: `DxoPopupPosition` | `Dxi` + `<Path>` + `<Name>`: `DxiTabsItem` |
| selector | `dxo-<path>-<kebab name>`: `dxo-popup-position` | `dxi-<path>-<kebab name>`: `dxi-tabs-item` |
| file | `<kebab name>.ts`: `position.ts`, `boundary-offset.ts` | `<kebab name>-dxi.ts`: `item-dxi.ts` |
| module | `DxoPopupPositionModule` | `DxiTabsItemModule` |

`<Path>` is the PascalCase form of `<path>`: `text-box` becomes `TextBox`.

In the root component, NESTED_COMPONENT is sorted A→Z by the base name (`Animation`, `At`,
…, `To`, `ToolbarItem`).

### 5.3 Fields of a nested component

- List every public field of the nested type, including inherited ones, sorted A→Z. Leave
  out `@hidden` fields, including those hidden in the `.js` file. Types follow §2.
- **Event fields are `@Input`s**, not outputs, and have no doc comments. Their type is
  `((e: XEvent) => void)`, plus `| undefined` only if **the declaration that decides** has
  it. If the event is annotated in the nested module's `/// #DEBUG` `Events` block, that
  block's declaration decides (so `onContentReady` has no `| undefined`). Otherwise the
  options interface does (`onClick?: … | undefined` keeps it). The event types are imported
  from the nested type's own module.
- **EVENTS**: each field with `@fires` gets `@Output() <field>Change` and a
  `{ emit: '<field>Change' }` entry.
- **TMPL**: the type has a field named `template`.
- **CO**: the type has collection-item children. Their option names go into CO_PROPERTY.

### 5.4 PredefinedProps

This applies only to typed collection variants (`validationRules` with `type`, form items
with `itemType`). Each variant sets `this.type = 'required';` in the constructor, followed
by a four-space line. This is rare in new components.

### 5.5 Root CO_PROPERTY / tokens

CO_PROPERTY in the root component lists the distinct option names of **all**
collection-item nested components (any depth), in NESTED_COMPONENT order. For example,
TextBox has `buttons` and Tabs has `items`. Each one gets a `@ContentChildren` block and a
`PROPERTY_TOKEN_<name>` import. See step 6 of §0 for the tokens file.

## 6. Type imports

- Use one `import type { A, B } from '<module>';` line per module, covering every named
  type used in the file, in first-use order. Walk **one combined A→Z list** of all options,
  with events interleaved alphabetically among the properties.
- Import each type from the module that **declares** it. For example, `LabelMode`,
  `ButtonType` and `TabsStyle` come from `devextreme/common`, while `dxTabsItem` and the
  event types come from the component's module.
- Data types:
  `import type { default as DataSource, DataSourceOptions } from 'devextreme/data/data_source';`
  and `import type { Store } from 'devextreme/data/store';`.
- The root file needs no aliases. In nested files, the one alias is
  `Component as CoreComponent`.
- If a file has no type imports, leave out the lines. The surrounding blank lines stay as
  the template has them. For example, a TMPL nested file without type imports has **three**
  empty lines between the `DOCUMENT` import and `import {`.

**Blank lines are content.** Skipping a `//#if` block removes only the lines inside it,
never the blank lines around it. Some spacing looks odd but is intended: four empty lines
before the `constructor` in non-editors, the trailing space in `import { ` before the
tokens, and two spaces in `implements OnDestroy, OnInit  {`.

## 7. File endings

| File | Ends with |
|---|---|
| `ui/<path>/index.ts` | `export { Dx<Name>Types };` + `\n\n\n` |
| nested `<file>.ts` | `export class …Module { }` + `\n` |
| `nested/index.ts` | last export line + `\n\n` |
| `ng-package.json` | `}` (no newline) |

## 8. Verify

The Angular library is built with ng-packagr, and `tsconfig.lib.json` has `"files": []`,
so a plain `tsc -p` checks nothing. Ask the developer to run the build, which needs the
built `devextreme` artifacts:

```bash
pnpm nx build devextreme-angular
```

Check that there are no leftover placeholders, directives, or stripped four-space lines:

```bash
grep -rnE "__[A-Za-z_]+__|^//#" src/ui/<path>
git diff --stat   # index.ts, ui/all.ts (2 array entries + 1 import), core/tokens only if needed
```

## 9. Reference wrappers (open at most one, only if unsure)

| Case | File |
|---|---|
| Minimal widget | `ui/load-indicator/index.ts` |
| EDITOR, COLL/CO, nested `-dxi` + non-collection with TMPL | `ui/text-box/index.ts`, `ui/text-box/nested/*` |
| GENERIC, COLL/CO, `items` | `ui/tabs/index.ts`, `ui/tabs/nested/item-dxi.ts` |
| Non-collection nested without template | `ui/popup/nested/position.ts` |
| Nested with `<field>Change` outputs | `ui/bar-gauge/nested/loading-indicator.ts` |

Ignore the `import { Dx…Module } from 'devextreme-angular/ui/nested'` lines and the
matching `@NgModule` entries in these files. They're legacy.

## 10. Known mistakes

- Importing from, or adding files to, `ui/nested/**`.
- Using Vue's `@isEditor` rule for EDITOR. Angular uses "has `onValueChanged`".
- Leaving out events from outputs (all events are included), or leaving out a
  `<prop>Change` for some property.
- Registering the module in only one of the two arrays in `ui/all.ts`.
- Forgetting `ng-package.json` in `ui/<path>/` or in `ui/<path>/nested/`.
- A missing `PROPERTY_TOKEN_<name>` for a new collection option name.
- Trimming the four-space lines.
- Adding `export type { ExplicitTypes }` to a non-generic component.
