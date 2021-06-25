import { normalizeDataSourceOptions } from '../../data/data_source/utils';
import Store from '../../data/abstract_store';
import { executeAsync } from '../../core/utils/common';
import { isFunction, isNumeric, isDefined, isString, isPlainObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray, normalizeIndexes } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import { when, Deferred } from '../../core/utils/deferred';
import Class from '../../core/class';
import { EventsStrategy } from '../../core/events_strategy';
import { titleize } from '../../core/utils/inflector';
import { LocalStore } from './local_store';
import RemoteStore from './remote_store';
import { sort } from './data_source.utils';
import { XmlaStore } from './xmla_store/xmla_store';
import { applyDisplaySummaryMode, createMockSummaryCell, applyRunningTotal } from './ui.pivot_grid.summary_display_modes';
import {
    foreachTree,
    foreachTreeAsync,
    findField,
    formatValue,
    createPath,
    setFieldProperty,
    getFieldsDataType
} from './ui.pivot_grid.utils';

const DESCRIPTION_NAME_BY_AREA = {
    row: 'rows',
    column: 'columns',
    data: 'values',
    filter: 'filters'
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
    'summaryDisplayMode'
];
const CALCULATED_PROPERTIES = [
    'format',
    'selector',
    'customizeText',
    'caption'
];
const ALL_CALCULATED_PROPERTIES = CALCULATED_PROPERTIES
    .concat(['allowSorting', 'allowSortingBySummary', 'allowFiltering', 'allowExpandAll']);

function createCaption(field) {
    let caption = field.dataField || field.groupName || '';
    let summaryType = (field.summaryType || '').toLowerCase();

    if(isString(field.groupInterval)) {
        caption += '_' + field.groupInterval;
    }

    if(summaryType && summaryType !== 'custom') {
        summaryType = summaryType.replace(/^./, summaryType[0].toUpperCase());
        if(caption.length) {
            summaryType = ' (' + summaryType + ')';
        }
    } else {
        summaryType = '';
    }

    return titleize(caption) + summaryType;
}

function resetFieldState(field, properties) {
    const initialProperties = field._initProperties || {};

    each(properties, function(_, prop) {
        if(Object.prototype.hasOwnProperty.call(initialProperties, prop)) {
            field[prop] = initialProperties[prop];
        }
    });
}

function updateCalculatedFieldProperties(field, calculatedProperties) {
    resetFieldState(field, calculatedProperties);
    if(!isDefined(field.caption)) {
        setFieldProperty(field, 'caption', createCaption(field));
    }
}

function areExpressionsUsed(dataFields) {
    return dataFields.some(function(field) {
        return field.summaryDisplayMode || field.calculateSummaryValue;
    });
}

function isRunningTotalUsed(dataFields) {
    return dataFields.some(function(field) {
        return !!field.runningTotal;
    });
}

function isDataExists(data) {
    return data.rows.length || data.columns.length || data.values.length;
}
export default Class.inherit((function() {

    const findHeaderItem = function(headerItems, path) {
        if(headerItems._cacheByPath) {
            return headerItems._cacheByPath[path.join('.')] || null;
        }
    };

    const getHeaderItemsLastIndex = function(headerItems, grandTotalIndex) {
        let i;
        let lastIndex = -1;
        let headerItem;

        if(headerItems) {
            for(i = 0; i < headerItems.length; i++) {
                headerItem = headerItems[i];
                if(headerItem.index !== undefined) {
                    lastIndex = Math.max(lastIndex, headerItem.index);
                }
                if(headerItem.children) {
                    lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.children));
                } else if(headerItem.collapsedChildren) {
                    // B232736
                    lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.collapsedChildren));
                }
            }
        }
        if(isDefined(grandTotalIndex)) {
            lastIndex = Math.max(lastIndex, grandTotalIndex);
        }
        return lastIndex;
    };

    const updateHeaderItemChildren = function(headerItems, headerItem, children, grandTotalIndex) {
        const applyingHeaderItemsCount = getHeaderItemsLastIndex(children) + 1;
        let emptyIndex = getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;
        let index;
        const applyingItemIndexesToCurrent = [];
        let needIndexUpdate = false;
        const d = new Deferred();

        if(headerItem.children && headerItem.children.length === children.length) {
            for(let i = 0; i < children.length; i++) {
                const child = children[i];
                if(child.index !== undefined) {
                    if(headerItem.children[i].index === undefined) {
                        child.index = applyingItemIndexesToCurrent[child.index] = emptyIndex++;
                        headerItem.children[i] = child;
                    } else {
                        applyingItemIndexesToCurrent[child.index] = headerItem.children[i].index;
                    }
                }
            }
        } else {
            needIndexUpdate = true;
            for(index = 0; index < applyingHeaderItemsCount; index++) {
                applyingItemIndexesToCurrent[index] = emptyIndex++;
            }
            headerItem.children = children;
        }

        when(foreachTreeAsync(headerItem.children, function(items) {
            if(needIndexUpdate) {
                items[0].index = applyingItemIndexesToCurrent[items[0].index];
            }
        })).done(function() {
            d.resolve(applyingItemIndexesToCurrent);
        });
        return d;
    };

    const updateHeaderItems = function(headerItems, newHeaderItems, grandTotalIndex) {
        const d = new Deferred();
        let emptyIndex = grandTotalIndex >= 0 && getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;

        const applyingItemIndexesToCurrent = [];

        // reset cache
        when(foreachTreeAsync(headerItems, function(items) {
            delete items[0].collapsedChildren;
        })).done(function() {
            when(foreachTreeAsync(newHeaderItems, function(newItems, index) {
                const newItem = newItems[0];
                if(newItem.index >= 0) {
                    let headerItem = findHeaderItem(headerItems, createPath(newItems));
                    if(headerItem && headerItem.index >= 0) {
                        applyingItemIndexesToCurrent[newItem.index] = headerItem.index;
                    } else if(emptyIndex) {
                        const path = createPath(newItems.slice(1));
                        headerItem = findHeaderItem(headerItems, path);

                        const parentItems = path.length ? headerItem && headerItem.children : headerItems;
                        if(parentItems) {
                            parentItems[index] = newItem;
                            newItem.index = applyingItemIndexesToCurrent[newItem.index] = emptyIndex++;
                        }
                    }
                }
            })).done(function() {
                d.resolve(applyingItemIndexesToCurrent);
            });
        });


        return d;
    };

    const updateDataSourceCells = function(dataSource, newDataSourceCells, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
        let newRowIndex;
        let newColumnIndex;
        let newRowCells;
        let newCell;
        let rowIndex;
        let columnIndex;
        const dataSourceCells = dataSource.values;

        if(newDataSourceCells) {
            for(newRowIndex = 0; newRowIndex <= newDataSourceCells.length; newRowIndex++) {
                newRowCells = newDataSourceCells[newRowIndex];
                rowIndex = newRowItemIndexesToCurrent[newRowIndex];
                if(!isDefined(rowIndex)) {
                    rowIndex = dataSource.grandTotalRowIndex;
                }
                if(newRowCells && isDefined(rowIndex)) {
                    if(!dataSourceCells[rowIndex]) {
                        dataSourceCells[rowIndex] = [];
                    }
                    for(newColumnIndex = 0; newColumnIndex <= newRowCells.length; newColumnIndex++) {
                        newCell = newRowCells[newColumnIndex];
                        columnIndex = newColumnItemIndexesToCurrent[newColumnIndex];
                        if(!isDefined(columnIndex)) {
                            columnIndex = dataSource.grandTotalColumnIndex;
                        }
                        if(isDefined(newCell) && isDefined(columnIndex)) {
                            dataSourceCells[rowIndex][columnIndex] = newCell;
                        }
                    }
                }
            }
        }
    };

    function createLocalOrRemoteStore(dataSourceOptions, notifyProgress) {
        const StoreConstructor = (dataSourceOptions.remoteOperations || dataSourceOptions.paginate) ? RemoteStore : LocalStore;

        return new StoreConstructor(extend(normalizeDataSourceOptions(dataSourceOptions), {
            onChanged: null,
            onLoadingChanged: null,
            onProgressChanged: notifyProgress
        }));
    }

    function createStore(dataSourceOptions, notifyProgress) {
        let store;
        let storeOptions;

        if(isPlainObject(dataSourceOptions) && dataSourceOptions.load) {
            store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
        } else {
            // TODO remove
            if(dataSourceOptions && !dataSourceOptions.store) {
                dataSourceOptions = { store: dataSourceOptions };
            }

            storeOptions = dataSourceOptions.store;

            if(storeOptions.type === 'xmla') {
                store = new XmlaStore(storeOptions);
            } else if((isPlainObject(storeOptions) && storeOptions.type) || (storeOptions instanceof Store) || Array.isArray(storeOptions)) {
                store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress);
            } else if(storeOptions instanceof Class) {
                store = storeOptions;
            }
        }
        return store;
    }

    function equalFields(fields, prevFields, count) {
        for(let i = 0; i < count; i++) {
            if(!fields[i] || !prevFields[i] || fields[i].index !== prevFields[i].index) {
                return false;
            }
        }

        return true;
    }

    function getExpandedPaths(dataSource, loadOptions, dimensionName, prevLoadOptions) {
        const result = [];
        const fields = (loadOptions && loadOptions[dimensionName]) || [];
        const prevFields = (prevLoadOptions && prevLoadOptions[dimensionName]) || [];

        foreachTree(dataSource[dimensionName], function(items) {
            const item = items[0];
            const path = createPath(items);

            if(item.children && fields[path.length - 1] && !fields[path.length - 1].expanded) {
                if(path.length < fields.length && (!prevLoadOptions || equalFields(fields, prevFields, path.length))) {
                    result.push(path.slice());
                }
            }
        }, true);
        return result;
    }

    function setFieldProperties(field, srcField, skipInitPropertySave, properties) {
        if(srcField) {
            each(properties, function(_, name) {
                if(skipInitPropertySave) {
                    field[name] = srcField[name];
                } else {
                    if((name === 'summaryType' || name === 'summaryDisplayMode') && srcField[name] === undefined) {
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
        const result = [];

        each(fields, function(_, field) {
            result.push(setFieldProperties({
                dataField: field.dataField,
                name: field.name
            }, field, true, properties));
        });

        return result;
    }

    function getFieldStateId(field) {
        if(field.name) {
            return field.name;
        }
        return field.dataField + '';
    }

    function getFieldsById(fields, id) {

        const result = [];

        each(fields || [], function(_, field) {
            if(getFieldStateId(field) === id) {
                result.push(field);
            }
        });

        return result;
    }

    function setFieldsStateCore(stateFields, fields) {
        stateFields = stateFields || [];

        each(fields, function(index, field) {
            setFieldProperties(field, stateFields[index], false, STATE_PROPERTIES);
            updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);
        });
        return fields;
    }

    function setFieldsState(stateFields, fields) {
        stateFields = stateFields || [];
        const fieldsById = {};
        let id;

        each(fields, function(_, field) {
            id = getFieldStateId(field);
            if(!fieldsById[id]) {
                fieldsById[id] = getFieldsById(fields, getFieldStateId(field));
            }
        });

        each(fieldsById, function(id, fields) {
            setFieldsStateCore(getFieldsById(stateFields, id), fields);
        });

        return fields;
    }

    function getFieldsByGroup(fields, groupingField) {
        return fields.filter(field => {
            return field.groupName === groupingField.groupName && isNumeric(field.groupIndex) && field.visible !== false;
        }).map(function(field) {
            return extend(field, {
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
                showGrandTotals: isDefined(field.showGrandTotals) ? field.showGrandTotals : groupingField.showGrandTotals
            });
        }).sort(function(a, b) { return a.groupIndex - b.groupIndex; });
    }

    function sortFieldsByAreaIndex(fields) {
        fields.sort(function(field1, field2) {
            return field1.areaIndex - field2.areaIndex || field1.groupIndex - field2.groupIndex;
        });
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
        let result = [];
        const fieldsDictionary = {};
        const removedFields = {};
        const mergedGroups = [];
        const dataTypes = getFieldsDataType(fields);

        if(storeFields) {
            each(storeFields, function(_, field) {
                fieldsDictionary[getFieldId(field, retrieveFieldsOptionValue)] = field;
            });

            each(fields, function(_, field) {
                const fieldKey = getFieldId(field, retrieveFieldsOptionValue);
                const storeField = fieldsDictionary[fieldKey] || removedFields[fieldKey];
                let mergedField;

                if(storeField) {
                    if(storeField._initProperties) {
                        resetFieldState(storeField, ALL_CALCULATED_PROPERTIES);
                    }
                    mergedField = extend({}, storeField, field, { _initProperties: null });
                } else {
                    fieldsDictionary[fieldKey] = mergedField = field;
                }
                extend(mergedField, { dataType: dataTypes[field.dataField] });
                delete fieldsDictionary[fieldKey];
                removedFields[fieldKey] = storeField;

                result.push(mergedField);
            });

            if(retrieveFieldsOptionValue) {
                each(fieldsDictionary, function(_, field) {
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
        fields.forEach(field => {
            if(field.groupName && field.groupInterval && field.groupIndex === undefined) {
                const maxGroupIndex = fields
                    .filter(f => f.groupName === field.groupName && isNumeric(f.groupIndex))
                    .map(f => f.groupIndex)
                    .reduce((prev, current) => Math.max(prev, current), -1);

                field.groupIndex = maxGroupIndex + 1;
            }
        });
    }

    function getFields(that) {
        const result = new Deferred();
        const store = that._store;
        const storeFields = store && store.getFields(that._fields);
        let mergedFields;

        when(storeFields).done(function(storeFields) {
            that._storeFields = storeFields;
            mergedFields = mergeFields(that._fields, storeFields, that._retrieveFields);
            result.resolve(mergedFields);
        }).fail(result.reject);

        return result;
    }

    function formatHeaderItems(data, loadOptions, headerName) {
        return foreachTreeAsync(data[headerName], function(items) {
            const item = items[0];

            item.text = item.text || formatValue(item.value, loadOptions[headerName][createPath(items).length - 1]);
        });
    }

    function formatHeaders(loadOptions, data) {
        return when(
            formatHeaderItems(data, loadOptions, 'columns'),
            formatHeaderItems(data, loadOptions, 'rows')
        );
    }

    function updateCache(headerItems) {
        const d = new Deferred();
        const cacheByPath = {};

        when(foreachTreeAsync(headerItems, function(items) {
            const path = createPath(items).join('.');
            cacheByPath[path] = items[0];
        })).done(d.resolve);

        headerItems._cacheByPath = cacheByPath;

        return d;
    }

    function getAreaFields(fields, area) {
        const areaFields = [];
        each(fields, function() {
            if(isAreaField(this, area)) {
                areaFields.push(this);
            }
        });
        return areaFields;
    }

    return {
        ctor: function(options) {
            options = options || {};
            this._eventsStrategy = new EventsStrategy(this);

            const that = this;
            const store = createStore(options, function(progress) {
                that._eventsStrategy.fireEvent('progressChanged', [progress]);
            });

            /**
            * @name PivotGridDataSourceOptions.store.type
            * @type Enums.PivotGridStoreType
            */
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
                    'expandValueChanging'
                ],
                (function(_, eventName) {
                    const optionName = 'on' + eventName[0].toUpperCase() + eventName.slice(1);
                    if(Object.prototype.hasOwnProperty.call(options, optionName)) {
                        this.on(eventName, options[optionName]);
                    }
                }).bind(this)
            );

            that._retrieveFields = isDefined(options.retrieveFields) ? options.retrieveFields : true;

            that._fields = options.fields || [];
            /**
            * @name PivotGridDataSourceOptions.fields.index
            * @type number
            * @default undefined
            * @hidden
            */


            /**
            * @name PivotGridDataSourceOptions.fields.headerFilter.width
            * @type number
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.headerFilter.height
            * @type number
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.headerFilter.allowSearch
            * @type boolean
            * @default undefined
            */

            that._descriptions = options.descriptions ? extend(that._createDescriptions(), options.descriptions) : undefined;

            if(!store) {
                // TODO create dashboard store
                extend(true, that._data, options.store || options);
            }
        },

        getData: function() {
            return this._data;
        },

        getAreaFields: function(area, collectGroups) {
            let areaFields = [];
            let descriptions;

            if(collectGroups || area === 'data') {
                areaFields = getAreaFields(this._fields, area);
                sortFieldsByAreaIndex(areaFields);
            } else {
                descriptions = this._descriptions || {};
                areaFields = descriptions[DESCRIPTION_NAME_BY_AREA[area]] || [];
            }

            return areaFields;
        },

        fields: function(fields) {
            const that = this;
            if(fields) {
                that._fields = mergeFields(fields, that._storeFields, that._retrieveFields);
                that._fieldsPrepared(that._fields);
            }

            return that._fields;
        },

        field: function(id, options) {
            const that = this;
            const fields = that._fields;
            const field = fields && fields[isNumeric(id) ? id : findField(fields, id)];
            let levels;

            if(field && options) {
                each(options, function(optionName, optionValue) {
                    const isInitialization = inArray(optionName, STATE_PROPERTIES) < 0;

                    setFieldProperty(field, optionName, optionValue, isInitialization);

                    if(optionName === 'sortOrder') {
                        levels = field.levels || [];
                        for(let i = 0; i < levels.length; i++) {
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

        getFieldValues: function(index, applyFilters, options) {
            const that = this;
            const field = this._fields && this._fields[index];
            const store = this.store();
            const loadFields = [];
            const loadOptions = {
                columns: loadFields,
                rows: [],
                values: this.getAreaFields('data'),
                filters: applyFilters ? this._fields.filter(f => f !== field && f.area && f.filterValues && f.filterValues.length) : [],
                skipValues: true
            };
            let searchValue;
            const d = new Deferred();

            if(options) {
                searchValue = options.searchValue;
                loadOptions.columnSkip = options.skip;
                loadOptions.columnTake = options.take;
            }

            if(field && store) {
                each(field.levels || [field], function() {
                    loadFields.push(extend({}, this, { expanded: true, filterValues: null, sortOrder: 'asc', sortBySummaryField: null, searchValue: searchValue }));
                });

                store.load(loadOptions).done(function(data) {
                    if(loadOptions.columnSkip) {
                        data.columns = data.columns.slice(loadOptions.columnSkip);
                    }
                    if(loadOptions.columnTake) {
                        data.columns = data.columns.slice(0, loadOptions.columnTake);
                    }
                    formatHeaders(loadOptions, data);
                    if(!loadOptions.columnTake) {
                        that._sort(loadOptions, data);
                    }
                    d.resolve(data.columns);
                }).fail(d);
            } else {
                d.reject();
            }
            return d;
        },

        reload: function() {
            return this.load({ reload: true });
        },

        filter: function() {
            const store = this._store;

            return store.filter.apply(store, arguments);
        },

        load: function(options) {
            const that = this;
            const d = new Deferred();
            options = options || {};

            that.beginLoading();

            d.fail(function(e) {
                that._eventsStrategy.fireEvent('loadError', [e]);
            }).always(function() {
                that.endLoading();
            });

            function loadTask() {
                that._delayedLoadTask = undefined;
                if(!that._descriptions) {
                    when(getFields(that)).done(function(fields) {
                        that._fieldsPrepared(fields);
                        that._loadCore(options, d);
                    }).fail(d.reject).fail(that._loadErrorHandler);
                } else {
                    that._loadCore(options, d);
                }
            }
            if(that.store()) {
                that._delayedLoadTask = executeAsync(loadTask);
            } else {
                loadTask();
            }

            return d;
        },

        createDrillDownDataSource: function(params) {
            return this._store.createDrillDownDataSource(this._descriptions, params);
        },

        _createDescriptions: function(currentField) {
            const that = this;
            const fields = that.fields();
            const descriptions = {
                rows: [],
                columns: [],
                values: [],
                filters: []
            };

            each(['row', 'column', 'data', 'filter'], function(_, areaName) {
                normalizeIndexes(getAreaFields(fields, areaName), 'areaIndex', currentField);
            });

            each(fields || [], function(_, field) {
                const descriptionName = DESCRIPTION_NAME_BY_AREA[field.area];
                const dimension = descriptions[descriptionName];
                const groupName = field.groupName;

                if(groupName && !isNumeric(field.groupIndex)) {
                    field.levels = getFieldsByGroup(fields, field);
                }

                if(!dimension || groupName && isNumeric(field.groupIndex) || (field.visible === false && (field.area !== 'data' && field.area !== 'filter'))) {
                    return;
                }

                if(field.levels && dimension !== descriptions.filters && dimension !== descriptions.values) {
                    dimension.push.apply(dimension, field.levels);
                    if(field.filterValues && field.filterValues.length) {
                        descriptions.filters.push(field);
                    }
                } else {
                    dimension.push(field);
                }
            });

            each(descriptions, function(_, fields) {
                sortFieldsByAreaIndex(fields);
            });

            const indices = {};
            each(descriptions.values, function(_, field) {
                const expression = field.calculateSummaryValue;
                if(isFunction(expression)) {
                    const summaryCell = createMockSummaryCell(descriptions, fields, indices);
                    expression(summaryCell);
                }
            });

            return descriptions;
        },

        _fieldsPrepared: function(fields) {
            const that = this;
            that._fields = fields;
            each(fields, function(index, field) {
                field.index = index;
                updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES);
            });

            const currentFieldState = getFieldsState(fields, ['caption']);

            that._eventsStrategy.fireEvent('fieldsPrepared', [fields]);

            for(let i = 0; i < fields.length; i++) {
                if(fields[i].caption !== currentFieldState[i].caption) {
                    setFieldProperty(fields[i], 'caption', fields[i].caption, true);
                }
            }

            that._descriptions = that._createDescriptions();
        },
        isLoading: function() {
            return this._loadingCount > 0;
        },


        state: function(state, skipLoading) {
            const that = this;

            if(arguments.length) {
                state = extend({
                    rowExpandedPaths: [],
                    columnExpandedPaths: []
                }, state);

                if(!that._descriptions) {
                    that.beginLoading();
                    when(getFields(that)).done(function(fields) {
                        that._fields = setFieldsState(state.fields, fields);
                        that._fieldsPrepared(fields);
                        !skipLoading && that.load(state);
                    }).always(function() {
                        that.endLoading();
                    });
                } else {
                    that._fields = setFieldsState(state.fields, that._fields);
                    that._descriptions = that._createDescriptions();
                    !skipLoading && that.load(state);
                }

            } else {
                return {
                    fields: getFieldsState(that._fields, STATE_PROPERTIES),
                    columnExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'columns', that._lastLoadOptions),
                    rowExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'rows', that._lastLoadOptions)
                };
            }
        },

        beginLoading: function() {
            this._changeLoadingCount(1);
        },

        endLoading: function() {
            this._changeLoadingCount(-1);
        },

        _changeLoadingCount: function(increment) {
            const oldLoading = this.isLoading();

            this._loadingCount += increment;
            const newLoading = this.isLoading();

            if(oldLoading ^ newLoading) {
                this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
            }
        },

        _hasPagingValues: function(options, area, oppositeIndex) {
            const takeField = area + 'Take';
            const skipField = area + 'Skip';
            const values = this._data.values;
            let items = this._data[area + 's'];
            const oppositeArea = area === 'row' ? 'column' : 'row';
            const indices = [];

            if(options.path && options.area === area) {
                const headerItem = findHeaderItem(items, options.path);
                items = headerItem && headerItem.children;
                if(!items) {
                    return false;
                }
            }
            if(options.oppositePath && options.area === oppositeArea) {
                const headerItem = findHeaderItem(items, options.oppositePath);
                items = headerItem && headerItem.children;
                if(!items) {
                    return false;
                }
            }


            for(let i = options[skipField]; i < options[skipField] + options[takeField]; i++) {
                if(items[i]) {
                    indices.push(items[i].index);
                }
            }

            return indices.every(index => {
                if(index !== undefined) {
                    if(area === 'row') {
                        return (values[index] || [])[oppositeIndex];
                    } else {
                        return (values[oppositeIndex] || [])[index];
                    }
                }
            });
        },

        _processPagingCacheByArea: function(options, pageSize, area) {
            const takeField = area + 'Take';
            const skipField = area + 'Skip';
            let items = this._data[area + 's'];
            const oppositeArea = area === 'row' ? 'column' : 'row';
            let item;

            if(options[takeField]) {
                if(options.path && options.area === area) {
                    const headerItem = findHeaderItem(items, options.path);
                    items = headerItem && headerItem.children || [];
                }
                if(options.oppositePath && options.area === oppositeArea) {
                    const headerItem = findHeaderItem(items, options.oppositePath);
                    items = headerItem && headerItem.children || [];
                }

                do {
                    item = items[options[skipField]];
                    if(item && item.index !== undefined) {
                        if(this._hasPagingValues(options, oppositeArea, item.index)) {
                            options[skipField]++;
                            options[takeField]--;
                        } else {
                            break;
                        }
                    }
                } while(item && item.index !== undefined && options[takeField]);

                if(options[takeField]) {
                    const start = Math.floor(options[skipField] / pageSize) * pageSize;
                    const end = Math.ceil((options[skipField] + options[takeField]) / pageSize) * pageSize;

                    options[skipField] = start;
                    options[takeField] = end - start;
                }
            }
        },

        _processPagingCache: function(storeLoadOptions) {
            const pageSize = this._pageSize;

            if(pageSize < 0) return;

            for(let i = 0; i < storeLoadOptions.length; i++) {
                this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'row');
                this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'column');
            }
        },

        _loadCore: function(options, deferred) {
            const that = this;
            const store = this._store;
            const descriptions = this._descriptions;
            const reload = options.reload || (this.paginate() && that._isFieldsModified);
            const paginate = this.paginate();
            const headerName = DESCRIPTION_NAME_BY_AREA[options.area];

            options = options || {};

            if(store) {
                extend(options, descriptions);
                options.columnExpandedPaths = options.columnExpandedPaths || getExpandedPaths(this._data, options, 'columns', that._lastLoadOptions);
                options.rowExpandedPaths = options.rowExpandedPaths || getExpandedPaths(this._data, options, 'rows', that._lastLoadOptions);

                if(paginate) {
                    options.pageSize = this._pageSize;
                }

                if(headerName) {
                    options.headerName = headerName;
                }

                that.beginLoading();
                deferred.always(function() {
                    that.endLoading();
                });

                let storeLoadOptions = [options];

                that._eventsStrategy.fireEvent('customizeStoreLoadOptions', [storeLoadOptions, reload]);

                if(!reload) {
                    that._processPagingCache(storeLoadOptions);
                }

                storeLoadOptions = storeLoadOptions.filter(options => {
                    return !(options.rows.length && options.rowTake === 0) && !(options.columns.length && options.columnTake === 0);
                });

                if(!storeLoadOptions.length) {
                    that._update(deferred);
                    return;
                }

                const results = storeLoadOptions.map(options => store.load(options));
                when.apply(null, results).done(function() {
                    const results = arguments;
                    for(let i = 0; i < results.length; i++) {
                        const options = storeLoadOptions[i];
                        const data = results[i];
                        const isLast = i === results.length - 1;

                        if(options.path) {
                            that.applyPartialDataSource(options.area, options.path, data, isLast ? deferred : false, options.oppositePath);
                        } else if(paginate && !reload && isDataExists(that._data)) {
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

        _sort: function(descriptions, data, getAscOrder) {
            const store = this._store;

            if(store && !this._paginate) {
                sort(descriptions, data, getAscOrder);
            }
        },

        paginate: function() {
            return this._paginate && this._store && this._store.supportPaging();
        },

        isEmpty: function() {
            const dataFields = this.getAreaFields('data').filter(f => f.visible !== false);
            const data = this.getData();
            return !dataFields.length || !data.values.length;
        },

        _update: function(deferred) {
            const that = this;
            const descriptions = that._descriptions;
            const loadedData = that._data;
            const dataFields = descriptions.values;
            const expressionsUsed = areExpressionsUsed(dataFields);

            when(formatHeaders(descriptions, loadedData), updateCache(loadedData.rows), updateCache(loadedData.columns)).done(function() {
                if(expressionsUsed) {
                    that._sort(descriptions, loadedData, expressionsUsed);
                    !that.isEmpty() && applyDisplaySummaryMode(descriptions, loadedData);
                }

                that._sort(descriptions, loadedData);

                !that.isEmpty() && isRunningTotalUsed(dataFields) && applyRunningTotal(descriptions, loadedData);

                that._data = loadedData;
                deferred !== false && when(deferred).done(function() {
                    that._isFieldsModified = false;
                    that._eventsStrategy.fireEvent('changed');
                    if(isDefined(that._data.grandTotalRowIndex)) {
                        loadedData.grandTotalRowIndex = that._data.grandTotalRowIndex;
                    }
                    if(isDefined(that._data.grandTotalColumnIndex)) {
                        loadedData.grandTotalColumnIndex = that._data.grandTotalColumnIndex;
                    }
                });
                deferred && deferred.resolve(that._data);
            });
            return deferred;
        },

        store: function() {
            return this._store;
        },

        collapseHeaderItem: function(area, path) {
            const that = this;
            const headerItems = area === 'column' ? that._data.columns : that._data.rows;
            const headerItem = findHeaderItem(headerItems, path);
            const field = that.getAreaFields(area)[path.length - 1];

            if(headerItem && headerItem.children) {
                that._eventsStrategy.fireEvent('expandValueChanging', [{
                    area: area,
                    path: path,
                    expanded: false
                }]);
                if(field) {
                    field.expanded = false;
                }
                headerItem.collapsedChildren = headerItem.children;
                delete headerItem.children;
                that._update();
                if(that.paginate()) {
                    that.load();
                }
                return true;
            }
            return false;
        },

        collapseAll: function(id) {
            let dataChanged = false;
            const field = this.field(id) || {};
            let areaOffsets = [inArray(field, this.getAreaFields(field.area))];

            field.expanded = false;
            if(field && field.levels) {
                areaOffsets = [];
                field.levels.forEach(f => {
                    areaOffsets.push(inArray(f, this.getAreaFields(field.area)));
                    f.expanded = false;
                });
            }

            foreachTree(this._data[field.area + 's'], function(items) {
                const item = items[0];
                const path = createPath(items);

                if(item && item.children && areaOffsets.indexOf(path.length - 1) !== -1) {
                    item.collapsedChildren = item.children;
                    delete item.children;
                    dataChanged = true;
                }
            }, true);

            dataChanged && this._update();
        },

        expandAll: function(id) {
            const field = this.field(id);
            if(field && field.area) {
                field.expanded = true;
                if(field && field.levels) {
                    field.levels.forEach(f => {
                        f.expanded = true;
                    });
                }
                this.load();
            }
        },

        expandHeaderItem: function(area, path) {
            const that = this;
            const headerItems = area === 'column' ? that._data.columns : that._data.rows;
            const headerItem = findHeaderItem(headerItems, path);

            if(headerItem && !headerItem.children) {
                const hasCache = !!headerItem.collapsedChildren;
                const options = {
                    area: area,
                    path: path,
                    expanded: true,
                    needExpandData: !hasCache
                };
                that._eventsStrategy.fireEvent('expandValueChanging', [options]);
                if(hasCache) {
                    headerItem.children = headerItem.collapsedChildren;
                    delete headerItem.collapsedChildren;
                    that._update();
                } else if(this.store()) {
                    that.load(options);
                }
                return hasCache;
            }
            return false;
        },

        mergePartialDataSource: function(dataSource, deferred) {
            const that = this;
            const loadedData = that._data;
            let newRowItemIndexesToCurrent;
            let newColumnItemIndexesToCurrent;

            if(dataSource && dataSource.values) {
                dataSource.rows = dataSource.rows || [];
                dataSource.columns = dataSource.columns || [];

                newRowItemIndexesToCurrent = updateHeaderItems(loadedData.rows, dataSource.rows, loadedData.grandTotalColumnIndex);
                newColumnItemIndexesToCurrent = updateHeaderItems(loadedData.columns, dataSource.columns, loadedData.grandTotalColumnIndex);

                when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent).done(function(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
                    if(newRowItemIndexesToCurrent.length || newColumnItemIndexesToCurrent.length) {
                        updateDataSourceCells(loadedData, dataSource.values, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent);
                    }
                    that._update(deferred);
                });
            }
        },

        applyPartialDataSource: function(area, path, dataSource, deferred, oppositePath) {
            const that = this;
            const loadedData = that._data;
            const headerItems = area === 'column' ? loadedData.columns : loadedData.rows;
            let headerItem;
            const oppositeHeaderItems = area === 'column' ? loadedData.rows : loadedData.columns;
            let oppositeHeaderItem;
            let newRowItemIndexesToCurrent;
            let newColumnItemIndexesToCurrent;

            if(dataSource && dataSource.values) {
                dataSource.rows = dataSource.rows || [];
                dataSource.columns = dataSource.columns || [];
                headerItem = findHeaderItem(headerItems, path);
                oppositeHeaderItem = oppositePath && findHeaderItem(oppositeHeaderItems, oppositePath);
                if(headerItem) {
                    if(area === 'column') {
                        newColumnItemIndexesToCurrent = updateHeaderItemChildren(headerItems, headerItem, dataSource.columns, loadedData.grandTotalColumnIndex);
                        if(oppositeHeaderItem) {
                            newRowItemIndexesToCurrent = updateHeaderItemChildren(oppositeHeaderItems, oppositeHeaderItem, dataSource.rows, loadedData.grandTotalRowIndex);
                        } else {
                            newRowItemIndexesToCurrent = updateHeaderItems(loadedData.rows, dataSource.rows, loadedData.grandTotalRowIndex);
                        }
                    } else {
                        newRowItemIndexesToCurrent = updateHeaderItemChildren(headerItems, headerItem, dataSource.rows, loadedData.grandTotalRowIndex);
                        if(oppositeHeaderItem) {
                            newColumnItemIndexesToCurrent = updateHeaderItemChildren(oppositeHeaderItems, oppositeHeaderItem, dataSource.columns, loadedData.grandTotalColumnIndex);
                        } else {
                            newColumnItemIndexesToCurrent = updateHeaderItems(loadedData.columns, dataSource.columns, loadedData.grandTotalColumnIndex);
                        }
                    }
                    when(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent).done(function(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
                        if(area === 'row' && newRowItemIndexesToCurrent.length || area === 'column' && newColumnItemIndexesToCurrent.length) {
                            updateDataSourceCells(loadedData, dataSource.values, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent);
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

        dispose: function() {
            const that = this;
            const delayedLoadTask = that._delayedLoadTask;

            this._eventsStrategy.dispose();
            if(delayedLoadTask) {
                delayedLoadTask.abort();
            }
            this._isDisposed = true;
        },
        isDisposed: function() {
            return !!this._isDisposed;
        }
    };
})());
