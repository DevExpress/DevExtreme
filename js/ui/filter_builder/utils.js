"use strict";

var dataErrors = require("../../data/errors").errors,
    domAdapter = require("../../core/dom_adapter"),
    errors = require("../widget/ui.errors"),
    filterUtils = require("../shared/filtering"),
    extend = require("../../core/utils/extend").extend,
    isDefined = require("../../core/utils/type").isDefined,
    formatHelper = require("../../format_helper"),
    inflector = require("../../core/utils/inflector"),
    messageLocalization = require("../../localization/message"),
    DataSource = require("../../data/data_source/data_source").DataSource,
    filterOperationsDictionary = require("./ui.filter_operations_dictionary");

var DEFAULT_DATA_TYPE = "string",
    AND_GROUP_OPERATION = "and",
    DATATYPE_OPERATIONS = {
        "number": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "string": ["contains", "notcontains", "startswith", "endswith", "=", "<>", "isblank", "isnotblank"],
        "date": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "datetime": ["=", "<>", "<", ">", "<=", ">=", "isblank", "isnotblank"],
        "boolean": ["=", "<>", "isblank", "isnotblank"],
        "object": ["isblank", "isnotblank"]
    },
    LOOKUP_OPERATIONS = ["=", "<>", "isblank", "isnotblank"],
    DEFAULT_FORMAT = {
        "date": "shortDate",
        "datetime": "shortDateShortTime"
    },
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

function getFilterOperations(field) {
    var result = field.filterOperations || (field.lookup && LOOKUP_OPERATIONS) || DATATYPE_OPERATIONS[field.dataType || DEFAULT_DATA_TYPE];
    return extend([], result);
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
                icon: customOperation.icon,
                text: customOperation.caption || inflector.captionize(customOperation.name),
                value: customOperation.name
            };
        } else {
            return {
                icon: filterOperationsDictionary.getIconByFilterOperation(operation),
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
        condition[1] = "=";
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
            result.push(normalizedField);
        }
        return result;
    }, []);
}

function getFilterExpression(value, fields, customOperations) {
    var result;

    if(value === null) {
        return null;
    }

    var criteria = getGroupCriteria(value),
        getConditionFilterExpression = function(condition) {
            var field = getField(condition[0], fields),
                filterExpression = convertToInnerCondition(condition, customOperations),
                customOperation = customOperations.length && getCustomOperation(customOperations, filterExpression[1]);

            if(customOperation && customOperation.calculateFilterExpression) {
                return customOperation.calculateFilterExpression.apply(customOperation, [filterExpression[2], field]);
            } else if(field.calculateFilterExpression) {
                return field.calculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1]]);
            } else {
                return filterUtils.defaultCalculateFilterExpression.apply(field, [filterExpression[2], filterExpression[1]], "filterBuilder");
            }
        };

    if(isCondition(criteria)) {
        result = getConditionFilterExpression(criteria, customOperations);
    } else {
        result = [];
        for(var i = 0; i < criteria.length; i++) {
            if(isGroup(criteria[i])) {
                var filterExpression = getFilterExpression(criteria[i], fields, customOperations);
                result.push(filterExpression);
            } else if(isCondition(criteria[i])) {
                result.push(getConditionFilterExpression(criteria[i]));
            } else {
                result.push(criteria[i]);
            }
        }
    }

    return result;
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

function getFieldFormat(field) {
    return field.format || DEFAULT_FORMAT[field.dataType];
}

function getCurrentLookupValueText(field, value, handler) {
    if(value === "") {
        handler("");
        return;
    }
    var dataSource = new DataSource(field.lookup.dataSource);
    dataSource.filter(field.lookup.valueExpr, value);
    dataSource.load().done(function(result) {
        if(result && result.length > 0) {
            var data = result[0];
            handler(field.lookup.displayExpr ? data[field.lookup.displayExpr] : data);
        } else {
            handler("");
        }
    }).fail(function() {
        handler("");
    });
}

function getCurrentValueText(field, value, customOperation) {
    var valueText;
    if(value === true) {
        valueText = field.trueText || messageLocalization.format("dxDataGrid-trueText");
    } else if(value === false) {
        valueText = field.falseText || messageLocalization.format("dxDataGrid-falseText");
    } else {
        valueText = formatHelper.format(value, getFieldFormat(field));
    }
    if(customOperation && customOperation.customizeText) {
        valueText = customOperation.customizeText.call(customOperation, {
            value: value,
            valueText: valueText,
            field: field
        });
    } else if(field.customizeText) {
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
        condition[1] = "=";
        condition[2] = null;
    } else if(operation === "isnotblank") {
        condition[1] = "<>";
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

function isValidCondition(condition, field) {
    if(field.dataType && field.dataType !== "string") {
        return condition[2] !== "";
    }
    return true;
}

function setFocusToBody() {
    var doc = domAdapter.getDocument();
    if(doc && doc.activeElement && doc.activeElement.nodeName.toLowerCase() !== "body") {
        doc.activeElement.blur();
    }
}

function getBetweenConfig(editorTemplate) {
    return {
        name: "between",
        caption: messageLocalization.format("dxDataGrid-filterRowOperationBetween"),
        icon: "range",
        dataTypes: ["number", "date", "datetime"],
        calculateFilterExpression: function(filterValue, field) {
            if(!filterValue || filterValue.length < 2) return null;
            return [[field.dataField, ">=", filterValue[0]], "and", [field.dataField, "<=", filterValue[1]]];
        },
        editorTemplate: editorTemplate,
        customizeText: function(conditionInfo) {
            var startValue = conditionInfo.value[0],
                endValue = conditionInfo.value[1],
                fieldFormat = getFieldFormat(conditionInfo.field);

            if(!isDefined(startValue) && !isDefined(endValue)) {
                return messageLocalization.format("dxFilterBuilder-enterValueText");
            }

            return (isDefined(startValue) ? formatHelper.format(startValue, fieldFormat) : "?") + " - "
                        + (isDefined(endValue) ? formatHelper.format(endValue, fieldFormat) : "?");
        }
    };
}

function getMergedOperations(customOperations, betweenEditorTemplate) {
    var result = extend(true, [], customOperations),
        betweenIndex = -1;
    result.some(function(customOperation, index) {
        if(customOperation.name === "between") {
            betweenIndex = index;
            return true;
        }
    });
    if(betweenIndex !== -1) {
        result[betweenIndex] = extend(getBetweenConfig(betweenEditorTemplate), result[betweenIndex]);
    }
    return result;
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
exports.setFocusToBody = setFocusToBody;
exports.getFilterExpression = getFilterExpression;
exports.getCustomOperation = getCustomOperation;
exports.getMergedOperations = getMergedOperations;
