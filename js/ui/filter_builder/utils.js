import { Deferred, when } from '../../core/utils/deferred';
import { errors as dataErrors } from '../../data/errors';
import { isDefined } from '../../core/utils/type';
import { compileGetter } from '../../core/utils/data';
import errors from '../widget/ui.errors';
import filterUtils from '../shared/filtering';
import formatHelper from '../../format_helper';
import { extend } from '../../core/utils/extend';
import inflector from '../../core/utils/inflector';
import between from './between';
import messageLocalization from '../../localization/message';
import { DataSource } from '../../data/data_source/data_source';
import filterOperationsDictionary from './ui.filter_operations_dictionary';

const DEFAULT_DATA_TYPE = 'string';
const EMPTY_MENU_ICON = 'icon-none';
const AND_GROUP_OPERATION = 'and';
const EQUAL_OPERATION = '=';
const NOT_EQUAL_OPERATION = '<>';
const DATATYPE_OPERATIONS = {
    'number': ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
    'string': ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>', 'isblank', 'isnotblank'],
    'date': ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
    'datetime': ['=', '<>', '<', '>', '<=', '>=', 'isblank', 'isnotblank'],
    'boolean': ['=', '<>', 'isblank', 'isnotblank'],
    'object': ['isblank', 'isnotblank']
};
const DEFAULT_FORMAT = {
    'date': 'shortDate',
    'datetime': 'shortDateShortTime'
};
const LOOKUP_OPERATIONS = ['=', '<>', 'isblank', 'isnotblank'];
const AVAILABLE_FIELD_PROPERTIES = [
    'caption',
    'customizeText',
    'dataField',
    'dataType',
    'editorTemplate',
    'falseText',
    'editorOptions',
    'filterOperations',
    'format',
    'lookup',
    'trueText',
    'calculateFilterExpression',
    'name'
];

function getFormattedValueText(field, value) {
    const fieldFormat = field.format || DEFAULT_FORMAT[field.dataType];
    return formatHelper.format(value, fieldFormat);
}

function isNegationGroup(group) {
    return group
    && group.length > 1
    && group[0] === '!'
    && !isCondition(group);
}

function getGroupCriteria(group) {
    return isNegationGroup(group) ? group[1] : group;
}

function setGroupCriteria(group, criteria) {
    if(isNegationGroup(group)) {
        group[1] = criteria;
    } else {
        group = criteria;
    }
    return group;
}

function convertGroupToNewStructure(group, value) {
    const isNegationValue = function(value) {
        return value.indexOf('!') !== -1;
    };
    const convertGroupToNegationGroup = function(group) {
        const criteria = group.slice(0);
        group.length = 0;
        group.push('!', criteria);
    };
    const convertNegationGroupToGroup = function(group) {
        const criteria = getGroupCriteria(group);
        group.length = 0;
        [].push.apply(group, criteria);
    };

    if(isNegationValue(value)) {
        if(!isNegationGroup(group)) {
            convertGroupToNegationGroup(group);
        }
    } else if(isNegationGroup(group)) {
        convertNegationGroupToGroup(group);
    }
}

function setGroupValue(group, value) {
    convertGroupToNewStructure(group, value);

    const criteria = getGroupCriteria(group);
    let i;
    const getNormalizedGroupValue = function(value) {
        return value.indexOf('!') === -1 ? value : value.substring(1);
    };
    const changeCriteriaValue = function(criteria, value) {
        for(i = 0; i < criteria.length; i++) {
            if(!Array.isArray(criteria[i])) {
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

    return availableGroups.filter(function(item) {
        return item.value === groupValue;
    })[0];
}

function getCriteriaOperation(criteria) {
    if(isCondition(criteria)) {
        return AND_GROUP_OPERATION;
    }

    let value = '';
    for(let i = 0; i < criteria.length; i++) {
        const item = criteria[i];
        if(!Array.isArray(item)) {
            if(value && value !== item) {
                throw new dataErrors.Error('E4019');
            }
            if(item !== '!') {
                value = item;
            }
        }
    }
    return value;
}

function getGroupValue(group) {
    const criteria = getGroupCriteria(group);
    let value = getCriteriaOperation(criteria);

    if(!value) {
        value = AND_GROUP_OPERATION;
    }
    if(criteria !== group) {
        value = '!' + value;
    }
    return value;
}

function getDefaultFilterOperations(field) {
    return (field.lookup && LOOKUP_OPERATIONS) || DATATYPE_OPERATIONS[field.dataType || DEFAULT_DATA_TYPE];
}

function containItems(entity) {
    return Array.isArray(entity) && entity.length;
}

function getFilterOperations(field) {
    const result = containItems(field.filterOperations) ? field.filterOperations : getDefaultFilterOperations(field);
    return extend([], result);
}

function getCaptionByOperation(operation, filterOperationDescriptions) {
    const operationName = filterOperationsDictionary.getNameByFilterOperation(operation);
    return filterOperationDescriptions && filterOperationDescriptions[operationName] ? filterOperationDescriptions[operationName] : operationName;
}

function getOperationFromAvailable(operation, availableOperations) {
    for(let i = 0; i < availableOperations.length; i++) {
        if(availableOperations[i].value === operation) {
            return availableOperations[i];
        }
    }
    throw new errors.Error('E1048', operation);
}

function getCustomOperation(customOperations, name) {
    const filteredOperations = customOperations.filter(function(item) {
        return item.name === name;
    });
    return filteredOperations.length ? filteredOperations[0] : null;
}

function getAvailableOperations(field, filterOperationDescriptions, customOperations) {
    const filterOperations = getFilterOperations(field);

    customOperations.forEach(function(customOperation) {
        if(!field.filterOperations && filterOperations.indexOf(customOperation.name) === -1) {
            const dataTypes = customOperation && customOperation.dataTypes;
            if(dataTypes && dataTypes.indexOf(field.dataType || DEFAULT_DATA_TYPE) >= 0) {
                filterOperations.push(customOperation.name);
            }
        }
    });

    return filterOperations.map(function(operation) {
        const customOperation = getCustomOperation(customOperations, operation);
        if(customOperation) {
            return {
                icon: customOperation.icon || EMPTY_MENU_ICON,
                text: customOperation.caption || inflector.captionize(customOperation.name),
                value: customOperation.name,
                isCustom: true
            };
        } else {
            return {
                icon: filterOperationsDictionary.getIconByFilterOperation(operation) || EMPTY_MENU_ICON,
                text: getCaptionByOperation(operation, filterOperationDescriptions),
                value: operation
            };
        }
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

    if(criteria.length !== 1) {
        criteria.splice(index, 1);
    }
    return group;
}

function createEmptyGroup(value) {
    return value.indexOf('not') !== -1 ? ['!', [value.substring(3).toLowerCase()]] : [value];
}

function isEmptyGroup(group) {
    const criteria = getGroupCriteria(group);

    if(isCondition(criteria)) {
        return false;
    }

    const hasConditions = criteria.some(function(item) {
        return isCondition(item);
    });

    return !hasConditions;
}

function addItem(item, group) {
    const criteria = getGroupCriteria(group);
    const groupValue = getGroupValue(criteria);

    criteria.length === 1 ? criteria.unshift(item) : criteria.push(item, groupValue);

    return group;
}

function getField(dataField, fields) {
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].name === dataField) {
            return fields[i];
        }
        if(fields[i].dataField.toLowerCase() === dataField.toLowerCase()) {
            return fields[i];
        }
    }
    const extendedFields = getItems(fields, true).filter(function(item) {
        return item.dataField.toLowerCase() === dataField.toLowerCase();
    });
    if(extendedFields.length > 0) {
        return extendedFields[0];
    }
    throw new errors.Error('E1047', dataField);
}

function isGroup(criteria) {
    if(!Array.isArray(criteria)) {
        return false;
    }

    return criteria.length < 2 || (Array.isArray(criteria[0]) || Array.isArray(criteria[1]));
}

function isCondition(criteria) {
    if(!Array.isArray(criteria)) {
        return false;
    }

    return criteria.length > 1 && !Array.isArray(criteria[0]) && !Array.isArray(criteria[1]);
}

function convertToInnerGroup(group, customOperations) {
    const groupOperation = getCriteriaOperation(group).toLowerCase() || AND_GROUP_OPERATION;
    const innerGroup = [];
    for(let i = 0; i < group.length; i++) {
        if(isGroup(group[i])) {
            innerGroup.push(convertToInnerStructure(group[i], customOperations));
            innerGroup.push(groupOperation);
        } else if(isCondition(group[i])) {
            innerGroup.push(convertToInnerCondition(group[i], customOperations));
            innerGroup.push(groupOperation);
        }
    }

    if(innerGroup.length === 0) {
        innerGroup.push(groupOperation);
    }

    return innerGroup;
}

function conditionHasCustomOperation(condition, customOperations) {
    const customOperation = getCustomOperation(customOperations, condition[1]);
    return customOperation && customOperation.name === condition[1];
}

function convertToInnerCondition(condition, customOperations) {
    if(conditionHasCustomOperation(condition, customOperations)) {
        return condition;
    }

    if(condition.length < 3) {
        condition[2] = condition[1];
        condition[1] = EQUAL_OPERATION;
    }
    return condition;
}

function convertToInnerStructure(value, customOperations) {
    if(!value) {
        return [AND_GROUP_OPERATION];
    }

    value = extend(true, [], value);

    if(isCondition(value)) {
        return [convertToInnerCondition(value, customOperations), AND_GROUP_OPERATION];
    }
    if(isNegationGroup(value)) {
        return ['!', isCondition(value[1])
            ? [convertToInnerCondition(value[1], customOperations), AND_GROUP_OPERATION]
            : isNegationGroup(value[1]) ? [convertToInnerStructure(value[1], customOperations), AND_GROUP_OPERATION] : convertToInnerGroup(value[1], customOperations)];
    }
    return convertToInnerGroup(value, customOperations);
}

function getNormalizedFields(fields) {
    return fields.reduce(function(result, field) {
        if(isDefined(field.dataField)) {
            const normalizedField = {};
            for(const key in field) {
                if(field[key] && AVAILABLE_FIELD_PROPERTIES.indexOf(key) > -1) {
                    normalizedField[key] = field[key];
                }
            }
            normalizedField.defaultCalculateFilterExpression = filterUtils.defaultCalculateFilterExpression;
            if(!isDefined(normalizedField.dataType)) {
                normalizedField.dataType = DEFAULT_DATA_TYPE;
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

    if(customOperation && customOperation.calculateFilterExpression) {
        return customOperation.calculateFilterExpression.apply(customOperation, [filterExpression[2], field, target]);
    } else if(field.createFilterExpression) {
        return field.createFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
    } else if(field.calculateFilterExpression) {
        return field.calculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
    } else {
        return field.defaultCalculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
    }
}

function getFilterExpression(value, fields, customOperations, target) {
    if(!isDefined(value)) {
        return null;
    }

    if(isNegationGroup(value)) {
        const filterExpression = getFilterExpression(value[1], fields, customOperations, target);
        return ['!', filterExpression];
    }
    const criteria = getGroupCriteria(value);
    if(isCondition(criteria)) {
        return getConditionFilterExpression(criteria, fields, customOperations, target) || null;
    } else {
        let filterExpression;
        const groupValue = getGroupValue(criteria);
        const result = [];

        for(let i = 0; i < criteria.length; i++) {
            if(isGroup(criteria[i])) {
                filterExpression = getFilterExpression(criteria[i], fields, customOperations, target);
                if(filterExpression) {
                    i && result.push(groupValue);
                    result.push(filterExpression);
                }
            } else if(isCondition(criteria[i])) {
                filterExpression = getConditionFilterExpression(criteria[i], fields, customOperations, target);
                if(filterExpression) {
                    i && result.push(groupValue);
                    result.push(filterExpression);
                }
            }
        }
        return result.length ? result : null;
    }
}

function getNormalizedFilter(group) {
    const criteria = getGroupCriteria(group);
    let i;

    if(criteria.length === 0) {
        return null;
    }

    const itemsForRemove = [];
    for(i = 0; i < criteria.length; i++) {
        if(isGroup(criteria[i])) {
            const normalizedGroupValue = getNormalizedFilter(criteria[i]);
            if(normalizedGroupValue) {
                criteria[i] = normalizedGroupValue;
            } else {
                itemsForRemove.push(criteria[i]);
            }
        } else if(isCondition(criteria[i])) {
            if(!isValidCondition(criteria[i])) {
                itemsForRemove.push(criteria[i]);
            }
        }
    }
    for(i = 0; i < itemsForRemove.length; i++) {
        removeItem(criteria, itemsForRemove[i]);
    }

    if((criteria.length === 1)) {
        return null;
    }

    criteria.splice(criteria.length - 1, 1);

    if(criteria.length === 1) {
        group = setGroupCriteria(group, criteria[0]);
    }

    if(group.length === 0) {
        return null;
    }

    return group;
}

function getCurrentLookupValueText(field, value, handler) {
    if(value === '') {
        handler('');
        return;
    }
    const lookup = field.lookup;
    if(lookup.items) {
        handler(lookup.calculateCellValue(value) || '');
    } else {
        const dataSource = new DataSource(lookup.dataSource);
        dataSource.loadSingle(lookup.valueExpr, value).done(function(result) {
            result ? handler(lookup.displayExpr ? compileGetter(lookup.displayExpr)(result) : result) : handler('');
        }).fail(function() {
            handler('');
        });
    }
}

function getPrimitiveValueText(field, value, customOperation, target) {
    let valueText;
    if(value === true) {
        valueText = field.trueText || messageLocalization.format('dxDataGrid-trueText');
    } else if(value === false) {
        valueText = field.falseText || messageLocalization.format('dxDataGrid-falseText');
    } else {
        valueText = getFormattedValueText(field, value);
    }
    if(field.customizeText) {
        valueText = field.customizeText.call(field, {
            value: value,
            valueText: valueText,
            target: target
        });
    }
    if(customOperation && customOperation.customizeText) {
        valueText = customOperation.customizeText.call(customOperation, {
            value: value,
            valueText: valueText,
            field: field,
            target: target
        });
    }
    return valueText;
}

function getArrayValueText(field, value, customOperation, target) {
    return value.map(v => getPrimitiveValueText(field, v, customOperation, target));
}

function checkDefaultValue(value) {
    return value === '' || value === null;
}

function getCurrentValueText(field, value, customOperation, target = 'filterBuilder') {
    if(checkDefaultValue(value)) {
        return '';
    }

    if(Array.isArray(value)) {
        const result = new Deferred();
        when.apply(this, getArrayValueText(field, value, customOperation, target)).done((...args) => {
            const text = args.some(item => !checkDefaultValue(item))
                ? args.map(item => !checkDefaultValue(item) ? item : '?')
                : '';
            result.resolve(text);
        });
        return result;
    } else {
        return getPrimitiveValueText(field, value, customOperation, target);
    }
}

function itemExists(plainItems, parentId) {
    return plainItems.some(function(item) { return item.dataField === parentId; });
}

function pushItemAndCheckParent(originalItems, plainItems, item) {
    const dataField = item.dataField;
    if(hasParent(dataField)) {
        item.parentId = getParentIdFromItemDataField(dataField);
        if(!itemExists(plainItems, item.parentId) && !itemExists(originalItems, item.parentId)) {
            pushItemAndCheckParent(originalItems, plainItems, {
                id: item.parentId,
                dataType: 'object',
                dataField: item.parentId,
                caption: generateCaptionByDataField(item.parentId, true),
                filterOperations: ['isblank', 'isnotblank']
            });
        }
    }
    plainItems.push(item);
}

function generateCaptionByDataField(dataField, allowHierarchicalFields) {
    let caption = '';

    if(allowHierarchicalFields) {
        dataField = dataField.substring(dataField.lastIndexOf('.') + 1);
    } else if(hasParent(dataField)) {
        dataField.split('.').forEach(function(field, index, arr) {
            caption += inflector.captionize(field);
            if(index !== (arr.length - 1)) {
                caption += '.';
            }
        });

        return caption;
    }

    return inflector.captionize(dataField);
}

function getItems(fields, allowHierarchicalFields) {
    const items = [];

    for(let i = 0; i < fields.length; i++) {
        const item = extend(true, { caption: generateCaptionByDataField(fields[i].dataField, allowHierarchicalFields) }, fields[i]);
        item.id = item.name || item.dataField;

        if(allowHierarchicalFields) {
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
    if(hasParent(item.dataField)) {
        const parentId = getParentIdFromItemDataField(item.dataField);
        for(let i = 0; i < plainItems.length; i++) {
            if(plainItems[i].dataField === parentId) {
                return getCaptionWithParents(plainItems[i], plainItems) + '.' + item.caption;
            }
        }
    }
    return item.caption;
}

function updateConditionByOperation(condition, operation, customOperations) {
    let customOperation = getCustomOperation(customOperations, operation);
    if(customOperation) {
        if(customOperation.hasValue === false) {
            condition[1] = operation;
            condition.length = 2;
        } else {
            condition[1] = operation;
            condition[2] = '';
        }
        return condition;
    }

    if(operation === 'isblank') {
        condition[1] = EQUAL_OPERATION;
        condition[2] = null;
    } else if(operation === 'isnotblank') {
        condition[1] = NOT_EQUAL_OPERATION;
        condition[2] = null;
    } else {
        customOperation = getCustomOperation(customOperations, condition[1]);
        if(customOperation || (condition.length === 2 || condition[2] === null)) {
            condition[2] = '';
        }
        condition[1] = operation;
    }
    return condition;
}

function getOperationValue(condition) {
    let caption;
    if(condition[2] === null) {
        if(condition[1] === EQUAL_OPERATION) {
            caption = 'isblank';
        } else {
            caption = 'isnotblank';
        }
    } else {
        caption = condition[1];
    }
    return caption;
}

function isValidCondition(condition) {
    return condition[2] !== '';
}

function getMergedOperations(customOperations, betweenCaption) {
    const result = extend(true, [], customOperations);
    let betweenIndex = -1;
    result.some(function(customOperation, index) {
        if(customOperation.name === 'between') {
            betweenIndex = index;
            return true;
        }
    });
    if(betweenIndex !== -1) {
        result[betweenIndex] = extend(between.getConfig(betweenCaption), result[betweenIndex]);
    } else {
        result.unshift(between.getConfig(betweenCaption));
    }
    return result;
}

function isMatchedCondition(filter, addedFilterDataField) {
    return filter[0] === addedFilterDataField;
}

function removeFieldConditionsFromFilter(filter, dataField) {
    if(!filter || filter.length === 0) {
        return null;
    }

    if(isCondition(filter)) {
        const hasMatchedCondition = isMatchedCondition(filter, dataField);
        return !hasMatchedCondition ? filter : null;
    } else {
        return syncConditionIntoGroup(filter, [dataField], false);
    }
}

function syncConditionIntoGroup(filter, addedFilter, canPush) {
    const result = [];
    filter.forEach(function(item) {
        if(isCondition(item)) {
            if(isMatchedCondition(item, addedFilter[0])) {
                if(canPush) {
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

    if(result.length === 0) {
        return null;
    }

    if(canPush) {
        result.push(AND_GROUP_OPERATION);
        result.push(addedFilter);
    }

    return result.length === 1 ? result[0] : result;
}

function syncFilters(filter, addedFilter) {
    if(filter === null || filter.length === 0) {
        return addedFilter;
    }

    if(isCondition(filter)) {
        if(isMatchedCondition(filter, addedFilter[0])) {
            return addedFilter;
        } else {
            return [filter, AND_GROUP_OPERATION, addedFilter];
        }
    }

    const groupValue = getGroupValue(filter);
    if(groupValue !== AND_GROUP_OPERATION) {
        return [addedFilter, 'and', filter];
    }

    return syncConditionIntoGroup(filter, addedFilter, true);
}

function getMatchedConditions(filter, dataField) {
    if(filter === null || filter.length === 0) return [];

    if(isCondition(filter)) {
        if(isMatchedCondition(filter, dataField)) {
            return [filter];
        } else {
            return [];
        }
    }

    const groupValue = getGroupValue(filter);
    if(groupValue !== AND_GROUP_OPERATION) {
        return [];
    }

    const result = filter.filter(function(item) {
        return isCondition(item) && isMatchedCondition(item, dataField);
    });

    return result;
}

function filterHasField(filter, dataField) {
    if(filter === null || filter.length === 0) return false;

    if(isCondition(filter)) {
        return filter[0] === dataField;
    }

    return filter.some(function(item) {
        return (isCondition(item) || isGroup(item)) && filterHasField(item, dataField);
    });
}

exports.isValidCondition = isValidCondition;
exports.isEmptyGroup = isEmptyGroup;
exports.getOperationFromAvailable = getOperationFromAvailable;
exports.updateConditionByOperation = updateConditionByOperation;
exports.getCaptionWithParents = getCaptionWithParents;
exports.getItems = getItems;
exports.setGroupValue = setGroupValue;
exports.getGroupMenuItem = getGroupMenuItem;
exports.getGroupValue = getGroupValue;
exports.getAvailableOperations = getAvailableOperations;
exports.removeItem = removeItem;
exports.createCondition = createCondition;
exports.createEmptyGroup = createEmptyGroup;
exports.addItem = addItem;
exports.getField = getField;
exports.isGroup = isGroup;
exports.isCondition = isCondition;
exports.getNormalizedFields = getNormalizedFields;
exports.getNormalizedFilter = getNormalizedFilter;
exports.getGroupCriteria = getGroupCriteria;
exports.convertToInnerStructure = convertToInnerStructure;
exports.getDefaultOperation = getDefaultOperation;
exports.getCurrentValueText = getCurrentValueText;
exports.getCurrentLookupValueText = getCurrentLookupValueText;
exports.getFilterOperations = getFilterOperations;
exports.getCaptionByOperation = getCaptionByOperation;
exports.getOperationValue = getOperationValue;
exports.getFilterExpression = getFilterExpression;
exports.getCustomOperation = getCustomOperation;
exports.getMergedOperations = getMergedOperations;
exports.syncFilters = syncFilters;
exports.getMatchedConditions = getMatchedConditions;
exports.filterHasField = filterHasField;
exports.removeFieldConditionsFromFilter = removeFieldConditionsFromFilter;
