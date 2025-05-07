import $ from 'jquery';
import { noop } from 'core/utils/common';
import Color from 'color';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import fx from 'common/core/animation/fx';
import { normalizeKeyName } from 'common/core/events/utils/index';

import 'generic_light.css!';
import '__internal/ui/color_box/m_color_view';

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';
const COLORVIEW_PALETTE_SELECTOR = '.dx-colorview-palette';
const COLORVIEW_HUE_SCALE_SELECTOR = '.dx-colorview-hue-scale';
const COLORVIEW_ALPHA_CHANNEL_SCALE_SELECTOR = '.dx-colorview-alpha-channel-scale';
const COLORVIEW_PALETTE_HANDLE_SELECTOR = '.dx-colorview-palette-handle';
const COLORVIEW_LABEL_HEX_SELECTOR = '.dx-colorview-label-hex';
const TEXTBOX_SELECTOR = '.dx-textbox';

QUnit.testStart(function() {
    const markup =
        '<div class="dx-viewport"></div>\
            <div id="color-view"></div>';

    $('#qunit-fixture').html(markup);
});

const move = function($element, position) {
    const parentOffset = $element.parent().offset();
    pointerMock($element)
        .start()
        .down(parentOffset.left, parentOffset.top)
        .move(position.left, position.top)
        .up();
};

const click = function($element, position) {
    pointerMock($element)
        .start()
        .down($element.offset().left + position.left, $element.offset().top + position.top);
};

const showColorView = function(options) {
    return this.element.dxColorView(options);
};

QUnit.module('ColorView', {
    beforeEach: function() {
        fx.off = true;
        this.element = $('#color-view');

        this.checkInput = function($input, expected, assert) {
            const inputInstance = $input[expected.inputType || 'dxNumberBox']('instance');

            assert.equal($input.length, 1, 'Editor is rendered');
            assert.ok(inputInstance, 'Editor is instance of dxNumberBox');
            assert.equal($input.parent().text(), expected.labelText, 'Label is correct');
            assert.ok($input.parent().hasClass(expected.labelClass), 'Editor parent has a right class');
            assert.equal(inputInstance.option('value'), expected.value, 'Editor value is correct');
        };

        this.updateColorInput = function(inputAlias, value) {
            const aliases = [
                'red',
                'green',
                'blue',
                'hex',
                'alpha'
            ];
            const inputIndex = $.inArray(inputAlias, aliases);

            const $input = this.element.find('label ' + TEXTEDITOR_INPUT_SELECTOR).eq(inputIndex);

            $input.val(value);
            $input.trigger('change');
        };

        this.checkColor = function(expectedColor, assert) {
            const colorPicker = this.element.dxColorView('instance');
            const currentColor = colorPicker._currentColor;

            assert.equal(currentColor.r, expectedColor.r, 'Red color is OK');
            assert.equal(colorPicker._rgbInputs[0]._input().val(), expectedColor.r, 'Red input is OK');

            assert.equal(currentColor.g, expectedColor.g, 'Green color is OK');
            assert.equal(colorPicker._rgbInputs[1]._input().val(), expectedColor.g, 'Green input is OK');

            assert.equal(currentColor.b, expectedColor.b, 'Blue color is OK');
            assert.equal(colorPicker._rgbInputs[2]._input().val(), expectedColor.b, 'Blue input is OK');

            assert.equal(currentColor.toHex(), expectedColor.hex, 'HEX is OK');

            if(expectedColor.alpha) {
                assert.equal(currentColor.a, expectedColor.alpha, 'Alpha is OK');
            }
        };
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('Render html rows', function(assert) {
        showColorView.call(this);
        const $colorPickerContainer = this.element.find('.dx-colorview-container'); const $rows = $colorPickerContainer.find('.dx-colorview-container-row');

        assert.equal($rows.length, 1);
    });

    QUnit.test('Render html rows with alpha channel', function(assert) {
        showColorView.call(this, { editAlphaChannel: true });

        const $colorPickerContainer = this.element.find('.dx-colorview-container'); const $rows = $colorPickerContainer.find('.dx-colorview-container-row');

        assert.equal($rows.length, 2);
        assert.ok($rows.eq(1).hasClass('dx-colorview-alpha-channel-row'));
    });

    QUnit.test('Render palette', function(assert) {
        showColorView.call(this, { value: '#9c2a2a' });

        const $palette = this.element.find('.dx-colorview-palette'); const $gradientWhite = $palette.find('.dx-colorview-palette-gradient-white'); const $gradientBlack = $palette.find('.dx-colorview-palette-gradient-black'); const $colorChooser = $palette.find('.dx-colorview-palette-handle'); const paletteBackground = $palette.css('backgroundColor');

        assert.equal($palette.length, 1);
        assert.equal(new Color(paletteBackground).toHex(), '#ff0000');
        assert.equal($gradientWhite.length, 1);
        assert.equal($gradientBlack.length, 1);
        assert.equal($colorChooser.length, 1);
        assert.ok($palette.parent().hasClass('dx-colorview-container-cell'));
        assert.ok($palette.parent().hasClass('dx-colorview-palette-cell'));
    });

    QUnit.test('Color chooser position', function(assert) {
        showColorView.call(this, { value: '#2C77B8' });
        const $colorChooserMarker = $('.dx-colorview-palette-handle'); const markerPosition = $colorChooserMarker.position();

        assert.equal(markerPosition.left, 205);
        assert.equal(markerPosition.top, 70);
    });

    QUnit.test('Render hue scale and hue scale handle', function(assert) {
        showColorView.call(this);

        const $hueScale = this.element.find('.dx-colorview-hue-scale'); const $hueScaleWrapper = $hueScale.closest('.dx-colorview-hue-scale-wrapper'); const $hueScaleHandle = $hueScaleWrapper.find('.dx-colorview-hue-scale-handle');

        assert.equal($hueScale.length, 1);
        assert.equal($hueScaleHandle.length, 1);
        assert.ok($hueScaleWrapper.parent().hasClass('dx-colorview-container-cell'));
        assert.ok($hueScaleWrapper.parent().hasClass('dx-colorview-hue-scale-cell'));
    });

    QUnit.test('Hue marker position', function(assert) {
        showColorView.call(this, { value: '#2C77B8' });
        assert.equal($('.dx-colorview-hue-scale-handle').position().top, 121);
    });

    QUnit.test('Hue marker position with #ff0000', function(assert) {
        showColorView.call(this, { value: '#ff0000' });
        assert.equal($('.dx-colorview-hue-scale-handle').position().top, 286);
    });

    QUnit.test('Hue marker position with rgb(255, 0, 1)', function(assert) {
        showColorView.call(this, { value: 'rgb(255, 0, 1)' });
        assert.equal($('.dx-colorview-hue-scale-handle').position().top, 0);
    });

    QUnit.test('Render controls container', function(assert) {
        showColorView.call(this);
        const $controlsContainer = this.element.find('.dx-colorview-controls-container');

        assert.equal($controlsContainer.length, 1);
        assert.equal($controlsContainer.parent().attr('class'), 'dx-colorview-container-cell');
    });

    QUnit.test('Render RGB inputs', function(assert) {
        showColorView.call(this, { value: '#00FFA9' });
        const $red = this.element.find('.dx-colorview-controls-container label.dx-colorview-label-red .dx-texteditor'); const $green = this.element.find('.dx-colorview-controls-container label.dx-colorview-label-green .dx-texteditor'); const $blue = this.element.find('.dx-colorview-controls-container label.dx-colorview-label-blue .dx-texteditor');

        this.checkInput($red, {
            value: 0,
            labelText: 'R:',
            labelClass: 'dx-colorview-label-red'
        }, assert);

        this.checkInput($green, {
            value: 255,
            labelText: 'G:',
            labelClass: 'dx-colorview-label-green'
        }, assert);

        this.checkInput($blue, {
            value: 169,
            labelText: 'B:',
            labelClass: 'dx-colorview-label-blue'
        }, assert);
    });

    QUnit.test('Render hex input', function(assert) {
        showColorView.call(this, { value: '#ff0000' });
        const $hex = this.element.find('.dx-colorview-controls-container label.dx-colorview-label-hex .dx-texteditor');

        this.checkInput($hex, {
            value: 'ff0000',
            inputType: 'dxTextBox',
            labelText: '#:',
            labelClass: 'dx-colorview-label-hex'
        }, assert);
    });

    QUnit.test('Render alpha channel scale and input', function(assert) {
        showColorView.call(this, { editAlphaChannel: true, value: 'rgba(255, 0, 0, 0.5)' });

        const $alphaChannelScaleWrapper = this.element.find('.dx-colorview-alpha-channel-wrapper'); const $alphaChannelScale = $alphaChannelScaleWrapper.find('.dx-colorview-alpha-channel-scale'); const $alphaChannelLabel = this.element.find('.dx-colorview-alpha-channel-label'); const $alphaChannelHandle = this.element.find('.dx-colorview-alpha-channel-cell').find('.dx-colorview-alpha-channel-handle'); const $alphaChannelScaleBorder = this.element.find('.dx-colorview-alpha-channel-border');

        assert.equal($alphaChannelScaleWrapper.length, 1);
        assert.equal($alphaChannelScale.length, 1);
        assert.equal($alphaChannelHandle.length, 1);
        assert.ok($alphaChannelScaleBorder.parent().hasClass('dx-colorview-container-cell'));
        assert.ok($alphaChannelScaleBorder.parent().hasClass('dx-colorview-alpha-channel-cell'));
        assert.equal($alphaChannelLabel.length, 1);
        assert.equal($alphaChannelLabel.parent().attr('class'), 'dx-colorview-container-cell');

        this.checkColor({
            r: 255,
            g: 0,
            b: 0,
            hex: '#ff0000',
            alpha: 0.5
        }, assert);
    });

    QUnit.test('Position of alpha channel handle with rgba(255, 0, 0, 1)', function(assert) {
        showColorView.call(this, { editAlphaChannel: true, value: 'rgba(255, 0, 0, 1)' });
        assert.equal($('.dx-colorview-alpha-channel-handle').position().left, 0);
    });

    QUnit.test('Position of alpha channel handle with rgba(255, 0, 0, 0)', function(assert) {
        showColorView.call(this, { editAlphaChannel: true, value: 'rgba(255, 0, 0, 0)' });
        assert.equal(Math.round($('.dx-colorview-alpha-channel-handle').position().left), 277);
    });

    QUnit.test('Render colors preview', function(assert) {
        showColorView.call(this);
        const $colorPreviewContainer = this.element.find('.dx-colorview-color-preview-container'); const $colorPreviewContainerInner = this.element.find('.dx-colorview-color-preview-container-inner'); const $baseColor = $colorPreviewContainerInner.find('.dx-colorview-color-preview-color-current'); const $newColor = $colorPreviewContainerInner.find('.dx-colorview-color-preview-color-new');

        assert.equal($colorPreviewContainer.length, 1);
        assert.equal($colorPreviewContainerInner.length, 1);
        assert.equal($baseColor.length, 1);
        assert.equal($newColor.length, 1);
        assert.equal(new Color($baseColor.css('backgroundColor')).toHex(), '#000000');
        assert.equal(new Color($newColor.css('backgroundColor')).toHex(), '#000000');
    });

    QUnit.test('Render colors preview with predefined values', function(assert) {
        showColorView.call(this, { value: '#fafafa', matchValue: '#dadada' });
        const $colorPreviewContainerInner = this.element.find('.dx-colorview-color-preview-container-inner'); const $baseColor = $colorPreviewContainerInner.find('.dx-colorview-color-preview-color-current'); const $newColor = $colorPreviewContainerInner.find('.dx-colorview-color-preview-color-new');

        assert.equal(new Color($baseColor.css('backgroundColor')).toHex(), '#dadada');
        assert.equal(new Color($newColor.css('backgroundColor')).toHex(), '#fafafa');
    });

    QUnit.test('In \'instantly\' mode \'OK\' and \'Cancel\' buttons should not be rendered', function(assert) {
        showColorView.call(this, {
            applyValueMode: 'instantly'
        });

        const $applyButton = this.element.find('.dx-colorview-buttons-container .dx-colorview-apply-button'); const $cancelButton = this.element.find('.dx-colorview-buttons-container .dx-colorview-cancel-button'); const $htmlRows = this.element.find('.dx-colorview-container-row');

        assert.equal($applyButton.length, 0);
        assert.equal($cancelButton.length, 0);
        assert.equal($htmlRows.length, 1);
    });

    QUnit.test('T110896', function(assert) {
        showColorView.call(this, { editAlphaChannel: true, rtlEnabled: true, value: 'rgba(255, 0, 0, 1)' });
        assert.equal(Math.round(this.element.find('.dx-colorview-alpha-channel-handle').position().left), 277);
    });

    QUnit.test('Color chooser position can be negative', function(assert) {
        showColorView.call(this);

        const $colorChooserMarker = $('.dx-colorview-palette-handle');

        move($colorChooserMarker, {
            left: 220,
            top: -16
        });
        assert.equal(parseInt($colorChooserMarker.position().top, 10), -14);
    });

    QUnit.test('Update color values', function(assert) {
        showColorView.call(this, { value: '#2C77B8' });
        const $colorChooserMarker = this.element.find('.dx-colorview-palette-handle');

        move($colorChooserMarker, {
            left: 220,
            top: 80
        });

        this.checkColor({
            r: 45,
            g: 120,
            b: 186,
            hex: '#2d78ba'
        }, assert);

    });

    QUnit.test('Update alpha', function(assert) {
        showColorView.call(this, {
            editAlphaChannel: true
        });

        const $alphaHandle = this.element.find('.dx-colorview-alpha-channel-handle');

        move($alphaHandle, {
            left: 143,
            top: 0
        });

        this.checkColor({
            r: 0,
            g: 0,
            b: 0,
            hex: '#000000',
            alpha: 0.51
        }, assert);
    });

    QUnit.test('Change Saturation and Value by click', function(assert) {
        showColorView.call(this, {
            value: 'green'
        });

        const $palette = this.element.find('.dx-colorview-palette');

        click($palette, {
            left: 170,
            top: 170
        });

        this.checkColor({
            r: 45,
            g: 110,
            b: 45,
            hex: '#2d6e2d'
        }, assert);
    });

    QUnit.test('Change Hue by click', function(assert) {
        showColorView.call(this, {
            value: 'green'
        });

        const $hueScale = this.element.find('.dx-colorview-hue-scale');

        click($hueScale, {
            left: 0,
            top: 90
        });

        this.checkColor({
            r: 32,
            g: 0,
            b: 127,
            hex: '#20007f'
        }, assert);
    });

    QUnit.test('Change Alpha by click', function(assert) {
        showColorView.call(this, {
            editAlphaChannel: true
        });

        const $alphaScale = this.element.find('.dx-colorview-alpha-channel-scale');

        click($alphaScale, {
            left: 88,
            top: 0
        });

        this.checkColor({
            r: 0,
            g: 0,
            b: 0,
            hex: '#000000',
            alpha: 0.7
        }, assert);

    });

    QUnit.test('RGB, Hex, Alpha updating', function(assert) {
        showColorView.call(this, {
            value: '#ff0000',
            editAlphaChannel: true
        });

        this.updateColorInput('red', 100);
        this.checkColor({ r: 100, g: 0, b: 0, hex: '#640000', alpha: 1 }, assert);

        this.updateColorInput('green', 100);
        this.checkColor({ r: 100, g: 100, b: 0, hex: '#646400', alpha: 1 }, assert);

        this.updateColorInput('blue', 100);
        this.checkColor({ r: 100, g: 100, b: 100, hex: '#646464', alpha: 1 }, assert);

        this.updateColorInput('hex', '551414');
        this.checkColor({ r: 85, g: 20, b: 20, hex: '#551414', alpha: 1 }, assert);

        this.updateColorInput('alpha', 0.5);
        this.checkColor({ r: 85, g: 20, b: 20, hex: '#551414', alpha: 0.5 }, assert);
    });

    QUnit.test('Markers position after color updating', function(assert) {
        showColorView.call(this, {
            value: '#646432',
            editAlphaChannel: true
        });

        this.updateColorInput('red', 200);
        this.updateColorInput('alpha', 0.5);

        assert.equal($('.dx-colorview-palette-handle').position().top, 52);
        assert.equal($('.dx-colorview-palette-handle').position().left, 202);
        assert.equal($('.dx-colorview-hue-scale-handle').position().top, 270);
        assert.ok(Math.abs($('.dx-colorview-alpha-channel-handle').position().left - 138) <= 1);

    });

    QUnit.test('Validate a wrong value of alpha channel', function(assert) {
        showColorView.call(this, {
            value: '#646432',
            editAlphaChannel: true
        });

        this.updateColorInput('alpha', 1.5);
        this.checkColor({ r: 100, g: 100, b: 50, hex: '#646432', alpha: 1 }, assert);
    });

    QUnit.test('Validate a negative value', function(assert) {
        showColorView.call(this, {
            value: '#646432',
            editAlphaChannel: true
        });

        this.updateColorInput('red', -100);
        this.checkColor({ r: 0, g: 100, b: 50, hex: '#006432', alpha: 1 }, assert);
    });

    QUnit.test('ColorView should apply a black color when an invalid value is passed (T1127428)', function(assert) {
        showColorView.call(this, {
            value: [ 'red', 'green' ],
        });

        this.checkColor({ r: 0, g: 0, b: 0, hex: '#000000', alpha: 1 }, assert);
    });

    QUnit.test('Validate a too large value', function(assert) {
        showColorView.call(this, {
            value: '#646432',
            editAlphaChannel: true
        });

        this.updateColorInput('green', 300);
        this.checkColor({ r: 100, g: 255, b: 50, hex: '#64ff32', alpha: 1 }, assert);
    });

    QUnit.test('Validate a float value', function(assert) {
        showColorView.call(this, {
            value: '#646432',
            editAlphaChannel: true
        });

        this.updateColorInput('blue', 1.2);
        this.checkColor({ r: 100, g: 100, b: 50, hex: '#646432', alpha: 1 }, assert);
    });

    QUnit.test('Validate a wrong hex value', function(assert) {
        showColorView.call(this, {
            value: '#646432',
            editAlphaChannel: true
        });

        this.updateColorInput('hex', '551Z14');
        this.checkColor({ r: 100, g: 100, b: 50, hex: '#646432', alpha: 1 }, assert);
    });

    QUnit.test('When some color param was changed (invalid) alpha channel is OK', function(assert) {
        showColorView.call(this, {
            value: 'rgba(255, 0, 0, 0.3)',
            editAlphaChannel: true
        });

        this.updateColorInput('blue', 500);
        this.updateColorInput('alpha', 1.5);

        this.checkColor({
            r: 255,
            g: 0,
            b: 255,
            hex: '#ff00ff',
            alpha: 1
        }, assert);
    });

    QUnit.test('Update hue with gray color', function(assert) {
        showColorView.call(this, {
            value: '#666666'
        });

        const $hueScale = this.element.find('.dx-colorview-hue-scale'); const $palette = this.element.find('.dx-colorview-palette');

        click($hueScale, {
            left: 0,
            top: 90
        });

        const $paletteBackColor = new Color($palette.css('backgroundColor')).toHex();
        assert.equal($paletteBackColor, '#4000ff');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        showColorView.call(this, { onValueChanged: function() { assert.ok(true); } }).dxColorView('instance').option('value', true);
    });

    QUnit.test('ColorPicker should can update value instantly', function(assert) {
        const newColor = new Color('#ba2d2d');
        const spy = sinon.spy(noop);
        const colorPicker = showColorView.call(this, {
            onValueChanged: spy,
            applyValueMode: 'instantly'
        }).dxColorView('instance');
        const $colorChooserMarker = $('.dx-colorview-palette-handle');

        move($colorChooserMarker, {
            left: 220,
            top: 80
        });

        assert.equal(colorPicker.option('value'), newColor.toHex());
        assert.ok(spy.called);

        this.checkColor({
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            hex: newColor.toHex()
        }, assert);
    });

    QUnit.test('\'instantly\' mode should work for alpha channel', function(assert) {
        const colorPicker = showColorView.call(this, {
            value: 'rgba(100, 100, 100, .2)',
            editAlphaChannel: true,
            applyValueMode: 'instantly'
        }).dxColorView('instance');

        this.updateColorInput('alpha', 0.75);

        assert.equal(colorPicker.option('value'), 'rgba(100, 100, 100, 0.75)');
    });

    QUnit.test('In \'instantly\' mode value should be updated if some input was updated', function(assert) {
        const colorPicker = showColorView.call(this, {
            value: '#ff0000',
            applyValueMode: 'instantly'
        }).dxColorView('instance');

        this.updateColorInput('red', 100);
        assert.equal(colorPicker.option('value'), '#640000');

        this.updateColorInput('green', 100);
        assert.equal(colorPicker.option('value'), '#646400');

        this.updateColorInput('blue', 100);
        assert.equal(colorPicker.option('value'), '#646464');

        this.updateColorInput('hex', '0000ff');
        assert.equal(colorPicker.option('value'), '#0000ff');
    });

    QUnit.test('Update \'applyValueMode\' option if editAlphaChannel is true', function(assert) {
        const instance = showColorView.call(this, { editAlphaChannel: true }).dxColorView('instance');

        instance.option('applyValueMode', 'instantly');
        instance.option('applyValueMode', 'useButtons');

        const $alphaChannelRow = this.element.find('.dx-colorview-container-row').eq(1);

        assert.ok($alphaChannelRow.hasClass('dx-colorview-alpha-channel-row'));
        assert.equal($alphaChannelRow.find('.dx-colorview-alpha-channel-cell').length, 1);
    });

    QUnit.test('T102286: opacity = 1', function(assert) {
        showColorView.call(this, {
            value: 'rgba(255, 0, 0, .5)',
            editAlphaChannel: true
        });

        const $alphaHandle = this.element.find('.dx-colorview-alpha-channel-handle');

        move($alphaHandle, {
            left: 0,
            top: 0
        });

        this.checkColor({
            r: 255,
            g: 0,
            b: 0,
            hex: '#ff0000',
            alpha: 1
        }, assert);
    });

    QUnit.test('T102286: opacity = 0', function(assert) {
        showColorView.call(this, {
            value: 'rgba(255, 0, 0, .5)',
            editAlphaChannel: true
        });

        const $alphaHandle = this.element.find('.dx-colorview-alpha-channel-handle');

        move($alphaHandle, {
            left: 500,
            top: 0
        });

        assert.equal($('.dx-colorview-alpha-channel-label input').val(), 0);
    });

    QUnit.test('T104929', function(assert) {
        const instance = showColorView.call(this, { editAlphaChannel: false }).dxColorView('instance');

        instance.option('editAlphaChannel', true);

        const $htmlRows = this.element.find('.dx-colorview-container-row');

        assert.equal($htmlRows.eq(1).find('.dx-colorview-alpha-channel-scale').length, 1);
        assert.equal($htmlRows.eq(1).find('.dx-colorview-alpha-channel-label .dx-texteditor').length, 1);
        assert.equal($htmlRows.length, 2);

        instance.option('editAlphaChannel', false);

        assert.equal(this.element.find('.dx-colorview-alpha-channel-scale').length, 0);
        assert.equal(this.element.find('.dx-colorview-alpha-channel-label .dx-texteditor').length, 0);
        assert.equal(this.element.find('.dx-colorview-container-row').length, 1);
    });

    QUnit.test('T110896: move handle', function(assert) {
        showColorView.call(this, {
            editAlphaChannel: true,
            rtlEnabled: true,
            value: 'rgba(255, 0, 0, 1)'
        });

        const $alphaHandle = this.element.find('.dx-colorview-alpha-channel-handle');

        move($alphaHandle, {
            left: 70,
            top: 0
        });

        this.checkColor({
            r: 255,
            g: 0,
            b: 0,
            hex: '#ff0000',
            alpha: 0.25
        }, assert);
    });

    QUnit.test('T112555', function(assert) {
        showColorView.call(this, {
            value: '#001AFF'
        });

        const $hueMarker = this.element.find('.dx-colorview-hue-scale-handle');


        move($hueMarker, {
            left: 0,
            top: 0
        });

        this.checkColor({
            r: 255,
            g: 0,
            b: 0,
            hex: '#ff0000'
        }, assert);
    });

    QUnit.test('Markup should be updated when value was changed', function(assert) {
        const colorView = showColorView.call(this, {
            value: 'rgba(94, 169, 219, 0.62)',
            editAlphaChannel: true
        }).dxColorView('instance');

        colorView.option('value', 'rgba(48, 84, 46, 0.19)');

        const paletteHandlePosition = colorView._$paletteHandle.position();
        const alphaChannelHandlePosition = colorView._$alphaChannelHandle.position();
        const hueScaleHandlePosition = colorView._$hueScaleHandle.position();

        assert.equal(Math.floor(paletteHandlePosition.left), 116);
        assert.equal(Math.floor(paletteHandlePosition.top), 186);

        assert.equal(Math.floor(alphaChannelHandlePosition.left), 224);
        assert.equal(Math.floor(alphaChannelHandlePosition.top), -6);

        assert.equal(Math.floor(hueScaleHandlePosition.left), -7);
        assert.equal(Math.floor(hueScaleHandlePosition.top), 193);
    });

    QUnit.test('Preview for current color should be updated when value was changed', function(assert) {
        const colorView = showColorView.call(this, {
            value: 'red',
            matchValue: 'red'
        }).dxColorView('instance');
        const $baseColor = this.element.find('.dx-colorview-color-preview-color-current');
        const $newColor = this.element.find('.dx-colorview-color-preview-color-new');

        colorView.option('value', 'green');
        assert.equal(new Color($baseColor.css('backgroundColor')).toHex(), '#ff0000', 'base preview keeps initial match value');
        assert.equal(new Color($newColor.css('backgroundColor')).toHex(), '#008000', 'new color preview show selected value');
    });

    QUnit.test('Click on label should not focus the input (T179488)', function(assert) {
        let isDefaultPrevented;
        this.$element = $('#color-view').dxColorView({ focusStateEnabled: true });
        const $label = this.$element.find('.dx-colorview-label-red');

        $label.on('dxclick', function(e) {
            isDefaultPrevented = e.isDefaultPrevented();
        });

        $label.trigger('dxclick');

        assert.ok(isDefaultPrevented, 'PreventDefault on label click is enabled');
    });

    QUnit.test('Color view renders the editors with default stylingMode', function(assert) {
        this.$element = $('#color-view').dxColorView({});
        const $editors = this.$element.find('.dx-editor-outlined');

        assert.equal($editors.length, 4, 'the number of outlined editors is correct');
    });

    QUnit.test('Color view renders the editors according to stylingMode option', function(assert) {
        this.$element = $('#color-view').dxColorView({ stylingMode: 'underlined' });
        const $editors = this.$element.find('.dx-editor-underlined');
        const $outlinedEditors = this.$element.find('.dx-editor-outlined');

        assert.equal($editors.length, 4, 'the number of underlined editors is correct');
        assert.equal($outlinedEditors.length, 0, 'there are no outlined editors');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#color-view').dxColorView({
            value: 'rgba(50, 100, 100, 0.37)',
            editAlphaChannel: true,
            applyValueMode: 'instantly',
            focusStateEnabled: true,
            keyStep: 10
        });
        this.instance = this.$element.dxColorView('instance');
        this.$element.trigger('focus');
        this.keyboard = keyboardMock(this.$element);
        this.$hueMarker = this.$element.find('.dx-colorview-hue-scale-handle');
        this.$alphaMarker = this.$element.find('.dx-colorview-alpha-channel-handle');
        this.$paletteMarker = this.$element.find('.dx-colorview-palette-handle');

        this.ctrlLeft = $.Event('keydown', { key: 'ArrowLeft', ctrlKey: true });
        this.ctrlUp = $.Event('keydown', { key: 'ArrowUp', ctrlKey: true });
        this.ctrlRight = $.Event('keydown', { key: 'ArrowRight', ctrlKey: true });
        this.ctrlDown = $.Event('keydown', { key: 'ArrowDown', ctrlKey: true });

        this.commandLeft = $.Event('keydown', { key: 'ArrowLeft', metaKey: true });
        this.commandUp = $.Event('keydown', { key: 'ArrowUp', metaKey: true });
        this.commandRight = $.Event('keydown', { key: 'ArrowRight', metaKey: true });
        this.commandDown = $.Event('keydown', { key: 'ArrowDown', metaKey: true });

        this.shiftLeft = $.Event('keydown', { key: 'ArrowLeft', shiftKey: true });
        this.shiftUp = $.Event('keydown', { key: 'ArrowUp', shiftKey: true });
        this.shiftRight = $.Event('keydown', { key: 'ArrowRight', shiftKey: true });
        this.shiftDown = $.Event('keydown', { key: 'ArrowDown', shiftKey: true });

        this.ctrlShiftLeft = $.Event('keydown', { key: 'ArrowLeft', ctrlKey: true, shiftKey: true });
        this.ctrlShiftUp = $.Event('keydown', { key: 'ArrowUp', ctrlKey: true, shiftKey: true });
        this.ctrlShiftRight = $.Event('keydown', { key: 'ArrowRight', ctrlKey: true, shiftKey: true });
        this.ctrlShiftDown = $.Event('keydown', { key: 'ArrowDown', ctrlKey: true, shiftKey: true });

        this.commandShiftLeft = $.Event('keydown', { key: 'ArrowLeft', ctrlKey: true, shiftKey: true });
        this.commandShiftUp = $.Event('keydown', { key: 'ArrowUp', ctrlKey: true, shiftKey: true });
        this.commandShiftRight = $.Event('keydown', { key: 'ArrowRight', ctrlKey: true, shiftKey: true });
        this.commandShiftDown = $.Event('keydown', { key: 'ArrowDown', ctrlKey: true, shiftKey: true });
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('\'up\' key test', function(assert) {
        this.keyboard.keyDown('up');

        assert.equal(this.instance.option('value'), 'rgba(51, 102, 102, 0.37)', 'value was changed correctly when \'up\' was pressed');
    });

    QUnit.test('\'shiftUp\' key test', function(assert) {
        this.$element.trigger(this.shiftUp);

        assert.equal(this.instance.option('value'), 'rgba(54, 107, 107, 0.37)', 'value was changed correctly when \'shift+up\' was pressed');
    });

    QUnit.test('\'down\' key test', function(assert) {
        this.keyboard.keyDown('down');

        assert.equal(this.instance.option('value'), 'rgba(48, 97, 97, 0.37)', 'value was changed correctly when \'down\' was pressed');
    }),

    QUnit.test('\'shiftDown\' key test', function(assert) {
        this.$element.trigger(this.shiftDown);

        assert.equal(this.instance.option('value'), 'rgba(46, 92, 92, 0.37)', 'value was changed correctly when \'shift+down\' was pressed');
    });

    QUnit.test('\'right\' key test', function(assert) {
        this.keyboard.keyDown('right');

        assert.equal(this.instance.option('value'), 'rgba(49, 99, 99, 0.37)', 'value was changed correctly when \'right\' was pressed');
    }),

    QUnit.test('\'shiftRight\' key test', function(assert) {
        this.$element.trigger(this.shiftRight);

        assert.equal(this.instance.option('value'), 'rgba(47, 99, 99, 0.37)', 'value was changed correctly when \'shift+right\' was pressed');
    });

    QUnit.test('\'left\' key test', function(assert) {
        this.keyboard.keyDown('left');

        assert.equal(this.instance.option('value'), 'rgba(51, 99, 99, 0.37)', 'value was changed correctly when \'left\' was pressed');
    }),

    QUnit.test('\'shiftLeft\' key test', function(assert) {
        this.$element.trigger(this.shiftLeft);

        assert.equal(this.instance.option('value'), 'rgba(53, 99, 99, 0.37)', 'value was changed correctly when \'shift+left\' was pressed');
    });

    QUnit.test('\'ctrlUp\' key test', function(assert) {
        this.$element.trigger(this.ctrlUp);

        assert.equal(this.instance.option('value'), 'rgba(50, 99, 99, 0.37)', 'value was changed correctly when \'ctrl+up\' was pressed');
    });

    QUnit.test('\'commandUp\' key test', function(assert) {
        this.$element.trigger(this.commandUp);

        assert.equal(this.instance.option('value'), 'rgba(50, 99, 99, 0.37)', 'value was changed correctly when \'command+up\' was pressed');
    });

    QUnit.test('\'ctrlShiftUp\' key test', function(assert) {
        this.$element.trigger(this.ctrlShiftUp);

        assert.equal(this.instance.option('value'), 'rgba(50, 89, 99, 0.37)', 'value was changed correctly when \'ctrl+shift+up\' was pressed');
    });

    QUnit.test('\'commandShiftUp\' key test', function(assert) {
        this.$element.trigger(this.commandShiftUp);

        assert.equal(this.instance.option('value'), 'rgba(50, 89, 99, 0.37)', 'value was changed correctly when \'command+shift+up\' was pressed');
    });

    QUnit.test('\'ctrlDown\' key test', function(assert) {
        this.$element.trigger(this.ctrlDown);

        assert.equal(this.instance.option('value'), 'rgba(50, 99, 99, 0.37)', 'value was changed correctly when \'ctrl+down\' was pressed');
    });

    QUnit.test('\'commandDown\' key test', function(assert) {
        this.$element.trigger(this.commandDown);

        assert.equal(this.instance.option('value'), 'rgba(50, 99, 99, 0.37)', 'value was changed correctly when \'command+down\' was pressed');
    });

    QUnit.test('\'ctrlShiftDown\' key test', function(assert) {
        this.$element.trigger(this.ctrlShiftDown);

        assert.equal(this.instance.option('value'), 'rgba(50, 99, 89, 0.37)', 'value was changed correctly when \'ctrl+shift+down\' was pressed');
    });

    QUnit.test('\'commandShiftDown\' key test', function(assert) {
        this.$element.trigger(this.commandShiftDown);

        assert.equal(this.instance.option('value'), 'rgba(50, 99, 89, 0.37)', 'value was changed correctly when \'command+shift+down\' was pressed');
    });

    QUnit.test('\'ctrlRight\' key test', function(assert) {
        this.$element.trigger(this.ctrlRight);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.36)', 'value was changed correctly when \'ctrl+right\' was pressed');
    });

    QUnit.test('\'commandRight\' key test', function(assert) {
        this.$element.trigger(this.commandRight);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.36)', 'value was changed correctly when \'command+right\' was pressed');
    });

    QUnit.test('\'ctrlShiftRight\' key test', function(assert) {
        this.instance.option('value', 'rgba(50, 100, 100, 0.4)');
        this.$element.trigger(this.ctrlShiftRight);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.36)', 'value was changed correctly when \'ctrl+shift+right\' was pressed');
    });

    QUnit.test('\'commandShiftRight\' key test', function(assert) {
        this.instance.option('value', 'rgba(50, 100, 100, 0.4)');
        this.$element.trigger(this.commandShiftRight);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.36)', 'value was changed correctly when \'command+shift+right\' was pressed');
    });

    QUnit.test('\'ctrlLeft\' key test', function(assert) {
        this.$element.trigger(this.ctrlLeft);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.38)', 'value was changed correctly when \'ctrl+left\' was pressed');
    });

    QUnit.test('\'commandLeft\' key test', function(assert) {
        this.$element.trigger(this.commandLeft);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.38)', 'value was changed correctly when \'command+left\' was pressed');
    });

    QUnit.test('\'ctrlShiftLeft\' key test', function(assert) {
        this.$element.trigger(this.ctrlShiftLeft);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.41)', 'value was changed correctly when \'ctrl+shift+left\' was pressed');
    });

    QUnit.test('\'commandShiftLeft\' key test', function(assert) {
        this.$element.trigger(this.commandShiftLeft);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.41)', 'value was changed correctly when \'command+shift+left\' was pressed');
    });

    QUnit.test('\'ctrlRight\' key test, rtl mode', function(assert) {
        this.$element.dxColorView('instance').option('rtlEnabled', true);
        this.$element.trigger(this.ctrlRight);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.38)', 'value was changed correctly when \'ctrl+right\' was pressed');
    });

    QUnit.test('\'commandRight\' key test, rtl mode', function(assert) {
        this.$element.dxColorView('instance').option('rtlEnabled', true);
        this.$element.trigger(this.commandRight);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.38)', 'value was changed correctly when \'command+right\' was pressed');
    });

    QUnit.test('\'ctrlLeft\' key test, rtl mode', function(assert) {
        this.$element.dxColorView('instance').option('rtlEnabled', true);
        this.$element.trigger(this.ctrlLeft);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.36)', 'value was changed correctly when \'ctrl+left\' was pressed');
    });

    QUnit.test('\'commandLeft\' key test, rtl mode', function(assert) {
        this.$element.dxColorView('instance').option('rtlEnabled', true);
        this.$element.trigger(this.commandLeft);

        assert.equal(this.instance.option('value'), 'rgba(50, 100, 100, 0.36)', 'value was changed correctly when \'command+left\' was pressed');
    });

    QUnit.test('setting hueHandler to top position by keybord navigation change color to rgb(255,0,0)', function(assert) {
        this.instance.option('value', 'rgba(255,0,4,1)');

        this.$element.trigger(this.ctrlUp);

        assert.equal(this.instance.option('value'), 'rgba(255, 0, 0, 1)', 'value was changed correctly when handler was placed to the top position');
    });

    QUnit.test('setting hueHandler to top position by keybord navigation change color correctly', function(assert) {
        this.instance.option('value', 'rgba(255 , 0, 4, 1)');
        this.$element.trigger(this.ctrlUp);
        const topOffset = this.$hueMarker.offset().top;
        this.$element.trigger(this.ctrlUp);

        assert.equal(topOffset, this.$hueMarker.offset().top, 'pressing on the \'ctrl+up\' in top position does not move handler');

        this.$element.trigger(this.ctrlDown);

        assert.equal(this.instance.option('value'), 'rgba(255, 0, 4, 1)', 'value was changed correctly when \'ctrl+down\' was pressed');
    });

    QUnit.test('setting hueHandler to bottom position by keybord navigation change color correctly', function(assert) {
        this.instance.option('value', 'rgba(255, 4, 0, 1)');
        this.$element.trigger(this.ctrlDown);
        const topOffset = this.$hueMarker.offset().top;
        this.$element.trigger(this.ctrlDown);

        assert.equal(topOffset, this.$hueMarker.offset().top, 'pressing on the \'ctrl+down\' in bottom position does not move handler');

        this.$element.trigger(this.ctrlUp);

        assert.equal(this.instance.option('value'), 'rgba(255, 4, 0, 1)', 'value was changed correctly when \'ctrl+up\' was pressed');
    });

    QUnit.test('setting paletteHandler to top position by keybord navigation change color to rgb(255,0,0)', function(assert) {
        this.instance.option('value', 'rgba(255,0,4,1)');

        this.$element.trigger(this.ctrlUp);

        assert.equal(this.instance.option('value'), 'rgba(255, 0, 0, 1)', 'value was changed correctly when handler was placed to the top position');
    });

    QUnit.test('setting paletteHandler to top position by keybord navigation change color correctly', function(assert) {
        this.instance.option('value', 'rgba(255,145,145,1)');

        const topOffset = this.$paletteMarker.offset().top;
        this.keyboard.keyDown('up');
        assert.equal(topOffset, this.$paletteMarker.offset().top, 'pressing on the \'up\' in top position does not move handler');

        this.keyboard.keyDown('down');
        assert.equal(this.instance.option('value'), 'rgba(252, 144, 144, 1)', 'value was changed correctly when \'down\' was pressed');
    });

    QUnit.test('setting paletteHandler to top position by keybord navigation using keyStep change color correctly', function(assert) {
        this.instance.option('value', 'rgba(252,144,144,1)');

        this.$element.trigger(this.shiftUp);
        this.$element.trigger(this.shiftDown);

        assert.equal(this.instance.option('value'), 'rgba(247, 141, 141, 1)', 'value was changed correctly when \'down\' was pressed');
    });

    QUnit.test('setting paletteHandler to bottom position by keybord navigation change color correctly', function(assert) {
        this.instance.option('value', 'rgba(3,1,1,1)');

        this.keyboard.keyDown('down');
        const topOffset = this.$paletteMarker.offset().top;
        this.keyboard.keyDown('down');
        assert.equal(topOffset, this.$paletteMarker.offset().top, 'pressing on the \'down\' in bottom position does not move handler');

        this.keyboard.keyDown('up');
        assert.equal(this.instance.option('value'), 'rgba(3, 1, 1, 1)', 'value was changed correctly when \'up\' was pressed');
    });

    QUnit.test('setting paletteHandler to bottom position by keybord navigation using keyStep change color correctly', function(assert) {
        this.instance.option('value', 'rgba(5,1,1,1)');

        this.$element.trigger(this.shiftDown);
        this.$element.trigger(this.shiftUp);

        assert.equal(this.instance.option('value'), 'rgba(8, 2, 2, 1)', 'value was changed correctly when \'up\' was pressed');
    });

    QUnit.test('setting paletteHandler to left position by keybord navigation change color correctly', function(assert) {
        this.instance.option('value', 'rgba(140,140,140,1)');

        const leftOffset = this.$paletteMarker.offset().left;
        this.keyboard.keyDown('left');

        assert.equal(leftOffset, this.$paletteMarker.offset().left, 'pressing on the \'left\' in left position does not move handler');

        this.keyboard.keyDown('right');
        assert.equal(this.instance.option('value'), 'rgba(140, 139, 139, 1)', 'value was changed correctly when \'right\' was pressed');
    });

    QUnit.test('setting paletteHandler to left position by keybord navigation using keyStep change color correctly', function(assert) {
        this.instance.option('value', 'rgba(145,140,140,1)');

        this.$element.trigger(this.shiftLeft);
        this.$element.trigger(this.shiftRight);

        assert.equal(this.instance.option('value'), 'rgba(145, 141, 141, 1)', 'value was changed correctly when \'right\' was pressed');
    });

    QUnit.test('setting paletteHandler to right position by keybord navigation change color correctly', function(assert) {
        this.instance.option('value', 'rgba(130,0,0,1)');

        const leftOffset = this.$paletteMarker.offset().left;
        this.keyboard.keyDown('right');

        assert.equal(leftOffset, this.$paletteMarker.offset().left, 'pressing on the \'right\' in left position does not move handler');

        this.keyboard.keyDown('left');
        assert.equal(this.instance.option('value'), 'rgba(130, 1, 1, 1)', 'value was changed correctly when \'left\' was pressed');
    });

    QUnit.test('setting paletteHandler to right position by keybord navigation using keyStep change color correctly', function(assert) {
        this.instance.option('value', 'rgba(130,1,1,1)');

        this.$element.trigger(this.shiftRight);
        this.$element.trigger(this.shiftLeft);

        assert.equal(this.instance.option('value'), 'rgba(130, 4, 4, 1)', 'value was changed correctly when \'left\' was pressed');
    });

    QUnit.test('setting alphaChannelHandler to right position by keybord navigation change alpha correctly', function(assert) {
        this.instance.option('value', 'rgba(255, 0, 0, 0.01)');

        this.$element.trigger(this.ctrlRight);
        const leftOffset = this.$alphaMarker.offset().left;
        this.$element.trigger(this.ctrlRight);

        assert.equal(leftOffset, this.$alphaMarker.offset().left, 'pressing on the \'ctrl+right\' in right position does not move handler');

        this.$element.trigger(this.ctrlLeft);

        assert.equal(this.instance.option('value'), 'rgba(255, 0, 0, 0.01)', 'alpha was changed correctly when \'ctrl+left\' was pressed');
    });

    QUnit.test('setting alphaChannelHandler to left position by keybord navigation change alpha correctly', function(assert) {
        this.instance.option('value', 'rgba(255, 0, 0, 0.99)');

        this.$element.trigger(this.ctrlLeft);
        const leftOffset = this.$alphaMarker.offset().left;
        this.$element.trigger(this.ctrlLeft);

        assert.equal(leftOffset, this.$alphaMarker.offset().left, 'pressing on the \'ctrl+left\' in left position does not move handler');

        this.$element.trigger(this.ctrlRight);

        assert.equal(this.instance.option('value'), 'rgba(255, 0, 0, 0.99)', 'alpha was changed correctly when \'ctrl+right\' was pressed');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria labels for editors', function(assert) {
        const $element = $('#color-view').dxColorView({
            editAlphaChannel: true
        });
        const $r = $element.find('.dx-colorview-label-red .dx-numberbox');
        const $g = $element.find('.dx-colorview-label-green .dx-numberbox');
        const $b = $element.find('.dx-colorview-label-blue .dx-numberbox');
        const $alpha = $element.find('.dx-colorview-alpha-channel-label .dx-numberbox');
        const $code = $element.find('.dx-colorview-label-hex .dx-textbox');

        assert.equal($r.attr('aria-label'), 'Red', 'red label is correct');
        assert.equal($g.attr('aria-label'), 'Green', 'green label is correct');
        assert.equal($b.attr('aria-label'), 'Blue', 'blue label is correct');
        assert.equal($alpha.attr('aria-label'), 'Transparency', 'alpha label is correct');
        assert.equal($code.attr('aria-label'), 'Color code', 'hex label is correct');
    });

    QUnit.test('handle should have role="application" and id', function(assert) {
        const $target = $('<div>');
        const $element = $('#color-view').dxColorView({
            target: $target,
        });

        const $handle = $element.find(COLORVIEW_PALETTE_HANDLE_SELECTOR);

        assert.strictEqual($handle.attr('role'), 'application');
        assert.ok($handle.attr('id'));
        assert.strictEqual($target.attr('aria-activedescendant'), $handle.attr('id'));
    });

    QUnit.test('hex input should have id equal to aria-labelledby of handle', function(assert) {
        const $element = $('#color-view').dxColorView();

        const $handle = $element.find(COLORVIEW_PALETTE_HANDLE_SELECTOR);
        const $code = $element.find(`${COLORVIEW_LABEL_HEX_SELECTOR} ${TEXTBOX_SELECTOR}`);

        assert.strictEqual($handle.attr('labelledby'), $code.attr('id'));
    });
});

QUnit.module('valueChanged handler should receive correct event', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            onValueChanged: this.valueChangedHandler,
            editAlphaChannel: true,
            focusStateEnabled: true
        };
        this.init = (options) => {
            this.$element = $('#color-view').dxColorView(options);
            this.instance = this.$element.dxColorView('instance');
            this.keyboard = keyboardMock(this.$element);
            this.$palette = this.$element.find(COLORVIEW_PALETTE_SELECTOR);
            this.$hueScale = this.$element.find(COLORVIEW_HUE_SCALE_SELECTOR);
            this.$alphaChannelScale = this.$element.find(COLORVIEW_ALPHA_CHANNEL_SCALE_SELECTOR);
        };
        this.reinit = (options) => {
            this.instance.dispose();
            this.init($.extend({}, initialOptions, options));
        };

        this.testProgramChange = (assert) => {
            this.instance.option('value', '#704f4f');

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
            assert.strictEqual(event, undefined, 'event is undefined');
        };

        this.aliases = ['red', 'green', 'blue', 'hex', 'alpha'];
        this._getColorInput = function(inputAlias) {
            const inputIndex = $.inArray(inputAlias, this.aliases);
            return this.$element
                .find(`label ${TEXTEDITOR_INPUT_SELECTOR}`)
                .eq(inputIndex);
        };
        this.updateColorInput = function(inputAlias, value) {
            const $input = this._getColorInput(inputAlias);
            $input.val(value);
            $input.trigger('change');
        };
        this.checkEvent = (assert, type, target, key) => {
            const event = this.valueChangedHandler.getCall(0).args[0].event;
            assert.strictEqual(event.type, type, 'event type is correct');
            assert.strictEqual(event.target, target.get(0), 'event target is correct');
            if(type === 'keydown') {
                assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
            }
        };

        this.init(initialOptions);
    },
    afterEach: function() {
        fx.off = true;
        this.clock.restore();
    }
}, () => {
    QUnit.test('on runtime change', function(assert) {
        this.testProgramChange(assert);
    });

    QUnit.test('on click on palette', function(assert) {
        click(this.$palette, {
            left: 170,
            top: 170
        });

        this.checkEvent(assert, 'dxpointerdown', this.$palette);
        this.testProgramChange(assert);
    });

    ['upArrow', 'downArrow'].forEach(key => {
        QUnit.test(`on ${key} press`, function(assert) {
            this.reinit({ value: 'rgba(15, 14, 14, 1)' });

            this.keyboard.press(key);

            this.checkEvent(assert, 'keydown', this.$element, key);
            this.testProgramChange(assert);
        });
    });

    ['upArrow', 'downArrow'].forEach(key => {
        QUnit.test(`on ${key}+ctrl press`, function(assert) {
            this.reinit({ value: 'rgba(14, 15, 14, 1)' });

            for(let i = 0; i < 13; ++i) {
                this.keyboard.keyDown(key, { ctrlKey: true });
            }

            this.checkEvent(assert, 'keydown', this.$element, key);
            this.testProgramChange(assert);
        });
    });

    ['leftArrow', 'rightArrow'].forEach(key => {
        QUnit.test(`on ${key}+ctrl press`, function(assert) {
            this.reinit({ value: 'rgba(14, 15, 14, 0.65)' });

            this.keyboard.keyDown(key, { ctrlKey: true });

            this.checkEvent(assert, 'keydown', this.$element, key);
            this.testProgramChange(assert);
        });
    });

    ['leftArrow', 'rightArrow'].forEach(key => {
        QUnit.test(`on ${key} press`, function(assert) {
            this.reinit({ value: 'rgba(15, 14, 14, 1)' });

            for(let i = 0; i < 6; ++i) {
                this.keyboard.press(key);
            }

            this.checkEvent(assert, 'keydown', this.$element, key);
            this.testProgramChange(assert);
        });
    });

    QUnit.test('on click on hue scale', function(assert) {
        click(this.$hueScale, {
            left: 170,
            top: 170
        });

        this.checkEvent(assert, 'dxpointerdown', this.$hueScale);
        this.testProgramChange(assert);
    });

    QUnit.test('on click on alpha channel scale', function(assert) {
        click(this.$alphaChannelScale, {
            left: 88,
            top: 0
        });

        this.checkEvent(assert, 'dxpointerdown', this.$alphaChannelScale);
        this.testProgramChange(assert);
    });

    ['red', 'green', 'blue'].forEach(inputAlias => {
        QUnit.test(`on ${inputAlias} text input change`, function(assert) {
            this.updateColorInput(inputAlias, 100);

            const $input = this._getColorInput(inputAlias);
            this.checkEvent(assert, 'change', $input);
            this.testProgramChange(assert);
        });
    });

    QUnit.test('on hex text input change', function(assert) {
        this.updateColorInput('hex', '551414');

        const $input = this._getColorInput('hex');
        this.checkEvent(assert, 'change', $input);
        this.testProgramChange(assert);
    });

    QUnit.test('on alpha text input change', function(assert) {
        this.updateColorInput('alpha', 0.5);

        const $input = this._getColorInput('alpha');
        this.checkEvent(assert, 'change', $input);
        this.testProgramChange(assert);
    });
});
