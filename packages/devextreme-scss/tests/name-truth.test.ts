/*
 * A published name has to describe the CSS property it is assigned to.
 *
 * The naming enforcer checks the SHAPE of a name - component, element, part, state - and the colour
 * audit checks that a colour slot reads the right role. Neither asks whether `-height` is written
 * to a height or `-gap` to a gap, and `--dx-list-bottom-padding` fed a margin for a year without a
 * single check going red.
 *
 * Measured from the built bundle by tools/review/name-truth.mjs, so the question is what the
 * browser does with the name, not what the SCSS looks like. Only DIRECT assignments are judged: a
 * name inside a calc() is a quantity another property is computed from, and naming it after that
 * property would be the lie.
 */

import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageRoot = process.cwd();
const tool = join(packageRoot, 'tools', 'review', 'name-truth.mjs');
const reviewed = JSON.parse(readFileSync(join(packageRoot, 'tools', 'review', 'name-truth.json'), 'utf8'));

interface Row { name: string; says: string; paints: string[]; decision?: string; why?: string }

const actual: {
  summary: Record<string, number>;
  rows: (Row & { verdict: string; bad: string[] })[];
} = JSON.parse(execFileSync('node', [tool, '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const DECISIONS = ['banked', 'by-equality', 'defect'];

test('names whose word disagrees with the property they feed are the reviewed ones', () => {
  const seen = actual.rows
    .filter((r) => r.verdict === 'wrong')
    .map((r) => ({ name: r.name, says: r.says, paints: r.bad }))
    .sort((a, b) => a.name.localeCompare(b.name));

  expect(seen.length).toBeGreaterThan(0);
  expect(seen).toEqual(reviewed.rows.map(({ decision, why, ...rest }: Row) => rest));
});

test('every reviewed row carries a decision and a reason', () => {
  const undecided = reviewed.rows
    .filter((r: Row) => !r.decision || !DECISIONS.includes(r.decision) || !r.why?.trim())
    .map((r: Row) => r.name);
  expect(undecided).toEqual([]);
});

/*
 * The vocabulary has to stay closed: a word the pass does not know is a name nobody is checking.
 * Held loosely - this is a ceiling, not an exact count - because the number falls as words are
 * given rules and that should not be a red build.
 */
test('the words the pass cannot read stay a short list', () => {
  expect(actual.summary.noRule).toBeLessThanOrEqual(120);
  expect(actual.summary.agrees).toBeGreaterThan(1800);
});
