var $ = require('jquery'),
    fx = require('animation/fx');

require('common.css!');
require('ui/color_box/color_view');

QUnit.testStart(function() {
    var markup =
        '<div class="dx-viewport"></div>\
            <div id="color-view"></div>';

    $('#qunit-fixture').html(markup);
});

var showColorView = function(options) {
    return this.element.dxColorView(options);
};

QUnit.module('ColorView', {
    beforeEach: function() {
        fx.off = true;
        this.element = $('#color-view');
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Apply css class', function(assert) {
    var $colorPicker = showColorView.call(this);
    assert.ok($colorPicker.hasClass('dx-colorview'));
});

QUnit.test('Default value should be \'null\'', function(assert) {
    var colorView = showColorView.call(this).dxColorView('instance');
    assert.strictEqual(colorView.option('value'), null);
});

QUnit.test('Render color picker container', function(assert) {
    showColorView.call(this);

    var $colorPickerContainer = this.element.find('.dx-colorview-container'),
        $alphaChannelScale = this.element.find('.dx-colorview-alpha-channel-scale'),
        $alphaChannelInput = this.element.find('.dx-colorview-alpha-channel-input'),
        $alphaChannelLabel = this.element.find('.dx-colorview-alpha-label');

    assert.equal($colorPickerContainer.length, 1);
    assert.equal($alphaChannelScale.length, 0);
    assert.equal($alphaChannelInput.length, 0);
    assert.equal($alphaChannelLabel.length, 0);
});
