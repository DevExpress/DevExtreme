"use strict";

var $ = require("jquery"),
    fx = require("animation/fx"),
    support = require("core/utils/support"),
    domUtils = require("core/utils/dom"),
    TabPanel = require("ui/tab_panel"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config");

require("common.css!css");

QUnit.testStart(function() {
    var markup =
        '<div id="tabPanel">\
            <div data-options="dxTemplate: { name: \'title\' }">\
                <div data-bind="text: $data.text"></div>\
            </div>\
            \
            <div data-options="dxTemplate: { name: \'item\' }">\
                <p>First Name: <i data-bind="text: $data.firstName"></i></p>\
                <p>Last Name: <i data-bind="text: $data.lastName"></i></p>\
                <p>Birth Year: <i data-bind="text: $data.birthYear"></i></p>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var TABPANEL_CLASS = "dx-tabpanel",
    MULTIVIEW_CLASS = "dx-multiview",
    TABS_CLASS = "dx-tabs",
    MULTIVIEW_ITEM_CLASS = "dx-multiview-item",
    TABS_ITEM_CLASS = "dx-tab",
    MUTIVIEW_WRAPPER_CLASS = "dx-multiview-wrapper",
    SELECTED_ITEM_CLASS = "dx-item-selected",
    TABPANEL_CONTAINER_CLASS = "dx-tabpanel-container";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

var nestedElementsCount = function($element, cssClass) {
    return $element.find(toSelector(cssClass)).length;
};


QUnit.module("rendering", {
    beforeEach: function() {
        this.$tabPanel = $("#tabPanel").dxTabPanel();
    }
});

QUnit.test("rendering widget test", function(assert) {
    assert.expect(1);
    assert.ok(this.$tabPanel.hasClass(TABPANEL_CLASS), "widget class added");
});

QUnit.test("rendering tabs widget test", function(assert) {
    assert.expect(1);
    assert.ok(this.$tabPanel.find("." + TABS_CLASS), "tabs widget added");
});

QUnit.test("rendering multiview widget test", function(assert) {
    assert.expect(1);
    assert.ok(this.$tabPanel.hasClass(MULTIVIEW_CLASS), "multiview widget added");
});

QUnit.test("count of nested widget elements test", function(assert) {
    assert.expect(1);

    var items = [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
                    { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }];

    this.$tabPanel.dxTabPanel("instance").option("dataSource", items);

    var tabsCount = nestedElementsCount(this.$tabPanel.find("." + TABS_CLASS), TABS_ITEM_CLASS);
    var multiViewItemsCount = nestedElementsCount(this.$tabPanel.find("." + MUTIVIEW_WRAPPER_CLASS), MULTIVIEW_ITEM_CLASS);

    assert.equal(tabsCount, multiViewItemsCount, "tab widget items count and multiview widget items count is equal");
});

QUnit.test("container should consider tabs height", function(assert) {
    var $tabPanel = $("#tabPanel").dxTabPanel({
        items: [{ text: "test" }]
    });

    var $container = $tabPanel.find("." + TABPANEL_CONTAINER_CLASS);
    var $tabs = $tabPanel.find("." + TABS_CLASS);
    assert.roughEqual(parseFloat($container.css("padding-top")), $tabs.outerHeight(), 0.1, "padding correct");
    assert.roughEqual(parseFloat($container.css("margin-top")), -$tabs.outerHeight(), 0.1, "margin correct");
});

QUnit.test("container should consider tabs height for async datasource", function(assert) {
    var clock = sinon.useFakeTimers();
    var $tabPanel = $("#tabPanel").dxTabPanel({
        dataSource: {
            load: function() {
                var d = $.Deferred();
                setTimeout(function() {
                    d.resolve([{ tabTemplate: function() { return $("<div>").height(100); } }]);
                });
                return d;
            }
        }
    });

    var $container = $tabPanel.find("." + TABPANEL_CONTAINER_CLASS);
    var $tabs = $tabPanel.find("." + TABS_CLASS);

    clock.tick();

    assert.roughEqual(parseFloat($container.css("padding-top")), $tabs.outerHeight(), 0.1, "padding correct");
    assert.roughEqual(parseFloat($container.css("margin-top")), -$tabs.outerHeight(), 0.1, "margin correct");
});

QUnit.test("container should consider tabs height for async templates", function(assert) {
    var clock = sinon.useFakeTimers();
    var $tabPanel = $("#tabPanel").hide().dxTabPanel({
        items: [{ text: "test" }],
        templatesRenderAsynchronously: true
    }).show();

    var $container = $tabPanel.find("." + TABPANEL_CONTAINER_CLASS);
    var $tabs = $tabPanel.find("." + TABS_CLASS);

    clock.tick();

    assert.roughEqual(parseFloat($container.css("padding-top")), $tabs.outerHeight(), 0.1, "padding correct");
    assert.roughEqual(parseFloat($container.css("margin-top")), -$tabs.outerHeight(), 0.1, "margin correct");
});

QUnit.test("container should consider tabs height when it rendered in hiding area", function(assert) {
    var $tabPanel = $("<div>").dxTabPanel({
        items: [{ text: "test" }]
    });

    $tabPanel.appendTo("#qunit-fixture");
    domUtils.triggerShownEvent($tabPanel);

    var $container = $tabPanel.find("." + TABPANEL_CONTAINER_CLASS);
    var $tabs = $tabPanel.find("." + TABS_CLASS);
    assert.roughEqual(parseFloat($container.css("padding-top")), $tabs.outerHeight(), 0.1, "padding correct");
    assert.roughEqual(parseFloat($container.css("margin-top")), -$tabs.outerHeight(), 0.1, "margin correct");
});


QUnit.module("options", {
    beforeEach: function() {
        fx.off = true;

        this.items = [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
                        { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }];

        this.$tabPanel = $("#tabPanel").dxTabPanel({
            items: this.items
        });

        this.tabPanelInstance = this.$tabPanel.dxTabPanel("instance");
        this.tabWidgetInstance = this.$tabPanel.find(toSelector(TABS_CLASS)).dxTabs("instance");
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("tabs should has correct swipeEnabled default", function(assert) {
    assert.equal(this.tabPanelInstance.option("swipeEnabled"), support.touch, "option <swipeEnabled> of multiview widget default false");
});

QUnit.test("selectedIndex option test", function(assert) {
    assert.expect(2);

    assert.equal(this.tabWidgetInstance.option("selectedIndex"), 0, "option <selectedIndex> successfully passed to nested tabs widget");

    this.tabPanelInstance.option("selectedIndex", 1);

    assert.equal(this.tabWidgetInstance.option("selectedIndex"), 1, "option <selectedIndex> of nested tabs widget successfully changed");
});

QUnit.test("selectedItem option test", function(assert) {
    assert.expect(2);

    assert.equal(this.tabWidgetInstance.option("selectedItem"), this.items[0], "option <selectedItem> successfully passed to nested tabs widget");

    this.tabPanelInstance.option("selectedItem", this.items[1]);

    assert.equal(this.tabWidgetInstance.option("selectedItem"), this.items[1], "option <selectedItem> of nested tabs widget successfully changed");
});

QUnit.test("dataSource option test", function(assert) {
    assert.expect(2);

    this._$tabPanel = $("#tabPanel").dxTabPanel({
        dataSource: this.items
    });

    assert.deepEqual(this.tabWidgetInstance.option("items"), this.items, "option <dataSource> successfully passed to nested tabs widget");

    this.tabPanelInstance.option("dataSource", []);

    assert.deepEqual(this.tabWidgetInstance.option("items"), [], "option <dataSource> of nested tabs widget successfully changed");
});

QUnit.test("items option test", function(assert) {
    assert.expect(2);

    assert.deepEqual(this.tabWidgetInstance.option("items"), this.items, "option <items> successfully passed to nested tabs widget");

    this.tabPanelInstance.option("items", []);

    assert.deepEqual(this.tabWidgetInstance.option("items"), [], "option <items> of nested tabs widget successfully changed");
});

QUnit.test("items option test - changing a single item at runtime", function(assert) {
    var items = [
        { text: "Greg", title: "Name" }
    ];

    var $tabPanel = $("<div>").appendTo("#qunit-fixture");
    var tabPanel = $tabPanel.dxTabPanel({
        items: items
    }).dxTabPanel("instance");

    tabPanel.option("items[0].title", "test");

    assert.equal($tabPanel.find(toSelector(TABS_ITEM_CLASS)).eq(0).text(),
        "test", "option <items> of nested tabs widget successfully changed - tabs were rerendered");
});

QUnit.test("itemTitleTemplate options test", function(assert) {
    assert.expect(2);

    var $tabPanel = $("#tabPanel").dxTabPanel({
        items: this.items,
        itemTitleTemplate: $("<span>Template</span>")
    });
    var tabPanelInstance = $tabPanel.dxTabPanel("instance");
    var tabWidgetInstance = $tabPanel.find(toSelector(TABS_CLASS)).dxTabs("instance");

    assert.deepEqual(this.tabWidgetInstance.itemElements().eq(0).text(),
        "Template",
        "option <itemTitleTemplate> successfully passed to nested tabs widget");

    tabPanelInstance.option("itemTitleTemplate", $("<span>Changed template</span>"));

    assert.deepEqual(tabWidgetInstance.itemElements().eq(0).text(),
        "Changed template",
        "option <itemTitleTemplate> of nested tabs widget successfully changed");
});

QUnit.test("itemHoldTimeout option test", function(assert) {
    assert.expect(2);

    assert.equal(this.tabWidgetInstance.option("itemHoldTimeout"), 750, "option <itemHoldTimeout> successfully passed to nested tabs widget");

    this.tabPanelInstance.option("itemHoldTimeout", 1000);

    assert.equal(this.tabWidgetInstance.option("itemHoldTimeout"), 1000, "option <itemHoldTimeout> of nested tabs widget successfully changed");
});

QUnit.test("tabs should has correct itemTemplateProperty", function(assert) {
    assert.equal(this.tabWidgetInstance.option("itemTemplateProperty"), "tabTemplate", "itemTemplateProperty option is correct");
});

QUnit.test("scrollingEnabled option", function(assert) {
    this.tabPanelInstance.option("scrollingEnabled", true);
    assert.ok(this.tabWidgetInstance.option("scrollingEnabled"), "option has been passed to tabs");
});

QUnit.test("scrollByContent option", function(assert) {
    this.tabPanelInstance.option("scrollByContent", true);
    assert.ok(this.tabWidgetInstance.option("scrollByContent"), "option has been passed to tabs");
});

QUnit.test("showNavButtons option", function(assert) {
    this.tabPanelInstance.option("showNavButtons", false);
    assert.notOk(this.tabWidgetInstance.option("showNavButtons"), "option has been passed to tabs");
});

QUnit.test("hoverStateEnabled option", function(assert) {
    this.tabPanelInstance.option("hoverStateEnabled", false);
    assert.notOk(this.tabWidgetInstance.option("hoverStateEnabled"), "option has been passed to tabs");
});

QUnit.test("loop option (T318329)", function(assert) {
    this.tabPanelInstance.option("loop", true);
    assert.ok(this.tabWidgetInstance.option("loopItemFocus"), "option has been passed to tabs");
});

QUnit.test("disabled item should be rendered correctly", function(assert) {
    this.tabPanelInstance.option("items[1].disabled", true);

    var $disabledItem = this.tabPanelInstance.itemElements().eq(1),
        $tabs = this.$tabPanel.find("." + TABS_ITEM_CLASS);

    assert.ok($disabledItem.hasClass("dx-state-disabled"), "Item is disabled");
    assert.notEqual($tabs.length, 0, "Tabs are rendered");
});

QUnit.module("action handlers", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        fx.off = true;

        this.$tabPanel = $("#tabPanel").dxTabPanel({
            dataSource: [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
                        { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }],

            onItemClick: function(e) {
                QUnit.assert.ok(true, "option 'onItemClick' successfully passed to nested multiview widget and raised on click");
            },

            onTitleClick: function(e) {
                QUnit.assert.ok(true, "option 'onTitleClick' successfully passed to nested tabs widget and raised on click");
            },

            onItemHold: function(e) {
                QUnit.assert.ok(true, "option 'onItemHold' successfully passed to nested multiview widget and raised on hold");
            },

            onTitleHold: function(titleElement, titleData) {
                QUnit.assert.ok(true, "option 'onTitleHold' successfully passed to nested tabs widget and raised on hold");
            },

            onSelectionChanged: function(e) {
                QUnit.assert.ok(true, "option 'onSelectionChanged' successfully passed to nested multiview and tabs widgets and raised on select");
            },

            swipeEnabled: true
        });

        this.tabPanelInstance = this.$tabPanel.dxTabPanel("instance");
        this.tabWidgetInstance = this.$tabPanel.find(toSelector(TABS_CLASS)).dxTabs("instance");

        this.multiViewMouse = pointerMock(this.$tabPanel.find(toSelector(MULTIVIEW_ITEM_CLASS))[0]).start();
        this.tabWidgetMouse = pointerMock(this.$tabPanel.find(toSelector(TABS_ITEM_CLASS))[0]).start();
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("'onItemClick' and 'onTitleClick' options test", function(assert) {
    assert.expect(4);

    this.multiViewMouse.click();
    this.tabWidgetMouse.click();

    this.tabPanelInstance.option("onItemClick", function(e) {
        assert.ok(true, "option 'onItemClick' of nested multiview widget successfully changed and raised on click");
    });
    this.tabPanelInstance.option("onTitleClick", function(e) {
        assert.ok(true, "option 'onTitleClick' of nested tabs widget successfully changed and raised on click");
    });

    this.multiViewMouse.click();
    this.tabWidgetMouse.click();
});

QUnit.test("'onItemHold' and 'onTitleHold' options test", function(assert) {
    assert.expect(4);

    this.multiViewMouse.down();
    this.clock.tick(1000);
    this.multiViewMouse.up();

    this.tabWidgetMouse.down();
    this.clock.tick(1000);
    this.tabWidgetMouse.up();

    this.tabPanelInstance.option("onItemHold", function(e) {
        assert.ok(true, "option 'onItemHold' of nested multiview widget successfully changed and raised on hold");
    });
    this.tabPanelInstance.option("onTitleHold", function(e) {
        assert.ok(true, "option 'onTitleHold' of nested tabs widget successfully changed and raised on hold");
    });

    this.multiViewMouse.down();
    this.clock.tick(1000);
    this.multiViewMouse.up();

    this.tabWidgetMouse.down();
    this.clock.tick(1000);
    this.tabWidgetMouse.up();
});

QUnit.test("click on tab should be handled correctly when the 'deferRendering' option is true", function(assert) {
    var items = [
        { text: "Greg", title: "Name" },
        { text: "31", title: "Age" },
        { text: "Charlotte", title: "City" },
        { text: "programmer", title: "Job" }
    ];

    var $element = $("<div>").appendTo("body");

    $element.dxTabPanel({
        items: items,
        deferRendering: true,
        selectedIndex: 0
    });

    try {
        assert.equal($element.find(toSelector(MULTIVIEW_ITEM_CLASS + "-content")).length, 1, "only one multiView item is rendered on init");

        var index = 2,
            pointer = pointerMock($element.find(toSelector(TABS_ITEM_CLASS)).eq(index));

        pointer.start().click();

        assert.equal($element.find(toSelector(MULTIVIEW_ITEM_CLASS + "-content")).length, 2, "one multiView item is rendered after click on tab");
        assert.equal($element.find(toSelector(SELECTED_ITEM_CLASS)).text(), items[index].text, "selected multiView item has correct data");
    } finally {
        $element.remove();
    }
});


QUnit.module("events handlers", {
    beforeEach: function() {
        var that = this;
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        that.createTabPanel = function(assert, spies) {
            spies = spies || {};

            that.titleClickSpy = sinon.spy(function() {
                assert.step("titleClick");
            });
            that.titleHoldSpy = sinon.spy(function() {
                assert.step("titleHold");
            });
            that.titleRenderedSpy = sinon.spy(function() {
                assert.step("titleRendered");
            });

            that.$tabPanel = $("#tabPanel").dxTabPanel({
                dataSource: [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
                            { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }],
                onInitialized: function(e) {
                    spies.titleClick && e.component.on("titleClick", that.titleClickSpy);
                    spies.titleHold && e.component.on("titleHold", that.titleHoldSpy);
                    spies.titleRendered && e.component.on("titleRendered", that.titleRenderedSpy);
                },
                swipeEnabled: true
            });

            that.tabPanelInstance = that.$tabPanel.dxTabPanel("instance");

            that.tabWidgetMouse = pointerMock(that.$tabPanel.find(toSelector(TABS_ITEM_CLASS))[0]).start();
        };
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("'titleRendered' event successfully raised", function(assert) {
    this.createTabPanel(assert, { titleRendered: true });

    assert.verifySteps(["titleRendered", "titleRendered"]);
});

QUnit.test("'titleClick' event successfully raised", function(assert) {
    this.createTabPanel(assert, { titleClick: true });

    this.tabWidgetMouse.click();
    assert.verifySteps(["titleClick"]);
});

QUnit.test("'titleHold' event successfully raised", function(assert) {
    this.createTabPanel(assert, { titleHold: true });

    this.tabWidgetMouse.down();
    this.clock.tick(1000);
    this.tabWidgetMouse.up();
    assert.verifySteps(["titleHold"]);
});

QUnit.test("runtime subscription to 'titleClick' event works fine", function(assert) {
    this.createTabPanel(assert);

    this.tabPanelInstance.on("titleClick", this.titleClickSpy);

    this.tabWidgetMouse.click();
    assert.verifySteps(["titleClick"]);
});

QUnit.test("runtime subscription to 'titleHold' event works fine", function(assert) {
    this.createTabPanel(assert);

    this.tabPanelInstance.on("titleHold", this.titleHoldSpy);

    this.tabWidgetMouse.down();
    this.clock.tick(1000);
    this.tabWidgetMouse.up();
    assert.verifySteps(["titleHold"]);
});


QUnit.module("focus policy", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("focusing empty tab should not cause infinite loop", function(assert) {
    assert.expect(0);

    var tabPanel = new TabPanel($("<div>").appendTo("#qunit-fixture"), {
        items: []
    });
    tabPanel.focus();
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        var items = [{ text: "user", icon: "user", title: "Personal Data", firstName: "John", lastName: "Smith" },
                        { text: "comment", icon: "comment", title: "Contacts", phone: "(555)555-5555", email: "John.Smith@example.com" }];

        fx.off = true;
        this.$element = $("#tabPanel").dxTabPanel({
            focusStateEnabled: true,
            items: items
        });
        this.instance = this.$element.dxTabPanel("instance");
        this.tabs = this.$element.find(toSelector(TABS_CLASS)).dxTabs("instance");
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("focusStateEnabled option", function(assert) {
    assert.expect(2);

    this.instance.option("focusStateEnabled", false);
    assert.ok(!this.tabs.option("focusStateEnabled"));

    this.instance.option("focusStateEnabled", true);
    assert.ok(this.tabs.option("focusStateEnabled"));
});

QUnit.test("tabs focusedElement dependence on tabPanels focusedElement", function(assert) {
    assert.expect(4);

    this.instance.focus();
    $(toSelector(MULTIVIEW_ITEM_CLASS)).eq(1).trigger("dxpointerdown");
    this.clock.tick();

    var multiViewFocusedIndex = $(this.instance.option("focusedElement")).index();

    assert.equal(isRenderer(this.instance.option("focusedElement")), config().useJQueryRenderer, "focusedElement is correct");
    assert.equal(isRenderer(this.tabs.option("focusedElement")), config().useJQueryRenderer, "focusedElement is correct");
    assert.equal(multiViewFocusedIndex, 1, "second multiView element has been focused");
    assert.equal(multiViewFocusedIndex, $(this.tabs.option("focusedElement")).index(), "tabs focused element is equal multiView focused element");
});

QUnit.test("tabPanels focusedElement dependence on tabs focusedElement", function(assert) {
    assert.expect(3);

    this.instance.focus();
    $(toSelector(TABS_ITEM_CLASS)).eq(1).trigger("dxpointerdown");
    this.clock.tick();

    var tabsFocusedIndex = $(this.instance.option("focusedElement")).index();

    assert.equal(isRenderer(this.instance.option("focusedElement")), config().useJQueryRenderer, "focusedElement is correct");
    assert.equal(tabsFocusedIndex, 1, "second tabs element has been focused");
    assert.equal(tabsFocusedIndex, $(this.instance.option("focusedElement")).index(), "multiView focused element is equal tabs focused element");
});

QUnit.test("tabs focusedElement lose focused class", function(assert) {
    assert.expect(6);

    this.$element.find(toSelector(TABS_CLASS)).get(0).focus();
    assert.ok($(toSelector(TABS_ITEM_CLASS)).eq(0).hasClass("dx-state-focused"), "selectedItem obtained focused class after focus");
    assert.ok($(toSelector(TABPANEL_CLASS)).eq(0).hasClass("dx-state-focused"), "selectedItem obtained focused class after focus");
    assert.ok($(toSelector(MULTIVIEW_ITEM_CLASS)).eq(0).hasClass("dx-state-focused"), "selectedItem obtained focused class after focus");
    this.$element.find(toSelector(TABS_CLASS)).get(0).blur();
    assert.ok(!$(toSelector(TABS_ITEM_CLASS)).eq(0).hasClass("dx-state-focused"), "selectedItem lose focused class after blur");
    assert.ok(!$(toSelector(TABPANEL_CLASS)).eq(0).hasClass("dx-state-focused"), "selectedItem lose focused class after blur");
    assert.ok(!$(toSelector(MULTIVIEW_ITEM_CLASS)).eq(0).hasClass("dx-state-focused"), "selectedItem lose focused class after blur");
});

QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#tabPanel").dxTabPanel();
    assert.equal($element.attr("role"), "tabpanel");
});

QUnit.test("tabpanel should NOT have aria-activedescendant", function(assert) {
    var $element = $("#tabPanel").dxTabPanel({ items: [1, 2] }),
        instance = $element.dxTabPanel("instance");

    assert.equal($element.attr("aria-activedescendant"), undefined, "aria-activedescendant does not exist");

    instance.option("focusedElement", $element.find(".dx-item:eq(1)"));
    assert.equal($element.attr("aria-activedescendant"), undefined, "aria-activedescendant does not exist after selection update");
});

QUnit.test("active tab should have aria-controls attribute pointing to active multiview item", function(assert) {
    var $element = $("#tabPanel").dxTabPanel({
            focusStateEnabled: true,
            items: [1, 2],
            selectedIndex: 0
        }),
        tabs = $element.find(".dx-tab"),
        views = $element.find(".dx-multiview-item"),
        keyboard = new keyboardMock($element.find(".dx-tabs"));

    $element.find(".dx-tabs").focusin();

    assert.notEqual($(tabs[0]).attr("aria-controls"), undefined, "aria-controls exists");
    assert.equal($(tabs[0]).attr("aria-controls"), $(views[0]).attr("id"), "aria-controls equals 1st item's id");

    keyboard.keyDown("right");

    assert.notEqual($(tabs[1]).attr("aria-controls"), undefined, "aria-controls exists");
    assert.equal($(tabs[1]).attr("aria-controls"), $(views[1]).attr("id"), "aria-controls equals 2nd item's id");
});


QUnit.module("dataSource integration");

QUnit.test("dataSource loading should be fired once", function(assert) {
    var deferred = $.Deferred();
    var dataSourceLoadCalled = 0;

    $("#tabPanel").dxTabPanel({
        dataSource: {
            load: function() {
                dataSourceLoadCalled++;

                return deferred.promise();
            }
        }
    });

    assert.equal(dataSourceLoadCalled, 1, "dataSource load called once");
});
