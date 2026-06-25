---
applyTo: "**/packages/devextreme/js/**/*.d.ts"
---

# Optional field typing (`?`, `| undefined`, `| null`, `@default`)

When you write, complete, or review an optional field in a public `.d.ts`, apply the rules
below. The shape of an optional field is decided by two independent axes.

## Two axes

- **Type axis (`| undefined`).** Add `| undefined` only if the field is an OPTION whose
  stored default in `defaultOptions` is `undefined`. Otherwise use a bare `?`.
- **`@default` axis (JSDoc).** Write `@default <X>` only when `X` is actually STORED as the
  default — in `defaultOptions` for an option, or as the seed object for an object-valued
  option. A point-of-use default (a `switch` default, a destructuring default, `??`) is NOT
  stored: do not write `@default`. (The on-omission behavior is documented by technical
  writers in a separate documentation repository, not in the `.d.ts`.)

Across the board: in `defaultOptions`, "no value" is `undefined`, not `null`. Use `null`
only when the runtime performs a meaningful `=== null` check.

## New vs existing fields (breaking-change policy)

- **New field:** the default in `defaultOptions` is `undefined`; the type and `@default`
  follow `undefined`. `null` (as a type member or as a value) is allowed ONLY with explicit
  justification — the runtime genuinely distinguishes it with `=== null`. Without that
  justification, reject `null` in review. This is the decision the linter cannot make, so it
  must be enforced here.
- **Existing field:** never introduce a breaking change. Do not migrate a runtime `null` to
  `undefined`, and do not remove an existing `| null`. Fix a type-vs-`@default` mismatch only
  by WIDENING the type to match the runtime (for example, add `| null`); leave the runtime
  default and the `@default` tag unchanged.

## Categories

- **A — scalar/collection option** (a key in `defaultOptions`): concrete stored default
  -> `T`; stored `undefined` -> `T | undefined`; meaningful `null` -> `T | null`.
  Callbacks/events are the `undefined` case: `((e) => void) | undefined`, `@default
  undefined`, never `| null`.
- **A-obj — object-valued option** (the value is a config the runtime merges, e.g.
  `editing`, `paging`, `tooltip`, `dropDownOptions`): type is `T` without `| undefined`. A
  `@default` (**R4**) is needed only when `getDefaultOptions` stores a value that DIFFERS from
  the referenced type's own defaults — i.e. a runtime override worth documenting. The referenced
  type (`PopupProperties`) already documents its sub-properties' defaults, so an empty seed
  (`{}`, no override) needs no `@default`. An INLINE object whose sub-properties carry their
  own `@default` needs no container `@default`. (Not lint-enforced — a review judgment.) Avoid the "optional feature, off by default"
  pattern (`fooOptions?: ... | undefined`) in new design — it overloads one option with both
  the config and the on/off flag; prefer a separate boolean flag plus a config option
  (`fooEnabled: boolean` + `fooOptions: NestedProperties`).
- **B — object property** (a data-object field such as `Message`, or a config-item
  sub-property such as `TextEditorButton`): bare `foo?: T` without `| undefined`; NO
  `@default`. The default is a point-of-use fallback that is never stored, so reading the
  option via `.option()` would not return it. Do not document the behavior in the `.d.ts` —
  technical writers do that in a separate documentation repository; here you simply omit
  `@default`.

## Correct vs incorrect examples

```ts
// A — option whose stored default is undefined: the type must carry | undefined
/** @default undefined */
filterValues?: Array<any> | undefined;        // correct
/** @default undefined */
filterValues?: Array<any>;                     // incorrect: @default undefined, but no | undefined in the type

// A — @default null requires null in the type
/** @default null */
editRowKey?: TKey | null;                      // correct
/** @default null */
editRowKey?: TKey;                             // incorrect: @default null, but the type allows neither null nor undefined

// A-obj (reference) — @default documents a runtime override of the type's defaults
/** @default { showTitle: false } */
dropDownOptions?: PopupProperties;             // correct: getDefaultOptions overrides showTitle
dropDownOptions?: PopupProperties;             // correct: seed {} (no override) -> no @default
// A-obj (inline) — sub-properties carry their own @default; the container needs none
editing?: {
  /** @default false */ allowDeleting?: boolean;
};                                             // correct

// B — a data-object / config-item field: no @default (value isn't stored), no prose in the .d.ts
/**
 * @docid
 * @public
 */
type?: MessageType;                            // correct
/** @default "after" */
location?: TextEditorButtonLocation;           // incorrect: @default whose value isn't stored in defaultOptions
```

## Review checklist

- **R1**: `@default null` present -> the type must include `null`.
- **R2**: a concrete `@default` (not `null`/`undefined`) -> the type must NOT include `| undefined`.
- **R3**: `@default undefined` present -> the type must include `| undefined`.
- **R4**: an object-valued option -> add a `@default` only when `getDefaultOptions` stores a value
  that DIFFERS from the referenced type's own defaults (a runtime override); an empty seed
  (`{}`) or an INLINE object whose sub-properties carry their own `@default` needs none. (Not
  lint-enforced — a review check.)
- A data-object / config-item field (not a stored option) -> no `@default`; remove any
  `@default` whose value isn't stored in `defaultOptions` (a point-of-use default in a
  `switch`/`case`). Behavior is documented by tech writers elsewhere, not in the `.d.ts`.
- A new field meaning "no value" -> default to `undefined`, not `null`; flag any `null` that
  has no `=== null` justification.
- An existing field -> never propose migrating a runtime `null` to `undefined` or removing
  `| null` (both are breaking changes); only widen the type.

Apply these consistently to every `.d.ts` field you write, complete, or review.
