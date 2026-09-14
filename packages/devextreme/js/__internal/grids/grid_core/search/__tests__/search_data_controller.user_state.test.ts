import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('Search data controller user state', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should include the search panel text', async () => {
    const { instance } = await createDataGrid({
      dataSource: [],
      searchPanel: { text: 'Alex' },
    });

    expect(instance.getController('data').getUserState()).toEqual({
      searchText: 'Alex',
      pageIndex: 0,
      pageSize: 20,
    });
  });
});
