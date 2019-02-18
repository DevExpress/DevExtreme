import $ from "jquery";
import fx from "animation/fx";
import support from "core/utils/support";
import domUtils from "core/utils/dom";
import TabPanel from "ui/tab_panel";
import pointerMock from "../../helpers/pointerMock.js";
import keyboardMock from "../../helpers/keyboardMock.js";
import { isRenderer } from "core/utils/type";
import config from "core/config";

import "common.css!css";

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
    TABS_CLASS = "dx-tabs",
    MULTIVIEW_ITEM_CLASS = "dx-multiview-item",
    TABS_ITEM_CLASS = "dx-tab",
    SELECTED_ITEM_CLASS = "dx-item-selected",
    TABPANEL_CONTAINER_CLASS = "dx-tabpanel-container";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

QUnit.module("rendering", {
    beforeEach: function() {
        this.$tabPanel = $("#tabPanel").dxTabPanel();
    }
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

QUnit.test("click on dxTabPanel should not scroll page to the tabs", function(assert) {
    var $tabPanel = $("<div>").appendTo("#qunit-fixture"),
        tabPanel = new TabPanel($tabPanel, {
            items: [{ title: "item 1" }]
        }),
        tabNativeFocus = sinon.spy(tabPanel._tabs, "focus");

    $tabPanel.trigger("focusin");
    assert.equal(tabNativeFocus.callCount, 0, "native focus should not be triggered");
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

    assert.equal(isRenderer(this.instance.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
    assert.equal(isRenderer(this.tabs.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
    assert.equal(multiViewFocusedIndex, 1, "second multiView element has been focused");
    assert.equal(multiViewFocusedIndex, $(this.tabs.option("focusedElement")).index(), "tabs focused element is equal multiView focused element");
});

QUnit.test("tabPanels focusedElement dependence on tabs focusedElement", function(assert) {
    assert.expect(3);

    this.instance.focus();
    $(toSelector(TABS_ITEM_CLASS)).eq(1).trigger("dxpointerdown");
    this.clock.tick();

    var tabsFocusedIndex = $(this.instance.option("focusedElement")).index();

    assert.equal(isRenderer(this.instance.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
    assert.equal(tabsFocusedIndex, 1, "second tabs element has been focused");
    assert.equal(tabsFocusedIndex, $(this.instance.option("focusedElement")).index(), "multiView focused element is equal tabs focused element");
});

QUnit.testInActiveWindow("tabs focusedElement lose focused class", function(assert) {
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

QUnit.module("Live Update", {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.titleRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.data = [{
            id: 0,
            text: "0",
            content: "0 content"
        },
        {
            id: 1,
            text: "1",
            content: "1 content"
        }];
        this.createTabPanel = () => {
            var tabPanel = $("#tabPanel").dxTabPanel({
                items: this.data,
                repaintChangesOnly: true,
                onItemRendered: this.itemRenderedSpy,
                onTitleRendered: this.titleRenderedSpy,
                onItemDeleted: this.itemDeletedSpy
            }).dxTabPanel("instance");

            this.itemRenderedSpy.reset();
            this.titleRenderedSpy.reset();
            this.itemDeletedSpy.reset();

            return tabPanel;
        };
    }
}, function() {
    QUnit.test("remove item", function(assert) {
        var tabPanel = this.createTabPanel();

        this.data.pop();
        tabPanel.option("items", this.data);

        assert.equal(this.itemRenderedSpy.callCount, 0, "items are not refreshed after remove");
        assert.equal(this.itemDeletedSpy.callCount, 1, "removed items count");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.text, "1", "check removed item");
    });

    QUnit.test("repaintChangesOnly, update item instance", function(assert) {
        var tabPanel = this.createTabPanel();

        this.data[0] = {
            id: 0,
            text: "0 Updated",
            content: "0 content"
        };
        tabPanel.option("items", this.data);

        assert.equal(this.titleRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData.text, "0 Updated", "check updated item");
    });

    QUnit.test("repaintChangesOnly, add item", function(assert) {
        var tabPanel = this.createTabPanel();

        this.data.push({
            id: 2,
            text: "2 Inserted",
            content: "2 content"
        });
        tabPanel.option("items", this.data);

        assert.equal(this.titleRenderedSpy.callCount, 1, "only one item is updated after push");
        assert.deepEqual(this.titleRenderedSpy.firstCall.args[0].itemData.text, "2 Inserted", "check added item");
        assert.ok($(this.titleRenderedSpy.firstCall.args[0].itemElement).parent().hasClass("dx-tabs-wrapper"), "check item container");
    });

    QUnit.test("repaintChangesOnly, add item and render its content", function(assert) {
        var tabPanel = this.createTabPanel();

        this.data.push({
            id: 2,
            text: "2 Inserted",
            content: "2 content"
        });
        tabPanel.option("items", this.data);
        tabPanel.option("selectedIndex", 2);

        assert.equal(this.titleRenderedSpy.callCount, 1, "only one title is updated after push");
        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after push");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, "2 Inserted", "check added item");
    });

    QUnit.test("should not rerender items if the badge/disabled/visible changed", function(assert) {
        var tabPanel = $("#tabPanel").dxTabPanel({
                items: [{ title: "title" }],
                itemTemplate: function() { return $("<div id='itemContent'>"); }
            }).dxTabPanel("instance"),
            contentElement = $('#itemContent').get(0);

        tabPanel.option("items[0].badge", 'badge text');
        tabPanel.option("items[0].disabled", true);
        tabPanel.option("items[0].visible", false);

        assert.strictEqual(tabPanel.option('items[0].badge'), 'badge text');
        assert.strictEqual(tabPanel.option('items[0].disabled'), true);
        assert.strictEqual(tabPanel.option('items[0].visible'), false);
        assert.strictEqual(contentElement, $('#itemContent').get(0));
    });

    // T704910
    QUnit.test("Fix showing of 'No data to display' text after add first item", function(assert) {
        this.data = [];
        var tabPanel = this.createTabPanel(),
            $tabPanelElement = tabPanel.$element();

        assert.ok($tabPanelElement.find(".dx-empty-message").length);

        this.data.push({
            id: 2,
            text: "2 Inserted",
            content: "2 content"
        });
        tabPanel.option("items", this.data);
        assert.notOk($tabPanelElement.find(".dx-empty-message").length);
    });
});
