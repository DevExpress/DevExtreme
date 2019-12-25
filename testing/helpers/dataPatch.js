/* global jQuery */

var dataStrategy = require('core/element_data');

var originalCleanData;

QUnit.testStart(function() {
    if(!jQuery) {
        return;
    }

    originalCleanData = jQuery.cleanData;

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
