import $ from "jquery";
import devices from "core/devices";
import errors from "ui/widget/ui.errors";
import executeAsyncMock from "../../helpers/executeAsyncMock.js";
import keyboardMock from "../../helpers/keyboardMock.js";

import "ui/radio_group";

const { testStart, module, test, testInActiveWindow } = QUnit;

testStart(() => {
    const markup = `
        <div id="radioGroup"></div>
        <div id="radioGroup2"></div>
        <div id="widget"></div>
        <div id="widthRootStyle" style="width: 300px;"></div>`;

    $("#qunit-fixture").html(markup);
});

const RADIO_GROUP_CLASS = "dx-radiogroup";
const RADIO_GROUP_VERTICAL_CLASS = "dx-radiogroup-vertical";
const RADIO_GROUP_HORIZONTAL_CLASS = "dx-radiogroup-horizontal";
const RADIO_BUTTON_CLASS = "dx-radiobutton";
const RADIO_BUTTON_CHECKED_CLASS = "dx-radiobutton-checked";
const FOCUSED_CLASS = "dx-state-focused";

const toSelector = cssClass => `.${cssClass}`;

const moduleConfig = {
    beforeEach: () => {
        executeAsyncMock.setup();
    },
    afterEach: () => {
        executeAsyncMock.teardown();
    }
};

module("nested radio group", moduleConfig, () => {
    test("T680199 - click on nested radio group in template should not affect on contaier parent radio group", assert => {
        let $nestedRadioGroup;

        const $radioGroup = $("#radioGroup").dxRadioGroup({
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

        const parentRadioGroup = $radioGroup.dxRadioGroup("instance");
        const parentItemElement = $(parentRadioGroup.itemElements()).first();
        parentItemElement.trigger("dxclick");
        assert.ok(parentItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of parent radio group is checked");

        const nestedRadioGroup = $nestedRadioGroup.dxRadioGroup("instance");
        const nestedItemElement = $(nestedRadioGroup.itemElements()).first();
        nestedItemElement.trigger("dxclick");
        assert.ok(nestedItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of nested radio group is checked");

        assert.ok(parentItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of parent radio group is not changed");
    });

    test("T680199 - click on one nested radio group doesn't change another nested group", assert => {
        let $nestedRadioGroup1,
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

        const nestedRadioGroup1 = $nestedRadioGroup1.dxRadioGroup("instance");
        const nestedRadioGroup2 = $nestedRadioGroup2.dxRadioGroup("instance");

        const firstNestedItemElement1 = $(nestedRadioGroup1.itemElements()).first();
        firstNestedItemElement1.trigger("dxclick");
        assert.ok(firstNestedItemElement1.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of first nested radio group is checked");

        const firstNestedItemElement2 = $(nestedRadioGroup2.itemElements()).first();
        assert.notOk(firstNestedItemElement2.hasClass(RADIO_BUTTON_CHECKED_CLASS), "item of second nested radio group is not changed");
    });
});

module("buttons group rendering", () => {
    test("onContentReady fired after the widget is fully ready", assert => {
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

    test("onContentReady should rise after changing dataSource (T697809)", assert => {
        const onContentReadyHandler = sinon.stub(),
            instance = $("#radioGroup").dxRadioGroup({
                dataSource: ["str1", "str2", "str3"],
                onContentReady: onContentReadyHandler
            }).dxRadioGroup("instance");

        assert.ok(onContentReadyHandler.calledOnce);
        instance.option("dataSource", [1, 2, 3]);
        assert.strictEqual(onContentReadyHandler.callCount, 2);
    });
});

module("layout", moduleConfig, () => {
    test("should be generated proper class with vertical layout", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
            layout: "vertical"
        });

        assert.ok($radioGroup.hasClass(RADIO_GROUP_VERTICAL_CLASS), "class set correctly");
    });

    test("should be generated proper class with horizontal layout", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
            layout: "horizontal"
        });

        assert.ok($radioGroup.hasClass(RADIO_GROUP_HORIZONTAL_CLASS), "class set correctly");
    });

    test("should be generated proper class when layout is changed", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
            layout: "horizontal"
        });

        $radioGroup.dxRadioGroup("instance").option("layout", "vertical");

        assert.ok($radioGroup.hasClass(RADIO_GROUP_VERTICAL_CLASS), "class set correctly");
    });

    test("On the tablet radio group must use a horizontal layout", assert => {
        devices.current("iPad");

        const $radioGroup = $("#radioGroup").dxRadioGroup(),
            isHorizontalLayout = $radioGroup.dxRadioGroup("instance").option("layout") === "horizontal";

        assert.ok(isHorizontalLayout, "radio group on tablet have horizontal layout");
    });
});

module("hidden input", () => {
    test("the hidden input should get correct value on widget value change", assert => {
        const $element = $("#radioGroup").dxRadioGroup({
                items: [1, 2, 3],
                value: 2
            }),
            instance = $element.dxRadioGroup("instance"),
            $input = $element.find("input");

        instance.option("value", 1);
        assert.equal($input.val(), "1", "input value is correct");
    });
});

module("value", moduleConfig, () => {
    test("should not throw an error when the value is \"null\" or \"undefine\"", assert => {
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

    test("should have correct initialized selection", assert => {
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

    test("repaint of widget shouldn't reset value option", assert => {
        const items = [{ text: "0" }, { text: "1" }];
        const $radioGroup = $("#radioGroup").dxRadioGroup({
                items: items,
                value: items[1]
            }),
            radioGroup = $radioGroup.dxRadioGroup("instance");

        radioGroup.repaint();
        assert.strictEqual(radioGroup.option("value"), items[1]);
    });

    test("value is changed on item click", assert => {
        assert.expect(1);

        let value;
        const $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            onValueChanged: function(e) {
                value = e.value;
            }
        });
        const radioGroup = $radioGroup.dxRadioGroup("instance");

        $(radioGroup.itemElements()).first().trigger("dxclick");

        assert.equal(value, 1, "value changed");
    });

    test("onValueChanged option should get jQuery event as a parameter", assert => {
        let jQueryEvent,
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
});

module("valueExpr", moduleConfig, () => {
    test("value should be correct if valueExpr is a string", assert => {
        const items = [
            { number: 1, caption: "one" },
            { number: 2, caption: "two" }
        ];

        const radioGroup = $("#radioGroup")
            .dxRadioGroup({
                dataSource: items,
                valueExpr: "number",
                value: 2,
                itemTemplate: function(item) {
                    return item.caption;
                }
            })
            .dxRadioGroup("instance");

        let $secondItem = $(radioGroup.itemElements()).eq(1);

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
});

module("widget sizing render", moduleConfig, () => {
    test("change width", assert => {
        const $element = $("#widget").dxRadioGroup({
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
});

module("keyboard navigation", moduleConfig, () => {
    test("keys tests", assert => {
        assert.expect(3);

        const items = [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }],
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

    test("control keys should be prevented", assert => {
        const items = [{ text: "0" }, { text: "1" }];
        const $element = $("#widget").dxRadioGroup({
            focusStateEnabled: true,
            items: items
        });
        const keyboard = keyboardMock($element);
        let isDefaultPrevented = false;
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

    test("keyboard navigation does not work in disabled widget", assert => {
        const items = [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }],
            $element = $("#widget").dxRadioGroup({
                focusStateEnabled: true,
                items: items,
                disabled: true
            });

        assert.ok($element.attr('tabindex') === undefined, "collection of radio group has not tabindex");
    });

    test("radio group items should not have tabIndex(T674238)", assert => {
        const items = [{ text: "0" }, { text: "1" }],
            $element = $("#widget").dxRadioGroup({
                focusStateEnabled: true,
                items: items
            });

        const $items = $element.find("." + RADIO_BUTTON_CLASS);
        assert.ok($items.eq(0).attr('tabindex') === undefined, "items of radio group hasn't tabindex");
        assert.ok($items.eq(1).attr('tabindex') === undefined, "items of radio group hasn't tabindex");
    });
});

module("focus policy", moduleConfig, () => {
    test("focused-state set up on radio group after focusing on any item", assert => {
        assert.expect(2);

        const $radioGroup = $("#radioGroup").dxRadioGroup({
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

    test("radioGroup item has not dx-state-focused class after radioGroup lose focus", assert => {
        assert.expect(2);

        const $radioGroup = $("#radioGroup").dxRadioGroup({
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

    test("radioGroup item has not dx-state-focused class after radioGroup lose focus", assert => {
        assert.expect(2);

        const $radioGroup = $("#radioGroup").dxRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true
            }),
            radioGroup = $radioGroup.dxRadioGroup("instance"),
            $firstRButton = $(radioGroup.itemElements()).first();

        assert.ok(!$firstRButton.hasClass(FOCUSED_CLASS));

        $radioGroup.focusin();

        assert.ok($firstRButton.hasClass(FOCUSED_CLASS), "radioGroup item is not focused");
    });

    test("radioGroup element should get 'dx-state-focused' class", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true
        });

        $radioGroup.focusin();

        assert.ok($radioGroup.hasClass(FOCUSED_CLASS), "element got 'dx-state-focused' class");
    });

    test("option 'accessKey' has effect", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true,
                accessKey: "k"
            }),
            instance = $radioGroup.dxRadioGroup("instance");

        assert.equal($radioGroup.attr("accessKey"), "k", "access key is correct");

        instance.option("accessKey", "o");
        assert.equal($radioGroup.attr("accessKey"), "o", "access key is correct after change");
    });

    test("option 'tabIndex' has effect", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true,
                tabIndex: 4
            }),
            instance = $radioGroup.dxRadioGroup("instance");

        assert.equal($radioGroup.attr("tabIndex"), 4, "tab index is correct");
        instance.option("tabIndex", 7);
        assert.equal($radioGroup.attr("tabIndex"), 7, "tab index is correct after change");
    });

    testInActiveWindow("the 'focus()' method should set focused class to widget", assert => {
        const $radioGroup = $("#radioGroup").dxRadioGroup({
            focusStateEnabled: true
        });
        const instance = $radioGroup.dxRadioGroup("instance");

        instance.focus();
        assert.ok($radioGroup.hasClass("dx-state-focused"), "widget got focused class");
    });
});
