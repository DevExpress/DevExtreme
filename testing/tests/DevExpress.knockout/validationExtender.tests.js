import $ from 'jquery';
import Editor from 'ui/editor/editor';
import ValidationGroup from 'ui/validation_group';
import ValidationEngine from 'ui/validation_engine';
import registerComponent from 'core/component_registrator';
import { isPromise } from 'core/utils/type';
import ko from 'knockout';
import { Deferred } from 'core/utils/deferred';

import 'ui/button';
import 'integration/knockout';

const FIXTURE_ELEMENT = $('<div id=qunit-fixture></div>').appendTo('body');

QUnit.module('Ko Extender');

QUnit.test('dxValidator should be stuck to observable', function(assert) {
    const vm = {
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
    const vm = {
        login: ko.observable('test').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };
    // act
    ValidationEngine.registerModelForValidation(vm);

    // assert
    const groupConfig = ValidationEngine.getGroupConfig(vm);
    assert.ok(groupConfig, 'Config should be retrieved');
    assert.equal(groupConfig.validators.length, 1, 'Single validator should be registered');
    assert.strictEqual(groupConfig.validators[0], vm.login.dxValidator, 'Correct validator should be passed');
});

QUnit.test('Engine can validate model', function(assert) {
    const vm = {
        login: ko.observable('').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };
    ValidationEngine.registerModelForValidation(vm);
    // act
    const result = ValidationEngine.validateModel(vm);

    // assert
    assert.ok(result, 'Result should be retrieved');
    assert.strictEqual(result.isValid, false, 'Validation should not pass');
    assert.strictEqual(ValidationEngine.validateGroup, ValidationEngine.validateModel, 'Completely incorrect test of technical implementation');
    assert.strictEqual(result.brokenRules.length, 1, 'One rule should be broken');
    assert.strictEqual(result.brokenRules[0].validator, vm.login.dxValidator, 'Validator should be included into the rule');
});

QUnit.test('Unregister knockout model for validation', function(assert) {
    const vm = {
        login: ko.observable('test').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };

    ValidationEngine.registerModelForValidation(vm);

    const groupConfig = ValidationEngine.getGroupConfig(vm);

    assert.equal(groupConfig.validators.length, 1, 'Single validator should be registered');

    ValidationEngine.unregisterModelForValidation(vm);

    assert.equal(groupConfig.validators.length, 0, 'Validators should be unregistered');
});

QUnit.test('validated handler should be called', function(assert) {
    const vm = {
        login: ko.observable('').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };
    const validatedHandler = sinon.stub();
    vm.login.dxValidator.on('validated', validatedHandler);
    // act
    vm.login.dxValidator.validate();

    // assert
    assert.ok(validatedHandler.calledOnce, 'Handler should be called');
    const args = validatedHandler.getCall(0).args;
    assert.ok(args, 'Args should be passed');
    assert.strictEqual(args[0].value, '', 'Value should be passed');
    assert.strictEqual(args[0].isValid, false, 'validation result should be passed');
    assert.strictEqual(args[0].validator, vm.login.dxValidator, 'validation result should be passed');
});


QUnit.test('changing observable value should cause validation', function(assert) {
    const vm = {
        login: ko.observable('').extend({
            dxValidator: {
                validationRules: [{ type: 'required' }]
            }
        })
    };
    const validatedHandler = sinon.stub();
    vm.login.dxValidator.on('validated', validatedHandler);
    // act
    vm.login('new value');

    // assert
    assert.ok(validatedHandler.calledOnce, 'Handler should be called');
    const args = validatedHandler.getCall(0).args;
    assert.ok(args, 'Args should be passed');
    assert.strictEqual(args[0].value, 'new value', 'Value should be passed');
});


QUnit.test('Model should be found as a validation group', function(assert) {
    const vm = {};
    const $buttonContainer = $('<div></div>')
        .attr('data-bind', 'dxButton: { }')
        .appendTo(FIXTURE_ELEMENT);

    ko.applyBindings(vm, $buttonContainer[0]);
    // act
    const group = $buttonContainer.dxButton('_findGroup');
    // assert
    assert.strictEqual(group, vm, 'View model should be found as a group');
});

QUnit.test('dxValidationGroup should win Model', function(assert) {
    const vm = {};
    const $groupContainer = $('<div></div>')
        .attr('data-bind', 'dxValidationGroup: { }')
        .appendTo(FIXTURE_ELEMENT);
    const $buttonContainer = $('<div></div>')
        .attr('data-bind', 'dxButton: { }')
        .appendTo($groupContainer);


    ko.applyBindings(vm, $groupContainer[0]);
    const groupInstance = new ValidationGroup($groupContainer);
    // act
    const group = $buttonContainer.dxButton('_findGroup');
    // assert
    assert.strictEqual(group, groupInstance, 'dxValidationGroup should be found as a group');
});

QUnit.test('validationGroup string key should win Model', function(assert) {
    const vm = {};
    const $buttonContainer = $('<div></div>')
        .attr('data-bind', 'dxButton: { validationGroup: \'uniqueGroupKey\' }')
        .appendTo(FIXTURE_ELEMENT);


    ko.applyBindings(vm, $buttonContainer[0]);
    // act
    const group = $buttonContainer.dxButton('_findGroup');
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

    const $editor = $('<div data-bind=\'dxValidator: { adapter: { } }, dxTestEditor: { }\'></div>').appendTo(FIXTURE_ELEMENT);
    ko.applyBindings({}, $editor.get(0));
});

QUnit.test('Validator can be reset', function(assert) {
    // arrange
    const vm = {
        login: ko.observable('testuser').extend({
            dxValidator: {
                validationRules: [{ type: 'custom', validationCallback: function() { return false; } }]
            }
        })
    };
    const validator = vm.login.dxValidator;
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
        const vm = {
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

QUnit.test('Validator should be validated positively (async)', function(assert) {
    // arrange
    const vm = {
        login: ko.observable('testuser').extend({
            dxValidator: {
                validationRules: [
                    {
                        type: 'async',
                        validationCallback: function() {
                            const d = new Deferred();
                            setTimeout(() => {
                                d.resolve();
                            }, 10);
                            return d.promise();
                        }
                    }
                ]
            }
        })
    };
    const done = assert.async();
    const validator = vm.login.dxValidator;
    const result = validator.validate();

    // assert
    assert.strictEqual(result.isValid, true, 'result.isValid === true');
    assert.ok(isPromise(result.complete), 'result.complete is a promise object');

    result.complete.then((res) => {
        assert.strictEqual(result.id, res.id, 'result.id === res.id');
        done();
    });

});
