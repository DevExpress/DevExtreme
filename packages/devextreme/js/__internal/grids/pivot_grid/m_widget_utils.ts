import localizationDate from '@js/common/core/localization/date';
import ArrayStore from '@js/common/data/array_store';
import { DataSource } from '@js/common/data/data_source/data_source';
import type { ScalarFilterValue } from '@js/common/grids';
import domAdapter from '@js/core/dom_adapter';
import coreAjaxUtils from '@js/core/utils/ajax';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isNumeric, type } from '@js/core/utils/type';
import formatHelper from '@js/format_helper';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';
import type { AjaxRequestOptions } from '@ts/core/utils/ajax_utils';
import { callOnce } from '@ts/core/utils/call_once';
import { compileGetter } from '@ts/core/utils/data';
import type { StoreLoadOptions } from '@ts/data/abstract_store';

import { CLASSES } from './const';
import type {
  DiscoveredField,
  DrillDownStore,
  ExpandedLevelOptions,
  ForeachTree,
  PathItem,
  PivotGridAxis,
  PivotGridField,
  PivotGridFilterField,
} from './types';

const setFieldProperty = function setFieldProperty(
  field: PivotGridField,
  property: string,
  value: unknown,
  isInitialization?: boolean,
): void {
  field._initProperties ??= {};
  const initProperties = field._initProperties;
  const initValue = isInitialization ? value : field[property];

  const needInitProperty = !Object.prototype.hasOwnProperty.call(initProperties, property)
    || isInitialization;

  if (needInitProperty && property !== '_initProperties') {
    initProperties[property] = initValue;
  }

  field[property] = value;
};

function sendRequest(options: AjaxRequestOptions): DeferredObj<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Ajax.sendRequest() returns any
  return coreAjaxUtils.sendRequest(options);
}

let foreachTreeAsyncDate = new Date();

function createForeachTreeFunc(isAsync: boolean): ForeachTree {
  const foreachTreeFunc: ForeachTree = function foreachTreeFunc(
    items,
    callback,
    parentAtFirst?,
    members?,
    index?,
    isChildrenProcessing?,
  ) {
    const currentMembers = members || [];
    const currentItems = items || [];
    const startIndex = index || 0;
    let isProcessingChildren = isChildrenProcessing;

    function createForeachTreeAsyncHandler(
      deferred: DeferredObj<unknown>,
      itemIndex: number,
      childrenProcessing: boolean,
    ): void {
      when(foreachTreeFunc(
        currentItems,
        callback,
        parentAtFirst,
        currentMembers,
        itemIndex,
        childrenProcessing,
      ))
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .done(deferred.resolve);
    }

    for (let i = startIndex; i < currentItems.length; i += 1) {
      if (isAsync
        && i > startIndex
        && i % 10000 === 0
        && (new Date().getTime() - foreachTreeAsyncDate.getTime() >= 300)
      ) {
        foreachTreeAsyncDate = new Date();
        const deferred = Deferred();
        createForeachTreeAsyncHandler(deferred, i, false);

        return deferred;
      }

      const item = currentItems[i];

      if (!isProcessingChildren) {
        currentMembers.unshift(item);

        if (parentAtFirst && callback(currentMembers, i) === false) {
          return undefined;
        }

        const childrenDeferred = item.children
          && foreachTreeFunc(item.children, callback, parentAtFirst, currentMembers);
        if (isAsync && childrenDeferred) {
          const deferred = Deferred<unknown>();
          // @ts-expect-error done() gets the handler's result, undefined
          childrenDeferred.done(createForeachTreeAsyncHandler(deferred, i, true));
          return deferred;
        }
      }

      isProcessingChildren = false;

      if (!parentAtFirst && callback(currentMembers, i) === false) {
        return undefined;
      }

      currentMembers.shift();

      if (currentItems[i] !== item) {
        i -= 1;
      }
    }

    return undefined;
  };
  return foreachTreeFunc;
}

const foreachTree = createForeachTreeFunc(false);
const foreachTreeAsync = createForeachTreeFunc(true);

function findField(
  fields: PivotGridField[] | null | undefined,
  id: string | number | undefined,
): number {
  if (fields && isDefined(id)) {
    return fields.findIndex((field) => field.name === id
      || field.caption === id
      || field.dataField === id
      || field.index === id);
  }
  return -1;
}

function formatValue(value: unknown, options: PivotGridField): string {
  // because isNaN function works incorrectly with strings and undefined (T889965)
  // @ts-expect-error format() is typed for numbers, dates and strings
  const valueText = !Number.isNaN(value) && formatHelper.format(value, options.format);
  const formatObject = {
    value,
    valueText: valueText || '',
  };
  return options.customizeText
    // @ts-expect-error customizeText is typed for numbers, dates and strings
    ? options.customizeText.call(options, formatObject)
    : formatObject.valueText;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- for unannotated selectors
function getCompareFunction<TItem = any>(
  valueSelector: (item: TItem) => unknown,
): (a: TItem, b: TItem) => number {
  return function compare(a, b) {
    let result = 0;
    const valueA = valueSelector(a);
    const valueB = valueSelector(b);
    const aIsDefined = isDefined(valueA);
    const bIsDefined = isDefined(valueB);

    if (aIsDefined && bIsDefined) {
      if (valueA > valueB) {
        result = 1;
      } else if (valueA < valueB) {
        result = -1;
      }
    }

    if (aIsDefined && !bIsDefined) {
      result = 1;
    }

    if (!aIsDefined && bIsDefined) {
      result = -1;
    }

    return result;
  };
}

function createPath(items: PathItem[]): unknown[] {
  const result: unknown[] = [];
  for (let i = items.length - 1; i >= 0; i -= 1) {
    result.push(items[i].key || items[i].value);
  }
  return result;
}

function foreachDataLevel<TItem extends object>(
  data: TItem[],
  callback: (items: TItem[], index: number) => void,
  index: number,
  childrenField?: string,
): void {
  const levelIndex = index || 0;
  const childrenFieldName = childrenField || 'children';

  if (data.length) {
    callback(data, levelIndex);
  }

  for (const item of data) {
    if (item[childrenFieldName]?.length) {
      foreachDataLevel(item[childrenFieldName], callback, levelIndex + 1, childrenFieldName);
    }
  }
}

function mergeArraysByMaxValue(values1: number[], values2: number[]): number[] {
  return values1.map((value, i) => Math.max(value || 0, values2[i] || 0));
}

/**
 * @returns Maximum expanded level in the axis
 */
function getExpandedLevel(options: ExpandedLevelOptions, axisName: PivotGridAxis): number {
  const fields = options[axisName];
  const expandedPaths = (axisName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || [];

  let expandedLevel = 0;

  if (options.headerName === axisName) {
    // @ts-expect-error path is set together with headerName
    expandedLevel = options.path.length;
  } else if (options.headerName && options.headerName !== axisName && options.oppositePath) {
    expandedLevel = options.oppositePath.length;
  } else {
    expandedPaths.forEach((path) => {
      expandedLevel = Math.max(expandedLevel, path.length);
    });
  }

  while (fields[expandedLevel + 1] && fields[expandedLevel].expanded) {
    expandedLevel += 1;
  }

  return expandedLevel;
}

function createGroupFields(item: DiscoveredField): DiscoveredField[] {
  return ['year', 'quarter', 'month'].map((value, index) => ({
    ...item,
    groupInterval: value,
    groupIndex: index,
  }));
}

function parseFields(
  dataSource: unknown[],
  fieldsList: Record<string, unknown> | undefined,
  path: string,
  fieldsDataType: Record<string, string | undefined>,
): DiscoveredField[] {
  const result: DiscoveredField[] = [];

  Object.keys(fieldsList ?? []).forEach((field) => {
    if (field?.startsWith('__')) {
      return;
    }

    let dataIndex = 1;
    const currentPath = path.length ? `${path}.${field}` : field;
    let dataType = fieldsDataType[currentPath];
    const getter = compileGetter(currentPath);
    let value = fieldsList?.[field];

    while (!isDefined(value) && dataSource[dataIndex]) {
      value = getter(dataSource[dataIndex]);
      dataIndex += 1;
    }

    if (!dataType && isDefined(value)) {
      dataType = type(value);
    }

    let items: DiscoveredField[] = [{
      dataField: currentPath,
      dataType,
      groupName: dataType === 'date' ? field : undefined,
      groupInterval: undefined,
      displayFolder: path,
    }];

    if (dataType === 'date') {
      items = items.concat(createGroupFields(items[0]));
    } else if (dataType === 'object') {
      // @ts-expect-error type() is not a type guard
      items = parseFields(dataSource, value, currentPath, fieldsDataType);
    }

    result.push(...items);
  });

  return result;
}

function getFieldsDataType(
  fields: PivotGridField[] | undefined,
): Record<string, PivotGridField['dataType']> {
  const result: Record<string, PivotGridField['dataType']> = {};
  fields?.forEach((field) => {
    const dataField = String(field.dataField);
    result[dataField] = result[dataField] ?? field.dataType;
  });
  return result;
}

function discoverObjectFields(
  items: unknown[],
  fields: PivotGridField[] | undefined,
): DiscoveredField[] {
  const fieldsDataType = getFieldsDataType(fields);
  // @ts-expect-error parseFields() reads the first data item as an object
  return parseFields(items, items[0], '', fieldsDataType);
}

const DATE_INTERVAL_FORMATS: Record<string, (value: number) => string | Date | undefined> = {
  year(value) {
    return String(value);
  },
  month(value) {
    return localizationDate.getMonthNames()[value - 1];
  },
  quarter(value) {
    return localizationDate.format(new Date(2000, value * 3 - 1), 'quarter');
  },
  dayOfWeek(value) {
    return localizationDate.getDayNames()[value];
  },
};

function setDefaultFieldValueFormatting(field: PivotGridField): void {
  if (field.dataType === 'date') {
    if (!field.format) {
      const dateIntervalFormat = DATE_INTERVAL_FORMATS[String(field.groupInterval)];
      setFieldProperty(field, 'format', field.groupInterval ? dateIntervalFormat : getGlobalFormatByDataType('date'));
    }
  } else if (field.dataType === 'number') {
    const groupInterval = isNumeric(field.groupInterval)
      && field.groupInterval > 0
      && field.groupInterval;

    if (groupInterval && !field.customizeText) {
      setFieldProperty(field, 'customizeText', (formatObject) => {
        const secondValue = formatObject.value + groupInterval;
        const secondValueText = formatHelper.format(secondValue, field.format);

        return formatObject.valueText && secondValueText ? `${formatObject.valueText} - ${secondValueText}` : '';
      });
    }
  }
}

function getFiltersByPath(
  fields: PivotGridField[],
  path: ScalarFilterValue[] = [],
): PivotGridFilterField[] {
  return path.map((value, i) => extend({}, fields[i], {
    groupIndex: null,
    groupName: null,
    filterType: 'include',
    filterValues: [value],
  }));
}

const storeDrillDownMixin = {
  createDrillDownDataSource(
    this: DrillDownStore,
    descriptions: unknown,
    params: unknown,
  ): DataSource {
    const items = this.getDrillDownItems(descriptions, params);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- never assigned
    let arrayStore: ArrayStore | undefined;

    function createCustomStoreMethod(
      methodName: 'load' | 'totalCount',
    ): (
      options: StoreLoadOptions,
    ) => DeferredObj<unknown> {
      return function customStoreMethod(options) {
        // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
        let d: DeferredObj<unknown>;

        if (arrayStore) {
          d = arrayStore[methodName](options);
        } else {
          d = Deferred<unknown>();
          when(items).done((data) => {
            const dataStore = new ArrayStore(data);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
            dataStore[methodName](options).done(d.resolve).fail(d.reject);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          }).fail(d.reject);
        }

        return d;
      };
    }

    const dataSource = new DataSource({
      load: createCustomStoreMethod('load'),
      totalCount: createCustomStoreMethod('totalCount'),
      key: this.key(),
    });

    return dataSource;
  },
};

const getScrollbarWidth = (
  containerElement: HTMLElement,
): number => containerElement.offsetWidth - containerElement.clientWidth;

const calculateScrollbarWidth = callOnce(() => {
  const document = domAdapter.getDocument();

  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="${CLASSES.scrollBarMeasureElement}"></div>`,
  );

  const scrollbar = document.body.lastElementChild as HTMLElement;
  const scrollbarWidth = getScrollbarWidth(scrollbar);

  if (scrollbar) {
    document.body.removeChild(scrollbar);
  }

  return scrollbarWidth;
});

export default {
  setFieldProperty,
  sendRequest,
  foreachTree,
  foreachTreeAsync,
  findField,
  formatValue,
  getCompareFunction,
  createPath,
  foreachDataLevel,
  mergeArraysByMaxValue,
  getExpandedLevel,
  discoverObjectFields,
  getFieldsDataType,
  setDefaultFieldValueFormatting,
  getFiltersByPath,
  storeDrillDownMixin,
  getScrollbarWidth,
  calculateScrollbarWidth,
};

export {
  calculateScrollbarWidth,
  createPath,
  discoverObjectFields,
  findField,
  foreachDataLevel,
  foreachTree,
  foreachTreeAsync,
  formatValue,
  getCompareFunction,
  getExpandedLevel,
  getFieldsDataType,
  getFiltersByPath,
  getScrollbarWidth,
  mergeArraysByMaxValue,
  sendRequest,
  setDefaultFieldValueFormatting,
  setFieldProperty,
  storeDrillDownMixin,
};
