/*
 * The role a colour slot reads has to be the role the design system names for that slot.
 *
 * Nothing else checks this. The naming enforcer checks the shape of the name, the resolve diff
 * checks that a value did not move, the reachability audit checks delivery and the screenshots
 * check the cascade - a role that is wrong but plausible passes all four, and surfaces only when
 * the palette is re-anchored or in dark mode, where two roles that share a primitive in light
 * diverge and no etalon exists to notice.
 *
 * The comparison lives in tools/review/roles.mjs - the same module ROLES.md is built from, so the
 * gate and the report cannot disagree about what counts as a disagreement. Driven as a child
 * process because the tool is ESM and jest transforms TypeScript only.
 */

import { execFileSync } from 'child_process';
import {
  mkdirSync, mkdtempSync, readFileSync, writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const packageRoot = process.cwd();
const tool = join(packageRoot, 'tools', 'review', 'roles.mjs');
const baselinePath = join(packageRoot, 'tests', 'roles.baseline.json');

type Finding = {
  name: string;
  slot: string | null;
  roles: string[];
  package?: { verdict: string };
};
type Open = { name: string; verdict: string; roles: string[]; slot: string | null };

type Typography = { variable: string; family: string; step: number; marker: string | null; roles: string[] };

const run = (theme?: string): {
  summary: Record<string, unknown>; findings: Finding[]; typography: Typography[];
} => JSON.parse(
  execFileSync('node', [tool, '--json', ...(theme ? [`--theme=${theme}`] : [])], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }),
);

const disagreements = (findings: Finding[]): Open[] => findings
  .filter((f) => f.package && ['cross-family', 'family-conflict'].includes(f.package.verdict))
  .map((f) => ({
    name: f.name, verdict: f.package!.verdict, roles: f.roles, slot: f.slot,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const actual = run();
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

const unmarked = (typography: Typography[]) => typography
  .filter((t) => !t.marker)
  .map((t) => ({ variable: t.variable, reads: `${t.family}-${t.step}`, roleExists: t.roles.length > 0 }))
  .sort((a, b) => (a.variable + a.reads).localeCompare(b.variable + b.reads));

if (process.env.UPDATE_ROLES_BASELINE) {
  writeFileSync(baselinePath, `${JSON.stringify({
    ...baseline,
    open: disagreements(actual.findings),
    typographyUnmarked: unmarked(actual.typography),
  }, null, 2)}\n`);
}

test('every colour declaration reaches a verdict', () => {
  const unclassified = actual.findings.filter((f) => !f.package?.verdict);
  expect(unclassified.map((f) => f.name)).toEqual([]);
});

/*
 * Exact equality, not a ratchet down. A new disagreement is a role nobody has looked at; a resolved
 * one is a decision that belongs in the commit that made it. Both have to be banked on purpose.
 */
test('the roles the package disagrees with are the reviewed ones', () => {
  expect(disagreements(actual.findings)).toEqual(baseline.open);
});

// A green gate has to mean "nothing to find", not "the scan matched nothing".
test('a role from the wrong family is caught', () => {
  const theme = mkdtempSync(join(tmpdir(), 'roles-'));
  mkdirSync(join(theme, 'switch'));
  writeFileSync(join(theme, 'switch', '_colors.scss'), [
    '@use "../../../_design-system/variables/ds" as ds;',
    '',
    '$switch-off-border: ds.$color-content-subtle !default;',
    '',
  ].join('\n'));

  const planted = run(theme).findings.find((f) => f.name === 'switch-off-border');
  expect(planted?.package?.verdict).toBe('cross-family');
});

test('a role the package names for the slot passes', () => {
  const theme = mkdtempSync(join(tmpdir(), 'roles-'));
  mkdirSync(join(theme, 'switch'));
  writeFileSync(join(theme, 'switch', '_colors.scss'), [
    '@use "../../../_design-system/variables/ds" as ds;',
    '',
    '$switch-off-border: ds.$color-border-contrast !default;',
    '',
  ].join('\n'));

  const planted = run(theme).findings.find((f) => f.name === 'switch-off-border');
  expect(planted?.package?.verdict).toBe('agrees');
});

/*
 * A typography step read is not a literal, so tools/review/px-audit.mjs never saw it: these slipped
 * past the marker discipline entirely. Banked rather than ratcheted, for the same reason as above -
 * routing one onto a role is a decision (caption or base or title, at the same step), and it should
 * arrive with the commit that made it.
 */
test('typography step reads with no marker are the known ones', () => {
  expect(unmarked(actual.typography)).toEqual(baseline.typographyUnmarked);
});
