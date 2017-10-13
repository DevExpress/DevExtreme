"use strict";

var OPERATION_ICONS = {
        "=": "equal",
        "<>": "notequal",
        "<": "less",
        "<=": "lessorequal",
        ">": "greater",
        ">=": "greaterorequal",
        "notcontains": "doesnotcontain",
        "contains": "contains",
        "startswith": "startswith",
        "endswith": "endswith"
    },

    OPERATION_NAME = {
        "=": "equal",
        "<>": "notEqual",
        "<": "lessThan",
        "<=": "lessThanOrEqual",
        ">": "greaterThan",
        ">=": "greaterThanOrEqual",
        "startswith": "startsWith",
        "contains": "contains",
        "notcontains": "notContains",
        "endswith": "endsWith",
        "isblank": "isBlank",
        "isnotblank": "isNotBlank"
    };

module.exports = {
    getIconByFilterOperation: function(filterOperation) {
        return OPERATION_ICONS[filterOperation];
    },

    getNameByFilterOperation: function(filterOperation) {
        return OPERATION_NAME[filterOperation];
    }
};
