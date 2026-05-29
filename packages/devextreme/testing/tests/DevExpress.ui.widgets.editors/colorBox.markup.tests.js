import $ from 'jquery';
import fx from 'common/core/animation/fx';

import 'ui/color_box';

import {
    DX_ICON_CLASS,
    DX_ICON_COLOR_DISMISS
} from '__internal/ui/color_box/color_box';

QUnit.testStart(function() {
    const markup =
        '<div id="color-box"></div>';

    $('#qunit-fixture').addClass('dx-viewport').html(markup);
});

const COLOR_BOX_CLASS = 'dx-colorbox';
const COLOR_BOX_INPUT_CLASS = COLOR_BOX_CLASS + '-input';
const COLOR_BOX_INPUT_CONTAINER_CLASS = COLOR_BOX_INPUT_CLASS + '-container';
const COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS = COLOR_BOX_CLASS + '-color-result-preview';
const COLOR_BOX_COLOR_IS_NOT_DEFINED = COLOR_BOX_CLASS + '-color-is-not-defined';

const showColorBox = function(options) {
    return this.element.dxColorBox(options);
};

QUnit.module('ColorBox', {
    beforeEach: function() {
        fx.off = true;
        this.element = $('#color-box');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('Apply css class', function(assert) {
        const $colorBox = showColorBox.call(this);
        assert.ok($colorBox.hasClass(COLOR_BOX_CLASS));
    });

    QUnit.test('Render color input', function(assert) {
        const $colorBox = showColorBox.call(this);
        const $input = $colorBox.find(`.${COLOR_BOX_INPUT_CLASS}`);

        assert.equal($input.length, 1);
        assert.ok($input.closest('.' + COLOR_BOX_INPUT_CONTAINER_CLASS).length);
    });

    QUnit.test('Default value should be \'null\'', function(assert) {
        const colorBox = showColorBox.call(this).dxColorBox('instance');
        assert.strictEqual(colorBox.option('value'), null);
    });

    QUnit.test('Render with hex value', function(assert) {
        const $colorBox = showColorBox.call(this, { value: '#000000' }); const $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

        assert.equal($input.val(), '#000000');
    });

    QUnit.test('Render in rgba mode', function(assert) {
        const $colorBox = showColorBox.call(this, { value: '#ff0000', editAlphaChannel: true }); const $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

        assert.equal($input.val(), 'rgba(255, 0, 0, 1)');
    });

    QUnit.test('Render color result preview', function(assert) {
        const $colorBox = this.element.dxColorBox(); const $colorPreview = $colorBox.find('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

        assert.equal($colorPreview.length, 1);
    });

    QUnit.test('If default value is \'null\' color result preview should have a special css class', function(assert) {
        const $colorBox = this.element.dxColorBox(); const $colorInputContainer = $colorBox.find('.' + COLOR_BOX_INPUT_CONTAINER_CLASS);

        assert.ok($colorInputContainer.hasClass(COLOR_BOX_COLOR_IS_NOT_DEFINED));
    });

    QUnit.test('colorbox should work with deferRendering: false', function(assert) {
        assert.expect(0);

        $('#color-box').dxColorBox({
            deferRendering: false
        });
    });

    QUnit.test('Should render no color icon when value is null', function(assert) {
        const $colorBox = showColorBox.call(this);
        const $icon = $colorBox.find(`.${COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS} .${DX_ICON_CLASS}.${DX_ICON_COLOR_DISMISS}`);

        assert.strictEqual($icon.length, 1, 'icon is rendered for empty value');
    });

    QUnit.test('Should not render no color icon when value is present', function(assert) {
        const $colorBox = showColorBox.call(this, { value: '#fffff' });
        const $icon = $colorBox.find(`.${COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS} .${DX_ICON_CLASS}.${DX_ICON_COLOR_DISMISS}`);

        assert.strictEqual($icon.length, 0, 'icon is not rendered for non-empty value');
    });
});

