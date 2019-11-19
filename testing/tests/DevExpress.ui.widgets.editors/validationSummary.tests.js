var $ = require("jquery"),
    Class = require("core/class"),
    DefaultAdapter = require("ui/validation/default_adapter"),
    ValidationEngine = require("ui/validation_engine"),
    Validator = require("ui/validator");

require("ui/validation_summary");

var Fixture = Class.inherit({
    createSummary: function(container, options) {
        this.$summaryContainer = $(container || "#dxSummary");
        return this.$summaryContainer.dxValidationSummary($.extend({}, options)).dxValidationSummary("instance");
    },

    createValidator: function(validatorOptions) {
        var $container = $("<div/>");
        this.stubAdapter = sinon.createStubInstance(DefaultAdapter);
        $container.appendTo("#qunit-fixture");
        return $container.dxValidator($.extend({
            adapter: this.stubAdapter
        }, validatorOptions)).dxValidator("instance");
    }
});


QUnit.testStart(function() {
    var markup = '\
    <div id="dxSummary"></div>\
    <div data-bind="dxValidationGroup: {}">\
        <div id="knockoutSummary" data-bind="dxValidationSummary: {}"></div>\
    </div>';

    $("#qunit-fixture").html(markup);
});

(function() {
    QUnit.module("General", {
        beforeEach: function() {
            this.fixture = new Fixture();
        }
    });

    QUnit.test("Widget can be created via jQuery", function(assert) {
        var summary = this.fixture.createSummary();

        assert.ok(summary, "Summary can be created");
    });

    QUnit.test("Widget can be created via jQuery", function(assert) {
        var summary = this.fixture.createSummary();
        assert.strictEqual(this.fixture.$summaryContainer.find(".dx-empty-message").length, 0, "Validation Summary should be empty by default");
        assert.ok(summary, "Summary can be created");
    });


    QUnit.test("Summary can subscribe on group's Validated event", function(assert) {
        var group = "group1",
            validator = sinon.createStubInstance(Validator);
        validator.validate.returns({ isValid: true, brokenRule: null });
        ValidationEngine.registerValidatorInGroup(group, validator);

        var summary = this.fixture.createSummary(null, {
            validationGroup: group
        });

        summary._groupValidationHandler = sinon.spy();

        summary._initGroupRegistration();

        // act
        ValidationEngine.validateGroup(group);

        // assert
        assert.ok(summary._groupValidationHandler.calledOnce, "Handler should be called");
        var params = summary._groupValidationHandler.getCall(0).args[0];
        assert.ok(summary._groupValidationHandler.calledOnce, "Handler should be called");
        assert.ok(summary._groupValidationHandler.calledOn(summary), "Handler should be called");
        assert.strictEqual(params.isValid, true, "IsValid should be passed");
        assert.ok(!params.brokenRule, "brokenRule should be null");
    });

    QUnit.test("Items retrieved in handler", function(assert) {
        var validator = sinon.createStubInstance(Validator),
            summary = this.fixture.createSummary(),
            message = "test message";

        summary._groupValidationHandler({
            isValid: false,
            brokenRules: [{
                type: "required",
                message: message,
                validator: validator
            }],
            validators: [validator]
        });


        var items = summary.option('items');

        assert.ok(items, "Items should exists");
        assert.equal(items.length, 1, "Single item");
        assert.equal(items[0].text, message, "Message should be transformed");
    });

    QUnit.test("Items should be grouped by validator", function(assert) {
        var summary = this.fixture.createSummary(),
            validator1 = sinon.createStubInstance(Validator),
            validator2 = sinon.createStubInstance(Validator),
            message = "test message";

        summary._groupValidationHandler({
            isValid: false,
            brokenRules: [{
                type: "async",
                message: message + "1-1",
                validator: validator1
            }, {
                type: "required",
                message: message + "2",
                validator: validator2
            },
            {
                type: "async",
                message: message + "1-2",
                validator: validator1
            }],
            validators: [validator1, validator2]
        });


        var items = summary.option('items');

        assert.ok(items, "Items should exists");
        assert.equal(items.length, 3, "Three messaged should be shown(several per validator)");
        assert.equal(items[0].text, message + "1-1", "Message should be transformed");
        assert.equal(items[1].text, message + "1-2", "Message should be transformed");
        assert.equal(items[2].text, message + "2", "Message should be transformed");
    });


    QUnit.test("Item click should focus on validator", function(assert) {
        var summary = this.fixture.createSummary(),
            validator = sinon.createStubInstance(Validator);

        summary._groupValidationHandler({
            isValid: false,
            brokenRules: [{
                type: "required",
                validator: validator
            }],
            validators: [validator]
        });

        // assert
        var itemElements = this.fixture.$summaryContainer.find(".dx-validationsummary-item");
        assert.equal(itemElements.length, 1, "Single item element should be rendered");
        itemElements.trigger("click");
        assert.ok(validator.focus.calledOnce, "Validator should be focused");
    });
})("General");


(function() {
    QUnit.module("Regression", {
        beforeEach: function() {
            this.fixture = new Fixture();
        }
    });

    QUnit.test("T195049: validationGroup should be passed by reference", function(assert) {
        var group = {
            text: "quite complex validation group object"
        };

        var summary = this.fixture.createSummary(null, {
            validationGroup: group
        });

        assert.ok(summary, "Summary can be created");
        assert.strictEqual(group, summary.option("validationGroup"));
    });


    QUnit.test("T212238: Summary can subscribe on group's Validated event when Summary is created before any validator in group", function(assert) {
        var group = "group1",
            validator = sinon.createStubInstance(Validator);
        validator.validate.returns({ isValid: true, brokenRule: null });

        var summary = this.fixture.createSummary(null, {
            validationGroup: group
        });

        summary._groupValidationHandler = sinon.spy();
        summary._initGroupRegistration();

        ValidationEngine.registerValidatorInGroup(group, validator);

        // act
        ValidationEngine.validateGroup(group);

        // assert
        assert.ok(summary._groupValidationHandler.calledOnce, "Handler should be called");
        var params = summary._groupValidationHandler.getCall(0).args[0];
        assert.ok(summary._groupValidationHandler.calledOnce, "Handler should be called");
        assert.ok(summary._groupValidationHandler.calledOn(summary), "Handler should be called");
        assert.strictEqual(params.isValid, true, "IsValid should be passed");
        assert.ok(!params.brokenRule, "brokenRule should be null");
    });


    QUnit.test("dxValidationSummary should be able to reinit group registration and subscribe to new group", function(assert) {
        var group = "group1",
            summary = this.fixture.createSummary(null, {
                validationGroup: undefined
            });

        // fake
        summary._groupValidationHandler = sinon.spy();
        // act
        summary.option("validationGroup", group);
        ValidationEngine.getGroupConfig(group).validate();
        // assert
        assert.ok(summary._groupValidationHandler.calledOnce, "Handler should be called");

    });

    QUnit.test("dxValidationSummary should be able to reinit group registration and unsubscribe old group", function(assert) {
        var group = "group1",
            summary = this.fixture.createSummary(null, {
                validationGroup: undefined
            });

        // fake
        summary._groupValidationHandler = sinon.spy();
        // act
        summary.option("validationGroup", group);
        ValidationEngine.getGroupConfig(undefined).validate();
        // assert
        assert.ok(summary._groupValidationHandler.notCalled, "Handler should not be called");

    });
})("Regression");


(function() {
    QUnit.module("Update on validator's validation", {
        beforeEach: function() {
            this.fixture = new Fixture();
        }
    });

    QUnit.test("Summary should be updated after validator validation", function(assert) {
        var message = "test message",
            validator1 = this.fixture.createValidator({
                validationGroup: "group1",
                validationRules: [{
                    type: "required",
                    message: message + " required"
                }, {
                    type: "range",
                    min: 10,
                    message: message + " range"
                }]
            });

        this.fixture.createValidator({
            validationGroup: "group1",
            validationRules: [{
                type: "required",
                message: message + "2"
            }]
        });

        var summary = this.fixture.createSummary(null, { validationGroup: "group1" });


        ValidationEngine.validateGroup("group1");


        // act
        // change validator's state
        validator1.option("adapter").getValue.returns("1");
        validator1.validate();

        // assert
        var items = summary.option('items');

        assert.ok(items, "Items should exists");
        assert.equal(items.length, 2, "Two messages should be shown (one message per validator)");
        assert.equal(items[0].text, message + " range", "Message should be updated");
    });


    QUnit.test("Message from valid item should be removed", function(assert) {
        var message = "test message",
            validator1 = this.fixture.createValidator({
                validationGroup: "group1",
                validationRules: [{
                    type: "required",
                    message: message + " required"
                }, {
                    type: "range",
                    min: 10,
                    message: message + " range"
                }]
            });

        this.fixture.createValidator({
            validationGroup: "group1",
            validationRules: [{
                type: "required",
                message: message + "2"
            }]
        });

        var summary = this.fixture.createSummary(null, { validationGroup: "group1" });

        ValidationEngine.validateGroup("group1");

        // act
        // change validator's state
        validator1.option("adapter").getValue.returns("100500");
        validator1.validate();

        // assert
        var items = summary.option('items');

        assert.ok(items, "Items should exists");
        assert.equal(items.length, 1, "Two messages only should be shown (one message per validator)");
        assert.equal(items[0].text, message + "2", "Message should be updated");
    });

    QUnit.test("Message of originally valid item should be added when it becomes invalid", function(assert) {
        var message = "test message",
            validator1 = this.fixture.createValidator({
                value: "100500",
                validationGroup: "group1",
                validationRules: [{
                    type: "required",
                    message: message
                }]
            }),
            summary = this.fixture.createSummary(null, { validationGroup: "group1" });

        ValidationEngine.validateGroup("group1");

        // act
        // change validator's state
        validator1.option("adapter").getValue.returns("");
        validator1.validate();

        // assert
        var items = summary.option('items');

        assert.ok(items, "Items should exists");
        assert.equal(items.length, 1, "Single message should be shown");
        assert.equal(items[0].text, message, "Message should be updated");
    });

    QUnit.test("T437697: dxValidationSummary - adapter focus is not a function", function(assert) {
        try {
            var message = "test message",
                validator1 = this.fixture.createValidator({
                    adapter: {
                        getValue: function() { return 123; },
                        validationRequestsCallbacks: $.Callbacks(),
                        applyValidationResults: false
                    },
                    validationGroup: "group1",
                    validationRules: [{
                        type: "required",
                        message: message
                    }]
                });

            this.fixture.createSummary(null, { validationGroup: "group1" });

            ValidationEngine.validateGroup("group1");

            validator1.validate();
            validator1.focus();

            assert.ok(true, "focus defined");
        } catch(e) {
            assert.ok(false, e);
        }
    });

    QUnit.test("Order of items in Summary should match order of validators", function(assert) {
        var message = "test message",
            validator1 = this.fixture.createValidator({
                value: "correct value",
                validationGroup: "group1",
                validationRules: [{
                    type: "required",
                    message: message + " 1"
                }]
            });

        this.fixture.createValidator({
            validationGroup: "group1",
            validationRules: [{
                type: "required",
                message: message + " 2"
            }]
        });

        var summary = this.fixture.createSummary(null, { validationGroup: "group1" });


        ValidationEngine.validateGroup("group1");

        // act
        // change validator's state
        validator1.option("adapter").getValue.returns("");
        validator1.validate();

        // assert
        var items = summary.option('items');

        assert.ok(items, "Items should exists");
        assert.equal(items.length, 2, "Two messages should be shown (one message per validator)");
        assert.equal(items[0].text, message + " 1", "Message should be updated");
        assert.equal(items[1].text, message + " 2", "Message should be updated");
    });

    QUnit.test("T270338: Summary should subscribe to validator's events only once", function(assert) {
        var validator1 = this.fixture.createValidator({
                validationGroup: "group1",
                validationRules: [{
                    type: "required"
                }]
            }),
            summary = this.fixture.createSummary(null, { validationGroup: "group1" });

        var spy = sinon.spy(summary, "_itemValidationHandler");

        ValidationEngine.validateGroup("group1");
        ValidationEngine.validateGroup("group1");

        spy.reset();
        validator1.validate();

        assert.equal(spy.callCount, 1, "Render of validation summary should be called only once");
    });

    QUnit.test("T270338 - the 'items' option changed should not be called if validator state is not changed", function(assert) {
        var itemsChangedCallCount = 0,
            validator = this.fixture.createValidator({
                validationGroup: "group",
                validationRules: [{
                    type: "required"
                }]
            });

        this.fixture.createSummary(null, {
            validationGroup: "group",
            onOptionChanged: function(args) {
                if(args.name === "items") {
                    itemsChangedCallCount++;
                }
            }
        });

        ValidationEngine.validateGroup("group");
        validator.validate();

        assert.equal(itemsChangedCallCount, 1, "items should not be changed if the validator state is not changed");
    });
})("Update on validator's validation");
