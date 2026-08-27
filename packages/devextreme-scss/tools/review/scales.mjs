/*
 * The scales report: what the theme could not put on a package step, and why.
 *
 *   node tools/review/scales.mjs           # → scss/widgets/fluent-next/SCALES.html + SCALES.md
 *   node tools/review/scales.mjs --md      # markdown only, to stdout
 *
 * Categories and their markers live in tools/review/size-markers.json — the same list the gate
 * tools/review/px-audit.mjs reads, so the report and the gate cannot drift.
 *
 * Categories with `source: "sources"` are read from the code by the marker in the comment; the
 * calc() one is read from the BUILT bundle, because what matters there is how many expressions
 * actually reach the browser.
 *
 * The report computes the "step" column itself: the value is converted to rem at a 16px root and
 * looked up in the package scale (`scss/_design-system/base.scss`, a generated directory). It
 * answers the question that otherwise has to be checked by hand for every row — does a step with
 * exactly this value already exist, or is design being asked for a new one?
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const widgetsDir = join(packageRoot, 'scss', 'widgets');
const themeDir = join(widgetsDir, 'fluent-next');
const cssDir = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const mdOnly = process.argv.includes('--md');

/* ------------------------------------------------------------------ reading */

const scssFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = join(dir, entry.name);
  if (entry.isDirectory()) return scssFiles(full);
  return entry.name.endsWith('.scss') ? [full] : [];
});

const sources = new Map();
[themeDir, join(widgetsDir, 'base')].forEach((dir) => {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
  scssFiles(dir).forEach((file) => sources.set(file, readFileSync(file, 'utf8').split('\n')));
});

const widgetOf = (file) => {
  const rel = relative(widgetsDir, file);
  const parts = rel.split('/');
  if (parts[0] === 'base') return `base/${parts[1]?.replace(/^_|\.scss$/g, '') ?? ''}`;
  const name = parts[1]?.replace(/^_|\.scss$/g, '') ?? '';
  return parts.length > 2 ? parts[1] : (name || 'shared');
};

/* ------------------------------------------------------------ categories */

const vocabulary = JSON.parse(readFileSync(join(here, 'size-markers.json'), 'utf8'));
const MARKERS = vocabulary.categories.filter((entry) => entry.source === 'sources');
const CALC_CATEGORY = vocabulary.categories.find((entry) => entry.source === 'bundle');

/* -------------------------------------------------------- package steps */

/**
 * Package scales: family -> value in rem -> step names. Negative values live in a separate
 * `spacing-minus` family, so that is the one asked for a negative literal.
 */
const scaleSteps = () => {
  const file = join(packageRoot, 'scss', '_design-system', 'base.scss');
  const families = new Map();
  if (!existsSync(file)) return families;
  [...readFileSync(file, 'utf8').matchAll(/--dxds-([a-z-]+)-(\d+):\s*(-?[\d.]+)rem;/g)]
    .forEach(([, family, step, rem]) => {
      if (!families.has(family)) families.set(family, new Map());
      const byValue = families.get(family);
      const value = Number(rem);
      if (!byValue.has(value)) byValue.set(value, []);
      byValue.get(value).push(`${family}-${step}`);
    });
  return families;
};

const steps = scaleSteps();
const ROOT_FONT_SIZE = 16;

/** `-1px` in the `spacing` family -> `ds.$spacing-minus-10`, when such a step exists. */
const stepFor = (literal, family) => {
  if (!family || !literal.endsWith('px')) return null;
  const px = Number(literal.slice(0, -2));
  if (!Number.isFinite(px) || px === 0) return null;
  const scale = px < 0 && steps.has(`${family}-minus`) ? steps.get(`${family}-minus`) : steps.get(family);
  const names = scale?.get(px / ROOT_FONT_SIZE);
  return names?.length ? `ds.$${names[0]}` : null;
};

const stepsFor = (value, family) => [...new Set((value.match(/-?\d*\.?\d+px/g) ?? [])
  .map((literal) => stepFor(literal, family))
  .filter(Boolean))];

/*
 * The family is chosen by the property, not by the category: the same number exists in several
 * scales at once, and `ds.$spacing-130` for a font size points the wrong way. The variable name is
 * as good a hint as the property: `$pivot-grid-area-font-size` speaks for itself.
 */
const FAMILY_BY_PROPERTY = [
  [/font-size/, 'font-size'],
  [/line-height/, 'line-height'],
  [/border-radius/, 'border-radius'],
  [/border-width|outline-width|\bborder\b/, 'border-width'],
];

const familyFor = (hint, fallback) => (
  FAMILY_BY_PROPERTY.find(([pattern]) => pattern.test(hint))?.[1] ?? fallback);

/** A line of code -> what it is: a variable declaration, a property, a mixin argument. */
const describe = (line) => {
  const declaration = /^\s*(\$[\w-]+)\s*:\s*(.+?)\s*(?:!default)?\s*;/.exec(line);
  if (declaration) return { kind: 'variable', name: declaration[1], value: declaration[2].replace(/\s*!default\s*$/, '') };
  const property = /^\s*([a-z-]+)\s*:\s*(.+?)\s*;/.exec(line);
  if (property) return { kind: 'property', name: property[1], value: property[2] };
  const argument = /^\s*(\$[\w-]+)\s*:\s*(.+?),?\s*$/.exec(line);
  if (argument) return { kind: 'argument', name: argument[1], value: argument[2].replace(/,$/, '') };
  return { kind: 'other', name: '', value: line.trim() };
};

/**
 * Where the value actually lands. Besides the direct `property: $variable`, two channels are
 * counted, without which half of the size variables would look unused: a mixin argument, and a
 * parameter injected into base through `@use … with (…)`.
 */
const usageIndex = new Map();
const remember = (name, what) => {
  if (!usageIndex.has(name)) usageIndex.set(name, new Set());
  usageIndex.get(name).add(what);
};
sources.forEach((lines) => {
  let inWith = false;
  lines.forEach((line) => {
    if (/@use\s+["'][^"']+["']\s+with\s*\(/.test(line)) inWith = true;
    else if (inWith && /\);/.test(line)) inWith = false;

    const declaration = /^\s*\$[\w-]+\s*:/.test(line);
    const use = /^\s*([a-z-]+)\s*:\s*[^;]*?(\$[\w-]+)/.exec(line);
    if (use && !declaration) remember(use[2], use[1]);

    const injected = /^\s*\$[\w-]+\s*:\s*(\$[\w-]+)\s*,?\s*$/.exec(line);
    if (injected) remember(injected[1], inWith ? 'injected into base' : 'mixin argument');

    /* positional mixin argument: the variable name stands alone on the line */
    const positional = /^\s*(\$[\w-]+)\s*,\s*$/.exec(line);
    if (positional) remember(positional[1], 'mixin argument');

    [...line.matchAll(/calc\([^;]*?(\$[\w-]+)/g)].forEach((m) => remember(m[1], 'in a calc'));
  });
});

const collect = (marker, scale) => {
  const rows = [];
  sources.forEach((lines, file) => {
    lines.forEach((line, index) => {
      const at = line.indexOf('//');
      if (at === -1 || !line.slice(at).includes(marker)) return;
      const comment = line.slice(line.indexOf(marker) + marker.length).replace(/^:?\s*/, '').trim();
      const code = line.slice(0, at).trimEnd() || line.trim();
      const info = describe(code);
      const applied = (info.kind === 'variable' ? [...(usageIndex.get(info.name) ?? [])] : [info.name])
        .filter(Boolean);
      rows.push({
        file: relative(packageRoot, file),
        line: index + 1,
        widget: widgetOf(file),
        note: comment,
        applied,
        steps: stepsFor(info.value, familyFor(`${info.name} ${applied.join(' ')}`, scale)),
        ...info,
      });
    });
  });
  return rows;
};

const categories = MARKERS.map((entry) => ({ ...entry, rows: collect(entry.marker, entry.scale) }));

/**
 * The distinct values of a category are what design is asked about. The vocabulary's `literals`
 * field decides what counts as a value: `steps` — the step the place sits on (`ds.$font-size-180`
 * -> `font-size-180`: what is asked for is a role over the step, not a number), `px` — pixels only
 * (in a px category the `100%` of `inset(calc(100% - 2px) …)` is an edge, not a size), `any` — any
 * literal with a unit.
 */
const distinctValues = (rows, category) => {
  const map = new Map();
  const pick = (row) => {
    if (category.literals === 'steps') {
      const steps = [...row.value.matchAll(/\$([a-z-]+-\d+)/g)].map((m) => m[1]);
      if (steps.length) return steps;
      const weight = /^\s*(\d{3})\s*$/.exec(row.value);
      return weight ? [weight[1]] : [row.value.trim()];
    }
    const literals = row.value.match(category.literals === 'px'
      ? /-?\d*\.?\d+px/g
      : /-?\d*\.?\d+(?:px|em|rem|%)/g);
    return literals ?? [row.value.trim()];
  };
  rows.forEach((row) => {
    [...new Set(pick(row))].forEach((value) => {
      if (!map.has(value)) map.set(value, []);
      map.get(value).push(row);
    });
  });
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
};

/* -------------------------------------------------------- the calc category */

const rootMap = (ast) => {
  const map = new Map();
  ast.walkRules((rule) => {
    if (!/(^|,)\s*:root\s*$/.test(rule.selector)) return;
    rule.walkDecls((decl) => { if (decl.prop.startsWith('--')) map.set(decl.prop, decl.value.trim()); });
  });
  return map;
};

const resolveVar = (value, map, seen = new Set()) => {
  let out = value;
  for (let pass = 0; pass < 12 && out.includes('var('); pass += 1) {
    out = out.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (whole, name, fallback) => {
      if (seen.has(name)) return fallback ?? whole;
      seen.add(name);
      return map.get(name) ?? fallback ?? whole;
    });
  }
  return out.trim();
};

const bundle = (name) => {
  const file = join(cssDir, `dx.${name}.css`);
  if (!existsSync(file)) throw new Error(`no bundle at ${file} — run build:themes-dev`);
  const ast = postcss.parse(readFileSync(file, 'utf8'));
  return { ast, map: rootMap(ast) };
};

const CALC_KINDS = [
  {
    id: 'zero',
    title: 'identically zero',
    why: 'the same variable is subtracted from itself: `(X − X − 0) / 2`. In the legacy themes those '
      + 'calls took the numeric branch of the mixin and Sass folded the expression into `0`.',
    test: (value) => {
      const vars = value.match(/var\(--dxds-[a-z0-9-]+\)/g) ?? [];
      return vars.length >= 2 && new Set(vars).size === 1 && /-\s*0\)/.test(value);
    },
  },
  {
    id: 'mixed',
    title: 'token and px literal',
    why: 'the derived value is computed from a token, but the correction stayed absolute — the value '
      + 'no longer scales along with the step.',
    test: (value) => /var\(--dxds-/.test(value) && /\d+px/.test(value),
  },
  {
    id: 'scalar',
    title: 'multiplied by a factor',
    why: 'a magic multiplier with no matching step — a candidate either for a new step or for a token of its own.',
    test: (value) => /\d*\.?\d+\s*\*\s*var\(--dxds-/.test(value) || /var\(--dxds-[a-z0-9-]+\)\s*\*\s*\d/.test(value),
  },
  {
    id: 'tokens',
    title: 'arithmetic over tokens',
    why: 'an honest derived value: a difference or a fraction of steps. This is what var() is for — '
      + 'when the scale changes the value follows on its own.',
    test: () => true,
  },
];

const calcPlaces = [];
['light', 'dark'].forEach((mode) => {
  const { ast, map } = bundle(`fluent-next.blue.${mode}`);
  ast.walkRules((rule) => {
    if (/(^|,)\s*:root\s*$/.test(rule.selector)) return;
    rule.walkDecls((decl) => {
      if (!decl.value.includes('calc(')) return;
      const resolved = resolveVar(decl.value, map);
      const kind = CALC_KINDS.find((entry) => entry.test(decl.value));
      calcPlaces.push({
        mode,
        // combinators are spaced out: the production build strips those spaces and the dev build
        // keeps them, and the report must not depend on which flavour produced the bundle
        selector: rule.selectors[0].trim().replace(/\s*([>+~])\s*/g, ' $1 '),
        prop: decl.prop,
        value: decl.value.replace(/\s+/g, ' '),
        resolved: resolved.replace(/\s+/g, ' '),
        kind: kind.id,
      });
    });
  });
});

const calcLight = calcPlaces.filter((place) => place.mode === 'light');
const calcByKind = CALC_KINDS.map((kind) => {
  const list = calcLight.filter((place) => place.kind === kind.id);
  const formulas = new Map();
  list.forEach((place) => {
    if (!formulas.has(place.value)) formulas.set(place.value, []);
    formulas.get(place.value).push(place);
  });
  return { ...kind, list, formulas: [...formulas.entries()].sort((a, b) => b[1].length - a[1].length) };
});

/* -------------------------------------------------------------- markdown */

const escapePipes = (text) => String(text).replace(/\|/g, '\\|');

const countOf = (entry) => (entry.source === 'bundle'
  ? calcLight.length
  : categories.find((candidate) => candidate.id === entry.id).rows.length);

const md = () => {
  const out = [];
  out.push('<!-- Generated by node tools/review/scales.mjs. Do not edit by hand. -->');
  out.push('# Scales: what did not land on a package step\n');
  out.push('Design card: **[design#1555](https://github.com/DevExpress/design/issues/1555)** — the '
    + 'review happens there; it does not block the release of the theme.\n');
  out.push('Material for the design team. Every category is marked in the code, so this inventory is '
    + 'reproducible and cannot drift from the sources. No unmarked fixed size is left in the theme: '
    + '`tests/fluent-next-size-markers.test.ts` fails on the first px literal without a marker, so a '
    + 'new place either gets a category or does not pass.\n');
  out.push('The "step" column is computed: the value is converted to rem at a 16px root and looked up '
    + 'in the package scale. A filled cell means "a step with exactly this value already exists", an '
    + 'empty one means "no such step in the scale".\n');
  out.push('| Category | Marker | Places | Question |');
  out.push('|---|---|---|---|');
  vocabulary.categories.forEach((entry) => {
    out.push(`| ${entry.title} | \`${entry.marker ?? 'calc()'}\` | ${countOf(entry)} | ${entry.question} |`);
  });
  out.push('');

  vocabulary.categories.forEach((entry) => {
    if (entry.source === 'bundle') { out.push(...calcMd()); return; }
    const category = categories.find((candidate) => candidate.id === entry.id);
    out.push(`## ${category.title} — \`${category.marker}\`, ${category.rows.length}\n`);
    out.push(`${category.why}\n`);
    const values = distinctValues(category.rows, category);
    out.push(`Distinct values: **${values.length}**. Most frequent: `
      + `${values.slice(0, 12).map(([value, rows]) => `\`${value}\` ×${rows.length}`).join(', ')}.\n`);
    const withStep = category.rows.filter((row) => row.steps.length).length;
    if (category.scale) {
      out.push(`A step with the same value exists for **${withStep}** of ${category.rows.length} `
        + `(the scale family is chosen by the property, \`${category.scale}\` by default).\n`);
    }
    out.push('| Value | Where | What it is | Lands on | Step | File |');
    out.push('|---|---|---|---|---|---|');
    category.rows.forEach((row) => {
      out.push(`| \`${escapePipes(row.value)}\` | ${row.widget} | ${row.kind === 'variable' ? `\`${row.name}\`` : row.kind} `
        + `| ${row.applied.length ? row.applied.join(', ') : '—'} `
        + `| ${row.steps.length ? row.steps.map((step) => `\`${step}\``).join(', ') : '—'} `
        + `| \`${row.file}:${row.line}\` |`);
    });
    out.push('');
  });
  return out.join('\n');
};

const calcMd = () => {
  const out = [];
  out.push(`## ${CALC_CATEGORY.title} — calc(), ${calcLight.length} expressions per bundle\n`);
  out.push('A token arrives in CSS as `var()`, so Sass can no longer fold the arithmetic: everything '
    + 'that used to be computed at build time is now computed by the browser. For comparison, the '
    + 'built legacy fluent has **50** `calc()` expressions and not one of them with a token.\n');
  out.push('| Class | Expressions | Why |');
  out.push('|---|---|---|');
  calcByKind.forEach((kind) => out.push(`| ${kind.title} | ${kind.list.length} | ${kind.why} |`));
  out.push('');
  calcByKind.forEach((kind) => {
    if (!kind.list.length) return;
    out.push(`### ${kind.title} (${kind.list.length})\n`);
    kind.formulas.forEach(([formula, list]) => {
      out.push(`**\`${escapePipes(formula)}\`** — ${list.length} place${list.length === 1 ? '' : 's'}:\n`);
      list.slice(0, 12).forEach((place) => out.push(`- \`${escapePipes(place.selector)}\` → \`${place.prop}\``));
      if (list.length > 12) out.push(`- … ${list.length - 12} more`);
      out.push('');
    });
  });
  return out;
};

/* ------------------------------------------------------------------ HTML */

const escape = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const categorySection = (category) => {
  const values = distinctValues(category.rows, category);
  const withStep = category.rows.filter((row) => row.steps.length).length;
  return `
  <section class="card" id="${category.id}">
    <header class="chead">
      <h2>${escape(category.title)}<span class="count">${category.rows.length}</span></h2>
      <p class="sub"><code>${escape(category.marker)}</code> — the marker in the code; distinct values
        <b>${values.length}</b>${category.scale ? `; a step with the same value exists for <b>${withStep}</b>` : ''}</p>
      <p class="sub"><b>Question:</b> ${escape(category.question)}. ${escape(category.why)}</p>
    </header>
    <div class="chips">${values.slice(0, 24).map(([value, rows]) => `
      <span class="chip"><b>${escape(value)}</b><i>×${rows.length}</i></span>`).join('')}</div>
    <div class="tablewrap"><table>
      <thead><tr><th>Value</th><th>Widget</th><th>What it is</th><th>Lands on</th><th>Step</th><th>File</th></tr></thead>
      <tbody>${category.rows.map((row) => `
        <tr>
          <td class="val"><code>${escape(row.value)}</code></td>
          <td>${escape(row.widget)}</td>
          <td class="what">${row.kind === 'variable' ? `<code>${escape(row.name)}</code>` : escape(row.kind)}</td>
          <td class="props">${row.applied.length ? row.applied.map((p) => `<span class="prop">${escape(p)}</span>`).join(' ') : '—'}</td>
          <td class="step">${row.steps.length ? row.steps.map((step) => `<code>${escape(step)}</code>`).join(' ') : '—'}</td>
          <td class="file"><code>${escape(row.file)}:${row.line}</code></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </section>`;
};

const html = () => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>fluent-next scales — material for the design team</title>
<style>
:root {
  color-scheme: light dark;
  --ink:#14171c; --ink-soft:#565e6b; --ink-faint:#858d9a; --page:#f4f6f8; --card:#fff;
  --line:#e0e5ec; --line-soft:#eef1f5; --accent:#0f6cbd; --accent-soft:#e8f0fa;
  --warn:#8a5a00; --warn-bg:#fdf3e0;
  --sans:'Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark) { :root { --ink:#e7eaef; --ink-soft:#a6aeba; --ink-faint:#79818e;
  --page:#0f1216; --card:#171b21; --line:#272d36; --line-soft:#1e232a; --accent:#6aa9e6;
  --accent-soft:#17242f; --warn:#e0ad5a; --warn-bg:#2a2317; } }
:root[data-theme="dark"] { --ink:#e7eaef; --ink-soft:#a6aeba; --ink-faint:#79818e; --page:#0f1216;
  --card:#171b21; --line:#272d36; --line-soft:#1e232a; --accent:#6aa9e6; --accent-soft:#17242f;
  --warn:#e0ad5a; --warn-bg:#2a2317; }
:root[data-theme="light"] { --ink:#14171c; --ink-soft:#565e6b; --ink-faint:#858d9a; --page:#f4f6f8;
  --card:#fff; --line:#e0e5ec; --line-soft:#eef1f5; --accent:#0f6cbd; --accent-soft:#e8f0fa;
  --warn:#8a5a00; --warn-bg:#fdf3e0; }
* { box-sizing:border-box; }
body { margin:0; background:var(--page); color:var(--ink); font:15px/1.55 var(--sans); }
h1,h2,h3 { margin:0; font-weight:600; text-wrap:balance; }
p { margin:0; }
code { font-family:var(--mono); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
header.top { background:var(--card); border-bottom:1px solid var(--line); padding:34px 28px 26px; }
.inner { max-width:1180px; margin:0 auto; }
.kicker { font:600 11px/1 var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--ink-faint); }
header.top h1 { font-size:clamp(25px,3.2vw,35px); letter-spacing:-.02em; margin-top:14px; }
.lede { color:var(--ink-soft); max-width:72ch; margin-top:12px; }
.wrap { max-width:1180px; margin:0 auto; padding:26px 28px 46px; display:flex; flex-direction:column; gap:18px; }
section.card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:22px;
  display:flex; flex-direction:column; gap:14px; scroll-margin-top:20px; }
h2 { font-size:19px; display:flex; align-items:baseline; gap:10px; }
h2 .count { font:600 12px var(--mono); color:var(--ink-faint); }
.sub { color:var(--ink-soft); max-width:76ch; font-size:14px; }
.chips { display:flex; flex-wrap:wrap; gap:6px; }
.chip { display:inline-flex; align-items:baseline; gap:6px; border:1px solid var(--line);
  border-radius:999px; padding:4px 10px; font:12px var(--mono); }
.chip i { font-style:normal; color:var(--ink-faint); font-size:11px; }
.tablewrap { overflow-x:auto; border:1px solid var(--line-soft); border-radius:8px; max-height:520px; overflow-y:auto; }
table { border-collapse:collapse; width:100%; font-size:13px; }
thead th { position:sticky; top:0; background:var(--card); text-align:left; font:600 11px/1 var(--sans);
  letter-spacing:.06em; text-transform:uppercase; color:var(--ink-faint); padding:9px 12px;
  border-bottom:1px solid var(--line); }
td { padding:7px 12px; border-bottom:1px solid var(--line-soft); vertical-align:middle; }
tbody tr:last-child td { border-bottom:0; }
td.val code { font-weight:600; }
td.what code, td.file code { font-size:11.5px; color:var(--ink-soft); word-break:break-all; }
td.step code { font-size:11.5px; color:var(--accent); white-space:nowrap; }
.prop { display:inline-block; font:11px var(--mono); color:var(--ink-faint); border:1px solid var(--line);
  border-radius:4px; padding:1px 5px; }
.kinds { display:grid; gap:10px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
.kind { border:1px solid var(--line); border-radius:8px; padding:14px; display:flex; flex-direction:column; gap:6px; }
.kind h3 { font-size:14.5px; display:flex; align-items:baseline; gap:8px; }
.kind h3 b { font:600 18px var(--sans); font-variant-numeric:tabular-nums; }
.kind p { font-size:12.5px; color:var(--ink-soft); }
.kind.zero { border-color:var(--warn); background:var(--warn-bg); }
.formula { border:1px solid var(--line-soft); border-radius:8px; overflow:hidden; }
.formula summary { cursor:pointer; padding:9px 12px; display:flex; gap:10px; align-items:baseline;
  list-style:none; background:var(--line-soft); }
.formula summary::-webkit-details-marker { display:none; }
.formula summary code { font-size:12px; word-break:break-all; }
.formula summary .n { margin-left:auto; font:12px var(--mono); color:var(--ink-faint); }
.formula ul { margin:0; padding:10px 12px 12px 30px; display:flex; flex-direction:column; gap:3px; }
.formula li { font:11.5px var(--mono); color:var(--ink-soft); }
nav.rail { display:flex; flex-wrap:wrap; gap:8px; }
nav.rail a { text-decoration:none; color:var(--ink-soft); border:1px solid var(--line); border-radius:999px;
  padding:5px 12px; font-size:13px; }
nav.rail a:hover { color:var(--ink); border-color:var(--ink-faint); }
@media print { body { background:#fff; } .tablewrap { max-height:none; } section.card { break-inside:avoid; } }
</style>
</head>
<body>
<header class="top"><div class="inner">
  <p class="kicker">DevExtreme · fluent-next · material for the design team</p>
  <h1>Scales: what did not land on a package step</h1>
  <p class="lede">Categories of values that got neither a step nor a role during the migration. Each
    one is marked in the code, so this inventory is reproducible by command and cannot drift from the
    sources. The marker categories are collected from the theme sources, calc() from the built bundle,
    because what matters there is how many expressions actually reach the browser. No unmarked fixed
    size is left in the theme: the gate <code>tests/fluent-next-size-markers.test.ts</code> catches
    them.</p>
  <p class="lede">The "step" column is computed: the value is converted to rem at a 16px root and
    looked up in the package scale, the family chosen by the property. A filled cell means "a step
    with exactly this value already exists", an empty one means "no such step in the scale".</p>
  <p class="lede"><b>Card: <a href="https://github.com/DevExpress/design/issues/1555">design#1555</a></b>
    — the review happens there. It does not block the release: values off the scales stay literals,
    and the card decides which of them deserve steps and roles.</p>
  <nav class="rail" style="margin-top:18px">
    ${vocabulary.categories.map((entry) => `<a href="#${entry.id}">${escape(entry.title)} · ${countOf(entry)}</a>`).join('')}
  </nav>
</div></header>

<div class="wrap">
  ${vocabulary.categories.map((entry) => (entry.source === 'bundle'
    ? calcSection()
    : categorySection(categories.find((candidate) => candidate.id === entry.id)))).join('')}
</div>
</body>
</html>
`;

const calcSection = () => `
  <section class="card" id="calc">
    <header class="chead">
      <h2>${escape(CALC_CATEGORY.title)} — <code>calc()</code><span class="count">${calcLight.length}</span></h2>
      <p class="sub">A token arrives in CSS as <code>var()</code>, so Sass can no longer fold the
        arithmetic: everything that used to be computed at build time is now computed by the browser.
        For comparison, the built legacy fluent has <b>50</b> <code>calc()</code> expressions and not
        one with a token. Below is the light bundle; the dark one has the same set.</p>
    </header>
    <div class="kinds">${calcByKind.map((kind) => `
      <div class="kind${kind.id === 'zero' ? ' zero' : ''}">
        <h3><b>${kind.list.length}</b> ${escape(kind.title)}</h3>
        <p>${kind.why.replace(/`([^`]+)`/g, (_, code) => `<code>${escape(code)}</code>`)}</p>
      </div>`).join('')}
    </div>
    ${calcByKind.filter((kind) => kind.list.length).map((kind) => `
      <h3 style="margin-top:6px">${escape(kind.title)} — ${kind.list.length}</h3>
      <div style="display:flex;flex-direction:column;gap:8px">${kind.formulas.map(([formula, list]) => `
        <details class="formula">
          <summary><code>${escape(formula)}</code><span class="n">${list.length}</span></summary>
          <ul>${list.map((place) => `<li>${escape(place.selector)} → ${escape(place.prop)}</li>`).join('')}</ul>
        </details>`).join('')}
      </div>`).join('')}
  </section>
`;

if (mdOnly) {
  process.stdout.write(`${md()}\n`);
} else {
  writeFileSync(join(themeDir, 'SCALES.md'), `${md()}\n`);
  writeFileSync(join(themeDir, 'SCALES.html'), html());
  vocabulary.categories.forEach((entry) => {
    if (entry.source === 'bundle') {
      process.stdout.write(`${entry.title}: ${calcLight.length} per bundle — `
        + `${calcByKind.map((kind) => `${kind.title} ${kind.list.length}`).join(', ')}\n`);
      return;
    }
    const category = categories.find((candidate) => candidate.id === entry.id);
    process.stdout.write(`${category.title}: ${category.rows.length} `
      + `(distinct values ${distinctValues(category.rows, category).length})\n`);
  });
}
