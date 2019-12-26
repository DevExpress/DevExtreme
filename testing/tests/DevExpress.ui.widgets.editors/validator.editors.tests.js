import $ from 'jquery';
import Class from 'core/class';
import Editor from 'ui/editor/editor';
import DefaultAdapter from 'ui/validation/default_adapter';
import ValidationEngine from 'ui/validation_engine';
import TextEditorBase from 'ui/text_box/ui.text_editor.base';
import { Deferred } from 'core/utils/deferred';

import 'ui/validator';
import 'ui/load_indicator';

const Fixture = Class.inherit({
    createValidator(options, element) {
        this.$element = element || this.$element || $('<div/>');
        this.stubAdapter = sinon.createStubInstance(DefaultAdapter);
        const validator = this.$element.dxValidator($.extend({
            adapter: this.stubAdapter
        }, options)).dxValidator('instance');

        return validator;
    },
    createEditor(editorOptions) {
        this.$element = $('<div/>');
        return new Editor(this.$element, $.extend({}, editorOptions));
    },
    createTextEditor(editorOptions) {
        this.$element = $('<div/>');
        return new TextEditorBase(this.$element, $.extend({}, editorOptions));
    },
    teardown() {
        this.$element.remove();
        ValidationEngine.initGroups();
    }
});

QUnit.module('Editors Standard Adapter', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('Adapter reacts on editor\'s value change - to invalid', function(assert) {
        var emptyValue = '',
            handler = sinon.stub(),
            editor = this.fixture.createEditor({
                value: '123'
            });

        this.fixture.createValidator({
            adapter: null,
            validationRules: [{
                type: 'required'
            }],
            onValidated: handler
        });

        editor.option('value', emptyValue);


        assert.strictEqual(editor.option('isValid'), false, 'Editor options should be set');
        assert.ok(handler.calledOnce, 'onValidated handler should be called');
        var brokenRule = handler.getCall(0).args[0].brokenRule;
        assert.ok(brokenRule, 'Validation error should exists');
        assert.equal(brokenRule.type, 'required', 'Correct message should be passed');
    });

    QUnit.test('Adapter reacts on editor\'s value change - to valid', function(assert) {
        var value = '123',
            handler = sinon.stub(),
            editor = this.fixture.createEditor({
                value: ''
            }),
            validator = this.fixture.createValidator({
                adapter: null,
                validationRules: [{
                    type: 'required'
                }],
                onValidated: handler
            });


        validator.validate();
        editor.option('value', value);

        assert.strictEqual(editor.option('isValid'), true, 'Editor options should be set');
        assert.ok(handler.calledTwice, 'onValidated handler should be called two times');
        var brokenRule = handler.getCall(1).args[0].brokenRule;
        assert.ok(!brokenRule, 'Validation error should not be set');
    });


    QUnit.test('Validation request should get value from editor', function(assert) {
        var value = '123',
            editor = this.fixture.createEditor({
                value: value
            }),
            validator = this.fixture.createValidator({
                adapter: null,
                validationRules: [{
                    type: 'required'
                }]
            });


        var result = validator.validate();

        assert.strictEqual(result.isValid, true, 'result should be valid');

        assert.strictEqual(editor.option('isValid'), true, 'Editor options should be set');
    });


    QUnit.test('Editor\'s validators request should not be mixed with another editors', function(assert) {
        var value = '123',
            emptyValue = '';

        var editor1 = this.fixture.createEditor({
            value: value
        });

        this.fixture.createValidator(
            {
                adapter: null,
                validationRules: [{
                    type: 'required'
                }]
            },
            editor1.$element()
        );

        var editor2 = this.fixture.createEditor({
            value: emptyValue
        });


        this.fixture.createValidator(
            {
                adapter: null,
                validationRules: [{
                    type: 'required'
                }]
            },
            editor2.$element()
        );

        // act
        editor1.option('value', emptyValue);
        // assert
        assert.strictEqual(editor1.option('isValid'), false, 'Editor1 changed and should be marked as valid');
        assert.strictEqual(editor2.option('isValid'), true, 'Editor2 have not changed yet and should not be validated');
    });


    QUnit.test('Editor-specific validation should be kept', function(assert) {
        var
            handler = sinon.stub(),
            editor = this.fixture.createEditor({
                value: 'abc',
                isValid: false,
                validationError: {
                    message: 'Something went wrong in Editor itself',
                    editorSpecific: true
                }
            }),
            validator = this.fixture.createValidator({
                adapter: null,
                validationRules: [{
                    type: 'required'
                }],
                onValidated: handler
            });


        // act
        validator.validate();

        // assert
        assert.strictEqual(editor.option('isValid'), false, 'Editor should be kept invalid');
        assert.strictEqual(validator.option('isValid'), false, 'Validator should become invalid');
        assert.ok(handler.calledOnce);
        var params = handler.getCall(0).args[0];
        assert.strictEqual(params.isValid, false, 'Result should be marked as invalid');
        assert.ok(params.brokenRule, 'validationError should be passed');
        assert.equal(params.brokenRule.message, 'Something went wrong in Editor itself', 'Message from editor should be passed');

    });

    QUnit.test('Disabled editor should bypass validation', function(assert) {
        this.fixture.createEditor({
            disabled: true
        });

        var validator = this.fixture.createValidator({
            adapter: null,
            validationRules: [{
                type: 'required'
            }]
        });

        // act
        var result = validator.option('adapter').bypass();
        // assert

        assert.strictEqual(result, true, 'Disabled editor should bypass validation');
    });

    QUnit.test('Reset value of custom validation rule when the required rule is defined before it', function(assert) {
    // arrange
        var editor = this.fixture.createEditor(),
            spy = sinon.spy(function() { return false; }),
            validator = this.fixture.createValidator({
                adapter: null,
                validationRules: [
                    { type: 'required' },
                    {
                        type: 'custom',
                        validationCallback: spy
                    }
                ]
            });

        // act
        editor.option('value', 'test');
        validator.reset();
        editor.option('value', 'test');

        // assert
        assert.equal(spy.callCount, 2, 'The validationCallback is called after reset');
    });

    QUnit.test('Editor should display pending indicator after repaint', function(assert) {
    // arrange
        const editor = this.fixture.createTextEditor({
                value: 'test'
            }),
            validator = this.fixture.createValidator({
                adapter: null,
                validationRules: [
                    {
                        type: 'async',
                        validationCallback: function() {
                            return new Deferred().promise();
                        }
                    }
                ]
            });

        validator.validate();
        let indicator = editor.$element().find('.dx-pending-indicator').dxLoadIndicator('instance');

        assert.ok(indicator, 'indicator found after valiating');
        assert.ok(indicator.option('visible'), 'indicator is shown after validating');

        editor.repaint();
        indicator = editor.$element().find('.dx-pending-indicator').dxLoadIndicator('instance');

        assert.ok(indicator, 'indicator found after repainting');
        assert.ok(indicator.option('visible'), 'indicator is shown after repainting');
    });

    QUnit.test('Editor should not display valid mark after resetting a value', function(assert) {
    // arrange
        const editor = this.fixture.createTextEditor({
                value: 'test'
            }),
            validator = this.fixture.createValidator({
                adapter: null,
                validationRules: [
                    {
                        type: 'async',
                        ignoreEmptyValue: true,
                        validationCallback: function() {
                            return new Deferred().resolve().promise();
                        }
                    }
                ]
            }),
            done = assert.async();

        const result = validator.validate();
        result.complete.then(() => {
            assert.ok(editor.$element().hasClass('dx-valid'), 'editor has the \'dx-valid\' CSS after validating');

            validator.reset();

            assert.notOk(editor.$element().hasClass('dx-valid'), 'editor does not have the \'dx-valid\' CSS after resetting a value');

            done();
        });
    });

    QUnit.test('Editor - validation options should be synchrnoized on init', function(assert) {
        const err1 = { message: '1' },
            err2 = { message: '2' };
        let editor = this.fixture.createEditor({
            isValid: false,
            validationError: err1
        });

        assert.strictEqual(editor.option('validationStatus'), 'invalid', 'validationStatus === \'invalid\'');
        assert.strictEqual(editor.option('validationErrors[0]'), err1, 'validationErrors[0] === err1');

        this.fixture.teardown();
        editor = this.fixture.createEditor({
            isValid: false,
            validationErrors: [err2, err1]
        });
        assert.strictEqual(editor.option('validationStatus'), 'invalid', 'validationStatus === \'invalid\'');
        assert.strictEqual(editor.option('validationError'), err2, 'validationError === err2');

        this.fixture.teardown();
        editor = this.fixture.createEditor({
            isValid: false,
            validationErrors: [err2, err1]
        });
        assert.strictEqual(editor.option('validationStatus'), 'invalid', 'validationStatus === \'invalid\'');
        assert.strictEqual(editor.option('validationError'), err2, 'validationError === err2');

        this.fixture.teardown();
        editor = this.fixture.createEditor({
            validationStatus: 'invalid'
        });
        assert.strictEqual(editor.option('isValid'), false, 'isValid === false');
    });

    QUnit.test('Editor - validation options should be synchrnoized at runtime', function(assert) {
        const editor = this.fixture.createEditor({}),
            err1 = { message: '1' },
            err2 = { message: '2' };

        editor.option('isValid', false);
        assert.strictEqual(editor.option('validationStatus'), 'invalid', 'validationStatus === \'invalid\'');

        editor.option('isValid', true);
        assert.strictEqual(editor.option('validationStatus'), 'valid', 'validationStatus === \'valid\'');

        editor.option('validationStatus', 'pending');
        assert.ok(editor.option('isValid'), 'isValid === true');

        editor.option('validationStatus', 'invalid');
        assert.notOk(editor.option('isValid'), 'isValid === false');

        editor.option('validationStatus', 'valid');
        assert.ok(editor.option('isValid'), 'isValid === true');


        editor.option('validationError', err1);
        assert.strictEqual(editor.option('validationErrors[0]'), err1, 'validationErrors[0] === err1');

        editor.option('validationError', err2);
        assert.strictEqual(editor.option('validationErrors[0]'), err2, 'validationErrors[0] === err2');

        editor.option('validationError', null);
        assert.notOk(editor.option('validationErrors'), 'validationErrors === null');

        editor.option('validationErrors', [err1]);
        assert.strictEqual(editor.option('validationError'), err1, 'validationError === err1');

        editor.option('validationErrors', [err2, err1]);
        assert.strictEqual(editor.option('validationError'), err2, 'validationError === err2');

        editor.option('validationErrors', null);
        assert.notOk(editor.option('validationError'), 'validationError === null');
    });
});

