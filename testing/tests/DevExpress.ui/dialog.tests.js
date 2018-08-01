var $ = require("jquery"),
    dialog = require("ui/dialog"),
    viewPort = require("core/utils/view_port").value,
    domUtils = require("core/utils/dom"),
    devices = require("core/devices"),
    fx = require("animation/fx"),
    config = require("core/config");

QUnit.module("dialog tests", {
    beforeEach: function() {
        viewPort("#qunit-fixture");

        var that = this;

        fx.off = true;

        this.title = "Title here";
        this.message = "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>";
        this.dialog = function() {
            return $(".dx-dialog-wrapper");
        };
        this.thereIsDialog = function() {
            return that.dialog().length === 1;
        };
        this.thereIsNoDialog = function() {
            return that.dialog().length === 0;
        };
        this.clickButton = function(index) {
            index = index || 0;
            that.dialog()
                .find(".dx-dialog-button")
                .eq(index)
                .trigger("dxclick");
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("dialog show/hide", function(assert) {
    var instance,
        options = {
            title: this.title,
            message: this.message
        },
        result = "DialogResultValue";

    var afterHide = function(value) {
        assert.equal(value, result, "Dialog's deferred object were resolved with right value.");
    };

    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

    // by 'hide' calling
    instance = dialog.custom(options);
    instance.show().done(afterHide);
    assert.ok(this.thereIsDialog(), "Dialog is shown.");
    instance.hide(result);
    assert.ok(this.thereIsNoDialog(), "Dialog is not shown after 'hide' was called.");

    // by clicking button
    instance = dialog.custom(options);
    instance.show();
    assert.ok(this.thereIsDialog(), "Dialog is shown.");
    this.clickButton();
    assert.ok(this.thereIsNoDialog(), "Dialog is not shown after button was clicked.");
});

QUnit.testInActiveWindow("first button in dialog obtained focus on shown", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "focus is absent on mobile devices");
        return;
    }
    dialog.alert("Sample message", "Alert");

    assert.equal($(".dx-dialog-wrapper").find(".dx-state-focused").length, 1, "button obtained focus");
});

QUnit.test("dialog content", function(assert) {
    var instance,
        options = {
            title: this.title,
            message: this.message
        };

    instance = dialog.custom(options);
    instance.show();

    assert.equal(this.dialog().find(".dx-popup-title").text(), this.title, "Actual title is equal to expected.");
    assert.equal((this.dialog().find(".dx-dialog-message").html() || "").toLowerCase(), this.message.toLowerCase(), "Actual message is equal to expected.");
    instance.hide();

    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

    options = {
        message: this.message
    };
    assert.equal(instance.title, undefined, "dialog.title value isn't set.");

    dialog.title = this.title;
    instance = dialog.custom(options);
    instance.show();

    assert.equal(this.dialog().find(".dx-popup-title").text(), this.title, "Dialog default title is used.");

    instance.hide();

    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
});

QUnit.test("dialog content without title", function(assert) {
    var instance,
        options = {
            title: this.title,
            message: this.message,
            showTitle: false
        };

    instance = dialog.custom(options);
    instance.show();

    assert.equal(this.dialog().find(".dx-popup-title").length, 0, "Actual title is equal not expected.");
});

QUnit.test("dialog buttons", function(assert) {
    var instance,
        actual,
        expected = "ButtonReturnValue#2",
        options = {
            title: this.title,
            message: this.message,
            buttons: [{
                text: "ButtonCaption#1",
                onClick: function() {
                    return "ButtonReturnValue#1";
                }
            }, {
                text: "ButtonCaption#2",
                onClick: function() {
                    return "ButtonReturnValue#2";
                }
            }]
        };
    var afterHide = function(value) {
        actual = value;
    };

    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

    instance = dialog.custom(options);
    instance.show().done(afterHide);

    assert.ok(this.thereIsDialog(), "Dialog is shown.");
    assert.equal(this.dialog().find(".dx-dialog-button").length, 2, "There are two custom buttons.");

    this.clickButton(1);

    assert.equal(actual, expected, "Actual value is equal to expected.");
    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
});

QUnit.test("alert dialog", function(assert) {
    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

    dialog.title = this.title;
    dialog.alert(this.message);

    assert.ok(this.thereIsDialog(), "Dialog is shown.");
    assert.equal(this.dialog().find(".dx-popup-title").text(), this.title, "Dialog default title is used.");

    var $bottom = this.dialog().find(".dx-popup-bottom");

    assert.equal($bottom.length, 1, "Dialog bottom is rendered");
    assert.equal($bottom.find(".dx-button").length, 1, "Dialog has button");

    this.clickButton();

    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
});

QUnit.test("confirm dialog", function(assert) {
    var actual,
        expected = true;

    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");

    dialog.confirm(this.message, this.title).done(function(value) {
        actual = value;
    });

    this.clickButton();

    assert.equal(actual, expected, "Confirm result value is equal to expected.");
    assert.ok(this.thereIsNoDialog(), "Dialog is not shown.");
});

QUnit.test("dialog overlay content has 'dx-rtl' class when RTL is enabled", function(assert) {
    config({ rtlEnabled: true });

    dialog.confirm(this.message, this.title);

    assert.ok($('.dx-overlay-content').hasClass('dx-rtl'), "'dx-rlt' class is present");

    config({ rtlEnabled: false });
});

QUnit.test("dialog should reset active element on showing", function(assert) {
    var instance,
        options = {
            title: "title",
            message: "message"
        },
        resetActiveElementCalled = 0,
        originalResetActiveElement = domUtils.resetActiveElement;

    domUtils.resetActiveElement = function() {
        resetActiveElementCalled++;
    };

    try {
        instance = dialog.custom(options);
        instance.show();
        assert.equal(resetActiveElementCalled, 1);
        instance.hide();
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});
