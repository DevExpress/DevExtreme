import type { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import type { ScalarFilterValue } from '@js/common/grids';
import { EventsStrategy } from '@js/core/events_strategy';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import {
  isDefined, isFunction, isNumeric, isPlainObject,
  isString,
} from '@js/core/utils/type';
import Store from '@js/data/abstract_store';
import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import type { EventHandler } from '@ts/core/events_strategy';
import { normalizeIndexes } from '@ts/core/utils/array';
import type { AsyncTask } from '@ts/core/utils/common';
import commonUtils from '@ts/core/utils/common';
import { extend } from '@ts/core/utils/extend';
import inflector from '@ts/core/utils/inflector';
import { each } from '@ts/core/utils/iterator';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type {
  DrillDownParams,
  PivotGridAxis,
  PivotGridDescriptions,
  PivotGridField,
  PivotGridLoadOptions,
  PivotGridLoadResult,
  PivotGridPreparedField,
  PivotGridStore,
} from '@ts/grids/pivot_grid/types';

import { LocalStore } from '../local_store/local_store';
import { RemoteStore } from '../remote_store/remote_store';
import summaryUtils from '../summary_display_modes/summary_display_modes';
import {
  createPath,
  findField,
  foreachTree,
  foreachTreeAsync,
  formatValue,
  getFieldsDataType,
  setFieldProperty,
} from '../widget_utils';
import xmlaStore from '../xmla_store/xmla_store';
import { sort } from './data_source_utils';
import type {
  DataSourceData,
  DataSourceEventName,
  DataSourceHeaderArea,
  DataSourceHeaderItem,
  DataSourceHeaderItems,
  DataSourceHeaderItemsByPath,
  DataSourceLoadOptions,
  DataSourceOptions,
  DataSourceState,
  DataSourceStoreLoadOptions,
  DataSourceStoreOption,
} from './types';

const DESCRIPTION_NAME_BY_AREA = {
  row: 'rows',
  column: 'columns',
  data: 'values',
  filter: 'filters',
} as const;
const STATE_PROPERTIES = [
  'area',
  'areaIndex',
  'sortOrder',
  'filterType',
  'filterValues',
  'sortBy',
  'sortBySummaryField',
  'sortBySummaryPath',
  'expanded',
  'summaryType',
  'summaryDisplayMode',
];
const CALCULATED_PROPERTIES = [
  'format',
  'selector',
  'customizeText',
  'caption',
];
const ALL_CALCULATED_PROPERTIES = CALCULATED_PROPERTIES
  .concat(['allowSorting', 'allowSortingBySummary', 'allowFiltering', 'allowExpandAll']);

function createCaption(field: PivotGridField): string {
  let caption = field.dataField || field.groupName || '';
  let summaryType = (field.summaryType ?? '').toLowerCase();

  if (isString(field.groupInterval)) {
    caption += `_${field.groupInterval}`;
  }

  if (summaryType && summaryType !== 'custom') {
    summaryType = summaryType.replace(/^./, summaryType[0].toUpperCase());
    if (caption.length) {
      summaryType = ` (${summaryType})`;
    }
  } else {
    summaryType = '';
  }

  return inflector.titleize(caption) + summaryType;
}

function resetFieldState(field: PivotGridField, properties: string[]): void {
  const initialProperties = field._initProperties ?? {};

  properties.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(initialProperties, prop)) {
      field[prop] = initialProperties[prop];
    }
  });
}

function updateCalculatedFieldProperties(
  field: PivotGridField,
  calculatedProperties: string[],
): void {
  resetFieldState(field, calculatedProperties);
  if (!isDefined(field.caption)) {
    setFieldProperty(field, 'caption', createCaption(field));
  }
}

function areExpressionsUsed(dataFields: PivotGridField[]): boolean {
  return dataFields.some((field) => field.summaryDisplayMode || field.calculateSummaryValue);
}

function isRunningTotalUsed(dataFields: PivotGridField[]): boolean {
  return dataFields.some((field) => !!field.runningTotal);
}

function isDataExists(data: DataSourceData): number {
  return data.rows.length || data.columns.length || data.values.length;
}

function isPivotGridStore(store: DataSourceStoreOption): store is PivotGridStore {
  return isFunction(store.load) && isFunction(store.getFields);
}

class PivotGridDataSource {
  public _eventsStrategy: EventsStrategy;

  public _store: PivotGridStore | undefined;

  public _paginate: boolean;

  public _pageSize: number;

  public _data: DataSourceData;

  public _loadingCount: number;

  public _isFieldsModified: boolean;

  public _fields: PivotGridField[];

  public _descriptions: PivotGridDescriptions | undefined;

  public _lastLoadOptions?: PivotGridLoadOptions;

  public _retrieveFields: boolean;

  public _storeFields?: PivotGridField[];

  public _delayedLoadTask?: AsyncTask;

  public _isDisposed?: boolean;

  constructor(dataSourceOptions?: DataSourceOptions) {
    const options = dataSourceOptions ?? {};
    this._eventsStrategy = new EventsStrategy(this);

    const store = this.createStore(options, (progress) => {
      this._eventsStrategy.fireEvent('progressChanged', [progress]);
    });

    this._store = store;
    this._paginate = !!options.paginate;
    this._pageSize = options.pageSize || 40;
    this._data = { rows: [], columns: [], values: [] };
    this._loadingCount = 0;

    this._isFieldsModified = false;

    ([
      'changed',
      'loadError',
      'loadingChanged',
      'progressChanged',
      'fieldsPrepared',
      'expandValueChanging',
    ] as const).forEach((eventName) => {
      const optionName = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
      if (Object.prototype.hasOwnProperty.call(options, optionName)) {
        this.on(eventName, options[optionName]);
      }
    });

    this._retrieveFields = options.retrieveFields ?? true;

    this._fields = options.fields ?? [];
    this._descriptions = options.descriptions
      ? extend(this._createDescriptions(), options.descriptions)
      : undefined;

    if (!store) {
      // TODO create dashboard store
      extend(true, this._data, options.store ?? options);
    }
  }

  public updateCalculatedFieldProperties(
    field: PivotGridField,
    calculatedProperties: string[],
  ): void {
    updateCalculatedFieldProperties(field, calculatedProperties);
  }

  public findHeaderItem(
    headerItems: DataSourceHeaderItems,
    path: unknown[],
  ): DataSourceHeaderItem | null | undefined {
    if (headerItems._cacheByPath) {
      return headerItems._cacheByPath[path.join('.')] ?? null;
    }

    return undefined;
  }

  public getHeaderItemsLastIndex(
    headerItems: DataSourceHeaderItem[] | undefined,
    grandTotalIndex?: number,
  ): number {
    let lastIndex = -1;

    if (headerItems) {
      for (const headerItem of headerItems) {
        if (headerItem.index !== undefined) {
          lastIndex = Math.max(lastIndex, headerItem.index);
        }
        if (headerItem.children) {
          lastIndex = Math.max(lastIndex, this.getHeaderItemsLastIndex(headerItem.children));
        } else if (headerItem.collapsedChildren) {
          // B232736
          lastIndex = Math.max(
            lastIndex,
            this.getHeaderItemsLastIndex(headerItem.collapsedChildren),
          );
        }
      }
    }
    if (isDefined(grandTotalIndex)) {
      lastIndex = Math.max(lastIndex, grandTotalIndex);
    }
    return lastIndex;
  }

  public updateHeaderItemChildren(
    headerItems: DataSourceHeaderItem[],
    headerItem: DataSourceHeaderItem,
    children: DataSourceHeaderItem[],
    grandTotalIndex: number | undefined,
  ): DeferredObj<number[]> {
    const applyingHeaderItemsCount = this.getHeaderItemsLastIndex(children) + 1;
    let emptyIndex = this.getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;
    const applyingItemIndexesToCurrent: number[] = [];
    let needIndexUpdate = false;
    const d = Deferred<number[]>();

    if (headerItem.children?.length === children.length) {
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        const currentChild = headerItem.children[i];
        if (child.index !== undefined && currentChild.index === undefined) {
          applyingItemIndexesToCurrent[child.index] = emptyIndex;
          child.index = emptyIndex;
          emptyIndex += 1;
          headerItem.children[i] = child;
        } else if (child.index !== undefined && currentChild.index !== undefined) {
          applyingItemIndexesToCurrent[child.index] = currentChild.index;
        }
      }
    } else {
      needIndexUpdate = true;
      for (let index = 0; index < applyingHeaderItemsCount; index += 1) {
        applyingItemIndexesToCurrent[index] = emptyIndex;
        emptyIndex += 1;
      }
      headerItem.children = children;
    }

    when(foreachTreeAsync(headerItem.children, (items) => {
      if (needIndexUpdate) {
        items[0].index = applyingItemIndexesToCurrent[items[0].index];
      }
    })).done(() => {
      d.resolve(applyingItemIndexesToCurrent);
    });
    return d;
  }

  public updateHeaderItems(
    headerItems: DataSourceHeaderItems,
    newHeaderItems: DataSourceHeaderItem[],
    grandTotalIndex: number | undefined,
  ): DeferredObj<number[]> {
    const d = Deferred<number[]>();
    let emptyIndex = grandTotalIndex !== undefined
      && grandTotalIndex >= 0
      && this.getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;

    const applyingItemIndexesToCurrent: number[] = [];

    // reset cache
    when(foreachTreeAsync(headerItems, (items) => {
      delete items[0].collapsedChildren;
    })).done(() => {
      when(foreachTreeAsync(newHeaderItems, (newItems, index) => {
        const newItem = newItems[0];
        if (newItem.index !== undefined && newItem.index >= 0) {
          let headerItem = this.findHeaderItem(headerItems, createPath(newItems));
          if (headerItem?.index !== undefined && headerItem.index >= 0) {
            applyingItemIndexesToCurrent[newItem.index] = headerItem.index;
          } else if (emptyIndex) {
            const path = createPath(newItems.slice(1));
            headerItem = this.findHeaderItem(headerItems, path);

            const parentItems = path.length ? headerItem?.children : headerItems;
            if (parentItems) {
              parentItems[index] = newItem;
              applyingItemIndexesToCurrent[newItem.index] = emptyIndex;
              newItem.index = emptyIndex;
              emptyIndex += 1;
            }
          }
        }
      })).done(() => {
        d.resolve(applyingItemIndexesToCurrent);
      });
    });

    return d;
  }

  public updateDataSourceCells(
    dataSource: DataSourceData,
    newDataSourceCells: DataSourceData['values'] | undefined,
    newRowItemIndexesToCurrent: number[],
    newColumnItemIndexesToCurrent: number[],
  ): void {
    const dataSourceCells = dataSource.values;

    if (!newDataSourceCells) {
      return;
    }

    for (let newRowIndex = 0; newRowIndex < newDataSourceCells.length; newRowIndex += 1) {
      const newRowCells = newDataSourceCells[newRowIndex];
      const rowIndex = newRowItemIndexesToCurrent[newRowIndex] ?? dataSource.grandTotalRowIndex;

      if (newRowCells && isDefined(rowIndex)) {
        dataSourceCells[rowIndex] ??= [];

        newRowCells.forEach((newCell, newColumnIndex) => {
          const columnIndex = newColumnItemIndexesToCurrent[newColumnIndex]
            ?? dataSource.grandTotalColumnIndex;

          if (isDefined(newCell) && isDefined(columnIndex)) {
            dataSourceCells[rowIndex][columnIndex] = newCell;
          }
        });
      }
    }
  }

  public createLocalOrRemoteStore(
    dataSourceOptions: DataSourceOptions,
    notifyProgress: (progress: number) => void,
  ): PivotGridStore {
    const StoreConstructor = dataSourceOptions.remoteOperations
      || dataSourceOptions.paginate ? RemoteStore : LocalStore;
    const store: LocalStore | RemoteStore = new StoreConstructor(extend(
      normalizeDataSourceOptions(dataSourceOptions),
      {
        onChanged: null,
        onLoadingChanged: null,
        onProgressChanged: notifyProgress,
      },
    ));

    // @ts-expect-error createDrillDownDataSource comes from storeDrillDownMixin
    return store;
  }

  public createStore(
    dataSourceOptions: DataSourceOptions,
    notifyProgress: (progress: number) => void,
  ): PivotGridStore | undefined {
    if (isPlainObject(dataSourceOptions) && dataSourceOptions.load) {
      return this.createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
    }

    // TODO remove
    const options = dataSourceOptions && !dataSourceOptions.store
      ? { store: dataSourceOptions }
      : dataSourceOptions;
    // @ts-expect-error the store option is set here and can be any store config
    const storeOptions: DataSourceStoreOption = options.store;

    if (storeOptions.type === 'xmla') {
      // @ts-expect-error createDrillDownDataSource comes from storeDrillDownMixin
      return new xmlaStore.XmlaStore(storeOptions);
    }
    if ((isPlainObject(storeOptions) && storeOptions.type)
      || (storeOptions instanceof Store)
      || Array.isArray(storeOptions)) {
      return this.createLocalOrRemoteStore(options, notifyProgress);
    }
    if (isPivotGridStore(storeOptions)) {
      return storeOptions;
    }

    return undefined;
  }

  public equalFields(
    fields: PivotGridField[],
    prevFields: PivotGridField[],
    count: number,
  ): boolean {
    for (let i = 0; i < count; i += 1) {
      if (!fields[i] || !prevFields[i] || fields[i].index !== prevFields[i].index) {
        return false;
      }
    }

    return true;
  }

  public getExpandedPaths(
    dataSource: DataSourceData,
    loadOptions: PivotGridLoadOptions | undefined,
    dimensionName: PivotGridAxis,
    prevLoadOptions: PivotGridLoadOptions | undefined,
  ): ScalarFilterValue[][] {
    const result: ScalarFilterValue[][] = [];
    const fields = loadOptions?.[dimensionName] ?? [];
    const prevFields = prevLoadOptions?.[dimensionName] ?? [];

    foreachTree(dataSource[dimensionName], (items) => {
      const item = items[0];
      const path = createPath(items);

      if (item.children && fields[path.length - 1] && !fields[path.length - 1].expanded) {
        if (path.length < fields.length
          && (!prevLoadOptions || this.equalFields(fields, prevFields, path.length))) {
          // @ts-expect-error a header item value is a filter value
          result.push(path.slice());
        }
      }
    }, true);
    return result;
  }

  public setFieldProperties(
    field: PivotGridField,
    srcField: PivotGridField | undefined,
    skipInitPropertySave: boolean,
    properties: string[],
  ): PivotGridField {
    if (srcField) {
      properties.forEach((name) => {
        if (skipInitPropertySave) {
          field[name] = srcField[name];
        } else {
          if ((name === 'summaryType' || name === 'summaryDisplayMode') && srcField[name] === undefined) {
            // T399271
            return;
          }

          setFieldProperty(field, name, srcField[name]);
        }
      });
    } else {
      resetFieldState(field, properties);
    }

    return field;
  }

  public getFieldsState(fields: PivotGridField[], properties: string[]): PivotGridField[] {
    return fields.map((field) => this.setFieldProperties({
      dataField: field.dataField,
      name: field.name,
    }, field, true, properties));
  }

  public getFieldStateId(field: PivotGridField): string {
    if (field.name) {
      return field.name;
    }
    return `${field.dataField}`;
  }

  public getFieldsById(fields: PivotGridField[] | undefined, id: string): PivotGridField[] {
    return (fields ?? []).filter((field) => this.getFieldStateId(field) === id);
  }

  public setFieldsStateCore(
    stateFields: PivotGridField[] | undefined,
    fields: PivotGridField[],
  ): PivotGridField[] {
    const fieldsState = stateFields ?? [];

    fields.forEach((field, index) => {
      this.setFieldProperties(field, fieldsState[index], false, STATE_PROPERTIES);
      this.updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);
    });
    return fields;
  }

  public setFieldsState(
    stateFields: PivotGridField[] | undefined,
    fields: PivotGridField[],
  ): PivotGridField[] {
    const fieldsState = stateFields ?? [];
    const fieldsById: Record<string, PivotGridField[]> = {};

    fields.forEach((field) => {
      const id = this.getFieldStateId(field);
      if (!fieldsById[id]) {
        fieldsById[id] = this.getFieldsById(fields, this.getFieldStateId(field));
      }
    });

    Object.entries(fieldsById).forEach(([id, fieldsWithId]) => {
      this.setFieldsStateCore(this.getFieldsById(fieldsState, id), fieldsWithId);
    });

    return fields;
  }

  public getFieldsByGroup(
    fields: PivotGridField[],
    groupingField: PivotGridField,
  ): PivotGridField[] {
    return fields
      .filter((field) => field.groupName === groupingField.groupName
        && isNumeric(field.groupIndex)
        && field.visible !== false)
      .map((field) => extend(field, {
        areaIndex: groupingField.areaIndex,
        area: groupingField.area,
        expanded: field.expanded ?? groupingField.expanded,
        dataField: field.dataField || groupingField.dataField,
        dataType: field.dataType || groupingField.dataType,
        sortBy: field.sortBy || groupingField.sortBy,
        sortOrder: field.sortOrder || groupingField.sortOrder,
        sortBySummaryField: field.sortBySummaryField || groupingField.sortBySummaryField,
        sortBySummaryPath: field.sortBySummaryPath ?? groupingField.sortBySummaryPath,
        visible: field.visible || groupingField.visible,
        showTotals: field.showTotals ?? groupingField.showTotals,
        showGrandTotals: field.showGrandTotals ?? groupingField.showGrandTotals,
      })).sort((a, b) => Number(a.groupIndex) - Number(b.groupIndex));
  }

  public sortFieldsByAreaIndex(fields: PivotGridField[]): void {
    fields
      .sort((field1, field2) => Number(field1.areaIndex) - Number(field2.areaIndex)
        || Number(field1.groupIndex) - Number(field2.groupIndex));
  }

  public isAreaField(field: PivotGridField, area: PivotGridArea | undefined): boolean {
    const canAddFieldInArea = area === 'data' || field.visible !== false;
    return field.area === area && !isDefined(field.groupIndex) && canAddFieldInArea;
  }

  public getFieldId(field: PivotGridField, retrieveFieldsOptionValue: boolean): string {
    const groupName = field.groupName ?? '';

    return (field.dataField || groupName)
      + (field.groupInterval ? groupName + field.groupInterval : 'NOGROUP')
      + (retrieveFieldsOptionValue ? '' : groupName);
  }

  public mergeFields(
    fields: PivotGridField[],
    storeFields: PivotGridField[] | undefined,
    retrieveFieldsOptionValue: boolean,
  ): PivotGridField[] {
    if (!storeFields) {
      this.assignGroupIndexes(fields);

      return fields;
    }

    const result: PivotGridField[] = [];
    const fieldsDictionary: Record<string, PivotGridField> = {};
    const removedFields: Record<string, PivotGridField | undefined> = {};
    const dataTypes = getFieldsDataType(fields);

    storeFields.forEach((field) => {
      fieldsDictionary[this.getFieldId(field, retrieveFieldsOptionValue)] = field;
    });

    fields.forEach((field) => {
      const fieldKey = this.getFieldId(field, retrieveFieldsOptionValue);
      const storeField = fieldsDictionary[fieldKey] || removedFields[fieldKey];

      if (storeField?._initProperties) {
        resetFieldState(storeField, ALL_CALCULATED_PROPERTIES);
      }
      const mergedField = storeField
        ? extend({}, storeField, field, { _initProperties: null })
        : field;

      if (!mergedField.dataType && dataTypes[String(field.dataField)]) {
        mergedField.dataType = dataTypes[String(field.dataField)];
      }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete fieldsDictionary[fieldKey];
      removedFields[fieldKey] = storeField;

      result.push(mergedField);
    });

    if (retrieveFieldsOptionValue) {
      Object.values(fieldsDictionary).forEach((field) => {
        result.push(field);
      });
    }

    this.assignGroupIndexes(result);

    return result;
  }

  public assignGroupIndexes(fields: PivotGridField[]): void {
    fields.forEach((field) => {
      if (field.groupName && field.groupInterval && field.groupIndex === undefined) {
        const maxGroupIndex = fields
          .filter((f) => f.groupName === field.groupName && isNumeric(f.groupIndex))
          .map((f) => Number(f.groupIndex))
          .reduce((prev, current) => Math.max(prev, current), -1);

        field.groupIndex = maxGroupIndex + 1;
      }
    });
  }

  public getFields(): DeferredObj<PivotGridField[]> {
    const result = Deferred<PivotGridField[]>();
    const storeFields = this._store?.getFields(this._fields);

    when(storeFields).done((discoveredFields) => {
      // @ts-expect-error a discovered field's dataType is wider than a pivot grid field's
      this._storeFields = discoveredFields;
      const mergedFields = this.mergeFields(this._fields, this._storeFields, this._retrieveFields);
      result.resolve(mergedFields);
    // @ts-expect-error fail() gets the error, but is typed with the resolve value
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(result.reject);

    return result;
  }

  public formatHeaderItems(
    data: DataSourceData,
    loadOptions: PivotGridLoadOptions,
    headerName: PivotGridAxis,
  ): DeferredObj<unknown> | undefined {
    return foreachTreeAsync(data[headerName], (items) => {
      const item = items[0];

      item.text = item.text
        || formatValue(item.value, loadOptions[headerName][createPath(items).length - 1]);
    });
  }

  public formatHeaders(
    loadOptions: PivotGridLoadOptions,
    data: DataSourceData,
  ): DeferredObj<unknown> {
    return when(
      this.formatHeaderItems(data, loadOptions, 'columns'),
      this.formatHeaderItems(data, loadOptions, 'rows'),
    );
  }

  public updateCache(headerItems: DataSourceHeaderItems): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    const cacheByPath: DataSourceHeaderItemsByPath = {};

    when(foreachTreeAsync(headerItems, (items) => {
      const path = createPath(items).join('.');
      const [item] = items;
      cacheByPath[path] = item;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    })).done(d.resolve);

    headerItems._cacheByPath = cacheByPath;

    return d;
  }

  public getData(): DataSourceData {
    return this._data;
  }

  public getAreaFields(
    area: PivotGridArea | undefined,
    collectGroups?: boolean,
  ): PivotGridPreparedField[] {
    if (collectGroups || area === 'data') {
      const areaFields: PivotGridPreparedField[] = [];

      this.fields().forEach((field) => {
        if (this.isAreaField(field, area)) {
          areaFields.push(field);
        }
      });
      this.sortFieldsByAreaIndex(areaFields);

      return areaFields;
    }

    const descriptionName = area ? DESCRIPTION_NAME_BY_AREA[area] : undefined;

    // @ts-expect-error a field gets its index in _fieldsPrepared(), on the first load
    return (descriptionName && this._descriptions?.[descriptionName]) ?? [];
  }

  public getSummaryFields(): PivotGridField[] {
    return this.getAreaFields('data').filter((field) => isDefined(field.summaryType));
  }

  public fields(fields?: PivotGridField[]): PivotGridPreparedField[] {
    if (fields) {
      this._fields = this.mergeFields(fields, this._storeFields, this._retrieveFields);
      this._fieldsPrepared(this._fields);
    }

    // @ts-expect-error a field gets its index in _fieldsPrepared(), on the first load
    return this._fields;
  }

  public field(
    id: number | string,
    options?: Partial<PivotGridField>,
  ): PivotGridField | undefined {
    const fields = this._fields;
    const field: PivotGridField | undefined = fields[isNumeric(id) ? id : findField(fields, id)];

    if (field && options) {
      each(options, (optionName, optionValue) => {
        const isInitialization = !STATE_PROPERTIES.includes(optionName);

        setFieldProperty(field, optionName, optionValue, isInitialization);

        if (optionName === 'sortOrder') {
          const levels = field.levels ?? [];
          for (const level of levels) {
            level.sortOrder = options.sortOrder;
          }
        }
      });
      this.updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);

      this._descriptions = this._createDescriptions(field);
      this._isFieldsModified = true;
      this._eventsStrategy.fireEvent('fieldChanged', [field]);
    }
    return field;
  }

  public getFieldValues(
    index: number,
    applyFilters: boolean,
    options: { searchValue?: string; skip?: number; take?: number } | undefined,
  ): DeferredObj<DataSourceHeaderItem[]> {
    const field: PivotGridField | undefined = this._fields[index];
    const store = this._store;
    const loadFields: PivotGridField[] = [];
    const loadOptions: PivotGridLoadOptions = {
      columns: loadFields,
      rows: [],
      values: this.getAreaFields('data'),
      filters: applyFilters
        ? this._fields.filter((f) => f !== field
            && f.area
            && f.filterValues?.length)
        : [],
      skipValues: true,
    };
    const searchValue = options?.searchValue;
    const d = Deferred<DataSourceHeaderItem[]>();

    if (options) {
      loadOptions.columnSkip = options.skip;
      loadOptions.columnTake = options.take;
    }

    if (field && store) {
      (field.levels ?? [field]).forEach((level) => {
        // @ts-expect-error the loaded field resets filterValues and sortBySummaryField to null
        loadFields.push(extend({}, level, {
          expanded: true, filterValues: null, sortOrder: 'asc', sortBySummaryField: null, searchValue,
        }));
      });

      store.load(loadOptions).done((data) => {
        if (loadOptions.columnSkip) {
          data.columns = data.columns.slice(loadOptions.columnSkip);
        }
        if (loadOptions.columnTake) {
          data.columns = data.columns.slice(0, loadOptions.columnTake);
        }
        this.formatHeaders(loadOptions, data);
        if (!loadOptions.columnTake) {
          this._sort(loadOptions, data);
        }
        d.resolve(data.columns);
      // @ts-expect-error fail() gets the error, but is typed with the resolve value
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(d.reject);
    } else {
      d.reject();
    }
    return d;
  }

  public reload(): DeferredObj<DataSourceData> {
    return this.load({ reload: true });
  }

  public filter(): StoreLoadOptions['filter'];
  public filter(...filterExpr: NonNullable<StoreLoadOptions['filter']>[]): void;
  public filter(...args: NonNullable<StoreLoadOptions['filter']>[]): unknown {
    // @ts-expect-error the pivot store isn't checked here
    return this._store.filter(...args);
  }

  public load(options?: DataSourceLoadOptions): DeferredObj<DataSourceData> {
    const d = Deferred<DataSourceData>();
    const loadOptions = options ?? {};

    this.beginLoading();

    d.fail((e) => {
      this._eventsStrategy.fireEvent('loadError', [e]);
    }).always(() => {
      this.endLoading();
    });

    const loadTask = (): void => {
      this._delayedLoadTask = undefined;
      if (!this._descriptions) {
        when(this.getFields()).done((fields) => {
          this._fieldsPrepared(fields);
          this._loadCore(loadOptions, d);
        // @ts-expect-error fail() gets the error, but is typed with the resolve value
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        }).fail(d.reject);
      } else {
        this._loadCore(loadOptions, d);
      }
    };

    if (this.store()) {
      this._delayedLoadTask = commonUtils.executeAsync(loadTask);
    } else {
      loadTask();
    }

    return d;
  }

  public createDrillDownDataSource(params: DrillDownParams): DataSource {
    // @ts-expect-error the pivot store isn't checked here
    return this._store.createDrillDownDataSource(
      this._descriptions,
      params,
    );
  }

  public _createDescriptions(currentField?: PivotGridField): PivotGridDescriptions {
    const fields = this.fields();
    const descriptions: PivotGridDescriptions = {
      rows: [],
      columns: [],
      values: [],
      filters: [],
    };

    (['row', 'column', 'data', 'filter'] as const).forEach((areaName) => {
      normalizeIndexes(this.getAreaFields(areaName, true), 'areaIndex', currentField);
    });

    fields.forEach((field) => {
      const dimension = field.area ? descriptions[DESCRIPTION_NAME_BY_AREA[field.area]] : undefined;
      const { groupName } = field;

      if (groupName && !isNumeric(field.groupIndex)) {
        field.levels = this.getFieldsByGroup(fields, field);
      }

      if (!dimension
        || (groupName && isNumeric(field.groupIndex))
        || (field.visible === false && (field.area !== 'data' && field.area !== 'filter'))) {
        return;
      }

      if (field.levels
          && dimension !== descriptions.filters
          && dimension !== descriptions.values) {
        dimension.push(...field.levels);
        if (field.filterValues?.length) {
          descriptions.filters.push(field);
        }
      } else {
        dimension.push(field);
      }
    });

    Object.values(descriptions).forEach((dimensionFields) => {
      this.sortFieldsByAreaIndex(dimensionFields);
    });

    const indices: Record<number, boolean> = {};
    for (const field of descriptions.values) {
      const expression = field.calculateSummaryValue;
      if (isFunction(expression)) {
        const summaryCell = summaryUtils.createMockSummaryCell(descriptions, fields, indices);
        // @ts-expect-error SummaryCell returns null where dxPivotGridSummaryCell says it does not
        expression(summaryCell);
      }
    }

    return descriptions;
  }

  public _fieldsPrepared(fields: PivotGridField[]): void {
    this._fields = fields;
    fields.forEach((field, index) => {
      field.index = index;
      this.updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES);
    });

    const currentFieldState = this.getFieldsState(fields, ['caption']);

    this._eventsStrategy.fireEvent('fieldsPrepared', [fields]);

    for (let i = 0; i < fields.length; i += 1) {
      if (fields[i].caption !== currentFieldState[i].caption) {
        setFieldProperty(fields[i], 'caption', fields[i].caption, true);
      }
    }

    this._descriptions = this._createDescriptions();
  }

  public isLoading(): boolean {
    return this._loadingCount > 0;
  }

  public state(): DataSourceState;
  public state(state: Partial<DataSourceState> | null | undefined, skipLoading?: boolean): void;
  public state(
    ...args: [] | [Partial<DataSourceState> | null | undefined, boolean?]
  ): DataSourceState | undefined {
    if (args.length) {
      const [state, skipLoading] = args;
      const fullState = extend({
        rowExpandedPaths: [],
        columnExpandedPaths: [],
      }, state);

      if (!this._descriptions) {
        this.beginLoading();
        when(this.getFields()).done((fields) => {
          this._fields = this.setFieldsState(fullState.fields, fields);
          this._fieldsPrepared(fields);
          if (!skipLoading) {
            this.load(fullState);
          }
        }).always(() => {
          this.endLoading();
        });
      } else {
        this._fields = this.setFieldsState(fullState.fields, this._fields);
        this._descriptions = this._createDescriptions();
        if (!skipLoading) {
          this.load(fullState);
        }
      }

      return undefined;
    }
    return {
      fields: this.getFieldsState(this._fields, STATE_PROPERTIES),
      columnExpandedPaths: this.getExpandedPaths(this._data, this._descriptions, 'columns', this._lastLoadOptions),
      rowExpandedPaths: this.getExpandedPaths(this._data, this._descriptions, 'rows', this._lastLoadOptions),
    };
  }

  public beginLoading(): void {
    this._changeLoadingCount(1);
  }

  public endLoading(): void {
    this._changeLoadingCount(-1);
  }

  public _changeLoadingCount(increment: number): void {
    const oldLoading = this.isLoading();

    this._loadingCount += increment;
    const newLoading = this.isLoading();

    if (oldLoading !== newLoading) {
      this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
    }
  }

  public _hasPagingValues(
    options: DataSourceStoreLoadOptions,
    area: DataSourceHeaderArea,
    oppositeIndex: number,
  ): boolean {
    const takeField = `${area}Take` as const;
    const skipField = `${area}Skip` as const;
    const { values } = this._data;
    let items: DataSourceHeaderItems | undefined = area === 'row' ? this._data.rows : this._data.columns;
    const oppositeArea = area === 'row' ? 'column' : 'row';
    const indices: (number | undefined)[] = [];

    if (options.path && options.area === area) {
      const headerItem = this.findHeaderItem(items, options.path);
      items = headerItem?.children;
      if (!items) {
        return false;
      }
    }
    if (options.oppositePath && options.area === oppositeArea) {
      const headerItem = this.findHeaderItem(items, options.oppositePath);
      items = headerItem?.children;
      if (!items) {
        return false;
      }
    }

    const skip = Number(options[skipField]);
    const take = Number(options[takeField]);

    for (let i = skip; i < skip + take; i += 1) {
      if (items[i]) {
        indices.push(items[i].index);
      }
    }

    return indices.every((index) => {
      if (index !== undefined) {
        if (area === 'row') {
          return (values[index] || [])[oppositeIndex];
        }
        return (values[oppositeIndex] || [])[index];
      }

      return undefined;
    });
  }

  public _processPagingCacheByArea(
    options: DataSourceStoreLoadOptions,
    pageSize: number,
    area: DataSourceHeaderArea,
  ): void {
    const takeField = `${area}Take` as const;
    const skipField = `${area}Skip` as const;
    let items: DataSourceHeaderItems = area === 'row' ? this._data.rows : this._data.columns;
    const oppositeArea = area === 'row' ? 'column' : 'row';
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the loop
    let item: DataSourceHeaderItem | undefined;

    if (!options[takeField]) {
      return;
    }

    if (options.path && options.area === area) {
      const headerItem = this.findHeaderItem(items, options.path);
      items = headerItem?.children ?? [];
    }
    if (options.oppositePath && options.area === oppositeArea) {
      const headerItem = this.findHeaderItem(items, options.oppositePath);
      items = headerItem?.children ?? [];
    }

    do {
      item = items[Number(options[skipField])];
      if (item?.index !== undefined) {
        if (this._hasPagingValues(options, oppositeArea, item.index)) {
          options[skipField] = Number(options[skipField]) + 1;
          options[takeField] = Number(options[takeField]) - 1;
        } else {
          break;
        }
      }
    } while (item?.index !== undefined && options[takeField]);

    if (options[takeField]) {
      const start = Math.floor(Number(options[skipField]) / pageSize) * pageSize;
      const end = Math.ceil((Number(options[skipField]) + options[takeField]) / pageSize)
        * pageSize;

      options[skipField] = start;
      options[takeField] = end - start;
    }
  }

  public _processPagingCache(storeLoadOptions: DataSourceStoreLoadOptions[]): void {
    const pageSize = this._pageSize;

    if (pageSize < 0) return;

    for (const options of storeLoadOptions) {
      this._processPagingCacheByArea(options, pageSize, 'row');
      this._processPagingCacheByArea(options, pageSize, 'column');
    }
  }

  public _loadCore(options: DataSourceLoadOptions, deferred: DeferredObj<DataSourceData>): void {
    const store = this._store;
    const descriptions = this._descriptions;
    const reload = !!options.reload || (this.paginate() && this._isFieldsModified);
    const paginate = this.paginate();
    const headerName = options.area ? DESCRIPTION_NAME_BY_AREA[options.area] : undefined;

    if (!store) {
      this._update(deferred);
      return;
    }

    const loadOptions: DataSourceStoreLoadOptions = extend(options, descriptions);
    loadOptions.columnExpandedPaths ??= this.getExpandedPaths(
      this._data,
      loadOptions,
      'columns',
      this._lastLoadOptions,
    );
    loadOptions.rowExpandedPaths ??= this.getExpandedPaths(
      this._data,
      loadOptions,
      'rows',
      this._lastLoadOptions,
    );

    if (paginate) {
      loadOptions.pageSize = this._pageSize;
    }

    if (headerName) {
      loadOptions.headerName = headerName;
    }

    this.beginLoading();
    deferred.always(() => {
      this.endLoading();
    });

    let storeLoadOptions = [loadOptions];

    this._eventsStrategy.fireEvent('customizeStoreLoadOptions', [storeLoadOptions, reload]);

    if (!reload) {
      this._processPagingCache(storeLoadOptions);
    }

    storeLoadOptions = storeLoadOptions
      .filter((storeOptions) => !(storeOptions.rows.length && storeOptions.rowTake === 0)
          && !(storeOptions.columns.length && storeOptions.columnTake === 0));

    if (!storeLoadOptions.length) {
      this._update(deferred);
      return;
    }

    const results = storeLoadOptions.map((storeOptions) => store.load(storeOptions));
    when(...results).done((...loadResults: PivotGridLoadResult[]) => {
      for (let i = 0; i < loadResults.length; i += 1) {
        const storeOptions = storeLoadOptions[i];
        const data = loadResults[i];
        const isLast = i === loadResults.length - 1;

        if (storeOptions.path) {
          this.applyPartialDataSource(
            storeOptions.area,
            storeOptions.path,
            data,
            isLast
              ? deferred
              : false,
            storeOptions.oppositePath,
          );
        } else if (paginate && !reload && isDataExists(this._data)) {
          this.mergePartialDataSource(data, isLast ? deferred : false);
        } else {
          extend(this._data, data);
          this._lastLoadOptions = storeOptions;
          this._update(isLast ? deferred : false);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(deferred.reject);
  }

  public _sort(
    descriptions: PivotGridLoadOptions | undefined,
    data: DataSourceData,
    getAscOrder?: boolean,
  ): void {
    const store = this._store;

    if (store && !this._paginate) {
      sort(descriptions, data, getAscOrder);
    }
  }

  public sortLocal(): void {
    this._sort(this._descriptions, this._data);
    this._eventsStrategy.fireEvent('changed', undefined);
  }

  public paginate(): boolean | undefined {
    return this._paginate
        && this._store?.supportPaging();
  }

  public isEmpty(): boolean {
    const dataFields = this.getAreaFields('data').filter((f) => f.visible !== false);
    const data = this.getData();
    return !dataFields.length || !data.values.length;
  }

  public _update(
    deferred?: DeferredObj<DataSourceData> | false,
  ): DeferredObj<DataSourceData> | false | undefined {
    // @ts-expect-error descriptions are created on the first load
    const descriptions: PivotGridDescriptions = this._descriptions;
    const loadedData = this._data;
    const dataFields = descriptions.values;
    const expressionsUsed = areExpressionsUsed(dataFields);

    when(
      this.formatHeaders(descriptions, loadedData),
      this.updateCache(loadedData.rows),
      this.updateCache(loadedData.columns),
    ).done(() => {
      if (expressionsUsed) {
        this._sort(descriptions, loadedData, expressionsUsed);
        if (!this.isEmpty()) {
          // @ts-expect-error the loaded data has optional indexes, the summary data requires them
          summaryUtils.applyDisplaySummaryMode(descriptions, loadedData);
        }
      }

      this._sort(descriptions, loadedData);

      if (!this.isEmpty() && isRunningTotalUsed(dataFields)) {
        // @ts-expect-error the loaded data has optional indexes, the summary data requires them
        summaryUtils.applyRunningTotal(descriptions, loadedData);
      }

      this._data = loadedData;
      if (deferred !== false) {
        when(deferred).done(() => {
          this._isFieldsModified = false;
          this._eventsStrategy.fireEvent('changed');
          if (isDefined(this._data.grandTotalRowIndex)) {
            loadedData.grandTotalRowIndex = this._data.grandTotalRowIndex;
          }
          if (isDefined(this._data.grandTotalColumnIndex)) {
            loadedData.grandTotalColumnIndex = this._data.grandTotalColumnIndex;
          }
        });
      }
      if (deferred) {
        deferred.resolve(this._data);
      }
    });
    return deferred;
  }

  public store(): PivotGridStore | undefined {
    return this._store;
  }

  public collapseHeaderItem(area: DataSourceHeaderArea, path: ScalarFilterValue[]): boolean {
    const headerItems = area === 'column' ? this._data.columns : this._data.rows;
    const headerItem = this.findHeaderItem(headerItems, path);
    const field: PivotGridField | undefined = this.getAreaFields(area)[path.length - 1];

    if (headerItem?.children) {
      this._eventsStrategy.fireEvent('expandValueChanging', [{
        area,
        path,
        expanded: false,
      }]);
      if (field) {
        field.expanded = false;
      }
      headerItem.collapsedChildren = headerItem.children;
      delete headerItem.children;
      this._update();
      if (this.paginate()) {
        this.load();
      }
      return true;
    }
    return false;
  }

  public collapseAll(id: number | string): void {
    let dataChanged = false;
    const field = this.field(id) ?? {};
    const areaFields: PivotGridField[] = this.getAreaFields(field.area);
    let areaOffsets = [areaFields.indexOf(field)];

    field.expanded = false;
    if (field.levels) {
      areaOffsets = [];
      field.levels.forEach((f) => {
        const levelAreaFields: PivotGridField[] = this.getAreaFields(field.area);
        areaOffsets.push(levelAreaFields.indexOf(f));
        f.expanded = false;
      });
    }

    const headerItems = field.area === 'row' || field.area === 'column'
      ? this._data[`${field.area}s` as const]
      : undefined;

    foreachTree(headerItems, (items) => {
      const item = items[0];
      const path = createPath(items);

      if (item?.children && areaOffsets.includes(path.length - 1)) {
        item.collapsedChildren = item.children;
        delete item.children;
        dataChanged = true;
      }
    }, true);

    if (dataChanged) {
      this._update();
    }
  }

  public expandAll(id: number | string): void {
    const field = this.field(id);
    if (field?.area) {
      field.expanded = true;
      if (field.levels) {
        field.levels.forEach((f) => {
          f.expanded = true;
        });
      }
      this.load();
    }
  }

  public expandHeaderItem(area: DataSourceHeaderArea, path: ScalarFilterValue[]): boolean {
    const headerItems = area === 'column' ? this._data.columns : this._data.rows;
    const headerItem = this.findHeaderItem(headerItems, path);

    if (headerItem && !headerItem.children) {
      const hasCache = !!headerItem.collapsedChildren;
      const options = {
        area,
        path,
        expanded: true,
        needExpandData: !hasCache,
      };
      this._eventsStrategy.fireEvent('expandValueChanging', [options]);
      if (hasCache) {
        headerItem.children = headerItem.collapsedChildren;
        delete headerItem.collapsedChildren;
        this._update();
      } else if (this.store()) {
        this.load(options);
      }
      return hasCache;
    }
    return false;
  }

  public mergePartialDataSource(
    dataSource: PivotGridLoadResult,
    deferred: DeferredObj<DataSourceData> | false,
  ): void {
    const loadedData = this._data;

    if (!dataSource?.values) {
      return;
    }

    dataSource.rows ??= [];
    dataSource.columns ??= [];

    const newRowItemIndexesToCurrent = this.updateHeaderItems(
      loadedData.rows,
      dataSource.rows,
      loadedData.grandTotalColumnIndex,
    );
    const newColumnItemIndexesToCurrent = this.updateHeaderItems(
      loadedData.columns,
      dataSource.columns,
      loadedData.grandTotalColumnIndex,
    );

    when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
      .done((rowItemIndexesToCurrent, columnItemIndexesToCurrent) => {
        if (rowItemIndexesToCurrent.length || columnItemIndexesToCurrent.length) {
          this.updateDataSourceCells(
            loadedData,
            dataSource.values,
            rowItemIndexesToCurrent,
            columnItemIndexesToCurrent,
          );
        }
        this._update(deferred);
      });
  }

  public applyPartialDataSource(
    area: DataSourceHeaderArea | undefined,
    path: ScalarFilterValue[],
    dataSource: PivotGridLoadResult,
    deferred: DeferredObj<DataSourceData> | false,
    oppositePath: ScalarFilterValue[] | undefined,
  ): void {
    const loadedData = this._data;
    const headerItems = area === 'column' ? loadedData.columns : loadedData.rows;
    const oppositeHeaderItems = area === 'column' ? loadedData.rows : loadedData.columns;

    if (!dataSource?.values) {
      return;
    }

    dataSource.rows ??= [];
    dataSource.columns ??= [];
    const headerItem = this.findHeaderItem(headerItems, path);
    const oppositeHeaderItem = oppositePath
      && this.findHeaderItem(oppositeHeaderItems, oppositePath);

    if (!headerItem) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let newRowItemIndexesToCurrent: DeferredObj<number[]>;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let newColumnItemIndexesToCurrent: DeferredObj<number[]>;

    if (area === 'column') {
      newColumnItemIndexesToCurrent = this.updateHeaderItemChildren(
        headerItems,
        headerItem,
        dataSource.columns,
        loadedData.grandTotalColumnIndex,
      );
      if (oppositeHeaderItem) {
        newRowItemIndexesToCurrent = this.updateHeaderItemChildren(
          oppositeHeaderItems,
          oppositeHeaderItem,
          dataSource.rows,
          loadedData.grandTotalRowIndex,
        );
      } else {
        newRowItemIndexesToCurrent = this.updateHeaderItems(
          loadedData.rows,
          dataSource.rows,
          loadedData.grandTotalRowIndex,
        );
      }
    } else {
      newRowItemIndexesToCurrent = this.updateHeaderItemChildren(
        headerItems,
        headerItem,
        dataSource.rows,
        loadedData.grandTotalRowIndex,
      );
      if (oppositeHeaderItem) {
        newColumnItemIndexesToCurrent = this.updateHeaderItemChildren(
          oppositeHeaderItems,
          oppositeHeaderItem,
          dataSource.columns,
          loadedData.grandTotalColumnIndex,
        );
      } else {
        newColumnItemIndexesToCurrent = this.updateHeaderItems(
          loadedData.columns,
          dataSource.columns,
          loadedData.grandTotalColumnIndex,
        );
      }
    }
    when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
      .done((rowItemIndexesToCurrent, columnItemIndexesToCurrent) => {
        if ((area === 'row' && rowItemIndexesToCurrent.length)
          || (area === 'column' && columnItemIndexesToCurrent.length)) {
          this.updateDataSourceCells(
            loadedData,
            dataSource.values,
            rowItemIndexesToCurrent,
            columnItemIndexesToCurrent,
          );
        }
        this._update(deferred);
      });
  }

  public on(
    eventName: DataSourceEventName | Partial<Record<DataSourceEventName, EventHandler>>,
    eventHandler?: EventHandler,
  ): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  public off(eventName: DataSourceEventName, eventHandler?: EventHandler): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }

  public dispose(): void {
    const delayedLoadTask = this._delayedLoadTask;

    this._eventsStrategy.dispose();
    if (delayedLoadTask) {
      delayedLoadTask.abort();
    }
    this._isDisposed = true;
  }

  public isDisposed(): boolean {
    return !!this._isDisposed;
  }
}

export default { PivotGridDataSource };
export { PivotGridDataSource };
