/* global jQuery */

import { cleanData } from 'core/element_data';

let originalCleanData;

QUnit.testStart(function() {
    if(!jQuery) {
        return;
    }

    originalCleanData = jQuery.cleanData;

    jQuery.cleanData = function() {
        cleanData.apply(this, arguments);
        originalCleanData.apply(this, arguments);
    };
});

QUnit.testDone(function() {
    if(!jQuery) {
        return;
    }

    jQuery.cleanData = originalCleanData;
});
