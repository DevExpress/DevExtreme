/*
 * The sizes report: which step of which scale every size slot of the theme reads, and which steps
 * the token package's component tier uses for the same component.
 *
 *   node tools/review/sizes.mjs           # summary to stdout
 *   node tools/review/sizes.mjs --json    # machine-readable, for the gate
 *
 * The colour pass (tools/review/roles.mjs) reads `components/<set>/theme/fluent.json` and answers
 * "is this the role the design system names for this slot". Nothing read `components/<set>/size/*`,
 * so the other 874 declarations of the theme - spacing, border widths, radii and the typography
 * ramp - were never compared against anything at all.
 *
 * The comparison is deliberately coarser than the colour one. A colour slot has a family the name
 * itself promises, so a mismatch is meaningful on one declaration. A size step has no such promise:
 * `spacing.120` is not wrong for a padding the way `color-bg-*` is wrong for a `-content` slot. So
 * this asks the one question that IS answerable per component: does the package ever use this step
 * of this scale in this component? A "no" is a question - the step may be one the design system
 * does not put in this component at all - and the report names the steps it does use.
 *
 * So this is a REPORT, and deliberately not a gate. The colour pass can be one because a family is
 * a hard rule: a `-bg` slot reading a content role is wrong on its face, whoever wrote it. A step
 * carries no such rule. The steps this pass lists as unused are mostly places where the package
 * models a component more thinly than we do, and banking 169 of them with a reason each would
 * produce a list that says "we picked a different step, which is fine" 169 times - a gate that
 * cannot go red for a reason anybody would act on.
 *
 * One rule did come out of the pass and IS gated, in tests/fluent-next-size-markers.test.ts: a
 * glyph is sized from spacing, not from a typography scale. That one is hard, because font-size-N
 * and spacing-N resolve to the same rem at every step, so the wrong scale reads correct and only a
 * gate will notice.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const requireFrom = createRequire(import.meta.url);

const SETS = ['core', 'vnext', 'blazor', 'wpf'];
const DENSITIES = ['fluent_small', 'fluent_medium', 'fluent_large'];
const COMPONENT = JSON.parse(
  readFileSync(join(here, 'roles.mjs'), 'utf8')
    .match(/const COMPONENT = \{[\s\S]*?\n\};/)[0]
    .replace('const COMPONENT = ', '')
    .replace(/\n\};$/, '\n}')
    .replace(/'/g, '"')
    .replace(/(\w[\w-]*):/g, '"$1":')
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/^"const" COMPONENT = /, ''),
);

const tokensRoot = dirname(requireFrom.resolve('@devexpress/design-tokens-internal/package.json'));
const tokensVersion = JSON.parse(readFileSync(join(tokensRoot, 'package.json'), 'utf8')).version;

const refOf = (value) => {
  const m = String(value).match(/^\{([a-z-]+(?:\.[a-z-]+)?)\.([a-z0-9-]+)\}$/);
  if (!m) return null;
  const scale = m[1].startsWith('global.') ? m[1].slice('global.'.length) : m[1];
  return { scale, step: m[2] };
};

const packageSteps = new Map();
SETS.forEach((set) => {
  DENSITIES.forEach((density) => {
    const file = join(tokensRoot, 'tokens', 'components', set, 'size', `${density}.json`);
    if (!existsSync(file)) return;
    const walk = (node, path = []) => {
      Object.keys(node ?? {}).forEach((key) => {
        const value = node[key];
        if (value && typeof value === 'object' && !('value' in value) && !('$value' in value)) {
          walk(value, [...path, key]);
          return;
        }
        const ref = refOf(value.value ?? value.$value);
        if (!ref) return;
        const component = path[0];
        if (!packageSteps.has(component)) packageSteps.set(component, new Map());
        const scales = packageSteps.get(component);
        if (!scales.has(ref.scale)) scales.set(ref.scale, new Map());
        const steps = scales.get(ref.scale);
        if (!steps.has(ref.step)) steps.set(ref.step, new Set());
        steps.get(ref.step).add(`${set}/${density.replace('fluent_', '')}`);
      });
    };
    walk(JSON.parse(readFileSync(file, 'utf8')));
  });
});

const SCALES = ['spacing', 'border-width', 'border-radius', 'font-size', 'line-height', 'font-weight', 'letter-spacing'];
const declarations = [];
readdirSync(themeDir).sort().forEach((folder) => {
  const file = join(themeDir, folder, '_sizes.scss');
  if (!existsSync(file)) return;
  const text = readFileSync(file, 'utf8');
  text.split('\n').forEach((line) => {
    const decl = /^\$([a-z0-9-]+)\s*:\s*(.+?)(?:\s*!default)?;/.exec(line);
    if (!decl) return;
    const [, name, value] = decl;
    SCALES.forEach((scale) => {
      const re = new RegExp(`ds\\.\\$${scale}-([a-z0-9-]+)`, 'g');
      for (const m of value.matchAll(re)) {
        declarations.push({
          folder, name, scale, step: m[1], value: value.trim(),
        });
      }
    });
  });
});

const stepsFor = (folder, scale) => {
  const components = COMPONENT[folder] ?? [];
  const found = new Map();
  components.forEach((component) => {
    const scales = packageSteps.get(component);
    if (!scales?.has(scale)) return;
    for (const [step, where] of scales.get(scale)) {
      if (!found.has(step)) found.set(step, new Set());
      for (const w of where) found.get(step).add(w);
    }
  });
  return found;
};

const findings = declarations.map((d) => {
  const components = COMPONENT[d.folder] ?? [];
  if (!components.length) return { ...d, verdict: 'no-counterpart' };
  const steps = stepsFor(d.folder, d.scale);
  if (!steps.size) return { ...d, verdict: 'scale-absent' };
  if (steps.has(d.step)) return { ...d, verdict: 'agrees', where: [...steps.get(d.step)].sort() };
  return { ...d, verdict: 'step-new', packageUsesHere: [...steps.keys()].sort() };
});

const verdicts = ['agrees', 'step-new', 'scale-absent', 'no-counterpart'];
const summary = {
  tokensVersion,
  declarations: findings.length,
  folders: new Set(findings.map((f) => f.folder)).size,
  byVerdict: Object.fromEntries(verdicts
    .map((v) => [v, findings.filter((f) => f.verdict === v).length])),
  byScale: Object.fromEntries(SCALES
    .map((s) => [s, findings.filter((f) => f.scale === s).length]).filter(([, n]) => n)),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ summary, findings }, null, 2));
} else {
  console.log(`size reads ${summary.declarations} in ${summary.folders} folders, package ${tokensVersion}`);
  for (const v of verdicts) console.log(`  ${v.padEnd(16)} ${summary.byVerdict[v]}`);
  console.log('\nby scale:');
  for (const [scale, n] of Object.entries(summary.byScale)) console.log(`  ${scale.padEnd(16)} ${n}`);
  const neu = findings.filter((f) => f.verdict === 'step-new');
  const byFolder = {};
  for (const f of neu) (byFolder[f.folder] ??= []).push(f);
  console.log(`\nsteps the package does not use in this component (${neu.length}):`);
  const busiest = Object.entries(byFolder).sort((a, b) => b[1].length - a[1].length).slice(0, 12);
  for (const [folder, rows] of busiest) {
    console.log(`  ${String(rows.length).padStart(3)} ${folder}  e.g. ${rows[0].name} reads ${rows[0].scale}-${rows[0].step}; package uses ${rows[0].packageUsesHere.join(', ')}`);
  }
}
