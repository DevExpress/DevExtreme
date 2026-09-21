/* node tools/review/package-disabled.mjs [--json] - the token package's disabled roles against
   what this theme emits. */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const tokensDir = path.dirname(require.resolve('@devexpress/design-tokens-internal/package.json'));
const bundle = path.resolve('../devextreme/artifacts/css/dx.fluent-next.blue.light.css');

// Package component -> the class the theme puts its rules on. A component the theme spells
// differently, or splits, is listed with every root it uses.
const ROOTS = {
  accordion: ['dx-accordion'],
  'ai-chat': ['dx-chat', 'dx-ai-chat'],
  badge: ['dx-badge'],
  button: ['dx-button'],
  calendar: ['dx-calendar'],
  checkbox: ['dx-checkbox'],
  'collapse-button': ['dx-button'],
  'color-palette': ['dx-colorview', 'dx-colorbox'],
  grid: ['dx-datagrid', 'dx-treelist', 'dx-cardview'],
  link: ['dx-link'],
  listbox: ['dx-list'],
  menu: ['dx-menu'],
  'menu-list': ['dx-context-menu', 'dx-menu'],
  pagination: ['dx-pagination', 'dx-pager'],
  'progress-bar': ['dx-progressbar'],
  'radio-button': ['dx-radiobutton', 'dx-radiogroup'],
  ribbon: ['dx-toolbar'],
  splitter: ['dx-splitter'],
  switch: ['dx-switch'],
  tabs: ['dx-tab'],
  tag: ['dx-tag'],
  'text-content': ['dx-placeholder', 'dx-texteditor'],
  'text-input': ['dx-texteditor'],
  treeview: ['dx-treeview'],
};

const walk = (node, trail = []) => {
  const out = [];
  Object.entries(node ?? {}).forEach(([key, value]) => {
    if (key.startsWith('$')) return;
    if (value && typeof value === 'object' && '$value' in value) out.push([[...trail, key].join('.'), value.$value]);
    else if (value && typeof value === 'object') out.push(...walk(value, [...trail, key]));
  });
  return out;
};

const roleOf = (raw) => String(raw).replace(/[{}]/g, '').replace(/^color\./, '');

const readRules = (css) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map((match) => ({ selector: match[1].trim().replace(/\s+/g, ' '), body: match[2] }))
  .filter(({ selector }) => !selector.startsWith('@'));

const tokens = JSON.parse(readFileSync(path.join(tokensDir, 'tokens/components/core/theme/fluent.json'), 'utf8'));
const css = readFileSync(bundle, 'utf8');
const rules = readRules(css)
  .filter(({ selector }) => /dx-state-disabled|dx-button-disable|dx-state-readonly/.test(selector));

// The variable a declaration ends in, resolved to the package role it was fed from.
const varRole = new Map();
for (const [, , name, value] of css.matchAll(/(^|;|\{)\s*(--dx-[a-z0-9-]+)\s*:\s*([^;]+)/g)) {
  const ref = /var\(\s*--dxds-color-([a-z0-9-]+)/.exec(value);
  if (ref) varRole.set(name, ref[1]);
}

const report = [];
Object.entries(tokens).forEach(([component, entries]) => {
  const declared = walk(entries).filter(([p]) => /disabled/i.test(p));
  if (!declared.length) return;

  const roots = ROOTS[component] ?? [];
  const ours = [];
  rules
    .filter((rule) => roots.some((root) => rule.selector.includes(`.${root}`)))
    .forEach((rule) => {
      [...rule.body.matchAll(/(^|;)\s*([a-z-]+)\s*:\s*([^;]+)/g)]
        .filter(([, , prop]) => /color|fill|stroke|opacity|shadow/.test(prop))
        .forEach(([, , prop, value]) => {
          const name = /var\(\s*(--dx-[a-z0-9-]+)/.exec(value)?.[1];
          ours.push({ prop, value: value.trim(), role: name ? varRole.get(name) ?? null : null });
        });
    });

  report.push({
    component,
    package: declared.map(([p, v]) => ({ place: p, role: roleOf(v) })),
    theme: ours,
    verdict: ours.length === 0 ? 'MISSING - the theme paints nothing here' : 'present',
  });
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const missing = report.filter((r) => r.verdict.startsWith('MISSING'));
  console.log(`Components the package gives a disabled answer for: ${report.length}`);
  console.log(`Painted nowhere by the theme: ${missing.length}${missing.length ? ` (${missing.map((r) => r.component).join(', ')})` : ''}\n`);
  for (const row of report) {
    const pkgRoles = [...new Set(row.package.map((p) => p.role))].sort();
    const themeRoles = [...new Set(row.theme.map((t) => t.role).filter(Boolean))].sort();
    const unmatched = pkgRoles.filter((r) => r !== 'none' && !themeRoles.includes(r));
    console.log(`${row.component.padEnd(16)} ${row.verdict === 'present' ? '' : '** MISSING ** '}`);
    console.log(`   package: ${pkgRoles.join(', ')}`);
    console.log(`   theme:   ${themeRoles.join(', ') || '(no role-backed declaration)'}`);
    if (unmatched.length) console.log(`   role not used by the theme: ${unmatched.join(', ')}`);
    console.log();
  }
}
