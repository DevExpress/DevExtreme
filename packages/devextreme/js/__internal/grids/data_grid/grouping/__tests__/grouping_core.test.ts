import { describe, expect, it } from '@jest/globals';
import type { StoreLoadOptions } from '@ts/data/data_source/types';

import { GroupingHelper } from '../m_grouping_expanded';
import { createDataSourceAdapterStub } from './grouping_expanded.mock';

const refresh = (grouping: GroupingHelper, group: StoreLoadOptions['group']): void => {
  grouping.refresh({ storeLoadOptions: { group } }, {});
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
