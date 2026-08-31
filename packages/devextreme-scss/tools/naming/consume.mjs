/*
 * Wave F, the consumption side: rewrites a folder's _index.scss so that plain declarations read
 * the emitted --dx-* component tier instead of the SCSS variable — `padding: $toast-item-gap;`
 * becomes `padding: var(--dx-toast-item-gap);`. One hop through the custom property the theme
 * itself declares on the component's root (tools/naming/registries.json -> rootSelectors), so the
 * rendered value is unchanged and per-instance overrides start to work.
 *
 *   node tools/naming/consume.mjs <folder> [<folder> …]   # e.g. badge toast splitter
 *   node tools/naming/consume.mjs --mixin-args <folder> [<folder> …]
 *   node tools/naming/consume.mjs --wiring                # all `@use …base… with ()` blocks
 *
 * --wiring rewrites the VALUES of base `with ()` configuration across the whole theme: a value
 * that is exactly one manifest variable becomes `var(--dx-…)`. Reviewed precondition (wave F7,
 * 13.08.2026): every base parameter wired to a manifest variable is a pure PRINT across the whole
 * base source — no math, no control flow, no data-uri (the classifier run is recorded in
 * RENAME_PROGRESS.md). Keys are base's spelling and stay untouched; legacy themes are untouched
 * by construction (the blocks live in fluent-next folders).
 *
 * Deliberately conservative: only a declaration whose value is a whitespace-separated list of
 * manifest variables of the folder's OWN component and literal CSS tokens is converted. Anything
 * else — interpolation, Sass functions or operators, namespaced reads, another component's names,
 * `@use … with ()` wiring, mixin arguments — is reported and left for a reviewed manual edit,
 * because the safety of `var()` there depends on what the receiver does with the value.
 * No fallbacks on purpose: inside the theme the declaration is guaranteed by the emitted tier
 * (fallbacks would double the bundle and hide a broken emission; consumers OUTSIDE the theme are
 * the ones that must pass a fallback — NAMING.md).
 *
 * --mixin-args converts manifest variables inside `@include <mixin>(…)` argument lists, and ONLY
 * for mixins on the reviewed allowlist below: every allowlisted body either prints its parameters
 * verbatim into declarations or guards its Sass math with `if(meta.type-of(…) == number, …,
 * calc(…))` — a var() argument takes the calc branch, exactly like the token bridge already does.
 * `with ()` wiring is untouched (it is @use configuration, not a call). The exclusion map lists
 * the parameters a body uses in UNGUARDED math, where a var() would produce invalid CSS.
 */

/* wave F6, reviewed 13.08.2026 — see NAMING.md "wave F as-built" and RENAME_PROGRESS.md */
const VAR_SAFE_MIXINS = new Set([
  'dx-icon-sizing', 'dx-icon-margin', 'dx-icon-font-centered-sizing', 'gradient-linear',
  'dx-button-styling', 'dx-button-styling-variant', 'dx-button-flat-color-styling',
  'dx-button-outlined-color-styling', 'resize-handle-states',
  'dx-texteditor-search-icon', 'dx-dropdownbutton', 'invalid-dropdowneditor-input-padding',
  'dx-field-value-widget-position', 'dx-fieldset-sizing', 'informer',
  'loadindicator-animation-sparkle', 'dx-lookup-arrow', 'dx-radiobutton-states-mixin',
  'dx-scrollable-scroll-content', 'dx-scrollable-scrollbar-hoverable',
  'dx-scrollable-scrollbar-vertical', 'dx-scrollable-scrollbar-horizontal',
  'dx-scrollable-scrollbars-alwaysvisible',
  'dx-switch', 'dx-switch-states-fluent', 'dx-switch-rtl', 'dx-textarea',
  'dx-editor-outlined', 'dx-editor-filled', 'dx-editor-underlined',
  'dx-editor-buttons-container-material', 'dx-toolbar-sizing', 'dx-toolbar-item-padding',
  'dx-base-validation', 'dx-modern-styles-validation',
  // wave H — base/colorView/_mixins.scss: the two handle colours are printed verbatim into
  // radial-gradient/box-shadow/border-color, no math and no control flow
  'dx-base-colorview-styles',
  /*
   * wave H — calendar and checkBox. The calendar bodies print their parameters; the one place with
   * Sass math (`with-footer` height) already carries the meta.type-of guard, and the cell mixin's
   * alpha uses the same bridge guard as the token bridges. The two parameters that ARE unguarded
   * math (`$calendar-width * 2`, `math.div(-$icon-height, 2)`) are excluded below.
   */
  'dx-calendar-mixin', 'dx-calendar-navigator-mixin', 'dx-calendar-body-mixin',
  'dx-calendar-cell-mixin', 'dx-calendar-cell-in-range-mixin',
  'dx-checkbox-icon-centered', 'dx-checkbox-icon-indeterminate',
  /*
   * wave H — treeView, speedDialAction and the theme's own list sizing. Every body either prints
   * its parameters or guards the math with meta.type-of; dx-fa-button-mixin's color.adjust branch
   * is the null-fallback for legacy callers and this theme passes ready state colours instead.
   */
  'default-expander-icon', 'treeview-item', 'treeview-checkbox', 'treeview-aux-items',
  'dx-fa-button-mixin', 'dx-list-sizing', 'dx-radiogroup-mixin',
  // the theme's own tabs indicator: the body prints the colour into `&::after { background-color }`
  'dx-tabs-indicator-background',
  // scheduler header sizes and the theme's icon-only button sizing: both are plain prints
  'header-sizes', 'dx-button-onlyicon-sizing',
  /*
   * wave H — chat, stepper and diagram's connector. Every body either prints its parameters or
   * guards its Sass math with the meta.type-of test (`$gap * 2`, the empty-icon padding, the
   * preview inset), which takes the calc() branch for a var() argument.
   */
  'chat', 'chat-alertlist', 'chat-avatar', 'chat-confirmation-popup', 'chat-file', 'chat-fileview',
  'chat-messagebox', 'chat-messagebubble', 'chat-messagegroup', 'chat-messagelist',
  'chat-messagelist-contextmenu', 'chat-messagelist-empty', 'chat-suggestions',
  'chat-typingindicator', 'message-editing-preview', 'connector', 'step', 'step-states', 'stepper',
  // wave F7a — base/gridBase/layout/aiChat/_mixins.scss, every body is a plain print
  'ai-chat-messagelist-empty', 'ai-chat-message-pending', 'ai-chat-message-success',
  'ai-chat-message-error', 'ai-chat-messagebubble-border', 'ai-chat-message-regenerate-button',
  'ai-chat-message-icon',
]);

/* mixin -> variables that must STAY SCSS at its call sites (unguarded math in the body) */
const VAR_UNSAFE_ARGS = new Map([
  // clip-path: inset(-$texteditor-label-font-size …) — unary minus over a var() string
  // would print `-var(--dx-…)`, an invalid value
  ['dx-editor-outlined', new Set(['$text-editor-label-font-size'])],
  // width: $calendar-width * 2 (the multiview calendar) — unguarded multiplication
  ['dx-calendar-mixin', new Set(['$calendar-legacy-width'])],
  // margin-top/-inline-start: math.div(-$icon-…, 2) — unguarded division of a negated parameter
  ['dx-checkbox-icon-centered', new Set(['$check-box-arrow-icon-size'])],
  // the same division, reached through the forward to dx-checkbox-icon-centered
  ['dx-checkbox-icon-indeterminate', new Set([
    '$check-box-indeterminate-icon-height', '$check-box-indeterminate-icon-width',
  ])],
]);

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));

/* The tier's contents are read from the handwritten _public.scss (wave F13 removed the json manifest). */
const walkScss = (dir, out = []) => {
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walkScss(abs, out);
    else if (entry.name.endsWith('.scss')) out.push(abs);
  });
  return out;
};
const surface = {
  names: walkScss(themeRoot)
    .filter((file) => file.endsWith('_public.scss'))
    .flatMap((file) => {
      const folder = file.slice(themeRoot.length + 1).split('/')[0];
      return [...readFileSync(file, 'utf8').matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .map(([, name]) => ({
          public: name,
          source: `$${name.slice('--dx-'.length)}`,
          component: registries.components[folder],
        }));
    }),
};

const mixinArgsMode = process.argv[2] === '--mixin-args';
const wiringMode = process.argv[2] === '--wiring';
const folders = process.argv.slice(mixinArgsMode ? 3 : 2);
if (!folders.length && !wiringMode) {
  process.stderr.write('usage: node tools/naming/consume.mjs [--mixin-args|--wiring] <folder> [<folder> …]\n');
  process.exit(1);
}

/*
 * Wiring values that must stay SCSS, whatever the manifest says. Each one is read by base in a way
 * a var() string cannot survive: unguarded Sass math, or a build-time flag that decides which
 * rules exist at all. Without this list a later `--wiring` run would silently undo the decision.
 */
const WIRING_UNSAFE = new Set([
  '$scheduler-left-column-width',            // `$x * $scheduler-small-size-factor` in base
  '$scheduler-appointment-bg-focused',       // `@if $fill-focused-appointment` — a flag, not a value
  '$scheduler-appointment-shadow-focused',   // `@if $is-shadow-color-for-focused-state`
]);

if (wiringMode) {
  const manifestNames = new Set(surface.names
    .map((name) => name.source)
    .filter((name) => !WIRING_UNSAFE.has(name)));
  const walkTheme = (dir, out = []) => {
    readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) walkTheme(abs, out);
      else if (entry.name.endsWith('.scss')) out.push(abs);
    });
    return out;
  };
  let converted = 0;
  let files = 0;
  walkTheme(themeRoot).forEach((file) => {
    const source = readFileSync(file, 'utf8');
    const out = source.replace(/(@use\s+"[^"]*base[^"]*"(?:\s+as\s+[\w*-]+)?\s+with\s*\()([\s\S]*?)(\)\s*;)/g,
      (whole, head, block, tail) => {
        const next = block.replace(/(:\s*)(\$[a-z0-9-]+)(\s*(?:,|$|\n))/g, (m, before, token, after) => {
          if (!manifestNames.has(token)) return m;
          converted += 1;
          return `${before}var(--dx-${token.slice(1)})${after}`;
        });
        return `${head}${next}${tail}`;
      });
    if (out !== source) {
      writeFileSync(file, out);
      files += 1;
    }
  });
  process.stdout.write(`wiring: converted ${converted} with() value(s) in ${files} file(s)\n`);
  process.exit(0);
}

const manifestOf = (component) => new Map(surface.names
  .filter((name) => name.component === component)
  .map((name) => [name.source, name.public]));

/* a value convertible in place: only own manifest $names and literal CSS tokens, no calls/math */
const convertValue = (value, names) => {
  if (/[#{}()*/+]|(^|\s)-(\s|$)|\$[a-z0-9-]+\.|[a-z0-9-]+\.\$/i.test(value)) return null;
  const tokens = value.trim().split(/\s+/);
  let converted = 0;
  const out = tokens.map((token) => {
    if (!token.startsWith('$')) return token;
    const name = names.get(token);
    if (!name) return null;
    converted += 1;
    return `var(${name})`;
  });
  if (!converted || out.includes(null)) return null;
  return out.join(' ');
};

/* --mixin-args: rewrite manifest variables inside allowlisted @include argument lists */
const convertMixinArgs = (folder, component, file) => {
  const names = manifestOf(component);
  let converted = 0;
  const skippedMixins = new Set();
  const source = readFileSync(file, 'utf8');
  const out = source.replace(/@include\s+([\w.-]+)\s*\(([^;]*?)\)(\s*);/gs, (whole, mixin, args, tail) => {
    const base = mixin.slice(mixin.indexOf('.') + 1);
    const hasManifest = [...args.matchAll(/\$[a-z0-9-]+/g)].some(([t]) => names.has(t));
    if (!hasManifest) return whole;
    if (!VAR_SAFE_MIXINS.has(base)) {
      skippedMixins.add(mixin);
      return whole;
    }
    const unsafe = VAR_UNSAFE_ARGS.get(base) ?? new Set();
    const next = args.replace(/(^|[^\w.{-])(\$[a-z0-9-]+)/g, (m, before, token) => {
      if (!names.has(token) || unsafe.has(token)) return m;
      converted += 1;
      return `${before}var(--dx-${token.slice(1)})`;
    /* the interpolated form inside a computed argument prints verbatim — same one-to-one swap */
    }).replace(/#\{\s*(\$[a-z0-9-]+)\s*\}/g, (m, token) => {
      if (!names.has(token) || unsafe.has(token)) return m;
      converted += 1;
      return `var(--dx-${token.slice(1)})`;
    });
    return `@include ${mixin}(${next})${tail};`;
  });
  writeFileSync(file, out);
  process.stdout.write(`${folder} (${component}): converted ${converted} mixin argument(s)\n`);
  skippedMixins.forEach((m) => process.stdout.write(`  not allowlisted, left as is: ${m}\n`));
};

folders.forEach((folder) => {
  /* a path with a slash names a specific rule file of the folder (e.g. gridBase/layout/cell.scss) */
  const explicitFile = folder.includes('/');
  const owner = explicitFile ? folder.slice(0, folder.indexOf('/')) : folder;
  const component = registries.components[owner];
  const file = explicitFile ? join(themeRoot, folder) : join(themeRoot, folder, '_index.scss');
  if (!component || !existsSync(file)) {
    process.stderr.write(`${folder}: not a component folder with an _index.scss\n`);
    process.exitCode = 1;
    return;
  }
  if (mixinArgsMode) {
    convertMixinArgs(folder, component, file);
    return;
  }
  const names = manifestOf(component);
  const report = { converted: 0, skipped: [] };

  const lines = readFileSync(file, 'utf8').split('\n').map((line) => {
    const match = /^(\s*)([a-z-]+)\s*:\s*([^;]*);(\s*)$/.exec(line);
    const mentionsManifest = [...line.matchAll(/\$[a-z0-9-]+/g)]
      .some(([token]) => names.has(token));
    if (!match) {
      if (mentionsManifest) report.skipped.push(line.trim());
      return line;
    }
    const [, indent, property, value, tail] = match;
    const converted = convertValue(value, names);
    if (converted) {
      report.converted += 1;
      return `${indent}${property}: ${converted};${tail}`;
    }
    /*
     * An interpolation prints its content verbatim into the value, so a manifest variable inside
     * `#{…}` (the calc-string pattern: `calc(#{$x} + 1px)`) converts to var() one-to-one. Only
     * declaration lines — interpolations in selectors and property names are never touched.
     */
    if (mentionsManifest && /#\{/.test(value)) {
      let hits = 0;
      const next = value.replace(/#\{\s*(\$[a-z0-9-]+)\s*\}/g, (m, token) => {
        if (!names.has(token)) return m;
        hits += 1;
        return `var(--dx-${token.slice(1)})`;
      });
      if (hits) {
        report.converted += hits;
        return `${indent}${property}: ${next};${tail}`;
      }
    }
    if (mentionsManifest) report.skipped.push(line.trim());
    return line;
  });

  writeFileSync(file, lines.join('\n'));
  process.stdout.write(`${folder} (${component}): converted ${report.converted} declaration(s)\n`);
  report.skipped.forEach((line) => process.stdout.write(`  left for review: ${line}\n`));
});
