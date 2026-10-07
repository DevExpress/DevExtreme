import {
  afterEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { variableWrapper } from '@ts/core/utils/m_variable_wrapper';
import type { NormalizedDataSourceOptions } from '@ts/data/data_source/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import type { WrappedLookupDataSource } from '@ts/grids/grid_core/types';

import gridCoreUtils from '../m_utils';

interface CellRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface CreatedPoint {
  index: number;
  columnIndex: number;
  x: number;
  y: number;
  item?: Element;
  isLeftBoundary?: boolean;
  isRightBoundary?: boolean;
}

interface DoneCallbackHolder<T> {
  done: (callback: (value: T) => void) => unknown;
}

const CELLS_CLASS = 'test-cells';

const LTR_CELLS: CellRect[] = [
  {
    left: 0, top: 10, width: 50, height: 20,
  },
  {
    left: 50, top: 10, width: 60, height: 20,
  },
  {
    left: 110, top: 10, width: 40, height: 20,
  },
];

const RTL_CELLS: CellRect[] = [
  {
    left: 100, top: 10, width: 50, height: 20,
  },
  {
    left: 40, top: 10, width: 60, height: 20,
  },
  {
    left: 0, top: 10, width: 40, height: 20,
  },
];

const LOOKUP_ITEMS = [
  { id: 1, text: 'One' },
  { id: 2, text: 'Two' },
  { id: 3, text: 'Three' },
];

const createCells = (rects: CellRect[], direction = 'ltr'): dxElementWrapper => {
  const $container = $('<div>').addClass(CELLS_CLASS).appendTo(document.body);

  rects.forEach(({
    left, top, width, height,
  }) => {
    const cell = $('<div>').css('direction', direction).appendTo($container).get(0) as HTMLElement;
    const rect = {
      left,
      top,
      width,
      height,
      x: left,
      y: top,
      right: left + width,
      bottom: top + height,
      toJSON: (): void => {},
    } as DOMRect;

    cell.getBoundingClientRect = (): DOMRect => rect;
    cell.getClientRects = (): DOMRectList => [rect] as unknown as DOMRectList;
  });

  return $container.children();
};

const notCreated = (): boolean => false;

const createPointCollector = (): {
  points: CreatedPoint[];
  pointCreated: (point: CreatedPoint) => boolean;
} => {
  const points: CreatedPoint[] = [];

  return {
    points,
    pointCreated: (point: CreatedPoint): boolean => {
      points.push({ ...point });
      return false;
    },
  };
};

const toPromise = <T>(deferred: DoneCallbackHolder<T>): Promise<T> => new Promise((resolve) => {
  deferred.done(resolve);
});

const calculateCellValue = (data: { categoryId?: number }): unknown => data.categoryId;

const createLookupColumn = (overrides: Record<string, unknown> = {}): Column => ({
  dataField: 'categoryId',
  calculateCellValue,
  defaultCalculateCellValue: calculateCellValue,
  lookup: { dataSource: LOOKUP_ITEMS, valueExpr: 'id', displayExpr: 'text' },
  ...overrides,
}) as unknown as Column;

const createDataSourceAdapter = (
  groupItems: { key: unknown }[],
  groupPaging = false,
): {
  dataSourceAdapter: DataSourceAdapter;
  customLoad: jest.Mock<(options: unknown) => unknown>;
} => {
  const customLoad = jest.fn<(options: unknown) => unknown>(
    () => Deferred<unknown>().resolve({ data: groupItems }),
  );
  const dataSourceAdapter = {
    remoteOperations: () => ({ groupPaging }),
    customLoader: { load: customLoad },
  } as unknown as DataSourceAdapter;

  return { dataSourceAdapter, customLoad };
};

describe('getPointsByColumns', () => {
  afterEach(() => {
    $(`.${CELLS_CLASS}`).remove();
  });

  describe('when the columns are in a row', () => {
    it('should create a point at the left edge of each column and at the right edge of the last one', () => {
      const points = gridCoreUtils.getPointsByColumns(createCells(LTR_CELLS), notCreated);

      expect(points).toEqual([
        {
          index: 0, columnIndex: 0, x: 0, y: 10,
        },
        {
          index: 1, columnIndex: 1, x: 50, y: 10,
        },
        {
          index: 2, columnIndex: 2, x: 110, y: 10,
        },
        {
          index: 3, columnIndex: 3, x: 150, y: 10,
        },
      ]);
    });

    it('should pass the column element of each point to pointCreated', () => {
      const cells = createCells(LTR_CELLS);
      const { points, pointCreated } = createPointCollector();

      gridCoreUtils.getPointsByColumns(cells, pointCreated);

      expect(points.map((point) => point.item)).toEqual([
        cells.get(0), cells.get(1), cells.get(2), cells.get(2),
      ]);
      expect(points[3].item).toBe(cells.get(2));
    });

    it('should start the indexes from startColumnIndex', () => {
      const points = gridCoreUtils.getPointsByColumns(
        createCells(LTR_CELLS),
        notCreated,
        false,
        2,
      );

      expect(points.map((point) => [point.index, point.columnIndex])).toEqual([
        [2, 2], [3, 3], [4, 4], [5, 5],
      ]);
    });

    it('should skip the points for which pointCreated returns true', () => {
      const points = gridCoreUtils.getPointsByColumns(
        createCells(LTR_CELLS),
        (point: CreatedPoint) => point.index === 1,
      );

      expect(points.map((point) => point.index)).toEqual([0, 2, 3]);
    });

    it('should use the top of the previous column when it is higher', () => {
      const points = gridCoreUtils.getPointsByColumns(createCells([
        {
          left: 0, top: 10, width: 50, height: 20,
        },
        {
          left: 50, top: 15, width: 60, height: 20,
        },
      ]), notCreated);

      expect(points.map((point) => point.y)).toEqual([10, 10, 15]);
    });
  });

  describe('when the grid is in RTL mode', () => {
    it('should create a point at the right edge of each column and at the left edge of the last one', () => {
      const points = gridCoreUtils.getPointsByColumns(createCells(RTL_CELLS, 'rtl'), notCreated);

      expect(points.map((point) => point.x)).toEqual([150, 100, 40, 0]);
    });
  });

  describe('when the points are vertical', () => {
    it('should create a point at the top of each row and at the bottom of the last one', () => {
      const points = gridCoreUtils.getPointsByColumns(createCells([
        {
          left: 0, top: 0, width: 50, height: 20,
        },
        {
          left: 0, top: 20, width: 50, height: 20,
        },
        {
          left: 0, top: 40, width: 50, height: 20,
        },
      ]), notCreated, true);

      expect(points.map((point) => [point.x, point.y])).toEqual([
        [0, 0], [0, 20], [0, 40], [0, 60],
      ]);
    });
  });

  describe('when there is a gap between columns and needToCheckPrevPoint is set', () => {
    it('should add a right boundary point after the previous column and mark the next point as a left boundary', () => {
      const cells = createCells([
        {
          left: 0, top: 10, width: 50, height: 20,
        },
        {
          left: 80, top: 10, width: 50, height: 20,
        },
      ]);
      const { points, pointCreated } = createPointCollector();

      const result = gridCoreUtils.getPointsByColumns(cells, pointCreated, false, 0, true);

      expect(result.map((point) => [point.index, point.x])).toEqual([
        [0, 0], [1, 50], [1, 80], [2, 130],
      ]);
      const boundaries = points.map(
        (point) => [point.x, point.isLeftBoundary, point.isRightBoundary],
      );

      expect(boundaries).toEqual([
        [0, undefined, undefined],
        [50, undefined, true],
        [80, true, undefined],
        [130, undefined, undefined],
      ]);
      expect(points[1].item).toBe(cells.get(0));
      expect(points[2].item).toBe(cells.get(1));
      expect(points[3].item).toBe(cells.get(1));
    });

    it('should swap the boundaries in RTL mode', () => {
      const cells = createCells([
        {
          left: 80, top: 10, width: 50, height: 20,
        },
        {
          left: 0, top: 10, width: 50, height: 20,
        },
      ], 'rtl');
      const { points, pointCreated } = createPointCollector();

      gridCoreUtils.getPointsByColumns(cells, pointCreated, false, 0, true);

      const boundaries = points.map(
        (point) => [point.x, point.isLeftBoundary, point.isRightBoundary],
      );

      expect(boundaries).toEqual([
        [130, undefined, undefined],
        [80, true, undefined],
        [50, undefined, true],
        [0, undefined, undefined],
      ]);
    });
  });

  describe('when there are no columns', () => {
    it('should create a single point without an element at the origin', () => {
      const { points, pointCreated } = createPointCollector();

      const result = gridCoreUtils.getPointsByColumns(createCells([]), pointCreated);

      expect(result).toEqual([{
        index: 0, columnIndex: 0, x: 0, y: 0,
      }]);
      expect(points[0].item).toBeUndefined();
    });
  });
});

describe('normalizeLookupDataSource', () => {
  describe('when the lookup has items', () => {
    it('should use the items instead of the data source', async () => {
      const options = gridCoreUtils.normalizeLookupDataSource({
        items: LOOKUP_ITEMS,
        dataSource: [{ id: 9, text: 'Nine' }],
      });

      await expect(toPromise(options.store.load())).resolves.toEqual(LOOKUP_ITEMS);
    });
  });

  describe('when the lookup has a data source array', () => {
    it('should use the array as the store data', async () => {
      const options = gridCoreUtils.normalizeLookupDataSource({ dataSource: LOOKUP_ITEMS });

      await expect(toPromise(options.store.load())).resolves.toEqual(LOOKUP_ITEMS);
    });
  });

  describe('when the data source is a function', () => {
    it('should call it with an empty object and use its result', async () => {
      const dataSource = jest.fn<(options: object) => typeof LOOKUP_ITEMS>(() => LOOKUP_ITEMS);

      const options = gridCoreUtils.normalizeLookupDataSource({ dataSource });

      expect(dataSource).toHaveBeenCalledWith({});
      await expect(toPromise(options.store.load())).resolves.toEqual(LOOKUP_ITEMS);
    });
  });

  describe('when the data source function is a wrapped variable', () => {
    afterEach(() => {
      variableWrapper.resetInjection();
    });

    it('should not call it', () => {
      const dataSource = jest.fn<(options: object) => typeof LOOKUP_ITEMS>(() => LOOKUP_ITEMS);
      variableWrapper.inject({ isWrapped: (value: unknown) => value === dataSource });

      gridCoreUtils.normalizeLookupDataSource({ dataSource });

      expect(dataSource).not.toHaveBeenCalled();
    });
  });
});

describe('getWrappedLookupDataSource', () => {
  describe('when there is no data source adapter', () => {
    it('should return an empty array', () => {
      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn(),
        null,
        null,
      );

      expect(lookupDataSource).toEqual([]);
    });
  });

  describe('when the column calculates its own cell value', () => {
    it('should return the lookup data source as it is', async () => {
      const { dataSourceAdapter, customLoad } = createDataSourceAdapter([{ key: 1 }]);
      const column = createLookupColumn({ calculateCellValue: () => 1 });

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        column,
        dataSourceAdapter,
        null,
      ) as NormalizedDataSourceOptions;

      expect(lookupDataSource).not.toHaveProperty('byKey');
      await expect(toPromise(lookupDataSource.store.load())).resolves.toEqual(LOOKUP_ITEMS);
      expect(customLoad).not.toHaveBeenCalled();
    });
  });

  describe('when the lookup items are loaded', () => {
    it('should load only the items whose keys are used in the grid', async () => {
      const { dataSourceAdapter, customLoad } = createDataSourceAdapter([{ key: 1 }, { key: 3 }]);
      const filter: DataFilter = ['categoryId', '>', 0];

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn(),
        dataSourceAdapter,
        filter,
      ) as WrappedLookupDataSource;

      await expect(toPromise(lookupDataSource.load({}))).resolves.toEqual([
        { id: 1, text: 'One' },
        { id: 3, text: 'Three' },
      ]);
      expect(customLoad).toHaveBeenCalledWith({
        filter,
        group: [{ selector: 'categoryId', isExpanded: false }],
        take: undefined,
        skip: undefined,
      });
    });

    it('should group by the display field too when it is set', async () => {
      const { dataSourceAdapter, customLoad } = createDataSourceAdapter([{ key: 1 }]);

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn({ displayField: 'categoryName' }),
        dataSourceAdapter,
        null,
      ) as WrappedLookupDataSource;
      await toPromise(lookupDataSource.load({}));

      expect(customLoad).toHaveBeenCalledWith(expect.objectContaining({
        group: [
          { selector: 'categoryId', isExpanded: true },
          { selector: 'categoryName', isExpanded: false },
        ],
      }));
    });

    it('should resolve an empty array when no keys are used', async () => {
      const { dataSourceAdapter } = createDataSourceAdapter([]);

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn(),
        dataSourceAdapter,
        null,
      ) as WrappedLookupDataSource;

      await expect(toPromise(lookupDataSource.load({}))).resolves.toEqual([]);
    });
  });

  describe('when the items are loaded again without group paging', () => {
    it('should take the keys from the cache and slice them', async () => {
      const { dataSourceAdapter, customLoad } = createDataSourceAdapter([{ key: 1 }, { key: 3 }]);

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn(),
        dataSourceAdapter,
        null,
      ) as WrappedLookupDataSource;
      await toPromise(lookupDataSource.load({}));
      const items = await toPromise(lookupDataSource.load({ skip: 1, take: 1 }));

      expect(items).toEqual([{ id: 3, text: 'Three' }]);
      expect(customLoad).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the items are loaded again with group paging', () => {
    it('should pass the page to the loader and use the cache for the same page only', async () => {
      const { dataSourceAdapter, customLoad } = createDataSourceAdapter(
        [{ key: 1 }, { key: 3 }],
        true,
      );

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn(),
        dataSourceAdapter,
        null,
      ) as WrappedLookupDataSource;
      await toPromise(lookupDataSource.load({ skip: 0, take: 2 }));
      await toPromise(lookupDataSource.load({ skip: 0, take: 2 }));

      expect(customLoad).toHaveBeenCalledTimes(1);
      expect(customLoad).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 2 }));

      await toPromise(lookupDataSource.load({ skip: 2, take: 2 }));

      expect(customLoad).toHaveBeenCalledTimes(2);
      expect(customLoad).toHaveBeenLastCalledWith(expect.objectContaining({ skip: 2, take: 2 }));
    });
  });

  describe('when an item is requested by key', () => {
    it('should resolve the item when its key is used in the grid', async () => {
      const { dataSourceAdapter } = createDataSourceAdapter([{ key: 1 }, { key: 3 }]);

      const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(
        createLookupColumn(),
        dataSourceAdapter,
        null,
      ) as WrappedLookupDataSource;

      await expect(lookupDataSource.byKey(3)).resolves.toEqual({ id: 3, text: 'Three' });
      await expect(lookupDataSource.byKey(2)).resolves.toBeUndefined();
    });
  });
});
