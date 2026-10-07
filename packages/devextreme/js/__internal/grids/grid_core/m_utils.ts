// @ts-check

import eventsEngine from '@js/common/core/events/core/events_engine';
import dateLocalization from '@js/common/core/localization/date';
import type { GroupDescriptor } from '@js/common/data';
import DataSource from '@js/common/data/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { normalizeSortingInfo as normalizeSortingInfoUtility } from '@js/common/data/utils';
import type { HeaderFilterGroupInterval } from '@js/common/grids';
import { data as elementData } from '@js/core/element_data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { BrowserInfo } from '@js/core/utils/browser';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getHeight, getInnerWidth, getOuterWidth } from '@js/core/utils/size';
import { format } from '@js/core/utils/string';
import { isDefined, isFunction, isString } from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
import { getWindow } from '@js/core/utils/window';
import formatHelper from '@js/format_helper';
import type { Format } from '@js/localization';
import LoadPanel from '@js/ui/load_panel';
import sharedFiltering from '@js/ui/shared/filtering';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';
import { isNumeric } from '@ts/core/utils/m_type';
import type { NormalizedDataSourceOptions, StoreLoadOptions } from '@ts/data/data_source/types';
import type { SortingInfo } from '@ts/data/utils';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type {
  ColumnPoint,
  ColumnPointProps,
  ExpandCellTemplate,
  ExpandCellTemplateOptions,
  FormatOptions,
  HeaderFilterGroup,
  HeaderFilterGroupItem,
  LoadPanelPosition,
  LookupDataSource,
  OptionsReader,
  SelectionRange,
  SummaryTextItem,
  TextSelectionElement,
  WidgetElementData,
  WrappedLookupDataSource,
} from '@ts/grids/grid_core/types';

import { AI_COLUMN_NAME } from './ai_column/const';
import type DataSourceAdapter from './data_source_adapter/m_data_source_adapter';
import type { RawItemData } from './data_source_adapter/types';
import type { DataFilter } from './filter/types';
import { combineFilters } from './filter/utils';
import type { ModuleItem } from './modules/modules';
import { isEqualSelectors, isSelectorEqualWithCallback } from './utils/index';

const BASE_LOAD_PANEL_Z_INDEX = 1000;

const DATAGRID_SELECTION_DISABLED_CLASS = 'dx-selection-disabled';
const DATAGRID_GROUP_OPENED_CLASS = 'dx-datagrid-group-opened';
const DATAGRID_GROUP_CLOSED_CLASS = 'dx-datagrid-group-closed';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const NO_DATA_CLASS = 'nodata';
const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
const SCROLLING_MODE_OPTION = 'scrolling.mode';
const ROW_RENDERING_MODE_OPTION = 'scrolling.rowRenderingMode';
const DATE_INTERVAL_SELECTORS = {
  year(value: Date): number {
    return value && value.getFullYear();
  },
  month(value: Date): number {
    return value && (value.getMonth() + 1);
  },
  day(value: Date): number {
    return value && value.getDate();
  },
  quarter(value: Date): number {
    return value && (Math.floor(value.getMonth() / 3) + 1);
  },
  hour(value: Date): number {
    return value && value.getHours();
  },
  minute(value: Date): number {
    return value && value.getMinutes();
  },
  second(value: Date): number {
    return value && value.getSeconds();
  },
};

const DEFAULT_COLUMN_WIDTH = 50;

export function isDateType(dataType: string | undefined): boolean {
  return dataType === 'date' || dataType === 'datetime';
}

const getIntervalSelector = function getIntervalSelector(
  this: Column & Required<Pick<Column, 'calculateCellValue'>>,
  interval: HeaderFilterGroupInterval | number,
  data: unknown,
): number | null | undefined {
  const value = this.calculateCellValue(data);

  if (!isDefined(value)) {
    return null;
  } if (isDateType(this.dataType)) {
    const nameIntervalSelector = interval as HeaderFilterGroupInterval;
    return DATE_INTERVAL_SELECTORS[nameIntervalSelector](value);
  } if (this.dataType === 'number') {
    const groupInterval = interval as number;
    return Math.floor(Number(value) / groupInterval) * groupInterval;
  }

  return undefined;
};

const getGlobalFormat = (dataType: string): Format | undefined => {
  const globalFormat = getGlobalFormatByDataType(dataType);

  if (!globalFormat) {
    return undefined;
  }

  return isString(globalFormat)
    ? (value): string => {
      const dateValue = value instanceof Date ? value : new Date(value);
      return isNaN(dateValue.getTime())
        ? ''
        : dateLocalization.format(dateValue, globalFormat) as string;
    }
    : globalFormat;
};

const setEmptyText = ($container: dxElementWrapper): void => {
  $container.get(0).textContent = '\u00A0';
};

const normalizeSortingInfo = (sort: unknown): SortingInfo[] => {
  const sortItems = sort || [];
  const result = normalizeSortingInfoUtility(sortItems);

  if (Array.isArray(sortItems)) {
    for (let i = 0; i < sortItems.length; i += 1) {
      if (sortItems?.[i]?.isExpanded !== undefined) {
        result[i].isExpanded = sortItems[i].isExpanded;
      }
      if (sortItems?.[i]?.groupInterval !== undefined) {
        result[i].groupInterval = sortItems[i].groupInterval;
      }
    }
  }
  return result;
};

const formatValue = (value: unknown, options: FormatOptions): string => {
  // @ts-expect-error typings of format() and of this || chain expect a primitive value
  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- the value can be of any type
  const valueText: string = formatHelper.format(value, options.format) || (value && value.toString()) || '';
  const formatObject = {
    value,
    valueText: options.getDisplayFormat ? options.getDisplayFormat(valueText) : valueText,
    target: options.target || 'row',
    groupInterval: options.groupInterval,
  };

  return options.customizeText
    ? options.customizeText.call(options, formatObject)
    : formatObject.valueText;
};

const getSummaryText = (
  summaryItem: SummaryTextItem,
  summaryTexts: Record<string, string | undefined>,
): string => {
  const displayFormat = summaryItem.displayFormat || (summaryItem.columnCaption && summaryTexts[`${summaryItem.summaryType}OtherColumn`]) || summaryTexts[summaryItem.summaryType];

  return formatValue(summaryItem.value, {
    format: summaryItem.valueFormat,
    getDisplayFormat(valueText) {
      return displayFormat
        ? format(displayFormat, valueText, summaryItem.columnCaption)
        : valueText;
    },
    customizeText: summaryItem.customizeText,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers use their editor's API
const getWidgetInstance = ($element: dxElementWrapper | undefined): any => {
  const element = $element?.get(0);
  const editorData: WidgetElementData | undefined = element && elementData(element);
  const dxComponents = editorData?.dxComponents;
  const widgetName = dxComponents?.[0];

  return widgetName && editorData?.[widgetName];
};

const createPoint = <T extends ColumnPoint>(options: T): ColumnPoint => ({
  index: options.index,
  columnIndex: options.columnIndex,
  x: options.x,
  y: options.y,
});

const addPointIfNeed = <T extends ColumnPoint> (
  points: ColumnPoint[],
  pointProps: T,
  pointCreated: (point: T) => boolean,
): void => {
  let notCreatePoint = false;

  if (pointCreated) {
    notCreatePoint = pointCreated(pointProps);
  }

  if (!notCreatePoint) {
    const point = createPoint(pointProps);

    points.push(point);
  }
};

const markBoundaryPoints = (
  point: ColumnPointProps,
  prevPoint: ColumnPointProps,
  rtlEnabled: boolean,
): void => {
  if (rtlEnabled) {
    point.isRightBoundary = true;
    prevPoint.isLeftBoundary = true;
  } else {
    point.isLeftBoundary = true;
    prevPoint.isRightBoundary = true;
  }
};

const getColumnWidths = (columns: Column[]): number[] => columns
  .map((column) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const width = column.visibleWidth || column.width;

    return isNumeric(width) ? parseFloat(width as string) : DEFAULT_COLUMN_WIDTH;
  });

function normalizeGroupingLoadOptions(
  group: GroupDescriptor<unknown> | GroupDescriptor<unknown>[],
): GroupDescriptor<unknown>[] {
  const groups = Array.isArray(group) ? group : [group];

  return groups.map((item, i) => {
    if (isString(item)) {
      return {
        selector: item,
        isExpanded: i < groups.length - 1,
      };
    }

    return item;
  });
}

const getLookupDataSourceOptions = (lookup: NonNullable<Column['lookup']>): unknown => {
  if (lookup.items) {
    return lookup.items;
  }

  const { dataSource } = lookup;

  return isFunction(dataSource) && !variableWrapper.isWrapped(dataSource)
    ? dataSource({})
    : dataSource;
};

export default {
  renderNoDataText($container?: dxElementWrapper): void {
    const $element = $container || this.element();

    if (!$element) {
      return;
    }

    const noDataClass = this.addWidgetPrefix(NO_DATA_CLASS);
    let noDataElement = $element.find(`.${noDataClass}`).last();
    const isVisible = this._dataController.isEmpty();
    const isDefaultLoading = this._dataController.isLoading()
      && !this._dataController.isCustomLoading?.();

    if (!noDataElement.length) {
      noDataElement = $('<span>')
        .addClass(noDataClass);
    }

    if (!noDataElement.parent().is($element)) {
      noDataElement.appendTo($element);
    }

    if (isVisible && !isDefaultLoading) {
      noDataElement
        .removeClass('dx-hidden')
        .text(this._getNoDataText());
    } else {
      noDataElement
        .addClass('dx-hidden');
    }
  },

  renderLoadPanel(
    $element: dxElementWrapper,
    $container: dxElementWrapper,
    isLocalStore?: boolean,
  ): void {
    if (this._loadPanel) {
      this._loadPanel.$element().remove();
    }
    let loadPanelOptions = this.option('loadPanel');

    if (loadPanelOptions && (loadPanelOptions.enabled === 'auto' ? !isLocalStore : loadPanelOptions.enabled)) {
      loadPanelOptions = extend({
        shading: false,
        message: loadPanelOptions.text,
        container: $container,
        zIndex: BASE_LOAD_PANEL_Z_INDEX,
      }, loadPanelOptions);

      this._loadPanel = this._createComponent($('<div>').appendTo($container), LoadPanel, loadPanelOptions);
    } else {
      this._loadPanel = null;
    }
  },

  calculateLoadPanelPosition($element: dxElementWrapper | undefined): LoadPanelPosition {
    const $window = $(getWindow());
    if (getHeight($element) > getHeight($window)) {
      return {
        of: $window,
        boundary: $element,
        collision: 'fit',
      };
    }
    return { of: $element };
  },

  getIndexByKey(key: unknown, items: unknown, keyName?: string | string[] | null): number {
    let index = -1;

    if (key !== undefined && Array.isArray(items)) {
      const keyField = arguments.length <= 2 ? 'key' : keyName;
      for (let i = 0; i < items.length; i += 1) {
        const item = isDefined(keyField) ? items[i][String(keyField)] : items[i];

        if (equalByValue(key, item)) {
          index = i;
          break;
        }
      }
    }

    return index;
  },

  checkChanges(changes: ColumnsChanges['optionNames'], changeNames: string[]): number | boolean {
    let changesWithChangeNamesCount = 0;

    for (const changeName of changeNames) {
      if (changes[changeName]) {
        changesWithChangeNamesCount += 1;
      }
    }

    return changes.length && changes.length === changesWithChangeNamesCount;
  },

  formatValue,

  getFormatOptionsByColumn(
    column: Column & Pick<FormatOptions, 'getDisplayFormat'>,
    target: string,
  ): FormatOptions {
    return {
      format: column.format,
      getDisplayFormat: column.getDisplayFormat,
      customizeText: column.customizeText,
      target,
      trueText: column.trueText,
      falseText: column.falseText,
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers use it as their own type
  getDisplayValue(column: Column, value: unknown, data: unknown, rowType?: string): any {
    if (column.displayValueMap?.[String(value)] !== undefined) {
      return column.displayValueMap[String(value)];
    }
    if (column.calculateDisplayValue && data && rowType !== 'group') {
      // @ts-expect-error after columnOption it can still be a string, and the call throws
      return column.calculateDisplayValue(data);
    }

    const isCalculatedFromLookup = column.lookup
      && column.type !== AI_COLUMN_NAME
      && (rowType !== 'group' || (!column.calculateGroupValue && !column.calculateDisplayValue));

    if (isCalculatedFromLookup) {
      // @ts-expect-error the lookup is checked above and gets calculateCellValue on init
      return column.lookup.calculateCellValue(value);
    }

    return value;
  },

  getGroupRowSummaryText(
    summaryItems: SummaryTextItem[],
    summaryTexts: Record<string, string | undefined> | undefined,
  ): string {
    let result = '(';

    for (let i = 0; i < summaryItems.length; i += 1) {
      const summaryItem = summaryItems[i];
      result += (i > 0 ? ', ' : '') + getSummaryText(summaryItem, summaryTexts ?? {});
    }
    // eslint-disable-next-line no-return-assign
    return result += ')';
  },

  getSummaryText,

  normalizeSortingInfo,

  getFormatByDataType(dataType: string | undefined): Format | undefined {
    switch (dataType) {
      case 'date':
        return getGlobalFormat('date') || 'shortDate';
      case 'datetime':
        return getGlobalFormat('datetime') || 'shortDateShortTime';
      default:
        return undefined;
    }
  },

  getHeaderFilterGroupParameters(
    column: Column & Required<Pick<Column, 'calculateCellValue'>>,
    remoteGrouping?: boolean,
  ): HeaderFilterGroup {
    const dataField = column.dataField || column.name;
    const groupInterval = sharedFiltering.getGroupInterval(column);

    if (groupInterval) {
      const result: HeaderFilterGroupItem[] = [];

      each(groupInterval, (index, interval) => {
        result.push(remoteGrouping ? {
          selector: dataField,
          groupInterval: interval,
          isExpanded: index < groupInterval.length - 1,
          // @ts-ignore
        } : getIntervalSelector.bind(column, interval));
      });

      return result;
    }

    if (remoteGrouping) {
      return [{ selector: dataField, isExpanded: false }];
    }

    const selector = (data: unknown): unknown => {
      let value = column.calculateCellValue(data);

      if (value === undefined || value === '') {
        value = null;
      }
      return value;
    };

    if (column.sortingMethod) {
      return [{ selector, compare: column.sortingMethod.bind(column) }];
    }

    return selector;
  },

  equalSortParameters(
    sortParameters1: unknown,
    sortParameters2: unknown,
    ignoreIsExpanded?: boolean,
  ): boolean {
    const sortInfo1 = normalizeSortingInfo(sortParameters1);
    const sortInfo2 = normalizeSortingInfo(sortParameters2);

    if (Array.isArray(sortInfo1) && Array.isArray(sortInfo2)) {
      if (sortInfo1.length !== sortInfo2.length) {
        return false;
      }
      for (let i = 0; i < sortInfo1.length; i += 1) {
        if (
          !isEqualSelectors(sortInfo1[i].selector, sortInfo2[i].selector)
          || sortInfo1[i].desc !== sortInfo2[i].desc
          || sortInfo1[i].groupInterval !== sortInfo2[i].groupInterval
          || (!ignoreIsExpanded
            && Boolean(sortInfo1[i].isExpanded) !== Boolean(sortInfo2[i].isExpanded))
        ) {
          return false;
        }
      }

      return true;
    }
    return !sortInfo1?.length === !sortInfo2?.length;
  },

  getPointsByColumns(
    items: dxElementWrapper,
    pointCreated: (point: ColumnPointProps) => boolean,
    isVertical = false,
    startColumnIndex = 0,
    needToCheckPrevPoint = false,
  ): ColumnPoint[] {
    const result: ColumnPoint[] = [];
    const cellsLength: number = items.length;
    let offset: { left: number; top: number } = { left: 0, top: 0 };
    let itemRect: { width: number; height: number } = { width: 0, height: 0 };
    let columnIndex = startColumnIndex;
    let rtlEnabled = false;

    for (let i = 0; i <= cellsLength; i += 1) {
      if (i < cellsLength) {
        const $item = items.eq(i);
        // @ts-expect-error offset() of a wrapper with an element is always defined
        offset = $item.offset();
        itemRect = getBoundingRect($item.get(0));
        rtlEnabled = $item.css('direction') === 'rtl';
      }

      const offsetRight = offset.left + itemRect.width;
      const offsetBottom = offset.top + itemRect.height;

      const pointProps: ColumnPointProps = {
        index: columnIndex,
        columnIndex,
        item: items[Math.min(i, cellsLength - 1)],
        x: !isVertical && rtlEnabled !== (i === cellsLength) ? offsetRight : offset.left,
        y: isVertical && i === cellsLength ? offsetBottom : offset.top,
      };

      if (!isVertical && i > 0) {
        // @ts-expect-error offset() of a wrapper with an element is always defined
        const prevItemOffset: { left: number; top: number } = items.eq(i - 1).offset();
        const { width: prevItemWidth }: { width: number } = getBoundingRect(items[i - 1]);
        const prevItemOffsetX = rtlEnabled
          ? prevItemOffset.left
          : prevItemOffset.left + prevItemWidth;

        if (prevItemOffset.top < pointProps.y) {
          pointProps.y = prevItemOffset.top;
        }

        if (needToCheckPrevPoint && Math.round(prevItemOffsetX) !== Math.round(pointProps.x)) {
          const prevPointProps: ColumnPointProps = {
            ...pointProps,
            item: items[i - 1],
            x: prevItemOffsetX,
          };

          markBoundaryPoints(pointProps, prevPointProps, rtlEnabled);
          addPointIfNeed(result, prevPointProps, pointCreated);
        }
      }

      addPointIfNeed(result, pointProps, pointCreated);
      columnIndex += 1;
    }
    return result;
  },

  getExpandCellTemplate(): ExpandCellTemplate {
    return {
      allowRenderToDetachedContainer: true,
      render(container: dxElementWrapper, options: ExpandCellTemplateOptions): void {
        const $container = $(container);

        if (
          isDefined(options.value)
          && !options.data?.isContinuation
          && !options.row.isNewRow
        ) {
          const rowsView = options.component.getView('rowsView');
          $container
            .addClass(DATAGRID_EXPAND_CLASS)
            .addClass(DATAGRID_SELECTION_DISABLED_CLASS);

          $('<div>')
            .addClass(options.value ? DATAGRID_GROUP_OPENED_CLASS : DATAGRID_GROUP_CLOSED_CLASS)
            .appendTo($container);

          rowsView.setAria(
            'label',
            options.value ? rowsView.localize('dxDataGrid-ariaCollapse') : rowsView.localize('dxDataGrid-ariaExpand'),
            $container,
          );
        } else {
          setEmptyText($container);
        }
      },
    };
  },

  setEmptyText,

  isDateType,

  getSelectionRange(focusedElement: TextSelectionElement | null | undefined): SelectionRange {
    try {
      if (focusedElement) {
        return {
          selectionStart: isNumeric(focusedElement.selectionStart)
            ? focusedElement.selectionStart as number
            : -1,
          selectionEnd: isNumeric(focusedElement.selectionEnd)
            ? focusedElement.selectionEnd as number
            : -1,
        };
      }
    } catch (e) { /* empty */ }

    return {
      selectionStart: -1,
      selectionEnd: -1,
    };
  },

  setSelectionRange(
    focusedElement: TextSelectionElement | null | undefined,
    selectionRange: SelectionRange,
  ): void {
    try {
      if (
        focusedElement?.setSelectionRange
        && selectionRange.selectionStart >= 0
        && selectionRange.selectionEnd >= 0
      ) {
        focusedElement.setSelectionRange(
          selectionRange.selectionStart,
          selectionRange.selectionEnd,
        );
      }
    } catch (e) { /* empty */ }
  },

  focusAndSelectElement(component: ModuleItem, $element: dxElementWrapper): void {
    const isFocused = $element.is(':focus');
    // @ts-expect-error
    eventsEngine.trigger($element, 'focus');

    const isSelectTextOnEditingStart = component.option('editing.selectTextOnEditStart');

    if (!isFocused && isSelectTextOnEditingStart && $element.is('.dx-texteditor-input') && !$element.is('[readonly]')) {
      const element = $element.get(0) as HTMLInputElement | HTMLTextAreaElement;
      const editor = getWidgetInstance($element.closest('.dx-texteditor'));

      when(editor && editor._loadItemDeferred).done(() => {
        element.select();
      });
    }
  },

  getWidgetInstance,

  getLastResizableColumnIndex(columns: Column[], resultWidths?: (number | string)[]): number {
    const hasResizableColumns = columns.some(
      (column) => column && !column.command && !column.fixed && column.allowResizing !== false,
    );
    let lastColumnIndex = columns.length - 1;

    for (; columns[lastColumnIndex]; lastColumnIndex -= 1) {
      const column = columns[lastColumnIndex];
      const width = resultWidths && resultWidths[lastColumnIndex];
      const allowResizing = !hasResizableColumns || column.allowResizing !== false;

      if (!column.command && !column.fixed && width !== 'adaptiveHidden' && allowResizing) {
        break;
      }
    }

    return lastColumnIndex;
  },

  isElementInCurrentGrid(
    controller: ModuleItem,
    $element: dxElementWrapper | null | undefined,
  ): boolean {
    if ($element?.length) {
      const $grid = $element.closest(`.${controller.getWidgetContainerClass()}`).parent();

      return $grid.is(controller.component.$element());
    }
    return false;
  },

  isVirtualRowRendering(that: OptionsReader): boolean {
    const rowRenderingMode = that.option(ROW_RENDERING_MODE_OPTION);
    const isVirtualMode = that.option(SCROLLING_MODE_OPTION) === SCROLLING_MODE_VIRTUAL;
    const isAppendMode = that.option(SCROLLING_MODE_OPTION) === SCROLLING_MODE_INFINITE;

    if (that.option(LEGACY_SCROLLING_MODE) === false && (isVirtualMode || isAppendMode)) {
      return true;
    }

    return rowRenderingMode === SCROLLING_MODE_VIRTUAL;
  },

  getPixelRatio(window: Window): number {
    return window.devicePixelRatio || 1;
  },

  /// #DEBUG
  _setPixelRatioFn(value: (window: Window) => number): void {
    this.getPixelRatio = value;
  },
  /// #ENDDEBUG

  getContentHeightLimit(browser: BrowserInfo): number {
    if (browser.mozilla) {
      return 8000000;
    }

    return 15000000 / this.getPixelRatio(getWindow());
  },

  normalizeLookupDataSource(lookup: NonNullable<Column['lookup']>): NormalizedDataSourceOptions {
    return normalizeDataSourceOptions(getLookupDataSourceOptions(lookup));
  },

  getWrappedLookupDataSource(
    column: Column,
    dataSourceAdapter: DataSourceAdapter | null | undefined,
    filter: DataFilter,
  ): LookupDataSource {
    const { lookup } = column;

    if (!dataSourceAdapter || !lookup) {
      return [];
    }

    const lookupDataSourceOptions: NormalizedDataSourceOptions = this.normalizeLookupDataSource(
      lookup,
    );

    if (column.calculateCellValue !== column.defaultCalculateCellValue) {
      return lookupDataSourceOptions;
    }

    const hasGroupPaging = dataSourceAdapter.remoteOperations().groupPaging;
    const hasLookupOptimization = column.displayField && isString(column.displayField);
    const cache: { items?: RawItemData[]; skip?: number; take?: number } = {};

    const sliceItems = (items: RawItemData[], loadOptions: StoreLoadOptions): RawItemData[] => {
      const start = loadOptions.skip ?? 0;
      const end = loadOptions.take ? start + loadOptions.take : items.length;
      return items.slice(start, end);
    };

    const loadUniqueRelevantItems = (
      loadOptions: StoreLoadOptions,
    ): DeferredObj<RawItemData[]> => {
      const group = normalizeGroupingLoadOptions(
        // @ts-expect-error a bound lookup column has dataField, and displayField is checked above
        hasLookupOptimization ? [column.dataField, column.displayField] : column.dataField,
      );
      // @ts-expect-error
      const d = new Deferred();

      const isSamePage = !hasGroupPaging
        || (loadOptions.skip === cache.skip && loadOptions.take === cache.take);

      if (cache.items && isSamePage) {
        d.resolve(sliceItems(cache.items, loadOptions));
      } else {
        cache.skip = loadOptions.skip;
        cache.take = loadOptions.take;
        dataSourceAdapter.customLoader.load({
          filter,
          group,
          take: hasGroupPaging ? loadOptions.take : undefined,
          skip: hasGroupPaging ? loadOptions.skip : undefined,
        }).done(({ data }) => {
          cache.items = data;
          d.resolve(hasGroupPaging ? data : sliceItems(data, loadOptions));
        }).fail(d.fail);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped new Deferred()
      return d;
    };

    const lookupDataSource: WrappedLookupDataSource = {
      ...lookupDataSourceOptions,
      __dataGridSourceFilter: filter,
      load: (loadOptions: StoreLoadOptions): DeferredObj<unknown> => {
        // @ts-expect-error
        const d = new Deferred();
        loadUniqueRelevantItems(loadOptions).done((items) => {
          if (items.length === 0) {
            d.resolve([]);
            return;
          }

          const keysFilter = combineFilters(
            items.flatMap((data) => data.key).map((key) => [
              lookup.valueExpr, key,
            ]),
            'or',
          );

          const newDataSource = new DataSource({
            ...lookupDataSourceOptions,
            ...loadOptions,
            filter: combineFilters([keysFilter, loadOptions.filter], 'and'),
            paginate: false, // pagination is included to filter
          });

          newDataSource
            .load()
            .done(d.resolve)
            .fail(d.fail);
        }).fail(d.fail);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped new Deferred()
        return d;
      },
      key: lookup.valueExpr,
      byKey(key: unknown): Promise<unknown> {
        const d = Deferred<unknown>();
        this.load({
          filter: [lookup.valueExpr, '=', key],
        }).done((arr) => {
          d.resolve(arr[0]);
        });

        return d.promise();
      },
    };

    return lookupDataSource;
  },

  getComponentBorderWidth(
    that: ModuleItem,
    $rowsViewElement: dxElementWrapper | undefined,
  ): number {
    const borderWidth = that.option('showBorders')
      ? Math.ceil(getOuterWidth($rowsViewElement) - getInnerWidth($rowsViewElement))
      : 0;

    return borderWidth;
  },

  isCustomCommandColumn(columns: Column[], commandColumn: Column): boolean {
    const customCommandColumns = columns
      .filter((column) => column.type === commandColumn.type);

    return !!customCommandColumns.length;
  },

  // New utils
  isEqualSelectors,
  isSelectorEqualWithCallback,
  getColumnWidths,
};
