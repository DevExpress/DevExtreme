import { isString, isDefined } from '../../core/utils/type';
import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { DataSource } from '../../data/data_source/data_source';
import { when, Deferred } from '../../core/utils/deferred';
import { getFiltersByPath,
    capitalizeFirstLetter,
    getExpandedLevel,
    discoverObjectFields,
    setDefaultFieldValueFormatting } from './ui.pivot_grid.utils';
import { deserializeDate } from '../../core/utils/date_serialization';

function createGroupingOptions(dimensionOptions, useSortOrder) {
    var groupingOptions = [];

    each(dimensionOptions, function(index, dimensionOption) {
        groupingOptions.push({
            selector: dimensionOption.dataField,
            groupInterval: dimensionOption.groupInterval,
            desc: useSortOrder && dimensionOption.sortOrder === 'desc',
            isExpanded: index < dimensionOptions.length - 1
        });
    });

    return groupingOptions;
}

function getFieldFilterSelector(field) {
    var selector = field.dataField,
        groupInterval = field.groupInterval;

    if(field.dataType === 'date' && typeof groupInterval === 'string') {
        if(groupInterval.toLowerCase() === 'quarter') {
            groupInterval = 'Month';
        }
        selector = selector + '.' + capitalizeFirstLetter(groupInterval);
    }

    return selector;
}

function getIntervalFilterExpression(selector, numericInterval, numericValue, isExcludedFilterType) {
    var startFilterValue = [selector, isExcludedFilterType ? '<' : '>=', numericValue],
        endFilterValue = [selector, isExcludedFilterType ? '>=' : '<', numericValue + numericInterval];

    return [startFilterValue, isExcludedFilterType ? 'or' : 'and', endFilterValue];
}

function getFilterExpressionForFilterValue(field, filterValue) {
    var selector = getFieldFilterSelector(field),
        isExcludedFilterType = field.filterType === 'exclude',
        expression = [selector, isExcludedFilterType ? '<>' : '=', filterValue];

    if(isDefined(field.groupInterval)) {
        if(typeof field.groupInterval === 'string' && field.groupInterval.toLowerCase() === 'quarter') {
            expression = getIntervalFilterExpression(selector, 3, (filterValue - 1) * 3 + 1, isExcludedFilterType);
        } else if(typeof field.groupInterval === 'number' && field.dataType !== 'date') {
            expression = getIntervalFilterExpression(selector, field.groupInterval, filterValue, isExcludedFilterType);
        }
    }

    return expression;
}

function createFieldFilterExpressions(field, operation) {
    var fieldFilterExpressions = [];

    if(field.searchValue) {
        return [field.dataField, 'contains', field.searchValue];
    }

    if(field.filterType === 'exclude') {
        operation = operation || 'and';
    } else {
        operation = operation || 'or';
    }

    each(field.filterValues, function(index, filterValue) {
        var currentExpression = [];

        if(Array.isArray(filterValue)) {
            var parseLevelsRecursive = field.levels && field.levels.length;

            if(parseLevelsRecursive) {
                currentExpression = createFieldFilterExpressions({
                    filterValues: filterValue,
                    filterType: field.filterType,
                    levels: field.levels
                }, 'and');
            }
        } else {
            const currentField = field.levels ? field.levels[index] : field;

            currentExpression = getFilterExpressionForFilterValue(currentField, filterValue);
        }

        if(!currentExpression.length) {
            return;
        }

        if(fieldFilterExpressions.length) {
            fieldFilterExpressions.push(operation);
        }

        fieldFilterExpressions.push(currentExpression);
    });

    return fieldFilterExpressions;
}

function createFilterExpressions(fields) {
    var filterExpressions = [];

    each(fields, function(_, field) {
        var fieldExpressions = createFieldFilterExpressions(field);

        if(!fieldExpressions.length) {
            return [];
        }

        if(filterExpressions.length) {
            filterExpressions.push('and');
        }

        filterExpressions.push(fieldExpressions);
    });

    if(filterExpressions.length === 1) {
        filterExpressions = filterExpressions[0];
    }

    return filterExpressions;
}

function mergeFilters(filter1, filter2) {
    var mergedFilter,
        notEmpty = function(filter) {
            return filter && filter.length;
        };

    if(notEmpty(filter1) && notEmpty(filter2)) {
        mergedFilter = [filter1, 'and', filter2];
    } else {
        mergedFilter = notEmpty(filter1) ? filter1 : filter2;
    }

    return mergedFilter;
}

function createLoadOptions(options, externalFilterExpr, hasRows) {
    var filterExpressions = createFilterExpressions(options.filters),
        groupingOptions = createGroupingOptions(options.rows, options.rowTake).concat(createGroupingOptions(options.columns, options.columnTake)),
        loadOptions = {
            groupSummary: [],
            totalSummary: [],
            group: groupingOptions.length ? groupingOptions : undefined,
            take: groupingOptions.length ? undefined : 1
        };

    if(options.rows.length && options.rowTake) {
        loadOptions.skip = options.rowSkip;
        loadOptions.take = options.rowTake;
        loadOptions.requireGroupCount = true;
    } else if(options.columns.length && options.columnTake && !hasRows) {
        loadOptions.skip = options.columnSkip;
        loadOptions.take = options.columnTake;
        loadOptions.requireGroupCount = true;
    }

    if(externalFilterExpr) {
        filterExpressions = mergeFilters(filterExpressions, externalFilterExpr);
    }

    if(filterExpressions.length) {
        loadOptions.filter = filterExpressions;
    }

    each(options.values, function(_, value) {
        var summaryOption = {
            selector: value.dataField,
            summaryType: value.summaryType || 'count'
        };

        loadOptions.groupSummary.push(summaryOption);
        options.includeTotalSummary && loadOptions.totalSummary.push(summaryOption);
    });

    return loadOptions;
}

function forEachGroup(data, callback, level) {

    data = data || [];
    level = level || 0;

    for(let i = 0; i < data.length; i++) {
        let group = data[i];
        callback(group, level);
        if(group && group.items && group.items.length) {
            forEachGroup(group.items, callback, level + 1);
        }
    }
}

function setValue(valuesArray, value, rowIndex, columnIndex, dataIndex) {
    valuesArray[rowIndex] = valuesArray[rowIndex] || [];
    valuesArray[rowIndex][columnIndex] = valuesArray[rowIndex][columnIndex] || [];
    if(!isDefined(valuesArray[rowIndex][columnIndex][dataIndex])) {
        valuesArray[rowIndex][columnIndex][dataIndex] = value;
    }
}

function parseValue(value, field) {
    if(field && field.dataType === 'number' && isString(value)) {
        return Number(value);
    }

    if(field && field.dataType === 'date' && !field.groupInterval && !(value instanceof Date)) {
        return deserializeDate(value);
    }

    return value;
}

function parseResult(data, total, descriptions, result) {
    var rowPath = [],
        columnPath = [],
        rowHash = result.rowHash,
        columnHash = result.columnHash;

    if(total && total.summary) {
        each(total.summary, function(index, summary) {
            setValue(result.values, summary, result.grandTotalRowIndex, result.grandTotalColumnIndex, index);
        });
    }

    if(total && total.groupCount >= 0) {
        var skip = descriptions.rows.length ? descriptions.rowSkip : descriptions.columnSkip;
        data = [...Array(skip)].concat(data);
        data.length = total.groupCount;
    }

    function getItem(dataItem, dimensionName, path, level, field) {
        var dimensionHash = result[dimensionName + 'Hash'],
            parentItem,
            parentItemChildren,
            item,
            pathValue = path.slice(0, level + 1).join('/'),
            parentPathValue;

        if(dimensionHash[pathValue] !== undefined) {
            item = dimensionHash[pathValue];
        } else {
            item = {
                value: parseValue(dataItem.key, field),
                index: result[dimensionName + 'Index']++
            };

            parentPathValue = path.slice(0, level).join('/');

            if(level > 0 && dimensionHash[parentPathValue] !== undefined) {
                parentItem = dimensionHash[parentPathValue];
                parentItemChildren = parentItem.children = parentItem.children || [];
            } else {
                parentItemChildren = result[dimensionName + 's'];
            }

            parentItemChildren.push(item);
            dimensionHash[pathValue] = item;
        }

        return item;
    }

    forEachGroup(data, function(item, level) {
        var rowLevel = level >= descriptions.rows.length ? descriptions.rows.length : level,
            columnLevel = level >= descriptions.rows.length ? level - descriptions.rows.length : 0,
            columnItem,
            rowItem;

        if(level >= descriptions.rows.length && columnLevel >= descriptions.columns.length) {
            return;
        }

        if(level < descriptions.rows.length) {
            columnPath = [];
        }

        if(level >= descriptions.rows.length) {
            if(item) {
                columnPath[columnLevel] = item.key + '';
                columnItem = getItem(item, 'column', columnPath, columnLevel, descriptions.columns[columnPath.length - 1]);
                rowItem = rowHash[rowPath.slice(0, rowLevel + 1).join('/')];
            } else {
                result.columns.push({});
            }
        } else {
            if(item) {
                rowPath[rowLevel] = item.key + '';
                rowItem = getItem(item, 'row', rowPath, rowLevel);
                columnItem = columnHash[columnPath.slice(0, columnLevel + 1).join('/')];
            } else {
                result.rows.push({});
            }
        }

        var currentRowIndex = rowItem && rowItem.index || result.grandTotalRowIndex,
            currentColumnIndex = columnItem && columnItem.index || result.grandTotalColumnIndex;

        each(item && item.summary || [], function(i, summary) {
            setValue(result.values, summary, currentRowIndex, currentColumnIndex, i);
        });
    });

    return result;
}

function getFiltersForDimension(fields) {
    return (fields || []).filter(f => f.filterValues && f.filterValues.length || f.searchValue);
}

function getExpandedIndex(options, axis) {
    if(options.headerName) {
        if(axis === options.headerName) {
            return options.path.length;
        } else if(options.oppositePath) {
            return options.oppositePath.length;
        }
    }
    return 0;
}

function getFiltersForExpandedDimension(options) {
    return getFiltersByPath(options[options.headerName], options.path).concat(
        getFiltersByPath(options[options.headerName === 'rows' ? 'columns' : 'rows'], options.oppositePath || [])
    );
}

function getExpandedPathSliceFilter(options, dimensionName, level, firstCollapsedFieldIndex) {
    var result = [],
        startSliceIndex = level > firstCollapsedFieldIndex ? 0 : firstCollapsedFieldIndex,
        fields = options.headerName !== dimensionName ? options[dimensionName].slice(startSliceIndex, level) : [],
        paths = dimensionName === 'rows' ? options.rowExpandedPaths : options.columnExpandedPaths;

    each(fields, function(index, field) {
        var filterValues = [];
        each(paths, function(_, path) {
            path = path.slice(startSliceIndex, level);
            if(index < path.length) {
                filterValues.push(path[index]);
            }
        });

        if(filterValues.length) {
            result.push(extend({}, field, {
                filterType: 'include',
                filterValues: filterValues
            }));
        }
    });

    return result;
}

function getGrandTotalRequest(options, dimensionName, expandedIndex, expandedLevel, commonFilters, firstCollapsedFieldIndex) {
    var expandedPaths = (dimensionName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || [],
        oppositeDimensionName = dimensionName === 'columns' ? 'rows' : 'columns',
        fields = options[dimensionName],
        result = [],
        newOptions;

    if(expandedPaths.length) {
        for(var i = expandedIndex; i < expandedLevel + 1; i++) {
            newOptions = {
                filters: commonFilters.concat(getExpandedPathSliceFilter(options, dimensionName, i, firstCollapsedFieldIndex))
            };
            newOptions[dimensionName] = fields.slice(expandedIndex, i + 1);
            newOptions[oppositeDimensionName] = [];

            result.push(extend({}, options, newOptions));
        }

    } else {
        newOptions = {
            filters: commonFilters
        };

        newOptions[dimensionName] = fields.slice(expandedIndex, expandedLevel + 1);
        newOptions[oppositeDimensionName] = [];
        result.push(extend({}, options, newOptions));
    }

    result[0].includeTotalSummary = true;

    return result;
}

function getFirstCollapsedIndex(fields) {
    var firstCollapsedIndex = 0;
    each(fields, function(index, field) {
        if(!field.expanded) {
            firstCollapsedIndex = index;
            return false;
        }
    });

    return firstCollapsedIndex;
}

function getRequestsData(options) {
    var rowExpandedLevel = getExpandedLevel(options, 'rows'),
        columnExpandedLevel = getExpandedLevel(options, 'columns'),
        columnTotalsOptions,
        filters = options.filters || [],
        columnExpandedIndex = getExpandedIndex(options, 'columns'),
        firstCollapsedColumnIndex = getFirstCollapsedIndex(options.columns),
        firstCollapsedRowIndex = getFirstCollapsedIndex(options.rows),
        rowExpandedIndex = getExpandedIndex(options, 'rows'),
        data = [];

    filters = filters.concat(getFiltersForDimension(options.rows))
        .concat(getFiltersForDimension(options.columns))
        .concat(getFiltersForExpandedDimension(options));

    columnTotalsOptions = getGrandTotalRequest(options, 'columns', columnExpandedIndex, columnExpandedLevel, filters, firstCollapsedColumnIndex);

    if(options.rows.length && options.columns.length) {
        if(options.headerName !== 'rows') {
            data = data.concat(columnTotalsOptions);
        }

        for(var i = rowExpandedIndex; i < rowExpandedLevel + 1; i++) {
            var rows = options.rows.slice(rowExpandedIndex, i + 1),
                rowFilterByExpandedPaths = getExpandedPathSliceFilter(options, 'rows', i, firstCollapsedRowIndex);

            for(var j = columnExpandedIndex; j < columnExpandedLevel + 1; j++) {
                var preparedOptions = extend({}, options, {
                    columns: options.columns.slice(columnExpandedIndex, j + 1),
                    rows: rows,
                    filters: filters.concat(getExpandedPathSliceFilter(options, 'columns', j, firstCollapsedColumnIndex)).concat(rowFilterByExpandedPaths)
                });

                data.push(preparedOptions);
            }
        }
    } else {
        data = options.columns.length ? columnTotalsOptions : getGrandTotalRequest(options, 'rows', rowExpandedIndex, rowExpandedLevel, filters, firstCollapsedRowIndex);
    }

    return data;
}

function prepareFields(fields) {
    each(fields || [], function(_, field) {
        var levels = field.levels;

        if(levels) {
            prepareFields(levels);
        }

        setDefaultFieldValueFormatting(field);
    });
}

module.exports = Class.inherit((function() {
    return {
        ctor: function(options) {
            this._dataSource = new DataSource(options);
            this._store = this._dataSource.store();
        },

        getFields: function(fields) {
            var d = new Deferred();

            this._store.load({
                skip: 0,
                take: 20
            }).done(function(data) {
                d.resolve(discoverObjectFields(data, fields));
            }).fail(d.reject);

            return d;
        },

        key: function() {
            return this._store.key();
        },

        load: function(options) {
            var that = this,
                d = new Deferred(),
                result = {
                    rows: [],
                    columns: [],
                    values: [
                        [[]]
                    ],
                    grandTotalRowIndex: 0,
                    grandTotalColumnIndex: 0,

                    rowHash: {},
                    columnHash: {},
                    rowIndex: 1,
                    columnIndex: 1
                },
                requestsData = getRequestsData(options),
                deferreds = [];

            prepareFields(options.rows);
            prepareFields(options.columns);
            prepareFields(options.filters);

            each(requestsData, function(_, dataItem) {
                deferreds.push(that._store.load(
                    createLoadOptions(dataItem, that.filter(), options.rows.length)
                ));
            });

            when.apply(null, deferreds).done(function() {
                var args = deferreds.length > 1 ? arguments : [arguments];

                each(args, function(index, argument) {
                    parseResult(argument[0], argument[1], requestsData[index], result);
                });

                d.resolve({
                    rows: result.rows,
                    columns: result.columns,
                    values: result.values,
                    grandTotalRowIndex: result.grandTotalRowIndex,
                    grandTotalColumnIndex: result.grandTotalColumnIndex
                });

            }).fail(d.reject);

            return d;
        },

        filter: function() {
            return this._dataSource.filter.apply(this._dataSource, arguments);
        },

        supportPaging: function() {
            return false;
        },

        createDrillDownDataSource: function(loadOptions, params) {
            loadOptions = loadOptions || {};
            params = params || {};

            var store = this._store,
                filters = getFiltersByPath(loadOptions.rows, params.rowPath)
                    .concat(getFiltersByPath(loadOptions.columns, params.columnPath))
                    .concat(getFiltersForDimension(loadOptions.rows))
                    .concat(loadOptions.filters || [])
                    .concat(getFiltersForDimension(loadOptions.columns)),

                filterExp = createFilterExpressions(filters);

            return new DataSource({
                load: function(loadOptions) {
                    return store.load(extend({}, loadOptions, {
                        filter: mergeFilters(filterExp, loadOptions.filter),
                        select: params.customColumns
                    }));
                }
            });
        }
    };
})());

///#DEBUG
module.exports.__forEachGroup = forEachGroup;
///#ENDDEBUG
