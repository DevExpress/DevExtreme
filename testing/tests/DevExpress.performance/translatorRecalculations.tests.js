require('common.css!');
require('../../helpers/qunitPerformanceExtension.js');
var $ = require('jquery'),
    translator = require('animation/translator');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="element1"></div><div id="element2"></div>');
});

QUnit.performanceTest('translator.move should force minimum relayout count with full coords', function(assert) {
    var measureFunction = function() {
        translator.move($('#element1'), { top: 20, left: 20 });
        translator.move($('#element2'), { top: 30, left: 20 });
    };

    assert.measureStyleRecalculation(measureFunction, 1, true);
});

QUnit.performanceTest('translator.move should force minimum relayout count with short coords', function(assert) {
    var measureFunction = function() {
        translator.move($('#element1'), { top: 20 });
        translator.move($('#element2'), { left: 20 });
    };

    assert.measureStyleRecalculation(measureFunction, 2);
});
