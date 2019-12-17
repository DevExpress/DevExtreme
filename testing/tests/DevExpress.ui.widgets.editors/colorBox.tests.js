import $ from 'jquery';
import { noop } from 'core/utils/common';
import Color from 'color';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import fx from 'animation/fx';

import 'common.css!';
import 'ui/color_box';

QUnit.testStart(function() {
    var markup =
        '<div id="color-box"></div>';

    $('#qunit-fixture').addClass('dx-viewport').html(markup);
});

var COLOR_BOX_CLASS = 'dx-colorbox',
    COLOR_BOX_INPUT_CLASS = COLOR_BOX_CLASS + '-input',
    COLOR_BOX_INPUT_CONTAINER_CLASS = COLOR_BOX_INPUT_CLASS + '-container',
    COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS = COLOR_BOX_CLASS + '-color-result-preview',
    COLOR_BOX_COLOR_IS_NOT_DEFINED = COLOR_BOX_CLASS + '-color-is-not-defined',
    COLOR_BOX_OVERLAY_CLASS = COLOR_BOX_CLASS + '-overlay';

var STATE_FOCUSED_CLASS = 'dx-state-focused',
    TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

var move = function($element, position) {
    var parentOffset = $element.parent().offset();
    pointerMock($element)
        .start()
        .down(parentOffset.left, parentOffset.top)
        .move(position.left, position.top)
        .up();
};

var showColorBox = function(options) {
    var $colorBox = this.element.dxColorBox(options);
    $($colorBox.find('.dx-dropdowneditor-button')).trigger('dxclick');

    return $colorBox;
};

var getColorBoxOverlay = function() {
    return $('.' + COLOR_BOX_OVERLAY_CLASS);
};

var getColorBoxOverlayContent = function() {
    return $('.' + 'dx-overlay-content');
};

QUnit.module('Color Box', {
    beforeEach: function() {
        fx.off = true;
        this.element = $('#color-box');

        this.updateColorInput = function(inputAlias, value) {
            var aliases = [
                    'red',
                    'green',
                    'blue',
                    'hex',
                    'alpha'
                ],
                inputIndex = $.inArray(inputAlias, aliases),

                $input = getColorBoxOverlay().find('label .' + TEXTEDITOR_INPUT_CLASS).eq(inputIndex);

            $input.val(value);
            $($input).trigger('change');
        };

        this.checkColor = function(expectedColor, assert) {
            var colorPicker = this.element.dxColorBox('instance')._colorView,
                currentColor = colorPicker._currentColor;

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
});

QUnit.test('Render with hex value', function(assert) {
    var $colorBox = showColorBox.call(this, { value: '#000000' }),
        $input = $colorBox.find('.' + COLOR_BOX_INPUT_CLASS);

    assert.equal($input.val(), '#000000');
    $colorBox.dxColorBox('instance').option('value', '#ff0000');
    assert.equal($input.val(), '#ff0000');
});

QUnit.test('If value is set as \'null\' color result preview should not have background color - the first case(T198625)', function(assert) {
    var colorBox = this.element.dxColorBox().dxColorBox('instance');

    colorBox.option('value', '#ff0000');
    colorBox.option('value', null);

    assert.ok(!colorBox.$element().find('.dx-colorbox-color-result-preview').attr('style'));
});

QUnit.test('If value is set as \'null\' color result preview should not have background color - the second case(T198625)', function(assert) {

    showColorBox.call(this);

    var $overlay = getColorBoxOverlay(),
        $applyButton = $overlay.find('.dx-colorview-buttons-container .dx-colorview-apply-button'),
        colorBoxInstance = this.element.dxColorBox('instance');

    colorBoxInstance._colorView._currentColor = new Color('#ff0000');
    $($applyButton).trigger('dxclick');

    colorBoxInstance.option('value', null);

    assert.ok(!colorBoxInstance.$element().find('.dx-colorbox-color-result-preview').attr('style'));
});

QUnit.test('If value is not \'null\' color result preview should not have a special css class', function(assert) {
    var $colorBox = this.element.dxColorBox(),
        $colorInputContainer = $colorBox.find('.' + COLOR_BOX_INPUT_CONTAINER_CLASS);

    $colorBox.dxColorBox('instance').option('value', '#ff0000');

    assert.ok(!$colorInputContainer.hasClass(COLOR_BOX_COLOR_IS_NOT_DEFINED));
});

QUnit.test('It should be possible to set empty value using input of dropdown editor', function(assert) {
    var $colorBox = this.element.dxColorBox({
        value: 'red'
    });

    $('.' + COLOR_BOX_INPUT_CLASS).val('').trigger('change');

    assert.equal($colorBox.dxColorBox('instance').option('value'), '');
});

QUnit.test('Render overlay', function(assert) {
    showColorBox.call(this);
    var $overlay = getColorBoxOverlay();
    assert.equal($overlay.length, 1);
});

QUnit.test('Render color picker container', function(assert) {
    showColorBox.call(this);
    var $overlay = getColorBoxOverlay(),
        $colorPickerContainer = $overlay.find('.dx-colorview-container'),
        $alphaChannelScale = $overlay.find('.dx-colorview-alpha-channel-scale'),
        $alphaChannelInput = $overlay.find('.dx-colorview-alpha-channel-input'),
        $alphaChannelLabel = $overlay.find('.dx-colorview-alpha-label');

    assert.equal($colorPickerContainer.length, 1);
    assert.equal($alphaChannelScale.length, 0);
    assert.equal($alphaChannelInput.length, 0);
    assert.equal($alphaChannelLabel.length, 0);
});

QUnit.test('Popup should have height=\'auto\'', function(assert) {
    var popupHeight = showColorBox.call(this).dxColorBox('instance')._popup.option('height');
    assert.equal(popupHeight, 'auto');
});

QUnit.test('Click on apply button', function(assert) {
    var onValueChangedHandler = sinon.spy(noop),
        onApplyButtonClickHandler = sinon.spy(noop);

    showColorBox.call(this, {
        onValueChanged: onValueChangedHandler,
        onApplyButtonClick: onApplyButtonClickHandler
    });

    var $overlayContent = getColorBoxOverlayContent(),
        $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button'),
        colorBoxInstance = this.element.dxColorBox('instance'),
        newColor = '#A600F3'.toLowerCase();

    colorBoxInstance._colorView.option('value', newColor);

    $($applyButton).trigger('dxclick');

    assert.equal(colorBoxInstance.option('value'), newColor);
    assert.equal($('.' + COLOR_BOX_INPUT_CLASS).val(), newColor);
    assert.ok(onValueChangedHandler.calledOnce);
    assert.ok($('.' + COLOR_BOX_OVERLAY_CLASS).is(':hidden'));
    assert.ok(onApplyButtonClickHandler.calledOnce);
});

QUnit.test('Click on cancel button', function(assert) {
    var spy = sinon.spy(noop);

    showColorBox.call(this, {
        value: '#ff0000',
        onCancelButtonClick: spy
    });

    this.updateColorInput('hex', 'f0f0f0');

    var $overlayContent = getColorBoxOverlayContent(),
        $cancelButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-cancel-button');

    $($cancelButton).trigger('dxclick');
    assert.ok($('.' + COLOR_BOX_OVERLAY_CLASS).is(':hidden'));

    this.checkColor({
        r: 255,
        g: 0,
        b: 0,
        hex: '#ff0000'
    }, assert);

    assert.ok(spy.calledOnce);
});

QUnit.test('Cancel event should work right when color was changed', function(assert) {
    showColorBox.call(this, {
        value: '#2C77B8',
        editAlphaChannel: true
    });

    var $overlayContent = getColorBoxOverlayContent();

    var $colorChooserMarker = $overlayContent.find('.dx-colorview-palette-handle'),
        $cancelButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-cancel-button');

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

    var $overlayContent = getColorBoxOverlayContent();

    var $alphaHandle = $overlayContent.find('.dx-colorview-alpha-channel-handle'),
        $cancelButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-cancel-button');

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

QUnit.test('When hue was changed opacity is OK', function(assert) {
    showColorBox.call(this, {
        value: 'rgba(255, 0, 0, 0.3)',
        editAlphaChannel: true
    });

    var $overlay = getColorBoxOverlay(),
        $hueHandle = $overlay.find('.dx-colorview-hue-scale-handle');

    move($hueHandle, {
        left: 0,
        top: 288
    });

    $('.dx-colorview-apply-button').trigger('dxclick');

    assert.equal($('.' + COLOR_BOX_INPUT_CLASS).val(), 'rgba(255, 26, 0, 0.3)');
});

QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
    var spy = sinon.spy(noop),
        colorBox = showColorBox.call(this, {
            onValueChanged: spy
        }).dxColorBox('instance');

    colorBox.option('value', '#00ff00');

    assert.ok(spy.calledOnce);
});

QUnit.test('Changing the input value of closed colorbox must change color preview', function(assert) {
    this.element.dxColorBox({ value: '#ff0000' });
    var $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

    $('.' + COLOR_BOX_INPUT_CLASS).val('#0000ff').trigger('change');

    assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#0000ff');
});

QUnit.test('Changing the input value of opened colorbox must change color preview and dropdown elements', function(assert) {
    showColorBox.call(this, { value: '#FF0000' });
    var $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

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
    var colorPicker = showColorBox.call(this).dxColorBox('instance')._colorView;

    this.updateColorInput('hex', 'd0ff00');
    colorPicker.applyColor();

    var baseColor = $('.dx-colorview-color-preview-color-current').css('backgroundColor');
    var newColor = $('.dx-colorview-color-preview-color-new').css('backgroundColor');

    assert.equal(new Color(newColor).toHex(), '#d0ff00', 'new color');
    assert.equal(new Color(baseColor).toHex(), '#000000', 'default color');
});

QUnit.test('Update colors preview after value change', function(assert) {
    var colorBox = showColorBox.call(this, { value: '#fafafa' }).dxColorBox('instance');

    colorBox.option('value', '#f0f0f0');
    this.updateColorInput('hex', 'd0ff00');
    colorBox._colorView.applyColor();

    var baseColor = $('.dx-colorview-color-preview-color-current').css('backgroundColor');
    var newColor = $('.dx-colorview-color-preview-color-new').css('backgroundColor');

    assert.equal(new Color(newColor).toHex(), '#d0ff00', 'new color');
    assert.equal(new Color(baseColor).toHex(), '#f0f0f0', 'current ColorBox value still the same');
});

QUnit.test('Validate value of colorbox input', function(assert) {
    this.element.dxColorBox({ value: '#ff0000' });
    var $colorBoxInput = $('.' + COLOR_BOX_INPUT_CLASS),
        $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

    $($colorBoxInput.val('unknown value')).trigger('change');

    assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#ff0000');
    assert.equal($colorBoxInput.val(), '#ff0000');
});

QUnit.test('Validate value of colorbox hex-input', function(assert) {
    this.element.dxColorBox({ value: '#ff0000' });
    var $colorBoxInput = $('.' + COLOR_BOX_INPUT_CLASS),
        $colorBoxResultsPreview = $('.' + COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS);

    $($colorBoxInput.val('#zzzzzz')).trigger('change');

    assert.equal(new Color($colorBoxResultsPreview.css('backgroundColor')).toHex().toLowerCase(), '#ff0000');
    assert.equal($colorBoxInput.val(), '#ff0000');
});

QUnit.test('In \'instantly\' mode popup should not disappear if value was changed', function(assert) {
    showColorBox.call(this, {
        applyValueMode: 'instantly'
    });

    var $overlay = getColorBoxOverlay(),
        $colorChooserMarker = $overlay.find('.dx-colorview-palette-handle');

    move($colorChooserMarker, {
        left: 220,
        top: 80
    });

    assert.equal($overlay.css('display'), 'block');
});

QUnit.test('\'instantly\' mode should work for alpha channel', function(assert) {
    var colorBox = showColorBox.call(this, {
        value: 'rgba(100, 100, 100, .2)',
        editAlphaChannel: true,
        applyValueMode: 'instantly'
    }).dxColorBox('instance');

    this.updateColorInput('alpha', 0.75);

    assert.equal(colorBox.option('value'), 'rgba(100, 100, 100, 0.75)');
});

QUnit.test('In \'instantly\' mode value should be updated if some input was updated', function(assert) {
    var colorBox = showColorBox.call(this, {
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
    var colorBox = showColorBox.call(this, {
        value: '#ff0000',
        editAlphaChannel: true,
        applyValueMode: 'instantly'
    }).dxColorBox('instance');

    colorBox.option('value', 'rgba(100, 0, 0, 75)');
    this.updateColorInput('red', 100);
    assert.equal(colorBox.option('value'), 'rgba(100, 0, 0, 1)');
});


QUnit.test('Option changes', function(assert) {
    var colorBox = showColorBox.call(this).dxColorBox('instance'),
        onCancelButtonClick = noop,
        onApplyButtonClick = noop;

    $.each([
        { name: 'value', value: '#ff0000' },
        { name: 'editAlphaChannel', value: true },
        { name: 'onCancelButtonClick', value: onCancelButtonClick },
        { name: 'onApplyButtonClick', value: onApplyButtonClick },
        { name: 'rtlEnabled', value: true },
        { name: 'keyStep', value: 10 }
    ], function(_, option) {
        colorBox.option(option.name, option.value);
        assert.equal(colorBox._colorView.option(option.name), option.value, '\'' + option.name + '\' option is updated');
    });
});

QUnit.test('\'applyButtonText\' and \'cancelButtonText\' options change should update UI', function(assert) {
    var colorBox = showColorBox.call(this).dxColorBox('instance'),
        applyText = 'Test Done',
        cancelText = 'Test Cancel';

    colorBox.option('applyButtonText', applyText);
    colorBox.close();
    colorBox.open();

    var $applyButton = getColorBoxOverlayContent().find('.dx-colorview-buttons-container .dx-colorview-apply-button');
    assert.equal($applyButton.text(), applyText, 'apply button text is changed');

    colorBox.option('cancelButtonText', cancelText);
    colorBox.close();
    colorBox.open();

    var $cancelButton = getColorBoxOverlayContent().find('.dx-colorview-buttons-container .dx-colorview-cancel-button');
    assert.equal($cancelButton.text(), cancelText, 'cancel button text is changed');
});

QUnit.test('Alpha channel input should be updated if value is changed', function(assert) {
    var colorBox = showColorBox.call(this, {
        editAlphaChannel: true,
        value: 'rgba(44, 119, 184, 1)'
    }).dxColorBox('instance');

    $(colorBox._input()).val('rgba(44, 119, 184, 0.5)').trigger('change');
    assert.equal(colorBox._colorView._alphaChannelInput.option('value'), 0.5);
});

QUnit.test('When value was updated twice, color editors should have right values', function(assert) {
    var colorBox = this.element.dxColorBox({ value: 'rgba(44, 119, 184, 1)', editAlphaChannel: true }).dxColorBox('instance');
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
    var $colorBox = this.element.dxColorBox({}),
        colorBox = $colorBox.dxColorBox('instance');

    assert.equal($colorBox.find('.dx-dropdowneditor-button').length, 1, 'only one button is rendered');

    colorBox.open();
    colorBox.close();

    colorBox.option('value', 'rgba(0, 0, 0, 1)');

    assert.equal($colorBox.find('.dx-dropdowneditor-button').length, 1, 'one button is still rendered');
});

QUnit.test('Color changed in preview if value is valid', function(assert) {
    var $colorBox = this.element.dxColorBox({
            value: '#f00'
        }),
        colorBox = $colorBox.dxColorBox('instance');

    var $colorPreview = $colorBox.find('.dx-colorbox-color-result-preview');
    var $input = $colorBox.find('.' + TEXTEDITOR_INPUT_CLASS);
    var keyboard = keyboardMock($input);

    $input.val('');
    keyboard.type('#0');
    var previewColor = new Color($colorPreview.css('backgroundColor'));
    var currentColor = new Color(colorBox.option('value'));

    assert.equal(previewColor.toHex(), currentColor.toHex(), 'show current value when color is invalid');

    keyboard
        .type('0f')
        .press('enter');

    previewColor = new Color($colorPreview.css('backgroundColor'));
    currentColor = new Color($input.val());

    assert.equal(previewColor.toHex(), currentColor.toHex(), 'show color if input value is valid');
});

QUnit.test('ColorBox set the right stylingMode option to ColorView (default)', function(assert) {
    var $colorBox = $('#color-box').dxColorBox({ value: 'red' }),
        colorBox = $colorBox.dxColorBox('instance');

    colorBox.open();
    assert.equal(colorBox._colorView.option('stylingMode'), 'outlined');
});

QUnit.test('ColorBox set the right stylingMode option to ColorView (custom)', function(assert) {
    var $colorBox = $('#color-box').dxColorBox({ value: 'red', stylingMode: 'underlined' }),
        colorBox = $colorBox.dxColorBox('instance');

    colorBox.open();
    assert.equal(colorBox._colorView.option('stylingMode'), 'underlined');
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
});

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

    var instance = this.instance,
        $input = this.$element.find('.dx-texteditor-input');
    instance.option({
        opened: true,
        value: 'rgba(153, 72, 70, 1)',
        applyValueMode: 'useButtons',
        editAlphaChannel: true
    });

    var $popup = $(instance.content());

    $popup.find('.dx-texteditor-input').each(function(_, itemInput) {
        var $itemInput = $(itemInput);

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
    var $handler, handlerOffset;

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

QUnit.testInActiveWindow('focus policy', function(assert) {
    this.instance.option('opened', true);
    this.keyboard.keyDown('tab');
    var $inputR = $(this.instance._colorView._rgbInputs[0].$element());
    assert.ok($inputR.hasClass(STATE_FOCUSED_CLASS), 'tab set focus to first input in overlay');

    $(this.instance._colorView.$element()).triggerHandler('focus');
    assert.ok(this.instance.$element().hasClass(STATE_FOCUSED_CLASS), 'colorView on focus reset focus to element');
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


QUnit.module('Regressions', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('T171573', function(assert) {
    var $colorBox = $('#color-box').dxColorBox({ value: 'red' }),
        colorBox = $colorBox.dxColorBox('instance');

    assert.equal(colorBox.option('value'), 'red');

    colorBox.open();
    assert.equal(colorBox._colorView.option('value'), 'red');
});

QUnit.test('T196473', function(assert) {
    var colorBox = $('#color-box').dxColorBox({
        value: '#ff0000'
    }).dxColorBox('instance');

    colorBox.open();

    var colorView = colorBox._colorView;
    var $overlayContent = getColorBoxOverlayContent(),
        $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');

    $($applyButton).trigger('dxclick');

    assert.ok(!colorView.$element().is(':visible'));
});

QUnit.test('Value should not be changed by \'down\' key when colorbox was opened and closed', function(assert) {
    var colorBox = $('#color-box').dxColorBox({
        value: '#ff0000'
    }).dxColorBox('instance');

    var $input = $(colorBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    colorBox.open();

    var $overlayContent = getColorBoxOverlayContent(),
        $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');

    $($applyButton).trigger('dxclick');

    keyboard.keyDown('down');
    keyboard.keyDown('down');
    keyboard.keyDown('enter');

    assert.equal(colorBox.option('value'), '#ff0000');
});

QUnit.test('Value should not be changed by \'up\' key when colorbox was opened and closed', function(assert) {
    var colorBox = $('#color-box').dxColorBox({
        value: '#326b8a'
    }).dxColorBox('instance');

    var $input = $(colorBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    colorBox.open();

    var $overlayContent = getColorBoxOverlayContent(),
        $applyButton = $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button');

    $($applyButton).trigger('dxclick');

    keyboard.keyDown('up');
    keyboard.keyDown('up');
    keyboard.keyDown('enter');

    assert.equal(colorBox.option('value'), '#326b8a');
});

QUnit.test('value should be reseted after popup closing when \'applyValueMode\' is \'useButtons\' (T806577)', (assert) => {
    const colorBox = $('#color-box').dxColorBox({
            value: '#aabbcc',
            applyValueMode: 'useButtons',
            opened: true
        }).dxColorBox('instance'),
        $input = $(colorBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS)),
        colorView = $('.dx-colorview').dxColorView('instance'),
        keyboard = keyboardMock($input);

    colorView.option('value', '#ffffff');
    colorBox.close();

    keyboard.press('enter');

    assert.equal(colorBox.option('value'), '#aabbcc');
});
