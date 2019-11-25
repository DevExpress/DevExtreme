import $ from "jquery";
import Class from "core/class";
import DefaultAdapter from "ui/validation/default_adapter";
import ValidationEngine from "ui/validation_engine";

import "ui/validation_group";

const Fixture = Class.inherit({

    ctor: function() {
        ValidationEngine.initGroups();
        this.originalValidationGroupFunction = ValidationEngine.validateGroup;
    },

    teardown: function() {
        ValidationEngine.validateGroup = this.originalValidationGroupFunction;
    },

    createValidationGroupContainer: function(container) {
        if(container) {
            this.$groupContainer = $(container);
        }
    },

    createGroup: function(container) {
        this.createValidationGroupContainer(container);
        const group = this.$groupContainer.dxValidationGroup().dxValidationGroup("instance");

        return group;
    },

    disposeGroup: function() {
        this.$groupContainer.dxValidationGroup("_dispose");
    },

    createValidatorInGroup: function() {
        const $container = $("<div/>");
        $container.appendTo(this.$groupContainer);

        return $container.dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        }).dxValidator("instance");
    }
});

const { testStart, test, module: testModule } = QUnit;

testStart(() => {
    $("#qunit-fixture").html('<div id="dxValidationGroup"></div>');
});


testModule("General", {
    beforeEach: function() {
        this.fixture = new Fixture();
    }
}, () => {
    test("dxValidationGroup can be created", function(assert) {
        const $container = $("#dxValidationGroup");
        // act
        const group = this.fixture.createGroup($container);
        // assert
        assert.ok(group, "Group should be instantiated");
        assert.ok($container.hasClass("dx-validationgroup"), "Specific class should be added");
    });

    test("dxValidationGroup should not remove container content", function(assert) {
        const $container = $("#dxValidationGroup");
        $("<img/>").appendTo($container);

        // act
        this.fixture.createGroup($container);
        // assert
        assert.equal($container.find("img").length, 1, "Image inside of container should remain untouched");
    });

    test("dxValidator can be validated as part of dxValidationGroup", function(assert) {
        const $container = $("#dxValidationGroup");
        const group = this.fixture.createGroup($container);
        const validator = this.fixture.createValidatorInGroup();

        validator.validate = sinon.spy(validator.validate);
        // act
        ValidationEngine.validateGroup(group);
        // assert
        assert.ok(validator.validate.calledOnce, "Validator should be validated as part of group");
    });


    test("dxValidator should be registered as part of dxValidationGroup - when dxValidationGroup was created after dxValidator", function(assert) {
        const $container = $("#dxValidationGroup");

        this.fixture.createValidationGroupContainer($container);

        const validator = this.fixture.createValidatorInGroup();
        const group = this.fixture.createGroup();
        const defaultGroupConfig = ValidationEngine.getGroupConfig(undefined);

        validator.validate = sinon.spy(validator.validate);
        // act
        ValidationEngine.validateGroup(group);
        // assert
        assert.strictEqual(defaultGroupConfig.validators.length, 0, "Validator should be deregistered in default group");
        assert.ok(validator.validate.calledOnce, "Validator should be validated as part of group");
    });

    test("dxValidationGroup can be disposed, container should be cleared (T199232)", function(assert) {
        const $container = $("#dxValidationGroup");
        this.fixture.createGroup($container);
        // act
        this.fixture.disposeGroup();
        // assert
        assert.notOk($container.hasClass("dx-validationgroup"), "Specific class should be added");
    });


    test("dxValidator can be reset as part of dxValidationGroup", function(assert) {
        const $container = $("#dxValidationGroup");
        const group = this.fixture.createGroup($container);
        const validator = this.fixture.createValidatorInGroup();

        validator.reset = sinon.spy(validator.reset);
        // act
        group.reset();
        // assert
        assert.ok(validator.reset.calledOnce, "Validator should be reset as part of group");
    });
});

testModule("API", {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    test("group.validate", function(assert) {
        const $container = $("#dxValidationGroup");
        const group = this.fixture.createGroup($container);

        this.fixture.createValidatorInGroup();

        ValidationEngine.validateGroup = sinon.spy(ValidationEngine.validateGroup);
        // act
        const result = group.validate();
        // assert
        assert.ok(result, "Result should be returned");
        assert.ok(ValidationEngine.validateGroup.calledOnce, "validatorGroup should be called");
        assert.equal(ValidationEngine.validateGroup.getCall(0).args[0], group, "correct group key should be passed");
    });

    test("empty validation group should return valid 'validationResult' object", function(assert) {
        const $container = $("#dxValidationGroup");
        const group = this.fixture.createGroup($container);
        const { isValid, brokenRules, validators } = group.validate();

        assert.ok(isValid, "empty group is valid");
        assert.deepEqual(brokenRules, [], "empty group doesn't have broken rules");
        assert.deepEqual(validators, [], "empty group doesn't have validators");
    });
});
