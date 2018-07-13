"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    SelectBox = require("ui/select_box"),
    devices = require("core/devices"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    CustomStore = require("data/custom_store"),
    fx = require("animation/fx"),
    isRenderer = require("core/utils/type").isRenderer,
    errors = require("core/errors"),
    config = require("core/config");

require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="selectBox"></div>\
            \
            <div id="selectBoxWithItemTemplate">\
                <div data-options="dxTemplate: { name: \'item\'}">\
                    itemTemplate\
                </div>\
            </div>\
            \
            <div id="selectBoxFieldTemplateWithoutTextBox">\
                <div data-options="dxTemplate: { name: \'field\' }">\
                    <span>test</span>\
                </div>\
            </div>\
\
            <div id="selectBoxFieldTemplate">\
                <div data-options="dxTemplate: { name: \'field\' }">\
                    fieldTemplate\
                </div>\
                <div data-options="dxTemplate: { name: \'item\'}">\
                    itemTemplate\
                </div>\
            </div>\
            \
            <div style="position: fixed; right: 0; bottom: 0; width: 500px; height: 500px;">\
                <div id="selectBoxWithoutScroll"></div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var POPUP_CLASS = "dx-selectbox-popup",
    POPUP_CONTENT_CLASS = "dx-popup-content",
    LIST_ITEM_CLASS = "dx-list-item",
    LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
    DX_DROP_DOWN_BUTTON = "dx-dropdowneditor-button",
    STATE_FOCUSED_CLASS = "dx-state-focused",
    TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container",
    PLACEHOLDER_CLASS = "dx-placeholder",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";

var KEY_DOWN = 40,
    KEY_ENTER = 13;

var TIME_TO_WAIT = 500;

var toSelector = function(className) {
    return "." + className;
};

var moduleSetup = {
    beforeEach: function() {
        SelectBox.defaultOptions({ options: { deferRendering: false } });
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module("rendering with css");

QUnit.test("Right width of popup", function(assert) {
    var $element,
        instance,
        $popup;

    $element = $("#selectBox").dxSelectBox({ width: 100 });
    instance = $element.dxSelectBox("instance");
    instance.open();
    $popup = $(instance._popup.$element());

    assert.ok($popup.hasClass(POPUP_CLASS));

    assert.equal(instance._popup.option("width"), 100 + instance.option("popupWidthExtension"));
});


QUnit.module("hidden input", moduleSetup);

QUnit.test("the hidden input should get correct value on widget value change", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [1, 2, 3],
            value: 2
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find("input[type='hidden']");

    instance.option("value", 1);
    assert.equal($input.val(), "1", "input value is correct");
});

QUnit.test("the hidden input should get correct values if async data source is used", function(assert) {
    var data = [0, 1, 2, 3, 4],
        initialValue = 2,
        newValue = 4,
        timeout = 100,
        store = new CustomStore({
            load: function() {
                var d = $.Deferred();
                setTimeout(function() {
                    d.resolve(data);
                }, timeout);
                return d.promise();
            },
            byKey: function(key) {
                var d = $.Deferred();
                setTimeout(function() {
                    d.resolve(key);
                }, timeout);
                return d.promise();
            }
        }),
        $element = $("#selectBox").dxSelectBox({
            dataSource: store,
            value: initialValue,
            valueExpr: "id",
            displayExpr: "name"
        }),
        instance = $element.dxSelectBox("instance");

    this.clock.tick(timeout);

    assert.equal($element.find("input[type='hidden']").val(), initialValue, "first rendered option value is correct");

    instance.option("value", newValue);
    this.clock.tick(timeout);
    assert.equal($element.find("input[type='hidden']").val(), newValue, "first rendered option value is correct");
});


QUnit.module("functionality", moduleSetup);

QUnit.test("value can be set to 'null'", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: ["first", "second", "third"],
            value: "first",
            placeholder: "test"
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.ok(instance.option("value") === "first", "value set correct");
    assert.ok($input.val() === "first", "value displayed correct");

    instance.option("value", null);
    assert.ok(instance.option("value") === null, "value set to 'null'");

    instance.option("value", "second");
    assert.ok(instance.option("value") === "second", "new value set correct");
    assert.ok($input.val() === "second", "new value displayed correct");
});

QUnit.test("selectBox doesn't select item with value type is mismatch", function(assert) {
    var dataSource = [{ ID: 1 }, { ID: 2 }, { ID: 3 }];

    $("#selectBox").dxSelectBox({
        dataSource: {
            load: function(loadOptions) {
                return dataSource;
            },
            byKey: function(i) {
                return $.grep(dataSource, function(item) {
                    return item.ID === i;
                })[0];
            }
        },
        valueExpr: 'ID',
        value: "1"
    });

    assert.notEqual($("#selectBox").dxSelectBox("option", "selectedItem"), dataSource[0], "item was not selected");
});

QUnit.test("click on list item sets value", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: ["first", "second", "third"] }),
        instance = $element.dxSelectBox("instance"),
        $list = $element.find(".dx-list");

    assert.ok(!instance.option("value"));

    this.clock.tick(TIME_TO_WAIT);
    assert.ok($element.find(toSelector(LIST_ITEM_CLASS)).length === 3, "found 3 items");

    $($element.find(toSelector(LIST_ITEM_CLASS)).first()).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    assert.strictEqual(instance.option("value"), "first", "widget value was set");

    assert.ok($list.is(":hidden"), "when click on lists item, list is hidden");
});

QUnit.test("click on list item set 'selected' class", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: ["first", "second", "third"]
        }),
        $list = $element.find(".dx-list");

    this.clock.tick(TIME_TO_WAIT);
    $($list.find(toSelector(LIST_ITEM_CLASS)).eq(1)).trigger("dxclick");

    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), "selected item has selected class, after click on it");

    $($list.find(toSelector(LIST_ITEM_CLASS)).eq(2)).trigger("dxclick");

    assert.ok(!$list.find(toSelector(LIST_ITEM_CLASS)).eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), "previously selected item has no selected class, after click on other");
    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(2).hasClass(LIST_ITEM_SELECTED_CLASS), "selected item has selected class, after click on it");
});

QUnit.test("changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    var selectBox = $("#selectBox").dxSelectBox({ items: ["first", "second", "third"], onValueChanged: function() { assert.ok(true); } }).dxSelectBox("instance");
    selectBox.option("value", "first");
});

QUnit.test("changing the 'value' option must set 'selected' class on correct item", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: ["first", "second", "third"],
            value: "first"
        }),
        instance = $element.dxSelectBox("instance"),
        $list = $element.find(".dx-list");

    this.clock.tick(TIME_TO_WAIT);

    assert.ok(!$list.find(toSelector(LIST_ITEM_CLASS)).eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), "second item has no selected class");
    instance.option("value", "second");

    assert.ok(!$list.find(toSelector(LIST_ITEM_CLASS)).eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), "first item has no selected class, after change value");
    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), "second item has selected class, after change value on it");
});

QUnit.test("click on 0 in list [\"\", 0] sets value 0", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: ["", 0], value: "" }),
        instance = $element.dxSelectBox("instance");

    this.clock.tick(TIME_TO_WAIT);

    $($element.find(toSelector(LIST_ITEM_CLASS)).last()).trigger('dxclick');

    assert.strictEqual(instance.option("value"), 0, "click on list item, and its value replaces widget value");
});

QUnit.test("click on textbox toggle popup visibility", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2] }),
        $list = $element.find(".dx-list"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.ok($list.is(':hidden'), "when start list is hidden");
    pointerMock($input).start().click();
    assert.ok($list.is(':visible'), "when we click on input - show list");
    pointerMock($input).start().click();
    assert.ok($list.is(':hidden'), "when we click on input once again - hide list");
});

QUnit.test("click on arrow toggle popup visibility", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2] }),
        popup = $element.dxSelectBox("instance")._popup,
        $arrow = $element.find(".dx-dropdowneditor-icon");

    assert.notOk(popup.option("visible"), "when start popup is hidden");

    $arrow.trigger("dxclick");
    assert.ok(popup.option("visible"), "when we click on arrow - show popup");

    $arrow.trigger("dxclick");
    assert.notOk(popup.option("visible"), "when we click on arrow once again - hide popup");
});

QUnit.test("click on disabled selectbox doesn't toggle popup visibility", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2], disabled: true }),
        $list = $element.find(".dx-dropdowneditor-overlay"),
        $textBox = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.ok($list.is(':hidden'), "when start list is hidden");

    $($textBox).trigger("dxclick");
    assert.ok($list.is(':hidden'), "when we click on input - list is still hidden");
});

QUnit.test("click on disabled selectbox arrow doesn't toggle popup visibility", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2], disabled: true }),
        $list = $element.find(".dx-dropdowneditor-overlay"),
        $arrow = $element.find(toSelector(TEXTEDITOR_BUTTONS_CONTAINER_CLASS));

    assert.ok($list.is(':hidden'), "when start list is hidden");

    $($arrow).trigger("dxclick");
    assert.ok($list.is(':hidden'), "when we click on arrow - list is still hidden");
});

QUnit.test("click on readOnly selectbox doesn't toggle popup visibility", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2], readOnly: true }),
        $list = $element.find(".dx-dropdowneditor-overlay"),
        $textBox = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.ok($list.is(':hidden'), "when start list is hidden");

    $($textBox).trigger("dxclick");
    assert.ok($list.is(':hidden'), "when we click on input - list is still hidden");
});

QUnit.test("click on readOnly selectbox arrow doesn't toggle popup visibility", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2], readOnly: true }),
        $list = $element.find(".dx-dropdowneditor-overlay"),
        $arrow = $element.find(toSelector(TEXTEDITOR_BUTTONS_CONTAINER_CLASS));

    assert.ok($list.is(':hidden'), "when start list is hidden");

    $($arrow).trigger("dxclick");
    assert.ok($list.is(':hidden'), "when we click on arrow - list is still hidden");
});

QUnit.test("select box should not hide popup after focusout", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2] }),
        $list = $element.find(".dx-list"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.ok($list.is(':hidden'), "when start list is hidden");

    $($input).trigger("dxclick");
    assert.ok($list.is(':visible'), "when we click on input - show list");

    $($input).trigger("focusout");
    assert.ok($list.is(':visible'), "when we click on input once again - hide list");
});

QUnit.test("do not show tooltip if it is not enabled", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: ["very very very long value", 2, 3, 4],
        value: "very very very long value",
        width: 40
    });

    assert.strictEqual($element.attr("title"), undefined, "tooltip should not be added");
});

QUnit.test("show hint when tooltip is not enabled", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: ["very very very long value", 2, 3, 4],
        value: "very very very long value",
        hint: "some text",
        width: 40
    });

    assert.strictEqual($element.attr("title"), "some text", "hint correct");
});

QUnit.test("show tooltip when widget was created longer than values's width", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: ["very very very long value", 2, 3, 4],
        value: "very very very long value",
        tooltipEnabled: true,
        width: 40
    });

    assert.strictEqual($element.attr("title"), "very very very long value", "tooltip should be added");
});

QUnit.test("show tooltip for object item", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: [{ key: 1, value: "very very very long value" }],
        valueExpr: "key",
        displayExpr: "value",
        tooltipEnabled: true,
        value: 1,
        width: 40
    });

    assert.equal($element.prop("title"), "very very very long value", "tooltip shown display value");
});

QUnit.test("selectbox should not hide when selected item longer than first item", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["first", "longer than first"],
        value: "longer than first"
    });

    $($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS))).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($selectBox.dxSelectBox("option", "opened"), true, "selectbox is opened");
});

QUnit.testInActiveWindow("input focused after click on drop button", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "focus is not actual for mobile devices");
        return;
    }

    var $selectBox = $("#selectBox").dxSelectBox({});
    var $dropDownButton = $selectBox.find(toSelector(DX_DROP_DOWN_BUTTON));

    $($dropDownButton).trigger("dxclick");
    assert.ok($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)).is(":focus"), "input focused");
});

QUnit.test("dataSource loaded after create dxSelectBox", function(assert) {
    var timeout = 1000;
    var dataSource = new DataSource({
        load: function() {
            var deferred = $.Deferred();
            setTimeout(function() {
                deferred.resolve([1, 2]);
            }, timeout);

            return deferred.promise();
        }
    });

    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: dataSource,
        deferRendering: true
    });

    this.clock.tick(timeout);

    $selectBox.dxSelectBox("option", "opened", true);
    var listItems = $(toSelector(POPUP_CONTENT_CLASS) + " " + toSelector(LIST_ITEM_CLASS));

    assert.equal(listItems.length, 0, "items is not yet loaded");
});

QUnit.test("list item obtained focus only after press on control key", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $selectBox = $("#selectBox").dxSelectBox({
        items: [1, 2, 3],
        searchEnabled: true,
        searchTimeout: 0,
        opened: true,
        focusStateEnabled: true
    });
    var selectBox = $("#selectBox").dxSelectBox("instance");

    this.clock.tick(TIME_TO_WAIT);
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input).press("down");
    var $firstItemList = $(toSelector(LIST_ITEM_CLASS)).eq(0);
    assert.equal(isRenderer(selectBox._list.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
    assert.ok($firstItemList.hasClass(STATE_FOCUSED_CLASS), "first list item obtained focus");
});

QUnit.test("items is not changed after value changing when displayExpr is not set", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        items: [{ index: "1", text: "1" }, { index: "2", text: "2" }, { index: "3", text: "3" }],
        opened: true
    });

    this.clock.tick(TIME_TO_WAIT);

    var $listItems = $(toSelector(LIST_ITEM_CLASS));

    $($listItems.eq(0)).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    $($listItems.eq(1)).trigger("dxclick");

    assert.deepEqual($selectBox.dxSelectBox("option", "items"), [{ index: "1", text: "1" }, { index: "2", text: "2" }, { index: "3", text: "3" }]);
});

QUnit.test("dxSelectBox automatically scrolls to selected item on opening", function(assert) {
    var items = [];
    for(var i = 0; i <= 100; i++) {
        items.push(i);
    }

    var $selectBox = $("#selectBox").dxSelectBox({
        items: items,
        value: 100
    });

    this.clock.tick(TIME_TO_WAIT);

    $selectBox.dxSelectBox("option", "opened", true);

    var $popupContent = $(toSelector(POPUP_CONTENT_CLASS));
    var $selectedItem = $popupContent.find(toSelector(LIST_ITEM_SELECTED_CLASS));

    assert.ok($popupContent.offset().top + $popupContent.height() > $selectedItem.offset().top, "selected item is visible");
});

QUnit.test("dxSelectBox scrolls to the top when paging is enabled and selectbox is editable and item is out of page", function(assert) {
    var items = [];
    for(var i = 0; i <= 200; i++) {
        items.push(i);
    }

    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        dataSource: {
            paginate: true,
            store: items,
            pageSize: 100
        },
        value: 101
    });

    this.clock.tick(TIME_TO_WAIT);

    $selectBox.dxSelectBox("option", "opened", true);

    var $popupContent = $(toSelector(POPUP_CONTENT_CLASS));
    var $firstItem = $popupContent.find(toSelector(LIST_ITEM_CLASS)).eq(0);

    assert.ok($popupContent.offset().top <= $firstItem.offset().top, "first item is visible");
});

QUnit.test("dxSelectBox scroll to selected item when paging is enabled and selectbox is editable and item is not out of page", function(assert) {
    var items = [];
    for(var i = 0; i <= 200; i++) {
        items.push(i);
    }

    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        dataSource: {
            paginate: true,
            store: items,
            pageSize: 100
        },
        value: 99
    });

    this.clock.tick(TIME_TO_WAIT);

    $selectBox.dxSelectBox("option", "opened", true);

    var $popupContent = $(toSelector(POPUP_CONTENT_CLASS)),
        $selectedItem = $popupContent.find(toSelector(LIST_ITEM_CLASS)).eq(98),
        itemBottom = $selectedItem.offset().top + $selectedItem.outerHeight(),
        contentBottom = $popupContent.offset().top + $popupContent.outerHeight();

    assert.ok(itemBottom <= contentBottom, "selected item is visible");
});

QUnit.test("selectedItem is readonly option", function(assert) {
    var items = [
        "one",
        "two"
    ];

    var $selectBox = $("#selectBox");

    var selectBox = $selectBox.dxSelectBox({
        items: items,
        opened: true,
        selectedItem: items[0]
    }).dxSelectBox("instance");

    this.clock.tick();

    assert.equal($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "", "selected item");
    assert.strictEqual(selectBox.option("selectedItem"), null, "selected item");
});

QUnit.test("display value should rendered when value is 0", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        items: [{ key: 0, value: "zero" }],
        value: 0,
        displayExpr: "value",
        valueExpr: "key"
    });
    var displayValue = $selectBox.dxSelectBox("option", "displayValue");

    assert.equal(displayValue, "zero", "value is rendered correctly");
});

QUnit.test("selectBox should display value when item is 0 or boolean false", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            dataSource: [null, 0, true, false],
            displayExpr: function(value) {
                if(value === true) {
                    return "True";
                } else if(value === 0) {
                    return "Zero";
                } else if(value === false) {
                    return "False";
                } else {
                    return "None";
                }
            }
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    this.clock.tick(TIME_TO_WAIT);

    $($selectBox.find(toSelector(LIST_ITEM_CLASS) + ":eq(1)")).trigger("dxclick");
    assert.equal($input.val(), "Zero", "0 value is shown correctly");

    $($selectBox.find(toSelector(LIST_ITEM_CLASS) + ":eq(2)")).trigger("dxclick");
    assert.equal($input.val(), "True", "True value is shown correctly");

    $($selectBox.find(toSelector(LIST_ITEM_CLASS) + ":eq(3)")).trigger("dxclick");
    assert.equal($input.val(), "False", "False value is shown correctly");

    $($selectBox.find(toSelector(LIST_ITEM_CLASS) + ":eq(0)")).trigger("dxclick");
    assert.equal($input.val(), "None", "Null value is shown correctly");
});

QUnit.test("dxList has empty message", function(assert) {
    $("#selectBox").dxSelectBox({
        deferRendering: false
    });

    var $list = $(".dx-list");

    assert.notEqual($list.dxList("option", "noDataText"), "", "list has noDataText");
});

QUnit.test("dxList should be have a customer's noDataText value after search", function(assert) {
    var simpleProducts = [],
        customersNoDataText = 'Customer string';

    var $selectBox = $("#selectBox").dxSelectBox({
        items: simpleProducts,
        searchEnabled: true,
        noDataText: customersNoDataText,
        opened: true,
        searchTimeout: 0
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard
        .type("2")
        .change();

    $selectBox.dxSelectBox("instance").option("opened", true);
    var noDataText = $(".dx-list .dx-empty-message").text();
    assert.equal(noDataText, customersNoDataText, "empty message is correct");
});

QUnit.test("dxList has not empty message", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["a", "b", "c"],
        searchEnabled: true,
        searchTimeout: 0,
        deferRendering: false
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("b");

    var $list = $(".dx-list");
    assert.equal($list.dxList("option", "noDataText"), "No data to display", "list has default noDataText");
});

QUnit.test("SelectBox should not load data twice on open", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        dataSource: [1, 2, 3, 4, 5],
        value: 2
    });

    var loadSpy = sinon.spy(DataSource.prototype, "load");
    try {
        $($selectBox.find(toSelector(DX_DROP_DOWN_BUTTON))).trigger("dxclick");

        assert.ok(!loadSpy.called, "data source load was not fired on open");
    } finally {
        loadSpy.restore();
    }
});

QUnit.test("selectbox should load first page after filtering reset", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        dataSource: {
            store: new CustomStore({
                load: function(options) {
                    var deferred = $.Deferred();
                    var result = [];

                    if(options.searchValue) {
                        return [options.searchValue];
                    }

                    for(var i = options.skip; i < options.skip + options.take; i++) {
                        result.push(i);
                    }

                    setTimeout(function() {
                        deferred.resolve(result);
                    }, TIME_TO_WAIT);

                    return deferred.promise();
                },
                byKey: function(key) {
                    return key;
                }
            }),
            pageSize: 2,
            paginate: true
        },
        opened: true,
        searchTimeout: 0
    });
    var instance = $selectBox.dxSelectBox("instance");
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("2");
    this.clock.tick(TIME_TO_WAIT);
    $(".dx-item").trigger("dxclick");
    $($input).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($.trim($(".dx-item").first().text()), "0", "filter was cleared after item selected");

    keyboard.press("backspace").type("3");
    this.clock.tick(TIME_TO_WAIT);
    keyboard.press("esc");
    this.clock.tick(TIME_TO_WAIT);
    $($input).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($.trim($(".dx-item").first().text()), "3", "filter was not cleared when no focusout and no item selection happened");

    instance.close();
    $input.focusout();
    this.clock.tick(TIME_TO_WAIT);
    $($input).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($.trim($(".dx-item").first().text()), "0", "filter was cleared when focusout even if item was not selected");
});

QUnit.testInActiveWindow("SelectBox drop down should not blink on open after setting value with the help of search", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        searchTimeout: 0,
        opened: true
    });
    var instance = $selectBox.dxSelectBox("instance");
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("4");
    $(".dx-item").trigger("dxclick");
    $($input).trigger("dxclick");

    assert.equal(instance.option("opened"), true, "selectbox is opened");
});

QUnit.test("the selected item should be focused after popup is opened", function(assert) {
    var items = [1, 2, 3],
        item = items[1],
        selectBox = $("#selectBox").dxSelectBox({
            items: items,
            value: item,
            opened: true,
            searchEnabled: true
        }).dxSelectBox("instance"),
        $list = $(selectBox._list.$element());

    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(1).hasClass(STATE_FOCUSED_CLASS), "the selected item is focused");

    $($list.find(toSelector(LIST_ITEM_CLASS)).eq(0)).trigger("dxclick");
    selectBox.open();

    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(0).hasClass(STATE_FOCUSED_CLASS), "the selected item is focused after popup is opened second time");
});

QUnit.test("no items should be focused if input value is changed", function(assert) {
    var items = ["aaa", "aa"],
        item = items[1],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            value: item,
            deferRender: false,
            searchEnabled: true,
            opened: true,
            searchTimeout: 0
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        $list = $(selectBox._list.$element());

    keyboardMock($input)
        .focus()
        .type("aa");

    $($selectBox.find(toSelector(DX_DROP_DOWN_BUTTON))).trigger("dxclick");

    assert.equal($list.find(toSelector(STATE_FOCUSED_CLASS)).length, 0, "no items are focused");
});


QUnit.module("widget options", moduleSetup);

QUnit.test("option onValueChanged", function(assert) {
    assert.expect(4);

    var count = 0;
    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            onValueChanged: function() {
                count++;
            }
        }),
        instance = $element.dxSelectBox("instance");

    this.clock.tick(TIME_TO_WAIT);
    assert.ok($element.find(toSelector(LIST_ITEM_CLASS)).length === 3, "find 3 items");

    $($element.find(toSelector(LIST_ITEM_CLASS)).first()).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal(count, 1);

    instance.option("value", 2);
    this.clock.tick(TIME_TO_WAIT);
    assert.equal(count, 2);

    instance.option("onValueChanged", function() {
        count += 2;
    });

    instance.option("value", 1);
    this.clock.tick(TIME_TO_WAIT);
    assert.equal(count, 4);
});

QUnit.test("options displayExpr, valueExpr", function(assert) {
    assert.expect(5);

    var items = [
        { number: 1, caption: "one" },
        { number: 2, caption: "two" }
    ];

    var $element = $("#selectBox")
        .dxSelectBox({
            items: items,
            valueExpr: "number",
            displayExpr: "caption"
        });

    var instance = $element.dxSelectBox("instance");

    this.clock.tick(TIME_TO_WAIT);
    assert.ok($element.find(toSelector(LIST_ITEM_CLASS)).length === 2);

    $($element.find(toSelector(LIST_ITEM_CLASS)).first()).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal(instance._input().val(), "one");
    assert.equal(instance.option("value"), 1);

    instance.option("displayExpr", "number");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal(instance.option("value"), "1");

    instance.option("valueExpr", "caption");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal(instance.option("value"), 1);
});

QUnit.test("options displayExpr, valueExpr as functions", function(assert) {
    assert.expect(3);

    var $element = $("#selectBox")
        .dxSelectBox({
            items: [1, 2],
            valueExpr: function(item) {
                return item * 2;
            },
            displayExpr: function(item) {
                return "number " + item;
            },
        });

    var instance = $element.dxSelectBox("instance");

    this.clock.tick(TIME_TO_WAIT);
    assert.ok($element.find(toSelector(LIST_ITEM_CLASS)).length === 2);

    $($element.find(toSelector(LIST_ITEM_CLASS)).first()).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal(instance._input().val(), "number 1");
    assert.equal(instance.option("value"), 2);

});

QUnit.test("option value", function(assert) {
    var items = [{ text: "txt1", value: 1 }, { text: "txt2", value: 2 }];

    var $element = $("#selectBox")
            .dxSelectBox({
                items: items,
                displayExpr: "text",
                valueExpr: "value",
                value: 2
            });

    var instance = $element.dxSelectBox("instance");

    assert.equal(instance._input().val(), "txt2");

    instance.option("value", 1);
    assert.equal(instance._input().val(), "txt1");

    instance.option("value", 2);
    assert.equal(instance._input().val(), "txt2");
});

QUnit.test("valueExpr change should clear displayValue", function(assert) {
    var $element = $("#selectBox")
        .dxSelectBox({
            items: [{ value: 1, text: "one" }, { value: 2, text: "two" }],
            displayExpr: "text",
            valueExpr: "value",
            value: 1
        });

    var instance = $element.dxSelectBox("instance");
    instance.option("valueExpr", "unknown");

    assert.equal(instance._input().val(), "", "display empty value");
    assert.equal(instance.option("displayValue"), null, "displayValue empty");
});

QUnit.test("option displayValue", function(assert) {
    var items = [{ text: "txt1", value: 1 }, { text: "txt2", value: 2 }];

    var $element = $("#selectBox")
            .dxSelectBox({
                items: items,
                displayExpr: "text",
                valueExpr: "value",
                value: 2
            });

    var instance = $element.dxSelectBox("instance");

    assert.equal(instance.option("displayValue"), "txt2");

    instance.option("value", 1);
    assert.equal(instance.option("displayValue"), "txt1");

    instance.option("value", 2);
    assert.equal(instance.option("displayValue"), "txt2");
});

QUnit.test("placeholder option change", function(assert) {
    var $element = $("#selectBox")
            .dxSelectBox({
                placeholder: "John Doe"
            }),
        instance = $element.dxSelectBox("instance");

    assert.equal($element.find(toSelector(PLACEHOLDER_CLASS)).attr("data-dx_placeholder"), "John Doe");

    instance.option("placeholder", "John Jr. Doe");
    assert.equal($element.find(toSelector(PLACEHOLDER_CLASS)).attr("data-dx_placeholder"), "John Jr. Doe");
});

QUnit.test("the 'fieldTemplate' function should be called only once on init and value change", function(assert) {
    var callCount = 0;
    var instance = $("#selectBoxWithItemTemplate").dxSelectBox({
        items: [1, 2],
        fieldTemplate: function(value, element) {
            assert.equal(isRenderer(element), !!config().useJQuery, "element is correct");

            callCount++;
            return $("<div>").dxTextBox();
        }
    }).dxSelectBox("instance");

    assert.equal(callCount, 1, "the 'fieldTemplate' called only once on init");

    callCount = 0;
    instance.option("value", 2);
    assert.equal(callCount, 1, "the 'fieldTemplate; called only one on value change");
});

QUnit.test("Field should be updated if fieldTemplate is used", function(assert) {
    var $element = $("#selectBoxFieldTemplate").dxSelectBox({
        dataSource: [
            { ID: 1, name: 'First' },
            { ID: 2, name: 'Second' },
            { ID: 3, name: 'Third' }
        ],
        fieldTemplate: function(selectedItem) {
            return $("<div id='myfield'>").dxTextBox({
                value: selectedItem ? selectedItem.ID + ' - ' + selectedItem.name : ''
            });
        },
        itemTemplate: function(itemData) {
            return $("<div class='item'>").text(
                itemData.ID + ' - ' + itemData.name
            );
        },
        valueExpr: "ID",
        searchEnabled: true,
        opened: true
    });

    $(toSelector(LIST_ITEM_CLASS)).eq(0).trigger("dxclick");

    var $input = $(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.equal($input.val(), "1 - First", "value is correct");

    $input.triggerHandler("focusout");

    assert.equal($(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "1 - First", "value is correct");

    var instance = $element.dxSelectBox("instance");
    instance.option("opened", true);

    $(toSelector(LIST_ITEM_CLASS)).eq(0).trigger("dxclick");

    assert.equal($(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "1 - First", "value is correct");

});

QUnit.test("Field should be updated if value was changed and fieldTemplate is used (T568546)", function(assert) {
    var $element = $("#selectBoxFieldTemplate").dxSelectBox({
        dataSource: [
            { name: 'First' },
            { name: 'Second' },
            { name: 'Third' }
        ],
        fieldTemplate: function(selectedItem) {
            return $("<div id='myfield'>").dxTextBox({
                value: selectedItem && selectedItem.name
            });
        },
        value: "First",
        valueExpr: "name",
        opened: true
    });

    $(toSelector(LIST_ITEM_CLASS)).eq(1).trigger("dxclick");

    var $input = $(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.equal($input.val(), "Second", "value is correct");

    var instance = $element.dxSelectBox("instance");

    instance.option("value", 'First');

    assert.equal($(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "First", "value is correct");
});

QUnit.test("dropdown button should not be hidden after the focusout when fieldTemplate and searchEnabled is used", function(assert) {
    var $element = $("#selectBoxFieldTemplate").dxSelectBox({
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchValue: true,
            searchTimeout: 0,
            fieldTemplate: function(value) {
                return $("<div id='myfield'>").dxTextBox({
                    value: "test"
                });
            },
            searchEnabled: true
        }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focus();
    $input.triggerHandler("focusout");

    assert.equal($element.find(toSelector(DX_DROP_DOWN_BUTTON)).length, 1, "dropdown button was not hidden");
});

QUnit.test("item template", function(assert) {
    var $selectBox = $("#selectBoxWithItemTemplate").dxSelectBox({
        items: [1]
    });
    this.clock.tick(TIME_TO_WAIT);

    var $container = $selectBox.find(".dx-scrollview-content");
    assert.equal($.trim($container.text()), "itemTemplate", "items rendered with item template");
});

QUnit.test("selectbox loads first page after first opening when paging is enabled", function(assert) {
    var items = [];
    for(var i = 0; i < 30; i++) {
        items.push(i);
    }

    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: {
            store: new ArrayStore(items),
            paginate: true
        },
        deferRendering: true
    });

    this.clock.tick(TIME_TO_WAIT);

    $($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS))).trigger("dxclick");

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($.trim($(toSelector(LIST_ITEM_CLASS)).first().text()), "0", "first item is loaded");
});

QUnit.test("change displayCustomValue", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        items: [1, 2, 3],
        displayCustomValue: true,
        value: "test",
        placeholder: ""
    });
    this.clock.tick(TIME_TO_WAIT);
    $selectBox.dxSelectBox("option", "value", "test2");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "test2", "custom value displayed after value changed");
});

QUnit.test("displayCustomValue should not reset selected value on dataSource change", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: [1, 2, 3],
        displayCustomValue: true,
        value: 1
    });

    $selectBox.dxSelectBox("option", "dataSource", [4, 5, 6]);

    assert.equal($selectBox.dxSelectBox("option", "value"), 1, "custom value displayed after dataSource change");
});

QUnit.test("value should reset", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: [1, 2, 3],
        value: 1
    });
    this.clock.tick(TIME_TO_WAIT);

    $selectBox.dxSelectBox("option", "value", null);

    this.clock.tick(TIME_TO_WAIT);

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    assert.equal($input.val(), "", "input value is reset");
});

QUnit.test("value changed runtime should not be displayed when it is not in dataSource", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: [1, 2, 3],
        value: 1
    });

    this.clock.tick(TIME_TO_WAIT);
    $selectBox.dxSelectBox("option", "value", "asdasda");

    this.clock.tick(TIME_TO_WAIT);

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    assert.equal($input.val(), "", "input value is reset");
});

QUnit.test("onValueChanged option should get jQuery event as a parameter", function(assert) {
    var jQueryEvent,
        $selectBox = $("#selectBox").dxSelectBox({
            dataSource: [1, 2, 3],
            value: 1,
            opened: true,
            onValueChanged: function(e) {
                jQueryEvent = e.event;
            }
        }),
        selectBox = $selectBox.dxSelectBox("instance");

    var items = $(toSelector(LIST_ITEM_CLASS));
    items.eq(1).trigger("dxclick");
    assert.ok(jQueryEvent, "jQuery event is defined when click used");

    selectBox.option("value", 3);
    assert.notOk(jQueryEvent, "jQuery event is not defined when api used");
});

QUnit.testInActiveWindow("it should be possible to clear the value via keyboard on focusout by default", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [1, 2, 3],
            searchEnabled: true,
            value: 1
        }),
        element = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.trigger("focusin");
    $input.val("");
    $input.trigger("blur");

    assert.equal(element.option("value"), null, "value was changed");
    assert.equal($input.val(), "", "input text has been cleared");
});

QUnit.testInActiveWindow("allowClearing option on init", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [1, 2, 3],
            searchEnabled: true,
            allowClearing: false,
            value: 1
        }),
        element = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focusin();
    $input.val("");
    $input.blur();

    assert.equal(element.option("value"), 1, "value was not changed");
    assert.equal($input.val(), "1", "input text has been restored");
});

QUnit.testInActiveWindow("allowClearing option changing", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [1, 2, 3],
            searchEnabled: true,
            allowClearing: true,
            value: 1
        }),
        element = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    element.option("allowClearing", false);

    $input.focusin();
    $input.val("");
    $input.blur();

    assert.equal(element.option("value"), 1, "value was not be changed");
    assert.equal($input.val(), "1", "input text has been restored");
});


QUnit.module("clearButton", moduleSetup);

QUnit.test("'clear' button click should not open selectbox", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: [1, 2, 3],
        showClearButton: true,
        value: 1
    });

    this.clock.tick(TIME_TO_WAIT);
    pointerMock($element.find(".dx-clear-button-area")).click();
    assert.equal($element.dxSelectBox("option", "opened"), false, "selectbox is closed after click on clear button");
});

QUnit.test("'clear' button should clear value when items is object and searchEnabled is true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        items: [{ key: 1, value: "one" }],
        valueExpr: "key",
        displayExpr: "value",
        value: 1,
        showClearButton: true,
        searchEnabled: true
    });

    var $clearButton = $selectBox.find(".dx-clear-button-area");

    $($clearButton).trigger("dxclick");

    assert.equal($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "", "text is cleared");
});

QUnit.test("'clear' button should save valueChange event instance", function(assert) {
    var valueChangedHandler = sinon.spy(),
        $selectBox = $("#selectBox").dxSelectBox({
            items: [1],
            value: 1,
            onValueChanged: valueChangedHandler,
            showClearButton: true
        }),
        $clearButton = $selectBox.find(".dx-clear-button-area");

    $($clearButton).trigger("dxclick");

    assert.equal(valueChangedHandler.callCount, 1, "valueChangeEventHandler has been called once");
    assert.equal(valueChangedHandler.getCall(0).args[0].event.type, "dxclick", "event is correct");
});

QUnit.test("selectedItem should be reset on 'clear' button", function(assert) {
    var $selectBox = $("#selectBox");

    var selectBox = $selectBox.dxSelectBox({
        items: [
            { key: 1, value: "one" }
        ],
        showClearButton: true,
        valueExpr: "key",
        value: 1
    }).dxSelectBox("instance");

    this.clock.tick();

    pointerMock($selectBox.find(".dx-clear-button-area")).click();

    this.clock.tick();

    assert.equal($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)).val(), "", "text field is cleared");
    assert.strictEqual(selectBox.option("value"), null, "value is null");
    assert.strictEqual(selectBox.option("selectedItem"), null, "selected item");
});

QUnit.test("'clear' button should reset selectedValue if 'acceptCustomValue' is set to true", function(assert) {
    var data = [{ id: '1', text: 'text 1' }, { id: '2', text: 'text 2' }, { id: '3', text: 'text 3' }];
    var $selectBox = $("#selectBox");

    var selectBox = $selectBox.dxSelectBox({
        dataSource: data,
        displayExpr: "text",
        valueExpr: "id",
        value: '',
        showClearButton: true,
        acceptCustomValue: true,
        opened: true
    }).dxSelectBox("instance");

    var items = $(toSelector(LIST_ITEM_CLASS));
    items.eq(1).trigger("dxclick");

    var $clearButton = $(".dx-clear-button-area");
    $($clearButton).trigger("dxclick");

    assert.equal(selectBox.option("value"), null, "value is reset after click on 'clear' button");
    assert.equal(selectBox.option("text"), undefined, "text is reset after click on 'clear' button");

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.equal($input.val(), '', "input is empty");
});


QUnit.module("showSelectionControls", moduleSetup);

QUnit.test("showSelectionControls is true", function(assert) {
    $("#selectBox").dxSelectBox({
        items: [1],
        opened: true,
        showSelectionControls: true
    });

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(".dx-radiobutton").length, 1, "checkbox added");
});

QUnit.test("click on item changes value", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        items: [1, 2],
        opened: true,
        showSelectionControls: true
    });

    this.clock.tick(TIME_TO_WAIT);

    pointerMock($(toSelector(LIST_ITEM_CLASS)).eq(1))
        .start()
        .click();

    assert.equal($selectBox.dxSelectBox("option", "value"), 2, "value changed");
});


QUnit.module("editing", moduleSetup);

QUnit.test("readOnly option with searchEnabled", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            items: ["item1", "item2", "text3"],
            searchEnabled: true,
            value: null
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $list = $selectBox.find(".dx-list");

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    assert.equal($input.prop("readonly"), false, "input is readonly");

    selectBox.option("readOnly", true);

    assert.equal($input.prop("readonly"), true, "input is readonly");

    keyboardMock($input).type("it");
    this.clock.tick(TIME_TO_WAIT);
    assert.ok($list.is(":hidden"), "list should not appear in readonly state (T265362)");
});

QUnit.test("readOnly option with acceptCustomValue", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            items: ["item1", "item2", "text3"],
            acceptCustomValue: true,
            value: null
        }),
        selectBox = $selectBox.dxSelectBox("instance");

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    assert.equal($input.prop("readonly"), false, "input is readonly");

    selectBox.option("readOnly", true);

    assert.equal($input.prop("readonly"), true, "input is readonly");
});

QUnit.test("keyboardNavigation for readOnly widget", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            items: ["item1", "item2", "text3"],
            value: "item1"
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    selectBox.option("readOnly", true);
    keyboardMock($input).keyDown("down");

    assert.equal(selectBox.option("value"), "item1", "value was not changed");
});

QUnit.test("searchEnabled", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        items: ["item1", "item2", "text3"],
        opened: true,
        searchTimeout: 0,
        value: null
    });

    this.clock.tick(TIME_TO_WAIT);

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    keyboardMock($input).type("it");

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(toSelector(LIST_ITEM_CLASS)).length, 2, "items is filtered");
    assert.equal($selectBox.dxSelectBox("option", "value"), null, "value was not set");
});

QUnit.testInActiveWindow("input value is reset on focusOut when searchEnabled is true and acceptCustomValue is false", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        acceptCustomValue: false,
        items: ["item1", "item2"],
        value: "item1",
        searchTimeout: 0
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    keyboardMock($input).type("test");

    $($input).on("focusout", function() {
        assert.equal($input.val(), "item1", "value was reset");
    });

    $input.triggerHandler("focusout");
});

QUnit.testInActiveWindow("input value is reset on pressing enter key when searchEnabled is true and acceptCustomValue is false", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        acceptCustomValue: false,
        items: ["item1", "item2"],
        searchTimeout: 0,
        value: "item2",
        opened: true
    });

    var $listItem = $(toSelector(LIST_ITEM_CLASS)).eq(0).trigger("dxclick");
    $selectBox.dxSelectBox("instance")._list._setFocusedItem($listItem); // TODO: set focused item workaround, improve it if aware how better

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("test");
    keyboard.keyDown("enter");

    $($input).on("focusout", function() {
        assert.equal($input.val(), "item1", "value was reset");
    });

    $input.triggerHandler("focusout");
});

QUnit.test("Enter key press prevent default when popup is opened or acceptCustomValue is true", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            value: 1,
            focusStateEnabled: true,
            opened: true
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        prevented = 0;

    $($element).on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    keyboard.keyDown("enter");
    assert.equal(prevented, 1, "defaults prevented on enter");

    instance.option("opened", false);
    keyboard.keyDown("enter");
    assert.equal(prevented, 1, "enter was not prevented when popup is closed");

    prevented = 0;
    instance.option("opened", false);
    instance.option("acceptCustomValue", true);
    keyboard = keyboardMock($element.find(toSelector(TEXTEDITOR_INPUT_CLASS)));
    keyboard.keyDown("enter");

    assert.equal(prevented, 1, "defaults prevented on enter key when acceptCustomValue is true");
});

QUnit.test("list should not be rendered on each open", function(assert) {
    var dataSourceLoadedCount = 0;
    var $selectBox = $("#selectBox").dxSelectBox({
            dataSource: new CustomStore({
                load: function() {
                    dataSourceLoadedCount++;
                    return [1, 2, 3, 4, 5];
                }
            }),
            deferRendering: true,
            searchEnabled: true
        }),
        instance = $selectBox.dxSelectBox("instance");

    $($selectBox.find(toSelector(DX_DROP_DOWN_BUTTON))).trigger("dxclick");
    assert.equal(dataSourceLoadedCount, 1, "content ready fired when content is rendered");

    instance.close();
    $($selectBox.find(toSelector(DX_DROP_DOWN_BUTTON))).trigger("dxclick");

    assert.equal(dataSourceLoadedCount, 1, "content ready not fired when reopen dropdown");
});

QUnit.test("object value is restored after field focusout", function(assert) {
    var dataSource = [{ key: 1, text: "one" }];
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        acceptCustomValue: false,
        searchTimeout: 0,
        dataSource: dataSource,
        displayExpr: "text",
        valueExpr: "this",
        value: dataSource[0]
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("test");
    keyboard.keyDown("enter");

    $($input).on("focusout", function() {
        assert.equal($input.val(), "one", "value restored");
    });

    $input.triggerHandler("focusout");
});

QUnit.testInActiveWindow("input value should be restored on focusout if clearing is manually prevented", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        items: [1, 2],
        onValueChanged: function(e) {
            if(e.value === null) {
                e.component.option("value", e.previousValue);
            }
        },
        value: 1
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focus();
    $input.val("");
    $input.triggerHandler("focusout");

    $input.focus();
    $input.triggerHandler("focusout");

    assert.equal($input.val(), "1", "value have been restored");

    var instance = $selectBox.dxSelectBox("instance");
    assert.equal(instance.option("selectedItem"), 1, "selectedItem have been restored");
    assert.equal(instance.option("value"), 1, "value have been restored");
});

QUnit.test("byKey should not be called on focusout if text was not changed", function(assert) {
    var byKeyMock = sinon.stub().returnsArg(0),
        loadMock = sinon.stub().returns(["Item 1", "Item 2", "Item 3"]),
        $element = $("#selectBox").dxSelectBox({
            deferRendering: true,
            dataSource: {
                load: loadMock,
                byKey: byKeyMock
            },
            value: "Item 2"
        }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    assert.equal(loadMock.callCount, 0, "load should not be called on init if defer rendering is true");
    assert.equal(byKeyMock.callCount, 1, "bykey should be called on init if value is specified");

    $input.trigger("focusout");

    assert.equal(byKeyMock.callCount, 1, "byKey should not be called after input text restoring");
});

QUnit.test("acceptCustomValue", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        items: ["item1", "item2", "text3"],
        opened: true,
        searchEnabled: false,
        searchTimeout: 0,
        value: null
    });

    this.clock.tick(TIME_TO_WAIT);

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    keyboardMock($input).type("it").change();

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(toSelector(LIST_ITEM_CLASS)).length, 3, "items is filtered");
    assert.equal($selectBox.dxSelectBox("option", "value"), "it", "value was set");
});

QUnit.test("set existing item is succeeded value when acceptCustomValue is true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        searchEnabled: false,
        searchTimeout: 0,
        placeholder: "",
        dataSource: [1, 2],
        displayExpr: function(value) {
            return value * 10;
        }
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.val("");
    keyboardMock($input).type("2").change();

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($input.val(), "20", "value was set");
});

QUnit.test("set non existing item is succeeded value when acceptCustomValue is true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        searchEnabled: false,
        searchTimeout: 0,
        dataSource: [1, 2],
        placeholder: ""
    });
    var selectBox = $selectBox.dxSelectBox("instance");

    selectBox.option("value", 3);

    assert.equal(selectBox.option("displayValue"), "3", "value was set");
});

QUnit.test("selectionChanged should not fire if selectedItem was not changed", function(assert) {
    var selectionChangedHandler = sinon.spy(),
        items = [{ name: "item1" }, { name: "item2" }],
        $element = $("#selectBox").dxSelectBox({
            dataSource: items,
            value: items[0],
            onSelectionChanged: selectionChangedHandler,
            displayExpr: "name"
        }),
        instance = $element.dxSelectBox('instance');

    assert.strictEqual(instance.option("selectedItem"), items[0], "selectedItem is correct on init");

    instance.option("selectedItem", items[0]);
    assert.strictEqual(instance.option("selectedItem"), items[0], "selectedItem was not changed");
    assert.equal(selectionChangedHandler.callCount, 1, "selectionChanged should not fire twice");
});

QUnit.test("selectionChanged should not fire if selectedItem was not changed and displayValue is a number", function(assert) {
    var selectionChangedHandler = sinon.spy(),
        $element = $("#selectBox").dxSelectBox({
            dataSource: {
                load: function() {
                    return [{ id: 1, text: 1 }];
                },

                byKey: function(key) {
                    return { id: key, text: key };
                }
            },
            onSelectionChanged: selectionChangedHandler,
            valueExpr: "id",
            displayExpr: "text",
            opened: true,
            value: 1
        }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focusout();

    assert.equal(selectionChangedHandler.callCount, 1, "selectionChanged does not rise twice");
});


QUnit.test("set non existing item is not reset after dataSource changing", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        searchEnabled: false,
        searchTimeout: 0,
        dataSource: [1, 2],
        placeholder: ""
    });
    var selectBox = $selectBox.dxSelectBox("instance");

    selectBox.option("value", 3);
    selectBox.option("dataSource", [4]);

    assert.equal(selectBox.option("displayValue"), "3", "value was not reset");
});

QUnit.test("set non existing item is succeeded value when acceptCustomValue is true and displayExpr is set", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        searchEnabled: false,
        searchTimeout: 0,
        dataSource: [{ value: 1, text: "one" }, { value: 2, text: "two" }],
        placeholder: "",
        displayExpr: "text"
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input).type("three");

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($input.val(), "three", "value was set");
});

QUnit.test("drop button is not rendered after input blur", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        acceptCustomValue: false,
        items: [1, 2]
    });

    var $dropDownButton = $selectBox.find(toSelector(DX_DROP_DOWN_BUTTON));
    $dropDownButton.addClass("test");

    $($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS))).trigger("blur");

    assert.ok($selectBox.find(toSelector(DX_DROP_DOWN_BUTTON)).hasClass("test"), "button is not rendered again");
});

QUnit.test("T316005 - mousedown on inputWrapper should not be prevented if openOnFieldClick is true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            openOnFieldClick: true
        }),
        $inputWrapper = $selectBox.find(".dx-dropdowneditor-input-wrapper"),
        event;

    $($inputWrapper).on("mousedown", function(e) { event = e; });
    $($inputWrapper).trigger("mousedown");

    assert.ok(!event.isDefaultPrevented(), "default event is not prevented");
});

QUnit.test("The 'onCustomItemCreating' option should throw a warning if handler returns an item", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            displayExpr: "display",
            valueExpr: "value",
            onCustomItemCreating: function(e) {
                return {
                    display: "display " + e.text,
                    value: "value " + e.text
                };
            }
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        customValue = "Custom value",
        logStub = sinon.stub(errors, "log");

    keyboard
        .type(customValue)
        .change();

    assert.equal($selectBox.dxSelectBox("option", "value"), "value " + customValue, "value is correct");
    assert.equal($input.val(), "display " + customValue, "displayed value is correct");
    assert.ok(logStub.calledOnce, "There was an one message");
    assert.deepEqual(logStub.firstCall.args, ["W0015", "onCustomItemCreating", "customItem"], "Check warning parameters");
});

QUnit.test("onCustomItemCreating should not be called when existing item selecting", function(assert) {
    var onCustomItemCreating = sinon.stub().returns("Custom item"),
        $selectBox = $("#selectBox").dxSelectBox({
            items: ["Item 11", "Item 22", "Item 33"],
            opened: true,
            acceptCustomValue: true,
            searchTimeout: 0,
            searchEnabled: true,
            onCustomItemCreating: onCustomItemCreating
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard
        .type("Item 2")
        .press("down")
        .press("enter");

    assert.equal(onCustomItemCreating.callCount, 0, "action has not been called");
});

QUnit.test("creating custom item via the 'customItem' event parameter", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            displayExpr: "display",
            valueExpr: "value",
            onCustomItemCreating: function(e) {
                e.customItem = {
                    display: "display " + e.text,
                    value: "value " + e.text
                };
            }
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        customValue = "Custom value";

    keyboard
        .type(customValue)
        .change();

    assert.equal($selectBox.dxSelectBox("option", "value"), "value " + customValue, "value is correct");
    assert.equal($input.val(), "display " + customValue, "displayed value is correct");
});

QUnit.test("create custom item by subscribe on event via 'on' method", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            displayExpr: "display",
            valueExpr: "value"
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        customValue = "Custom value",
        onCustomItemCreating = function(event) {
            event.customItem = {
                display: "display " + event.text,
                value: "value " + event.text
            };
        },
        instance = $selectBox.dxSelectBox("instance");

    instance.on("customItemCreating", onCustomItemCreating);

    keyboard
        .type(customValue)
        .change();

    assert.equal(instance.option("value"), "value " + customValue, "value is correct");
    assert.equal($input.val(), "display " + customValue, "displayed value is correct");
});

QUnit.test("The 'onCustomItemCreating' option with Deferred", function(assert) {
    var deferred = $.Deferred(),
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            displayExpr: "display",
            valueExpr: "value",
            onCustomItemCreating: function(e) {
                e.customItem = deferred.promise();
            }
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        customValue = "Custom value";

    keyboard
        .type(customValue)
        .change();

    assert.equal($selectBox.dxSelectBox("option", "value"), null, "value is not changed until deferred is resolved");
    assert.equal($input.val(), customValue, "input value is not changed until deferred is resolved");

    deferred.resolve({
        display: "display " + customValue,
        value: "value " + customValue
    });

    assert.equal($selectBox.dxSelectBox("option", "value"), "value " + customValue, "value is changed");
    assert.equal($input.val(), "display " + customValue, "displayed value is changed");
});

QUnit.test("The 'onCustomItemCreating' option with Promise", function(assert) {
    assert.expect(4);

    var resolve,
        promise = new Promise(function(onResolve) {
            resolve = onResolve;
        }),
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            displayExpr: "display",
            valueExpr: "value",
            onCustomItemCreating: function(e) { e.customItem = promise; }
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        customValue = "Custom value";

    keyboard
        .type(customValue)
        .change();

    assert.equal($selectBox.dxSelectBox("option", "value"), null, "value is not changed until deferred is resolved");
    assert.equal($input.val(), customValue, "input value is not changed until deferred is resolved");

    promise.then(function() {
        assert.equal($selectBox.dxSelectBox("option", "value"), "value " + customValue, "value is changed");
        assert.equal($input.val(), "display " + customValue, "displayed value is changed");
    });

    resolve({
        display: "display " + customValue,
        value: "value " + customValue
    });

    return promise;
});

QUnit.test("Value should be reset if the 'onCustomItemCreating' deferred is rejected", function(assert) {
    var deferred = $.Deferred(),
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            items: [1],
            value: 1,
            onCustomItemCreating: function(e) {
                e.customItem = deferred.reject().promise();
            }
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        customValue = "Custom value";

    $input.val("");

    keyboard
        .type(customValue)
        .change();

    assert.equal($selectBox.dxSelectBox("option", "value"), null, "value is reset");
    assert.equal($input.val(), "", "input value is reset after deferred is rejected");
});

QUnit.test("Filter should be cleared if the 'onCustomItemCreating' deferred is rejected", function(assert) {
    var deferred = $.Deferred(),
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            searchEnabled: true,
            opened: true,
            items: [1, 2, 3],
            onCustomItemCreating: function() {
                return deferred.reject().promise();
            }
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.type("4");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($(selectBox.content()).find(toSelector(LIST_ITEM_CLASS)).length, 0, "filter is applied");
    keyboard.change();

    selectBox.option("opened", true);

    assert.equal($selectBox.dxSelectBox("option", "value"), null, "value is reset");
    assert.equal($input.val(), "", "input value is reset after deferred is rejected");
    assert.equal($(selectBox.content()).find(toSelector(LIST_ITEM_CLASS)).length, 3, "filter was cleared");
});

QUnit.test("filter should be cleared if all text was removed using backspace", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            opened: true,
            items: [1, 2, 3]
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.type("456");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($(selectBox.content()).find(toSelector(LIST_ITEM_CLASS)).length, 0, "filter is applied");

    $input.get(0).setSelectionRange(0, 3);
    keyboard.caret({ start: 0, end: 3 });
    keyboard.press("backspace");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($input.val(), "", "value was cleared");
    assert.equal($(selectBox.content()).find(toSelector(LIST_ITEM_CLASS)).length, 3, "filter was cleared");
});

QUnit.test("search timer should not be cleared when the widget is opening", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            searchTimeout: 100,
            openOnFieldClick: false,
            opened: true,
            items: [1, 2, 3]
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        $button = $selectBox.find(toSelector(DX_DROP_DOWN_BUTTON)),
        keyboard = keyboardMock($input);

    keyboard.type("4");
    this.clock.tick(100);
    assert.equal($(selectBox.content()).find(toSelector(LIST_ITEM_CLASS)).length, 0, "items are filtered");

    keyboard.press("backspace");
    $button.trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($(selectBox.content()).find(toSelector(LIST_ITEM_CLASS)).length, 3, "filter was cleared");
});

QUnit.test("Custom value should be selected in list if items were modified on custom item creation", function(assert) {
    var items = [1, 2, 3],
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            items: items
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        customValue = "Custom value";

    selectBox.option("onCustomItemCreating", function(e) {
        var items = selectBox.option("items").slice();
        items.push(e.text);
        selectBox.option("items", items);

        e.customItem = e.text;
    });

    keyboardMock($input)
        .type(customValue)
        .change();

    selectBox.open();
    var list = selectBox._list;

    assert.deepEqual(list.option("items"), items.concat([customValue]), "list items are correct");
    assert.deepEqual(list.option("selectedItems"), [customValue], "selected item is correct");
});

QUnit.test("Selection should not be cleared if the user select existing item after the search", function(assert) {
    var items = [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            searchEnabled: true,
            searchTimeout: 0,
            displayExpr: "text",
            valueExpr: "id",
            items: items
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        kb = keyboardMock($input);

    kb.type("2");
    selectBox.open();

    var $items = $(toSelector(LIST_ITEM_CLASS));
    $($items.eq(0)).trigger("dxclick");

    kb.change();

    assert.equal(selectBox.option("value"), 2, "value is correct");
    assert.equal($input.val(), "Item 2", "input text is correct");
});

QUnit.test("The error should be thrown if the 'onCustomItemCreating' option returns nothing", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            onCustomItemCreating: noop
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.type("abc");

    try {
        keyboard.change();
    } catch(e) {
        assert.notEqual(e.message.indexOf("E0121"), -1, "correct error is thrown");
    }
});

QUnit.test("Value is reset to previous one after error is thrown", function(assert) {
    var items = ["1"],
        $selectBox = $("#selectBox").dxSelectBox({
            acceptCustomValue: true,
            onCustomItemCreating: noop,
            items: items,
            value: items[0]
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    $input.val("");
    keyboard.type("abc");

    try {
        keyboard.change();
    } catch(e) { }

    assert.equal($input.val(), "1", "input value is correct");
    assert.equal($selectBox.dxSelectBox("option", "value"), "1", "widget value is correct");
});


QUnit.module("search", moduleSetup);

QUnit.test("data is not displayed before min search length is exceeded", function(assert) {
    $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "three"],
        showDataBeforeSearch: false,
        searchEnabled: true,
        minSearchLength: 2,
        opened: true
    });

    var $items = $(toSelector(LIST_ITEM_CLASS));

    assert.equal($items.length, 0, "items is not rendered");
});

QUnit.test("no data to display is not displayed after change option 'showDataBeforeSearch' with empty input", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "three"],
        showDataBeforeSearch: false,
        searchEnabled: true,
        minSearchLength: 2,
        opened: true
    });

    $selectBox.dxSelectBox("instance").option("showDataBeforeSearch", true);
    var $items = $(toSelector(LIST_ITEM_CLASS));

    assert.ok($items.length, "items is shown");
});

QUnit.test("data is displayed before min search length is exceeded when showData='true'", function(assert) {
    $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "three"],
        showDataBeforeSearch: true,
        searchEnabled: true,
        minSearchLength: 2,
        opened: true
    });

    var $items = $(toSelector(LIST_ITEM_CLASS));

    assert.equal($items.length, 3, "items is not rendered");
});

QUnit.test("data is filtered when min search length is exceeded", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "three"],
        showDataBeforeSearch: false,
        searchEnabled: true,
        minSearchLength: 1,
        searchTimeout: 0,
        searchMode: "startswith",
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("o");

    var $items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal($items.length, 1, "items was filtered");
});

QUnit.test("data is filtered when min search length is exceeded", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "three"],
        showDataBeforeSearch: true,
        searchEnabled: true,
        minSearchLength: 1,
        searchTimeout: 0,
        searchMode: "startswith",
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("o");

    var $items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal($items.length, 1, "items was filtered");
});

QUnit.test("data is filtered correctly for grouped items", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: {
            store: [{ "value": "one", "groupName": "group1" }, { "value": "two", "groupName": "group1" }],
            group: 'groupName'
        },
        valueExpr: 'value',
        displayExpr: 'value',
        grouped: true,
        searchEnabled: true,
        searchTimeout: 0,
        searchMode: "startswith",
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("o");

    var $items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal($items.length, 1, "items was filtered");
});

QUnit.test("data is reset to first page after reset filter", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "three"],
        showDataBeforeSearch: true,
        searchEnabled: true,
        minSearchLength: 1,
        searchTimeout: 0,
        searchMode: "startswith",
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input, true);

    keyboard
        .type("o")
        .press("backspace")
        .press("backspace");

    var $items = $(toSelector(LIST_ITEM_CLASS));

    assert.equal($items.length, 3, "items are not filtered");
});

QUnit.test("data is reset to first page fully after string < 'minSearchLength'", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: ["one", "two", "tree"],
        showDataBeforeSearch: true,
        searchEnabled: true,
        minSearchLength: 2,
        searchTimeout: 0,
        searchMode: "startswith",
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input, true);

    keyboard
        .type("tw")
        .press("backspace")
        .press("backspace");

    var $items = $(toSelector(LIST_ITEM_CLASS));

    assert.equal($items.length, 3, "list of items is full");

});

QUnit.test("data should not be filtering before than string.length < 'minSearchLength'", function(assert) {
    var $selectBox = $('#selectBox').dxSelectBox({
        dataSource: ["one", "two", "tree"],
        showDataBeforeSearch: true,
        searchEnabled: true,
        minSearchLength: 3,
        searchTimeout: 0,
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    var items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 3, "all items shown");

    keyboard
        .type("o");

    items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 3, "all items shown");

    keyboard
        .type("n");

    items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 3, "all items shown");
    keyboard
        .type("e");

    items = $(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 1, "one item shown");
});

QUnit.test("dataSource load is not called when showDataBeforeSearch is false", function(assert) {
    var dataSource = new DataSource(["one", "two", "three"]);
    var $selectBox = $("#selectBox").dxSelectBox({
        dataSource: dataSource,
        showDataBeforeSearch: false,
        searchEnabled: true,
        minSearchLength: 2,
        searchTimeout: 0,
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.type("tw");

    var dataSourceLoadSpy = sinon.spy(dataSource, "load");
    try {
        keyboard.press("backspace");

        assert.ok(!dataSourceLoadSpy.called, "dataSource load was not called");
    } finally {
        dataSourceLoadSpy.restore();
    }
});

QUnit.test("Widget should works correctly after setting dataSource to null", function(assert) {
    var dataSource = new DataSource(["one", "two", "three"]);
    var selectBox = $("#selectBox").dxSelectBox({
        dataSource: dataSource,
    }).dxSelectBox("instance");

    selectBox.option("dataSource", null);
    selectBox.open();

    var $list = $(".dx-list");
    assert.equal($list.dxList("option", "noDataText"), "No data to display", "SelectBox works correctly");
});

QUnit.testInActiveWindow("Value should be null after input is cleared and enter key is tapped", function(assert) {
    var items = [1, 2],
        $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            items: items,
            value: items[0],
            searchTimeout: 0
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    $input.focus();

    keyboard
        .press('end')
        .press('backspace');

    keyboard
        .press('enter');

    assert.equal($selectBox.dxSelectBox("option", "value"), null, "value is null");
    assert.equal($input.val(), "", "input is cleared");
    assert.equal(selectBox.option("selectedItem"), null, "selectedItem is null");
    assert.ok(!selectBox.option("opened"), "popup is closed");
});

QUnit.testInActiveWindow("Value should not be null after focusOut during loading (T600537)", function(assert) {
    var clock = sinon.useFakeTimers();

    try {
        var array = [
            { id: 1, text: "Text 1" },
            { id: 2, text: "Text 2" },
            { id: 3, text: "Text 3" }
        ];
        var dataSource = new DataSource({
            key: "id",
            load: function() {
                return array;
            },
            byKey: function(key) {
                var d = $.Deferred();

                setTimeout(function() {
                    d.resolve(array.filter(function(item) {
                        return item.id === key;
                    })[0]);
                }, 300);

                return d.promise();
            }
        });
        var $selectBox = $("#selectBox").dxSelectBox({
                dataSource: dataSource,
                value: 1,
                valueExpr: "id",
                displayExpr: "text",
                allowClearing: true,
                searchEnabled: true
            }),
            $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

        $input.focus();
        $input.focusout();

        clock.tick(300);

        assert.equal($selectBox.dxSelectBox("option", "value"), 1, "value is not null");
    } finally {
        clock.restore();
    }
});

// T494140
QUnit.testInActiveWindow("Value should not be changed after input is cleared and enter key is tapped if allowClearing is false", function(assert) {
    var items = [1, 2],
        valueChangedHandler = sinon.spy(),
        $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            allowClearing: false,
            items: items,
            value: items[0],
            searchTimeout: 0,
            onValueChanged: valueChangedHandler
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    $input.focus();

    keyboard
        .press('end')
        .press('backspace');

    keyboard
        .press('enter');

    assert.equal($selectBox.dxSelectBox("option", "value"), items[0], "value is not changed");
    assert.strictEqual(valueChangedHandler.callCount, 0, "valueChanged handler is not called");
    assert.equal(selectBox.option("selectedItem"), items[0], "selectedItem is not null");
    assert.equal($input.val(), "", "input is cleared");

    $input.blur();

    assert.equal($input.val(), "1", "input value is restored");
});

QUnit.test("search should not be performed after control key press on substituted input value", function(assert) {
    var item = "aaa",
        $selectBox = $("#selectBox").dxSelectBox({
            items: [item],
            value: item,
            searchEnabled: true,
            searchTimeout: 0
        }),
        selectBox = $selectBox.dxSelectBox("instance");

    keyboardMock($selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)), true)
        .caret({
            start: 0,
            end: item.length
        })
        .focus()
        .press("end");

    assert.notOk(selectBox.option("opened"), "popup is opened after filtering");
});

QUnit.test("item should not be reset on the 'tab' key press after popup is opened", function(assert) {
    var item = "aaa",
        $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            items: [item],
            value: item,
            searchTimeout: 0
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        selectBox = $selectBox.dxSelectBox("instance"),
        keyboard = keyboardMock($input);

    keyboard.focus();
    $($selectBox.find(toSelector(DX_DROP_DOWN_BUTTON))).trigger("dxclick");

    keyboard
        .press("tab")
        .blur();

    assert.equal($input.val(), item, "input value is correct");
    assert.equal(selectBox.option("value"), item, "value is correct");
});

QUnit.test("filter should be cleared after item selection via tab", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            dataSource: ["aaa", "bbb"],
            opened: true,
            searchTimeout: 0
        }),
        $input = $selectBox.find("." + TEXTEDITOR_INPUT_CLASS),
        selectBox = $selectBox.dxSelectBox("instance"),
        keyboard = keyboardMock($input);

    keyboard.type("a");
    keyboard.press("tab");

    assert.equal(selectBox.option("opened"), false, "selectBox was closed");
    assert.equal(selectBox.getDataSource().searchValue(), null, "filter was cleared");
});

QUnit.test("Opening selectBox after search should not load data if the 'showDataBeforeSearch' option is false", function(assert) {
    var dataSource = new DataSource({
        load: function() {
            return ["aaa", "aab", "bbb"];
        },
        byKey: function(key) {
            return key;
        }
    });
    var $selectBox = $("#selectBox").dxSelectBox({
            dataSource: dataSource,
            searchEnabled: true,
            showDataBeforeSearch: false,
            minSearchLength: 2,
            searchTimeout: 0
        }),
        instance = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input)
        .focus()
        .type("aa");

    instance.close();

    var loadSpy = sinon.spy(dataSource, "load");
    $($input).trigger("dxclick");

    var $emptyMessage = $(".dx-empty-message");
    var $items = $(toSelector(LIST_ITEM_CLASS));

    assert.equal(loadSpy.callCount, 0, "the was no load");
    assert.ok(instance.option("opened"), "selectBox is opened");
    assert.equal($items.length, 0, "items is not rendered");
    assert.equal($emptyMessage.length, 1, "empty message is rendered");
});

QUnit.test("Input value should not be changed after dropdown click when 'startswith' search mode is enabled", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "the test is not actual for non-desktop devices");
        return;
    }

    var $selectBox = $("#selectBox").dxSelectBox({
            items: ["1", "2", "3"],
            searchMode: 'startswith',
            searchTimeout: 0,
            searchEnabled: true
        }),
        instance = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        $dropDownButton = $selectBox.find(toSelector(DX_DROP_DOWN_BUTTON));

    keyboardMock($input)
        .focus()
        .type("2")
        .press("enter");

    $($dropDownButton).trigger("dxclick");

    assert.equal(instance.option("value"), instance.option("text"), "text option should be correct");
    assert.equal($input.val(), instance.option("value"), "input should show correct value");
});


QUnit.module("search substitution", {
    beforeEach: function() {
        this.item = "abc";

        this.$selectBox = $("#selectBox").dxSelectBox({
            items: [this.item],
            searchTimeout: 0,
            searchEnabled: true,
            focusStateEnabled: true,
            searchMode: "startswith",
            autocompletionEnabled: true
        });

        this.selectBox = this.$selectBox.dxSelectBox("instance");
        this._init();
    },
    _init: function() {
        this.$input = this.$selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
        this.keyboard = keyboardMock(this.$input, true);

        var inputElement = this.$input.get(0);

        this.hasSelection = function() {
            return inputElement.selectionStart !== inputElement.selectionEnd;
        };
    },
    reinit: function(options) {
        this.selectBox.option(options);
        this._init();
    }
});

// T434197
QUnit.test("search timeout should be cleared if new search have been initiated", function(assert) {
    var loadHandler = sinon.spy(),
        clock = sinon.useFakeTimers(),
        $selectBox = $("<div>").appendTo("body");

    try {
        $selectBox.dxSelectBox({
            searchEnabled: true,
            deferRendering: true,
            dataSource: new CustomStore({
                load: loadHandler,
                byKey: noop
            }),
            searchTimeout: 100
        });

        var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
            kb = keyboardMock($input, true),
            $dropDownButton = $selectBox.find(toSelector(DX_DROP_DOWN_BUTTON));

        kb.type("2");
        clock.tick(60);

        $($dropDownButton).trigger("dxclick");

        clock.tick(100);
        assert.equal(loadHandler.callCount, 1, "dataSource should be loaded once");
    } finally {
        clock.restore();
        $selectBox.remove();
    }
});

QUnit.test("caret should be at the end of the input if search is used with 'startswith' mode and items are numbers", function(assert) {
    this.reinit({
        dataSource: [1, 2, 3],
        value: null,
        searchTimeout: 0,
        searchMode: 'startswith',
        searchEnabled: true
    });

    this.keyboard.type("1");
    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret is good");
});

QUnit.test("search value should not be substituted if the 'autocompletionEnabled' is false", function(assert) {
    this.reinit({
        items: [this.item],
        searchTimeout: 0,
        searchEnabled: true,
        focusStateEnabled: true,
        searchMode: "startswith",
        autocompletionEnabled: false
    });

    this.keyboard
        .focus()
        .type(this.item[0]);

    assert.equal(this.$input.val(), this.item[0], "search value is not substituted");
});

QUnit.test("search value is substituted while typing", function(assert) {
    var itemLength = this.item.length,
        inputElement = this.$input.get(0);

    this.keyboard.focus();

    for(var i = 0; i < itemLength; i++) {
        this.keyboard.type(this.item[i]);

        assert.equal(this.$input.val(), this.item, "input value is correct");
        assert.equal(inputElement.selectionStart, i + 1, "selection start is correct");
        assert.equal(inputElement.selectionEnd, itemLength, "selection end is correct");
    }
});

QUnit.test("search value substitution is applied on the 'right' key press", function(assert) {
    this.keyboard
        .focus()
        .type(this.item[0])
        .press('right');

    assert.equal(this.$input.val(), this.item, "input value is correct");
    assert.notOk(this.hasSelection(), "there is no input value selection");
});

QUnit.test("items should not be loaded after substitution is removed on the 'backspace' key press", function(assert) {
    var that = this,
        loadCount = 0;

    this.reinit({
        dataSource: new DataSource({
            load: function() {
                loadCount++;
                return [that.item];
            }
        })
    });

    this.keyboard
        .focus()
        .type(this.item[0]);

    loadCount = 0;

    this.keyboard
        .press('backspace');

    assert.equal(loadCount, 0, "items are not loaded");
});

QUnit.test("there is no search value substitution if no items are found", function(assert) {
    var newValue = this.item[0] + "d";

    this.keyboard
        .focus()
        .type(newValue);

    assert.equal(this.$input.val(), newValue, "input value is correct");
    assert.notOk(this.hasSelection(), "there is no input value selection");
});

QUnit.test("the value chars deleting using the 'backspace' key do not lead to the search value substitution", function(assert) {
    var itemLength = this.item.length;

    this.keyboard
        .type(this.item)
        .press("backspace");

    assert.equal(this.$input.val(), this.item.slice(0, itemLength - 1), "value is correct");
    assert.notOk(this.hasSelection(), "there is no selection");

    this.keyboard
        .press("backspace");

    assert.equal(this.$input.val(), this.item.slice(0, itemLength - 2), "value is correct");
    assert.notOk(this.hasSelection(), "there is no selection");
});

QUnit.test("the 'left', 'right', 'home' and 'end' keys press should lead to the list dataSource filtering", function(assert) {
    var keys = ["left", "right", "home", "end"],
        items = ["item1", "item2"];

    this.reinit({
        items: items
    });

    for(var i = 0, n = keys.length; i < n; i++) {
        var key = keys[i];
        this.$input.val("");

        this.keyboard
            .type("it")
            .press(key);

        assert.deepEqual(this.selectBox._list.option("items"), [items[0]], "list dataSource is filtered after the '" + key + "' key press");
        assert.notOk(this.hasSelection(), "there is no selection after the '" + key + "' key press");
    }
});

QUnit.test("the 'left', 'right', 'home' and 'end' keys press should lead to the list dataSource filtering", function(assert) {
    var keys = ["left", "right", "home", "end"],
        item = "item1",
        loadCount = 0;

    this.reinit({
        dataSource: new DataSource({
            load: function() {
                loadCount++;
                return [item];
            }
        })
    });

    for(var i = 0, n = keys.length; i < n; i++) {
        var key = keys[i];
        this.$input.val("");

        this.keyboard
            .type(item);

        loadCount = 0;

        this.keyboard
            .press(key);

        assert.equal(loadCount, 0, "dataSource is not loaded after the '" + key + "' key press if there is no substitution");
    }
});

QUnit.test("substitution should not be rendered if the 'searchMode' is 'contains' only", function(assert) {
    this.reinit({
        searchMode: "contains"
    });

    this.keyboard.type(this.item[0]);
    assert.notOk(this.hasSelection(), "there is no selection");
});

QUnit.test("the list item value should be displayed in input while navigating without substitution", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "the test is not actual for non-desktop devices");
        return;
    }

    var items = ["aaa", "bbb"];

    this.reinit({
        items: items,
        opened: true
    });

    this.keyboard.focus();

    $.each(items, $.proxy(function(_, item) {
        this.keyboard.press("down");

        assert.equal(this.$input.val(), item, "input value is correct for the '" + item + "' item");
        assert.notOk(this.hasSelection(), "input value has no selection for the '" + item + "' item");
        assert.equal(this.selectBox.option("value"), null, "the widget's value option is not changed for the '" + item + "' item");
    }, this));
});

QUnit.test("the list item value should not be displayed in input after click on item", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "the test is not actual for non-desktop devices");
        return;
    }

    var dataSource = [
        { id: 1, text: 'test1' },
        { id: 2, text: 'test2' },
        { id: 3, text: 'test3' }
    ];

    this.reinit({
        dataSource: dataSource,
        opened: true,
        displayExpr: 'text',
        fieldTemplate: function(selectedItem, fieldElement) {
            var textBox = $("<div>").dxTextBox({
                value: selectedItem ? selectedItem.id : ''
            });
            $(fieldElement).append(textBox);
        }
    });

    var listItem = $(".dx-list").find(toSelector(LIST_ITEM_CLASS)).eq(1);

    var clock = sinon.useFakeTimers();
    try {
        listItem.trigger("dxpointerdown");
        clock.tick();
        var $input = this.$selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

        assert.equal($input.val(), "", "input value should not be changed when selection is not complete");

        listItem.trigger("dxclick");
        $input = this.$selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

        assert.equal($input.val(), "2", "input value should be changed after selection complete");
        clock.tick(100000);
    } finally {
        clock.restore();
    }
});

QUnit.testInActiveWindow("the first list item should be focused while searching", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "the test is not actual for non-desktop devices");
        return;
    }

    var items = ["aaa", "abb", "aab"];

    this.reinit({
        items: items,
        value: items[2],
        opened: true
    });

    var $list = $(this.selectBox._list.$element());

    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(2).hasClass(STATE_FOCUSED_CLASS), "the focused element is correct after popup is opened");

    this.keyboard
        .focus()
        .press("end")
        .press("backspace");

    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).eq(0).hasClass(STATE_FOCUSED_CLASS), "the focused element is correct after the first searching");
});

QUnit.test("There is no substitution if the 'acceptCustomValue' option is true", function(assert) {
    this.reinit({
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .type(this.item[0]);

    assert.notOk(this.hasSelection(), "the input value has no selection");
});

QUnit.test("No items should be focused while searching if the 'acceptCustomValue' option is true", function(assert) {
    this.reinit({
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .type(this.item[0]);

    var $list = $(this.selectBox._list.$element());

    assert.equal($list.find(toSelector(STATE_FOCUSED_CLASS)).length, 0, "no items are focused");
});

QUnit.module("Scrolling", {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.container = $("<div>").addClass("selectBoxScrolling").appendTo("#qunit-fixture");
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;

        this.container.remove();
    }
});

QUnit.test("After load new page list should not be scrolled to selected item", function(assert) {
    require("common.css!");
    require("generic_light.css!");

    this.clock.restore();

    var data = [],
        done = assert.async();

    for(var i = 1; i < 100; i++) {
        data.push(i);
    }

    var dataSource = new DataSource({
        store: data,
        paginate: true,
        pageSize: 40
    });

    $("#qunit-fixture")
        .css("left", 0)
        .css("top", 0);

    var instance = $(".selectBoxScrolling").dxSelectBox({
        dataSource: dataSource,
        deferRendering: false,
        value: 1,
        width: 200
    }).dxSelectBox("instance");

    instance.option("opened", true);

    var listInstance = $(".dx-list").dxList("instance");
    var scrollingDistance = 1000;

    listInstance.scrollTo(scrollingDistance);

    setTimeout(function() {
        assert.roughEqual(listInstance.scrollTop(), scrollingDistance, 150, "scrollTop is correctly after new page load");
        done();
    });
});


QUnit.module("Async tests");

QUnit.testInActiveWindow("Value should be reset after on selectedItem after focusout", function(assert) {
    var done = assert.async(),
        items = [1, 2],
        $selectBox = $("#selectBox").dxSelectBox({
            searchEnabled: true,
            items: items,
            value: items[0],
            valueChangeEvent: "change",
            searchTimeout: 0
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    $input.focus();

    keyboard
        .press('end')
        .press('backspace')
        .type('2');

    $input.blur();

    setTimeout(function() {
        assert.equal(selectBox.option("value"), items[0], "value is not changed");
        assert.equal(selectBox.option("selectedItem"), items[0], "selectedItem is not changed");
        assert.equal($input.val(), items[0], "input is reset");
        done();
    }, 0);
});

QUnit.test("the selected item should be visible if the data source is loaded after the delay (T386513)", function(assert) {
    var done = assert.async(),
        dataSourceLoadedDeferred = $.Deferred(),
        itemsCount = 100,
        selectedItem = 80,
        dataSource = {
            load: function() {
                var d = $.Deferred();

                setTimeout(function() {
                    d.resolve(Array.apply(null, { length: itemsCount }).map(Number.call, Number));
                    dataSourceLoadedDeferred.resolve();
                }, 0);

                return d.promise();
            },
            byKey: function(key) {
                return key;
            }
        },
        $element = $("#selectBox").dxSelectBox({
            dataSource: dataSource,
            opened: true,
            value: selectedItem
        }),
        list = $element.dxSelectBox("instance")._list,
        $scrollableContainer = $(list.$element().find(".dx-scrollable-container")),
        $scrollableContent = $scrollableContainer.find(".dx-scrollable-content");

    dataSourceLoadedDeferred.promise().done(function() {
        var scrollableContentTop = $scrollableContent.position().top;
        list.scrollToItem(selectedItem);
        var expectedScrollableContentTop = $scrollableContent.position().top;
        assert.equal(scrollableContentTop, expectedScrollableContentTop, "list is scrolled to the selected item");

        done();
    });
});

QUnit.test("selectbox should not render own components if it was disposed (T517486)", function(assert) {
    this.clock = sinon.useFakeTimers();

    try {
        var instance = $("#selectBox").dxSelectBox({
            dataSource: {
                load: function() {
                    return [1];
                },
                byKey: function() {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolveWith(1);
                    }, 200);
                    return d.promise();
                }
            }
        }).dxSelectBox("instance");

        instance.option("value", "1");
        instance.$element().remove();
        this.clock.tick(200);
        assert.ok(true, "exception is not expected");
    } catch(e) {
        assert.ok(false, "Exception: " + e);
    } finally {
        this.clock.restore();
    }
});

QUnit.module("regressions", moduleSetup);

QUnit.test("dataSource null reference error", function(assert) {
    assert.expect(0);

    var $element = $("#selectBox").dxSelectBox({ items: [0, 1, 2], value: 0 }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.click();
    $($input).trigger("keyup", { which: 40 });
});

QUnit.test("dataSource option", function(assert) {
    assert.expect(1);

    var $element = $("#selectBox").dxSelectBox({ dataSource: [0, 1, 2], value: 0 }),
        $list = $element.find(".dx-list"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.click();
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($list.find(toSelector(LIST_ITEM_CLASS)).length, 3, "all items rendered");
});

QUnit.test("incorrect list items count after press key_down", function(assert) {
    assert.expect(1);

    var $element = $("#selectBox").dxSelectBox({ dataSource: [0, 1, 2], value: 0 }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        $list = $element.find(".dx-list");

    $input.click();
    this.clock.tick(TIME_TO_WAIT);

    $($input).trigger("keyup", { which: 40 });
    this.clock.tick(TIME_TO_WAIT);

    assert.ok($list.find(toSelector(LIST_ITEM_CLASS)).length === 3);
});


QUnit.test("B251138 disabled", function(assert) {
    var instance = $("#selectBox").dxSelectBox({ dataSource: [0, 1, 2], disabled: false }).dxSelectBox('instance');

    instance.option("disabled", true);
    assert.ok(instance.$element().hasClass("dx-state-disabled"), "disabled state should be added to SelectBox itself");
    assert.ok(instance.option("disabled"), "Disabled state should be propagated to texteditor");

    instance.option("disabled", false);
    assert.ok(!instance.$element().hasClass("dx-state-disabled"), "disabled state should be removed from SelectBox itself");
    assert.ok(!instance.option("disabled"), "Disabled state should be propagated to texteditor");
});

QUnit.test("option value should be assigned by reference", function(assert) {
    var items = [
        { name: "item1" },
        { name: "item2" }
    ];

    var $element = $("#selectBox").dxSelectBox({
            dataSource: items,
            value: items[0],
            displayExpr: "name"
        }),
        instance = $element.dxSelectBox('instance');

    $(instance._input()).trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);
    $($element.find(toSelector(LIST_ITEM_CLASS)).eq(1)).trigger("dxclick");

    $(instance._input()).click();
    this.clock.tick(TIME_TO_WAIT);
    $($element.find(toSelector(LIST_ITEM_CLASS)).eq(0)).trigger("dxclick");

    assert.equal(instance._input().val(), "item1", "item was found in items by reference");
});

QUnit.test("select box doesn't load first element when value isn't set", function(assert) {
    var loadAttempts = 0;
    $("#selectBox").dxSelectBox({
        dataSource: new DataSource({
            store: new CustomStore({
                byKey: function(key) {
                    if(!key) {
                        loadAttempts = 1;
                    }
                },
                key: function() { "key"; },
                load: function(loadOption) {
                    return [];
                }
            })
        }),
        value: undefined,
        valueExpr: 'key',
        displayExpr: 'value'
    });

    assert.equal(loadAttempts, 0, "there were no attempts of loading");
});

QUnit.test("press 'enter' key sets option value (T100679)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var value = {
        value: "test"
    };

    var $element = $("#selectBox").dxSelectBox({
        dataSource: [value],
        displayExpr: "value",
        focusStateEnabled: true
    });

    this.clock.tick();

    var selectBox = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    selectBox.open();
    keyboardMock($input)
        .keyDown(KEY_ENTER)
        .keyDown(KEY_DOWN)
        .keyDown(KEY_ENTER);

    assert.deepEqual(selectBox.option("value"), value, "value selected");
});

QUnit.test("error occurred while using the remote dataSource (T119856)", function(assert) {
    assert.expect(0);
    var done = assert.async();

    this.clock.restore();

    $("#selectBox").dxSelectBox({
        dataSource: {
            load: function() {
                var d = $.Deferred();
                setTimeout(function() {
                    d.resolveWith([1, 2, 3]);
                    done();
                });
                return d.promise();
            },

            byKey: function() {
                var d = $.Deferred();
                setTimeout(function() {
                    d.resolveWith(1);
                });
                return d.promise();
            }
        }
    });
});


QUnit.test("onValueChanged should not be triggered while keyboard navigation in drop-down list (T116287)", function(assert) {
    var valueChangeFired = 0,
        $element = $("#selectBox").dxSelectBox({
            dataSource: [
                { "displayValue": "One", "value": 1 },
                { "displayValue": "Two", "value": 2 }
            ],
            onValueChanged: function() {
                valueChangeFired++;
            },
            displayExpr: "displayValue",
            valueExpr: "value"
        }),
        instance = $element.dxSelectBox("instance");

    $element
        .find(toSelector(TEXTEDITOR_INPUT_CLASS))
        .trigger("dxclick")
        .trigger("keyup");

    assert.equal(valueChangeFired, 0);
    assert.strictEqual(instance.option("value"), null);
});

QUnit.test("dxSelectBox's value should not be changed on keyup (T134612)", function(assert) {
    var valueChanged = 0,
        $element = $("#selectBox").dxSelectBox({
            dataSource: [
                { "displayValue": "One", "value": 1 },
                { "displayValue": "Two", "value": 2 }
            ],
            displayExpr: "displayValue",
            valueExpr: "value"
        }),
        instance = $element.dxSelectBox("instance");

    instance._optionChanged = function(args) {
        if(args.name === "value") {
            valueChanged++;
        }
    };

    instance.option("value", 2);
    assert.equal(valueChanged, 1, "when change value via option(optionName, value) - option value changed");

    $element
        .find(toSelector(TEXTEDITOR_INPUT_CLASS))
        .trigger("keyup");

    assert.equal(valueChanged, 1, "after keypress 'optionChanged' didn't changed");

    $element
        .find(toSelector(TEXTEDITOR_INPUT_CLASS))
        .trigger("change");
    assert.equal(valueChanged, 1, "after change value didn't changed");

});

QUnit.test("value change should select correct list item with the 'acceptCustomValue' set to true", function(assert) {
    var selectBox = $("#selectBox").dxSelectBox({
        items: [1, 2, 3],
        acceptCustomValue: true
    }).dxSelectBox("instance");

    selectBox.option("value", 2);
    selectBox.open();

    assert.deepEqual(selectBox._list.option("selectedItems"), [2], "the selected item is correct");
});


QUnit.module("hide on blur", moduleSetup);

QUnit.testInActiveWindow("selectbox does not hide self after input blur", function(assert) {
    var $selectBox = $("#selectBoxWithoutScroll").dxSelectBox({
        dataSource: [100, 200, 300]
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    pointerMock($input).start().click();
    var $popupContent = $(toSelector(POPUP_CONTENT_CLASS));
    assert.equal($popupContent.is(":visible"), true, "popup visible after click");
    $input.blur();
    assert.equal($popupContent.is(":visible"), true, "popup visible after focus out");
});


QUnit.module("keyboard navigation", moduleSetup);

QUnit.test("upArrow and downArrow on textbox change value", function(assert) {

    var $element = $("#selectBox").dxSelectBox({
            dataSource: [0, 1, 2],
            value: 1,
            focusStateEnabled: true,
            opened: false,
            deferRendering: true
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    assert.strictEqual(instance.option("value"), 1);

    this.clock.tick(0);
    keyboard.keyDown("down");
    assert.strictEqual(instance.option("value"), 2, "downArrow");

    keyboard.keyDown("up");
    assert.strictEqual(instance.option("value"), 1, "upArrow");
});

QUnit.test("upArrow and downArrow on textbox change value after change dataSource", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            dataSource: [0, 1, 2],
            value: 1,
            focusStateEnabled: true,
            opened: false,
            deferRendering: true
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    instance.option("dataSource", [4, 5, 6]);

    assert.strictEqual(instance.option("value"), 1);

    this.clock.tick(0);
    keyboard.keyDown("down");
    assert.strictEqual(instance.option("value"), 4, "downArrow");
});

QUnit.test("disabled item should not be selected via keyboard if the widget is closed", function(assert) {
    var $element = $("#selectBox").dxSelectBox({ items: [
                { text: "Item 1" },
                { text: "Item 2", disabled: true },
                { text: "Item 3", disabled: false }
        ],
            value: "Item 1",
            opened: false,
            valueExpr: "text",
            displayExpr: "text"
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.keyDown("down");
    assert.equal(instance.option("value"), "Item 3", "disabled item was skipped when down button was pressed");

    keyboard.keyDown("up");
    assert.equal(instance.option("value"), "Item 1", "disabled item was skipped when up button was pressed");
});

QUnit.test("Enter and escape key press prevent default when popup is opened", function(assert) {
    assert.expect(1);

    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            value: 1,
            focusStateEnabled: true,
            opened: true,
            acceptCustomValue: true
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        prevented = 0;

    $($element).on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    keyboard.keyDown("enter");
    instance.option("opened", true);
    keyboard.keyDown("esc");

    assert.equal(prevented, 2, "defaults prevented on enter and escape keys");
});

QUnit.test("Enter and escape key press does not prevent default when popup is not opened", function(assert) {
    assert.expect(1);

    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            value: 1,
            focusStateEnabled: true,
            opened: false
        }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        prevented = 0;

    $($element).on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    keyboard.keyDown("enter");
    keyboard.keyDown("esc");

    assert.equal(prevented, 0, "defaults has not prevented on enter and escape keys");
});

QUnit.test("Escape key press does not throw any errors when popup is not opened", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            value: 1,
            focusStateEnabled: true,
            deferRendering: true,
            opened: false
        }),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.keyDown("esc");

    assert.ok(true, "SelectBox works correctly");
});

QUnit.test("T243237: dxSelectBox keyboard navigation: up arrow can not circulate through the values, as down arrow", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            value: 0,
            focusStateEnabled: true,
            opened: false
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.keyDown("up");
    assert.equal(instance.option("value"), 2, "up arrow can circulate");

    keyboard.keyDown("down");
    assert.equal(instance.option("value"), 0, "down arrow can circulate");
});

QUnit.test("clearing selectbox with delete and backspace when showClearButton enabled (T243231)", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            value: 0,
            focusStateEnabled: true,
            showClearButton: true
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.keyDown("backspace");
    assert.equal(instance.option("value"), null, "selectbox was cleared on backspace");

    instance.option("value", 1);
    keyboard.keyDown("del");
    assert.equal(instance.option("value"), null, "selectbox was cleared on delete");

    instance.option({ value: 2, showClearButton: false });
    keyboard.keyDown("backspace");
    keyboard.keyDown("del");
    assert.equal(instance.option("value"), 2, "selectbox was not cleared on delete and backspace when showClearButton is false");
});

QUnit.test("no clearing with delete and backspace when showClearButton enabled and searchEnabled is true (T257202)", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: [0, 1, 2],
        value: 0,
        focusStateEnabled: true,
        showClearButton: true,
        searchEnabled: true
    });

    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.keyDown("backspace");
    assert.equal(instance.option("value"), 0, "value preserved on backspace");

    keyboard.keyDown("del");
    assert.equal(instance.option("value"), 0, "value preserved on delete");
});

QUnit.test("no clearing with delete and backspace when showClearButton enabled and acceptCustomValue is true (T257202)", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        items: [0, 1, 2],
        value: 0,
        focusStateEnabled: true,
        showClearButton: true,
        acceptCustomValue: true
    });

    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.keyDown("backspace");
    assert.equal(instance.option("value"), 0, "value preserved on backspace");

    keyboard.keyDown("del");
    assert.equal(instance.option("value"), 0, "value preserved on delete");
});

QUnit.test("list should have selected value after it was selected in selectBox (T242349)", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
            items: [0, 1, 2],
            showSelectionControls: false,
            value: 1
        }),
        list = $element.find(".dx-list").dxList("instance");

    assert.equal(list.option("selectedIndex"), 1);
});

QUnit.test("selectBox should select next value when used async dataSource (T298201)", function(assert) {
    var items = [
        { id: 0, value: 'Item 0' },
        { id: 1, value: 'Item 1' }
    ];

    var $element = $("#selectBox").dxSelectBox({
            dataSource: new DataSource({
                byKey: function(key) {
                    return $.grep(items, function(i) {
                        return i === key;
                    });
                },
                load: function() {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(items);
                    });
                    return d.promise();
                }
            }),
            focusStateEnabled: true,
            deferRendering: true,
            displayExpr: 'value'
        }),
        instance = $element.dxSelectBox("instance"),
        $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    keyboard.keyDown("down");
    this.clock.tick(0);
    assert.deepEqual(instance.option("value"), items[0], "downArrow");

    keyboard.keyDown("down");
    this.clock.tick(0);
    assert.deepEqual(instance.option("value"), items[1], "upArrow");
});

QUnit.test("selectBox should select next value when used async dataSource and values is set (T298201)", function(assert) {
    var items = [
        { id: 0, value: 'Item 0' },
        { id: 1, value: 'Item 1' }
    ];

    var $element = $("#selectBox").dxSelectBox({
        dataSource: new DataSource({
            byKey: function(key) {
                return $.extend({}, $.grep(items, function(i) {
                    return i.id === key;
                })[0]);
            },
            load: function() {
                var d = $.Deferred();
                setTimeout(function() {
                    d.resolve(items);
                });
                return d.promise();
            },
            key: 'id'
        }),
        focusStateEnabled: true,
        deferRendering: true,
        displayExpr: 'value',
        valueExpr: 'id',
        value: 0
    });
    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    this.clock.tick(0);

    keyboard.keyDown("down");
    this.clock.tick(0);
    assert.deepEqual(instance.option("selectedItem"), items[1], "downArrow");
});

QUnit.test("T323427 - item should be chosen after focus on it if input is empty", function(assert) {
    var items = [1, 2],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            value: null,
            focusStateEnabled: true
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    var downKey = 40,
        altDownEvent = $.Event("keydown", { which: downKey, altKey: true });

    $input
        .focus()
        .trigger(altDownEvent);

    selectBox._list.option("focusStateEnabled", true);

    keyboard
        .press("down")
        .press("enter");

    assert.equal(selectBox.option("value"), 1, "value should be changed to the selected item");
});

QUnit.test("value can be cleared from keyboard when the list is not rendered yet", function(assert) {
    var items = [1, 2],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            deferRendering: true,
            value: 2,
            focusStateEnabled: true
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    $input.val("");

    keyboard.press("enter");

    assert.equal(selectBox.option("value"), null, "value was cleared");
    assert.equal($input.val(), "", "input stay cleared");
});

QUnit.test("T321249: SelectBox: Up/down keys loops only in last dataSource load result", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        dataSource: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        pageSize: 5,
        opened: true
    });

    var scrollView = $(".dx-scrollview").dxScrollView("instance");
    scrollView.scrollToElement($(toSelector(LIST_ITEM_CLASS)).last());
    $(toSelector(LIST_ITEM_CLASS)).last().trigger("dxclick");

    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input)
        .keyDown("down");

    assert.equal($input.val(), 1, "chosen value is correct");
});

QUnit.testInActiveWindow("value should be reset to the previous one on the 'tab' press if popup is closed", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "not actual");
        return;
    }

    var items = ["aaa", "aab"],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            value: items[0],
            searchTimeout: 0,
            searchEnabled: true
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input)
        .focus()
        .press("end")
        .press("backspace")
        .press("esc")
        .press("tab")
        .blur();

    assert.equal($input.val(), items[0], "input value is reset");
    assert.equal(selectBox.option("value"), items[0], "widget value is reset");
});


QUnit.testInActiveWindow("input value should be reset to the previous one on the 'esc' press", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "not actual");
        return;
    }
    var items = ["aaa", "aab"],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            value: items[0]
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);


    keyboard.focus();
    selectBox.open();
    keyboard.press("down");
    keyboard.press("esc");

    assert.equal($input.val(), items[0], "input value is reset");
});

QUnit.testInActiveWindow("value should be reset on the 'tab' press after input value was cleared", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "not actual");
        return;
    }

    var item = "a",
        $selectBox = $("#selectBox").dxSelectBox({
            items: [item],
            value: item,
            searchEnabled: true,
            searchTimeout: 0
        }),
        selectBox = $selectBox.dxSelectBox("instance"),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input)
        .focus()
        .press("end")
        .press("backspace")
        .press("tab")
        .blur();

    assert.equal($input.val(), "", "input value is reset");
    assert.equal(selectBox.option("value"), null, "widget value is reset");
});

QUnit.testInActiveWindow("value should be restored after the focusout when selection was not changed", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "not actual");
        return;
    }

    var items = ["first", "second"],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            opened: true,
            value: items[0]
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input);

    $input.get(0).focus();
    keyboard.keyDown(KEY_DOWN);
    assert.equal($input.val(), "second", "value has been changed");

    $input.trigger("blur");
    assert.equal($input.val(), "first", "value has been restored");
});

QUnit.test("value should be restored after the drop down button pressed when selection was not changed", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "not actual");
        return;
    }

    var items = ["first", "second"],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            opened: true,
            value: items[0]
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        $dropDownButton = $selectBox.find(toSelector(DX_DROP_DOWN_BUTTON)),
        keyboard = keyboardMock($input);

    keyboard.keyDown(KEY_DOWN);
    assert.equal($input.val(), "second", "value has been changed");

    $dropDownButton.trigger("dxclick");
    assert.equal($input.val(), "first", "value has been restored");
});


QUnit.module("keyboard navigation 'TAB' button", moduleSetup);

QUnit.test("T309987 - item should not be changed on the 'tab' press", function(assert) {
    var items = ["first", "second"],
        value = items[1],
        $selectBox = $("#selectBox").dxSelectBox({
            items: items,
            value: value
        }),
        $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        instance = $selectBox.dxSelectBox("instance"),
        keyboard = keyboardMock($input);

    $input.focus();
    instance.open();
    keyboard.press("tab");

    assert.equal(instance.option("value"), value);
});

QUnit.test("First item is not selected when edit is disabled", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: false,
        searchEnabled: false,
        opened: true,
        dataSource: ["1", "2", "3"]
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard.keyDown("tab");

    assert.equal($selectBox.dxSelectBox("option", "value"), null, "was selected first item and be set");
});

QUnit.test("If no influence on selectBox, 'input' should be empty after 'tab' key pressed", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        dataSource: ["a", "b", "c"],
        searchEnabled: true,
        opened: false,
        value: null
    });
    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focus();
    instance.option("opened", true);

    keyboardMock($input)
        .keyDown("tab");

    assert.equal($input.val(), "", "input is empty");
    assert.equal(instance.option("value"), null, "value is empty");
});

QUnit.test("After typing a couple letters of search criteria value should be set to input text (searchEnabled='true' acceptCustomValue='true')", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        dataSource: ["United States of America", "Uruguay", "Uzbekistan", "Vanuatu"],
        searchEnabled: true,
        acceptCustomValue: true,
        searchTimeout: 0,
        opened: true
    });

    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focus();

    keyboardMock($input)
        .type("an")
        .keyDown("tab")
        .change();

    assert.equal($input.val(), "an", "input value is correct");
    assert.equal(instance.option("value"), "an", "value is correct");
});

QUnit.test("After highlighting item and pressing 'tab' it should be chosen", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $element = $("#selectBox").dxSelectBox({
        dataSource: ["United States of America", "Uruguay", "Uzbekistan", "Vanuatu"],
        searchEnabled: true,
        opened: true,
        applyValueMode: "instantly"
    });

    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focus();

    keyboardMock($input)
        .keyDown("down")
        .keyDown("down")
        .keyDown("down")
        .keyDown("tab");

    assert.equal($input.val(), "Uzbekistan", "input value is correct");
    assert.equal(instance.option("value"), "Uzbekistan", "value is correct");
});

QUnit.test("Text should not be reset after press tab", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        dataSource: ["United States of America", "Uruguay", "Uzbekistan", "Vanuatu"],
        acceptCustomValue: false,
        value: "Uruguay"
    });

    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input)
        .keyDown("tab");

    assert.equal($input.val(), "Uruguay", "input value is correct");
    assert.equal(instance.option("value"), "Uruguay", "value is correct");
});

QUnit.test("Text should not be reset after press tab if popup is opened", function(assert) {
    var $element = $("#selectBox").dxSelectBox({
        dataSource: ["United States of America", "Uruguay", "Uzbekistan", "Vanuatu"],
        acceptCustomValue: false,
        value: "Uruguay",
        opened: true
    });

    var instance = $element.dxSelectBox("instance");
    var $input = $element.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    $input.focus();

    keyboardMock($input)
        .keyDown("tab");

    assert.equal($input.val(), "Uruguay", "input value is correct");
    assert.equal(instance.option("value"), "Uruguay", "value is correct");
});

QUnit.test("the 'Tab' key press should clear input selection", function(assert) {
    var items = ["aaa", "aab", "acc"];
    var $element = $("#selectBox").dxSelectBox({
        dataSource: items,
        acceptCustomValue: false,
        searchEnabled: true,
        searchMode: "startswith",
        searchTimeout: 0
    });

    var keyboard = keyboardMock($element.find(toSelector(TEXTEDITOR_INPUT_CLASS)), true)
        .focus()
        .type(items[0][0])
        .press('tab');

    var caret = keyboard.caret();
    assert.equal(caret.start, caret.end, "the input has no selection");
});

QUnit.testInActiveWindow("the 'tab' key press should focus the 'apply' button if the input is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    var items = [1, 2, 3],
        $element = $("#selectBox").dxSelectBox({
            dataSource: items,
            applyValueMode: "useButtons",
            opened: true
        }),
        instance = $element.dxSelectBox("instance"),
        $applyButton = instance._popup._wrapper().find(".dx-popup-done.dx-button");

    keyboardMock($element.find(toSelector(TEXTEDITOR_INPUT_CLASS)), true)
        .focus()
        .press("tab");

    assert.ok(instance.option("opened"), "popup is still opened");
    assert.ok($applyButton.hasClass(STATE_FOCUSED_CLASS), "the apply button is focused");
});


QUnit.module("acceptCustomValue mode", moduleSetup);

QUnit.test("input value can be edited when acceptCustomValue=true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true
    });
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input).type("test");
    assert.equal($input.val(), "test", "value typed in input");
});

QUnit.test("value set to custom value in input", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true
    });
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input).type("test").change();
    assert.equal($selectBox.dxSelectBox("option", "value"), "test", "value typed in input");
});

QUnit.testInActiveWindow("searching values in selectbox when acceptCustomValue=true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        searchEnabled: true,
        searchTimeout: 0,
        dataSource: ["a", "b", "c", "ab", "bb", "ac"],
        displayExpr: "this"
    });
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    keyboardMock($input).type("a");

    this.clock.tick();

    assert.equal($selectBox.dxSelectBox("option", "opened"), true, "value typed in input");
    assert.deepEqual($(".dx-list").dxList("option", "items"), ["a", "ab", "ac"], "items filtered");
});

QUnit.test("press enter key sets value when acceptCustomValue=true", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        dataSource: ["1", "2", "3"]
    });
    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    var keyboard = keyboardMock($input);

    keyboard
        .type("0")
        .keyUp(KEY_ENTER)
        .change();

    assert.equal($selectBox.dxSelectBox("option", "value"), "0", "0 value was be set");
});

QUnit.test("drop list should contain all items when input value is not empty", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        acceptCustomValue: true,
        dataSource: ["a", "b"],
        searchTimeout: 0
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));
    keyboardMock($input).type("a");

    $($input).trigger("dxclick");
    $($input).trigger("dxclick"); // NOTE: open again
    this.clock.tick();
    assert.deepEqual($(".dx-list").dxList("option", "items"), ["a", "b"], "all items");
});

QUnit.test("value must appear in the INPUT ​​after removal of value with searchEnabled='true'", function(assert) {
    var $selectBox = $("#selectBox").dxSelectBox({
        searchEnabled: true,
        dataSource: ["a", "b", "c"],
        searchTimeout: 0,
        opened: true
    });

    var $input = $selectBox.find(toSelector(TEXTEDITOR_INPUT_CLASS));

    var $item = $(toSelector(LIST_ITEM_CLASS)).eq(1);
    $($item).trigger("dxclick");
    assert.equal($input.val(), "b", "item was chosen");

    keyboardMock($input)
        .press("end")
        .press("backspace");

    assert.equal($input.val(), "", "input value is clear");

    $item = $(toSelector(LIST_ITEM_CLASS)).eq(1);
    $($item).trigger("dxclick");
    assert.equal($input.val(), "b", "item should be choose after click on list item");
});

QUnit.testInActiveWindow("dxSelectBox should not filter a dataSource when the widget disposing (T535861)", function(assert) {
    var instance = $("#selectBox").dxSelectBox({
            dataSource: [1, 2],
            acceptCustomValue: true,
            searchEnabled: true,
            onCustomItemCreating: function(e) {
                $(e.element).remove();
                e.customItem = "";
            }
        }).dxSelectBox("instance"),
        $input = instance.$element().find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($input),
        filterDataSourceStub = sinon.stub(instance, "_filterDataSource");

    keyboard
        .focus()
        .type("t")
        .change();

    assert.ok(filterDataSourceStub.notCalled, "dataSource didn't filter when widget disposed");
});


QUnit.module("focus policy", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#selectBox").dxSelectBox({
            focusStateEnabled: true,
            items: [1, 2, 3]
        });
        this.instance = this.$element.dxSelectBox("instance");
        this.$input = this.$element.find(toSelector(TEXTEDITOR_INPUT_CLASS));
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("filtering is reset when open control with keyboard", function(assert) {
    this.instance.option({
        searchEnabled: true,
        searchTimeout: 0,
        items: ["a", "b", "c"]
    });

    var $input = this.$element.find(toSelector(TEXTEDITOR_INPUT_CLASS)),
        kb = keyboardMock($input);

    kb.type("a").press("esc");
    $($input).trigger($.Event("keydown", { which: 40, altKey: true }));
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($.trim($(toSelector(LIST_ITEM_CLASS)).text()), "a", "filter should not be cleared before focusout");

    $input.focusout();
    this.instance.option("opened", false);
    $($input).trigger($.Event("keydown", { which: 40, altKey: true }));
    this.clock.tick(TIME_TO_WAIT);
    assert.equal($.trim($(toSelector(LIST_ITEM_CLASS)).text()), "abc", "no filtering");
});

QUnit.test("input keep focus when popup is opened by click on button", function(assert) {
    var $arrow = this.$element.find(toSelector(TEXTEDITOR_BUTTONS_CONTAINER_CLASS));

    this.$input.focusin();
    assert.ok(this.$element.hasClass(STATE_FOCUSED_CLASS), "element is focused");

    $arrow.focusin();
    $($arrow).trigger("dxclick");
    assert.ok(this.$element.hasClass(STATE_FOCUSED_CLASS), "element is steel focused");
});

// T409774
QUnit.test("widget disposing in focusOut event handler", function(assert) {
    var focusOutCallCount = 0;

    this.instance.option({
        searchEnabled: true,
        onFocusOut: function(e) {
            focusOutCallCount++;
            $(e.element).remove();
        }
    });

    var $input = this.$element.find("input");

    $input.focusin();

    // act
    $input.focusout();

    // assert
    assert.equal(focusOutCallCount, 1, "onFocusOut called once");
});

QUnit.test("selectbox should not focus disabled item after the search", function(assert) {
    this.instance.option({
        searchEnabled: true,
        opened: true,
        searchTimeout: 0,
        displayExpr: "text",
        items: [{ text: "a" }, { text: "b", disabled: true }, { text: "b1" }]
    });

    // act
    var $input = this.$element.find("input");
    keyboardMock($input).type("b");

    this.clock.tick(TIME_TO_WAIT);
    var $item = $(toSelector(LIST_ITEM_CLASS)).eq(1);

    // assert
    assert.ok($item.hasClass(STATE_FOCUSED_CLASS), "first non disabled item is focused");
});

QUnit.test("After focus a selectBox and type a char exception should not be throw", function(assert) {
    this.instance.option({
        dataSource: [1, 2, 3],
        searchEnabled: true,
        searchTimeout: 0
    });

    try {
        var $input = this.$element.find("input");
        $input.focusin();

        keyboardMock($input).type("b");
        $($input).trigger("change");

        assert.ok(true, "test was passed without exception");
    } catch(e) {
        assert.ok(false, "Exception: " + e);
    }
});
