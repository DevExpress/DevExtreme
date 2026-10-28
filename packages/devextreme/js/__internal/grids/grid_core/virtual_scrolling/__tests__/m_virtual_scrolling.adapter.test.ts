import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties } from '@js/ui/data_grid';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

type ForwardedMethod = (...args: unknown[]) => unknown;

type MethodHost = Record<string, ForwardedMethod>;

interface AdapterUnderTest {
  adapter: MethodHost;
  scrollController: MethodHost;
  dataSource: MethodHost;
}

const DATA = Array.from({ length: 40 }, (_, i) => ({ id: i + 1 }));

const createAdapter = async (
  scrolling: Record<string, unknown> = {},
): Promise<AdapterUnderTest> => {
  const { instance } = await createDataGrid({
    dataSource: DATA,
    height: 200,
    paging: { pageSize: 10 },
    scrolling: { mode: 'virtual', ...scrolling },
  } as Properties);
  await flushAsync();

  const adapter = instance.getController('dataSource').getAdapter() as unknown as MethodHost & {
    _virtualScrollController: MethodHost;
    _dataSource: MethodHost;
  };

  return {
    adapter,
    scrollController: adapter._virtualScrollController,
    dataSource: adapter._dataSource,
  };
};

const NON_PAGING_CASES: { method: string; args: unknown[] }[] = [
  { method: 'virtualItemsCount', args: [] },
  { method: 'getContentOffset', args: ['end'] },
  { method: 'getVirtualContentSize', args: [] },
  { method: 'setContentItemSizes', args: [[20, 30]] },
  { method: 'setViewportPosition', args: [100] },
  { method: 'getViewportItemIndex', args: [] },
  { method: 'setViewportItemIndex', args: [5] },
  { method: 'getItemIndexByPosition', args: [] },
  { method: 'viewportSize', args: [12] },
  { method: 'viewportItemSize', args: [25] },
  { method: 'getItemSize', args: [] },
  { method: 'getItemSizes', args: [] },
  { method: 'loadIfNeed', args: [] },
];

const PAGING_CASES: { method: string; args: unknown[] }[] = [
  { method: 'beginPageIndex', args: [] },
  { method: 'beginPageIndex', args: [-1] },
  { method: 'endPageIndex', args: [] },
  { method: 'pageIndex', args: [] },
  { method: 'pageIndex', args: [2] },
];

describe('Virtual scrolling data source adapter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it.each(NON_PAGING_CASES)('$method returns the virtual scroll controller value for $args', async ({ method, args }) => {
    const { adapter, scrollController } = await createAdapter();
    const result = { method };
    const spy = jest.spyOn(scrollController, method).mockReturnValue(result);

    expect(adapter[method](...args)).toBe(result);
    expect(spy).toHaveBeenCalledWith(...args);
  });

  it.each(PAGING_CASES)('$method returns the data source page index for $args when legacy scrolling is off', async ({ method, args }) => {
    const { adapter, dataSource, scrollController } = await createAdapter({ legacyMode: false });
    const result = { method };
    const dataSourceSpy = jest.spyOn(dataSource, 'pageIndex').mockReturnValue(result);
    const scrollControllerSpy = jest.spyOn(scrollController, method);

    expect(adapter[method](...args)).toBe(result);
    expect(dataSourceSpy).toHaveBeenCalledWith(...args);
    expect(scrollControllerSpy).not.toHaveBeenCalled();
  });

  it.each(PAGING_CASES)('$method returns the virtual scroll controller value for $args in legacy scrolling', async ({ method, args }) => {
    const { adapter, scrollController } = await createAdapter({ legacyMode: true });
    const result = { method };
    const spy = jest.spyOn(scrollController, method).mockReturnValue(result);

    expect(adapter[method](...args)).toBe(result);
    expect(spy).toHaveBeenCalledWith(...args);
  });
});
