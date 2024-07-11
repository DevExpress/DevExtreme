"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addItem = addItem;
exports.convertToInnerStructure = convertToInnerStructure;
exports.createCondition = createCondition;
exports.createEmptyGroup = createEmptyGroup;
exports.filterHasField = filterHasField;
exports.getAvailableOperations = getAvailableOperations;
exports.getCaptionByOperation = getCaptionByOperation;
exports.getCaptionWithParents = getCaptionWithParents;
exports.getCurrentLookupValueText = getCurrentLookupValueText;
exports.getCurrentValueText = getCurrentValueText;
exports.getCustomOperation = getCustomOperation;
exports.getDefaultOperation = getDefaultOperation;
exports.getField = getField;
exports.getFilterExpression = getFilterExpression;
exports.getFilterOperations = getFilterOperations;
exports.getGroupCriteria = getGroupCriteria;
exports.getGroupMenuItem = getGroupMenuItem;
exports.getGroupValue = getGroupValue;
exports.getItems = getItems;
exports.getMatchedConditions = getMatchedConditions;
exports.getMergedOperations = getMergedOperations;
exports.getNormalizedFields = getNormalizedFields;
exports.getNormalizedFilter = getNormalizedFilter;
exports.getOperationFromAvailable = getOperationFromAvailable;
exports.getOperationValue = getOperationValue;
exports.isCondition = isCondition;
exports.isEmptyGroup = isEmptyGroup;
exports.isGroup = isGroup;
exports.isValidCondition = isValidCondition;
exports.removeFieldConditionsFromFilter = removeFieldConditionsFromFilter;
exports.removeItem = removeItem;
exports.renderValueText = void 0;
exports.setGroupValue = setGroupValue;
exports.syncFilters = syncFilters;
exports.updateConditionByOperation = updateConditionByOperation;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _data = require("../../core/utils/data");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _inflector = require("../../core/utils/inflector");
var _type = require("../../core/utils/type");
var _data_source = require("../../data/data_source/data_source");
var _errors = require("../../data/errors");
var _format_helper = _interopRequireDefault(require("../../format_helper"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _filtering = _interopRequireDefault(require("../../ui/shared/filtering"));
var _ui = _interopRequireDefault(require("../../ui/widget/ui.errors"));
var _m_between = require("./m_between");
var _m_filter_operations_dictionary = _interopRequireDefault(require("./m_filter_operations_dictionary"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error errors.d.ts is badly typed and doesn't contain all exported entities.

const DEFAULT_DATA_TYPE = 'string';
const EMPTY_MENU_ICON = 'icon-none';
const AND_GROUP_OPERATION = 'and';
const EQUAL_OPERATION = '=';
const NOT_EQUAL_OPERATION = '<>';
const DATATYPE_OPERATIONS = {
  number: ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
  string: ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>', 'isblank', 'isnotblank'],
  date: ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
  datetime: ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
  boolean: ['=', '<>', 'isblank', 'isnotblank'],
  object: ['isblank', 'isnotblank']
};
const DEFAULT_FORMAT = {
  date: 'shortDate',
  datetime: 'shortDateShortTime'
};
const LOOKUP_OPERATIONS = ['=', '<>', 'isblank', 'isnotblank'];
const AVAILABLE_FIELD_PROPERTIES = ['caption', 'customizeText', 'dataField', 'dataType', 'editorTemplate', 'falseText', 'editorOptions', 'filterOperations', 'format', 'lookup', 'trueText', 'calculateFilterExpression', 'name'];
const FILTER_BUILDER_CLASS = 'dx-filterbuilder';
const FILTER_BUILDER_ITEM_TEXT_CLASS = `${FILTER_BUILDER_CLASS}-text`;
const FILTER_BUILDER_ITEM_TEXT_PART_CLASS = `${FILTER_BUILDER_ITEM_TEXT_CLASS}-part`;
const FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS = `${FILTER_BUILDER_ITEM_TEXT_CLASS}-separator`;
const FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS = `${FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS}-empty`;
function getFormattedValueText(field, value) {
  const fieldFormat = field.format || DEFAULT_FORMAT[field.dataType];
  return _format_helper.default.format(value, fieldFormat);
}
function isNegationGroup(group) {
  return group && group.length > 1 && group[0] === '!' && !isCondition(group);
}
function getGroupCriteria(group) {
  return isNegationGroup(group) ? group[1] : group;
}
function setGroupCriteria(group, criteria) {
  if (isNegationGroup(group)) {
    group[1] = criteria;
  } else {
    group = criteria;
  }
  return group;
}
function convertGroupToNewStructure(group, value) {
  const isNegationValue = function (value) {
    return value.indexOf('!') !== -1;
  };
  const convertGroupToNegationGroup = function (group) {
    const criteria = group.slice(0);
    group.length = 0;
    group.push('!', criteria);
  };
  const convertNegationGroupToGroup = function (group) {
    const criteria = getGroupCriteria(group);
    group.length = 0;
    [].push.apply(group, criteria);
  };
  if (isNegationValue(value)) {
    if (!isNegationGroup(group)) {
      convertGroupToNegationGroup(group);
    }
  } else if (isNegationGroup(group)) {
    convertNegationGroupToGroup(group);
  }
}
function setGroupValue(group, value) {
  convertGroupToNewStructure(group, value);
  const criteria = getGroupCriteria(group);
  let i;
  const getNormalizedGroupValue = function (value) {
    return value.indexOf('!') === -1 ? value : value.substring(1);
  };
  const changeCriteriaValue = function (criteria, value) {
    for (i = 0; i < criteria.length; i++) {
      if (!Array.isArray(criteria[i])) {
        criteria[i] = value;
      }
    }
  };
  value = getNormalizedGroupValue(value);
  changeCriteriaValue(criteria, value);
  return group;
}
function getGroupMenuItem(group, availableGroups) {
  const groupValue = getGroupValue(group);
  return availableGroups.filter(item => item.value === groupValue)[0];
}
function getCriteriaOperation(criteria) {
  if (isCondition(criteria)) {
    return AND_GROUP_OPERATION;
  }
  let value = '';
  for (let i = 0; i < criteria.length; i++) {
    const item = criteria[i];
    if (!Array.isArray(item)) {
      if (value && value !== item) {
        throw new _errors.errors.Error('E4019');
      }
      if (item !== '!') {
        value = item;
      }
    }
  }
  return value;
}
function getGroupValue(group) {
  const criteria = getGroupCriteria(group);
  let value = getCriteriaOperation(criteria);
  if (!value) {
    value = AND_GROUP_OPERATION;
  }
  if (criteria !== group) {
    value = `!${value}`;
  }
  return value;
}
function getDefaultFilterOperations(field) {
  return field.lookup && LOOKUP_OPERATIONS || DATATYPE_OPERATIONS[field.dataType || DEFAULT_DATA_TYPE];
}
function containItems(entity) {
  return Array.isArray(entity) && entity.length;
}
function getFilterOperations(field) {
  const result = containItems(field.filterOperations) ? field.filterOperations : getDefaultFilterOperations(field);
  return (0, _extend.extend)([], result);
}
function getCaptionByOperation(operation, filterOperationDescriptions) {
  const operationName = _m_filter_operations_dictionary.default.getNameByFilterOperation(operation);
  return filterOperationDescriptions && filterOperationDescriptions[operationName] ? filterOperationDescriptions[operationName] : operationName;
}
function getOperationFromAvailable(operation, availableOperations) {
  for (let i = 0; i < availableOperations.length; i++) {
    if (availableOperations[i].value === operation) {
      return availableOperations[i];
    }
  }
  // @ts-expect-error wrong usage of new
  throw new _ui.default.Error('E1048', operation);
}
function getCustomOperation(customOperations, name) {
  const filteredOperations = customOperations.filter(item => item.name === name);
  return filteredOperations.length ? filteredOperations[0] : null;
}
function getAvailableOperations(field, filterOperationDescriptions, customOperations) {
  const filterOperations = getFilterOperations(field);
  const isLookupField = !!field.lookup;
  customOperations.forEach(customOperation => {
    if (!field.filterOperations && filterOperations.indexOf(customOperation.name) === -1) {
      const dataTypes = customOperation && customOperation.dataTypes;
      const isOperationForbidden = isLookupField ? !!customOperation.notForLookup : false;
      if (!isOperationForbidden && dataTypes && dataTypes.indexOf(field.dataType || DEFAULT_DATA_TYPE) >= 0) {
        filterOperations.push(customOperation.name);
      }
    }
  });
  return filterOperations.map(operation => {
    const customOperation = getCustomOperation(customOperations, operation);
    if (customOperation) {
      return {
        icon: customOperation.icon || EMPTY_MENU_ICON,
        text: customOperation.caption || (0, _inflector.captionize)(customOperation.name),
        value: customOperation.name,
        isCustom: true
      };
    }
    return {
      icon: _m_filter_operations_dictionary.default.getIconByFilterOperation(operation) || EMPTY_MENU_ICON,
      text: getCaptionByOperation(operation, filterOperationDescriptions),
      value: operation
    };
  });
}
function getDefaultOperation(field) {
  return field.defaultFilterOperation || getFilterOperations(field)[0];
}
function createCondition(field, customOperations) {
  const condition = [field.dataField, '', ''];
  const filterOperation = getDefaultOperation(field);
  updateConditionByOperation(condition, filterOperation, customOperations);
  return condition;
}
function removeItem(group, item) {
  const criteria = getGroupCriteria(group);
  const index = criteria.indexOf(item);
  criteria.splice(index, 1);
  if (criteria.length !== 1) {
    criteria.splice(index, 1);
  }
  return group;
}
function createEmptyGroup(value) {
  const isNegation = isNegationGroupOperation(value);
  const groupOperation = isNegation ? getGroupOperationFromNegationOperation(value) : value;
  return isNegation ? ['!', [groupOperation]] : [groupOperation];
}
function isEmptyGroup(group) {
  const criteria = getGroupCriteria(group);
  if (isCondition(criteria)) {
    return false;
  }
  const hasConditions = criteria.some(item => isCondition(item));
  return !hasConditions;
}
function addItem(item, group) {
  const criteria = getGroupCriteria(group);
  const groupValue = getGroupValue(criteria);
  criteria.length === 1 ? criteria.unshift(item) : criteria.push(item, groupValue);
  return group;
}
function getField(dataField, fields) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].name === dataField) {
      return fields[i];
    }
    if (fields[i].dataField.toLowerCase() === dataField.toLowerCase()) {
      return fields[i];
    }
  }
  const extendedFields = getItems(fields, true).filter(item => item.dataField.toLowerCase() === dataField.toLowerCase());
  if (extendedFields.length > 0) {
    return extendedFields[0];
  }
  // @ts-expect-error wrong usage of new
  throw new _ui.default.Error('E1047', dataField);
}
function isGroup(criteria) {
  if (!Array.isArray(criteria)) {
    return false;
  }
  return criteria.length < 2 || Array.isArray(criteria[0]) || Array.isArray(criteria[1]);
}
function isCondition(criteria) {
  if (!Array.isArray(criteria)) {
    return false;
  }
  return criteria.length > 1 && !Array.isArray(criteria[0]) && !Array.isArray(criteria[1]);
}
function convertToInnerGroup(group, customOperations, defaultGroupOperation) {
  defaultGroupOperation = defaultGroupOperation || AND_GROUP_OPERATION;
  const groupOperation = getCriteriaOperation(group).toLowerCase() || defaultGroupOperation;
  let innerGroup = [];
  for (let i = 0; i < group.length; i++) {
    if (isGroup(group[i])) {
      innerGroup.push(convertToInnerStructure(group[i], customOperations, defaultGroupOperation));
      innerGroup = appendGroupOperationToGroup(innerGroup, groupOperation);
    } else if (isCondition(group[i])) {
      innerGroup.push(convertToInnerCondition(group[i], customOperations));
      innerGroup = appendGroupOperationToGroup(innerGroup, groupOperation);
    }
  }
  if (innerGroup.length === 0) {
    innerGroup = appendGroupOperationToGroup(innerGroup, groupOperation);
  }
  return innerGroup;
}
function conditionHasCustomOperation(condition, customOperations) {
  const customOperation = getCustomOperation(customOperations, condition[1]);
  return customOperation && customOperation.name === condition[1];
}
function convertToInnerCondition(condition, customOperations) {
  if (conditionHasCustomOperation(condition, customOperations)) {
    return condition;
  }
  if (condition.length < 3) {
    // eslint-disable-next-line prefer-destructuring
    condition[2] = condition[1];
    condition[1] = EQUAL_OPERATION;
  }
  return condition;
}
function isNegationGroupOperation(operation) {
  return operation.indexOf('not') !== -1;
}
function getGroupOperationFromNegationOperation(operation) {
  return operation.substring(3).toLowerCase();
}
function appendGroupOperationToCriteria(criteria, groupOperation) {
  const isNegation = isNegationGroupOperation(groupOperation);
  groupOperation = isNegation ? getGroupOperationFromNegationOperation(groupOperation) : groupOperation;
  return isNegation ? ['!', criteria, groupOperation] : [criteria, groupOperation];
}
function appendGroupOperationToGroup(group, groupOperation) {
  const isNegation = isNegationGroupOperation(groupOperation);
  groupOperation = isNegation ? getGroupOperationFromNegationOperation(groupOperation) : groupOperation;
  group.push(groupOperation);
  let result = group;
  if (isNegation) {
    result = ['!', result];
  }
  return result;
}
function convertToInnerStructure(value, customOperations, defaultGroupOperation) {
  defaultGroupOperation = defaultGroupOperation || AND_GROUP_OPERATION;
  if (!value) {
    return createEmptyGroup(defaultGroupOperation);
  }
  value = (0, _extend.extend)(true, [], value);
  if (isCondition(value)) {
    return appendGroupOperationToCriteria(convertToInnerCondition(value, customOperations), defaultGroupOperation);
  }
  if (isNegationGroup(value)) {
    return ['!', isCondition(value[1]) ? appendGroupOperationToCriteria(convertToInnerCondition(value[1], customOperations), defaultGroupOperation) : isNegationGroup(value[1]) ? appendGroupOperationToCriteria(convertToInnerStructure(value[1], customOperations), defaultGroupOperation) : convertToInnerGroup(value[1], customOperations, defaultGroupOperation)];
  }
  return convertToInnerGroup(value, customOperations, defaultGroupOperation);
}
function getNormalizedFields(fields) {
  return fields.reduce((result, field) => {
    if ((0, _type.isDefined)(field.dataField)) {
      const normalizedField = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const key in field) {
        if (field[key] && AVAILABLE_FIELD_PROPERTIES.includes(key)) {
          normalizedField[key] = field[key];
        }
      }
      normalizedField.defaultCalculateFilterExpression = _filtering.default.defaultCalculateFilterExpression;
      if (!(0, _type.isDefined)(normalizedField.dataType)) {
        normalizedField.dataType = DEFAULT_DATA_TYPE;
      }
      if (!(0, _type.isDefined)(normalizedField.trueText)) {
        normalizedField.trueText = _message.default.format('dxDataGrid-trueText');
      }
      if (!(0, _type.isDefined)(normalizedField.falseText)) {
        normalizedField.falseText = _message.default.format('dxDataGrid-falseText');
      }
      result.push(normalizedField);
    }
    return result;
  }, []);
}
function getConditionFilterExpression(condition, fields, customOperations, target) {
  const field = getField(condition[0], fields);
  const filterExpression = convertToInnerCondition(condition, customOperations);
  const customOperation = customOperations.length && getCustomOperation(customOperations, filterExpression[1]);
  if (customOperation && customOperation.calculateFilterExpression) {
    return customOperation.calculateFilterExpression.apply(customOperation, [filterExpression[2], field, fields]);
  }
  if (field.createFilterExpression) {
    return field.createFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
  }
  if (field.calculateFilterExpression) {
    return field.calculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
  }
  return field.defaultCalculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
}
function getFilterExpression(value, fields, customOperations, target) {
  if (!(0, _type.isDefined)(value)) {
    return null;
  }
  if (isNegationGroup(value)) {
    const filterExpression = getFilterExpression(value[1], fields, customOperations, target);
    return ['!', filterExpression];
  }
  const criteria = getGroupCriteria(value);
  if (isCondition(criteria)) {
    return getConditionFilterExpression(criteria, fields, customOperations, target) || null;
  }
  let result = [];
  let filterExpression;
  const groupValue = getGroupValue(criteria);
  for (let i = 0; i < criteria.length; i++) {
    if (isGroup(criteria[i])) {
      filterExpression = getFilterExpression(criteria[i], fields, customOperations, target);
      if (filterExpression) {
        i && result.push(groupValue);
        result.push(filterExpression);
      }
    } else if (isCondition(criteria[i])) {
      filterExpression = getConditionFilterExpression(criteria[i], fields, customOperations, target);
      if (filterExpression) {
        result.length && result.push(groupValue);
        result.push(filterExpression);
      }
    }
  }
  if (result.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    result = result[0];
  }
  return result.length ? result : null;
}
function getNormalizedFilter(group) {
  const criteria = getGroupCriteria(group);
  let i;
  if (criteria.length === 0) {
    return null;
  }
  const itemsForRemove = [];
  for (i = 0; i < criteria.length; i++) {
    if (isGroup(criteria[i])) {
      const normalizedGroupValue = getNormalizedFilter(criteria[i]);
      if (normalizedGroupValue) {
        criteria[i] = normalizedGroupValue;
      } else {
        itemsForRemove.push(criteria[i]);
      }
    } else if (isCondition(criteria[i])) {
      if (!isValidCondition(criteria[i])) {
        itemsForRemove.push(criteria[i]);
      }
    }
  }
  for (i = 0; i < itemsForRemove.length; i++) {
    removeItem(criteria, itemsForRemove[i]);
  }
  if (criteria.length === 1) {
    return null;
  }
  criteria.splice(criteria.length - 1, 1);
  if (criteria.length === 1) {
    group = setGroupCriteria(group, criteria[0]);
  }
  if (group.length === 0) {
    return null;
  }
  return group;
}
function getCurrentLookupValueText(field, value, handler) {
  if (value === '') {
    handler('');
    return;
  }
  const {
    lookup
  } = field;
  if (lookup.items) {
    handler(lookup.calculateCellValue(value) || '');
  } else {
    const lookupDataSource = (0, _type.isFunction)(lookup.dataSource) ? lookup.dataSource({}) : lookup.dataSource;
    const dataSource = new _data_source.DataSource(lookupDataSource);
    // @ts-expect-error DataSource is badly typed.
    dataSource.loadSingle(lookup.valueExpr, value).done(result => {
      let valueText = '';
      if (result) {
        // @ts-expect-error compileGetter has unknown return type
        valueText = lookup.displayExpr ? (0, _data.compileGetter)(lookup.displayExpr)(result) : result;
      }
      if (field.customizeText) {
        valueText = field.customizeText({
          value,
          valueText
        });
      }
      handler(valueText);
    }).fail(() => {
      handler('');
    });
  }
}
function getPrimitiveValueText(field, value, customOperation, target, options) {
  let valueText;
  if (value === true) {
    valueText = field.trueText || _message.default.format('dxDataGrid-trueText');
  } else if (value === false) {
    valueText = field.falseText || _message.default.format('dxDataGrid-falseText');
  } else {
    valueText = getFormattedValueText(field, value);
  }
  if (field.customizeText) {
    valueText = field.customizeText.call(field, {
      value,
      valueText,
      target
    });
  }
  if (customOperation && customOperation.customizeText) {
    valueText = customOperation.customizeText.call(customOperation, {
      value,
      valueText,
      field,
      target
    }, options);
  }
  return valueText;
}
function getArrayValueText(field, value, customOperation, target) {
  const options = {
    values: value
  };
  return value.map(v => getPrimitiveValueText(field, v, customOperation, target, options));
}
function checkDefaultValue(value) {
  return value === '' || value === null;
}
function getCurrentValueText(field, value, customOperation) {
  let target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'filterBuilder';
  if (checkDefaultValue(value)) {
    return '';
  }
  if (Array.isArray(value)) {
    // @ts-expect-error Deferred has badly typed ctor function
    const result = new _deferred.Deferred();
    _deferred.when.apply(this, getArrayValueText(field, value, customOperation, target)).done(function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const text = args.some(item => !checkDefaultValue(item)) ? args.map(item => !checkDefaultValue(item) ? item : '?') : '';
      result.resolve(text);
    });
    return result;
  }
  return getPrimitiveValueText(field, value, customOperation, target);
}
function itemExists(plainItems, parentId) {
  return plainItems.some(item => item.dataField === parentId);
}
function pushItemAndCheckParent(originalItems, plainItems, item) {
  const {
    dataField
  } = item;
  if (hasParent(dataField)) {
    item.parentId = getParentIdFromItemDataField(dataField);
    if (!itemExists(plainItems, item.parentId) && !itemExists(originalItems, item.parentId)) {
      pushItemAndCheckParent(originalItems, plainItems, {
        id: item.parentId,
        dataType: 'object',
        dataField: item.parentId,
        caption: generateCaptionByDataField(item.parentId, true),
        filterOperations: ['isblank', 'isnotblank'],
        defaultCalculateFilterExpression: _filtering.default.defaultCalculateFilterExpression
      });
    }
  }
  plainItems.push(item);
}
function generateCaptionByDataField(dataField, allowHierarchicalFields) {
  let caption = '';
  if (allowHierarchicalFields) {
    dataField = dataField.substring(dataField.lastIndexOf('.') + 1);
  } else if (hasParent(dataField)) {
    dataField.split('.').forEach((field, index, arr) => {
      caption += (0, _inflector.captionize)(field);
      if (index !== arr.length - 1) {
        caption += '.';
      }
    });
    return caption;
  }
  return (0, _inflector.captionize)(dataField);
}
function getItems(fields, allowHierarchicalFields) {
  const items = [];
  for (let i = 0; i < fields.length; i++) {
    const item = (0, _extend.extend)(true, {
      caption: generateCaptionByDataField(fields[i].dataField, allowHierarchicalFields)
    }, fields[i]);
    item.id = item.name || item.dataField;
    if (allowHierarchicalFields) {
      pushItemAndCheckParent(fields, items, item);
    } else {
      items.push(item);
    }
  }
  return items;
}
function hasParent(dataField) {
  return dataField.lastIndexOf('.') !== -1;
}
function getParentIdFromItemDataField(dataField) {
  return dataField.substring(0, dataField.lastIndexOf('.'));
}
function getCaptionWithParents(item, plainItems) {
  if (hasParent(item.dataField)) {
    const parentId = getParentIdFromItemDataField(item.dataField);
    for (let i = 0; i < plainItems.length; i++) {
      if (plainItems[i].dataField === parentId) {
        return `${getCaptionWithParents(plainItems[i], plainItems)}.${item.caption}`;
      }
    }
  }
  return item.caption;
}
function updateConditionByOperation(condition, operation, customOperations) {
  let customOperation = getCustomOperation(customOperations, operation);
  if (customOperation) {
    if (customOperation.hasValue === false) {
      condition[1] = operation;
      condition.length = 2;
    } else {
      condition[1] = operation;
      condition[2] = '';
    }
    return condition;
  }
  if (operation === 'isblank') {
    condition[1] = EQUAL_OPERATION;
    condition[2] = null;
  } else if (operation === 'isnotblank') {
    condition[1] = NOT_EQUAL_OPERATION;
    condition[2] = null;
  } else {
    customOperation = getCustomOperation(customOperations, condition[1]);
    if (customOperation || condition.length === 2 || condition[2] === null) {
      condition[2] = '';
    }
    condition[1] = operation;
  }
  return condition;
}
function getOperationValue(condition) {
  let caption;
  if (condition[2] === null) {
    if (condition[1] === EQUAL_OPERATION) {
      caption = 'isblank';
    } else {
      caption = 'isnotblank';
    }
  } else {
    // eslint-disable-next-line prefer-destructuring
    caption = condition[1];
  }
  return caption;
}
function isValidCondition(condition) {
  return condition[2] !== '';
}
function getMergedOperations(customOperations, betweenCaption, context) {
  const result = (0, _extend.extend)(true, [], customOperations);
  let betweenIndex = -1;
  result.some((customOperation, index) => {
    if (customOperation.name === 'between') {
      betweenIndex = index;
      return true;
    }
    return undefined;
  });
  if (betweenIndex !== -1) {
    result[betweenIndex] = (0, _extend.extend)((0, _m_between.getConfig)(betweenCaption, context), result[betweenIndex]);
  } else {
    result.unshift((0, _m_between.getConfig)(betweenCaption, context));
  }
  return result;
}
function isMatchedCondition(filter, addedFilterDataField) {
  return filter[0] === addedFilterDataField;
}
function removeFieldConditionsFromFilter(filter, dataField) {
  if (!filter || filter.length === 0) {
    return null;
  }
  if (isCondition(filter)) {
    const hasMatchedCondition = isMatchedCondition(filter, dataField);
    return !hasMatchedCondition ? filter : null;
  }
  return syncConditionIntoGroup(filter, [dataField], false);
}
function syncConditionIntoGroup(filter, addedFilter, canPush) {
  const result = [];
  filter.forEach(item => {
    if (isCondition(item)) {
      if (isMatchedCondition(item, addedFilter[0])) {
        if (canPush) {
          result.push(addedFilter);
          canPush = false;
        } else {
          result.splice(result.length - 1, 1);
        }
      } else {
        result.push(item);
      }
    } else {
      (result.length || isGroup(item)) && result.push(item);
    }
  });
  if (result.length === 0) {
    return null;
  }
  if (canPush) {
    result.push(AND_GROUP_OPERATION);
    result.push(addedFilter);
  }
  return result.length === 1 ? result[0] : result;
}
function syncFilters(filter, addedFilter) {
  if (filter === null || filter.length === 0) {
    return addedFilter;
  }
  if (isCondition(filter)) {
    if (isMatchedCondition(filter, addedFilter[0])) {
      return addedFilter;
    }
    return [filter, AND_GROUP_OPERATION, addedFilter];
  }
  const groupValue = getGroupValue(filter);
  if (groupValue !== AND_GROUP_OPERATION) {
    return [addedFilter, 'and', filter];
  }
  return syncConditionIntoGroup(filter, addedFilter, true);
}
function getMatchedConditions(filter, dataField) {
  if (filter === null || filter.length === 0) return [];
  if (isCondition(filter)) {
    if (isMatchedCondition(filter, dataField)) {
      return [filter];
    }
    return [];
  }
  const groupValue = getGroupValue(filter);
  if (groupValue !== AND_GROUP_OPERATION) {
    return [];
  }
  const result = filter.filter(item => isCondition(item) && isMatchedCondition(item, dataField));
  return result;
}
function filterHasField(filter, dataField) {
  if (filter === null || filter.length === 0) return false;
  if (isCondition(filter)) {
    return filter[0] === dataField;
  }
  return filter.some(item => (isCondition(item) || isGroup(item)) && filterHasField(item, dataField));
}
const renderValueText = function ($container, value, customOperation) {
  if (Array.isArray(value)) {
    const lastItemIndex = value.length - 1;
    $container.empty();
    value.forEach((t, i) => {
      (0, _renderer.default)('<span>').addClass(FILTER_BUILDER_ITEM_TEXT_PART_CLASS).text(t).appendTo($container);
      if (i !== lastItemIndex) {
        (0, _renderer.default)('<span>').addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS).text(customOperation && customOperation.valueSeparator ? customOperation.valueSeparator : '|').addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS).appendTo($container);
      }
    });
  } else if (value) {
    $container.text(value);
  } else {
    $container.text(_message.default.format('dxFilterBuilder-enterValueText'));
  }
};
exports.renderValueText = renderValueText;