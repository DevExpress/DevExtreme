"use strict";

import { Deferred, when } from "../../core/utils/deferred";
import { errors as dataErrors } from "../../data/errors";
import errors from "../widget/ui.errors";
import filterUtils from "../shared/filtering";
import formatHelper from "../../format_helper";
import { extend } from "../../core/utils/extend";
import inflector from "../../core/utils/inflector";
import between from "./between";
import messageLocalization from "../../localization/message";
import { DataSource } from "../../data/data_source/data_source";
import filterOperationsDictionary from "./ui.filter_operations_dictionary";

var DEFAULT_DATA_TYPE = "string",
    EMPTY_MENU_ICON = "icon-none",
    AND_GROUP_OPERATION = "and",
    EQUAL_OPERATION = "=",
    NOT_EQUAL_OPERATION = "<>",
    DATATYPE_OPERATIONS = {
        "number": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "string": ["contains", "notcontains", "startswith", "endswith", "=", "<>", "isblank", "isnotblank"],
        "date": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "datetime": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "boolean": ["=", "<>", "isblank", "isnotblank"],
        "object": ["isblank", "isnotblank"]
    },
    DEFAULT_FORMAT = {
        "date": "shortDate",
        "datetime": "shortDateShortTime"
    },
    LOOKUP_OPERATIONS = ["=", "<>", "isblank", "isnotblank"],
    AVAILABLE_FIELD_PROPERTIES = [
        "caption",
        "customizeText",
        "dataField",
        "dataType",
        "editorTemplate",
        "falseText",
        "editorOptions",
        "filterOperations",
        "format",
        "lookup",
        "trueText",
        "calculateFilterExpression"
    ];

function getFormattedValueText(field, value) {
    var fieldFormat = field.format || DEFAULT_FORMAT[field.dataType];
    return formatHelper.format(value, fieldFormat);
}

function isNegationGroup(group) {
    return group
    && group.length > 1
    && group[0] === "!"
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
    var isNegationValue = function(value) {
            return value.indexOf("!") !== -1;
        },
        convertGroupToNegationGroup = function(group) {
            var criteria = group.slice(0);
            group.length = 0;
            group.push("!", criteria);
        },
        convertNegationGroupToGroup = function(group) {
            var criteria = getGroupCriteria(group);
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

    var criteria = getGroupCriteria(group),
        i,
        getNormalizedGroupValue = function(value) {
            return value.indexOf("!") === -1 ? value : value.substring(1);
        },
        changeCriteriaValue = function(criteria, value) {
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
    var groupValue = getGroupValue(group);

    return availableGroups.filter(function(item) {
        return item.value === groupValue;
    })[0];
}

function getCriteriaOperation(criteria) {
    if(isCondition(criteria)) {
        return AND_GROUP_OPERATION;
    }

    var value = "";
    for(var i = 0; i < criteria.length; i++) {
        var item = criteria[i];
        if(!Array.isArray(item)) {
            if(value && value !== item) {
                throw new dataErrors.Error("E4019");
            }
            value = item;
        }
    }
    return value;
}

function getGroupValue(group) {
    var criteria = getGroupCriteria(group),
        value = getCriteriaOperation(criteria);

    if(!value) {
        value = AND_GROUP_OPERATION;
    }
    if(criteria !== group) {
        value = "!" + value;
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
    var result = containItems(field.filterOperations) ? field.filterOperations : getDefaultFilterOperations(field);
    return extend([], result);
}

function getCaptionByOperation(operation, filterOperationDescriptions) {
    var operationName = filterOperationsDictionary.getNameByFilterOperation(operation);
    return filterOperationDescriptions && filterOperationDescriptions[operationName] ? filterOperationDescriptions[operationName] : operationName;
}

function getOperationFromAvailable(operation, availableOperations) {
    for(var i = 0; i < availableOperations.length; i++) {
        if(availableOperations[i].value === operation) {
            return availableOperations[i];
        }
    }
    throw new errors.Error("E1048", operation);
}

function getCustomOperation(customOperations, name) {
    var filteredOperations = customOperations.filter(function(item) {
        return item.name === name;
    });
    return filteredOperations.length ? filteredOperations[0] : null;
}

function getAvailableOperations(field, filterOperationDescriptions, customOperations) {
    var filterOperations = getFilterOperations(field);

    customOperations.forEach(function(customOperation) {
        if(!field.filterOperations && filterOperations.indexOf(customOperation.name) === -1) {
            var dataTypes = customOperation && customOperation.dataTypes;
            if(dataTypes && dataTypes.indexOf(field.dataType || DEFAULT_DATA_TYPE) >= 0) {
                filterOperations.push(customOperation.name);
            }
        }
    });

    return filterOperations.map(function(operation) {
        var customOperation = getCustomOperation(customOperations, operation);
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
    var condition = [field.dataField, "", ""],
        filterOperation = getDefaultOperation(field);

    updateConditionByOperation(condition, filterOperation, customOperations);

    return condition;
}

function removeItem(group, item) {
    var criteria = getGroupCriteria(group),
        index = criteria.indexOf(item);

    criteria.splice(index, 1);

    if(criteria.length !== 1) {
        criteria.splice(index, 1);
    }
    return group;
}

function createEmptyGroup(value) {
    return value.indexOf("not") !== -1 ? ["!", [value.substring(3).toLowerCase()]] : [value];
}

function isEmptyGroup(group) {
    var criteria = getGroupCriteria(group);

    if(isCondition(criteria)) {
        return false;
    }

    var hasConditions = criteria.some(function(item) {
        return isCondition(item);
    });

    return !hasConditions;
}

function addItem(item, group) {
    var criteria = getGroupCriteria(group),
        groupValue = getGroupValue(criteria);

    criteria.length === 1 ? criteria.unshift(item) : criteria.push(item, groupValue);

    return group;
}

function getField(dataField, fields) {
    for(var i = 0; i < fields.length; i++) {
        if(fields[i].dataField.toLowerCase() === dataField.toLowerCase()) {
            return fields[i];
        }
    }
    var extendedFields = getItems(fields, true).filter(function(item) {
        return item.dataField.toLowerCase() === dataField.toLowerCase();
    });
    if(extendedFields.length > 0) {
        return extendedFields[0];
    }
    throw new errors.Error("E1047", dataField);
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
    var groupOperation = getCriteriaOperation(group).toLowerCase() || AND_GROUP_OPERATION,
        innerGroup = [];
    for(var i = 0; i < group.length; i++) {
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
    var customOperation = getCustomOperation(customOperations, condition[1]);
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
        return ["!", isCondition(value[1])
            ? [convertToInnerCondition(value[1], customOperations), AND_GROUP_OPERATION]
            : convertToInnerGroup(value[1], customOperations)];
    }
    return convertToInnerGroup(value, customOperations);
}

function getNormalizedFields(fields) {
    return fields.reduce(function(result, field) {
        if(typeof field.dataField !== "undefined") {
            var normalizedField = {};
            for(var key in field) {
                if(field[key] && AVAILABLE_FIELD_PROPERTIES.indexOf(key) > -1) {
                    normalizedField[key] = field[key];
                }
            }
            normalizedField.defaultCalculateFilterExpression = filterUtils.defaultCalculateFilterExpression;
            result.push(normalizedField);
        }
        return result;
    }, []);
}

function getConditionFilterExpression(condition, fields, customOperations, target) {
    var field = getField(condition[0], fields),
        filterExpression = convertToInnerCondition(condition, customOperations),
        customOperation = customOperations.length && getCustomOperation(customOperations, filterExpression[1]);

    if(customOperation && customOperation.calculateFilterExpression) {
        return customOperation.calculateFilterExpression.apply(customOperation, [filterExpression[2], field, target]);
    } else if(field.calculateFilterExpression) {
        return field.calculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
    } else {
        return field.defaultCalculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1], target]);
    }
}

function getFilterExpression(value, fields, customOperations, target) {
    if(value === null) {
        return null;
    }

    var criteria = getGroupCriteria(value);

    if(isCondition(criteria)) {
        return getConditionFilterExpression(criteria, fields, customOperations, target) || null;
    } else {
        var result = [],
            filterExpression,
            groupValue = getGroupValue(criteria);
        for(var i = 0; i < criteria.length; i++) {
            if(isGroup(criteria[i])) {
                filterExpression = getFilterExpression(criteria[i], fields, customOperations);
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

function getNormalizedFilter(group, fields) {
    var criteria = getGroupCriteria(group),
        i;

    if(criteria.length === 0) {
        return null;
    }

    var itemsForRemove = [];
    for(i = 0; i < criteria.length; i++) {
        if(isGroup(criteria[i])) {
            var normalizedGroupValue = getNormalizedFilter(criteria[i], fields);
            if(normalizedGroupValue) {
                criteria[i] = normalizedGroupValue;
            } else {
                itemsForRemove.push(criteria[i]);
            }
        } else if(isCondition(criteria[i])) {
            var field = getField(criteria[i][0], fields);
            if(!isValidCondition(criteria[i], field)) {
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
    if(value === "") {
        handler("");
        return;
    }
    var dataSource = new DataSource(field.lookup.dataSource);
    dataSource.loadSingle(field.lookup.valueExpr, value).done(function(result) {
        result ? handler(field.lookup.displayExpr ? result[field.lookup.displayExpr] : result) : handler("");
    }).fail(function() {
        handler("");
    });
}

function getPrimitiveValueText(field, value, customOperation, target) {
    var valueText;
    if(value === true) {
        valueText = field.trueText || messageLocalization.format("dxDataGrid-trueText");
    } else if(value === false) {
        valueText = field.falseText || messageLocalization.format("dxDataGrid-falseText");
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
    return value === "" || value === null;
}

function getCurrentValueText(field, value, customOperation, target = "filterBuilder") {
    if(checkDefaultValue(value)) {
        return "";
    }

    if(Array.isArray(value)) {
        let result = new Deferred();
        when.apply(this, getArrayValueText(field, value, customOperation, target)).done((...args) => {
            let text = args.some(item => !checkDefaultValue(item))
                    ? args.map(item => !checkDefaultValue(item) ? item : "?")
                    : "";
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
    var dataField = item.dataField;
    if(hasParent(dataField)) {
        item.parentId = getParentIdFromItemDataField(dataField);
        if(!itemExists(plainItems, item.parentId) && !itemExists(originalItems, item.parentId)) {
            pushItemAndCheckParent(originalItems, plainItems, {
                dataType: "object",
                dataField: item.parentId,
                caption: generateCaptionByDataField(item.parentId, true),
                filterOperations: ["isblank", "isnotblank"]
            });
        }
    }
    plainItems.push(item);
}

function generateCaptionByDataField(dataField, allowHierarchicalFields) {
    var caption = "";

    if(allowHierarchicalFields) {
        dataField = dataField.substring(dataField.lastIndexOf(".") + 1);
    } else if(hasParent(dataField)) {
        dataField.split(".").forEach(function(field, index, arr) {
            caption += inflector.captionize(field);
            if(index !== (arr.length - 1)) {
                caption += ".";
            }
        });

        return caption;
    }

    return inflector.captionize(dataField);
}

function getItems(fields, allowHierarchicalFields) {
    var items = [];

    for(var i = 0; i < fields.length; i++) {
        var item = extend(true, { caption: generateCaptionByDataField(fields[i].dataField, allowHierarchicalFields) }, fields[i]);

        if(allowHierarchicalFields) {
            pushItemAndCheckParent(fields, items, item);
        } else {
            items.push(item);
        }
    }

    return items;
}

function hasParent(dataField) {
    return dataField.lastIndexOf(".") !== -1;
}

function getParentIdFromItemDataField(dataField) {
    return dataField.substring(0, dataField.lastIndexOf("."));
}

function getCaptionWithParents(item, plainItems) {
    if(hasParent(item.dataField)) {
        var parentId = getParentIdFromItemDataField(item.dataField);
        for(var i = 0; i < plainItems.length; i++) {
            if(plainItems[i].dataField === parentId) {
                return getCaptionWithParents(plainItems[i], plainItems) + "." + item.caption;
            }
        }
    }
    return item.caption;
}

function updateConditionByOperation(condition, operation, customOperations) {
    var customOperation = getCustomOperation(customOperations, operation);
    if(customOperation) {
        if(customOperation.hasValue === false) {
            condition[1] = operation;
            condition.length = 2;
        } else {
            condition[1] = operation;
            condition[2] = "";
        }
        return condition;
    }

    if(operation === "isblank") {
        condition[1] = EQUAL_OPERATION;
        condition[2] = null;
    } else if(operation === "isnotblank") {
        condition[1] = NOT_EQUAL_OPERATION;
        condition[2] = null;
    } else {
        customOperation = getCustomOperation(customOperations, condition[1]);
        if(customOperation || (condition.length === 2 || condition[2] === null)) {
            condition[2] = "";
        }
        condition[1] = operation;
    }
    return condition;
}

function getOperationValue(condition) {
    var caption;
    if(condition[2] === null) {
        if(condition[1] === EQUAL_OPERATION) {
            caption = "isblank";
        } else {
            caption = "isnotblank";
        }
    } else {
        caption = condition[1];
    }
    return caption;
}

function isValidCondition(condition, field) {
    var isCustomOperation = condition.length > 2 && !filterOperationsDictionary.getNameByFilterOperation(condition[1]);
    if((field.dataType && field.dataType !== "string")
        || isCustomOperation) {
        return condition[2] !== "";
    }
    return true;
}

function getMergedOperations(customOperations, betweenCaption) {
    var result = extend(true, [], customOperations),
        betweenIndex = -1;
    result.some(function(customOperation, index) {
        if(customOperation.name === "between") {
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
        var hasMatchedCondition = isMatchedCondition(filter, dataField);
        return !hasMatchedCondition ? filter : null;
    } else {
        return syncConditionIntoGroup(filter, [dataField], false);
    }
}

function syncConditionIntoGroup(filter, addedFilter, canPush) {
    var result = [];
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

    var groupValue = getGroupValue(filter);
    if(groupValue !== AND_GROUP_OPERATION) {
        return [addedFilter, "and", filter];
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

    var groupValue = getGroupValue(filter);
    if(groupValue !== AND_GROUP_OPERATION) {
        return [];
    }

    var result = filter.filter(function(item) {
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
