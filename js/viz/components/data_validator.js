const typeUtils = require('../../core/utils/type');

const STRING = 'string';
const NUMERIC = 'numeric';
const DATETIME = 'datetime';
const DISCRETE = 'discrete';
const SEMIDISCRETE = 'semidiscrete';
const CONTINUOUS = 'continuous';
const LOGARITHMIC = 'logarithmic';
const VALUE_TYPE = 'valueType';
const ARGUMENT_TYPE = 'argumentType';

const extend = require('../../core/utils/extend').extend;
const axisTypeParser = require('../core/utils').enumParser([STRING, NUMERIC, DATETIME]);
const _getParser = require('./parse_utils').getParser;

const _isDefined = typeUtils.isDefined;
const _isFunction = typeUtils.isFunction;
const _isArray = Array.isArray;
const _isString = typeUtils.isString;
const _isDate = typeUtils.isDate;
const _isNumber = typeUtils.isNumeric;
const _isObject = typeUtils.isObject;

function groupingValues(data, others, valueField, index) {
    if(index >= 0) {
        data.slice(index).forEach(function(cell) {
            if(_isDefined(cell[valueField])) {
                others[valueField] += cell[valueField];
                cell[valueField] = undefined;
            }
        });
    }
}

function processGroups(groups) {
    groups.forEach(function(group) {
        group.valueType = group.valueAxisType = null;
        group.series.forEach(function(series) {
            series.updateDataType({});
        });
        group.valueAxis && group.valueAxis.resetTypes(VALUE_TYPE);
    });
}

function sortValues(data, asc, selector) {
    const func = asc ? function(a, b) { return a - b; } : function(a, b) { return b - a; };
    data.sort(function(a, b) {
        const valA = selector(a);
        const valB = selector(b);
        const aa = _isDefined(valA) ? 1 : 0;
        const bb = _isDefined(valB) ? 1 : 0;
        return aa && bb ? func(valA, valB) : func(aa, bb);
    });
    return data;
}

function resetArgumentAxes(axes) {
    axes && axes.forEach(function(axis) {
        axis.resetTypes(ARGUMENT_TYPE);
    });
}

function parseCategories(categories, parser) {
    const newArray = [];

    categories.forEach(function(category) {
        const parsedCategory = parser(category);
        parsedCategory !== undefined && newArray.push(parsedCategory);
    });
    return newArray;
}

function parseAxisCategories(groupsData, parsers) {
    const argumentCategories = groupsData.argumentOptions && groupsData.argumentOptions.categories;

    groupsData.groups.forEach(function(valueGroup, i) {
        const categories = valueGroup.valueOptions && valueGroup.valueOptions.categories;
        if(categories) {
            valueGroup.valueOptions.categories = parseCategories(categories, parsers[i + 1]);
        }
    });

    if(argumentCategories) {
        groupsData.argumentOptions.categories = parseCategories(argumentCategories, parsers[0]);
    }
}

function eigen(x) {
    return x;
}

function getType(unit, type) {
    let result = type;
    if(type === STRING || _isString(unit)) {
        result = STRING;
    } else if(type === DATETIME || _isDate(unit)) {
        result = DATETIME;
    } else if(_isNumber(unit)) {
        result = NUMERIC;
    }
    return result;
}

function correctAxisType(type, axisType, hasCategories, incidentOccurred) {
    if(type === STRING && (axisType === CONTINUOUS || axisType === LOGARITHMIC || axisType === SEMIDISCRETE)) {
        incidentOccurred('E2002');
    }
    return axisType === LOGARITHMIC ? LOGARITHMIC : (hasCategories || axisType === DISCRETE || type === STRING ? DISCRETE : (axisType === SEMIDISCRETE ? SEMIDISCRETE : CONTINUOUS));
}

// Do we really need this one if all it is only for logarithmic case?
function validUnit(unit, field, incidentOccurred) {
    if(unit) {
        incidentOccurred(!_isNumber(unit) && !_isDate(unit) && !_isString(unit) ? 'E2003' : 'E2004', [field]);
    }
}

function createParserUnit(type, axisType, incidentOccurred) {
    const parser = type ? _getParser(type) : eigen;
    const filterInfinity = axisType !== DISCRETE ? function(x) { return isFinite(x) || x === undefined ? x : null; } : eigen;

    return function(unit, field) {
        const parseUnit = filterInfinity(parser(unit));

        if(parseUnit === undefined) {
            validUnit(unit, field, incidentOccurred);
        }
        return parseUnit;
    };
}

function prepareParsers(groupsData, incidentOccurred) {
    const argumentParser = createParserUnit(groupsData.argumentType, groupsData.argumentAxisType, incidentOccurred);
    let sizeParser;
    let valueParser;
    const categoryParsers = [argumentParser];
    const cache = {};
    const list = [];

    groupsData.groups.forEach(function(group, groupIndex) {
        group.series.forEach(function(series) {
            valueParser = createParserUnit(group.valueType, group.valueAxisType, incidentOccurred);
            sizeParser = createParserUnit(NUMERIC, CONTINUOUS, incidentOccurred);

            cache[series.getArgumentField()] = argumentParser;
            series.getValueFields().forEach(function(field) {
                categoryParsers[groupIndex + 1] = valueParser;
                cache[field] = valueParser;
            });

            if(series.getSizeField()) {
                cache[series.getSizeField()] = sizeParser;
            }
        });
    });
    for(const field in cache) {
        list.push([field, cache[field]]);
    }

    list.length && parseAxisCategories(groupsData, categoryParsers);

    return list;
}

function getParsedCell(cell, parsers) {
    let i;
    const ii = parsers.length;
    const obj = extend({}, cell);
    let field;
    let value;
    for(i = 0; i < ii; ++i) {
        field = parsers[i][0];
        value = cell[field];
        obj[field] = parsers[i][1](value, field);
    }
    return obj;
}

function parse(data, parsers) {
    const parsedData = [];
    let i;
    const ii = data.length;
    parsedData.length = ii;
    for(i = 0; i < ii; ++i) {
        parsedData[i] = getParsedCell(data[i], parsers);
    }
    return parsedData;
}

function findIndexByThreshold(data, valueField, threshold) {
    let i;
    const ii = data.length;
    let value;
    for(i = 0; i < ii; ++i) {
        value = data[i][valueField];
        if(_isDefined(value) && threshold > value) {
            break;
        }
    }
    return i;
}

function groupMinSlices(originalData, argumentField, valueField, smallValuesGrouping) {
    smallValuesGrouping = smallValuesGrouping || {};

    const mode = smallValuesGrouping.mode;
    const others = {};
    let data;

    if(!mode || mode === 'none') { return; }
    others[argumentField] = String(smallValuesGrouping.groupName || 'others');
    others[valueField] = 0;

    data = sortValues(originalData.slice(), false, function(a) { return a[valueField]; });

    groupingValues(data, others, valueField, mode === 'smallValueThreshold' ? findIndexByThreshold(data, valueField, smallValuesGrouping.threshold) : smallValuesGrouping.topCount);

    others[valueField] && originalData.push(others);
}

function groupPieData(data, groupsData) {
    const firstSeries = groupsData.groups[0] && groupsData.groups[0].series[0];
    const isPie = firstSeries && (firstSeries.type === 'pie' || firstSeries.type === 'doughnut' || firstSeries.type === 'donut');

    if(!isPie) { return; }

    groupsData.groups.forEach(function(group) {
        group.series.forEach(function(series) {
            groupMinSlices(data, series.getArgumentField(), series.getValueFields()[0], series.getOptions().smallValuesGrouping);
        });
    });
}

function addUniqueItemToCollection(item, collection, itemsHash) {
    if(!itemsHash[item]) {
        collection.push(item);
        itemsHash[item] = true;
    }
}

function getUniqueArgumentFields(groupsData) {
    const uniqueArgumentFields = [];
    const hash = {};

    groupsData.groups.forEach(function(group) {
        group.series.forEach(function(series) {
            addUniqueItemToCollection(series.getArgumentField(), uniqueArgumentFields, hash);
        });
    });

    return uniqueArgumentFields;
}

function sort(a, b) {
    const result = a - b;

    if(isNaN(result)) {
        if(!_isDefined(a)) {
            return 1;
        }
        if(!_isDefined(b)) {
            return -1;
        }
        return 0;
    }

    return result;
}

function sortByArgument(data, argumentField) {
    return data.slice().sort(function(a, b) {
        return sort(a[argumentField], b[argumentField]);
    });
}

function sortByCallback(data, callback) {
    return data.slice().sort(callback);
}

function checkValueTypeOfGroup(group, cell) {
    group.series.forEach(function(series) {
        series.getValueFields().forEach(function(field) {
            group.valueType = getType(cell[field], group.valueType);
        });
    });

    return group.valueType;
}

function getSortByCategories(categories) {
    const hash = {};

    categories.forEach(function(value, i) {
        hash[value] = i;
    });

    return function(data, argumentField) {
        return sortValues(data.slice(), true, function(a) { return hash[a[argumentField]]; });
    };
}

function sortData(data, groupsData, options, uniqueArgumentFields) {
    const dataByArguments = {};
    const isDiscrete = groupsData.argumentAxisType === DISCRETE;
    const userCategories = isDiscrete && groupsData.argumentOptions && groupsData.argumentOptions.categories;
    let sortFunction = function(data) { return data; };
    const sortingMethodOption = options.sortingMethod;
    let reSortCategories;

    if(!userCategories && _isFunction(sortingMethodOption)) {
        data = sortByCallback(data, sortingMethodOption);
    }
    if(isDiscrete) {
        groupsData.categories = getCategories(data, uniqueArgumentFields, userCategories);
    }

    if(userCategories || (!_isFunction(sortingMethodOption) && groupsData.argumentType === STRING && !options._skipArgumentSorting)) {
        sortFunction = getSortByCategories(groupsData.categories);
    } else if(sortingMethodOption === true && groupsData.argumentType !== STRING) {
        sortFunction = sortByArgument;
        reSortCategories = isDiscrete;
    }

    uniqueArgumentFields.forEach(function(field) {
        dataByArguments[field] = sortFunction(data, field);
    });

    if(reSortCategories) {
        groupsData.categories = groupsData.categories.sort(sort);
    }

    return dataByArguments;
}

function checkItemExistence(collection, item) {
    return collection.map(function(collectionItem) { return collectionItem.valueOf(); }).indexOf(item.valueOf()) === -1;
}

function getCategories(data, uniqueArgumentFields, userCategories) {
    const categories = userCategories ? userCategories.slice() : [];

    uniqueArgumentFields.forEach(function(field) {
        data.forEach(function(item) {
            const dataItem = item[field];

            _isDefined(dataItem) && checkItemExistence(categories, dataItem) && categories.push(dataItem);
        });
    });
    return categories;
}

function checkArgumentTypeOfGroup(series, cell, groupsData) {
    series.forEach(function(currentSeries) {
        groupsData.argumentType = getType(cell[currentSeries.getArgumentField()], groupsData.argumentType);
    });
    return groupsData.argumentType;
}

function checkType(data, groupsData, checkTypeForAllData) {
    const groupsWithUndefinedValueType = [];
    const groupsWithUndefinedArgumentType = [];
    const argumentTypeGroup = groupsData.argumentOptions && axisTypeParser(groupsData.argumentOptions.argumentType);
    let groupsIndexes;

    groupsData.groups.forEach(function(group) {
        if(!group.series.length) {
            return;
        }

        const valueTypeGroup = group.valueOptions && axisTypeParser(group.valueOptions.valueType);

        group.valueType = valueTypeGroup;
        groupsData.argumentType = argumentTypeGroup;
        !valueTypeGroup && groupsWithUndefinedValueType.push(group);
        !argumentTypeGroup && groupsWithUndefinedArgumentType.push(group);
    });

    if(groupsWithUndefinedValueType.length || groupsWithUndefinedArgumentType.length) {
        groupsIndexes = groupsWithUndefinedValueType.map(function(_, index) {
            return index;
        });
        data.some(function(cell) {
            let defineArg;

            groupsWithUndefinedValueType.forEach(function(group, groupIndex) {
                if(checkValueTypeOfGroup(group, cell) && groupsIndexes.indexOf(groupIndex) >= 0) {
                    groupsIndexes.splice(groupIndex, 1);
                }
            });

            if(!defineArg) {
                groupsWithUndefinedArgumentType.forEach(function(group) {
                    defineArg = checkArgumentTypeOfGroup(group.series, cell, groupsData);
                });
            }

            if(!checkTypeForAllData && defineArg && groupsIndexes.length === 0) {
                return true;
            }
        });
    }
}

function checkAxisType(groupsData, incidentOccurred) {
    const argumentOptions = groupsData.argumentOptions || {};
    const userArgumentCategories = (argumentOptions && argumentOptions.categories) || [];
    const argumentAxisType = correctAxisType(groupsData.argumentType, argumentOptions.type, !!(userArgumentCategories.length), incidentOccurred);

    groupsData.groups.forEach(function(group) {
        const valueOptions = group.valueOptions || {};
        const valueCategories = valueOptions.categories || [];
        const valueAxisType = correctAxisType(group.valueType, valueOptions.type, !!(valueCategories.length), incidentOccurred);

        group.series.forEach(function(series) {
            const optionsSeries = {};

            optionsSeries.argumentAxisType = argumentAxisType;
            optionsSeries.valueAxisType = valueAxisType;
            groupsData.argumentAxisType = groupsData.argumentAxisType || optionsSeries.argumentAxisType;
            group.valueAxisType = group.valueAxisType || optionsSeries.valueAxisType;
            optionsSeries.argumentType = groupsData.argumentType;
            optionsSeries.valueType = group.valueType;
            optionsSeries.showZero = valueOptions.showZero;
            series.updateDataType(optionsSeries);
        });

        group.valueAxisType = group.valueAxisType || valueAxisType;
        if(group.valueAxis) {
            group.valueAxis.setTypes(group.valueAxisType, group.valueType, VALUE_TYPE);
            group.valueAxis.validate();
        }
    });

    groupsData.argumentAxisType = groupsData.argumentAxisType || argumentAxisType;
    if(groupsData.argumentAxes) {
        groupsData.argumentAxes.forEach(function(axis) {
            axis.setTypes(groupsData.argumentAxisType, groupsData.argumentType, ARGUMENT_TYPE);
            axis.validate();
        });
    }
}

function verifyData(source, incidentOccurred) {
    const data = [];
    const sourceIsDefined = _isDefined(source);
    let hasError = sourceIsDefined && !_isArray(source);
    let i;
    let ii;
    let k;
    let item;
    if(sourceIsDefined && !hasError) {
        for(i = 0, ii = source.length, k = 0; i < ii; ++i) {
            item = source[i];
            if(_isObject(item)) {
                data[k++] = item;
            } else if(item) { // TODO: And what about `null`, `undefined` and `0`?
                hasError = true;
            }
        }
    }
    if(hasError) {
        incidentOccurred('E2001');
    }
    return data;
}

function validateData(data, groupsData, incidentOccurred, options) {
    let dataByArgumentFields;

    data = verifyData(data, incidentOccurred);

    groupsData.argumentType = groupsData.argumentAxisType = null;

    processGroups(groupsData.groups);
    resetArgumentAxes(groupsData.argumentAxes);

    checkType(data, groupsData, options.checkTypeForAllData);
    checkAxisType(groupsData, incidentOccurred);

    if(options.convertToAxisDataType) {
        data = parse(data, prepareParsers(groupsData, incidentOccurred));
    }
    groupPieData(data, groupsData);

    dataByArgumentFields = sortData(data, groupsData, options, getUniqueArgumentFields(groupsData));

    return dataByArgumentFields;
}

exports.validateData = validateData;
