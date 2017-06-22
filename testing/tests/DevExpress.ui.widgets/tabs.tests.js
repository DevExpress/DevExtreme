"use strict";

var $ = require("jquery"),
    domUtils = require("core/utils/dom"),
    holdEvent = require("events/hold"),
    Tabs = require("ui/tabs"),
    config = require("core/config"),
    pointerMock = require("../../helpers/pointerMock.js");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<style>\
            #scrollableTabs .dx-tab {\
                display: table-cell;\
                padding: 35px;\
            }\
            \
            .bigtab.dx-tabs-expanded .dx-tab {\
                width: 1000px;\
            }\
        </style>\
        \
        <div id="tabs">\
        \
        </div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        \
        <div id="scrollableTabs"></div>';

    $("#qunit-fixture").html(markup);
});

var TABS_ITEM_CLASS = "dx-tab",
    TAB_SELECTED_CLASS = "dx-tab-selected",
    TABS_SCROLLABLE_CLASS = "dx-tabs-scrollable",
    TABS_WRAPPER_CLASS = "dx-tabs-wrapper",
    TABS_NAV_BUTTON_CLASS = "dx-tabs-nav-button",
    TABS_NAV_BUTTONS_CLASS = "dx-tabs-nav-buttons",
    TABS_LEFT_NAV_BUTTON_CLASS = "dx-tabs-nav-button-left",
    TABS_RIGHT_NAV_BUTTON_CLASS = "dx-tabs-nav-button-right",
    TAB_OFFSET = 30;

var toSelector = function(cssClass) {
    return "." + cssClass;
};


QUnit.module("general");

QUnit.test("init", function(assert) {
    var tabsElement = $("#tabs").dxTabs({
        items: [
            { text: "0", icon: "custom" },
            { text: "1", iconSrc: "http://1.png" },
            { text: "2" }
        ]
    });

    var tabsInstance = tabsElement.data("dxTabs"),
        tabElements = tabsInstance._itemElements();

    assert.equal(tabsInstance.option("selectedIndex"), -1);

    assert.equal($.trim(tabsElement.text()), "012");

    assert.equal(tabElements.find(".dx-icon-custom").length, 1);

    var icon = tabElements.find("img");
    assert.equal(icon.length, 1);
    assert.equal(icon.attr("src"), "http://1.png");
});

QUnit.test("mouseup switch selected tab", function(assert) {
    var tabsElement = $("#tabs").dxTabs({
            items: [
            { text: "0" },
            { text: "1" },
            { text: "2" }
            ]
        }),
        tabsInstance = tabsElement.data("dxTabs");

    $.each(tabsInstance.option("items"), function(clickedTabIndex) {
        var tabs = tabsInstance._itemElements();
        tabs.eq(clickedTabIndex).trigger("dxclick");

        tabs.each(function(tabIndex) {
            var tab = $(this),
                isClickedTab = tabIndex === clickedTabIndex;

            assert.ok(isClickedTab ? tab.hasClass(TAB_SELECTED_CLASS) : !tab.hasClass(TAB_SELECTED_CLASS), "tab selected state");
        });

        assert.equal(tabsInstance.option("selectedIndex"), clickedTabIndex, "tabs selectedIndex");
    });
});

QUnit.test("repeated click doesn't change selected tab state", function(assert) {
    var tabsElement = $("#tabs").dxTabs({
            items: [
            { text: "0" },
            { text: "1" },
            { text: "2" }
            ]
        }),
        tabsInstance = tabsElement.data("dxTabs");

    var tabElements = tabsInstance._itemElements(),
        tabElement = tabElements.eq(1);

    tabElement.trigger("dxclick");

    assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option("selectedIndex"), 1);

    tabElement.trigger("dxclick");
    assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option("selectedIndex"), 1);
});

QUnit.test("disabled tab can't be selected by click", function(assert) {
    var tabsElement = $("#tabs").dxTabs({
            items: [
            { text: "1" },
                {
                    text: "2",
                    disabled: true
                },
            { text: "3" }
            ]
        }),
        tabsInstance = tabsElement.data("dxTabs");

    var tabElements = tabsInstance._itemElements();

    tabElements.eq(2).trigger("dxclick");

    assert.ok(tabElements.eq(2).hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option("selectedIndex"), 2);

    tabElements.eq(1).trigger("dxclick");
    assert.ok(!tabElements.eq(1).hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option("selectedIndex"), 2);
});

QUnit.test("design mode", function(assert) {
    config({ designMode: true });

    try {
        var tabsElement = $("#tabs").dxTabs({
            items: [
                { text: "0" },
                { text: "1" },
                { text: "2" }
            ]
        });

        var tabsInstance = tabsElement.data("dxTabs"),
            tabItems = tabsInstance._itemElements();

        tabItems.eq(1).click();
        assert.ok(!tabItems.eq(1).hasClass(TAB_SELECTED_CLASS));
    } finally {
        config({ designMode: false });
    }
});

QUnit.test("regression: wrong selectedIndex in tab mouseup handler", function(assert) {
    var selectedIndex;

    var tabsEl = $("#tabs").dxTabs({
        onSelectionChanged: function() {
            selectedIndex = tabsEl.data("dxTabs").option("selectedIndex");
        },
        items: [
            { text: "0" },
            { text: "1" }
        ]
    });

    tabsEl.find(".dx-tab").eq(1).trigger("dxclick");
    assert.equal(selectedIndex, 1);

});

QUnit.test("select action should not be triggered when disabled item is disabled", function(assert) {
    var selectedIndex;

    var tabsEl = $("#tabs").dxTabs({
        onSelectionChanged: function(e) {
            selectedIndex = tabsEl.data("dxTabs").option("selectedIndex");
        },
        items: [
            { text: "0" },
            { text: "1", disabled: true }
        ]
    });

    tabsEl.find(".dx-tab").eq(1).trigger("dxclick");
    assert.equal(selectedIndex, undefined);
});


QUnit.module("tab select action");

QUnit.test("should not be triggered when is already selected", function(assert) {
    var count = 0;

    var $tabs = $("#tabs").dxTabs({
        items: [
            { text: "0" },
            { text: "1" },
            { text: "2" },
            { text: "3" }
        ],
        onSelectionChanged: function(e) {
            count += 1;
        }
    });

    var $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(1);

    $tab
        .trigger("dxclick")
        .trigger("dxclick");

    assert.equal(count, 1, "action triggered only once");
});

QUnit.test("selectedIndex updated on 'onItemClick'", function(assert) {
    assert.expect(1);

    var $tabs = $("#tabs");

    $tabs.dxTabs({
        items: [1, 2, 3],
        selectedIndex: 1,
        onItemClick: function() {
            assert.equal(this.option("selectedIndex"), 2, "selectedIndex changed");
        }
    });

    var $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(2);

    pointerMock($tab).click();
});

QUnit.test("regression: B251795", function(assert) {
    assert.expect(2);

    var itemClickFired = 0,
        itemSelectFired = 0;

    var $tabs = $("#tabs").dxTabs({
        items: [1, 2, 3],

        selectedIndex: 0,

        onItemClick: function() {
            itemClickFired++;
        },

        onSelectionChanged: function() {
            itemSelectFired++;
        }
    });

    $tabs
        .find("." + TABS_ITEM_CLASS)
        .eq(1)
        .trigger($.Event("touchend", { touches: [1], targetTouches: [1], changedTouches: [{ identifier: 13 }] }))
        .trigger("mouseup");

    assert.equal(itemClickFired, 0);
    assert.equal(itemSelectFired, 0);
});


QUnit.module("badges");

QUnit.test("item badge render", function(assert) {
    var $element = $("#widget").dxTabs({
        items: [
            { text: "user", badge: 1 },
            { text: "analytics" }
        ],
        width: 400
    });

    assert.ok($element.find(".dx-tab:eq(0) .dx-badge").length, "badge on the first item exists");
    assert.ok(!$element.find(".dx-tab:eq(1) .dx-badge").length, "badge on the second item is not exist");
});


QUnit.module("widget sizing render");

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxTabs({
            items: [
            { text: "user" },
            { text: "analytics" },
            { text: "customers" },
            { text: "search" },
            { text: "favorites" }
            ], width: 400
        }),
        instance = $element.dxTabs("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxTabs({
            items: [
            { text: "user" },
            { text: "analytics" },
            { text: "customers" },
            { text: "search" },
            { text: "favorites" }
            ]
        }),
        instance = $element.dxTabs("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxTabs({ items: [1, 2, 3] }),
        instance = $element.dxTabs("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.test("nav buttons should be rendered when widget is rendered invisible", function(assert) {
    var $container = $("<div>");

    try {
        var $element = $("<div>").appendTo($container).dxTabs({
            items: [
                    { text: "user" },
                    { text: "analytics" },
                    { text: "customers" },
                    { text: "search" },
                    { text: "favorites" }
            ],
            wordWrap: false,
            scrollingEnabled: true,
            showNavButtons: true,
            width: 100
        });

        $container.appendTo("#qunit-fixture");
        domUtils.triggerShownEvent($container);

        assert.equal($element.find("." + TABS_NAV_BUTTON_CLASS).length, 2, "nav buttons are rendered");
    } finally {
        $container.remove();
    }
});

QUnit.test("Tabs in multiple mode", function(assert) {
    var $element = $("#widget").dxTabs({
            items: [
            { text: "user" },
            { text: "analytics" },
            { text: "customers" },
            { text: "search" },
            { text: "favorites" }
            ], width: 400,
            selectionMode: "multiple",
            selectedIndex: 2
        }),
        instance = $element.dxTabs("instance");

    assert.equal(instance.option("selectedItem").text, "customers", "was selected correct item");

    assert.ok(!instance.option("selectOnFocus"), "option selectOnFocus must be false with turn on multiple mode");

    var $tab = $element.find(toSelector(TABS_ITEM_CLASS)).eq(3);
    pointerMock($tab).click();

    assert.equal(instance.option("selectedItems").length, 2, "selected two items in multiple mode");
});


QUnit.module("horizontal scrolling");

var SCROLLABLE_CLASS = "dx-scrollable";

QUnit.test("tabs should be wrapped into scrollable if scrollingEnabled=true", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            wordWrap: false,
            scrollingEnabled: true,
            width: 100
        }),
        $scrollable = $element.children("." + SCROLLABLE_CLASS);

    assert.ok($scrollable.length, "scroll created");
    assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), "wrapper class added");
    assert.ok($scrollable.find("." + TABS_ITEM_CLASS).length, "items wrapped into scrollable");
});

QUnit.test("scrollable should have correct option scrollByContent", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            wordWrap: false,
            scrollingEnabled: true,
            scrollByContent: true,
            width: 100
        }),
        instance = $element.dxTabs("instance"),
        $scrollable = $element.children("." + SCROLLABLE_CLASS),
        scrollable = $scrollable.dxScrollable("instance");

    assert.ok(scrollable.option("scrollByContent"), "scrollByContent was set");

    instance.option("scrollByContent", false);
    assert.ok(!scrollable.option("scrollByContent"), "scrollByContent was set");
});

QUnit.test("tabs should not crash in IE and Firefox after creation", function(assert) {
    $("#tabs").addClass("bigtab").dxTabs({
        items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
        wordWrap: false,
        scrollingEnabled: true,
        showNavButtons: true
    });

    assert.ok(true, "widget was inited");
});

QUnit.test("nav buttons class should be added if showNavButtons=true", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
        items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
        wordWrap: false,
        showNavButtons: true,
        width: 100
    });

    assert.ok($element.hasClass(TABS_NAV_BUTTONS_CLASS), "navs class added");
});

QUnit.test("right nav button should be rendered if showNavButtons=true and possible to scroll right", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.children().eq(-1);

    assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), "nav class added");
    assert.ok($button.hasClass(TABS_RIGHT_NAV_BUTTON_CLASS), "right class added");
});

QUnit.test("click on right nav button should scroll tabs to right", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_RIGHT_NAV_BUTTON_CLASS),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    $button.trigger("dxclick");
    assert.equal(scrollable.scrollLeft(), TAB_OFFSET, "scroll position is correct");
});

QUnit.test("hold on right nav button should scroll tabs to right to end", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }, { text: "item 4" },
        { text: "item 5" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_RIGHT_NAV_BUTTON_CLASS),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    this.clock = sinon.useFakeTimers();

    $button.trigger(holdEvent.name);
    this.clock.tick(100);
    $button.trigger("mouseup");

    assert.equal(scrollable.scrollLeft(), 120, "scroll position is correct");

    this.clock.restore();
});


QUnit.test("left nav button should be rendered if showNavButtons=true and possible to scroll left", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.children().eq(0);

    assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), "nav class added");
    assert.ok($button.hasClass(TABS_LEFT_NAV_BUTTON_CLASS), "left class added");
});

QUnit.test("click on left nav button should scroll tabs to left", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_LEFT_NAV_BUTTON_CLASS),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    scrollable.update();
    scrollable.scrollTo(TAB_OFFSET);
    $button.trigger("dxclick");
    assert.equal(scrollable.scrollLeft(), 0, "scroll position is correct");
});

QUnit.test("hold on left nav button should scroll tabs to left to end", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }, { text: "item 4" },
        { text: "item 5" }, { text: "item 6" }, { text: "item 7" }, { text: "item 8" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_LEFT_NAV_BUTTON_CLASS),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    this.clock = sinon.useFakeTimers();

    scrollable.update();
    scrollable.scrollTo(200);

    $button.trigger(holdEvent.name);
    this.clock.tick(100);
    $button.trigger("mouseup");

    assert.equal(scrollable.scrollLeft(), 80, "scroll position is correct");

    this.clock.restore();
});

QUnit.test("selected item should be visible after selectedIndex was changed", function(assert) {
    assert.expect(1);
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 1" }, { text: "item 1" }, { text: "item 1" }],
            selectedIndex: 0,
            wordWrap: false,
            scrollingEnabled: true,
            width: 100
        }),
        instance = $element.dxTabs("instance"),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    scrollable.scrollToElement = function($item) {
        assert.equal($item.get(0), instance.itemElements().eq(3).get(0), "scrolled to item");
    };
    instance.option("selectedIndex", 3);
});

QUnit.test("tabs should not be wrapped into scrollable if all items are visible", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }],
            wordWrap: false,
            scrollingEnabled: true,
            width: 250
        }),
        $scrollable = $element.children("." + SCROLLABLE_CLASS);

    assert.equal($scrollable.length, 0, "scroll was not created");
});

QUnit.test("left button should be disabled if scrollPosition == 0", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_LEFT_NAV_BUTTON_CLASS),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    assert.ok($button.dxButton("instance").option("disabled"));

    scrollable.scrollTo(10);
    assert.ok(!$button.dxButton("instance").option("disabled"));

    scrollable.scrollTo(0);
    assert.ok($button.dxButton("instance").option("disabled"));
});

QUnit.test("right button should be disabled if scrollPosition == scrollWidth", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_RIGHT_NAV_BUTTON_CLASS),
        scrollable = $element.find("." + SCROLLABLE_CLASS).dxScrollable("instance");

    assert.ok(!$button.dxButton("instance").option("disabled"));

    scrollable.scrollTo(scrollable.scrollWidth() - scrollable.clientWidth());
    assert.ok($button.dxButton("instance").option("disabled"));

    scrollable.scrollTo(0);
    assert.ok(!$button.dxButton("instance").option("disabled"));
});

QUnit.test("button should update disabled state after dxresize", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
            wordWrap: false,
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        }),
        $button = $element.find("." + TABS_RIGHT_NAV_BUTTON_CLASS);

    $button.dxButton("instance").option("disabled", true);

    $element.trigger("dxresize");
    assert.ok(!$button.dxButton("instance").option("disabled"));
});

QUnit.test("dxTabs should contains 'dx-tabs-wrapper' class", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
        items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }]
    });

    assert.ok($element.children("." + TABS_WRAPPER_CLASS).length, "dxTabs contains 'dx-tabs-wrapper' class");
});

QUnit.test("tabs should be scrolled to the right position on init in RTL mode", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
        items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
        showNavButtons: true,
        wordWrap: false,
        scrollingEnabled: true,
        rtlEnabled: true,
        width: 100
    });

    var scrollable = $element.find(".dx-scrollable").dxScrollable("instance");

    assert.equal(scrollable.scrollLeft(), Math.round(scrollable.scrollWidth() - scrollable.clientWidth()), "items are scrolled");
});

QUnit.test("tabs should not be refreshed after dimension changed", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }],
            scrollingEnabled: true,
            visible: true,
            width: 100
        }),
        instance = $element.dxTabs("instance");

    instance.itemElements().data("rendered", true);

    $element.trigger("dxresize");

    assert.ok(instance.itemElements().data("rendered"), "tabs was not refreshed");
    assert.equal($element.find("." + TABS_SCROLLABLE_CLASS).length, 1, "only one scrollable wrapper should exist");
});

QUnit.test("tabs should hide navigation if scrollable is not allowed after resize", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }],
            scrollingEnabled: true,
            visible: true,
            width: 100
        }),
        instance = $element.dxTabs("instance");

    instance.option("width", 700);
    $element.trigger("dxresize");

    assert.equal($element.find("." + TABS_NAV_BUTTON_CLASS).length, 0, "nav buttons was removed");
    assert.equal($element.find("." + TABS_SCROLLABLE_CLASS).length, 0, "scrollable was removed");
    assert.equal($element.find("." + TABS_WRAPPER_CLASS).length, 1, "indent wrapper was restored");
});

QUnit.test("tabs should scroll to the selected item on init", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }, { text: "item 4" }, { text: "item 5" }],
        $element = $("#scrollableTabs").dxTabs({
            items: items,
            scrollingEnabled: true,
            visible: true,
            selectedItem: items[3],
            width: 200
        });

    var $item = $element.find("." + TABS_ITEM_CLASS).eq(3),
        itemOffset = Math.round($item.offset().left),
        contentLeft = Math.round($element.offset().left),
        contentRight = Math.round(contentLeft + $element.outerWidth());

    assert.ok(itemOffset <= contentRight - $item.outerWidth(), "item offset is lower than right boundary");
    assert.ok(itemOffset > contentLeft, "item offset is greater than left boundary");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#scrollableTabs").dxTabs({
            items: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }]
        }),
        $item = $element.find(".dx-tab:first");

    assert.equal($element.attr("role"), "tablist", "role of the tab list is correct");
    assert.equal($item.attr("role"), "tab", "role of the tab list is correct");
});


QUnit.module("default template", {
    prepareItemTest: function(data) {
        var tabs = new Tabs($("<div>"), {
            items: [data]
        });

        return tabs.itemElements().eq(0).find(".dx-item-content").contents();
    }
});

var TABS_ITEM_TEXT_CLASS = "dx-tab-text";

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

QUnit.test("template should be rendered correctly with tab text wrapper for data with text field", function(assert) {
    var $content = this.prepareItemTest({ text: "test" });

    assert.equal($content.filter("." + TABS_ITEM_TEXT_CLASS).text(), "test");
});

QUnit.test("template should be rendered correctly with tab text wrapper for string data", function(assert) {
    var $content = this.prepareItemTest("test");

    assert.equal($content.filter("." + TABS_ITEM_TEXT_CLASS).text(), "test");
});

QUnit.test("template should be rendered correctly with tab text wrapper for string data", function(assert) {
    var $content = this.prepareItemTest("test");

    assert.equal($content.filter("." + TABS_ITEM_TEXT_CLASS).text(), "test");
});

QUnit.test("template should be rendered correctly with icon", function(assert) {
    var $content = this.prepareItemTest({ icon: "test" });

    assert.equal($content.filter(".dx-icon-test").length, 1);
});

QUnit.test("template should be rendered correctly with icon path", function(assert) {
    var $content = this.prepareItemTest({ icon: "test.jpg" });

    assert.equal($content.filter(".dx-icon").attr("src"), "test.jpg");
});

QUnit.test("template should be rendered correctly with external icon", function(assert) {
    var $content = this.prepareItemTest({ icon: "fa fa-icon" });

    assert.equal($content.filter(".fa.fa-icon").length, 1);
});

QUnit.test("template should be rendered correctly with imageSrc", function(assert) {
    var $content = this.prepareItemTest({ iconSrc: "test.jpg" });

    assert.equal($content.filter(".dx-icon").attr("src"), "test.jpg");
});
