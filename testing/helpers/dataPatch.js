/* global jQuery */

"use strict";

var dataStrategy = require("core/element_data").getDataStrategy();

if(!QUnit.urlParams["nojquery"]) {
    return;
}

var originalCleanData = jQuery.cleanData;

QUnit.testStart(function() {
    jQuery.cleanData = function() {
        dataStrategy.cleanData.apply(this, arguments);
        originalCleanData.apply(this, arguments);
    };
});

QUnit.testDone(function() {
    jQuery.cleanData = originalCleanData;
});
