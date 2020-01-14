require('../../helpers/qunitPerformanceExtension.js');
require('ui/overlay');
require('ui/popup');

require('common.css!');
require('generic_light.css!');

const $ = require('jquery');
const positionUtils = require('animation/position');

positionUtils.calculateScrollbarWidth();

QUnit.testStart(function() {
    const markup = '\
    <div id="element">\
        <div>item1</div>\
        <div>item2</div>\
        <div>item3</div>\
        <div>item4</div>\
        <div>item5</div>\
        <div>item6</div>\
        <div>item7</div>\
        <div>item8</div>\
        <div>item9</div>\
        <div>item10</div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.performanceTest('dxOverlay should not force relayout on creation', function(assert) {
    const measureFunction = function() {
        $('#element').dxOverlay({});
    };

    assert.measureStyleRecalculation(measureFunction, 1);
});

QUnit.performanceTest('dxOverlay should be rendered with minimum count of relayouts', function(assert) {
    const measureFunction = function() {
        $('#element').dxOverlay({
            visible: true,
            shading: false,
            animation: null
        });
    };

    assert.measureStyleRecalculation(measureFunction, 7);
});

QUnit.performanceTest('showing dxOverlay should be with minimum count of relayouts', function(assert) {
    const overlay = $('#element').dxOverlay({
        visible: false,
        shading: false,
        animation: null
    }).dxOverlay('instance');

    const measureFunction = function() {
        overlay.show();
    };

    assert.measureStyleRecalculation(measureFunction, 5);
});

QUnit.performanceTest('showing dxOverlay with shading should be with minimum count of relayouts', function(assert) {
    const overlay = $('#element').dxOverlay({
        visible: false,
        shading: true,
        animation: null
    }).dxOverlay('instance');

    const measureFunction = function() {
        overlay.show();
    };

    assert.measureStyleRecalculation(measureFunction, 8);
});

QUnit.performanceTest('dxPopup should be rendered with minimum count of relayouts', function(assert) {
    const measureFunction = function() {
        $('#element').dxPopup({
            visible: true,
            shading: false,
            animation: null
        });
    };

    assert.measureStyleRecalculation(measureFunction, 13);
});
