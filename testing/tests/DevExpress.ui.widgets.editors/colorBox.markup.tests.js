var $ = require('jquery'),
    fx = require('animation/fx');

require('common.css!');
require('ui/color_box');

QUnit.testStart(function() {
    var markup =
        '<div id="color-box"></div>';

    $('#qunit-fixture').addClass('dx-viewport').html(markup);
});

var COLOR_BOX_CLASS = 'dx-colorbox',
    COLOR_BOX_INPUT_CLASS = COLOR_BOX_CLASS + '-input',
    COLOR_BOX_INPUT_CONTAINER_CLASS = COLOR_BOX_INPUT_CLASS + '-container',
    COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS = COLOR_BOX_CLASS + '-color-result-preview',
    COLOR_BOX_COLOR_IS_NOT_DEFINED = COLOR_BOX_CLASS + '-color-is-not-defined';

var showColorBox = function(options) {
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
        var $colorBox = showColorBox.call(this);
        assert.ok($colorBox.hasClass(COLOR_BOX_CLASS));
    });

    QUnit.test('Render color input', function(assert) {
        var $colorBox = showColorBox.call(this),
            $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

        assert.equal($input.length, 1);
        assert.ok($input.closest('.' + COLOR_BOX_INPUT_CONTAINER_CLASS).length);
    });

    QUnit.test('Default value should be \'null\'', function(assert) {
        var colorBox = showColorBox.call(this).dxColorBox('instance');
        assert.strictEqual(colorBox.option('value'), null);
    });

    QUnit.test('Render with hex value', function(assert) {
        var $colorBox = showColorBox.call(this, { value: '#000000' }),
            $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

        assert.equal($input.val(), '#000000');
    });

    QUnit.test('Render in rgba mode', function(assert) {
        var $colorBox = showColorBox.call(this, { value: '#ff0000', editAlphaChannel: true }),
            $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

        assert.equal($input.val(), 'rgba(255, 0, 0, 1)');
    });

    QUnit.test('Render color result preview', function(assert) {
        var $colorBox = this.element.dxColorBox(),
            $colorPreview = $colorBox.find('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

        assert.equal($colorPreview.length, 1);
    });

    QUnit.test('If default value is \'null\' color result preview should have a special css class', function(assert) {
        var $colorBox = this.element.dxColorBox(),
            $colorInputContainer = $colorBox.find('.' + COLOR_BOX_INPUT_CONTAINER_CLASS);

        assert.ok($colorInputContainer.hasClass(COLOR_BOX_COLOR_IS_NOT_DEFINED));
    });

    QUnit.test('colorbox should work with deferRendering: false', function(assert) {
        assert.expect(0);

        $('#color-box').dxColorBox({
            deferRendering: false
        });
    });
});

