// NOTE: This code moved from old grid_core/header_filter/m_header_filter
// with minimal possible modifications
/* eslint-disable
   @typescript-eslint/explicit-function-return-type,
   @typescript-eslint/no-unsafe-return,
   @typescript-eslint/naming-convention,
   no-plusplus,
   @typescript-eslint/init-declarations,
   no-param-reassign,
   prefer-destructuring,
   @typescript-eslint/explicit-module-boundary-types,
   @typescript-eslint/no-explicit-any,
*/
import { Deferred } from '@js/core/utils/deferred';
import { isDefined, isFunction, isObject } from '@js/core/utils/type';
import messageLocalization from '@js/localization/message';
import filteringUtils from '@js/ui/shared/filtering';
import { extend } from '@ts/core/utils/m_extend';
import { normalizeDataSourceOptions as oldNormalizeDataSourceOptions } from '@ts/data/data_source/m_utils';
import {
  convertDataFromUTCToLocal,
  getFormatOptions,
  isUTCFormat,
} from '@ts/grids/grid_core/header_filter/m_header_filter';
import { updateHeaderFilterItemSelectionState } from '@ts/grids/grid_core/header_filter/m_header_filter_core';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';

import type { HeaderFilterListType } from './types';

export const getHeaderItemText = (
  displayValue,
  column,
  currentLevel,
  // NOTE: Only text used from header filter options
  headerFilterOptions,
) => {
  let text = gridCoreUtils
    .formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));

  if (!text) {
    text = headerFilterOptions?.texts?.emptyValue
      ?? messageLocalization.format('dxDataGrid-headerFilterEmptyValue');
  }

  return text;
};

const _updateSelectedState = (
  items,
  column,
) => {
  let i = items.length;
  const isExclude = column.filterType === 'exclude';

  while (i--) {
    const item = items[i];

    if ('items' in items[i]) {
      _updateSelectedState(items[i].items, column);
    }

    updateHeaderFilterItemSelectionState(
      item,
      gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1,
      isExclude,
    );
  }
};

const _normalizeGroupItem = (
  item,
  currentLevel,
  options,
) => {
  let value;
  let displayValue;
  const { path } = options;
  const { valueSelector } = options;
  const { displaySelector } = options;
  const { column } = options;

  if (valueSelector && displaySelector) {
    value = valueSelector(item);
    displayValue = displaySelector(item);
  } else {
    value = item.key;
    displayValue = value;
  }

  if (!isObject(item)) {
    item = {};
  } else {
    item = extend({}, item);
  }

  path.push(value);

  if (path.length === 1) {
    // NOTE: Important! Deconstructing here causes a lot of failed usage scenarios.

    item.value = path[0];
  } else {
    item.value = path.join('/');
  }

  item.text = getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);

  return item;
};

const _processGroupItems = (
  groupItems,
  currentLevel,
  path,
  options,
) => {
  const { level } = options;

  path = path || [];
  currentLevel = currentLevel || 0;

  for (let i = 0; i < groupItems.length; i++) {
    groupItems[i] = _normalizeGroupItem(groupItems[i], currentLevel, {
      column: options.column,
      headerFilterOptions: options.headerFilterOptions,
      path,
    });

    if ('items' in groupItems[i]) {
      if (currentLevel === level || !isDefined(groupItems[i].value)) {
        delete groupItems[i].items;
      } else {
        _processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
      }
    }

    path.pop();
  }
};

export const getDataSourceOptions = (
  storeLoadAdapter,
  popupOptions,
  headerFilterOptions,
  filter,
) => {
  const { column } = popupOptions;

  if (!storeLoadAdapter) {
    return undefined;
  }

  const { grouping: localGrouping } = storeLoadAdapter.getLocalLoadOperations();
  const remoteGrouping = !localGrouping;
  const group = gridCoreUtils.getHeaderFilterGroupParameters(column, remoteGrouping);
  const headerFilterDataSource = column.headerFilter?.dataSource;
  const options: any = {};

  if (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
    // @ts-expect-error
    options.dataSource = oldNormalizeDataSourceOptions(headerFilterDataSource);
  } else {
    const cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;

    options.dataSource = {
      filter,
      group,
      useDefaultSearch: true,
      load: (loadOptions) => {
        // @ts-expect-error Deferred ctor.
        const d = new Deferred();
        // NOTE: this marked as deprecated in original code
        loadOptions.dataField = column.dataField || column.name;
        storeLoadAdapter.load(loadOptions).done((data) => {
          const convertUTCDates = remoteGrouping
              && isUTCFormat(column.serializationFormat)
              && cutoffLevel > 3;

          if (convertUTCDates) {
            data = convertDataFromUTCToLocal(data, column);
          }

          _processGroupItems(data, null, null, {
            level: cutoffLevel,
            column,
            headerFilterOptions,
          });

          d.resolve(data);
        }).fail(d.reject);

        return d;
      },
    };
  }

  if (isFunction(headerFilterDataSource)) {
    headerFilterDataSource.call(column, options);
  }

  const origPostProcess = options.dataSource.postProcess;
  options.dataSource.postProcess = (data) => {
    let items = data;

    items = origPostProcess?.call(this, items) || items;
    _updateSelectedState(items, {
      ...column,
      filterType: popupOptions.filterType,
      filterValues: popupOptions.filterValues,
    });
    return items;
  };

  return options.dataSource;
};

export const getHeaderFilterListType = (
  column: Column,
): HeaderFilterListType => {
  const groupInterval = filteringUtils.getGroupInterval(column);
  return groupInterval && groupInterval.length > 1 ? 'tree' : 'list';
};
