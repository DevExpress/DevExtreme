"use strict";

var $ = require("jquery"),
    devices = require("core/devices"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("ui/radio_group");

QUnit.testStart(function() {
    var markup =
        '<div id="radioGroup"> </div>\
        <div id="radioGroup2"> </div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $("#qunit-fixture").html(markup);
});

var RADIO_GROUP_CLASS = "dx-radiogroup",
    RADIO_GROUP_VERTICAL_CLASS = "dx-radiogroup-vertical",
    RADIO_GROUP_HORIZONTAL_CLASS = "dx-radiogroup-horizontal",
    RADIO_BUTTON_CLASS = "dx-radiobutton",
    RADIO_BUTTON_CHECKED_CLASS = "dx-radiobutton-checked",
    FOCUSED_CLASS = "dx-state-focused";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

var moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
};


QUnit.module("buttons group rendering", moduleConfig);

QUnit.test("widget should be rendered", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup();

    assert.ok($radioGroup.hasClass(RADIO_GROUP_CLASS), "widget class added");
});

QUnit.test("widget should generate buttons", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [
            { text: "0" },
            { text: "1" },
            { text: "2" }
        ]
    });

    assert.equal($radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).length, 3, "buttons generated");
});

QUnit.test("empty message should not be generated if no items", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup();

    assert.equal($radioGroup.find(".dx-scrollview-content").text(), "", "empty message is not shown");
});

QUnit.test("widget should correctly process 'disabled' option changed", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [
            { text: "0" },
            { text: "1" },
            { text: "2" }
        ],
        disabled: true
    });

    assert.ok($radioGroup.find(".dx-collection").hasClass("dx-state-disabled"), "inner collection has disabled-state class");

    var radioGroup = $radioGroup.dxRadioGroup("instance");
    radioGroup.option("disabled", false);

    assert.ok(!$radioGroup.find(".dx-collection").hasClass("dx-state-disabled"), "inner collection hasn't disabled-state class");
});


QUnit.module("buttons rendering", moduleConfig);

QUnit.test("button markup item if item.value is specified", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [
            { text: "0", value: "0" }
        ],
        valueExpr: "value"
    });

    var $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).eq(0);
    assert.equal($radioButton.text(), "0", "text rendered correctly");
});

QUnit.test("button markup item if item.value is not specified", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [
            { text: "0" }
        ],
        valueExpr: "value"
    });

    var $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).eq(0);
    assert.equal($radioButton.text(), "0", "text rendered correctly");
});

QUnit.test("button markup item if item is primitive string", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [
            "0"
        ]
    });

    var $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).eq(0);
    assert.equal($radioButton.text(), "0", "text rendered correctly");
});

QUnit.test("button markup item if item has html", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [
            { html: "<input type='radio' value='foo'>" }
        ]
    });

    var $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).find("input");

    assert.equal($radioButton.prop("type"), "radio", "input type rendered correctly");
    assert.equal($radioButton.prop("value"), "foo", "input value rendered correctly");
});


QUnit.module("layout", moduleConfig);

QUnit.test("should be generated proper class with vertical layout", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        layout: "vertical"
    });

    assert.ok($radioGroup.hasClass(RADIO_GROUP_VERTICAL_CLASS), "class set correctly");
});

QUnit.test("should be generated proper class with horizontal layout", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        layout: "horizontal"
    });

    assert.ok($radioGroup.hasClass(RADIO_GROUP_HORIZONTAL_CLASS), "class set correctly");
});

QUnit.test("should be generated proper class when layout is changed", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        layout: "horizontal"
    });

    $radioGroup.dxRadioGroup("instance").option("layout", "vertical");

    assert.ok($radioGroup.hasClass(RADIO_GROUP_VERTICAL_CLASS), "class set correctly");
});

QUnit.test("On the tablet radio group must use a horizontal layout", function(assert) {
    devices.current("iPad");

    var $radioGroup = $("#radioGroup").dxRadioGroup(),
        isHorizontalLayout = $radioGroup.dxRadioGroup("instance").option("layout") === "horizontal" ? true : false;

    assert.ok(isHorizontalLayout, "radio group on tablet have horizontal layout");
});


QUnit.module("hidden input");

QUnit.test("a hidden input should be rendered", function(assert) {
    var $element = $("#radioGroup").dxRadioGroup(),
        $input = $element.find("input");

    assert.equal($input.length, 1, "input is rendered");
    assert.equal($input.attr("type"), "hidden", "the input type is 'hidden'");
});

QUnit.test("the hidden input should have correct value on widget init", function(assert) {
    var $element = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            value: 2
        }),
        $input = $element.find("input");

    assert.equal($input.val(), "2", "input value is correct");
});

QUnit.test("the hidden input should get correct value on widget value change", function(assert) {
    var $element = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            value: 2
        }),
        instance = $element.dxRadioGroup("instance"),
        $input = $element.find("input");

    instance.option("value", 1);
    assert.equal($input.val(), "1", "input value is correct");
});

QUnit.test("the hidden input should get display text as value if widget value is an object", function(assert) {
    var items = [{ id: 1, text: "one" }],
        $element = $("#radioGroup").dxRadioGroup({
            items: items,
            value: items[0],
            displayExpr: "text"
        }),
        $input = $element.find("input");

    assert.equal($input.val(), items[0].text, "input value is correct");
});

QUnit.test("the hidden input should get value in respect of the 'valueExpr' option", function(assert) {
    var items = [{ id: 1, text: "one" }],
        $element = $("#radioGroup").dxRadioGroup({
            items: items,
            value: items[0].id,
            valueExpr: "id",
            displayExpr: "text"
        }),
        $input = $element.find("input");

    assert.equal($input.val(), items[0].id, "input value is correct");
});


QUnit.module("the 'name' option");

QUnit.test("widget hidden input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name",
        $element = $("#radioGroup").dxRadioGroup({
            name: expectedName
        }),
        $input = $element.find("input");

    assert.equal($input.attr("name"), expectedName, "the hidden input 'name' attribute has correct value");
});


QUnit.module("value", moduleConfig);

QUnit.test("repaint of widget shouldn't reset value option", function(assert) {
    var items = [{ text: "0" }, { text: "1" }];
    var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: items,
            value: items[1]
        }),
        radioGroup = $radioGroup.dxRadioGroup("instance");

    radioGroup.repaint();
    assert.strictEqual(radioGroup.option("value"), items[1]);
});

QUnit.test("item checked on start", function(assert) {
    var done = assert.async();

    executeAsyncMock.teardown();

    var items = [{ text: "0" }, { text: "1" }];
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        dataSource: items,
        value: items[1]
    });

    var radioGroup = $radioGroup.dxRadioGroup("instance");

    setTimeout(function() {
        assert.equal($(radioGroup.itemElements()).filter(toSelector(RADIO_BUTTON_CHECKED_CLASS)).length, 1, "one item checked");
        done();
    });
});

QUnit.test("value is changed on item click", function(assert) {
    assert.expect(1);

    var value;
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [1, 2, 3],
        onValueChanged: function(e) {
            value = e.value;
        }
    });
    var radioGroup = $radioGroup.dxRadioGroup("instance");

    $(radioGroup.itemElements()).first().trigger("dxclick");

    assert.equal(value, 1, "value changed");
});

QUnit.test("onValueChanged option should get jQuery event as a parameter", function(assert) {
    var jQueryEvent,
        $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            onValueChanged: function(e) {
                jQueryEvent = e.event;
            }
        }),
        radioGroup = $radioGroup.dxRadioGroup("instance");

    $(radioGroup.itemElements()).first().trigger("dxclick");
    assert.ok(jQueryEvent, "jQuery event is defined when click used");

    radioGroup.option("value", 2);
    assert.notOk(jQueryEvent, "jQuery event is not defined when api used");
});


QUnit.module("valueExpr", moduleConfig);

QUnit.test("value should be correct if valueExpr is a string", function(assert) {
    var items = [
        { number: 1, caption: "one" },
        { number: 2, caption: "two" }
    ];

    var radioGroup = $("#radioGroup")
        .dxRadioGroup({
            dataSource: items,
            valueExpr: "number",
            value: 2,
            itemTemplate: function(item) {
                return item.caption;
            }
        })
        .dxRadioGroup("instance");

    var $secondItem = $(radioGroup.itemElements()).eq(1);

    assert.equal($secondItem.text(), "two");

    radioGroup.option("itemTemplate", function(item) {
        return item.number;
    });

    $secondItem = $(radioGroup.itemElements()).eq(1);
    assert.equal($secondItem.text(), "2");

    radioGroup.option("valueExpr", "caption");
    assert.equal(radioGroup.option("value"), 2);

    assert.equal($(radioGroup.itemElements()).find(toSelector(RADIO_BUTTON_CHECKED_CLASS)).length, 0, "no items selected");
});

QUnit.test("value should be correct if valueExpr is a string", function(assert) {
    var items = [
        { number: 0, caption: "zero" },
        { number: 1, caption: "one" }
    ];

    var radioGroup = $("#radioGroup")
        .dxRadioGroup({
            dataSource: items,
            valueExpr: "number",
            itemRender: function(item) {
                return item.caption;
            },
            value: 0
        })
        .dxRadioGroup("instance");

    var $firstItem = $(radioGroup.itemElements()).eq(0);

    assert.ok($firstItem.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item with zero value rendered correctly");
});


QUnit.module("widget sizing render", moduleConfig);

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxRadioGroup({
        items: [
            { text: "0" },
            { text: "1" },
            { text: "2" },
            { text: "3" }
        ]
    });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxRadioGroup({
            items: [
                { text: "0" },
                { text: "1" },
                { text: "2" },
                { text: "3" }
            ],
            width: 400
        }),
        instance = $element.dxRadioGroup("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxRadioGroup({
            items: [
                { text: "0" },
                { text: "1" },
                { text: "2" },
                { text: "3" }
            ]
        }),
        instance = $element.dxRadioGroup("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxRadioGroup({
            items: [
                { text: "0" },
                { text: "1" },
                { text: "2" },
                { text: "3" }
            ]
        }),
        instance = $element.dxRadioGroup("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});


QUnit.module("keyboard navigation", moduleConfig);

QUnit.test("keys tests", function(assert) {
    assert.expect(3);

    var items = [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }],
        $element = $("#widget").dxRadioGroup({
            focusStateEnabled: true,
            items: items
        }),
        instance = $element.dxRadioGroup("instance"),
        keyboard = keyboardMock($element);

    $element.focusin();

    keyboard.keyDown("enter");
    assert.equal(instance.option("value"), items[0], "first item chosen");
    keyboard.keyDown("down");
    keyboard.keyDown("enter");
    assert.equal(instance.option("value"), items[1], "second item chosen");
    keyboard.keyDown("up");
    keyboard.keyDown("space");
    assert.equal(instance.option("value"), items[0], "first item chosen");
});

QUnit.test("control keys should be prevented", function(assert) {
    var items = [{ text: "0" }, { text: "1" }];
    var $element = $("#widget").dxRadioGroup({
        focusStateEnabled: true,
        items: items
    });
    var keyboard = keyboardMock($element);
    var isDefaultPrevented = false;
    $($element).on("keydown", function(e) {
        isDefaultPrevented = e.isDefaultPrevented();
    });

    $element.focusin();

    keyboard.keyDown("enter");
    assert.ok(isDefaultPrevented, "enter is default prevented");

    keyboard.keyDown("down");
    assert.ok(isDefaultPrevented, "down is default prevented");

    keyboard.keyDown("up");
    assert.ok(isDefaultPrevented, "up is default prevented");

    keyboard.keyDown("space");
    assert.ok(isDefaultPrevented, "space is default prevented");
});

QUnit.test("keyboard navigation does not work in disabled widget", function(assert) {
    var items = [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }],
        $element = $("#widget").dxRadioGroup({
            focusStateEnabled: true,
            items: items,
            disabled: true
        });

    assert.ok($element.attr('tabindex') === undefined, "collection of radio group has not tabindex");
});


QUnit.module("focus policy", moduleConfig);

QUnit.test("focused-state set up on radio group after focusing on any item", function(assert) {
    assert.expect(2);

    var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true
        }),
        radioGroup = $radioGroup.dxRadioGroup("instance"),
        $firstRButton = $(radioGroup.itemElements()).first();

    assert.ok(!$radioGroup.hasClass(FOCUSED_CLASS), "radio group is not focused");

    $radioGroup.focusin();
    $($firstRButton).trigger("dxpointerdown");

    assert.ok($radioGroup.hasClass(FOCUSED_CLASS), "radio group was focused after focusing on item");
});

QUnit.test("radioGroup item has not dx-state-focused class after radioGroup lose focus", function(assert) {
    assert.expect(2);

    var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true
        }),
        radioGroup = $radioGroup.dxRadioGroup("instance"),
        $firstRButton = $(radioGroup.itemElements()).first();

    $radioGroup.focusin();
    $($firstRButton).trigger("dxpointerdown");

    assert.ok($firstRButton.hasClass(FOCUSED_CLASS), "radioGroup item is focused");

    $radioGroup.focusout();

    assert.ok(!$firstRButton.hasClass(FOCUSED_CLASS), "radio group item lost focus after focusout on radio group");
});

QUnit.test("radioGroup item has not dx-state-focused class after radioGroup lose focus", function(assert) {
    assert.expect(2);

    var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true
        }),
        radioGroup = $radioGroup.dxRadioGroup("instance"),
        $firstRButton = $(radioGroup.itemElements()).first();

    assert.ok(!$firstRButton.hasClass(FOCUSED_CLASS));

    $radioGroup.focusin();

    assert.ok($firstRButton.hasClass(FOCUSED_CLASS), "radioGroup item is not focused");
});

QUnit.test("radioGroup element should get 'dx-state-focused' class", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        items: [1, 2, 3],
        focusStateEnabled: true
    });

    $radioGroup.focusin();

    assert.ok($radioGroup.hasClass(FOCUSED_CLASS), "element got 'dx-state-focused' class");
});

QUnit.test("option 'accessKey' has effect", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true,
            accessKey: "k"
        }),
        instance = $radioGroup.dxRadioGroup("instance");

    assert.equal($radioGroup.attr("accessKey"), "k", "access key is correct");

    instance.option("accessKey", "o");
    assert.equal($radioGroup.attr("accessKey"), "o", "access key is correct after change");
});

QUnit.test("option 'tabIndex' has effect", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true,
            tabIndex: 4
        }),
        instance = $radioGroup.dxRadioGroup("instance");

    assert.equal($radioGroup.attr("tabIndex"), 4, "tab index is correct");
    instance.option("tabIndex", 7);
    assert.equal($radioGroup.attr("tabIndex"), 7, "tab index is correct after change");
});

QUnit.testInActiveWindow("the 'focus()' method should set focused class to widget", function(assert) {
    var $radioGroup = $("#radioGroup").dxRadioGroup({
        focusStateEnabled: true
    });
    var instance = $radioGroup.dxRadioGroup("instance");

    instance.focus();
    assert.ok($radioGroup.hasClass("dx-state-focused"), "widget got focused class");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#radioGroup").dxRadioGroup({ focusStateEnabled: true });
    assert.equal($element.attr("role"), "radiogroup", "aria role is correct");
    assert.ok($element.attr("aria-activedescendant"), "aria-activedescendant should be on element with role");
});

QUnit.test("radio role should be included in radiogroup", function(assert) {
    assert.expect(6);

    var items = [1, 2, 3],
        $element = $("#radioGroup").dxRadioGroup({ items: items, value: items[0] });

    $element.find("." + RADIO_BUTTON_CLASS).each(function(i, radioButton) {
        assert.equal($(radioButton).attr("role"), "radio", " role for button " + i + " is correct");
        assert.equal($(radioButton).attr("aria-checked"), "" + (i === 0), i + "checked state for button " + i + " is correct");
    });
});
