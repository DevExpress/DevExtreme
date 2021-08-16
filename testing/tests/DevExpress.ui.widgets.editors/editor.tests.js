import $ from 'jquery';
import { Component } from 'core/component';
import OldEditor from 'ui/editor/editor';
import NewEditor from 'renovation/ui/editors/internal/editor.j';
import Class from 'core/class';
import ValidationEngine from 'ui/validation_engine';
import hoverEvents from 'events/hover';
import { wrapRenovatedWidget } from '../../helpers/wrapRenovatedWidget.js';

import 'generic_light.css!';

const wrapRenovatedEditor = (editor) => {
    const wrapperEditor = wrapRenovatedWidget(editor);
    wrapperEditor.isEditor = editor.isEditor;

    return wrapperEditor;
};

// eslint-disable-next-line spellcheck/spell-checker
const Editor = QUnit.urlParams.norenovation ? OldEditor : wrapRenovatedEditor(NewEditor);

const INVALID_MESSAGE_CLASS = 'dx-invalid-message';

const Fixture = Class.inherit({
    createEditor(options) {
        this.$element = $('<div/>').appendTo('#qunit-fixture');
        const editor = new Editor(this.$element, options);

        return editor;
    },
    createOnlyElement(options) {
        this.$element = $('<div/>').appendTo('#qunit-fixture');

        return this.$element;
    },
    teardown() {
        this.$element.remove();
        ValidationEngine.initGroups();
    }
});

const skipForRenovated = (name, testCallback) => {
    if(!Editor.IS_RENOVATED_WIDGET) {
        testCallback();
    } else {
        QUnit.skip(name);
    }
};

const moduleConfig = {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
};

QUnit.module('base', moduleConfig, () => {
    QUnit.test('isEditor static method', function(assert) {
        const editor = this.fixture.createEditor();

        assert.ok(Editor.isEditor(editor));
        assert.notOk(Editor.isEditor(new Component(this.$element)));
    });

    QUnit.test('Editor can be instantiated', function(assert) {
        const editor = this.fixture.createEditor();
        assert.ok(editor instanceof Editor);
    });

    QUnit.test('rendering', function(assert) {
        const editor = this.fixture.createEditor();
        assert.ok(editor);
    });
});

QUnit.module('readOnly', moduleConfig, () => {
    QUnit.test('readOnly option has false value by default', function(assert) {
        const editor = this.fixture.createEditor();

        assert.strictEqual(editor.option('readOnly'), false);
    });

    QUnit.test('hover class should be added on hover event if widget has read only state (T359215)', function(assert) {
        const editor = this.fixture.createEditor({
            hoverStateEnabled: true,
            readOnly: true
        });

        const $editor = editor.$element();

        $($editor).trigger(hoverEvents.start);
        assert.ok($editor.hasClass('dx-state-hover'), 'there is hover class');
    });

    skipForRenovated('Prevent backspace event when editor is readonly', () => {
        [false, true].forEach((readOnly) => {
            QUnit.module('"backspace" key press event', {
                beforeEach: function() {
                    this.editor = this.fixture.createEditor({
                        readOnly
                    });

                    this.$eventTarget = $(this.editor.$element());
                    this.event = $.Event('keydown', { key: 'Backspace' });
                }
            }, () => {
                const isReadOnly = readOnly ? '' : 'not';
                QUnit.test(`should ${isReadOnly} be prevented when editor is ${isReadOnly} read only`, function(assert) {
                    this.$eventTarget.trigger(this.event);
                    assert.strictEqual(this.event.isDefaultPrevented(), readOnly);
                });

                const becomesReadOnly = readOnly ? 'not' : '';
                QUnit.test(`should ${becomesReadOnly} be prevented when editor becomes ${becomesReadOnly} read only`, function(assert) {
                    this.editor.option('readOnly', !readOnly);
                    this.$eventTarget.trigger(this.event);

                    assert.strictEqual(this.event.isDefaultPrevented(), !readOnly);
                });
            });
        });
    });
});

QUnit.module('Methods', moduleConfig, () => {
    QUnit.test('reset', function(assert) {
        const editor = this.fixture.createEditor({ value: '123' });

        editor.reset();

        assert.strictEqual(editor.option('value'), null);
    });

    QUnit.test('focus', function(assert) {
        const editor = this.fixture.createEditor({ value: '123' });
        $(editor.$element()).on('focus', () => {
            assert.ok(true, 'editor is focused');
        });

        editor.focus();
    });

    skipForRenovated('blur method', () => {
        QUnit.testInActiveWindow('The blur() method does not blur the active item', function(assert) {
            const focusOutSpy = sinon.spy();
            const editor = this.fixture.createEditor({ value: '123' });
            const $testElement = $('<input type="button">');
            $testElement.appendTo('#qunit-fixture');
            $testElement.on('blur', focusOutSpy);
            $testElement.focus();

            editor.blur();

            assert.strictEqual(focusOutSpy.callCount, 0);
        });
    });
});

QUnit.module('value option', moduleConfig, () => {
    [
        {},
        { readOnly: true },
        { disabled: true }
    ].forEach(initialConfig => {
        QUnit.test(`value change triggers valueChanged event with correct parameters, ${JSON.stringify(initialConfig)}`, function(assert) {
            const oldValue = 'old';
            const newValue = 'new';
            const valueChangedStub = sinon.stub();
            const editor = this.fixture.createEditor();

            editor.option('value', oldValue);
            editor.option('onValueChanged', valueChangedStub);
            editor.option('value', newValue);

            const { previousValue, value } = valueChangedStub.getCall(0).args[0];
            assert.strictEqual(previousValue, oldValue, 'old value is correctly');
            assert.strictEqual(value, newValue, 'new value is passed correctly');
        });
    });

    QUnit.test('onValueChanged should work correctly when it passed on onInitialized (T314007)', function(assert) {
        const valueChangedStub = sinon.stub();
        const editor = this.fixture.createEditor({
            onInitialized(e) {
                e.component.option('onValueChanged', valueChangedStub);
            }
        });

        editor.option('value', 'new value');

        assert.strictEqual(valueChangedStub.callCount, 1, 'onValueChanged was fired');
    });
});

if(!Editor.IS_RENOVATED_WIDGET) {
    QUnit.module('"name" option', {
        beforeEach: function() {
            this.$element = $('<div>').appendTo('body');
            this.EditorInheritor = Editor.inherit({
                _initMarkup() {
                    this._$submitElement = $('<input type="hidden">').appendTo(this.$element());
                    this.callBase();
                },
                _getSubmitElement() {
                    return this._$submitElement;
                }
            });
        },
        afterEach: function() {
            this.$element.remove();
        }
    }, () => {
        QUnit.test('editor inheritor input should get the "name" attribute with a correct value', function(assert) {
            const expectedName = 'some_name';

            new this.EditorInheritor(this.$element, {
                name: expectedName
            });

            const $input = this.$element.find('input[type="hidden"]');
            assert.strictEqual($input.attr('name'), expectedName, 'the input "name" attribute has correct value');
        });

        QUnit.test('editor inheritor input should get correct "name" attribute after the "name" option is changed', function(assert) {
            const expectedName = 'new_name';

            const instance = new this.EditorInheritor(this.$element, {
                name: 'initial_name'
            });

            const $input = this.$element.find('input[type="hidden"]');

            instance.option('name', expectedName);
            assert.strictEqual($input.attr('name'), expectedName, 'the input "name" attribute has correct value ');
        });

        QUnit.test('the "name" attribute should not be rendered if name is an empty string', function(assert) {
            new this.EditorInheritor(this.$element);

            const input = this.$element.find('input[type="hidden"]').get(0);
            assert.notOk(input.hasAttribute('name'), 'there should be no "name" attribute for hidden input');
        });

        QUnit.test('the "name" attribute should be removed after name is changed to an empty string', function(assert) {
            const instance = new this.EditorInheritor(this.$element, {
                name: 'some_name'
            });

            const input = this.$element.find('input[type="hidden"]').get(0);

            instance.option('name', '');
            assert.notOk(input.hasAttribute('name'), 'there should be no "name" attribute for hidden input');
        });
    });
}

QUnit.module('Validation - UI', {
    beforeEach: function() {
        this.fixture = new Fixture();
        this.message = 'That is very bad editor';
        this.getValidationMessage = () => {
            return this.editor.$element()
                .find(`.${INVALID_MESSAGE_CLASS}`)
                .dxValidationMessage()
                .dxValidationMessage('instance');
        };
        this.getValidationMessageElement = () => {
            return this.getValidationMessage().$element();
        };

        this.initInvalidEditor = () => {
            this.editor = this.fixture.createEditor({
                isValid: false,
                validationError: {
                    message: this.message
                }
            });
        };
        this.reinitEditor = (options = {}) => {
            this.editor.dispose();
            this.editor = this.fixture.createEditor(options);
        };

        this.initInvalidEditor();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    const INVALID_VALIDATION_CLASS = 'dx-invalid';

    QUnit.test('editor can be created as invalid', function(assert) {
        assert.ok(this.editor.$element().hasClass(INVALID_VALIDATION_CLASS), 'editor is invalid');
    });

    QUnit.test('editor can be set in invalid state through options', function(assert) {
        this.reinitEditor();

        this.editor.option({
            isValid: false,
            validationError: {
                message: ''
            }
        });

        assert.ok(this.editor.$element().hasClass(INVALID_VALIDATION_CLASS), 'editor is invalid');
    });

    QUnit.test('validation message should be created if editor is invalid', function(assert) {
        const validationMessage = this.getValidationMessage();
        const $validationMessage = validationMessage.$element();

        assert.ok($validationMessage, 'validation message is created');
        assert.ok(validationMessage.$wrapper().find(`.${INVALID_MESSAGE_CLASS}.dx-overlay-wrapper`), 'overlay wrapper should also have dx-invalid-message class');
        assert.strictEqual(validationMessage.option('mode'), 'auto', 'mode is passed correctly');
        assert.strictEqual(validationMessage.$content().text(), this.message, 'message is correct');
    });

    QUnit.test('validationMessage mode option should be updated after editor validationMessageMode option change', function(assert) {
        this.reinitEditor({
            validationMessageMode: 'always',
            isValid: false,
            validationError: {
                message: ''
            }
        });
        const validationMessage = this.getValidationMessage();

        assert.strictEqual(validationMessage.option('mode'), 'always', 'validationMessage has correct "mode" option');

        this.editor.option('validationMessageMode', 'auto');
        assert.strictEqual(validationMessage.option('mode'), 'auto', 'validationMessage has correct "mode" option after option change');
    });

    QUnit.test('validationMessage position.offset should be updated after editor validationMessageOffset option change', function(assert) {
        const defaultOffset = { v: 0, h: 0 };

        const validationMessage = this.getValidationMessage();
        assert.deepEqual(validationMessage.option('position.offset'), defaultOffset, 'validationMessage has correct "offset" option');

        const newOffset = { v: 18, h: -12 };
        this.editor.option('validationMessageOffset', newOffset);
        assert.deepEqual(validationMessage.option('position.offset'), newOffset, 'validationMessage has correct "offset" option');
    });

    QUnit.test('validationMessage position.offset should be updated after editor rtlEnabled option change', function(assert) {
        const offset = { v: 10, h: 20 };

        this.reinitEditor({
            isValid: false,
            validationError: {
                message: ''
            },
            validationMessageOffset: offset
        });
        const validationMessage = this.getValidationMessage();
        assert.deepEqual(validationMessage.option('position.offset'), offset, 'validationMessage has correct "offset" option');

        this.editor.option('rtlEnabled', true);
        offset.h = -offset.h;
        assert.deepEqual(validationMessage.option('position.offset'), offset, 'validationMessage has correct "offset" option');
    });

    QUnit.test('validation message should be destroyed after editor become valid', function(assert) {
        this.editor.option({ isValid: true });
        const validationMessage = this.getValidationMessage();
        assert.notOk(validationMessage, 'validation message is destroyed');
    });

    QUnit.test('validation message should be destroyed after validationErrors was gone', function(assert) {
        this.editor.option({ validationError: null });
        assert.ok(!this.getValidationMessage(), 'validation message is destroyed');
    });

    QUnit.test('validation state should be rerendered after validationStatus change', function(assert) {
        this.reinitEditor({
            isValid: true,
            validationError: {
                message: ''
            },
            validationStatus: 'pending'
        });

        assert.notOk(this.getValidationMessage(), 'validation message is not rendered');

        this.editor.option({ validationStatus: 'invalid' });
        assert.ok(this.getValidationMessage(), 'validation message is rendered after validationStatus becomes "invalid"');
    });

    QUnit.test('Validation message should flip if it is out of validationBoundary', function(assert) {
        const $parent = this.fixture.createOnlyElement().css({
            paddingTop: '100px'
        });
        const $element = $('<div>').appendTo($parent);

        const editor = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Flip'
            },
            validationBoundary: $parent
        });

        editor.option({ isValid: false });

        const $validationMessage = this.getValidationMessageElement();
        assert.ok($validationMessage.offset().top < $element.offset().top, 'validation message was flipped');
    });

    QUnit.test('Validation message boundary should be updated after editor validationBoundary runtime change', function(assert) {
        const $boundary = this.fixture.createOnlyElement().css({
            paddingTop: '100px'
        });
        const validationMessage = this.getValidationMessage();

        assert.strictEqual(validationMessage.option('position.boundary'), undefined, 'validation message boundary is null');

        this.editor.option({ validationBoundary: $boundary });
        assert.strictEqual(validationMessage.option('position.boundary'), $boundary, 'validation message boundary was changed after editor validationBoundary change');
    });

    QUnit.test('Validation message should have the same width as editor', function(assert) {
        const width = 100;
        this.reinitEditor({
            width: 100,
            validationMessageMode: 'always',
            validationError: {
                message: 'Flip'
            },
            isValid: false
        });

        const $validationMessage = this.getValidationMessageElement();
        assert.strictEqual($validationMessage.outerWidth(), width, 'validation message width is correct');
    });

    QUnit.test('Validation message should have the same width as editor after option change', function(assert) {
        const width = 200;
        this.editor.option('width', width);

        const $validationMessage = this.getValidationMessageElement();
        assert.strictEqual($validationMessage.outerWidth(), width, 'validation message width is correct');
    });

    QUnit.test('validation message content width should be less or equal to message width', function(assert) {
        this.reinitEditor({
            width: 100,
            validationMessageMode: 'always',
            validationError: {
                message: 'Very very very very very very very very very very very very very very very very very long validation message'
            },
            isValid: false
        });

        const validationMessage = this.getValidationMessage();
        const $validationMessage = validationMessage.$content();
        const $content = validationMessage.$content();

        assert.ok($content.outerWidth() <= $validationMessage.outerWidth(), 'validation message width is correct');
    });

    QUnit.test('validation message text should not be wrapped', function(assert) {
        const $content = this.getValidationMessage().$content();

        assert.strictEqual($content.css('whiteSpace'), 'normal', 'text is not wrapped');
    });

    QUnit.test('Validation message should have correct width for small content', function(assert) {
        this.reinitEditor({
            width: 500,
            validationMessageMode: 'always',
            validationError: {
                message: 'Err'
            },
            isValid: false
        });

        const $content = this.getValidationMessage().$content();
        const contentWidth = $content.outerWidth();

        assert.strictEqual($content.css('width', 'auto').outerWidth(), contentWidth, 'validation message width is correct');
    });

    QUnit.test('Validation message should have the 100px max width if the editor has smaller size (T376114)', function(assert) {
        this.reinitEditor({
            width: 20,
            validationMessageMode: 'always',
            validationError: {
                message: 'ErrorErrorErrorErrorErrorErrorError'
            },
            isValid: false
        });
        const $content = this.getValidationMessage().$content();

        assert.strictEqual($content.outerWidth(), 100, 'the validation message width is correct');
    });

    QUnit.test('Validation message should update max width after editor width runtime change', function(assert) {
        this.reinitEditor({
            width: 20,
            validationMessageMode: 'always',
            validationError: {
                message: 'This_message_width_more_than_max_set_width'
            },
            isValid: false
        });

        this.editor.option('width', 200);
        let $content = this.getValidationMessage().$content();
        assert.strictEqual($content.outerWidth(), 200, 'the validation message width is correct');

        this.editor.option('width', 80);
        $content = this.getValidationMessage().$content();
        assert.strictEqual($content.outerWidth(), 100, 'the validation message width is correct');
    });

    QUnit.test('validation message has propagateOutsideClick=true', function(assert) {
        const validationMessage = this.getValidationMessage();
        assert.strictEqual(validationMessage.option('propagateOutsideClick'), true, '"propagateOutsideClick" option has correct value');
    });

    QUnit.test('Validation overlay should not inherit templates from the editor', function(assert) {
        this.reinitEditor({
            validationMessageMode: 'always',
            validationError: {
                message: 'Error'
            },
            integrationOptions: {
                templates: {
                    content: {
                        render() {
                            $('div').attr('id', 'editorContentTemplate');
                        }
                    }
                }
            },
            isValid: false
        });

        const editorContentTemplate = this.editor.$element().find(`.${INVALID_MESSAGE_CLASS}.dx-widget #editorContentTemplate`);
        assert.strictEqual(editorContentTemplate.length, 0, 'overlay does not inherit templates from the editor');
    });

    QUnit.test('validation message should be render correctly in hidden area', function(assert) {
        const $element = this.fixture.createOnlyElement();
        const $hiddenDiv = $('<div>').css('display', 'none');

        $element.appendTo($hiddenDiv);

        const validationMessage = 'text is required';
        this.editor = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: validationMessage
            },
            isValid: false
        });

        const $validationMessage = this.getValidationMessageElement();
        assert.strictEqual($validationMessage.text(), validationMessage, 'validation overlay text was render correctly');
    });

    QUnit.test('Validation overlay width after render in hidden area should be equal width in visible area', function(assert) {
        const $element = this.fixture.createOnlyElement();
        const $hiddenDiv = $('<div>').css('display', 'none');

        $element.appendTo($hiddenDiv);
        $hiddenDiv.appendTo('#qunit-fixture');

        const validationMessage = 'text';
        this.editor = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: validationMessage
            },
            isValid: false,
            width: 305
        });

        $hiddenDiv.css('display', 'block');

        const $validationMessage = this.getValidationMessageElement();
        assert.strictEqual($validationMessage.outerWidth(), 305, 'overlay width was set correctly');
    });

    QUnit.test('Validation message text should be encoded', function(assert) {
        this.message = 'Error <script>alert("hello")</script> message';
        this.reinitEditor({
            validationMessageMode: 'always',
            validationError: {
                message: this.message
            },
            isValid: false,
            width: 305
        });

        const $validationMessage = this.getValidationMessageElement();
        assert.strictEqual($validationMessage.text(), this.message, 'error message is encoded');
    });
});

QUnit.module('Validation overlay options', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('it should be possible to redefine validation overlay options', function(assert) {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            validationTooltipOptions: {
                width: 200,
                customOption: 'Test'
            },
            isValid: false
        });

        const overlay = $element.find(`.${INVALID_MESSAGE_CLASS}.dx-widget`).dxValidationMessage('instance');

        assert.strictEqual(overlay.option('customOption'), 'Test', 'a custom option has been created');
        assert.strictEqual(overlay.option('width'), 200, 'a default option has been redefined');
    });

    QUnit.test('editor"s overlay options should be changed when validation overlay"s options changed', function(assert) {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        assert.strictEqual(instance.option('validationTooltipOptions.width'), 'auto', 'options are readable on init');

        const overlay = instance._validationMessage;

        overlay.option('width', 150);
        assert.strictEqual(instance.option('validationTooltipOptions.width'), 150, 'option has ben changed');
    });

    QUnit.test('it should be possible to set validationTooltipOptions dynamically', function(assert) {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        const overlay = instance._validationMessage;

        instance.option('validationTooltipOptions.width', 130);
        assert.strictEqual(overlay.option('width'), 130, 'option has ben changed');

        instance.option('validationTooltipOptions', { height: 50 });
        assert.strictEqual(overlay.option('height'), 50, 'option has ben changed');
        assert.strictEqual(instance.option('validationTooltipOptions.width'), 130, 'redefined object"s fields was not changed');
        assert.strictEqual(instance.option('validationTooltipOptions.shading'), false, 'default object"s fields was not changed');
    });

    QUnit.test('it should be possible to set null or undefined to the validationTooltipOptions', function(assert) {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        const overlay = instance._validationMessage;

        instance.option('validationTooltipOptions.test', 130);
        instance.option('validationTooltipOptions.test2', 120);
        assert.strictEqual(overlay.option('test'), 130, 'option has ben changed');
        assert.strictEqual(overlay.option('test2'), 120, 'option has ben changed');

        instance.option('validationTooltipOptions', { test2: null, test: undefined });
        assert.strictEqual(overlay.option('test'), undefined, 'option has ben changed');
        assert.strictEqual(overlay.option('test2'), null, 'option has ben changed');
    });

    QUnit.test('default validation options should not be redefined on revalidation', function(assert) {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        instance.option({
            isValid: true,
            validationError: {
                message: 'New error message'
            }
        });
        instance.option('isValid', false);

        const message = this.getValidationMessage().$content().text();
        assert.strictEqual(message, 'New error message');
    });

    QUnit.test('editor should clear validation message cache on dispose (T968422)', function(assert) {
        assert.expect(0);

        class TestEditor extends Editor {
            repaintValidationMessage() {
                this._validationMessage && this._validationMessage.repaint();
                this._$validationMessage
                    && this._$validationMessage.dxValidationMessage('instance').repaint();
            }
        }

        const $element = this.fixture.createOnlyElement();
        const instance = new TestEditor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        instance.dispose();

        try {
            instance.repaintValidationMessage();
        } catch(e) {
            assert.ok(false, 'cache is not cleared on editor dispose');
        }
    });
});

QUnit.module('Validation Events', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('validationRequest event should fire on value change', function(assert) {
        const value = 'test123';
        const handler = sinon.stub();

        const editor = this.fixture.createEditor({
            value: 'xxx'
        });

        editor.validationRequest.add(handler);

        // act
        editor.option('value', value);
        // assert
        const params = handler.getCall(0).args[0];
        assert.ok(handler.calledOnce, 'Validating handler should be called');
        assert.strictEqual(params.value, value, 'Correct value was passed');
        assert.strictEqual(params.editor, editor, 'Editor was passed');
    });

    QUnit.test('T220137: validationRequest event should NOT fire on value change', function(assert) {
        const nullValue = null;
        const handler = sinon.stub();

        const editor = this.fixture.createEditor({
            value: undefined
        });

        editor.validationRequest.add(handler);

        // act
        editor.option('value', nullValue);
        // assert
        assert.ok(!handler.called, 'Validating handler should not be called');
    });

    QUnit.test('validationRequest fires before valueChanged callback', function(assert) {
        const editor = this.fixture.createEditor({
            value: 'empty',
            onValueChanged: ({ value, previousValue }) => {
                assert.step(`Value changed from "${previousValue}" to "${value}"`);
                if(value.toUpperCase() !== value) {
                    editor.option('value', value.toUpperCase());
                }
            }
        });

        editor.validationRequest.add(({ value }) => {
            assert.step(`Validate value: "${value}"`);
        });

        editor.option('value', 'test');

        assert.verifySteps([
            'Validate value: "test"',
            'Value changed from "empty" to "test"',
            'Validate value: "TEST"',
            'Value changed from "test" to "TEST"'
        ]);
    });
});

QUnit.module('aria accessibility', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('readonly state', function(assert) {
        const editor = this.fixture.createEditor({ readOnly: true });

        assert.strictEqual(editor.$element().attr('aria-readonly'), 'true', 'aria-readonly is correct');

        editor.option('readOnly', false);
        assert.strictEqual(editor.$element().attr('aria-readonly'), undefined, 'aria-readonly does not exist in not readonly state');
    });

    QUnit.test('invalid state', function(assert) {
        const editor = this.fixture.createEditor({
            isValid: false,
            validationError: {
                message: 'test message'
            }
        });
        const messageId = this.getValidationMessage().$content().attr('id');

        assert.strictEqual(editor.$element().attr('aria-invalid'), 'true', 'aria-invalid is correct');
        assert.ok(editor.$element().get(0).hasAttribute('aria-describedby'), 'invalid editor should have the "aria-describedby" attribute');
        assert.strictEqual(editor.$element().attr('aria-describedby'), messageId, 'invalid editor should be described by a message');

        editor.option('isValid', true);
        assert.strictEqual(editor.$element().attr('aria-invalid'), undefined, 'aria-invalid does not exist in valid state');
        assert.strictEqual(editor.$element().attr('aria-describedby'), undefined, 'aria-describedby does not exist in valid state');
    });
});

QUnit.module('private api', moduleConfig, () => {

    QUnit.test('should detach keyboard handler if readOnly is false', function(assert) {
        const editor = this.fixture.createEditor({ focusStateEnabled: true, readOnly: true });

        assert.notOk(editor._keyboardListenerId);

        editor.option('readOnly', false);
        assert.ok(editor._keyboardListenerId);
    });

    QUnit.test('If _valueChangeEventInstance is present, the onValueChanged must receive it as a Event argument; and then _valueChangeEventInstance must be reset', function(assert) {
        const newValue = 'new';
        const _valueChangeEventInstance = 'something';

        const onValueChanged = options => {
            assert.strictEqual(options.event, _valueChangeEventInstance, 'Event is ok');
        };

        const editor = this.fixture.createEditor();
        editor.option('onValueChanged', onValueChanged);
        editor._valueChangeEventInstance = _valueChangeEventInstance;
        editor.option('value', newValue);
        assert.strictEqual(editor._valueChangeEventInstance, undefined, '_valueChangeEventInstance is reset');
    });

    QUnit.test('_suppressValueChangeAction should suppress invoking _suppressValueChangeAction', function(assert) {
        assert.expect(0);

        const editor = this.fixture.createEditor();
        editor._suppressValueChangeAction();
        editor.option('onValueChanged', () => {
            throw Error('failed');
        });
        editor.option('value', true);
    });

    QUnit.test('_resumeValueChangeAction should resume invoking _suppressValueChangeAction', function(assert) {
        const value = 'value';

        const onValueChanged = options => {
            assert.strictEqual(options.value, value);
        };

        assert.expect(1);

        const editor = this.fixture.createEditor();
        editor._suppressValueChangeAction();
        editor._resumeValueChangeAction();
        editor.option('onValueChanged', onValueChanged);
        editor.option('value', value);
    });
});
