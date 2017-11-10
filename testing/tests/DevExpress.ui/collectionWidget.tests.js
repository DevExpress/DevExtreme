"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    registerComponent = require("core/component_registrator"),
    DataSource = require("data/data_source/data_source").DataSource,
    Store = require("data/abstract_store"),
    ArrayStore = require("data/array_store"),
    setTemplateEngine = require("ui/set_template_engine"),
    support = require("core/utils/support"),
    holdEvent = require("events/hold"),
    CollectionWidget = require("ui/collection/ui.collection_widget.edit"),
    List = require("ui/list"),

    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    pointerMock = require("../../helpers/pointerMock.js"),

    editingTests = require("./collectionWidgetParts/editingTests.js");

var ITEM_CLASS = "dx-item",
    ITEM_CONTENT_CLASS = "dx-item-content",

    DEFAULT_EMPTY_TEXT = "No data to display",
    EMPTY_MESSAGE_CLASS = "dx-empty-message",

    COLLECTION_CLASS = "dx-collection",
    FOCUSED_ITEM_CLASS = "dx-state-focused",
    ACTIVE_ITEM_CLASS = "dx-state-active";

var TestComponent = CollectionWidget.inherit({

    NAME: "TestComponent",

    _activeStateUnit: ".item",

    _itemClass: function() {
        return "item";
    },

    _itemDataKey: function() {
        return "123";
    },

    _itemContainer: function() {
        return this.element();
    },

    _createActionByOption: function(optionName, config) {
        this.__actionConfigs[optionName] = config;
        return this.callBase.apply(this, arguments);
    },
    __actionConfigs: {}
});


QUnit.testStart(function() {
    var markup = '\
        <div id="cmp"></div>\
        \
        <div id="cmp-with-template">\
            <div data-options="dxTemplate : { name: \'testTemplate\' } ">\
                First Template\
            </div>\
        </div>\
        \
        <div id="cmp-with-zero-template">\
            <div data-options="dxTemplate: {name: \'0\'}">zero</div>\
        </div>\
        \
        <script type="text/html" id="externalTemplate">\
            Test\
        </script>\
        \
        <script type="text/html" id="externalTemplateNoRootElement">\
            Outer text <div>Test</div>\
        </script>\
        \
        <div id="container-with-jq-template">\
            <div data-options="dxTemplate : { name: \'firstTemplate\' } ">\
                First Template\
            </div>\
            <div data-options="dxTemplate : { name: \'secondTemplate\' } ">\
                Second Template\
            </div>\
        </div>\
    ';

    $("#qunit-fixture").html(markup);
});

editingTests.run();

QUnit.module("render", {
    beforeEach: function() {
        this.element = $("#cmp");
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
    }
});

QUnit.test("markup init", function(assert) {
    var element = this.element;
    new TestComponent(element, {});

    assert.ok(element.hasClass(COLLECTION_CLASS), "collection widget has dx-collection class");
});

QUnit.test("item content should be wrapped", function(assert) {
    var element = this.element;
    var component = new TestComponent(element, { items: [1] });

    var $item = component.itemElements().eq(0),
        $itemContent = $item.children();

    assert.ok($item.hasClass(ITEM_CLASS), "item has correct class");
    assert.ok($item.hasClass("item"), "item has correct specific class");
    assert.equal($itemContent.length, 1, "item content only one");
    assert.ok($itemContent.hasClass(ITEM_CONTENT_CLASS), "item content has correct class");
    assert.ok($itemContent.hasClass("item-content"), "content has correct specific class");
    assert.equal($itemContent.contents().text(), "1", "item content placed inside content");
});

QUnit.test("custom render func, returns jquery", function(assert) {
    var element = this.element;

    new TestComponent("#cmp", {
        items: [{
            testProp: 0
        }, {
            testProp: 1
        }, {
            testProp: 2
        }],
        itemTemplate: function(item, index, itemElement) {
            assert.ok(itemElement.hasClass(ITEM_CONTENT_CLASS), "content class added");
            return $("<span />").html("Text is: " + String(item.testProp) + ";");
        }
    });

    assert.equal(element.find(".item").length, 3);
    assert.equal($.trim(element.text()), "Text is: 0;Text is: 1;Text is: 2;");
});


QUnit.test("custom render func, returns jquery", function(assert) {
    var element = this.element;
    new TestComponent("#cmp", {
        items: [{
            testProp: 3
        }, {
            testProp: 4
        }, {
            testProp: 5
        }],
        itemTemplate: function(item, index, itemElement) {
            itemElement.append($("<span />").html("Text is: " + String(item.testProp) + ";"));
        }
    });

    assert.equal(element.find(".item").length, 3);
    assert.equal($.trim(element.text()), "Text is: 3;Text is: 4;Text is: 5;");
});

QUnit.test("custom render func, returns string", function(assert) {
    var element = this.element;

    new TestComponent("#cmp", {
        items: [{
            testProp: "0"
        }, {
            testProp: "1"
        }, {
            testProp: ""
        }],
        itemTemplate: function(item, index, itemElement) {
            return "Text is: " + String(item.testProp) + ";";
        }
    });

    assert.equal(element.find(".item").length, 3);
    assert.equal($.trim(element.text()), "Text is: 0;Text is: 1;Text is: ;");
});

QUnit.test("custom render func, returns numbers", function(assert) {
    var element = this.element;

    new TestComponent("#cmp", {
        items: [0, 1],
        itemRender: function(item, index, itemElement) {
            return item;
        }
    });

    assert.equal(element.find(".item").length, 2);
    assert.equal($.trim(element.text()), "01");
});

QUnit.test("itemTemplateProperty option", function(assert) {
    var $element = $("#cmp-with-template"),
        instance = new TestComponent(
            $element, {
                itemTemplateProperty: "itemTemplate",
                items: [{ itemTemplate: "testTemplate" }]
            });

    var $item = instance.itemElements().eq(0);
    assert.equal($.trim($item.text()), "First Template", "item has correct template");
});

QUnit.test("item takes new template", function(assert) {
    var componentWithTemplate = new TestComponent("#cmp-with-template", { itemTemplate: "testTemplate" }),
        component = new TestComponent("#cmp", { itemTemplate: componentWithTemplate._getTemplateByOption("itemTemplate") });
    assert.equal(component._getTemplateByOption("itemTemplate"), componentWithTemplate._getTemplateByOption("itemTemplate"));
});

QUnit.test("anonymous item template", function(assert) {
    var $element = $("<div>").append($("<div>").addClass("test"));

    new TestComponent($element, {
        items: [1, 2]
    });

    assert.equal($element.find(".test").length, 2);
});

QUnit.test("'itemTemplate' as DOM node", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1, 2],
        itemTemplate: $("<div>Test</div>").get(0)
    });

    assert.equal($element.children().length, 2);
    assert.equal($.trim($element.children().eq(0).text()), "Test");
    assert.equal($.trim($element.children().eq(1).text()), "Test");
});

QUnit.test("'itemTemplate' as jQuery element", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1, 2],
        itemTemplate: $("<div>Test</div>")
    });

    assert.equal($element.children().length, 2);
    assert.equal($.trim($element.children().eq(0).text()), "Test");
    assert.equal($.trim($element.children().eq(1).text()), "Test");
});

QUnit.test("'itemTemplate' as jQuery element with custom template engine", function(assert) {
    setTemplateEngine({
        compile: noop,
        render: function() { return $("<div>custom engine</div>"); }
    });

    try {
        var $element = $("#cmp");

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate: $("<div>")
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), "custom engine");
        assert.equal($.trim($element.children().eq(1).text()), "custom engine");
    } finally {
        setTemplateEngine("default");
    }
});

QUnit.test("'itemTemplate' as function returning template name", function(assert) {
    var $element = $("#cmp-with-template");

    new TestComponent($element, {
        items: [1, 2],
        itemTemplate: function() { return "testTemplate"; }
    });

    assert.equal($element.children().length, 2);
    assert.equal($.trim($element.children().eq(0).text()), "First Template");
    assert.equal($.trim($element.children().eq(1).text()), "First Template");
});

QUnit.test("'itemTemplate' as function returning template name that is not string", function(assert) {
    var $element = $("#cmp-with-zero-template");

    new TestComponent($element, {
        items: [0],
        itemTemplate: function() { return 0; }
    });

    assert.equal($.trim($element.find("." + ITEM_CONTENT_CLASS).eq(0).text()), "zero");
});

QUnit.test("'itemTemplate' as function returning string", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [0],
        itemTemplate: function() { return "0"; }
    });

    assert.equal($.trim($element.find("." + ITEM_CONTENT_CLASS).eq(0).text()), "0");
});

QUnit.test("'itemTemplate' as function returning template DOM node", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1, 2],
        itemTemplate: function() { return $("<div>Test</div>").get(0); }
    });

    assert.equal($element.children().length, 2);
    assert.equal($.trim($element.children().eq(0).text()), "Test");
    assert.equal($.trim($element.children().eq(1).text()), "Test");
});

QUnit.test("'itemTemplate' as function returning template jQuery element", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1],
        itemTemplate: function() { return $("<div>Test</div>"); }
    });

    assert.equal($.trim($element.find("." + ITEM_CONTENT_CLASS).children().text()), "Test");
});

QUnit.test("'itemTemplate' as script element", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1],
        itemTemplate: $("#externalTemplate")
    });

    assert.equal($.trim($element.find("." + ITEM_CONTENT_CLASS).html()), "Test");
});

QUnit.test("'itemTemplate' as script element (no root element)", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1, 2],
        itemTemplate: $("#externalTemplateNoRootElement")
    });

    assert.equal($element.children().length, 2);
    assert.equal($.trim($element.children().eq(0).text()), "Outer text Test");
    assert.equal($.trim($element.children().eq(1).text()), "Outer text Test");
});

QUnit.test("'itemTemplate' as script element (no root element) with string renderer in template engine (T161432)", function(assert) {
    setTemplateEngine({
        compile: function(element) {
            return element.html();
        },
        render: function(template, data) {
            return template;
        }
    });

    try {
        var $element = $("#cmp");

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate: $("#externalTemplateNoRootElement")
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), "Outer text Test");
        assert.equal($.trim($element.children().eq(1).text()), "Outer text Test");
    } finally {
        setTemplateEngine("default");
    }
});

QUnit.test("No data text message - no items and source", function(assert) {
    var component = new TestComponent("#cmp", {});
    assert.equal(component.element().find("." + EMPTY_MESSAGE_CLASS).length, 1);
});

QUnit.test("No data text message - empty items", function(assert) {
    var list = new List(this.element);

    list.option("items", null);
    assert.equal(this.element.find("." + EMPTY_MESSAGE_CLASS).length, 1);

    list.option("items", []);
    assert.equal(this.element.find("." + EMPTY_MESSAGE_CLASS).length, 1);

    list.option("items", [1]);
    assert.equal(this.element.find("." + EMPTY_MESSAGE_CLASS).length, 0);
});

QUnit.test("No data text message - empty dataSource", function(assert) {
    executeAsyncMock.setup();

    new TestComponent("#cmp", {
        dataSource: {
            store: new ArrayStore([])
        }
    });

    assert.equal(this.element.find("." + EMPTY_MESSAGE_CLASS).length, 1);

    this.element.empty().dxList({
        dataSource: {
            store: new ArrayStore([1])
        }
    });

    assert.equal(this.element.find("." + EMPTY_MESSAGE_CLASS).length, 0);
});

QUnit.test("No data text message - value", function(assert) {
    new TestComponent("#cmp");
    assert.equal(this.element.find("." + EMPTY_MESSAGE_CLASS).text(), DEFAULT_EMPTY_TEXT);
});

QUnit.test("No data text message - custom value", function(assert) {
    var noDataText = "noDataText";

    var component = new TestComponent("#cmp", {
        noDataText: noDataText
    });

    assert.equal(component.element().find("." + EMPTY_MESSAGE_CLASS).text(), noDataText);

    noDataText = noDataText + "123";
    component.option({ noDataText: noDataText });
    assert.equal(component.element().find("." + EMPTY_MESSAGE_CLASS).text(), noDataText);
});

QUnit.test("message element is not rendered if no data text is null, '', false", function(assert) {
    var component = new TestComponent("#cmp", {
        noDataText: null
    });

    assert.equal(component.element().find("." + EMPTY_MESSAGE_CLASS).length, 0);

    component.option({ noDataText: false });
    assert.equal(component.element().find("." + EMPTY_MESSAGE_CLASS).length, 0);

    component.option({ noDataText: "" });
    assert.equal(component.element().find("." + EMPTY_MESSAGE_CLASS).length, 0);
});

QUnit.test("No data message may contain HTML markup", function(assert) {
    var component = new TestComponent("#cmp", {
            noDataText: "<div class=\"custom\">No data custom</div>"
        }),
        $noDataContainer = component.element().find("." + EMPTY_MESSAGE_CLASS);

    assert.equal($noDataContainer.find(".custom").length, 1, "custom HTML markup is present");
});

QUnit.test("B235442 - 'No data to display' blinks while items loading ", function(assert) {
    var store = new ArrayStore([0, 1, 3, 4]),
        source = new DataSource(store),
        el = this.element;

    new TestComponent(el, {
        dataSource: source
    });

    assert.equal(el.find("." + EMPTY_MESSAGE_CLASS).length, 0);
});

QUnit.test("B235884 - 'No data' no show ", function(assert) {
    var deferred = $.Deferred(),
        el = this.element;

    var component = new TestComponent(el, {
        dataSource: {
            load: function() {
                return deferred.promise();
            }
        }
    });

    assert.equal(el.find("." + EMPTY_MESSAGE_CLASS).length, 0, "'No data' absent, loading now");
    assert.ok(component._dataSource.isLoading());

    deferred.resolve([]);
    assert.ok(!component._dataSource.isLoading());

    assert.equal(el.find("." + EMPTY_MESSAGE_CLASS).length, 1, "'No data' shown");
});

QUnit.test("render items with multiple templates, jquery scenario", function(assert) {
    var $element = $("#container-with-jq-template"),
        testSet = ["First Template", "Second Template", "eraser", "abc", "pencil", "First Template"],

        $items;

    new TestComponent($element, {
        items: [
            {
                text: "book",
                template: "firstTemplate"
            },
            {
                text: "pen",
                template: "secondTemplate"
            },
            {
                text: "eraser" //no template - use default
            },
            {
                text: "note", //not defined template - render template name
                template: "abc"
            },
            {
                text: "pencil", // null-defined template - use default
                template: null
            },
            {
                text: "liner",
                template: "firstTemplate"
            }
        ]
    });

    $items = $element.find(".item");
    assert.equal($items.length, testSet.length, "quantity of a test set items and rendered items are equal");

    $items.each(function(index) {
        assert.equal($.trim($(this).text()), testSet[index]);
    });
});

QUnit.test("onContentReady should be fired after if dataSource isn't empty", function(assert) {
    var count = 0;

    new TestComponent("#cmp", {
        onContentReady: function() { count++; },
        dataSource: [1]
    });

    assert.equal(count, 1, "onContentReady fired after dataSource load");
});

QUnit.test("onContentReady should be fired after if dataSource is empty", function(assert) {
    var count = 0;

    new TestComponent("#cmp", {
        onContentReady: function() { count++; },
        dataSource: []
    });

    assert.equal(count, 1, "onContentReady fired after dataSource load");
});

QUnit.test("onContentReady should be fired after if items isn't empty", function(assert) {
    var count = 0;

    new TestComponent("#cmp", {
        onContentReady: function() { count++; },
        items: [1]
    });

    assert.equal(count, 1, "onContentReady fired");
});

QUnit.test("onContentReady should be fired after if items is empty", function(assert) {
    var count = 0;

    new TestComponent("#cmp", {
        onContentReady: function() { count++; },
        items: []
    });

    assert.equal(count, 1, "onContentReady fired");
});

QUnit.test("item.visible property changing should not re-render whole item (T259051)", function(assert) {
    var instance = new TestComponent("#cmp", {
            items: [{ text: '1' }]
        }),
        $item = instance.element().find(".item");

    instance.option("items[0].visible", true);
    assert.ok($item.is(instance.element().find(".item")));
});

QUnit.test("item.disabled property changing should not re-render whole item", function(assert) {
    var instance = new TestComponent("#cmp", {
            items: [{ text: '1' }]
        }),
        $item = instance.element().find(".item");

    instance.option("items[0].disabled", true);
    assert.ok($item.is(instance.element().find(".item")));
});


QUnit.module("events", {
    beforeEach: function() {
        registerComponent("TestComponent", TestComponent);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        $.fn["TestComponent"] = null;
        this.clock.restore();
    }
});

QUnit.test("onItemClick should be fired when item is clicked", function(assert) {
    var actionFired,
        actionData;

    var $element = $("#cmp");

    new TestComponent($element, {
        items: ["0", "1", "2"],
        onItemClick: function(args) {
            actionFired = true;
            actionData = args;
        }
    });

    var $item = $element.find(".item").eq(1);

    $item.trigger("dxclick");
    assert.ok(actionFired, "action fired");
    assert.strictEqual(actionData.itemElement[0], $item[0], "correct element passed");
    assert.strictEqual(actionData.itemData, "1", "correct element passed");
    assert.strictEqual(actionData.itemIndex, 1, "correct element itemIndex passed");
});

QUnit.test("onItemClick should have correct item index when placed near another collection", function(assert) {
    var actionFired,
        actionData;

    var $element = $("#cmp");

    new TestComponent($element, {
        items: ["0", "1", "2"],
        onItemClick: function(args) {
            actionFired = true;
            actionData = args;
        }
    });

    var $item = $element.find(".item").eq(1);

    new TestComponent($("<div>").insertBefore($element), {
        items: ["0", "1", "2"]
    });

    $item.trigger("dxclick");
    assert.strictEqual(actionData.itemIndex, 1, "correct element itemIndex passed");
});

QUnit.test("item should not have active-state class after click, if it is disabled", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        activeStateEnabled: true,
        items: [{ text: "0", disabled: true }, "1", "2"],
    });

    var $item = $element.find(".item").eq(0),
        pointer = pointerMock($item);

    pointer.start().down();
    this.clock.tick(30);
    assert.ok(!$item.hasClass(ACTIVE_ITEM_CLASS), "active state was not toggled for disabled item");
});

QUnit.test("item should not have focus-state class after focusin, if it is disabled", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [{ text: "0", disabled: true }, "1", "2"],
    });

    var $item = $element.find(".item").eq(0);

    $item.trigger("dxpointerdown");
    this.clock.tick();

    assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), "focus state was not toggled for disabled item");
});

QUnit.test("Action should be fired when item is held", function(assert) {
    var actionFired,
        actionData;

    var $element = $("#cmp");

    new TestComponent($element, {
        items: ["0"],
        onItemHold: function(args) {
            actionFired = true;
            actionData = args;
        }
    });

    var $item = $element.find(".item");

    $item.trigger(holdEvent.name);
    assert.ok(actionFired, "action fired");
    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual("0", actionData.itemData, "correct element passed");
});

QUnit.test("onItemHold should be fired when action changed dynamically", function(assert) {
    var actionFired;

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: ["0"]
        }),
        $item = $element.find(".item");

    instance.option("onItemHold", function(args) {
        actionFired = true;
    });
    $item.trigger(holdEvent.name);
    assert.ok(actionFired, "action fired");
});

QUnit.test("itemHold event should be fired", function(assert) {
    var actionFired;

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: ["0"]
        }),
        $item = $element.find(".item");

    instance.on("itemHold", function(args) {
        actionFired = true;
    });
    $item.trigger(holdEvent.name);
    assert.ok(actionFired, "action fired");
});

QUnit.test("itemHoldTimeout should be passed to hold event", function(assert) {
    var actionFired;
    var $element = $("#cmp");

    new TestComponent($element, {
        items: ["0"],
        itemHoldTimeout: 100,
        onItemHold: function(args) {
            actionFired = true;
        }
    });

    var $item = $element.find(".item"),
        pointer = pointerMock($item);

    pointer.start().down().wait(100);
    this.clock.tick(100);
    pointer.up();
    assert.ok(actionFired, "action fired");
});

QUnit.test("onItemContextMenu should be fired when item is held or right clicked", function(assert) {
    var actionFired,
        actionData;

    var $element = $("#cmp");

    new TestComponent($element, {
        items: ["0"],
        onItemContextMenu: function(args) {
            actionFired = true;
            actionData = args;
        }
    });

    var $item = $element.find(".item");

    $item.trigger("dxcontextmenu");
    assert.ok(actionFired, "action fired");
    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual("0", actionData.itemData, "correct element passed");
});

QUnit.test("itemContextMenu event should be fired when item is held or right clicked", function(assert) {
    var actionFired,
        actionData;

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: ["0"]
        });

    instance.on("itemContextMenu", function(args) {
        actionFired = true;
        actionData = args;
    });
    var $item = $element.find(".item");

    $item.trigger("dxcontextmenu");
    assert.ok(actionFired, "action fired");
    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual("0", actionData.itemData, "correct element passed");
});

QUnit.test("onItemContextMenu should be fired when action changed dynamically", function(assert) {
    var actionFired;

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: ["0"]
        }),
        $item = $element.find(".item");

    instance.option("onItemContextMenu", function(args) {
        actionFired = true;
    });
    $item.trigger(holdEvent.name);

    if(support.touch) {
        assert.ok(actionFired, "action fired");
    } else {
        assert.ok(!actionFired, "action was not fired");
    }
});

QUnit.test("hold should not be handled if onItemHold or onItemContextMenu is not specified", function(assert) {
    var actionFired;

    var $element = $("#cmp");

    new TestComponent($element, {
        items: ["0"],
        onItemClick: function(args) {
            actionFired = true;
        }
    });

    var $item = $element.find(".item"),
        pointer = pointerMock($item);

    pointer.start().down().wait(2000);
    this.clock.tick(2000);
    pointer.up();
    assert.ok(actionFired, "action fired");
});

QUnit.test("click on selected item does not fire option change if selectionRequired option is true", function(assert) {
    var actionFired = false;

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: ["0", "1"],
            selectedIndex: 0,
            selectionRequired: true,
            selectionMode: "single"
        }),
        $item = $element.find(".item").first();

    instance.option("onOptionChanged",
        function(args) {
            if(args.name !== "onOptionChanged") {
                actionFired = true;
            }
        });

    $item.trigger("dxclick");
    assert.ok(!actionFired, "option does not change");
});

QUnit.test("'onItemRendered' event should be fired with correct arguments", function(assert) {
    var items = ["item 0"],
        eventTriggered,
        eventData;

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: items,
            onItemRendered: function(e) {
                eventTriggered = true;
                eventData = e;
            }
        }),
        $item = $element.find(".item")[0];

    assert.ok(eventTriggered, "action fired");
    assert.strictEqual(eventData.itemElement[0], $item, "itemElement is correct");
    assert.strictEqual(eventData.itemData, items[0], "itemData is correct");
    assert.equal(eventData.itemIndex, 0, "itemIndex is correct");

    assert.equal(instance.__actionConfigs.onItemRendered.category, "rendering", "action category is 'rendering'");
});

QUnit.test("onClick option in item", function(assert) {
    var itemClicked = 0;
    var item = {
        text: 'test',
        onClick: function(e) {
            itemClicked++;
            args = e;
        }
    };
    var args;
    var $component = $("#cmp");
    var component = new TestComponent($component, {
        items: [item]
    });

    var $item = $component.find(".item");
    $item.trigger("dxclick");

    assert.equal(itemClicked, 1, "click fired");
    assert.equal(args.component, component, "component provided");
    assert.equal(args.itemData, item, "item data provided");
    assert.equal(args.itemIndex, 0, "item index provided");
    assert.ok(args.jQueryEvent, "jQuery event provided");
    assert.ok(args.itemElement, "item element provided");
});


QUnit.module("option change");

QUnit.test("changing onItemRendered should not fire refresh", function(assert) {
    var instance = new TestComponent($("#cmp"), { items: [1, 2, 3] }),
        itemsReRendered = false;

    instance.option("onItemRendered", function(assert) {
        itemsReRendered = true;
    });
    assert.ok(!itemsReRendered, "items does not refreshed");
});


QUnit.module("items via markup", {
    beforeEach: function() {
        registerComponent("dxTestComponent", TestComponent);
    },
    afterEach: function() {
        delete $.fn["dxTestComponent"];
    }
});

QUnit.test("item property changing should not re-render whole widget", function(assert) {
    var contentReadySpy = sinon.spy(),
        component = new TestComponent("#cmp", {
            items: [{ visible: false }],
            onContentReady: contentReadySpy
        });

    component.option("items[0].visible", true);
    assert.equal(contentReadySpy.callCount, 1);
});

QUnit.test("dxItem should not be modified", function(assert) {
    var $element = $("#cmp");
    var dxItemString = "dxItem: {}";

    var $innerItem = window.test = $("<div>").attr("data-options", dxItemString).text("test");
    $innerItem.appendTo($element);
    var component = new TestComponent("#cmp", {});

    assert.equal(component.option("items").length, 1, "item was added");
    assert.equal($innerItem.attr("data-options"), dxItemString, "item was not changed");
});

QUnit.module("keyboard navigation", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("loopItemFocus option test", function(assert) {
    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            focusStateEnabled: true,
            loopItemFocus: true,
            items: [0, 1, 2, 3, 4]
        }),
        $items = $element.find(".item"),
        $lastItem = $items.last(),
        $firstItem = $items.first(),
        keyboard = keyboardMock($element);

    $element.focusin();
    keyboard.keyDown("left");
    assert.ok($lastItem.hasClass(FOCUSED_ITEM_CLASS), "press left arrow on first item change focused item on last (focus is looping)");

    instance.option("loopItemFocus", false);
    keyboard.keyDown("right");
    assert.ok(!$firstItem.hasClass(FOCUSED_ITEM_CLASS), "focus is not looping when option loopItemFocus set to false");
});

QUnit.test("onItemClick fires on enter and space", function(assert) {
    assert.expect(2);

    var itemClicked = 0,
        $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0"],
        onItemClick: function(args) {
            itemClicked++;
        }
    });

    var $item = $element.find(".item").eq(0),
        keyboard = keyboardMock($element);

    $item.trigger("dxpointerdown");
    this.clock.tick();
    keyboard.keyDown("enter");
    assert.equal(itemClicked, 1, "press enter on item call item click action");

    keyboard.keyDown("space");
    assert.equal(itemClicked, 2, "press space on item call item click action");
}),

QUnit.test("default page scroll should be prevented for space key", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0"],
        onItemClick: function(args) {
            assert.ok(args.jQueryEvent.isDefaultPrevented(), "default scroll is prevented");
        }
    });

    $element.find(".item").eq(0).trigger("dxpointerdown");
    this.clock.tick();

    keyboardMock($element).keyDown("space");
}),

QUnit.test("focused item changed after press right/left arrows", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4]
    });

    var $item = $element.find(".item").eq(0),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    keyboard.keyDown("right");

    $item = $item.next();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press right arrow on item change focused item on next");

    keyboard.keyDown("left");
    $item = $item.prev();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press left arrow on item change focused item on prev");
}),

QUnit.test("focused item changed after press right/left arrows for rtl", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        rtlEnabled: true,
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4]
    });

    var $item = $element.find(".item").eq(0),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    $item.trigger("dxpointerdown");
    this.clock.tick();

    keyboard.keyDown("left");
    $item = $item.next();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press left arrow on item change focused item on prev");

    keyboard.keyDown("right");
    $item = $item.prev();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press right arrow on item change focused item on next");
}),

QUnit.test("focused item changed after press up/down arrows", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    });

    var $item = $element.find(".item").eq(0),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    $item.trigger("dxpointerdown");
    this.clock.tick();

    keyboard.keyDown("down");
    $item = $item.next();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press down arrow on item change focused item on next");

    keyboard.keyDown("up");
    $item = $item.prev();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press up arrow on item change focused item on prev");
}),

QUnit.test("focused item changed on next not hidden item after press left/right", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        selectedIndex: 3
    });

    var $items = $element.find(".item"),
        $item = $items.eq(3),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    $element.find(".item").eq(3).trigger("dxpointerdown");
    this.clock.tick();

    $items.eq(2).toggle(false);
    keyboard.keyDown("left");
    $item = $items.eq(1);
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "next not hidden item has focused class after press left when next item is hidden");

    keyboard.keyDown("right");
    $item = $items.eq(3);
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "next not hidden item has focused class after press right when next item is hidden");
});

QUnit.test("focused item cycle", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2]
    });

    var $item = $element.find(".item").eq(0),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    $item.trigger("dxpointerdown");
    this.clock.tick();

    keyboard.keyDown("up");
    $item = $element.find(".item").last();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press up arrow on first item change focused item on last");

    keyboard.keyDown("down");
    $item = $element.find(".item").first();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press down arrow on last item change focused item on first");
}),

QUnit.test("focused item changed after press pageUp/Down", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    });

    var $item = $element.find(".item").eq(0),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    $item.trigger("dxpointerdown");
    this.clock.tick();

    keyboard.keyDown("pagedown");
    $item = $item.next();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press pageDown on item change focused item on next");

    keyboard.keyDown("pageup");
    $item = $item.prev();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press pageUp on item change focused item on prev");
}),

QUnit.test("focused item changed after press home/end", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    });

    var $items = $element.find(".item"),
        $item = $items.eq(0),
        keyboard = keyboardMock($element);

    $element.focusin();
    $item.trigger("dxpointerdown");
    this.clock.tick();
    keyboard.keyDown("end");
    $item = $items.last();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press end on item change focused item on next");

    keyboard.keyDown("home");
    $item = $items.first();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "press home on item change focused item on prev");
}),

QUnit.test("focused item changed on last but one after press home/end if last is hidden", function(assert) {
    assert.expect(2);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    });

    var $items = $element.find(".item"),
        $item = $items.eq(0),
        keyboard = keyboardMock($element);

    $element.focusin();
    $items.last().toggle(false);
    $item.trigger("dxpointerdown");
    this.clock.tick();
    keyboard.keyDown("end");
    $item = $items.last().prev();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "last by one item has focused class after press end when last item is hidden");

    $items.first().toggle(false);
    keyboard.keyDown("home");
    $item = $items.first().next();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "second item has focused class after press home when first item is hidden");
});

QUnit.test("focus attribute", function(assert) {
    assert.expect(4);

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }),
        $items = $element.find(".item"),
        $item = $items.first(),
        keyboard = keyboardMock($element),
        focusedItemId = instance.getFocusedItemId();

    $element.focusin();
    assert.ok($element.attr("aria-activedescendant") === String(focusedItemId), "element has attribute aria-activedescendant, whose value active");

    $item.trigger("dxpointerdown");
    this.clock.tick();
    assert.ok($item.attr("id").match(focusedItemId), "first item has id active");

    keyboard.keyDown("down");
    assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), "first item does not has id active after press down arrow key");
    $item = $items.next();
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "second item has id active after press down arrow key");
});

QUnit.test("selectOnFocus test", function(assert) {
    assert.expect(9);

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true,
            selectOnFocus: true,
            loopItemFocus: true,
            selectedIndex: 0,
            selectionMode: "single"
        }),
        $items = $element.find(".item"),
        $item = $items.first(),
        keyboard = keyboardMock($element);

    $item.trigger("dxpointerdown");

    this.clock.tick();
    keyboard.keyDown("right");
    assert.equal(instance.option("selectedIndex"), 1, "next item has been selected after press right arrow");

    keyboard.keyDown("left");
    assert.equal(instance.option("selectedIndex"), 0, "prev item has been selected after press left arrow");

    keyboard.keyDown("end");
    assert.equal(instance.option("selectedIndex"), 2, "last item has been selected after press end");

    keyboard.keyDown("home");
    assert.equal(instance.option("selectedIndex"), 0, "first item has been selected after press home");

    keyboard.keyDown("pagedown");
    assert.equal(instance.option("selectedIndex"), 1, "next item has been selected after press pagedown");

    keyboard.keyDown("pageup");
    assert.equal(instance.option("selectedIndex"), 0, "prev item has been selected after press pageup");

    keyboard.keyDown("down");
    assert.equal(instance.option("selectedIndex"), 1, "next item has been selected after press down arrow");

    keyboard.keyDown("up");
    assert.equal(instance.option("selectedIndex"), 0, "prev item has been selected after press up arrow");

    keyboard.keyDown("up");
    assert.equal(instance.option("selectedIndex"), 2, "loopItemFocus is working");
});

QUnit.test("focused item should be changed asynchronous (T400886)", function(assert) {
    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true
        }),
        $items = $element.find(".item"),
        $item = $items.first();

    $item.trigger("dxpointerdown");
    assert.equal(instance.option("focusedElement"), null, "focus isn't set");

    this.clock.tick();
    assert.equal(instance.option("focusedElement").get(0), $item.get(0), "focus set after timeout");
});

QUnit.testInActiveWindow("focused item should be changed synchronous with widget focus (T427152)", function(assert) {
    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true
        }),
        $items = $element.find(".item"),
        $item = $items.eq(1);

    $item.trigger("dxpointerdown");
    instance.focus();
    assert.equal(instance.option("focusedElement").get(0), $item.get(0), "focus isn't set");
});

QUnit.test("focused item should not be changed if pointerdown prevented (T400886)", function(assert) {
    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true
        }),
        $items = $element.find(".item"),
        $item = $items.first();

    var event = $.Event("dxpointerdown");
    $item.trigger(event);
    event.preventDefault();
    this.clock.tick();
    assert.equal(instance.option("focusedElement"), null, "focus isn't set");
});

QUnit.test("selectOnFocus test for widget with disabled items", function(assert) {
    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            items: [0, { disabled: true, text: 1 }, { disabled: true, text: 2 }, 3],
            focusStateEnabled: true,
            selectOnFocus: true,
            loopItemFocus: true,
            selectedIndex: 0,
            selectionMode: "single"
        }),
        $items = $element.find(".item"),
        $item = $items.first(),
        keyboard = keyboardMock($element);

    $element.focusin();
    $item.trigger("dxpointerdown");
    this.clock.tick();
    keyboard.keyDown("right");
    assert.equal(instance.option("selectedIndex"), 3, "selectedIndex is correctly");
    $item = $($items.get(3));
    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "correct item has an focused-state");
});

QUnit.test("Item should not lose focus class when you use arrows with 'selectOnFocus' option", function(assert) {
    var $element = $("#cmp");

    new TestComponent($element, {
        items: [1, 2, 3, 4],
        focusStateEnabled: true,
        selectOnFocus: true,
        loopItemFocus: false,
        selectionMode: "single"
    });

    var $items = $element.find(".item"),
        $firstItem = $items.first(),
        $lastItem = $items.last(),
        keyboard = keyboardMock($element);

    $element.focusin();
    $firstItem.trigger("dxpointerdown");
    this.clock.tick();
    keyboard.keyDown("left");
    assert.ok($firstItem.hasClass(FOCUSED_ITEM_CLASS), "First item must stay focused when we press 'left' button on the keyboard");

    $lastItem.trigger("dxpointerdown");
    this.clock.tick();
    keyboard.keyDown("right");
    assert.ok($lastItem.hasClass(FOCUSED_ITEM_CLASS), "Last item must stay focused when we press 'right' button on the keyboard");
});


QUnit.module("focus policy", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("dx-state-focused is not set for item when focusStateEnabled is false by dxpoinerdown", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: false,
        items: ["0", "1"]
    });

    var $item = $element.find(".item").eq(0);

    $item.trigger("dxpointerdown");
    this.clock.tick();
    assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), "focus set to first item");
});

QUnit.test("dx-state-focused is not set for item when it is not closest focused target by dxpoinerdown", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0", "1"],
        itemTemplate: function() {
            return $("<input>");
        }
    });

    var $item = $element.find(".item").eq(0);

    $item.trigger($.Event("dxpointerdown", { target: $item.find("input").get(0) }));
    this.clock.tick();
    assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), "focus set to first item");
});

QUnit.test("focusedElement is set for item when nested element selected by dxpoinerdown", function(assert) {
    assert.expect(1);

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: ["0", "1"],
            itemTemplate: function() {
                return $("<span>");
            }
        }),
        $item = $element.find(".item").eq(0);

    $item.trigger($.Event("dxpointerdown", { target: $item.find("span").get(0) }));
    this.clock.tick();
    assert.equal(instance.option("focusedElement").get(0), $item.get(0), "focus set to first item");
});

QUnit.test("dx-state-focused is not set for item when it is not closest focused target by focusin", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0", "1"],
        itemTemplate: function() {
            return $("<input>");
        }
    });

    var $item = $element.find(".item").eq(0);

    $element.trigger($.Event("focusin", { target: $item.find("input").get(0) }));
    assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), "focus set to first item");
});

QUnit.test("option focusOnSelectedItem", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0", "1"],
        selectionMode: "single",
        selectedIndex: 1,
        focusOnSelectedItem: false
    });

    $element.trigger("focusin");
    assert.ok($element.find(".item").eq(0).hasClass(FOCUSED_ITEM_CLASS), "focus set to first item");
});

QUnit.test("option focusOnSelectedItem", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0", "1"],
        selectionMode: "single",
        selectedIndex: 1,
        focusOnSelectedItem: true
    });

    $element.trigger("focusin");
    assert.ok($element.find(".item").eq(1).hasClass(FOCUSED_ITEM_CLASS), "focus set to selected item");
});

QUnit.test("item is focused after setting focusedElement option", function(assert) {
    assert.expect(2);

    var $element = $("#cmp"),
        instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: ["0", "1"]
        });

    var $item = $element.find(".item").eq(1);

    $element.focusin();

    assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), "item is not focused");

    instance.option("focusedElement", $item);

    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "item is focused after setting focusedItem option");
});


QUnit.test("first item  should be focused after setting focusedElement option to empty array", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0", "1"],
        focusedElement: []
    });

    var $item = $element.find(".item").eq(0);

    $element.focusin();

    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "item is focused");
});

QUnit.test("item is focused after focusing on element", function(assert) {
    assert.expect(1);

    var $element = $("#cmp");

    new TestComponent($element, {
        focusStateEnabled: true,
        items: ["0", "1"]
    });

    var $item = $element.find(".item").eq(0);

    $element.focusin();

    assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), "item is focused");
});


QUnit.module("isReady");

QUnit.test("collection widget is ready when dataSource is loaded", function(assert) {
    var isReadyBeforeLoaded;
    var deferred = $.Deferred();

    var $component = $("#cmp");
    var component = new TestComponent($component);

    component.option("dataSource", {
        load: function() {
            isReadyBeforeLoaded = component.isReady();
            return deferred.promise();
        }
    });

    deferred.resolve([]);

    assert.strictEqual(isReadyBeforeLoaded, false, "widget is not ready during dataSource loading");
    assert.equal(component.isReady(), true, "widget is ready when dataSource is loaded");
});

var TestWidget = CollectionWidget.inherit({
    NAME: "TestWidget",

    _renderItem: function() {
        this.callBase.apply(this, arguments);
    },

    _itemClass: function() {
        return "div";
    },

    _itemDataKey: function() {
        return "3AE08BA7-F7BC-464B-8B43-53C1F7307920";
    }
});

var loadCount = 0;
var TestStore = Store.inherit({
    _loadImpl: function() {
        loadCount++;
        return $.Deferred().resolve([1, 2, 3]);
    }
});

QUnit.module("Data layer integration", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("data widget doesn't load already loaded datasource", function(assert) {
    assert.expect(3);

    var store = new TestStore(),
        source = new DataSource(store),
        itemCount = 0;

    source.load().done(function() {
        assert.equal(loadCount, 1);
        new TestWidget("#cmp", {
            dataSource: source,
            onItemRendered: function() {
                itemCount++;
            }
        });
        // NOTE: TestStore works synchronously so we don't have to wait it loads
        assert.equal(loadCount, 1);
        assert.equal(itemCount, 3);
    });

    this.clock.tick(1);
});

QUnit.test("data widget should handle dataSource loading error", function(assert) {
    var deferred = $.Deferred();
    var contentReadyFired = 0;

    new TestWidget("#cmp", {
        dataSource: {
            load: function() {
                return deferred.promise();
            }
        },
        onContentReady: function() {
            contentReadyFired++;
        }
    });
    contentReadyFired = 0;
    deferred.reject();

    assert.equal(contentReadyFired, 1, "onContentReady fired once on loading fail");
});


QUnit.module("aria accessibility", {
    beforeEach: function() {
        this.items = [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }];
    }
});

QUnit.test("aria-activedescendant should be refreshed when focused item changed", function(assert) {
    assert.expect(1);

    var widget = new TestWidget("#cmp", {
            items: this.items
        }),
        $item = widget.itemElements().eq(1);

    var spy = widget._refreshActiveDescendant;

    widget._refreshActiveDescendant = function() {
        assert.ok(true, "aria-activedescendant was refreshed");
    };

    try {
        widget.option("focusedElement", $item);
    } finally {
        widget._refreshActiveDescendant = spy;
    }
});

QUnit.test("aria-selected property", function(assert) {
    var $element = $("#cmp");

    new TestWidget($element, {
        items: this.items,
        selectedIndex: 1,
        selectionMode: 'single'
    });

    var $item0 = $($element).find(".dx-item:eq(0)"),
        $item1 = $($element).find(".dx-item:eq(1)");

    assert.equal($item0.attr("aria-selected"), "false", "selected item has aria-selected property as true");
    assert.equal($item1.attr("aria-selected"), "true", "selected item has aria-selected property as false");
});

QUnit.test("aria-label for empty collection", function(assert) {
    var $element = $("#cmp"),
        instance = new TestWidget($element, {
            items: []
        });

    assert.equal($element.attr("aria-label"), "No data to display", "aria-label for empty collection is correct");

    instance.option("items", this.items);
    assert.equal($element.attr("aria-label"), undefined, "aria-label for not empty collection is correct");
});


QUnit.test("onFocusedItemChanged option on init", function(assert) {
    assert.expect(3);

    var $element = $("#cmp"),
        instance = new TestWidget($element, {
            items: this.items,
            selectedIndex: 1,
            useNative: false,
            selectionMode: 'single',
            onFocusedItemChanged: function(e) {
                assert.ok(true, "onFocusedItemChanged, defined on init, was triggered");
                assert.ok(e.actionValue, "onFocusedItemChanged, defined on init, gets id as a parameter");
            }
        }),
        $item0 = $($element).find(".dx-item:eq(0)"),
        $item1 = $($element).find(".dx-item:eq(1)");

    instance.option("focusedElement", $item0);

    instance.option("onFocusedItemChanged", function() {
        assert.ok(true, "onFocusedItemChanged, defined on option change was triggered");
    });

    instance.option("focusedElement", $item1);
});

QUnit.test("getDataSource. dataSource is not defined", function(assert) {
    var $element = $("#cmp"),
        instance = new TestWidget($element, {
            items: []
        });

    assert.strictEqual(instance.getDataSource(), null);
});

QUnit.test("getDataSource, dataSource is defined", function(assert) {
    var $element = $("#cmp"),
        instance = new TestWidget($element, {
            dataSource: [{ field1: "1" }]
        });

    assert.ok(instance.getDataSource() instanceof DataSource);
});


QUnit.module("default template", {
    prepareItemTest: function(data) {
        var testWidget = new TestWidget($("<div>"), {
            items: [data]
        });

        return testWidget.itemElements().eq(0).find(".dx-item-content").contents();
    }
});

QUnit.test("template should be rendered correctly with text", function(assert) {
    var $content = this.prepareItemTest("custom");

    assert.equal($content.text(), "custom");
});

QUnit.test("template should be rendered correctly with boolean", function(assert) {
    var $content = this.prepareItemTest(true);

    assert.equal($.trim($content.text()), "true");
});

QUnit.test("template should be rendered correctly with number", function(assert) {
    var $content = this.prepareItemTest(1);

    assert.equal($.trim($content.text()), "1");
});

QUnit.test("template should be rendered correctly with text", function(assert) {
    var $content = this.prepareItemTest({ text: "custom" });

    assert.equal($.trim($content.text()), "custom");
});

QUnit.test("template should be rendered correctly with html", function(assert) {
    var $content = this.prepareItemTest({ html: "<span>test</span>" });

    var $span = $content.is("span") ? $content : $content.children();
    assert.ok($span.length);
    assert.equal($span.text(), "test");
});

QUnit.test("template should be rendered correctly with htmlstring", function(assert) {
    var $content = this.prepareItemTest("<span>test</span>");

    assert.equal($content.text(), "<span>test</span>");
});

QUnit.test("template should be rendered correctly with html & text", function(assert) {
    var $content = this.prepareItemTest({ text: "text", html: "<span>test</span>" });

    var $span = $content.is("span") ? $content : $content.children();

    assert.ok($span.length);
    assert.equal($content.text(), "test");
});
