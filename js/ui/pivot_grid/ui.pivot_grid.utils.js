import { isNumeric, isDefined, type } from '../../core/utils/type';
import coreAjaxUtils from '../../core/utils/ajax';
import { compileGetter } from '../../core/utils/data';
import { each, map } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import localizationDate from '../../localization/date';
import formatHelper from '../../format_helper';
import { DataSource } from '../../data/data_source/data_source';
import ArrayStore from '../../data/array_store';
import { when, Deferred } from '../../core/utils/deferred';

export const setFieldProperty = function(field, property, value, isInitialization) {
    const initProperties = field._initProperties = field._initProperties || {};
    const initValue = isInitialization ? value : field[property];

    if(!Object.prototype.hasOwnProperty.call(initProperties, property) || isInitialization) {
        initProperties[property] = initValue;
    }

    field[property] = value;
};

export function sendRequest(options) {
    return coreAjaxUtils.sendRequest(options);
}

let foreachTreeAsyncDate = new Date();

function createForeachTreeFunc(isAsync) {
    const foreachTreeFunc = function(items, callback, parentAtFirst, members, index, isChildrenProcessing) {
        members = members || [];
        items = items || [];

        let i;
        let deferred;

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

            const item = items[i];

            if(!isChildrenProcessing) {
                members.unshift(item);

                if(parentAtFirst && callback(members, i) === false) {
                    return;
                }

                if(item.children) {
                    const childrenDeferred = foreachTreeFunc(item.children, callback, parentAtFirst, members);
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

export const foreachTree = createForeachTreeFunc(false);
export const foreachTreeAsync = createForeachTreeFunc(true);

export function findField(fields, id) {

    if(fields && isDefined(id)) {
        for(let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if(field.name === id || field.caption === id || field.dataField === id || field.index === id) {
                return i;
            }
        }
    }
    return -1;
}

export function formatValue(value, options) {
    // because isNaN function works incorrectly with strings and undefined (T889965)
    const valueText = value === value && formatHelper.format(value, options.format);
    const formatObject = {
        value: value,
        valueText: valueText || ''
    };
    return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText;
}

export function getCompareFunction(valueSelector) {
    return function(a, b) {
        let result = 0;
        const valueA = valueSelector(a);
        const valueB = valueSelector(b);
        const aIsDefined = isDefined(valueA);
        const bIsDefined = isDefined(valueB);

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
}

export function createPath(items) {
    const result = [];
    for(let i = items.length - 1; i >= 0; i--) {
        result.push(items[i].key || items[i].value);
    }
    return result;
}

export function foreachDataLevel(data, callback, index, childrenField) {
    index = index || 0;
    childrenField = childrenField || 'children';

    if(data.length) {
        callback(data, index);
    }

    for(let i = 0; i < data.length; i++) {
        const item = data[i];
        if(item[childrenField] && item[childrenField].length) {
            foreachDataLevel(item[childrenField], callback, index + 1, childrenField);
        }
    }
}

export function mergeArraysByMaxValue(values1, values2) {
    const result = [];

    for(let i = 0; i < values1.length; i++) {
        result.push(Math.max(values1[i] || 0, values2[i] || 0));
    }
    return result;
}

export function getExpandedLevel(options, axisName) {
    const dimensions = options[axisName];
    let expandLevel = 0;
    const expandedPaths = (axisName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || [];

    if(options.headerName === axisName) {
        expandLevel = options.path.length;
    } else if(options.headerName && options.headerName !== axisName && options.oppositePath) {
        expandLevel = options.oppositePath.length;
    } else {
        each(expandedPaths, function(_, path) {
            expandLevel = Math.max(expandLevel, path.length);
        });
    }

    while(dimensions[expandLevel + 1] && dimensions[expandLevel].expanded) {
        expandLevel++;
    }

    return expandLevel;
}

function createGroupFields(item) {
    return map(['year', 'quarter', 'month'], function(value, index) {
        return extend({}, item, { groupInterval: value, groupIndex: index });
    });
}

function parseFields(dataSource, fieldsList, path, fieldsDataType) {
    const result = [];

    Object.keys(fieldsList || []).forEach(function(field) {
        if(field && field.indexOf('__') === 0) return;

        let dataIndex = 1;
        const currentPath = path.length ? path + '.' + field : field;
        let dataType = fieldsDataType[currentPath];
        const getter = compileGetter(currentPath);
        let value = fieldsList[field];
        let items;

        while(!isDefined(value) && dataSource[dataIndex]) {
            value = getter(dataSource[dataIndex]);
            dataIndex++;
        }

        if(!dataType && isDefined(value)) {
            dataType = type(value);
        }

        items = [{
            dataField: currentPath,
            dataType: dataType,
            groupName: dataType === 'date' ? field : undefined,
            groupInterval: undefined,
            displayFolder: path
        }];

        if(dataType === 'date') {
            items = items.concat(createGroupFields(items[0]));
        } else if(dataType === 'object') {
            items = parseFields(dataSource, value, currentPath, fieldsDataType);
        }

        result.push.apply(result, items);
    });

    return result;
}

export function discoverObjectFields(items, fields) {
    const fieldsDataType = getFieldsDataType(fields);
    return parseFields(items, items[0], '', fieldsDataType);
}

export function getFieldsDataType(fields) {
    const result = {};
    each(fields, function(_, field) {
        result[field.dataField] = result[field.dataField] || field.dataType;
    });
    return result;
}

const DATE_INTERVAL_FORMATS = {
    'month': function(value) {
        return localizationDate.getMonthNames()[value - 1];
    },
    'quarter': function(value) {
        return localizationDate.format(new Date(2000, value * 3 - 1), 'quarter');
    },
    'dayOfWeek': function(value) {
        return localizationDate.getDayNames()[value];
    }
};

export function setDefaultFieldValueFormatting(field) {
    if(field.dataType === 'date') {
        if(!field.format) {
            setFieldProperty(field, 'format', DATE_INTERVAL_FORMATS[field.groupInterval]);
        }
    } else if(field.dataType === 'number') {
        const groupInterval = isNumeric(field.groupInterval) && field.groupInterval > 0 && field.groupInterval;

        if(groupInterval && !field.customizeText) {
            setFieldProperty(field, 'customizeText', function(formatObject) {
                const secondValue = formatObject.value + groupInterval;
                const secondValueText = formatHelper.format(secondValue, field.format);

                return formatObject.valueText && secondValueText ? formatObject.valueText + ' - ' + secondValueText : '';
            });
        }
    }
}

export function getFiltersByPath(fields, path) {
    const result = [];
    path = path || [];

    for(let i = 0; i < path.length; i++) {
        result.push(extend({}, fields[i], {
            groupIndex: null,
            groupName: null,
            filterType: 'include',
            filterValues: [path[i]]
        }));
    }

    return result;
}

export const storeDrillDownMixin = {
    createDrillDownDataSource: function(descriptions, params) {
        const items = this.getDrillDownItems(descriptions, params);
        let arrayStore;

        function createCustomStoreMethod(methodName) {
            return function(options) {
                let d;

                if(arrayStore) {
                    d = arrayStore[methodName](options);
                } else {
                    d = new Deferred();
                    when(items).done(function(data) {
                        const arrayStore = new ArrayStore(data);
                        arrayStore[methodName](options).done(d.resolve).fail(d.reject);
                    }).fail(d.reject);
                }

                return d;
            };
        }

        const dataSource = new DataSource({
            load: createCustomStoreMethod('load'),
            totalCount: createCustomStoreMethod('totalCount'),
            key: this.key()
        });

        return dataSource;
    }
};

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
