import $ from 'jquery';
import fx from 'common/core/animation/fx';

import '__internal/ui/color_box/m_color_view';

QUnit.testStart(function() {
    const markup =
        '<div class="dx-viewport"></div>\
            <div id="color-view"></div>';

    $('#qunit-fixture').html(markup);
});

const showColorView = function(options) {
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
}, () => {
    QUnit.test('Apply css class', function(assert) {
        const $colorPicker = showColorView.call(this);
        assert.ok($colorPicker.hasClass('dx-colorview'));
    });

    QUnit.test('Default value should be \'null\'', function(assert) {
        const colorView = showColorView.call(this).dxColorView('instance');
        assert.strictEqual(colorView.option('value'), null);
    });

    QUnit.test('Render color picker container', function(assert) {
        showColorView.call(this);

        const $colorPickerContainer = this.element.find('.dx-colorview-container'); const $alphaChannelScale = this.element.find('.dx-colorview-alpha-channel-scale'); const $alphaChannelInput = this.element.find('.dx-colorview-alpha-channel-input'); const $alphaChannelLabel = this.element.find('.dx-colorview-alpha-label');

        assert.equal($colorPickerContainer.length, 1);
        assert.equal($alphaChannelScale.length, 0);
        assert.equal($alphaChannelInput.length, 0);
        assert.equal($alphaChannelLabel.length, 0);
    });
});

