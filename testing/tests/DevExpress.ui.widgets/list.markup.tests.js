var $ = require("jquery"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config"),
    List = require("ui/list");

require("ui/list");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="list"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="templated-list">\
            <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var LIST_CLASS = "dx-list",
    LIST_ITEM_CLASS = "dx-list-item",
    LIST_GROUP_CLASS = "dx-list-group",
    LIST_GROUP_HEADER_CLASS = "dx-list-group-header",
    LIST_GROUP_BODY_CLASS = "dx-list-group-body",
    LIST_ITEM_BEFORE_BAG_CLASS = "dx-list-item-before-bag";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

QUnit.module("List markup");

QUnit.test("rendering empty message for empty list", function(assert) {
    var element = $("#list").dxList();
    assert.equal(element.find(".dx-empty-message").length, 1, "empty message was rendered");
});

QUnit.test("default markup", function(assert) {
    var element = $("#list").dxList({ items: ["0", "1"] });
    assert.ok(element.hasClass(LIST_CLASS));

    var items = element.find(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 2);
    assert.ok(items.eq(0).hasClass(LIST_ITEM_CLASS));
    assert.ok(items.eq(1).hasClass(LIST_ITEM_CLASS));
    assert.equal($.trim(items.text()), "01", "all items rendered");
});

QUnit.test("itemTemplate default", function(assert) {
    var element = $("#list").dxList({
        items: ["a", "b"],
        itemTemplate: function(item, index) {
            return index + ": " + item;
        }
    });

    var item = element.find(toSelector(LIST_ITEM_CLASS));

    assert.equal(item.eq(0).text(), "0: a");
    assert.equal(item.eq(1).text(), "1: b");
});

QUnit.test("itemTemplate returning string", function(assert) {
    var element = $("#list").dxList({
        items: ["a", "b"],
        itemTemplate: function(item, index) {
            return index + ": " + item;
        }
    });

    var item = element.find(toSelector(LIST_ITEM_CLASS));

    assert.equal(item.eq(0).text(), "0: a");
    assert.equal(item.eq(1).text(), "1: b");
});

QUnit.test("itemTemplate returning jquery", function(assert) {
    var element = $("#list").dxList({
        items: ["a"],
        itemTemplate: function(item, index) {
            return $("<span class='test' />");
        }
    });

    var item = element.children();
    assert.ok(item.find("span.test").length);
});

QUnit.test("rendering empty message for empty grouplist", function(assert) {
    var element = $("#list").dxList({
        grouped: true
    });
    assert.equal(element.find(".dx-empty-message").length, 1, "empty message was rendered");
});

QUnit.test("groupTemplate default", function(assert) {
    var element = $("#list").dxList({
        items: [
            {
                key: "group1",
                items: ["0", "1"]
            },
            {
                key: "group2",
                items: ["2"]
            }
        ],
        grouped: true
    });

    var groups = element.find(toSelector(LIST_GROUP_CLASS));
    assert.equal(groups.length, 2);

    var groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.equal(groupHeaders.length, 2);

    assert.equal(groupHeaders.eq(0).text(), "group1");
    assert.equal(groupHeaders.eq(1).text(), "group2");

    var items = element.find(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 3);
});

QUnit.test("groupTemplate returning string", function(assert) {
    var element = $("#list").dxList({
        items: [
            {
                key: "a",
                items: ["0", "1"]
            },
            {
                key: "b",
                items: ["2"]
            }
        ],

        grouped: true,

        groupTemplate: function(group, index, itemElement) {
            assert.equal(isRenderer(itemElement), !!config().useJQuery, "itemElement is correct");
            return index + ": " + group.key;
        }
    });

    var groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.equal(groupHeaders.eq(0).text(), "0: a");
    assert.equal(groupHeaders.eq(1).text(), "1: b");
});

QUnit.test("groupTemplate returning jquery", function(assert) {
    var element = $("#list").dxList({
        items: [
            {
                key: "a",
                items: ["0", "1"]
            }
        ],

        grouped: true,

        groupTemplate: function(group, index, element) {
            assert.equal(isRenderer(element), !!config().useJQuery, "element is correct");
            return $("<span />");
        }
    });

    var groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.ok(groupHeaders.find("span").length);
});

QUnit.test("items of group should be in a group body", function(assert) {
    var $element = $("#list").dxList({
        items: [{ key: "a", items: ["0"] }],
        grouped: true
    });

    var $group = $element.find("." + LIST_GROUP_CLASS),
        $groupBody = $group.children("." + LIST_GROUP_BODY_CLASS);

    assert.equal($groupBody.length, 1, "group items wrapper exists");
    assert.equal($groupBody.children("." + LIST_ITEM_CLASS).length, 1, "there are items in items wrapper");
});

QUnit.test("next button showing", function(assert) {
    $("#list").dxList({
        dataSource: {
            store: [1, 2, 3],
            pageSize: 2
        },
        pageLoadMode: "nextButton"
    }).dxList("instance");
    var nextButton = $(".dx-list-next-button ", this.element);

    assert.equal(nextButton.length, 1, "nextButton is showed");
});


QUnit.module("widget sizing render");

QUnit.test("constructor", function(assert) {
    var $element = $("#list").dxList({ items: [1, 2, 3, 4], width: 400 }),
        instance = $element.dxList("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element[0].style.width, 400 + "px", "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxList({ items: [1, 2, 3, 4] }),
        instance = $element.dxList("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element[0].style.width, 300 + "px", "outer width of the element must be equal to custom width");
});

QUnit.module("nested rendering");

QUnit.test("plain list with nested list should contain correct items", function(assert) {
    var $element = $("<div>").appendTo("#qunit-fixture");
    var instance = new List($element, {
        items: [1, 2],
        itemTemplate: function(data, index, container) {
            var $nestedElement = $("<div>").appendTo(container);
            new List($nestedElement, {
                items: [1, 2]
            });
        }
    });

    assert.equal(instance.itemElements().length, 2, "correct items count");
});

QUnit.test("grouped list with nested list should contain correct items", function(assert) {
    var $element = $("<div>").appendTo("#qunit-fixture");
    var instance = new List($element, {
        grouped: true,
        items: [{ key: 1, items: [1] }, { key: 2, items: [2] }],
        itemTemplate: function(data, index, container) {
            var $nestedElement = $("<div>").appendTo(container);
            new List($nestedElement, {
                grouped: true,
                items: [{ key: 1, items: [1] }, { key: 2, items: [2] }]
            });
        }
    });

    assert.equal(instance.itemElements().length, 2, "correct items count");
});

QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#list").dxList();
    assert.equal($element.attr("role"), "listbox", "aria role is correct");
});

QUnit.test("list item role", function(assert) {
    assert.expect(2);

    var items = [0, 1],
        $element = $("#list").dxList({ items: items });

    $element.find(".dx-list-item").each(function(i, item) {
        assert.equal($(item).attr("role"), "option", "role for item " + i + " is correct");
    });
});

QUnit.module("searching");

QUnit.test("searchEnabled", function(assert) {
    var $element = $("#list").dxList({
        dataSource: [1, 2, 3],
        searchEnabled: true
    });

    assert.ok($element.hasClass("dx-list-with-search"), "list with search");
    assert.ok($element.children().first().hasClass("dx-list-search"), "has search editor");
});

var STATIC_DELETE_BUTTON_CONTAINER_CLASS = "dx-list-static-delete-button-container",
    STATIC_DELETE_BUTTON_CLASS = "dx-list-static-delete-button",

    TOGGLE_DELETE_SWITCH_CLASS = "dx-list-toggle-delete-switch",
    TOGGLE_DELETE_SWITCH_ICON_CLASS = "dx-icon-toggle-delete",

    SELECT_CHECKBOX_CONTAINER_CLASS = "dx-list-select-checkbox-container",
    SELECT_CHECKBOX_CLASS = "dx-list-select-checkbox",

    SELECT_RADIO_BUTTON_CONTAINER_CLASS = "dx-list-select-radiobutton-container",
    SELECT_RADIO_BUTTON_CLASS = "dx-list-select-radiobutton",

    REORDER_HANDLE_CONTAINER_CLASS = "dx-list-reorder-handle-container",
    REORDER_HANDLE_CLASS = "dx-list-reorder-handle";

QUnit.module("decorators markup");

QUnit.test("list item markup, static delete decorator", function(assert) {
    var $list = $($("#list").dxList({
        items: ["0", "1", "2"],
        allowItemDeleting: true,
        itemDeleteMode: "static"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $button = $item.find(toSelector(STATIC_DELETE_BUTTON_CLASS));

    assert.equal($button.length, 1, "delete button was rendered");
    assert.ok($button.parent().hasClass(STATIC_DELETE_BUTTON_CONTAINER_CLASS), "delete button was rendered in correct container");
    assert.equal($list.find(toSelector(STATIC_DELETE_BUTTON_CLASS)).length, 3, "delete button was rendered for all items");
});

QUnit.test("list item markup, toggle delete decorator", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "toggle"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));
    assert.ok($deleteToggle.length, "toggle generated");
    assert.ok($deleteToggle.find(toSelector(TOGGLE_DELETE_SWITCH_ICON_CLASS)).length, "toggle icon generated");
});

QUnit.test("list item markup, item select decorator", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        showSelectionControls: true,
        selectionMode: "multiple"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $checkboxContainer = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)),
        $checkbox = $checkboxContainer.children(toSelector(SELECT_CHECKBOX_CLASS));

    assert.ok($checkboxContainer.hasClass(SELECT_CHECKBOX_CONTAINER_CLASS), "container has proper class");
    assert.ok($checkbox.hasClass("dx-checkbox"), "select generated");
});

QUnit.test("list item markup, item select decorator with single selection mode", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        showSelectionControls: true,
        selectionMode: "single"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $radioButtonContainer = $item.children(toSelector(SELECT_RADIO_BUTTON_CONTAINER_CLASS)),
        $radioButton = $radioButtonContainer.children(toSelector(SELECT_RADIO_BUTTON_CLASS));

    assert.ok($radioButton.hasClass("dx-radiobutton"), "radio button generated");
});

QUnit.test("render selectAll item when showSelectedAll is true, item select decorator with selectAll selection mode", function(assert) {
    var $list = $($("#list").dxList({
        items: [0],
        showSelectionControls: true,
        selectionMode: "all",
        selectAllText: "Test"
    }));

    var $multipleContainer = $list.find(".dx-list-select-all");
    assert.equal($multipleContainer.length, 1, "container for SelectAll rendered");
    assert.equal($multipleContainer.text(), "Test", "select all rendered");
    var $checkbox = $multipleContainer.find(".dx-checkbox");
    assert.equal($checkbox.length, 1, "checkbox rendered");
});

QUnit.test("list item markup should be correct, reordering decorator", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $handleContainer = $item.children(toSelector(REORDER_HANDLE_CONTAINER_CLASS)),
        $handle = $handleContainer.children(toSelector(REORDER_HANDLE_CLASS));

    assert.equal($handleContainer.length, 1, "container generated");
    assert.equal($handle.length, 1, "handle generated");
});

QUnit.test("displayExpr option should work", assert => {
    var $list = $("#list").dxList({
            items: [{ name: "Item 1", id: 1 }],
            displayExpr: "name"
        }),
        $items = $list.find(toSelector(LIST_ITEM_CLASS));

    assert.strictEqual($items.text(), "Item 1", "displayExpr works");
});
