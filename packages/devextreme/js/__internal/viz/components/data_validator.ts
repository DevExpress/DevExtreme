/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable guard-for-in */
/* eslint-disable no-multi-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */

import { extend } from '@js/core/utils/extend';
import {
  isDate as _isDate,
  isDefined as _isDefined,
  isFunction as _isFunction,
  isNumeric as _isNumber,
  isObject as _isObject,
  isString as _isString,
} from '@js/core/utils/type';
import { getParser as _getParser } from '@ts/viz/components/parse_utils';
import { enumParser } from '@ts/viz/core/utils';

const STRING = 'string';
const NUMERIC = 'numeric';
const DATETIME = 'datetime';
const DISCRETE = 'discrete';
const SEMIDISCRETE = 'semidiscrete';
const CONTINUOUS = 'continuous';
const LOGARITHMIC = 'logarithmic';
const VALUE_TYPE = 'valueType';
const ARGUMENT_TYPE = 'argumentType';
const axisTypeParser = enumParser([STRING, NUMERIC, DATETIME]);

const _isArray = Array.isArray;

function groupingValues(data, others, valueField, index) {
  if (index >= 0) {
    data.slice(index).forEach((cell) => {
      if (_isDefined(cell[valueField])) {
        others[valueField] += cell[valueField];
        cell[valueField] = undefined;
      }
    });
  }
}

function processGroups(groups) {
  groups.forEach((group) => {
    group.valueType = group.valueAxisType = null;
    group.series.forEach((series) => {
      series.updateDataType({});
    });
    group.valueAxis && group.valueAxis.resetTypes(VALUE_TYPE);
  });
}

function sortValues(data, asc, selector) {
  const func = asc ? function (a, b) { return a - b; } : function (a, b) { return b - a; };
  data.sort((a, b) => {
    const valA = selector(a);
    const valB = selector(b);
    const aa = _isDefined(valA) ? 1 : 0;
    const bb = _isDefined(valB) ? 1 : 0;
    return aa && bb ? func(valA, valB) : func(aa, bb);
  });
  return data;
}

function resetArgumentAxes(axes) {
  axes && axes.forEach((axis) => {
    axis.resetTypes(ARGUMENT_TYPE);
  });
}

function parseCategories(categories, parser) {
  const newArray = [];

  categories.forEach((category) => {
    const parsedCategory = parser(category);
    // @ts-expect-error
    parsedCategory !== undefined && newArray.push(parsedCategory);
  });
  return newArray;
}

function parseAxisCategories(groupsData, parsers) {
  const argumentCategories = groupsData.argumentOptions && groupsData.argumentOptions.categories;

  groupsData.groups.forEach((valueGroup, i) => {
    const categories = valueGroup.valueOptions && valueGroup.valueOptions.categories;
    if (categories) {
      valueGroup.valueOptions.categories = parseCategories(categories, parsers[i + 1]);
    }
  });

  if (argumentCategories) {
    groupsData.argumentOptions.categories = parseCategories(argumentCategories, parsers[0]);
  }
}

function eigen(x) {
  return x;
}

function getType(unit, type) {
  let result = type;
  if (type === STRING || _isString(unit)) {
    result = STRING;
  } else if (type === DATETIME || _isDate(unit)) {
    result = DATETIME;
  } else if (_isNumber(unit)) {
    result = NUMERIC;
  }
  return result;
}

function correctAxisType(type, axisType, hasCategories, incidentOccurred) {
  if (type === STRING && (axisType === CONTINUOUS || axisType === LOGARITHMIC || axisType === SEMIDISCRETE)) {
    incidentOccurred('E2002');
  }
  return axisType === LOGARITHMIC ? LOGARITHMIC : hasCategories || axisType === DISCRETE || type === STRING ? DISCRETE : axisType === SEMIDISCRETE ? SEMIDISCRETE : CONTINUOUS;
}

// Do we really need this one if all it is only for logarithmic case?
function validUnit(unit, field, incidentOccurred) {
  if (unit) {
    incidentOccurred(!_isNumber(unit) && !_isDate(unit) && !_isString(unit) ? 'E2003' : 'E2004', [field]);
  }
}

function createParserUnit(type, axisType, incidentOccurred) {
  const parser = type ? _getParser(type) : eigen;
  const filterInfinity = axisType !== DISCRETE ? function (x) { return isFinite(x) || x === undefined ? x : null; } : eigen;

  return function (unit, field) {
    const parseUnit = filterInfinity(parser(unit));

    if (parseUnit === undefined) {
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

  groupsData.groups.forEach((group, groupIndex) => {
    group.series.forEach((series) => {
      valueParser = createParserUnit(group.valueType, group.valueAxisType, incidentOccurred);
      sizeParser = createParserUnit(NUMERIC, CONTINUOUS, incidentOccurred);

      cache[series.getArgumentField()] = argumentParser;
      series.getValueFields().forEach((field) => {
        categoryParsers[groupIndex + 1] = valueParser;
        cache[field] = valueParser;
      });

      if (series.getSizeField()) {
        cache[series.getSizeField()] = sizeParser;
      }
    });
  });
  for (const field in cache) {
    // @ts-expect-error
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
  for (i = 0; i < ii; ++i) {
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
  for (i = 0; i < ii; ++i) {
    // @ts-expect-error
    parsedData[i] = getParsedCell(data[i], parsers);
  }
  return parsedData;
}

function findIndexByThreshold(data, valueField, threshold) {
  let i;
  const ii = data.length;
  let value;
  for (i = 0; i < ii; ++i) {
    value = data[i][valueField];
    if (_isDefined(value) && threshold > value) {
      break;
    }
  }
  return i;
}

function groupMinSlices(originalData, argumentField, valueField, smallValuesGrouping) {
  smallValuesGrouping = smallValuesGrouping || {};

  const mode = smallValuesGrouping.mode;
  const others = {};

  if (!mode || mode === 'none') { return; }
  others[argumentField] = String(smallValuesGrouping.groupName || 'others');
  others[valueField] = 0;

  const data = sortValues(originalData.slice(), false, (a) => a[valueField]);

  groupingValues(data, others, valueField, mode === 'smallValueThreshold' ? findIndexByThreshold(data, valueField, smallValuesGrouping.threshold) : smallValuesGrouping.topCount);

  others[valueField] && originalData.push(others);
}

function groupPieData(data, groupsData) {
  const firstSeries = groupsData.groups[0] && groupsData.groups[0].series[0];
  const isPie = firstSeries && (firstSeries.type === 'pie' || firstSeries.type === 'doughnut' || firstSeries.type === 'donut');

  if (!isPie) { return; }

  groupsData.groups.forEach((group) => {
    group.series.forEach((series) => {
      groupMinSlices(data, series.getArgumentField(), series.getValueFields()[0], series.getOptions().smallValuesGrouping);
    });
  });
}

function addUniqueItemToCollection(item, collection, itemsHash) {
  if (!itemsHash[item]) {
    collection.push(item);
    itemsHash[item] = true;
  }
}

function getUniqueArgumentFields(groupsData) {
  const uniqueArgumentFields = [];
  const hash = {};

  groupsData.groups.forEach((group) => {
    group.series.forEach((series) => {
      addUniqueItemToCollection(series.getArgumentField(), uniqueArgumentFields, hash);
    });
  });

  return uniqueArgumentFields;
}

function sort(a, b) {
  const result = a - b;

  if (isNaN(result)) {
    if (!_isDefined(a)) {
      return 1;
    }
    if (!_isDefined(b)) {
      return -1;
    }
    return 0;
  }

  return result;
}

function sortByArgument(data, argumentField) {
  return data.slice().sort((a, b) => sort(a[argumentField], b[argumentField]));
}

function sortByCallback(data, callback) {
  return data.slice().sort(callback);
}

function checkValueTypeOfGroup(group, cell) {
  group.series.forEach((series) => {
    series.getValueFields().forEach((field) => {
      group.valueType = getType(cell[field], group.valueType);
    });
  });

  return group.valueType;
}

function getSortByCategories(categories) {
  const hash = {};

  categories.forEach((value, i) => {
    hash[value] = i;
  });

  return function (data, argumentField) {
    return sortValues(data.slice(), true, (a) => hash[a[argumentField]]);
  };
}

function sortData(data, groupsData, options, uniqueArgumentFields) {
  const dataByArguments = {};
  const isDiscrete = groupsData.argumentAxisType === DISCRETE;
  const userCategories = isDiscrete && groupsData.argumentOptions && groupsData.argumentOptions.categories;
  let sortFunction = function (data) { return data; };
  const sortingMethodOption = options.sortingMethod;
  let reSortCategories;

  if (!userCategories && _isFunction(sortingMethodOption)) {
    data = sortByCallback(data, sortingMethodOption);
  }
  if (isDiscrete) {
    groupsData.categories = getCategories(data, uniqueArgumentFields, userCategories);
  }

  if (userCategories || (!_isFunction(sortingMethodOption) && groupsData.argumentType === STRING && !options._skipArgumentSorting)) {
    // @ts-expect-error
    sortFunction = getSortByCategories(groupsData.categories);
  } else if (sortingMethodOption === true && groupsData.argumentType !== STRING) {
    // @ts-expect-error
    sortFunction = sortByArgument;
    reSortCategories = isDiscrete;
  }

  uniqueArgumentFields.forEach((field) => {
    // @ts-expect-error
    dataByArguments[field] = sortFunction(data, field);
  });

  if (reSortCategories) {
    groupsData.categories = groupsData.categories.sort(sort);
  }

  return dataByArguments;
}

function getCategories(data, uniqueArgumentFields, userCategories) {
  const categories = userCategories ? userCategories.slice() : [];
  const existingValues = new Set(categories.map((item) => item.valueOf()));

  uniqueArgumentFields.forEach((field) => {
    data.forEach((item) => {
      const dataItem = item[field];
      if (!_isDefined(dataItem)) {
        return;
      }

      const dataItemValue = dataItem.valueOf();
      if (!existingValues.has(dataItemValue)) {
        categories.push(dataItem);
        existingValues.add(dataItemValue);
      }
    });
  });

  return categories;
}

function checkArgumentTypeOfGroup(series, cell, groupsData) {
  series.forEach((currentSeries) => {
    groupsData.argumentType = getType(cell[currentSeries.getArgumentField()], groupsData.argumentType);
  });
  return groupsData.argumentType;
}

function checkType(data, groupsData, checkTypeForAllData) {
  const groupsWithUndefinedValueType = [];
  const groupsWithUndefinedArgumentType = [];
  // @ts-expect-error
  const argumentTypeGroup = groupsData.argumentOptions && axisTypeParser(groupsData.argumentOptions.argumentType);
  let groupsIndexes;

  groupsData.groups.forEach((group) => {
    if (!group.series.length) {
      return;
    }
    // @ts-expect-error
    const valueTypeGroup = group.valueOptions && axisTypeParser(group.valueOptions.valueType);

    group.valueType = valueTypeGroup;
    groupsData.argumentType = argumentTypeGroup;
    // @ts-expect-error
    !valueTypeGroup && groupsWithUndefinedValueType.push(group);
    // @ts-expect-error
    !argumentTypeGroup && groupsWithUndefinedArgumentType.push(group);
  });

  if (groupsWithUndefinedValueType.length || groupsWithUndefinedArgumentType.length) {
    groupsIndexes = groupsWithUndefinedValueType.map((_, index) => index);
    // @ts-expect-error
    data.some((cell) => {
      let defineArg;

      groupsWithUndefinedValueType.forEach((group, groupIndex) => {
        if (checkValueTypeOfGroup(group, cell) && groupsIndexes.indexOf(groupIndex) >= 0) {
          groupsIndexes.splice(groupIndex, 1);
        }
      });

      if (!defineArg) {
        groupsWithUndefinedArgumentType.forEach((group) => {
          // @ts-expect-error
          defineArg = checkArgumentTypeOfGroup(group.series, cell, groupsData);
        });
      }

      if (!checkTypeForAllData && defineArg && groupsIndexes.length === 0) {
        return true;
      }
    });
  }
}

function checkAxisType(groupsData, incidentOccurred) {
  const argumentOptions = groupsData.argumentOptions || {};
  const userArgumentCategories = (argumentOptions && argumentOptions.categories) || [];
  const argumentAxisType = correctAxisType(groupsData.argumentType, argumentOptions.type, !!userArgumentCategories.length, incidentOccurred);

  groupsData.groups.forEach((group) => {
    const valueOptions = group.valueOptions || {};
    const valueCategories = valueOptions.categories || [];
    const valueAxisType = correctAxisType(group.valueType, valueOptions.type, !!valueCategories.length, incidentOccurred);

    group.series.forEach((series) => {
      const optionsSeries = {};
      // @ts-expect-error
      optionsSeries.argumentAxisType = argumentAxisType;
      // @ts-expect-error
      optionsSeries.valueAxisType = valueAxisType;
      // @ts-expect-error
      groupsData.argumentAxisType = groupsData.argumentAxisType || optionsSeries.argumentAxisType;
      // @ts-expect-error
      group.valueAxisType = group.valueAxisType || optionsSeries.valueAxisType;
      // @ts-expect-error
      optionsSeries.argumentType = groupsData.argumentType;
      // @ts-expect-error
      optionsSeries.valueType = group.valueType;
      // @ts-expect-error
      optionsSeries.showZero = valueOptions.showZero;
      series.updateDataType(optionsSeries);
    });

    group.valueAxisType = group.valueAxisType || valueAxisType;
    if (group.valueAxis) {
      group.valueAxis.setTypes(group.valueAxisType, group.valueType, VALUE_TYPE);
      group.valueAxis.validate();
    }
  });

  groupsData.argumentAxisType = groupsData.argumentAxisType || argumentAxisType;
  if (groupsData.argumentAxes) {
    groupsData.argumentAxes.forEach((axis) => {
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
  if (sourceIsDefined && !hasError) {
    for (i = 0, ii = source.length, k = 0; i < ii; ++i) {
      item = source[i];
      if (_isObject(item)) {
        // @ts-expect-error
        data[k++] = item;
      } else if (item) { // TODO: And what about `null`, `undefined` and `0`?
        hasError = true;
      }
    }
  }
  if (hasError) {
    incidentOccurred('E2001');
  }
  return data;
}

export function validateData(data, groupsData, incidentOccurred, options) {
  data = verifyData(data, incidentOccurred);

  groupsData.argumentType = groupsData.argumentAxisType = null;

  processGroups(groupsData.groups);
  resetArgumentAxes(groupsData.argumentAxes);

  checkType(data, groupsData, options.checkTypeForAllData);
  checkAxisType(groupsData, incidentOccurred);

  if (options.convertToAxisDataType) {
    data = parse(data, prepareParsers(groupsData, incidentOccurred));
  }
  groupPieData(data, groupsData);

  const dataByArgumentFields = sortData(data, groupsData, options, getUniqueArgumentFields(groupsData));

  return dataByArgumentFields;
}
