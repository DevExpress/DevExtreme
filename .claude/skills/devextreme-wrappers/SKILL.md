---
name: devextreme-wrappers
description: Keep the hand-maintained Angular, React and Vue wrappers (packages/devextreme-{angular,react,vue}/src) in sync with DevExtreme's public API. Use whenever a change touches a wrapped component's public API — an option, event, event type, nested option type or template option in packages/devextreme/js/{ui,viz}/**/*.d.ts, or a wrapper-relevant JSDoc tag (@hidden, @hidden false, @fires, @type, @docid, @deprecated, @isEditor) in a public .d.ts or .js file, including base classes like editor.js or ui.widget.js. Also use when adding a wrapper for a new component, when editing any file under devextreme-angular/devextreme-react/devextreme-vue src/, when reviewing a PR that changes public API, or when someone asks "do the wrappers need updating?", "regenerate the wrappers", or why a wrapper is missing an option — even if they mention only one framework.
---

# DevExtreme framework wrappers

The Angular, React and Vue wrappers are **not generated any more**. They are ordinary source files, edited in the same PR as the public API change. No CI job
compares them with the `.d.ts`: builds and tests pass even when a wrapper is missing an
option, so `scripts/surface-check.mjs` (below) is what catches a miss.

The detailed rules live in `.github/` (Copilot loads them from there too). Open them when a
step below points to them:

- `.github/instructions/public-api-wrappers.instructions.md` — what counts as a wrapper change; where each change lands (mapping table); reviewer checklist
- `.github/instructions/wrapper-{angular,react,vue}.instructions.md` — file anatomy per framework
- `.github/templates/wrapper-{angular,react,vue}/README.md` — the retired generator's exact rules (numbered §s), plus `*.tmpl` files for new components

## Rules for every task

- **Never run the wrapper generator.** `nx regenerate devextreme-{angular,react,vue}` and
  `nx generate-components …` still exist; they rebuild `src/ui/**` from metadata and overwrite
  every hand edit. The only "regenerate" to run is `pnpm run regenerate` **from
  `packages/devextreme`** — it updates `dx.all.d.ts` and the TS reexports, not the wrappers.
- **Don't edit `src/core/**`** in any wrapper package. One exception: a new collection option
  name gets its `PROPERTY_TOKEN_<name>` in `packages/devextreme-angular/src/core/tokens/index.ts`.
- **Don't touch `packages/devextreme-angular/src/ui/nested/**`** — deprecated, being removed.
  Use the component's own `ui/<name>/nested/`.
- **Don't open the big wrappers** (`data-grid`, `tree-list`, `card-view`, `chart`) to learn a
  pattern. The template READMEs state the rule; when unsure, open the small reference wrapper
  the README names.
- **Keep generator order**: options, events and emitter entries alphabetical within their
  group; registration lists (`index.ts`, `all.ts`) alphabetical.
- **All three wrappers, same PR.** One exception: an ordinary option (not an event, template,
  two-way `@fires`, or nested option) needs **no React change** — it arrives through `Properties`.

**Names:** the wrapper file name is the kebab-case component name in all three packages:
`select-box` → `devextreme-react/src/select-box.ts`, `devextreme-vue/src/select-box.ts`,
`devextreme-angular/src/ui/select-box/index.ts` (Popup's Angular class is in
`ui/popup/component.ts`). The `.d.ts` module is in the Vue file's
`import X, { Properties } from "devextreme/ui/<module>"` line.

## Propagate an API change

1. **Is it wrapper-affecting?** Yes for an option, event, event type, nested option type or
   template option added/removed/renamed/retyped, and for a change to `@hidden` (incl.
   `@hidden false`), `@type`, `@fires`, `@type_function_param1 e:{…}`, `@docid`,
   `@deprecated`, `@isEditor`, `@hasTranscludedContent`. No for `js/__internal/**`, re-export
   lines in a public `.js`, and description-only JSDoc — say so and stop.

2. **List the change.** Read `git diff <base>` of `packages/devextreme/js/{ui,viz,common}` and
   run `surface-check.mjs --changed <base>` (or `--all` for a base-class change): it lists
   options the `.d.ts` now exposes but the wrappers don't, and the reverse. Retypes, `@fires`,
   narrowed events and nested types don't show there — take them from the diff. Write down each
   item as added / removed / renamed / retyped / hidden / un-hidden, which components it
   affects, and which items are **breaking**.

   A base-class change (`WidgetOptions`, `EditorOptions`, `CollectionWidgetOptions`,
   `dxTextEditorOptions`, …) affects every widget that inherits it; `--all` names them.

3. **Find nested reuses of a changed type.** An options interface is often reused as the type
   of a field in other components — `dxButtonOptions` is TextBox/SelectBox/… `buttons[].options`,
   Form `buttonOptions`, and more. Each such field is a **nested option component** in those
   components' wrappers, with its own copy of the fields. Search the public `.d.ts` files for
   imports of the changed type (often aliased, e.g. `Properties as ButtonProperties`) and the
   fields typed with it, then update the matching nested component in every component that
   exposes the field. The surface check doesn't cover nested components, so this step is
   manual.

4. **Apply it to each wrapper** (mapping table in `public-api-wrappers.instructions.md`, plus
   the README § named here):
   - **Option added / un-hidden** — Angular `ui/<c>/index.ts`: `@Input()` getter/setter with the
     exact type (keep `| undefined` and union members, README §2), `@Output() <opt>Change`,
     `{ emit: '<opt>Change' }` in `_createEventEmitters`. React: nothing, unless it's a template
     option (`templateProps` + `<x>Render`/`<x>Component`, README §5) or two-way via `@fires`
     (`default<Opt>`/`on<Opt>Change`, `subscribableOptions`/`defaults`, README §4). Vue:
     `AccessibleOptions`, `props` with the right runtime constructor(s) and `PropType`
     (README §2 — most mistakes happen here), `"update:<opt>": null` in `emits`.
   - **Event added** — Angular: `@Output() onX: EventEmitter<XEvent>` +
     `{ subscribe: 'x', emit: 'onX' }`. React: `independentEvents` unless the name contains
     `Changed` without `Value` (README §2); `I<Name>OptionsNarrowedEvents` only when the JSDoc is
     `e:{module:XEvent}` (README §3). Vue: `AccessibleOptions`,
     `Function as PropType<((e: XEvent) => void)>`, `emits`.
   - **Removed / renamed / newly hidden** — remove or rename in every place above, in all three
     wrappers, plus now-unused imports. **Breaking.**
   - **Retyped** — Angular getter/setter and `<opt>Change` types; Vue constructors and
     `PropType`; React narrowed event types. Incompatible retypes are **breaking**.
   - **Nested / collection option** — Angular `ui/<c>/nested/*` (README §5; new collection name
     → `PROPERTY_TOKEN_<name>`), React `_component*` + `Object.assign` + the owner's
     `expectedChildren` (README §6), Vue configuration component (README §5).
   - **New types in a signature** — add the type imports (Angular README §6, React §8, Vue §3).
   - **Editor status** — gaining or losing `onValueChanged` adds or removes Angular EDITOR
     wiring (`ControlValueAccessor`, `onBlur`, HostListeners; Angular README §1).

5. **Verify and report** (below).

## Add wrappers for a new component

Per framework, read "Adding a new component" in `wrapper-<fw>.instructions.md`, then follow §0
of `.github/templates/wrapper-<fw>/README.md` and fill `component.ts.tmpl` (Angular also
`nested.ts.tmpl` per nested component). Don't read other wrappers.

| | Create | Register |
|---|---|---|
| Angular | `src/ui/<name>/index.ts`, `ng-package.json`, and `nested/` (one file per nested component + `index.ts` + `ng-package.json`) | `src/index.ts` export; `src/ui/all.ts` import **and** `Dx<Name>Module` in both `imports` and `exports` of `DevExtremeModule`; `PROPERTY_TOKEN_<name>` for new collection names |
| React | `src/<name>.ts` (nested config components in the same file) | `src/index.ts` export |
| Vue | `src/<name>.ts` (configuration components in the same file) | `src/index.ts` export |

Never create anything under `devextreme-angular/src/metadata/generated/**`. Work out once
from the `.d.ts` and reuse in all three: visible options/events, independent and narrowed
events, template options (named `template`/`…Template` **and** typed with `template`), two-way
options (`@fires`), EDITOR status (Angular) and `@isEditor` (Vue), nested and collection options.

## Review a PR that changes public API

Comment on the wrappers and the API contract only; don't suggest regenerating the wrappers.

1. Classify the public `.d.ts`/`.js` changes (step 1 above).
2. Run `surface-check.mjs --changed <base>` (`--all` for a base class). Each failure is a
   finding; name the missing wrapper(s).
3. Check what the script can't: type fidelity (Angular types, Vue constructors + `PropType`,
   React narrowed events), React two-way wiring, nested components (including reuses, step 3
   above), no `src/core/**` edits except Angular `tokens/index.ts`, nothing under Angular
   `ui/nested/**`, alphabetical order.
4. Label breaking changes: removed/renamed/newly hidden options or events (for a base-class
   change, list the inheriting widgets), incompatible retypes, removed/restructured nested types.

## Surface check

```bash
node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs <component...>     # e.g. button select-box
node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs --changed [<base>]  # touched since <base> + uncommitted; default: the branch's upstream
node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs --all               # every component, ~2 s
```

Run from the repo root; it reads the `.d.ts` **source**, so no build is needed. It compares the
top-level surface with the three wrappers:

- `.d.ts` visibility follows the documentation model: `@hidden` / `@hidden false` on members
  and in `@name`/`@docid` blocks, resolved along the class chain (`@inherits`);
- Vue: `AccessibleOptions` = `props` = `emits` `update:*`;
- Angular: `@Input`s + `on*` outputs = the Vue set; each input has `<opt>Change` and an
  `{ emit }` entry; each event has `{ subscribe, emit }`; `onBlur` exactly on EDITORs;
- React: `independentEvents` and `templateProps` of the main component.

It does **not** check types, nested option components, React two-way wiring or React narrowed
events — check those by reading the diff. On a clean main every component passes, so a failure
after your change is yours to explain. For a shared base file, `--changed` can't map it to
components; run `--all`.

## Verify

The wrappers resolve `devextreme/*` from `packages/devextreme/artifacts`, so type-checks need
a fresh devextreme build. **Don't start `pnpm run dev`** — ask the developer to confirm their
dev build finished (or run `pnpm nx build:dev devextreme` only if they say so). Then:

```bash
cd packages/devextreme && pnpm run regenerate && pnpm run lint-dts
cd packages/devextreme-react && ../../node_modules/.bin/tsc --noEmit -p tsconfig.json
cd packages/devextreme-vue   && ../../node_modules/.bin/tsc --noEmit -p tsconfig.json
pnpm nx build devextreme-angular        # ng-packagr; plain tsc checks nothing here
node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs <components>
grep -rnE "__[A-Za-z_]+__|^//#" <new or edited wrapper files>   # leftover template placeholders
```

CI runs the wrapper unit tests (`pnpm nx test devextreme-{angular,react,vue}`, in
`wrapper_tests.yml`); run them locally after nested, template or two-way changes.

## Report

Per framework, what changed — or "no change needed" and why (e.g. an ordinary option in
React). Call out every **breaking** change explicitly: removed or renamed option/event, newly
`@hidden` (with the affected widgets for a base-class change), incompatible retype, removed or
restructured nested type.
