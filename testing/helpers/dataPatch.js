/* global jQuery */

"use strict";

var dataStrategy = require("core/element_data").getDataStrategy();

if(!QUnit.urlParams["nojquery"]) {
    return;
}

var originalCleanData = jQuery.cleanData;
//var originalData = jQuery.data;

QUnit.testStart(function() {
    jQuery.cleanData = function() {
        dataStrategy.cleanData.apply(this, arguments);
        originalCleanData.apply(this, arguments);
    };

    //jQuery.data = dataStrategy.data;
});

QUnit.testDone(function() {
    jQuery.cleanData = originalCleanData;
    //jQuery.data = originalData;
});
