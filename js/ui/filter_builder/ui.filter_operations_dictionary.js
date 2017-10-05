"use strict";

var messageLocalization = require("../../localization/message");

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

    OPERATION_DESCRIPTORS = {
        "=": messageLocalization.format("dxFilterBuilder-filterOperationEquals"),
        "<>": messageLocalization.format("dxFilterBuilder-filterOperationNotEquals"),
        "<": messageLocalization.format("dxFilterBuilder-filterOperationLess"),
        "<=": messageLocalization.format("dxFilterBuilder-filterOperationLessOrEquals"),
        ">": messageLocalization.format("dxFilterBuilder-filterOperationGreater"),
        ">=": messageLocalization.format("dxFilterBuilder-filterOperationGreaterOrEquals"),
        "notcontains": messageLocalization.format("dxFilterBuilder-filterOperationNotContains"),
        "contains": messageLocalization.format("dxFilterBuilder-filterOperationContains"),
        "startswith": messageLocalization.format("dxFilterBuilder-filterOperationStartsWith"),
        "endswith": messageLocalization.format("dxFilterBuilder-filterOperationEndsWith")
    };

module.exports = {
    getIconByFilterOperation: function(filterOperation) {
        return OPERATION_ICONS[filterOperation];
    },

    getDescriptionByFilterOperation: function(filterOperation) {
        return OPERATION_DESCRIPTORS[filterOperation];
    }
};
