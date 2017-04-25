"use strict";

var $ = require("jquery"),
    DropDownBox = require("ui/drop_down_box");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownBox"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DROP_DOWN_BOX_CLASS = "dx-dropdownbox";

var moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.$element = $("#dropDownBox");
        this.simpleItems = [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
            { id: 3, name: "Item 3" }
        ];
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module("common", moduleConfig);

QUnit.test("element should have correct class", function(assert) {
    this.$element.dxDropDownBox({});

    assert.ok(this.$element.hasClass(DROP_DOWN_BOX_CLASS), "element has correct class");
});

QUnit.test("the widget should work without the dataSource", function(assert) {
    this.$element.dxDropDownBox({ value: 1 });
    var $input = this.$element.find("input"),
        instance = this.$element.dxDropDownBox("instance");

    assert.equal(instance.option("value"), 1, "value is correct");
    assert.equal(instance.option("text"), 1, "text is correct");
    assert.equal($input.val(), 1, "input value is correct");

    instance.option("value", "Test");
    assert.equal(instance.option("value"), "Test", "value is correct");
    assert.equal(instance.option("text"), "Test", "text is correct");
    assert.equal($input.val(), "Test", "input value is correct");
});

QUnit.test("expressions", function(assert) {
    this.$element.dxDropDownBox({
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: 1
    });

    var $input = this.$element.find("input");
    assert.equal($input.val(), "Item 1", "expressions work");
});

QUnit.test("array value should be supported", function(assert) {
    this.$element.dxDropDownBox({
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [2]
    });

    var $input = this.$element.find("input");
    assert.equal($input.val(), "Item 2", "array value works");
});

QUnit.test("array value changing", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [2]
    });

    var $input = this.$element.find("input");

    instance.option("value", 1);
    assert.equal($input.val(), "Item 1", "value has been changed correctly from array to primitive");

    instance.option("value", [2]);
    assert.equal($input.val(), "Item 2", "value has been changed correctly from primitive to array");
});

QUnit.test("multiple selection should work", function(assert) {
    this.$element.dxDropDownBox({
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [1, 3]
    });

    var $input = this.$element.find("input");
    assert.equal($input.val(), "Item 1, Item 3", "multiple selection works");
});

QUnit.test("multiple selection value changing", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: 2
    });

    var $input = this.$element.find("input");

    instance.option("value", [1, 3]);
    assert.equal($input.val(), "Item 1, Item 3", "correct values are selected");
});

QUnit.test("value clearing", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [1, 3]
    });

    var $input = this.$element.find("input");

    instance.option("value", null);
    assert.equal($input.val(), "", "input was cleared");
});

QUnit.test("content template should work", function(assert) {
    assert.expect(3);

    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        opened: true,
        contentTemplate: function(e) {
            assert.strictEqual(e.component.NAME, "dxDropDownBox", "component is correct");
            assert.equal(e.value, 1, "value is correct");
            return "Test content";
        },
        valueExpr: "id",
        displayExpr: "name",
        value: 1
    });

    assert.equal(instance.content().text(), "Test content", "content template has been rendered");
});

QUnit.test("popup and editor width should be equal", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        opened: true,
        width: 500,
        contentTemplate: function() {
            return "Test content";
        },
        valueExpr: "id",
        displayExpr: "name",
        value: [1, 3]
    });

    assert.equal(instance.content().outerWidth(), this.$element.outerWidth(), "width are equal on init");
    assert.equal(instance.content().outerWidth(), 500, "width are equal on init");

    instance.option("width", 700);
    assert.equal(instance.content().outerWidth(), this.$element.outerWidth(), "width are equal after option change");
    assert.equal(instance.content().outerWidth(), 700, "width are equal after option change");
});

QUnit.test("dropDownBox should work with the slow dataSource", function(assert) {
    var items = [{ key: 1, text: "Item 1" }, { key: 2, text: "Item 2" }],
        instance = new DropDownBox(this.$element, {
            dataSource: {
                load: function() {
                    $.Deferred().resolve(items).promise();
                },
                byKey: function() {
                    var d = $.Deferred();

                    setTimeout(function() {
                        d.resolve([{ key: 2, text: "Item 2" }]);
                    }, 50);

                    return d.promise();
                }
            },
            valueExpr: "key",
            displayExpr: "text",
            value: 2
        });

    var $input = this.$element.find("input");

    this.clock.tick(50);

    assert.equal($input.val(), "Item 2", "Input value was filled");
    assert.equal(instance.option("value"), 2, "value was applied");
});


QUnit.module("popup options", moduleConfig);

QUnit.test("customize width and height", function(assert) {
    var instance = new DropDownBox(this.$element, {
            width: 200,
            dropDownOptions: {
                width: 100,
                height: 100
            },
            opened: true
        }),
        $popupContent = instance.content();

    assert.equal($popupContent.outerWidth(), 100, "popup width has been customized");
    assert.equal($popupContent.outerHeight(), 100, "popup height has been customized");

    instance.option("dropDownOptions.width", undefined);
    assert.equal($popupContent.outerWidth(), 200, "popup width customization has been cancelled");
});

QUnit.test("dimensionChanged should be called after dimension popup option changing", function(assert) {
    var instance = new DropDownBox(this.$element, {
            opened: true
        }),
        dimensionChangedSpy = sinon.spy(instance, "_dimensionChanged");

    var dimensionOptions = ["width", "height", "maxWidth", "maxHeight", "minWidth", "minHeight"];
    dimensionOptions.forEach(function(dimensionOption) {
        instance.option("dropDownOptions." + dimensionOption, 100);
    });

    assert.equal(dimensionChangedSpy.callCount, dimensionOptions.length, "dimensionChanged was called correct number of times");
});

QUnit.test("dimensionChanged should be called once when different popup options changing simultaneously", function(assert) {
    var instance = new DropDownBox(this.$element, {
            opened: true
        }),
        dimensionChangedSpy = sinon.spy(instance, "_dimensionChanged");

    instance.option("dropDownOptions", {
        title: "Test",
        width: 100,
        height: 100
    });

    assert.equal(dimensionChangedSpy.callCount, 1, "dimensionChanged was called once");
});
