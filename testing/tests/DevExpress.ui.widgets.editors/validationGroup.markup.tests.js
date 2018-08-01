var $ = require("jquery"),
    Class = require("core/class"),
    DefaultAdapter = require("ui/validation/default_adapter"),
    ValidationEngine = require("ui/validation_engine");

require("ui/validation_group");

var Fixture = Class.inherit({

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
        var group = this.$groupContainer.dxValidationGroup().dxValidationGroup("instance");

        return group;
    },

    disposeGroup: function() {
        this.$groupContainer.dxValidationGroup("_dispose");
    },

    createValidatorInGroup: function() {
        var $container = $("<div/>");
        $container.appendTo(this.$groupContainer);

        return $container.dxValidator({
            adapter: sinon.createStubInstance(DefaultAdapter)
        }).dxValidator("instance");
    }
});

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="dxValidationGroup"></div>');
});


QUnit.module("General", {
    beforeEach: function() {
        this.fixture = new Fixture();
    }
});

QUnit.test("dxValidationGroup can be created", function(assert) {
    var $container = $("#dxValidationGroup");
    // act
    var group = this.fixture.createGroup($container);
    // assert
    assert.ok(group, "Group should be instantiated");
    assert.ok($container.hasClass("dx-validationgroup"), "Specific class should be added");
});

QUnit.test("dxValidationGroup should not remove container content", function(assert) {
    var $container = $("#dxValidationGroup");
    $("<img/>").appendTo($container);

    // act
    this.fixture.createGroup($container);
    // assert
    assert.equal($container.find("img").length, 1, "Image inside of container should remain untouched");
});

QUnit.test("dxValidator can be validated as part of dxValidationGroup", function(assert) {
    var $container = $("#dxValidationGroup"),
        group = this.fixture.createGroup($container),
        validator = this.fixture.createValidatorInGroup();

    validator.validate = sinon.spy(validator.validate);
    // act
    ValidationEngine.validateGroup(group);
    // assert
    assert.ok(validator.validate.calledOnce, "Validator should be validated as part of group");
});


QUnit.test("dxValidator should be registered as part of dxValidationGroup - when dxValidationGroup was created after dxValidator", function(assert) {
    var $container = $("#dxValidationGroup");

    this.fixture.createValidationGroupContainer($container);

    var validator = this.fixture.createValidatorInGroup(),
        group = this.fixture.createGroup(),
        defaultGroupConfig = ValidationEngine.getGroupConfig(undefined);

    validator.validate = sinon.spy(validator.validate);
    // act
    ValidationEngine.validateGroup(group);
    // assert
    assert.strictEqual(defaultGroupConfig.validators.length, 0, "Validator should be deregistered in default group");
    assert.ok(validator.validate.calledOnce, "Validator should be validated as part of group");
});

QUnit.test("dxValidationGroup can be disposed, container should be cleared (T199232)", function(assert) {
    var $container = $("#dxValidationGroup");
    this.fixture.createGroup($container);
    // act
    this.fixture.disposeGroup();
    // assert
    assert.strictEqual(false, $container.hasClass("dx-validationgroup"), "Specific class should be added");
});


QUnit.test("dxValidator can be reset as part of dxValidationGroup", function(assert) {
    var $container = $("#dxValidationGroup"),
        group = this.fixture.createGroup($container),
        validator = this.fixture.createValidatorInGroup();

    validator.reset = sinon.spy(validator.reset);
    // act
    group.reset();
    // assert
    assert.ok(validator.reset.calledOnce, "Validator should be reset as part of group");
});


QUnit.module("API", {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
});

QUnit.test("group.validate", function(assert) {
    var $container = $("#dxValidationGroup"),
        group = this.fixture.createGroup($container);

    this.fixture.createValidatorInGroup();

    ValidationEngine.validateGroup = sinon.spy(ValidationEngine.validateGroup);
    // act
    var result = group.validate();
    // assert
    assert.ok(result, "Result should be returned");
    assert.ok(ValidationEngine.validateGroup.calledOnce, "validatorGroup should be called");
    assert.equal(ValidationEngine.validateGroup.getCall(0).args[0], group, "correct group key should be passed");
});
