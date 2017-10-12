"use strict";

var dataErrors = require("../../data/errors").errors,
    errors = require("../widget/ui.errors"),
    extend = require("../../core/utils/extend").extend,
    formatHelper = require("../../format_helper"),
    inflector = require("../../core/utils/inflector"),
    filterOperationsDictionary = require("./ui.filter_operations_dictionary");

var DEFAULT_DATA_TYPE = "string",
    DATATYPE_OPERATIONS = {
        "number": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "string": ["contains", "notcontains", "startswith", "endswith", "=", "<>", "isblank", "isnotblank"],
        "date": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "datetime": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "boolean": ["=", "<>", "isblank", "isnotblank"],
        "object": ["isblank", "isnotblank"]
    };

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
        },
        addValueToCriteria = function(criteria, value) {
            if(criteria.length === 0) {
                criteria.push(value);
            } else {
                var oldCriteria = criteria.slice(0);
                criteria.length = 0;
                for(i = 0; i < oldCriteria.length; i++) {
                    criteria.push(oldCriteria[i]);
                    if(i !== oldCriteria.length - 1) {
                        criteria.push(value);
                    }
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

    return availableGroups.filter(function(item) {
        return item.value === groupValue;
    })[0];
}

function getGroupValue(group) {
    var value = "",
        criteria = getGroupCriteria(group);

    for(var i = 0; i < criteria.length; i++) {
        var item = criteria[i];
        if(!Array.isArray(item)) {
            if(value && value !== item) {
                throw new dataErrors.Error("E4019");
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
    return criteria.some(function(item) {
        return !Array.isArray(item);
    });
}

function getFilterOperations(field) {
    return field.filterOperations || DATATYPE_OPERATIONS[field.dataType || DEFAULT_DATA_TYPE];
}

function getCaptionByOperation(operation, filterOperationDescriptions) {
    var operationName = filterOperationsDictionary.getNameByFilterOperation(operation);

    return filterOperationDescriptions && filterOperationDescriptions[operationName];
}

function getOperationFromAvailable(operation, availableOperations) {
    for(var i = 0; i < availableOperations.length; i++) {
        if(availableOperations[i].value === operation) {
            return availableOperations[i];
        }
    }
    throw new errors.Error("E1048", operation);
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
    return field.defaultFilterOperation || getFilterOperations(field)[0];
}

function createCondition(field) {
    var condition = [field.dataField, "", ""],
        filterOperation = getDefaultOperation(field);

    updateConditionByOperation(condition, filterOperation);

    return condition;
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
    return value.indexOf("not") !== -1 ? ["!", [value.substring(3)]] : [value];
}

function addItem(item, group) {
    var criteria = getGroupCriteria(group),
        groupValue = getGroupValue(criteria);

    if(criteria.length === 0) {
        criteria.push(item, groupValue);
    } else {
        var lastItemIsGroupOperation = criteria[criteria.length - 1] === groupValue;
        if(lastItemIsGroupOperation) {
            criteria[criteria.length === 1 ? "unshift" : "push"](item);
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
    throw new errors.Error("E1047", dataField);
}

function isGroup(criteria) {
    if(!Array.isArray(criteria)) {
        return false;
    }

    return criteria.length === 1 || criteria.some(function(item) {
        return Array.isArray(item);
    });
}

function isCondition(criteria) {
    if(!Array.isArray(criteria)) {
        return false;
    }

    return criteria.length > 1 && !criteria.some(function(item) {
        return Array.isArray(item);
    });
}

function removeAndOperationFromGroup(group) {
    var index = group.indexOf("And");
    while(index !== -1) {
        group.splice(index, 1);
        index = group.indexOf("And");
    }
}

function convertToInnerStructure(value) {
    if(!value) {
        return [];
    }
    if(isCondition(value)) {
        return [value];
    }
    if(isNegationGroup(value)) {
        return ["!", isCondition(value[1]) ? [value[1]] : value[1]];
    }
    return copyGroup(value);
}

function getNormalizedFilter(group) {
    var criteria = getGroupCriteria(group),
        i;

    if(criteria.length === 0) {
        return null;
    }

    var itemsForRemove = [];
    for(i = 0; i < criteria.length; i++) {
        if(isGroup(criteria[i])) {
            var normalizedGroupValue = getNormalizedFilter(criteria[i]);
            if(normalizedGroupValue) {
                criteria[i] = normalizedGroupValue;
            } else {
                itemsForRemove.push(criteria[i]);
            }
        }
    }
    for(i = 0; i < itemsForRemove.length; i++) {
        removeItem(criteria, itemsForRemove[i]);
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
        group = setGroupCriteria(group, criteria[0]);
    } else if(isGroup(criteria)) {
        removeAndOperationFromGroup(criteria);
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
        valueText = field.customizeText.call(field, {
            value: value,
            valueText: valueText
        });
    }
    return valueText;
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

function updateConditionByOperation(condition, operation) {
    if(operation === "isblank") {
        condition[1] = "=";
        condition[2] = null;
    } else if(operation === "isnotblank") {
        condition[1] = "<>";
        condition[2] = null;
    } else {
        condition[1] = operation;
        if(condition[2] === null) {
            condition[2] = "";
        }
    }
    return condition;
}

function getOperationValue(condition) {
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

function copyGroup(group) {
    var result = [];
    for(var i = 0; i < group.length; i++) {
        var item = group[i];
        result.push(isGroup(item) ? copyGroup(item) : item);
    }
    return result;
}

exports.getOperationFromAvailable = getOperationFromAvailable;
exports.updateConditionByOperation = updateConditionByOperation;
exports.getCaptionWithParents = getCaptionWithParents;
exports.getItems = getItems;
exports.setGroupValue = setGroupValue;
exports.getGroupMenuItem = getGroupMenuItem;
exports.getGroupValue = getGroupValue;
exports.getAvailableOperations = getAvailableOperations;
exports.removeItem = removeItem;
exports.copyGroup = copyGroup;
exports.createCondition = createCondition;
exports.createEmptyGroup = createEmptyGroup;
exports.addItem = addItem;
exports.getField = getField;
exports.isGroup = isGroup;
exports.isCondition = isCondition;
exports.getNormalizedFilter = getNormalizedFilter;
exports.getGroupCriteria = getGroupCriteria;
exports.convertToInnerStructure = convertToInnerStructure;
exports.getDefaultOperation = getDefaultOperation;
exports.getCurrentValueText = getCurrentValueText;
exports.getFilterOperations = getFilterOperations;
exports.getCaptionByOperation = getCaptionByOperation;
exports.getOperationValue = getOperationValue;
