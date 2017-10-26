var Class = require("../../core/class"),
    grep = require("../../core/utils/common").grep,
    isDefined = require("../../core/utils/type").isDefined,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    deferredUtils = require("../../core/utils/deferred"),
    OldXmlaStore = require("./xmla_store"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    pivotGridUtils = require("./ui.pivot_grid.utils"),
    getFiltersByPath = pivotGridUtils.getFiltersByPath;

function setValue(valuesArray, value, rowIndex, columnIndex, dataIndex) {
    valuesArray[rowIndex] = valuesArray[rowIndex] || [];
    valuesArray[rowIndex][columnIndex] = valuesArray[rowIndex][columnIndex] || [];
    if(!isDefined(valuesArray[rowIndex][columnIndex][dataIndex])) {
        valuesArray[rowIndex][columnIndex][dataIndex] = value;
    }
}

function parseResult(data, descriptions, result) {

    function getItem(dataItem, dimensionName, path, level) {
        var dimensionHash = result[dimensionName + "Hash"],
            parentItem,
            parentItemChildren,
            item,
            pathValue = path.slice(0, level).join("/"),
            parentPathValue;

        if(dimensionHash[pathValue] !== undefined) {
            item = dimensionHash[pathValue];
        } else {
            item = extend({}, dataItem);
            if(item.children) {
                item.children = null;
            }
            item.index = result[dimensionName + "Index"]++;

            parentPathValue = path.slice(0, level - 1).join("/");

            if(level > 0 && dimensionHash[parentPathValue] !== undefined) {
                parentItem = dimensionHash[parentPathValue];
                parentItemChildren = parentItem.children = parentItem.children || [];
            } else {
                parentItemChildren = result[dimensionName + "s"];
            }

            parentItemChildren.push(item);
            dimensionHash[pathValue] = item;
        }

        return item;
    }

    if(data.grandTotalRowIndex >= 0 && data.grandTotalColumnIndex >= 0) {
        ((data.values[data.grandTotalRowIndex] || [])[data.grandTotalColumnIndex] || []).forEach((v, i) => {
            setValue(result.values, v, result.grandTotalRowIndex, result.grandTotalColumnIndex, i);
        });
    }

    if(data.rowCount >= 0) {
        result.rowCount = data.rowCount;
    }

    if(data.columnCount >= 0) {
        result.columnCount = data.columnCount;
    }

    const columnElements = data.columns;
    const rowElements = data.rows;

    if(!data.rows.length) {
        pivotGridUtils.foreachTree(columnElements, (columnItems) => {
            const columnPath = pivotGridUtils.createPath(columnItems);
            const columnItem = getItem(columnItems[0], "column", columnPath, columnPath.length);

            data.values[data.grandTotalRowIndex][columnItems[0].index].forEach((value, index) => {
                setValue(result.values, value, data.grandTotalRowIndex, columnItem.index, index);
            });
        }, true);
    } else {
        pivotGridUtils.foreachTree(rowElements, (rowItems) => {
            const rowPath = pivotGridUtils.createPath(rowItems);
            const rowItem = getItem(rowItems[0], "row", rowPath, rowPath.length);

            pivotGridUtils.foreachTree(columnElements, (columnItems) => {
                const columnPath = pivotGridUtils.createPath(columnItems);
                const columnItem = getItem(columnItems[0], "column", columnPath, columnPath.length);

                data.values[rowItems[0].index][columnItems[0].index].forEach((value, index) => {
                    setValue(result.values, value, rowItem.index, columnItem.index, index);
                });
            });
            (data.values[rowItems[0].index][data.grandTotalColumnIndex] || []).forEach((value, index) => {
                setValue(result.values, value, rowItem.index, data.grandTotalColumnIndex, index);
            });
        }, true);
    }


    return result;
}

function getFiltersForDimension(dimensionOptions) {
    return grep(dimensionOptions || [], function(field) {
        return field.filterValues && field.filterValues.length;
    });
}

function getExpandedIndex(options, axis) {
    if(axis === options.headerName) {
        return options.path.length;
    }
    return 0;
}

function getFiltersForExpandedDimension(options) {
    return fixFilters({ filters: getFiltersByPath(options[options.headerName], options.path) }).filters.map(f => {
        if(f.hierarchyName) {
            f.filterValues = [f.filterValues];
        }
        return f;
    });
}

function getExpandedPathSliceFilter(options, dimensionName, level, firstCollapsedFieldIndex) {
    var result = [],
        startSliceIndex = level > firstCollapsedFieldIndex ? 0 : firstCollapsedFieldIndex,
        fields = options.headerName !== dimensionName ? options[dimensionName].slice(startSliceIndex, level) : [],
        paths = dimensionName === "rows" ? options.rowExpandedPaths : options.columnExpandedPaths;

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
                filterType: "include",
                filterValues: filterValues
            }));
        }
    });

    return result;
}

function getGrandTotalRequest(options, dimensionName, expandedIndex, expandedLevel, commonFilters, firstCollapsedFieldIndex) {
    var expandedPaths = (dimensionName === "columns" ? options.columnExpandedPaths : options.rowExpandedPaths) || [],
        oppositeDimensionName = dimensionName === "columns" ? "rows" : "columns",
        fields = options[dimensionName],
        result = [],
        newOptions;

    if(expandedPaths.length) {
        for(var i = expandedIndex; i < expandedLevel + 1; i++) {
            newOptions = {
                filters: commonFilters.concat(getExpandedPathSliceFilter(options, dimensionName, i, firstCollapsedFieldIndex)),
                rowExpandedPaths: null,
                columnExpandedPaths: null,
                headerName: null,
                path: null
            };
            newOptions[dimensionName] = fields.slice(expandedIndex, i + 1).map(f => extend({}, f, { expanded: true }));
            newOptions[oppositeDimensionName] = [];

            if(i === expandedLevel) {
                newOptions.includeTotalSummary = true;
            }

            result.push(extend({}, options, newOptions));
        }

    } else {
        newOptions = {
            filters: commonFilters,
            includeTotalSummary: true,
            rowExpandedPaths: null,
            columnExpandedPaths: null,
            headerName: null,
            path: null
        };

        newOptions[dimensionName] = fields.slice(expandedIndex, expandedLevel + 1).map(f => extend({}, f, { expanded: true }));
        newOptions[oppositeDimensionName] = [];
        result.push(extend({}, options, newOptions));
    }

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

function fixFilters(options) {
    const dictionary = {};

    options.filters = options.filters.reduce((filters, field) => {
        const id = field.hierarchyName ? field.hierarchyName : field.dataField;
        if(dictionary[id]) {
            extend(dictionary[id], {
                filterValues: dictionary[id].filterValues.concat(field.filterValues).filter((v, i, a) => a.indexOf(v) === i)
            });
        } else {
            filters.push(field);
            dictionary[id] = field;
        }

        return filters;
    }, []).map(field => {
        if(field.hierarchyName) {
            return extend({}, field, { dataField: field.hierarchyName });
        }
        return field;
    });

    return options;
}

function getRequestsData(options) {
    options.rows = options.rows || [];
    options.columns = options.columns || [];
    options.filters = options.filters || [];

    var rowExpandedLevel = pivotGridUtils.getExpandedLevel(options, "rows"),
        columnExpandedLevel = pivotGridUtils.getExpandedLevel(options, "columns"),
        columnTotalsOptions,
        filters = options.filters,
        columnExpandedIndex = getExpandedIndex(options, "columns"),
        firstCollapsedColumnIndex = getFirstCollapsedIndex(options.columns),
        firstCollapsedRowIndex = getFirstCollapsedIndex(options.rows),
        rowExpandedIndex = getExpandedIndex(options, "rows"),
        data = [];

    filters = filters.concat(getFiltersForDimension(options.rows))
        .concat(getFiltersForDimension(options.columns))
        .concat(getFiltersForExpandedDimension(options));

    columnTotalsOptions = getGrandTotalRequest(options, "columns", columnExpandedIndex, columnExpandedLevel, filters, firstCollapsedColumnIndex);

    if(options.rows.length && options.columns.length) {
        data = data.concat(columnTotalsOptions);

        for(var i = rowExpandedIndex; i < rowExpandedLevel + 1; i++) {
            const rows = options.rows.slice(rowExpandedIndex, i + 1).map(f => extend({}, f, { expanded: true }));

            const rowFilterByExpandedPaths = getExpandedPathSliceFilter(options, "rows", i, firstCollapsedRowIndex);

            for(var j = columnExpandedIndex; j < columnExpandedLevel + 1; j++) {
                const columns = options.columns.slice(columnExpandedIndex, j + 1).map(f => extend({}, f, { expanded: true }));
                var preparedOptions = extend({}, options, {
                    columns,
                    rows,
                    columnExpandedPaths: null,
                    rowExpandedPaths: null,
                    headerName: null,
                    path: null,
                    filters: filters.concat(getExpandedPathSliceFilter(options, "columns", j, firstCollapsedColumnIndex)).concat(rowFilterByExpandedPaths)
                });

                data.push(preparedOptions);
            }
        }
    } else {
        data = options.columns.length ? columnTotalsOptions : getGrandTotalRequest(options, "rows", rowExpandedIndex, rowExpandedLevel, filters, firstCollapsedRowIndex);
    }

    return data.map(fixFilters);
}


module.exports = Class.inherit((function() {
    return {
        ctor: function(options) {
            this._store = new OldXmlaStore(options);
        },

        getFields: function() {
            return this._store.getFields();
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
                    values: [],
                    grandTotalRowIndex: 0,
                    grandTotalColumnIndex: 0,

                    rowHash: {},
                    columnHash: {},
                    rowIndex: 1,
                    columnIndex: 1
                },
                requestsData = getRequestsData(options),
                deferreds = [];

            requestsData.forEach((loadOptions, index) => {
                if(index > 2) {
                    loadOptions.delay = Math.random() * 70;
                }
                deferreds.push(that._store.load(loadOptions));
            });

            when.apply(null, deferreds).done(function() {
                var args = arguments;

                each(args, function(index, argument) {
                    parseResult(argument, requestsData[index], result);
                });

                let rows = result.rows;
                if(result.rowCount !== undefined) {
                    rows = [...Array(options.rowSkip)].concat(result.rows);
                    rows.length = result.rowCount;

                    for(let i = 0; i < rows.length; i++) {
                        rows[i] = rows[i] || {};
                    }
                }

                let columns = result.columns;
                if(result.columnCount !== undefined) {
                    columns = [...Array(options.columnSkip)].concat(result.columns);
                    columns.length = result.columnCount;

                    for(let i = 0; i < columns.length; i++) {
                        columns[i] = columns[i] || {};
                    }
                }

                d.resolve({
                    rows,
                    columns,
                    values: result.values,
                    grandTotalRowIndex: result.grandTotalRowIndex,
                    grandTotalColumnIndex: result.grandTotalColumnIndex
                });

            }).fail(d.reject);

            return d;
        },

        filter: function() {
            this._store.filter.apply(this._store, arguments);
        },

        supportSorting: function() {
            return false;
        },

        getDrillDownItems(loadOptions, params) {
            return this._store.getDrillDownItems(loadOptions, params);
        },

        createDrillDownDataSource(loadOptions, params) {
            return this._store.createDrillDownDataSource(loadOptions, params);
        }
    };
})());
