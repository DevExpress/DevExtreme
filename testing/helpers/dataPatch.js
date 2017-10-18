/* global jQuery */

"use strict";

var dataStrategy = require("core/element_data");

var originalCleanData = jQuery.cleanData;

QUnit.testStart(function() {
    if(!jQuery) {
        return;
    }

    jQuery.cleanData = function() {
        dataStrategy.cleanData.apply(this, arguments);
        originalCleanData.apply(this, arguments);
    };
});

QUnit.testDone(function() {
    if(!jQuery) {
        return;
    }

    jQuery.cleanData = originalCleanData;
});
