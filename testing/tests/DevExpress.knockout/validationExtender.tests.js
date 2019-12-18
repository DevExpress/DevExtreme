var $ = require('jquery'),
    Editor = require('ui/editor/editor'),
    ValidationGroup = require('ui/validation_group'),
    ValidationEngine = require('ui/validation_engine'),
    registerComponent = require('core/component_registrator'),
    ko = require('knockout');

require('ui/button');
require('integration/knockout');

var FIXTURE_ELEMENT = $('<div id=qunit-fixture></div>').appendTo('body');

QUnit.module('Ko Extender');

QUnit.test('dxValidator should be stuck to observable', function(assert) {
    var vm = {
        login: ko.observable('test').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };

    assert.ok(vm.login.dxValidator, 'dxValidator should be added to observable');
    assert.ok(vm.login.dxValidator.validate, 'dxValidator should have \'validate\' method');
    assert.ok(vm.login.dxValidator.on, 'dxValidator should have \'on\' method');
});


QUnit.test('Engine can subscribe to validate group', function(assert) {
    var vm = {
        login: ko.observable('test').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };
    // act
    ValidationEngine.registerModelForValidation(vm);

    // assert
    var groupConfig = ValidationEngine.getGroupConfig(vm);
    assert.ok(groupConfig, 'Config should be retrieved');
    assert.equal(groupConfig.validators.length, 1, 'Single validator should be registered');
    assert.strictEqual(groupConfig.validators[0], vm.login.dxValidator, 'Correct validator should be passed');
});

QUnit.test('Engine can validate model', function(assert) {
    var vm = {
        login: ko.observable('').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };
    ValidationEngine.registerModelForValidation(vm);
    // act
    var result = ValidationEngine.validateModel(vm);

    // assert
    assert.ok(result, 'Result should be retrieved');
    assert.strictEqual(result.isValid, false, 'Validation should not pass');
    assert.strictEqual(ValidationEngine.validateGroup, ValidationEngine.validateModel, 'Completely incorrect test of technical implementation');
    assert.strictEqual(result.brokenRules.length, 1, 'One rule should be broken');
    assert.strictEqual(result.brokenRules[0].validator, vm.login.dxValidator, 'Validator should be included into the rule');
});

QUnit.test('Unregister knockout model for validation', function(assert) {
    var vm = {
        login: ko.observable('test').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };

    ValidationEngine.registerModelForValidation(vm);

    var groupConfig = ValidationEngine.getGroupConfig(vm);

    assert.equal(groupConfig.validators.length, 1, 'Single validator should be registered');

    ValidationEngine.unregisterModelForValidation(vm);

    assert.equal(groupConfig.validators.length, 0, 'Validators should be unregistered');
});

QUnit.test('validated handler should be called', function(assert) {
    var vm = {
            login: ko.observable('').extend({
                dxValidator: {
                    validationRules: [{ type: 'required' }]
                }
            })
        },
        validatedHandler = sinon.stub();
    vm.login.dxValidator.on('validated', validatedHandler);
    // act
    vm.login.dxValidator.validate();

    // assert
    assert.ok(validatedHandler.calledOnce, 'Handler should be called');
    var args = validatedHandler.getCall(0).args;
    assert.ok(args, 'Args should be passed');
    assert.strictEqual(args[0].value, '', 'Value should be passed');
    assert.strictEqual(args[0].isValid, false, 'validation result should be passed');
    assert.strictEqual(args[0].validator, vm.login.dxValidator, 'validation result should be passed');
});


QUnit.test('changing observable value should cause validation', function(assert) {
    var vm = {
            login: ko.observable('').extend({
                dxValidator: {
                    validationRules: [{ type: 'required' }]
                }
            })
        },
        validatedHandler = sinon.stub();
    vm.login.dxValidator.on('validated', validatedHandler);
    // act
    vm.login('new value');

    // assert
    assert.ok(validatedHandler.calledOnce, 'Handler should be called');
    var args = validatedHandler.getCall(0).args;
    assert.ok(args, 'Args should be passed');
    assert.strictEqual(args[0].value, 'new value', 'Value should be passed');
});


QUnit.test('Model should be found as a validation group', function(assert) {
    var vm = {},
        $buttonContainer = $('<div></div>')
            .attr('data-bind', 'dxButton: { }')
            .appendTo(FIXTURE_ELEMENT);

    ko.applyBindings(vm, $buttonContainer[0]);
    // act
    var group = $buttonContainer.dxButton('_findGroup');
    // assert
    assert.strictEqual(group, vm, 'View model should be found as a group');
});

QUnit.test('dxValidationGroup should win Model', function(assert) {
    var vm = {},
        $groupContainer = $('<div></div>')
            .attr('data-bind', 'dxValidationGroup: { }')
            .appendTo(FIXTURE_ELEMENT),
        $buttonContainer = $('<div></div>')
            .attr('data-bind', 'dxButton: { }')
            .appendTo($groupContainer);


    ko.applyBindings(vm, $groupContainer[0]);
    var groupInstance = new ValidationGroup($groupContainer);
    // act
    var group = $buttonContainer.dxButton('_findGroup');
    // assert
    assert.strictEqual(group, groupInstance, 'dxValidationGroup should be found as a group');
});

QUnit.test('validationGroup string key should win Model', function(assert) {
    var vm = {},
        $buttonContainer = $('<div></div>')
            .attr('data-bind', 'dxButton: { validationGroup: \'uniqueGroupKey\' }')
            .appendTo(FIXTURE_ELEMENT);


    ko.applyBindings(vm, $buttonContainer[0]);
    // act
    var group = $buttonContainer.dxButton('_findGroup');
    // assert
    assert.strictEqual(group, 'uniqueGroupKey', 'validationGroup option should be found as a group');
});

QUnit.test('dxValidator binding handler should be evaluated after editor binding', function(assert) {
    assert.expect(1);

    registerComponent('dxTestEditor', { }, Editor.inherit({
        ctor: function() {
            this.callBase.apply(this, arguments);
            assert.ok(!this.$element().data('dxValidator'));
        }
    }));

    var $editor = $('<div data-bind=\'dxValidator: { adapter: { } }, dxTestEditor: { }\'></div>').appendTo(FIXTURE_ELEMENT);
    ko.applyBindings({}, $editor.get(0));
});

QUnit.test('Validator can be reset', function(assert) {
    // arrange
    var vm = {
        login: ko.observable('testuser').extend({
            dxValidator: {
                validationRules: [{ type: 'custom', validationCallback: function() { return false; } }]
            }
        })
    };
    var validator = vm.login.dxValidator;
    validator.validate();
    // act
    validator.reset();
    // assert
    assert.strictEqual(validator.isValid(), true, 'isValid - Validation should be restored in valid state');
    assert.strictEqual(validator.validationError(), null, 'validationRule - Validation should be restored in valid state');
    assert.strictEqual(vm.login(), null, 'Value should be reset');
});

QUnit.test('T437697: dxValidationSummary - validator.focus is not a function', function(assert) {
    try {
        var vm = {
            buttonSettings: {
                text: 'Test',
                onClick: function(params) {
                    params.validationGroup.validate();
                }
            },

            textBoxValue: ko.observable('').extend({
                dxValidator: {
                    validationRules: [{
                        type: 'required'
                    }]
                }
            })
        };

        $('<div></div>')
            .attr('data-bind', 'dxTextBox: { value: viewModel.textBoxValue, isValid: viewModel.textBoxValue.dxValidator.isValid, validationError: viewModel.textBoxValue.dxValidator.validationError }')
            .appendTo(FIXTURE_ELEMENT);

        $('<div></div>')
            .attr('data-bind', 'dxButton: { text: \'Test\', onClick: function(params) { params.validationGroup.validate(); }}')
            .appendTo(FIXTURE_ELEMENT);

        $('<div></div>')
            .attr('data-bind', 'dxValidationSummary: {}')
            .appendTo(FIXTURE_ELEMENT);

        ValidationEngine.registerModelForValidation(vm);
        ko.applyBindings(vm, document.getElementById('qunit-fixture'));

        $('.dx-button').click();
        $('.dx-validationsummary-item').click();

        assert.ok(true, 'focus defined');

        ValidationEngine.unregisterModelForValidation(vm);
        ko.cleanNode('qunit-fixture');
    } catch(e) {
        assert.ok(false, e);
    }
});
