import { execFileSync } from 'child_process';
import {
  mkdirSync, mkdtempSync, readFileSync, writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { required } from './required';

const packageRoot = join(__dirname, '..');
const tool = join(packageRoot, 'tools', 'review', 'roles.mjs');
const themeTool = join(packageRoot, 'tools', 'review', 'roles-theme.mjs');
const baselinePath = join(packageRoot, 'tests', 'roles.baseline.json');
const decisionsPath = join(packageRoot, 'tools', 'review', 'roles.decisions.json');

interface Finding {
  name: string;
  slot: string | null;
  roles: string[];
  package?: { verdict: string };
}
interface Open {
  name: string;
  verdict: string;
  roles: string[];
  slot: string | null;
  decision?: string;
  why?: string;
}

const DECISIONS = ['confirmed', 'naming', 'rule-5', 'bridge', 'package-gap', 'design'];
const SLOT_DECISIONS = ['naming', 'hairline', 'rule-5', 'known', 'design', 'drawn-mark', 'ring-and-fill'];
const FAMILY_DECISIONS = ['package-confirms', 'hairline', 'drawn-mark', 'bridge', 'naming', 'design',
  'confirmed', 'rule-5', 'package-gap'];
const LADDER_DECISIONS = ['no-rung', 'design', 'answered'];
const CONTRAST_DECISIONS = ['graphic-ok', 'package-gap', 'design'];
const STATE_PAIR_DECISIONS = ['graphic-ok', 'design', 'answered'];
const CONCEPT_DECISIONS = ['spelling', 'shade', 'design', 'answered', 'false-group'];
const RUNG_DECISIONS = ['answered', 'confirmed', 'anatomy', 'design', 'package-gap', 'known'];

interface Concept {
  concept: string;
  roles: string[];
  families: string[];
  members: { folder: string; role: string }[];
  decision?: string;
  why?: string;
}

interface ContrastPair {
  selector: string;
  fgRole: string;
  bgRole: string;
  contrast: Record<string, number>;
  decision?: string;
  why?: string;
}

interface StatePair {
  bg: string;
  fg: string;
  fgRole: string;
  bgRole: string;
  contrast: Record<string, number>;
  selector: string;
  group?: string;
  decision?: string;
}

interface Ladder { stem: string; states: string[]; role: string[]; decision?: string; why?: string }

interface FamilyMismatch {
  name: string;
  slot: string;
  roles: string[];
  paints: string[];
  decision?: string;
  why?: string;
}

interface SlotLie {
  name: string;
  slot: string | null;
  slotSays: string;
  paints: string[];
  decision?: string;
  why?: string;
}

interface Rung {
  name: string;
  state: string;
  roles: string[];
  oursAt: string[];
  want: string[];
  decision?: string;
  why?: string;
}

interface Typography {
  variable: string;
  family: string;
  step: number;
  marker: string | null;
}

interface ThemeFinding {
  name: string;
  slot: string | null;
  roles: string[];
  slotLies?: { slotSays: string };
  paints?: { properties: string[] };
  family?: { want: string | null; got: string[] } | null;
}

const json = <T>(script: string, args: string[] = []): T => JSON.parse(
  execFileSync(process.execPath, [script, '--json', ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }),
) as T;

// the package's verdicts, for the checks of the verdict logic itself
const run = (theme?: string): { findings: Finding[] } => json(tool, theme ? [`--theme=${theme}`] : []);

const actual = json<{
  findings: ThemeFinding[];
  typography: Typography[];
  ladders: Ladder[];
  concepts: Concept[];
  coverage: { lines: number; collected: number; dataUriStatic: number; unexplained: string[] };
  declarationsMissingFromBundle: number;
}>(themeTool);
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const decisions = JSON.parse(readFileSync(decisionsPath, 'utf8'));

/*
 * Counted from the files, not from the set the collector built - which is the whole point.
 *
 * `every colour declaration reaches a verdict` measures completeness over the declarations the pass
 * managed to collect, so it stayed green through three separate blind spots: a declaration whose
 * value borrows another component's variable, one written outside `_colors.scss`, and a tier name
 * written straight as a custom property. Twenty-four declarations in total, invisible to every list
 * and every family check, with the gate reporting full coverage the entire time.
 *
 * This one starts from every line in the theme that mentions a colour or shadow role and requires
 * each to be either a collected declaration or a `dx-data-uri-static` line, where the role is named
 * in a comment beside a literal because the value is baked into an SVG. A fourth way of writing a
 * colour now fails here by name instead of going quietly missing.
 */
test('every line that reads a role is collected or explained', () => {
  expect(actual.coverage.unexplained).toEqual([]);
  expect(actual.coverage.lines)
    .toBe(actual.coverage.collected + actual.coverage.dataUriStatic);
  expect(actual.coverage.collected).toBeGreaterThan(700);
});

test('every colour declaration reaches a verdict', () => {
  const unclassified = run().findings.filter((f) => !f.package?.verdict);
  expect(unclassified.map((f) => f.name)).toEqual([]);
});

test('every banked disagreement carries a decision and a reason', () => {
  const undecided = decisions.open
    .filter((o: Open) => !o.decision || !DECISIONS.includes(o.decision) || !o.why?.trim())
    .map((o: Open) => o.name);
  expect(undecided).toEqual([]);
});

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

test('every typography step read carries a marker', () => {
  const unmarked = actual.typography
    .filter((t) => !t.marker)
    .map((t) => `${t.variable} reads ${t.family}-${t.step}`);
  expect(unmarked).toEqual([]);
});

test('names whose slot contradicts the painted property are the reviewed ones', () => {
  const lies = actual.findings
    .filter((f) => f.slotLies)
    .map((f) => ({
      name: f.name,
      slot: f.slot ?? null,
      slotSays: required(f.slotLies, `${f.name}.slotLies`).slotSays,
      paints: required(f.paints, `${f.name}.paints`).properties,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  expect(lies.length).toBeGreaterThan(0);
  expect(lies).toEqual(baseline.slotLies.map(({ decision, why, ...rest }: SlotLie) => rest));
});

test('roles whose family contradicts their slot are the reviewed ones', () => {
  const known = new Set(baseline.slotLies.map((o: SlotLie) => o.name));
  const seen = actual.findings
    .filter((f) => f.family?.want && !f.family.got.includes(f.family.want))
    .filter((f) => !known.has(f.name))
    .map((f) => ({
      name: f.name,
      slot: required(f.family?.want, `${f.name}.family.want`),
      roles: f.roles,
      paints: f.paints?.properties ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  expect(seen.length).toBeGreaterThan(0);
  expect(seen).toEqual(baseline.familyMismatches
    .map(({ decision, why, ...rest }: FamilyMismatch) => rest));
});

test('every banked family mismatch carries a decision and a reason', () => {
  const undecided = baseline.familyMismatches
    .filter((f: FamilyMismatch) => !f.decision
      || !FAMILY_DECISIONS.includes(f.decision) || !f.why?.trim())
    .map((f: FamilyMismatch) => f.name);
  expect(undecided).toEqual([]);
});

test('every banked rung carries a decision and a reason', () => {
  const undecided = decisions.rungs
    .filter((r: Rung) => !r.decision || !RUNG_DECISIONS.includes(r.decision) || !r.why?.trim())
    .map((r: Rung) => r.name);
  expect(undecided).toEqual([]);
});

test('every banked slot mismatch carries a decision and a reason', () => {
  const undecided = baseline.slotLies
    .filter((o: SlotLie) => !o.decision || !SLOT_DECISIONS.includes(o.decision) || !o.why?.trim())
    .map((o: SlotLie) => o.name);
  expect(undecided).toEqual([]);
});

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

test('every banked contrast pair carries a decision and a reason', () => {
  const undecided = decisions.contrast
    .filter((c: ContrastPair) => !c.decision
      || !CONTRAST_DECISIONS.includes(c.decision) || !c.why?.trim())
    .map((c: ContrastPair) => c.selector);
  expect(undecided).toEqual([]);
});

test('concepts painted with several roles are the reviewed ones', () => {
  const seen = actual.concepts
    .map(({
      concept, roles, families, members,
    }) => ({
      concept,
      roles,
      families,
      members: members.map(({ folder, role }) => ({ folder, role })),
    }))
    .sort((a, b) => a.concept.localeCompare(b.concept));
  expect(seen).toEqual(baseline.concepts.map(({ decision, why, ...rest }: Concept) => rest));
});

test('every banked concept split carries a decision and a reason', () => {
  const undecided = baseline.concepts
    .filter((c: Concept) => !c.decision
      || !CONCEPT_DECISIONS.includes(c.decision) || !c.why?.trim())
    .map((c: Concept) => c.concept);
  expect(undecided).toEqual([]);
});

test('every cross-state pair carries a decision, and every design group a reason', () => {
  const undecided = decisions.statePairs.rows
    .filter((r: StatePair) => !r.decision || !STATE_PAIR_DECISIONS.includes(r.decision))
    .map((r: StatePair) => r.bg);
  expect(undecided).toEqual([]);

  const groups = [...new Set(decisions.statePairs.rows
    .filter((r: StatePair) => r.group)
    .map((r: StatePair) => r.group as string) as string[])].sort();
  expect(Object.keys(decisions.statePairs.groups).sort()).toEqual(groups);

  const unreasoned = Object.entries(decisions.statePairs.groups)
    .filter(([, g]) => !(g as { why?: string }).why?.trim())
    .map(([key]) => key);
  expect(unreasoned).toEqual([]);
});

/*
 * Not a metric but a guard: every check that looks at a painted property GOES SILENT when the
 * bundle is older than the sources - a renamed variable is simply not found, it has no property,
 * and it can no longer contradict its slot. The 23-name rename on 09.09 hid 24 declarations that
 * way, and the slot check looked like it had passed.
 */
test('every tier declaration is present in the bundle the checks read', () => {
  expect(actual.declarationsMissingFromBundle).toBe(0);
});
