"use strict";

var $ = require("jquery"),
    TagBox = require("ui/tag_box"),
    devices = require("core/devices"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    ArrayStore = require("data/array_store"),
    CustomStore = require("data/custom_store"),
    messageLocalization = require("localization/message"),
    DataSource = require("data/data_source/data_source").DataSource,
    fx = require("animation/fx"),
    browser = require("core/utils/browser"),
    dataQuery = require("data/query");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="tagBox"></div>';

    $("#qunit-fixture").html(markup);
});

var LIST_CLASS = "dx-list",
    LIST_ITEM_CLASS = "dx-list-item",
    LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
    TEXTBOX_CLASS = "dx-texteditor-input",
    EMPTY_INPUT_CLASS = "dx-texteditor-empty",
    TAGBOX_TAG_CONTAINER_CLASS = "dx-tag-container",
    TAGBOX_TAG_CONTENT_CLASS = "dx-tag-content",
    TAGBOX_TAG_CLASS = "dx-tag",
    TAGBOX_MULTI_TAG_CLASS = "dx-tagbox-multi-tag",
    TAGBOX_TAG_REMOVE_BUTTON_CLASS = "dx-tag-remove-button",
    TAGBOX_SINGLE_LINE_CLASS = "dx-tagbox-single-line",
    TAGBOX_POPUP_WRAPPER_CLASS = "dx-tagbox-popup-wrapper",
    TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = "dx-tagbox-default-template",
    TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = "dx-tagbox-custom-template",

    FOCUSED_CLASS = "dx-state-focused",

    TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;

var KEY_TAB = 9,
    KEY_ENTER = 13,
    KEY_ESC = 27,
    KEY_DOWN = 40;

var TIME_TO_WAIT = 500;

var moduleSetup = {
    beforeEach: function() {
        TagBox.defaultOptions({ options: { deferRendering: false } });
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};


QUnit.module("rendering", moduleSetup);

QUnit.test("rendering", function(assert) {
    var items = [1, 2, 3];

    var $element = $("#tagBox")
            .dxTagBox({
                items: items
            }),
        instance = $element.dxTagBox("instance"),
        $tagContainer = $element.find("." + TAGBOX_TAG_CONTAINER_CLASS);

    assert.equal($tagContainer.length, 1, "tag container is added");

    instance.option("value", [1, 2]);
    var tags = $element.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal(tags.length, 2, "tags are rendered");
});

QUnit.test("custom tags rendering", function(assert) {
    var $element = $("#tagBox")
            .dxTagBox({
                value: [1, 2]
            });

    var tags = $element.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal(tags.length, 2, "tags are rendered");
});

QUnit.test("popup wrapper gets the 'dx-tagbox-popup-wrapper' class", function(assert) {
    $("#tagBox").dxTagBox({
        opened: true
    }).dxTagBox("instance");

    var $popupWrapper = $(".dx-popup-wrapper").eq(0);
    assert.ok($popupWrapper.hasClass(TAGBOX_POPUP_WRAPPER_CLASS), "the class is added");
});

QUnit.test("empty class should be added if no one tags selected", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3]
        }),
        tagBox = $tagBox.dxTagBox("instance");
    assert.ok($tagBox.hasClass(EMPTY_INPUT_CLASS), "empty class present");

    tagBox.option("value", [1, 2]);
    assert.ok(!$tagBox.hasClass(EMPTY_INPUT_CLASS), "empty class not present");
    tagBox.option("value", []);
    assert.ok($tagBox.hasClass(EMPTY_INPUT_CLASS), "empty class present");
});

QUnit.test("skip gesture event class attach only when popup is opened", function(assert) {
    var SKIP_GESTURE_EVENT_CLASS = "dx-skip-gesture-event";
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3]
    });

    assert.equal($tagBox.hasClass(SKIP_GESTURE_EVENT_CLASS), false, "skip gesture event class was not added when popup is closed");

    $tagBox.dxTagBox("option", "opened", true);
    assert.equal($tagBox.hasClass(SKIP_GESTURE_EVENT_CLASS), true, "skip gesture event class was added after popup was opened");

    $tagBox.dxTagBox("option", "opened", false);
    assert.equal($tagBox.hasClass(SKIP_GESTURE_EVENT_CLASS), false, "skip gesture event class was removed after popup was closed");
});

QUnit.test("tags container should use native click (T400944)", function(assert) {
    var NATIVE_CLICK_CLASS = "dx-native-click";
    var $tagContainer = $("#tagBox").dxTagBox()
        .find("." + TAGBOX_TAG_CONTAINER_CLASS);

    assert.ok($tagContainer.hasClass(NATIVE_CLICK_CLASS));
});


QUnit.module("select element");

QUnit.test("a select element should be rendered", function(assert) {
    var $select = $("#tagBox").dxTagBox()
        .find("select");

    assert.equal($select.length, 1, "select element is rendered");
});

QUnit.test("the select element should has the 'multiple' attribute", function(assert) {
    var select = $("#tagBox").dxTagBox()
        .find("select")
        .get(0);

    assert.ok(select.hasAttribute("multiple"), "the select element has the 'multiple' attribute");
});

QUnit.test("the select element should be invisible", function(assert) {
    var $select = $("#tagBox").dxTagBox()
        .find("select");

    assert.notOk($select.is(":visible"), "select in not visible");
});

QUnit.test("an option element should be rendered for each selected item", function(assert) {
    var items = ["eins", "zwei", "drei"],
        $options = $("#tagBox")
            .dxTagBox({
                items: items,
                value: [items[0], items[2]]
            })
            .find("option");

    assert.equal($options.length, 2, "option elements count is correct");
});

QUnit.test("option elements should have correct 'value' attributes", function(assert) {
    var items = ["eins", "zwei", "drei"],
        value = [items[0], items[2]],
        $options = $("#tagBox")
            .dxTagBox({
                items: items,
                value: value
            })
            .find("option");

    $options.each(function(index) {
        assert.equal(this.value, value[index], "the 'value' attribute is correct for the option " + index);
    });
});

QUnit.test("option elements should have the 'selected' attributes", function(assert) {
    var items = ["eins", "zwei", "drei"],
        value = [items[0], items[2]],
        $options = $("#tagBox")
            .dxTagBox({
                items: items,
                value: value
            })
            .find("option");

    $options.each(function(index) {
        assert.ok(this.hasAttribute("selected"), "the 'selected' attribute is set for the option " + index);
    });
});

QUnit.test("option elements should have displayed text of selected items as value if the 'valueExpr' option is 'this'", function(assert) {
    var items = [{ id: 1, text: "eins" }, { id: 2, text: "zwei" }, { id: 3, text: "drei" }],
        value = [items[0], items[2]],
        $options = $("#tagBox")
            .dxTagBox({
                items: items,
                value: value,
                valueExpr: "this",
                displayExpr: "text"
            })
            .find("option");

    assert.equal($options.length, value.length, "all options are rendered");

    $options.each(function(index) {
        assert.equal(this.value, value[index].text, "the 'value' attribute is set for the option " + index);
    });
});

QUnit.test("option elements should be updated on value change", function(assert) {
    var items = [{ id: 1, text: "eins" }, { id: 2, text: "zwei" }, { id: 3, text: "drei" }],
        initialValue = [1],
        newValue = [2, 3],
        $tagBox = $("#tagBox").dxTagBox({
            items: items,
            value: initialValue,
            valueExpr: "id",
            displayExpr: "text"
        }),
        instance = $tagBox.dxTagBox("instance");

    instance.option("value", newValue);

    var $options = $tagBox.find("option");
    assert.equal($options.length, 2, "options are updated");

    $options.each(function(index) {
        assert.equal(this.value, newValue[index], "the 'value' attribute is correct for the option " + index);
    });
});


QUnit.module("the 'name' option");

QUnit.test("widget select element should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name",
        $element = $("#tagBox").dxTagBox({
            name: expectedName
        }),
        $select = $element.find("select");

    assert.equal($select.attr("name"), expectedName, "the select element 'name' attribute has correct value");
});


QUnit.module("list selection", moduleSetup);

QUnit.test("selected item class", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3, 4],
        value: [1, 4]
    });

    this.clock.tick(TIME_TO_WAIT);
    var $listItems = $tagBox.find("." + LIST_ITEM_CLASS);

    assert.equal($listItems.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), true, "first item has selected class");
    assert.equal($listItems.eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), false, "second item does not have selected class");
    assert.equal($listItems.eq(2).hasClass(LIST_ITEM_SELECTED_CLASS), false, "third item does not have selected class");
    assert.equal($listItems.eq(3).hasClass(LIST_ITEM_SELECTED_CLASS), true, "fourth item has selected class");
});

QUnit.test("Selected item should be unselected on click", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            dataSource: [1, 2, 3],
            value: [1, 2],
            opened: true
        }),
        tagBox = $tagBox.dxTagBox("instance"),
        $list = tagBox._$list;

    $list.find("." + LIST_ITEM_SELECTED_CLASS).eq(0).trigger("dxclick");
    assert.deepEqual(tagBox.option("value"), [2], "value is correct");
});

QUnit.test("Selected item should be removed from list if 'hideSelectedItems' option is true", function(assert) {
    var dataSource = [1, 2, 3, 4, 5],
        $tagBox = $("#tagBox").dxTagBox({
            dataSource: dataSource,
            opened: true,
            hideSelectedItems: true
        }),
        tagBox = $tagBox.dxTagBox("instance"),
        $list = tagBox._$list;

    assert.equal($list.find("." + LIST_ITEM_CLASS).length, dataSource.length, "items count is correct");

    tagBox.open();
    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.equal($list.find("." + LIST_ITEM_CLASS).length, dataSource.length - 1, "items count is correct after the first item selection");

    tagBox.open();
    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.equal($list.find("." + LIST_ITEM_CLASS).length, dataSource.length - 2, "items count is correct after the second item selection");

    tagBox.open();
    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.equal($list.find("." + LIST_ITEM_CLASS).length, dataSource.length - 3, "items count is correct after the third item selection");

    tagBox.open();
    $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).eq(0).trigger("dxclick");
    assert.equal($list.find("." + LIST_ITEM_CLASS).length, dataSource.length - 2, "items count is correct after the first tag is removed");

    tagBox.open();
    $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).eq(0).trigger("dxclick");
    assert.equal($list.find("." + LIST_ITEM_CLASS).length, dataSource.length - 1, "items count is correct after the second tag is removed");
});

QUnit.test("Items should be hidden on init if hideSelectedItems is true", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4, 5],
            opened: true,
            hideSelectedItems: true,
            value: [1, 2, 3]
        }),
        tagBox = $tagBox.dxTagBox("instance");

    assert.equal(tagBox._list.option("items").length, 2, "items was restored");
});

QUnit.test("Items should not be changed if one of them is hidden", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4, 5],
            opened: true,
            hideSelectedItems: true,
            onValueChanged: function(e) {
                e.component.option("items", e.component.option("items"));
            }
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.option("value", [1, 2, 3]);
    tagBox.option("value", []);

    assert.equal(tagBox.option("items").length, 5, "items was restored");
});

QUnit.module("tags", moduleSetup);

QUnit.test("add/delete tags", function(assert) {
    var items = [1, 2, 3];

    var $element = $("#tagBox").dxTagBox({
        items: items
    });

    this.clock.tick(TIME_TO_WAIT);
    assert.ok($element.find("." + LIST_ITEM_CLASS).length === 3, "found 3 items");

    $element.find("." + LIST_ITEM_CLASS).first().trigger("dxclick");
    assert.equal($element.find("." + TAGBOX_TAG_CLASS).length, 1, "tag is added");

    $element.find("." + LIST_ITEM_CLASS).first().trigger("dxclick");
    assert.equal($element.find("." + TAGBOX_TAG_CLASS).length, 0, "tag is removed");

    $element.find("." + LIST_ITEM_CLASS).last().trigger("dxclick");
    assert.equal($element.find("." + TAGBOX_TAG_CLASS).length, 1, "another tag is added");

    var $close = $element.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).last();
    $close.trigger("dxclick");
    assert.equal($element.find("." + TAGBOX_TAG_CLASS).length, 0, "tag is removed");
});

QUnit.test("tags should remove after clear values", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: [1, 2, 3],
        value: [1]
    });

    assert.equal($tagBox.find(".dx-tag").length, 1, "one item rendered");

    $tagBox.dxTagBox("option", "value", []);
    assert.equal($tagBox.find(".dx-tag").length, 0, "zero item rendered");
});

QUnit.test("tagBox field is not cleared on blur", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: [1]
    });

    this.clock.tick(TIME_TO_WAIT);
    var $input = $tagBox.find("input");
    $input.trigger("dxclick");
    $input.trigger("blur");

    var $tags = $tagBox.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal($tags.is(":visible"), true, "tag is rendered");
});

QUnit.test("tag should have correct value when item value is zero", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [0, 1, 2, 3],
        opened: true
    });

    this.clock.tick(TIME_TO_WAIT);

    var $listItems = $("." + LIST_ITEM_CLASS);
    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");

    assert.equal($.trim($tagBox.find("." + TAGBOX_TAG_CONTAINER_CLASS).text()), "01", "selected first and second items");
});

QUnit.test("'text' option should have correct value when item value is zero", function(assert) {
    var tagBox = $("#tagBox").dxTagBox({
        value: [0],
        items: [0, 1]
    }).dxTagBox("instance");

    assert.equal(tagBox.option("text"), "0");
});

QUnit.test("tag should have correct value when item value is an empty string", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["", 1, 2, 3],
        opened: true
    });

    this.clock.tick(TIME_TO_WAIT);

    var $listItems = $("." + LIST_ITEM_CLASS);
    $listItems.eq(0).trigger("dxclick");

    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 1, "empty string value was successfully selected");
});

QUnit.test("TagBox has right content after items setting", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        value: [1],
        valueExpr: "id",
        displayExpr: "name"
    });

    var instance = $tagBox.dxTagBox("instance");
    instance.option("items", [{ id: 1, name: "First" }, { id: 2, name: "Second" }]);

    var content = $tagBox.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal(content.text(), "First", "tags has right content");
});

QUnit.test("TagBox has right tag order if byKey return value in wrong order", function(assert) {
    var data = [1, 2],
        timeToWait = 500,
        count = 2;

    var $tagBox = $("#tagBox").dxTagBox({
        value: [1, 2],
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var res = $.Deferred();
                    setTimeout(function() { res.resolve(data); }, timeToWait * 4);
                    return res.promise();
                },
                byKey: function(key) {
                    var res = $.Deferred();
                    setTimeout(function() { res.resolve(key); }, timeToWait * count--);
                    return res.promise();
                }
            }),
            paging: false
        })
    });
    this.clock.tick(timeToWait * 3);

    var content = $tagBox.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal(content.eq(0).text(), "1", "first tag has right content");
    assert.equal(content.eq(1).text(), "2", "second tag has right content");
});

QUnit.test("removing tags after clicking the 'clear' button", function(assert) {
    var $element = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        showClearButton: true,
        opened: true
    });

    var $listItems = $("." + LIST_ITEM_CLASS);

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");
    $element.find(".dx-clear-button-area").trigger("dxclick");
    $listItems.eq(2).trigger("dxclick");

    assert.equal($element.find("." + TAGBOX_TAG_CLASS).length, 1, "one item is chosen");
});


QUnit.module("multi tag support", {
    beforeEach: function() {
        this.getTexts = function($tags) {
            return $tags.map(function(_, tag) { return $(tag).text(); }).toArray();
        },
        this.clock = sinon.useFakeTimers();
        messageLocalization.load({
            "en": {
                "dxTagBox-seleced": "{0} selected",
                "dxTagBox-moreSeleced": "{0} more"
            }
        });
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("tagBox should display one tag after limit overflow", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2
        }),
        $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.equal($tag.length, 1, "only one tag should be displayed");
    assert.ok($tag.hasClass(TAGBOX_MULTI_TAG_CLASS), "the tag has correct css class");
    assert.equal($tag.text(), "3 selected", "tag has correct text");
});

QUnit.test("tagBox should display one tag after new tags was added", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.option("value", [1, 2]);
    tagBox.option("value", [1, 2, 3]);

    var $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.equal($tag.length, 1, "only one tag should be displayed");
    assert.ok($tag.hasClass(TAGBOX_MULTI_TAG_CLASS), "the tag has correct css class");
    assert.equal($tag.text(), "3 selected", "tag has correct text");
});

QUnit.test("tagBox should display multiple tags after value was changed", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.option("value", [1, 2]);

    var $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);
    assert.equal($tag.length, 2, "two tags should be displayed");
    assert.deepEqual(this.getTexts($tag), ["1", "2"], "tags have correct text");
});

QUnit.test("tagBox should deselect all items after multi tag removed", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2
        }),
        tagBox = $tagBox.dxTagBox("instance"),
        $tagRemoveButton = $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).eq(0);

    $tagRemoveButton.trigger("dxclick");

    assert.deepEqual(tagBox.option("value"), [], "value was cleared");
    assert.deepEqual(tagBox.option("selectedItems"), [], "selectedItems was cleared");
    assert.strictEqual(tagBox.option("selectedItem"), null, "selectedItem was cleared");
    assert.strictEqual(tagBox.option("selectedIndex"), undefined, "selectedIndex was cleared");
    assert.strictEqual($tagBox.find("." + TAGBOX_TAG_CLASS).length, 0, "there are no tags in the field");
});

QUnit.test("tags should be recalculated after maxTagCount option changed", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4]
        }),
        tagBox = $tagBox.dxTagBox("instance");

    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 3, "3 tags by default");

    tagBox.option("maxTagCount", 2);
    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 1, "1 tag when limit is over");

    tagBox.option("maxTagCount", 3);
    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 3, "3 tags when limit is not over");

    tagBox.option("value", [1, 2, 3, 4]);
    tagBox.option("maxTagCount", undefined);
    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 4, "4 tags when option was disabled");
});

QUnit.test("multitag should be rendered always when maxTagCount is 0", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            maxTagCount: 0,
            value: [1]
        }),
        $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.equal($tag.length, 1, "one tag is selected");
    assert.ok($tag.hasClass(TAGBOX_MULTI_TAG_CLASS), "one selected tag is multitag");
});

QUnit.test("onMultitagPreparing option", function(assert) {
    assert.expect(4);

    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2,
            onMultiTagPreparing: function(e) {
                assert.equal(e.component.NAME, "dxTagBox", "component is correct");
                assert.ok(e.multiTagElement.hasClass(TAGBOX_MULTI_TAG_CLASS), "element is correct");
                assert.deepEqual(e.selectedItems, [1, 2, 4], "selectedItems are correct");
                e.text = "custom text";
            }
        }),
        $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.deepEqual($tag.text(), "custom text", "custom text is displayed");
});

QUnit.test("onMultitagPreparing option change", function(assert) {
    assert.expect(4);

    var onMultiTagPreparing = function(e) {
        assert.equal(e.component.NAME, "dxTagBox", "component is correct");
        assert.ok(e.multiTagElement.hasClass(TAGBOX_MULTI_TAG_CLASS), "element is correct");
        assert.deepEqual(e.selectedItems, [1, 2, 4], "selectedItems are correct");
        e.text = "custom text";
    };

    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.option("onMultiTagPreparing", onMultiTagPreparing);

    var $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);
    assert.deepEqual($tag.text(), "custom text", "custom text is displayed");
});

QUnit.test("multi tag should not be rendered if e.cancel is true", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2,
            onMultiTagPreparing: function(e) {
                e.cancel = true;
            }
        }),
        $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.equal($tag.length, 3, "3 tags was rendered");
    assert.deepEqual(this.getTexts($tag), ["1", "2", "4"], "tags have correct text");
});

QUnit.test("multi tag should be rendered after max number of tags if showMultiTagOnly is false", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2,
            showMultiTagOnly: false
        }),
        $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.equal($tag.length, 2, "2 tags rendered");
    assert.deepEqual(this.getTexts($tag), ["1", "2 more"], "tags have correct text");
});

QUnit.test("tags should be rerendered after showMultiTagOnly option changed", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2,
            showMultiTagOnly: false
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.option("showMultiTagOnly", true);

    var $tag = $tagBox.find("." + TAGBOX_TAG_CLASS);

    assert.equal($tag.length, 1, "1 tag rendered");
    assert.deepEqual($tag.text(), "3 selected", "text is correct");
});

QUnit.test("multi tag should deselect overflow tags only when showMultiTagOnly is false", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxTagCount: 2,
            showMultiTagOnly: false
        }),
        tagBox = $tagBox.dxTagBox("instance"),
        $multiTag = $tagBox.find("." + TAGBOX_MULTI_TAG_CLASS);

    $multiTag.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).trigger("dxclick");

    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 2, "only 2 tags remain");
    assert.deepEqual(tagBox.option("value"), [1, 2], "value is correct");
    assert.deepEqual(this.getTexts($tagBox.find("." + TAGBOX_TAG_CLASS)), ["1", "2"], "tags have correct text");
});

QUnit.test("tagbox should show count of selected items when only first page is loaded", function(assert) {
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            store: new ArrayStore(items),
            paginate: true,
            pageSize: 5
        },
        maxTagCount: 2,
        opened: true,
        selectAllMode: "page",
        showSelectionControls: true
    });

    $(".dx-list-select-all-checkbox").trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($tagBox.dxTagBox("option", "value").length, 5, "first page is selected");
    assert.equal($tagBox.find("." + TAGBOX_MULTI_TAG_CLASS).text(), "5 selected", "text is correct");
});



QUnit.module("the 'value' option", moduleSetup);

QUnit.test("value should be passed by value (not by reference)", function(assert) {
    var value = ["item1"];
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["item1", "item2"],
        value: value
    });

    $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).trigger("dxclick");

    assert.deepEqual(value, ["item1"], "outer value is not changed");
});

QUnit.test("the 'value' option should accept null (T379677)", function(assert) {
    var $element = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: null
    });

    assert.equal($element.find("." + TAGBOX_TAG_CLASS).length, 0, "no tags are rendered");
});

QUnit.test("reset()", function(assert) {
    var tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: [1]
    }).dxTagBox("instance");

    tagBox.reset();
    assert.deepEqual(tagBox.option("value"), [], "Value should be reset");
});


QUnit.module("the 'displayExpr' option", moduleSetup);

QUnit.test("displayExpr", function(assert) {
    var items = [{ name: "one", value: 1 },
                    { name: "two", value: 2 }];

    var $element = $("#tagBox")
            .dxTagBox({
                items: items,
                displayExpr: "name",
                valueExpr: "value"
            }),
        instance = $element.dxTagBox("instance");

    instance.option("value", [1]);
    var $tag = $element.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal($tag.length, 1, "tag is rendered");
    assert.equal($tag.text(), "one", "tag render displayExpr");
});

QUnit.test("displayExpr change at runtime", function(assert) {
    var items = [{ name: "one", value: 1 },
                    { name: "two", value: 2 }];

    var $element = $("#tagBox")
            .dxTagBox({
                items: items,
                displayExpr: "value",
                valueExpr: "value"
            }),
        instance = $element.dxTagBox("instance");

    instance.option("value", [1]);
    instance.option("displayExpr", "name");
    var $tag = $element.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal($tag.text(), "one", "tag render displayValue");
});


QUnit.module("the 'onValueChanged' option", moduleSetup);

QUnit.test("onValueChanged provides selected values", function(assert) {
    var value,
        $element = $("#tagBox").dxTagBox({
            items: [1, 2, 3],
            onValueChanged: function(args) {
                value = args.value;
            }
        });

    this.clock.tick(TIME_TO_WAIT);

    $element.find("." + LIST_ITEM_CLASS).eq(0).trigger("dxclick");
    assert.deepEqual(value, [1], "only first item is selected");

    $element.find("." + LIST_ITEM_CLASS).eq(2).trigger("dxclick");
    assert.deepEqual(value, [1, 3], "two items are selected");
});

QUnit.test("onValueChanged should not be fired on first render", function(assert) {
    var valueChangeActionSpy = sinon.spy();
    $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: [1],
        onValueChanged: valueChangeActionSpy
    });

    this.clock.tick(TIME_TO_WAIT);

    assert.equal(valueChangeActionSpy.called, false, "onValueChanged was not fired");
});

QUnit.test("onValueChanged should be fired when dxTagBox is readOnly", function(assert) {
    var valueChangeActionSpy = sinon.spy();

    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: [1],
        readOnly: true,
        onValueChanged: valueChangeActionSpy
    });

    $tagBox.dxTagBox("instance").option("value", [3]);

    assert.ok(valueChangeActionSpy.called, "onValueChanged was fired");
});

QUnit.test("onValueChanged should be fired when dxTagBox is disabled", function(assert) {
    var valueChangeActionSpy = sinon.spy();

    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: [1],
        disabled: true,
        onValueChanged: valueChangeActionSpy
    });

    $tagBox.dxTagBox("instance").option("value", []);

    assert.ok(valueChangeActionSpy.called, "onValueChanged was fired");
});

QUnit.test("onValueChanged provide selected value after removing values", function(assert) {
    var value;

    var $element = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        onValueChanged: function(args) {
            value = args.value;
        }
    });

    this.clock.tick(TIME_TO_WAIT);
    $element.find("." + LIST_ITEM_CLASS).eq(0).trigger("dxclick");
    $element.find("." + LIST_ITEM_CLASS).eq(2).trigger("dxclick");
    $element.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).eq(0).trigger("dxclick");

    assert.deepEqual(value, [3], "item is deleted");
});

QUnit.test("T338728 - onValueChanged action should contain correct previousValues", function(assert) {
    var spy = sinon.spy(),
        $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3],
            value: [1, 2],
            onValueChanged: spy
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.option("value", [2]);
    assert.deepEqual(spy.args[0][0].previousValue, [1, 2], "the 'previousValue' argument is correct");
});

QUnit.test("onValueChanged should not be fired on the 'backspace' key press if the editor is already empty (T385450)", function(assert) {
    var spy = sinon.spy(),
        $tagBox = $("#tagBox").dxTagBox({
            onValueChanged: spy
        }),
        $input = $tagBox.find("input");

    keyboardMock($input).press('backspace');
    assert.notOk(spy.called, "onValueChanged is not fired");
});


QUnit.module("the 'onCustomItemCreating' option", moduleSetup);

QUnit.test("using the 'onCustomItemCreating' option", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
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
        $input = $tagBox.find(".dx-texteditor-input"),
        keyboard = keyboardMock($input),
        customValue = "Custom value";

    keyboard
        .type(customValue)
        .press('enter');

    var $tags = $tagBox.find(".dx-tag");

    assert.deepEqual($tagBox.dxTagBox("option", "value"), ["value " + customValue]);
    assert.equal($tags.length, 1, "tag is added");
    assert.equal($tags.eq(0).text(), "display " + customValue);
});

QUnit.test("the 'onCustomItemCreating' option with Deferred", function(assert) {
    var deferred = $.Deferred(),
        $tagBox = $("#tagBox").dxTagBox({
            acceptCustomValue: true,
            displayExpr: "display",
            valueExpr: "value",
            onCustomItemCreating: function() {
                return deferred.promise();
            }
        }),
        $input = $tagBox.find(".dx-texteditor-input"),
        keyboard = keyboardMock($input),
        customValue = "Custom value";

    keyboard
        .type(customValue)
        .press('enter');

    assert.deepEqual($tagBox.dxTagBox("option", "value"), [], "the 'value' array is correct until deferred is resolved");
    assert.equal($tagBox.find(".dx-tag").length, 0, "no tags are rendered until deferred is resolved");

    deferred.resolve({
        display: "display " + customValue,
        value: "value " + customValue
    });

    var $tags = $tagBox.find(".dx-tag");

    assert.deepEqual($tagBox.dxTagBox("option", "value"), ["value " + customValue], "the 'value' array is correct");
    assert.equal($tags.length, 1, "tag is added");
    assert.equal($tags.eq(0).text(), "display " + customValue, "added tag text is correct");
});

QUnit.test("the selected list items should be correct if custom item is in list", function(assert) {
    var items = [1, 2, 3],
        $tagBox = $("#tagBox").dxTagBox({
            acceptCustomValue: true,
            items: items
        }),
        tagBox = $tagBox.dxTagBox("instance"),
        $input = $tagBox.find(".dx-texteditor-input"),
        customValue = "Custom value";

    tagBox.option("onCustomItemCreating", function(e) {
        var items = tagBox.option("items").slice();
        items.push(e.text);
        tagBox.option("items", items);
        return e.text;
    });

    keyboardMock($input)
        .type(customValue)
        .press('enter');

    tagBox.open();
    var list = tagBox._list;

    assert.deepEqual(list.option("items"), items.concat([customValue]), "list items are changed");
    assert.deepEqual(list.option("selectedItems"), [customValue], "selected items are correct");
});

QUnit.test("tags should have a right display texts for acceptCustomValue and preset value", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [],
            value: ["one"],
            acceptCustomValue: true
        }),
        $input = $tagBox.find(".dx-texteditor-input"),
        keyboard = keyboardMock($input),
        customValue = "two";

    keyboard
        .type(customValue)
        .press('enter');

    var $tags = $tagBox.find(".dx-tag");

    assert.equal($tags.length, 2, "tag is added");
    assert.equal($tags.eq(0).text(), "one");
    assert.equal($tags.eq(1).text(), "two");
});


QUnit.module("placeholder");

QUnit.test("placeholder should appear after tag deleted", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: ['item1', 'item2', 'item3'],
        value: ['item1']
    });

    var $clearButton = $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS);

    $clearButton.trigger("dxclick");

    var $placeholder = $tagBox.find(".dx-placeholder");

    assert.notEqual($placeholder.css("display"), 'none', "placeholder was appear");
    assert.equal($placeholder.is(":visible"), true, "placeholder was appear");
});

QUnit.test("placeholder is hidden after tag is removed if the search value is exist", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3],
            value: [1],
            searchEnabled: true
        }),
        $placeholder = $tagBox.find(".dx-placeholder"),
        $input = $tagBox.find(".dx-texteditor-input");

    keyboardMock($input).type("123");
    $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).trigger("dxclick");
    assert.notOk($placeholder.is(":visible"), "placeholder is hidden");
});


QUnit.module("tag template", moduleSetup);

QUnit.test("tag template should have correct arguments", function(assert) {
    var items = [{ text: 1 }, { text: 2 }];

    $("#tagBox").dxTagBox({
        items: items,
        valueExpr: "this",
        value: [items[0]],
        tagTemplate: function(tagData, tagElement) {
            assert.equal(tagData, items[0], "correct data is passed");
            assert.equal(tagElement.hasClass(TAGBOX_TAG_CLASS), true, "correct element passed");
        }
    });
});

QUnit.test("tag template should get item in arguments even if the 'displayExpr' option is specified", function(assert) {
    var items = [{ id: 1, text: "one" }, { id: 2, text: "two" }];

    $("#tagBox").dxTagBox({
        items: items,
        displayExpr: "text",
        value: [items[1]],
        tagTemplate: function(tagData, tagElement) {
            assert.deepEqual(tagData, items[1], "correct data is passed");
        }
    });
});

QUnit.test("value should be correct if the default tag template is used and the displayExpr is specified", function(assert) {
    var items = [{ id: 1, text: "one" }];

    var $element = $("#tagBox").dxTagBox({
            items: items,
            displayExpr: "text",
            valueExpr: "this",
            opened: true
        }),
        instance = $element.dxTagBox("instance"),
        $list = instance._list.element();

    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.deepEqual(instance.option("value"), [items[0]], "the 'value' option is correct");
});

QUnit.test("selected list items should be correct if the default tag template is used and the displayExpr is specified", function(assert) {
    var items = [{ id: 1, text: "one" }];

    var $element = $("#tagBox").dxTagBox({
            items: items,
            displayExpr: "text",
            valueExpr: "this",
            opened: true
        }),
        list = $element.dxTagBox("instance")._list,
        $list = list.element();

    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.deepEqual(list.option("selectedItems"), [items[0]], "the 'selectedItems' list option is correct");
});


QUnit.module("showSelectionControls", moduleSetup);

QUnit.test("showSelectionControls", function(assert) {
    $("#tagBox").dxTagBox({
        items: [1],
        opened: true,
        showSelectionControls: true
    });

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(".dx-checkbox").length, 2, "selectAll checkbox and checkbox on item added");
});

QUnit.test("click on selected item causes item uncheck", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        opened: true,
        showSelectionControls: true
    });

    this.clock.tick(TIME_TO_WAIT);

    pointerMock($(".dx-list-item").eq(1)).start().click();
    pointerMock($(".dx-list-item").eq(2)).start().click();

    pointerMock($(".dx-list-item").eq(2)).start().click();

    assert.deepEqual($tagBox.dxTagBox("option", "value"), [2], "value is reset");
});

QUnit.test("click on selected item causes item uncheck", function(assert) {
    $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        value: [1, 2],
        opened: true,
        showSelectionControls: true
    });

    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(".dx-checkbox-checked").length, 2, "values selected on render");
});

QUnit.test("selectAll element should be rendered correctly when opening tagBox", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            store: new ArrayStore([1, 2, 3]),
            pageSize: 2
        },
        showSelectionControls: true
    });

    this.clock.tick(TIME_TO_WAIT);

    $tagBox.dxTagBox("option", "opened", true);
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(".dx-list-select-all").length, 1, "selectAll item is rendered");
});

QUnit.test("changing selectAll state with selectAllMode 'allPages'", function(assert) {
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            store: new ArrayStore(items),
            paginate: true,
            pageSize: 5
        },
        selectAllMode: "allPages",
        showSelectionControls: true
    });
    this.clock.tick(TIME_TO_WAIT);

    $tagBox.dxTagBox("option", "opened", true);
    this.clock.tick(TIME_TO_WAIT);
    $(".dx-list-select-all-checkbox").trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);

    assert.deepEqual($tagBox.dxTagBox("option", "value"), items, "items is selected");
});

QUnit.test("items check state reset after deleting of the value", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3, 4],
        value: [1, 2],
        opened: true,
        showSelectionControls: true
    });

    var tagBox = $tagBox.dxTagBox("instance");
    tagBox.option("value", [2]);

    var $checkedItems = $(".dx-checkbox-checked");

    assert.equal($checkedItems.length, 1, "only one item highlighted");
});

QUnit.test("onValueChanged should be fired once when showSelectionControls is true", function(assert) {
    var fired = 0;
    $("#tagBox").dxTagBox({
        items: [1, 2, 3, 4],
        value: [1, 2],
        showSelectionControls: true,
        onValueChanged: function(e) {
            fired++;
        }
    });

    this.clock.tick(TIME_TO_WAIT);

    assert.equal(fired, 0, "event was not fired");

    $(".dx-list-select-all-checkbox").trigger("dxclick");
    assert.equal(fired, 1, "event fired once");
});

QUnit.test("correct value after deselecting all items", function(assert) {
    var items = [1, 2, 3, 4];
    var tagBox = $("#tagBox").dxTagBox({
        items: items,
        value: items,
        showSelectionControls: true
    }).dxTagBox("instance");

    this.clock.tick(TIME_TO_WAIT);

    $(".dx-list-select-all-checkbox").trigger("dxclick");
    assert.deepEqual(tagBox.option("value"), [], "value is an empty array");
});

QUnit.test("onValueChanged was not raised when time after time popup opening (showSelectionControls = true)", function(assert) {
    var fired = 0;

    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3, 4],
        showSelectionControls: true,
        opened: true,
        onValueChanged: function(e) {
            fired++;
        }
    });

    this.clock.tick(TIME_TO_WAIT);

    var $listItems = $(".dx-list-item");

    $listItems.first().trigger("dxclick");

    $tagBox.dxTagBox("instance").option("opened", false);
    $tagBox.dxTagBox("instance").option("opened", true);

    assert.equal(fired, 1, "event was fired once");
});

QUnit.test("tag rendered after click on selections control", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        showSelectionControls: true,
        opened: true
    });

    this.clock.tick(TIME_TO_WAIT);

    var $listItems = $(".dx-list-item");

    $listItems.first().trigger("dxclick");

    assert.equal($tagBox.find(".dx-tag").length, 1, "tag rendered");
});

QUnit.test("tag should not be removed when editor looses focus", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        showSelectionControls: true,
        focusStateEnabled: true,
        searchEnabled: true,
        searchTimeout: 0,
        opened: true
    });

    $tagBox.find("input").trigger("focusin");
    $(".dx-list-item").first().trigger("dxclick");
    $tagBox.find("input").trigger("focusout");

    assert.equal($tagBox.find(".dx-tag").length, 1, "tag is present");
});

QUnit.test("list 'select all' checkbox state should be correct if all items are selected on init and data source paging is enabled", function(assert) {
    var items = function() {
        var items = [];
        for(var i = 0, n = 200; i < n; i++) {
            items.push(i);
        }
        return items;
    }();

    $("#tagBox").dxTagBox({
        value: items.slice(),
        showSelectionControls: true,
        dataSource: {
            paginate: true,
            pageSize: 100,
            requireTotalCount: true,
            store: items
        },
        opened: true
    });

    var selectAllCheck = $(".dx-list-select-all-checkbox").dxCheckBox("instance");
    assert.equal(selectAllCheck.option("value"), true, "the 'select all' checkbox is checked");
});

QUnit.test("T378748 - the tab key press should not lead to error while navigating in list", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3],
            showSelectionControls: true,
            opened: true
        }),
        $input = $tagBox.find(".dx-texteditor-input");

    keyboardMock($input)
        .focus()
        .press('down')
        .press('tab');

    assert.expect(0);
});


QUnit.module("keyboard navigation", {
    _init: function(options) {
        this.$element = $("<div>")
            .appendTo("#qunit-fixture")
            .dxTagBox(options);
        this.instance = this.$element.data("dxTagBox");
        this.$input = this.$element.find("." + TEXTBOX_CLASS);
        this.keyboard = keyboardMock(this.$input);
    },
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this._init({
            focusStateEnabled: true,
            items: [1, 2, 3],
            value: [1, 2],
            opened: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this._init(options);
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test("backspace", function(assert) {
    assert.expect(2);

    this.keyboard
        .focus()
        .keyDown("backspace");
    assert.deepEqual(this.instance.option("value"), [1], "last value has been deleted");

    this.keyboard
        .keyDown("backspace");
    assert.deepEqual(this.instance.option("value"), [], "values is empty");
});

QUnit.test("backspace UI", function(assert) {
    assert.expect(2);

    this.keyboard
        .focus()
        .keyDown("backspace");
    assert.equal($("." + LIST_ITEM_SELECTED_CLASS).length, 1, "list selected items has been modified");

    this.keyboard
        .keyDown("backspace");
    assert.equal($("." + LIST_ITEM_SELECTED_CLASS).length, 0, "there are no selected items in list");
});

QUnit.test("TagBox should not select items when list is not shown", function(assert) {
    assert.expect(1);

    this.instance.option({
        value: [],
        deferRendering: false,
        opened: false
    });

    this.keyboard
        .keyDown("down");
    assert.deepEqual(this.instance.option("value"), [], "downArrow should not select value when the list is hidden");
});

QUnit.test("T309987 - value should not be changed when moving focus by the 'tab' key", function(assert) {
    var items = ["first", "second", "third", "fourth"],
        value = [items[1], items[3]];

    this.reinit({
        items: items,
        value: value,
        opened: true
    });

    this.keyboard
        .focus()
        .press("tab");

    assert.deepEqual(this.instance.option("value"), value, "the value is correct");
});

QUnit.testInActiveWindow("Value should be correct when not last item is selected by 'tab'", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }
    var items = ["first", "second", "third"],
        value = [items[0], items[2]];

    this.reinit({
        focusStateEnabled: true,
        items: items,
        value: value,
        opened: true
    });

    this.keyboard
        .focus()
        .keyDown("down")
        .press("tab");

    assert.deepEqual(this.instance.option("value"), [items[0], items[2], items[1]], "all items are selected");
});

QUnit.test("First item is not selected when edit is disabled", function(assert) {
    this.reinit({
        value: [],
        acceptCustomValue: false,
        searchEnabled: false,
        opened: true,
        dataSource: ["1", "2", "3"]
    });

    this.keyboard
        .keyDown("tab");
    assert.deepEqual(this.instance.option("value"), [], "was selected first item and be set");
});

QUnit.test("Enter and escape key press prevent default when popup is opened", function(assert) {
    this.reinit({
        items: [0, 1, 2],
        value: [1],
        focusStateEnabled: true,
        opened: true,
        acceptCustomValue: true
    });

    var prevented = 0;

    this.$element.on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    this.keyboard
        .keyDown("enter");
    assert.equal(prevented, 1, "defaults prevented on enter");

    prevented = 0;
    this.instance.option("opened", true);

    this.keyboard
        .keyDown("esc");
    assert.equal(prevented, 1, "defaults prevented on escape keys");
});

QUnit.test("Enter and escape key press prevent default when popup is opened and field edit enabled is not set", function(assert) {
    this.reinit({
        items: [0, 1, 2],
        value: [1],
        focusStateEnabled: true,
        opened: true
    });

    var prevented = 0;

    this.$element.on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    this.keyboard
        .keyDown("enter");
    assert.equal(prevented, 1, "defaults prevented on enter");

    prevented = 0;
    this.instance.option("opened", false);

    this.keyboard
        .keyDown("enter");
    assert.equal(prevented, 0, "defaults not prevented on enter when popup is closed");
});

QUnit.test("input value should be cleared", function(assert) {
    this.reinit({
        items: [1, 2],
        opened: true
    });

    this.keyboard
        .keyUp(KEY_DOWN)
        .keyUp(KEY_ENTER);

    assert.equal(this.$input.val(), "", "value was not rendered");
});

QUnit.test("tagBox selects item on enter key", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    this.reinit({
        items: [1, 2, 3],
        focusStateEnabled: true,
        opened: true
    });

    this.keyboard
        .keyDown(KEY_ENTER)
        .keyDown(KEY_DOWN)
        .keyDown(KEY_ENTER);

    var $tags = this.$element.find("." + TAGBOX_TAG_CONTENT_CLASS);
    assert.equal($tags.text(), "1", "rendered first item");
});

QUnit.test("the 'enter' key should not add/remove tags if the editor is closed (T378292)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }
    this.reinit({
        items: [1, 2, 3],
        focusStateEnabled: true,
        opened: true
    });

    this.keyboard
        .focus()
        .press("down");

    this.instance.close();

    this.keyboard
        .press("enter");
    assert.deepEqual(this.instance.option("value"), [], "value is not changed");
});

QUnit.test("onValueChanged should be fired once on the 'tab' key press (T385415)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var spy = sinon.spy();

    this.instance.option("onValueChanged", spy);

    this.keyboard
        .press("down")
        .press("down")
        .press("tab");

    assert.equal(spy.callCount, 1, "onValueChanged event is fired once");
});

QUnit.test("value should be changed correctly on 'tab' if there is a focused item in the drop down list (T386900)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var expectedValue = this.instance.option("items");

    this.keyboard
        .focus()
        .press("down")
        .press("down")
        .press("tab");

    assert.deepEqual(this.instance.option("value"), expectedValue, "the value is correct");
});

QUnit.testInActiveWindow("the 'apply' button should be focused on the 'tab' key press if the input is focused and showSelectionControls if false (T389453)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.option({
        applyValueMode: "useButtons",
        opened: true
    });

    this.keyboard
        .focus()
        .press("tab");

    var $applyButton = this.instance._popup._wrapper().find(".dx-button.dx-popup-done");
    assert.ok($applyButton.hasClass("dx-state-focused"), "the apply button is focused");
});

QUnit.testInActiveWindow("the 'select all' checkbox should be focused on the 'tab' key press if the input is focused and showSelectionControls if true (T389453)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.option({
        showSelectionControls: true,
        applyValueMode: "useButtons",
        opened: true
    });

    keyboardMock(this.$element.find("input"))
        .focus()
        .press("tab");

    var $selectAllCheckbox = this.instance._popup._wrapper().find(".dx-list-select-all-checkbox");
    assert.ok($selectAllCheckbox.hasClass("dx-state-focused"), "the select all checkbox is focused");
});

QUnit.testInActiveWindow("the input should be focused on the 'shift+tab' key press if the select all checkbox is focused (T389453)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.option({
        showSelectionControls: true,
        applyValueMode: "useButtons",
        opened: true
    });

    var $selectAllCheckbox = this.instance._popup._wrapper().find(".dx-list-select-all-checkbox");

    $selectAllCheckbox
        .focus()
        .trigger($.Event("keydown", {
            which: KEY_TAB,
            shiftKey: true
        }));

    assert.ok(this.$element.hasClass("dx-state-focused"), "widget is focused");
});

QUnit.testInActiveWindow("popup should be closed on the 'esc' key press if the select all checkbox is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.option({
        showSelectionControls: true,
        applyValueMode: "useButtons",
        opened: true
    });

    var $selectAllCheckbox = this.instance._popup._wrapper().find(".dx-list-select-all-checkbox");

    $selectAllCheckbox
        .focus()
        .trigger($.Event("keydown", {
            which: KEY_ESC,
            shiftKey: true
        }));

    assert.ok(this.$element.hasClass("dx-state-focused"), "widget is focused");
    assert.notOk(this.instance.option("opened"), "popup is closed");
});


QUnit.module("keyboard navigation through tags", {
    _init: function() {
        this.instance = this.$element.dxTagBox("instance");
        this.$input = this.$element.find("input");
        this.keyboard = keyboardMock(this.$input, true);

        this.getTags = function() {
            return this.$element.find("." + TAGBOX_TAG_CLASS);
        };

        this.getFocusedTag = function() {
            return this.$element.find("." + TAGBOX_TAG_CLASS + "." + FOCUSED_CLASS);
        };
    },
    beforeEach: function() {
        var items = [1, 2, 3, 4];

        this.$element = $("#tagBox").dxTagBox({
            items: items,
            value: items,
            focusStateEnabled: true
        });

        this._init();
    },
    reinit: function(options) {
        this.$element = $("#tagBox").dxTagBox(options);
        this._init();
    }
});

QUnit.test("the last rendered tag should get 'focused' class after the 'leftArrow' key press", function(assert) {
    this.keyboard
        .focus()
        .press("left");

    var $lastTag = this.getTags().last();
    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag got the 'focused' class");
});

QUnit.test("the last rendered tag should get 'focused' class after the 'leftArrow' key press if field is editable", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .press("left");

    var $lastTag = this.getTags().last();
    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag got the 'focused' class");
});

QUnit.test("the first rendered tag should get 'focused' class after the 'rightArrow' key press", function(assert) {
    this.keyboard
        .focus()
        .press("right");

    var $firstTag = this.getTags().first();
    assert.ok($firstTag.hasClass(FOCUSED_CLASS), "the first tag got the 'focused' class");
});

QUnit.test("the 'focused' class should be moved to the previous tag after the 'leftArrow' key press", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left");

    var $lastTag = this.getTags().last(),
        $penultTag = $lastTag.prev();

    assert.notOk($lastTag.hasClass(FOCUSED_CLASS), "the last tag does not have the 'focused' class");
    assert.ok($penultTag.hasClass(FOCUSED_CLASS), "the penult tag has the 'focused' class");
});

QUnit.test("the 'focused' should remain on the first tag if the 'leftArrow' key is pressed", function(assert) {
    this.instance.option({
        items: [1],
        value: [1]
    });

    this.keyboard
        .focus()
        .press("left")
        .press("left");

    var $firstTag = this.getTags().first();
    assert.ok($firstTag.hasClass(FOCUSED_CLASS), "the first tag has the 'focused' class");
});

QUnit.test("the 'focused' class should be moved to the next tag after the 'rightArrow' key press", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left")
        .press("right");

    var $lastTag = this.getTags().last(),
        $penultTag = $lastTag.prev();

    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag has the 'focused' class");
    assert.notOk($penultTag.hasClass(FOCUSED_CLASS), "the penult tag does not have the 'focused' class");
});

QUnit.test("the 'focused' class should remain on the last tag if the 'rightArrow' key is pressed", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("right");

    var $lastTag = this.getTags().last();

    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag has does not have the 'focused' class");
    assert.notOk(this.$input.hasClass(FOCUSED_CLASS), "the 'tag focused' class should not be set on the input");
});

QUnit.test("the 'focused' class should be removed from the last tag if the 'rightArrow' key is pressed is field is editable", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .press("left")
        .press("right");

    var $lastTag = this.getTags().last();

    assert.notOk($lastTag.hasClass(FOCUSED_CLASS), "the last tag has does not have the 'focused' class");
    assert.notOk(this.$input.hasClass(FOCUSED_CLASS), "the 'tag focused' class should not be set on the input");
});

QUnit.test("it should be possible to move input caret after navigating through tags", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .press("left")
        .press("right");

    var event;
    this.$input.on("keydown", function(e) { event = e; });

    this.keyboard
        .press("right");

    var focusedTagsCount = this.getFocusedTag().length;

    assert.equal(focusedTagsCount, 0, "there are no focused tags");
    assert.notOk(event.isDefaultPrevented(), "the event default is not prevented, so the input caret move");
});

QUnit.test("typing symbols should not remove the 'focused' class from currently focused tag", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .type("a");

    var $lastTag = this.getTags().last();
    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag has the 'focused' class");
});

QUnit.test("typing symbols should remove the 'focused' class from currently focused tag if the field is editable", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .press("left")
        .type("a");

    var $focusedTags = this.getFocusedTag();
    assert.equal($focusedTags.length, 0, "no tags have the 'focused' class");
});

QUnit.test("the last tag should not be selected after the 'leftArrow' key press if the input caret is not at the start position", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .type("abc")
        .press("left");

    var $focusedTags = this.getFocusedTag();
    assert.equal($focusedTags.length, 0, "there are no focused tags");
});

QUnit.test("the input caret should not move while navigating through tags", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .type("aa")
        .press("home")
        .press("left")
        .press("left");

    var event;
    this.$input.on("keydown", function(e) { event = e; });

    this.keyboard
        .press("right");

    assert.ok(event.isDefaultPrevented(), "the event default is prevented, so the input caret did not move");
});

QUnit.test("the focused tag should be removed after pressing the 'backspace' key", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left");

    var expectedValue = this.instance.option("value").slice(),
        focusedTagIndex = this.getFocusedTag().index();

    expectedValue.splice(focusedTagIndex, 1);

    this.keyboard
        .press("backspace");

    var value = this.instance.option("value");
    assert.deepEqual(value, expectedValue, "the widget's value is correct");
});

QUnit.test("the focused tag should be removed after pressing the 'delete' key", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left");

    var expectedValue = this.instance.option("value").slice(),
        focusedTagIndex = this.getFocusedTag().index();

    expectedValue.splice(focusedTagIndex, 1);

    this.keyboard
        .press("del");

    var value = this.instance.option("value");
    assert.deepEqual(value, expectedValue, "the widget's value is correct");
});

QUnit.test("pressing any of 'backspace' or 'delete' keys while tag is focused should not affect on input value", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    var initialVal = "abc";

    this.$input.val(initialVal);

    this.keyboard
        .focus()
        .press("home")
        .press("left")
        .press("backspace");

    assert.equal(this.$input.val(), initialVal, "input value was not modified after pressing the 'backspace' key");

    this.keyboard
        .press("left");

    var event;
    this.$input.on("keydown", function(e) { event = e; });

    this.keyboard
        .press("del");

    assert.ok(event.isDefaultPrevented(), "the default is prevented after the 'delete' key press, so the input value is not modified");
});

QUnit.test("continuously removing tags with the 'backspace' key while input is focused", function(assert) {
    var expectedTagsCount = this.instance.option("value").length - 2;

    this.keyboard
        .focus()
        .press("backspace")
        .press("backspace");

    assert.equal(this.instance.option("value").length, expectedTagsCount, "tags are removed correctly");
});

QUnit.test("the previous tag is focused after the 'backspace' key press", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left");

    var $expectedFocusedTag = this.getFocusedTag().prev("." + TAGBOX_TAG_CLASS);

    this.keyboard
        .press("backspace");

    assert.ok($expectedFocusedTag.hasClass(FOCUSED_CLASS), "the previous tag is focused");
});

QUnit.test("there are no focused tags after removing the first tag with the help of the 'backspace' key", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left")
        .press("left")
        .press("left")
        .press("backspace");

    var focusedTagsCount = this.getFocusedTag().length;
    assert.equal(focusedTagsCount, 0, "there are no focused tags");
});

QUnit.test("there are no focused tags after pressing the 'backspace' key while input is focused", function(assert) {
    this.keyboard
        .focus()
        .press("backspace");

    var focusedTagsCount = this.getFocusedTag().length;
    assert.equal(focusedTagsCount, 0, "there are no focused tags");
});

QUnit.test("keyboard navigation should work after removing the last tag with the help of the 'backspace' key (T378397)", function(assert) {
    this.keyboard
        .focus()
        .press("right")
        .press("backspace")
        .press("right");

    var $lastTag = this.$element.find("." + TAGBOX_TAG_CLASS).first();
    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag is focused");
});

QUnit.test("the next tag is focused after the 'del' key press", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left");

    var $expectedFocusedTag = this.getFocusedTag().next("." + TAGBOX_TAG_CLASS);

    this.keyboard
        .press("del");

    assert.ok($expectedFocusedTag.hasClass(FOCUSED_CLASS), "the next tag is focused");
});

QUnit.test("there are no focused tags after removing the last tag with the help of the 'del' key", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("del");

    var focusedTagsCount = this.getFocusedTag().length;
    assert.equal(focusedTagsCount, 0, "there are no focused tags");
});

QUnit.test("keyboard navigation should work after removing the last tag with the help of the 'del' key (T378397)", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("del")
        .press("left");

    var $lastTag = this.$element.find("." + TAGBOX_TAG_CLASS).last();
    assert.ok($lastTag.hasClass(FOCUSED_CLASS), "the last tag is focused");
});

QUnit.test("the 'focused' class should be removed from the focused tag when the widget loses focus", function(assert) {
    this.keyboard
        .focus()
        .press("left");

    this.$input.trigger("focusout");

    var focusedTagsCount = this.getFocusedTag().length;
    assert.equal(focusedTagsCount, 0, "there are no focused tags");
});

QUnit.test("the should be no focused tags on when the widget gets focus", function(assert) {
    this.keyboard
        .focus()
        .press("left");

    this.$input
        .trigger("focusout")
        .trigger("focusin");

    var focusedTagsCount = this.getFocusedTag().length;
    assert.equal(focusedTagsCount, 0, "there are no focused tags");
});

QUnit.test("there should be no focused tags after changing value not by keyboard", function(assert) {
    this.keyboard
        .focus()
        .press("right");

    var currentValue = this.instance.option("value");
    this.instance.option("value", [currentValue[0]]);

    var focusedTagsCount = this.getFocusedTag().length;
    assert.equal(focusedTagsCount, 0, "there are no focused tags");
});

QUnit.test("navigating through tags in the RTL mode", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        rtlEnabled: true
    });

    this.keyboard
        .focus()
        .press("right");

    var $focusedTag = this.getFocusedTag();
    assert.equal($focusedTag.index(), 3, "correct tag is focused after the 'right' key press");

    this.keyboard
        .press("right");

    $focusedTag = this.getFocusedTag();
    assert.equal($focusedTag.index(), 2, "correct tag is focused after the 'right' key press");

    this.keyboard
        .press("left");

    $focusedTag = this.getFocusedTag();
    assert.equal($focusedTag.index(), 3, "correct tag is focused after the 'left' key press");
});

QUnit.test("navigating through tags in the RTL mode if the field is editable", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true,
        rtlEnabled: true
    });

    this.keyboard
        .focus()
        .press("right");

    var $focusedTag = this.getFocusedTag();
    assert.equal($focusedTag.index(), 3, "correct tag is focused after the 'right' key press");

    this.keyboard
        .press("right");

    $focusedTag = this.getFocusedTag();
    assert.equal($focusedTag.index(), 2, "correct tag is focused after the 'right' key press");

    this.keyboard
        .press("left");

    $focusedTag = this.getFocusedTag();
    assert.equal($focusedTag.index(), 3, "correct tag is focused after the 'left' key press");
});

QUnit.test("the input caret should not move while navigating through tags in the RTL mode", function(assert) {
    var items = [1, 2, 3, 4];
    this.reinit({
        items: items,
        value: items,
        focusStateEnabled: true,
        acceptCustomValue: true,
        rtlEnabled: true
    });

    this.keyboard
        .focus()
        .type("aa")
        .press("home")
        .press("right")
        .press("right");

    var event;
    this.$input.on("keydown", function(e) { event = e; });

    this.keyboard
        .press("left");

    assert.ok(event.isDefaultPrevented(), "the event default is prevented, so the input caret did not move");
});


QUnit.module("searchEnabled", moduleSetup);

QUnit.test("searchEnabled allows searching", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["test", "custom"],
        searchEnabled: true,
        searchTimeout: 0
    });

    this.clock.tick(TIME_TO_WAIT);

    var $input = $tagBox.find("input");
    keyboardMock($input).type("te");

    this.clock.tick(TIME_TO_WAIT);

    var $listItems = $(".dx-list-item");
    assert.equal($.trim($listItems.text()), "test", "items filtered");
});

QUnit.test("renders all tags after search", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["Moscow", "London"],
        searchEnabled: true,
        searchTimeout: 0,
        opened: true,
        value: ["Moscow"]
    });

    this.clock.tick();
    var $input = $tagBox.find("input");
    keyboardMock($input).type("Lon");

    this.clock.tick(TIME_TO_WAIT);

    $(".dx-list-item").eq(0).trigger("dxclick");

    var $tagContainer = $tagBox.find("." + TAGBOX_TAG_CONTAINER_CLASS);

    assert.equal($tagContainer.find("." + TAGBOX_TAG_CONTENT_CLASS).length, 2, "selected tags rendered");
    assert.equal($.trim($tagContainer.text()), "MoscowLondon", "selected values are rendered");
});

QUnit.test("input is positioned on the right of last tag", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["Moscow"],
        searchEnabled: true,
        width: 1000
    });

    var $input = $tagBox.find("input");
    var inputLeft = $input.offset().left;

    $tagBox.dxTagBox("option", "value", ["Moscow"]);
    this.clock.tick(TIME_TO_WAIT);

    assert.ok($input.offset().left > inputLeft, "input is moved to the right");
});

QUnit.test("size of input changes depending on search value length", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        searchEnabled: true
    });

    var $input = $tagBox.find("input");
    var inputWidth = $input.width();

    keyboardMock($input).type("te");

    assert.ok($input.width() > inputWidth, "input size increase");
});

QUnit.test("size of input is reset after selecting item", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        searchEnabled: true,
        items: ["test1", "test2"]
    });
    var $input = $tagBox.find("input");
    var initInputWidth = $input.width();

    $tagBox.dxTagBox("option", "value", ["test1"]);
    assert.roughEqual($tagBox.find("input").width(), initInputWidth, 0.1, "input width is not changed after selecting item");
});

QUnit.test("size of input is 1 when searchEnabled and editEnabled is false", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        searchEnabled: false,
        editEnabled: false
    });
    var $input = $tagBox.find("input");
    //NOTE: width should be 0.1 because of T393423
    assert.roughEqual($input.width(), 0.1, 0.1, "input has correct width");
});

QUnit.test("no placeholder when textbox is not empty", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        searchEnabled: true,
        placeholder: "placeholder"
    });

    keyboardMock($tagBox.find("input")).type("test");

    var $placeholder = $tagBox.find(".dx-placeholder");

    assert.ok($placeholder.is(":hidden"), "placeholder is hidden");
});

QUnit.test("the 'backspace' key press should remove text and preserve the widget's value", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        searchEnabled: true,
        dataSource: [1, 2, 3],
        value: [1, 2],
        focusStateEnabled: true
    });

    var tagBox = $tagBox.dxTagBox("instance");
    var $input = $tagBox.find("input");
    var keyboard = keyboardMock($input, true);

    keyboard
        .type("te")
        .press("end")
        .press("backspace");

    assert.equal($input.val(), "t", "input text is changed");
    assert.equal(tagBox.option("value").length, 2, "tags are not removed");
});

QUnit.test("deleting tag when input is not empty", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: [1, 2, 3],
        searchEnabled: true,
        searchTimeout: 0,
        value: [1, 2],
        opened: true
    });

    var $input = $tagBox.find("input");
    keyboardMock($input).type("3");

    this.clock.tick(TIME_TO_WAIT);

    var $close = $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).last();
    $close.trigger("dxclick");

    this.clock.tick(TIME_TO_WAIT);

    var $tagContainer = $tagBox.find("." + TAGBOX_TAG_CONTAINER_CLASS);
    assert.equal($tagContainer.text(), "1", "tags is refreshed correctly");
});

QUnit.test("list item obtained focus only after press on control key", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        searchEnabled: true,
        searchTimeout: 0,
        opened: true,
        focusStateEnabled: true
    });

    this.clock.tick(TIME_TO_WAIT);

    var $input = $tagBox.find(".dx-texteditor-input");

    keyboardMock($input).press("down");
    this.clock.tick(TIME_TO_WAIT);

    var $firstItemList = $(".dx-list-item").eq(0);
    assert.ok($firstItemList.hasClass(FOCUSED_CLASS), "first list item obtained focus");
});

QUnit.test("tagBox should not be opened after selecting item", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: [1, 2, 3],
        searchEnabled: true
    });

    var tagBox = $tagBox.dxTagBox("instance");

    var $input = $tagBox.find("input");
    keyboardMock($input).type("3");

    this.clock.tick(TIME_TO_WAIT);

    $(".dx-list-item").trigger("dxclick");

    this.clock.tick(TIME_TO_WAIT);

    assert.equal(tagBox.option("opened"), false, "widget closed");
});

QUnit.test("tagBox removeTag with searchEnabled when input is focused", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: [1, 2, 3],
        searchEnabled: true,
        value: [1]
    });

    var tagBox = $tagBox.dxTagBox("instance");

    var $removeTag = $tagBox.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS);
    var $input = $tagBox.find("input");

    var pointer = pointerMock($removeTag).start().down();
    $input.trigger("blur");
    pointer.up();

    assert.deepEqual(tagBox.option("value"), [], "tag was removed");
});

QUnit.test("tagBox set focused class with searchEnabled after press 'delete' key", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $tagBox = $("#tagBox").dxTagBox({
            dataSource: ['val-1', 'val-2', 'val-3', 'val-4'],
            searchEnabled: true,
            value: ['val-2', 'val-3'],
            opened: true,
            focusStateEnabled: true
        }),
        tagBox = $tagBox.dxTagBox("instance");

    this.clock.tick(TIME_TO_WAIT);

    var $input = $tagBox.find(".dx-texteditor-input"),
        keyboard = keyboardMock($input);

    keyboard
        .press("down");

    var $focusedItemList = tagBox._list.option("focusedElement");
    assert.ok($focusedItemList.hasClass(FOCUSED_CLASS), "list item obtained focus");

    keyboard
        .press("backspace");

    assert.ok($focusedItemList.hasClass(FOCUSED_CLASS), "list item save focus after press 'delete' key");
});

QUnit.test("remove tag by backspace", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["one", "two", "three"],
        value: ["one", "two"],
        searchEnabled: true,
        searchTimeout: 0
    });

    this.clock.tick(TIME_TO_WAIT);

    var $input = $tagBox.find("input");
    var keyboard = keyboardMock($input);

    keyboard.press("backspace");
    this.clock.tick(TIME_TO_WAIT);

    keyboard.press("backspace");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($tagBox.find("." + TAGBOX_TAG_CLASS).length, 0, "all tags removed");
});

QUnit.test("removing tag by backspace should not load data from DS", function(assert) {
    var data = ["one", "two", "three"],
        loadedCount = 0
    ;
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            load: function() {
                loadedCount++;
                return data;
            },
            byKey: function(index) {
                return data[index];
            }
        },
        value: ["one", "two"],
        searchEnabled: true,
        searchTimeout: 0
    });

    this.clock.tick(TIME_TO_WAIT);
    assert.equal(loadedCount, 1, "data source loaded data");

    var $input = $tagBox.find("input");
    var keyboard = keyboardMock($input);

    keyboard.press("backspace");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal(loadedCount, 1, "data source did not load data again");
});

QUnit.test("search after selection first item", function(assert) {
    var items = [{ text: "item1" }, { text: "item2" }];
    var $tagBox = $("#tagBox").dxTagBox({
        items: items,
        displayExpr: "text",
        searchEnabled: true,
        searchExpr: "text",
        searchTimeout: 0
    });

    var $input = $tagBox.find("input");
    var keyboard = keyboardMock($input);

    keyboard.type("It");
    this.clock.tick(TIME_TO_WAIT);
    $(".dx-list-item").eq(0).trigger("dxclick");

    keyboard.type("It");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($input.val(), "It", "input value is correct");
});

QUnit.test("input should not be cleared after the 'value' option change", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: ["one", "two"],
            searchEnabled: true,
            searchTimeout: 0
        }),
        $input = $tagBox.find("input"),
        searchValue = "123";

    $input.val(searchValue);
    $tagBox.dxTagBox("option", "value", ["one"]);

    assert.equal($input.val(), searchValue, "input is clear");
});

QUnit.test("input should be cleared after list item is clicked", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            items: ["one", "two"],
            searchEnabled: true,
            searchTimeout: 0,
            opened: true
        }),
        $input = $tagBox.find("input");

    $input.val("one");
    $(".dx-list-item").eq(0).trigger("dxclick");

    assert.equal($input.val(), "", "input is clear");
});

QUnit.test("input should not be cleared after tag is removed", function(assert) {
    var items = [1, 2, 3],
        $element = $("#tagBox").dxTagBox({
            items: items,
            value: items,
            searchEnabled: true
        }),
        $input = $element.find("input"),
        searchValue = "123";

    $input.val(searchValue);
    $element.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS).eq(0).trigger("dxclick");

    assert.equal($input.val(), searchValue, "search value is not cleared");
});

QUnit.testInActiveWindow("input should be cleared after widget focus out", function(assert) {
    var items = [1, 2, 3],
        $element = $("#tagBox").dxTagBox({
            items: items,
            searchEnabled: true,
            focusStateEnabled: true
        }),
        $input = $element.find("input");

    $input.val("123");
    $input.trigger("focusout");

    assert.equal($input.val(), "", "search value is cleared");
});

QUnit.test("search was work if acceptCustomValue is set to true", function(assert) {
    var $element = $("#tagBox").dxTagBox({
        dataSource: ["item 1", "element 1", "item 2"],
        searchEnabled: true,
        searchTimeout: 0,
        acceptCustomValue: true
    });

    var $input = $element.find("input");
    keyboardMock($input).type("1");

    $input.trigger("change");
    var listItems = $(".dx-list-item");

    assert.equal(listItems.length, 2, "search was performed");
});

QUnit.test("tag should be added after enter press key if popup was not opened early", function(assert) {
    var $element = $("#tagBox").dxTagBox({
            dataSource: ["q", "er", "fsd", "fd"],
            searchEnabled: true,
            searchTimeout: 0,
            acceptCustomValue: true,
            focusStateEnabled: true,
            opened: false,
            deferRendering: true
        }),
        $input = $element.find("input");

    $input.focus();

    keyboardMock($input)
        .type("123")
        .keyDown("enter");

    assert.equal($element.find(".dx-tag").length, 1, "tag is added");
});

QUnit.test("popup should be repaint after change height of input", function(assert) {
    var $element = $("#tagBox").dxTagBox({
        dataSource: ["Antigua and Barbuda", "Albania", "American Samoa"],
        value: ["Antigua and Barbuda", "Albania"],
        searchTimeout: 0,
        acceptCustomValue: true,
        searchEnabled: true,
        focusStateEnabled: true,
        opened: true,
        width: 280
    });

    var instance = $element.dxTagBox("instance");
    var handlerStub = sinon.stub(instance._popup, "repaint");

    var $input = $element.find("input");
    $input.focus();

    keyboardMock($input).type("American Samo");

    assert.ok(handlerStub.called, "repaint was fired");
});

QUnit.test("the input size should change if autocompletion is Enabled (T378411)", function(assert) {
    var items = ["Antigua and Barbuda", "Albania"];
    var $element = $("#tagBox").dxTagBox({
        dataSource: items,
        searchEnabled: true,
        autocompletionEnabled: true,
        searchMode: "startswith"
    });
    var $input = $element.find(".dx-texteditor-input");

    keyboardMock($input)
        .type("a");
    this.clock.tick(TIME_TO_WAIT);
    assert.equal(parseInt($input.attr("size")), items[0].length + 2, "input size is changed for substitution");
});

QUnit.test("filter should be reset after the search value clearing (T385456)", function(assert) {
    var items = ["111", "222", "333"],
        $element = $("#tagBox").dxTagBox({
            searchTimeout: 0,
            items: items,
            searchEnabled: true,
            opened: true
        }),
        instance = $element.dxTagBox("instance"),
        $input = $element.find("input");

    keyboardMock($input, true)
        .type(items[0][0])
        .press("backspace");

    var $listItems = instance._list.element().find(".dx-list-item");
    assert.equal($listItems.length, items.length, "list items count is correct");
});

QUnit.testInActiveWindow("input should be focused after click on field (searchEnabled is true or acceptCustomValue is true)", function(assert) {
    var items = ["111", "222", "333"];

    var $tagBox = $("#tagBox").dxTagBox({
        items: items,
        searchEnabled: true,
        acceptCustomValue: true,
        showDropDownButton: true
    });

    var $input = $tagBox.find("input");
    var $dropDownButton = $tagBox.find(".dx-dropdowneditor-button");
    $dropDownButton.click();

    this.clock.tick(TIME_TO_WAIT);

    assert.ok($input.is(":focus"), "input was focused");
});


QUnit.module("popup position and size", moduleSetup);

QUnit.test("popup height should be depended from its content height", function(assert) {
    var $element = $("#tagBox").dxTagBox({
        dataSource: ["Antigua and Barbuda", "Albania", "American Samoa"],
        acceptCustomValue: true,
        searchEnabled: true,
        focusStateEnabled: true,
        searchTimeout: 0,
        opened: true
    });

    var instance = $element.dxTagBox("instance");
    var height = instance._popup._$popupContent.height();

    var $input = $element.find("input");
    $input.focus();

    keyboardMock($input).type("American Samo");

    var currentHeight = instance._popup._$popupContent.height();

    assert.notEqual(height, currentHeight);
});

QUnit.test("popup changes its position when field height changed", function(assert) {
    if(devices.real().platform === "win") { // NOTE: win8 popup top position equals tagBox top position
        assert.expect(0);
        return;
    }
    var $tagBox = $("#tagBox").dxTagBox({
            items: ["item1", "item2", "item3", "item4", "item5", "item6"],
            showSelectionControls: true,
            width: 100,
            searchEnabled: true
        }),
        tagBox = $tagBox.dxTagBox("instance");

    tagBox.open();

    var initialHeight = $tagBox.height();
    var $selectAllItem = $(".dx-list-select-all"),
        popupContentTop = tagBox.content().offset().top;

    $selectAllItem.trigger("dxclick");

    assert.roughEqual(tagBox.content().offset().top, popupContentTop - initialHeight + $tagBox.height(), 1, "selectAll moved");
});

QUnit.test("refresh popup size after dataSource loaded", function(assert) {
    var d = $.Deferred();

    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            load: function() {
                return d.promise();
            }
        }
    });

    $tagBox.find("input").trigger("dxclick");
    this.clock.tick(TIME_TO_WAIT);

    var $popup = $(".dx-popup-content");
    var popupHeight = $popup.height();

    d.resolve(["first", "second", "third", "fourth"]);
    this.clock.tick(TIME_TO_WAIT);

    assert.ok($popup.height() > popupHeight, "popup enlarged after loading");
});

QUnit.test("Second search should be work, when first search are running", function(assert) {
    var items = [
        { name: 'Zambia', code: 'ZM' },
        { name: 'Zimbabwe', code: 'ZW' }
    ];

    var $element = $("#tagBox").dxTagBox({
        dataSource: {
            load: function(loadOptions) {
                var filterOptions = loadOptions.searchValue ? loadOptions.searchValue : "";
                var d = new $.Deferred();
                setTimeout(function() {
                    d.resolve(dataQuery(items).filter("name", "contains", filterOptions).toArray(), { totalCount: items.length });
                }, 2000);
                return d.promise();
            },
            key: "name",
            byKey: function(key) {
                return key;
            }
        },
        searchEnabled: true,
        searchTimeout: 100,
        opened: true
    });
    this.clock.tick(2000);

    var $input = $element.find("input");

    var keyboard = keyboardMock($input);
    keyboard.type("Z");
    this.clock.tick(200);

    keyboard.type("i");
    this.clock.tick(4100);

    assert.equal($(".dx-list-item").length, 1, "search was completed");
});


QUnit.module("the 'acceptCustomValue' option", moduleSetup);

QUnit.test("acceptCustomValue", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        items: ["item1", "item2"],
        acceptCustomValue: true,
        value: ["item1"],
        focusStateEnabled: true
    });

    var $input = $tagBox.find("input");

    var keyboard = keyboardMock($input);
    keyboard.type("test");

    assert.deepEqual($tagBox.dxTagBox("option", "value"), ["item1"], "value was not added to values before pressing enter key");

    keyboard.press("enter");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($(".dx-list-item").length, 2, "items is not filtered");
    assert.deepEqual($tagBox.dxTagBox("option", "value"), ["item1", "test"], "value was added to values");
    this.clock.tick(TIME_TO_WAIT);

    assert.equal($.trim($tagBox.find("." + TAGBOX_TAG_CONTAINER_CLASS).text()), "item1test", "all tags rendered");
});

QUnit.test("acceptCustomValue should not add empty tag", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        acceptCustomValue: true
    });

    var $input = $tagBox.find("input");
    var keyboard = keyboardMock($input);
    keyboard.press("enter");

    assert.deepEqual($tagBox.dxTagBox("option", "value"), [], "empty value was not added");
});

QUnit.test("adding the custom tag should clear input value (T385448)", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
            acceptCustomValue: true
        }),
        $input = $tagBox.find("input");

    keyboardMock($input)
        .type("custom")
        .press("enter");

    assert.equal($input.val(), "", "the input is empty");
});


QUnit.module("the 'selectedItems' option", moduleSetup);

QUnit.test("The 'selectedItems' option value is correct on init if the 'value' option is specified", function(assert) {
    var items = [1, 2, 3],
        tagBox = $("#tagBox").dxTagBox({
            items: items,
            value: [items[1]]
        }).dxTagBox("instance");

    assert.deepEqual(tagBox.option("selectedItems"), [items[1]], "the 'selectedItems' option value is correct");
});

QUnit.test("The 'selectedItems' option changes after the 'value' option", function(assert) {
    var items = [1, 2, 3],
        tagBox = $("#tagBox").dxTagBox({
            items: items
        }).dxTagBox("instance");

    tagBox.option("value", items);
    assert.deepEqual(tagBox.option("selectedItems"), items, "the 'selectedItems' option value is changed");
});

QUnit.test("selected items should be correct if the list item is selected", function(assert) {
    var items = [1, 2, 3],
        tagBox = $("#tagBox").dxTagBox({
            items: items,
            value: [items[0]],
            opened: true
        }).dxTagBox("instance"),
        $listItems = tagBox._list.element().find(".dx-list-item");

    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(tagBox.option("selectedItems"), [items[0], items[1]], "the 'selectedItems' option value is correct");
});

QUnit.test("selected items should be correct if the list item is unselected", function(assert) {
    var items = [1, 2, 3],
        tagBox = $("#tagBox").dxTagBox({
            items: items,
            value: items,
            opened: true
        }).dxTagBox("instance"),
        $listItems = tagBox._list.element().find(".dx-list-item");

    $listItems.eq(0).trigger("dxclick");
    assert.deepEqual(tagBox.option("selectedItems"), [items[1], items[2]], "the 'selectedItems' option value is correct");
});


QUnit.module("the 'onSelectionChanged' option", moduleSetup);

QUnit.test("the 'onSelectionChanged' action should contain correct 'addedItems' argument", function(assert) {
    var items = [1, 2, 3],
        spy = sinon.spy(),
        tagBox = $("#tagBox").dxTagBox({
            items: items,
            opened: true,
            onSelectionChanged: spy
        }).dxTagBox("instance"),
        $listItems = tagBox._list.element().find(".dx-list-item");

    $listItems.eq(0).trigger("dxclick");
    assert.deepEqual(spy.args[1][0].addedItems, [items[0]], "first item is in the 'addedItems' argument");

    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(spy.args[2][0].addedItems, [items[1]], "second item is in the 'addedItems' argument");

    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(spy.args[3][0].addedItems, [], "no items in the 'addedItems' argument after item is unselected");
});

QUnit.test("the 'onSelectionChanged' action should contain correct 'removedItems' argument", function(assert) {
    var items = [1, 2, 3],
        spy = sinon.spy(),
        tagBox = $("#tagBox").dxTagBox({
            items: items,
            value: items,
            opened: true,
            onSelectionChanged: spy
        }).dxTagBox("instance"),
        $listItems = tagBox._list.element().find(".dx-list-item");

    $listItems.eq(0).trigger("dxclick");
    assert.deepEqual(spy.args[1][0].removedItems, [items[0]], "first item is in the 'removedItems' argument");

    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(spy.args[2][0].removedItems, [items[1]], "second item is in the 'removedItems' argument");

    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(spy.args[3][0].removedItems, [], "not items in the 'removedItems' argument after item is selected");
});


QUnit.module("the 'fieldTemplate' option", moduleSetup);

QUnit.test("the 'fieldTemplate' function should be called only once on init and value change", function(assert) {
    var callCount = 0,
        tagBox = $("#tagBox").dxTagBox({
            dataSource: [1, 2, 3],
            value: [1],
            fieldTemplate: function(selectedItems) {
                callCount++;
                return $("<div>").dxTextBox();
            }
        }).dxTagBox("instance");

    assert.equal(callCount, 1, "the 'fieldTemplate' was called once on init");

    callCount = 0;
    tagBox.option("value", [1, 2]);
    assert.equal(callCount, 1, "the 'fieldTemplate' was called once on value change");
});

QUnit.test("the 'fieldTemplate' has correct arguments", function(assert) {
    var args = [],
        tagBox = $("#tagBox").dxTagBox({
            dataSource: [1, 2, 3],
            value: [1],
            fieldTemplate: function(selectedItems) {
                args.push(selectedItems);
                return $("<div>").dxTextBox();
            }
        }).dxTagBox("instance");

    tagBox.option("value", [1, 2, 3]);
    tagBox.option("value", [2]);

    assert.deepEqual(args[0], [1], "arguments are correct on init");
    assert.deepEqual(args[1], [1, 2, 3], "arguments are correct after adding values");
    assert.deepEqual(args[2], [2], "arguments are correct after removing values");
});

QUnit.testInActiveWindow("field should not be updated on focus changing", function(assert) {
    var fieldTemplate = function() {
        return $("<div>").dxTextBox();
    };
    var fieldTemplateSpy = sinon.spy(fieldTemplate);
    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        fieldTemplate: fieldTemplateSpy,
        opened: true,
        focusStateEnabled: true
    });

    fieldTemplateSpy.reset();
    keyboardMock($tagBox.find(".dx-texteditor-input"))
        .focus()
        .press("down");

    assert.equal(fieldTemplateSpy.callCount, 0, "fieldTemplate render was not called");
});

QUnit.test("tagbox should have a template classes", function(assert) {
    var fieldTemplate = function() {
        return $("<div>").dxTextBox();
    };

    var $tagBox = $("#tagBox").dxTagBox({
        items: [1, 2, 3],
        focusStateEnabled: true
    });

    assert.ok($tagBox.hasClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS), "default template class was applied");
    assert.ok(!$tagBox.hasClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS), "custom template class wasn't applied");

    $tagBox.dxTagBox("instance").option("fieldTemplate", fieldTemplate);

    assert.ok(!$tagBox.hasClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS), "default template class was applied");
    assert.ok($tagBox.hasClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS), "default template class wasn't applied");
});

QUnit.test("value should be cleared after deselect all items if fieldTemplate and searchEnabled is used", function(assert) {
    var $field = $("<div>"),
        $tagBox = $("#tagBox").dxTagBox({
            items: [1, 2, 3],
            opened: true,
            value: [1],
            searchEnabled: true,
            fieldTemplate: function(itemData, $container) {
                var $textBox = $("<div>").dxTextBox();

                itemData = Array.isArray(itemData) ? itemData : [itemData];
                $field.text(itemData[0] || "");

                $container.append($field).append($textBox);
            }
        }),
        $items = $("." + LIST_ITEM_CLASS);

    assert.equal($field.text(), "1", "text was added on init");

    $items.eq(0).trigger("dxclick");

    assert.deepEqual($tagBox.dxTagBox("option", "value"), [], "value was cleared");
    assert.equal($field.text(), "", "text was cleared after the deselect");
});


QUnit.module("applyValueMode = 'useButtons'", {
    _init: function(options) {
        this.$element = $("<div>")
            .appendTo("#qunit-fixture")
            .dxTagBox(options);
        this.instance = this.$element.dxTagBox("instance");
        this.$listItems = $(".dx-list-item");
        this.$popupWrapper = $("." + TAGBOX_POPUP_WRAPPER_CLASS);
        this.getListInstance = function() {
            return this.instance._list;
        };
    },
    beforeEach: function() {
        this._init({
            applyValueMode: "useButtons",
            items: [1, 2, 3],
            opened: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this._init(options);
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test("popup should not be hidden after list item click", function(assert) {
    var $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    assert.ok(this.instance.option("opened"), "popup is visible after the first item is clicked");
    assert.deepEqual(this.instance.option("value"), [], "value is not changed after the first item is clicked");

    $listItems.eq(1).trigger("dxclick");
    assert.ok(this.instance.option("opened"), "popup is visible after the second item is clicked");
    assert.deepEqual(this.instance.option("value"), [], "value is not changed after the second item is clicked");
});

QUnit.test("tags should not be rendered on list item click", function(assert) {
    var $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    assert.equal(this.$element.find(".dx-tag").length, 0, "tag is not rendered after the first list item is clicked");

    $listItems.eq(1).trigger("dxclick");
    assert.equal(this.$element.find(".dx-tag").length, 0, "tag is not rendered after the second list item is clicked");
});

QUnit.test("value should be applied after the 'done' button click", function(assert) {
    var items = this.instance.option("items"),
        $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(this.instance.option("value"), [], "value is not changed after items are clicked");

    this.$popupWrapper.find(".dx-popup-done").trigger("dxclick");
    assert.ok(!this.instance.option("opened"), "popup is hidden after the 'done' button is clicked");
    assert.deepEqual(this.instance.option("value"), [items[0], items[1]], "value is changed to selected list items");
});

QUnit.test("value should not be changed after the 'cancel' button click", function(assert) {
    var $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");
    assert.deepEqual(this.instance.option("value"), [], "value is not changed after items are clicked");

    this.$popupWrapper.find(".dx-popup-cancel").trigger("dxclick");
    assert.ok(!this.instance.option("opened"), "popup is hidden after the 'done' button is clicked");
    assert.deepEqual(this.instance.option("value"), [], "value is changed to selected list items");
});

QUnit.test("value should not be changed after the popup is closed", function(assert) {
    var $listItems = this.$listItems,
        initialValue = this.instance.option("value");

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");
    this.instance.close();

    assert.deepEqual(this.instance.option("value"), initialValue, "value is not changed");
});

QUnit.test("selected list items should be reset after the 'cancel' button is clicked", function(assert) {
    var $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");
    this.$popupWrapper.find(".dx-popup-cancel").trigger("dxclick");

    assert.deepEqual(this.getListInstance().option("selectedItems"), [], "selected items are reset");
});

QUnit.test("selected list items should be reset after the popup is closed", function(assert) {
    var $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");
    this.instance.close();

    assert.deepEqual(this.getListInstance().option("selectedItems"), [], "selected items are reset");
});

QUnit.test("list items selection should not be reset after next page loading", function(assert) {
    var dataSource = new DataSource({
        store: new CustomStore({
            load: function(loadOptions) {
                var items = [],
                    take = loadOptions.take,
                    skip = loadOptions.skip;

                for(var i = 0; i < take; i++) {
                    items.push(i + skip);
                }

                return items;
            }
        }),
        paginate: true
    });

    this.reinit({
        dataSource: dataSource,
        applyValueMode: "useButtons",
        opened: true
    });

    var list = this.getListInstance(),
        $list = list.element(),
        $listItems = this.$listItems;

    $listItems.eq(0).trigger("dxclick");
    $listItems.eq(1).trigger("dxclick");

    var selectedItemsCount = list.option("selectedItems").length;
    $list.dxScrollView("option", "onReachBottom")();

    assert.equal(list.option("selectedItems").length, selectedItemsCount, "selection is not reset");
});

QUnit.test("the 'selectedItems' should not be updated after list item click", function(assert) {
    this.$listItems.eq(0).trigger("dxclick");
    assert.deepEqual(this.instance.option("selectedItems"), [], "selected items are not changed");
});

QUnit.test("'onValueChanged' should not be fired after clicking on list item (T378374)", function(assert) {
    var valueChangedSpy = sinon.spy();
    this.reinit({
        applyValueMode: "useButtons",
        items: [1, 2, 3],
        onValueChanged: valueChangedSpy,
        showSelectionControls: true,
        opened: true
    });

    this.$listItems.eq(1).trigger("dxclick");
    assert.equal(valueChangedSpy.callCount, 0, "the 'onValueChanged' was not fired after checking an item");
});

QUnit.test("'onValueChanged' should not be fired after clicking on list item when value is not empty (T378374)", function(assert) {
    var valueChangedSpy = sinon.spy();
    this.reinit({
        applyValueMode: "useButtons",
        items: [1, 2, 3],
        value: [1],
        onValueChanged: valueChangedSpy,
        showSelectionControls: true,
        opened: true
    });

    this.$listItems.eq(1).trigger("dxclick");
    assert.equal(valueChangedSpy.callCount, 0, "the 'onValueChanged' was not fired after checking an item");
});

QUnit.test("the list selection should be updated after value is changed while editor is opened", function(assert) {
    var items = this.instance.option("items"),
        list = this.getListInstance();

    this.instance.option("value", [items[0], items[1]]);
    assert.equal(list.option("selectedItems").length, 2, "list selection is updated after adding items");

    this.instance.option("value", [items[1]]);
    assert.equal(this.getListInstance().option("selectedItems").length, 1, "list selection is updated after removing item");
});

QUnit.test("the value should be applied after search (T402855)", function(assert) {
    this.reinit({
        applyValueMode: "useButtons",
        items: ["aa", "ab", "bb", "ac", "bc"],
        showSelectionControls: true,
        searchEnabled: true,
        searchTimeout: 0,
        opened: true
    });

    var $input = this.$element.find("input");

    keyboardMock($input)
        .focus()
        .type("c");

    $(".dx-list-select-all-checkbox").trigger("dxclick");
    $input.trigger("focusout"); // Emulating the real behavior
    $(".dx-button.dx-popup-done").trigger("dxclick");

    assert.deepEqual(this.instance.option("value"), ["ac", "bc"], "value is applied correctly");
});

QUnit.test("the search should be cleared after pressing the 'OK' button", function(assert) {
    this.reinit({
        applyValueMode: "useButtons",
        items: ["aa", "ab", "bb", "ac", "bc"],
        showSelectionControls: true,
        searchEnabled: true,
        searchTimeout: 0,
        opened: true
    });

    var $input = this.$element.find("input");

    keyboardMock($input)
        .focus()
        .type("c");

    $(".dx-button.dx-popup-done").trigger("dxclick");

    assert.equal($input.val(), "", "the search is cleared");
});


QUnit.module("the 'onSelectAllValueChanged' option", {
    _init: function(options) {
        this.spy = sinon.spy();

        this.$element = $("<div>")
            .appendTo("#qunit-fixture")
            .dxTagBox($.extend({
                showSelectionControls: true,
                opened: true,
                onSelectAllValueChanged: this.spy
            }, options));

        this.instance = this.$element.dxTagBox("instance");
    },
    reinit: function(options) {
        this.$element.remove();
        this._init(options);
    },
    beforeEach: function() {
        this.items = [1, 2, 3];

        this._init({
            items: this.items
        });
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test("the 'onSelectAllValueChanged' option behavior", function(assert) {
    var $selectAllCheckbox = this.instance._list.element().find(".dx-list-select-all-checkbox");

    $selectAllCheckbox.trigger("dxclick");
    assert.ok(this.spy.args[this.spy.args.length - 1][0].value, "all items are selected");

    $selectAllCheckbox.trigger("dxclick");
    assert.ok(this.spy.args[this.spy.args.length - 1][0].value === false, "all items are unselected");
});

QUnit.test("the 'onSelectAllValueChanged' action is fired only one time if all items are selected", function(assert) {
    var $list = this.instance._list.element();
    $list.find(".dx-list-select-all-checkbox").trigger("dxclick");
    assert.equal(this.spy.callCount, 1, "count is correct");
});

QUnit.test("the 'onSelectAllValueChanged' action is fired only one time if all items are unselected", function(assert) {
    this.reinit({
        items: this.items,
        value: this.items.slice()
    });

    var $list = this.instance._list.element();
    $list.find(".dx-list-select-all-checkbox").trigger("dxclick");
    assert.equal(this.spy.callCount, 1, "count is correct");
});

QUnit.test("the 'onSelectAllValueChanged' action is fired only one time if one item is selected", function(assert) {
    var $list = this.instance._list.element();
    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.equal(this.spy.callCount, 1, "count is correct");
});

QUnit.test("the 'onSelectAllValueChanged' action is fired only one time if one item is unselected", function(assert) {
    this.reinit({
        items: this.items,
        value: this.items.splice()
    });

    var $list = this.instance._list.element();
    $list.find(".dx-list-item").eq(0).trigger("dxclick");
    assert.equal(this.spy.callCount, 1, "count is correct");
});


QUnit.module("single line mode", {
    beforeEach: function() {
        fx.off = true;

        this.items = ["Africa", "Antarctica", "Asia", "Australia/Oceania", "Europe", "North America", "South America"];

        this._width = 200;

        this.$element = $("<div>")
            .appendTo("#qunit-fixture")
            .width(this._width)
            .dxTagBox({
                items: this.items,
                value: this.items,
                multiline: false,
                focusStateEnabled: true
            });
        this.instance = this.$element.dxTagBox("instance");
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("widget gets special class in the single line mode", function(assert) {
    assert.ok(this.$element.hasClass(TAGBOX_SINGLE_LINE_CLASS), "the single line class is added");
});

QUnit.test("single line class presence should depend the 'multiline' option", function(assert) {
    this.instance.option("multiline", true);
    assert.notOk(this.$element.hasClass(TAGBOX_SINGLE_LINE_CLASS), "there is no single line class on widget");

    this.instance.option("multiline", false);
    assert.ok(this.$element.hasClass(TAGBOX_SINGLE_LINE_CLASS), "the single line class is added");
});

QUnit.test("tags container should be scrolled to the end on value change", function(assert) {
    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS);

    this.instance.option("value", [this.items[0]]);
    assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), "tags container is scrolled to the end");

    this.instance.option("value", this.items);
    assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), "tags container is scrolled to the end");
});

QUnit.test("tags should be scrolled by mouse wheel (T386939)", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "desktop specific test");
        return;
    }

    var itemText = "Test item ",
        items = [];

    for(var i = 1; i <= 50; i++) {
        items.push(itemText + i);
    }

    this.instance.option({
        items: items,
        value: items.slice(0, 20)
    });

    var $tagContainer = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS);
    $tagContainer.scrollLeft(0);

    var delta = -120;

    this.$element.trigger($.Event("dxmousewheel", {
        delta: delta
    }));

    assert.equal($tagContainer.scrollLeft(), delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER, "tag container position is correct after the second scroll");

    this.$element.trigger($.Event("dxmousewheel", {
        delta: delta
    }));

    assert.equal($tagContainer.scrollLeft(), 2 * delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER, "tag container position is correct after the second scroll");
});

QUnit.test("stopPropagation and preventDefault should be called for the mouse wheel event (T386939)", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "desktop specific test");
        return;
    }

    var spy = sinon.spy();

    this.$element.on("dxmousewheel", spy);

    this.$element.trigger($.Event("dxmousewheel", {
        delta: -120
    }));

    var event = spy.args[0][0];
    assert.ok(event.isDefaultPrevented(), "default is prevented");
    assert.ok(event.isPropagationStopped(), "propagation is stopped");
});

QUnit.test("it is should be possible to scroll tag container natively on mobile device", function(assert) {
    var currentDevice = devices.real(),
        $tagBox;

    try {
        devices.real({
            deviceType: "mobile"
        });

        $tagBox = $("<div>")
            .appendTo("body")
            .dxTagBox({
                multiline: false
            });

        var $tagContainer = $tagBox.find("." + TAGBOX_TAG_CONTAINER_CLASS);

        assert.equal($tagContainer.css("overflow-x"), "auto", "the overflow css property is correct");
    } finally {
        devices.real(currentDevice);
        $tagBox && $tagBox.remove();
    }
});

QUnit.testInActiveWindow("tag container should be scrolled to the start after rendering and focusout (T390041)", function(assert) {
    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS),
        $input = this.$element.find("input");

    assert.equal($container.scrollLeft(), 0, "scroll position is correct on rendering");

    $input
        .focus()
        .blur();

    assert.equal($container.scrollLeft(), 0, "scroll position is correct on focus out");
});

QUnit.test("tags container should be scrolled to the end on focusin (T390041)", function(assert) {
    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS),
        $input = this.$element.find("input");

    $input.trigger("focusin");
    assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), "tags container is scrolled to the end");
});

QUnit.test("list should save it's scroll position after value changed", function(assert) {
    this.instance.option({
        opened: true,
        showSelectionControls: true
    });

    var $content = this.instance.content(),
        $list = $content.find("." + LIST_CLASS),
        list = $list.dxList("instance"),
        scrollView = $list.dxScrollView("instance");

    this.instance._popup.option("height", 100);

    list.scrollTo(2);
    this.instance.option("value", [this.items[2]]);

    assert.equal(scrollView.scrollTop(), 2, "list should not be scrolled to the top after value changed");
});

QUnit.testInActiveWindow("tag container should be scrolled to the start after rendering and focusout in the RTL mode (T390041)", function(assert) {
    this.instance.option("rtlEnabled", true);

    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS),
        $input = this.$element.find("input"),
        sign = browser.webkit || browser.msie ? 1 : -1,
        expectedScrollPosition = (browser.msie || browser.mozilla)
            ? 0
            : ($container.get(0).scrollWidth - $container.outerWidth()) * sign;

    assert.equal($container.scrollLeft(), expectedScrollPosition, "scroll position is correct on rendering");

    $input
        .focus()
        .blur();

    assert.equal($container.scrollLeft(), expectedScrollPosition, "scroll position is correct on focus out");
});

QUnit.test("tags container should be scrolled to the end on focusin in the RTL mode (T390041)", function(assert) {
    this.instance.option("rtlEnabled", true);

    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS),
        $input = this.$element.find("input"),
        sign = browser.webkit || browser.msie ? 1 : -1,
        expectedScrollPosition = (browser.msie || browser.mozilla)
            ? sign * ($container.get(0).scrollWidth - $container.outerWidth())
            : 0;

    $input.trigger("focusin");
    assert.equal($container.scrollLeft(), expectedScrollPosition, "tags container is scrolled to the end");
});

QUnit.test("tags container should be scrolled on mobile devices", function(assert) {
    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS);

    if(devices.real().deviceType === "desktop") {
        assert.equal($container.css("overflow-x"), "hidden", "overflow-x has a 'hidden' value on desktop");
    } else {
        assert.equal($container.css("overflow-x"), "auto", "overflow-x has a 'auto' value on mobile");
    }
});

QUnit.test("preventDefault should be called - T454876", function(assert) {
    var spy = sinon.spy();

    this.$element.on("dxpointerdown", spy);

    this.$element.find(".dx-tag-container").trigger("dxpointerdown");

    var event = spy.args[0][0];
    assert.ok(event.isDefaultPrevented(), "default is prevented");
});


QUnit.module("keyboard navigation through tags in single line mode", {
    beforeEach: function() {
        fx.off = true;

        this.items = ["Africa", "Antarctica", "Asia", "Australia/Oceania", "Europe", "North America", "South America"];

        this._width = 200;

        this.$element = $("<div>")
            .appendTo("#qunit-fixture")
            .width(this._width)
            .dxTagBox({
                items: this.items,
                value: this.items,
                multiline: false,
                focusStateEnabled: true,
                searchEnabled: true
            });

        this._init();
    },
    _init: function() {
        this.instance = this.$element.dxTagBox("instance");
        this.keyboard = keyboardMock(this.$element.find("input"));
        this.getFocusedTag = function() {
            return this.$element.find("." + TAGBOX_TAG_CLASS + "." + FOCUSED_CLASS);
        };
    },
    reinit: function(options) {
        this.$element.remove();

        this.$element = $("<div>")
            .appendTo("#qunit-fixture")
            .width(this._width)
            .dxTagBox(options);

        this._init();
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("the focused tag should be visible during keyboard navigation to the left", function(assert) {
    this.keyboard
        .focus()
        .press("left")
        .press("left")
        .press("left");

    assert.roughEqual(this.getFocusedTag().position().left, 0, 1, "focused tag is visible");

    this.keyboard
        .press("left")
        .press("left");

    assert.roughEqual(this.getFocusedTag().position().left, 0, 1, "focused tag is visible");
});

QUnit.test("the focused tag should be visible during keyboard navigation to the right", function(assert) {
    var containerWidth = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS).outerWidth();

    this.keyboard.focus();

    for(var i = 0; i < this.items.length; i++) {
        this.keyboard.press("left");
    }

    this.keyboard
        .press("right")
        .press("right")
        .press("right");

    var $focusedTag = this.getFocusedTag();
    assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1, "focused tag is visible");

    this.keyboard
        .press("right")
        .press("right");

    $focusedTag = this.getFocusedTag();
    assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1, "focused tag is visible");
});

QUnit.test("tags container should be scrolled to the end after the last tag loses focus during navigation to the right", function(assert) {
    this.reinit({
        items: this.items,
        value: this.items,
        multiline: false,
        focusStateEnabled: true,
        acceptCustomValue: true
    });

    this.keyboard
        .focus()
        .press("left")
        .press("left")
        .press("left")
        .press("right")
        .press("right")
        .press("right");

    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS);
    assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), "tags container is scrolled to the end");
});

QUnit.test("tags container should be scrolled to the start on value change in the RTL mode", function(assert) {
    this.reinit({
        items: this.items,
        value: this.items,
        multiline: false,
        focusStateEnabled: true,
        rtlEnabled: true
    });

    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS),
        isScrollReverted = (browser.msie || browser.mozilla),
        sign = browser.webkit || browser.msie ? 1 : -1;

    this.instance.option("value", [this.items[0]]);

    var expectedScrollPosition = isScrollReverted ? sign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;
    assert.equal($container.scrollLeft(), expectedScrollPosition, "tags container is scrolled to the start");

    this.instance.option("value", this.items);
    expectedScrollPosition = isScrollReverted ? sign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;
    assert.equal($container.scrollLeft(), expectedScrollPosition, "tags container is scrolled to the start");
});

QUnit.test("the focused tag should be visible during keyboard navigation to the right in the RTL mode", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test is not relevant for mobile devices");
        return;
    }

    this.reinit({
        items: this.items,
        value: this.items,
        multiline: false,
        focusStateEnabled: true,
        rtlEnabled: true,
        searchEnabled: true
    });

    var containerWidth = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS).outerWidth();

    this.keyboard
        .focus()
        .press("right")
        .press("right")
        .press("right");

    var $focusedTag = this.getFocusedTag();
    assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1, "focused tag is visible");

    this.keyboard
        .press("right")
        .press("right");

    $focusedTag = this.getFocusedTag();
    assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1, "focused tag is visible");
});

QUnit.test("the focused tag should be visible during keyboard navigation to the left in the RTL mode", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test is not relevant for mobile devices");
        return;
    }

    this.reinit({
        items: this.items,
        value: this.items,
        multiline: false,
        focusStateEnabled: true,
        rtlEnabled: true
    });

    this.keyboard.focus();

    for(var i = 0; i < this.items.length; i++) {
        this.keyboard.press("right");
    }

    this.keyboard
        .press("left")
        .press("left")
        .press("left");

    assert.roughEqual(this.getFocusedTag().position().left, 0, 1, "focused tag is not hidden at left");

    this.keyboard
        .press("left")
        .press("left");

    assert.roughEqual(this.getFocusedTag().position().left, 0, 1, "focused tag is not hidden at left");
});

QUnit.test("tags container should be scrolled to the start after the last tag loses focus during navigation to the left in the RTL mode", function(assert) {
    this.reinit({
        items: this.items,
        value: this.items,
        multiline: false,
        focusStateEnabled: true,
        acceptCustomValue: true,
        rtlEnabled: true
    });

    this.keyboard
        .focus()
        .press("right")
        .press("right")
        .press("right")
        .press("left")
        .press("left")
        .press("left");

    var $container = this.$element.find("." + TAGBOX_TAG_CONTAINER_CLASS),
        isScrollReverted = browser.msie || browser.mozilla,
        sign = browser.webkit || browser.msie ? 1 : -1,
        expectedScrollPosition = isScrollReverted ? sign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;

    assert.equal($container.scrollLeft(), expectedScrollPosition, "tags container is scrolled to the start");
});


QUnit.module("dataSource integration", moduleSetup);

QUnit.test("item should be chosen synchronously if item is already loaded", function(assert) {
    assert.expect(0);

    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            load: function() {
                return [1, 2, 3, 4, 5];
            }
        }
    });

    this.clock.tick();

    $tagBox.dxTagBox("option", "value", [1]);
});

QUnit.test("first page should be displayed after search and tag select", function(assert) {
    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: {
            store: new CustomStore({
                load: function(options) {
                    var result = [];

                    if(options.searchValue) {
                        return [options.searchValue];
                    }

                    for(var i = options.skip; i < options.skip + options.take; i++) {
                        result.push(i);
                    }

                    return $.Deferred().resolve(result).promise();
                },
                byKey: function(key) {
                    return key;
                }
            }),
            pageSize: 2,
            paginate: true
        },
        searchTimeout: 0,
        opened: true,
        searchEnabled: true
    });
    var $input = $tagBox.find("input");
    var keyboard = keyboardMock($input);

    keyboard.type("4");

    $(".dx-item").trigger("dxclick");

    $input.trigger("dxclick");
    assert.equal($.trim($(".dx-item").first().text()), "0", "first item loaded");
});


QUnit.module("performance");

QUnit.test("selectionHandler should call twice on popup opening", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var tagBox = $("#tagBox").dxTagBox({
        items: items,
        value: items,
        showSelectionControls: true
    }).dxTagBox("instance");

    var selectionChangeHandlerSpy = sinon.spy(tagBox, "_selectionChangeHandler");

    tagBox.option("opened", true);

    assert.ok(selectionChangeHandlerSpy.callCount <= 2, "selection change handler called less than 2 (ListContentReady and SelectAll)");
});


QUnit.module("deprecated options");

QUnit.test("the 'values' option should work correctly", function(assert) {
    var items = [1, 2, 3],
        tagBox = $("#tagBox").dxTagBox({
            items: items,
            value: items,
            showSelectionControls: true
        }).dxTagBox("instance");

    assert.deepEqual(tagBox.option("value"), items, "the 'value' option works correctly with reading");

    tagBox.option("value", [items[0]]);
    assert.deepEqual(tagBox.option("value"), [items[0]], "the 'value' option works correctly with writing");
});


QUnit.module("regression", {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test("tagBox should not fail when asynchronous data source is used (T381326)", function(assert) {
    var data = [1, 2, 3, 4, 5],
        timeToWait = 500;

    $("#tagBox").dxTagBox({
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var res = $.Deferred();
                    setTimeout(function() { res.resolve(data); }, timeToWait);
                    return res.promise();
                },
                byKey: function(key) {
                    var res = $.Deferred();
                    setTimeout(function() { res.resolve(key); }, timeToWait);
                    return res.promise();
                }
            }),
            paging: false
        }),
        value: [data[0], data[1]]
    });

    this.clock.tick(timeToWait);
    assert.expect(0);
});

QUnit.test("tagBox should not fail when asynchronous data source is used in the single line mode (T381326)", function(assert) {
    var data = [1, 2, 3, 4, 5],
        timeToWait = 500;

    $("#tagBox").dxTagBox({
        multiline: false,
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var res = $.Deferred();
                    setTimeout(function() { res.resolve(data); }, timeToWait);
                    return res.promise();
                },
                byKey: function(key) {
                    var res = $.Deferred();
                    setTimeout(function() { res.resolve(key); }, timeToWait);
                    return res.promise();
                }
            }),
            paging: false
        }),
        value: [data[0], data[1]]
    });

    this.clock.tick(timeToWait);
    assert.expect(0);
});

QUnit.test("T403756 - dxTagBox treats removing a dxTagBox item for the first time as removing the item", function(assert) {
    var items = [
        { id: 1, text: "Item 1" },
        { id: 2, text: "Item 2" },
        { id: 3, text: "Item 3" }
        ],
        tagBox = $("#tagBox").dxTagBox({
            displayExpr: "name",
            valueExpr: "id",
            dataSource: new CustomStore({
                key: "id",
                load: function() {
                    return items;
                },
                byKey: function(key) {
                    var d = $.Deferred();
                    setTimeout(function(i) {
                        items.forEach(function(i) {
                            if(i.id === key) {
                                d.resolve(i);
                                return;
                            }
                        });
                    });
                    return d.promise();
                }
            }),
            onSelectionChanged: function(e) {
                assert.deepEqual(e.removedItems.length, 0, "there are no removed items on init");
                assert.equal(e.addedItems.length, 2, "items are added on init");
            },
            value: [1, 2]
        }).dxTagBox("instance");

    this.clock.tick();
    assert.equal(tagBox.option("selectedItems").length, 2, "selectedItems contains all selected values");

    var $container = tagBox.element().find("." + TAGBOX_TAG_CONTAINER_CLASS);
    var $tagRemoveButtons = $container.find("." + TAGBOX_TAG_REMOVE_BUTTON_CLASS);

    tagBox.option("onSelectionChanged", function(e) {
        assert.deepEqual(e.removedItems.length, 1, "removed item was added when tag deleted");
        assert.equal(e.addedItems.length, 0, "there are no added items when tag deleted");
    });

    $tagRemoveButtons.eq(1).trigger("dxclick");

    this.clock.tick();

    assert.equal(tagBox.option("selectedItems").length, 1, "selectedItems was changed correctly");
});

QUnit.test("Searching should work correctly in grouped tagBox (T516798)", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var items = [{
        "ID": 1,
        "Name": "Item1",
        "Category": "Category1"
    }, {
        "ID": 3,
        "Name": "Item3",
        "Category": "Category2"
    }];

    var $tagBox = $("#tagBox").dxTagBox({
        dataSource: new DataSource({
            store: items,
            group: "Category"
        }),
        valueExpr: "ID",
        displayExpr: "Name",
        value: [items[0].ID],
        searchEnabled: true,
        opened: true,
        grouped: true
    });

    var $input = $tagBox.find("input"),
        keyboard = keyboardMock($input);

    keyboard.type("3");
    this.clock.tick(TIME_TO_WAIT);
    keyboard.press('enter');

    var $tagContainer = $tagBox.find("." + TAGBOX_TAG_CONTAINER_CLASS);

    assert.equal($tagContainer.find("." + TAGBOX_TAG_CONTENT_CLASS).length, 2, "selected tags rendered");
    assert.equal($.trim($tagContainer.text()), "Item1Item3", "selected values are rendered");
});
