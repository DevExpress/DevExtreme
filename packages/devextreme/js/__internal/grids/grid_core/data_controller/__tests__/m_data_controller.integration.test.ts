import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

const employees = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering' },
  { id: 2, name: 'Bob Smith', department: 'Engineering' },
  { id: 3, name: 'Carol White', department: 'Engineering' },
  { id: 4, name: 'Dan Brown', department: 'Sales' },
  { id: 5, name: 'Eve Davis', department: 'Sales' },
  { id: 6, name: 'Frank Miller', department: 'Sales' },
  { id: 7, name: 'Grace Wilson', department: 'HR' },
  { id: 8, name: 'Hank Moore', department: 'HR' },
  { id: 9, name: 'Ivy Taylor', department: 'Finance' },
  { id: 10, name: 'Jack Anderson', department: 'Finance' },
];

describe('DataController paging.pageIndex option sync', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should reset bound paging.pageIndex to 0 when a filter shrinks the page count (T1333073)', async () => {
    const onOptionChanged = jest.fn();
    const { instance } = await createDataGrid({
      dataSource: employees,
      keyExpr: 'id',
      paging: { pageIndex: 2, pageSize: 3 },
      onOptionChanged,
    });

    expect(instance.option('paging.pageIndex')).toBe(2);
    onOptionChanged.mockClear();

    instance.filter(['department', '=', 'Engineering']);
    await flushAsync();

    expect(instance.option('paging.pageIndex')).toBe(0);
    const pageIndexCall = onOptionChanged.mock.calls
      .find((call) => (call[0] as { fullName: string }).fullName === 'paging.pageIndex');
    expect(pageIndexCall?.[0]).toMatchObject({ fullName: 'paging.pageIndex', value: 0 });
  });

  it('should reset bound paging.pageIndex to 0 when the search panel shrinks the page count (T1333073)', async () => {
    const onOptionChanged = jest.fn();
    const { instance } = await createDataGrid({
      dataSource: employees,
      keyExpr: 'id',
      paging: { pageIndex: 2, pageSize: 3 },
      searchPanel: { visible: true },
      onOptionChanged,
    });

    expect(instance.option('paging.pageIndex')).toBe(2);
    onOptionChanged.mockClear();

    instance.option('searchPanel.text', 'Alice');
    await flushAsync();

    expect(instance.option('paging.pageIndex')).toBe(0);
    const pageIndexCall = onOptionChanged.mock.calls
      .find((call) => (call[0] as { fullName: string }).fullName === 'paging.pageIndex');
    expect(pageIndexCall?.[0]).toMatchObject({ fullName: 'paging.pageIndex', value: 0 });
  });

  it('should not fire paging.pageIndex change when filtering while already on the first page (T1333073)', async () => {
    const onOptionChanged = jest.fn();
    const { instance } = await createDataGrid({
      dataSource: employees,
      keyExpr: 'id',
      paging: { pageIndex: 0, pageSize: 3 },
      onOptionChanged,
    });

    onOptionChanged.mockClear();

    instance.filter(['department', '=', 'Engineering']);
    await flushAsync();

    expect(instance.option('paging.pageIndex')).toBe(0);
    const pageIndexCall = onOptionChanged.mock.calls
      .find((call) => (call[0] as { fullName: string }).fullName === 'paging.pageIndex');
    expect(pageIndexCall).toBeUndefined();
  });
});
