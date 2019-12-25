var $ = require('jquery'),
    Class = require('core/class'),
    Editor = require('ui/editor/editor'),
    DefaultAdapter = require('ui/validation/default_adapter'),
    ValidationEngine = require('ui/validation_engine');

require('ui/validator');

var Fixture = Class.inherit({
    createValidator: function(options, element) {
        this.$element = element || this.$element || $('<div/>');
        this.stubAdapter = sinon.createStubInstance(DefaultAdapter);
        var validator = this.$element.dxValidator($.extend({
            adapter: this.stubAdapter
        }, options)).dxValidator('instance');

        return validator;
    },
    createEditor: function(editorOptions) {
        this.$element = $('<div/>');
        return new Editor(this.$element, $.extend({}, editorOptions));
    },

    teardown: function() {
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
});

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
