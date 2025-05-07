import $ from 'jquery';
import eventsEngine from 'common/core/events/core/events_engine';
import domUtils from '__internal/core/utils/m_dom';
import devices from '__internal/core/m_devices';
import pointerMock from '../../../helpers/pointerMock.js';
import keyboardMock from '../../../helpers/keyboardMock.js';
import caretWorkaround from './caretWorkaround.js';
import themes from 'ui/themes';
import config from 'core/config';
import consoleUtils from 'core/utils/console';
import { normalizeKeyName } from 'common/core/events/utils/index';
import { getWidth, implementationsMap } from 'core/utils/size';

import TextEditor from '__internal/ui/text_box/m_text_editor';
import { TextEditorLabel } from '__internal/ui/text_box/m_text_editor.label';

const TEXTEDITOR_CLASS = 'dx-texteditor';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const DISABLED_CLASS = 'dx-state-disabled';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const CLEAR_BUTTON_SELECTOR = '.dx-clear-button-area';
const PLACEHOLDER_CLASS = 'dx-placeholder';
const LABEL_CLASS = 'dx-texteditor-label';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';

const EVENTS = [
    'FocusIn', 'FocusOut',
    'KeyDown', 'KeyUp',
    'Change', 'Cut', 'Copy', 'Paste', 'Input'
];

const LABEL_MODES = ['outside', 'static', 'floating'];

const moduleConfig = {
    beforeEach: function() {
        this.element = $('#texteditor').dxTextEditor({});
        this.input = this.element.find('.' + INPUT_CLASS);
        this.instance = this.element.dxTextEditor('instance');
        this.keyboard = keyboardMock(this.input);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
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
    QUnit.test('markup init', function(assert) {
        const element = $('#texteditor').dxTextEditor();

        assert.ok(element.hasClass(TEXTEDITOR_CLASS));
        assert.equal(element.children().length, 1);
        assert.equal(element.find('.' + PLACEHOLDER_CLASS).length, 1);
        assert.equal(element.find('.' + INPUT_CLASS).length, 1);
        assert.equal(element.find('.' + CONTAINER_CLASS).length, 1);
    });

    QUnit.test('init with options', function(assert) {
        const element = $('#texteditor').dxTextEditor({
            value: 'custom',
            placeholder: 'enter value',
            readOnly: true,
            tabIndex: 3
        });

        const input = element.find('.' + INPUT_CLASS);

        assert.equal(input.val(), 'custom');
        assert.equal(element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'enter value');
        assert.equal(input.prop('readOnly'), true);
        assert.equal(input.prop('tabindex'), 3);
    });

    QUnit.test('init with focusStateEnabled = false', function(assert) {
        const element = $('#texteditor').dxTextEditor({
            focusStateEnabled: false,
            tabIndex: 3
        });

        const input = element.find('.' + INPUT_CLASS);

        assert.equal(input.prop('tabindex'), -1);
    });

    QUnit.test('repaint() should not drop any elements without any widget option changing', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            showClearButton: true,
            mode: 'search'
        });

        const $contentElements = $textEditor.find('*');
        $textEditor.dxTextEditor('repaint');

        assert.equal($textEditor.find('*').length, $contentElements.length);
    });

    QUnit.test('reset should clear input value, value and text options, if value was not changed', function(assert) {
        assert.expect(9);

        const $element = $('#texteditor').dxTextEditor();
        const instance = $element.dxTextEditor('instance');
        const $input = $element.find(`.${INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        const initialState = { input: '', value: '', text: '' };
        const afterTypingState = { input: 'test', value: '', text: 'test' };

        const getter = {
            input: () => $input.val(),
            value: () => instance.option('value'),
            text: () => instance.option('text'),
        };

        const check = (expected, message) => {
            Object.keys(expected).forEach(prop => {
                assert.strictEqual(getter[prop](), expected[prop], `${prop} is '${expected[prop]}' ${message}`);
            });
        };

        check(initialState, 'before typing');

        keyboard.type('test');
        check(afterTypingState, 'after typing');

        instance.reset();
        check(initialState, 'after reset');
    });


    QUnit.test('reset should clear input value, value and text options, if value was changed', function(assert) {
        assert.expect(9);

        const $element = $('#texteditor').dxTextEditor();
        const instance = $element.dxTextEditor('instance');
        const $input = $element.find(`.${INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        const essences = [
            { name: 'input value', get: () => $input.val() },
            { name: 'value option', get: () => instance.option('value') },
            { name: 'text option', get: () => instance.option('text') },
        ];

        const check = (expected, message) => {
            essences.forEach(essence => {
                assert.strictEqual(essence.get(), expected, `${essence.name} ${message}`);
            });
        };

        check('', 'is empty before typing');

        keyboard.type('test');
        $input.trigger('change');

        check('test', 'is present after typing');

        instance.reset();

        check('', 'is absent after reset');
    });

    QUnit.test('value === 0 should be rendered on init', function(assert) {
        const $element = $('#texteditor').dxTextEditor({
            value: 0
        });

        const input = $element.find('.' + INPUT_CLASS);
        assert.equal(input.val(), '0', 'value rendered correctly');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        const handler = sinon.stub();

        const textEditor = $('#texteditor').dxTextEditor({
            onValueChanged: handler
        }).dxTextEditor('instance');

        textEditor.option('value', true);

        assert.ok(handler.calledOnce, 'Handler should be called once');
    });

    QUnit.test('tabIndex option change', function(assert) {
        const $element = $('#texteditor').dxTextEditor({
            tabIndex: 1
        });

        const instance = $element.dxTextEditor('instance');

        const input = $element.find('.' + INPUT_CLASS);

        instance.option('tabIndex', 4);
        assert.equal(input.prop('tabindex'), 4);
    });

    QUnit.test('Marking with \'focus\' CSS class', function(assert) {
        const $element = $('#texteditor').dxTextEditor();
        const instance = $element.dxTextEditor('instance');

        instance.focus();
        assert.ok($element.hasClass(STATE_FOCUSED_CLASS), 'Get \'focus\' CSS class when input get focus');

        instance.blur();
        assert.ok(!$element.hasClass(STATE_FOCUSED_CLASS), 'Loose \'focus\' CSS class when input loose focus');
    });

    QUnit.test('Marking with \'empty input\' CSS class', function(assert) {
        const $element = $('#texteditor').dxTextEditor();
        const $input = $('#texteditor input');
        const keyboard = keyboardMock($input);

        keyboard.type('foo');
        $input.trigger('input');
        assert.ok(!$element.hasClass(EMPTY_INPUT_CLASS), 'Has no \'empty input\' CSS class when input is not empty');

        $input.val('').trigger('input');
        assert.ok($element.hasClass(EMPTY_INPUT_CLASS), 'Has \'empty input\' CSS class when input is empty');
    });

    QUnit.test('render placeholder', function(assert) {
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

    QUnit.test('render placeholder if value was set', function(assert) {
        const element = $('#texteditor').dxTextEditor({
            value: 'test'
        });

        const $placeholder = element.find('.' + PLACEHOLDER_CLASS);

        assert.equal($placeholder.hasClass(INVISIBLE_STATE_CLASS), true, 'placeholder is invisible');
    });

    QUnit.testInActiveWindow('placeholder pointerup event (T181734)', function(assert) {
        const $element = $('#texteditor').dxTextEditor({
            placeholder: 'enter value'
        });

        const $input = $element.find('input');
        const $placeholder = $element.find('.' + PLACEHOLDER_CLASS);

        $placeholder.trigger('dxpointerup');
        assert.ok($input.is(':focus'), 'input get focus on pointerup');
    });

    QUnit.testInActiveWindow('input is focused after click on the \'clear\' button', function(assert) {
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

    QUnit.test('clearButton is rendered correctly', function(assert) {
        // NOTE: native clear button is missing for real IE9 (T202090)

        const $textEditor = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'text'
        });

        const $clearButton = $textEditor.find('.dx-clear-button-area');

        assert.equal($clearButton.length, 1, 'clearButton was rendered');
    });

    QUnit.test('dxTextEditor reset value after click on clearButton', function(assert) {
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

    QUnit.test('dxTextEditor should save focus after buttons option changed', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({ value: 'text' });
        const textEditor = $textEditor.dxTextEditor('instance');

        textEditor.focus();
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is focused');

        textEditor.option('buttons', [{ name: 'custom', location: 'after', options: { icon: 'box' } }]);
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is still focused');
    });

    QUnit.testInActiveWindow('dxTextEditor should save focus after inner buttons were clicked', function(assert) {
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

    QUnit.testInActiveWindow('dxTextEditor should save focus after inner buttons were focused', function(assert) {
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

        $(actionButton.element()).trigger('click');
        assert.ok($textEditor.hasClass('dx-state-focused'), 'input is still focused');
        assert.strictEqual(focusStub.callCount, 1, 'new FocusIn event has not been triggered');
        assert.strictEqual(blurStub.callCount, 0, 'FocusOut event has not been triggered');
    });

    QUnit.testInActiveWindow('text editor should be focused out after focus is moved from custom button outside of editor (T1066348)', function(assert) {
        const focusOutStub = sinon.stub();

        const $textEditor = $('#texteditor').dxTextEditor({
            onFocusOut: focusOutStub,
            buttons: [{ name: 'test' }]
        });
        const textEditor = $textEditor.dxTextEditor('instance');
        const actionButton = textEditor.getButton('test');

        textEditor.focus();
        actionButton.focus();

        $(actionButton.$element()).trigger('focusout');

        assert.notOk($textEditor.hasClass(STATE_FOCUSED_CLASS), 'input is not focused');
        assert.strictEqual(focusOutStub.callCount, 1, 'focusout was triggered');
    });

    QUnit.testInActiveWindow('input should be focused even after focus from inner button move (T963822)', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            buttons: [{
                name: 'test',
                options: {
                    icon: 'home'
                }
            }]
        });
        const textEditor = $textEditor.dxTextEditor('instance');
        const actionButton = textEditor.getButton('test');

        actionButton.focus();
        assert.notOk($textEditor.hasClass(STATE_FOCUSED_CLASS), 'input is not focused');

        textEditor.focus();
        assert.ok($textEditor.hasClass(STATE_FOCUSED_CLASS), 'input is focused');
    });

    QUnit.test('TextEditor should pass integration options to the nested buttons (T894344)', function(assert) {
        const text = 'my template';
        const editor = $('#texteditor').dxTextEditor({
            buttons: [{
                name: 'testButton',
                options: {
                    template: 'custom',
                    text: 'default text'
                }
            }],
            integrationOptions: {
                templates: {
                    'custom': {
                        render: function(args) {
                            $('<span>').text(text).appendTo(args.container);
                        }
                    }
                }
            }
        }).dxTextEditor('instance');

        const buttonText = editor.getButton('testButton').$element().text();
        assert.strictEqual(buttonText, text);
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            value: 'First',
            displayValueFormatter(value) {
                return value + ' format';
            }
        });

        assert.equal($textEditor.dxTextEditor('option', 'value'), 'First', 'value is correct');
        assert.equal($textEditor.find('.dx-texteditor-input').val(), 'First format', 'input value is correct');
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option when value is changed using keyboard', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            value: 'First',
            displayValueFormatter(value) {
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

    QUnit.test('default displayValueFormatter of null should return an empty string', function(assert) {
        const textEditor = $('#texteditor').dxTextEditor({}).dxTextEditor('instance');
        const displayValueFormatter = textEditor.option('displayValueFormatter');

        assert.strictEqual(displayValueFormatter(null), '', 'null value formatted correctly');
        assert.strictEqual(displayValueFormatter(0), 0, '0 value formatted correctly');
        assert.strictEqual(displayValueFormatter(), '', 'undefined value formatted correctly');
        assert.strictEqual(displayValueFormatter(false), '', 'false value formatted correctly');
        assert.strictEqual(displayValueFormatter(''), '', 'empty value formatted correctly');
    });

    QUnit.test('dxTextEditor with height option should have min-height auto style on input', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            height: 50,
            value: 'First'
        });

        const $input = $textEditor.find('.dx-texteditor-input');

        assert.equal($input.get(0).style.minHeight, '0px', 'min-height inline style is defined');
    });

    QUnit.test('dxTextEditor with wrong stylingMode option should set the class according to default option value', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            stylingMode: 'someWrongOptionValue'
        });

        assert.ok($textEditor.hasClass('dx-editor-outlined'));
    });

    QUnit.test('dxTextEditor with wrong stylingMode option should set the class according to default option value (platform specific)', function(assert) {
        const realIsMaterial = themes.isMaterial;
        themes.isMaterial = () => {
            return true;
        };

        const $textEditor = $('#texteditor').dxTextEditor({
            stylingMode: 'someWrongOptionValue'
        });

        assert.ok($textEditor.hasClass('dx-editor-filled'));

        themes.isMaterial = realIsMaterial;
    });
});

QUnit.module('label integration', {
    beforeEach: function() {
        this.$textEditor = $('#texteditor');
        const initialOptions = { label: 'some' };
        this.init = (options = {}) => {
            this.textEditor = this.$textEditor
                .dxTextEditor($.extend(initialOptions, options))
                .dxTextEditor('instance');
            this.$input = this.$textEditor.find(`.${INPUT_CLASS}`);
        };

        const that = this;

        class TextEditorLabelMock extends TextEditorLabel {
            constructor(args) {
                super(args);
                that.labelArgs = args;
                that.labelMock = this;
            }

            updateMaxWidth = sinon.stub();
            updateBeforeWidth = sinon.stub();
            updateMode = sinon.stub();
            updateText = sinon.stub();
            updateMark = sinon.stub();
            updateContainsButtonsBefore = sinon.stub();
        }

        TextEditor.mockTextEditorLabel(TextEditorLabelMock);
    },
    afterEach: function() {
        Object.values(this.labelMock, (stub) => {
            stub.reset();
        });

        TextEditor.restoreTextEditorLabel();
    }
}, () => {
    QUnit.module('init', {
        beforeEach: function() {
            this.getProps = () => this.labelArgs;
        }
    }, () => {
        QUnit.test('correct props are passed to TextEditorLabel', function(assert) {
            const labelText = 'new label';
            const labelMode = 'floating';
            const labelMark = ':';

            this.init({
                label: labelText,
                labelMode,
                labelMark,
                buttons: [{
                    name: 'button',
                    location: 'before'
                }],
            });

            const {
                $editor,
                text, mode, mark,
                containsButtonsBefore,
            } = this.getProps();

            assert.strictEqual($editor.get(0), this.$textEditor.get(0));
            assert.strictEqual(text, labelText);
            assert.strictEqual(mode, labelMode);
            assert.strictEqual(mark, labelMark);
            assert.strictEqual(containsButtonsBefore, true);
        });

        QUnit.test('editor should pass containerWidth equal to input width', function(assert) {
            this.init();
            const inputWidth = getWidth(this.$input);

            assert.strictEqual(this.getProps().getContainerWidth(), inputWidth);
        });

        QUnit.test('editor should pass beforeWidth equal to before buttons container width', function(assert) {
            this.init();
            const beforeButtonsContainerWidth = getWidth($(`.${BUTTONS_CONTAINER_CLASS}`));

            assert.strictEqual(this.getProps().getBeforeWidth(), beforeButtonsContainerWidth);
        });

        QUnit.test('editor should not initiate taking of width for label if labelMode is hidden (T1192938)', function(assert) {
            const originalGetWidth = implementationsMap.getWidth;

            try {
                implementationsMap.getWidth = sinon.spy();

                this.init({
                    label: 'Label',
                    labelMode: 'hidden',
                });

                assert.strictEqual(implementationsMap.getWidth.callCount, 0);
            } finally {
                implementationsMap.getWidth = originalGetWidth;
            }
        });

        LABEL_MODES.forEach((labelMode) => {
            QUnit.test(`editor initiate taking of width for label if labelMode is ${labelMode} (T1192938)`, function(assert) {
                const originalGetWidth = implementationsMap.getWidth;

                try {
                    implementationsMap.getWidth = sinon.spy();

                    this.init({
                        label: 'Label',
                        labelMode,
                    });

                    assert.strictEqual(implementationsMap.getWidth.callCount, 1);
                } finally {
                    implementationsMap.getWidth = originalGetWidth;
                }
            });
        });
    });

    QUnit.module('option change', {
        beforeEach: function() {
            this.init();
        }
    }, () => {
        QUnit.test('width', function(assert) {
            this.textEditor.option('width', 300);
            const inputWidth = getWidth(this.$input);

            const updateMaxWidthCall = this.labelMock.updateMaxWidth.getCall(0);
            assert.strictEqual(updateMaxWidthCall.args[0], inputWidth);
        });


        QUnit.test('label', function(assert) {
            const labelText = 'new text';
            this.textEditor.option('label', labelText);

            const updateTextCall = this.labelMock.updateText.getCall(0);
            assert.strictEqual(updateTextCall.args[0], labelText);
        });

        QUnit.test('labelMark', function(assert) {
            const newLabelMark = '*';
            this.textEditor.option('labelMark', newLabelMark);

            const updateMarkCall = this.labelMock.updateMark.getCall(0);
            assert.strictEqual(updateMarkCall.args[0], newLabelMark);
        });

        QUnit.test('labelMode', function(assert) {
            const newLabelMode = 'floating';
            this.textEditor.option('labelMode', newLabelMode);

            const updateModeCall = this.labelMock.updateMode.getCall(0);
            assert.strictEqual(updateModeCall.args[0], newLabelMode);
        });

        QUnit.test('before buttons', function(assert) {
            this.textEditor.option('buttons', [{
                name: 'button',
                location: 'before',
            }]);
            const updateMaxWidthCall = this.labelMock.updateMaxWidth.getCall(0);
            const updateBeforeWidthCall = this.labelMock.updateBeforeWidth.getCall(0);
            const updateContainsButtonsBeforeCall = this.labelMock.updateContainsButtonsBefore.getCall(0);

            const newLabelMaxWidth = getWidth(this.$input);
            const newLabelBeforeWidth = getWidth($(`.${BUTTONS_CONTAINER_CLASS}`));

            assert.strictEqual(updateMaxWidthCall.args[0], newLabelMaxWidth);
            assert.strictEqual(updateBeforeWidthCall.args[0], newLabelBeforeWidth);
            assert.strictEqual(updateContainsButtonsBeforeCall.args[0], true);
        });

        QUnit.test('after buttons', function(assert) {
            this.textEditor.option('buttons', [{
                name: 'button',
                location: 'after',
            }]);
            const updateBeforeWidthCall = this.labelMock.updateBeforeWidth.getCall(0);
            const updateContainsButtonsBeforeCall = this.labelMock.updateContainsButtonsBefore.getCall(0);

            assert.strictEqual(updateBeforeWidthCall.args[0], 0);
            assert.strictEqual(updateContainsButtonsBeforeCall.args[0], false);
        });

        QUnit.test('stylingMode', function(assert) {
            this.textEditor.option('stylingMode', 'underlined');

            const updateMaxWidthCall = this.labelMock.updateMaxWidth.getCall(0);
            const updateBeforeWidthCall = this.labelMock.updateBeforeWidth.getCall(0);

            const newLabelMaxWidth = getWidth(this.$input);
            const newLabelBeforeWidth = 0;

            assert.strictEqual(updateMaxWidthCall.args[0], newLabelMaxWidth);
            assert.strictEqual(updateBeforeWidthCall.args[0], newLabelBeforeWidth);
        });
    });
});

QUnit.module('aria-labelledby attribute', {
    beforeEach: function() {
        this.$textEditor = $('#texteditor');
        this.textEditor = this.$textEditor
            .dxTextEditor({
                label: 'custom',
                placeholder: 'custom',
            })
            .dxTextEditor('instance');
        this.$input = this.$textEditor.find(`.${INPUT_CLASS}`);
        this.$label = this.$textEditor.find(`.${LABEL_CLASS}`);
        this.$placeholder = this.$textEditor.find(`.${PLACEHOLDER_CLASS}`);
    }
}, () => {
    QUnit.test('aria-labelledby should not be set if inputAttr containes aria-label', function(assert) {
        this.textEditor.option({
            inputAttr: { 'aria-label': 'custom' },
            label: null,
        });

        const inputAttr = this.$input.attr('aria-labelledby');

        assert.strictEqual(inputAttr, undefined);
    });

    QUnit.test('aria-labelledby should be equal label id if label is specified', function(assert) {
        this.textEditor.option({ placeholder: null });

        const inputAttr = this.$input.attr('aria-labelledby');
        const labelId = this.$label.attr('id');

        assert.strictEqual(inputAttr, labelId);
    });

    QUnit.test('aria-labelledby should be equal undefined if label and placeholderId are not specified', function(assert) {
        this.textEditor.option({
            label: null,
            placeholder: null,
        });
        const inputAttr = this.$input.attr('aria-labelledby');

        assert.strictEqual(inputAttr, undefined);
    });

    QUnit.test('aria-labelledby should be equal undefined if placeholder is specified and label is not specified', function(assert) {
        this.textEditor.option({
            label: null,
            placeholder: 'placeholder',
        });
        const inputAttr = this.$input.attr('aria-labelledby');

        assert.strictEqual(inputAttr, undefined);
    });

    QUnit.test('aria-labelledby should be equal undefined if label mode has value "hidden" and placeholder is not specified', function(assert) {
        this.textEditor.option({
            labelMode: 'hidden',
            placeholder: null,
        });
        const inputAttr = this.$input.attr('aria-labelledby');

        assert.strictEqual(inputAttr, undefined);
    });

    QUnit.test('the placeholder attr should be equal custom placeholder', function(assert) {
        this.textEditor.option({
            placeholder: 'custom',
            label: null,
        });

        const placeholder = this.$input.attr('placeholder');

        assert.strictEqual(placeholder, this.textEditor.option('placeholder'));
    });

    QUnit.test('the placeholder attr should be equal empty string if placeholder is null in ios or mac', function(assert) {
        this.textEditor.option({
            placeholder: null,
            label: null,
        });

        const { ios, mac } = devices.real();
        const placeholder = this.$input.attr('placeholder');

        if(ios || mac) {
            assert.strictEqual(placeholder, ' ');

            return;
        }

        assert.strictEqual(placeholder, undefined);
    });
});

QUnit.module('text option', moduleConfig, () => {
    QUnit.test('Typing in input should affext \'text\' option, but not \'value\'', function(assert) {
        const textEditor = $('#texteditor').dxTextEditor({
            value: 'original'
        }).dxTextEditor('instance');

        this.keyboard.caret(8).type('123');

        assert.equal(textEditor.option('value'), 'original', 'value should not change by default');
        assert.equal(textEditor.option('text'), 'original123', 'text should reflect user input');
    });

    QUnit.test('\'Text\' option should not be \'undefined\'', function(assert) {
        const textEditor = $('#texteditor').dxTextEditor({
            value: 'original'
        }).dxTextEditor('instance');

        assert.equal(textEditor.option('text'), 'original', 'text option set correctly');

        textEditor.option('value', 'not original');

        assert.equal(textEditor.option('text'), 'not original', 'text set correctly again');
    });
});

QUnit.module('the \'name\' option', {}, () => {
    QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';

        const $element = $('#texteditor').dxTextEditor({
            name: expectedName
        });

        const $input = $element.find('.' + INPUT_CLASS);

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

QUnit.module('options changing', moduleConfig, () => {
    QUnit.test('valueChangeEvent', function(assert) {
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

    QUnit.test('onValueChanged callback', function(assert) {
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

    QUnit.test('onValueChanged callback shouldn\'t have event if value was changed programmatically', function(assert) {
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

    QUnit.test('event handler callbacks', function(assert) {
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

    QUnit.test('events should be fired in readOnly state', function(assert) {
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

    QUnit.test('editor should have actual value in the event handler when this event included into valueChangeEvent', function(assert) {
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

    QUnit.test('editor should not change value if it is readOnly (T1022447)', function(assert) {
        this.instance.option({ value: null, readOnly: true });
        this.keyboard.type('f').change();

        assert.strictEqual(this.instance.option('value'), null);
    });

    QUnit.test('Click on \'clear\' button', function(assert) {
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

        assert.ok(!$element.hasClass(EMPTY_INPUT_CLASS), 'Element has NO \'empty input\' CSS class');

        instance.option('onValueChanged', handleValueUpdateEvent);
        pointerMock($element.find('.dx-clear-button-area')).click();
        this.clock.tick(10);
        assert.strictEqual($input.val(), '', 'Click on \'clear\' button causes input value reset');
        assert.ok($element.hasClass(EMPTY_INPUT_CLASS), 'Click on \'clear\' button causes marking with \'empty input\' CSS class');
        assert.equal(eventWasHandled, 1, 'Click on \'clear\' button rises value update event');
    });

    QUnit.test('\'Clear\' button visibility depends on value', function(assert) {
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

    QUnit.test('clear button should disappear when text changed without value change', function(assert) {
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

    ['mouse', 'touch'].forEach((pointerType) => { // T241583, T310102
        const pointerAction = pointerType === 'mouse' ? 'click' : 'tap';
        QUnit.test(`${pointerAction} on clear button should not reset active focus and clear the value`, function(assert) {
            const $element = $('#texteditor').dxTextEditor({ showClearButton: true, value: 'foo' });
            const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);
            const $input = $element.find(`.${INPUT_CLASS}`);
            const instance = $element.dxTextEditor('instance');

            const dxPointerDown = $.Event('dxpointerdown');
            dxPointerDown.pointerType = pointerType;

            $clearButton.on('dxpointerdown', e => {
                assert.ok(e.isDefaultPrevented(), 'prevent input blurring');
            }).trigger(dxPointerDown);

            if(pointerType === 'mouse') {
                $clearButton.trigger('dxclick');
            }

            assert.strictEqual($input.val(), '', 'input is empty');
            assert.strictEqual(instance.option('value'), '', 'value is cleared');
        });
    });

    QUnit.test('click on clear button should raise input event (T521817)', function(assert) {
        let callCount = 0;

        const $element = $('#texteditor').dxTextEditor({
            showClearButton: true,
            value: 'foo',
            onInput() {
                assert.ok(true, 'onInput was called');
                callCount++;
            }
        });

        const $clearButton = $element.find(CLEAR_BUTTON_SELECTOR).eq(0);

        pointerMock($clearButton).click();

        assert.equal(callCount, 1, 'onInput was called once');
    });

    QUnit.test('tap on clear button should not raise onValueChange event (T812448)', function(assert) {
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

    QUnit.testInActiveWindow('focusIn and focusOut fired after enable disable state', function(assert) {
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

    QUnit.testInActiveWindow('Remove .dx-state-focused class after disabled of the element', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor();

        $textEditor
            .find('input')
            .focus();

        const instance = $textEditor.dxTextEditor('instance');

        instance.option('disabled', true);

        assert.ok($textEditor.hasClass('dx-state-disabled'), 'dx-state-disabled are applied');
        assert.ok(!$textEditor.hasClass('dx-state-focused'), 'dx-state-focused was removed');
    });

    QUnit.test('texteditor get \'stylingMode\' option from global config', function(assert) {
        config({ editorStylingMode: 'underlined' });
        const container = $('<div>');
        const instance = container.dxTextEditor().dxTextEditor('instance');

        const stylingMode = instance.option('stylingMode');
        assert.equal(stylingMode, 'underlined', 'default changed by global config');
        container.remove();
        config({ editorStylingMode: null });
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
    QUnit.test('focus method', function(assert) {
        const input = this.input.get(0);
        const focusSpy = sinon.spy(eventsEngine, 'trigger').withArgs(sinon.match($element => {
            return ($element.get && $element.get(0) || $element) === input;
        }), 'focus');

        this.instance.focus();
        assert.ok(focusSpy.called);
    });

    QUnit.test('blur method', function(assert) {
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

    QUnit.test('onValueChanged fired only when value is changed', function(assert) {
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

    QUnit.test('clear()', function(assert) {
        const textBox = this.instance;

        textBox.clear();

        assert.strictEqual(textBox.option('value'), '', 'Value should be cleared');
    });

    QUnit.test('onFocusOut and other events fired after value was changed', function(assert) {
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

    QUnit.test('enterKey event', function(assert) {
        const enterKeyEvent = sinon.stub();

        const textBox = this.instance;

        textBox.on('enterKey', enterKeyEvent);

        this.keyboard.keyUp('enter');

        assert.equal(enterKeyEvent.called, true, 'enterKey was fired');
    });

    QUnit.test('events work when relevant actions is not set', function(assert) {
        assert.expect(8);
        const textBox = this.instance;
        const keyboard = this.keyboard;

        textBox.on('keyDown', e => {
            assert.equal(e.component, textBox, 'event has link on component');
            assert.equal($(e.element).get(0), textBox.$element().get(0), 'event has link on element');
            assert.equal(e.event.type, 'keydown', 'event has related Event');
            assert.ok(true, 'keyDown was fired');
        });

        textBox.on('keyUp', e => {
            assert.equal(e.component, textBox, 'event has link on component');
            assert.equal($(e.element).get(0), textBox.$element().get(0), 'event has link on element');
            assert.equal(e.event.type, 'keyup', 'event has related Event');
            assert.ok(true, 'keyUp was fired');
        });

        keyboard.type('x');
    });

    QUnit.test('events supports chains', function(assert) {
        assert.expect(2);
        const textBox = this.instance;
        const keyboard = this.keyboard;

        textBox.on('keyDown', e => {
            assert.ok(true, 'keyDown was fired');
        }).on('keyUp', e => {
            assert.ok(true, 'keyUp was fired');
        });

        keyboard.type('x');
    });

    QUnit.test('event should be fired once when there are multiple subscriptions', function(assert) {
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

QUnit.module('deprecated options', {
    beforeEach: function() {
        sinon.spy(consoleUtils.logger, 'warn');
    },
    afterEach: function() {
        consoleUtils.logger.warn.restore();
    }
}, () => {
});

QUnit.module('regressions', moduleConfig, () => {
    QUnit.test('event handlers are not set', function(assert) {
        assert.expect(0);

        const EVENTS = [
            'focusIn', 'focusOut',
            'keyDown', 'keyUp',
            'change'
        ];

        const input = this.input;

        this.element.dxTextEditor({});

        $.each(EVENTS, (index, eventName) => {
            input.trigger(prepareEvent(eventName));
        });
    });

    QUnit.test('B233344 dxNumberbox/dxTextbox/dxDatebox - Incorrect changing of \'disabled\' option', function(assert) {
        this.instance.option('disabled', true);
        assert.ok(this.element.hasClass(DISABLED_CLASS));

        this.instance.option('disabled', true);
        assert.ok(this.element.hasClass(DISABLED_CLASS));

        this.instance.option('disabled', false);
        assert.ok(!this.element.hasClass(DISABLED_CLASS));

        this.instance.option('disabled', false);
        assert.ok(!this.element.hasClass(DISABLED_CLASS));
    });

    QUnit.test('B233277 dxNumberbox/dxTextbox - cursor jump over the right digit, impossible to remove all digits after the cursor moving', function(assert) {
        this.instance.option('valueChangeEvent', 'keyup');
        keyboardMock(this.element.find('.' + INPUT_CLASS))
            .type('123')
            .press('left')
            .type('4')
            .press('backspace');
        assert.equal(this.instance.option('value'), '123');
    });

    QUnit.test('Text editor should propagate keyboard events to the document', function(assert) {
        const keydownHandler = sinon.spy();
        eventsEngine.on(document, 'keydown', keydownHandler);

        keyboardMock(this.input)
            .keyDown('enter')
            .keyDown('space')
            .keyDown('left')
            .keyDown('right');

        assert.equal(keydownHandler.callCount, 4, 'keydown was handled 4 times');
    });

    QUnit.test('Enter key event raising (B238135)', function(assert) {
        const handler = sinon.stub();

        $('#texteditor').dxTextEditor({
            onEnterKey: handler
        }).dxTextEditor('instance');

        $('#texteditor input').trigger($.Event('keyup', { key: 'Enter' }));

        assert.ok(handler.calledOnce, 'event raised');
        assert.ok(handler.getCall(0).args[0].event, 'event args have Event prop');
    });

    QUnit.test('Enter key event changing handler (B238135)', function(assert) {
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

    QUnit.test('Enter key action is not fired is widget is disposed', function(assert) {
        const enterKeyStub = sinon.stub();
        const keyUpStub = sinon.stub();
        const keyDownStub = sinon.stub();

        const $textEditor = $('#texteditor').dxTextEditor({
            onEnterKey: enterKeyStub,
            onKeyUp: keyUpStub,
            onKeyDown: keyDownStub
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
        } finally {
            instance._disposed = disposed;
        }
    });

    QUnit.test('Placeholder text should be hidden when value is set (T124525)', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            placeholder: 'test',
            value: 'val'
        });

        const $placeholder = $textEditor.find('.' + PLACEHOLDER_CLASS);

        assert.equal($placeholder.hasClass(INVISIBLE_STATE_CLASS), true, 'display none was attached as inline style');
    });

    QUnit.test('Only editor input placeholder should change visibility depending on input text (T970003)', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor();
        const $input = $textEditor.find(`.${INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        $textEditor.append($('<div>').attr('class', PLACEHOLDER_CLASS));
        const $placeholders = $textEditor.find(`.${PLACEHOLDER_CLASS}`);

        assert.notOk($placeholders.eq(0).hasClass(INVISIBLE_STATE_CLASS), 'input placeholder is visible');
        assert.notOk($placeholders.eq(1).hasClass(INVISIBLE_STATE_CLASS), 'additional placeholder is visible');

        keyboard
            .focus()
            .type('text')
            .blur();

        assert.ok($placeholders.eq(0).hasClass(INVISIBLE_STATE_CLASS), 'input placeholder is hidden');
        assert.notOk($placeholders.eq(1).hasClass(INVISIBLE_STATE_CLASS), 'additional placeholder visibility is not changed');
    });
});

QUnit.module('valueChanged should receive correct event parameter', {
    beforeEach: function() {
        this.valueChangedHandler = sinon.stub();
        this.$element = $('#texteditor').dxTextEditor({
            onValueChanged: this.valueChangedHandler
        });
        this.instance = this.$element.dxTextEditor('instance');
        this.$input = this.$element.find(`.${INPUT_CLASS}`);
        this.keyboard = keyboardMock(this.$input);

        this.testProgramChange = (assert) => {
            this.instance.option('value', 'custom text');

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
            assert.strictEqual(event, undefined, 'event is undefined');
        };
        this.checkEvent = (assert, type, target, key) => {
            const event = this.valueChangedHandler.getCall(0).args[0].event;
            assert.strictEqual(event.type, type, 'event type is correct');

            // NOTE: the cached event.target is missing if the element is in shadow dom
            // looks like a bug in a browser
            if(!QUnit.isInShadowDomMode()) {
                assert.strictEqual(event.target, target.get(0), 'event target is correct');
            }

            if(type === 'keydown') {
                assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
            }
        };
    }
}, () => {
    QUnit.test('on program change', function(assert) {
        this.testProgramChange(assert);
    });

    QUnit.test('on change', function(assert) {
        this.keyboard
            .type('text')
            .change();

        this.checkEvent(assert, 'change', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on input if valueChangeEvent=input', function(assert) {
        this.instance.option('valueChangeEvent', 'input');

        this.keyboard
            .type('text')
            .change();

        this.checkEvent(assert, 'input', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on focusout if valueChangeEvent=focusout', function(assert) {
        this.instance.option('valueChangeEvent', 'focusout');

        this.keyboard
            .type('text')
            .blur();

        this.checkEvent(assert, 'focusout', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on keyup if valueChangeEvent=keyup', function(assert) {
        this.instance.option('valueChangeEvent', 'keyup');

        this.keyboard
            .type('text')
            .keyUp();


        this.checkEvent(assert, 'keyup', this.$input);
        this.testProgramChange(assert);
    });
});

QUnit.module('validation', () => {
    QUnit.test('editor input should be described by validation message content', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            isValid: false,
            validationError: { message: 'error' },
            validationStatus: 'invalid'
        });
        const $input = $textEditor.find(`.${INPUT_CLASS}`);
        const messageId = $input.attr('aria-describedby');

        assert.ok(messageId, 'input aria-describedby attr is specified');
        assert.strictEqual($('.dx-invalid-message-content').attr('id'), messageId, 'message content id is correct');
    });
});
