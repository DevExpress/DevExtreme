var $ = require("jquery"),
    Lookup = require("ui/lookup"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    fx = require("animation/fx");

require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="lookup"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        \
        <div id="lookupFieldTemplate">\
            <div data-options="dxTemplate: { name: \'field\' }">\
                <span>test</span>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var LOOKUP_FIELD_CLASS = "dx-lookup-field";

QUnit.module("Lookup", {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();

        this.element = $("#lookup");
        this.instance = this.element.dxLookup({ fullScreen: false }).dxLookup("instance");
        this.$field = $(this.instance._$field);
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test("render dxLookup", function(assert) {
    assert.ok(this.instance instanceof Lookup);
    assert.ok(this.element.hasClass("dx-lookup"), "widget has class dx-lookup");
    assert.ok($("." + LOOKUP_FIELD_CLASS, this.element).length, "widget contents field");
    assert.ok($(".dx-lookup-arrow", this.element).length, "widget contents arrow");
});

QUnit.test("regression: value is out of range (B231783)", function(assert) {
    this.instance.option({
        dataSource: [1, 2, 3],
        value: "wrongValue"
    });

    assert.equal(this.$field.text(), "Select...");
});

QUnit.test("regression: B232016 - Lookup element has no 'dx-widget' CSS class", function(assert) {
    assert.ok(this.element.hasClass("dx-widget"));
});

QUnit.test("lookup empty class is attached when no item is selected", function(assert) {
    var $lookup = this.element.dxLookup({ dataSource: [1, 2, 3], showClearButton: true, placeholder: "placeholder" }),
        LOOKUP_EMPTY_CLASS = "dx-lookup-empty";

    assert.ok($lookup.hasClass(LOOKUP_EMPTY_CLASS), "Lookup without preselected value has empty class");
});

QUnit.test("data source should be paginated by default", function(assert) {
    assert.expect(1);

    var $element = $("#lookup").dxLookup({
            dataSource: [1, 2]
        }),
        instance = $element.dxLookup("instance");

    assert.equal(instance._dataSource.paginate(), true, "pagination enabled by default");
});

QUnit.test("T373464 - the 'fieldTemplate' should be used for rendering if the item is get asynchronously", function(assert) {
    var fieldTemplateText = "Field template",
        items = ["1", "2"],
        $element = $("#lookup").dxLookup({
            fieldTemplate: function() {
                return fieldTemplateText;
            },
            dataSource: {
                byKey: function(key) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(key);
                    }, 0);
                    return d.promise();
                },
                load: function() {
                    return items;
                }
            },
            value: items[0]
        });

    this.clock.tick(0);
    assert.equal($element.find("." + LOOKUP_FIELD_CLASS).text(), fieldTemplateText, "field template is used");
});


QUnit.module("hidden input");

QUnit.test("a hidden input should be rendered", function(assert) {
    var $element = $("#lookup").dxLookup(),
        $input = $element.find("input[type='hidden']");

    assert.equal($input.length, 1, "a hidden input is rendered");
});

QUnit.test("the hidden input should have correct value on widget init", function(assert) {
    var $element = $("#lookup").dxLookup({
            items: [1, 2, 3],
            value: 2
        }),
        $input = $element.find("input[type='hidden']");

    assert.equal($input.val(), "2", "input value is correct");
});

QUnit.test("the hidden input should get display text as value if widget value is an object", function(assert) {
    var items = [{ id: 1, text: "one" }],
        $element = $("#lookup").dxLookup({
            items: items,
            value: items[0],
            valueExpr: "this",
            displayExpr: "text"
        }),
        $input = $element.find("input[type='hidden']");

    assert.equal($input.val(), items[0].text, "input value is correct");
});

QUnit.test("the hidden input should get value in respect of the 'valueExpr' option", function(assert) {
    var items = [{ id: 1, text: "one" }],
        $element = $("#lookup").dxLookup({
            items: items,
            value: items[0].id,
            valueExpr: "id",
            displayExpr: "text"
        }),
        $input = $element.find("input[type='hidden']");

    assert.equal($input.val(), items[0].id, "input value is correct");
});


QUnit.module("options", {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("hidden input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "lookup",
        $element = $("#lookup").dxLookup({
            name: expectedName
        }),
        $input = $element.find("input[type='hidden']");

    assert.equal($input.attr("name"), expectedName, "input has correct 'name' attribute");
});

QUnit.test("displayExpr, valueExpr as functions (regression B230600)", function(assert) {
    var instance = $("#lookup").dxLookup({
            dataSource: [1, 2],
            valueExpr: function(item) {
                return item * 2;
            },
            displayExpr: function(item) {
                return "number " + item;
            },
            value: 2
        }).dxLookup("instance"),
        $field = instance._$field;

    assert.equal($field.text(), "number 1");
});

QUnit.test("value", function(assert) {
    var items = [1, 2, 3],
        instance = $("#lookup").dxLookup({ dataSource: items, value: 1 }).dxLookup("instance"),
        $field = $(instance._$field);

    assert.equal($field.text(), 1, "field text is selected item value");
    assert.equal(instance.option("displayValue"), 1, "displayValue is selected item value");
});

QUnit.test("value should be assigned by reference", function(assert) {
    var items = [{ name: "name" }],
        instance = $("#lookup").dxLookup({
            dataSource: items,
            value: items[0],
            displayExpr: "name"
        }).dxLookup("instance"),
        $field = $(instance._$field);

    assert.equal($field.text(), "name", "item was found in items by reference");
});

QUnit.test("placeholder", function(assert) {
    var instance = $("#lookup").dxLookup({
        dataSource: []
    })
        .dxLookup("instance");

    assert.equal($(instance._$field).text(), "Select...", "default value");
});

QUnit.test("fieldTemplate should be rendered", function(assert) {
    $("#lookupFieldTemplate").dxLookup({ fieldTemplate: "field" });

    assert.equal($.trim($("#lookupFieldTemplate").text()), "test", "test was be rendered");
});

QUnit.test("selected item should be passed as first argument if fieldTemplate is a function", function(assert) {
    var items = [{ id: 1, text: "one", data: 11 }, { id: 2, text: "two", data: 22 }];

    $("#lookup").dxLookup({
        items: items,
        valueExpr: "id",
        displayExpr: "text",
        value: items[1].id,
        fieldTemplate: function(item) {
            assert.deepEqual(item, items[1], "selected item is passed to fieldTemplate function");

            return $("<div>").dxTextBox();
        }
    });
});


QUnit.module("widget sizing render");

QUnit.test("constructor", function(assert) {
    var $element = $("#lookup").dxLookup({ width: 400 }),
        instance = $element.dxLookup("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.get(0).style.width, "400px", "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxLookup(),
        instance = $element.dxLookup("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.get(0).style.width, "300px", "outer width of the element must be equal to custom width");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#lookup").dxLookup(),
        $field = $element.find("." + LOOKUP_FIELD_CLASS + ":first");

    assert.equal($field.attr("role"), "combobox", "aria role is on the field");
});
