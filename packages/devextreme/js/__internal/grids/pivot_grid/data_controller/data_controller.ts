import type { ScalarFilterValue } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { deferUpdate, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { format } from '@js/core/utils/string';
import { isDefined, isString } from '@js/core/utils/type';
import type { PivotGridDataFieldArea } from '@js/ui/pivot_grid';
import type { StateStoringController } from '@ts/grids/grid_core/state_storing/state_storing_controller_core';
import stateStoring from '@ts/grids/grid_core/state_storing/state_storing_controller_core';
import type { InternalGrid } from '@ts/grids/grid_core/types';
import { createColumnsInfo, foreachColumnInfo } from '@ts/grids/grid_core/virtual_columns/virtual_columns_core';
import type { VirtualScrollDataOptions } from '@ts/grids/grid_core/virtual_scrolling/types';
import type { VirtualScrollController } from '@ts/grids/grid_core/virtual_scrolling/virtual_scrolling_core';
import VirtualScrollControllerModule from '@ts/grids/grid_core/virtual_scrolling/virtual_scrolling_core';
import { PivotGridDataSource } from '@ts/grids/pivot_grid/data_source/data_source';
import type {
  DataSourceData,
  DataSourceHeaderArea,
  DataSourceHeaderItem,
  DataSourceState,
  DataSourceStoreLoadOptions,
} from '@ts/grids/pivot_grid/data_source/types';
import type { PivotGrid } from '@ts/grids/pivot_grid/m_widget';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';
import {
  createPath, findField, foreachTree, foreachTreeAsync, formatValue,
} from '@ts/grids/pivot_grid/widget_utils';

import type {
  AddInfoItemOptions,
  DataControllerOptions,
  HeaderInfoOptions,
  IndexedHeaderItem,
  PivotGridCellInfo,
  PivotGridColumnInfo,
  RowInfoCallback,
  ScrollDataAdapter,
  ScrollPosition,
  SortBySummaryPath,
  ViewHeaderItem,
  VirtualContentParams,
  VirtualContentSize,
} from './types';

const math = Math;
const GRAND_TOTAL_TYPE = 'GT';
const TOTAL_TYPE = 'T';
const DATA_TYPE = 'D';
const NOT_AVAILABLE = '#N/A';
const CHANGING_DURATION_IF_PAGINATE = 300;

class DataController {
  public _options: DataControllerOptions;

  public _dataSource: PivotGridDataSource;

  public _rowsScrollController?: VirtualScrollController;

  public _columnsScrollController?: VirtualScrollController;

  public _stateStoringController: StateStoringController<DataSourceState>;

  public _columnsInfo: PivotGridColumnInfo[][];

  public _rowsInfo: PivotGridColumnInfo[][];

  public _cellsInfo: PivotGridCellInfo[][];

  public _isSharedDataSource!: boolean;

  public _lockChanged?: boolean;

  public _changedHandler!: () => void;

  public _expandValueChangingHandler!: (e: unknown) => void;

  public _loadingChangedHandler!: (isLoading: boolean) => void;

  public _progressChangedHandler!: (progress: number) => void;

  public _fieldsPreparedHandler!: (fields: PivotGridField[]) => void;

  public _customizeStoreLoadOptionsHandler!: (
    storeLoadOptions: DataSourceStoreLoadOptions[],
    reload?: boolean,
  ) => void;

  public dataSourceChanged: Callback<[]>;

  public expandValueChanging: Callback<[unknown]>;

  public loadingChanged: Callback<[boolean]>;

  public progressChanged: Callback<[number]>;

  public scrollChanged: Callback<[ScrollPosition]>;

  public changed: Callback<[]>;

  public _rowPageIndex?: number;

  public _rowPageSize?: number;

  public _columnPageIndex?: number;

  public _columnPageSize?: number;

  public _changingDuration?: number;

  constructor(dataControllerOptions?: DataControllerOptions) {
    const virtualScrollControllerChanged = this._fireChanged.bind(this);
    const options = dataControllerOptions || {};

    this._options = options;

    this.dataSourceChanged = Callbacks();
    this._dataSource = this._createDataSource(options);

    if (options.component?.option('scrolling.mode') === 'virtual') {
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- the methods use their own this
      const that = this;
      this._rowsScrollController = this.createScrollController(this, options.component, {
        totalItemsCount() {
          return that.totalRowCount();
        },
        pageIndex(index?: number) {
          return that.rowPageIndex(index);
        },
        pageSize() {
          return that.rowPageSize();
        },

        load(): DeferredObj<unknown> | undefined {
          if (!that._rowsScrollController) {
            return undefined;
          }
          if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
            that._rowsScrollController.pageIndex(this.pageCount() - 1);
          }
          that._rowsScrollController.handleDataChanged(() => {
            if (that._dataSource.paginate()) {
              that._dataSource.load();
            } else {
              virtualScrollControllerChanged();
            }
          });
          return Deferred().resolve();
        },
      });

      this._columnsScrollController = this.createScrollController(this, options.component, {
        totalItemsCount() {
          return that.totalColumnCount();
        },
        pageIndex(index?: number) {
          return that.columnPageIndex(index);
        },
        pageSize() {
          return that.columnPageSize();
        },

        load(): DeferredObj<unknown> | undefined {
          if (!that._columnsScrollController) {
            return undefined;
          }
          if (that._columnsScrollController.pageIndex() >= this.pageCount()) {
            that._columnsScrollController.pageIndex(this.pageCount() - 1);
          }

          that._columnsScrollController.handleDataChanged(() => {
            if (that._dataSource.paginate()) {
              that._dataSource.load();
            } else {
              virtualScrollControllerChanged();
            }
          });
          return Deferred().resolve();
        },

      });
    }

    this._stateStoringController = new stateStoring.StateStoringController<DataSourceState>(
      options.component as unknown as InternalGrid,
    ).init();

    this._columnsInfo = [];
    this._rowsInfo = [];
    this._cellsInfo = [];

    this.expandValueChanging = Callbacks();
    this.loadingChanged = Callbacks();
    this.progressChanged = Callbacks();
    this.scrollChanged = Callbacks();

    this.load();
    this._update();
    this.changed = Callbacks();
  }

  public createHeaderInfo = (
    headerItems: DataSourceHeaderItem[],
    headerDescriptions: PivotGridField[],
    cellDescriptions: PivotGridField[],
    isHorizontal: boolean,
    options: HeaderInfoOptions,
  ): DeferredObj<PivotGridColumnInfo[][]> => {
    const info: PivotGridColumnInfo[][] = [];
    const depthSize = this._getHeaderItemsDepth(headerItems) || 1;
    const d = Deferred<PivotGridColumnInfo[][]>();

    this._getViewHeaderItems(headerItems, headerDescriptions, cellDescriptions, depthSize, options)
      .done((viewHeaderItems) => {
        this._fillHeaderInfo(info, viewHeaderItems, depthSize, isHorizontal, options.layout === 'tree');
        options.notifyProgress(1);
        d.resolve(info);
      });

    return d;
  };

  public _getHeaderItemsDepth = (headerItems: DataSourceHeaderItem[]): number => {
    let depth = 0;

    foreachTree(headerItems, (items) => {
      depth = math.max(depth, items.length);
    });

    return depth;
  };

  public _createInfoItem = (
    headerItem: ViewHeaderItem,
    breadth: number,
    isHorizontal: boolean,
    isTree: boolean,
  ): PivotGridColumnInfo => {
    const infoItem: PivotGridColumnInfo = {
      type: headerItem.type,
      text: headerItem.text,
    };

    if (headerItem.path) {
      infoItem.path = headerItem.path;
    }
    if (headerItem.width) {
      infoItem.width = headerItem.width;
    }
    if (isDefined(headerItem.wordWrapEnabled)) {
      infoItem.wordWrapEnabled = headerItem.wordWrapEnabled;
    }

    if (headerItem.isLast) {
      infoItem.isLast = true;
    }
    if (headerItem.sorted) {
      infoItem.sorted = true;
    }
    if (headerItem.isMetric) {
      infoItem.dataIndex = headerItem.dataIndex;
    }
    if (isDefined(headerItem.expanded)) {
      infoItem.expanded = headerItem.expanded;
    }
    if (breadth > 1) {
      infoItem[isHorizontal ? 'colspan' : 'rowspan'] = breadth;
    }
    if (headerItem.depthSize && headerItem.depthSize > 1) {
      infoItem[isHorizontal ? 'rowspan' : 'colspan'] = headerItem.depthSize;
    }

    if (Number(headerItem.index) >= 0) {
      infoItem.dataSourceIndex = headerItem.index;
    }

    if (
      isTree
      && headerItem.children?.length
      && !headerItem.children[0].isMetric
    ) {
      infoItem.width = null;
      infoItem.isWhiteSpace = true;
    }

    return infoItem;
  };

  public _addInfoItem = (info: PivotGridColumnInfo[][], options: AddInfoItemOptions): number => {
    const breadth = (options.lastIndex - options.index) || 1;
    const addInfoItemCore = function addInfoItemCore(
      headerInfo: PivotGridColumnInfo[][],
      infoItem: PivotGridColumnInfo,
      itemIndex: number,
      depthIndex: number,
      isHorizontal: boolean,
    ): void {
      const index = isHorizontal ? depthIndex : itemIndex;
      while (!headerInfo[index]) {
        headerInfo.push([]);
      }
      if (isHorizontal) {
        headerInfo[index].push(infoItem);
      } else {
        headerInfo[index].unshift(infoItem);
      }
    };

    const itemInfo = this._createInfoItem(
      options.headerItem,
      breadth,
      options.isHorizontal,
      options.isTree,
    );
    addInfoItemCore(info, itemInfo, options.index, options.depth, options.isHorizontal);
    if (!options.headerItem.children || options.headerItem.children.length === 0) {
      return options.lastIndex + 1;
    }
    return options.lastIndex;
  };

  public _isItemSorted = (
    items: ViewHeaderItem[],
    sortBySummaryPath: SortBySummaryPath,
  ): boolean => {
    const item = items[0];
    const firstPathValue = sortBySummaryPath[0];
    const headerItem = Number(item.dataIndex) >= 0 ? items[1] : item;
    const isMemberKeySortPath = isString(firstPathValue) && firstPathValue.includes('&[');
    const useKeyPath = isMemberKeySortPath || !headerItem.key;
    let path = useKeyPath
      ? createPath(items)
      : items.map((it) => (Number(it.dataIndex) >= 0 ? it.value : it.text)).reverse();

    if (item.type === GRAND_TOTAL_TYPE) {
      path = path.slice(1);
    }

    return path.join('/') === sortBySummaryPath.join('/');
  };

  public _getViewHeaderItems = (
    headerItems: DataSourceHeaderItem[],
    headerDescriptions: PivotGridField[],
    cellDescriptions: PivotGridField[],
    depthSize: number,
    options: HeaderInfoOptions,
  ): DeferredObj<ViewHeaderItem[]> => {
    const cellDescriptionsCount = cellDescriptions.length;
    const viewHeaderItems = this._createViewHeaderItems(headerItems, headerDescriptions);
    const { dataFields } = options;
    const d = Deferred<ViewHeaderItem[]>();

    when(viewHeaderItems).done((createdViewItems) => {
      options.notifyProgress(0.5);

      const viewItems = createdViewItems;

      if (options.showGrandTotals) {
        viewItems[!options.showTotalsPrior ? 'push' : 'unshift']({
          type: GRAND_TOTAL_TYPE,
          isEmpty: options.isEmptyGrandTotal,
        });
      }

      const hideTotals = options.showTotals === false
        || (dataFields.length > 0 && (dataFields.length === options.hiddenTotals.length));
      const hideData = dataFields.length > 0 && options.hiddenValues.length === dataFields.length;
      let viewDepthSize = depthSize;

      if (hideData && hideTotals) {
        viewDepthSize = 1;
      }

      if (!hideTotals || options.layout === 'tree') {
        this._addAdditionalTotalHeaderItems(viewItems, headerDescriptions, options.showTotalsPrior, options.layout === 'tree');
      }

      when(foreachTreeAsync(viewItems, (items: ViewHeaderItem[]) => {
        const item = items[0];

        if (!item.children || item.children.length === 0) {
          item.depthSize = viewDepthSize - items.length + 1;
        }
      })).done(() => {
        if (cellDescriptionsCount > 1) {
          this._addMetricHeaderItems(viewItems, cellDescriptions, options);
        }

        if (!options.showEmpty) {
          this._removeHiddenItems(viewItems);
        }

        options.notifyProgress(0.75);

        when(foreachTreeAsync(viewItems, (items: ViewHeaderItem[]) => {
          const item = items[0];
          const { isMetric } = item;
          const field: PivotGridField = headerDescriptions[items.length - 1] ?? {};

          if (item.type === DATA_TYPE && !isMetric) {
            item.width = field.width;
          }

          if (hideData && item.type === DATA_TYPE) {
            const parentChildren = (items[1] ? items[1].children : viewItems) ?? [];

            parentChildren.splice(parentChildren.indexOf(item), 1);
            return;
          }

          if (isMetric) {
            if (isDefined(item.dataIndex)) {
              item.wordWrapEnabled = cellDescriptions[item.dataIndex].wordWrapEnabled;
            }
          } else {
            item.wordWrapEnabled = field.wordWrapEnabled;
          }

          item.isLast = !item.children?.length;
          if (item.isLast) {
            const isSorted = options.sortBySummaryPaths.some((sortBySummaryPath) => {
              let sortPath = sortBySummaryPath;

              if (!isDefined(item.dataIndex)) {
                sortPath = sortBySummaryPath.slice(0);
                sortPath.pop();
              }

              return this._isItemSorted(items, sortPath);
            });

            if (isSorted) {
              item.sorted = true;
            }
          }
          item.text = this.getHeaderItemText(item, field, options);
        })).done(() => {
          if (!viewItems.length) {
            viewItems.push({});
          }
          options.notifyProgress(1);
          d.resolve(viewItems);
        });
      });
    });

    return d;
  };

  public _createHeaderItem = (
    childrenStack: (ViewHeaderItem[] | undefined)[],
    depth: number,
    index: number,
  ): ViewHeaderItem => {
    const parent = childrenStack[depth] ?? [];
    childrenStack[depth] = parent;
    const node: ViewHeaderItem = {};
    parent[index] = node;

    if (childrenStack[depth + 1]) {
      node.children = childrenStack[depth + 1];
      // T541266
      for (let i = depth + 1; i < childrenStack.length; i += 1) {
        childrenStack[i] = undefined;
      }
      childrenStack.length = depth + 1;
    }

    return node;
  };

  public _createViewHeaderItems = (
    headerItems: DataSourceHeaderItem[],
    headerDescriptions: PivotGridField[],
  ): DeferredObj<ViewHeaderItem[]> => {
    const headerDescriptionsCount = headerDescriptions?.length ?? 0;
    const childrenStack: (ViewHeaderItem[] | undefined)[] = [];
    const d = Deferred<ViewHeaderItem[]>();

    when(foreachTreeAsync(headerItems, (items: DataSourceHeaderItem[], index) => {
      const item = items[0];
      const path = createPath(items);
      const headerItem = Object.assign(
        this._createHeaderItem(childrenStack, path.length, index),
        {
          type: DATA_TYPE,
          value: item.value,
          path,
          text: item.text,
          index: item.index,
          displayText: item.displayText,
          key: item.key,
          isEmpty: item.isEmpty,
        },
      );

      if (path.length < headerDescriptionsCount && item.children?.length !== 0) {
        headerItem.expanded = !!item.children;
      }
    })).done(() => {
      d.resolve(this._createHeaderItem(childrenStack, 0, 0).children ?? []);
    });

    return d;
  };

  public _addMetricHeaderItems = (
    headerItems: ViewHeaderItem[],
    cellDescriptions: PivotGridField[],
    options: HeaderInfoOptions,
  ): void => {
    foreachTree(headerItems, (items: ViewHeaderItem[]) => {
      const item = items[0];

      if (!item.children || item.children.length === 0) {
        item.children = [];
        for (let i = 0; i < cellDescriptions.length; i += 1) {
          const isGrandTotal = item.type === GRAND_TOTAL_TYPE;
          const isTotal = item.type === TOTAL_TYPE;
          const isValue = item.type === DATA_TYPE;
          const columnIsHidden = cellDescriptions[i].visible === false
            || (isGrandTotal && options.hiddenGrandTotals.includes(i))
            || (isTotal && options.hiddenTotals.includes(i))
            || (isValue && options.hiddenValues.includes(i));

          if (!columnIsHidden) {
            item.children.push({
              caption: cellDescriptions[i].caption,
              path: item.path,
              type: item.type,
              value: i,
              index: item.index,
              dataIndex: i,
              isMetric: true,
              isEmpty: item.isEmpty?.[i],
            });
          }
        }
      }
    });
  };

  public _addAdditionalTotalHeaderItems = (
    headerItems: ViewHeaderItem[],
    headerDescriptions: PivotGridField[],
    showTotalsPrior: boolean,
    isTree: boolean,
  ): void => {
    const totalsPrior = showTotalsPrior || isTree;

    foreachTree(headerItems, (items: ViewHeaderItem[], index) => {
      const item = items[0];
      const parentChildren = (items[1] ? items[1].children : headerItems) ?? [];
      const dataField = headerDescriptions[items.length - 1];

      if (item.type === DATA_TYPE
        && item.expanded
        && (dataField.showTotals !== false || isTree)) {
        if (index !== -1) {
          parentChildren.splice(
            totalsPrior
              ? index
              : index + 1,
            0,
            {
              ...item,
              children: null,
              type: TOTAL_TYPE,
              expanded: totalsPrior ? true : null,
              isAdditionalTotal: true,
            },
          );
        }

        if (totalsPrior) {
          item.expanded = null;
        }
      }
    });
  };

  public _removeEmptyParent = (items: ViewHeaderItem[], index: number): void => {
    const parent = items[index + 1];

    if (items[index].children?.length === 0 && parent?.children) {
      parent.children.splice(parent.children.indexOf(items[index]), 1);
      this._removeEmptyParent(items, index + 1);
    }
  };

  public _removeHiddenItems = (headerItems: ViewHeaderItem[]): void => {
    foreachTree([{ children: headerItems }], (items: ViewHeaderItem[], index) => {
      const item = items[0];
      const parentChildren = (items[1] ? items[1].children : headerItems) ?? [];
      let { isEmpty } = item;

      if (Array.isArray(isEmpty) && isEmpty.length) {
        isEmpty = isEmpty.filter((v) => v).length === isEmpty.length;
      }

      if (item && !item.children && isEmpty) {
        parentChildren.splice(index, 1);
        this._removeEmptyParent(items, 1);
      }
    });
  };

  public _fillHeaderInfo = (
    info: PivotGridColumnInfo[][],
    viewHeaderItems: ViewHeaderItem[],
    depthSize: number,
    isHorizontal: boolean,
    isTree: boolean,
  ): void => {
    let lastIndex = 0;
    const indexesByDepth = [0];

    foreachTree(viewHeaderItems, (items: ViewHeaderItem[]) => {
      const headerItem = items[0];
      const depth = headerItem.isMetric ? depthSize : items.length - 1;
      while (indexesByDepth.length - 1 < depth) {
        indexesByDepth.push(indexesByDepth[indexesByDepth.length - 1]);
      }
      const index = indexesByDepth[depth] || 0;
      lastIndex = this._addInfoItem(info, {
        headerItem,
        index,
        lastIndex,
        depth,
        isHorizontal,
        isTree,
      });
      indexesByDepth.length = depth;
      indexesByDepth.push(lastIndex);
    });
  };

  public getHeaderItemText(
    item: ViewHeaderItem,
    description: PivotGridField,
    options: HeaderInfoOptions,
  ): string | undefined {
    let { text } = item;

    if (isDefined(item.displayText)) {
      text = item.displayText;
    } else if (isDefined(item.caption)) {
      text = item.caption;
    } else if (item.type === GRAND_TOTAL_TYPE) {
      text = options.texts.grandTotal;
    }

    if (item.isAdditionalTotal) {
      text = format(options.texts.total ?? '', text);
    }

    return text;
  }

  public formatCellValue(
    value: unknown,
    dataField: PivotGridField,
    errorText: string | undefined,
  ): string | undefined {
    return value === NOT_AVAILABLE ? errorText : formatValue(value, dataField);
  }

  public createSortPaths(
    headerFields: PivotGridField[],
    dataFields: PivotGridField[],
  ): SortBySummaryPath[] {
    const sortBySummaryPaths: SortBySummaryPath[] = [];

    headerFields.forEach((headerField) => {
      const fieldIndex = findField(dataFields, headerField.sortBySummaryField);
      if (fieldIndex >= 0) {
        sortBySummaryPaths.push((headerField.sortBySummaryPath ?? []).concat([fieldIndex]));
      }
    });
    return sortBySummaryPaths;
  }

  public foreachRowInfo(rowsInfo: PivotGridColumnInfo[][], callback: RowInfoCallback): void {
    let columnOffset = 0;
    const columnOffsetResetIndexes: number[] = [];

    for (let i = 0; i < rowsInfo.length; i += 1) {
      for (let j = 0; j < rowsInfo[i].length; j += 1) {
        const rowSpanOffset = (rowsInfo[i][j].rowspan || 1) - 1;
        const visibleIndex = i + rowSpanOffset;

        if (columnOffsetResetIndexes[i]) {
          columnOffset -= columnOffsetResetIndexes[i];
          columnOffsetResetIndexes[i] = 0;
        }

        if (callback(rowsInfo[i][j], visibleIndex, i, j, columnOffset) === false) {
          break;
        }

        columnOffsetResetIndexes[
          i + (rowsInfo[i][j].rowspan || 1)
        ] = (columnOffsetResetIndexes[
          i + (rowsInfo[i][j].rowspan || 1)
        ] || 0) + 1;
        columnOffset += 1;
      }
    }
  }

  public createCellsInfo(
    rowsInfo: PivotGridColumnInfo[][],
    columnsInfo: PivotGridColumnInfo[][],
    data: DataSourceData,
    dataFields: PivotGridField[],
    dataFieldArea: PivotGridDataFieldArea | undefined,
    errorText: string | undefined,
  ): PivotGridCellInfo[][] {
    const dataSourceCells = data.values;

    if (!dataSourceCells.length) {
      return [];
    }

    const info: PivotGridCellInfo[][] = [];
    const dataFieldAreaInRows = dataFieldArea === 'row';

    this.foreachRowInfo(rowsInfo, (rowInfo, rowIndex) => {
      const row: PivotGridCellInfo[] = [];
      info[rowIndex] = row;
      const dataRowIndex = Number(rowInfo.dataSourceIndex) >= 0
        ? rowInfo.dataSourceIndex
        : data.grandTotalRowIndex;
      const dataRow = (isDefined(dataRowIndex) && dataSourceCells[dataRowIndex]) || [];

      if (!rowInfo.isLast) {
        return;
      }

      foreachColumnInfo(columnsInfo, (
        columnInfo: PivotGridColumnInfo,
        columnIndex: number,
      ) => {
        const dataIndex = (dataFieldAreaInRows ? rowInfo.dataIndex : columnInfo.dataIndex) || 0;
        const dataField = dataFields[dataIndex];

        if (columnInfo.isLast && dataField && dataField.visible !== false) {
          const cellIndex = Number(columnInfo.dataSourceIndex) >= 0
            ? columnInfo.dataSourceIndex
            : data.grandTotalColumnIndex;
          let cell = isDefined(cellIndex) ? dataRow[cellIndex] : undefined;

          if (!Array.isArray(cell)) {
            cell = [cell];
          }

          const cellValue = cell[dataIndex];

          row[columnIndex] = {
            text: this.formatCellValue(cellValue, dataField, errorText),
            value: cellValue,
            format: dataField.format,
            dataType: dataField.dataType,
            columnType: columnInfo.type,
            rowType: rowInfo.type,
            rowPath: rowInfo.path ?? [],
            columnPath: columnInfo.path ?? [],
            dataIndex,
          };

          if (dataField.width) {
            row[columnIndex].width = dataField.width;
          }
        }
      });
    });

    return info;
  }

  public getHeaderIndexedItems(
    headerItems: DataSourceHeaderItem[],
    options: Pick<HeaderInfoOptions, 'showTotals'>,
  ): IndexedHeaderItem[] {
    let visibleIndex = 0;
    const indexedItems: IndexedHeaderItem[] = [];

    foreachTree(headerItems, (items: DataSourceHeaderItem[]) => {
      const headerItem = items[0];
      const path = createPath(items);

      if (headerItem.children && options.showTotals === false) return;

      visibleIndex += 1;

      const indexedItem: IndexedHeaderItem = extend(true, {}, headerItem, {
        visibleIndex,
        path,
      });

      if (isDefined(indexedItem.index)) {
        indexedItems[indexedItem.index] = indexedItem;
      } else {
        indexedItems.push(indexedItem);
      }
    });
    return indexedItems;
  }

  public createScrollController(
    dataController: DataController,
    component: PivotGrid,
    dataAdapter: ScrollDataAdapter,
  ): VirtualScrollController {
    return new VirtualScrollControllerModule.VirtualScrollController<unknown>(
      component as unknown as InternalGrid,
      {
        hasKnownLastPage(): boolean {
          return true;
        },
        pageCount(this: VirtualScrollDataOptions): number {
          return math.ceil(this.totalItemsCount() / this.pageSize());
        },
        updateLoading(): void {

        },
        itemsCount(this: VirtualScrollDataOptions): number {
          if (this.pageIndex() < this.pageCount() - 1) {
            return this.pageSize();
          }
          return this.totalItemsCount() % this.pageSize();
        },
        items(): unknown[] {
          return [];
        },
        viewportItems(): unknown[] {
          return [];
        },
        onChanged(): void {

        },
        isLoading(): boolean {
          return dataController.isLoading();
        },

        changingDuration(): number {
          const dataSource = dataController._dataSource;
          if (dataSource.paginate()) {
            return CHANGING_DURATION_IF_PAGINATE;
          }
          return dataController._changingDuration || 0;
        },
        ...dataAdapter,
      },
    );
  }

  public getHiddenTotals(dataFields: PivotGridField[]): number[] {
    const result: number[] = [];
    dataFields.forEach((field, index) => {
      if (field.showTotals === false) {
        result.push(index);
      }
    });
    return result;
  }

  public getHiddenValues(dataFields: PivotGridField[]): number[] {
    const result: number[] = [];

    dataFields.forEach((field, index) => {
      if (
        (field.showValues === undefined && field.showTotals === false)
        || field.showValues === false
      ) {
        result.push(index);
      }
    });

    return result;
  }

  public getHiddenGrandTotalsTotals(
    dataFields: PivotGridField[],
    columnFields: PivotGridField[],
  ): number[] {
    let result: number[] = [];
    dataFields.forEach((field, index) => {
      if (field.showGrandTotals === false) {
        result.push(index);
      }
    });

    if (columnFields.length === 0 && result.length === dataFields.length) {
      result = [];
    }

    return result;
  }

  public _fireChanged(): void {
    const startChanging = new Date();

    if (this.changed && !this._lockChanged) {
      this.changed.fire();
    }
    this._changingDuration = new Date().getTime() - startChanging.getTime();
  }

  public _correctSkipsTakes(
    rowIndex: number,
    rowSkip: number,
    rowSpan: number | undefined,
    levels: number[],
    skips: number[],
    takes: number[],
  ): void {
    const endIndex = rowSpan ? rowIndex + rowSpan - 1 : rowIndex;
    skips[levels.length] = skips[levels.length] || 0;
    takes[levels.length] = takes[levels.length] || 0;
    if (endIndex < rowSkip) {
      skips[levels.length] += 1;
    } else {
      takes[levels.length] += 1;
    }
  }

  public _calculatePagingForRowExpandedPaths(
    options: DataSourceStoreLoadOptions,
    skips: number[],
    takes: number[],
    rowExpandedSkips: number[],
    rowExpandedTakes: (number | undefined)[],
  ): void {
    const rows = this._rowsInfo;
    const rowCount = Math.min(Number(options.rowSkip) + Number(options.rowTake), rows.length);
    const { rowExpandedPaths } = options;
    let levels: number[] = [];
    const expandedPathIndexes: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/init-declarations -- keeps the last cell path
    let path: unknown[] | undefined;

    rowExpandedPaths?.forEach((expandedPath, index) => {
      expandedPathIndexes[String(expandedPath)] = index;
    });

    for (let i = 0; i < rowCount; i += 1) {
      skips.length = levels.length + 1;
      takes.length = skips.length;
      for (const cell of rows[i]) {
        if (cell.type === 'D') {
          this._correctSkipsTakes(i, Number(options.rowSkip), cell.rowspan, levels, skips, takes);

          path = cell.path ?? path;
          const expandIndex = path && path.length > 1
            ? expandedPathIndexes[String(path.slice(0, -1))]
            : -1;

          // eslint-disable-next-line max-depth -- per data cell inside the row and cell loops
          if (expandIndex >= 0) {
            rowExpandedSkips[expandIndex] = skips[levels.length] || 0;
            rowExpandedTakes[expandIndex] = takes[levels.length] || 0;
          }

          // eslint-disable-next-line max-depth -- per data cell inside the row and cell loops
          if (cell.rowspan) {
            levels.push(cell.rowspan);
          }
        }
      }
      levels = levels.map((level) => level - 1).filter((level) => level > 0);
    }
  }

  public _calculatePagingForColumnExpandedPaths(
    options: DataSourceStoreLoadOptions,
    skips: number[],
    takes: number[],
    expandedSkips: number[],
    expandedTakes: (number | undefined)[],
  ): void {
    const skipByPath: Record<string, number> = {};
    const takeByPath: Record<string, number> = {};

    foreachColumnInfo(this._columnsInfo, (columnInfo: PivotGridColumnInfo, columnIndex: number) => {
      if (columnInfo.type === 'D' && columnInfo.path && columnInfo.dataIndex === undefined) {
        const colspan = columnInfo.colspan || 1;
        const path = columnInfo.path.slice(0, -1).toString();

        skipByPath[path] = skipByPath[path] || 0;
        takeByPath[path] = takeByPath[path] || 0;

        if (columnIndex + colspan <= Number(options.columnSkip)) {
          skipByPath[path] += 1;
        } else if (columnIndex < Number(options.columnSkip) + Number(options.columnTake)) {
          takeByPath[path] += 1;
        }
      }
    });

    skips[0] = skipByPath[''];
    takes[0] = takeByPath[''];

    options.columnExpandedPaths?.forEach((path, index) => {
      const skip = skipByPath[String(path)];
      const take = takeByPath[String(path)];

      if (skip !== undefined) {
        expandedSkips[index] = skip;
      }
      if (take !== undefined) {
        expandedTakes[index] = take;
      }
    });
  }

  public _processPagingForExpandedPaths(
    options: DataSourceStoreLoadOptions,
    area: DataSourceHeaderArea,
    storeLoadOptions: DataSourceStoreLoadOptions[],
    reload?: boolean,
  ): void {
    const expandedPaths = options[`${area}ExpandedPaths`];

    if (!expandedPaths) {
      return;
    }

    const expandedSkips = expandedPaths.map(() => 0);
    const expandedTakes = expandedPaths.map(() => (reload ? options.pageSize : 0));
    const skips: number[] = [];
    const takes: number[] = [];

    if (!reload) {
      if (area === 'row') {
        this._calculatePagingForRowExpandedPaths(
          options,
          skips,
          takes,
          expandedSkips,
          expandedTakes,
        );
      } else {
        this._calculatePagingForColumnExpandedPaths(
          options,
          skips,
          takes,
          expandedSkips,
          expandedTakes,
        );
      }
    }
    this._savePagingForExpandedPaths(
      options,
      area,
      storeLoadOptions,
      skips[0],
      takes[0],
      expandedSkips,
      expandedTakes,
    );
  }

  public _savePagingForExpandedPaths(
    options: DataSourceStoreLoadOptions,
    area: DataSourceHeaderArea,
    storeLoadOptions: DataSourceStoreLoadOptions[],
    skip: number | undefined,
    take: number | undefined,
    expandedSkips: number[],
    expandedTakes: (number | undefined)[],
  ): void {
    const expandedPaths = options[`${area}ExpandedPaths`];

    options[`${area}ExpandedPaths`] = [];
    options[`${area}Skip`] = skip ?? options[`${area}Skip`];
    options[`${area}Take`] = take ?? options[`${area}Take`];

    if (!expandedPaths) {
      return;
    }

    for (let i = 0; i < expandedPaths.length; i += 1) {
      if (expandedTakes[i]) {
        const isOppositeArea = options.area && options.area !== area;

        storeLoadOptions.push(extend({
          area,
          headerName: `${area}s`,
        }, options, {
          [`${area}Skip`]: expandedSkips[i],
          [`${area}Take`]: expandedTakes[i],
          [isOppositeArea ? 'oppositePath' : 'path']: expandedPaths[i],
        }));
      }
    }
  }

  public _handleCustomizeStoreLoadOptions(
    storeLoadOptions: DataSourceStoreLoadOptions[],
    reload?: boolean,
  ): void {
    const options = storeLoadOptions[0];
    const rowsScrollController = this._rowsScrollController;

    if (this._dataSource.paginate() && rowsScrollController) {
      const rowPageSize = rowsScrollController.pageSize();

      if (options.headerName === 'rows') {
        options.rowSkip = 0;
        options.rowTake = rowPageSize;
        options.rowExpandedPaths = [];
      } else {
        options.rowSkip = rowsScrollController.beginPageIndex() * rowPageSize;
        options.rowTake = (
          rowsScrollController.endPageIndex() - rowsScrollController.beginPageIndex() + 1
        ) * rowPageSize;
        this._processPagingForExpandedPaths(options, 'row', storeLoadOptions, reload);
      }
    }

    const columnsScrollController = this._columnsScrollController;

    if (this._dataSource.paginate() && columnsScrollController) {
      const columnPageSize = columnsScrollController.pageSize();
      storeLoadOptions.forEach((loadOptions) => {
        if (loadOptions.headerName === 'columns') {
          loadOptions.columnSkip = 0;
          loadOptions.columnTake = columnPageSize;
          loadOptions.columnExpandedPaths = [];
        } else {
          loadOptions.columnSkip = columnsScrollController.beginPageIndex() * columnPageSize;
          loadOptions.columnTake = (
            columnsScrollController.endPageIndex() - columnsScrollController.beginPageIndex() + 1
          ) * columnPageSize;
          this._processPagingForExpandedPaths(loadOptions, 'column', storeLoadOptions, reload);
        }
      });
    }
  }

  public load(): void {
    const stateStoringController = this._stateStoringController;

    if (stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
      stateStoringController.load().always((state) => {
        if (state) {
          this._dataSource.state(state);
        } else {
          this._dataSource.load();
        }
      });
    } else {
      this._dataSource.load();
    }
  }

  public calculateVirtualContentParams(
    contentParams: VirtualContentParams,
  ): VirtualContentSize | undefined {
    const rowsScrollController = this._rowsScrollController;
    const columnsScrollController = this._columnsScrollController;

    if (rowsScrollController && columnsScrollController) {
      rowsScrollController.viewportItemSize(contentParams.virtualRowHeight);
      rowsScrollController.viewportSize(
        contentParams.viewportHeight / rowsScrollController.viewportItemSize(),
      );
      rowsScrollController.setContentItemSizes(contentParams.itemHeights);

      columnsScrollController.viewportItemSize(contentParams.virtualColumnWidth);
      columnsScrollController.viewportSize(
        contentParams.viewportWidth / columnsScrollController.viewportItemSize(),
      );
      columnsScrollController.setContentItemSizes(contentParams.itemWidths);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      deferUpdate(() => {
        columnsScrollController.loadIfNeed();
        rowsScrollController.loadIfNeed();
      });

      this.scrollChanged.fire({
        left: columnsScrollController.getViewportPosition(),
        top: rowsScrollController.getViewportPosition(),
      });

      return {
        contentTop: rowsScrollController.getContentOffset(),
        contentLeft: columnsScrollController.getContentOffset(),
        width: columnsScrollController.getVirtualContentSize(),
        height: rowsScrollController.getVirtualContentSize(),
      };
    }

    return undefined;
  }

  public setViewportPosition(left: number | undefined, top: number | undefined): void {
    this._rowsScrollController?.setViewportPosition(top || 0);
    this._columnsScrollController?.setViewportPosition(left || 0);
  }

  public subscribeToWindowScrollEvents($element: dxElementWrapper): void {
    this._rowsScrollController?.subscribeToWindowScrollEvents($element);
  }

  public updateWindowScrollPosition(position: number): void {
    this._rowsScrollController?.scrollTo(position);
  }

  public updateViewOptions(options: DataControllerOptions): void {
    extend(this._options, options);
    this._update();
  }

  public _handleExpandValueChanging(e: unknown): void {
    this.expandValueChanging.fire(e);
  }

  public _handleLoadingChanged(isLoading: boolean): void {
    this.loadingChanged.fire(isLoading);
  }

  public _handleProgressChanged(progress: number): void {
    this.progressChanged.fire(progress);
  }

  public _handleFieldsPrepared(e: PivotGridField[]): void {
    this._options.onFieldsPrepared?.(e);
  }

  public _createDataSource(options: DataControllerOptions): PivotGridDataSource {
    const dataSourceOptions = options.dataSource;
    const isSharedDataSource = dataSourceOptions instanceof PivotGridDataSource;

    this._isSharedDataSource = isSharedDataSource;

    const dataSource = isSharedDataSource
      ? dataSourceOptions
      : new PivotGridDataSource(dataSourceOptions);

    this._expandValueChangingHandler = this._handleExpandValueChanging.bind(this);
    this._loadingChangedHandler = this._handleLoadingChanged.bind(this);
    this._fieldsPreparedHandler = this._handleFieldsPrepared.bind(this);
    this._customizeStoreLoadOptionsHandler = this._handleCustomizeStoreLoadOptions.bind(this);
    this._changedHandler = (): void => {
      this._update();
      this.dataSourceChanged.fire();
    };
    this._progressChangedHandler = (progress: number): void => {
      this._handleProgressChanged(progress * 0.8);
    };

    dataSource.on('changed', this._changedHandler);
    dataSource.on('expandValueChanging', this._expandValueChangingHandler);
    dataSource.on('loadingChanged', this._loadingChangedHandler);
    dataSource.on('progressChanged', this._progressChangedHandler);
    dataSource.on('fieldsPrepared', this._fieldsPreparedHandler);
    dataSource.on('customizeStoreLoadOptions', this._customizeStoreLoadOptionsHandler);

    return dataSource;
  }

  public getDataSource(): PivotGridDataSource {
    return this._dataSource;
  }

  public isLoading(): boolean {
    return this._dataSource.isLoading();
  }

  public beginLoading(): void {
    this._dataSource.beginLoading();
  }

  public endLoading(): void {
    this._dataSource.endLoading();
  }

  public getData(): DataSourceData {
    return this._dataSource.getData();
  }

  public isEmpty(): boolean {
    return this._dataSource.isEmpty();
  }

  public expandHeaderItem(area: DataSourceHeaderArea, path: ScalarFilterValue[]): boolean {
    return this._dataSource.expandHeaderItem(area, path);
  }

  public collapseHeaderItem(area: DataSourceHeaderArea, path: ScalarFilterValue[]): boolean {
    return this._dataSource.collapseHeaderItem(area, path);
  }

  public applyPartialDataSource(
    ...args: Parameters<PivotGridDataSource['applyPartialDataSource']>
  ): void {
    this._dataSource.applyPartialDataSource(...args);
  }

  public _update(): void {
    const dataSource = this._dataSource;
    const options = this._options;
    const columnFields: PivotGridField[] = dataSource.getAreaFields('column');
    const rowFields: PivotGridField[] = dataSource.getAreaFields('row');
    const dataFields: PivotGridField[] = dataSource.getAreaFields('data');
    const dataFieldsForRows = options.dataFieldArea === 'row' ? dataFields : [];
    const dataFieldsForColumns = options.dataFieldArea !== 'row' ? dataFields : [];
    const data = dataSource.getData();
    const hiddenTotals = this.getHiddenTotals(dataFields);
    const hiddenValues = this.getHiddenValues(dataFields);
    const hiddenGrandTotals = this.getHiddenGrandTotalsTotals(dataFields, columnFields);
    const grandTotalsAreHiddenForNotAllDataFields = dataFields.length > 0
      ? hiddenGrandTotals.length !== dataFields.length
      : true;

    const commonOptions = {
      texts: options.texts ?? {},
      hiddenTotals,
      hiddenValues,
      hiddenGrandTotals,
      showEmpty: !options.hideEmptySummaryCells,
      dataFields,
      progress: 0,
    };
    const rowOptions: HeaderInfoOptions = {
      ...commonOptions,
      isEmptyGrandTotal: data.isEmptyGrandTotalRow,
      showTotals: options.showRowTotals,
      showTotalsPrior: options.showTotalsPrior === 'rows' || options.showTotalsPrior === 'both',
      showGrandTotals: options.showRowGrandTotals !== false
                       && grandTotalsAreHiddenForNotAllDataFields,
      sortBySummaryPaths: this.createSortPaths(columnFields, dataFields),
      layout: options.rowHeaderLayout,
      fields: rowFields,
      notifyProgress: noop,
    };
    const columnOptions: HeaderInfoOptions = {
      ...commonOptions,
      isEmptyGrandTotal: data.isEmptyGrandTotalColumn,
      showTotals: options.showColumnTotals,
      showTotalsPrior: options.showTotalsPrior === 'columns' || options.showTotalsPrior === 'both',
      showGrandTotals: options.showColumnGrandTotals !== false
                       && grandTotalsAreHiddenForNotAllDataFields,
      sortBySummaryPaths: this.createSortPaths(rowFields, dataFields),
      fields: columnFields,
      notifyProgress: noop,
    };

    const handleProgressChanged = (progress: number): void => {
      this._handleProgressChanged(progress);
    };
    const notifyProgress = function notifyProgress(
      this: HeaderInfoOptions,
      progress: number,
    ): void {
      this.progress = progress;
      handleProgressChanged(0.8 + 0.1 * rowOptions.progress + 0.1 * columnOptions.progress);
    };

    rowOptions.notifyProgress = notifyProgress;
    columnOptions.notifyProgress = notifyProgress;

    if (!isDefined(data.grandTotalRowIndex)) {
      data.grandTotalRowIndex = this.getHeaderIndexedItems(data.rows, rowOptions).length;
    }
    if (!isDefined(data.grandTotalColumnIndex)) {
      data.grandTotalColumnIndex = this.getHeaderIndexedItems(data.columns, columnOptions).length;
    }

    dataSource._changeLoadingCount(1);

    when(
      this.createHeaderInfo(data.columns, columnFields, dataFieldsForColumns, true, columnOptions),
      this.createHeaderInfo(data.rows, rowFields, dataFieldsForRows, false, rowOptions),
    ).always(() => {
      dataSource._changeLoadingCount(-1);
    }).done((columnsInfo, rowsInfo) => {
      this._columnsInfo = columnsInfo;
      this._rowsInfo = rowsInfo;

      if (this._rowsScrollController
        && this._columnsScrollController
        && this.changed
        && !this._dataSource.paginate()) {
        this._rowsScrollController.reset(true);
        this._columnsScrollController.reset(true);

        this._lockChanged = true;
        this._rowsScrollController.load();
        this._columnsScrollController.load();
        this._lockChanged = false;
      }
    }).done(() => {
      this._fireChanged();
      if (this._stateStoringController.isEnabled() && !this._dataSource.isLoading()) {
        this._stateStoringController.state(this._dataSource.state());
        this._stateStoringController.save();
      }
    });
  }

  public getRowsInfo(getAllData?: boolean): PivotGridColumnInfo[][] {
    const rowsInfo = this._rowsInfo;
    const scrollController = this._rowsScrollController;
    const isOnePredefinedRow = rowsInfo.length === 1 && (
      // @ts-expect-error rowsInfo[0] is a row of cells, its type is always undefined
      !rowsInfo[0].type || rowsInfo[0].type === GRAND_TOTAL_TYPE
    );

    if (scrollController && !getAllData && !isOnePredefinedRow) {
      const startIndex = scrollController.beginPageIndex() * this.rowPageSize();
      const endIndex = scrollController.endPageIndex() * this.rowPageSize() + this.rowPageSize();
      const summaryFields: PivotGridField[] = this._dataSource.getSummaryFields();
      const isRowDataFieldArea = this._options.dataFieldArea === 'row';
      const newRowsInfo: PivotGridColumnInfo[][] = [];
      let maxDepth = 1;

      this.foreachRowInfo(rowsInfo, (rowInfo, visibleIndex, rowIndex, _, columnIndex) => {
        const isVisible = visibleIndex >= startIndex && rowIndex < endIndex;
        const index = rowIndex < startIndex ? 0 : rowIndex - startIndex;
        let cell = rowInfo;

        if (isVisible) {
          newRowsInfo[index] = newRowsInfo[index] || [];
          let rowspan = rowIndex < startIndex
            ? (Number(rowInfo.rowspan) - (startIndex - rowIndex)) || 1
            : rowInfo.rowspan;

          if (startIndex + index + Number(rowspan) > endIndex) {
            rowspan = (endIndex - (index + startIndex)) || 1;
          }

          if (rowspan !== rowInfo.rowspan) {
            cell = extend({}, cell, {
              rowspan,
            });
          }

          newRowsInfo[index].push(cell);

          const isSummaryCell = summaryFields.some((field) => field.caption === cell.text);
          if (!isRowDataFieldArea || !isSummaryCell) {
            maxDepth = math.max(maxDepth, columnIndex + 1);
          }
        } else {
          return false;
        }

        return undefined;
      });

      this.foreachRowInfo(
        newRowsInfo,
        (rowInfo, visibleIndex, rowIndex, columnIndex, realColumnIndex) => {
          const colspan = rowInfo.colspan || 1;

          if (realColumnIndex + colspan > maxDepth) {
            newRowsInfo[rowIndex][columnIndex] = extend({}, rowInfo, {
              colspan: (maxDepth - realColumnIndex) || 1,
            });
          }
        },
      );

      return newRowsInfo;
    }

    return rowsInfo;
  }

  public getColumnsInfo(getAllData?: boolean): PivotGridColumnInfo[][] {
    let info = this._columnsInfo;
    const scrollController = this._columnsScrollController;

    if (scrollController && !getAllData) {
      const startIndex = scrollController.beginPageIndex() * this.columnPageSize();
      const endIndex = scrollController.endPageIndex() * this.columnPageSize()
        + this.columnPageSize();

      info = createColumnsInfo(info, startIndex, endIndex);
    }

    return info;
  }

  public totalRowCount(): number {
    return this._rowsInfo.length;
  }

  public rowPageIndex(index?: number): number {
    if (index !== undefined) {
      this._rowPageIndex = index;
    }
    return this._rowPageIndex || 0;
  }

  public totalColumnCount(): number {
    let count = 0;
    if (this._columnsInfo?.length) {
      for (const columnInfo of this._columnsInfo[0]) {
        count += columnInfo.colspan || 1;
      }
    }

    return count;
  }

  public rowPageSize(size?: number): number {
    if (size !== undefined) {
      this._rowPageSize = size;
    }
    return this._rowPageSize || 20;
  }

  public columnPageSize(size?: number): number {
    if (size !== undefined) {
      this._columnPageSize = size;
    }
    return this._columnPageSize || 20;
  }

  public columnPageIndex(index?: number): number {
    if (index !== undefined) {
      this._columnPageIndex = index;
    }
    return this._columnPageIndex || 0;
  }

  public getColumnIndexOffset(): number {
    return this._columnsScrollController
      ? this._columnsScrollController.beginPageIndex() * this._columnsScrollController.pageSize()
      : 0;
  }

  public getRowIndexOffset(): number {
    return this._rowsScrollController
      ? this._rowsScrollController.beginPageIndex() * this._rowsScrollController.pageSize()
      : 0;
  }

  public getCellsInfo(getAllData?: boolean): PivotGridCellInfo[][] {
    const rowsInfo = this.getRowsInfo(getAllData);
    const columnsInfo = this.getColumnsInfo(getAllData);
    const data = this._dataSource.getData();
    const texts = this._options.texts ?? {};

    return this.createCellsInfo(
      rowsInfo,
      columnsInfo,
      data,
      this._dataSource.getAreaFields('data'),
      this._options.dataFieldArea,
      texts.dataNotAvailable,
    );
  }

  public dispose(): void {
    if (this._isSharedDataSource) {
      this._dataSource.off('changed', this._changedHandler);
      this._dataSource.off('expandValueChanging', this._expandValueChangingHandler);
      this._dataSource.off('loadingChanged', this._loadingChangedHandler);
      this._dataSource.off('progressChanged', this._progressChangedHandler);
      this._dataSource.off('fieldsPrepared', this._fieldsPreparedHandler);
      this._dataSource.off('customizeStoreLoadOptions', this._customizeStoreLoadOptionsHandler);
    } else {
      this._dataSource.dispose();
    }

    this._columnsScrollController?.dispose();
    this._rowsScrollController?.dispose();

    this._stateStoringController.dispose();

    this.expandValueChanging.empty();
    this.changed.empty();
    this.loadingChanged.empty();
    this.progressChanged.empty();
    this.scrollChanged.empty();
    this.dataSourceChanged.empty();
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const DataController__internals = {
  NO_DATA_AVAILABLE_TEXT: NOT_AVAILABLE,
};

export default { DataController, DataController__internals };
export { DataController, DataController__internals };
