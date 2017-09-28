"use strict";

var errors = require("../../data/errors").errors,
    formatHelper = require("../../format_helper");

function getGroupCriteria(group) {
    var criteria;
    if(group.length > 1 && group[0] === "!") {
        criteria = group[1];
    } else {
        criteria = group;
    }
    return criteria;
}

function setGroupValue(group, value) {
    var criteria,
        i;

    if(value.indexOf("!") !== -1) {
        value = value.substring(1);
        if(group.length > 1 && group[0] === "!") {
            criteria = group[1];
        } else {
            criteria = [];
            for(i = 0; i < group.length; i++) {
                criteria.push(group[i]);
            }
            group.length = 0;
            group.push("!");
            group.push(criteria);
        }
    } else {
        criteria = getGroupCriteria(group);
        if(criteria !== group) {
            group.length = 0;
            for(i = 0; i < criteria.length; i++) {
                group.push(criteria[i]);
            }
        }
    }

    criteria = getGroupCriteria(group);
    for(i = 0; i < criteria.length; i++) {
        if(!Array.isArray(criteria[i])) {
            criteria[i] = value;
        }
    }
    return group;
}

function getGroupText(group, availableGroups) {
    var groupValue = getGroupValue(group);
    for(var i = 0; i < availableGroups.length; i++) {
        var item = availableGroups[i];
        if(item.value === groupValue) {
            return item.text;
        }
    }
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

function getAvailableOperations(field) {
    var filterOperations = [];
    var addItem = function(filterOperations, item) {
        filterOperations.push({ text: item });
    }
    if(filterOperations.length === 0) {
        addItem(filterOperations, "=");
        addItem(filterOperations, "<>");
    } else {
        for(var i = 0; i < field.filterOperations.length; i++) {
            addItem(filterOperations, field.filterOperations[i]);
        }
    }
    return filterOperations;
}

function getDefaultOperation(field) {
    if(field.defaultFilterOperation) {
        return field.defaultFilterOperation;
    } else {
        return getAvailableOperations(field)[0].text;
    }
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
        var groupValue = getGroupValue(criteria);
        var lastItemIsGroupOperation = criteria[group.length - 1] === groupValue;
        if(!lastItemIsGroupOperation) {
            var groupOperation = criteria[0];
            criteria[0] = criteria[1];
            criteria[1] = groupOperation;
        }
    }
    return group;
}

function createCondition(field, operation, operand) {
    return [field, operation, operand];
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
            criteria.push(groupValue);
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
    throw "Field \"" + dataField + "\" has not found";
}

function isGroup(item) {
    var isGroup = item.length === 1;
    if(!isGroup) {
        for(var i = 0; i < item.length; i++) {
            var isArray = Array.isArray(item[i]);
            if(isArray) {
                isGroup = true;
                break;
            }
        }
    }
    return isGroup;
}

function isCondition(item) {
    return Array.isArray(item);
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

exports.setGroupValue = setGroupValue;
exports.getGroupText = getGroupText;
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
