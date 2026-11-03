import { describe, expect, it } from '@jest/globals';

import { createOffsetFilter } from '../m_grouping_core';

describe('createOffsetFilter', () => {
  it.each([
    {
      name: 'an ascending group key',
      path: ['A'],
      group: [{ selector: 'g' }],
      expected: [['g', '<', 'A'], 'or', ['g', '=', null]],
    },
    {
      name: 'a descending group key',
      path: ['A'],
      group: [{ selector: 'g', desc: true }],
      expected: ['g', '>', 'A'],
    },
    {
      name: 'an ascending false key',
      path: [false],
      group: [{ selector: 'g' }],
      expected: ['g', '=', null],
    },
    {
      name: 'a descending false key',
      path: [false],
      group: [{ selector: 'g', desc: true }],
      expected: ['g', '=', true],
    },
    {
      name: 'an ascending true key',
      path: [true],
      group: [{ selector: 'g' }],
      expected: ['g', '<>', true],
    },
    {
      name: 'a descending true key',
      path: [true],
      group: [{ selector: 'g', desc: true }],
      expected: [['g', '<>', null], 'and', ['g', '=', null]],
    },
    {
      name: 'an ascending null key',
      path: [null],
      group: [{ selector: 'g' }],
      expected: [['g', '<>', null], 'and', ['g', '=', null]],
    },
    {
      name: 'a descending null key',
      path: [null],
      group: [{ selector: 'g', desc: true }],
      expected: ['g', '<>', null],
    },
    {
      name: 'a two-level path',
      path: ['A', 'B'],
      group: [{ selector: 'g1' }, { selector: 'g2', desc: true }],
      expected: [
        [['g1', '<', 'A'], 'or', ['g1', '=', null]],
        'or',
        [['g1', '=', 'A'], 'and', ['g2', '>', 'B']],
      ],
    },
  ])('should create the offset filter for $name', ({ path, group, expected }) => {
    expect(createOffsetFilter(path, { group })).toEqual(expected);
  });

  it('should create the filter for the last level only', () => {
    const filter = createOffsetFilter(
      ['A', 'B'],
      { group: [{ selector: 'g1' }, { selector: 'g2' }] },
      true,
    );

    expect(filter).toEqual([
      ['g1', '=', 'A'],
      'and',
      [['g2', '<', 'B'], 'or', ['g2', '=', null]],
    ]);
  });

  it('should combine the offset filter with the load filter', () => {
    const filter = createOffsetFilter(
      ['A'],
      { group: [{ selector: 'g', desc: true }], filter: ['f', '=', 1] },
    );

    expect(filter).toEqual([['g', '>', 'A'], 'and', ['f', '=', 1]]);
  });
});
