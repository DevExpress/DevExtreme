import $ from "jquery";
import devices from "core/devices";
import errors from "ui/widget/ui.errors";
import executeAsyncMock from "../../helpers/executeAsyncMock.js";
import keyboardMock from "../../helpers/keyboardMock.js";

import "ui/radio_group";

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

QUnit.module("nested radio group", moduleConfig, function() {
    QUnit.test("T680199 - click on nested radio group in template should not affect on contaier parent radio group", function(assert) {
        var $nestedRadioGroup;

        var $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [{
                template: function(itemData, itemIndex, element) {
                    $nestedRadioGroup = $("<div/>").dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);

                    $("<div/>").dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);
                }
            }]
        });

        var parentRadioGroup = $radioGroup.dxRadioGroup("instance");
        var parentItemElement = $(parentRadioGroup.itemElements()).first();
        parentItemElement.trigger("dxclick");
        assert.ok(parentItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of parent radio group is checked");

        var nestedRadioGroup = $nestedRadioGroup.dxRadioGroup("instance");
        var nestedItemElement = $(nestedRadioGroup.itemElements()).first();
        nestedItemElement.trigger("dxclick");
        assert.ok(nestedItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of nested radio group is checked");

        assert.ok(parentItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of parent radio group is not changed");
    });
    QUnit.test("T680199 - click on one nested radio group doesn't change another nested group", function(assert) {
        var $nestedRadioGroup1,
            $nestedRadioGroup2;

        $("#radioGroup").dxRadioGroup({
            items: [{
                template: function(itemData, itemIndex, element) {
                    $nestedRadioGroup1 = $("<div/>").dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);

                    $nestedRadioGroup2 = $("<div/>").dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);
                }
            }]
        });

        var nestedRadioGroup1 = $nestedRadioGroup1.dxRadioGroup("instance");
        var nestedRadioGroup2 = $nestedRadioGroup2.dxRadioGroup("instance");

        var firstNestedItemElement1 = $(nestedRadioGroup1.itemElements()).first();
        firstNestedItemElement1.trigger("dxclick");
        assert.ok(firstNestedItemElement1.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of first nested radio group is checked");

        var firstNestedItemElement2 = $(nestedRadioGroup2.itemElements()).first();
        assert.notOk(firstNestedItemElement2.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of second nested radio group is not changed");
    });
});


QUnit.module("buttons group rendering");

QUnit.test("onContentReady fired after the widget is fully ready", function(assert) {
    assert.expect(2);

    $("#radioGroup").dxRadioGroup({
        items: [
            { text: "0" }
        ],
        onContentReady: function(e) {
            assert.ok($(e.element).hasClass(RADIO_GROUP_CLASS));
            assert.ok($(e.element).find("." + RADIO_BUTTON_CLASS).length);
        }
    });
});

QUnit.test("onContentReady should rise after changing dataSource (T697809)", assert => {
    const onContentReadyHandler = sinon.stub(),
        instance = $("#radioGroup").dxRadioGroup({
            dataSource: ["str1", "str2", "str3"],
            onContentReady: onContentReadyHandler
        }).dxRadioGroup("instance");

    assert.ok(onContentReadyHandler.calledOnce);
    instance.option("dataSource", [1, 2, 3]);
    assert.strictEqual(onContentReadyHandler.callCount, 2);
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


QUnit.module("value", moduleConfig);

QUnit.test("should not throw an error when the value is \"null\" or \"undefine\"", assert => {
    const errorLogStub = sinon.stub(errors, "log");

    $("#radioGroup").dxRadioGroup({
        items: ['item1', 'item2', 'item3'],
        value: void 0
    });

    $("#radioGroup").dxRadioGroup({
        items: ['item1', 'item2', 'item3'],
        value: null
    });

    assert.notOk(errorLogStub.called, "Exception was not thrown");
    errorLogStub.restore();
});

QUnit.test("should have correct initialized selection", assert => {
    let radioGroupInstance = null;
    const isItemChecked = index => radioGroupInstance.itemElements().eq(index).hasClass(RADIO_BUTTON_CHECKED_CLASS);

    radioGroupInstance = $("#radioGroup").dxRadioGroup({
        items: ['item1', 'item2', 'item3']
    }).dxRadioGroup('instance');

    assert.notOk(isItemChecked(0));
    assert.notOk(isItemChecked(1));
    assert.notOk(isItemChecked(2));

    radioGroupInstance = $("#radioGroup").dxRadioGroup({
        items: ['item1', 'item2', 'item3'],
        value: 'item2'
    }).dxRadioGroup('instance');

    assert.notOk(isItemChecked(0));
    assert.ok(isItemChecked(1));
    assert.notOk(isItemChecked(2));
});

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

QUnit.test("value should be correct if valueExpr is a function", (assert) => {
    const items = [
        { text: "text1", value: true },
        { text: "text2", value: false }
    ];
    const radioGroup = $("#radioGroup")
        .dxRadioGroup({
            dataSource: items,
            valueExpr: (e) => e.value
        })
        .dxRadioGroup("instance");

    assert.strictEqual(radioGroup.option("value"), null);
    assert.strictEqual($(radioGroup.itemElements()).find(toSelector(RADIO_BUTTON_CHECKED_CLASS)).length, 0);

    const itemElement = $(radioGroup.itemElements()).first();

    itemElement.trigger("dxclick");
    assert.strictEqual(radioGroup.option("value"), true);
    assert.ok(itemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS));
});

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


QUnit.module("widget sizing render", moduleConfig);

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

QUnit.test("radio group items should not have tabIndex(T674238)", function(assert) {
    var items = [{ text: "0" }, { text: "1" }],
        $element = $("#widget").dxRadioGroup({
            focusStateEnabled: true,
            items: items
        });

    var $items = $element.find("." + RADIO_BUTTON_CLASS);
    assert.ok($items.eq(0).attr('tabindex') === undefined, "items of radio group hasn't tabindex");
    assert.ok($items.eq(1).attr('tabindex') === undefined, "items of radio group hasn't tabindex");
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
