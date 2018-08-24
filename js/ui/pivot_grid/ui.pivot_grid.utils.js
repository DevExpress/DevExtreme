var typeUtils = require("../../core/utils/type"),
    ajax = require("../../core/utils/ajax"),
    dataCoreUtils = require("../../core/utils/data"),
    iteratorUtils = require("../../core/utils/iterator"),
    extend = require("../../core/utils/extend").extend,
    isDefined = require("../../core/utils/type").isDefined,
    dateLocalization = require("../../localization/date"),
    formatHelper = require("../../format_helper"),
    DataSourceModule = require("../../data/data_source/data_source"),
    ArrayStore = require("../../data/array_store"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

var setFieldProperty = exports.setFieldProperty = function(field, property, value, isInitialization) {
    var initProperties = field._initProperties = field._initProperties || {},
        initValue = isInitialization ? value : field[property];

    if(!initProperties.hasOwnProperty(property) || isInitialization) {
        initProperties[property] = initValue;
    }

    field[property] = value;
};

exports.sendRequest = function(options) {
    return ajax.sendRequest(options);
};

var foreachTreeAsyncDate = new Date();

function createForeachTreeFunc(isAsync) {
    var foreachTreeFunc = function(items, callback, parentAtFirst, members, index, isChildrenProcessing) {
        members = members || [];
        items = items || [];

        var item,
            i,
            deferred,
            childrenDeferred;

        index = index || 0;

        function createForeachTreeAsyncHandler(deferred, i, isChildrenProcessing) {
            when(foreachTreeFunc(items, callback, parentAtFirst, members, i, isChildrenProcessing)).done(deferred.resolve);
        }

        for(i = index; i < items.length; i++) {

            if(isAsync && i > index && i % 10000 === 0 && (new Date() - foreachTreeAsyncDate >= 300)) {
                foreachTreeAsyncDate = new Date();
                deferred = new Deferred();
                setTimeout(createForeachTreeAsyncHandler(deferred, i, false), 0);

                return deferred;
            }

            item = items[i];

            if(!isChildrenProcessing) {
                members.unshift(item);

                if(parentAtFirst && callback(members, i) === false) {
                    return;
                }

                if(item.children) {
                    childrenDeferred = foreachTreeFunc(item.children, callback, parentAtFirst, members);
                    if(isAsync && childrenDeferred) {
                        deferred = new Deferred();
                        childrenDeferred.done(createForeachTreeAsyncHandler(deferred, i, true));
                        return deferred;
                    }
                }
            }

            isChildrenProcessing = false;


            if(!parentAtFirst && callback(members, i) === false) {
                return;
            }

            members.shift();

            if(items[i] !== item) {
                i--;
            }
        }
    };
    return foreachTreeFunc;
}

exports.foreachTree = createForeachTreeFunc(false);

exports.foreachTreeAsync = createForeachTreeFunc(true);

exports.findField = function(fields, id) {
    var i,
        field;

    if(fields && typeUtils.isDefined(id)) {
        for(i = 0; i < fields.length; i++) {
            field = fields[i];
            if(field.name === id || field.caption === id || field.dataField === id || field.index === id) {
                return i;
            }
        }
    }
    return -1;
};

exports.formatValue = function(value, options) {
    var formatObject = {
        value: value,
        valueText: formatHelper.format(value, options.format) || ''
    };
    return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText;
};

exports.getCompareFunction = function(valueSelector) {
    return function(a, b) {
        var result = 0,
            valueA = valueSelector(a),
            valueB = valueSelector(b),
            aIsDefined = isDefined(valueA),
            bIsDefined = isDefined(valueB);

        if(aIsDefined && bIsDefined) {
            if(valueA > valueB) {
                result = 1;
            } else if(valueA < valueB) {
                result = -1;
            }
        }

        if(aIsDefined && !bIsDefined) {
            result = 1;
        }

        if(!aIsDefined && bIsDefined) {
            result = -1;
        }

        return result;
    };
};

exports.createPath = function(items) {
    var result = [],
        i;
    for(i = items.length - 1; i >= 0; i--) {
        result.push(items[i].key || items[i].value);
    }
    return result;
};

exports.foreachDataLevel = function foreachDataLevel(data, callback, index, childrenField) {
    var item,
        i;
    index = index || 0;
    childrenField = childrenField || "children";

    if(data.length) {
        callback(data, index);
    }

    for(i = 0; i < data.length; i++) {
        item = data[i];
        if(item[childrenField] && item[childrenField].length) {
            foreachDataLevel(item[childrenField], callback, index + 1, childrenField);
        }
    }
};


exports.mergeArraysByMaxValue = function(values1, values2) {
    var result = [],
        i;

    for(i = 0; i < values1.length; i++) {
        result.push(Math.max(values1[i] || 0, values2[i] || 0));
    }
    return result;
};

exports.getExpandedLevel = function(options, axisName) {
    var dimensions = options[axisName],
        expandLevel = 0,
        expandedPaths = (axisName === "columns" ? options.columnExpandedPaths : options.rowExpandedPaths) || [];

    if(options.headerName === axisName) {
        expandLevel = options.path.length;
    } else {
        iteratorUtils.each(expandedPaths, function(_, path) {
            expandLevel = Math.max(expandLevel, path.length);
        });
    }

    while(dimensions[expandLevel + 1] && dimensions[expandLevel].expanded) {
        expandLevel++;
    }

    return expandLevel;
};

function createGroupFields(item) {
    return iteratorUtils.map(["year", "quarter", "month"], function(value, index) {
        return extend({}, item, { groupInterval: value, groupIndex: index });
    });
}

function parseFields(dataSource, fieldsList, path, fieldsDataType) {
    var result = [];

    iteratorUtils.each(fieldsList || [], function(field, value) {
        if(field && field.indexOf("__") === 0) return;

        var dataIndex = 1,
            currentPath = path.length ? path + "." + field : field,
            dataType = fieldsDataType[currentPath],
            getter = dataCoreUtils.compileGetter(currentPath),
            items;

        while(!typeUtils.isDefined(value) && dataSource[dataIndex]) {
            value = getter(dataSource[dataIndex]);
            dataIndex++;
        }

        if(!dataType && typeUtils.isDefined(value)) {
            dataType = typeUtils.type(value);
        }

        items = [{
            dataField: currentPath,
            dataType: dataType,
            groupName: dataType === "date" ? field : undefined,
            groupInterval: undefined,
            displayFolder: path
        }];

        if(dataType === "date") {
            items = items.concat(createGroupFields(items[0]));
        } else if(dataType === "object") {
            items = parseFields(dataSource, value, currentPath, fieldsDataType);
        }

        result.push.apply(result, items);
    });

    return result;
}

exports.discoverObjectFields = function(items, fields) {
    var fieldsDataType = exports.getFieldsDataType(fields);
    return parseFields(items, items[0], "", fieldsDataType);
};

exports.getFieldsDataType = function(fields) {
    var result = {};
    iteratorUtils.each(fields, function(_, field) {
        result[field.dataField] = result[field.dataField] || field.dataType;
    });
    return result;
};

var DATE_INTERVAL_FORMATS = {
    'month': function(value) {
        return dateLocalization.getMonthNames()[value - 1];
    },
    'quarter': function(value) {
        return dateLocalization.format(new Date(2000, value * 3 - 1), 'quarter');
    },
    'dayOfWeek': function(value) {
        return dateLocalization.getDayNames()[value];
    }
};

exports.setDefaultFieldValueFormatting = function(field) {
    if(field.dataType === 'date') {
        if(!field.format) {
            setFieldProperty(field, "format", DATE_INTERVAL_FORMATS[field.groupInterval]);
        }
    } else if(field.dataType === 'number') {
        var groupInterval = typeUtils.isNumeric(field.groupInterval) && field.groupInterval > 0 && field.groupInterval;

        if(groupInterval && !field.customizeText) {
            setFieldProperty(field, "customizeText", function(formatObject) {
                var secondValue = formatObject.value + groupInterval,
                    secondValueText = formatHelper.format(secondValue, field.format);

                return formatObject.valueText && secondValueText ? formatObject.valueText + " - " + secondValueText : "";
            });
        }
    }
};

exports.getFiltersByPath = function(fields, path) {
    var result = [];
    path = path || [];

    for(var i = 0; i < path.length; i++) {
        result.push(extend({}, fields[i], {
            groupIndex: null,
            groupName: null,
            filterType: "include",
            filterValues: [path[i]]
        }));
    }

    return result;
};

exports.storeDrillDownMixin = {
    createDrillDownDataSource: function(descriptions, params) {
        function createCustomStoreMethod(methodName) {
            return function(options) {
                var d;

                if(arrayStore) {
                    d = arrayStore[methodName](options);
                } else {
                    d = new Deferred();
                    when(items).done(function(data) {
                        arrayStore = new ArrayStore(data);
                        arrayStore[methodName](options).done(d.resolve).fail(d.reject);
                    }).fail(d.reject);
                }

                return d;
            };
        }

        var items = this.getDrillDownItems(descriptions, params),
            arrayStore,
            dataSource = new DataSourceModule.DataSource({
                load: createCustomStoreMethod("load"),
                totalCount: createCustomStoreMethod("totalCount"),
                key: this.key()
            });

        return dataSource;
    }
};

exports.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
