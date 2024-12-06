// @ts-check

import eventsEngine from '@js/common/core/events/core/events_engine';
import DataSource from '@js/common/data/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { normalizeSortingInfo as normalizeSortingInfoUtility } from '@js/common/data/utils';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { toComparable } from '@js/core/utils/data';
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
import LoadPanel from '@js/ui/load_panel';
import sharedFiltering from '@js/ui/shared/filtering';

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
  year(value) {
    return value && value.getFullYear();
  },
  month(value) {
    return value && (value.getMonth() + 1);
  },
  day(value) {
    return value && value.getDate();
  },
  quarter(value) {
    return value && (Math.floor(value.getMonth() / 3) + 1);
  },
  hour(value) {
    return value && value.getHours();
  },
  minute(value) {
    return value && value.getMinutes();
  },
  second(value) {
    return value && value.getSeconds();
  },
};

const getIntervalSelector = function () {
  const data = arguments[1];
  const value = this.calculateCellValue(data);

  if (!isDefined(value)) {
    return null;
  } if (isDateType(this.dataType)) {
    const nameIntervalSelector = arguments[0];
    return DATE_INTERVAL_SELECTORS[nameIntervalSelector](value);
  } if (this.dataType === 'number') {
    const groupInterval = arguments[0];
    return Math.floor(Number(value) / groupInterval) * groupInterval;
  }
};

const equalSelectors = function (selector1, selector2) {
  if (isFunction(selector1) && isFunction(selector2)) {
    if (selector1.originalCallback && selector2.originalCallback) {
      return selector1.originalCallback === selector2.originalCallback && selector1.columnIndex === selector2.columnIndex;
    }
  }

  return selector1 === selector2;
};

function isDateType(dataType) {
  return dataType === 'date' || dataType === 'datetime';
}

const setEmptyText = function ($container) {
  $container.get(0).textContent = '\u00A0';
};

const normalizeSortingInfo = function (sort) {
  sort = sort || [];
  const result = normalizeSortingInfoUtility(sort);

  for (let i = 0; i < sort.length; i++) {
    if (sort && sort[i] && sort[i].isExpanded !== undefined) {
      result[i].isExpanded = sort[i].isExpanded;
    }
    if (sort && sort[i] && sort[i].groupInterval !== undefined) {
      result[i].groupInterval = sort[i].groupInterval;
    }
  }
  return result;
};

const formatValue = function (value, options) {
  const valueText = formatHelper.format(value, options.format) || (value && value.toString()) || '';
  const formatObject = {
    value,
    valueText: options.getDisplayFormat ? options.getDisplayFormat(valueText) : valueText,
    target: options.target || 'row',
    groupInterval: options.groupInterval,
  };

  return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText;
};

const getSummaryText = function (summaryItem, summaryTexts) {
  const displayFormat = summaryItem.displayFormat || (summaryItem.columnCaption && summaryTexts[`${summaryItem.summaryType}OtherColumn`]) || summaryTexts[summaryItem.summaryType];

  return formatValue(summaryItem.value, {
    format: summaryItem.valueFormat,
    getDisplayFormat(valueText) {
      return displayFormat ? format(displayFormat, valueText, summaryItem.columnCaption) : valueText;
    },
    customizeText: summaryItem.customizeText,
  });
};

const getWidgetInstance = function ($element) {
  const editorData = $element.data && $element.data();
  const dxComponents = editorData && editorData.dxComponents;
  const widgetName = dxComponents && dxComponents[0];

  return widgetName && editorData[widgetName];
};

const equalFilterParameters = function (filter1, filter2) {
  if (Array.isArray(filter1) && Array.isArray(filter2)) {
    if (filter1.length !== filter2.length) {
      return false;
    }
    for (let i = 0; i < filter1.length; i++) {
      if (!equalFilterParameters(filter1[i], filter2[i])) {
        return false;
      }
    }

    return true;
  } if (isFunction(filter1) && filter1.columnIndex >= 0 && isFunction(filter2) && filter2.columnIndex >= 0) {
    return filter1.columnIndex === filter2.columnIndex
      && toComparable(filter1.filterValue) === toComparable(filter2.filterValue)
      && toComparable(filter1.selectedFilterOperation) === toComparable(filter2.selectedFilterOperation);
  }
  return toComparable(filter1) == toComparable(filter2); // eslint-disable-line eqeqeq
};

const createPoint = function (options): Record<string, any> {
  return {
    index: options.index,
    columnIndex: options.columnIndex,
    x: options.x,
    y: options.y,
  };
};

const addPointIfNeed = function (points, pointProps, pointCreated): void {
  let notCreatePoint = false;

  if (pointCreated) {
    notCreatePoint = pointCreated(pointProps);
  }

  if (!notCreatePoint) {
    const point = createPoint(pointProps);

    points.push(point);
  }
};

function normalizeGroupingLoadOptions(group) {
  if (!Array.isArray(group)) {
    group = [group];
  }

  return group.map((item, i) => {
    if (isString(item)) {
      return {
        selector: item,
        isExpanded: i < group.length - 1,
      };
    }

    return item;
  });
}

export default {
  renderNoDataText($element) {
    const that = this;
    $element = $element || this.element();

    if (!$element) {
      return;
    }

    const noDataClass = that.addWidgetPrefix(NO_DATA_CLASS);
    let noDataElement = $element.find(`.${noDataClass}`).last();
    const isVisible = this._dataController.isEmpty();
    const isLoading = this._dataController.isLoading();

    if (!noDataElement.length) {
      noDataElement = $('<span>')
        .addClass(noDataClass);
    }

    if (!noDataElement.parent().is($element)) {
      noDataElement.appendTo($element);
    }

    if (isVisible && !isLoading) {
      noDataElement
        .removeClass('dx-hidden')
        .text(that._getNoDataText());
    } else {
      noDataElement
        .addClass('dx-hidden');
    }
  },

  renderLoadPanel($element, $container, isLocalStore) {
    const that = this;
    let loadPanelOptions;

    that._loadPanel && that._loadPanel.$element().remove();
    loadPanelOptions = that.option('loadPanel');

    if (loadPanelOptions && (loadPanelOptions.enabled === 'auto' ? !isLocalStore : loadPanelOptions.enabled)) {
      loadPanelOptions = extend({
        shading: false,
        message: loadPanelOptions.text,
        container: $container,
      }, loadPanelOptions);

      that._loadPanel = that._createComponent($('<div>').appendTo($container), LoadPanel, loadPanelOptions);
    } else {
      that._loadPanel = null;
    }
  },

  calculateLoadPanelPosition($element) {
    // @ts-expect-error
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

  getIndexByKey(key, items, keyName?) {
    let index = -1;

    if (key !== undefined && Array.isArray(items)) {
      keyName = arguments.length <= 2 ? 'key' : keyName;
      for (let i = 0; i < items.length; i++) {
        const item = isDefined(keyName) ? items[i][keyName] : items[i];

        if (equalByValue(key, item)) {
          index = i;
          break;
        }
      }
    }

    return index;
  },

  combineFilters(filters, operation?): any {
    let resultFilter: any[] = [];

    operation = operation || 'and';

    for (let i = 0; i < filters.length; i++) {
      if (!filters[i]) {
        continue;
      }
      if (filters[i]?.length === 1 && filters[i][0] === '!') {
        if (operation === 'and') {
          return ['!'];
        } if (operation === 'or') {
          continue;
        }
      }
      if (resultFilter.length) {
        resultFilter.push(operation);
      }
      resultFilter.push(filters[i]);
    }
    if (resultFilter.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      resultFilter = resultFilter[0];
    }
    if (resultFilter.length) {
      return resultFilter;
    }

    return undefined;
  },

  checkChanges(changes, changeNames) {
    let changesWithChangeNamesCount = 0;

    for (let i = 0; i < changeNames.length; i++) {
      if (changes[changeNames[i]]) {
        changesWithChangeNamesCount++;
      }
    }

    return changes.length && changes.length === changesWithChangeNamesCount;
  },

  equalFilterParameters,

  proxyMethod(instance, methodName, defaultResult?) {
    if (!instance[methodName]) {
      instance[methodName] = function () {
        const dataSource = this._dataSource;
        return dataSource ? dataSource[methodName].apply(dataSource, arguments) : defaultResult;
      };
    }
  },

  formatValue,

  getFormatOptionsByColumn(column, target) {
    return {
      format: column.format,
      getDisplayFormat: column.getDisplayFormat,
      customizeText: column.customizeText,
      target,
      trueText: column.trueText,
      falseText: column.falseText,
    };
  },

  getDisplayValue(column, value, data, rowType?) {
    if (column.displayValueMap && column.displayValueMap[value] !== undefined) {
      return column.displayValueMap[value];
    } if (column.calculateDisplayValue && data && rowType !== 'group') {
      return column.calculateDisplayValue(data);
    } if (column.lookup && !(rowType === 'group' && (column.calculateGroupValue || column.calculateDisplayValue))) {
      return column.lookup.calculateCellValue(value);
    }
    return value;
  },

  getGroupRowSummaryText(summaryItems, summaryTexts) {
    let result = '(';

    for (let i = 0; i < summaryItems.length; i++) {
      const summaryItem = summaryItems[i];
      result += (i > 0 ? ', ' : '') + getSummaryText(summaryItem, summaryTexts);
    }
    // eslint-disable-next-line no-return-assign
    return result += ')';
  },

  getSummaryText,

  normalizeSortingInfo,

  getFormatByDataType(dataType) {
    // eslint-disable-next-line default-case
    switch (dataType) {
      case 'date':
        return 'shortDate';
      case 'datetime':
        return 'shortDateShortTime';
      default:
        return undefined;
    }
  },

  getHeaderFilterGroupParameters(column, remoteGrouping?) {
    let result: any = [];
    const dataField = column.dataField || column.name;
    const groupInterval = sharedFiltering.getGroupInterval(column);

    if (groupInterval) {
      each(groupInterval, (index, interval) => {
        result.push(remoteGrouping ? {
          selector: dataField,
          groupInterval: interval,
          isExpanded: index < groupInterval.length - 1,
        } : getIntervalSelector.bind(column, interval));
      });

      return result;
    }

    if (remoteGrouping) {
      result = [{ selector: dataField, isExpanded: false }];
    } else {
      result = function (data) {
        let result = column.calculateCellValue(data);
        if (result === undefined || result === '') {
          result = null;
        }
        return result;
      };

      if (column.sortingMethod) {
        result = [{ selector: result, compare: column.sortingMethod.bind(column) }];
      }
    }

    return result;
  },

  equalSortParameters(sortParameters1, sortParameters2, ignoreIsExpanded?) {
    sortParameters1 = normalizeSortingInfo(sortParameters1);
    sortParameters2 = normalizeSortingInfo(sortParameters2);

    if (Array.isArray(sortParameters1) && Array.isArray(sortParameters2)) {
      if (sortParameters1.length !== sortParameters2.length) {
        return false;
      }
      for (let i = 0; i < sortParameters1.length; i++) {
        if (!equalSelectors(sortParameters1[i].selector, sortParameters2[i].selector) || sortParameters1[i].desc !== sortParameters2[i].desc || sortParameters1[i].groupInterval !== sortParameters2[i].groupInterval || (!ignoreIsExpanded && Boolean(sortParameters1[i].isExpanded) !== Boolean(sortParameters2[i].isExpanded))) {
          return false;
        }
      }

      return true;
    }
    return (!sortParameters1 || !sortParameters1.length) === (!sortParameters2 || !sortParameters2.length);
  },

  getPointsByColumns(items, pointCreated, isVertical?, startColumnIndex = 0, needToCheckPrevPoint = false) {
    const result: any[] = [];
    const cellsLength: number = items.length;
    let $item;
    let offset: { left: number; top: number } = { left: 0, top: 0 };
    let itemRect: { width: number; height: number } = { width: 0, height: 0 };
    let columnIndex = startColumnIndex;
    let rtlEnabled;

    for (let i = 0; i <= cellsLength; i++) {
      if (i < cellsLength) {
        $item = items.eq(i);
        offset = $item.offset();
        itemRect = getBoundingRect($item.get(0));
        rtlEnabled = $item.css('direction') === 'rtl';
      }

      const offsetRight = offset.left + itemRect.width;
      const offsetBottom = offset.top + itemRect.height;

      const pointProps: any = {
        index: columnIndex,
        columnIndex,
        item: $item?.get(0),
        x: !isVertical && rtlEnabled !== (i === cellsLength) ? offsetRight : offset.left,
        y: isVertical && i === cellsLength ? offsetBottom : offset.top,
      };

      if (!isVertical && i > 0) {
        const prevItemOffset: { left: number; top: number } = items.eq(i - 1).offset();
        const { width: prevItemWidth }: { width: number } = getBoundingRect(items[i - 1]);
        const prevItemOffsetX = rtlEnabled
          ? prevItemOffset.left
          : prevItemOffset.left + prevItemWidth;

        if (prevItemOffset.top < pointProps.y) {
          pointProps.y = prevItemOffset.top;
        }

        if (needToCheckPrevPoint && Math.round(prevItemOffsetX) !== Math.round(pointProps.x)) {
          const prevPointProps: any = {
            ...pointProps,
            item: items[i - 1],
            x: prevItemOffsetX,
          };

          if (rtlEnabled) {
            pointProps.isRightBoundary = true;
            prevPointProps.isLeftBoundary = true;
          } else {
            pointProps.isLeftBoundary = true;
            prevPointProps.isRightBoundary = true;
          }

          addPointIfNeed(result, prevPointProps, pointCreated);
        }
      }

      addPointIfNeed(result, pointProps, pointCreated);
      columnIndex++;
    }
    return result;
  },

  getExpandCellTemplate() {
    return {
      allowRenderToDetachedContainer: true,
      render(container, options) {
        const $container = $(container);

        if (isDefined(options.value) && !(options.data && options.data.isContinuation) && !options.row.isNewRow) {
          const rowsView = options.component.getView('rowsView');
          $container
            .addClass(DATAGRID_EXPAND_CLASS)
            .addClass(DATAGRID_SELECTION_DISABLED_CLASS);

          $('<div>')
            .addClass(options.value ? DATAGRID_GROUP_OPENED_CLASS : DATAGRID_GROUP_CLOSED_CLASS)
            .appendTo($container);

          rowsView.setAria('label', options.value ? rowsView.localize('dxDataGrid-ariaCollapse') : rowsView.localize('dxDataGrid-ariaExpand'), $container);
        } else {
          setEmptyText($container);
        }
      },
    };
  },

  setEmptyText,

  isDateType,

  getSelectionRange(focusedElement) {
    try {
      if (focusedElement) {
        return {
          selectionStart: focusedElement.selectionStart,
          selectionEnd: focusedElement.selectionEnd,
        };
      }
    } catch (e) { /* empty */ }

    return {};
  },

  setSelectionRange(focusedElement, selectionRange) {
    try {
      if (focusedElement && focusedElement.setSelectionRange) {
        focusedElement.setSelectionRange(selectionRange.selectionStart, selectionRange.selectionEnd);
      }
    } catch (e) { /* empty */ }
  },

  focusAndSelectElement(component, $element) {
    const isFocused = $element.is(':focus');
    // @ts-expect-error
    eventsEngine.trigger($element, 'focus');

    const isSelectTextOnEditingStart = component.option('editing.selectTextOnEditStart');
    const element = $element.get(0);

    if (!isFocused && isSelectTextOnEditingStart && $element.is('.dx-texteditor-input') && !$element.is('[readonly]')) {
      const editor = getWidgetInstance($element.closest('.dx-texteditor'));

      when(editor && editor._loadItemDeferred).done(() => {
        element.select();
      });
    }
  },

  getWidgetInstance,

  getLastResizableColumnIndex(columns, resultWidths?) {
    const hasResizableColumns = columns.some((column) => column && !column.command && !column.fixed && column.allowResizing !== false);
    let lastColumnIndex;

    for (lastColumnIndex = columns.length - 1; columns[lastColumnIndex]; lastColumnIndex--) {
      const column = columns[lastColumnIndex];
      const width = resultWidths && resultWidths[lastColumnIndex];
      const allowResizing = !hasResizableColumns || column.allowResizing !== false;

      if (!column.command && !column.fixed && width !== 'adaptiveHidden' && allowResizing) {
        break;
      }
    }

    return lastColumnIndex;
  },

  isElementInCurrentGrid(controller, $element) {
    if ($element && $element.length) {
      const $grid = $element.closest(`.${controller.getWidgetContainerClass()}`).parent();
      return $grid.is(controller.component.$element());
    }
    return false;
  },

  isVirtualRowRendering(that) {
    const rowRenderingMode = that.option(ROW_RENDERING_MODE_OPTION);
    const isVirtualMode = that.option(SCROLLING_MODE_OPTION) === SCROLLING_MODE_VIRTUAL;
    const isAppendMode = that.option(SCROLLING_MODE_OPTION) === SCROLLING_MODE_INFINITE;

    if (that.option(LEGACY_SCROLLING_MODE) === false && (isVirtualMode || isAppendMode)) {
      return true;
    }

    return rowRenderingMode === SCROLLING_MODE_VIRTUAL;
  },

  getPixelRatio(window) {
    return window.devicePixelRatio || 1;
  },

  /// #DEBUG
  _setPixelRatioFn(value) {
    this.getPixelRatio = value;
  },
  /// #ENDDEBUG

  getContentHeightLimit(browser) {
    if (browser.mozilla) {
      return 8000000;
    }

    return 15000000 / this.getPixelRatio(getWindow());
  },

  normalizeLookupDataSource(lookup) {
    let lookupDataSourceOptions;
    if (lookup.items) {
      lookupDataSourceOptions = lookup.items;
    } else {
      lookupDataSourceOptions = lookup.dataSource;
      if (isFunction(lookupDataSourceOptions) && !variableWrapper.isWrapped(lookupDataSourceOptions)) {
        lookupDataSourceOptions = lookupDataSourceOptions({});
      }
    }
    // @ts-expect-error
    return normalizeDataSourceOptions(lookupDataSourceOptions);
  },

  getWrappedLookupDataSource(column, dataSource, filter) {
    if (!dataSource) {
      return [];
    }

    const lookupDataSourceOptions = this.normalizeLookupDataSource(column.lookup);

    if (column.calculateCellValue !== column.defaultCalculateCellValue) {
      return lookupDataSourceOptions;
    }

    const hasGroupPaging = dataSource.remoteOperations().groupPaging;
    const hasLookupOptimization = column.displayField && isString(column.displayField);

    let cachedUniqueRelevantItems;
    let previousTake;
    let previousSkip;

    const sliceItems = (items, loadOptions) => {
      const start = loadOptions.skip ?? 0;
      const end = loadOptions.take ? start + loadOptions.take : items.length;
      return items.slice(start, end);
    };

    const loadUniqueRelevantItems = (loadOptions) => {
      const group = normalizeGroupingLoadOptions(
        hasLookupOptimization ? [column.dataField, column.displayField] : column.dataField,
      );
      // @ts-expect-error
      const d = new Deferred();

      const canUseCache = cachedUniqueRelevantItems && (
        !hasGroupPaging
        || (loadOptions.skip === previousSkip && loadOptions.take === previousTake)
      );

      if (canUseCache) {
        d.resolve(sliceItems(cachedUniqueRelevantItems, loadOptions));
      } else {
        previousSkip = loadOptions.skip;
        previousTake = loadOptions.take;
        dataSource.load({
          filter,
          group,
          take: hasGroupPaging ? loadOptions.take : undefined,
          skip: hasGroupPaging ? loadOptions.skip : undefined,
        }).done((items) => {
          cachedUniqueRelevantItems = items;
          d.resolve(hasGroupPaging ? items : sliceItems(items, loadOptions));
        }).fail(d.fail);
      }

      return d;
    };

    const lookupDataSource = {
      ...lookupDataSourceOptions,
      __dataGridSourceFilter: filter,
      load: (loadOptions) => {
        // @ts-expect-error
        const d = new Deferred();
        loadUniqueRelevantItems(loadOptions).done((items) => {
          if (items.length === 0) {
            d.resolve([]);
            return;
          }

          const filter = this.combineFilters(
            items.flatMap((data) => data.key).map((key) => [
              column.lookup.valueExpr, key,
            ]),
            'or',
          );

          const newDataSource = new DataSource({
            ...lookupDataSourceOptions,
            ...loadOptions,
            filter: this.combineFilters([filter, loadOptions.filter], 'and'),
            paginate: false, // pagination is included to filter
          });

          newDataSource
            .load()
            .done(d.resolve)
            .fail(d.fail);
        }).fail(d.fail);
        return d;
      },
      key: column.lookup.valueExpr,
      byKey(key) {
        const d = Deferred();
        this.load({
          filter: [column.lookup.valueExpr, '=', key],
        }).done((arr) => {
          d.resolve(arr[0]);
        });

        return d.promise();
      },
    };

    return lookupDataSource;
  },

  logHeaderFilterDeprecatedWarningIfNeed(component) {
    const since = '23.1';
    const logWarning = component._logDeprecatedOptionWarning.bind(component);

    if (isDefined(component.option('headerFilter.allowSearch'))) {
      logWarning('headerFilter.allowSearch', { since, alias: 'headerFilter.search.enabled' });
    }

    if (isDefined(component.option('headerFilter.searchTimeout'))) {
      logWarning('headerFilter.searchTimeout', { since, alias: 'headerFilter.search.timeout' });
    }

    const specificName = component.NAME === 'dxPivotGrid' ? 'dataSource.fields' : 'columns';
    const columns = component.option(specificName);

    if (!Array.isArray(columns)) {
      return;
    }

    const logSpecificDeprecatedWarningIfNeed = (columns) => {
      columns.forEach((column) => {
        const headerFilter = column.headerFilter || {};

        if (isDefined(headerFilter.allowSearch)) {
          logWarning(`${specificName}[].headerFilter.allowSearch`, { since, alias: `${specificName}[].headerFilter.search.enabled` });
        }

        if (isDefined(headerFilter.searchMode)) {
          logWarning(`${specificName}[].headerFilter.searchMode`, { since, alias: `${specificName}[].headerFilter.search.mode` });
        }

        if (column.columns?.length) {
          logSpecificDeprecatedWarningIfNeed(column.columns);
        }
      });
    };

    logSpecificDeprecatedWarningIfNeed(columns);
  },

  getComponentBorderWidth(that, $rowsViewElement) {
    const borderWidth = that.option('showBorders')
      ? Math.ceil(getOuterWidth($rowsViewElement) - getInnerWidth($rowsViewElement))
      : 0;

    return borderWidth;
  },

  isCustomCommandColumn(columns, commandColumn): boolean {
    const customCommandColumns = columns
      .filter((column) => column.type === commandColumn.type);

    return !!customCommandColumns.length;
  },
};
