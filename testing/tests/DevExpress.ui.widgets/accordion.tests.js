"use strict";

var $ = require("jquery"),
    Accordion = require("ui/accordion"),
    domUtils = require("core/utils/dom"),
    fx = require("animation/fx"),
    holdEvent = require("events/hold"),
    DataSource = require("data/data_source/data_source").DataSource,
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="container">\
            <div id="accordion"></div>\
        </div>\
        \
        <div id="html-template-accordion">\
            <div style="height: 20px" data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
        </div>\
        \
        <div id="templated-accordion">\
            <div data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
            <div data-options="dxTemplate: { name: \'item\' }" data-bind="text: text"></div>\
            <div data-options="dxTemplate: { name: \'newTemplate\' }">New text</div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var ACCORDION_CLASS = "dx-accordion",
    ACCORDION_WRAPPER_CLASS = "dx-accordion-wrapper",
    ACCORDION_ITEM_CLASS = "dx-accordion-item",
    ACCORDION_ITEM_TITLE_CLASS = "dx-accordion-item-title",
    ACCORDION_ITEM_BODY_CLASS = "dx-accordion-item-body",
    ACCORDION_ITEM_OPENED_CLASS = "dx-accordion-item-opened",
    ACCORDION_ITEM_CLOSED_CLASS = "dx-accordion-item-closed";

var moduleSetup = {
    beforeEach: function() {
        fx.off = true;
        this.savedSimulatedTransitionEndDelay = fx._simulatedTransitionEndDelay;
        fx._simulatedTransitionEndDelay = 0;
        executeAsyncMock.setup();

        this.$element = $("#accordion");
        this.items = [
            { title: "Title 1", text: "Text 1" },
            { title: "Title 2", text: "Text 2" },
            { title: "Title 3", text: "Text 3" }
        ];
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
        fx._simulatedTransitionEndDelay = this.savedSimulatedTransitionEndDelay;
    }
};


QUnit.module("widget rendering", moduleSetup);

QUnit.test("widget rendering", function(assert) {
    this.$element.dxAccordion();

    assert.ok(this.$element.hasClass(ACCORDION_CLASS), "widget class was added");
    assert.equal(this.$element.find("." + ACCORDION_WRAPPER_CLASS).length, 1, "widget wrapper class was added");
});

QUnit.test("widget items rendering", function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    var $container = this.$element.find("." + ACCORDION_WRAPPER_CLASS),
        $items = $container.find("." + ACCORDION_ITEM_CLASS);

    assert.equal($items.length, 3, "items were added");
    assert.equal($items.eq(0).find("." + ACCORDION_ITEM_TITLE_CLASS).length, 1, "container has item title");
    assert.equal($items.eq(0).find("." + ACCORDION_ITEM_BODY_CLASS).length, 1, "container has item content");
});

QUnit.test("first item is opened as default state", function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    assert.ok(this.$element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0).is(":visible"), "first item is opened");
});

QUnit.test("item content is hidden when item is not opened", function(assert) {
    var instance = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0
        }).dxAccordion("instance"),
        $items = this.$element.find("." + ACCORDION_ITEM_CLASS),
        $openedItems = this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS);

    assert.ok($items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "first item is opened so it has 'item opened' class");
    assert.equal($openedItems.length, 1, "only opened item has 'item opened' class");

    instance.expandItem(1);

    assert.ok(!$items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "closed item has no 'item opened' class");
    assert.ok($items.eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "opened item has 'item opened' class");
});

QUnit.test("height should be correctly updated on dxshown event", function(assert) {
    var origAnimate = fx.animate;

    try {
        var $container = $("<div>");

        var $element = $("<div>").appendTo($container).dxAccordion({
            items: this.items
        });

        $element.dxAccordion("instance");

        fx.animate = function() { assert.ok(false, "animation executed"); };

        $container.appendTo("#qunit-fixture");
        domUtils.triggerShownEvent($container);

        assert.notEqual($element.height(), 0, "height is updated");
    } finally {
        fx.animate = origAnimate;
    }
});

QUnit.test("animation shouldn't change transform property (T354912)", function(assert) {
    var origAnimate = fx.animate;

    var $element = $("<div>").appendTo("#qunit-fixture").dxAccordion({
        items: this.items,
        deferRendering: false
    });

    try {
        fx.animate = function($element, config) {
            assert.equal(config.type, "custom");

            return origAnimate($element, config);
        };

        $element.dxAccordion("instance").expandItem(1);
    } finally {
        fx.animate = origAnimate;
    }
});

QUnit.test("Item body should be rendered on item opening when the 'deferRendering' option is true", function(assert) {
    var $element = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            multiple: false,
            deferRendering: true
        }),
        instance = $element.dxAccordion("instance");

    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).length, 1, "body is rendered only for one item which is opened on init");

    instance.option("selectedIndex", 1);
    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).length, 2, "body is rendered for just opened item");
});

QUnit.test("Body should be rendered for each item on init when the 'deferRendering' option is false", function(assert) {
    var $element = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 0,
        multiple: false,
        deferRendering: false
    });

    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).length, this.items.length, "body is rendered for each item");
});

QUnit.test("Widget should be rerendered on the 'deferRendering' option change", function(assert) {
    var renderCount = 0,
        prevRenderCount,
        instance = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            multiple: false,
            deferRendering: true,
            onContentReady: function() {
                prevRenderCount = renderCount;
                renderCount++;
            }
        }).dxAccordion("instance");

    instance.option("deferRendering", false);
    assert.equal(renderCount, prevRenderCount + 1, "widget was rerendered one time on option changed");

    instance.option("deferRendering", true);
    assert.equal(renderCount, prevRenderCount + 1, "widget was rerendered one time on option changed");
});

QUnit.test("onContentReady action should be fired after opened item was rendered", function(assert) {
    var count = 0;
    this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 0,
        onContentReady: function(e) {
            assert.equal(e.element.find(".dx-accordion-item-body").length, 1, "item is opened");
            count++;
        }
    }).dxAccordion("instance");

    assert.equal(count, 1, "onContentReady was fired");

});


QUnit.module("nested accordion", moduleSetup);

QUnit.test("nested widget rendering", function(assert) {
    var that = this;

    this.$element.dxAccordion({
        items: this.items,
        itemTemplate: function() {
            return $("<div>").dxAccordion({ items: that.items });
        }
    });

    assert.equal(this.$element.dxAccordion("itemElements").length, 3, "only first level items");
});

QUnit.test("nested widget rendering", function(assert) {
    var that = this;

    var nested;
    this.$element.dxAccordion({
        items: this.items,
        itemTemplate: function() {
            nested = new Accordion($("<div>"), { items: that.items, selectedIndex: 0 });
            return nested.$element();
        }
    });

    $(nested.itemElements()).eq(1).trigger("dxclick");
    assert.equal(nested.isItemSelected(1), true, "item selected by click");
});


QUnit.module("widget options", moduleSetup);

QUnit.test("items option", function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    var $item = this.$element.find("." + ACCORDION_ITEM_CLASS).eq(0);

    assert.equal($item.find("." + ACCORDION_ITEM_TITLE_CLASS).text(), "Title 1", "item title is correct");
    assert.equal($item.find("." + ACCORDION_ITEM_BODY_CLASS).text(), "Text 1", "item content is correct");
});

QUnit.test("out of range 'selectedIndex' option", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: -1
    }).dxAccordion("instance");

    assert.equal(instance.option("selectedIndex"), 0, "'selectedIndex' option set to first when trying to set index which is out of range (-1)");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0).is(":visible"), "first item is opened when index is out of range (-1)");

    this.$element.data("dxAccordion", null);
    instance = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 5
    }).dxAccordion("instance");

    assert.equal(instance.option("selectedIndex"), 0, "'selectedIndex' option set to first when trying to set index which is out of range (5)");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0).is(":visible"), "first item is opened when index is out of range (5)");
});

QUnit.test("'onItemTitleClick' option", function(assert) {
    var actionFiredValue = 0;

    this.$element.dxAccordion({
        items: this.items,
        onItemTitleClick: function() {
            actionFiredValue++;
        }
    })
        .dxAccordion("instance");

    var $titles = this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS);

    $($titles.eq(0)).trigger("dxclick");
    assert.equal(actionFiredValue, 1, "first item was clicked");
    $($titles.eq(1)).trigger("dxclick");
    assert.equal(actionFiredValue, 2, "second item was clicked");
});

QUnit.test("itemTitleTemplate", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        itemTitleTemplate: function(itemData) {
            return $("<div>")
                .addClass("item-title-render-first")
                .text("User title: " + itemData.title);
        }
    });

    var $userElement = this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(0);

    assert.ok($userElement.children().hasClass("item-title-render-first"), "title has specified element");
    assert.equal($userElement.text(), "User title: " + this.items[0].title, "text in user element is correct");
});

QUnit.test("itemTemplate", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        itemTemplate: function(itemData, itemIndex, itemElement) {
            return $("<div>")
                .addClass("item-content-render-first")
                .text("User content: " + itemData.text);
        }
    });

    var $userElement = this.$element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0);

    assert.ok($userElement.children().hasClass("item-content-render-first"), "content has specified element");
    assert.equal($userElement.text(), "User content: " + this.items[0].text, "text in user element is correct");
});

QUnit.test("'onItemHold' option", function(assert) {
    var actionFiredValue = 0;

    this.$element.dxAccordion({
        items: this.items,
        onItemHold: function() {
            actionFiredValue++;
        },
        itemHoldTimeout: 0
    });

    $(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(0)).trigger(holdEvent.name);
    assert.equal(actionFiredValue, 1, "action is fired");
});

QUnit.test("'itemHoldTimeout' option", function(assert) {
    var actionFiredValue = 0;

    this.$element.dxAccordion({
        items: this.items,
        onItemHold: function() {
            actionFiredValue++;
        },
        itemHoldTimeout: 200
    });

    var pointer = pointerMock(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(0));

    pointer.down();
    assert.equal(actionFiredValue, 0, "action is not fired yet");
    this.clock.tick(200);
    assert.equal(actionFiredValue, 1, "action is fired");
});

QUnit.test("'onSelectionChanged' option", function(assert) {
    var actionFiredValue = 0;

    this.$element.dxAccordion({
        items: this.items,
        onSelectionChanged: function() {
            actionFiredValue++;
        }
    });

    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger("dxclick");
    assert.equal(actionFiredValue, 1, "action is fired");
});

QUnit.test("dataSource option with using array", function(assert) {
    this.$element.dxAccordion({
        dataSource: this.items
    });

    var $items = this.$element.find("." + ACCORDION_ITEM_CLASS),
        $title = $items.eq(0).find("." + ACCORDION_ITEM_TITLE_CLASS),
        $content = $items.eq(0).find("." + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($items.length, this.items.length, "all items is rendered");
    assert.equal($title.text(), this.items[0].title, "title text is correct");
    assert.equal($content.text(), this.items[0].text, "content text is correct");
});

QUnit.test("dataSource option with using DataSource", function(assert) {
    var loadActionFiredValue = 0,
        items = this.items;

    this.$element.dxAccordion({
        dataSource: new DataSource({
            load: function(loadOptions) {
                var d = new $.Deferred();

                setTimeout(function() {
                    loadActionFiredValue++;
                    d.resolve(items);
                }, 10);

                return d.promise();
            }
        })
    });

    this.clock.tick(50);
    assert.equal(loadActionFiredValue, 1, "datasource loaded");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_CLASS).length, this.items.length, "all items are rendered");
});

QUnit.test("collapsible option", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        collapsible: true
    });

    var $titles = this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS);

    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 1, "one item content is visible");
    $($titles.eq(0)).trigger("dxclick");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 0, "zero item content is visible");
});

QUnit.test("Closed class should be set after selection changed", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        collapsible: false
    });

    var $element = this.$element,
        $titles = $element.find("." + ACCORDION_ITEM_CLASS);

    assert.equal($element.find("." + ACCORDION_ITEM_CLOSED_CLASS).length, $titles.length - 1, "one item content is visible");

    $($titles.eq(1)).trigger('dxclick');

    assert.equal($titles.eq(0).hasClass(ACCORDION_ITEM_CLOSED_CLASS), true, "one item content is visible");
    assert.equal($titles.eq(1).hasClass(ACCORDION_ITEM_CLOSED_CLASS), false, "one item content is visible");
});

QUnit.test("multiple option", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        multiple: true
    });

    var $titles = this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS);

    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 1, "one item content is visible");
    $($titles.eq(1)).trigger("dxclick");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 2, "two item content is visible");
    $($titles.eq(2)).trigger("dxclick");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 3, "three item content is visible");
    $($titles.eq(2)).trigger("dxclick");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 2, "two item content is visible");
});

QUnit.test("animationDuration option", function(assert) {
    fx.off = false;

    try {
        this.$element.dxAccordion({
            items: this.items,
            animationDuration: 1000
        });

        var $item = this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1),
            $title = $item.find("." + ACCORDION_ITEM_TITLE_CLASS);

        assert.ok(!$item.hasClass(ACCORDION_ITEM_OPENED_CLASS), "content is hidden before animation is started");

        $($title).trigger("dxclick");
        assert.roughEqual($item.height(), $title.outerHeight(), 0.1, "height of the item is equal to the title height");
        this.clock.tick(1000);

        assert.ok($item.height() > $title.outerHeight(), "height is not 0 when animation is complete");
    } finally {
        fx.off = true;
    }
});

QUnit.test("disabled state option", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        disabled: true
    });

    assert.ok(this.$element.hasClass("dx-state-disabled"), "widget has 'disabled' class");

    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger("dxclick");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "no reaction after clicking on disabled widget");
    assert.ok(!this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "no reaction after clicking on disabled widget");
});

QUnit.test("visible state option", function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        visible: false
    });

    assert.ok(!this.$element.is(":visible"), "widget is hidden");
});

QUnit.test("height option in 'auto' mode", function(assert) {
    var $element = $("#html-template-accordion"),
        instance = $element.dxAccordion({
            items: [
                { title: "", html: "<div style=\"height: 50px\">" },
                { title: "", html: "<div style=\"height: 100px\">" },
                { title: "", html: "<div style=\"height: 50px\">" },
                { title: "", html: "<div style=\"height: 100px\">" }
            ],
            height: "auto",
            selectedIndex: 0
        }).dxAccordion("instance");

    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0).height(), 50, "opened item content height is correct");
    assert.equal(instance.itemElements().eq(0).get(0).style.height, "", "auto height set");

    instance.expandItem(1);
    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(1).height(), 100, "opened item content height is correct");
    assert.equal(instance.itemElements().eq(1).get(0).style.height, "", "auto height set");
});

QUnit.test("height option in static mode", function(assert) {
    var items = [
            { title: "", html: "<div style=\"height: 50px\">" },
            { title: "", html: "<div style=\"height: 100px\">" },
            { title: "", html: "<div style=\"height: 50px\">" },
            { title: "", html: "<div style=\"height: 100px\">" }
        ],
        widgetHeight = 500,
        $element = $("#html-template-accordion"),
        instance = $element.dxAccordion({
            items: items,
            height: widgetHeight,
            selectedIndex: 0
        }).dxAccordion("instance"),
        closedItemsHeight = $element.find("." + ACCORDION_ITEM_CLASS).eq(1).outerHeight() * (items.length - 1);

    assert.equal($element.find("." + ACCORDION_ITEM_CLASS).eq(0).outerHeight(), widgetHeight - closedItemsHeight, "opened item content height is correct");
    assert.notEqual(instance.itemElements().eq(0).get(0).style.height, "", "auto height not set");

    instance.expandItem(1);
    assert.equal($element.find("." + ACCORDION_ITEM_CLASS).eq(1).outerHeight(), widgetHeight - closedItemsHeight, "opened item content height is correct");
    assert.equal($element.find("." + ACCORDION_WRAPPER_CLASS).height(), widgetHeight, "item container height is correct");
    assert.notEqual(instance.itemElements().eq(1).get(0).style.height, "", "auto height not set");
});

QUnit.test("height option in 'auto' mode when widget is multiple", function(assert) {
    var $element = $("#html-template-accordion"),
        instance = $element.dxAccordion({
            items: [
            { title: "", html: "<div style=\"height: 50px\">" },
            { title: "", html: "<div style=\"height: 100px\">" },
            { title: "", html: "<div style=\"height: 50px\">" },
            { title: "", html: "<div style=\"height: 100px\">" }
            ],
            height: "auto",
            selectedIndex: 0,
            multiple: true
        }).dxAccordion("instance");

    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0).height(), 50, "opened item content height is correct");

    instance.expandItem(1);
    assert.equal($element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(1).height(), 100, "opened item content height is correct");
});

QUnit.test("height option in static mode when widget is multiple", function(assert) {
    var items = [
            { title: "", html: "<div style=\"height: 50px\">" },
            { title: "", html: "<div style=\"height: 100px\">" },
            { title: "", html: "<div style=\"height: 50px\">" },
            { title: "", html: "<div style=\"height: 100px\">" }
        ],
        widgetHeight = 500,
        $element = $("#html-template-accordion"),
        instance = $element.dxAccordion({
            items: items,
            height: widgetHeight,
            selectedIndex: 0,
            multiple: true
        }).dxAccordion("instance"),
        closedItemHeight = $element.find("." + ACCORDION_ITEM_CLASS).eq(1).outerHeight();

    assert.equal($element.find("." + ACCORDION_ITEM_CLASS).eq(0).outerHeight(), widgetHeight - closedItemHeight * (items.length - 1), "opened item content height is correct");

    instance.expandItem(1);
    var openedItemsCount = 2,
        closedItemsCount = items.length - openedItemsCount;

    assert.equal($element.find("." + ACCORDION_ITEM_CLASS).eq(0).outerHeight(), (widgetHeight - closedItemHeight * closedItemsCount) / openedItemsCount, "opened item content height is correct");
    assert.equal($element.find("." + ACCORDION_ITEM_CLASS).eq(1).outerHeight(), (widgetHeight - closedItemHeight * closedItemsCount) / openedItemsCount, "opened item content height is correct");
    assert.equal($element.find("." + ACCORDION_WRAPPER_CLASS).height(), widgetHeight, "item container height is correct");
});


QUnit.module("widget options changed", moduleSetup);

QUnit.test("items options is changed", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items
    }).dxAccordion("instance");

    instance.option("items", [
        { title: "Title 2", text: "Text 2" }
    ]);

    var $items = this.$element.find("." + ACCORDION_ITEM_CLASS);

    assert.equal($items.length, 1, "one item is rendered");
    assert.equal($items.eq(0).find("." + ACCORDION_ITEM_TITLE_CLASS).text(), "Title 2", "item title is correct");
    assert.equal($items.eq(0).find("." + ACCORDION_ITEM_BODY_CLASS).text(), "Text 2", "item content is correct");
});

QUnit.test("selectedIndex option changing", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items
    }).dxAccordion("instance");

    instance.option("selectedIndex", 1);
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "second item is opened");

    instance.option("selectedIndex", -1);
    assert.equal(instance.option("selectedIndex"), 1, "'selectedIndex' option set to first when trying to set index which is out of range (-1)");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "first item is opened when index is out of range (-1)");

    instance.option("selectedIndex", 5);
    assert.equal(instance.option("selectedIndex"), 1, "'selectedIndex' option set to first when trying to set index which is out of range (5)");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "first item is opened when index is out of range (5)");
});

QUnit.test("'onItemTitleClick' option changed", function(assert) {
    var firstActionFired,
        secondActionFired,
        instance = this.$element.dxAccordion({
            items: this.items,
            onItemTitleClick: function() {
                firstActionFired = true;
            }
        }).dxAccordion("instance");

    instance.option("onItemTitleClick", function() {
        secondActionFired = true;
    });

    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS)).trigger("dxclick");
    assert.ok(!firstActionFired, "first action was not fired");
    assert.ok(secondActionFired, "second action was fired");
});

QUnit.test("itemTitleTemplate option changed", function(assert) {
    var $element = $("#templated-accordion"),
        instance = $element.dxAccordion({
            items: this.items,
            itemTitleTemplate: "title"
        }).dxAccordion("instance");

    instance.option("itemTitleTemplate", "newTemplate");

    var $title = $element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(0);

    assert.equal($title.text(), "New text", "title contains text from template");
});

QUnit.test("itemTemplate option changed", function(assert) {
    var $element = $("#templated-accordion"),
        instance = $element.dxAccordion({
            items: this.items,
            itemTemplate: "content"
        }).dxAccordion("instance");

    instance.option("itemTemplate", "newTemplate");

    var $content = $element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0);

    assert.equal($content.text(), "New text", "title contains text from template");
});

QUnit.test("itemTitleTemplate option changed (function)", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items,
        itemTitleTemplate: function(itemData, itemIndex, itemElement) {
            return $("<div>")
                .addClass("item-title-render-first")
                .text("User title: " + itemData.title);
        }
    }).dxAccordion("instance");

    instance.option("itemTitleTemplate", function(itemData, itemIndex, itemElement) {
        return $("<div>")
            .addClass("item-title-render-changed")
            .text("Changed: " + itemData.title);
    });

    var $item = this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(0);

    assert.ok(!$item.children().hasClass("item-title-render-first"), "title is not rendered by initial render");
    assert.ok($item.children().hasClass("item-title-render-changed"), "title is element specified in new render function");

    assert.equal($item.text(), "Changed: " + this.items[0].title, "text in rendered element is correct");
});

QUnit.test("itemTemplate option changed (function)", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items,
        itemTitleRender: function(itemData, itemIndex, itemElement) {
            return $("<div>")
                .addClass("item-content-render-first")
                .text("User content: " + itemData.text);
        }
    }).dxAccordion("instance");

    instance.option("itemTemplate", function(itemData, itemIndex, itemElement) {
        return $("<div>")
            .addClass("item-content-render-changed")
            .text("Changed: " + itemData.text);
    });

    var $item = this.$element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(0);
    assert.ok(!$item.children().hasClass("item-content-render-first"), "content is not rendered by initial render");
    assert.ok($item.children().hasClass("item-content-render-changed"), "content has element specified in new render function");

    assert.equal($item.text(), "Changed: " + this.items[0].text, "text in rendered element is correct");
});

QUnit.test("collapsible option changed", function(assert) {
    var instance = this.$element.dxAccordion({
            items: this.items,
            collapsible: true
        }).dxAccordion("instance"),
        $titles = this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS);

    $($titles.eq(1)).trigger("dxclick");
    instance.option("collapsible", false);

    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 1, "only one item is opened");
});

QUnit.test("animationDuration option changed", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items,
        animationDuration: 3000
    }).dxAccordion("instance");

    fx.off = false;

    try {
        instance.option("animationDuration", 1000);

        var $item = this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1),
            $title = $item.find("." + ACCORDION_ITEM_TITLE_CLASS);

        assert.ok(!$item.hasClass(ACCORDION_ITEM_OPENED_CLASS), "content is hidden before animation is started");

        $($title).trigger("dxclick");
        assert.roughEqual($item.height(), $title.outerHeight(), 0.1, "height of the item is equal to the title height");
        this.clock.tick(1000);

        assert.ok($item.height() > $title.outerHeight(), "height is not 0 when animation is complete");
    } finally {
        fx.off = true;
    }
});

QUnit.test("'itemHoldTimeout' option changed", function(assert) {
    var actionFiredValue = 0;

    var instance = this.$element.dxAccordion({
        items: this.items,
        onItemHold: function() {
            actionFiredValue++;
        },
        itemHoldTimeout: 500
    }).dxAccordion("instance");

    var pointer = pointerMock(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(0));

    instance.option("itemHoldTimeout", 200);
    pointer.down();
    assert.equal(actionFiredValue, 0, "action is not fired yet");
    this.clock.tick(200);
    assert.equal(actionFiredValue, 1, "action is fired");
});

QUnit.test("disabled state option", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items,
        disabled: false
    }).dxAccordion("instance");

    instance.option("disabled", true);
    assert.ok(this.$element.hasClass("dx-state-disabled"), "widget has 'disabled' class");
    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger("dxclick");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "no reaction after clicking on disabled widget");
    assert.ok(!this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "no reaction after clicking on disabled widget");

    instance.option("disabled", false);
    assert.ok(!this.$element.hasClass("dx-state-disabled"), "widget has no 'disabled' class");
    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger("dxclick");
    assert.ok(!this.$element.find("." + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "item is unselected after clicking on the other title on enabled widget");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "item is selected after clicking on enabled widget");
});

QUnit.test("visible state option", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items
    }).dxAccordion("instance");

    instance.option("visible", false);
    assert.ok(!this.$element.is(":visible"), "widget is hidden");
    instance.option("visible", true);
    assert.ok(this.$element.is(":visible"), "widget is shown");
});

QUnit.test("'onItemRendered' option", function(assert) {
    var actionValue = 0;

    this.$element.dxAccordion({
        items: this.items,
        onItemRendered: function() {
            actionValue++;
        }
    });

    assert.equal(actionValue, this.items.length, "'onItemRendered' fired once for each item");
});

QUnit.test("disabled state option of single item on init", function(assert) {
    this.$element.dxAccordion({
        items: [
            { title: "Title 1", text: "Text 1" },
            { title: "Title 2", text: "Text 2", disabled: true }
        ]
    }).dxAccordion("instance");

    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass("dx-state-disabled"), "item has disabled-state class");
});


QUnit.module("widget behavior", moduleSetup);

QUnit.test("item selection", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items
    }).dxAccordion("instance");

    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger("dxclick");

    assert.equal(instance.option("selectedIndex"), 1, "second item is selected");
    assert.notEqual(this.$element.find("." + ACCORDION_ITEM_BODY_CLASS).eq(1).css("display"), "none", "selected item's content is shown");
});

QUnit.test("only clicked item is opened", function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger("dxclick");
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), "second item is opened");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 1, "only one item is opened");

    $(this.$element.find("." + ACCORDION_ITEM_TITLE_CLASS).eq(2)).trigger("dxclick");
    this.clock.tick(300);
    assert.ok(this.$element.find("." + ACCORDION_ITEM_CLASS).eq(2).hasClass(ACCORDION_ITEM_OPENED_CLASS), "third item is opened");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 1, "only one item is opened");
});

QUnit.test("expandItem public method", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items
    }).dxAccordion("instance");

    instance.expandItem(2);
    var $items = this.$element.find("." + ACCORDION_ITEM_CLASS),
        itemsVisible = this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length;

    assert.ok($items.eq(2).hasClass(ACCORDION_ITEM_OPENED_CLASS), "specified item is opened");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 1, "only one item is opened");
    assert.equal(instance.option("selectedIndex"), 2, "'selectedIndex' is correct");

    instance.option("multiple", true);
    instance.expandItem(0);
    $items = this.$element.find("." + ACCORDION_ITEM_CLASS);
    itemsVisible = this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length;

    assert.ok($items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "specified item is opened in multiple mode");
    assert.equal(this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length, 2, "two items are opened in multiple mode");
    assert.equal(instance.option("selectedItems").length, 2, "two items are selected in multiple mode");
});

QUnit.test("collapseItem public method", function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items
    }).dxAccordion("instance");

    instance.collapseItem(0);
    var $items = this.$element.find("." + ACCORDION_ITEM_BODY_CLASS),
        itemsVisible = this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length;

    assert.ok($items.eq(0).is(":visible"), "specified item is not closed in non-collapsible mode");
    assert.equal(itemsVisible, 1, "one item is opened");

    instance.option("collapsible", true);
    instance.collapseItem(0);
    $items = this.$element.find("." + ACCORDION_ITEM_BODY_CLASS);
    itemsVisible = this.$element.find("." + ACCORDION_ITEM_OPENED_CLASS).length;

    assert.ok(!$items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), "specified item is closed in non-collapsible mode");
    assert.equal(itemsVisible, 0, "ne items are opened");
});

QUnit.test("expandItem method should return deferred", function(assert) {
    var actionValue = 0,
        instance = this.$element.dxAccordion({
            items: this.items,
            animationDuration: 300
        }).dxAccordion("instance");


    fx.off = false;

    instance.expandItem(2).done(function() {
        actionValue++;
    });

    assert.equal(actionValue, 0, "waiting animation to complete before method execution");
    this.clock.tick(300);
    assert.equal(actionValue, 1, "method executed after animation completed");
});

QUnit.test("collapseItem method should return deferred", function(assert) {
    var actionValue = 0,
        instance = this.$element.dxAccordion({
            items: this.items,
            animationDuration: 300,
            collapsible: true
        }).dxAccordion("instance");


    fx.off = false;

    instance.collapseItem(0).done(function() {
        actionValue++;
    });

    assert.equal(actionValue, 0, "waiting animation to complete before method execution");
    this.clock.tick(300);
    assert.equal(actionValue, 1, "method executed after animation completed");
});

QUnit.test("'onItemClick' firing conditions", function(assert) {
    var titleActionFired = 0,
        itemActionFired = 0;

    this.$element.dxAccordion({
        items: this.items,
        onItemClick: function() {
            itemActionFired++;
        },
        onItemTitleClick: function() {
            titleActionFired++;
        }
    })
        .dxAccordion("instance");

    var $items = this.$element.find("." + ACCORDION_ITEM_CLASS);

    $($items.eq(0).find("." + ACCORDION_ITEM_TITLE_CLASS)).trigger("dxclick");
    assert.equal(titleActionFired, 1, "onItemTitleClick was fired on itemTitle click");
    assert.equal(itemActionFired, 1, "'onItemClick' was fired on itemTitle click");

    $($items.eq(0).find("." + ACCORDION_ITEM_BODY_CLASS)).trigger("dxclick");
    assert.equal(titleActionFired, 1, "onItemTitleClick was not fired on itemContent click");
    assert.equal(itemActionFired, 2, "'onItemClick' was fired on itemContent click");
});


QUnit.module("update method");

QUnit.test("update should recalculate widget height", function(assert) {
    var done = assert.async();

    var $container = $("#container").height(100);
    var $accordion = $("#accordion").dxAccordion({
        items: [1],
        selectedIndex: 0,
        animationDuration: 0,
        height: '100%'
    });
    var $item = $accordion.dxAccordion("itemElements").eq(0);
    var height = $item.height();

    $container.height(200);
    $accordion.dxAccordion("updateDimensions").done(function() {
        assert.equal($item.height(), height + 100, "height was recalculated");
        done();
    });
});

QUnit.test("update should recalculate widget height with animation", function(assert) {
    var $container = $("#container").height(100);
    var $accordion = $("#accordion").dxAccordion({
        items: [1],
        selectedIndex: 0,
        animationDuration: 0,
        height: '100%'
    });
    var $item = $accordion.dxAccordion("itemElements").eq(0);

    $container.height(200);
    $accordion.dxAccordion("updateDimensions");
    assert.equal(fx.isAnimating($item), true, "animation present");
});

QUnit.test("update result should should be resolved after animation complete", function(assert) {
    var done = assert.async();

    var $container = $("#container").height(100);
    var $accordion = $("#accordion").dxAccordion({
        items: [1],
        selectedIndex: 0,
        animationDuration: 0,
        height: '100%'
    });
    var $item = $accordion.dxAccordion("itemElements").eq(0);

    $container.height(200);
    $accordion.dxAccordion("updateDimensions").done(function() {
        assert.equal(fx.isAnimating($item), false, "animation is complete");
        done();
    });
});

QUnit.module("keyboard navigation", moduleSetup);

QUnit.test("selectedIndex changes by keyboard", function(assert) {
    assert.expect(1);

    var instance = this.$element.dxAccordion({
            items: this.items,
            focusStateEnabled: true,
            selectedIndex: 0
        }).dxAccordion("instance"),
        keyboard = keyboardMock(this.$element);

    $(this.$element).trigger("focusin");
    keyboard.keyDown("down");
    keyboard.keyDown("space");
    assert.equal(instance.option("selectedIndex"), 1, "index is right");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#accordion").dxAccordion();

    assert.equal($element.attr("role"), "tablist", "role is correct");
});

QUnit.test("aria-multiselectable property", function(assert) {
    var $element = $("#accordion").dxAccordion({
            multiple: false
        }),
        instance = $element.dxAccordion("instance");

    assert.equal($element.attr("aria-multiselectable"), "false", "multiselectable on init");

    instance.option("multiple", true);
    assert.equal($element.attr("aria-multiselectable"), "true", "multiselectable on option change");
});

QUnit.test("role for items", function(assert) {
    var $element = $("#accordion").dxAccordion({
            items: [{ title: "Title 1", text: "Text 1" }]
        }),
        $item = $element.find(".dx-accordion-item");

    assert.equal($item.attr("role"), "tab", "role for item is correct");
});

QUnit.test("body should be hidden if item is closed", function(assert) {
    var accordion = new Accordion($("#accordion"), {
            items: [{ title: "Title 1", text: "Text 1" }],
            collapsible: true,
            selectedIndex: -1,
            deferRendering: false
        }),
        $itemBody = accordion.itemElements().eq(0).find("." + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($itemBody.attr("aria-hidden"), "true", "body not readable");

    accordion.expandItem(0);
    assert.equal($itemBody.attr("aria-hidden"), "false", "body readable");

    accordion.collapseItem(0);
    assert.equal($itemBody.attr("aria-hidden"), "true", "body readable");
});


QUnit.module("default title template", {
    prepareItemTest: function(data) {
        var accordion = new Accordion($("<div>"), {
            items: [data]
        });

        return accordion.itemElements().eq(0).find("." + ACCORDION_ITEM_TITLE_CLASS).contents();
    }
});

QUnit.test("template should be rendered correctly with title", function(assert) {
    var $content = this.prepareItemTest({
        title: "test",
        icon: "test"
    });

    assert.equal($content.text(), "test");
    assert.equal($content.filter(".dx-icon-test").length, 1);
});

QUnit.test("template should be rendered correctly with icon path", function(assert) {
    var $content = this.prepareItemTest({
        icon: "test.png"
    });

    assert.equal($content.filter(".dx-icon[src='test.png']").length, 1);
});

QUnit.test("template should be rendered correctly with external icon", function(assert) {
    var $content = this.prepareItemTest({
        icon: "fa fa-icon"
    });

    assert.equal($content.filter(".fa.fa-icon").length, 1);
});

QUnit.test("template should be rendered correctly with title with html", function(assert) {
    var $content = this.prepareItemTest({
        title: "test",
        html: "[test]"
    });

    assert.equal($content.text(), "test");
});
