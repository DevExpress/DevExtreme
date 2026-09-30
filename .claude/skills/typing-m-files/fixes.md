# Fixes per rule

These are the fixes used in earlier typing PRs, most frequent rule first. The examples come from the grids typing PRs, but the idioms apply to any `m_` file; grid-only idioms are in [grids.md](grids.md). The shares were measured on the 10,856 strict errors of the grids' `m_` files. The last section covers warnings, which are fixed only where the fix provably behaves the same.

Compiler settings to keep in mind (`js/__internal/tsconfig.json`):
- `strict` is on, so `strictNullChecks` is on too.
- `noImplicitAny` is off, so an untyped param is silently `any`. ESLint is the only thing that catches it.
- A new return type is a new contract for every caller. Before you narrow one, check its callers across `js/__internal`.

## Missing return type: 40%

`explicit-function-return-type` and `explicit-module-boundary-types` (return part). One missing return type is often reported by both rules, so one fix removes two errors.

What TypeScript infers at these places today, measured on a sample:

| Inferred | Share | What to write |
|---|--:|---|
| `void` | 41% | `: void` |
| `any` | 30% | a real type: find what the body really returns |
| a primitive (`boolean`, `number`, `string`) | 12% | that type |
| a named type | 10% | that type |
| an object literal or a long type | 5% | a named type in the module's `types.ts` |

```ts
-  public isColumnOptionUsed(optionName): any {
+  public isColumnOptionUsed(optionName: string): boolean {
```
- `callbackNames()`/`publicMethods()` return `string[]`.
- A value that is only passed along returns `unknown`.
- Type guards: `): sortOrder is SortOrder =>`, `.filter((key): key is string | number => …)`.
- An inline callback passed to a typed API (`forEach`, `map`, `.done(...)`) needs no annotation.
- A standalone arrow does: `const hasAdditionalFilter = (): boolean => …`.

## Missing param type: 14%

`explicit-module-boundary-types` ("Argument … should be typed"). Take the type from the module's `types.ts` or the public d.ts. Type the params in place. Turning a `function` expression into an arrow isn't needed for typing. It behaves the same only if the function uses neither `this` nor `arguments` and is never called with `new`. The team's earlier PRs did it like this:
```ts
-export const getChildrenByBandColumn = function (columnIndex, columnChildrenByIndex, recursive) {
+export const getChildrenByBandColumn = (
+  columnIndex: number | undefined,
+  columnChildrenByIndex: BandColumnsCache['columnChildrenByIndex'],
+  recursive: boolean,
+): Column[] => {
```
- `| undefined` on a param describes the existing contract when the body already guards `undefined` and callers pass possibly-undefined values. It is not a widening.
- `sortOrder` params use `SortOrder` from `@js/common`, plus `| 'none'` where the method accepts it.

## `no-unsafe-return` 11%, `no-explicit-any` 9%

Replace `any` with:
- a specific union (`string | null | undefined`, `number | undefined`);
- `unknown`;
- a handler type (`(e: unknown) => void`);
- a public type (`DataType`, `HorizontalAlignment`, `Format`, `DeferredObj<T>`, `Callback<[…]>`, the component's own types from `@js/ui/<component>`).

A value from a source that isn't typed yet gets a directive, not a cast. A cast stays silent once the source gets typed. A directive is then reported as unused, and gets removed.
```ts
-    return this._dataSource[optionName]() as number;
+    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- <what isn't typed yet>
+    return this._dataSource[optionName]();
```
- For an `any` value, use `eslint-disable`, as above. `@ts-expect-error` doesn't work there: TypeScript sees no error on an `any` value, so tsc fails at once with TS2578 (unused directive).
- Use `// @ts-expect-error <what isn't typed yet>` only when TypeScript itself rejects the value, because it is `unknown` or has a wider or wrong type.
- The team's earlier PRs used casts here (`… as number`, `… as DeferredObj<RawItemData>`). Don't copy them.

`unknown` instead of `any`:
- Use `unknown` when callers only store the value or pass it on. `unknown` makes the code check the value before using a member of it.
- When callers use its members, `unknown` breaks every call site (`'x' is of type 'unknown'`), and those are often in files outside the task. Give it its real type instead. For example, the earlier `dataSource(): any` is now `DataSourceController.getDataSource(): DataSource | null`.
- Keep `any` with `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- <why>` only when neither works.

## `@stylistic/max-len`: 5%

The limit is 100. Comments count, strings and template literals don't. Put one param per line, and start a wrapped condition with `&&`/`||`. If a disable comment itself is too long, disable max-len for it:
```ts
// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/explicit-module-boundary-types
```

## `init-declarations`: 3%

Move the first assignment into the declaration, when nothing reads the variable before it:
```ts
-  let rowspan;
+  let rowspan: number = that.getRowCount();
```
- Otherwise, for example when an if-chain or a closure assigns it, keep a line disable with a reason: `// eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in <where>`.
- Don't add a placeholder value. `= 0` changes what an early read gets, and `= undefined` is forbidden by `no-undef-init`.
- Moving an if-chain into a helper so the variable can be `const` (`const changeType = resolveChangeType(optionName);`) is a refactor: only when agreed.

## `no-this-alias`: 3%

Use `this` instead of `that`, but only inside arrow callbacks. Inside a `function` callback, `this` is something else.
```ts
-      when(that._columnsController.applyDataSource(dataSource)).done(() => {
+      when(this._columnsController.applyDataSource(dataSource)).done(() => {
```
`function (isLoading) { … }.bind(this)` becomes `(isLoading: boolean): void => { … }`, if the body doesn't use `arguments`.

## `prefer-rest-params` / `prefer-spread`: 2%

Call `super` with named params, when the method declares exactly those params and neither it nor the base reads `arguments`. With named params, a call with extra arguments drops them:
```ts
-  protected _processItems(items, change) {
-    items = super._processItems.apply(this, arguments as any);
+  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
+    const processedItems = super._processItems(items, change);
```
- Otherwise forward everything with a rest param: `super.x(...args)`.
- A variadic method gets overloads plus a rest param: `private filter(...filterArgs: [] | [DataFilter] | BinaryDataFilterExpression)`.
- Forwarding: `result.resolve.apply(result, arguments)` becomes `.done((...args: unknown[]) => { result.resolve(...args); })`.
- `arguments.length` is not flagged. If the code depends on it (a getter/setter overload), keep the `function` and its `arguments.length` check.
- `const callBase = super.x.bind(this);` is fine.

## Smaller rules

| Rule | Fix |
|---|---|
| `no-plusplus` | `i += 1`. `` `dx-col-${id++}` `` becomes `` `dx-col-${id}` `` followed by `id += 1;` |
| `no-param-reassign` | a default param (`rowIndex = 0` instead of `rowIndex = rowIndex \|\| 0`, only when the old code treats only `undefined` as missing; see traps), or a new `const`. Mutating an object's properties is allowed |
| `no-unused-expressions` | `cond && doIt()` becomes `if (cond) { doIt(); }`, which always behaves the same. `a.update && a.update(x)` becomes `a.update?.(x)` only when `a.update` can only be a function, `null` or `undefined`. If it can be `false`, `0` or `''`, the old code skips the call but `?.()` throws, so use `if (a.update) { a.update(x); }` |
| `@stylistic/no-mixed-operators` | parentheses that spell out the current grouping: `a && b \|\| c` becomes `(a && b) \|\| c`, since `&&` binds tighter. A named boolean also works: `const isDefaultCommandColumn = column.command && !isCustom(column); if (isDefaultCommandColumn \|\| !column.fixedPosition)` |
| `no-shadow` | rename the inner name: `(column) =>` becomes `(commandColumn) =>` |
| `max-depth` (3) | at function level: early `return` guards, or merging nested `if`s with `&&`, where the flow stays the same. Inside a loop there is no such fix, because `no-continue` is a strict rule too. Then ask the developer: an agreed refactor (a helper, a loop rewrite), or a line disable with a reason |
| `consistent-return` | an explicit `return undefined;` at the end, and `default: return undefined;` in a switch: the function already returned `undefined` there. Not `return false;`, which changes the value |
| `prefer-for-of` | `for (const column of this._columns)`, when the index is only used to read the item and the loop doesn't add or remove items |
| `no-use-before-define` | move the declaration above its first use, when that doesn't change evaluation order |
| `no-multi-assign` | two statements; `x = o.x = o.x === undefined ? d : o.x` becomes `o.x ??= d;` then `x = o.x`, only if `o.x` can't be `null` |
| `no-non-null-assertion` | a narrowing TypeScript can see, when the value provably isn't `null` or `undefined` there. If it can be, the old code threw or read a key named `'undefined'`, so a check with a new fallback (`oldItem ? map[getRowKey(oldItem)] : undefined`) changes behaviour. Ask, or keep a line disable with a reason |
| `no-invalid-this` | a typed `this` param, which changes nothing: `function (this: ColumnBase, e: ColumnCustomizeTextArg): string`. An arrow changes what `this` is, so use one only after replacing every `this` with what it was. Core `each(items, function () {…})` calls the callback with `this` set to the item, and stops when it returns `false`, so keep `each` rather than switching to `forEach` |
| `no-floating-promises` | a line disable with a reason. `void promise` is not an option: `no-void` forbids it |

## Class fields

Fields typed as `any` (part 1 of a file, or a whole file):
- Assigned in `init()`: definite assignment, `public _columns!: Column[];`.
- Lazy or cached: optional, `private _visibleColumns?: Column[][];`. Write `?: boolean`, not `: boolean | undefined`.
- Callbacks: a typed tuple, `public pageChanged!: Callback<[number?]>;`.
- A narrower type for an inherited field in a subclass: `public declare _dataSource?: GroupingDataSourceAdapter | null;`.
- Drop `readonly` when utils assign the field. A field that is overridden becomes `protected`, not `private`.
- Once a field is typed, remove the casts of it (`(this._columns as Column[])`).

## `@ts-expect-error`

- A new one needs a reason: `// @ts-expect-error ownerBand holds the band column until updateColumnIndexes sets its index`.
- Prefer it to a cast when TypeScript rejects a value from a source that isn't typed yet. For an `any` value, use `eslint-disable` instead (see `no-unsafe-return` above).
- Remove one when tsc reports it as unused (TS2578). That means its source has been typed.

## Warnings (best effort)

The target is 0 errors. Fix a warning only when you can show that the fix behaves the same for every value the code can get. Otherwise leave it, with no disable. Counts are for the grids' `m_` files after the rename, to show which rules matter most.

| Rule | Count | The fix behaves the same when |
|---|--:|---|
| `prefer-nullish-coalescing` | 618 | the left side's type can't be `0`, `''`, `false` or `NaN`, and that type is trustworthy (not `any`, not from a cast). `x \|\| d` → `x ?? d` and `x = x \|\| d` → `x ??= d` differ exactly for those values (see traps.md) |
| `prefer-optional-chain` | 360 | the expression is only used as a condition (`if`, `!`, `&&`/`\|\|` inside a condition), or `a` can only be an object, a function, `null` or `undefined`. In a value position, `a && a.b` gives `a` when `a` is `0`, `''` or `false`, but `a?.b` gives `undefined`. This rule is off for `m_` files, so it only appears after the rename |
| `func-names` | 221 | always, if the new name isn't used in the function's body (inside the function, the name would hide an outer variable of the same name) and nothing reads the function's `.name` |
| `no-restricted-globals` | 39 | all of them are `setTimeout`. The rule asks to keep a `setTimeout` only when there is no other way, with a comment saying why. If you know why, write `// eslint-disable-next-line no-restricted-globals -- <why setTimeout>`. Replacing the timer changes behaviour, so not in a typing PR. If you don't know why, leave it |
| `require-await` | 4 | only in a Jest test callback. Removing `async` turns a rejected promise into a plain throw, and both fail the test. Elsewhere, leave it |

In test files, `explicit-function-return-type`, `no-explicit-any` and `no-unsafe-return` are warnings after the rename, not errors. Fix them as described above.
