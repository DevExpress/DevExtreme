---
mode: agent
description: Propagate a DevExtreme public API change into the Angular, React, and Vue wrappers.
---

# Update the framework wrappers after a public API change

Use this when a wrapped component's public API changed in
`packages/devextreme/js/{ui,viz}/**/*.d.ts` and the Angular/React/Vue wrappers must be
brought back in sync. The wrappers are maintained by hand — do **not** run the retired
`regenerate-all` / metadata pipeline.

Follow the anatomy and rules in:
- [.github/instructions/public-api-wrappers.instructions.md](../instructions/public-api-wrappers.instructions.md)
- [.github/instructions/wrapper-angular.instructions.md](../instructions/wrapper-angular.instructions.md)
- [.github/instructions/wrapper-react.instructions.md](../instructions/wrapper-react.instructions.md)
- [.github/instructions/wrapper-vue.instructions.md](../instructions/wrapper-vue.instructions.md)

## Steps

1. **Identify the change.** For the changed component's `.d.ts`, diff the options interface
   (e.g. `dxButtonOptions` / `Properties`), its events (`onX` + `*Event` types), and nested
   option types. List every option/event/type that was **added, removed, renamed, or
   retyped**, and flag removals/renames/incompatible retypes as **breaking**.
2. **Locate the wrapper files** for the same component in each package:
   - Angular: `packages/devextreme-angular/src/ui/<component>/index.ts`, plus the
     component's own nested option files in `src/ui/<component>/nested/*`. Never edit the
     deprecated shared `src/ui/nested/**`.
   - React: `packages/devextreme-react/src/<component>.ts`
   - Vue: `packages/devextreme-vue/src/<component>.ts`
3. **Apply the change in all three wrappers**, using each framework's mapping:
   - Angular: `@Input` getter/setter, `<option>Change` output, `_createEventEmitters` entry;
     `@Output() onX` for events. Nested option types are updated in
     `ui/<component>/nested/*`.
   - React: `Properties` flows automatically; update `I<Name>OptionsNarrowedEvents`,
     `independentEvents`, `subscribableOptions`/`defaults`, `templateProps`, nested
     `_component*`/`expectedChildren` as needed.
   - Vue: `AccessibleOptions` `Pick`, `props` (correct runtime type + `PropType`), and
     `emits` `update:<prop>`.
   Keep option/event order and imports aligned with the `.d.ts`.
4. **Do not touch** `src/core/**` in any wrapper package.
5. **Verify.** From `packages/devextreme`, run `pnpm run regenerate` and then `pnpm run lint-dts`. Type-check/build the affected wrapper package(s).
6. **Report** the applied changes per framework and call out any breaking changes explicitly.
