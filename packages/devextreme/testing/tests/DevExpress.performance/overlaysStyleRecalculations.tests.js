require('../../helpers/qunitPerformanceExtension.js');
require('ui/overlay/ui.overlay');
require('ui/popup');

require('generic_light.css!');

const $ = require('jquery');
const positionUtils = require('common/core/animation/position');

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
                animation: null,
                useResizeObserver: false
            });
        };

        assert.measureStyleRecalculation(measureFunction, 11);
    });

    QUnit.performanceTest(`showing dxOverlay with shading=${shading} should be with minimum count of relayouts`, function(assert) {
        const overlay = $('#element').dxOverlay({
            shading,
            visible: false,
            animation: null,
            useResizeObserver: false
        }).dxOverlay('instance');

        const measureFunction = function() {
            overlay.show();
        };

        assert.measureStyleRecalculation(measureFunction, 9);
    });


    QUnit.performanceTest(`dxPopup with shading=${shading} should be rendered with minimum count of relayouts`, function(assert) {
        const measureFunction = function() {
            $('#element').dxPopup({
                shading,
                visible: true,
                animation: null,
                useResizeObserver: false
            });
        };

        assert.measureStyleRecalculation(measureFunction, shading ? 18 : 17);
    });

    [true, false].forEach(enableBodyScroll => {
        QUnit.performanceTest(`Popup with shading=${shading} & enableBodyScroll=${enableBodyScroll} should be shown with minimum count of relayouts`, function(assert) {
            const $additionalElement = $('<div>').height(2000).appendTo($('body'));

            try {
                const popup = $('#element').dxPopup({
                    shading,
                    enableBodyScroll,
                    visible: false,
                    animation: null,
                    useResizeObserver: false
                }).dxPopup('instance');

                const measureFunction = function() {
                    popup.show();
                };

                const expectedRecalculationsCount = shading ? 16 : 15;

                assert.measureStyleRecalculation(measureFunction, expectedRecalculationsCount);
            } finally {
                $additionalElement.remove();
            }
        });

        QUnit.performanceTest(`Popup with shading=${shading} & enableBodyScroll=${enableBodyScroll} should be hidden with minimum count of relayouts`, function(assert) {

            const $additionalElement = $('<div>').height(2000).appendTo($('body'));

            try {
                const popup = $('#element').dxPopup({
                    shading,
                    enableBodyScroll,
                    visible: true,
                    animation: null,
                    useResizeObserver: false
                }).dxPopup('instance');

                const measureFunction = function() {
                    popup.hide();
                };

                assert.measureStyleRecalculation(measureFunction, shading || !enableBodyScroll ? 3 : 2);
            } finally {
                $additionalElement.remove();
            }
        });
    });
});
