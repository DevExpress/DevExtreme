const $ = require('jquery');
const fx = require('animation/fx');
const ko = require('knockout');

require('ui/overlay');
require('ui/slider');
require('integration/knockout');

require('common.css!');

QUnit.testStart(function() {
    const markup =
        '<div id="Q509956">\
            <div data-bind="dxOverlay: { visible: visible, container: \'#Q509956\' }">\
                <div data-bind="dxSlider: { value: value, min: 0, max: 10, step: 1, width: \'10px\' }"></div>\
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

QUnit.module('integration tests', moduleConfig);

QUnit.test('slider within overlay does not properly display its current position properly (Q509956)', function(assert) {
    const $container = $('#Q509956');
    const vm = {
        visible: ko.observable(false),
        value: ko.observable(5)
    };

    ko.applyBindings(vm, $container.get(0));
    vm.visible(true);

    const $handle = $container.find('.dx-slider .dx-slider-handle');
    assert.equal($handle.position().left, 5);
});
