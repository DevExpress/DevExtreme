import { normalizeDataSourceOptions } from '../../data/data_source/data_source';
import Store from '../../data/abstract_store';
import { executeAsync } from '../../core/utils/common';
import { isFunction, isNumeric, isDefined, isString, isPlainObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { each, map } from '../../core/utils/iterator';
import { when, Deferred } from '../../core/utils/deferred';
import Class from '../../core/class';
import { EventsStrategy } from '../../core/events_strategy';
import { titleize } from '../../core/utils/inflector';
import { normalizeIndexes } from '../../core/utils/array';
import { LocalStore } from './local_store';
import RemoteStore from './remote_store';
import { XmlaStore } from './xmla_store/xmla_store';
import { applyDisplaySummaryMode, createMockSummaryCell, applyRunningTotal } from './ui.pivot_grid.summary_display_modes';
import {
    foreachTree,
    foreachTreeAsync,
    findField,
    formatValue,
    getCompareFunction,
    createPath,
    foreachDataLevel,
    setFieldProperty,
    getFieldsDataType
} from './ui.pivot_grid.utils';

var DESCRIPTION_NAME_BY_AREA = {
        row: 'rows',
        column: 'columns',
        data: 'values',
        filter: 'filters'
    },
    STATE_PROPERTIES = [
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
    ],
    CALCULATED_PROPERTIES = [
        'format',
        'selector',
        'customizeText',
        'caption'
    ],
    ALL_CALCULATED_PROPERTIES = CALCULATED_PROPERTIES
        .concat(['allowSorting', 'allowSortingBySummary', 'allowFiltering', 'allowExpandAll']);

function createCaption(field) {
    var caption = field.dataField || field.groupName || '',
        summaryType = (field.summaryType || '').toLowerCase();

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
    var initialProperties = field._initProperties || {};

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

module.exports = Class.inherit((function() {

    var findHeaderItem = function(headerItems, path) {
        if(headerItems._cacheByPath) {
            return headerItems._cacheByPath[path.join('.')] || null;
        }
    };

    var getHeaderItemsLastIndex = function(headerItems, grandTotalIndex) {
        var i,
            lastIndex = -1,
            headerItem;

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

    var updateHeaderItemChildren = function(headerItems, headerItem, children, grandTotalIndex) {
        var applyingHeaderItemsCount = getHeaderItemsLastIndex(children) + 1,
            emptyIndex = getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1,
            index,
            applyingItemIndexesToCurrent = [],
            needIndexUpdate = false,
            d = new Deferred();

        if(headerItem.children && headerItem.children.length === children.length) {
            for(var i = 0; i < children.length; i++) {
                var child = children[i];
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

    var updateHeaderItems = function(headerItems, newHeaderItems, grandTotalIndex) {
        var d = new Deferred(),
            emptyIndex = grandTotalIndex >= 0 && getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;

        var applyingItemIndexesToCurrent = [];

        // reset cache
        when(foreachTreeAsync(headerItems, function(items) {
            delete items[0].collapsedChildren;
        })).done(function() {
            when(foreachTreeAsync(newHeaderItems, function(newItems, index) {
                var newItem = newItems[0];
                if(newItem.index >= 0) {
                    var headerItem = findHeaderItem(headerItems, createPath(newItems));
                    if(headerItem && headerItem.index >= 0) {
                        applyingItemIndexesToCurrent[newItem.index] = headerItem.index;
                    } else if(emptyIndex) {
                        var path = createPath(newItems.slice(1));
                        headerItem = findHeaderItem(headerItems, path);

                        var parentItems = path.length ? headerItem && headerItem.children : headerItems;
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

    var updateDataSourceCells = function(dataSource, newDataSourceCells, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
        var newRowIndex,
            newColumnIndex,
            newRowCells,
            newCell,
            rowIndex,
            columnIndex,
            dataSourceCells = dataSource.values;

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
        var StoreConstructor = (dataSourceOptions.remoteOperations || dataSourceOptions.paginate) ? RemoteStore : LocalStore;

        return new StoreConstructor(extend(normalizeDataSourceOptions(dataSourceOptions), {
            onChanged: null,
            onLoadingChanged: null,
            onProgressChanged: notifyProgress
        }));
    }

    function createStore(dataSourceOptions, notifyProgress) {
        var store,
            storeOptions;

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
        for(var i = 0; i < count; i++) {
            if(!fields[i] || !prevFields[i] || fields[i].index !== prevFields[i].index) {
                return false;
            }
        }

        return true;
    }

    function getExpandedPaths(dataSource, loadOptions, dimensionName, prevLoadOptions) {
        var result = [],
            fields = (loadOptions && loadOptions[dimensionName]) || [],
            prevFields = (prevLoadOptions && prevLoadOptions[dimensionName]) || [];

        foreachTree(dataSource[dimensionName], function(items) {
            var item = items[0],
                path = createPath(items);

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
        var result = [];

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

        var result = [];

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
        var fieldsById = {},
            id;

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
        var canAddFieldInArea = area === 'data' || field.visible !== false;
        return field.area === area && !isDefined(field.groupIndex) && canAddFieldInArea;
    }

    function getFieldId(field, retrieveFieldsOptionValue) {
        var groupName = field.groupName || '';

        return (field.dataField || groupName)
            + (field.groupInterval ? groupName + field.groupInterval : 'NOGROUP')
            + (retrieveFieldsOptionValue ? '' : groupName);
    }

    function mergeFields(fields, storeFields, retrieveFieldsOptionValue) {
        var result = [],
            fieldsDictionary = {},
            removedFields = {},
            mergedGroups = [],
            dataTypes = getFieldsDataType(fields);

        if(storeFields) {
            each(storeFields, function(_, field) {
                fieldsDictionary[getFieldId(field, retrieveFieldsOptionValue)] = field;
            });

            each(fields, function(_, field) {
                var fieldKey = getFieldId(field, retrieveFieldsOptionValue),
                    storeField = fieldsDictionary[fieldKey] || removedFields[fieldKey],
                    mergedField;

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

        return result;
    }

    function getFields(that) {
        var result = new Deferred(),
            store = that._store,
            storeFields = store && store.getFields(that._fields),
            mergedFields;

        when(storeFields).done(function(storeFields) {
            that._storeFields = storeFields;
            mergedFields = mergeFields(that._fields, storeFields, that._retrieveFields);
            result.resolve(mergedFields);
        }).fail(result.reject);

        return result;
    }

    function getSliceIndex(items, path) {
        var index = null,
            pathValue = (path || []).join('.');

        if(pathValue.length) {
            foreachTree(items, function(items) {
                var item = items[0],
                    itemPath = createPath(items).join('.'),
                    textPath = map(items, function(item) { return item.text; }).reverse().join('.');

                if(pathValue === itemPath || (item.key && textPath === pathValue)) {
                    index = items[0].index;
                    return false;
                }
            });
        }

        return index;
    }

    function getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName) {
        var values = dataSource.values,
            sortBySummaryFieldIndex = findField(loadOptions.values, field.sortBySummaryField),
            areRows = dimensionName === 'rows',
            sortByDimension = areRows ? dataSource.columns : dataSource.rows,
            grandTotalIndex = areRows ? dataSource.grandTotalRowIndex : dataSource.grandTotalColumnIndex,
            sortBySummaryPath = field.sortBySummaryPath || [],
            sliceIndex = sortBySummaryPath.length ? getSliceIndex(sortByDimension, sortBySummaryPath) : grandTotalIndex;

        if(values && values.length && sortBySummaryFieldIndex >= 0 && isDefined(sliceIndex)) {
            return function(field) {
                var rowIndex = areRows ? field.index : sliceIndex,
                    columnIndex = areRows ? sliceIndex : field.index,
                    value = ((values[rowIndex] || [[]])[columnIndex] || [])[sortBySummaryFieldIndex];

                return isDefined(value) ? value : null;
            };
        }
    }

    function getMemberForSortBy(sortBy, getAscOrder) {
        var member = 'text';
        if(sortBy === 'none') {
            member = 'index';
        } else if(getAscOrder || sortBy !== 'displayText') {
            member = 'value';
        }
        return member;
    }

    function getSortingMethod(field, dataSource, loadOptions, dimensionName, getAscOrder) {
        var sortOrder = getAscOrder ? 'asc' : field.sortOrder,
            sortBy = getMemberForSortBy(field.sortBy, getAscOrder),
            defaultCompare = field.sortingMethod ? function(a, b) {
                return field.sortingMethod(a, b);
            } : getCompareFunction(function(item) { return item[sortBy]; }),
            summaryValueSelector = !getAscOrder && getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName),
            summaryCompare = summaryValueSelector && getCompareFunction(summaryValueSelector),
            sortingMethod = function(a, b) {
                var result = summaryCompare && summaryCompare(a, b) || defaultCompare(a, b);
                return sortOrder === 'desc' ? -result : result;
            };

        return sortingMethod;
    }

    function sortDimension(dataSource, loadOptions, dimensionName, getAscOrder) {
        var fields = loadOptions[dimensionName] || [],
            baseIndex = loadOptions.headerName === dimensionName ? loadOptions.path.length : 0,
            sortingMethodByLevel = [];

        foreachDataLevel(dataSource[dimensionName], function(item, index) {
            var field = fields[index] || {},
                sortingMethod = sortingMethodByLevel[index] = sortingMethodByLevel[index] || getSortingMethod(field, dataSource, loadOptions, dimensionName, getAscOrder);

            item.sort(sortingMethod);
        }, baseIndex);
    }

    function sort(loadOptions, dataSource, getAscOrder) {
        sortDimension(dataSource, loadOptions, 'rows', getAscOrder);
        sortDimension(dataSource, loadOptions, 'columns', getAscOrder);
    }

    function formatHeaderItems(data, loadOptions, headerName) {
        return foreachTreeAsync(data[headerName], function(items) {
            var item = items[0];

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
        var d = new Deferred();
        var cacheByPath = {};

        when(foreachTreeAsync(headerItems, function(items) {
            var path = createPath(items).join('.');
            cacheByPath[path] = items[0];
        })).done(d.resolve);

        headerItems._cacheByPath = cacheByPath;

        return d;
    }

    function getAreaFields(fields, area) {
        var areaFields = [];
        each(fields, function() {
            if(isAreaField(this, area)) {
                areaFields.push(this);
            }
        });
        return areaFields;
    }

    ///#DEBUG
    exports.sort = sort;
    ///#ENDDEBUG

    /**
    * @name PivotGridDataSource
    * @type object
    * @namespace DevExpress.data
    * @module ui/pivot_grid/data_source
    * @export default
    */

    return {
        ctor: function(options) {
            options = options || {};
            this._eventsStrategy = new EventsStrategy(this);

            var that = this,
                store = createStore(options, function(progress) {
                    that._eventsStrategy.fireEvent('progressChanged', [progress]);
                });

            /**
            * @name PivotGridDataSourceOptions.store
            * @type Store|StoreOptions|XmlaStore|XmlaStoreOptions|Array<Object>|Object
            */
            /**
            * @name PivotGridDataSourceOptions.store.type
            * @type Enums.PivotGridStoreType
            */
            that._store = store;
            /**
            * @name PivotGridDataSourceOptions.paginate
            * @type Boolean
            * @default false
            */
            that._paginate = !!options.paginate;
            that._pageSize = options.pageSize || 40;
            that._data = { rows: [], columns: [], values: [] };
            that._loadingCount = 0;

            that._isFieldsModified = false;

            /**
             * @name PivotGridDataSourceOptions.onChanged
             * @type function
             * @action
             */
            /**
             * @name PivotGridDataSourceOptions.onLoadingChanged
             * @type function(isLoading)
             * @type_function_param1 isLoading:boolean
             * @action
             */
            /**
             * @name PivotGridDataSourceOptions.onLoadError
             * @type function(error)
             * @type_function_param1 error:Object
             * @action
             */
            /**
             * @name PivotGridDataSourceOptions.onFieldsPrepared
             * @type function(fields)
             * @type_function_param1 fields:Array<PivotGridDataSourceOptions.fields>
             * @action
             */
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
                    var optionName = 'on' + eventName[0].toUpperCase() + eventName.slice(1);
                    if(Object.prototype.hasOwnProperty.call(options, optionName)) {
                        this.on(eventName, options[optionName]);
                    }
                }).bind(this)
            );

            /**
            * @name PivotGridDataSourceOptions.retrieveFields
            * @type boolean
            * @default true
            */
            that._retrieveFields = isDefined(options.retrieveFields) ? options.retrieveFields : true;

            /**
            * @name PivotGridDataSourceOptions.filter
            * @type Filter expression
            */
            /**
            * @name PivotGridDataSourceOptions.remoteOperations
            * @type boolean
            * @default false
            */
            /**
            * @name PivotGridDataSourceOptions.fields
            * @type Array<Object>
            * @default undefined
            */
            that._fields = options.fields || [];
            /**
            * @name PivotGridDataSourceOptions.fields.index
            * @type number
            * @default undefined
            * @hidden
            */
            /**
            * @name PivotGridDataSourceOptions.fields.dataField
            * @type string
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.caption
            * @type string
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.name
            * @type string
            * @default undefined
            */
            /**
             * @name PivotGridDataSourceOptions.fields.dataType
             * @type Enums.PivotGridDataType
             * @default undefined
             */
            /**
             * @name PivotGridDataSourceOptions.fields.groupInterval
             * @type Enums.PivotGridGroupInterval|number
             * @default undefined
             */
            /**
             * @name PivotGridDataSourceOptions.fields.summaryType
             * @type Enums.SummaryType|string
             * @default 'count'
             */
            /**
            * @name PivotGridDataSourceOptions.fields.calculateCustomSummary
            * @type function(options)
            * @type_function_param1 options:object
            * @type_function_param1_field1 summaryProcess:string
            * @type_function_param1_field2 value:any
            * @type_function_param1_field3 totalValue:any
            */
            /**
             * @name PivotGridDataSourceOptions.fields.selector
             * @type function(data)
             * @default undefined
             */
            /**
            * @name PivotGridDataSourceOptions.fields.area
            * @type Enums.PivotGridArea
            * @default undefined
            * @acceptValues undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.areaIndex
            * @type number
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.visible
            * @type boolean
            * @default true
            */
            /**
            * @name PivotGridDataSourceOptions.fields.displayFolder
            * @type string
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.groupName
            * @type string
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.groupIndex
            * @type number
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.sortOrder
            * @type Enums.SortOrder
            * @default 'asc'
            */
            /**
            * @name PivotGridDataSourceOptions.fields.sortBy
            * @type Enums.PivotGridSortBy
            * @default undefined
            */
            /**
             * @name PivotGridDataSourceOptions.fields.sortingMethod
             * @type function(a, b)
             * @type_function_param1 a:object
             * @type_function_param1_field1 value:string|number
             * @type_function_param1_field2 children:Array<any>
             * @type_function_param2 b:object
             * @type_function_param2_field1 value:string|number
             * @type_function_param2_field2 children:Array<any>
             * @type_function_return number
             * @default undefined
             */
            /**
             * @name PivotGridDataSourceOptions.fields.sortBySummaryField
             * @type string
             * @default undefined
             */
            /**
             * @name PivotGridDataSourceOptions.fields.sortBySummaryPath
             * @type Array<number,string>
             * @default undefined
            */
            /**
             * @name PivotGridDataSourceOptions.fields.filterValues
             * @type Array<any>
             * @default undefined
            */
            /**
             * @name PivotGridDataSourceOptions.fields.filterType
             * @type Enums.FilterType
             * @default 'include'
            */
            /**
             * @name PivotGridDataSourceOptions.fields.expanded
             * @type boolean
             * @default false
            */
            /**
             * @name PivotGridDataSourceOptions.fields.isMeasure
             * @type boolean
             * @default undefined
            */

            /**
             * @name PivotGridDataSourceOptions.fields.format
             * @type format
             * @default ''
             */
            /**
             * @name PivotGridDataSourceOptions.fields.customizeText
             * @type function(cellInfo)
             * @type_function_param1 cellInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 valueText:string
             * @type_function_return string
             */
            /**
             * @name PivotGridDataSourceOptions.fields.allowSorting
             * @type boolean
             * @default false
             */
            /**
             * @name PivotGridDataSourceOptions.fields.allowSortingBySummary
             * @type boolean
             * @default false
             */
            /**
             * @name PivotGridDataSourceOptions.fields.allowFiltering
             * @type boolean
             * @default false
             */
            /**
             * @name PivotGridDataSourceOptions.fields.allowExpandAll
             * @type boolean
             * @default false
             */
            /**
            * @name PivotGridDataSourceOptions.fields.width
            * @type number
            * @default undefined
            */
            /**
             * @name PivotGridDataSourceOptions.fields.summaryDisplayMode
             * @type Enums.PivotGridSummaryDisplayMode
             * @default undefined
             */
            /**
            * @name PivotGridDataSourceOptions.fields.runningTotal
            * @type Enums.PivotGridRunningTotalMode
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.wordWrapEnabled
            * @type boolean
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.allowCrossGroupCalculation
            * @type boolean
            * @default false
            */

            /**
            * @name PivotGridDataSourceOptions.fields.calculateSummaryValue
            * @type function(e)
            * @type_function_param1 e:dxPivotGridSummaryCell
            * @type_function_return number
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.showTotals
            * @type boolean
            * @default true
            */
            /**
            * @name PivotGridDataSourceOptions.fields.showGrandTotals
            * @type boolean
            * @default true
            */
            /**
            * @name PivotGridDataSourceOptions.fields.showValues
            * @type boolean
            * @default undefined
            */
            /**
            * @name PivotGridDataSourceOptions.fields.headerFilter
            * @type object
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

        /**
        * @name PivotGridDataSourceMethods.getData
        * @publicName getData()
        * @return object
        */
        getData: function() {
            return this._data;
        },

        /**
        * @name PivotGridDataSourceMethods.getAreaFields
        * @publicName getAreaFields(area, collectGroups)
        * @param1 area:string
        * @param2 collectGroups:boolean
        * @return Array<PivotGridDataSourceOptions.fields>
        */
        getAreaFields: function(area, collectGroups) {
            var areaFields = [],
                descriptions;

            if(collectGroups || area === 'data') {
                areaFields = getAreaFields(this._fields, area);
                sortFieldsByAreaIndex(areaFields);
            } else {
                descriptions = this._descriptions || {};
                areaFields = descriptions[DESCRIPTION_NAME_BY_AREA[area]] || [];
            }

            return areaFields;
        },

        /**
        * @name PivotGridDataSourceMethods.fields
        * @publicName fields()
        * @return Array<PivotGridDataSourceOptions.fields>
        */
        /**
        * @name PivotGridDataSourceMethods.fields
        * @publicName fields(fields)
        * @param1 fields:Array<PivotGridDataSourceOptions.fields>
        */
        fields: function(fields) {
            var that = this;
            if(fields) {
                that._fields = mergeFields(fields, that._storeFields, that._retrieveFields);
                that._fieldsPrepared(that._fields);
            }

            return that._fields;
        },

        /**
         * @name PivotGridDataSourceMethods.field
         * @publicName field(id)
         * @param1 id:number|string
         * @return object
         */
        /**
         * @name PivotGridDataSourceMethods.field
         * @publicName field(id, options)
         * @param1 id:number|string
         * @param2 options:object
         */
        field: function(id, options) {
            var that = this,
                fields = that._fields,
                field = fields && fields[isNumeric(id) ? id : findField(fields, id)],
                levels;

            if(field && options) {
                each(options, function(optionName, optionValue) {
                    var isInitialization = inArray(optionName, STATE_PROPERTIES) < 0;

                    setFieldProperty(field, optionName, optionValue, isInitialization);

                    if(optionName === 'sortOrder') {
                        levels = field.levels || [];
                        for(var i = 0; i < levels.length; i++) {
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
            var that = this,
                field = this._fields && this._fields[index],
                store = this.store(),
                loadFields = [],
                loadOptions = {
                    columns: loadFields,
                    rows: [],
                    values: this.getAreaFields('data'),
                    filters: applyFilters ? this._fields.filter(f => f !== field && f.area && f.filterValues && f.filterValues.length) : [],
                    skipValues: true
                },
                searchValue,
                d = new Deferred();

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

        /**
        * @name PivotGridDataSourceMethods.reload
        * @publicName reload()
        * @return Promise<any>
        */
        reload: function() {
            return this.load({ reload: true });
        },

        /**
       * @name PivotGridDataSourceMethods.filter
       * @publicName filter()
       * @return object
       */
        /**
       * @name PivotGridDataSourceMethods.filter
       * @publicName filter(filterExpr)
       * @param1 filterExpr:object
       */
        filter: function() {
            var store = this._store;

            return store.filter.apply(store, arguments);
        },

        /**
        * @name PivotGridDataSourceMethods.load
        * @publicName load()
        * @return Promise<any>
        */
        load: function(options) {
            var that = this,
                d = new Deferred();
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

        /**
        * @name PivotGridDataSourceMethods.createDrillDownDataSource
        * @publicName createDrillDownDataSource(options)
        * @param1 options:object
        * @param1_field1 columnPath:Array<string, number, Date>
        * @param1_field2 rowPath:Array<string, number, Date>
        * @param1_field3 dataIndex:number
        * @param1_field4 maxRowCount:number
        * @param1_field5 customColumns:Array<string>
        * @return DataSource
        */
        createDrillDownDataSource: function(params) {
            return this._store.createDrillDownDataSource(this._descriptions, params);
        },

        _createDescriptions: function(currentField) {
            var that = this,
                fields = that.fields(),
                descriptions = {
                    rows: [],
                    columns: [],
                    values: [],
                    filters: []
                };

            each(['row', 'column', 'data', 'filter'], function(_, areaName) {
                normalizeIndexes(getAreaFields(fields, areaName), 'areaIndex', currentField);
            });

            each(fields || [], function(_, field) {
                var descriptionName = DESCRIPTION_NAME_BY_AREA[field.area],
                    dimension = descriptions[descriptionName],
                    groupName = field.groupName;

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

            var indices = {};
            each(descriptions.values, function(_, field) {
                var expression = field.calculateSummaryValue;
                if(isFunction(expression)) {
                    var summaryCell = createMockSummaryCell(descriptions, fields, indices);
                    expression(summaryCell);
                }
            });

            return descriptions;
        },

        _fieldsPrepared: function(fields) {
            var that = this;
            that._fields = fields;
            each(fields, function(index, field) {
                field.index = index;
                updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES);
            });

            var currentFieldState = getFieldsState(fields, ['caption']);

            that._eventsStrategy.fireEvent('fieldsPrepared', [fields]);

            for(var i = 0; i < fields.length; i++) {
                if(fields[i].caption !== currentFieldState[i].caption) {
                    setFieldProperty(fields[i], 'caption', fields[i].caption, true);
                }
            }

            that._descriptions = that._createDescriptions();
        },
        /**
        * @name PivotGridDataSourceMethods.isLoading
        * @publicName isLoading()
        * @return boolean
        */
        isLoading: function() {
            return this._loadingCount > 0;
        },

        /**
        * @name PivotGridDataSourceMethods.state
        * @publicName state()
        * @return object
        */

        /**
        * @name PivotGridDataSourceMethods.state
        * @publicName state(state)
        * @param1 state:object
        */

        state: function(state, skipLoading) {
            var that = this;

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
                    columnExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'columns'),
                    rowExpandedPaths: getExpandedPaths(that._data, that._descriptions, 'rows')
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
            var oldLoading = this.isLoading(),
                newLoading;

            this._loadingCount += increment;
            newLoading = this.isLoading();

            if(oldLoading ^ newLoading) {
                this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
            }
        },

        _hasPagingValues: function(options, area, oppositeIndex) {
            var takeField = area + 'Take',
                skipField = area + 'Skip',
                values = this._data.values,
                items = this._data[area + 's'],
                oppositeArea = area === 'row' ? 'column' : 'row',
                indices = [];

            if(options.path && options.area === area) {
                let headerItem = findHeaderItem(items, options.path);
                items = headerItem && headerItem.children;
                if(!items) {
                    return false;
                }
            }
            if(options.oppositePath && options.area === oppositeArea) {
                let headerItem = findHeaderItem(items, options.oppositePath);
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
            var takeField = area + 'Take',
                skipField = area + 'Skip',
                items = this._data[area + 's'],
                oppositeArea = area === 'row' ? 'column' : 'row',
                item;

            if(options[takeField]) {
                if(options.path && options.area === area) {
                    let headerItem = findHeaderItem(items, options.path);
                    items = headerItem && headerItem.children || [];
                }
                if(options.oppositePath && options.area === oppositeArea) {
                    let headerItem = findHeaderItem(items, options.oppositePath);
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
                    var start = Math.floor(options[skipField] / pageSize) * pageSize;
                    var end = Math.ceil((options[skipField] + options[takeField]) / pageSize) * pageSize;

                    options[skipField] = start;
                    options[takeField] = end - start;
                }
            }
        },

        _processPagingCache: function(storeLoadOptions) {
            var pageSize = this._pageSize;

            if(pageSize < 0) return;

            for(let i = 0; i < storeLoadOptions.length; i++) {
                this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'row');
                this._processPagingCacheByArea(storeLoadOptions[i], pageSize, 'column');
            }
        },

        _loadCore: function(options, deferred) {
            var that = this,
                store = this._store,
                descriptions = this._descriptions,
                reload = options.reload || (this.paginate() && that._isFieldsModified),
                paginate = this.paginate(),
                headerName = DESCRIPTION_NAME_BY_AREA[options.area];

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

                let results = storeLoadOptions.map(options => store.load(options));
                when.apply(null, results).done(function() {
                    let results = arguments;
                    for(let i = 0; i < results.length; i++) {
                        var options = storeLoadOptions[i],
                            data = results[i],
                            isLast = i === results.length - 1;

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
            var store = this._store;

            if(store && !this._paginate) {
                sort(descriptions, data, getAscOrder);
            }
        },

        paginate: function() {
            return this._paginate && this._store && this._store.supportPaging();
        },

        isEmpty: function() {
            var dataFields = this.getAreaFields('data'),
                data = this.getData();
            return !dataFields.length || !data.values.length;
        },

        _update: function(deferred) {
            var that = this,
                descriptions = that._descriptions,
                loadedData = that._data,
                dataFields = descriptions.values,
                expressionsUsed = areExpressionsUsed(dataFields);

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

        /**
         * @name PivotGridDataSourceMethods.collapseHeaderItem
         * @publicName collapseHeaderItem(area, path)
         * @param1 area:string
         * @param2 path:Array<string, number, Date>
         */
        collapseHeaderItem: function(area, path) {
            var that = this,
                headerItems = area === 'column' ? that._data.columns : that._data.rows,
                headerItem = findHeaderItem(headerItems, path),
                field = that.getAreaFields(area)[path.length - 1];

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

        /**
        * @name PivotGridDataSourceMethods.collapseAll
        * @publicName collapseAll(id)
        * @param1 id:number|string
        */
        collapseAll: function(id) {
            var dataChanged = false,
                field = this.field(id) || {},
                areaOffsets = [inArray(field, this.getAreaFields(field.area))];

            field.expanded = false;
            if(field && field.levels) {
                areaOffsets = [];
                field.levels.forEach(f => {
                    areaOffsets.push(inArray(f, this.getAreaFields(field.area)));
                    f.expanded = false;
                });
            }

            foreachTree(this._data[field.area + 's'], function(items) {
                var item = items[0],
                    path = createPath(items);

                if(item && item.children && areaOffsets.indexOf(path.length - 1) !== -1) {
                    item.collapsedChildren = item.children;
                    delete item.children;
                    dataChanged = true;
                }
            }, true);

            dataChanged && this._update();
        },

        /**
        * @name PivotGridDataSourceMethods.expandAll
        * @publicName expandAll(id)
        * @param1 id:number|string
        */
        expandAll: function(id) {
            var field = this.field(id);
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

        /**
         * @name PivotGridDataSourceMethods.expandHeaderItem
         * @publicName expandHeaderItem(area, path)
         * @param1 area:string
         * @param2 path:Array<Object>
         */
        expandHeaderItem: function(area, path) {
            var that = this,
                hasCache,
                headerItems = area === 'column' ? that._data.columns : that._data.rows,
                headerItem = findHeaderItem(headerItems, path),
                options;

            if(headerItem && !headerItem.children) {
                hasCache = !!headerItem.collapsedChildren;
                options = {
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
                } else {
                    that.load(options);
                }
                return hasCache;
            }
            return false;
        },

        mergePartialDataSource: function(dataSource, deferred) {
            var that = this,
                loadedData = that._data,
                newRowItemIndexesToCurrent,
                newColumnItemIndexesToCurrent;

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
            var that = this,
                loadedData = that._data,
                headerItems = area === 'column' ? loadedData.columns : loadedData.rows,
                headerItem,
                oppositeHeaderItems = area === 'column' ? loadedData.rows : loadedData.columns,
                oppositeHeaderItem,
                newRowItemIndexesToCurrent,
                newColumnItemIndexesToCurrent;

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

        /**
         * @name PivotGridDataSourceMethods.on
         * @publicName on(eventName, eventHandler)
         * @param1 eventName:string
         * @param2 eventHandler:function
         * @return this
         */
        /**
         * @name PivotGridDataSourceMethods.on
         * @publicName on(events)
         * @param1 events:object
         * @return this
         */
        on(eventName, eventHandler) {
            this._eventsStrategy.on(eventName, eventHandler);
            return this;
        },

        /**
         * @name PivotGridDataSourceMethods.off
         * @publicName off(eventName)
         * @param1 eventName:string
         * @return this
         */
        /**
         * @name PivotGridDataSourceMethods.off
         * @publicName off(eventName, eventHandler)
         * @param1 eventName:string
         * @param2 eventHandler:function
         * @return this
         */
        off(eventName, eventHandler) {
            this._eventsStrategy.off(eventName, eventHandler);
            return this;
        },

        /**
         * @name PivotGridDataSourceMethods.dispose
         * @publicName dispose()
         */
        dispose: function() {
            var that = this,
                delayedLoadTask = that._delayedLoadTask;

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

///#DEBUG
module.exports.sort = exports.sort;
///#ENDDEBUG
