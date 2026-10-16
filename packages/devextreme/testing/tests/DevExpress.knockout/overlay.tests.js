import $ from 'jquery';
import fx from 'common/core/animation/fx';
import ko from 'knockout';

import 'ui/overlay/ui.overlay';
import 'ui/slider';
import 'integration/knockout';

import 'fluent_blue_light.css!';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="Q509956">\
            <div data-bind="dxOverlay: { visible: visible, container: \'#Q509956\' }">\
                <div data-bind="dxSlider: { value: value, min: 0, max: 10, step: 1, width: \'114px\' }"></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};

moduleWithoutCsp('integration tests', moduleConfig);

QUnit.test('slider within overlay does not properly display its current position properly (Q509956)', function(assert) {
    const $container = $('#Q509956');
    const vm = {
        visible: ko.observable(false),
        value: ko.observable(5)
    };

    ko.applyBindings(vm, $container.get(0));
    vm.visible(true);

    const $handle = $container.find('.dx-slider .dx-slider-handle');
    const $sliderBar = $container.find('.dx-slider-bar');
    const handleCenter = $handle.position().left + $handle.outerWidth() / 2 + parseInt($handle.css('border-left-width'));
    assert.equal($sliderBar.outerWidth(), 94);
    assert.equal(handleCenter, 48);
});
