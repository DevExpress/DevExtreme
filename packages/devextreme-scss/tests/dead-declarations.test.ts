import * as fs from 'fs';
import * as path from 'path';
import { getThemes } from '../build/theme-options.cjs';
import {
  cascadeOf, originOf, packageRoot, parseBundle,
} from './compiled-bundles';

jest.setTimeout(300000);

const baselinePath = path.join(__dirname, 'dead-declarations.baseline.json');

interface BaselineEntry {
  file: string;
  property: string;
  selector: string;
  reason: string;
}

interface Position {
  file: string;
  line: number;
  property: string;
  selector: string;
  total: number;
  dead: number;
  winners: Set<string>;
}

const signature = (entry: { file: string; property: string; selector: string }): string => (
  `${entry.file}|${entry.property}|${entry.selector}`
);

const collectDeadPositions = async (): Promise<{ positions: Position[]; bundles: number }> => {
  const positions = new Map<string, Position>();
  let bundles = 0;

  for (const theme of getThemes()) {
    // eslint-disable-next-line no-await-in-loop
    const { emissions, winners } = cascadeOf(await parseBundle(theme));
    bundles += 1;

    emissions.forEach((emission) => {
      const loses = emission.keys.every((key) => winners.get(key) !== emission);
      const origin = originOf(emission.decl);
      const id = `${origin.file}:${origin.line}:${emission.decl.prop}`;
      const position = positions.get(id) ?? {
        ...origin,
        property: emission.decl.prop,
        selector: emission.rule.selector.replace(/\s+/g, ' ').trim(),
        total: 0,
        dead: 0,
        winners: new Set<string>(),
      };
      position.total += 1;
      if (loses) {
        position.dead += 1;
        const winner = winners.get(emission.keys[0]);
        if (winner) {
          const at = originOf(winner.decl);
          position.winners.add(`${at.file}:${at.line}`);
        }
      }
      positions.set(id, position);
    });
  }

  return {
    positions: [...positions.values()].filter((position) => position.dead === position.total),
    bundles,
  };
};

describe('declarations the cascade never renders', () => {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as BaselineEntry[];
  let dead: Position[] = [];
  let bundles = 0;

  beforeAll(async () => {
    ({ positions: dead, bundles } = await collectDeadPositions());
  });

  test('every theme bundle compiles', () => {
    expect(bundles).toBe(getThemes().length);
  });

  test('every baseline entry carries a reason', () => {
    const unexplained = baseline.filter((entry) => !entry.reason?.trim());

    expect(unexplained.map(signature)).toEqual([]);
  });

  test('every dead declaration is removed or listed in the baseline with a reason', () => {
    const known = new Set(baseline.filter((entry) => entry.reason?.trim()).map(signature));
    const unexpected = dead.filter((position) => !known.has(signature(position)));

    const report = unexpected.map((position) => [
      `${position.file}:${position.line}  ${position.property} on \`${position.selector}\``,
      `    repainted from ${[...position.winners].slice(0, 3).join(', ')}`,
      `    remove it, or add to ${path.relative(packageRoot, baselinePath)} with a reason:`,
      `    ${JSON.stringify({ file: position.file, property: position.property, selector: position.selector })}`,
    ].join('\n'));

    expect(report).toEqual([]);
  });

  test('every baseline entry is still dead', () => {
    const current = new Set(dead.map(signature));
    const stale = baseline.filter((entry) => !current.has(signature(entry)));

    expect(stale.map((entry) => `${entry.file} ${entry.property} on \`${entry.selector}\` renders again - remove the entry`))
      .toEqual([]);
  });
});
