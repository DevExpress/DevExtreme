import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import Class from '@js/core/class';
import { EventsStrategy } from '@js/core/events_strategy';
import { normalizeIndexes } from '@js/core/utils/array';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  isDefined, isFunction, isNumeric, isPlainObject,
  isString,
} from '@js/core/utils/type';
import Store from '@js/data/abstract_store';
import commonUtils from '@ts/core/utils/m_common';
import inflector from '@ts/core/utils/m_inflector';

import { LocalStore } from '../local_store/m_local_store';
import {
  createPath,
  findField,
  foreachTree,
  foreachTreeAsync,
  formatValue,
  getFieldsDataType,
  setFieldProperty,
} from '../m_widget_utils';
import { RemoteStore } from '../remote_store/m_remote_store';
import summaryUtils from '../summary_display_modes/m_summary_display_modes';
import xmlaStore from '../xmla_store/m_xmla_store';
import { sort } from './m_data_source_utils';

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

function createCaption(field) {
  let caption = field.dataField || field.groupName || '';
  let summaryType = (field.summaryType || '').toLowerCase();

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

function resetFieldState(field, properties) {
  const initialProperties = field._initProperties || {};

  each(properties, (_, prop) => {
    if (Object.prototype.hasOwnProperty.call(initialProperties, prop)) {
      field[prop] = initialProperties[prop];
    }
  });
}

function updateCalculatedFieldProperties(field, calculatedProperties) {
  resetFieldState(field, calculatedProperties);
  if (!isDefined(field.caption)) {
    setFieldProperty(field, 'caption', createCaption(field));
  }
}

function areExpressionsUsed(dataFields) {
  return dataFields.some((field) => field.summaryDisplayMode || field.calculateSummaryValue);
}

function isRunningTotalUsed(dataFields) {
  return dataFields.some((field) => !!field.runningTotal);
}

function isDataExists(data) {
  return data.rows.length || data.columns.length || data.values.length;
}

const PivotGridDataSource = Class.inherit((function () {
  const findHeaderItem = function (headerItems, path) {
    if (headerItems._cacheByPath) {
      return headerItems._cacheByPath[path.join('.')] || null;
    }

    return undefined;
  };

  const getHeaderItemsLastIndex = function (headerItems, grandTotalIndex?) {
    let i;
    let lastIndex = -1;
    let headerItem;

    if (headerItems) {
      for (i = 0; i < headerItems.length; i += 1) {
        headerItem = headerItems[i];
        if (headerItem.index !== undefined) {
          lastIndex = Math.max(lastIndex, headerItem.index);
        }
        if (headerItem.children) {
          lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.children));
        } else if (headerItem.collapsedChildren) {
          // B232736
          lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.collapsedChildren));
        }
      }
    }
    if (isDefined(grandTotalIndex)) {
      lastIndex = Math.max(lastIndex, grandTotalIndex);
    }
    return lastIndex;
  };

  const updateHeaderItemChildren = function (headerItems, headerItem, children, grandTotalIndex) {
    const applyingHeaderItemsCount = getHeaderItemsLastIndex(children) + 1;
    let emptyIndex = getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;
    let index;
    const applyingItemIndexesToCurrent: any = [];
    let needIndexUpdate = false;
    // @ts-expect-error
    const d = new Deferred();

    if (headerItem.children && headerItem.children.length === children.length) {
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (child.index !== undefined) {
          if (headerItem.children[i].index === undefined) {
            // eslint-disable-next-line no-plusplus
            child.index = applyingItemIndexesToCurrent[child.index] = emptyIndex++;
            headerItem.children[i] = child;
          } else {
            applyingItemIndexesToCurrent[child.index] = headerItem.children[i].index;
          }
        }
      }
    } else {
      needIndexUpdate = true;
      for (index = 0; index < applyingHeaderItemsCount; index += 1) {
        // eslint-disable-next-line no-plusplus
        applyingItemIndexesToCurrent[index] = emptyIndex++;
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
  };

  const updateHeaderItems = function (headerItems, newHeaderItems, grandTotalIndex) {
    // @ts-expect-errors
    const d = new Deferred();
    let emptyIndex = grandTotalIndex >= 0
      && getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;

    const applyingItemIndexesToCurrent: any = [];

    // reset cache
    when(foreachTreeAsync(headerItems, (items) => {
      delete items[0].collapsedChildren;
    })).done(() => {
      when(foreachTreeAsync(newHeaderItems, (newItems, index) => {
        const newItem = newItems[0];
        if (newItem.index >= 0) {
          let headerItem = findHeaderItem(headerItems, createPath(newItems));
          if (headerItem && headerItem.index >= 0) {
            applyingItemIndexesToCurrent[newItem.index] = headerItem.index;
          } else if (emptyIndex) {
            const path = createPath(newItems.slice(1));
            headerItem = findHeaderItem(headerItems, path);

            const parentItems = path.length ? headerItem && headerItem.children : headerItems;
            if (parentItems) {
              parentItems[index] = newItem;
              // eslint-disable-next-line no-plusplus
              newItem.index = applyingItemIndexesToCurrent[newItem.index] = emptyIndex++;
            }
          }
        }
      })).done(() => {
        d.resolve(applyingItemIndexesToCurrent);
      });
    });

    return d;
  };

  const updateDataSourceCells = function (
    dataSource,
    newDataSourceCells,
    newRowItemIndexesToCurrent,
    newColumnItemIndexesToCurrent,
  ) {
    let newRowIndex;
    let newColumnIndex;
    let newRowCells;
    let newCell;
    let rowIndex;
    let columnIndex;
    const dataSourceCells = dataSource.values;

    if (newDataSourceCells) {
      for (newRowIndex = 0; newRowIndex < newDataSourceCells.length; newRowIndex += 1) {
        newRowCells = newDataSourceCells[newRowIndex];
        rowIndex = newRowItemIndexesToCurrent[newRowIndex];
        if (!isDefined(rowIndex)) {
          rowIndex = dataSource.grandTotalRowIndex;
        }
        if (newRowCells && isDefined(rowIndex)) {
          if (!dataSourceCells[rowIndex]) {
            dataSourceCells[rowIndex] = [];
          }
          // eslint-disable-next-line eqeqeq
          for (newColumnIndex = 0; newColumnIndex < newRowCells.length; newColumnIndex += 1) {
            newCell = newRowCells[newColumnIndex];
            columnIndex = newColumnItemIndexesToCurrent[newColumnIndex];
            if (!isDefined(columnIndex)) {
              columnIndex = dataSource.grandTotalColumnIndex;
            }
            if (isDefined(newCell) && isDefined(columnIndex)) {
              dataSourceCells[rowIndex][columnIndex] = newCell;
            }
          }
        }
      }
    }
  };

  function createLocalOrRemoteStore(dataSourceOptions, notifyProgress) {
    const StoreConstructor = dataSourceOptions.remoteOperations
      || dataSourceOptions.paginate ? RemoteStore : LocalStore;
    // @ts-expect-error
    return new StoreConstructor(extend(normalizeDataSourceOptions(dataSourceOptions), {
      onChanged: null,
      onLoadingChanged: null,
      onProgressChanged: notifyProgress,
    }));
  }

  function createStore(dataSourceOptions, notifyProgress) {
    let store;
    let storeOptions;

    if (isPlainObject(dataSourceOptions) && dataSourceOptions.load) {
      store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
    } else {
      // TODO remove
      if (dataSourceOptions && !dataSourceOptions.store) {
        dataSourceOptions = { store: dataSourceOptions };
      }

      storeOptions = dataSourceOptions.store;

      if (storeOptions.type === 'xmla') {
        store = new xmlaStore.XmlaStore(storeOptions);
      } else if ((isPlainObject(storeOptions) && storeOptions.type)
        || (storeOptions instanceof Store)
        || Array.isArray(storeOptions)) {
        store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
      } else if (storeOptions instanceof Class) {
        store = storeOptions;
      }
    }
    return store;
  }

  function equalFields(fields, prevFields, count) {
    for (let i = 0; i < count; i += 1) {
      if (!fields[i] || !prevFields[i] || fields[i].index !== prevFields[i].index) {
        return false;
      }
    }

    return true;
  }

  function getExpandedPaths(dataSource, loadOptions, dimensionName, prevLoadOptions) {
    const result: any = [];
    const fields = (loadOptions && loadOptions[dimensionName]) || [];
    const prevFields = (prevLoadOptions && prevLoadOptions[dimensionName]) || [];

    foreachTree(dataSource[dimensionName], (items) => {
      const item = items[0];
      const path = createPath(items);

      if (item.children && fields[path.length - 1] && !fields[path.length - 1].expanded) {
        if (path.length < fields.length
          && (!prevLoadOptions || equalFields(fields, prevFields, path.length))) {
          result.push(path.slice());
        }
      }
    }, true);
    return result;
  }

  function setFieldProperties(field, srcField, skipInitPropertySave, properties) {
    if (srcField) {
      each(properties, (_, name) => {
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

  function getFieldsState(fields, properties) {
    const result: any = [];

    each(fields, (_, field) => {
      result.push(setFieldProperties({
        dataField: field.dataField,
        name: field.name,
      }, field, true, properties));
    });

    return result;
  }

  function getFieldStateId(field) {
    if (field.name) {
      return field.name;
    }
    return `${field.dataField}`;
  }

  function getFieldsById(fields, id) {
    const result: any = [];

    each(fields || [], (_, field) => {
      if (getFieldStateId(field) === id) {
        result.push(field);
      }
    });

    return result;
  }

  function setFieldsStateCore(stateFields, fields) {
    stateFields = stateFields || [];

    each(fields, (index, field) => {
      setFieldProperties(field, stateFields[index], false, STATE_PROPERTIES);
      updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);
    });
    return fields;
  }

  function setFieldsState(stateFields, fields) {
    stateFields = stateFields || [];
    const fieldsById = {};
    let id;

    each(fields, (_, field) => {
      id = getFieldStateId(field);
      if (!fieldsById[id]) {
        fieldsById[id] = getFieldsById(fields, getFieldStateId(field));
      }
    });

    each(fieldsById, (id, fields) => {
      setFieldsStateCore(getFieldsById(stateFields, id), fields);
    });

    return fields;
  }

  function getFieldsByGroup(fields, groupingField) {
    return fields
      .filter((field) => field.groupName === groupingField.groupName
        && isNumeric(field.groupIndex)
        && field.visible !== false)
      .map((field) => extend(field, {
        areaIndex: groupingField.areaIndex,
        area: groupingField.area,
        expanded: isDefined(field.expanded) ? field.expanded : groupingField.expanded,
        dataField: field.dataField || groupingField.dataField,
        dataType: field.dataType || groupingField.dataType,
        sortBy: field.sortBy || groupingField.sortBy,
        sortOrder: field.sortOrder || groupingField.sortOrder,
        sortBySummaryField: field.sortBySummaryField || groupingField.sortBySummaryField,
        sortBySummaryPath: field.sortBySummaryPath || groupingField.sortBySummaryPath,
        visible: field.visible || groupingField.visible,
        showTotals: isDefined(field.showTotals) ? field.showTotals : groupingField.showTotals,
        showGrandTotals: isDefined(field.showGrandTotals)
          ? field.showGrandTotals
          : groupingField.showGrandTotals,
      })).sort((a, b) => a.groupIndex - b.groupIndex);
  }

  function sortFieldsByAreaIndex(fields) {
    fields
      .sort((field1, field2) => field1.areaIndex - field2.areaIndex
        || field1.groupIndex - field2.groupIndex);
  }

  function isAreaField(field, area) {
    const canAddFieldInArea = area === 'data' || field.visible !== false;
    return field.area === area && !isDefined(field.groupIndex) && canAddFieldInArea;
  }

  function getFieldId(field, retrieveFieldsOptionValue) {
    const groupName = field.groupName || '';

    return (field.dataField || groupName)
      + (field.groupInterval ? groupName + field.groupInterval : 'NOGROUP')
      + (retrieveFieldsOptionValue ? '' : groupName);
  }

  function mergeFields(fields, storeFields, retrieveFieldsOptionValue) {
    let result: any = [];
    const fieldsDictionary: any = {};
    const removedFields = {};
    const mergedGroups = [];
    const dataTypes = getFieldsDataType(fields);

    if (storeFields) {
      each(storeFields, (_, field) => {
        fieldsDictionary[getFieldId(field, retrieveFieldsOptionValue)] = field;
      });

      each(fields, (_, field) => {
        const fieldKey = getFieldId(field, retrieveFieldsOptionValue);
        const storeField = fieldsDictionary[fieldKey] || removedFields[fieldKey];
        let mergedField;

        if (storeField) {
          if (storeField._initProperties) {
            resetFieldState(storeField, ALL_CALCULATED_PROPERTIES);
          }
          mergedField = extend({}, storeField, field, { _initProperties: null });
        } else {
          fieldsDictionary[fieldKey] = mergedField = field;
        }
        if (!mergedField.dataType && dataTypes[field.dataField]) {
          mergedField.dataType = dataTypes[field.dataField];
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete fieldsDictionary[fieldKey];
        removedFields[fieldKey] = storeField;

        result.push(mergedField);
      });

      if (retrieveFieldsOptionValue) {
        each(fieldsDictionary, (_, field) => {
          result.push(field);
        });
      }
    } else {
      result = fields;
    }

    result.push.apply(result, mergedGroups);

    assignGroupIndexes(result);

    return result;
  }

  function assignGroupIndexes(fields) {
    fields.forEach((field) => {
      if (field.groupName && field.groupInterval && field.groupIndex === undefined) {
        const maxGroupIndex = fields
          .filter((f) => f.groupName === field.groupName && isNumeric(f.groupIndex))
          .map((f) => f.groupIndex)
          .reduce((prev, current) => Math.max(prev, current), -1);

        field.groupIndex = maxGroupIndex + 1;
      }
    });
  }

  function getFields(that) {
    // @ts-expect-error
    const result = new Deferred();
    const store = that._store;
    const storeFields = store && store.getFields(that._fields);
    let mergedFields;

    when(storeFields).done((storeFields) => {
      that._storeFields = storeFields;
      mergedFields = mergeFields(that._fields, storeFields, that._retrieveFields);
      result.resolve(mergedFields);
    }).fail(result.reject);

    return result;
  }

  function formatHeaderItems(data, loadOptions, headerName) {
    return foreachTreeAsync(data[headerName], (items) => {
      const item = items[0];

      item.text = item.text
        || formatValue(item.value, loadOptions[headerName][createPath(items).length - 1]);
    });
  }

  function formatHeaders(loadOptions, data) {
    return when(
      formatHeaderItems(data, loadOptions, 'columns'),
      formatHeaderItems(data, loadOptions, 'rows'),
    );
  }

  function updateCache(headerItems) {
    // @ts-expect-error
    const d = new Deferred();
    const cacheByPath: any = {};

    when(foreachTreeAsync(headerItems, (items) => {
      const path = createPath(items).join('.');
      // eslint-disable-next-line prefer-destructuring
      cacheByPath[path] = items[0];
    })).done(d.resolve);

    headerItems._cacheByPath = cacheByPath;

    return d;
  }

  function getAreaFields(fields, area) {
    const areaFields: any = [];
    each(fields, function () {
      if (isAreaField(this, area)) {
        areaFields.push(this);
      }
    });
    return areaFields;
  }

  return {
    ctor(options) {
      options = options || {};
      this._eventsStrategy = new EventsStrategy(this);

      const that: any = this;
      const store = createStore(options, (progress) => {
        that._eventsStrategy.fireEvent('progressChanged', [progress]);
      });

      that._store = store;
      that._paginate = !!options.paginate;
      that._pageSize = options.pageSize || 40;
      that._data = { rows: [], columns: [], values: [] };
      that._loadingCount = 0;

      that._isFieldsModified = false;

      each(
        [
          'changed',
          'loadError',
          'loadingChanged',
          'progressChanged',
          'fieldsPrepared',
          'expandValueChanging',
        ],
        (_, eventName) => {
          const optionName = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
          if (Object.prototype.hasOwnProperty.call(options, optionName)) {
            this.on(eventName, options[optionName]);
          }
        },
      );

      that._retrieveFields = isDefined(options.retrieveFields) ? options.retrieveFields : true;

      that._fields = options.fields || [];
      that._descriptions = options.descriptions
        ? extend(that._createDescriptions(), options.descriptions)
        : undefined;

      if (!store) {
        // TODO create dashboard store
        extend(true, that._data, options.store || options);
      }
    },

    getData() {
      return this._data;
    },

    getAreaFields(area, collectGroups) {
      let areaFields = [];
      let descriptions;

      if (collectGroups || area === 'data') {
        areaFields = getAreaFields(this._fields, area);
        sortFieldsByAreaIndex(areaFields);
      } else {
        descriptions = this._descriptions || {};
        areaFields = descriptions[DESCRIPTION_NAME_BY_AREA[area]] || [];
      }

      return areaFields;
    },

    getSummaryFields() {
      return this.getAreaFields('data').filter((field) => isDefined(field.summaryType));
    },

    fields(fields) {
      const that: any = this;
      if (fields) {
        that._fields = mergeFields(fields, that._storeFields, that._retrieveFields);
        that._fieldsPrepared(that._fields);
      }

      return that._fields;
    },

    field(id, options) {
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
        updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);

        that._descriptions = that._createDescriptions(field);
        that._isFieldsModified = true;
        that._eventsStrategy.fireEvent('fieldChanged', [field]);
      }
      return field;
    },

    getFieldValues(index, applyFilters, options) {
      const that: any = this;
      const field = this._fields && this._fields[index];
      const store = this.store();
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
          formatHeaders(loadOptions, data);
          if (!loadOptions.columnTake) {
            that._sort(loadOptions, data);
          }
          d.resolve(data.columns);
        }).fail(d);
      } else {
        d.reject();
      }
      return d;
    },

    reload() {
      return this.load({ reload: true });
    },

    filter() {
      const store = this._store;

      return store.filter.apply(store, arguments);
    },

    // eslint-disable-next-line object-shorthand
    load: function (options) {
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

      function loadTask() {
        that._delayedLoadTask = undefined;
        if (!that._descriptions) {
          when(getFields(that)).done((fields) => {
            that._fieldsPrepared(fields);
            that._loadCore(options, d);
          }).fail(d.reject).fail(that._loadErrorHandler);
        } else {
          that._loadCore(options, d);
        }
      }
      if (that.store()) {
        that._delayedLoadTask = commonUtils.executeAsync(loadTask);
      } else {
        loadTask();
      }

      return d;
    },

    createDrillDownDataSource(params) {
      return this._store.createDrillDownDataSource(
        this._descriptions,
        params,
      );
    },

    _createDescriptions(currentField) {
      const that: any = this;
      const fields = that.fields();
      const descriptions: any = {
        rows: [],
        columns: [],
        values: [],
        filters: [],
      };

      each(['row', 'column', 'data', 'filter'], (_, areaName) => {
        normalizeIndexes(getAreaFields(fields, areaName), 'areaIndex', currentField);
      });

      each(fields || [], (_, field) => {
        const descriptionName = DESCRIPTION_NAME_BY_AREA[field.area];
        const dimension = descriptions[descriptionName];
        const { groupName } = field;

        if (groupName && !isNumeric(field.groupIndex)) {
          field.levels = getFieldsByGroup(fields, field);
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
        sortFieldsByAreaIndex(fields);
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
    },

    _fieldsPrepared(fields) {
      const that: any = this;
      that._fields = fields;
      each(fields, (index, field) => {
        field.index = index;
        updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES);
      });

      const currentFieldState = getFieldsState(fields, ['caption']);

      that._eventsStrategy.fireEvent('fieldsPrepared', [fields]);

      for (let i = 0; i < fields.length; i += 1) {
        if (fields[i].caption !== currentFieldState[i].caption) {
          setFieldProperty(fields[i], 'caption', fields[i].caption, true);
        }
      }

      that._descriptions = that._createDescriptions();
    },
    isLoading() {
      return this._loadingCount > 0;
    },

    state(state, skipLoading) {
      const that: any = this;

      if (arguments.length) {
        state = extend({
          rowExpandedPaths: [],
          columnExpandedPaths: [],
        }, state);

        if (!that._descriptions) {
          that.beginLoading();
          when(getFields(that)).done((fields) => {
            that._fields = setFieldsState(state.fields, fields);
            that._fieldsPrepared(fields);
            !skipLoading && that.load(state);
          }).always(() => {
            that.endLoading();
          });
        } else {
          that._fields = setFieldsState(state.fields, that._fields);
          that._descriptions = that._createDescriptions();
          !skipLoading && that.load(state);
        }

        return undefined;
      }
      return {
        fields: getFieldsState(that._fields, STATE_PROPERTIES),
        columnExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'columns', that._lastLoadOptions),
        rowExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'rows', that._lastLoadOptions),
      };
    },

    beginLoading() {
      this._changeLoadingCount(1);
    },

    endLoading() {
      this._changeLoadingCount(-1);
    },

    _changeLoadingCount(increment) {
      const oldLoading = this.isLoading();

      this._loadingCount += increment;
      const newLoading = this.isLoading();

      // - @ts-expect-error
      if (oldLoading ^ newLoading) {
        this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
      }
    },

    _hasPagingValues(options, area, oppositeIndex) {
      const takeField = `${area}Take`;
      const skipField = `${area}Skip`;
      const { values } = this._data;
      let items = this._data[`${area}s`];
      const oppositeArea = area === 'row' ? 'column' : 'row';
      const indices: any = [];

      if (options.path && options.area === area) {
        const headerItem = findHeaderItem(items, options.path);
        items = headerItem && headerItem.children;
        if (!items) {
          return false;
        }
      }
      if (options.oppositePath && options.area === oppositeArea) {
        const headerItem = findHeaderItem(items, options.oppositePath);
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
    },

    _processPagingCacheByArea(options, pageSize, area) {
      const takeField = `${area}Take`;
      const skipField = `${area}Skip`;
      let items = this._data[`${area}s`];
      const oppositeArea = area === 'row' ? 'column' : 'row';
      let item;

      if (options[takeField]) {
        if (options.path && options.area === area) {
          const headerItem = findHeaderItem(items, options.path);
          items = headerItem && headerItem.children || [];
        }
        if (options.oppositePath && options.area === oppositeArea) {
          const headerItem = findHeaderItem(items, options.oppositePath);
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
    },

    _processPagingCache(storeLoadOptions) {
      const pageSize = this._pageSize;

      if (pageSize < 0) return;

      for (let i = 0; i < storeLoadOptions.length; i += 1) {
        this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'row');
        this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'column');
      }
    },

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
          || getExpandedPaths(this._data, options, 'columns', that._lastLoadOptions);
        options.rowExpandedPaths = options.rowExpandedPaths
          || getExpandedPaths(this._data, options, 'rows', that._lastLoadOptions);

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
    },

    _sort(descriptions, data, getAscOrder?: boolean) {
      const store = this._store;

      if (store && !this._paginate) {
        sort(descriptions, data, getAscOrder);
      }
    },

    sortLocal(): void {
      this._sort(this._descriptions, this._data);
      this._eventsStrategy.fireEvent('changed');
    },

    paginate() {
      return this._paginate
        && this._store
        && this._store.supportPaging();
    },

    isEmpty() {
      const dataFields = this.getAreaFields('data').filter((f) => f.visible !== false);
      const data = this.getData();
      return !dataFields.length || !data.values.length;
    },

    _update(deferred) {
      const that: any = this;
      const descriptions = that._descriptions;
      const loadedData = that._data;
      const dataFields = descriptions.values;
      const expressionsUsed = areExpressionsUsed(dataFields);

      when(
        formatHeaders(descriptions, loadedData),
        updateCache(loadedData.rows),
        updateCache(loadedData.columns),
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
    },

    store() {
      return this._store;
    },

    collapseHeaderItem(area, path) {
      const that: any = this;
      const headerItems = area === 'column' ? that._data.columns : that._data.rows;
      const headerItem = findHeaderItem(headerItems, path);
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
    },

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
    },

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
    },

    expandHeaderItem(area, path) {
      const that: any = this;
      const headerItems = area === 'column' ? that._data.columns : that._data.rows;
      const headerItem = findHeaderItem(headerItems, path);

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
    },

    mergePartialDataSource(dataSource, deferred) {
      const that: any = this;
      const loadedData = that._data;
      let newRowItemIndexesToCurrent;
      let newColumnItemIndexesToCurrent;

      if (dataSource && dataSource.values) {
        dataSource.rows = dataSource.rows || [];
        dataSource.columns = dataSource.columns || [];

        newRowItemIndexesToCurrent = updateHeaderItems(
          loadedData.rows,
          dataSource.rows,
          loadedData.grandTotalColumnIndex,
        );
        newColumnItemIndexesToCurrent = updateHeaderItems(
          loadedData.columns,
          dataSource.columns,
          loadedData.grandTotalColumnIndex,
        );

        when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
          .done((newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) => {
            if (newRowItemIndexesToCurrent.length || newColumnItemIndexesToCurrent.length) {
              updateDataSourceCells(
                loadedData,
                dataSource.values,
                newRowItemIndexesToCurrent,
                newColumnItemIndexesToCurrent,
              );
            }
            that._update(deferred);
          });
      }
    },

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
        headerItem = findHeaderItem(headerItems, path);
        oppositeHeaderItem = oppositePath && findHeaderItem(oppositeHeaderItems, oppositePath);
        if (headerItem) {
          if (area === 'column') {
            newColumnItemIndexesToCurrent = updateHeaderItemChildren(
              headerItems,
              headerItem,
              dataSource.columns,
              loadedData.grandTotalColumnIndex,
            );
            if (oppositeHeaderItem) {
              newRowItemIndexesToCurrent = updateHeaderItemChildren(
                oppositeHeaderItems,
                oppositeHeaderItem,
                dataSource.rows,
                loadedData.grandTotalRowIndex,
              );
            } else {
              newRowItemIndexesToCurrent = updateHeaderItems(
                loadedData.rows,
                dataSource.rows,
                loadedData.grandTotalRowIndex,
              );
            }
          } else {
            newRowItemIndexesToCurrent = updateHeaderItemChildren(
              headerItems,
              headerItem,
              dataSource.rows,
              loadedData.grandTotalRowIndex,
            );
            if (oppositeHeaderItem) {
              newColumnItemIndexesToCurrent = updateHeaderItemChildren(
                oppositeHeaderItems,
                oppositeHeaderItem,
                dataSource.columns,
                loadedData.grandTotalColumnIndex,
              );
            } else {
              newColumnItemIndexesToCurrent = updateHeaderItems(
                loadedData.columns,
                dataSource.columns,
                loadedData.grandTotalColumnIndex,
              );
            }
          }
          when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
            .done((newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) => {
              if (area === 'row' && newRowItemIndexesToCurrent.length || area === 'column' && newColumnItemIndexesToCurrent.length) {
                updateDataSourceCells(
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
    },

    on(eventName, eventHandler) {
      this._eventsStrategy.on(eventName, eventHandler);
      return this;
    },

    off(eventName, eventHandler) {
      this._eventsStrategy.off(eventName, eventHandler);
      return this;
    },

    dispose() {
      const that: any = this;
      const delayedLoadTask = that._delayedLoadTask;

      this._eventsStrategy.dispose();
      if (delayedLoadTask) {
        delayedLoadTask.abort();
      }
      this._isDisposed = true;
    },
    isDisposed() {
      return !!this._isDisposed;
    },
  };
})());

export default { PivotGridDataSource };
export { PivotGridDataSource };
