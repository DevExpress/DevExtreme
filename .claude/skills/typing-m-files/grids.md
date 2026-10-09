# Grids: extra rules for `js/__internal/grids/`

These apply on top of `SKILL.md` to files under `js/__internal/grids/`: `grid_core`, `data_grid`, `tree_list`, `pivot_grid` and CardView (`new/`).

## Dependency direction

- `data_grid`, `tree_list`, `pivot_grid` and CardView are built on `grid_core`. **`grid_core` never imports from them.**
- Inside `grid_core`, a module never adds an import from a module that depends on it.
- Reach another module's controllers and views the way the code already does: through `getController('x')`/`getView('x')`. The `Controllers`/`Views` registry in `grid_core/m_types.ts` types them, and no new import is needed.

## Where types go

- Files directly in `grid_core/` (`m_modules.ts`, `m_utils.ts`, `m_widget_base.ts`, …) have no `types.ts` of their own. Their types file is `grid_core/m_types.ts`.
- Reuse before creating:
  - `Controllers['x']`/`Views['x']`, `ModuleType`, `OptionChanged`/`OptionChangedFor` from `grid_core/m_types.ts`;
  - public types from `@js/common/grids` and `@js/ui/data_grid` (`ColumnBase`, `FixedPosition`, `Properties as DataGridProperties`, …).
- **Leaks.** Sometimes feature logic has leaked into core: core code reads a row field that editing or grouping sets, or handles a view only `data_grid` registers. Declare the type core needs in the core module's `types.ts`, not by importing it from the feature, and mark it:
  ```ts
  /** @architectureLeak <owner module>: <why core needs it> */
  ```
  `grep -rn "@architectureLeak" js/__internal/grids` lists them all. Moving one to its owner is a separate architecture task.
- `Controllers['x']` or a direct `import type` of the class: both work, and the direct import is the more common style. `grid_core/m_types.ts` itself uses inline `import('…')` types so that it has no import cycles. Don't add a regular import to it.

## Style enforced here

In `grid_core`, `data_grid` and `tree_list`, ESLint requires explicit `public`/`protected`/`private` on members (constructors excepted) and forbids `get`/`set` accessors. Keep to both in `pivot_grid` too.

## Typing idioms

**Extenders.** Write the return type as `ModuleType<X>`:
```ts
const summaryDataController = (Base: ModuleType<DataController>): ModuleType<DataController> => class SummaryDataControllerExtender extends Base {
```
A generic mixin `<T extends ModuleType<Controller>>(Base: T) => class extends Base` can't name its return type. It keeps `// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type`.

`ModuleType<T>` itself keeps `new (...args: any[]) => T`, with the directive reason `mixin constructors need any[]` (see fixes.md).

**Controller fields.** `public _columnsController!: Controllers['columns'];`

**Views**
- `_$element` and `_$parent` are optional (`?:`), because `render()` sets them. `element()` returns `dxElementWrapper | undefined`, and so does `_parentElement()`.
- Code that assumes the view is rendered gets `// @ts-expect-error the view is rendered here`. Use exactly this reason, so `grep -rn "the view is rendered here"` finds every such place when its file is typed. A guard would turn today's `TypeError` into a silent no-op, so it isn't behaviour-neutral.
- `_renderCore()` returns `DeferredObj<unknown> | void`, with a `no-invalid-void-type` disable: a view that renders synchronously returns nothing. `| undefined` breaks every override that returns nothing (7 of them).

**Fake components.** CardView passes its `WidgetMock`, PivotGrid's field chooser passes itself, and Jest tests pass partial mocks to classic module items. They get `as unknown as InternalGrid` where they're passed. The `ModuleItem` constructor stays `component: InternalGrid`.

**The widget instance as a param** (`callModuleItemsMethod(that, …)`): type it `Partial<Pick<InternalGrid, '_controllers' | '_views'>>`. The widget class declares `_controllers` and `_views` as private, so the typed DataGrid caller needs `// @ts-expect-error the widget's _controllers and _views are private`, like the `processModules` call next to it.

**Options**
- `this.option('a.b')` is already typed from the public options through `InternalGridOptions`, so delete the casts: `this.option('summary.groupItems') ?? []`.
- An option the module handles but the public d.ts doesn't have: declare `<Module>Options` in the module's `types.ts`, and type `optionChanged` with it:
  ```ts
  export type ColumnsControllerOptionChanged = OptionChanged
    | OptionChangedFor<ColumnsControllerOptions>
    | ColumnOptionChanged;
  ```
  Declare only the options the `optionChanged` switch handles. An unhandled one falls through to `super.optionChanged(args: OptionChanged)` and doesn't compile.
- Known limit: `this.option('<module option>')` still returns `never`, because `option()` knows only `InternalGridOptions`. Leave it; it is separate work.
- TS can't narrow by comparing two fields: `args.name === args.fullName` becomes `args.fullName === 'columns'`.

## Traps

- **Same method names on different chains.** `_changeRowExpandCore`, `_processGroupItems` and others exist on both the `DataController` chain and the `DataSourceAdapter` chain. Before typing or changing an override, check which class the enclosing extender extends. Also, an option-object property named like a method (`pageCount()` inside an options object) is a delegate, not an override.
- **Extender order is inheritance order.** `registerModulesOrder([...])` in `data_grid/m_widget_base.ts` and `tree_list/m_widget_base.ts` decides which extender wraps which. A later module is more derived. A type that assumes one extender runs before another has to follow that order.
- **Widely used returns.** The columns controller's public getters (`getColumns`, `getVisibleColumns`, `getFixedColumns`, …) are called from 51 files outside `columns_controller/`. Check the callers before narrowing one of them.
- **Grid column objects inherit fields**, so a `for…in` over a column also walks inherited keys (see traps.md).

## Tests (only when a refactor was agreed)

- A test for DataGrid- or TreeList-only behaviour goes in that component's `__tests__`, not in `grid_core`.
- Use the existing `createDataGrid`/`createTreeList` helpers (`__tests__/__mock__/helpers/utils.ts`); both default `keyExpr: 'id'`. For the grid's overloaded `option`, use `spyOnOption` from the same file.
- No new QUnit tests for grids: cover new code with Jest. The existing QUnit tests are only for checking behaviour.

## Renames in grids

On top of [rename.md](rename.md):
- **Hub files** are imported from more than 20 places outside their module. Rename them only at a moment the team has agreed and announced, so everyone merges or rebases first. Ask the developer before renaming one of these:
  - `grid_core/m_types.ts`, `grid_core/m_utils.ts`, `grid_core/m_modules.ts`
  - `grid_core/views/m_rows_view.ts`, `grid_core/column_headers/m_column_headers.ts`
  - `pivot_grid/m_widget_utils.ts`
- `grid_core/m_types.ts` imports most controllers and views with inline `import('./…/m_x')` types. Update that line too.
- Diagram scripts:
  - `grids/__docs__/scripts/data_grid/constants.ts` maps `m_*` file names to feature areas. Rename the entry.
  - For `m_modules.ts` only, also `grids/__docs__/scripts/grid_core/constants.ts`: `M_MODULES_PATH` and `EXCLUDED_FILE_NAMES`.
- **`module_not_extended/` folders** have no `m_` prefix, so there is nothing to rename. They get the relaxed rules only through the `'js/__internal/**/module*/**.ts'` glob of the "Rules for migrated from JS files" block in `packages/devextreme/eslint.config.mjs`. That glob also matches `ui/html_editor/modules/` and `ui/list/modules/`, so don't delete it. Once a folder has 0 strict errors, add it to that block's `ignores`:
  ```js
  // Rules for migrated from JS files
  {
      files: ['js/__internal/**/m_*.ts', 'js/__internal/**/module*/**.ts'],
      ignores: ['js/__internal/grids/**/module_not_extended/**'],
  ```
