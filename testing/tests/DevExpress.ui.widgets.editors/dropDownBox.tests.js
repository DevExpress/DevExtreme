import $ from 'jquery';
import renderer from 'core/renderer';
import keyboardMock from '../../helpers/keyboardMock.js';
import fx from 'animation/fx';
import DropDownBox from 'ui/drop_down_box';
import typeUtils, { isRenderer } from 'core/utils/type';
import config from 'core/config';
import browser from 'core/utils/browser';
import devices from 'core/devices';

import 'common.css!';
import 'generic_light.css!';
import 'ui/validator';

const realDevice = devices.real();

QUnit.testStart(() => {
    const markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="container">\
                <div id="dropDownBox"></div>\
                <div id="dropDownBoxAnonymous"><div id="inner">Test</div></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const DX_TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TAB_KEY_CODE = 'Tab';
const DX_STATE_FOCUSED_CLASS = 'dx-state-focused';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.$element = $('#dropDownBox');
        this.simpleItems = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

const isIE11 = (browser.msie && parseInt(browser.version) === 11);

QUnit.module('common', moduleConfig, () => {
    QUnit.test('the widget should work without the dataSource', function(assert) {
        this.$element.dxDropDownBox({ value: 1 });
        const $input = this.$element.find('.dx-texteditor-input');
        const instance = this.$element.dxDropDownBox('instance');

        assert.equal(instance.option('value'), 1, 'value is correct');
        assert.equal(instance.option('text'), 1, 'text is correct');
        assert.equal($input.val(), 1, 'input value is correct');

        instance.option('value', 'Test');
        assert.equal(instance.option('value'), 'Test', 'value is correct');
        assert.equal(instance.option('text'), 'Test', 'text is correct');
        assert.equal($input.val(), 'Test', 'input value is correct');
    });

    QUnit.test('the widget should work when dataSource is set to null', function(assert) {
        this.$element.dxDropDownBox({ value: 1, dataSource: [1, 2, 3] });

        const instance = this.$element.dxDropDownBox('instance');

        instance.option('dataSource', null);

        assert.ok(true, 'widget works correctly');
    });

    QUnit.test('array value should be supported', function(assert) {
        this.$element.dxDropDownBox({
            items: this.simpleItems,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [2]
        });

        const $input = this.$element.find('.dx-texteditor-input');
        assert.equal($input.val(), 'Item 2', 'array value works');
    });

    QUnit.test('it should be possible to restore value after reset', function(assert) {
        const instance = new DropDownBox(this.$element, {
            value: 2
        });

        const $input = this.$element.find('.dx-texteditor-input');

        instance.reset();
        instance.option('value', 'Test');

        assert.equal($input.val(), 'Test', 'value has been applied');
    });

    QUnit.test('array value changing', function(assert) {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [2]
        });

        const $input = this.$element.find('.dx-texteditor-input');

        instance.option('value', 1);
        assert.equal($input.val(), 'Item 1', 'value has been changed correctly from array to primitive');

        instance.option('value', [2]);
        assert.equal($input.val(), 'Item 2', 'value has been changed correctly from primitive to array');
    });

    QUnit.test('multiple selection should work', function(assert) {
        this.$element.dxDropDownBox({
            items: this.simpleItems,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [1, 3]
        });

        const $input = this.$element.find('.dx-texteditor-input');
        assert.equal($input.val(), 'Item 1, Item 3', 'multiple selection works');
    });

    QUnit.test('multiple selection value changing', function(assert) {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            valueExpr: 'id',
            displayExpr: 'name',
            value: 2
        });

        const $input = this.$element.find('.dx-texteditor-input');

        instance.option('value', [1, 3]);
        assert.equal($input.val(), 'Item 1, Item 3', 'correct values are selected');
    });

    QUnit.test('value clearing', function(assert) {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [1, 3]
        });

        const $input = this.$element.find('.dx-texteditor-input');

        instance.option('value', null);
        assert.equal($input.val(), '', 'input was cleared');
    });

    QUnit.test('clear button should save valueChangeEvent', function(assert) {
        const valueChangedHandler = sinon.spy();

        new DropDownBox(this.$element, {
            items: this.simpleItems,
            showClearButton: true,
            onValueChanged: valueChangedHandler,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [1]
        });

        const $clearButton = this.$element.find('.dx-clear-button-area');
        $clearButton.trigger('dxclick');

        assert.equal(valueChangedHandler.callCount, 1, 'valueChangedHandler has been called');
        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, 'dxclick', 'event is correct');
    });

    QUnit.test('content template should work', function(assert) {
        assert.expect(4);

        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            opened: true,
            contentTemplate(e, contentElement) {
                assert.strictEqual(e.component.NAME, 'dxDropDownBox', 'component is correct');
                assert.equal(e.value, 1, 'value is correct');
                assert.equal(isRenderer(contentElement), !!config().useJQuery, 'contentElement is correct');

                return 'Test content';
            },
            valueExpr: 'id',
            displayExpr: 'name',
            value: 1
        });

        assert.equal($(instance.content()).text(), 'Test content', 'content template has been rendered');
    });

    QUnit.test('anonymous content template should work', function(assert) {
        const $inner = $('#dropDownBoxAnonymous #inner');
        const instance = new DropDownBox($('#dropDownBoxAnonymous'), { opened: true });
        const $content = $(instance.content());

        assert.equal($content.text(), 'Test', 'Anonymous template works');
        assert.equal($content.find('#inner')[0], $inner[0], 'Markup is equal by the link');
    });

    QUnit.test('anonymous template should not be passed to the custom button', function(assert) {
        const instance = new DropDownBox($('#dropDownBoxAnonymous'), {
            buttons: [
                { name: 'test', location: 'after', options: { text: 'Button text' } }
            ],
            opened: true
        });

        const $content = $(instance.content());

        assert.equal($content.text(), 'Test', 'Anonymous template works');
        assert.equal($('#dropDownBoxAnonymous').find('.dx-button').text(), 'Button text', 'Button text is correct');
    });

    QUnit.test('dropDownBox should work with the slow dataSource', function(assert) {
        const items = [{ key: 1, text: 'Item 1' }, { key: 2, text: 'Item 2' }];

        const instance = new DropDownBox(this.$element, {
            dataSource: {
                load() {
                    $.Deferred().resolve(items).promise();
                },
                byKey() {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve([{ key: 2, text: 'Item 2' }]);
                    }, 50);

                    return d.promise();
                }
            },
            valueExpr: 'key',
            displayExpr: 'text',
            value: 2
        });

        const $input = this.$element.find('.dx-texteditor-input');

        this.clock.tick(50);

        assert.equal($input.val(), 'Item 2', 'Input value was filled');
        assert.equal(instance.option('value'), 2, 'value was applied');
    });

    QUnit.test('dropDownBox should update display text after dataSource changed', function(assert) {
        const items = [{ id: 1, name: 'item 1' }, { id: 2, name: 'item 2' }, { id: 3, name: 'item 3' }];

        const instance = new DropDownBox(this.$element, {
            dataSource: [],
            displayExpr: 'name',
            valueExpr: 'id',
            value: [2, 3]
        });

        const $input = this.$element.find('.dx-texteditor-input');

        instance.option('dataSource', items);

        assert.equal($input.val(), 'item 2, item 3', 'input text has been updated');
    });

    QUnit.test('dropDownBox should update display text after displayExpr changed', function(assert) {
        const items = [{ id: 1, name: 'item 1', text: 'text 1' }];

        const instance = new DropDownBox(this.$element, {
            items,
            displayExpr: 'name',
            valueExpr: 'id',
            value: 1
        });

        const $input = this.$element.find('.dx-texteditor-input');

        instance.option('displayExpr', 'text');
        assert.equal($input.val(), 'text 1', 'input text has been updated');
    });

    QUnit.test('dropDownBox should update display text when displayExpr was changed on initialization', function(assert) {
        this.$element.dxDropDownBox({
            items: [{ id: 1, name: 'item 1', text: 'text 1' }],
            onInitialized(e) {
                e.component.option('displayExpr', 'name');
            },
            valueExpr: 'id',
            value: 1
        });

        const $input = this.$element.find('.dx-texteditor-input');

        assert.equal($input.val(), 'item 1', 'input text is correct');
    });

    QUnit.test('text option should follow the displayValue option', function(assert) {
        const instance = new DropDownBox(this.$element, {});
        instance.option('displayValue', 'test');

        assert.equal(instance.option('text'), 'test', 'text option has been changed');
    });

    QUnit.test('displayValue option should be correct after value option changed, acceptCustomValue = true', function(assert) {
        const instance = new DropDownBox(this.$element,
            {
                acceptCustomValue: true,
                dataSource: ['1', '2', '3'],
                value: '1'
            }
        );
        instance.option('value', '12');

        assert.equal(instance.option('displayValue'), '12', 'displayValue option has been changed');
    });

    QUnit.test('displayValue option should be correct after value option changed, acceptCustomValue = true, initial value = null', function(assert) {
        const instance = new DropDownBox(this.$element,
            {
                acceptCustomValue: true,
                dataSource: ['1', '2', '3'],
                value: null
            }
        );
        instance.option('value', '12');

        assert.equal(instance.option('displayValue'), '12', 'displayValue option has been changed');
    });

    QUnit.test('displayValueFormatter should be called once (T883129)', function(assert) {
        const spy = sinon.spy();
        new DropDownBox(this.$element, {
            value: 1,
            displayValueFormatter: spy
        });

        assert.strictEqual(spy.callCount, 1, 'value has been applied');
    });
});

QUnit.module('popup options', moduleConfig, () => {
    QUnit.test('popup should be positioned correctly if rtlEnabled is true', function(assert) {
        const instance = new DropDownBox(this.$element, {
            opened: true,
            width: 100,
            dropDownOptions: {
                width: 200,
                'position.collision': 'none'
            },
        });

        const dropDownButtonElementRect = this.$element.get(0).getBoundingClientRect();

        let overlayContentElementRect = $(instance.content()).parent().get(0).getBoundingClientRect();
        assert.strictEqual(overlayContentElementRect.left, dropDownButtonElementRect.left, 'popup position is correct, rtlEnabled = false');

        instance.option('rtlEnabled', true);
        overlayContentElementRect = $(instance.content()).parent().get(0).getBoundingClientRect();
        assert.strictEqual(overlayContentElementRect.right, dropDownButtonElementRect.right, 'popup position is correct, rtlEnabled = true');
    });

    QUnit.test('two way binding should work with dropDownOptions', function(assert) {
        const instance = new DropDownBox(this.$element, { opened: true });
        const popup = instance._popup;

        assert.ok(instance.option('dropDownOptions.visible'), 'dropDown is visible');

        popup.option('resizeEnabled', true);
        assert.strictEqual(instance.option('dropDownOptions.resizeEnabled'), true, 'popup option change leads to dropDownOptions change');
    });

    QUnit.test('popup should not be draggable by default', function(assert) {
        this.$element.dxDropDownBox({
            opened: true
        });

        const popup = this.$element.find('.dx-popup').dxPopup('instance');

        assert.strictEqual(popup.option('dragEnabled'), false, 'dragging is disabled');
    });

    QUnit.test('popup should be flipped when container size is smaller than content size', function(assert) {
        const $dropDownBox = $('<div>').appendTo('body');
        try {
            $dropDownBox.css({ position: 'fixed', bottom: 0 });
            $dropDownBox.dxDropDownBox({
                opened: true,
                contentTemplate() {
                    return $('<div>').css({ height: '300px', border: '1px solid #000' });
                }
            });

            const $popupContent = $('.' + OVERLAY_CONTENT_CLASS);

            assert.ok($popupContent.hasClass('dx-dropdowneditor-overlay-flipped'), 'popup was flipped');
        } finally {
            $dropDownBox.remove();
        }
    });

    QUnit.test('maxHeight should be 90% of maximum of top or bottom offsets including page scroll', function(assert) {
        this.$element.dxDropDownBox({
            items: [1, 2, 3],
            value: 2
        });

        const scrollTopValue = 100;
        const windowHeightValue = 700;
        const editorHeight = this.$element.outerHeight();

        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(scrollTopValue);
        const windowHeight = sinon.stub(renderer.fn, 'innerHeight').returns(windowHeightValue);
        const offset = sinon.stub(renderer.fn, 'offset').returns({ left: 0, top: 200 });
        const instance = this.$element.dxDropDownBox('instance');

        try {
            instance.open();

            const popup = $('.dx-popup').dxPopup('instance');
            const maxHeight = popup.option('maxHeight');

            assert.roughEqual(Math.floor(maxHeight()), (windowHeightValue - scrollTopValue - editorHeight) * 0.9, 3, 'maxHeight is correct');
        } finally {
            scrollTop.restore();
            windowHeight.restore();
            offset.restore();
        }
    });

    QUnit.test('maxHeight should be 90% of bottom offset if popup has been rendered at the bottom already (T874949)', function(assert) {
        this.$element.dxDropDownBox({
            width: 300,
            contentTemplate: () => {
                const content = $('<div id=\'dd-content\'></div>');

                setTimeout(() => {
                    $('#dd-content').height(300);
                });

                return content;
            }
        });

        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(0);
        const bottomPosition = 200;
        const windowHeight = $(window).height();
        const topValue = windowHeight - bottomPosition;
        const offset = sinon.stub(renderer.fn, 'offset').returns({ left: 0, top: topValue });
        const instance = this.$element.dxDropDownBox('instance');

        try {
            instance.open();

            this.clock.tick();
            const popup = $('.dx-popup').dxPopup('instance');
            const maxHeight = popup.option('maxHeight');

            assert.roughEqual(Math.floor(maxHeight()), (200 - this.$element.height()) * 0.9, 3, 'maxHeight is correct');
        } finally {
            scrollTop.restore();
            offset.restore();
        }
    });

    QUnit.test('maxHeight should be distance between the popup top bound and the element top bound if the popup has been rendered at the top already (T874949, T942217)', function(assert) {
        this.$element.dxDropDownBox({
            width: 300,
            contentTemplate: (e) => $('<div id=\'dd-content\'></div>')
        });

        const elementHeight = this.$element.height();
        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(0);
        const windowHeight = $(window).height();
        this.$element.css('margin-top', windowHeight - elementHeight - 1);
        const instance = this.$element.dxDropDownBox('instance');

        try {
            instance.open();
            const startPopupHeight = $(instance.content()).parent('.dx-overlay-content').outerHeight();
            $('#dd-content').height(300);

            const popup = this.$element.find('.dx-popup').dxPopup('instance');
            const maxHeight = popup.option('maxHeight');
            assert.roughEqual(maxHeight(), startPopupHeight, 1.01, 'maxHeight is correct');
        } finally {
            scrollTop.restore();
        }
    });

    QUnit.test('maxHeight should be distance between the popup top bound and the element top bound if the popup has been rendered at the top already and the window was scrolled (T874949, T942217)', function(assert) {
        const scrollTopValue = 50;
        this.$element.dxDropDownBox({
            width: 300,
            contentTemplate: (e) => $('<div id=\'dd-content\'></div>')
        });

        const elementHeight = this.$element.height();
        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(scrollTopValue);
        const windowHeight = $(window).height();
        this.$element.css('margin-top', windowHeight - elementHeight - 1 - scrollTopValue);
        const instance = this.$element.dxDropDownBox('instance');

        try {
            instance.open();
            const startPopupHeight = $(instance.content()).parent('.dx-overlay-content').height();
            $('#dd-content').height(300);

            const popup = this.$element.find('.dx-popup').dxPopup('instance');
            const maxHeight = popup.option('maxHeight');
            assert.roughEqual(maxHeight(), startPopupHeight + scrollTopValue, 1.01, 'maxHeight is correct');
        } finally {
            scrollTop.restore();
        }
    });

    QUnit.test('maxHeight should be recalculated if popup has been reopened after content change (T874949, T942217)', function(assert) {
        const contentHeight = 90;
        const windowHeight = $(window).height();
        const marginTop = Math.max(windowHeight - 50, 200);
        this.$element.dxDropDownBox({
            width: 300,
            contentTemplate: (e) => $('<div id=\'dd-content\'></div>')
        });

        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(0);

        this.$element.css('margin-top', marginTop);
        const instance = this.$element.dxDropDownBox('instance');

        try {
            instance.open();
            $('#dd-content').height(contentHeight);
            instance.close();
            instance.open();
            this.clock.tick();

            const popup = this.$element.find('.dx-popup').dxPopup('instance');
            const maxHeight = popup.option('maxHeight');
            const $popupContent = $(popup.content());
            const overlayContentHeight = $popupContent.outerHeight();
            const overlayOffset = $popupContent.offset().top;
            const elementOffset = this.$element.offset().top;
            assert.ok(overlayContentHeight >= contentHeight, 'height is recalculated');
            assert.roughEqual(maxHeight(), elementOffset - overlayOffset, 1.01, 'maxHeight is correct');
        } finally {
            scrollTop.restore();
        }
    });

    QUnit.test('Dropdownbox popup should change height according to the content', function(assert) {
        if(isIE11) {
            assert.expect(0);
            return;
        }

        const $content = $('<div>').attr('id', 'content');

        const instance = new DropDownBox($('#dropDownBox'), {
            opened: true,
            contentTemplate: () => $content
        });

        const $popupContent = $(instance.content()).parent('.' + OVERLAY_CONTENT_CLASS);
        const popupHeight = $popupContent.height();

        $('<div>').height(50).appendTo($content);
        assert.strictEqual($popupContent.height(), popupHeight + 50, 'popup height has been changed');
    });

    QUnit.test('Dropdownbox popup should have function as closeOnTargetScroll option value (T845484)', function(assert) {
        const $content = $('<div>').attr('id', 'content');

        const instance = new DropDownBox($('#dropDownBox'), {
            opened: true,
            contentTemplate: () => $content
        });

        assert.ok(typeUtils.isFunction(instance.option('dropDownOptions.closeOnTargetScroll')));
    });

    [true, false].forEach((isMac) => {
        QUnit.test(`Dropdownbox should ${isMac ? 'not' : ''} close the popup after window scroll for ${isMac ? '' : 'non'} Mac desktop devices (T845484)`, function(assert) {
            if(realDevice.deviceType !== 'desktop') {
                assert.expect(0);
                return;
            }
            const originalRealDeviceIsMac = DropDownBox.prototype._realDevice.mac;
            DropDownBox.prototype._realDevice.mac = isMac;

            try {
                const $content = $('<input type="text" />');
                const instance = new DropDownBox($('#dropDownBox'), {
                    contentTemplate: () => $content
                });

                instance.open();
                $content.focus();
                this.clock.tick();
                $(window).trigger('scroll');

                assert.strictEqual(instance.option('opened'), isMac);
            } finally {
                DropDownBox.prototype._realDevice.mac = originalRealDeviceIsMac;
            }
        });
    });

    QUnit.test('popup should be positioned with the correct popupPosition offset', function(assert) {
        const vOffset = 2;
        const instance = new DropDownBox(this.$element, {
            opened: true,
            width: 100,
            popupPosition: { offset: { v: vOffset } }
        });

        const { bottom: elementBottom } = this.$element.get(0).getBoundingClientRect();
        const { top: popupTop } = $(instance.content()).parent().get(0).getBoundingClientRect();

        const actualOffset = Math.round(popupTop) - Math.round(elementBottom);
        assert.strictEqual(actualOffset, vOffset, 'popup offset is correct');
    });
});

QUnit.module('keyboard navigation', moduleConfig, () => {
    QUnit.testInActiveWindow('first focusable element inside of content should get focused after tab pressing', function(assert) {
        const $input1 = $('<input>', { id: 'input1', type: 'text' });
        const $input2 = $('<input>', { id: 'input2', type: 'text' });

        const instance = new DropDownBox(this.$element, {
            opened: true,
            focusStateEnabled: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const $input = this.$element.find('.' + DX_TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.press('tab');

        assert.equal($(instance.content()).parent('.' + OVERLAY_CONTENT_CLASS).attr('tabindex'), -1, 'popup content should not be tabbable');
        assert.ok(instance.option('opened'), 'popup was not closed after tab key pressed');
        assert.ok($input1.is(':focus'), 'first focusable content element got focused');
    });

    QUnit.testInActiveWindow('last focusable element inside of content should get focused after shift+tab pressing', function(assert) {
        const $input1 = $('<input>', { id: 'input1', type: 'text' });
        const $input2 = $('<input>', { id: 'input2', type: 'text' });

        const instance = new DropDownBox(this.$element, {
            opened: true,
            focusStateEnabled: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const $input = this.$element.find('.' + DX_TEXTEDITOR_INPUT_CLASS);
        const event = $.Event('keydown', { key: TAB_KEY_CODE, shiftKey: true });

        $input.focus().trigger(event);

        assert.ok(instance.option('opened'), 'popup was not closed after shift+tab key pressed');
        assert.ok($input2.is(':focus'), 'first focusable content element got focused');
    });

    QUnit.testInActiveWindow('widget should be closed after tab pressing on the last content element', function(assert) {
        const $input1 = $('<input>', { id: 'input1', type: 'text' });
        const $input2 = $('<input>', { id: 'input2', type: 'text' });

        const instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            opened: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const keyboard = keyboardMock($input2);

        keyboard.press('tab');
        this.clock.tick();

        assert.notOk(instance.option('opened'), 'popup was closed');
    });

    QUnit.testInActiveWindow('input should get focused when shift+tab pressed on first content element', function(assert) {
        const $input1 = $('<input>', { id: 'input1', type: 'text' });
        const $input2 = $('<input>', { id: 'input2', type: 'text' });

        const instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            opened: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const event = $.Event('keydown', { key: TAB_KEY_CODE, shiftKey: true });

        $input1.focus().trigger(event);

        assert.notOk(instance.option('opened'), 'popup was closed');
        assert.ok(this.$element.hasClass(DX_STATE_FOCUSED_CLASS), 'input is focused');
        assert.ok(event.isDefaultPrevented(), 'prevent default for focusing it\'s own input but not an input of the previous editor on the page');
    });

    QUnit.testInActiveWindow('inner input should be focused after popup opening', function(assert) {
        const inputFocusedHandler = sinon.stub();
        const $input = $('<input>', { id: 'input1', type: 'text' }).on('focusin', inputFocusedHandler);

        const instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            contentTemplate(component, content) {
                $(content).append($input);
            }
        });

        instance.open();

        assert.ok(inputFocusedHandler.callCount, 1, 'input get focused');
    });

});

QUnit.module('validation', moduleConfig, () => {
    QUnit.test('validation message should be visible if validation is failed even when popup is opened (T923454)', function(assert) {
        this.$element.dxDropDownBox({
            value: [1],
            showClearButton: true,
        }).dxValidator({
            validationRules: [ { type: 'required' } ]
        });
        const instance = this.$element.dxDropDownBox('instance');

        const $clearButton = this.$element.find('.dx-clear-button-area');
        $clearButton.trigger('dxclick');
        assert.strictEqual($('.dx-overlay-wrapper.dx-invalid-message').css('visibility'), 'visible', 'validation message is shown');

        instance.open();
        assert.strictEqual($('.dx-overlay-wrapper.dx-invalid-message').css('visibility'), 'visible', 'validation message is shown after popup opening');
    });
});
