import '../../helpers/qunitPerformanceExtension.js';

import 'generic_light.css!';

import $ from 'jquery';
import resizeCallbacks from 'core/utils/resize_callbacks';
import themes from 'ui/themes';

themes.setDefaultTimeout(0);

import 'ui/accordion';
import 'ui/tabs';

QUnit.testStart(function() {
    return new Promise(function(resolve) {
        $('#qunit-fixture').html('<div id="element"></div>');
        themes.initialized(resolve);
    });

});

QUnit.performanceTest('dxTabs should force minimum relayout count on creation', function(assert) {
    const measureFunction = function() {
        $('#element').dxTabs({
            items: [1, 2, 3],
            scrollingEnabled: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 3);
});

QUnit.performanceTest('dxTabs without scrolling should not force relayout on dxshown event', function(assert) {
    $('#element').dxTabs({
        items: [1, 2, 3],
        scrollingEnabled: false
    });

    const measureFunction = function() {
        resizeCallbacks.fire();
    };

    assert.measureStyleRecalculation(measureFunction, 2);
});

QUnit.performanceTest('Accordion should force minimum relayout count on creation', function(assert) {
    const measureFunction = function() {
        $('#element').dxAccordion({
            items: [1, 2, 3, 4, 5, 6, 7]
        });
    };

    assert.measureStyleRecalculation(measureFunction, 9);
});

QUnit.performanceTest('Accordion should force minimum relayout count on selection change', function(assert) {
    const $element = $('#element').dxAccordion({
        items: [1, 2, 3, 4, 5, 6, 7]
    });

    const measureFunction = function() {
        $element.dxAccordion('option', 'selectedIndex', 1);
    };

    assert.measureStyleRecalculation(measureFunction, (value) => value < 6);
});
