# Traps: edits that look safe but change behaviour

Typing PRs must not change behaviour. Check every body edit in your diff against this list, and for grids also against the traps in [grids.md](grids.md). Green tests don't prove an edit is safe: several of these went through review and CI unnoticed.

## Values

- **`||` and `??` are not the same.** `x || d` replaces `0`, `''`, `false` and `NaN`; `x ?? d` doesn't. Swap them only when the value can't be one of those. The same goes for `rowIndex = rowIndex || 0` becoming a default param: a default param replaces only `undefined`.
- **`x++` and `x += 1` are not the same for strings.** `++` converts its operand to a number (`let x = '5'; x++` leaves `x` at `6`); `+= 1` concatenates (`'51'`). Use `+= 1` for a numeric operand (loop counters, `.length`). For a value that can be a string, such as a width slot that holds `'auto'` or `''`, `x = Number(x) + 1` is exactly what `++` did. Both hold only for an increment that stands alone: postfix `x++` evaluates to the old value, converted to a number, while both replacements evaluate to the new one. Where the result is used (`arr[i++]`, `` `dx-col-${id++}` ``), use the old value first and increment in a statement of its own.
- **`extend()` and spread are not the same.** Core `extend` skips `undefined` values; spread copies them as own keys. Swapping them adds `undefined` keys, and QUnit `deepEqual` fails even though a JSON dump looks identical. Also, spread inside a `reduce` makes it O(n²).
- **`a && a()` becomes `a?.()`** only when `a` is a function or nullish. If `a` can be `false`, `0` or `''`, the old code skipped the call and the new code throws.
- **`!!x` and `Boolean(x)` are fine; `x !== undefined` is not the same.** A guard added to make a type compile must let exactly the same values through as the old code.
- **`for…in` walks inherited keys; `Object.keys` doesn't.** Some objects inherit fields; grid column objects do, for one. Keep `for…in` (with its disable and reason) where inherited fields matter.
- **`arguments.length`** tells a getter from a setter call (`columnOption(id, name)` versus `columnOption(id, name, value)`). A rest param or a default param must keep that difference.
- **Core `each` → `forEach`** behaves the same only when all of these hold: the input is always a dense plain array (`each` also walks objects and array-likes, and visits the holes that `forEach` skips), the loop doesn't change it, and the callback never returns `false` (that stops `each`) and doesn't use `this`. The callback parameters swap too: `each` passes `(index, value)`, `forEach` passes `(value, index)`. When the array comes from an overridable method (`callbackNames()`, `publicMethods()`), check what every override returns.
- **`that[this]` inside an `each` callback** is the item: `each` passes it both as `this` and as the second argument. So, still inside `each`, `function () { that[this]… }` becomes `(index, name) => { this[name]… }`, which also removes the `that` alias.

## Methods and overrides

- **Never collapse a two-hop read.** `store()?.key()` is not `key()`, and `dataSource()?.x()` is not `x()`, once some component overrides the outer method. TreeList overrides `key()`, for one. Check every override before merging two calls into one.
- **Deleting an override whose `super` call has `@ts-expect-error` breaks subclasses.** That override is also the typed link for every subclass's `super` call. The runtime still works, but tsc fails. Move the directive down to the subclass instead of deleting it.
- **Narrowing a getter in an override and casting is a smell.** Make the base generic over the thing it returns, with a default type param so other users are untouched, and put the one honest cast where the object is created.
- **A `void` return says nobody uses the value.** Before writing it, check the callers. A callback list created with `stopOnFalse` reads each subscriber's return value: the grid's `dataErrorOccurred` subscriber returns `executeAction(...)`, and a user handler stops the chain by returning `false`. Also, `Component._createActionByOption` is declared `(event?: unknown) => void`, but its action returns the handler's result.

## Types

- **Only a type alias is assignable to `Record<string, unknown>`** (`RawItemData`). An interface is not, because it has no implicit index signature. That is why `GroupItem` is an alias. Don't "clean it up" into an interface.
- **A return type reaches every caller.** A widely used method can have callers in dozens of files. Returning `T | undefined` breaks callers that read a field without a check. Check the callers before narrowing, and stop and ask if they are outside the task's files.
- **A generic with a default type param doesn't reach code that constructs concrete subclasses.** `class FilterPanelView extends View` binds the default, so its constructor still demands the default type: making `ModuleItem<TComponent = InternalGrid>` generic didn't let CardView pass its `WidgetMock`. Cast the fake where it's passed instead (fixes.md).

## Tests (only when a refactor was agreed)

- A test that calls `instance.dispose()` must also remove its container. Otherwise every later test in the file fails in `afterTest`.
- A unit stub that answers option reads must leave out `_optionCache`. Otherwise the first value read is frozen and an option-change test fails as if the code had a bug.
- Jest 30 types the arguments of `toHaveBeenCalledWith`. For an overloaded target like a component's `option`, they collapse to `never`. Use a single-signature mock type (grids have a `spyOnOption` helper).
