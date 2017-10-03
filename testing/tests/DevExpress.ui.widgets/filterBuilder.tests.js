"use strict";

var $ = require("jquery");

require("common.css!");
require("generic_light.css!");

window.fields = [{
    caption: "Company Name",
    dataField: "CompanyName",
    dataType: "string",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: "",
    lookup: {
        dataSource: [{
            value: "K&S Music",
            text: "K&S Music"
        }, {
            value: "Super Mart of the West",
            text: "Super Mart of the West"
        }],
        valueExpr: "value",
        displayExpr: "text"
    }
}, {
    caption: "Date",
    dataField: "Date",
    dataType: "date",
    format: "shortDate",
    filterOperations: ["=", "<>", "<", ">", "<=", ">="],
    defaultFilterOperation: ""
}, {
    caption: "State",
    dataField: "State",
    dataType: "string",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: ""
}, {
    caption: "Zipcode",
    dataField: "Zipcode",
    dataType: "number",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: ["=", "<>", "<", ">", "<=", ">="]
},
{
    caption: "Contributor",
    dataField: "Contributor",
    dataType: "boolean",
    format: undefined,
    filterOperations: [],
    defaultFilterOperation: ""
}];

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="container"></div>');
});

require("./filterBuilderParts/commonTests.js");
require("./filterBuilderParts/utilsTests.js");
