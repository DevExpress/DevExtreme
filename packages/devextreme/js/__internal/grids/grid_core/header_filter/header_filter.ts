/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import type { GroupItem } from '@js/common/data';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import dataQuery from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import type { HeaderFilter } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getDefaultAlignment } from '@js/core/utils/position';
import { isDefined, isFunction, isObject } from '@js/core/utils/type';
import { restoreFocus, saveFocusedElementInfo } from '@js/ui/shared/accessibility';
import filterUtils from '@js/ui/shared/filtering';
import { compileGetter } from '@ts/core/utils/data';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type {
  DataFilter, FilterSourceContext,
} from '@ts/grids/grid_core/filter/types';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import Modules from '@ts/grids/grid_core/modules/modules';
import type { FormatOptions, InternalGridOptions, ModuleType } from '@ts/grids/grid_core/types';
import type { CellRenderOptions, ViewCellOptions } from '@ts/grids/grid_core/views/types';

import type { ColumnsController } from '../columns_controller/columns_controller';
import gridCoreUtils from '../utils';
import {
  headerFilterMixin,
  HeaderFilterView,
  updateHeaderFilterItemSelectionState,
} from './header_filter_core';
import type {
  DateIntervalFormat,
  HeaderFilterColumn,
  HeaderFilterDataSourceArgs,
  HeaderFilterDataSourceOptions,
  HeaderFilterGroupSelector,
  HeaderFilterItem,
  HeaderFilterMenuOptions,
  HeaderFilterViewOptions,
  NormalizeGroupItemOptions,
  ProcessGroupItemsOptions,
} from './types';
import {
  allowHeaderFiltering,
  createHeaderFilterExpressions,
  getHeaderFilterGroupParameters,
} from './utils';

const DATE_INTERVAL_FORMATS: Record<string, DateIntervalFormat | undefined> = {
  year(value) {
    return String(value);
  },
  month(value) {
    return dateLocalization.getMonthNames()[value - 1];
  },
  // @ts-expect-error format() returns a string for the 'quarter' format
  quarter(value) {
    return dateLocalization.format(new Date(2000, value * 3 - 1), 'quarter');
  },
  day(value) {
    return String(value);
  },
  hour(value) {
    return String(value);
  },
  minute(value) {
    return String(value);
  },
  second(value) {
    return String(value);
  },
};

const getDateIntervalFormat = (intervalKey: string): DateIntervalFormat => (
  DATE_INTERVAL_FORMATS[intervalKey] ?? ((v: number): string => String(v))
);

const getUTCTime: (...dateParts: number[]) => number = Date.UTC;

function ungroupUTCDates(
  items: GroupItem[],
  dateParts: number[] = [],
  dates: (Date | null)[] = [],
): (Date | null)[] {
  items.forEach((item) => {
    if (isDefined(item.key)) {
      const isMonthPart = dateParts.length === 1;
      dateParts.push(isMonthPart ? item.key - 1 : item.key);
      if (item.items) {
        ungroupUTCDates(item.items, dateParts, dates);
      } else {
        const date = new Date(getUTCTime(...dateParts));
        dates.push(date);
      }
      dateParts.pop();
    } else {
      dates.push(null);
    }
  });
  return dates;
}

export function convertDataFromUTCToLocal(data: GroupItem[], column: Column): GroupItem[] {
  const dates = ungroupUTCDates(data);
  const query = dataQuery(dates);
  const group = getHeaderFilterGroupParameters({
    ...column,
    calculateCellValue: (date: Date | null): Date | null => date,
  });
  // @ts-expect-error queryByOptions().toArray() is typed as unknown[]
  return storeHelper.queryByOptions(query, { group }).toArray();
}

export function isUTCFormat(format: string | null | undefined): boolean {
  return format?.slice(-1) === 'Z' || format?.slice(-3) === '\'Z\'';
}

export const getFormatOptions = (
  value: unknown,
  column: Column,
  currentLevel: number,
): FormatOptions => {
  const groupInterval = filterUtils.getGroupInterval(column);
  const result = gridCoreUtils.getFormatOptionsByColumn(column, 'headerFilter');

  if (groupInterval) {
    result.groupInterval = groupInterval[currentLevel];

    if (gridCoreUtils.isDateType(column.dataType)) {
      result.format = getDateIntervalFormat(groupInterval[currentLevel]);
    } else if (column.dataType === 'number') {
      result.getDisplayFormat = (): string => {
        const formatOptions = { format: column.format, target: 'headerFilter' };
        const firstValueText = gridCoreUtils.formatValue(value, formatOptions);
        // @ts-expect-error a number column groups number values
        const firstValue: number = value;
        // @ts-expect-error getGroupInterval() types interval names and numbers as string[]
        const interval: number = groupInterval[currentLevel];
        const secondValue = firstValue + interval;
        const secondValueText = gridCoreUtils.formatValue(secondValue, formatOptions);

        return firstValueText && secondValueText ? `${firstValueText} - ${secondValueText}` : '';
      };
    }
  }

  return result;
};

export class HeaderFilterController extends Modules.ViewController {
  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private dataSourceController!: DataSourceController;

  private _headerFilterView!: HeaderFilterView;

  public init(): void {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this._headerFilterView = this.getView('headerFilterView');
  }

  public isFilterSourceActive({ columnSourcesActive }: FilterSourceContext): boolean {
    return columnSourcesActive;
  }

  public getFilterExpressions({
    excludedColumn,
    columnsController,
  }: FilterSourceContext): DataFilter[] {
    const columns = columnsController.getVisibleColumns(null, true);

    return createHeaderFilterExpressions(columns, excludedColumn);
  }

  private _updateSelectedState(items: HeaderFilterItem[], column: Column): void {
    let i = items.length;
    const isExclude = column.filterType === 'exclude';

    while (i > 0) {
      i -= 1;
      const item = items[i];

      if ('items' in items[i]) {
        // @ts-expect-error the 'items' in check doesn't narrow the optional items
        this._updateSelectedState(items[i].items, column);
      }

      updateHeaderFilterItemSelectionState(
        item,
        gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1,
        isExclude,
      );
    }
  }

  private _normalizeGroupItem(
    item: unknown,
    currentLevel: number,
    options: NormalizeGroupItemOptions,
  ): HeaderFilterItem {
    const { path } = options;
    const { valueSelector } = options;
    const { displaySelector } = options;
    const { column } = options;
    const value: unknown = valueSelector && displaySelector
      ? valueSelector(item)
      // @ts-expect-error without a lookup, the item is a GroupItem
      : item.key;
    const displayValue = valueSelector && displaySelector ? displaySelector(item) : value;
    const normalizedItem: HeaderFilterItem = isObject(item) ? extend({}, item) : {};

    path.push(value);

    if (path.length === 1) {
      // NOTE: Important! Deconstructing here causes a lot of failed usage scenarios.
      // eslint-disable-next-line prefer-destructuring
      normalizedItem.value = path[0];
    } else {
      normalizedItem.value = path.join('/');
    }

    normalizedItem.text = this.getHeaderItemText(
      displayValue,
      column,
      currentLevel,
      options.headerFilterOptions,
    );

    return normalizedItem;
  }

  // Used in the filter/m_filter_custom_operations as public method
  // Used in the private API WA [T1232532]
  public getHeaderItemText(
    displayValue: unknown,
    column: Column,
    currentLevel: number,
    headerFilterOptions: HeaderFilter | undefined,
  ): string {
    let text = gridCoreUtils.formatValue(
      displayValue,
      getFormatOptions(displayValue, column, currentLevel),
    );

    if (!text) {
      text = headerFilterOptions?.texts?.emptyValue ?? '';
    }

    return text;
  }

  private _processGroupItems(
    groupItems: unknown[],
    currentLevel: number | null,
    path: unknown[] | null,
    options: ProcessGroupItemsOptions,
  ): void {
    const { column } = options;
    const { lookup } = column;
    const { level } = options;
    const itemsPath = path ?? [];
    const itemsLevel = currentLevel ?? 0;
    const displayExpr = lookup?.displayExpr;
    const displaySelector: HeaderFilterGroupSelector | undefined = isFunction(displayExpr)
      ? displayExpr
      : lookup && compileGetter(displayExpr);
    const valueSelector: HeaderFilterGroupSelector | undefined = lookup
      ? compileGetter(lookup.valueExpr)
      : undefined;

    for (let i = 0; i < groupItems.length; i += 1) {
      const item = this._normalizeGroupItem(groupItems[i], itemsLevel, {
        column: options.column,
        headerFilterOptions: options.headerFilterOptions,
        displaySelector,
        valueSelector,
        path: itemsPath,
      });
      groupItems[i] = item;

      if (item.items !== undefined) {
        if (itemsLevel === level || !isDefined(item.value)) {
          delete item.items;
        } else {
          this._processGroupItems(item.items, itemsLevel + 1, itemsPath, options);
        }
      }

      itemsPath.pop();
    }
  }

  public getDataSource(column: HeaderFilterColumn): HeaderFilterDataSourceOptions | undefined {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const remoteGrouping = this.dataSourceController.remoteOperations().grouping;
    const group = getHeaderFilterGroupParameters(column, remoteGrouping);
    const headerFilterDataSource = column.headerFilter?.dataSource;
    const headerFilterOptions = this.option('headerFilter');
    let isLookup = false;
    const options: HeaderFilterDataSourceArgs = {
      component: this.component,
    };

    if (!dataSourceAdapter) {
      return undefined;
    }

    if (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
      options.dataSource = normalizeDataSourceOptions(headerFilterDataSource);
    } else if (column.lookup) {
      isLookup = true;

      if (this.option('syncLookupFilterValues')) {
        const filter = this._dataController.getCombinedFilterWithExcludedColumn(column);

        options.dataSource = gridCoreUtils.getWrappedLookupDataSource(
          column,
          dataSourceAdapter,
          filter,
        );
      } else {
        options.dataSource = gridCoreUtils.normalizeLookupDataSource(column.lookup);
      }
    } else {
      const cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;

      const filter = this._dataController.getCombinedFilterWithExcludedColumn(column);

      options.dataSource = {
        filter,
        group,
        useDefaultSearch: true,
        load: (loadOptions: StoreLoadOptions): DeferredObj<unknown> => {
          const d = Deferred<unknown>();
          // TODO remove in 16.1
          loadOptions.dataField = column.dataField || column.name;

          dataSourceAdapter.customLoader.load(loadOptions).done(({ data }) => {
            const convertUTCDates = remoteGrouping
              && isUTCFormat(column.serializationFormat)
              && cutoffLevel > 3;
            let groupItems = data;
            if (convertUTCDates) {
              // @ts-expect-error customLoader returns groups here, but types them as rows
              groupItems = convertDataFromUTCToLocal(data, column);
            }
            this._processGroupItems(groupItems, null, null, {
              level: cutoffLevel,
              column,
              headerFilterOptions,
            });
            d.resolve(groupItems);
          }).fail(d.reject as (...args: unknown[]) => void);

          return d;
        },
      };
    }

    if (isFunction(headerFilterDataSource)) {
      // @ts-expect-error the public d.ts types these options narrower than the grid builds them
      headerFilterDataSource.call(column, options);
    }

    const origPostProcess = options.dataSource.postProcess;
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- postProcess uses its own this
    const that = this;
    options.dataSource.postProcess = function postProcess(
      this: DataSource,
      data: unknown[],
    ): unknown[] {
      let items = data;

      if (isLookup) {
        // @ts-expect-error TS doesn't link isLookup to column.lookup; lookup items are unknown
        items = items.filter((item) => item[column.lookup.valueExpr] !== null);

        if (this.pageIndex() === 0 && !this.searchValue()) {
          items = items.slice(0);
          items.unshift(null);
        }
        that._processGroupItems(items, null, null, {
          level: 0,
          column,
          headerFilterOptions,
        });
      }

      items = origPostProcess?.call(this, items) || items;
      // @ts-expect-error postProcess gets untyped items, but they are header filter items here
      that._updateSelectedState(items, column);
      return items;
    };

    return options.dataSource;
  }

  public showHeaderFilterMenu(columnIndex: number, isGroupPanel: boolean): void {
    const columnsController = this._columnsController;
    const column: Column = extend(true, {}, this._columnsController.getColumns()[columnIndex]);

    const visibleIndex = columnsController.getVisibleIndex(columnIndex);
    // TODO getView
    const view = isGroupPanel ? this.getView('headerPanel') : this.getView('columnHeadersView');
    // @ts-expect-error getColumnElements() is typed as possibly undefined
    const $columnElement = view.getColumnElements()
      // @ts-expect-error a column shown in the group panel has a groupIndex
      .eq(isGroupPanel ? column.groupIndex : visibleIndex);

    this.showHeaderFilterMenuBase({
      columnElement: $columnElement,
      // @ts-expect-error createColumn initializes calculateCellValue
      column,
      applyFilter: true,
      apply() {
        columnsController.columnOption(columnIndex, {
          filterValues: this.filterValues,
          filterType: this.filterType,
        });
      },
    });
  }

  public showHeaderFilterMenuBase(options: HeaderFilterMenuOptions): void {
    const { column } = options;

    if (column) {
      const groupInterval = filterUtils.getGroupInterval(column);
      const remoteFiltering = this.dataSourceController.remoteOperations().filtering;
      const previousOnHidden = options.onHidden;
      const type: HeaderFilterViewOptions['type'] = groupInterval && groupInterval.length > 1
        ? 'tree'
        : 'list';

      const viewOptions = extend(options, column, {
        type,
        remoteFiltering,
        onShowing: (e) => {
          const dxResizableInstance = e.component.$overlayContent().dxResizable('instance');

          if (dxResizableInstance) {
            dxResizableInstance.option('onResizeEnd', (resizeEndEvent) => {
              let headerFilterByColumn = this._columnsController.columnOption(options.dataField, 'headerFilter');

              headerFilterByColumn ??= {};
              headerFilterByColumn.width = resizeEndEvent.width;
              headerFilterByColumn.height = resizeEndEvent.height;

              this._columnsController.columnOption(options.dataField, 'headerFilter', headerFilterByColumn, true);
            });
          }
        },
        onHidden: () => {
          previousOnHidden?.();
          restoreFocus(this);
        },
      });

      viewOptions.dataSource = this.getDataSource(viewOptions);

      if (viewOptions.isFilterBuilder) {
        // @ts-expect-error getDataSource() returns undefined only for a grid without a data source
        viewOptions.dataSource.filter = null;
        viewOptions.alignment = 'right';
      }

      this._headerFilterView.showHeaderFilterMenu(viewOptions.columnElement, viewOptions);
    }
  }

  public hideHeaderFilterMenu(): void {
    this._headerFilterView.hideHeaderFilterMenu();
  }
}

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<ColumnHeadersView> => class ColumnHeadersViewHeaderFilterExtender
  extends headerFilterMixin(Base) {
  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    const { column } = options;

    if (!column.command && allowHeaderFiltering(column) && this.option('headerFilter.visible') && options.rowType === 'header') {
      const $headerFilterIndicator = this._applyColumnState({
        name: 'headerFilter',
        rootElement: $cell,
        column,
        showColumnLines: this.option('showColumnLines'),
      });

      if ($headerFilterIndicator) {
        this._subscribeToIndicatorEvent($headerFilterIndicator, column, 'headerFilter');
      }
    }

    super._renderCellContent($cell, options, renderOptions);
  }

  private _subscribeToIndicatorEvent(
    $indicator: dxElementWrapper,
    column: Column,
    indicatorName: string,
  ): void {
    if (indicatorName === 'headerFilter') {
      eventsEngine.on($indicator, clickEventName, this.createAction((e) => {
        e.event.stopPropagation();
        saveFocusedElementInfo($indicator, this);

        if (isDefined(column.index)) {
          this._headerFilterController.showHeaderFilterMenu(column.index, false);
        }
      }));
    }
  }

  protected _updateIndicator(
    $cell: dxElementWrapper,
    column: Column,
    indicatorName: string,
  ): dxElementWrapper | undefined {
    const $indicator = super._updateIndicator($cell, column, indicatorName);

    if ($indicator) {
      this._subscribeToIndicatorEvent($indicator, column, indicatorName);
    }

    return undefined;
  }

  private _updateHeaderFilterIndicators(): void {
    if (this.option('headerFilter.visible')) {
      this._updateIndicators('headerFilter');
    }
  }

  private _needUpdateFilterIndicators(): boolean {
    return true;
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { optionNames } = e;
    const isFilterRowAndHeaderFilterValuesChanged = gridCoreUtils.checkChanges(optionNames, ['filterValues', 'filterValue']);
    const isHeaderFilterValuesAndTypeChanged = gridCoreUtils.checkChanges(optionNames, ['filterValues', 'filterType']);

    const shouldUpdateFilterIndicators = (
      isFilterRowAndHeaderFilterValuesChanged || isHeaderFilterValuesAndTypeChanged
    ) && this._needUpdateFilterIndicators();

    if (shouldUpdateFilterIndicators) {
      this._updateHeaderFilterIndicators();
    }

    if (!isHeaderFilterValuesAndTypeChanged) {
      super._columnOptionChanged(e);
    }
  }
};

const headerPanel = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<HeaderPanel> => class HeaderPanelHeaderFilterExtender
  extends headerFilterMixin(Base) {
  protected _createGroupPanelItem(
    $rootElement: dxElementWrapper,
    groupColumn: Column,
  ): dxElementWrapper {
    // @ts-expect-error _createGroupPanelItem is defined by DataGrid grouping
    const $item: dxElementWrapper = super._createGroupPanelItem($rootElement, groupColumn);

    if (!groupColumn.command && allowHeaderFiltering(groupColumn) && this.option('headerFilter.visible')) {
      const $headerFilterIndicator = this._applyColumnState({
        name: 'headerFilter',
        rootElement: $item,
        column: {
          alignment: getDefaultAlignment(this.option('rtlEnabled')),
          filterValues: groupColumn.filterValues,
          allowHeaderFiltering: true,
          caption: groupColumn.caption,
        },
        showColumnLines: true,
      });

      if ($headerFilterIndicator) {
        eventsEngine.on($headerFilterIndicator, clickEventName, this.createAction((e) => {
          const { event } = e;

          event.stopPropagation();

          if (isDefined(groupColumn.index)) {
            this._headerFilterController.showHeaderFilterMenu(groupColumn.index, true);
          }
        }));
      }
    }

    return $item;
  }
};

export const headerFilterModule = {
  defaultOptions(): Pick<InternalGridOptions, 'syncLookupFilterValues' | 'headerFilter'> {
    return {
      syncLookupFilterValues: true,
      headerFilter: {
        visible: false,
        width: 252,
        height: 325,
        allowSelectAll: true,
        search: {
          enabled: false,
          timeout: 500,
          mode: 'contains',
          editorOptions: {},
        },
        texts: {
          emptyValue: messageLocalization.format('dxDataGrid-headerFilterEmptyValue'),
          ok: messageLocalization.format('dxDataGrid-headerFilterOK'),
          cancel: messageLocalization.format('dxDataGrid-headerFilterCancel'),
        },
      },
    };
  },
  controllers: {
    headerFilter: HeaderFilterController,
  },

  views: {
    headerFilterView: HeaderFilterView,
  },
  extenders: {
    views: {
      columnHeadersView,
      headerPanel,
    },
  },
};
