import { describe, expect, it } from '@jest/globals';
import { noop } from '@js/core/utils/common';

import { GroupingHelper } from '../grouping_collapsed';
import type { GroupingLoadOperation } from '../types';
import { createDataSourceAdapterStub } from './grouping_expanded.mock';

describe('handleDataLoadedCore', () => {
  it('should keep custom loaded groups whose items are not an array', () => {
    const grouping = new GroupingHelper(createDataSourceAdapterStub());
    const options: GroupingLoadOperation = {
      storeLoadOptions: { group: [{ selector: 'g' }, { selector: 'h' }] },
      isCustomLoading: true,
      data: [{ key: 0, items: { key: 0, items: null } }],
    };

    grouping.handleDataLoadedCore(options, noop);

    expect(options.data).toEqual([{ key: 0, items: { key: 0, items: null } }]);
  });
});
