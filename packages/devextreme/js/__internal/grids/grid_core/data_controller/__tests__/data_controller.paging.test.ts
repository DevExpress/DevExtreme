import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

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

// `_isPaging` is protected and has no public observer.
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

describe('_setPagingOptions', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // Guards the `false | { flags }` return union: the "nothing changed" branch
  // is what suppresses the reload. Mirrors QUnit T677650.
  describe('when no paging option actually changed', () => {
    // EXPECTED: green before and after the cleanup.
    it('should not reload and should not fire pageChanged', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        paging: { enabled: true, pageIndex: 0, pageSize: 3 },
      });

      const pageChangedSpy = jest.fn();
      instance.getController('data').pageChanged.add(pageChangedSpy);

      const loadingSpy = jest.fn();
      instance.getDataSource().store().on('loading', loadingSpy);

      instance.option('paging', { enabled: true, pageIndex: 0, pageSize: 3 });
      await flushAsync();

      expect(pageChangedSpy).not.toHaveBeenCalled();
      expect(loadingSpy).not.toHaveBeenCalled();
    });

    // `requireTotalCount` is applied unconditionally and has no change flag,
    // so gating the apply step on "something changed" would silently drop it.
    // EXPECTED: green before and after the cleanup.
    it('should still apply requireTotalCount', async () => {
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

  // `DataSource.paginate(value)` calls `pageIndex(0)` internally, so the
  // pageIndex comparison below it reads an already-reset value. These two pin
  // that ordering. Expected values are recorded from a run, not derived.
  describe('paginate / pageIndex ordering', () => {
    // Recorded behavior: `paging.pageIndex` keeps the page the user was on,
    // but the dataSource lands on 0. `_setPagingOptions` does restore the raw
    // pageIndex (paginate() resets it to 0, then the comparison against the
    // option pushes 1 back down), and the following load then normalizes it:
    // with paginate false the adapter's pageSize() returns 0, so pageCount()
    // is 1 and m_data_source_adapter.ts:650 clamps pageIndex to 0.
    // The option stays the source of truth — see the next test for the
    // round trip back.
    // EXPECTED: green before and after the cleanup (characterization).
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

      // Asserted as one object so a failure reports every actual value at once
      // (ts-jest misreports line numbers for this suite).
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

    // EXPECTED: green before and after the cleanup (characterization).
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

  // The `pageChanged` tests in QUnit dataController.tests.js cover the
  // `changePaging` API path (`pageIndex()` / `pageSize()`), not this one.
  describe('pageChanged and _isPaging on the option path', () => {
    // EXPECTED: green before and after the cleanup.
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

    // Surprising but intentional: this path fires pageChanged whenever ANY
    // flag changed, not only on a pageIndex change.
    // EXPECTED: green before and after the cleanup.
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

    // EXPECTED: green before and after the cleanup.
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

    // The only runtime observer of the `false | { flags }` union: on the
    // no-change branch `_initDataSource` currently assigns `undefined` via
    // `changedPagingOptions?.isPageIndexChanged`.
    // EXPECTED: RED before the cleanup (receives undefined), green after.
    it('should set _isPaging to false, not undefined, when re-init changes no paging option', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
      });

      // Object form, so `_handleDataSourceChange` takes the reset path
      // (`_initDataSource`) rather than the in-place refresh path.
      instance.option('dataSource', {
        store: { type: 'array', key: 'id', data: [{ id: 9, value: 'z' }] },
      });

      expect(getIsPaging(instance)).toBe(false);

      await flushAsync();
    });
  });

  describe('option derivation', () => {
    // EXPECTED: green before and after the cleanup.
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

    // The second assertion probes whether the `pagingEnabled !== undefined`
    // guard is reachable: if `paging.enabled` always resolves to a defined
    // value, the guard never short-circuits and can be dropped.
    // EXPECTED: green before and after the cleanup.
    it('should enable requireTotalCount in regular paging mode', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        paging: { pageSize: 2 },
      });

      expect(getAdapter(instance).requireTotalCount()).toBe(true);
      expect(instance.option('paging.enabled')).toBe(true);
    });

    // paginate = enabled || virtualMode || appendMode
    // EXPECTED: green before and after the cleanup.
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

  // The `_initDataSource` caller passes the raw DataSource, not the adapter.
  describe('initial application', () => {
    // EXPECTED: green before and after the cleanup.
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
