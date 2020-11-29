import $ from 'jquery';
import config from 'core/config';
import devices from 'core/devices';
import eventsEngine from 'events/core/events_engine';
import fx from 'animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import support from 'core/utils/support';
import DropDownEditor from 'ui/drop_down_editor/ui.drop_down_editor';
import Overlay from 'ui/overlay';
import { isRenderer } from 'core/utils/type';
import caretWorkaround from './textEditorParts/caretWorkaround.js';
import { logger } from 'core/utils/console';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        `<div id="dropDownEditorLazy"></div>
         <div id="dropDownEditorSecond"></div>`;

    $('#qunit-fixture').html(markup);
});

const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
const DROP_DOWN_EDITOR_OVERLAY = 'dx-dropdowneditor-overlay';
const DROP_DOWN_EDITOR_ACTIVE = 'dx-dropdowneditor-active';
const TEXT_EDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXT_EDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = 'dx-dropdowneditor-field-template-wrapper';
const POPUP_CONTENT = 'dx-popup-content';
const TAB_KEY_CODE = 'Tab';
const ESC_KEY_CODE = 'Escape';
const POPUP_CLASS = 'dx-popup';
const POPUP_CONTENT_CLASS = 'dx-popup-content';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';

const isIOs = devices.current().platform === 'ios';

const beforeEach = function() {
    fx.off = true;
    this.rootElement = $('<div id=\'dropDownEditor\'></div>');
    this.rootElement.appendTo($('#qunit-fixture'));
    this.$dropDownEditor = $('#dropDownEditor').dxDropDownEditor();
    this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor('instance');
    this.clock = sinon.useFakeTimers();
    this.originalTouchSupport = support.touch;
};

const afterEach = function() {
    this.rootElement.remove();
    this.dropDownEditor = null;
    this.clock.restore();
    support.touch = this.originalTouchSupport;
    fx.off = false;
};

const reinitFixture = function(...args) {
    // TODO: get rid of  beforeEach and afterEach usage
    afterEach.apply(this, args);
    beforeEach.apply(this, args);
};

const testEnvironment = {
    beforeEach,
    reinitFixture,
    afterEach
};

QUnit.module('dxDropDownEditor', testEnvironment, () => {
    QUnit.test('dxDropDownEditor is defined', function(assert) {
        assert.ok(this.dropDownEditor);
    });

    QUnit.test('dxDropDownEditor can be instantiated', function(assert) {
        assert.ok(this.dropDownEditor instanceof DropDownEditor);
    });

    QUnit.test('the element must be decorated with the DROP_DOWN_EDITOR_ACTIVE class while the drop down is displayed', function(assert) {
        const activeClass = DROP_DOWN_EDITOR_ACTIVE;
        assert.ok(!this.rootElement.hasClass(activeClass));
        this.dropDownEditor.open();
        assert.ok(this.rootElement.hasClass(activeClass));
        this.dropDownEditor.close();
        assert.ok(!this.rootElement.hasClass(activeClass));
    });

    QUnit.test('content returned by _renderPopupContent must be rendered inside the dropdown', function(assert) {
        const content = $('<div>test</div>');
        const dropDownEditor = this.dropDownEditor;
        dropDownEditor._renderPopupContent = function() {
            return content.appendTo(dropDownEditor._popup.$content());
        };
        dropDownEditor.open();
        assert.strictEqual(dropDownEditor._$popup.dxPopup('$content').find(content)[0], content[0]);
    });

    QUnit.test('dropdown must close on outside click', function(assert) {
        this.dropDownEditor.open();
        assert.ok(this.dropDownEditor._popup.option('closeOnOutsideClick'));
    });

    QUnit.test('widget should have only one input by default', function(assert) {
        const $inputs = this.$dropDownEditor.find('input');
        const $submitElement = this.dropDownEditor._getSubmitElement();

        assert.equal($inputs.length, 1, 'there is only one input');
        assert.ok($inputs.is($submitElement), 'and it is a submit element');
    });

    QUnit.test('widget should have two inputs when \'useHiddenSubmitElement\' is \'true\'', function(assert) {
        this.dropDownEditor.option('useHiddenSubmitElement', true);
        const $inputs = this.$dropDownEditor.find('input');

        assert.equal($inputs.length, 2, 'there are two inputs');
    });

    QUnit.test('widget should have only one input when \'useHiddenSubmitElement\' changing to \'false\'', function(assert) {
        this.dropDownEditor.option('useHiddenSubmitElement', true);
        this.dropDownEditor.option('useHiddenSubmitElement', false);

        const $inputs = this.$dropDownEditor.find('input');
        const $submitElement = this.dropDownEditor._getSubmitElement();

        assert.equal($inputs.length, 1, 'there is only one input');
        assert.ok($inputs.is($submitElement), 'and it is a submit element');
    });

    QUnit.test('widget should render hidden submit input when \'useHiddenSubmitElement\' is \'true\'', function(assert) {
        this.dropDownEditor.option('useHiddenSubmitElement', true);

        const $submitInput = this.$dropDownEditor.find('input[type=\'hidden\']');

        assert.equal($submitInput.length, 1, 'there is one hidden input');
    });

    QUnit.test('submit value should be equal to the widget value', function(assert) {
        this.dropDownEditor.option({
            useHiddenSubmitElement: true,
            value: 'test'
        });

        const $submitInput = this.$dropDownEditor.find('input[type=\'hidden\']');

        assert.equal($submitInput.val(), 'test', 'the submit value is correct');
    });

    QUnit.test('clicking the input must not close the dropdown', function(assert) {
        this.dropDownEditor.open();
        pointerMock(this.dropDownEditor._input()).click();
        assert.ok(this.dropDownEditor.option('opened'));
    });

    QUnit.test('clicking the button must correctly close the dropdown', function(assert) {
        this.dropDownEditor.open();

        const $dropDownButton = this.dropDownEditor.$element().find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        pointerMock($dropDownButton).click();
        assert.ok(!this.dropDownEditor.option('opened'));
    });

    QUnit.test('clicking the button descendants must also correctly close the dropdown', function(assert) {
        this.dropDownEditor.open();

        const $dropDownButton = this.dropDownEditor.$element().find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        pointerMock($dropDownButton.find(`.${DROP_DOWN_EDITOR_BUTTON_ICON}`)).click();
        assert.ok(!this.dropDownEditor.option('opened'));
    });

    QUnit.test('dropdown must be decorated with DROP_DOWN_EDITOR_OVERLAY', function(assert) {
        this.dropDownEditor.open();
        assert.ok(this.dropDownEditor._$popup.hasClass(DROP_DOWN_EDITOR_OVERLAY));
    });

    QUnit.test('option opened', function(assert) {
        this.dropDownEditor.option('opened', true);

        const $popup = $('.dx-popup');
        const popup = $popup.dxPopup('instance');
        popup.$content().append('test');

        assert.ok(popup.$content().is(':visible'), 'popup is visible after opening');

        this.dropDownEditor.option('opened', false);

        assert.ok(popup.$content().is(':hidden'), 'popup is hidden after closing');
    });

    QUnit.test('overlay get correct open and close', function(assert) {
        let opened;
        this.dropDownEditor.option('onOpened', function() { opened = true; });
        this.dropDownEditor.option('onClosed', function() { opened = false; });
        this.dropDownEditor.open();
        assert.strictEqual(opened, true, 'open');
        this.dropDownEditor.close();
        assert.strictEqual(opened, false, 'close');
    });

    QUnit.test('when a drop down editor is disabled, it should not be possible to show the drop down by clicking the drop down button', function(assert) {
        this.dropDownEditor.option('disabled', true);
        const $dropDownButton = this.dropDownEditor.$element().find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        pointerMock($dropDownButton).click();
        assert.ok(!this.dropDownEditor._popup);
    });

    QUnit.test('when a drop down editor is readonly, it should not be possible to show the drop down by clicking the drop down button', function(assert) {
        this.dropDownEditor.option('readOnly', true);
        const $dropDownButton = this.dropDownEditor.$element().find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        pointerMock($dropDownButton).click();
        assert.ok(!this.dropDownEditor._popup);
    });

    QUnit.test('changing the readonly option changing button state', function(assert) {
        let $button = this.$dropDownEditor.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        pointerMock($button).click();
        assert.ok(this.dropDownEditor.option('opened'));
        this.dropDownEditor.close();

        this.dropDownEditor.option('readOnly', true);
        $button = this.$dropDownEditor.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        pointerMock($button).click();
        assert.ok(!this.dropDownEditor.option('opened'));
    });

    QUnit.test('correct buttons order after option change', function(assert) {
        this.dropDownEditor.option('showClearButton', true);

        const $buttonsContainer = this.$dropDownEditor.find('.dx-texteditor-buttons-container');
        const $buttons = $buttonsContainer.children();

        assert.equal($buttons.length, 2, 'clear button and drop button were rendered');
        assert.ok($buttons.eq(0).hasClass('dx-clear-button-area'), 'clear button is the first one');
        assert.ok($buttons.eq(1).hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS), 'drop button is the second one');
    });

    QUnit.test('Validation: onShown validation message handler should change', function(assert) {
        const dropDownEditor = this.dropDownEditor;
        dropDownEditor.option({
            isValid: false,
            validationError: { message: 'Something bad happened' }
        });

        dropDownEditor.open();

        assert.ok(dropDownEditor._$validationMessage);
        const pos = dropDownEditor._validationMessage.option('position');
        assert.equal(pos.my, 'left bottom', 'Message should be above dropdown');
        assert.equal(pos.at, 'left top', 'Message should be above dropdown');
    });

    QUnit.test('Validation: onHidden validation message handler should restore tooltip position', function(assert) {
        const dropDownEditor = this.dropDownEditor;
        dropDownEditor.option({
            isValid: false,
            validationError: { message: 'Something bad happened' }
        });

        // act
        dropDownEditor.open();
        dropDownEditor.close();
        // assert
        assert.ok(dropDownEditor._$validationMessage);
        const pos = dropDownEditor._validationMessage.option('position');
        assert.equal(pos.my, 'left top', 'Message should be below dropdown');
        assert.equal(pos.at, 'left bottom', 'Message should be below dropdown');
    });

    QUnit.test('\'popupPosition\' option default value should depend on \'rtlEnabled\' option value (T180106)', function(assert) {
        const dropDownEditor = this.dropDownEditor;

        const positionLTR = dropDownEditor.option('popupPosition');

        config({ rtlEnabled: true });

        const dropDownEditorRTL = $('<div id="dropDownEditorRTL">').dxDropDownEditor();

        try {
            const positionRTL = dropDownEditorRTL.dxDropDownEditor('option', 'popupPosition');

            const at = positionLTR.at.indexOf('left') > -1 ? 'right' : 'left';
            const my = positionLTR.my.indexOf('left') > -1 ? 'right' : 'left';

            assert.ok(positionRTL.at.indexOf(at) > -1, 'position.at is reversed');
            assert.ok(positionRTL.my.indexOf(my) > -1, 'position.my is reversed');
        } finally {
            $('#dropDownEditorRTL').remove();
            config({ rtlEnabled: false });
        }
    });

    QUnit.test('default value', function(assert) {
        const dropDownEditor = this.dropDownEditor;

        assert.strictEqual(dropDownEditor.option('value'), null, 'Default value is null');
    });

    QUnit.test('reset()', function(assert) {
        const dropDownEditor = this.dropDownEditor;
        dropDownEditor.option('value', '123');
        // act
        dropDownEditor.reset();
        // assert
        assert.strictEqual(dropDownEditor.option('value'), null, 'Value should be reset');
    });

    QUnit.test('reset method should clear the input value', function(assert) {
        const dropDownEditor = this.dropDownEditor;
        const $editor = dropDownEditor.$element();
        const $input = $editor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);

        dropDownEditor.option('value', null);
        $input.val('456');

        // act
        dropDownEditor.reset();

        // assert
        assert.strictEqual(dropDownEditor.option('value'), null, 'Value should be null');
        assert.equal($input.val(), '', 'Input value is correct');
    });

    QUnit.test('dx-state-hover class added after hover on element', function(assert) {
        this.dropDownEditor.option({
            value: '123',
            hoverStateEnabled: true
        });

        this.$dropDownEditor.trigger('dxhoverstart');

        assert.ok(this.$dropDownEditor.hasClass('dx-state-hover'), 'hover class has been added');
    });

    QUnit.test('content method returning overlay content', function(assert) {
        const dropDownEditor = this.dropDownEditor;

        dropDownEditor.open();

        const $content = $(dropDownEditor.content());

        assert.ok($content.hasClass('dx-popup-content'), 'content has class dx-popup-content');
    });

    QUnit.test('field method returning overlay content', function(assert) {
        const dropDownEditor = this.dropDownEditor;
        const $field = $(dropDownEditor.field());

        assert.equal(isRenderer(dropDownEditor.field()), !!config().useJQuery, 'fieldElement is correct');
        assert.ok($field.hasClass('dx-texteditor-input'), 'field has class dx-texteditor-input');
        assert.ok($field.hasClass('dx-texteditor-input'), 'field has class dx-texteditor-input');
    });
});

QUnit.module('dropDownOptions', () => {
    QUnit.test('dropDownOptions should work on init', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true,
            dropDownOptions: { customOption: 'Test' }
        }).dxDropDownEditor('instance');

        assert.equal(instance._popup.option('customOption'), 'Test', 'Option has been passed to the popup');
    });

    QUnit.test('dropDownOptions should redefine built-in values', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true,
            dropDownOptions: { showTitle: true }
        }).dxDropDownEditor('instance');

        assert.strictEqual(instance._popup.option('showTitle'), true, 'Option has been redefined');
    });

    QUnit.test('dropDownOptions should be updated when popup option changed', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true
        }).dxDropDownEditor('instance');

        const popup = instance._popup;

        assert.equal(popup.option('width'), instance.option('dropDownOptions.width'), 'dropDownOptions has been updated on init');

        popup.option('width', 400);
        assert.equal(instance.option('dropDownOptions.width'), 400, 'dropDownOptions has been updated on popup\'s option changed');
    });

    QUnit.test('it should be possible to set part of the dropDownOptions without full object changing', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true
        }).dxDropDownEditor('instance');

        const popup = instance._popup;

        instance.option('dropDownOptions.width', 300);
        assert.equal(popup.option('width'), 300, 'popup\'s width has been changed');

        instance.option('dropDownOptions', { height: 200 });
        assert.equal(popup.option('width'), 300, 'popup\'s width has not been changed');
        assert.equal(popup.option('height'), 200, 'popup\'s height has been changed');
        assert.equal(instance.option('dropDownOptions.width'), 300, 'dropDownOptions object has not been rewrited');
    });

    QUnit.test('dropDownOptions should not be cleared after repaint', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            dropDownOptions: {
                container: '#dropDownEditorLazy'
            },
            opened: true
        }).dxDropDownEditor('instance');

        assert.strictEqual(instance.option('dropDownOptions.container'), '#dropDownEditorLazy', 'option is correct');

        instance.repaint();
        assert.strictEqual(instance.option('dropDownOptions.container'), '#dropDownEditorLazy', 'option is correct');
    });

    QUnit.test('dropDownOptions should have dragEnabled = false after popup opened (T946143)', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true
        }).dxDropDownEditor('instance');

        assert.strictEqual(instance.option('dropDownOptions.dragEnabled'), false);
    });

});

QUnit.module('focus policy', () => {
    QUnit.testInActiveWindow('editor should save focus on button clicking', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'blur preventing unnecessary on mobile devices');
            return;
        }

        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            applyValueMode: 'useButtons',
            focusStateEnabled: true
        });

        const instance = $dropDownEditor.dxDropDownEditor('instance');

        instance.open();

        const $buttons = instance._popup._wrapper().find('.dx-button');

        $.each($buttons, function(index, button) {
            const $button = $(button);
            const buttonInstance = $button.dxButton('instance');
            instance.focus();
            $button.focus();

            const pointer = pointerMock(button);

            assert.ok(!$dropDownEditor.hasClass('dx-state-focused') || !buttonInstance.option('focusStateEnabled'), 'dropDownEditor lose focus after click on button, nested into overlay');

            pointer.click();

            if(!instance.option('opened')) {
                assert.ok($dropDownEditor.hasClass('dx-state-focused'), 'dropDownEditor obtained focus after popup button click with close action');
            } else {
                instance.option('opened', false);
            }
        });
    });

    QUnit.testInActiveWindow('editor should save focus on clearbutton clicking, fieldTemplate is used', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'blur preventing unnecessary on mobile devices');
            return;
        }

        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            items: [{ 'Name': 'one', 'ID': 1 }, { 'Name': 'two', 'ID': 2 }, { 'Name': 'three', 'ID': 3 }],
            displayExpr: 'Name',
            valueExpr: 'ID',
            showClearButton: 'true',
            value: 1,
            fieldTemplate(value) {
                const $textBox = $('<div>').dxTextBox({
                    text: value,
                    focusStateEnabled: true
                });
                return $('<div>').text(value + this.option('value')).append($textBox);
            },
        });

        $dropDownEditor.find('.dx-texteditor-input').focus();

        assert.ok($dropDownEditor.find('.dx-texteditor').hasClass('dx-state-focused'), 'Widget is focused');

        const $buttonsContainer = $dropDownEditor.find('.dx-texteditor-buttons-container');
        const $buttons = $buttonsContainer.children();

        $buttons.eq(1).trigger('dxclick');

        assert.ok($dropDownEditor.hasClass('dx-state-focused'), 'Widget is focused after click on clearButton');
    });

    QUnit.testInActiveWindow('input is focused by click on dropDownButton', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            focusStateEnabled: true
        });
        const $dropDownButton = $dropDownEditor.find('.dx-dropdowneditor-button');
        $dropDownButton.trigger('dxclick');

        assert.ok($dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`).is(':focus'), 'input focused');
    });

    QUnit.test('native focus event should not be triggered if dropdown button clicked on mobile device', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            focusStateEnabled: false,
            showDropDownButton: true
        });

        const instance = $dropDownEditor.dxDropDownEditor('instance');
        const focusinHandler = sinon.spy();
        const $input = $dropDownEditor.find('.dx-texteditor-input');
        const $dropDownButton = $dropDownEditor.find('.dx-dropdowneditor-button');

        eventsEngine.on($input, 'focus focusin', focusinHandler);
        eventsEngine.trigger($dropDownButton, 'dxclick');

        assert.ok(instance.option('opened'), 'editor was opened');
        assert.equal(focusinHandler.callCount, 0, 'native focus should not be triggered');
    });

    QUnit.testInActiveWindow('focusout should not be fired after click on the dropDownButton when editor is focused', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            focusStateEnabled: true
        });

        const $dropDownButton = $dropDownEditor.find('.dx-dropdowneditor-button');

        $dropDownEditor.dxDropDownEditor('focus');

        const e = $.Event('mousedown');
        $dropDownButton.trigger(e);

        assert.ok(e.isDefaultPrevented(), 'focusout was prevented');
    });

    QUnit.testInActiveWindow('focusout should be fired after click on the dropDownButton when editor isn\'t focused (T823431)', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            focusStateEnabled: true
        });

        const $dropDownButton = $dropDownEditor.find('.dx-dropdowneditor-button');

        const e = $.Event('mousedown');
        $dropDownButton.trigger(e);

        assert.notOk(e.isDefaultPrevented(), 'focusout was not prevented');
    });

    QUnit.test('focusout should not be fired on valueChanged', function(assert) {
        const onFocusOutStub = sinon.stub();
        const textBoxOnFocusOutStub = sinon.stub();

        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            fieldTemplate(value) {
                const $textBox = $('<div>').dxTextBox({
                    onFocusOut: textBoxOnFocusOutStub,
                });
                return $('<div>').text(value + this.option('value')).append($textBox);
            },
            items: [0, 1, 2, 3, 4, 5],
            acceptCustomValue: true,
            valueChangeEvent: 'change',
            onFocusOut: onFocusOutStub,
            focusStateEnabled: true
        });
        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('2');
        keyboard.change();

        assert.equal(onFocusOutStub.callCount, 0, 'onFocusOut is fired');
        assert.equal(textBoxOnFocusOutStub.callCount, 0, 'onFocusOut textbox is fired');
    });

    QUnit.test('focusout to another editor should close current ddb (T832410)', function(assert) {
        const $dropDownEditor1 = $('#dropDownEditorLazy').dxDropDownEditor({
            items: [0, 1, 2],
            acceptCustomValue: true,
            focusStateEnabled: true,
            opened: true
        });

        const $dropDownEditor2 = $('#dropDownEditorSecond').dxDropDownEditor({
            items: [0, 1, 2],
            acceptCustomValue: true,
            focusStateEnabled: true
        });

        const dropDownEditor1 = $dropDownEditor1.dxDropDownEditor('instance');

        const $input1 = $dropDownEditor1.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const $input2 = $dropDownEditor2.find(`.${TEXT_EDITOR_INPUT_CLASS}`);

        dropDownEditor1.focus();

        $input1.trigger($.Event('focusout', { relatedTarget: $input2 }));

        assert.strictEqual(dropDownEditor1.option('opened'), !isIOs, 'should be closed after another editor focus');

        dropDownEditor1.open();
        dropDownEditor1.focus();
        $input1.trigger($.Event('focusout', { relatedTarget: $(`.${POPUP_CONTENT}`) }));

        assert.ok(dropDownEditor1.option('opened'), 'should be still opened after the widget\'s popup focus');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach() {
        fx.off = true;
        this.$rootElement = $('<div id=\'dropDownEditor\'></div>');
        this.$rootElement.appendTo('body');
        this.dropDownEditor = $('#dropDownEditor').dxDropDownEditor({
            focusStateEnabled: true
        }).dxDropDownEditor('instance');
        this.$input = this.$rootElement.find('.dx-texteditor-input');
        this.$overlay = this.$rootElement.find('.dx-overlay');
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach() {
        this.$rootElement.remove();
        this.dropDownEditor = null;
        fx.off = false;
    }
}, () => {
    QUnit.test('control keys test', function(assert) {
        const altDown = $.Event('keydown', { key: 'ArrowDown', altKey: true });
        const altUp = $.Event('keydown', { key: 'ArrowUp', altKey: true });

        assert.ok(!this.dropDownEditor.option('opened'), 'overlay is hidden on first show');


        this.dropDownEditor.option('opened', true);
        this.keyboard.keyDown('esc');
        assert.ok(!this.dropDownEditor.option('opened'), 'overlay is closed on escape press');

        this.$input.trigger(altDown);
        assert.ok(this.dropDownEditor.option('opened'), 'overlay is visible on alt+down press');

        this.$input.trigger(altUp);
        assert.ok(!this.dropDownEditor.option('opened'), 'overlay is visible on alt+up press');
    });

    QUnit.test('space/altDown key press on readOnly drop down doesn\'t toggle popup visibility', function(assert) {
        const altDown = $.Event('keydown', { key: 'ArrowDown', altKey: true });

        this.dropDownEditor.option('readOnly', true);

        this.keyboard.keyDown('space');
        assert.ok(!this.dropDownEditor.option('opened'), 'overlay is not visible on space press in readonly state');

        this.$input.trigger(altDown);
        assert.ok(!this.dropDownEditor.option('opened'), 'overlay is not visible on alt+down press in readonly state');
    });

    QUnit.test('Enter and escape key press prevent default when popup in opened', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.dropDownEditor.option('opened', true);

        this.$rootElement.on('keydown', function(e) {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('enter');
        this.keyboard.keyDown('esc');

        assert.equal(prevented, 2, 'defaults prevented on enter and escape keys');
    });

    QUnit.test('Enter and escape key press does not prevent default when popup in not opened', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.dropDownEditor.option('opened', false);

        this.$rootElement.on('keydown', function(e) {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('esc');
        this.keyboard.keyDown('enter');

        assert.equal(prevented, 0, 'defaults has not prevented on enter and escape keys');
    });

    QUnit.test('Escape key press should be handled by a children keyboard processor', function(assert) {
        const handler = sinon.stub();

        this.dropDownEditor.option('onKeyboardHandled', handler);
        this.keyboard.keyDown('esc');

        assert.ok(handler.calledOnce, 'Children keyboard processor can process the \'esc\' key pressing');
    });

    QUnit.test('Home and end key press does not prevent default when popup in opened (T865192)', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.dropDownEditor.option('opened', true);

        this.$rootElement.on('keydown', function(e) {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('home');
        this.keyboard.keyDown('end');

        assert.equal(prevented, 0, 'defaults has not prevented on home and end keys');
    });

    QUnit.test('Keyboard navigation with field template', function(assert) {
        this.dropDownEditor.option('fieldTemplate', function(data, container) {
            $(container).append($('<div>').dxTextBox({ value: data }));
        });

        this.$rootElement.find('.dx-texteditor-input').trigger($.Event('keydown', { key: 'ArrowDown', altKey: true }));
        assert.ok(this.dropDownEditor.option('opened'), 'overlay is visible on alt+down press');

        this.dropDownEditor.option('value', '123');

        keyboardMock(this.$rootElement.find('.dx-texteditor-input')).keyDown('esc');
        assert.ok(!this.dropDownEditor.option('opened'), 'overlay is not visible on esc press after value changed');

        this.$rootElement.find('.dx-texteditor-input').trigger($.Event('keydown', { key: 'ArrowDown', altKey: true }));
        assert.ok(this.dropDownEditor.option('opened'), 'overlay is visible on esc press after value changed');
    });

    QUnit.testInActiveWindow('Focus policy with field template', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'blur preventing unnecessary on mobile devices');
            return;
        }

        this.dropDownEditor.option('fieldTemplate', function(data, container) {
            $(container).append($('<div>').dxTextBox({ value: data }));
        });

        this.$rootElement.find('.dx-texteditor-input').focus();
        this.$rootElement.find('.dx-texteditor-input').focusin();

        assert.ok(this.$rootElement.find('.dx-texteditor').hasClass('dx-state-focused'));

        this.dropDownEditor.option('value', '123');

        assert.ok(this.$rootElement.find('.dx-texteditor').hasClass('dx-state-focused'), 'Text editor is focused after change value');
    });

    QUnit.test('Drop button template should be rendered correctly', function(assert) {
        const buttonTemplate = function(buttonData, contentElement) {
            assert.equal(isRenderer(contentElement), !!config().useJQuery, 'contentElement is correct');

            return '<div>Template</div>';
        };

        this.dropDownEditor.option('dropDownButtonTemplate', buttonTemplate);

        const $button = this.$rootElement.find('.dx-dropdowneditor-button');

        assert.equal($button.text(), 'Template', 'Template was rendered');
    });
});

QUnit.module('keyboard navigation inside popup', {
    beforeEach() {
        fx.off = true;
        this.$element = $('<div>');
        $('body').append(this.$element);

        this.instance = this.$element.dxDropDownEditor({
            focusStateEnabled: true,
            applyValueMode: 'useButtons',
            opened: true
        }).dxDropDownEditor('instance');

        this.$input = this.$element.find('.dx-texteditor-input');

        const $popupWrapper = $(this.instance._popup._wrapper());
        this.$doneButton = $popupWrapper.find('.dx-popup-done.dx-button');
        this.$cancelButton = $popupWrapper.find('.dx-popup-cancel.dx-button');

        this.triggerKeyPress = function($element, keyCode, shiftKey) {
            const eventConfig = { key: keyCode };

            if(shiftKey) {
                eventConfig.shiftKey = shiftKey;
            }

            $($element)
                .focus()
                .trigger($.Event('keydown', eventConfig));
        };
    },
    afterEach() {
        this.$element.remove();
        this.instance = null;
        fx.off = false;
    }
}, () => {
    QUnit.testInActiveWindow('the first popup element should be focused on the \'tab\' key press if the input is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        this.triggerKeyPress(this.$input, TAB_KEY_CODE);
        assert.ok(this.$doneButton.hasClass('dx-state-focused'), 'the first popup element is focused');
    });

    QUnit.testInActiveWindow('the input should be focused on the \'tab\' key press if the last element is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        this.triggerKeyPress(this.$cancelButton, TAB_KEY_CODE);
        assert.ok(this.$element.hasClass('dx-state-focused'), 'the input is focused');
    });

    QUnit.testInActiveWindow('the input should be focused on the \'tab+shift\' key press if the first element is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        this.triggerKeyPress(this.$doneButton, TAB_KEY_CODE, true);
        assert.ok(this.$element.hasClass('dx-state-focused'), 'the input is focused');
    });

    QUnit.testInActiveWindow('the last popup element should be focused on the \'tab+shift\' key press if the input is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        this.triggerKeyPress(this.$input, TAB_KEY_CODE, true);
        assert.ok(this.$cancelButton.hasClass('dx-state-focused'), 'the last popup element is focused');
    });

    QUnit.testInActiveWindow('default event should be prevented on the tab key press if the input is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        const spy = sinon.spy();
        this.$cancelButton.on('keydown', spy);
        this.triggerKeyPress(this.$cancelButton, TAB_KEY_CODE);
        assert.ok(spy.args[0][0].isDefaultPrevented(), 'default is prevented');
    });

    QUnit.testInActiveWindow('default event should be prevented on the tab key press if the last element is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        const spy = sinon.spy();
        this.$input.on('keydown', spy);
        this.triggerKeyPress(this.$input, TAB_KEY_CODE);
        assert.ok(spy.args[0][0].isDefaultPrevented(), 'default is prevented');
    });

    QUnit.testInActiveWindow('popup should be closed on the \'esc\' key press if the button inside is focused', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.open();
        this.triggerKeyPress(this.$doneButton, ESC_KEY_CODE);
        assert.notOk(this.instance.option('opened'), 'popup is closed');
        assert.ok(this.$element.hasClass('dx-state-focused'), 'editor is focused');
    });
});

QUnit.module('deferRendering', () => {
    QUnit.test('popup is rendered only when open editor when deferRendering is true', function(assert) {
        $('#dropDownEditorLazy').dxDropDownEditor({
            deferRendering: false
        });

        assert.equal($('.dx-dropdowneditor-overlay').length, 1, 'content is not rendered');
    });

    QUnit.test('popup is rendered immediately when deferRendering is changed to false in runtime', function(assert) {
        const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({}).dxDropDownEditor('instance');

        assert.strictEqual(dropDownEditor._popup, undefined, 'popup is not rendered');
        dropDownEditor.option('deferRendering', false);
        assert.ok(dropDownEditor._popup, 'popup is rendered after runtime option change');
    });
});

QUnit.module('Templates', () => {
    QUnit.test('should not render placeholder if the fieldTemplate is used', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            items: [0, 1, 2, 3, 4, 5],
            placeholder: 'placeholder',
            fieldTemplate: () => $('<div>').dxTextBox({ placeholder: 'placeholder' })
        });
        const $placeholder = $dropDownEditor.find('.dx-placeholder');

        assert.strictEqual($placeholder.length, 1, 'has only one placeholder');
        assert.strictEqual($placeholder.closest('.dx-textbox').length, 1, 'is textbox\'s placeholder');
    });

    QUnit.test('onValueChanged should be fired for each change by keyboard when fieldTemplate is used', function(assert) {
        const valueChangedSpy = sinon.spy();

        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            fieldTemplate(value) {
                const $textBox = $('<div>').dxTextBox();
                return $('<div>').text(value + this.option('value')).append($textBox);
            },
            items: [0, 1, 2, 3, 4, 5],
            acceptCustomValue: true,
            valueChangeEvent: 'keyup',
            onValueChanged: valueChangedSpy
        });

        keyboardMock($dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`)).type('2');
        assert.equal(valueChangedSpy.callCount, 1, 'onValueChanged is fired first time');

        keyboardMock($dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`)).type('4');
        assert.equal(valueChangedSpy.callCount, 2, 'onValueChanged is fired second time');
    });

    QUnit.test('field template should be correctly removed after it is been applied once', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy');

        const dropDownEditor = $dropDownEditor.dxDropDownEditor({
            items: [1, 2, 3],
            opened: true,
            value: [1],
            searchEnabled: true,
            fieldTemplate(itemData, container) {
                const $textBox = $('<div>').dxTextBox(); const $field = $('<div>Test<div/>');

                assert.equal(isRenderer(container), !!config().useJQuery, 'container is correct');
                $(container).append($field).append($textBox);
            }
        }).dxDropDownEditor('instance');

        dropDownEditor.option('fieldTemplate', null);

        assert.notEqual($dropDownEditor.text(), 'Test', 'fieldTemplate was correctly cleared');
    });

    QUnit.test('events should be rendered for input after value is changed when field template is specified (T399896)', function(assert) {
        const events = [
            'KeyDown', 'KeyPress', 'KeyUp',
            'Change', 'Cut', 'Copy', 'Paste', 'Input'
        ];

        const spies = {};

        const options = {
            value: 1,
            fieldTemplate() {
                return $('<div>').dxTextBox();
            }
        };
        sinon.stub(logger, 'warn');

        try {
            $.each(events, function(_, event) {
                const spy = sinon.spy();
                options['on' + event] = spy;
                spies[event] = spy;
            });

            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor(options);
            const instance = $dropDownEditor.dxDropDownEditor('instance');

            instance.option('value', 2);

            $.each(events, function(_, eventName) {
                const params = {};

                if(eventName.indexOf('Key') !== -1) {
                    params.key = '';
                }

                const event = $.Event(eventName.toLowerCase(), params);
                $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`).trigger(event);
                assert.equal(spies[eventName].callCount, 1, 'the \'' + eventName + '\' event was fired after value change');
            });

            assert.ok(logger.warn.calledTwice, 'init + handle OnKeyPress');
            const firstWarnMessage = logger.warn.firstCall.args[0];
            const secondWarnMessage = logger.warn.lastCall.args[0];
            const isOnKeyPressWarnings = firstWarnMessage.indexOf('onKeyPress') > -1 && secondWarnMessage.indexOf('onKeyPress') > -1;
            assert.ok(isOnKeyPressWarnings);
        } finally {
            logger.warn.restore();
        }
    });

    QUnit.test('should have no errors after value change if text editor buttons were directly removed (T743479)', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            items: [0, 1, 2, 3, 4, 5],
            value: 1,
            fieldTemplate(value) {
                const $textBox = $('<div>').dxTextBox();
                return $('<div>').text(value + this.option('value')).append($textBox);
            }
        });
        const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');

        $dropDownEditor.find('.dx-texteditor-buttons-container').remove();

        try {
            dropDownEditor.option('value', 2);
            assert.ok(true);
        } catch(e) {
            assert.ok(false, 'the error is thrown');
        }
    });

    QUnit.testInActiveWindow('widget should detach focus events before fieldTemplate rerender', function(assert) {
        const focusOutSpy = sinon.stub();
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dataSource: [1, 2],
            fieldTemplate(value, container) {
                const $textBoxContainer = $('<div>').appendTo(container);
                $('<div>').dxTextBox().appendTo($textBoxContainer);

                $($textBoxContainer).one('dxremove', () => {
                    $textBoxContainer.detach();
                });
            },
            onFocusOut: focusOutSpy,
            opened: true
        });

        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        $input.focus();
        keyboard.press('down');
        keyboard.press('enter');

        assert.strictEqual(focusOutSpy.callCount, 0, 'there\'s no focus outs from deleted field container');
    });

    QUnit.test('fieldTemplate item element should have 100% width (T826516)', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dataSource: [1, 2],
            width: 500,
            fieldTemplate(value, container) {
                const $textBoxContainer = $('<div>').appendTo(container);
                $('<div>').dxTextBox().appendTo($textBoxContainer);
            }
        });

        const $fieldTemplateWrapper = $dropDownEditor.find(`.${DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER}`);
        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const $buttonsContainer = $dropDownEditor.find(`.${TEXT_EDITOR_BUTTONS_CONTAINER_CLASS}`);

        assert.roughEqual($fieldTemplateWrapper.outerWidth(), $input.outerWidth() + $buttonsContainer.outerWidth(), 1);
    });

    QUnit.test('fieldTemplate item element should have 100% width with field template wrapper (T826516)', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dataSource: [1, 2],
            width: 500,
            fieldTemplate: 'field',
            integrationOptions: {
                templates: {
                    'field': {
                        render(args) {
                            const $element = $('<div>')
                                .addClass('dx-template-wrapper');
                            $('<div>').dxTextBox().appendTo($element);
                            $element.appendTo(args.container);
                        }
                    }
                }
            },
        });

        const $fieldTemplateWrapper = $dropDownEditor.find(`.${DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER}`);
        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const $buttonsContainer = $dropDownEditor.find(`.${TEXT_EDITOR_BUTTONS_CONTAINER_CLASS}`);

        assert.roughEqual($fieldTemplateWrapper.outerWidth(), $input.outerWidth() + $buttonsContainer.outerWidth(), 1);
    });

    QUnit.testInActiveWindow('fieldTemplate can contain a masked TextBox', function(assert) {
        let keyboard;
        let $input;
        this.clock = sinon.useFakeTimers();

        try {

            $('#dropDownEditorLazy').dxDropDownEditor({
                dataSource: [1, 2],
                fieldTemplate: (value, $element) => {
                    const $textBox = $('<div>')
                        .appendTo($element)
                        .dxTextBox({
                            mask: '0-0',
                            value
                        });

                    $input = $textBox.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
                    keyboard = new keyboardMock($input, true);
                    caretWorkaround($input);
                }
            });

            keyboard.type('z5');
            this.clock.tick();
            assert.strictEqual($input.val(), '5-_', 'Masked TextBox works fine');
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test('contentTemplate should not redefine popup content (T860163)', function(assert) {
        assert.expect(1);

        const $editor = $(`<div id='editor'>
                <div data-options="dxTemplate: { name: 'content' }">
                    Content template markup
                </div>
            </div>`).appendTo('#qunit-fixture');

        $editor.dxDropDownEditor({
            onPopupInitialized({ popup }) {
                popup.on('contentReady', () => {
                    const popupContentText = $(popup.content()).text();
                    assert.ok(popupContentText.indexOf('Content template markup') < 0);
                });
            },
            opened: true
        });
    });

    QUnit.test('editor with fieldTemplate should correctly render additional action buttons on changing the "buttons" option', function(assert) {
        const editor = $('#dropDownEditorLazy').dxDropDownEditor({
            dataSource: [1, 2],
            fieldTemplate: (data, container) => {
                $('<div>').dxTextBox().appendTo(container);
            }
        }).dxDropDownEditor('instance');

        editor.option('buttons', [{ name: 'custom', options: { text: 'test button' } }]);

        const $buttons = editor.$element().find('.dx-button');

        assert.strictEqual($buttons.length, 1, 'there is only one button');
        assert.strictEqual($buttons.text(), 'test button', 'correct text');
    });
});

QUnit.module('options', () => {
    QUnit.test('acceptCustomValue', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            acceptCustomValue: false,
            valueChangeEvent: 'change keyup'
        });

        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('test');

        assert.equal($dropDownEditor.dxDropDownEditor('option', 'value'), '', 'value is not set');
        assert.equal($input.val(), '', 'text is not rendered');
    });

    QUnit.test('openOnFieldClick', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            openOnFieldClick: true
        });

        const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');
        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);

        assert.ok($dropDownEditor.hasClass('dx-dropdowneditor-field-clickable'), 'special css class attached');

        $input.trigger('dxclick');
        assert.equal(dropDownEditor.option('opened'), true, 'opened by field click');

        dropDownEditor.option({
            opened: false,
            openOnFieldClick: false
        });

        $input.trigger('dxclick');
        assert.equal(dropDownEditor.option('opened'), false, 'not opened by field click');
    });

    QUnit.testInActiveWindow('focus editor in the case when \'openOnFieldClick\' is false', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            openOnFieldClick: false
        });

        const $input = $dropDownEditor.find('.dx-texteditor-input');

        $input.trigger('dxclick');

        assert.ok($dropDownEditor.hasClass('dx-state-focused'), 'editor is focused on click');
    });

    QUnit.test('DropDownEditor doesn\'t opened on field click when it located in element with disabled state', function(assert) {
        const dropDownEditor = $('#dropDownEditorLazy')
            .wrap('<div class=\'dx-state-disabled\'>')
            .dxDropDownEditor({ openOnFieldClick: true })
            .dxDropDownEditor('instance');

        $('#dropDownEditorLazy input').trigger('dxclick');

        assert.notOk(dropDownEditor.option('opened'), 'DropDownEditor isn\'t opened');
    });

    QUnit.test('DropDownButton state after drop readOnly editor\'s state', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            readOnly: true
        });

        const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');
        dropDownEditor.option('readOnly', false);

        const dropDownButton = $dropDownEditor.find('.dx-dropdowneditor-button').dxButton('instance');

        assert.equal(dropDownButton.option('disabled'), false, 'dropDownButton is not disabled');
    });

    QUnit.test('input is not editable after changed readOnly state', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            items: ['one', 'two', 'three'],
            acceptCustomValue: false,
            readOnly: true
        });

        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const instance = $dropDownEditor.dxDropDownEditor('instance');

        instance.option('value', 'one');
        instance.option('readOnly', false);

        keyboardMock($input).type('b');

        assert.equal($input.val(), 'one', 'value is not changed');
    });

    QUnit.test('"showPopupTitle" should change built-in popup "showTitle" option', function(assert) {
        const instance = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true,
            dropDownOptions: { showTitle: true }
        }).dxDropDownEditor('instance');

        sinon.stub(logger, 'warn');

        try {
            instance.option('showPopupTitle', false);

            assert.ok(logger.warn.calledOnce);
            assert.strictEqual(instance._popup.option('showTitle'), false, 'Option has been changed');
        } finally {
            logger.warn.restore();
        }
    });
});

QUnit.module('popup integration', () => {
    QUnit.module('overlay content width', () => {
        QUnit.test('should be equal to the editor width when dropDownOptions.width in not defined', function(assert) {
            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                opened: true,
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), $dropDownEditor.outerWidth(), 'overlay content width is correct');
        });

        QUnit.test('should be equal to the editor width when dropDownOptions.width in not defined after editor width runtime change', function(assert) {
            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                opened: true
            });
            const instance = $dropDownEditor.dxDropDownEditor('instance');

            instance.option('width', 153);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), $dropDownEditor.outerWidth(), 'overlay content width is correct');
        });

        QUnit.test('should be equal to content width if dropDownOptions.width is set to auto', function(assert) {
            const contentWidth = 500;
            const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    width: 'auto'
                }
            }).dxDropDownEditor('instance');

            dropDownEditor._renderPopupContent = function() {
                return $('<div>')
                    .css({ width: contentWidth })
                    .appendTo(dropDownEditor._popup.$content());
            };
            dropDownEditor.open();

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual($popupContent.width(), contentWidth, 'overlay content width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width if it\'s defined', function(assert) {
            const overlayContentWidth = 500;
            $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    width: overlayContentWidth
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), overlayContentWidth, 'overlay content width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width even after editor input width change', function(assert) {
            const overlayContentWidth = 500;
            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    width: overlayContentWidth
                },
                opened: true
            });
            const instance = $dropDownEditor.dxDropDownEditor('instance');

            instance.option('width', 300);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), overlayContentWidth, 'overlay content width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is set to 100%', function(assert) {
            $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    width: '100%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth(), 'overlay content width is correct');
        });

        QUnit.test('should be calculated relative to wrapper when dropDownOptions.width is percent', function(assert) {
            $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    width: '50%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth() / 2, 0.1, 'overlay content width is correct');
        });

        QUnit.test('should be calculated relative to wrapper after editor width runtime change', function(assert) {
            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                width: 600,
                dropDownOptions: {
                    width: '50%'
                },
                opened: true
            });
            const instance = $dropDownEditor.dxDropDownEditor('instance');

            instance.option('width', 700);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth() / 2, 0.1, 'overlay content width is correct');
        });

        QUnit.test('should be equal to editor input width even when dropDownOptions.container is defined', function(assert) {
            const $container = $('<div>')
                .css({ width: 150 })
                .appendTo('#qunit-fixture');

            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    container: $container
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);

            assert.strictEqual($overlayContent.outerWidth(), $dropDownEditor.outerWidth(), 'width is correct');
        });
    });

    QUnit.module('overlay content height', () => {
        QUnit.test('should be equal to content height if dropDownOptions.height is not specified', function(assert) {
            const contentHeight = 500;
            const dropDownEditor = $('#dropDownEditorLazy')
                .dxDropDownEditor()
                .dxDropDownEditor('instance');

            dropDownEditor._renderPopupContent = function() {
                return $('<div>')
                    .css({ height: contentHeight })
                    .appendTo(dropDownEditor._popup.$content());
            };
            dropDownEditor.open();

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual($popupContent.height(), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to content height if dropDownOptions.height is not specified even after editor height change', function(assert) {
            const contentHeight = 500;
            const dropDownEditor = $('#dropDownEditorLazy')
                .dxDropDownEditor()
                .dxDropDownEditor('instance');

            dropDownEditor._renderPopupContent = function() {
                return $('<div>')
                    .css({ height: contentHeight })
                    .appendTo(dropDownEditor._popup.$content());
            };
            dropDownEditor.open();

            dropDownEditor.option('height', 300);

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual($popupContent.height(), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to content height if dropDownOptions.height is set to auto', function(assert) {
            const contentHeight = 500;
            const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    height: 'auto'
                }
            }).dxDropDownEditor('instance');

            dropDownEditor._renderPopupContent = function() {
                return $('<div>')
                    .css({ height: contentHeight })
                    .appendTo(dropDownEditor._popup.$content());
            };
            dropDownEditor.open();

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual($popupContent.height(), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to dropDownOptions.height if it is specified', function(assert) {
            const overlayContentHeight = 500;
            $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    height: overlayContentHeight
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), overlayContentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to dropDownOptions.height even after editor height change', function(assert) {
            const overlayContentHeight = 500;
            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    height: overlayContentHeight
                },
                opened: true
            });
            const instance = $dropDownEditor.dxDropDownEditor('instance');

            instance.option('height', 300);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), overlayContentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to wrapper height if dropDownOptions.height is set to 100%', function(assert) {
            $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    height: '100%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), $overlayWrapper.outerHeight(), 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to wrapper when dropDownOptions.height is percent', function(assert) {
            $('#dropDownEditorLazy').dxDropDownEditor({
                dropDownOptions: {
                    height: '50%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), $overlayWrapper.outerHeight() / 2, 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to wrapper after editor height runtime change', function(assert) {
            const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
                height: 600,
                dropDownOptions: {
                    height: '50%'
                },
                opened: true
            });
            const instance = $dropDownEditor.dxDropDownEditor('instance');

            instance.option('height', 700);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), $overlayWrapper.outerHeight() / 2, 0.1, 'overlay content height is correct');
        });
    });

    QUnit.test('popup should be repositioned after height option runtime change', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            opened: true
        });
        const instance = $dropDownEditor.dxDropDownEditor('instance');

        instance.option('height', 300);

        const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
        const overlayContentRect = $overlayContent.get(0).getBoundingClientRect();
        const editorRect = $dropDownEditor.get(0).getBoundingClientRect();

        assert.roughEqual(overlayContentRect.top, editorRect.bottom, 1.01, 'top position is correct');
        assert.roughEqual(overlayContentRect.left, editorRect.left, 1.01, 'left position is correct');
    });

    QUnit.test('dropDownOptions.width should be passed to popup', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dropDownOptions: {
                width: 500
            },
            opened: true
        });

        const popup = $dropDownEditor.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('width'), 500, 'popup width option value is correct');
    });

    QUnit.test('popup should have width equal to dropDownOptions.width even after editor input width change', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dropDownOptions: {
                width: 500
            },
            opened: true
        });
        const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');

        dropDownEditor.option('width', 300);

        const popup = $dropDownEditor.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('width'), 500, 'popup width option value is correct');
    });

    QUnit.test('dropDownOptions.height should be passed to popup', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dropDownOptions: {
                height: 500
            },
            opened: true
        });

        const popup = $dropDownEditor.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('height'), 500, 'popup height option value is correct');
    });

    QUnit.test('popup should have height equal to dropDownOptions.height even after editor height change', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dropDownOptions: {
                height: 500
            },
            opened: true
        });
        const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');

        dropDownEditor.option('height', 300);

        const popup = $dropDownEditor.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('height'), 500, 'popup height option value is correct');
    });

    QUnit.test('onPopupInitialized', function(assert) {
        assert.expect(1);

        $('#dropDownEditorLazy').dxDropDownEditor({
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, 'dxPopup', 'initialized event is fired for popup');
            },
            opened: true
        });
    });

    QUnit.test('showTitle option', function(assert) {
        const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            dropDownOptions: { showTitle: true },
            opened: true
        }).dxDropDownEditor('instance');

        assert.equal($('.dx-overlay-content .dx-popup-title').length, 1, 'popup title is rendered');

        dropDownEditor.close();
        dropDownEditor.option('dropDownOptions.showTitle', false);
        dropDownEditor.open();

        assert.equal($('.dx-overlay-content .dx-popup-title').length, 0, 'popup title is not rendered');
    });

    QUnit.test('popup should have correct class if it is flipped', function(assert) {
        const $dropDownEditor = $('<div>').appendTo('body');
        try {
            $dropDownEditor.css({ position: 'fixed', bottom: 0 });
            $dropDownEditor.dxDropDownEditor({
                opened: true
            });

            const $popupContent = $('.dx-overlay-content');

            assert.ok($popupContent.hasClass('dx-dropdowneditor-overlay-flipped'), 'flipped class was added');
        } finally {
            $dropDownEditor.remove();
        }
    });

    QUnit.test('the popup \'fullScreen\' option should be overridden (T295450)', function(assert) {
        Overlay.defaultOptions({
            options: {
                fullScreen: true
            }
        });

        const $dropDownEditor = $('<div>').dxDropDownEditor({
            opened: true
        }).appendTo('body');

        try {
            const popup = $dropDownEditor.find('.dx-popup').dxPopup('instance');

            assert.equal(popup.option('fullScreen'), false, 'the popup \'fullScreen\' is still false');
        } finally {
            Overlay.defaultOptions({
                options: {
                    fullScreen: false
                }
            });
            $dropDownEditor.remove();
        }
    });

    QUnit.test('widget should work correctly when popup \'fullScreen\' is true', function(assert) {
        const $dropDownEditor = $('<div>').dxDropDownEditor({
            opened: true
        }).appendTo('body');

        const popup = $dropDownEditor.find('.dx-popup').dxPopup('instance');
        popup.option('fullScreen', true);

        assert.ok(true, 'Widget works correctly');

        $dropDownEditor.remove();
    });
});

QUnit.module('popup buttons', {
    beforeEach() {
        fx.off = true;
        this.$dropDownEditor = $('<div id=\'dropDownEditor\'></div>')
            .appendTo('body');
        this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor({
            applyValueMode: 'useButtons',
            dropDownOptions: { showTitle: true }
        }).dxDropDownEditor('instance');
    },
    reinitFixture(options) {
        this.$dropDownEditor.remove();
        this.dropDownEditor = null;
        this.$dropDownEditor = $('<div id=\'dropDownEditor\'></div>')
            .appendTo('body');
        this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor(options)
            .dxDropDownEditor('instance');
    },
    afterEach() {
        this.$dropDownEditor.remove();
        this.dropDownEditor = null;
        fx.off = false;
    }
}, () => {
    QUnit.test('applyValueMode option should affect on buttons rendering inside popup', function(assert) {
        if(!devices.current().ios) {
            this.reinitFixture({
                dropDownOptions: { showTitle: false },
                applyValueMode: 'useButtons' });
        }

        this.dropDownEditor.open();

        assert.ok($('.dx-overlay-content .dx-button').length > 0, 'buttons are rendered');

        this.dropDownEditor.option('applyValueMode', 'instantly');
        this.dropDownEditor.close();
        this.dropDownEditor.open();

        assert.equal($('.dx-overlay-content .dx-button').length, 0, 'no buttons are rendered');
    });

    QUnit.test('OK/Cancel button should be shown dependent on applyValueMode option (T184179)', function(assert) {
        this.reinitFixture({ applyValueMode: 'instantly' });
        this.dropDownEditor.open();

        const $applyButton = $('.dx-popup-done.dx-button');
        const $cancelButton = $('.dx-popup-cancel.dx-button');

        assert.ok(!$applyButton.length);
        assert.ok(!$cancelButton.length);
    });

    QUnit.test('Render apply button', function(assert) {
        this.dropDownEditor.open();

        const $applyButton = $('.dx-popup-done.dx-button').eq(0);
        assert.equal($applyButton.length, 1);
        assert.equal($applyButton.find('.dx-button-text').text(), 'OK');
    });

    QUnit.test('Render apply button with custom text', function(assert) {
        this.reinitFixture({
            applyButtonText: 'Apply',
            applyValueMode: 'useButtons',
            dropDownOptions: { showTitle: true }
        });
        this.dropDownEditor.open();

        const $applyButton = $('.dx-popup-done.dx-button').eq(0);
        assert.equal($applyButton.find('.dx-button-text').text(), 'Apply');
    });

    QUnit.test('Apply button text changing', function(assert) {
        this.dropDownEditor.open();
        this.dropDownEditor.option({ applyButtonText: 'Apply', applyValueMode: 'useButtons' });

        const $applyButton = $('.dx-popup-done.dx-button').eq(0);
        assert.equal($applyButton.find('.dx-button-text').text(), 'Apply');
    });

    QUnit.test('Render cancel button', function(assert) {
        this.dropDownEditor.open();

        const $cancelButton = $('.dx-popup-cancel.dx-button').eq(0);
        assert.equal($cancelButton.length, 1);
        assert.equal($cancelButton.find('.dx-button-text').text(), 'Cancel');
    });

    QUnit.test('Render cancel button with custom text', function(assert) {
        this.reinitFixture({
            cancelButtonText: 'Discard',
            applyValueMode: 'useButtons',
            dropDownOptions: { showTitle: true }
        });
        this.dropDownEditor.open();

        const $cancelButton = $('.dx-popup-cancel.dx-button').eq(0);
        assert.equal($cancelButton.find('.dx-button-text').text(), 'Discard');
    });

    QUnit.test('Cancel button text changing', function(assert) {
        this.dropDownEditor.open();
        this.dropDownEditor.option({ cancelButtonText: 'Discard', applyValueMode: 'useButtons' });

        const $cancelButton = $('.dx-popup-cancel.dx-button').eq(0);
        assert.equal($cancelButton.find('.dx-button-text').text(), 'Discard');
    });

    QUnit.test('Clicking on buttons should close dropDown popup', function(assert) {
        this.dropDownEditor.open();

        const $applyButton = $('.dx-popup-done.dx-button').eq(0);
        const $cancelButton = $('.dx-popup-cancel.dx-button').eq(0);

        $applyButton.trigger('dxclick');
        assert.ok(!this.dropDownEditor.option('opened'), 'dropDown is closed after click on apply button');

        $cancelButton.trigger('dxclick');
        assert.ok(!this.dropDownEditor.option('opened'), 'dropDown is closed after click on cancel button');
    });

    QUnit.test('\'buttonsLocation\' option', function(assert) {
        this.reinitFixture({ applyValueMode: 'useButtons', buttonsLocation: 'bottom after' });

        this.dropDownEditor.open();
        assert.equal($('.dx-popup-bottom .dx-toolbar-after .dx-button').length, 2, 'buttons are rendered in \'toolbar-after\'');

        this.dropDownEditor.close();
        this.dropDownEditor.option('buttonsLocation', 'bottom before');
        this.dropDownEditor.open();
        assert.equal($('.dx-popup-bottom .dx-toolbar-before .dx-button').length, 2, 'buttons are rendered in \'toolbar-before\'');
    });
});

QUnit.module('actions', {
    beforeEach() {
        fx.off = true;
    },
    afterEach() {
        fx.off = false;
    }
}, () => {
    QUnit.test('onContentReady should fire when widget is readOnly', function(assert) {
        let contentReadyFired = 0;

        $('#dropDownEditorLazy').dxDropDownEditor({
            readOnly: true,
            onContentReady() {
                contentReadyFired++;
            },
            deferRendering: false
        });

        assert.equal(contentReadyFired, 1, 'content ready fired once');
    });

    QUnit.test('onOpened should fire when widget is readonly', function(assert) {
        const onOpenedActionStub = sinon.stub();
        const onClosedActionStub = sinon.stub();

        const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            readOnly: true,
            onOpened: onOpenedActionStub,
            onClosed: onClosedActionStub,
            deferRendering: false
        }).dxDropDownEditor('instance');

        dropDownEditor.open();
        assert.ok(onOpenedActionStub.called, 'onOpened action was fired');

        dropDownEditor.close();
        assert.ok(onClosedActionStub.called, 'onClosed action was fired');
    });

    QUnit.test('onOpened should fire when widget is disabled', function(assert) {
        const onOpenedActionStub = sinon.stub();
        const onClosedActionStub = sinon.stub();

        const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
            disabled: true,
            onOpened: onOpenedActionStub,
            onClosed: onClosedActionStub
        }).dxDropDownEditor('instance');

        dropDownEditor.open();
        assert.ok(onOpenedActionStub.called, 'onOpened action was fired');

        dropDownEditor.close();
        assert.ok(onClosedActionStub.called, 'onClosed action was fired');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor();
        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.attr('role'), 'combobox', 'aria role on input is correct');
        assert.strictEqual($dropDownEditor.attr('role'), undefined, 'aria role on element is not exist');
    });

    QUnit.test('aria-expanded property on input', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({ opened: true });
        const $input = $dropDownEditor.find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        const instance = $dropDownEditor.dxDropDownEditor('instance');

        assert.equal($input.attr('aria-expanded'), 'true', 'aria-expanded property on opened');

        instance.option('opened', false);
        assert.equal($input.attr('aria-expanded'), 'false', 'aria-expanded property on closed');
    });

    QUnit.test('aria-haspopup property on input', function(assert) {
        const $input = $('#dropDownEditorLazy').dxDropDownEditor().find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.attr('aria-haspopup'), 'true', 'haspopup attribute exists');
    });

    QUnit.test('aria-autocomplete property on input', function(assert) {
        const $input = $('#dropDownEditorLazy').dxDropDownEditor().find(`.${TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.attr('aria-autocomplete'), 'list', 'haspopup attribute exists');
    });

    QUnit.test('aria-owns should be removed when popup is not visible', function(assert) {
        const $dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({ opened: true });
        const instance = $dropDownEditor.dxDropDownEditor('instance');

        assert.notEqual($dropDownEditor.attr('aria-owns'), undefined, 'owns exists');
        assert.equal($dropDownEditor.attr('aria-owns'), $(`.${POPUP_CONTENT}`).attr('id'), 'aria-owns points to popup\'s content id');

        instance.close();

        assert.strictEqual($dropDownEditor.attr('aria-owns'), undefined, 'owns does not exist');
    });
});

