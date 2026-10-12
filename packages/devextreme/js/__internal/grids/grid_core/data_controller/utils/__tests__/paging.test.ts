import { describe, expect, it } from '@jest/globals';

import type { PagingDataSource } from '../../types';
import { syncPaging } from '../paging';

const createDataSourceMock = (
  state: { paginate: boolean; pageSize: number; pageIndex: number },
): PagingDataSource & { state: typeof state; calls: string[] } => {
  const calls: string[] = [];

  return {
    state,
    calls,
    paginate(value?: boolean): boolean | undefined {
      if (value === undefined) {
        return state.paginate;
      }

      calls.push(`paginate(${value})`);
      state.paginate = value;
      // Mirrors DataSource.paginate, which resets pageIndex on change.
      state.pageIndex = 0;

      return undefined;
    },
    pageSize(value?: number): number | undefined {
      // Mirrors the adapter, which reports 0 while paginate is off.
      if (value === undefined) {
        return state.paginate ? state.pageSize : 0;
      }

      calls.push(`pageSize(${value})`);
      state.pageSize = value;

      return undefined;
    },
    pageIndex(value?: number): number | undefined {
      if (value === undefined) {
        return state.pageIndex;
      }

      calls.push(`pageIndex(${value})`);
      state.pageIndex = value;

      return undefined;
    },
    requireTotalCount(value?: boolean): boolean | undefined {
      if (value === undefined) {
        return true;
      }

      calls.push(`requireTotalCount(${value})`);

      return undefined;
    },
  };
};

describe('syncPaging', () => {
  it('should report no changes and write nothing when the data source already matches', () => {
    const dataSource = createDataSourceMock({ paginate: true, pageSize: 10, pageIndex: 2 });

    const changes = syncPaging(dataSource, {
      paginate: true, pageSize: 10, pageIndex: 2,
    });

    expect(changes).toEqual({
      hasChanges: false,
      isPaginateChanged: false,
      isPageSizeChanged: false,
      isPageIndexChanged: false,
    });
    expect(dataSource.calls).toEqual([]);
  });

  it('should skip members the target leaves undefined', () => {
    const dataSource = createDataSourceMock({ paginate: true, pageSize: 10, pageIndex: 2 });

    const changes = syncPaging(dataSource, { pageSize: 5 });

    expect(changes.hasChanges).toBe(true);
    expect(changes.isPageSizeChanged).toBe(true);
    expect(changes.isPaginateChanged).toBe(false);
    expect(changes.isPageIndexChanged).toBe(false);
    expect(dataSource.state).toEqual({ paginate: true, pageSize: 5, pageIndex: 2 });
  });

  it('should restore pageIndex after a paginate change resets it', () => {
    const dataSource = createDataSourceMock({ paginate: false, pageSize: 10, pageIndex: 3 });

    const changes = syncPaging(dataSource, {
      paginate: true, pageSize: 10, pageIndex: 3,
    });

    expect(changes).toEqual({
      hasChanges: true,
      isPaginateChanged: true,
      isPageSizeChanged: false,
      isPageIndexChanged: true,
    });
    expect(dataSource.state.pageIndex).toBe(3);
    expect(dataSource.calls).toEqual([
      'paginate(true)',
      'pageIndex(3)',
    ]);
  });

  it('should not report a pageSize change when only paginate turns on', () => {
    const dataSource = createDataSourceMock({ paginate: false, pageSize: 10, pageIndex: 0 });

    const changes = syncPaging(dataSource, {
      paginate: true, pageSize: 10, pageIndex: 0,
    });

    expect(changes.isPaginateChanged).toBe(true);
    expect(changes.isPageSizeChanged).toBe(false);
    expect(dataSource.calls).toEqual(['paginate(true)']);
  });
});
