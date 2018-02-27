"use strict";

var $ = require("jquery"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config"),
    List = require("ui/list");

require("ui/list");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="list"></div>';

    $("#qunit-fixture").html(markup);
});

var LIST_CLASS = "dx-list",
    LIST_ITEM_CLASS = "dx-list-item",
    LIST_GROUP_CLASS = "dx-list-group",
    LIST_GROUP_HEADER_CLASS = "dx-list-group-header",
    LIST_GROUP_BODY_CLASS = "dx-list-group-body";

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
        showNextButton: true
    }).dxList("instance");
    var nextButton = $(".dx-list-next-button ", this.element);

    assert.equal(nextButton.length, 1, "nextButton is showed");
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

