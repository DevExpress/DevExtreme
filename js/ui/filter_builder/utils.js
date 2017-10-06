"use strict";

var errors = require("../../data/errors").errors,
    extend = require("../../core/utils/extend").extend,
    formatHelper = require("../../format_helper"),
    filterOperationsDictionary = require("./ui.filter_operations_dictionary");

var DEFAULT_DATA_TYPE = "string",
    DATATYPE_OPERATIONS = {
        "number": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "string": ["contains", "notcontains", "startswith", "endswith", "=", "<>", "isblank", "isnotblank"],
        "date": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "boolean": ["=", "<>", "isblank", "isnotblank"],
        "object": ["isblank", "isnotblank"]
    };

function getGroupCriteria(group) {
    var criteria;
    if(group.length > 1
        && group[0] === "!"
        && !isCondition(group)
    ) {
        criteria = group[1];
    } else {
        criteria = group;
    }
    return criteria;
}

function convertGroupToNewStructure(group, value) {
    var isNegationValue = function(value) {
            return value.indexOf("!") !== -1;
        },
        isNegationGroup = function(group) {
            return group.length > 1 && group[0] === "!";
        },
        convertGroupToNegationGroup = function(group) {
            var criteria = [];
            for(var i = 0; i < group.length; i++) {
                criteria.push(group[i]);
            }
            group.length = 0;
            group.push("!");
            group.push(criteria);
        },
        convertNegationGroupToGroup = function(group) {
            var criteria = getGroupCriteria(group);
            group.length = 0;
            for(var i = 0; i < criteria.length; i++) {
                group.push(criteria[i]);
            }
        };

    if(isNegationValue(value)) {
        if(!isNegationGroup(group)) {
            convertGroupToNegationGroup(group);
        }
    } else {
        if(isNegationGroup(group)) {
            convertNegationGroupToGroup(group);
        }
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
        },
        addValueToCriteria = function(criteria, value) {
            var oldCriteria = [];
            for(i = 0; i < criteria.length; i++) {
                oldCriteria.push(criteria[i]);
            }
            criteria.length = 0;
            for(i = 0; i < oldCriteria.length; i++) {
                criteria.push(oldCriteria[i]);
                if(i !== oldCriteria.length - 1) {
                    criteria.push(value);
                }
            }
        };

    value = getNormalizedGroupValue(value);

    if(isCriteriaContainValueItem(criteria)) {
        changeCriteriaValue(criteria, value);
    } else {
        addValueToCriteria(criteria, value);
    }
    return group;
}

function getGroupMenuItem(group, availableGroups) {
    var groupValue = getGroupValue(group);
    for(var i = 0; i < availableGroups.length; i++) {
        var item = availableGroups[i];
        if(item.value === groupValue) {
            return item;
        }
    }
    //TODO: group item wasn't found
}

function getGroupValue(group) {
    var value = "",
        criteria = getGroupCriteria(group);

    for(var i = 0; i < criteria.length; i++) {
        var item = criteria[i];
        if(!Array.isArray(item)) {
            if(value && value !== item) {
                throw new errors.Error("E4019");
            }
            value = item;
        }
    }
    if(!value) {
        value = "And";
    }
    if(criteria !== group) {
        value = "!" + value;
    }
    return value;
}

function isCriteriaContainValueItem(criteria) {
    for(var i = 0; i < criteria.length; i++) {
        var item = criteria[i];
        if(!Array.isArray(item)) {
            return true;
        }
    }
    return false;
}

function getFilterOperations(field) {
    return field.filterOperations || DATATYPE_OPERATIONS[field.dataType || DEFAULT_DATA_TYPE];
}

function getCaptionByOperation(operation, filterOperationDescriptions) {
    var operationName = filterOperationsDictionary.getNameByFilterOperation(operation);

    return filterOperationDescriptions && filterOperationDescriptions[operationName];
}

function getAvailableOperations(field, filterOperationDescriptions) {
    var filterOperations = getFilterOperations(field);

    return filterOperations.map(function(operation) {
        return {
            icon: filterOperationsDictionary.getIconByFilterOperation(operation),
            text: getCaptionByOperation(operation, filterOperationDescriptions),
            value: operation
        };
    });
}

function getDefaultOperation(field) {
    if(field.defaultFilterOperation
        && (field.filterOperations.indexOf(field.defaultFilterOperation) !== -1)) {
        return field.defaultFilterOperation;
    } else {
        return getFilterOperations(field)[0];
    }
}

function createCondition(field) {
    var filterOperation = getDefaultOperation(field);

    return [field.dataField, filterOperation, ""];
}

function removeItem(group, item) {
    var criteria = getGroupCriteria(group),
        index = criteria.indexOf(item);

    criteria.splice(index, 1);
    if(criteria.length > 2) {
        var lastIndex = criteria.length - 1;
        if(index > lastIndex) {
            index = lastIndex;
        }
        criteria.splice(index, 1);
    } else if(criteria.length === 2) {
        var groupValue = getGroupValue(criteria),
            lastItemIsGroupOperation = criteria[group.length - 1] === groupValue,
            firstItemIsGroupOperation = criteria[0] === groupValue;
        if(!lastItemIsGroupOperation && firstItemIsGroupOperation) {
            var groupOperation = criteria[0];
            criteria[0] = criteria[1];
            criteria[1] = groupOperation;
        }
    }
    return group;
}

function createEmptyGroup(value) {
    var group;
    if(value.indexOf("!") !== -1) {
        value = value.substring(4);
        group = ["!", [value]];
    } else {
        group = [value];
    }

    return group;
}

function addItem(item, group) {
    var criteria = getGroupCriteria(group),
        groupValue = getGroupValue(criteria);
    if(criteria.length === 0) {
        criteria.push(item);
        criteria.push(groupValue);
    } else {
        var lastItemIsGroupOperation = criteria[criteria.length - 1] === groupValue;
        if(lastItemIsGroupOperation) {
            if(criteria.length === 1) {
                criteria.splice(0, 1);
                criteria.push(item);
                criteria.push(groupValue);
            } else {
                criteria.push(item);
            }
        } else {
            if(isCriteriaContainValueItem(criteria)) {
                criteria.push(groupValue);
            }
            criteria.push(item);
        }
    }
    return group;
}

function getField(dataField, fields) {
    for(var i = 0; i < fields.length; i++) {
        if(fields[i].dataField.toLowerCase() === dataField.toLowerCase()) {
            return fields[i];
        }
    }
    //TODO: move it to ../../data/errors
    throw "Field \"" + dataField + "\" has not found";
}

function isGroup(item) {
    var isGroup = Array.isArray(item) && item.length === 1;
    if(!isGroup) {
        for(var i = 0; i < item.length; i++) {
            if(Array.isArray(item[i])) {
                isGroup = true;
                break;
            }
        }
    }
    return isGroup;
}

function isCondition(item) {
    var isCondition = Array.isArray(item) && item.length > 1;
    if(isCondition) {
        for(var i = 0; i < item.length; i++) {
            if(Array.isArray(item[i])) {
                isCondition = false;
                break;
            }
        }
    }
    return isCondition;
}

function getNormalizedFilter(group) {
    var criteria = getGroupCriteria(group),
        i;

    if(criteria.length === 0) {
        return null;
    }

    for(i = 0; i < criteria.length; i++) {
        if(isGroup(criteria[i])) {
            var normalizedGroupValue = getNormalizedFilter(criteria[i]);
            if(normalizedGroupValue) {
                criteria[i] = normalizedGroupValue;
            } else {
                removeItem(criteria, criteria[i]);
            }
        }
    }

    var groupValue = getGroupValue(criteria);
    var lastItemIsGroupOperation = criteria[criteria.length - 1] === groupValue;
    if((criteria.length === 1) && (lastItemIsGroupOperation)) {
        return null;
    }

    if(lastItemIsGroupOperation) {
        criteria.splice(criteria.length - 1, 1);
    }

    if(criteria.length === 1) {
        var groupOperation = criteria[0];
        criteria.splice(0, 1);
        for(i = 0; i < groupOperation.length; i++) {
            criteria.push(groupOperation[i]);
        }
    }

    return group;
}

function getCurrentValueText(field, value) {
    var valueText;
    if(value === true) {
        valueText = field.trueText || "true";
    } else if(value === false) {
        valueText = field.falseText || "false";
    } else {
        valueText = formatHelper.format(value, field.format);
    }
    if(field.customizeText) {
        valueText = field.customizeText({
            field: field,
            value: value,
            valueText: valueText
        });
    }
    return valueText;
}

function itemExist(plainItems, parentId) {
    for(var i = 0; i < plainItems.length; i++) {
        if(plainItems[i].dataField === parentId) {
            return true;
        }
    }
    return false;
}

function pushItemAndCheckParent(originalItems, plainItems, item) {
    var dataField = item.dataField;
    if(hasParent(dataField)) {
        item.parentId = getParentIdFromItemDataField(dataField);
        if(!itemExist(plainItems, item.parentId) && !itemExist(originalItems, item.parentId)) {
            var caption = item.parentId.substring(item.parentId.lastIndexOf(".") + 1);
            pushItemAndCheckParent(originalItems, plainItems, {
                dataType: "object",
                dataField: item.parentId,
                caption: caption,
                filterOperations: ["isblank", "isnotblank"]
            });
        }
    }
    plainItems.push(item);
}

function getPlainItems(items) {
    var plainItems = [];
    for(var i = 0; i < items.length; i++) {
        var item = extend(true, {}, items[i]);
        pushItemAndCheckParent(items, plainItems, item);
    }
    return plainItems;
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

function updateConditionByOperator(condition, operator) {
    if(operator === "isblank") {
        condition[1] = "=";
        condition[2] = null;
    } else if(operator === "isnotblank") {
        condition[1] = "<>";
        condition[2] = null;
    } else {
        condition[1] = operator;
        if(condition[2] === null) {
            condition[2] = "";
        }
    }
    return condition;
}

function getOperatorCaption(condition) {
    var caption;
    if(condition[2] === null) {
        if(condition[1] === "=") {
            caption = "isblank";
        } else {
            caption = "isnotblank";
        }
    } else {
        caption = condition[1];
    }
    return caption;
}

exports.updateConditionByOperator = updateConditionByOperator;
exports.getCaptionWithParents = getCaptionWithParents;
exports.getPlainItems = getPlainItems;
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
exports.getNormalizedFilter = getNormalizedFilter;
exports.getGroupCriteria = getGroupCriteria;
exports.getDefaultOperation = getDefaultOperation;
exports.getCurrentValueText = getCurrentValueText;
exports.getFilterOperations = getFilterOperations;
exports.getCaptionByOperation = getCaptionByOperation;
exports.getOperatorCaption = getOperatorCaption;
