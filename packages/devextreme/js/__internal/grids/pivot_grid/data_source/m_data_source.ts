import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { EventsStrategy } from '@js/core/events_strategy';
import { normalizeIndexes } from '@js/core/utils/array';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import {
  isDefined, isFunction, isNumeric, isPlainObject,
  isString,
} from '@js/core/utils/type';
import Store from '@js/data/abstract_store';
import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import commonUtils from '@ts/core/utils/common';
import { extend } from '@ts/core/utils/extend';
import inflector from '@ts/core/utils/inflector';
import { each } from '@ts/core/utils/iterator';
import type {
  PivotGridAxis,
  PivotGridDescriptions,
  PivotGridField,
  PivotGridLoadOptions,
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
import xmlaStore from '../xmla_store/m_xmla_store';
import { sort } from './m_data_source_utils';
import type {
  DataSourceOptions,
  HeaderItem,
  HeaderItems,
  LoadedData,
  ProgressHandler,
  StoreOption,
} from './types';

const DESCRIPTION_NAME_BY_AREA = {
  row: 'rows',
  column: 'columns',
  data: 'values',
  filter: 'filters',
};
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

function isDataExists(data: LoadedData): number {
  return data.rows.length || data.columns.length || data.values.length;
}

class PivotGridDataSource {
  public _eventsStrategy: EventsStrategy;

  public _store: PivotGridStore | undefined;

  public _paginate: boolean;

  public _pageSize: number;

  public _data: LoadedData;

  public _loadingCount: number;

  public _isFieldsModified: boolean;

  public _fields: PivotGridField[];

  public _descriptions: PivotGridDescriptions | undefined;

  public _lastLoadOptions?: PivotGridLoadOptions;

  public _retrieveFields: boolean;

  public _storeFields?: PivotGridField[];

  public _delayedLoadTask?: ReturnType<typeof commonUtils.executeAsync>;

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

    [
      'changed',
      'loadError',
      'loadingChanged',
      'progressChanged',
      'fieldsPrepared',
      'expandValueChanging',
    ].forEach((eventName) => {
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

  public findHeaderItem(headerItems: HeaderItems, path: unknown[]): HeaderItem | null | undefined {
    if (headerItems._cacheByPath) {
      return headerItems._cacheByPath[path.join('.')] ?? null;
    }

    return undefined;
  }

  public getHeaderItemsLastIndex(
    headerItems: HeaderItem[] | undefined,
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
    headerItems: HeaderItem[],
    headerItem: HeaderItem,
    children: HeaderItem[],
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
    headerItems: HeaderItems,
    newHeaderItems: HeaderItem[],
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
    dataSource: LoadedData,
    newDataSourceCells: unknown[][][] | undefined,
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
    notifyProgress: ProgressHandler,
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
    notifyProgress: ProgressHandler,
  ): PivotGridStore | undefined {
    if (isPlainObject(dataSourceOptions) && dataSourceOptions.load) {
      return this.createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
    }

    // TODO remove
    const options = dataSourceOptions && !dataSourceOptions.store
      ? { store: dataSourceOptions }
      : dataSourceOptions;
    // @ts-expect-error the store option is set here and can be any store config
    const storeOptions: StoreOption = options.store;

    if (storeOptions.type === 'xmla') {
      // @ts-expect-error createDrillDownDataSource comes from storeDrillDownMixin
      return new xmlaStore.XmlaStore(storeOptions);
    }
    if ((isPlainObject(storeOptions) && storeOptions.type)
      || (storeOptions instanceof Store)
      || Array.isArray(storeOptions)) {
      return this.createLocalOrRemoteStore(options, notifyProgress);
    }
    if (isFunction(storeOptions.load) && isFunction(storeOptions.getFields)) {
      // @ts-expect-error a custom pivot store is checked only for load() and getFields()
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
    dataSource: LoadedData,
    loadOptions: PivotGridLoadOptions | undefined,
    dimensionName: PivotGridAxis,
    prevLoadOptions: PivotGridLoadOptions | undefined,
  ): unknown[][] {
    const result: unknown[][] = [];
    const fields = loadOptions?.[dimensionName] ?? [];
    const prevFields = prevLoadOptions?.[dimensionName] ?? [];

    foreachTree(dataSource[dimensionName], (items) => {
      const item = items[0];
      const path = createPath(items);

      if (item.children && fields[path.length - 1] && !fields[path.length - 1].expanded) {
        if (path.length < fields.length
          && (!prevLoadOptions || this.equalFields(fields, prevFields, path.length))) {
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
        dataType: field.dataType ?? groupingField.dataType,
        sortBy: field.sortBy ?? groupingField.sortBy,
        sortOrder: field.sortOrder ?? groupingField.sortOrder,
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

  public isAreaField(field: PivotGridField, area: PivotGridArea): boolean {
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

      if (!mergedField.dataType && dataTypes[`${field.dataField}`]) {
        mergedField.dataType = dataTypes[`${field.dataField}`];
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
    data: LoadedData,
    loadOptions: PivotGridLoadOptions,
    headerName: PivotGridAxis,
  ): DeferredObj<unknown> | undefined {
    return foreachTreeAsync(data[headerName], (items) => {
      const item = items[0];

      item.text = item.text
        || formatValue(item.value, loadOptions[headerName][createPath(items).length - 1]);
    });
  }

  public formatHeaders(loadOptions: PivotGridLoadOptions, data: LoadedData): DeferredObj<unknown> {
    return when(
      this.formatHeaderItems(data, loadOptions, 'columns'),
      this.formatHeaderItems(data, loadOptions, 'rows'),
    );
  }

  public updateCache(headerItems: HeaderItems): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    const cacheByPath: Record<string, HeaderItem> = {};

    when(foreachTreeAsync(headerItems, (items) => {
      const path = createPath(items).join('.');
      // eslint-disable-next-line prefer-destructuring
      cacheByPath[path] = items[0];
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    })).done(d.resolve);

    headerItems._cacheByPath = cacheByPath;

    return d;
  }

  getData() {
    return this._data;
  }

  getAreaFields(area, collectGroups?) {
    let areaFields: any[] = [];
    let descriptions;

    if (collectGroups || area === 'data') {
      each(this._fields, (_, field) => {
        if (this.isAreaField(field, area)) {
          areaFields.push(field);
        }
      });
      this.sortFieldsByAreaIndex(areaFields);
    } else {
      descriptions = this._descriptions || {};
      areaFields = descriptions[DESCRIPTION_NAME_BY_AREA[area]] || [];
    }

    return areaFields;
  }

  getSummaryFields() {
    return this.getAreaFields('data').filter((field) => isDefined(field.summaryType));
  }

  fields(fields) {
    const that: any = this;
    if (fields) {
      that._fields = this.mergeFields(fields, that._storeFields, that._retrieveFields);
      that._fieldsPrepared(that._fields);
    }

    return that._fields;
  }

  field(id, options?) {
    const that: any = this;
    const fields = that._fields;
    const field = fields && fields[isNumeric(id) ? id : findField(fields, id)];
    let levels;

    if (field && options) {
      each(options, (optionName, optionValue) => {
        const isInitialization = !STATE_PROPERTIES.includes(optionName as string);

        setFieldProperty(field, optionName, optionValue, isInitialization);

        if (optionName === 'sortOrder') {
          levels = field.levels || [];
          for (let i = 0; i < levels.length; i += 1) {
            levels[i][optionName] = optionValue;
          }
        }
      });
      this.updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);

      that._descriptions = that._createDescriptions(field);
      that._isFieldsModified = true;
      that._eventsStrategy.fireEvent('fieldChanged', [field]);
    }
    return field;
  }

  getFieldValues(index, applyFilters, options) {
    const that: any = this;
    const field = this._fields && this._fields[index];
    const store = this._store;
    const loadFields: any = [];
    const loadOptions: any = {
      columns: loadFields,
      rows: [],
      values: this.getAreaFields('data'),
      filters: applyFilters
        ? this._fields.filter((f) => f !== field
            && f.area
            && f.filterValues
            && f.filterValues.length)
        : [],
      skipValues: true,
    };
    let searchValue;
    // @ts-expect-error
    const d = new Deferred();

    if (options) {
      searchValue = options.searchValue;
      loadOptions.columnSkip = options.skip;
      loadOptions.columnTake = options.take;
    }

    if (field && store) {
      each(field.levels || [field], function () {
        loadFields.push(extend({}, this, {
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
          that._sort(loadOptions, data);
        }
        d.resolve(data.columns);
      }).fail(d.reject);
    } else {
      d.reject();
    }
    return d;
  }

  reload() {
    return this.load({ reload: true });
  }

  filter() {
    const store = this._store;

    // @ts-expect-error the pivot store isn't checked here, the arguments are passed as is
    return store.filter.apply(store, arguments);
  }

  load(options?) {
    const that: any = this;
    // @ts-expect-error
    const d = new Deferred();
    options = options || {};

    that.beginLoading();

    d.fail((e) => {
      that._eventsStrategy.fireEvent('loadError', [e]);
    }).always(() => {
      that.endLoading();
    });

    const loadTask = () => {
      that._delayedLoadTask = undefined;
      if (!that._descriptions) {
        when(this.getFields()).done((fields) => {
          that._fieldsPrepared(fields);
          that._loadCore(options, d);
        }).fail(d.reject).fail(that._loadErrorHandler);
      } else {
        that._loadCore(options, d);
      }
    };

    if (that.store()) {
      that._delayedLoadTask = commonUtils.executeAsync(loadTask);
    } else {
      loadTask();
    }

    return d;
  }

  createDrillDownDataSource(params) {
    // @ts-expect-error the pivot store isn't checked here
    return this._store.createDrillDownDataSource(
      this._descriptions,
      params,
    );
  }

  _createDescriptions(currentField?) {
    const that: any = this;
    const fields = that.fields();
    const descriptions: any = {
      rows: [],
      columns: [],
      values: [],
      filters: [],
    };

    each(['row', 'column', 'data', 'filter'], (_, areaName) => {
      normalizeIndexes(this.getAreaFields(areaName, true), 'areaIndex', currentField);
    });

    each(fields || [], (_, field) => {
      const descriptionName = DESCRIPTION_NAME_BY_AREA[field.area];
      const dimension = descriptions[descriptionName];
      const { groupName } = field;

      if (groupName && !isNumeric(field.groupIndex)) {
        field.levels = this.getFieldsByGroup(fields, field);
      }

      if (!dimension || groupName && isNumeric(field.groupIndex) || (field.visible === false && (field.area !== 'data' && field.area !== 'filter'))) {
        return;
      }

      if (field.levels
          && dimension !== descriptions.filters
          && dimension !== descriptions.values) {
        dimension.push.apply(dimension, field.levels);
        if (field.filterValues && field.filterValues.length) {
          descriptions.filters.push(field);
        }
      } else {
        dimension.push(field);
      }
    });

    each(descriptions, (_, fields) => {
      this.sortFieldsByAreaIndex(fields);
    });

    const indices = {};
    each(descriptions.values, (_, field) => {
      const expression = field.calculateSummaryValue;
      if (isFunction(expression)) {
        const summaryCell = summaryUtils.createMockSummaryCell(descriptions, fields, indices);
        expression(summaryCell);
      }
    });

    return descriptions;
  }

  _fieldsPrepared(fields) {
    const that: any = this;
    that._fields = fields;
    each(fields, (index, field) => {
      field.index = index;
      this.updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES);
    });

    const currentFieldState = this.getFieldsState(fields, ['caption']);

    that._eventsStrategy.fireEvent('fieldsPrepared', [fields]);

    for (let i = 0; i < fields.length; i += 1) {
      if (fields[i].caption !== currentFieldState[i].caption) {
        setFieldProperty(fields[i], 'caption', fields[i].caption, true);
      }
    }

    that._descriptions = that._createDescriptions();
  }

  isLoading() {
    return this._loadingCount > 0;
  }

  state(state, skipLoading) {
    const that: any = this;

    if (arguments.length) {
      state = extend({
        rowExpandedPaths: [],
        columnExpandedPaths: [],
      }, state);

      if (!that._descriptions) {
        that.beginLoading();
        when(this.getFields()).done((fields) => {
          that._fields = this.setFieldsState(state.fields, fields);
          that._fieldsPrepared(fields);
          !skipLoading && that.load(state);
        }).always(() => {
          that.endLoading();
        });
      } else {
        that._fields = this.setFieldsState(state.fields, that._fields);
        that._descriptions = that._createDescriptions();
        !skipLoading && that.load(state);
      }

      return undefined;
    }
    return {
      fields: this.getFieldsState(that._fields, STATE_PROPERTIES),
      columnExpandedPaths: this.getExpandedPaths(that._data, that._descriptions, 'columns', that._lastLoadOptions),
      rowExpandedPaths: this.getExpandedPaths(that._data, that._descriptions, 'rows', that._lastLoadOptions),
    };
  }

  beginLoading() {
    this._changeLoadingCount(1);
  }

  endLoading() {
    this._changeLoadingCount(-1);
  }

  _changeLoadingCount(increment) {
    const oldLoading = this.isLoading();

    this._loadingCount += increment;
    const newLoading = this.isLoading();

    if (oldLoading !== newLoading) {
      this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
    }
  }

  _hasPagingValues(options, area, oppositeIndex) {
    const takeField = `${area}Take`;
    const skipField = `${area}Skip`;
    const { values } = this._data;
    let items = this._data[`${area}s`];
    const oppositeArea = area === 'row' ? 'column' : 'row';
    const indices: any = [];

    if (options.path && options.area === area) {
      const headerItem = this.findHeaderItem(items, options.path);
      items = headerItem && headerItem.children;
      if (!items) {
        return false;
      }
    }
    if (options.oppositePath && options.area === oppositeArea) {
      const headerItem = this.findHeaderItem(items, options.oppositePath);
      items = headerItem && headerItem.children;
      if (!items) {
        return false;
      }
    }

    for (let i = options[skipField]; i < options[skipField] + options[takeField]; i += 1) {
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

  _processPagingCacheByArea(options, pageSize, area) {
    const takeField = `${area}Take`;
    const skipField = `${area}Skip`;
    let items = this._data[`${area}s`];
    const oppositeArea = area === 'row' ? 'column' : 'row';
    let item;

    if (options[takeField]) {
      if (options.path && options.area === area) {
        const headerItem = this.findHeaderItem(items, options.path);
        items = headerItem && headerItem.children || [];
      }
      if (options.oppositePath && options.area === oppositeArea) {
        const headerItem = this.findHeaderItem(items, options.oppositePath);
        items = headerItem && headerItem.children || [];
      }

      do {
        item = items[options[skipField]];
        if (item && item.index !== undefined) {
          if (this._hasPagingValues(options, oppositeArea, item.index)) {
            // eslint-disable-next-line no-plusplus
            options[skipField]++;
            // eslint-disable-next-line no-plusplus
            options[takeField]--;
          } else {
            break;
          }
        }
      } while (item && item.index !== undefined && options[takeField]);

      if (options[takeField]) {
        const start = Math.floor(options[skipField] / pageSize) * pageSize;
        const end = Math.ceil((options[skipField] + options[takeField]) / pageSize) * pageSize;

        options[skipField] = start;
        options[takeField] = end - start;
      }
    }
  }

  _processPagingCache(storeLoadOptions) {
    const pageSize = this._pageSize;

    if (pageSize < 0) return;

    for (let i = 0; i < storeLoadOptions.length; i += 1) {
      this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'row');
      this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'column');
    }
  }

  _loadCore(options, deferred) {
    const that: any = this;
    const store = this._store;
    const descriptions = this._descriptions;
    const reload = options.reload || (this.paginate() && that._isFieldsModified);
    const paginate = this.paginate();
    const headerName = DESCRIPTION_NAME_BY_AREA[options.area];

    options = options || {};

    if (store) {
      extend(options, descriptions);
      options.columnExpandedPaths = options.columnExpandedPaths
          || this.getExpandedPaths(this._data, options, 'columns', that._lastLoadOptions);
      options.rowExpandedPaths = options.rowExpandedPaths
          || this.getExpandedPaths(this._data, options, 'rows', that._lastLoadOptions);

      if (paginate) {
        options.pageSize = this._pageSize;
      }

      if (headerName) {
        options.headerName = headerName;
      }

      that.beginLoading();
      deferred.always(() => {
        that.endLoading();
      });

      let storeLoadOptions = [options];

      that._eventsStrategy.fireEvent('customizeStoreLoadOptions', [storeLoadOptions, reload]);

      if (!reload) {
        that._processPagingCache(storeLoadOptions);
      }

      storeLoadOptions = storeLoadOptions
        .filter((options) => !(options.rows.length && options.rowTake === 0)
            && !(options.columns.length && options.columnTake === 0));

      if (!storeLoadOptions.length) {
        that._update(deferred);
        return;
      }

      const results = storeLoadOptions.map((options) => store.load(options));
      when.apply(null, results).done(function () {
        const results = arguments;
        for (let i = 0; i < results.length; i += 1) {
          const options = storeLoadOptions[i];
          const data = results[i];
          const isLast = i === results.length - 1;

          if (options.path) {
            that.applyPartialDataSource(
              options.area,
              options.path,
              data,
              isLast
                ? deferred
                : false,
              options.oppositePath,
            );
          } else if (paginate && !reload && isDataExists(that._data)) {
            that.mergePartialDataSource(data, isLast ? deferred : false);
          } else {
            extend(that._data, data);
            that._lastLoadOptions = options;
            that._update(isLast ? deferred : false);
          }
        }
      }).fail(deferred.reject);
    } else {
      that._update(deferred);
    }
  }

  _sort(descriptions, data, getAscOrder?: boolean) {
    const store = this._store;

    if (store && !this._paginate) {
      sort(descriptions, data, getAscOrder);
    }
  }

  sortLocal(): void {
    this._sort(this._descriptions, this._data);
    this._eventsStrategy.fireEvent('changed', undefined);
  }

  paginate() {
    return this._paginate
        && this._store
        && this._store.supportPaging();
  }

  isEmpty() {
    const dataFields = this.getAreaFields('data').filter((f) => f.visible !== false);
    const data = this.getData();
    return !dataFields.length || !data.values.length;
  }

  _update(deferred?) {
    const that: any = this;
    const descriptions = that._descriptions;
    const loadedData = that._data;
    const dataFields = descriptions.values;
    const expressionsUsed = areExpressionsUsed(dataFields);

    when(
      this.formatHeaders(descriptions, loadedData),
      this.updateCache(loadedData.rows),
      this.updateCache(loadedData.columns),
    ).done(() => {
      if (expressionsUsed) {
        that._sort(descriptions, loadedData, expressionsUsed);
        !that.isEmpty() && summaryUtils.applyDisplaySummaryMode(descriptions, loadedData);
      }

      that._sort(descriptions, loadedData);

      !that.isEmpty()
          && isRunningTotalUsed(dataFields)
          && summaryUtils.applyRunningTotal(descriptions, loadedData);

      that._data = loadedData;
      deferred !== false && when(deferred).done(() => {
        that._isFieldsModified = false;
        that._eventsStrategy.fireEvent('changed');
        if (isDefined(that._data.grandTotalRowIndex)) {
          loadedData.grandTotalRowIndex = that._data.grandTotalRowIndex;
        }
        if (isDefined(that._data.grandTotalColumnIndex)) {
          loadedData.grandTotalColumnIndex = that._data.grandTotalColumnIndex;
        }
      });
      deferred && deferred.resolve(that._data);
    });
    return deferred;
  }

  store() {
    return this._store;
  }

  collapseHeaderItem(area, path) {
    const that: any = this;
    const headerItems = area === 'column' ? that._data.columns : that._data.rows;
    const headerItem = this.findHeaderItem(headerItems, path);
    const field = that.getAreaFields(area)[path.length - 1];

    if (headerItem && headerItem.children) {
      that._eventsStrategy.fireEvent('expandValueChanging', [{
        area,
        path,
        expanded: false,
      }]);
      if (field) {
        field.expanded = false;
      }
      headerItem.collapsedChildren = headerItem.children;
      delete headerItem.children;
      that._update();
      if (that.paginate()) {
        that.load();
      }
      return true;
    }
    return false;
  }

  collapseAll(id) {
    let dataChanged = false;
    const field = this.field(id) || {};
    let areaOffsets = [this.getAreaFields(field.area).indexOf(field)];

    field.expanded = false;
    if (field && field.levels) {
      areaOffsets = [];
      field.levels.forEach((f) => {
        areaOffsets.push(this.getAreaFields(field.area).indexOf(f));
        f.expanded = false;
      });
    }

    foreachTree(this._data[`${field.area}s`], (items) => {
      const item = items[0];
      const path = createPath(items);

      if (item && item.children && areaOffsets.includes(path.length - 1)) {
        item.collapsedChildren = item.children;
        delete item.children;
        dataChanged = true;
      }
    }, true);

    dataChanged && this._update();
  }

  expandAll(id) {
    const field = this.field(id);
    if (field && field.area) {
      field.expanded = true;
      if (field && field.levels) {
        field.levels.forEach((f) => {
          f.expanded = true;
        });
      }
      this.load();
    }
  }

  expandHeaderItem(area, path) {
    const that: any = this;
    const headerItems = area === 'column' ? that._data.columns : that._data.rows;
    const headerItem = this.findHeaderItem(headerItems, path);

    if (headerItem && !headerItem.children) {
      const hasCache = !!headerItem.collapsedChildren;
      const options = {
        area,
        path,
        expanded: true,
        needExpandData: !hasCache,
      };
      that._eventsStrategy.fireEvent('expandValueChanging', [options]);
      if (hasCache) {
        headerItem.children = headerItem.collapsedChildren;
        delete headerItem.collapsedChildren;
        that._update();
      } else if (this.store()) {
        that.load(options);
      }
      return hasCache;
    }
    return false;
  }

  mergePartialDataSource(dataSource, deferred) {
    const that: any = this;
    const loadedData = that._data;
    let newRowItemIndexesToCurrent;
    let newColumnItemIndexesToCurrent;

    if (dataSource && dataSource.values) {
      dataSource.rows = dataSource.rows || [];
      dataSource.columns = dataSource.columns || [];

      newRowItemIndexesToCurrent = this.updateHeaderItems(
        loadedData.rows,
        dataSource.rows,
        loadedData.grandTotalColumnIndex,
      );
      newColumnItemIndexesToCurrent = this.updateHeaderItems(
        loadedData.columns,
        dataSource.columns,
        loadedData.grandTotalColumnIndex,
      );

      when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
        .done((newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) => {
          if (newRowItemIndexesToCurrent.length || newColumnItemIndexesToCurrent.length) {
            this.updateDataSourceCells(
              loadedData,
              dataSource.values,
              newRowItemIndexesToCurrent,
              newColumnItemIndexesToCurrent,
            );
          }
          that._update(deferred);
        });
    }
  }

  applyPartialDataSource(area, path, dataSource, deferred, oppositePath) {
    const that: any = this;
    const loadedData = that._data;
    const headerItems = area === 'column' ? loadedData.columns : loadedData.rows;
    let headerItem;
    const oppositeHeaderItems = area === 'column' ? loadedData.rows : loadedData.columns;
    let oppositeHeaderItem;
    let newRowItemIndexesToCurrent;
    let newColumnItemIndexesToCurrent;

    if (dataSource && dataSource.values) {
      dataSource.rows = dataSource.rows || [];
      dataSource.columns = dataSource.columns || [];
      headerItem = this.findHeaderItem(headerItems, path);
      oppositeHeaderItem = oppositePath && this.findHeaderItem(oppositeHeaderItems, oppositePath);
      if (headerItem) {
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
          .done((newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) => {
            if (area === 'row' && newRowItemIndexesToCurrent.length || area === 'column' && newColumnItemIndexesToCurrent.length) {
              this.updateDataSourceCells(
                loadedData,
                dataSource.values,
                newRowItemIndexesToCurrent,
                newColumnItemIndexesToCurrent,
              );
            }
            that._update(deferred);
          });
      }
    }
  }

  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }

  dispose() {
    const that: any = this;
    const delayedLoadTask = that._delayedLoadTask;

    this._eventsStrategy.dispose();
    if (delayedLoadTask) {
      delayedLoadTask.abort();
    }
    this._isDisposed = true;
  }

  isDisposed() {
    return !!this._isDisposed;
  }
}

export default { PivotGridDataSource };
export { PivotGridDataSource };
