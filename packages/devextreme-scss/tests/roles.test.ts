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
type Open = {
  name: string; verdict: string; roles: string[]; slot: string | null;
  decision?: string; why?: string;
};

const DECISIONS = ['confirmed', 'naming', 'rule-5', 'bridge', 'package-gap', 'design'];
const SLOT_DECISIONS = ['naming', 'hairline', 'rule-5', 'known', 'design'];
const LADDER_DECISIONS = ['no-rung', 'design'];

type Ladder = { stem: string; states: string[]; role: string[]; decision?: string; why?: string };

type SlotLie = {
  name: string; slot: string | null; slotSays: string; paints: string[];
  decision?: string; why?: string;
};

type Typography = { variable: string; family: string; step: number; marker: string | null; roles: string[] };

const run = (theme?: string): {
  summary: Record<string, unknown>;
  findings: (Finding & { slot?: string | null; slotLies?: { slotSays: string }; paints?: { properties: string[] } })[];
  typography: Typography[];
  ladders: (Ladder & { unusedRungs: unknown[] })[];
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
    open: disagreements(actual.findings).map((entry) => {
      const previous = baseline.open.find((o: Open) => o.name === entry.name);
      return { ...entry, decision: previous?.decision, why: previous?.why };
    }),
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
  const banked = baseline.open.map(({ decision, why, ...rest }: Open) => rest);
  expect(disagreements(actual.findings)).toEqual(banked);
});

/*
 * A banked disagreement with no decision is the failure mode this whole report exists to prevent:
 * a role nobody chose, sitting in a list nobody reads. The list is the record, so it carries the
 * reasoning, not just the names.
 */
test('every banked disagreement carries a decision and a reason', () => {
  const undecided = baseline.open
    .filter((o: Open) => !o.decision || !DECISIONS.includes(o.decision) || !o.why?.trim())
    .map((o: Open) => o.name);
  expect(undecided).toEqual([]);
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

/*
 * The slot is the one claim in a name that can be checked against ground truth: NAMING.md says the
 * CSS property decides it, and the built bundle says which property the value reaches. Where the two
 * disagree the name misdescribes the code - sometimes deliberately (a hairline drawn with
 * background-color is still a border), sometimes not (fourteen filterBuilder `-content` variables
 * that have never painted text). Banked with the reason either way.
 *
 * Needs the built bundle; with none there is nothing to read and the case would pass vacuously, so
 * it asserts the scan found something first.
 */
test('names whose slot contradicts the painted property are the reviewed ones', () => {
  const lies = actual.findings
    .filter((f) => f.slotLies)
    .map((f) => ({
      name: f.name,
      slot: f.slot ?? null,
      slotSays: f.slotLies!.slotSays,
      paints: f.paints!.properties,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  expect(lies.length).toBeGreaterThan(0);
  expect(lies).toEqual(baseline.slotLies.map(({ decision, why, ...rest }: SlotLie) => rest));
});

test('every banked slot mismatch carries a decision and a reason', () => {
  const undecided = baseline.slotLies
    .filter((o: SlotLie) => !o.decision || !SLOT_DECISIONS.includes(o.decision) || !o.why?.trim())
    .map((o: SlotLie) => o.name);
  expect(undecided).toEqual([]);
});

/*
 * A state in the name that the eye cannot find. Read from the theme alone, so it answers for the
 * 22 folders the package has never heard of as well: the question is whether the design system
 * ships a role for the second state, not whether some other product models the widget.
 */
test('slots whose states resolve to one role are the reviewed ones', () => {
  const seen = actual.ladders
    .map((l) => ({ stem: l.stem, states: l.states, role: l.role }))
    .sort((a, b) => a.stem.localeCompare(b.stem));
  expect(seen).toEqual(baseline.ladders.map(({ decision, why, ...rest }: Ladder) => rest));
});

test('every banked ladder carries a decision and a reason', () => {
  const undecided = baseline.ladders
    .filter((l: Ladder) => !l.decision || !LADDER_DECISIONS.includes(l.decision) || !l.why?.trim())
    .map((l: Ladder) => l.stem);
  expect(undecided).toEqual([]);
});
