import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
  { id: 3, value: 'c' },
  { id: 4, value: 'd' },
  { id: 5, value: 'e' },
];

interface PagingAdapter {
  paginate: () => boolean;
  requireTotalCount: () => boolean;
}

const getVisibleKeys = (instance: DataGridInstance): unknown[] => instance
  .getVisibleRows()
  .map((row) => row.key as unknown);

const getIsPaging = (instance: DataGridInstance): unknown => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataController = instance.getController('data') as any;

  return dataController._isPaging as unknown;
};

// The controller's `dataSource()` is the DataSourceAdapter, not the raw DataSource.
const getAdapter = (instance: DataGridInstance): PagingAdapter => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataController = instance.getController('data') as any;

  return dataController.dataSource() as PagingAdapter;
};

describe('DataController paging', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('applyPagingOptions', () => {
    describe('when no paging option actually changed (T677650)', () => {
      it('should not reload and should not fire pageChanged', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageIndex: 0, pageSize: 3 },
        });

        const pageChangedSpy = jest.fn();
        instance.getController('data').pageChanged.add(pageChangedSpy);

        const changedSpy = jest.fn();
        instance.getDataSource().on('changed', changedSpy);

        const loadingSpy = jest.fn();
        instance.getDataSource().store().on('loading', loadingSpy);

        instance.option('paging', { enabled: true, pageIndex: 0, pageSize: 3 });
        await flushAsync();

        expect(pageChangedSpy).not.toHaveBeenCalled();
        expect(changedSpy).not.toHaveBeenCalled();
        expect(loadingSpy).not.toHaveBeenCalled();
      });

      it('should apply requireTotalCount', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageIndex: 0, pageSize: 3 },
        });

        const requireTotalCountSpy = jest.spyOn(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          instance.getDataSource() as any,
          'requireTotalCount',
        );

        instance.option('paging', { enabled: true, pageIndex: 0, pageSize: 3 });
        await flushAsync();

        expect(requireTotalCountSpy).toHaveBeenCalledWith(true);
      });
    });

    // The paginate/pageIndex ordering itself is guarded in utils/__tests__/paging.test.ts.
    describe('paging.enabled toggling', () => {
      it('should keep paging.pageIndex but reset the dataSource when paging is disabled on a non-zero page', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageSize: 2 },
        });

        instance.option('paging.pageIndex', 1);
        await flushAsync();

        expect(getVisibleKeys(instance)).toEqual([3, 4]);

        instance.option('paging.enabled', false);
        await flushAsync();

        expect({
          pagingPageIndex: instance.option('paging.pageIndex'),
          dataSourcePageIndex: instance.getDataSource().pageIndex(),
          visibleKeys: getVisibleKeys(instance),
        }).toEqual({
          pagingPageIndex: 1,
          dataSourcePageIndex: 0,
          visibleKeys: [1, 2, 3, 4, 5],
        });
      });

      it('should land on the configured page when paging is enabled with a non-zero pageIndex', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: false, pageSize: 2, pageIndex: 1 },
        });

        instance.option('paging.enabled', true);
        await flushAsync();

        expect(instance.option('paging.pageIndex')).toBe(1);
        expect(instance.getDataSource().pageIndex()).toBe(1);
        expect(getVisibleKeys(instance)).toEqual([3, 4]);
      });
    });

    describe('pageChanged and _isPaging on the option path', () => {
      it('should fire pageChanged once with the new index when paging.pageIndex changes', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageSize: 2 },
        });

        const pageChangedSpy = jest.fn();
        instance.getController('data').pageChanged.add(pageChangedSpy);

        instance.option('paging.pageIndex', 1);
        await flushAsync();

        expect(pageChangedSpy).toHaveBeenCalledTimes(1);
        expect(pageChangedSpy).toHaveBeenCalledWith(1);
      });

      it('should fire pageChanged once when only paging.pageSize changes', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageSize: 2 },
        });

        const pageChangedSpy = jest.fn();
        instance.getController('data').pageChanged.add(pageChangedSpy);

        instance.option('paging.pageSize', 3);
        await flushAsync();

        expect(pageChangedSpy).toHaveBeenCalledTimes(1);
        expect(pageChangedSpy).toHaveBeenCalledWith(0);
      });

      it('should set _isPaging while the pageIndex load is in flight and clear it afterwards', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageSize: 2 },
        });

        instance.option('paging.pageIndex', 1);

        expect(getIsPaging(instance)).toBe(true);

        await flushAsync();

        expect(getIsPaging(instance)).toBe(false);
      });

      it('should set _isPaging to false, not undefined, when re-init changes no paging option', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
        });

        instance.option('dataSource', {
          store: { type: 'array', key: 'id', data: [{ id: 9, value: 'z' }] },
        });

        expect(getIsPaging(instance)).toBe(false);

        await flushAsync();
      });
    });

    describe('option derivation', () => {
      it('should disable requireTotalCount in infinite scrolling mode', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          height: 200,
          paging: { pageSize: 2 },
          scrolling: { mode: 'infinite' },
        });

        expect(getAdapter(instance).requireTotalCount()).toBe(false);
      });

      it('should enable requireTotalCount in regular paging mode', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { pageSize: 2 },
        });

        expect(getAdapter(instance).requireTotalCount()).toBe(true);
        expect(instance.option('paging.enabled')).toBe(true);
      });

      it('should paginate the dataSource in virtual mode even when paging is disabled', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          height: 200,
          paging: { enabled: false, pageSize: 2 },
          scrolling: { mode: 'virtual' },
        });

        expect(getAdapter(instance).paginate()).toBe(true);
        expect(instance.option('paging.enabled')).toBe(false);
      });
    });

    describe('initial application', () => {
      it('should push initial paging options down to the dataSource on first render', async () => {
        const { instance } = await createDataGrid({
          dataSource: DATA,
          keyExpr: 'id',
          paging: { enabled: true, pageSize: 2, pageIndex: 1 },
        });

        const dataSource = instance.getDataSource();

        expect(dataSource.pageSize()).toBe(2);
        expect(dataSource.pageIndex()).toBe(1);
        expect(getVisibleKeys(instance)).toEqual([3, 4]);
      });
    });
  });

  describe('paging.pageIndex option sync', () => {
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
});
