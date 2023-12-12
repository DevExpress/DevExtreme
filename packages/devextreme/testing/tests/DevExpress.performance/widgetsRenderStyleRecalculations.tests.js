require('../../helpers/qunitPerformanceExtension.js');
require('../../helpers/widgetsIterator.js');

require('generic_light.css!');

const $ = require('jquery');
const componentName = 'dxSwitch';

const Switch = require('ui/switch');

QUnit.testStart(function() {
    $('#qunit-fixture').addClass('qunit-fixture-visible');
});

QUnit.performanceTest('dxSwitch should not force relayout on creation', function(assert) {
    const measureFunction = function() {
        $('<div>').appendTo('#qunit-fixture').dxSwitch({});
    };

    assert.measureStyleRecalculation(measureFunction, 1);
});

// TODO: all editors components
// TODO: all label modes + all styling modes
// TODO: buttons containers + before / after
QUnit.performanceTest('dxTextBox should not force relayout on creation', function(assert) {
    const measureFunction = function() {
        $('<div>').appendTo('#qunit-fixture').dxTextBox({});
    };

    assert.measureStyleRecalculation(measureFunction, 1);
});

