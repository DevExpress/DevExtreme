import $ from 'jquery';
import { noop } from 'core/utils/common';
import Class from 'core/class';
import DefaultAdapter from 'ui/validation/default_adapter';
import ValidationEngine from 'ui/validation_engine';
import { Deferred } from 'core/utils/deferred';
import { isPromise } from 'core/utils/type';
import config from 'core/config';

import 'ui/validator';

const Fixture = Class.inherit({
    createValidator: function(options, element) {
        this.$element = element || this.$element || $('<div/>');
        this.stubAdapter = this.stubAdapter || sinon.createStubInstance(DefaultAdapter);
        const validator = this.$element.dxValidator($.extend({
            adapter: this.stubAdapter
        }, options)).dxValidator('instance');

        return validator;
    },

    createAdapter: function() {
        this.stubAdapter = sinon.createStubInstance(DefaultAdapter);
    },

    teardown: function() {
        this.$element.remove();
        ValidationEngine.initGroups();
    }
});

QUnit.module('General', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('Validator exists', function(assert) {
        const validator = this.fixture.createValidator();
        assert.ok(validator, 'Validator was created');
        assert.ok(validator.validate, 'Validation function is accessible');
    });

    QUnit.test('ValidationEngine can validate valid value against provided rules', function(assert) {
        const validator = this.fixture.createValidator({
            validationRules: [{
                type: 'required',
                message: 'Please set validator\'s value'
            }]
        });

        this.fixture.stubAdapter.getValue.returns('hello');

        const result = validator.validate();

        assert.strictEqual(validator.option('isValid'), true, 'Validator should be isValid');
        assert.strictEqual(result.isValid, true, 'Validator should be isValid - result');
        assert.ok(!result.brokenRule, 'There should not be brokenRule');
        assert.ok(this.fixture.stubAdapter.applyValidationResults.calledOnce, 'Adapter method should be called');
    });

    QUnit.test('Validator apply "rtlEnabled" value from global config by default', function(assert) {
        const originalConfig = config();

        try {
            config({ rtlEnabled: true });

            this.fixture.createValidator({
                validationRules: [{
                    type: 'required'
                }]
            });

            assert.ok(this.fixture.$element.hasClass('dx-rtl'), 'Adapter method should be called');
        } finally {
            config(originalConfig);
        }
    });

    QUnit.test('Validator apply "rtlEnabled" value from adapter', function(assert) {
        this.fixture.createAdapter();
        this.fixture.stubAdapter.editor = {
            option: () => { return { rtlEnabled: true }; }
        };

        this.fixture.createValidator({
            validationRules: [{
                type: 'required'
            }]
        });

        assert.ok(this.fixture.$element.hasClass('dx-rtl'), 'Adapter method should be called');
    });

    QUnit.test('ValidationEngine can validate Invalid against provided rules', function(assert) {
        const errorMessage = 'Please set validator\'s value';
        const validator = this.fixture.createValidator({
            value: '',
            validationRules: [{
                type: 'required',
                message: errorMessage
            }]
        });

        const result = validator.validate();

        assert.strictEqual(validator.option('isValid'), false, 'Validator should be invalid');
        assert.strictEqual(result.isValid, false, 'Validator should be invalid - result');
        assert.ok(result.brokenRule, 'There should not be brokenRule');
        assert.equal(result.brokenRule.message, errorMessage, 'Validation message should be passed from rules');

    });

    QUnit.test('Returned value should contain state, name, validation errors and validator reference', function(assert) {
        const validator = this.fixture.createValidator({
            name: 'Login',
            validationRules: [{
                type: 'required'
            }]
        });
        // act

        this.fixture.stubAdapter.getValue.returns('');
        const result = validator.validate();
        // assert
        assert.ok(result, 'Result should be returned');
        assert.strictEqual(result.isValid, validator.option('isValid'), 'isValid flag should be passed');
        assert.equal(result.name, 'Login');
        assert.strictEqual(result.brokenRule.validator, validator, 'Validator reference');

    });

    QUnit.test('Validator with set validation group', function(assert) {
    // arrange
        const validationGroup = {};
        const validator = this.fixture.createValidator({
            validationRules: [{
                type: 'required'
            }],
            validationGroup: validationGroup
        });

        // act
        this.fixture.stubAdapter.getValue.returns('');
        const result = ValidationEngine.validateGroup(validationGroup);

        // assert
        assert.ok(result, 'Result should be returned');
        assert.strictEqual(result.isValid, validator.option('isValid'), 'isValid flag should be passed');
        assert.ok(result.brokenRules[0], 'Result should contain validation errors');
        assert.strictEqual(result.brokenRules[0].validator, validator, 'Validator reference');
    });


    QUnit.test('Validator can be reset', function(assert) {
    // arrange
        const validator = this.fixture.createValidator({ validationRules: [{ type: 'custom', validationCallback: function() { return false; } }] });
        validator.validate();
        // act
        validator.reset();
        // assert
        assert.strictEqual(validator.option('isValid'), true, 'isValid - Validation should be restored in valid state');
        assert.ok(this.fixture.stubAdapter.reset.calledOnce, 'Editor should be reset');
    });

    QUnit.test('Validator should be validated after validationRules changed', function(assert) {
        const validator = this.fixture.createValidator({ validationRules: [{ type: 'required', message: 'En' }] });
        validator.validate();

        const spy = sinon.spy(validator, 'validate');

        validator.option('validationRules', [{ type: 'required', message: 'De' }]);
        assert.equal(spy.callCount, 1, 'validation performed');
    });

    QUnit.test('Untouched validator should not be validated after validationRules changed', function(assert) {
        const validator = this.fixture.createValidator({
            validationRules: [{
                type: 'custom',
                validationCallback: function() { return true; },
                message: 'En'
            }]
        });

        const spy = sinon.spy(validator, 'validate');

        validator.option('validationRules', [{
            type: 'custom',
            validationCallback: function() { return true; },
            message: 'De'
        }]);
        assert.equal(spy.callCount, 0, 'validation performed');
    });

    QUnit.test('Options changing after validator creation', function(assert) {
        const validator = this.fixture.createValidator({
            validationRules: [{
                type: 'required',
                message: 'Please set validator\'s value'
            }]
        });

        const options = validator.option();

        for(const optionName in options) {
            const prevValue = validator.option(optionName);
            let newValue = prevValue;

            if(optionName === 'width' || optionName === 'height') {
                newValue = 555;
                options[optionName] = newValue;
            }

            validator.beginUpdate();
            validator._notifyOptionChanged(optionName, newValue, prevValue);
            validator.endUpdate();

            assert.ok(true, 'it\'s possible to change option ' + optionName);
        }
    });

    QUnit.test('Internal validation rules are should be reset when validation rules are changed via the option', function(assert) {
        const validator = this.fixture.createValidator({
            validationRules: [{ type: 'required' }]
        });

        validator.validate();
        validator.option('validationRules', [{ type: 'custom', validationCallback: $.noop }]);
        validator.validate();

        assert.deepEqual(validator._getValidationRules(), [
            {
                index: 0,
                isValid: undefined,
                message: 'Value is invalid',
                type: 'custom',
                validationCallback: $.noop,
                validator: validator,
                value: undefined
            }
        ]);
    });

    QUnit.test('Validator - validation options should be synchrnoized on init', function(assert) {
        let validator = this.fixture.createValidator({
            isValid: false
        });

        assert.strictEqual(validator.option('validationStatus'), 'invalid', 'validationStatus === \'invalid\'');

        this.fixture.teardown();
        validator = this.fixture.createValidator({
            validationStatus: 'invalid'
        });
        assert.strictEqual(validator.option('isValid'), false, 'isValid === false');

        this.fixture.teardown();
        validator = this.fixture.createValidator({
            validationStatus: 'pending'
        });
        assert.strictEqual(validator.option('isValid'), true, 'isValid === true');
    });

    QUnit.test('Validator - validation options should be synchrnoized at runtime', function(assert) {
        const validator = this.fixture.createValidator({});

        validator.option('isValid', false);
        assert.strictEqual(validator.option('validationStatus'), 'invalid', 'validationStatus === \'invalid\'');

        validator.option('isValid', true);
        assert.strictEqual(validator.option('validationStatus'), 'valid', 'validationStatus === \'valid\'');

        validator.option('validationStatus', 'pending');
        assert.ok(validator.option('isValid'), 'isValid === true');

        validator.option('validationStatus', 'invalid');
        assert.notOk(validator.option('isValid'), 'isValid === false');

        validator.option('validationStatus', 'valid');
        assert.ok(validator.option('isValid'), 'isValid === true');
    });
});

QUnit.module('Validator specific tests', {
    beforeEach: function() {
        this.fixture = new Fixture();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.fixture.teardown();
        this.clock.restore();
    }
}, () => {
    QUnit.test('changed Value (correct -> incorrect through options) should be validated', function(assert) {
        const errorMessage = 'Please set validator\'s value';
        const validator = this.fixture.createValidator({
            validationRules: [{
                type: 'required',
                message: 'Please set validator\'s value'
            }]
        });

        this.fixture.stubAdapter.getValue.returns('hello');
        validator.validate();

        this.fixture.stubAdapter.getValue.returns('');
        const result = validator.validate();

        assert.strictEqual(validator.option('isValid'), false, 'Validator should be isValid');
        assert.ok(result.brokenRule, 'brokenRule should be passed as part of result');
        assert.equal(result.brokenRule.message, errorMessage, 'Validation message should be passed from rules');
    });

    QUnit.test('changed Value (incorrect -> correct through options) should be validated', function(assert) {
        const validator = this.fixture.createValidator({
            value: '',
            validationRules: [{
                type: 'required',
                message: 'Please set validator\'s value'
            }]
        });


        this.fixture.stubAdapter.getValue.returns('');
        validator.validate();

        this.fixture.stubAdapter.getValue.returns('hello');
        const result = validator.validate();

        assert.strictEqual(result.isValid, true, 'Validator should be isValid');
        assert.ok(!result.brokenRule, 'brokenRule is null');
    });

    QUnit.test('Validator should be able to bypass validation', function(assert) {
        const validator = this.fixture.createValidator({
            value: '',
            validationRules: [{
                type: 'required',
                message: 'Please set validator\'s value'
            }]
        });


        this.fixture.stubAdapter.bypass.returns(true);
        const result = validator.validate();

        assert.strictEqual(result.isValid, true, 'Validator should be able to bypass validation');
        assert.ok(!result.brokenRule, 'brokenRule is null');
    });

    QUnit.test('Validation rules are not modified after validate', function(assert) {
        const value = '';
        const name = 'Login';
        const handler = sinon.stub();


        const validator = this.fixture.createValidator({
            name: name,
            onValidated: handler,
            validationRules: [{ type: 'required' }]
        });
        this.fixture.stubAdapter.getValue.returns(value);

        validator.validate();

        assert.deepEqual(validator.option('validationRules'), [{ type: 'required' }]);
    });

    QUnit.test('Remote validation is worked correctly', function(assert) {
        const validator = this.fixture.createValidator({
            validationRules: [{
                type: 'custom',
                validationCallback: function(params) {
                    setTimeout(function() {
                        params.rule.isValid = true;
                        params.validator.validate();
                    });
                }
            }]
        });

        validator.validate();
        this.clock.tick();

        assert.ok(validator.option('isValid'));
    });
});

QUnit.module('Registration in groups', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {

    QUnit.test('Widget should be registered in a group', function(assert) {
    // act
        const validator = this.fixture.createValidator();
        // assert
        assert.ok(ValidationEngine.getGroupConfig(), 'Group should be registered with default name');
        assert.strictEqual(ValidationEngine.getGroupConfig().validators[0], validator, 'Validator should be registered');

    });

    QUnit.test('Widget should be deregistered after disposing', function(assert) {
        const validator = this.fixture.createValidator();

        // act
        validator._dispose();
        // assert
        assert.strictEqual(ValidationEngine.getGroupConfig().validators.length, 0, 'Validator reference should be removed from group');
    });

    // T453506
    QUnit.test('Validator should be created in the root group if group was not found', function(assert) {
        const validator = this.fixture.createValidator({
            modelByElement: function() { return 'ViewModel'; }
        });

        // act
        validator._dispose();
        // assert
        assert.strictEqual(ValidationEngine.groups.length, 1, 'new group was not created');
    });

    QUnit.test('Widget should be able to reinit group registration', function(assert) {
        const validator = this.fixture.createValidator({ validationGroup: '123' });

        // act
        validator.option('validationGroup', '234');
        // assert
        assert.strictEqual(ValidationEngine.getGroupConfig('234').validators[0], validator, 'Validator should be re-registered in second group');

        assert.strictEqual(ValidationEngine.getGroupConfig('123'), undefined, 'Validator should be de-registered in first group');
    });

    QUnit.test('Widget should be able to reinit group registration', function(assert) {
        const validator = this.fixture.createValidator({ validationGroup: '123' });
        // act
        validator.option('validationGroup', undefined);
        // assert
        assert.strictEqual(ValidationEngine.getGroupConfig().validators[0], validator, 'Validator should be registered');
    });
});

QUnit.module('Events', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('Validated event should fire', function(assert) {
        const value = '';
        const name = 'Login';
        const expectedFailedValidationRule = {
            index: 0,
            type: 'required',
            isValid: false,
            message: 'Login is required',
            validator: {},
            value
        };
        const handler = sinon.stub();

        const validator = this.fixture.createValidator({
            name,
            onValidated: handler,
            validationRules: [{ type: 'required' }]
        });
        expectedFailedValidationRule.validator = validator;
        this.fixture.stubAdapter.getValue.returns(value);
        // act
        validator.validate();
        // assert
        assert.ok(handler.calledOnce, 'Validated handler should be called');

        const params = handler.getCall(0).args[0];
        assert.ok(handler.calledOn(validator), 'Correct context of action');
        assert.strictEqual(params.validator, validator, 'Validator reference should be passed');
        assert.equal(params.value, value, 'Correct value was passed');
        assert.equal(params.name, name, 'Name of Validator should be passed');
        assert.strictEqual(params.isValid, false, 'isValid was passed');
        assert.deepEqual(params.validationRules, [{
            index: 0,
            isValid: false,
            message: 'Login is required',
            type: 'required',
            validator: validator,
            value: value
        }], 'Correct rules were passed');
        assert.deepEqual(params.brokenRule, expectedFailedValidationRule, 'Failed rules were passed');
    });

    QUnit.test('Validated event should fire correctly after option runtime change', function(assert) {
        const value = '';
        const name = 'Login';
        const handlerAfterChange = sinon.stub();

        const validator = this.fixture.createValidator({
            name,
            validationRules: [{ type: 'required' }]
        });

        validator.option('onValidated', handlerAfterChange);
        this.fixture.stubAdapter.getValue.returns(value);

        validator.validate();

        assert.ok(handlerAfterChange.calledOnce, 'Validated handler should be called after option change');
    });

    QUnit.test('Focused event should fire', function(assert) {
        const validator = this.fixture.createValidator({
        });

        // act
        validator.focus();

        // assert
        assert.ok(this.fixture.stubAdapter.focus.calledOnce, 'Validated handler should be called');
    // assert.ok(handler.calledOn(validator), "Correct context of action");
    });

    QUnit.test('validator.reset should fire event (to work correctly with dxValidationSummary)', function(assert) {
    // arrange
        const handler = sinon.stub();
        const validationRules = [{
            type: 'custom',
            validationCallback: function() {
                return false;
            }
        }];
        const validator = this.fixture.createValidator({
            onValidated: handler,
            validationRules: validationRules
        });
        validator.validate();

        // act
        validator.reset();
        // assert
        assert.ok(handler.calledTwice, 'Validated handler should be called two times - first one for validation, and second one for reset()');
        const params = handler.getCall(1).args[0];
        assert.ok(handler.calledOn(validator), 'Correct context of action');
        // assert.equal(params.value, value, "Correct value was passed");
        // assert.equal(params.name, name, "Name of Validator should be passed");
        assert.strictEqual(params.validator, validator, 'Validator reference should be passed');
        assert.strictEqual(params.isValid, true, 'isValid was passed');
        assert.strictEqual(params.brokenRule, null, 'Null should be passed as brokenRule ');
    });

    QUnit.test('optionChange raising', function(assert) {
        const optionChangeHandler = sinon.stub();
        const validator = this.fixture.createValidator({
            name: 'a',
            onOptionChanged: optionChangeHandler
        });

        validator.option('name', 'b');
        assert.ok(optionChangeHandler.calledOnce, 'optionChange event is raised');
    });

    QUnit.test('initialized raising', function(assert) {
        const initializedHandler = sinon.stub();
        this.fixture.createValidator({
            onInitialized: initializedHandler
        });

        assert.ok(initializedHandler.calledOnce, 'initialized event is raised');
    });

    QUnit.test('disposing raising', function(assert) {
        const disposingHandler = sinon.stub();
        this.fixture.createValidator({
            onDisposing: disposingHandler
        });

        this.fixture.teardown();

        assert.ok(disposingHandler.calledOnce, 'disposing event is raised');
    });

    QUnit.module('Subscription by "on" method', () => {
        QUnit.test('Validated event should fire', function(assert) {
            const value = '';
            const name = 'Login';
            const expectedFailedValidationRule = {
                index: 0,
                type: 'required',
                isValid: false,
                message: 'Login is required',
                validator: {},
                value
            };
            const handler = sinon.stub();

            const validator = this.fixture.createValidator({
                name,
                validationRules: [{ type: 'required' }]
            });
            validator.on('validated', handler);
            expectedFailedValidationRule.validator = validator;
            this.fixture.stubAdapter.getValue.returns(value);

            validator.validate();

            assert.ok(handler.calledOnce, 'Validated handler should be called');

            const params = handler.getCall(0).args[0];
            assert.ok(handler.calledOn(validator), 'Correct context of action');
            assert.strictEqual(params.validator, validator, 'Validator reference should be passed');
            assert.equal(params.value, value, 'Correct value was passed');
            assert.equal(params.name, name, 'Name of Validator should be passed');
            assert.strictEqual(params.isValid, false, 'isValid was passed');
            assert.deepEqual(params.validationRules, [{
                index: 0,
                isValid: false,
                message: 'Login is required',
                type: 'required',
                validator: validator,
                value: value
            }], 'Correct rules were passed');
            assert.deepEqual(params.brokenRule, expectedFailedValidationRule, 'Failed rules were passed');
        });

        QUnit.test('Validated event should fire correctly after option runtime change', function(assert) {
            const value = '';
            const name = 'Login';

            const handlerAfterChange = sinon.stub();
            const validator = this.fixture.createValidator({
                name,
                validationRules: [{ type: 'required' }]
            });

            validator.on('validated', handlerAfterChange);
            this.fixture.stubAdapter.getValue.returns(value);

            validator.validate();

            assert.ok(handlerAfterChange.calledOnce, 'Validated handler should be called after option change');
        });

        QUnit.test('optionChange raising', function(assert) {
            const optionChangeHandler = sinon.stub();
            const validator = this.fixture.createValidator({
                name: 'a'
            });

            validator.on('optionChanged', optionChangeHandler);
            validator.option('name', 'b');
            assert.ok(optionChangeHandler.calledOnce, 'optionChange event is raised');
        });

        QUnit.test('disposing raising', function(assert) {
            const disposingHandler = sinon.stub();
            const validator = this.fixture.createValidator({});

            validator.on('disposing', disposingHandler);
            this.fixture.teardown();

            assert.ok(disposingHandler.calledOnce, 'disposing event is raised');
        });
    });
});

QUnit.module('Custom Adapters', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('Validator without adapter should throw exception', function(assert) {
        assert.throws(
            function() {
                this.fixture.createValidator({
                    adapter: null,
                    validationRules: [{
                        type: 'required'
                    }]
                });
            },
            function(e) {
                return /E0120/.test(e.message);
            },
            'Exception messages should be readable'
        );
    });

    QUnit.test('Attempt to set null adapter should throw exception', function(assert) {
        const that = this;
        const validator = that.fixture.createValidator({
            adapter: {
                getValue: noop,
                validationRequestsCallbacks: $.Callbacks()
            },
            validationRules: [{
                type: 'required'
            }]
        });
        assert.throws(
            function() {
                validator.option('adapter', null);
            },
            function(e) {
                return /E0120/.test(e.message);
            },
            'Exception messages should be readable'
        );
    });


    QUnit.test('Validation happens on firing callback, results are shown by our widgets (dxValidationSummary)', function(assert) {
        const that = this;
        const adapter = {
            getValue: sinon.stub(),
            validationRequestsCallbacks: $.Callbacks()
        };
        const validatedHandler = sinon.stub();

        that.fixture.createValidator({
            adapter: adapter,
            validationRules: [{
                type: 'required'
            }],
            onValidated: validatedHandler
        });

        adapter.getValue.returns('123');
        // act
        adapter.validationRequestsCallbacks.fire();
        // assert
        assert.ok(adapter.getValue.calledOnce, 'Value should be requested');
        assert.ok(validatedHandler.calledOnce, 'Validated handler should be called');
    });

    QUnit.test('validator should validate value passed in the validation request', function(assert) {
        const that = this;
        const adapter = {
            getValue: sinon.stub(),
            validationRequestsCallbacks: $.Callbacks()
        };
        const validatedHandler = sinon.stub();

        that.fixture.createValidator({
            adapter: adapter,
            validationRules: [{
                type: 'required'
            }],
            onValidated: validatedHandler
        });

        adapter.getValue.returns('123');
        adapter.validationRequestsCallbacks.fire({
            value: ''
        });

        assert.strictEqual(validatedHandler.firstCall.args[0].isValid, false, 'empty value should be validated');
    });

    QUnit.test('Validation happens on firing callback, result are applied through custom validator', function(assert) {
        const that = this;
        const adapter = {
            getValue: sinon.stub(),
            validationRequestsCallbacks: $.Callbacks(),
            applyValidationResults: sinon.stub()
        };
        const validatedHandler = sinon.stub();

        that.fixture.createValidator({
            adapter: adapter,
            validationRules: [{
                type: 'required'
            }],
            onValidated: validatedHandler
        });

        adapter.getValue.returns('123');
        // act
        adapter.validationRequestsCallbacks.fire();
        // assert
        assert.ok(adapter.getValue.calledOnce, 'Value should be requested');
        assert.ok(validatedHandler.calledOnce, 'Validated handler should be called');
        assert.ok(adapter.applyValidationResults.calledOnce, 'ApplyValidationResults function should be called');
    });

    QUnit.test('Validator should not be re-validated on pending with the same value', function(assert) {
        const adapter = {
            getValue: sinon.stub(),
            applyValidationResults: sinon.stub()
        };
        const validatedHandler = sinon.stub();
        const validator = this.fixture.createValidator({
            adapter: adapter,
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(function() {
                        d.resolve(true);
                    }, 10);
                    return d.promise();
                }
            }],
            onValidated: validatedHandler
        });
        const done = assert.async();
        adapter.getValue.returns('123');
        const result1 = validator.validate();
        const result2 = validator.validate();

        assert.strictEqual(result1.status, 'pending', 'result1.status === \'pending\'');
        assert.strictEqual(result1.id, result2.id, 'The result id\'s should be the same');
        assert.ok(isPromise(result1.complete), 'result1.complete is a Promise object');
        assert.strictEqual(result1.complete, result2.complete, 'result1.complete === result2.complete');
        result1.complete.then(function(res) {
            assert.strictEqual(result1.id, res.id, 'result1.id === res.id');
            assert.strictEqual(res.status, 'valid', 'res.status === \'valid\'');
            assert.ok(validatedHandler.calledOnce, 'Validated handler should be called');
            done();
        });
    });

    QUnit.test('Validator should resolve result.complete with the last value', function(assert) {
        const adapter = {
            getValue: sinon.stub(),
            applyValidationResults: sinon.stub()
        };
        const validatedHandler = sinon.stub();
        const validator = this.fixture.createValidator({
            adapter: adapter,
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(function() {
                        d.resolve(true);
                    }, 10);
                    return d.promise();
                }
            }],
            onValidated: validatedHandler
        });
        const done = assert.async();
        adapter.getValue.returns('123');
        const result1 = validator.validate();
        adapter.getValue.returns('1234');
        const result2 = validator.validate();

        assert.strictEqual(result1.status, 'pending', 'result1.status === \'pending\'');
        assert.notStrictEqual(result1, result2, 'Results should be different');
        assert.strictEqual(result1.complete, result2.complete, 'result1.complete === result2.complete');
        result2.complete.then(function(resolvedResult) {
            assert.notStrictEqual(resolvedResult.id, result1.id, 'result1 should not equal resolved result');
            assert.strictEqual(result2.id, resolvedResult.id, 'result2 should equal resolved result');
            assert.ok(validatedHandler.calledOnce, 'Validated handler should be called once');
            assert.strictEqual(result2.value, resolvedResult.value, 'result2.value === resolvedResult.value');
            done();
        });
    });

    QUnit.test('Validation happens on firing callback when validationRequestsCallbacks is array', function(assert) {
        const that = this;
        const adapter = {
            getValue: sinon.stub(),
            validationRequestsCallbacks: []
        };

        that.fixture.createValidator({
            adapter: adapter,
            validationRules: [{
                type: 'required'
            }]
        });

        adapter.getValue.returns('123');
        adapter.validationRequestsCallbacks.forEach(function(item) {
            item();
        });

        assert.ok(adapter.getValue.calledOnce, 'Value should be requested');
    });
});

