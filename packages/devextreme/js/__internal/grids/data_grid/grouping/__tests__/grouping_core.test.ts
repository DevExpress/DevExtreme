import { describe, expect, it } from '@jest/globals';
import type { LoadOperation } from '@ts/grids/grid_core/data_source_adapter/types';

import { createOffsetFilter } from '../m_grouping_core';
import { GroupingHelper } from '../m_grouping_expanded';
import { createDataSourceAdapterStub } from './grouping_expanded.mock';

const refresh = (grouping: GroupingHelper, group: unknown): void => {
  const options = { storeLoadOptions: { group } } as unknown as LoadOperation;

  grouping.refresh(options, {});
};

describe('refresh', () => {
  it('should keep group infos added before the first refresh', () => {
    const grouping = new GroupingHelper(createDataSourceAdapterStub());
    grouping.addGroupInfo({
      offset: 0, count: 2, isExpanded: false, path: ['A'],
    });

    refresh(grouping, [{ selector: 'g' }]);

    expect(grouping.findGroupInfo(['A'])).toMatchObject({ isExpanded: false, count: 2 });
  });

  it('should reset group infos when grouping is applied after it was cleared', () => {
    const grouping = new GroupingHelper(createDataSourceAdapterStub());
    refresh(grouping, [{ selector: 'g' }]);
    refresh(grouping, undefined);
    grouping.addGroupInfo({
      offset: 0, count: 2, isExpanded: false, path: ['A'],
    });

    refresh(grouping, [{ selector: 'g' }]);

    expect(grouping.findGroupInfo(['A'])).toBeUndefined();
  });
});

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
