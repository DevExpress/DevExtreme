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

test('the words the pass cannot read stay a short list', () => {
  expect(actual.summary.noRule).toBeLessThanOrEqual(120);
  expect(actual.summary.agrees).toBeGreaterThan(1800);
});
