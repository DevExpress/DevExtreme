# Traps: edits that look safe but change behaviour

Typing PRs must not change behaviour. Check every body edit in your diff against this list, and for grids also against the traps in [grids.md](grids.md). Green tests don't prove an edit is safe: several of these went through review and CI unnoticed.

## Values

- **`||` and `??` are not the same.** `x || d` replaces `0`, `''`, `false` and `NaN`; `x ?? d` doesn't. Swap them only when the value can't be one of those. The same goes for `rowIndex = rowIndex || 0` becoming a default param: a default param replaces only `undefined`.
- **`extend()` and spread are not the same.** Core `extend` skips `undefined` values; spread copies them as own keys. Swapping them adds `undefined` keys, and QUnit `deepEqual` fails even though a JSON dump looks identical. Also, spread inside a `reduce` makes it O(n²).
- **`a && a()` becomes `a?.()`** only when `a` is a function or nullish. If `a` can be `false`, `0` or `''`, the old code skipped the call and the new code throws.
- **`!!x` and `Boolean(x)` are fine; `x !== undefined` is not the same.** A guard added to make a type compile must let exactly the same values through as the old code.
- **`for…in` walks inherited keys; `Object.keys` doesn't.** Some objects inherit fields; grid column objects do, for one. Keep `for…in` (with its disable and reason) where inherited fields matter.
- **`arguments.length`** tells a getter from a setter call (`columnOption(id, name)` versus `columnOption(id, name, value)`). A rest param or a default param must keep that difference.

## Methods and overrides

- **Never collapse a two-hop read.** `store()?.key()` is not `key()`, and `dataSource()?.x()` is not `x()`, once some component overrides the outer method. TreeList overrides `key()`, for one. Check every override before merging two calls into one.
- **Deleting an override whose `super` call has `@ts-expect-error` breaks subclasses.** That override is also the typed link for every subclass's `super` call. The runtime still works, but tsc fails. Move the directive down to the subclass instead of deleting it.
- **Narrowing a getter in an override and casting is a smell.** Make the base generic over the thing it returns, with a default type param so other users are untouched, and put the one honest cast where the object is created.

## Types

- **Only a type alias is assignable to `Record<string, unknown>`** (`RawItemData`). An interface is not, because it has no implicit index signature. That is why `GroupItem` is an alias. Don't "clean it up" into an interface.
- **A return type reaches every caller.** A widely used method can have callers in dozens of files. Returning `T | undefined` breaks callers that read a field without a check. Check the callers before narrowing, and stop and ask if they are outside the task's files.

## Tests (only when a refactor was agreed)

- A test that calls `instance.dispose()` must also remove its container. Otherwise every later test in the file fails in `afterTest`.
- A unit stub that answers option reads must leave out `_optionCache`. Otherwise the first value read is frozen and an option-change test fails as if the code had a bug.
- Jest 30 types the arguments of `toHaveBeenCalledWith`. For an overloaded target like a component's `option`, they collapse to `never`. Use a single-signature mock type (grids have a `spyOnOption` helper).
