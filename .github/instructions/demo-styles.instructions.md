---
applyTo: "apps/demos/Demos/**"
---

# Demo styles are page-level, not component-level

A demo is a single page with a single component tree, and its four framework
variants (jQuery, React, Angular, Vue) are presented to users as equivalents of
the same demo. They must render identically. Component-level style encapsulation
breaks both properties, so demo styles are always authored globally.

| Framework | How |
|---|---|
| jQuery, React | global `styles.css` |
| Vue | plain `<style>` — never `<style scoped>` |
| Angular | `::ng-deep`, or `encapsulation: ViewEncapsulation.None` |

## Vue

Use `<style>`. `vue/enforce-style-attribute` (`allow: ['plain']`) fails the build
on `scoped` and `module`.

Encapsulation cannot work in these demos even when spelled correctly. Vue stamps
`data-v-*` inside its renderer, at vnode patch time. DevExtreme widgets build
their subtree with direct DOM calls after mount, so those nodes never pass
through Vue's renderer and never receive the attribute — every rule targeting
`.dx-*` internals silently dies. Rules targeting `#app` or `body` are worse
still: those elements are *ancestors* of the mounted component, and scoping only
reaches downward, so not even `:deep()` can address them.

Until the esbuild migration this was invisible: the old SystemJS loader
(`dx-systemjs-vue-browser`) appended `<style>` text to `<head>` verbatim and
never read the `scoped` attribute at all. Every Vue demo style block was global
in practice. `scoped` was decoration.

## Adding a demo

`pnpm run add-demo` can scaffold from an existing demo, which copies that demo's
files wholesale — including its style conventions. Check the styles you inherited
rather than assuming the source demo was right.
