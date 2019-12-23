import $ from 'jquery';
import eventsEngine from 'events/core/events_engine';
import domUtils from 'core/utils/dom';
import devices from 'core/devices';
import pointerMock from '../../../helpers/pointerMock.js';
import keyboardMock from '../../../helpers/keyboardMock.js';
import caretWorkaround from './caretWorkaround.js';
import themes from 'ui/themes';
import config from 'core/config';

import 'ui/text_box/ui.text_editor';

const TEXTEDITOR_CLASS = 'dx-texteditor';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const DISABLED_CLASS = 'dx-state-disabled';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const CLEAR_BUTTON_SELECTOR = '.dx-clear-button-area';
const PLACEHOLDER_CLASS = 'dx-placeholder';

const EVENTS = [
    'FocusIn', 'FocusOut',
    'KeyDown', 'KeyPress', 'KeyUp',
    'Change', 'Cut', 'Copy', 'Paste', 'Input'
];

const moduleConfig = {
    beforeEach: () => {
        this.element = $('#texteditor').dxTextEditor({});
        this.input = this.element.find('.' + INPUT_CLASS);
        this.instance = this.element.dxTextEditor('instance');
        this.keyboard = keyboardMock(this.input);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
};

const prepareEvent = (eventName) => {
    const params = {};
    const name = eventName.toLowerCase();

    if(name.indexOf('key') !== -1) {
        params.key = '';
    }

    return $.Event(name, params);
};

QUnit.module('general', {}, () => {
    QUnit.test('markup init', (assert) => {
        const element = $('#texteditor').dxTextEditor();

        assert.ok(element.hasClass(TEXTEDITOR_CLASS));
        assert.equal(element.children().length, 1);
        assert.equal(element.find('.' + PLACEHOLDER_CLASS).length, 1);
        assert.equal(element.find('.' + INPUT_CLASS).length, 1);
        assert.equal(element.find('.' + CONTAINER_CLASS).length, 1);
    });

    QUnit.test('init with options', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            value: 'custom',
            placeholder: 'enter value',
            readOnly: true,
            tabIndex: 3
        });

        const input = element.find('.' + INPUT_CLASS);

        assert.equal(input.val(), 'custom');
        assert.equal(input.prop('placeholder') || element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'enter value');
        assert.equal(input.prop('readOnly'), true);
        assert.equal(input.prop('tabindex'), 3);
    });

    QUnit.test('init with focusStateEnabled = false', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            focusStateEnabled: false,
            tabIndex: 3
        });

        const input = element.find('.' + INPUT_CLASS);

        assert.equal(input.prop('tabindex'), -1);
    });

    QUnit.test('repaint() should not drop any elements without any widget option changing', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({
            showClearButton: true,
            mode: 'search'
        });

        const $contentElements = $textEditor.find('*');
        $textEditor.dxTextEditor('repaint');

        assert.equal($textEditor.find('*').length, $contentElements.length);
    });

    QUnit.test('value === 0 should be rendered on init', (assert) => {
        const $element = $('#texteditor').dxTextEditor({
            value: 0
        });

        const input = $element.find('.' + INPUT_CLASS);
        assert.equal(input.val(), '0', 'value rendered correctly');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', (assert) => {
        const handler = sinon.stub();

        const textEditor = $('#texteditor').dxTextEditor({
            onValueChanged: handler
        }).dxTextEditor('instance');

        textEditor.option('value', true);

        assert.ok(handler.calledOnce, 'Handler should be called once');
    });

    QUnit.test('tabIndex option change', (assert) => {
        const $element = $('#texteditor').dxTextEditor({
            tabIndex: 1
        });

        const instance = $element.dxTextEditor('instance');

        const input = $element.find('.' + INPUT_CLASS);

        instance.option('tabIndex', 4);
        assert.equal(input.prop('tabindex'), 4);
    });

    QUnit.test('Marking with \'focus\' CSS class', (assert) => {
        const $element = $('#texteditor').dxTextEditor();
        const instance = $element.dxTextEditor('instance');

        instance.focus();
        assert.ok($element.hasClass(STATE_FOCUSED_CLASS), 'Get \'focus\' CSS class when input get focus');

        instance.blur();
        assert.ok(!$element.hasClass(STATE_FOCUSED_CLASS), 'Loose \'focus\' CSS class when input loose focus');
    });

    QUnit.test('Marking with \'empty input\' CSS class', (assert) => {
        const $element = $('#texteditor').dxTextEditor();
        const $input = $('#texteditor input');
        const keyboard = keyboardMock($input);

        keyboard.type('foo');
        $input.trigger('input');
        assert.ok(!$element.hasClass(EMPTY_INPUT_CLASS), 'Has no \'empty input\' CSS class when input is not empty');

        $input.val('').trigger('input');
        assert.ok($element.hasClass(EMPTY_INPUT_CLASS), 'Has \'empty input\' CSS class when input is empty');
    });

    QUnit.test('render placeholder', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            placeholder: 'enter value'
        });

        const instance = element.dxTextEditor('instance');
        const input = element.find('input');
        const $placeholderDiv = element.find('.' + PLACEHOLDER_CLASS);

        assert.ok($placeholderDiv.length, 'placeholder div wrapper exists');
        assert.ok(element.hasClass('dx-texteditor-empty'));

        input.triggerHandler('focus');
        assert.ok(element.hasClass('dx-texteditor-empty'));
        input.triggerHandler('blur');

        input.triggerHandler('focus');
        instance.option('value', 'any value');
        input.triggerHandler('blur');

        assert.ok(!element.hasClass('dx-texteditor-empty'));

        assert.equal($placeholderDiv.attr('data-dx_placeholder'), 'enter value');

        instance.option('value', '');
        assert.ok(element.hasClass('dx-texteditor-empty'));
    });

    QUnit.test('render placeholder if value was set', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            value: 'test'
        });

        const $placeholder = element.find('.' + PLACEHOLDER_CLASS);

        assert.equal($placeholder.hasClass('dx-state-invisible'), true, 'placeholder is invisible');
    });

    QUnit.testInActiveWindow('placeholder pointerup event (T181734)', (assert) => {
        const $element = $('#texteditor').dxTextEditor({
            placeholder: 'enter value'
        });

        const $input = $element.find('input');
        const $placeholder = $element.find('.' + PLACEHOLDER_CLASS);

        $placeholder.trigger('dxpointerup');
        assert.ok($input.is(':focus'), 'input get focus on pointerup (needed for win8 native app)');
    });

    QUnit.testInActiveWindow('input is focused after click on the \'clear\' button', (assert) => {
        if(devices.real().win) { // TODO: check test after update wp8 on farm) {
            assert.ok(true, 'if window is inactive we do not test the case');
            return;
        }

        const $element = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'Text'
        });

        const $clearButton = $element.find('.dx-clear-button-area');
        const $input = $element.find('.dx-texteditor-input');

        const device = devices.real();

        if(device.platform === 'android' && device.version[0] <= 2) {
            assert.ok(true, 'this device do not support \'focus\' event correctly');
            return;
        }

        pointerMock($clearButton).click();
        assert.equal($input.val(), '', 'value was cleared');
        assert.ok($input.is(':focus'), 'input is focused');

        $input.val('Text');
        pointerMock($clearButton).click();
        assert.equal($input.val(), '', 'value was cleared again');
        assert.ok($input.is(':focus'), 'input is still focused');
    });

    QUnit.test('clearButton is rendered correctly', (assert) => {
        // NOTE: native clear button is missing for real IE9 (T202090)

        const $textEditor = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'text'
        });

        const $clearButton = $textEditor.find('.dx-clear-button-area');

        assert.equal($clearButton.length, 1, 'clearButton was rendered');
    });

    QUnit.test('dxTextEditor reset value after click on clearButton', (assert) => {
        const device = devices.real();
        if(device.platform === 'android' && device.version[0] <= 2) {
            assert.ok(true, 'this device do not support \'focus\' event correctly');
            return;
        }

        const $textEditor = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'text'
        });

        const $clearButton = $textEditor.find('.dx-clear-button-area');
        const $input = $textEditor.find('.dx-texteditor-input');

        $input.focus();

        pointerMock($clearButton).click();

        assert.equal($textEditor.dxTextEditor('option', 'value'), '', 'value reset');
    });

    QUnit.test('dxTextEditor should save focus after buttons option changed', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({ value: 'text' });
        const textEditor = $textEditor.dxTextEditor('instance');

        textEditor.focus();
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is focused');

        textEditor.option('buttons', [{ name: 'custom', location: 'after', options: { icon: 'box' } }]);
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is still focused');
    });

    QUnit.testInActiveWindow('dxTextEditor should save focus after inner buttons were clicked', (assert) => {
        const focusStub = sinon.stub();
        const blurStub = sinon.stub();
        const clickStub = sinon.stub();

        const $textEditor = $('#texteditor').dxTextEditor({
            onFocusIn: focusStub,
            onFocusOut: blurStub,
            buttons: [{
                name: 'test',
                options: {
                    onClick: clickStub,
                    icon: 'home'
                }
            }]
        });
        const textEditor = $textEditor.dxTextEditor('instance');
        const actionButtonElement = textEditor.getButton('test').element();

        textEditor.focus();
        assert.ok($textEditor.hasClass('dx-state-focused'), 'widget have focused class');
        assert.strictEqual(focusStub.callCount, 1, 'FocusIn event has been triggered');
        assert.strictEqual(blurStub.callCount, 0, 'FocusOut event has not been triggered');
        assert.strictEqual(clickStub.callCount, 0, 'action button is not clicked');

        $(actionButtonElement).trigger('dxclick');
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is still focused');
        assert.strictEqual(focusStub.callCount, 1, 'new FocusIn event has not been triggered');
        assert.strictEqual(blurStub.callCount, 0, 'FocusOut event has not been triggered');
        assert.strictEqual(clickStub.callCount, 1, 'action button is clicked');
    });

    QUnit.testInActiveWindow('dxTextEditor should save focus after inner buttons were focused', (assert) => {
        const focusStub = sinon.stub();
        const blurStub = sinon.stub();

        const $textEditor = $('#texteditor').dxTextEditor({
            onFocusIn: focusStub,
            onFocusOut: blurStub,
            buttons: [{
                name: 'test',
                options: {
                    icon: 'home'
                }
            }]
        });
        const textEditor = $textEditor.dxTextEditor('instance');
        const actionButton = textEditor.getButton('test');

        textEditor.focus();
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is focused');
        assert.strictEqual(focusStub.callCount, 1, 'FocusIn event has been triggered');
        assert.strictEqual(blurStub.callCount, 0, 'FocusOut event has not been triggered');

        actionButton.focus();
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is still focused');
        assert.strictEqual(focusStub.callCount, 1, 'new FocusIn event has not been triggered');
        assert.strictEqual(blurStub.callCount, 0, 'FocusOut event has not been triggered');
    });

    QUnit.test('T220209 - the \'valueFormat\' option', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({
            value: 'First',
            valueFormat(value) {
                return value + ' format';
            }
        });

        assert.equal($textEditor.dxTextEditor('option', 'value'), 'First', 'value is correct');
        assert.equal($textEditor.find('.dx-texteditor-input').val(), 'First format', 'input value is correct');
    });

    QUnit.test('T220209 - the \'valueFormat\' option when value is changed using keyboard', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({
            value: 'First',
            valueFormat(value) {
                return value + ' format';
            }
        });

        const $input = $textEditor.find('.dx-texteditor-input');

        keyboardMock($input)
            .press('end')
            .type('2');

        $input.trigger('change');

        assert.equal($textEditor.dxTextEditor('option', 'value'), 'First format2', 'value is correct');
        assert.equal($textEditor.find('.dx-texteditor-input').val(), 'First format2 format', 'input value is correct');
    });

    QUnit.test('default valueFormat of null should return an empty string', (assert) => {
        const textEditor = $('#texteditor').dxTextEditor({}).dxTextEditor('instance');
        const valueFormat = textEditor.option('valueFormat');

        assert.strictEqual(valueFormat(null), '', 'null value formatted correctly');
        assert.strictEqual(valueFormat(0), 0, '0 value formatted correctly');
        assert.strictEqual(valueFormat(), '', 'undefined value formatted correctly');
        assert.strictEqual(valueFormat(false), '', 'false value formatted correctly');
        assert.strictEqual(valueFormat(''), '', 'empty value formatted correctly');
    });

    QUnit.test('dxTextEditor with height option should have min-height auto style on input', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({
            height: 50,
            value: 'First'
        });

        const $input = $textEditor.find('.dx-texteditor-input');

        assert.equal($input.get(0).style.minHeight, '0px', 'min-height inline style is defined');
    });

    QUnit.test('dxTextEditor with wrong stylingMode option should set the class according to default option value', (assert) => {
        let $textEditor = $('#texteditor').dxTextEditor({
            stylingMode: 'someWrongOptionValue'
        });

        assert.ok($textEditor.hasClass('dx-editor-outlined'));
    });

    QUnit.test('dxTextEditor with wrong stylingMode option should set the class according to default option value (platform specific)', (assert) => {
        const realIsMaterial = themes.isMaterial;
        themes.isMaterial = () => {
            return true;
        };

        const $textEditor = $('#texteditor').dxTextEditor({
            stylingMode: 'someWrongOptionValue'
        });

        assert.ok($textEditor.hasClass('dx-editor-underlined'));

        themes.isMaterial = realIsMaterial;
    });
});

QUnit.module('text option', moduleConfig, () => {
    QUnit.test('Typing in input should affext \'text\' option, but not \'value\'', (assert) => {
        const textEditor = $('#texteditor').dxTextEditor({
            value: 'original'
        }).dxTextEditor('instance');

        this.keyboard.caret(8).type('123');

        assert.equal(textEditor.option('value'), 'original', 'value should not change by default');
        assert.equal(textEditor.option('text'), 'original123', 'text should reflect user input');
    });

    QUnit.test('\'Text\' option should not be \'undefined\'', (assert) => {
        const textEditor = $('#texteditor').dxTextEditor({
            value: 'original'
        }).dxTextEditor('instance');

        assert.equal(textEditor.option('text'), 'original', 'text option set correctly');

        textEditor.option('value', 'not original');

        assert.equal(textEditor.option('text'), 'not original', 'text set correctly again');
    });
});

QUnit.module('the \'name\' option', {}, () => {
    QUnit.test('widget input should get the \'name\' attribute with a correct value', (assert) => {
        const expectedName = 'some_name';

        const $element = $('#texteditor').dxTextEditor({
            name: expectedName
        });

        const $input = $element.find('.' + INPUT_CLASS);

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

QUnit.module('options changing', moduleConfig, () => {
    QUnit.test('value', (assert) => {
        this.instance.option('value', '123');
        assert.equal(this.input.val(), '123');

        this.instance.option('value', '321');
        assert.equal(this.input.val(), '321');
    });

    QUnit.test('the \'inputAttr\' option', (assert) => {
        let $div1;
        let $div2;

        try {
            $div1 = $('<div>', { id: 'testDiv1' }).appendTo($(document.body));
            $div2 = $('<div>', { id: 'testDiv1' }).appendTo($(document.body));

            const instance1 = $div1.dxTextEditor({ inputAttr: { 'data-test': 'test' } }).dxTextEditor('instance');
            const instance2 = $div2.dxTextEditor().dxTextEditor('instance');
            const $input1 = $div1.find('input');

            assert.ok(typeof (instance2.option('inputAttr')) === 'object' && $.isEmptyObject(instance2.option('inputAttr')), 'Option is {} by default');
            assert.strictEqual(instance1.option('inputAttr')['data-test'], 'test', 'Option sets to the widget on init');
            assert.strictEqual($input1.attr('data-test'), 'test', 'Option sets to the widget input on init');

            instance1.option('inputAttr', { 'data-test': 'changedValue', 'data-anyattr': 'anyvalue' });

            assert.strictEqual($input1.attr('data-test'), 'changedValue', 'Attr was changed by API');
            assert.strictEqual($input1.attr('data-anyattr'), 'anyvalue', 'New attr was set by API');
        } finally {
            $div1.remove();
            $div2.remove();
        }
    });

    QUnit.test('name option should not conflict with inputAttr.name option', (assert) => {
        this.instance.option('inputAttr', { name: 'some_name' });

        assert.equal(this.input.attr('name'), 'some_name', 'inputAttr should be applied');

        this.instance.option('name', 'new_name');
        assert.equal(this.input.attr('name'), 'new_name', 'inputAttr should be redefined by name');

        this.instance.option('name', '');
        assert.equal(this.input.attr('name'), 'some_name', 'inputAttr should be restored');

        this.instance.option('inputAttr', { name: null });
        assert.notOk(this.input.get(0).hasAttribute('name'), 'name attribute has been removed');

        this.instance.option('name', 'test_name');
        assert.equal(this.input.attr('name'), 'test_name', 'name should be applied');

        this.instance.option('name', '');
        assert.notOk(this.input.get(0).hasAttribute('name'), 'name attribute has been removed');
    });

    QUnit.test('the \'inputAttr\' option should preserve widget specific classes', (assert) => {
        const $element = $('<div>').appendTo('body');

        try {
            $element.dxTextEditor({ inputAttr: { class: 'some-class' } });
            assert.equal($element.find('.' + INPUT_CLASS).length, 1, 'widget specific class is preserved');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('the \'inputAttr\' option should affect only custom classes on change', (assert) => {
        const firstClassName = 'first';
        const secondClassName = 'second';

        this.instance.option('inputAttr', { class: firstClassName });

        const $input = this.element.find('.' + INPUT_CLASS);
        assert.equal($input.length, 1, 'widget specific class is preserved');
        assert.ok($input.hasClass(firstClassName), 'first custom class is added');

        this.instance.option('inputAttr', { class: secondClassName });
        assert.equal($input.length, 1, 'widget specific class is preserved');
        assert.ok($input.hasClass(secondClassName), 'second custom class is added');
        assert.notOk($input.hasClass(firstClassName), 'first custom class is removed');
    });

    QUnit.test('autocomplete is disabled by default', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({});

        assert.equal($textEditor.find('input').attr('autocomplete'), 'off', 'autocomplete prop is disabled by default');

        $textEditor.dxTextEditor('option', 'inputAttr', { 'autocomplete': 'on' });

        assert.equal($textEditor.find('input').attr('autocomplete'), 'on', 'autocomplete attr overwritten');
    });

    QUnit.test('valueChangeEvent', (assert) => {
        this.instance.option('valueChangeEvent', 'blur');

        this.keyboard.type('123');
        assert.equal(this.instance.option('value'), '');

        this.input.triggerHandler('blur');
        assert.equal(this.instance.option('value'), '123');

        this.input.val('');

        this.instance.option('valueChangeEvent', 'change');
        this.keyboard.type('321');
        assert.equal(this.instance.option('value'), '123');

        this.input.triggerHandler('change');
        assert.equal(this.instance.option('value'), '321');
    });

    QUnit.test('onValueChanged callback', (assert) => {
        let called = 0;

        this.instance.option('onValueChanged', () => {
            called++;
        });

        this.keyboard
            .type('123')
            .change();
        assert.equal(called, 1);

        this.instance.option('valueChangeEvent', 'keyup');
        this.keyboard
            .type('123');
        assert.equal(called, 4);
    });

    QUnit.test('onValueChanged callback shouldn\'t have event if value was changed programmatically', (assert) => {
        const textEditor = $('#texteditor').dxTextEditor({
            valueChangeEvent: 'keyup change',
        }).dxTextEditor('instance');

        this.keyboard
            .type('123')
            .change();

        textEditor.option('onValueChanged', args => {
            assert.equal(args.event, undefined, 'Event wasn\'t passed to callback');
        });

        textEditor.option('value', 'value is set programmatically');
    });

    QUnit.test('disabled', (assert) => {
        this.instance.option('disabled', true);
        assert.ok(this.input.prop('disabled'));

        this.instance.option('disabled', false);
        assert.ok(!this.input.prop('disabled'));
    });

    QUnit.test('focusStateEnabled', (assert) => {
        this.instance.option('focusStateEnabled', false);
        assert.equal(this.input.prop('tabIndex'), -1);

        this.instance.option('focusStateEnabled', true);
        assert.ok(!this.input.prop('tabIndex'));
    });

    QUnit.test('spellcheck', (assert) => {
        this.instance.option('spellcheck', true);
        assert.ok(this.input.prop('spellcheck'));

        this.instance.option('spellcheck', false);
        assert.ok(!this.input.prop('spellcheck'));
    });

    QUnit.test('placeholder', (assert) => {
        this.instance.option('placeholder', 'John Doe');
        assert.equal(this.element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Doe');

        this.instance.option('placeholder', 'John Jr. Doe');
        assert.equal(this.element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Jr. Doe');
    });

    QUnit.test('readOnly', (assert) => {
        this.instance.option('readOnly', true);
        assert.ok(this.input.prop('readOnly'));

        this.instance.option('readOnly', false);
        assert.equal(this.input.prop('readOnly'), false);
    });

    QUnit.test('event handler callbacks', (assert) => {
        const input = this.input;
        let called = 0;
        const options = {};

        const eventHandler = e => {
            called = e.event.type;
        };

        $.each(EVENTS, (index, event) => {
            options['on' + event] = eventHandler;
        });

        this.element.dxTextEditor(options);

        assert.equal(called, 0, 'when start, testID = 0');

        $.each(EVENTS, (index, eventName) => {
            if(eventName.indexOf('Focus') !== -1) {
                const methodName = eventName === 'FocusIn' ? 'focus' : 'blur';
                this.instance[methodName]();
            } else {
                input.trigger(prepareEvent(eventName));
            }

            assert.equal(called, eventName.toLowerCase(), eventName + ' event handler callback trigger');
        });
    });

    QUnit.test('events should be fired in readOnly state', (assert) => {
        const input = this.input;
        let called;
        const options = { readOnly: true };

        const eventHandler = e => {
            called = e.event.type;
        };

        $.each(EVENTS, (index, event) => {
            options['on' + event] = eventHandler;
        });

        this.element.dxTextEditor(options);

        $.each(EVENTS, (index, eventName) => {
            if(eventName.indexOf('Focus') !== -1) {
                const methodName = eventName === 'FocusIn' ? 'focus' : 'blur';
                this.instance[methodName]();
            } else {
                input.trigger(prepareEvent(eventName));
            }

            assert.equal(called, eventName.toLowerCase(), eventName + ' event handler callback trigger');
        });
    });

    QUnit.test('editor should have actual value in the event handler when this event included into valueChangeEvent', (assert) => {
        const $textBox = this.element;
        const textBox = $textBox.dxTextEditor('instance');
        const input = this.input;

        const options = {
            valueChangeEvent: EVENTS.join(' ').toLowerCase()
        };

        const eventHandler = (index, eventName) => {
            assert.equal(textBox.option('value'), index, 'actual value provided in ' + eventName);
        };

        $.each(EVENTS, (index, eventName) => {
            options['on' + eventName] = () => {
                eventHandler(index + 1, eventName);
            };
        });

        $textBox.dxTextEditor(options);

        $.each(EVENTS, (index, eventName) => {
            input.val(index + 1);

            input.trigger(prepareEvent(eventName));
        });
    });

    QUnit.test('Click on \'clear\' button', (assert) => {
        const $element = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'foo'
        });

        const $input = $element.find('input');
        const instance = $element.dxTextEditor('instance');
        let eventWasHandled = 0;

        const handleValueUpdateEvent = () => {
            ++eventWasHandled;
        };

        const clock = sinon.useFakeTimers();

        assert.ok(!$element.hasClass(EMPTY_INPUT_CLASS), 'Element has NO \'empty input\' CSS class');

        instance.option('onValueChanged', handleValueUpdateEvent);
        pointerMock($element.find('.dx-clear-button-area')).click();
        clock.tick(10);
        assert.ok($input.val() === '', 'Click on \'clear\' button causes input value reset');
        assert.ok($element.hasClass(EMPTY_INPUT_CLASS), 'Click on \'clear\' button causes marking with \'empty input\' CSS class');
        assert.equal(1, eventWasHandled, 'Click on \'clear\' button rises value update event');
        clock.restore();
    });

    QUnit.test('\'Clear\' button visibility depends on value', (assert) => {
        const $element = $('#texteditor').dxTextEditor({ showClearButton: true, value: 'foo' });
        const instance = $element.dxTextEditor('instance');
        const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);

        caretWorkaround($element.find('input'));

        assert.ok($clearButton.is(':visible'), 'TextEditor has clear button');
        instance.option('value', '');
        assert.ok($clearButton.is(':hidden'), 'TextEditor has NO clear button');
        instance.option('value', 'bar');
        assert.ok($clearButton.is(':visible'), 'TextEditor has clear button again');
    });

    QUnit.test('clear button should disappear when text changed without value change', (assert) => {
        const $element = $('#texteditor').dxTextEditor({ showClearButton: true, value: '' });
        const instance = $element.dxTextEditor('instance');
        const $input = $element.find('.' + INPUT_CLASS);
        const kb = keyboardMock($input);

        kb.type('123');
        const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);
        $clearButton.trigger('dxclick');

        assert.strictEqual($input.val(), '', 'input value is correct');
        assert.strictEqual(instance.option('text'), '', 'text option is correct');
        assert.strictEqual(instance.option('value'), '', 'value is correct');
        assert.notOk($clearButton.is(':visible'), 'clear button was hidden');
    });

    QUnit.test('click on clear button should not reset active focus (T241583)', (assert) => {
        const $element = $('#texteditor').dxTextEditor({ showClearButton: true, value: 'foo' });
        const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);

        const dxPointerDown = $.Event('dxpointerdown');
        dxPointerDown.pointerType = 'mouse';

        $clearButton.on('dxpointerdown', e => {
            assert.ok(e.isDefaultPrevented());
        }).trigger(dxPointerDown);
    });

    QUnit.test('click on clear button should raise input event (T521817)', (assert) => {
        const onInputStub = sinon.stub();

        const $element = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'foo',
            onInput: onInputStub
        });

        $element
            .find(CLEAR_BUTTON_SELECTOR)
            .first()
            .trigger('dxclick');

        assert.ok(onInputStub.calledOnce, 'onInput was called once');
    });

    QUnit.test('tap on clear button should reset value (T310102)', (assert) => {
        const $element = $('#texteditor').dxTextEditor({ showClearButton: true, value: 'foo' });
        const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);

        const dxPointerDown = $.Event('dxpointerdown');
        dxPointerDown.pointerType = 'touch';
        $clearButton.on('dxpointerdown', e => {
            assert.ok(!e.isDefaultPrevented());
        }).trigger(dxPointerDown);
    });

    QUnit.test('tap on clear button should not raise onValueChange event (T812448)', (assert) => {
        const valueChangeStub = sinon.stub();

        const $element = $('#texteditor').dxTextEditor({
            showClearButton: true,
            onValueChanged: valueChangeStub
        });
        const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);
        const kb = this.keyboard;
        kb.type('clear');
        assert.equal(this.input.val(), 'clear', 'texteditor has correct value');

        const dxPointerDown = $.Event('dxpointerdown');
        dxPointerDown.pointerType = 'touch';
        $clearButton.on('dxpointerdown', e => {
            assert.strictEqual(this.input.val(), '', 'texteditor is empty');
        }).trigger(dxPointerDown);

        kb.type('change')
            .change();
        assert.ok(valueChangeStub.calledOnce, 'onValueChanged was called once');
    });

    QUnit.test('texteditor is clear when option \'value\' changed to null', (assert) => {
        const instance = $('#texteditor').dxTextEditor({
            value: 'test'
        }).dxTextEditor('instance');

        instance.option('value', null);
        assert.equal($('.' + EMPTY_INPUT_CLASS).length, 1, 'texteditor is empty');
    });

    QUnit.testInActiveWindow('focusIn and focusOut fired after enable disable state', (assert) => {
        let focusInCount = 0;
        let focusOutCount = 0;
        const $textEditor = $('#texteditor').dxTextEditor({
            onFocusIn() {
                focusInCount++;
            },
            onFocusOut() {
                focusOutCount++;
            }
        });

        const textEditor = $textEditor.dxTextEditor('instance');
        textEditor.option('disabled', true);
        textEditor.option('disabled', false);

        textEditor.focus();
        textEditor.blur();

        assert.equal(focusInCount, 1, 'focusin fired once');
        assert.equal(focusOutCount, 1, 'focusout fired once');
    });

    QUnit.testInActiveWindow('Remove .dx-state-focused class after disabled of the element', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor();

        $textEditor
            .find('input')
            .focus();

        const instance = $textEditor.dxTextEditor('instance');

        instance.option('disabled', true);

        assert.ok($textEditor.hasClass('dx-state-disabled'), 'dx-state-disabled are applied');
        assert.ok(!$textEditor.hasClass('dx-state-focused'), 'dx-state-focused was removed');
    });

    QUnit.test('texteditor get \'stylingMode\' option from global config', (assert) => {
        config({ editorStylingMode: 'underlined' });
        const container = $('<div>');
        const instance = container.dxTextEditor().dxTextEditor('instance');

        const stylingMode = instance.option('stylingMode');
        assert.equal(stylingMode, 'underlined', 'default changed by global config');
        container.remove();
        config({ editorStylingMode: null });
    });

    QUnit.test('texteditor \'stylingMode\' option: runtime change', (assert) => {
        this.element = $('#texteditor');
        assert.equal(this.element.hasClass('dx-editor-outlined'), true, 'initial value is right');

        this.instance.option('stylingMode', 'underlined');
        assert.equal(this.element.hasClass('dx-editor-underlined'), true, 'right class after option change present');
        assert.equal(this.element.hasClass('dx-editor-outlined'), false, 'old class after option change was removed');
    });

    QUnit.test('the "value" option should changed by pressing Ctrl+Enter', function(assert) {
        const valueChangedStub = sinon.stub();
        const changeStub = sinon.stub();

        this.instance.on('valueChanged', valueChangedStub);
        this.instance.on('change', changeStub);
        this.keyboard
            .type('123')
            .triggerEvent('keydown', { key: 'Enter', ctrlKey: true });

        assert.strictEqual(this.instance.option('value'), '123');
        assert.ok(valueChangedStub.calledOnce);
        assert.ok(changeStub.calledOnce);

        this.keyboard.triggerEvent('keydown', { key: 'Enter', ctrlKey: true });
        assert.ok(valueChangedStub.calledOnce, 'there is no extra calls');
        assert.ok(changeStub.calledOnce, 'there is no extra calls');
    });
});

QUnit.module('api', moduleConfig, () => {
    QUnit.test('focus method', (assert) => {
        const input = this.input.get(0);
        const focusSpy = sinon.spy(eventsEngine, 'trigger').withArgs(sinon.match($element => {
            return ($element.get && $element.get(0) || $element) === input;
        }), 'focus');

        this.instance.focus();
        assert.ok(focusSpy.called);
    });

    QUnit.test('blur method', (assert) => {
        const done = assert.async();
        this.instance.focus();

        const originalResetActiveElement = domUtils.resetActiveElement;
        domUtils.resetActiveElement = () => {
            assert.ok(true);

            domUtils.resetActiveElement = originalResetActiveElement;
            done();
        };

        this.instance.blur();
    });

    QUnit.test('onValueChanged fired only when value is changed', (assert) => {
        const textBox = this.instance;
        const $input = this.input;

        let valueChangeCounter = 0;
        textBox.option({
            valueChangeEvent: 'keydown',
            onValueChanged() {
                valueChangeCounter++;
            }
        });

        $input.trigger($.Event('keydown', { key: 'Tab' }));

        assert.equal(valueChangeCounter, 0, 'onValueChanged not fired');
    });

    QUnit.test('reset()', (assert) => {
        const textBox = this.instance;
        // act
        textBox.reset();
        // assert
        assert.strictEqual(textBox.option('value'), '', 'Value should be reset');
    });

    QUnit.test('onFocusOut and other events fired after value was changed', (assert) => {
        const textEditor = this.instance;
        const keyboard = this.keyboard;
        let valueOnFocusOut = '';
        let valueOnValueChange = '';

        textEditor.option({
            onFocusOut(e) {
                valueOnFocusOut = e.component.option('value');
            },
            onValueChanged(e) {
                valueOnValueChange = e.component.option('value');
            }
        });

        textEditor.option('valueChangeEvent', 'focusout');

        const typedString = 'test';
        keyboard.type(typedString);
        textEditor.blur();

        assert.equal(valueOnFocusOut, typedString, 'focusout fired after value was changed');
        assert.equal(valueOnValueChange, typedString, 'valueChangeEvent fired after value was changed');
    });

    QUnit.test('enterKey event', (assert) => {
        const enterKeyEvent = sinon.stub();

        const textBox = this.instance;

        textBox.on('enterKey', enterKeyEvent);

        this.keyboard.keyUp('enter');

        assert.equal(enterKeyEvent.called, true, 'enterKey was fired');
    });

    QUnit.test('events work when relevant actions is not set', (assert) => {
        assert.expect(12);
        const textBox = this.instance;
        const keyboard = this.keyboard;

        textBox.on('keyDown', e => {
            assert.equal(e.component, textBox, 'event has link on component');
            assert.equal($(e.element).get(0), textBox.$element().get(0), 'event has link on element');
            assert.equal(e.event.type, 'keydown', 'event has related Event');
            assert.ok(true, 'keyDown was fired');
        });

        textBox.on('keyPress', e => {
            assert.equal(e.component, textBox, 'event has link on component');
            assert.equal($(e.element).get(0), textBox.$element().get(0), 'event has link on element');
            assert.equal(e.event.type, 'keypress', 'event has related Event');
            assert.ok(true, 'keyPress was fired');
        });

        textBox.on('keyUp', e => {
            assert.equal(e.component, textBox, 'event has link on component');
            assert.equal($(e.element).get(0), textBox.$element().get(0), 'event has link on element');
            assert.equal(e.event.type, 'keyup', 'event has related Event');
            assert.ok(true, 'keyUp was fired');
        });

        keyboard.type('x');
    });

    QUnit.test('events supports chains', (assert) => {
        assert.expect(3);
        const textBox = this.instance;
        const keyboard = this.keyboard;

        textBox.on('keyDown', e => {
            assert.ok(true, 'keyDown was fired');
        }).on('keyPress', e => {
            assert.ok(true, 'keyPress was fired');
        }).on('keyUp', e => {
            assert.ok(true, 'keyUp was fired');
        });

        keyboard.type('x');
    });

    QUnit.test('event should be fired once when there are multiple subscriptions', (assert) => {
        const textBox = this.instance;
        const keyboard = this.keyboard;
        const keyDownSpy = sinon.spy();
        const keyUpSpy = sinon.spy();

        textBox.on('keyDown', keyDownSpy);
        textBox.on('keyDown', keyDownSpy);

        textBox.option('onKeyUp', keyUpSpy);
        textBox.on('keyUp', keyUpSpy);

        keyboard.type('x');

        assert.equal(keyDownSpy.callCount, 2, 'keyDown event handled twice');
        assert.equal(keyUpSpy.callCount, 2, 'keyUp event handled twice');
    });
});

QUnit.module('regressions', moduleConfig, () => {
    QUnit.test('event handlers are not set', (assert) => {
        assert.expect(0);

        const EVENTS = [
            'focusIn', 'focusOut',
            'keyDown', 'keyPress', 'keyUp',
            'change'
        ];

        const input = this.input;

        this.element.dxTextEditor({});

        $.each(EVENTS, (index, eventName) => {
            input.trigger(prepareEvent(eventName));
        });
    });

    QUnit.test('B233344 dxNumberbox/dxTextbox/dxDatebox - Incorrect changing of \'disabled\' option', (assert) => {
        this.instance.option('disabled', true);
        assert.ok(this.element.hasClass(DISABLED_CLASS));

        this.instance.option('disabled', true);
        assert.ok(this.element.hasClass(DISABLED_CLASS));

        this.instance.option('disabled', false);
        assert.ok(!this.element.hasClass(DISABLED_CLASS));

        this.instance.option('disabled', false);
        assert.ok(!this.element.hasClass(DISABLED_CLASS));
    });

    QUnit.test('B233277 dxNumberbox/dxTextbox - cursor jump over the right digit, impossible to remove all digits after the cursor moving', (assert) => {
        this.instance.option('valueChangeEvent', 'keyup');
        keyboardMock(this.element.find('.' + INPUT_CLASS))
            .type('123')
            .press('left')
            .type('4')
            .press('backspace');
        assert.equal(this.instance.option('value'), '123');
    });

    QUnit.test('Text editor should propagate keyboard events to the document', (assert) => {
        const keydownHandler = sinon.spy();
        eventsEngine.on(document, 'keydown', keydownHandler);

        keyboardMock(this.input)
            .keyDown('enter')
            .keyDown('space')
            .keyDown('left')
            .keyDown('right');

        assert.equal(keydownHandler.callCount, 4, 'keydown was handled 4 times');
    });

    QUnit.test('Enter key event raising (B238135)', (assert) => {
        const handler = sinon.stub();

        $('#texteditor').dxTextEditor({
            onEnterKey: handler
        }).dxTextEditor('instance');

        $('#texteditor input').trigger($.Event('keyup', { key: 'Enter' }));

        assert.ok(handler.calledOnce, 'event raised');
        assert.ok(handler.getCall(0).args[0].event, 'event args have Event prop');
    });

    QUnit.test('Enter key event changing handler (B238135)', (assert) => {
        const instance = $('#texteditor').dxTextEditor({}).dxTextEditor('instance');
        let once = true;

        instance.option('onEnterKey', e => {
            if(once) {
                assert.ok(true, 'Raising changed handler');
                once = false;
            } else {
                assert.ok(false, 'Raise after unsubscribe!');
            }
        });

        const keyUpEvent = $.Event('keyup', { key: 'Enter' });

        $('#texteditor input').trigger(keyUpEvent);

        instance.option('onEnterKey', null);

        $('#texteditor input').trigger(keyUpEvent);
    });

    QUnit.test('Enter key action is not fired is widget is disposed', (assert) => {
        const enterKeyStub = sinon.stub();
        const keyUpStub = sinon.stub();
        const keyDownStub = sinon.stub();
        const keyPressStub = sinon.stub();

        const $textEditor = $('#texteditor').dxTextEditor({
            onEnterKey: enterKeyStub,
            onKeyUp: keyUpStub,
            onKeyDown: keyDownStub,
            onKeyPress: keyPressStub
        });

        const $input = $textEditor.find('input');
        const instance = $textEditor.dxTextEditor('instance');

        const disposed = instance._disposed;
        instance._disposed = true;

        try {
            $input.trigger($.Event('keyup', { key: 'Enter' }));
            assert.ok(!enterKeyStub.called, 'enter key action should not be called');
            assert.ok(!keyUpStub.called, 'key up action should not be called');
            assert.ok(!keyDownStub.called, 'key down action should not be called');
            assert.ok(!keyPressStub.called, 'key press action should not be called');
        } finally {
            instance._disposed = disposed;
        }
    });

    QUnit.test('Placeholder text should be hidden when value is set (T124525)', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({
            placeholder: 'test',
            value: 'val'
        });

        const $placeholder = $textEditor.find('.' + PLACEHOLDER_CLASS);

        assert.equal($placeholder.hasClass('dx-state-invisible'), true, 'display none was attached as inline style');
    });
});
