# Grids: extra rules for `js/__internal/grids/`

These apply on top of `SKILL.md` to files under `js/__internal/grids/`: `grid_core`, `data_grid`, `tree_list`, `pivot_grid` and CardView (`new/`).

## Dependency direction

- `data_grid`, `tree_list`, `pivot_grid` and CardView are built on `grid_core`. **`grid_core` never imports from them.**
- Inside `grid_core`, a module never adds an import from a module that depends on it.
- Reach another module's controllers and views the way the code already does: through `getController('x')`/`getView('x')`, not a value import. The `Controllers`/`Views` registry in `grid_core/types.ts` types what they return. A field that holds one still gets its class through `import type` (Where types go).

## Where types go

- Files directly in `grid_core/` (`utils.ts`, `widget_base.ts`, …) put their types in `grid_core/types.ts`, the shared hub. `grid_core/modules/modules.ts` has its own `modules/types.ts`.
- Reuse before creating:
  - `ModuleType`, `OptionChanged`/`OptionChangedFor` from `grid_core/types.ts`;
  - public types from `@js/common/grids` and `@js/ui/data_grid` (`ColumnBase`, `FixedPosition`, `Properties as DataGridProperties`, …).
- **Leaks.** Sometimes feature logic has leaked into core: core code reads a row field that editing or grouping sets, or handles a view only `data_grid` registers. Declare the type core needs in the core module's `types.ts`, not by importing it from the feature, and mark it:
  ```ts
  /** @architectureLeak <owner module>: <why core needs it> */
  ```
  `grep -rn "@architectureLeak" js/__internal/grids` lists them all. Moving one to its owner is a separate architecture task.
- Don't add a new leak to drop a directive. A feature hook moved onto a base class (editing's `_editCellPrepared` onto `RowsView`) makes the base know about the feature. Type the consumer against the feature's extension instead (Typing idioms, "Cross-extender access"), or keep the directive.
- Type a controller or view field with its class through `import type`, not with `Controllers['x']`/`Views['x']`. Switch the map-typed fields of the file you type. A type-only import cycle is fine: `import type` is erased from the built JS, and `import/no-cycle` skips it. `grid_core/types.ts` itself uses inline `import('…')` types; don't add a value import to it.

## Constants and imports

- A CSS class that several modules use is defined once, in the `const.ts` of the module that adds it to the DOM, as a flat `CLASSES` object. Others import it under an alias that names the owner: `import { CLASSES as ROWS_CLASSES } from '@ts/grids/tree_list/rows/const';`. A `const.ts` value-imports no grid module, so importing it can't close a cycle. Keep it that way.
- Replacing a local copy of such a class with that import is a refactor: do it only when the developer asks. Grep for the class value first. If the owner has no `const.ts`, create one with just the shared class, and leave the owner's other local constants where they are.
- A new import uses `./x` inside the module and an absolute `@ts/grids/…` path across modules, never `../other_module/x`. Existing paths stay.

## Style enforced here

In `grid_core`, `data_grid` and `tree_list`, ESLint requires explicit `public`/`protected`/`private` on members (constructors excepted) and forbids `get`/`set` accessors. Keep to both in `pivot_grid` too.

## Typing idioms

**Extenders.** Write the return type as `ModuleType<X>`:
```ts
const summaryDataController = (Base: ModuleType<DataController>): ModuleType<DataController> => class SummaryDataControllerExtender extends Base {
```
- A component's extender takes the component's class as `Base` (`Base: ModuleType<TreeListDataController>`), so `super` sees the component's methods without a directive. A base method that a subclass calls through `super` must be at least `protected` (a `private` one fails with TS2341), and one that another class calls must be `public` (a `protected` one fails with TS2445). An override can't be less visible than what it overrides (TS2415).
- A component extender that wraps a shared one (`class X extends editingDataControllerExtender(Base)`) loses its narrowed `Base` unless the shared extender is generic. A generic extender can name its return type: `TBase` when it adds nothing that others call, `TBase & ModuleType<X & XExtension>` when it does:
  ```ts
  export const editingDataControllerExtender = <TBase extends ModuleType<DataController>>(
    Base: TBase,
  ): TBase & ModuleType<
    DataController & EditingDataControllerExtension
  > => class EditingDataControllerExtender extends Base {
  ```
  Older generic mixins (`column_state_mixin.ts`) disable `explicit-module-boundary-types` and `explicit-function-return-type` instead. Do that only when neither return type fits.

`ModuleType<T>` itself keeps `new (...args: any[]) => T`, with the directive reason `mixin constructors need any[]` (see fixes.md).

**Cross-extender access.** When a class calls a member that another extender adds:
- The extender's module exports `interface <Module><Base>Extension` with that member, and the extender returns `ModuleType<Base & <Module><Base>Extension>`. Examples: `EditingDataControllerExtension`, `MasterDetailDataControllerExtension`, `StateStoringDataControllerExtension`.
- The implementing member is `public`, and so are its overrides.
- Declare members property-style, except a member that a subclass overrides: a property there makes the subclass fail with TS2425. That one gets a method signature and `// eslint-disable-next-line @typescript-eslint/method-signature-style -- a subclass overrides it as a method`. The older disables of this kind have no reason; don't copy them.
- The consumer narrows its own field (`protected _rowsView!: RowsView & EditingFormBasedRowsViewExtension;`) or its extender's `Base` (`Base: ModuleType<DataController & GroupingDataControllerExtension>`). A core module that does this gets `@architectureLeak`. When the registry can't prove the extension, the registration gets `// @ts-expect-error the extender assumes the <feature> extension of <Base>` (`adaptivity_module.ts`).
- One interface per extender: no second `I…Extender` interface, no `…Impl` class with a type alias, no `InstanceType<ReturnType<typeof extender>>`, and no feature members added to the base controller's type.

**Controller fields.** `public _columnsController!: ColumnsController;`

**Views**
- `_$element` and `_$parent` are optional (`?:`), because `render()` sets them. `element()` returns `dxElementWrapper | undefined`, and so does `_parentElement()`.
- Code that assumes the view is rendered gets `// @ts-expect-error the view is rendered here`. Use exactly this reason, so `grep -rn "the view is rendered here"` finds every such place when its file is typed. A guard would turn today's `TypeError` into a silent no-op, so it isn't behaviour-neutral.
- `_renderCore()` returns `DeferredObj<unknown> | void`, with a `no-invalid-void-type` disable: a view that renders synchronously returns nothing. `| undefined` breaks every override that returns nothing (7 of them).

**Fake components.** CardView passes its `WidgetMock`, PivotGrid's field chooser passes itself, and Jest tests pass partial mocks to classic module items. They get `as unknown as InternalGrid` where they're passed. The `ModuleItem` constructor stays `component: InternalGrid`.

**The widget instance as a param** (`callModuleItemsMethod(that, …)`): type it `Partial<Pick<InternalGrid, '_controllers' | '_views'>>`.

**Options**
- `this.option('a.b')` is already typed from the public options through `InternalGridOptions`, so delete the casts: `this.option('summary.groupItems') ?? []`.
- An option the module handles but the public d.ts doesn't have: declare `<Module>Options` in the module's `types.ts`, and type `optionChanged` with it:
  ```ts
  export type ColumnsControllerOptionChanged = OptionChanged
    | OptionChangedFor<ColumnsControllerOptions>
    | ColumnOptionChanged;
  ```
  Declare only the options the `optionChanged` switch handles. An unhandled one falls through to `super.optionChanged(args: OptionChanged)` and doesn't compile.
- `defaultOptions()` in a module registration: a simple return type stays inline (`defaultOptions(): { stateStoring: StateStoring }`). Name it in the module's `types.ts` when another module builds on it. For example, `editing/types.ts` names `EditingDefaultOptions`, and TreeList extends it: `TreeListEditingDefaultOptions = EditingDefaultOptions & { editing: { texts?: EditingTexts } };`.
- Known limit: `this.option('<module option>')` still returns `never`, because `option()` knows only `InternalGridOptions`. Leave it; it is separate work.
- TS can't narrow by comparing two fields: `args.name === args.fullName` becomes `args.fullName === 'columns'`.

## Traps

- **Same method names on different chains.** `_changeRowExpandCore`, `_processGroupItems` and others exist on both the `DataController` chain and the `DataSourceAdapter` chain. Before typing or changing an override, check which class the enclosing extender extends. Also, an option-object property named like a method (`pageCount()` inside an options object) is a delegate, not an override.
- **Extender order is inheritance order.** `registerModulesOrder([...])` in `data_grid/widget_base.ts` and `tree_list/widget_base.ts` decides which extender wraps which. A later module is more derived. A type that assumes one extender runs before another has to follow that order.
- **Widely used returns.** The columns controller's public getters (`getColumns`, `getVisibleColumns`, `getFixedColumns`, …) are called from 51 files outside `columns_controller/`. Check the callers before narrowing one of them.
- **Grid column objects inherit fields**, so a `for…in` over a column also walks inherited keys (see traps.md).

## Tests (only when a refactor was agreed)

- A test for DataGrid- or TreeList-only behaviour goes in that component's `__tests__`, not in `grid_core`.
- Use the existing `createDataGrid`/`createTreeList` helpers (`__tests__/__mock__/helpers/utils.ts`); both default `keyExpr: 'id'`. For the grid's overloaded `option`, use `spyOnOption` from the same file.
- No new QUnit tests for grids: cover new code with Jest. The existing QUnit tests are only for checking behaviour.

## Renames in grids

On top of [rename.md](rename.md):
- **Hub files** are imported from more than 20 places outside their module. Rename them only at a moment the team has agreed and announced, so everyone merges or rebases first. Ask the developer before renaming one of these:
  - `grid_core/column_headers/m_column_headers.ts`
  - `pivot_grid/m_widget_utils.ts`
- `grid_core/types.ts` refers to controllers and views with inline `import('./…')` types, and some still point to `m_` files. Update the renamed file's line there too.
- Diagram scripts: `grids/__docs__/scripts/data_grid/constants.ts` maps `m_*` file names to feature areas. Rename the entry.
- **`module_not_extended/` folders and `grid_core/modules/`** have no `m_` prefix, so there is nothing to rename. They are already strict: the "Rules for migrated from JS files" block in `packages/devextreme/eslint.config.mjs` matches them through its `'js/__internal/**/module*/**.ts'` glob but lists them in `ignores`. Keep that glob: `ui/list/modules/` still needs it.
