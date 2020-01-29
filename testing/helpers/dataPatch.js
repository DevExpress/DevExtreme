/* global jQuery */

import dataStrategy from 'core/element_data';

let originalCleanData;

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
