import $ from 'jquery';
import { noop } from 'core/utils/common';
import devices from '__internal/core/m_devices';
import Color from 'color';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import fx from 'common/core/animation/fx';
import { normalizeKeyName } from 'common/core/events/utils/index';

import 'generic_light.css!';
import 'ui/color_box';

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
const COLOR_BOX_OVERLAY_CLASS = COLOR_BOX_CLASS + '-overlay';

const STATE_FOCUSED_CLASS = 'dx-state-focused';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const COLORVIEW_CLASS = 'dx-colorview';
const POPUP_CONTENT_CLASS = 'dx-popup-content';

const COLORVIEW_HEX_INPUT_SELECTOR = '.dx-colorview-label-hex .dx-texteditor-input';
const COLORVIEW_APPLY_BUTTON_SELECTOR = '.dx-colorview-apply-button';
const CLEAR_BUTTON_AREA_SELECTOR = '.dx-clear-button-area';
const COLOR_VIEW_PALETTE_HANDLE_SELECTOR = '.dx-colorview-palette-handle';
const COLOR_VIEW_CANCEL_BUTTON_SELECTOR = '.dx-colorview-cancel-button';
const BUTTON_SELECTOR = '.dx-button';
const TEXTBOX_SELECTOR = '.dx-textbox';

const move = function($element, position) {
    const parentOffset = $element.parent().offset();
    pointerMock($element)
        .start()
        .down(parentOffset.left, parentOffset.top)
        .move(position.left, position.top)
        .up();
};

const showColorBox = function(options) {
    const $colorBox = this.element.dxColorBox(options);
    $($colorBox.find('.dx-dropdowneditor-button')).trigger('dxclick');

    return $colorBox;
};

const getColorBoxOverlay = function() {
    return $('.' + COLOR_BOX_OVERLAY_CLASS);
};

const getColorBoxOverlayContent = function() {
    return $('.' + 'dx-overlay-content');
};

QUnit.module('Color Box', {
    beforeEach: function() {
        fx.off = true;
        this.element = $('#color-box');

        this.updateColorInput = function(inputAlias, value) {
            const aliases = [
                'red',
                'green',
                'blue',
                'hex',
                'alpha'
            ];
            const inputIndex = $.inArray(inputAlias, aliases);

            const $input = getColorBoxOverlay().find('label .' + TEXTEDITOR_INPUT_CLASS).eq(inputIndex);

            $input.val(value);
            $($input).trigger('change');
        };

        this.checkColor = function(expectedColor, assert) {
            const colorPicker = this.element.dxColorBox('instance')._colorView;
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
    QUnit.test('Render with hex value', function(assert) {
        const $colorBox = showColorBox.call(this, { value: '#000000' }); const $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

        assert.equal($input.val(), '#000000');
        $colorBox.dxColorBox('instance').option('value', '#ff0000');
        assert.equal($input.val(), '#ff0000');
    });

    QUnit.test('If value is set as \'null\' color result preview should not have background color - the first case(T198625)', function(assert) {
        const colorBox = this.element.dxColorBox().dxColorBox('instance');

        colorBox.option('value', '#ff0000');
        colorBox.option('value', null);

        assert.ok(!colorBox.$element().find('.dx-colorbox-color-result-preview').attr('style'));
    });

    QUnit.test('If value is set as \'null\' color result preview should not have background color - the second case(T198625)', function(assert) {

        showColorBox.call(this);

        const $overlay = getColorBoxOverlay(); const $applyButton = $overlay.find('.dx-colorview-buttons-container .dx-colorview-apply-button'); const colorBoxInstance = this.element.dxColorBox('instance');

        colorBoxInstance._colorView._currentColor = new Color('#ff0000');
        $($applyButton).trigger('dxclick');

        colorBoxInstance.option('value', null);

        assert.ok(!colorBoxInstance.$element().find('.dx-colorbox-color-result-preview').attr('style'));
    });

    QUnit.test('If value is not \'null\' color result preview should not have a special css class', function(assert) {
        const $colorBox = this.element.dxColorBox(); const $colorInputContainer = $colorBox.find('.' + COLOR_BOX_INPUT_CONTAINER_CLASS);

        $colorBox.dxColorBox('instance').option('value', '#ff0000');

        assert.ok(!$colorInputContainer.hasClass(COLOR_BOX_COLOR_IS_NOT_DEFINED));
    });

    QUnit.test('It should be possible to set empty value using input of dropdown editor', function(assert) {
        const $colorBox = this.element.dxColorBox({
            value: 'red'
        });

        $('.' + COLOR_BOX_INPUT_CLASS).val('').trigger('change');

        assert.equal($colorBox.dxColorBox('instance').option('value'), '');
    });

    QUnit.test('Render overlay', function(assert) {
        showColorBox.call(this);
        const $overlay = getColorBoxOverlay();
        assert.equal($overlay.length, 1);
    });

    QUnit.test('Render color picker container', function(assert) {
        showColorBox.call(this);
        const $overlay = getColorBoxOverlay(); const $colorPickerContainer = $overlay.find('.dx-colorview-container'); const $alphaChannelScale = $overlay.find('.dx-colorview-alpha-channel-scale'); const $alphaChannelInput = $overlay.find('.dx-colorview-alpha-channel-input'); const $alphaChannelLabel = $overlay.find('.dx-colorview-alpha-label');

        assert.equal($colorPickerContainer.length, 1);
        assert.equal($alphaChannelScale.length, 0);
        assert.equal($alphaChannelInput.length, 0);
        assert.equal($alphaChannelLabel.length, 0);
    });

    QUnit.test('Popup content width should be equal to colorBox width when editor width is bigger then colorBox width', function(assert) {
        this.element.dxColorBox({
            width: 1000,
            opened: true
        });
        const $colorView = $(`.${COLORVIEW_CLASS}`);
        const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);

        assert.strictEqual($popupContent.width(), $colorView.outerWidth(), 'popup content width is correct');
    });

    QUnit.test('Popup content width should be equal to colorBox width when editor width is smaller then colorBox width', function(assert) {
        this.element.dxColorBox({
            width: 100,
            opened: true
        });
        const $colorView = $(`.${COLORVIEW_CLASS}`);
        const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);

        assert.strictEqual($popupContent.width(), $colorView.outerWidth(), 'popup content width is correct');
    });

    QUnit.test('Click on apply button', function(assert) {
        const onValueChangedHandler = sinon.spy(noop);

        showColorBox.call(this, {
            onValueChanged: onValueChangedHandler
        });

        const $overlayContent = getColorBoxOverlayContent();
        const $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');
        const colorBoxInstance = this.element.dxColorBox('instance');
        const newColor = '#A600F3'.toLowerCase();

        colorBoxInstance._colorView.option('value', newColor);

        $($applyButton).trigger('dxclick');

        assert.equal(colorBoxInstance.option('value'), newColor);
        assert.equal($('.' + COLOR_BOX_INPUT_CLASS).val(), newColor);
        assert.ok(onValueChangedHandler.calledOnce);
        assert.ok($('.' + COLOR_BOX_OVERLAY_CLASS).is(':hidden'));
    });

    QUnit.test('Click on cancel button', function(assert) {
        showColorBox.call(this, {
            value: '#ff0000'
        });

        this.updateColorInput('hex', 'f0f0f0');

        const $overlayContent = getColorBoxOverlayContent();
        const $cancelButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-cancel-button');

        $($cancelButton).trigger('dxclick');
        assert.ok($('.' + COLOR_BOX_OVERLAY_CLASS).is(':hidden'));

        this.checkColor({
            r: 255,
            g: 0,
            b: 0,
            hex: '#ff0000'
        }, assert);
    });

    QUnit.test('ColorBox should support 8-digit hex color', function(assert) {
        showColorBox.call(this, {
            value: '#be73146b'
        });

        this.checkColor({
            r: 190,
            g: 115,
            b: 20,
            hex: '#be7314',
            alpha: '0.42'
        }, assert);
    });

    QUnit.test('ColorBox should support 4-digit hex color', function(assert) {
        showColorBox.call(this, {
            value: '#fc0c'
        });

        this.checkColor({
            r: 255,
            g: 204,
            b: 0,
            hex: '#ffcc00',
            alpha: '0.80'
        }, assert);
    });

    QUnit.test('Cancel event should work right when color was changed', function(assert) {
        showColorBox.call(this, {
            value: '#2C77B8',
            editAlphaChannel: true
        });

        const $overlayContent = getColorBoxOverlayContent();

        const $colorChooserMarker = $overlayContent.find('.dx-colorview-palette-handle'); const $cancelButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-cancel-button');

        move($colorChooserMarker, {
            left: 220,
            top: 80
        });

        $($cancelButton).trigger('dxclick');

        this.checkColor({
            r: 44,
            g: 119,
            b: 184,
            hex: '#2c77b8'
        }, assert);
    });

    QUnit.test('Cancel event should work right when opacity was changed', function(assert) {
        showColorBox.call(this, {
            value: 'rgba(0, 0, 0, .5)',
            editAlphaChannel: true
        });

        const $overlayContent = getColorBoxOverlayContent();

        const $alphaHandle = $overlayContent.find('.dx-colorview-alpha-channel-handle'); const $cancelButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-cancel-button');

        move($alphaHandle, {
            left: 70,
            top: 0
        });

        $($cancelButton).trigger('dxclick');

        this.checkColor({
            r: 0,
            g: 0,
            b: 0,
            hex: '#000000',
            alpha: 0.5
        }, assert);
    });

    QUnit.test('Restore handle position on cancel button click after drag without changing value (T1080535)', function(assert) {
        const colorBox = showColorBox.call(this, {
            value: 'rgba(50, 150, 250, 0.3)',
            editAlphaChannel: true
        }).dxColorBox('instance');
        const $overlay = getColorBoxOverlay();
        const $hueHandle = $overlay.find('.dx-colorview-hue-scale-handle');
        const positionOnInit = $hueHandle.position().top;

        move($hueHandle, {
            left: 0,
            top: 0.01
        });

        const positionAfterDrag = $hueHandle.position().top;

        assert.notStrictEqual(positionOnInit, positionAfterDrag);

        colorBox.close();
        colorBox.open();
        const positionOnReopen = $hueHandle.position().top;

        assert.equal(positionOnReopen, positionOnInit);
    });

    QUnit.test('When hue was changed opacity is OK', function(assert) {
        showColorBox.call(this, {
            value: 'rgba(255, 0, 0, 0.3)',
            editAlphaChannel: true
        });

        const $overlay = getColorBoxOverlay();
        const $hueHandle = $overlay.find('.dx-colorview-hue-scale-handle');

        move($hueHandle, {
            left: 0,
            top: 289
        });

        $('.dx-colorview-apply-button').trigger('dxclick');

        assert.equal($('.' + COLOR_BOX_INPUT_CLASS).val(), 'rgba(255, 26, 0, 0.3)');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        const spy = sinon.spy(noop);
        const colorBox = showColorBox.call(this, {
            onValueChanged: spy
        }).dxColorBox('instance');

        colorBox.option('value', '#00ff00');

        assert.ok(spy.calledOnce);
    });

    QUnit.test('Changing the input value of closed colorbox must change color preview', function(assert) {
        this.element.dxColorBox({ value: '#ff0000' });
        const $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

        $('.' + COLOR_BOX_INPUT_CLASS).val('#0000ff').trigger('change');

        assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#0000ff');
    });

    QUnit.test('Changing the input value of opened colorbox must change color preview and dropdown elements', function(assert) {
        showColorBox.call(this, { value: '#FF0000' });
        const $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

        $('.' + COLOR_BOX_INPUT_CLASS).val('#0000ff').trigger('change');

        assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#0000ff');

        this.checkColor({
            r: 0,
            g: 0,
            b: 255,
            hex: '#0000ff'
        }, assert);
    });

    QUnit.test('Update colors preview', function(assert) {
        const colorPicker = showColorBox.call(this).dxColorBox('instance')._colorView;

        this.updateColorInput('hex', 'd0ff00');
        colorPicker.applyColor();

        const baseColor = $('.dx-colorview-color-preview-color-current').css('backgroundColor');
        const newColor = $('.dx-colorview-color-preview-color-new').css('backgroundColor');

        assert.equal(new Color(newColor).toHex(), '#d0ff00', 'new color');
        assert.equal(new Color(baseColor).toHex(), '#000000', 'default color');
    });

    QUnit.test('Update colors preview after value change', function(assert) {
        const colorBox = showColorBox.call(this, { value: '#fafafa' }).dxColorBox('instance');

        colorBox.option('value', '#f0f0f0');
        this.updateColorInput('hex', 'd0ff00');
        colorBox._colorView.applyColor();

        const baseColor = $('.dx-colorview-color-preview-color-current').css('backgroundColor');
        const newColor = $('.dx-colorview-color-preview-color-new').css('backgroundColor');

        assert.equal(new Color(newColor).toHex(), '#d0ff00', 'new color');
        assert.equal(new Color(baseColor).toHex(), '#f0f0f0', 'current ColorBox value still the same');
    });

    QUnit.test('Validate value of colorbox input', function(assert) {
        this.element.dxColorBox({ value: '#ff0000' });
        const $colorBoxInput = $('.' + COLOR_BOX_INPUT_CLASS); const $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

        $($colorBoxInput.val('unknown value')).trigger('change');

        assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#ff0000');
        assert.equal($colorBoxInput.val(), '#ff0000');
    });

    QUnit.test('Validate value of colorbox hex-input', function(assert) {
        this.element.dxColorBox({ value: '#ff0000' });
        const $colorBoxInput = $('.' + COLOR_BOX_INPUT_CLASS); const $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

        $($colorBoxInput.val('#zzzzzz')).trigger('change');

        assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#ff0000');
        assert.equal($colorBoxInput.val(), '#ff0000');
    });

    QUnit.test('In \'instantly\' mode popup should not disappear if value was changed', function(assert) {
        showColorBox.call(this, {
            applyValueMode: 'instantly'
        });

        const $overlay = getColorBoxOverlay(); const $colorChooserMarker = $overlay.find('.dx-colorview-palette-handle');

        move($colorChooserMarker, {
            left: 220,
            top: 80
        });

        assert.equal($overlay.css('display'), 'block');
    });

    QUnit.test('\'instantly\' mode should work for alpha channel', function(assert) {
        const colorBox = showColorBox.call(this, {
            value: 'rgba(100, 100, 100, .2)',
            editAlphaChannel: true,
            applyValueMode: 'instantly'
        }).dxColorBox('instance');

        this.updateColorInput('alpha', 0.75);

        assert.equal(colorBox.option('value'), 'rgba(100, 100, 100, 0.75)');
    });

    QUnit.test('In \'instantly\' mode value should be updated if some input was updated', function(assert) {
        const colorBox = showColorBox.call(this, {
            value: '#ff0000',
            applyValueMode: 'instantly'
        }).dxColorBox('instance');

        this.updateColorInput('red', 100);
        assert.equal(colorBox.option('value'), '#640000');

        this.updateColorInput('green', 100);
        assert.equal(colorBox.option('value'), '#646400');

        this.updateColorInput('blue', 100);
        assert.equal(colorBox.option('value'), '#646464');

        this.updateColorInput('hex', '0000ff');
        assert.equal(colorBox.option('value'), '#0000ff');
    });

    QUnit.test('In \'instantly\' mode value should be updated correctly if some input was updated and editAlphaChannel = true', function(assert) {
        const colorBox = showColorBox.call(this, {
            value: '#ff0000',
            editAlphaChannel: true,
            applyValueMode: 'instantly'
        }).dxColorBox('instance');

        colorBox.option('value', 'rgba(100, 0, 0, 75)');
        this.updateColorInput('red', 100);
        assert.equal(colorBox.option('value'), 'rgba(100, 0, 0, 1)');
    });

    QUnit.test('In "instantly" mode value should not throw an error when invalid value is set (T1274981)', function(assert) {
        try {
            const colorBox = showColorBox.call(this, {
                applyValueMode: 'instantly',
            }).dxColorBox('instance');

            colorBox.option('value', 'invalid');
            assert.strictEqual(colorBox.option('value'), '#000000');

            assert.ok(true, 'no errors');
        } catch(e) {
            assert.ok(false, `The '${e.message}' is raised`);
        }
    });


    QUnit.test('Option changes', function(assert) {
        const colorBox = showColorBox.call(this).dxColorBox('instance');

        $.each([
            { name: 'value', value: '#ff0000' },
            { name: 'editAlphaChannel', value: true },
            { name: 'rtlEnabled', value: true },
            { name: 'keyStep', value: 10 }
        ], function(_, option) {
            colorBox.option(option.name, option.value);
            assert.equal(colorBox._colorView.option(option.name), option.value, '\'' + option.name + '\' option is updated');
        });
    });

    QUnit.test('\'applyButtonText\' and \'cancelButtonText\' options change should update UI', function(assert) {
        const colorBox = showColorBox.call(this).dxColorBox('instance');
        const applyText = 'Test Done';
        const cancelText = 'Test Cancel';

        colorBox.option('applyButtonText', applyText);
        colorBox.close();
        colorBox.open();

        const $applyButton = getColorBoxOverlayContent().find('.dx-colorview-buttons-container .dx-colorview-apply-button');
        assert.equal($applyButton.text(), applyText, 'apply button text is changed');

        colorBox.option('cancelButtonText', cancelText);
        colorBox.close();
        colorBox.open();

        const $cancelButton = getColorBoxOverlayContent().find('.dx-colorview-buttons-container .dx-colorview-cancel-button');
        assert.equal($cancelButton.text(), cancelText, 'cancel button text is changed');
    });

    QUnit.test('Alpha channel input should be updated if value is changed', function(assert) {
        const colorBox = showColorBox.call(this, {
            editAlphaChannel: true,
            value: 'rgba(44, 119, 184, 1)'
        }).dxColorBox('instance');

        $(colorBox._input()).val('rgba(44, 119, 184, 0.5)').trigger('change');
        assert.equal(colorBox._colorView._alphaChannelInput.option('value'), 0.5);
    });

    QUnit.test('When value was updated twice, color editors should have right values', function(assert) {
        const colorBox = this.element.dxColorBox({ value: 'rgba(44, 119, 184, 1)', editAlphaChannel: true }).dxColorBox('instance');
        colorBox.open();
        colorBox.close();
        $(colorBox._input()).val('rgba(100, 150, 200, 0.5)').trigger('change');
        colorBox.open();

        assert.equal(colorBox._colorView._alphaChannelInput.option('value'), 0.5);
        assert.equal(colorBox._colorView._rgbInputs[0].option('value'), 100);
        assert.equal(colorBox._colorView._rgbInputs[1].option('value'), 150);
        assert.equal(colorBox._colorView._rgbInputs[2].option('value'), 200);
    });

    QUnit.test('T169171 - rendering of many drop buttons', function(assert) {
        const $colorBox = this.element.dxColorBox({}); const colorBox = $colorBox.dxColorBox('instance');

        assert.equal($colorBox.find('.dx-dropdowneditor-button').length, 1, 'only one button is rendered');

        colorBox.open();
        colorBox.close();

        colorBox.option('value', 'rgba(0, 0, 0, 1)');

        assert.equal($colorBox.find('.dx-dropdowneditor-button').length, 1, 'one button is still rendered');
    });

    QUnit.test('Color changed in preview if value is valid', function(assert) {
        const $colorBox = this.element.dxColorBox({
            value: '#f00'
        });
        const colorBox = $colorBox.dxColorBox('instance');

        const $colorPreview = $colorBox.find('.dx-colorbox-color-result-preview');
        const $input = $colorBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.val('');
        keyboard.type('#0');
        let previewColor = new Color($colorPreview.css('backgroundColor'));
        let currentColor = new Color(colorBox.option('value'));

        assert.equal(previewColor.toHex(), currentColor.toHex(), 'show current value when color is invalid');

        keyboard
            .type('0f')
            .press('enter');

        previewColor = new Color($colorPreview.css('backgroundColor'));
        currentColor = new Color($input.val());

        assert.equal(previewColor.toHex(), currentColor.toHex(), 'show color if input value is valid');
    });

    QUnit.test('ColorBox set the right stylingMode option to ColorView (default)', function(assert) {
        const $colorBox = $('#color-box').dxColorBox({ value: 'red' }); const colorBox = $colorBox.dxColorBox('instance');

        colorBox.open();
        assert.equal(colorBox._colorView.option('stylingMode'), 'outlined');
    });

    QUnit.test('ColorBox set the right stylingMode option to ColorView (custom)', function(assert) {
        const $colorBox = $('#color-box').dxColorBox({ value: 'red', stylingMode: 'underlined' }); const colorBox = $colorBox.dxColorBox('instance');

        colorBox.open();
        assert.equal(colorBox._colorView.option('stylingMode'), 'underlined');
    });

    [
        { value: undefined, editAlphaChannel: false },
        { value: undefined, editAlphaChannel: true },
        { value: null, editAlphaChannel: false },
        { value: null, editAlphaChannel: true },
        { value: '', editAlphaChannel: false },
        { value: '', editAlphaChannel: true },
    ].forEach(({ value, editAlphaChannel }) => {
        QUnit.test(`Text should be empty (value=${value}; editAlphaChannel=${editAlphaChannel})`, function(assert) {
            const colorBox = $('#color-box').dxColorBox({
                value,
                editAlphaChannel
            }).dxColorBox('instance');

            assert.strictEqual(colorBox.option('text'), '');
        });

        QUnit.test(`Text should be empty after typed digit and pressed enter (value=${value}; editAlphaChannel=${editAlphaChannel})`, function(assert) {
            const $colorBox = $('#color-box').dxColorBox({
                value,
                editAlphaChannel
            });
            const colorBox = $colorBox.dxColorBox('instance');
            const $input = $colorBox.find('.' + TEXTEDITOR_INPUT_CLASS);
            const keyboard = keyboardMock($input);

            keyboard
                .type('0')
                .press('enter');

            assert.strictEqual(colorBox.option('text'), '');
        });
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#color-box').dxColorBox({
            value: 'rgba(145, 76, 76, 1)',
            editAlphaChannel: true,
            focusStateEnabled: true
        });
        this.instance = this.$element.dxColorBox('instance');
        this.$input = this.$element.find('.' + TEXTEDITOR_INPUT_CLASS);
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('colorbox should work after enter key pressing', function(assert) {
        assert.expect(0);
        this.keyboard.keyDown('enter');
    });

    QUnit.test('enter key test', function(assert) {
        this.instance.option({
            opened: true,
            applyValueMode: 'useButtons'
        });

        this.keyboard.keyDown('up');
        this.keyboard.keyDown('enter');
        assert.ok(!this.instance.option('opened'), 'overlay is not visible on \'enter\' key press');
        assert.equal(this.instance.option('value'), 'rgba(148, 77, 77, 1)');
    });

    QUnit.test('enter key test on inputs', function(assert) {
        assert.expect(10);

        const instance = this.instance;
        const $input = this.$element.find('.dx-texteditor-input');
        instance.option({
            opened: true,
            value: 'rgba(153, 72, 70, 1)',
            applyValueMode: 'useButtons',
            editAlphaChannel: true
        });

        const $popup = $(instance.content());

        $popup.find('.dx-texteditor-input').each(function(_, itemInput) {
            const $itemInput = $(itemInput);

            $($input).trigger($.Event('keydown', { key: 'ArrowLeft' }));
            $($itemInput).trigger($.Event('keydown', { key: 'Enter' }));
            assert.equal(instance.option('value'), 'rgba(153, 73, 72, 1)', 'value was changed correctly after press enter');
            assert.equal(instance.option('opened'), false, 'overlay has been closed');

            instance.option({
                value: 'rgba(153, 72, 70, 1)',
                opened: true
            });
        });
    });

    QUnit.test('Enter button should update value correctly', function(assert) {
        this.instance.option({
            opened: true,
            applyValueMode: 'useButtons',
            editAlphaChannel: true
        });

        this.$input.val('#944D4D');
        this.keyboard.keyDown('enter');

        assert.equal(this.$input.val(), 'rgba(148, 77, 77, 1)');
        assert.equal(this.instance.option('value'), 'rgba(148, 77, 77, 1)');
    });

    QUnit.test('Enter button should update color name value correctly', function(assert) {
        this.instance.option({
            opened: true,
            applyValueMode: 'useButtons',
            editAlphaChannel: false
        });

        this.$input.val('red');
        this.keyboard.keyDown('enter');

        assert.equal(this.$input.val(), '#ff0000');
        assert.equal(this.instance.option('value'), '#ff0000');
    });

    QUnit.test('up arrow key test', function(assert) {
        this.instance.option({
            opened: true,
            applyValueMode: 'instantly'
        });

        this.keyboard.keyDown('up');

        assert.ok(this.instance.option('opened'), 'overlay is not visible on \'up\' key press');
        assert.equal(this.instance.option('value'), 'rgba(148, 77, 77, 1)', 'value was changed correctly ');
    });

    QUnit.test('down arrow key test', function(assert) {
        this.instance.option({
            opened: true,
            applyValueMode: 'instantly'
        });

        this.keyboard.keyDown('down');

        assert.ok(this.instance.option('opened'), 'overlay is not visible on \'up\' key press');
        assert.equal(this.instance.option('value'), 'rgba(143, 74, 74, 1)', 'value was changed correctly ');
    });

    QUnit.test('arrow right and left test', function(assert) {
        let $handler; let handlerOffset;

        this.instance.option({
            opened: true,
            applyValueMode: 'instantly'
        });

        $handler = getColorBoxOverlay().find('.dx-colorview-palette-handle'),
        handlerOffset = $handler.offset();
        this.keyboard.keyDown('right');
        assert.ok($handler.offset().left > handlerOffset.left, 'Handler moved right when \'right\' was pressed');
        this.keyboard.keyDown('left'); this.keyboard.keyDown('left');
        assert.ok($handler.offset().left < handlerOffset.left, 'Handler moved left when \'left\' was pressed');
    });

    QUnit.test('ColorBox opening fine when focusStateEnabled set to false', function(assert) {
        this.instance.option({
            focusStateEnabled: false
        });

        this.instance.option('opened', true);
        assert.ok(this.instance._colorView, 'colorView work fine when focusStateEnabled set to false');
    });

    QUnit.testInActiveWindow('pressing tab should set focus on first item in overlay', function(assert) {
        this.instance.option('opened', true);
        this.keyboard.keyDown('tab');

        assert.ok($(`.${COLORVIEW_CLASS}`).hasClass(STATE_FOCUSED_CLASS), 'tab sets focus to the first overlay item');
    });

    QUnit.testInActiveWindow('first input focused on tab should have selected text (T1127632)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }
        const toolbarItems = [{
            widget: 'dxTextBox',
            toolbar: 'top',
            location: 'before',
            options: {
                text: 'Textbox',
            },
        }];

        this.instance.option({
            opened: true,
            applyValueMode: 'useButtons',
            dropDownOptions: {
                toolbarItems,
            },
        });
        this.keyboard.keyDown('tab');

        const $firstInput = $(getColorBoxOverlayContent().find(TEXTBOX_SELECTOR)[0]).find('input');
        const caretPosition = {
            start: $firstInput[0].selectionStart,
            end: $firstInput[0].selectionEnd
        };

        assert.strictEqual(caretPosition.start, 0, 'selectionStart is correct');
        assert.strictEqual(caretPosition.end, 7, 'selectionEnd is correct');
    });

    QUnit.test('Pressing the \'Esc\' key should close the dropDown', function(assert) {
        assert.expect(5);
        const instance = this.instance;

        instance.option({
            opened: true,
            applyValueMode: 'useButtons',
            editAlphaChannel: true
        });


        $(instance.content())
            .find(`.${TEXTEDITOR_INPUT_CLASS}`)
            .each((index, editorInput) => {
                const $editorInput = $(editorInput);
                const escapeKeyDown = $.Event('keydown', { key: 'Escape' });

                $($editorInput).trigger(escapeKeyDown);
                assert.notOk(instance.option('opened'), 'overlay has been closed');

                instance.option('opened', true);
            });
    });

    if(devices.real().deviceType === 'desktop') {
        QUnit.module('applyValueMode is useButtons', () => {
            const toolbarItems = [{
                widget: 'dxButton',
                toolbar: 'top',
                location: 'before',
                options: {
                    text: 'Button',
                },
            },
            {
                widget: 'dxTextBox',
                toolbar: 'bottom',
                location: 'before',
                options: {
                    text: 'Text box',
                },
            }];

            QUnit.test('pressing tab should set focus on first item in popup', function(assert) {
                this.instance.option({
                    opened: true,
                    applyValueMode: 'useButtons',
                });
                this.keyboard.keyDown('tab');

                assert.ok($(`.${COLORVIEW_CLASS}`).hasClass(STATE_FOCUSED_CLASS));
            });

            QUnit.test('pressing tab + shift should set focus on cancel button in popup', function(assert) {
                this.instance.option({
                    opened: true,
                    applyValueMode: 'useButtons',
                });
                this.keyboard.keyDown('tab', { shiftKey: true });

                const $cancelButton = getColorBoxOverlayContent().find(COLOR_VIEW_CANCEL_BUTTON_SELECTOR);

                assert.ok($cancelButton.hasClass(STATE_FOCUSED_CLASS));
            });

            QUnit.test('pressing tab should set focus on first item in popup with custom items', function(assert) {
                this.instance.option({
                    opened: true,
                    applyValueMode: 'useButtons',
                    dropDownOptions: {
                        toolbarItems,
                    },
                });
                this.keyboard.keyDown('tab');

                assert.ok(getColorBoxOverlayContent().find(BUTTON_SELECTOR).hasClass(STATE_FOCUSED_CLASS), 'button is focused');
            });

            QUnit.test('pressing tab + shift should set focus on last item in popup with custom items', function(assert) {
                this.instance.option({
                    opened: true,
                    applyValueMode: 'useButtons',
                    dropDownOptions: {
                        toolbarItems,
                    },
                });
                this.keyboard.keyDown('tab', { shiftKey: true });

                assert.ok(getColorBoxOverlayContent().find(TEXTBOX_SELECTOR).hasClass(STATE_FOCUSED_CLASS), 'textbox is focused');
            });
        });
    }
});

QUnit.module('Regressions', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('T171573', function(assert) {
        const $colorBox = $('#color-box').dxColorBox({ value: 'red' }); const colorBox = $colorBox.dxColorBox('instance');

        assert.equal(colorBox.option('value'), 'red');

        colorBox.open();
        assert.equal(colorBox._colorView.option('value'), 'red');
    });

    QUnit.test('T196473', function(assert) {
        const colorBox = $('#color-box').dxColorBox({
            value: '#ff0000'
        }).dxColorBox('instance');

        colorBox.open();

        const colorView = colorBox._colorView;
        const $overlayContent = getColorBoxOverlayContent(); const $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');

        $($applyButton).trigger('dxclick');

        assert.ok(!colorView.$element().is(':visible'));
    });

    QUnit.test('Value should not be changed by \'down\' key when colorbox was opened and closed', function(assert) {
        const colorBox = $('#color-box').dxColorBox({
            value: '#ff0000'
        }).dxColorBox('instance');

        const $input = $(colorBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS)); const keyboard = keyboardMock($input);

        colorBox.open();

        const $overlayContent = getColorBoxOverlayContent(); const $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');

        $($applyButton).trigger('dxclick');

        keyboard.keyDown('down');
        keyboard.keyDown('down');
        keyboard.keyDown('enter');

        assert.equal(colorBox.option('value'), '#ff0000');
    });

    QUnit.test('Value should not be changed by \'up\' key when colorbox was opened and closed', function(assert) {
        const colorBox = $('#color-box').dxColorBox({
            value: '#326b8a'
        }).dxColorBox('instance');

        const $input = $(colorBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS)); const keyboard = keyboardMock($input);

        colorBox.open();

        const $overlayContent = getColorBoxOverlayContent(); const $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');

        $($applyButton).trigger('dxclick');

        keyboard.keyDown('up');
        keyboard.keyDown('up');
        keyboard.keyDown('enter');

        assert.equal(colorBox.option('value'), '#326b8a');
    });

    QUnit.test('value should be reseted after popup closing when \'applyValueMode\' is \'useButtons\' (T806577)', function(assert) {
        const colorBox = $('#color-box').dxColorBox({
            value: '#aabbcc',
            applyValueMode: 'useButtons',
            opened: true
        }).dxColorBox('instance');
        const $input = $(colorBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS));
        const colorView = $('.dx-colorview').dxColorView('instance');
        const keyboard = keyboardMock($input);

        colorView.option('value', '#ffffff');
        colorBox.close();

        keyboard.press('enter');

        assert.equal(colorBox.option('value'), '#aabbcc');
    });

    QUnit.test('value should be null after clear button click if editAlfaChannel = true (T976630)', function(assert) {
        const $colorBox = $('#color-box').dxColorBox({
            value: '#f05b41',
            showClearButton: true,
            editAlphaChannel: true
        });
        const colorBox = $colorBox.dxColorBox('instance');
        const $clearButton = $('#color-box').find(CLEAR_BUTTON_AREA_SELECTOR);

        $clearButton.trigger('dxclick');

        assert.equal(colorBox.option('value'), null);
        assert.equal(colorBox.option('text'), '');
    });

    QUnit.test('value should be null after clear button click if editAlfaChannel = true, applyValueMode = instantly and colorview is rendered (T976630)', function(assert) {
        const $colorBox = $('#color-box').dxColorBox({
            value: '#f05b41',
            showClearButton: true,
            applyValueMode: 'instantly',
            editAlphaChannel: true,
            opened: true
        });
        const colorBox = $colorBox.dxColorBox('instance');
        const $clearButton = $('#color-box').find(CLEAR_BUTTON_AREA_SELECTOR);

        $clearButton.trigger('dxclick');

        assert.equal(colorBox.option('value'), null);
        assert.equal(colorBox.option('text'), '');
    });
});

QUnit.module('valueChanged handler should receive correct event', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            onValueChanged: this.valueChangedHandler,
            onOpened: () => {
                this.$colorViewHexInput = $(COLORVIEW_HEX_INPUT_SELECTOR);
                this.$colorViewApplyButton = $(COLORVIEW_APPLY_BUTTON_SELECTOR);
            }
        };
        this.init = (options) => {
            this.$element = $('#color-box').dxColorBox(options);
            this.instance = this.$element.dxColorBox('instance');
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            this.keyboard = keyboardMock(this.$input);
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

    QUnit.test('on change', function(assert) {
        this.keyboard
            .type('#2510e5')
            .change();

        this.checkEvent(assert, 'change', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on input apply using enter', function(assert) {
        this.keyboard
            .type('#2510e5')
            .press('enter');

        this.checkEvent(assert, 'keydown', this.$input, 'enter');
        this.testProgramChange(assert);
    });

    QUnit.test('on colorView palette value apply using enter', function(assert) {
        this.reinit({ value: '#0707b8' });
        this.instance.open();

        this.keyboard
            .press('up')
            .press('enter');

        this.checkEvent(assert, 'keydown', this.$input, 'enter');
        this.testProgramChange(assert);
    });

    QUnit.test('on colorView any text input value apply using enter', function(assert) {
        this.instance.open();

        keyboardMock(this.$colorViewHexInput)
            .press('up')
            .press('enter');

        this.checkEvent(assert, 'keydown', this.$colorViewHexInput, 'enter');
        this.testProgramChange(assert);
    });

    QUnit.test('on click on colorView apply button', function(assert) {
        this.instance.open();

        this.keyboard.press('up');
        this.$colorViewApplyButton.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', this.$colorViewApplyButton);
        this.testProgramChange(assert);
    });

    QUnit.test('on colorView value change when applyValueMode=instantly', function(assert) {
        // NOTE: if this test fails synchronization with colorView is broken totally

        this.reinit({ applyValueMode: 'instantly' });
        this.instance.open();

        this.keyboard.press('up');

        this.checkEvent(assert, 'keydown', this.$input, 'arrowUp');
        this.testProgramChange(assert);
    });

    ['useButtons', 'instantly'].forEach(applyValueMode => {
        QUnit.test(`on click on clear button when applyValueMode=${applyValueMode}`, function(assert) {
            this.reinit({ showClearButton: true, value: '#613030', applyValueMode });

            const $clearButton = this.$element.find(CLEAR_BUTTON_AREA_SELECTOR);
            $clearButton.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', $clearButton);
            this.testProgramChange(assert);
        });
    });

    QUnit.test('on click on clear button after value selecting when applyValueMode=useButtons', function(assert) {
        this.reinit({ showClearButton: true });

        this.instance.open();
        this.keyboard.press('up');
        this.$colorViewApplyButton.trigger('dxclick');

        const $clearButton = this.$element.find(CLEAR_BUTTON_AREA_SELECTOR);
        $clearButton.trigger('dxclick');

        const event = this.valueChangedHandler.getCall(1).args[0].event;
        assert.strictEqual(event.type, 'dxclick', 'event type is correct');
        assert.strictEqual(event.target, $clearButton.get(0), 'event target is correct');

        this.testProgramChange(assert);
    });

    QUnit.test('on click on clear button after value selecting when applyValueMode=instantly', function(assert) {
        this.reinit({ showClearButton: true, applyValueMode: 'instantly' });

        this.instance.open();
        this.keyboard.press('up');

        const $clearButton = this.$element.find(CLEAR_BUTTON_AREA_SELECTOR);
        $clearButton.trigger('dxclick');

        const event = this.valueChangedHandler.getCall(1).args[0].event;
        assert.strictEqual(event.type, 'dxclick', 'event type is correct');
        assert.strictEqual(event.target, $clearButton.get(0), 'event target is correct');

        this.testProgramChange(assert);
    });
});

QUnit.module('Accessibility', {
    beforeEach: function() {
        fx.off = true;
        this.element = $('#color-box');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('input should have "aria-activedescendant" attribute', function(assert) {
        const $colorBox = showColorBox.call(this);
        const $input = $colorBox.find(`.${COLOR_BOX_INPUT_CLASS}`);
        const $handle = getColorBoxOverlayContent().find(COLOR_VIEW_PALETTE_HANDLE_SELECTOR);

        assert.strictEqual($input.attr('aria-activedescendant'), $handle.attr('id'));
    });

    QUnit.test('input should not have "aria-activedescendant" attribute if colorview have not opened yet', function(assert) {
        const $colorBox = this.element.dxColorBox({});
        const $input = $colorBox.find(`.${COLOR_BOX_INPUT_CLASS}`);
        assert.notOk($input.attr('aria-activedescendant'));
    });
});
