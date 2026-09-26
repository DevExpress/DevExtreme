import { execFileSync } from 'child_process';
import {
  mkdirSync, mkdtempSync, readFileSync, writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { required } from './required';

const packageRoot = process.cwd();
const tool = join(packageRoot, 'tools', 'review', 'roles.mjs');
const baselinePath = join(packageRoot, 'tests', 'roles.baseline.json');

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
const FAMILY_DECISIONS = ['package-confirms', 'hairline', 'drawn-mark', 'bridge', 'naming', 'design'];
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
  roles: string[];
}

const run = (theme?: string): {
  summary: Record<string, unknown>;
  findings: (Finding & {
    slot?: string | null;
    slotLies?: { slotSays: string };
    paints?: { properties: string[] };
    family?: { want: string | null; got: string[] };
    rung?: { state: string; want: string[]; oursAt: string[] };
  })[];
  typography: Typography[];
  ladders: (Ladder & { unusedRungs: unknown[] })[];
  lowContrast: ContrastPair[];
  lowStatePairs: StatePair[];
  concepts: (Concept & { clusters: unknown[]; oneColour: boolean })[];
  unusedRoles: { capability: { role: string }[]; stale: { role: string }[] };
  coverage: { lines: number; collected: number; dataUriStatic: number; unexplained: string[] };
} => JSON.parse(
  execFileSync('node', [tool, '--json', ...(theme ? [`--theme=${theme}`] : [])], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }),
) as ReturnType<typeof run>;

const disagreements = (findings: Finding[]): Open[] => findings
  .filter((f) => f.package && ['cross-family', 'family-conflict'].includes(f.package.verdict))
  .map((f) => ({
    name: f.name,
    verdict: required(f.package, `${f.name}.package`).verdict,
    roles: f.roles,
    slot: f.slot,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const actual = run();
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

const unmarked = (typography: Typography[]): {
  variable: string; reads: string; roleExists: boolean;
}[] => typography
  .filter((t) => !t.marker)
  .map((t) => ({
    variable: t.variable,
    reads: `${t.family}-${t.step}`,
    roleExists: t.roles.length > 0,
  }))
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
  const unclassified = actual.findings.filter((f) => !f.package?.verdict);
  expect(unclassified.map((f) => f.name)).toEqual([]);
});

test('the roles the package disagrees with are the reviewed ones', () => {
  const banked = baseline.open.map(({ decision, why, ...rest }: Open) => rest);
  expect(disagreements(actual.findings)).toEqual(banked);
});

test('every banked disagreement carries a decision and a reason', () => {
  const undecided = baseline.open
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

test('typography step reads with no marker are the known ones', () => {
  expect(unmarked(actual.typography)).toEqual(baseline.typographyUnmarked);
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
  const known = new Set([
    ...baseline.open.map((o: Open) => o.name),
    ...baseline.slotLies.map((o: SlotLie) => o.name),
  ]);
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

test('roles that sit on the package\'s rung for another state are the reviewed ones', () => {
  const seen = actual.findings
    .filter((f) => f.rung)
    .map((f) => ({
      name: f.name,
      state: required(f.rung, `${f.name}.rung`).state,
      roles: f.roles,
      oursAt: required(f.rung, `${f.name}.rung`).oursAt,
      want: required(f.rung, `${f.name}.rung`).want,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  expect(seen.length).toBeGreaterThan(0);
  expect(seen).toEqual(baseline.rungs.map(({ decision, why, ...rest }: Rung) => rest));
});

test('every banked rung carries a decision and a reason', () => {
  const undecided = baseline.rungs
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

test('text on its own background below AA is the reviewed set', () => {
  const measured = actual.lowContrast
    .map(({
      selector, fgRole, bgRole, contrast,
    }) => ({
      selector, fgRole, bgRole, contrast,
    }))
    .sort((a, b) => a.selector.localeCompare(b.selector));
  expect(measured)
    .toEqual(baseline.contrast.map(({ decision, why, ...rest }: ContrastPair) => rest));
});

test('every banked contrast pair carries a decision and a reason', () => {
  const undecided = baseline.contrast
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

test('roles the package assigns and the theme never reads are the known ones', () => {
  expect(actual.unusedRoles.capability.map((r) => r.role)).toEqual(baseline.unusedRoles.capability);
  expect(actual.unusedRoles.stale.map((r) => r.role)).toEqual(baseline.unusedRoles.stale);
});

test('contrast lost across a state change is the reviewed set', () => {
  const measured = actual.lowStatePairs
    .map(({
      bg, fg, fgRole, bgRole, contrast, selector,
    }) => ({
      bg, fg, fgRole, bgRole, contrast, selector,
    }))
    .sort((a, b) => (a.bg + a.selector).localeCompare(b.bg + b.selector));
  const banked = baseline.statePairs.rows
    .map(({
      bg, fg, fgRole, bgRole, contrast, selector,
    }: StatePair) => ({
      bg, fg, fgRole, bgRole, contrast, selector,
    }))
    .sort((a: StatePair, b: StatePair) => (a.bg + a.selector).localeCompare(b.bg + b.selector));
  expect(measured).toEqual(banked);
});

test('every cross-state pair carries a decision, and every design group a reason', () => {
  const undecided = baseline.statePairs.rows
    .filter((r: StatePair) => !r.decision || !STATE_PAIR_DECISIONS.includes(r.decision))
    .map((r: StatePair) => r.bg);
  expect(undecided).toEqual([]);

  const groups = [...new Set(baseline.statePairs.rows
    .filter((r: StatePair) => r.group)
    .map((r: StatePair) => r.group as string) as string[])].sort();
  expect(Object.keys(baseline.statePairs.groups).sort()).toEqual(groups);

  const unreasoned = Object.entries(baseline.statePairs.groups)
    .filter(([, g]) => !(g as { why?: string }).why?.trim())
    .map(([key]) => key);
  expect(unreasoned).toEqual([]);
});

test('every tier declaration is present in the bundle the checks read', () => {
  expect(actual.summary.declarationsMissingFromBundle)
    .toBe(baseline.bundleFreshness.declarationsMissingFromBundle);
});
