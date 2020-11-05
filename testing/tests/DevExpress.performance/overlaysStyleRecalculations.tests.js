require('../../helpers/qunitPerformanceExtension.js');
require('ui/overlay');
require('ui/popup');

require('common.css!');
require('generic_light.css!');

const $ = require('jquery');
const positionUtils = require('animation/position');

// TODO - remove it after update Docker image
const browser = require('core/utils/browser');
const isChrome85OrNewer = browser.chrome && parseInt(browser.version) >= 85;

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

[true, false].forEach(shading => {
    QUnit.performanceTest(`dxOverlay with shading=${shading} should be rendered with minimum count of relayouts`, function(assert) {
        const measureFunction = function() {
            $('#element').dxOverlay({
                shading,
                visible: true,
                animation: null
            });
        };

        assert.measureStyleRecalculation(measureFunction, 10);
    });

    QUnit.performanceTest(`showing dxOverlay with shading=${shading} should be with minimum count of relayouts`, function(assert) {
        const overlay = $('#element').dxOverlay({
            shading,
            visible: false,
            animation: null
        }).dxOverlay('instance');

        const measureFunction = function() {
            overlay.show();
        };

        assert.measureStyleRecalculation(measureFunction, 8);
    });


    QUnit.performanceTest(`dxPopup with shading=${shading} should be rendered with minimum count of relayouts`, function(assert) {
        const measureFunction = function() {
            $('#element').dxPopup({
                shading,
                visible: true,
                animation: null
            });
        };

        if(isChrome85OrNewer) {
            assert.measureStyleRecalculation(measureFunction, shading ? 16 : 15);
        } else {
            assert.measureStyleRecalculation(measureFunction, 16);
        }
    });
});
