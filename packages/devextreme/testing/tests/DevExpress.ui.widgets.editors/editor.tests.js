import $ from 'jquery';
import { Component } from 'core/component';
import OldEditor from 'ui/editor/editor';
import CheckBoxEditor from '__internal/ui/check_box/editor_base/generated_wrapper';
import Class from 'core/class';
import ValidationEngine from 'ui/validation_engine';
import hoverEvents from 'common/core/events/hover';
import { wrapRenovatedWidget } from '../../helpers/wrapRenovatedWidget.js';
import Validator from 'ui/validator';
import { getOuterWidth } from 'core/utils/size';

import 'generic_light.css!';

const wrapRenovatedEditor = (editor) => {
    const wrapperEditor = wrapRenovatedWidget(editor);
    wrapperEditor.isEditor = editor.isEditor;

    return wrapperEditor;
};

const INVALID_MESSAGE_CLASS = 'dx-invalid-message';

[
    [OldEditor, 'Old editor'],
    [wrapRenovatedEditor(CheckBoxEditor), 'CheckBox\'s r1 editor'],
].forEach(([Editor, name]) => {

    QUnit.module(name, () => {
        const Fixture = Class.inherit({
            createEditor(options) {
                this.$element = $('<div/>').appendTo('#qunit-fixture');
                const editor = new Editor(this.$element, options);

                return editor;
            },
            createOnlyElement() {
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

        QUnit.module('isDirty', moduleConfig, () => {
            QUnit.test('is false by default', function(assert) {
                const editor = this.fixture.createEditor();

                const isDirty = editor.option('isDirty');

                assert.strictEqual(isDirty, false);
            });

            QUnit.test('should be true if value differ from initial', function(assert) {
                const editor = this.fixture.createEditor();

                editor.option('value', '1234');

                assert.strictEqual(editor.option('isDirty'), true);
            });

            QUnit.test('should should be false if value updated to initial', function(assert) {
                const initialValue = '1';
                const editor = this.fixture.createEditor({ value: initialValue });

                editor.option('value', '123');
                editor.option('value', initialValue);

                assert.strictEqual(editor.option('isDirty'), false);
            });
        });


        QUnit.module('reset', moduleConfig, () => {
            ['1', undefined, null].forEach((initialValue) => {
                QUnit.test(`should update value to initial if initial value was ${initialValue}`, function(assert) {
                    const editor = this.fixture.createEditor({ value: initialValue });

                    editor.option('value', '123');

                    editor.reset();

                    assert.strictEqual(editor.option('value'), initialValue);
                });
            });

            QUnit.test('should not affect default isDirty', function(assert) {
                const editor = this.fixture.createEditor();

                editor.reset();

                assert.strictEqual(editor.option('isDirty'), false);
            });

            QUnit.test('to same value should set isDirty to false', function(assert) {
                const editor = this.fixture.createEditor();

                editor.option('value', 'newValue');

                assert.strictEqual(editor.option('isDirty'), true);

                editor.reset('newValue');

                assert.strictEqual(editor.option('isDirty'), false);
            });

            QUnit.test('with parameters should set correct value', function(assert) {
                const initialValue = '1';
                const editor = this.fixture.createEditor({ value: initialValue });

                editor.reset('4');

                assert.strictEqual(editor.option('value'), '4');
            });

            QUnit.test('should set isDirty to false', function(assert) {
                const editor = this.fixture.createEditor();

                editor.option('value', '123');
                assert.strictEqual(editor.option('isDirty'), true);

                editor.reset();

                assert.strictEqual(editor.option('isDirty'), false);
            });

            QUnit.test('with parameters should set isDirty to false', function(assert) {
                const editor = this.fixture.createEditor();

                editor.option('value', '123');
                assert.strictEqual(editor.option('isDirty'), true);

                editor.reset('2');

                assert.strictEqual(editor.option('isDirty'), false);
            });

            QUnit.test('should set value correctly when undefined used as value', function(assert) {
                const editor = this.fixture.createEditor({ value: '1' });

                editor.reset(undefined);

                assert.strictEqual(editor.option('value'), undefined);
            });

            QUnit.test('should set isDirty correctly when undefined used as value', function(assert) {
                const editor = this.fixture.createEditor({ value: '1' });

                editor.reset(undefined);

                assert.strictEqual(editor.option('isDirty'), false);
            });
        });


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

            skipForRenovated('prevent backspace event when editor is readonly', () => {
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

        QUnit.module('methods', moduleConfig, () => {
            QUnit.test('clear', function(assert) {
                const editor = this.fixture.createEditor({ value: '123' });

                editor.clear();

                assert.strictEqual(editor.option('value'), null);
            });

            QUnit.testInActiveWindow('focus', function(assert) {
                const editor = this.fixture.createEditor({ value: '123', focusStateEnabled: true });

                $(editor.$element()).on('focus', () => {
                    assert.ok(true, 'editor is focused');
                });

                editor.focus();
            });

            QUnit.testInActiveWindow('The blur() method does not blur the active item', function(assert) {
                const blurSpy = sinon.spy();
                const editor = this.fixture.createEditor({ value: '123' });
                const $testElement = $('<input type="button">');
                $testElement.appendTo('#qunit-fixture');
                $testElement.on('blur', blurSpy);
                $testElement.focus();

                editor.blur();

                assert.strictEqual(blurSpy.callCount, 0);
            });

            if(Editor.IS_RENOVATED_WIDGET) {
                QUnit.testInActiveWindow('The blur() method should blur editor element if it is active', function(assert) {
                    const blurSpy = sinon.spy();
                    const editor = this.fixture.createEditor({ value: '123', focusStateEnabled: true });
                    const $editor = $(editor.$element());
                    $editor.on('blur', blurSpy);

                    $editor.focus();
                    $editor.blur();

                    assert.strictEqual(blurSpy.callCount, 1, 'editor element is blurred');
                });
            }
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

            QUnit.test('onValueChanged should work correctly when it is passed on onInitialized (T314007)', function(assert) {
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

        QUnit.module('validation', {
            beforeEach: function() {
                this.fixture = new Fixture();
                this.message = 'That is very bad editor';
                this.getValidationMessage = () => {
                    return this.editor.$element()
                        .find(`.${INVALID_MESSAGE_CLASS}`).eq(0)
                        .dxValidationMessage()
                        .dxValidationMessage('instance');
                };
                this.getValidationMessageElement = () => {
                    return this.getValidationMessage().$element();
                };

                this.reinitEditor = (options = {}) => {
                    this.editor.dispose();
                    this.editor = this.fixture.createEditor(options);
                };

                this.editor = this.fixture.createEditor({
                    isValid: false,
                    validationError: {
                        message: this.message
                    }
                });
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

            QUnit.test('should change "isValid" option if "validationStatus" option is defined on init', function(assert) {
                this.reinitEditor({ validationStatus: 'invalid' });

                assert.strictEqual(this.editor.option('isValid'), false, 'isValid option is changed');
            });

            QUnit.test('should change "validationStatus" option if "isValid" option is defined on init', function(assert) {
                this.reinitEditor({ isValid: false });

                assert.strictEqual(this.editor.option('validationStatus'), 'invalid', 'validationStatus option is changed');
            });

            QUnit.test('should change "isValid" option if "validationStatus" option is changed on runtime', function(assert) {
                this.reinitEditor({});
                this.editor.option({ validationStatus: 'invalid' });

                assert.strictEqual(this.editor.option('isValid'), false, 'isValid option is changed');
            });

            QUnit.test('should change "validationStatus" option if "isValid" option is changed on runtime', function(assert) {
                this.reinitEditor({});
                this.editor.option({ isValid: false });

                assert.strictEqual(this.editor.option('validationStatus'), 'invalid', 'validationStatus option is changed');
            });

            QUnit.test('should change "validationErrors" option if "validationError" option is defined on init', function(assert) {
                this.reinitEditor({ validationError: { message: 'error' } });

                assert.strictEqual(this.editor.option('validationErrors')[0].message, 'error', 'validationErrors option is changed');
            });

            QUnit.test('should change "validationError" option if "validationErrors" option is defined on init', function(assert) {
                this.reinitEditor({ validationErrors: [{ message: 'error' }] });

                assert.strictEqual(this.editor.option('validationError').message, 'error', 'validationError option is changed');
            });

            QUnit.test('should change "validationErrors" option if "validationError" option is changed on runtime', function(assert) {
                this.reinitEditor({});
                this.editor.option({ validationError: { message: 'error' } });

                assert.strictEqual(this.editor.option('validationErrors')[0].message, 'error', 'validationErrors option is changed');
            });

            QUnit.test('should change "validationError" option if "validationErrors" option is changed on runtime', function(assert) {
                this.reinitEditor({});
                this.editor.option({ validationErrors: [{ message: 'error' }] });

                assert.strictEqual(this.editor.option('validationError').message, 'error', 'validationError option is changed');
            });

            QUnit.test('validator integration', function(assert) {
                this.reinitEditor({ value: '1' });
                new Validator(this.editor.$element(), {
                    validationRules: [{
                        type: 'required',
                        message: 'required'
                    }]
                });

                this.editor.option('value', undefined);

                assert.notOk(this.editor.option('isValid'), 'editor became invalid');
                assert.strictEqual(this.editor.option('validationError').message, 'required', 'error is correct');
            });

            QUnit.module('validation message', () => {
                QUnit.test('should be created if editor is invalid', function(assert) {
                    const validationMessage = this.getValidationMessage();
                    const $validationMessage = validationMessage.$element();

                    assert.ok($validationMessage, 'validation message is created');
                    assert.ok(validationMessage.$wrapper().find(`.${INVALID_MESSAGE_CLASS}.dx-overlay-wrapper`), 'overlay wrapper should also have dx-invalid-message class');
                    assert.strictEqual(validationMessage.option('mode'), 'auto', 'mode is passed correctly');
                    assert.strictEqual(validationMessage.$content().text(), this.message, 'message is correct');
                });

                QUnit.test('should be destroyed after editor become valid', function(assert) {
                    this.editor.option({ isValid: true });
                    const validationMessage = this.getValidationMessage();
                    assert.notOk(validationMessage, 'validation message is destroyed');
                });

                QUnit.test('should be destroyed after validationErrors was gone', function(assert) {
                    this.editor.option({ validationError: null });
                    assert.ok(!this.getValidationMessage(), 'validation message is destroyed');
                });

                QUnit.test('should be rerendered after validationStatus change', function(assert) {
                    this.reinitEditor({
                        isValid: true,
                        validationError: {
                            message: 'some'
                        },
                        validationStatus: 'pending'
                    });

                    assert.notOk(this.getValidationMessage(), 'validation message is not rendered');

                    this.editor.option({ validationStatus: 'invalid' });
                    assert.ok(this.getValidationMessage(), 'validation message is rendered after validationStatus becomes "invalid"');
                });

                QUnit.module('options', () => {
                    if(!Editor.IS_RENOVATED_WIDGET) {
                        QUnit.test('validationMessage should not be rendered if _showValidationMessage=false', function(assert) {
                            this.reinitEditor({
                                _showValidationMessage: false,
                                validationError: {
                                    message: '2'
                                },
                                isValid: false,
                            });

                            const validationMessage = this.getValidationMessage();
                            assert.strictEqual(validationMessage, undefined, 'validation message is not rendered');
                        });
                    }

                    QUnit.test('propagateOutsideClick=true', function(assert) {
                        const validationMessage = this.getValidationMessage();
                        assert.strictEqual(validationMessage.option('propagateOutsideClick'), true, '"propagateOutsideClick" option has correct value');
                    });

                    QUnit.test('mode option should be updated after editor validationMessageMode option change', function(assert) {
                        this.reinitEditor({
                            validationMessageMode: 'always',
                            isValid: false,
                            validationError: {
                                message: 'some'
                            }
                        });
                        const validationMessage = this.getValidationMessage();

                        assert.strictEqual(validationMessage.option('mode'), 'always', 'validationMessage has correct "mode" option');

                        this.editor.option('validationMessageMode', 'auto');
                        assert.strictEqual(validationMessage.option('mode'), 'auto', 'validationMessage has correct "mode" option after option change');
                    });

                    QUnit.test('validationMessage should be updated after validationError option runtime change', function(assert) {
                        this.reinitEditor({
                            isValid: true,
                            validationError: {
                                message: '1'
                            },
                            validationStatus: 'invalid'
                        });

                        this.editor.option({ validationError: { message: '2' } });
                        const message = this.getValidationMessage().$content().text();
                        assert.strictEqual(message, '2', 'validation message is updated');
                    });

                    QUnit.test('validationMessage should be updated after validationErrors option runtime change', function(assert) {
                        this.reinitEditor({
                            isValid: true,
                            validationError: {
                                message: '2'
                            },
                            validationStatus: 'invalid'
                        });

                        this.editor.option({ validationErrors: [{ message: '3' }] });
                        const message = this.getValidationMessage().$content().text();
                        assert.strictEqual(message, '3', 'validation message is updated');
                    });

                    QUnit.test('validationMessage should have correct position from validationMessagePosition on init', function(assert) {
                        this.reinitEditor({
                            validationError: {
                                message: '2'
                            },
                            validationStatus: 'invalid',
                            validationMessagePosition: 'right'
                        });

                        const position = this.getValidationMessage().option('positionSide');
                        assert.strictEqual(position, 'right', 'validation message position is updated');
                    });

                    QUnit.test('validationMessage should change position after validationMessagePosition option runtime change', function(assert) {
                        this.reinitEditor({
                            validationError: {
                                message: '2'
                            },
                            validationStatus: 'invalid'
                        });

                        this.editor.option('validationMessagePosition', 'left');
                        const position = this.getValidationMessage().option('positionSide');
                        assert.strictEqual(position, 'left', 'validation message position is updated');
                    });

                    if(!Editor.IS_RENOVATED_WIDGET) {
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
                    }

                    skipForRenovated('private validationTooltipOptions, validationBoundary, validationMessageOffset', () => {
                        QUnit.module('private options sync', () => {
                            QUnit.test('boundary should be updated after editor validationBoundary runtime change', function(assert) {
                                const $boundary = this.fixture.createOnlyElement().css({
                                    paddingTop: '100px'
                                });
                                const validationMessage = this.getValidationMessage();

                                assert.strictEqual(validationMessage.option('position.boundary'), undefined, 'validation message boundary is null');

                                this.editor.option({ validationBoundary: $boundary });
                                assert.strictEqual(validationMessage.option('position.boundary'), $boundary, 'validation message boundary was changed after editor validationBoundary change');
                            });

                            QUnit.test('position.offset should be updated after editor validationMessageOffset option change', function(assert) {
                                const defaultOffset = { v: 0, h: 0 };

                                const validationMessage = this.getValidationMessage();
                                assert.deepEqual(validationMessage.option('position.offset'), defaultOffset, 'validationMessage has correct "offset" option');

                                const newOffset = { v: 18, h: -12 };
                                this.editor.option('validationMessageOffset', newOffset);
                                assert.deepEqual(validationMessage.option('position.offset'), newOffset, 'validationMessage has correct "offset" option');
                            });

                            QUnit.test('position.offset should be updated after editor rtlEnabled option change', function(assert) {
                                const offset = { v: 10, h: 20 };

                                this.reinitEditor({
                                    isValid: false,
                                    validationError: {
                                        message: 'Message'
                                    },
                                    validationMessageOffset: offset
                                });
                                const validationMessage = this.getValidationMessage();
                                assert.deepEqual(validationMessage.option('position.offset'), offset, 'validationMessage has correct "offset" option');

                                this.editor.option('rtlEnabled', true);
                                offset.h = -offset.h;
                                assert.deepEqual(validationMessage.option('position.offset'), offset, 'validationMessage has correct "offset" option');
                            });

                            QUnit.test('it should be possible to redefine validation message options', function(assert) {
                                this.reinitEditor({
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

                                const validationMessage = this.getValidationMessage();

                                assert.strictEqual(validationMessage.option('customOption'), 'Test', 'a custom option has been created');
                                assert.strictEqual(validationMessage.option('width'), 200, 'a default option has been redefined');
                            });

                            QUnit.test('editor overlay options should be changed when validation overlay options are changed', function(assert) {
                                assert.strictEqual(this.editor.option('validationTooltipOptions.width'), 'auto', 'options are readable on init');

                                const validationMessage = this.getValidationMessage();

                                validationMessage.option('width', 150);
                                assert.strictEqual(this.editor.option('validationTooltipOptions.width'), 150, 'option has been changed');
                            });

                            QUnit.test('it should be possible to set validationTooltipOptions dynamically', function(assert) {
                                const validationMessage = this.getValidationMessage();

                                this.editor.option('validationTooltipOptions.width', 130);
                                assert.strictEqual(validationMessage.option('width'), 130, 'width option has been changed');

                                this.editor.option('validationTooltipOptions', { height: 50 });
                                assert.strictEqual(validationMessage.option('height'), 50, 'height option has been changed');

                                assert.strictEqual(this.editor.option('validationTooltipOptions.width'), 130, 'redefined object"s fields was not changed');
                                assert.strictEqual(this.editor.option('validationTooltipOptions.shading'), false, 'default object"s fields was not changed');
                            });

                            QUnit.test('it should be possible to set null or undefined to the validationTooltipOptions', function(assert) {
                                const validationMessage = this.getValidationMessage();

                                this.editor.option('validationTooltipOptions.test', 130);
                                this.editor.option('validationTooltipOptions.test2', 120);
                                assert.strictEqual(validationMessage.option('test'), 130, 'option has been changed');
                                assert.strictEqual(validationMessage.option('test2'), 120, 'option has been changed');

                                this.editor.option('validationTooltipOptions', { test2: null, test: undefined });
                                assert.strictEqual(validationMessage.option('test'), undefined, 'option has been changed');
                                assert.strictEqual(validationMessage.option('test2'), null, 'option has been changed');
                            });

                            QUnit.test('default validation options should not be redefined on revalidation', function(assert) {
                                this.editor.option({
                                    isValid: true,
                                    validationError: {
                                        message: 'New error message'
                                    }
                                });
                                this.editor.option('isValid', false);

                                const message = this.getValidationMessage().$content().text();
                                assert.strictEqual(message, 'New error message');
                            });
                        });
                    });
                });

                QUnit.module('width', () => {
                    QUnit.test('should be equal to editor width', function(assert) {
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
                        assert.strictEqual(getOuterWidth($validationMessage), width, 'validation message width is correct');
                    });

                    QUnit.test('should be equal to editor width after property runtime change', function(assert) {
                        const width = 200;
                        this.editor.option('width', width);

                        const $validationMessage = this.getValidationMessageElement();
                        assert.strictEqual(getOuterWidth($validationMessage), width, 'validation message width is correct');
                    });

                    QUnit.test('should be correct for small content', function(assert) {
                        this.reinitEditor({
                            width: 500,
                            validationMessageMode: 'always',
                            validationError: {
                                message: 'Err'
                            },
                            isValid: false
                        });

                        const $content = this.getValidationMessage().$content();
                        const contentWidth = getOuterWidth($content);

                        assert.strictEqual(getOuterWidth($content.css('width', 'auto')), contentWidth, 'validation message width is correct');
                    });

                    QUnit.test('should be min 100px if the editor has smaller size (T376114)', function(assert) {
                        this.reinitEditor({
                            width: 20,
                            validationMessageMode: 'always',
                            validationError: {
                                message: 'ErrorErrorErrorErrorErrorErrorError'
                            },
                            isValid: false
                        });
                        const $content = this.getValidationMessage().$content();

                        assert.strictEqual(getOuterWidth($content), 100, 'the validation message width is correct');
                    });

                    QUnit.test('should be equal to width in visible area after render in hidden area', function(assert) {
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
                        assert.strictEqual(getOuterWidth($validationMessage), 305, 'overlay width was set correctly');
                    });

                    QUnit.test('content width should be less or equal to message width', function(assert) {
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

                        assert.ok(getOuterWidth($content) <= getOuterWidth($validationMessage), 'validation message width is correct');
                    });

                    skipForRenovated('update validation message maxWidth on editor width change', () => {
                        QUnit.test('max width should be updated after editor width runtime change', function(assert) {
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
                            assert.strictEqual(getOuterWidth($content), 200, 'the validation message width is correct');

                            this.editor.option('width', 80);
                            $content = this.getValidationMessage().$content();
                            assert.strictEqual(getOuterWidth($content), 100, 'the validation message width is correct');
                        });
                    });
                });

                QUnit.module('text', () => {
                    QUnit.test('should not be wrapped', function(assert) {
                        const $content = this.getValidationMessage().$content();

                        assert.strictEqual($content.css('whiteSpace'), 'normal', 'text is not wrapped');
                    });

                    QUnit.test('should be encoded', function(assert) {
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

                QUnit.test('should flip if it is out of validationBoundary', function(assert) {
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

                QUnit.test('should be rendered correctly in hidden area', function(assert) {
                    const $element = this.fixture.createOnlyElement();
                    const $hiddenDiv = this.fixture.createOnlyElement().css('display', 'none');

                    $element.appendTo($hiddenDiv);

                    const message = 'text is required';
                    this.editor.$element().remove();
                    this.editor = new Editor($element, {
                        validationMessageMode: 'always',
                        validationError: {
                            message
                        },
                        isValid: false
                    });

                    const $validationMessage = this.getValidationMessageElement();
                    assert.strictEqual($validationMessage.text(), message, 'validation overlay text was render correctly');
                });
            });

            QUnit.module('aria-describedby attribute', () => {
                QUnit.test('should be added if editor is invalid', function(assert) {
                    assert.ok(this.editor.$element().attr('aria-describedby'));
                });

                QUnit.test('should not be updated after option change without validation state change', function(assert) {
                    const $editor = this.editor.$element();
                    const describedBy = $editor.attr('aria-describedby');

                    this.editor.option('value', true);

                    assert.strictEqual($editor.attr('aria-describedby'), describedBy, 'attr was not changed');
                });

                QUnit.test('should be correct after repaint', function(assert) {
                    const $editor = this.editor.$element();

                    this.editor.repaint();

                    const validationMessageContentId = this.getValidationMessage().$content().attr('id');
                    assert.strictEqual($editor.attr('aria-describedby'), validationMessageContentId, 'describedby is correct');
                });

                QUnit.test('should be the same after validation state change', function(assert) {
                    const $editor = this.editor.$element();

                    this.editor.option('isValid', true);
                    this.editor.option('isValid', false);

                    const validationMessageContentId = this.getValidationMessage().$content().attr('id');
                    assert.strictEqual($editor.attr('aria-describedby'), validationMessageContentId, 'describedby is correct');
                });
            });
        });

        QUnit.module('aria accessibility', moduleConfig, () => {
            const expectedFalseValue = Editor.IS_RENOVATED_WIDGET ? 'false' : undefined;

            QUnit.test('readonly', function(assert) {
                const editor = this.fixture.createEditor({ readOnly: true });

                assert.strictEqual(editor.$element().attr('aria-readonly'), 'true', 'aria-readonly is correct');

                editor.option('readOnly', false);
                assert.strictEqual(editor.$element().attr('aria-readonly'), expectedFalseValue, 'aria-readonly does not exist in not readonly state');
            });

            QUnit.test('invalid state', function(assert) {
                const editor = this.fixture.createEditor({
                    isValid: false,
                    validationError: {
                        message: 'test message'
                    }
                });
                const $editor = editor.$element();
                const messageId = $editor.find(`.${INVALID_MESSAGE_CLASS}`)
                    .dxValidationMessage().dxValidationMessage('instance')
                    .$content().attr('id');

                assert.strictEqual($editor.attr('aria-invalid'), 'true', 'aria-invalid is correct');
                assert.ok($editor.get(0).hasAttribute('aria-describedby'), 'invalid editor should have the "aria-describedby" attribute');
                assert.strictEqual($editor.attr('aria-describedby'), messageId, 'invalid editor should be described by a message');

                editor.option('isValid', true);
                assert.strictEqual($editor.attr('aria-invalid'), expectedFalseValue, 'aria-invalid does not exist in valid state');
                assert.strictEqual($editor.attr('aria-describedby'), undefined, 'aria-describedby does not exist in valid state');
            });

            QUnit.test('"onMarkupRendered" is called after markup render (for validator integration)', function(assert) {
                const markupRenderedStub = sinon.stub();
                this.fixture.createEditor({
                    _onMarkupRendered: markupRenderedStub
                });

                assert.ok(markupRenderedStub.calledOnce);
            });
        });

        QUnit.module('private api', moduleConfig, () => {
            if(!Editor.IS_RENOVATED_WIDGET) {
                QUnit.test('should detach keyboard handler if readOnly is false', function(assert) {
                    const editor = this.fixture.createEditor({ focusStateEnabled: true, readOnly: true });

                    assert.notOk(editor._keyboardListenerId);

                    editor.option('readOnly', false);
                    assert.ok(editor._keyboardListenerId);
                });
            }

            QUnit.test('If _valueChangeEventInstance is present, the onValueChanged must receive it as a Event argument and then _valueChangeEventInstance must be reset', function(assert) {
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

            skipForRenovated('private: _suppressValueChangeAction, _resumeValueChangeAction', () => {
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
        });
        QUnit.module('validationRequest', moduleConfig, () => {
            QUnit.test('should fire on value change', function(assert) {
                const value = 'test123';
                const handler = sinon.stub();

                const editor = this.fixture.createEditor({
                    value: 'xxx'
                });
                editor.validationRequest.add(handler);

                editor.option('value', value);

                const args = handler.getCall(0).args[0];
                assert.ok(handler.calledOnce, 'validation handler should be called');
                assert.strictEqual(args.value, value, 'correct value was passed');
                assert.strictEqual(args.editor, editor, 'editor was passed');
            });

            QUnit.test('should NOT fire on value change from undefined to null (T220137)', function(assert) {
                const handler = sinon.stub();
                const editor = this.fixture.createEditor({
                    value: undefined
                });
                editor.validationRequest.add(handler);


                editor.option('value', null);

                assert.notOk(handler.called, 'validation handler was not called');
            });

            QUnit.test('should fire before valueChanged callback', function(assert) {
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

        if(!Editor.IS_RENOVATED_WIDGET) {
            QUnit.test('keybord navigation should work after editor becomes not read only', function(assert) {
                const $element = $('<div>').appendTo('body');
                const keyboardHandledStub = sinon.stub();

                const editor = new Editor($element, {
                    onKeyboardHandled: keyboardHandledStub,
                    readOnly: true
                });

                editor.option('readOnly', false);
                $(editor.$element()).trigger($.Event('keydown'));

                assert.ok(keyboardHandledStub.called, 'keyboard navigation works fine');
            });

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
    });
});
