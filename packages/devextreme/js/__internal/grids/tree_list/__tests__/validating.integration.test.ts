import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from './__mock__/helpers/utils';

describe('TreeList Batch Editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should not move an invalid row from another page to the current page after a failed save', async () => {
    const { instance } = await createTreeList({
      dataSource: [
        {
          id: 1, parentId: 0, name: 'Name 1', age: 10,
        },
        {
          id: 2, parentId: 0, name: 'Name 2', age: 20,
        },
        {
          id: 3, parentId: 0, name: 'Name 3', age: 30,
        },
        {
          id: 4, parentId: 0, name: 'Name 4', age: 40,
        },
        {
          id: 5, parentId: 0, name: 'Name 5', age: 50,
        },
      ],
      paging: { enabled: true, pageSize: 2 },
      scrolling: { mode: 'standard' },
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [
        'name',
        { dataField: 'age', validationRules: [{ type: 'range', min: 1, max: 100 }] },
      ],
    });

    instance.cellValue(0, 'age', 101);
    jest.runAllTimers();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- settled by runAllTimers
    instance.pageIndex(1);
    jest.runAllTimers();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- settled by runAllTimers
    instance.saveEditData();
    jest.runAllTimers();

    expect(instance.hasEditData()).toBe(true);
    expect(instance.getVisibleRows()).toHaveLength(2);
    expect(instance.getRowIndexByKey(1)).toBe(-1);
  });
});
