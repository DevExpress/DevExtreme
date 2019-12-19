import $ from 'jquery';
import Class from 'core/class';
import domUtils from 'core/utils/dom';
import DefaultAdapter from 'ui/validation/default_adapter';
import ValidationEngine from 'ui/validation_engine';
import { Deferred } from 'core/utils/deferred';

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
        var group = this.$groupContainer.dxValidationGroup().dxValidationGroup('instance');

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
});

QUnit.test('validator should find group after dxshown event is triggered', function(assert) {
    var $container = $('#dxValidationGroup');
    var group = this.fixture.createGroup($container);
    var $validator = $('<div>').dxValidator({
        adapter: sinon.createStubInstance(DefaultAdapter)
    });
    var validator = $validator.dxValidator('instance');
    validator.validate = sinon.spy(validator.validate);

    // act
    $validator.appendTo($container);
    domUtils.triggerShownEvent($container);
    ValidationEngine.validateGroup(group);

    // assert
    assert.ok(validator.validate.calledOnce, 'Validator should be validated as part of group');
});

QUnit.test('group should be validated positively (async)', function(assert) {
    const $container = $('#dxValidationGroup'),
        group = this.fixture.createGroup($container),
        adapter = sinon.createStubInstance(DefaultAdapter),
        $validator = $('<div>').dxValidator({
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
        }),
        validator = $validator.dxValidator('instance'),
        done = assert.async();

    adapter.getValue.returns('123');

    // act
    $validator.appendTo($container);
    domUtils.triggerShownEvent($container);
    const result = ValidationEngine.validateGroup(group);

    assert.ok(result.isValid, 'result.isValid == true');
    assert.ok(result.brokenRules.length === 0, 'result.brokenRules empty');
    assert.ok(result.validators.length === 1, 'result.validators contains one validator');
    assert.ok(result.validators[0] === validator, 'result.validators contains the required validator');
    assert.ok(result.status === 'pending', 'result.status === \'pending\'');
    assert.ok(result.complete, 'result.complete != null');

    result.complete.then((res) => {
        assert.ok(res.isValid, 'res.isValid === true');
        assert.ok(res.brokenRules.length === 0, 'res.brokenRules empty');
        assert.ok(res.validators.length === 1, 'res.validators contains one validator');
        assert.ok(res.validators[0] === validator, 'res.validators contains the required validator');
        assert.ok(res.status === 'valid', 'res.status === \'valid\'');
        assert.notOk(res.complete, 'res.complete === null');
        done();
    });
});


QUnit.test('group should be validated negatively (async)', function(assert) {
    const $container = $('#dxValidationGroup'),
        group = this.fixture.createGroup($container),
        adapter = sinon.createStubInstance(DefaultAdapter),
        message = 'test message',
        $validator = $('<div>').dxValidator({
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
        }),
        validator = $validator.dxValidator('instance'),
        done = assert.async();

    adapter.getValue.returns('123');

    // act
    $validator.appendTo($container);
    domUtils.triggerShownEvent($container);
    const result = ValidationEngine.validateGroup(group);

    assert.ok(result.isValid, 'result.isValid == true');
    assert.ok(result.brokenRules.length === 0, 'result.brokenRules empty');
    assert.ok(result.validators.length === 1, 'result.validators contains one validator');
    assert.ok(result.validators[0] === validator, 'result.validators contains the required validator');
    assert.ok(result.status === 'pending', 'result.status === \'pending\'');
    assert.ok(result.complete, 'result.complete != null');

    result.complete.then((res) => {
        assert.notOk(res.isValid, 'res.isValid === false');
        assert.ok(res.brokenRules.length === 1, 'res.brokenRules contains a sinble gule');
        assert.strictEqual(res.brokenRules[0].message, message, 'res.brokenRules[0].message === messagbe');
        assert.ok(res.validators.length === 1, 'res.validators contains one validator');
        assert.ok(res.validators[0] === validator, 'res.validators contains the required validator');
        assert.ok(res.status === 'invalid', 'res.status === \'invalid\'');
        assert.notOk(res.complete, 'res.complete === null');
        done();
    });
});

QUnit.test('group should be validated positively after removing the only pending validator (async)', function(assert) {
    const $container = $('#dxValidationGroup'),
        group = this.fixture.createGroup($container),
        $validator1 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        }),
        validator1 = $validator1.dxValidator('instance'),
        $validator2 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        }),
        validator2 = $validator2.dxValidator('instance'),
        done = assert.async();

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
    domUtils.triggerShownEvent($container);
    const result = ValidationEngine.validateGroup(group);

    assert.ok(result.isValid, 'result.isValid == true');
    assert.ok(result.brokenRules.length === 0, 'result.brokenRules empty');
    assert.ok(result.validators.length === 2, 'result.validators contains two validators');
    assert.ok(result.validators[0] === validator1, 'result.validators[0] === validator1');
    assert.ok(result.validators[1] === validator2, 'result.validators[1] === validator2');
    assert.ok(result.status === 'pending', 'result.status === \'pending\'');
    assert.ok(result.complete, 'result.complete != null');

    result.complete.then((res) => {
        assert.ok(res.isValid, 'res.isValid === true');
        assert.ok(res.brokenRules.length === 0, 'res.brokenRules empty');
        assert.ok(res.validators.length === 1, 'res.validators contains one validator');
        assert.ok(res.validators[0] === validator2, 'res.validators[0] === validator2');
        assert.ok(res.status === 'valid', 'res.status === \'valid\'');
        assert.notOk(res.complete, 'res.complete === null');
        done();
    });
    ValidationEngine.removeRegisteredValidator(group, validator1);
});

QUnit.test('group should be validated positively with a new validator (async)', function(assert) {
    const $container = $('#dxValidationGroup'),
        group = this.fixture.createGroup($container),
        adapter = sinon.createStubInstance(DefaultAdapter),
        $validator1 = $('<div>').dxValidator({
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
        }),
        validator1 = $validator1.dxValidator('instance'),
        validator2 = $('<div>').dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        }).dxValidator('instance'),
        done = assert.async();

    // act
    $validator1.appendTo($container);
    domUtils.triggerShownEvent($container);
    const result = ValidationEngine.validateGroup(group);

    assert.ok(result.validators.length === 1, 'result.validators contains one validator');
    assert.ok(result.validators[0] === validator1, 'result.validators[0] === validator1');
    assert.ok(result.status === 'pending', 'result.status === \'pending\'');
    assert.ok(result.complete, 'result.complete != null');

    result.complete.then((res) => {
        assert.ok(res.validators.length === 2, 'res.validators contains two validators');
        assert.ok(res.validators[0] === validator1, 'res.validators[0] === validator1');
        assert.ok(res.validators[1] === validator2, 'res.validators[1] === validator2');
        assert.ok(res.status === 'valid', 'res.status === \'valid\'');
        assert.notOk(res.complete, 'res.complete === null');
        done();
    });
    ValidationEngine.registerValidatorInGroup(group, validator2);
});

