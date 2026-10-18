import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from './__mock__/helpers/utils';

describe('TreeList user state', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should include the expandedRowKeys', async () => {
    const { instance } = await createTreeList({
      dataSource: [{ id: 1, parentId: 0, name: 'Alex' }],
      expandedRowKeys: [1],
    });

    expect(instance.getController('data').getUserState()).toEqual({
      searchText: '',
      expandedRowKeys: [1],
      pageIndex: 0,
      pageSize: 20,
    });
  });
});
