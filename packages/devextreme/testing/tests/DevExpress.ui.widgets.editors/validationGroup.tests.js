import Class from 'core/class';
import { Deferred } from 'core/utils/deferred';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import $ from 'jquery';
import DefaultAdapter from '__internal/ui/validation/m_default_adapter';
import ValidationEngine from 'ui/validation_engine';
import 'ui/validation_group';


const Fixture = Class.inherit({

    ctor: function() {
        ValidationEngine.initGroups();
        this.originalValidationGroupFunction = ValidationEngine.validateGroup;
    },

    createValidationGroupContainer: function(container) {
        if(container) {
            this.$groupContainer = $(container);
        }
    },

    createGroup: function(container) {
        this.createValidationGroupContainer(container);
        const group = this.$groupContainer.dxValidationGroup().dxValidationGroup('instance');

        return group;
    }
});


QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="dxValidationGroup"></div>');
});


QUnit.module('General', {
    beforeEach: function() {
        this.fixture = new Fixture();
    }
}, () => {
    QUnit.test('validator should find group after dxshown event is triggered', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const $validator = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        });
        const validator = $validator.dxValidator('instance');
        validator.validate = sinon.spy(validator.validate);

        // act
        $validator.appendTo($container);
        triggerShownEvent($container);
        ValidationEngine.validateGroup(group);

        // assert
        assert.ok(validator.validate.calledOnce, 'Validator should be validated as part of group');
    });

    QUnit.test('validator should work a part of a validation group if they are created on the same element (T1102012)', function(assert) {
        const $groupContainer = $('#dxValidationGroup');
        const group = this.fixture.createGroup($groupContainer);
        const $validator = $groupContainer.dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        });
        const validator = $validator.dxValidator('instance');
        validator.validate = sinon.spy(validator.validate);

        // act
        triggerShownEvent($groupContainer);
        ValidationEngine.validateGroup(group);

        // assert
        assert.ok(validator.validate.calledOnce, 'Validator should be validated as part of group');
    });

    QUnit.test('group should be validated positively (async)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const adapter = sinon.createStubInstance(DefaultAdapter);
        const $validator = $('<div>').dxValidator({
            adapter: adapter,
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(() => {
                        d.resolve(true);
                    }, 100);
                    return d.promise();
                }
            }]
        });
        const validator = $validator.dxValidator('instance');
        const done = assert.async();

        adapter.getValue.returns('123');

        // act
        $validator.appendTo($container);
        triggerShownEvent($container);
        const result = ValidationEngine.validateGroup(group);

        assert.ok(result.isValid, 'result.isValid == true');
        assert.strictEqual(result.brokenRules.length, 0, 'result.brokenRules empty');
        assert.strictEqual(result.validators.length, 1, 'result.validators contains one validator');
        assert.strictEqual(result.validators[0], validator, 'result.validators contains the required validator');
        assert.strictEqual(result.status, 'pending', 'result.status === \'pending\'');
        assert.ok(result.complete, 'result.complete != null');

        result.complete.then((res) => {
            assert.ok(res.isValid, 'res.isValid === true');
            assert.strictEqual(res.brokenRules.length, 0, 'res.brokenRules empty');
            assert.strictEqual(res.validators.length, 1, 'res.validators contains one validator');
            assert.strictEqual(res.validators[0], validator, 'res.validators contains the required validator');
            assert.strictEqual(res.status, 'valid', 'res.status === \'valid\'');
            assert.notOk(res.complete, 'res.complete === null');
            done();
        });
    });


    QUnit.test('group should be validated negatively (async)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const adapter = sinon.createStubInstance(DefaultAdapter);
        const message = 'test message';
        const $validator = $('<div>').dxValidator({
            adapter: adapter,
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(() => {
                        d.reject({
                            isValid: false,
                            message: message
                        });
                    }, 100);
                    return d.promise();
                }
            }]
        });
        const validator = $validator.dxValidator('instance');
        const done = assert.async();

        adapter.getValue.returns('123');

        // act
        $validator.appendTo($container);
        triggerShownEvent($container);
        const result = ValidationEngine.validateGroup(group);

        assert.ok(result.isValid, 'result.isValid == true');
        assert.strictEqual(result.brokenRules.length, 0, 'result.brokenRules empty');
        assert.strictEqual(result.validators.length, 1, 'result.validators contains one validator');
        assert.strictEqual(result.validators[0], validator, 'result.validators contains the required validator');
        assert.strictEqual(result.status, 'pending', 'result.status === \'pending\'');
        assert.ok(result.complete, 'result.complete != null');

        result.complete.then((res) => {
            assert.notOk(res.isValid, 'res.isValid === false');
            assert.strictEqual(res.brokenRules.length, 1, 'res.brokenRules contains a sinble gule');
            assert.strictEqual(res.brokenRules[0].message, message, 'res.brokenRules[0].message === messagbe');
            assert.strictEqual(res.validators.length, 1, 'res.validators contains one validator');
            assert.strictEqual(res.validators[0], validator, 'res.validators contains the required validator');
            assert.strictEqual(res.status, 'invalid', 'res.status === \'invalid\'');
            assert.notOk(res.complete, 'res.complete === null');
            done();
        });
    });

    QUnit.test('group should be validated positively after removing the only pending validator (async)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const $validator1 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        });
        const validator1 = $validator1.dxValidator('instance');
        const $validator2 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        });
        const validator2 = $validator2.dxValidator('instance');
        const done = assert.async();

        validator1.validate = sinon.stub();
        validator1.validate.returns({
            value: '',
            brokenRules: null,
            isValid: true,
            validationRules: [],
            pendingRules: [],
            status: 'pending',
            complete: new Deferred().promise()
        });
        validator2.validate = sinon.stub();
        validator2.validate.returns({
            value: '',
            brokenRules: null,
            isValid: true,
            validationRules: [],
            pendingRules: null,
            status: 'valid',
            complete: null
        });
        // act
        $validator1.appendTo($container);
        $validator2.appendTo($container);
        triggerShownEvent($container);
        const result = ValidationEngine.validateGroup(group);

        assert.ok(result.isValid, 'result.isValid == true');
        assert.strictEqual(result.brokenRules.length, 0, 'result.brokenRules empty');
        assert.strictEqual(result.validators.length, 2, 'result.validators contains two validators');
        assert.strictEqual(result.validators[0], validator1, 'result.validators[0] === validator1');
        assert.strictEqual(result.validators[1], validator2, 'result.validators[1] === validator2');
        assert.strictEqual(result.status, 'pending', 'result.status === \'pending\'');
        assert.ok(result.complete, 'result.complete != null');

        result.complete.then((res) => {
            assert.ok(res.isValid, 'res.isValid === true');
            assert.strictEqual(res.brokenRules.length, 0, 'res.brokenRules empty');
            assert.strictEqual(res.validators.length, 1, 'res.validators contains one validator');
            assert.strictEqual(res.validators[0], validator2, 'res.validators[0] === validator2');
            assert.strictEqual(res.status, 'valid', 'res.status === \'valid\'');
            assert.notOk(res.complete, 'res.complete === null');
            done();
        });
        ValidationEngine.removeRegisteredValidator(group, validator1);
    });

    QUnit.test('group should be validated without non-actual cache on validator removing (T1006292)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const adapter = sinon.createStubInstance(DefaultAdapter);
        let callbackCallCount = 0;
        const $validator1 = $('<div>').dxValidator({
            adapter,
            validationRules: [{
                type: 'custom',
                reevaluate: true,
                validationCallback: () => {
                    if(callbackCallCount === 0) {
                        ++callbackCallCount;
                        return false;
                    }
                    return true;
                }
            }]
        });
        const validator1 = $validator1.dxValidator('instance');
        const $validator2 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        });
        const validator2 = $validator2.dxValidator('instance');


        $validator1.appendTo($container);
        $validator2.appendTo($container);
        triggerShownEvent($container);

        ValidationEngine.validateGroup(group);
        validator1.validate();

        ValidationEngine.getGroupConfig(group).on('validated', ({ isValid }) => {
            assert.ok(isValid, 'validation is correct');
        });
        ValidationEngine.removeRegisteredValidator(group, validator2);
    });

    QUnit.test('group should be validated positively after all validators remove (T1006667)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const adapter = sinon.createStubInstance(DefaultAdapter);
        const $validator1 = $('<div>').dxValidator({
            adapter,
            validationRules: [{
                type: 'custom',
                validationCallback: () => {
                    return false;
                }
            }]
        });
        const validator1 = $validator1.dxValidator('instance');
        const $validator2 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter),
            validationRules: [{
                type: 'custom',
                validationCallback: () => {
                    return false;
                }
            }]
        });
        const validator2 = $validator2.dxValidator('instance');


        $validator1.appendTo($container);
        $validator2.appendTo($container);
        triggerShownEvent($container);

        ValidationEngine.validateGroup(group);

        ValidationEngine.removeRegisteredValidator(group, validator1);
        ValidationEngine.getGroupConfig(group).on('validated', ({ isValid }) => {
            assert.ok(isValid, 'validation is correct');
        });
        ValidationEngine.removeRegisteredValidator(group, validator2);
    });

    QUnit.test('group should not be removed after its validators are removed (T1233487)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const adapter = sinon.createStubInstance(DefaultAdapter);
        const $validator1 = $('<div>').dxValidator({
            adapter: adapter
        });
        const validator1 = $validator1.dxValidator('instance');

        ValidationEngine.removeRegisteredValidator(group, validator1);

        assert.ok(ValidationEngine.getGroupConfig(group), 'group is not removed');
    });

    QUnit.test('group should be validated positively with a new validator (async)', function(assert) {
        const $container = $('#dxValidationGroup');
        const group = this.fixture.createGroup($container);
        const adapter = sinon.createStubInstance(DefaultAdapter);
        const $validator1 = $('<div>').dxValidator({
            adapter: adapter,
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(() => {
                        d.resolve(true);
                    }, 100);
                    return d.promise();
                }
            }]
        });
        const validator1 = $validator1.dxValidator('instance');
        const validator2 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        }).dxValidator('instance');
        const done = assert.async();

        // act
        $validator1.appendTo($container);
        triggerShownEvent($container);
        const result = ValidationEngine.validateGroup(group);

        assert.strictEqual(result.validators.length, 1, 'result.validators contains one validator');
        assert.strictEqual(result.validators[0], validator1, 'result.validators[0] === validator1');
        assert.strictEqual(result.status, 'pending', 'result.status === \'pending\'');
        assert.ok(result.complete, 'result.complete != null');

        result.complete.then((res) => {
            assert.strictEqual(res.validators.length, 2, 'res.validators contains two validators');
            assert.strictEqual(res.validators[0], validator1, 'res.validators[0] === validator1');
            assert.strictEqual(res.validators[1], validator2, 'res.validators[1] === validator2');
            assert.strictEqual(res.status, 'valid', 'res.status === \'valid\'');
            assert.notOk(res.complete, 'res.complete === null');
            done();
        });
        ValidationEngine.registerValidatorInGroup(group, validator2);
    });
});

