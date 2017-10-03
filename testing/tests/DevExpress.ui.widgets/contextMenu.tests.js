"use strict";

var $ = require("jquery"),
    devices = require("core/devices"),
    fx = require("animation/fx"),
    ContextMenu = require("ui/context_menu"),
    eventUtils = require("events/utils"),
    contextMenuEvent = require("events/contextmenu"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("ui/button");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="simpleMenu"></div>\
        <div id="menuTarget"></div>\
        <div id="menuTarget2"></div>\
        <div id="menuShower"></div>';

    $("#qunit-fixture").html(markup);
});

var DX_CONTEXT_MENU_CLASS = "dx-context-menu",
    DX_MENU_ITEM_CLASS = "dx-menu-item",
    DX_MENU_ITEM_CONTENT_CLASS = "dx-menu-item-content",
    DX_MENU_PHONE_CLASS = "dx-menu-phone-overlay",
    DX_MENU_ITEM_SELECTED_CLASS = "dx-menu-item-selected",
    DX_STATE_HOVER_CLASS = "dx-state-hover",
    DX_STATE_FOCUSED_CLASS = "dx-state-focused",
    DX_MENU_ITEM_EXPANDED_CLASS = "dx-menu-item-expanded",
    DX_MENU_ITEM_POPOUT_CLASS = "dx-menu-item-popout",
    DX_SUBMENU_CLASS = "dx-submenu",
    DX_HAS_SUBMENU_CLASS = "dx-menu-item-has-submenu",
    DX_HAS_CONTEXT_MENU_CLASS = "dx-has-context-menu";

var isDeviceDesktop = function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "skip this test on mobile devices");
        return false;
    }
    return true;
};

var moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        this.items = [
            { text: "Item 1" },
            { text: "Item 2", items: [] },
            { text: "Item 3", items: [{ text: "Item 31", items: [{ text: "Item 311" }, { text: "Item 312" }] }] },
            { text: "Item 4", items: [{ text: "Item 41" }, { text: "Item 42" }] }
        ];

        this.$element = $("#simpleMenu");

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module("Rendering", moduleConfig);

QUnit.test("context menu should have correct css class", function(assert) {
    new ContextMenu(this.$element, {});

    assert.ok(this.$element.hasClass(DX_HAS_CONTEXT_MENU_CLASS), "context menu have correct class");
});

QUnit.test("all items in root level should be wrapped in submenu", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: "item1" }], visible: true }),
        $itemsContainer = instance.itemsContainer();

    assert.ok($itemsContainer.children().hasClass(DX_SUBMENU_CLASS), "items are wrapped in submenu");
});

QUnit.test("lazy rendering: not render overlay on init", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: "item1" }] }),
        $itemsContainer = instance.itemsContainer();

    assert.ok(!$itemsContainer, "no itemsContainer");

    instance.show();
    $itemsContainer = instance.itemsContainer();
    assert.ok($itemsContainer.length, "overlay is defined");
});

QUnit.test("item click should not prevent document click handler", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "a" }]
        }),
        documentClickHandler = sinon.stub();

    $(document).on("click", documentClickHandler);
    instance.show();
    var $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);
    $($items.eq(0)).trigger("click");

    assert.equal(documentClickHandler.callCount, 1, "click was not prevented");
    $(document).off("click");
});

QUnit.test("context menu items with submenu should have 'has-submenu' class", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item1", items: [{ text: "item11" }] }],
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");

    $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    assert.ok($items.eq(0).hasClass(DX_HAS_SUBMENU_CLASS), "item with children has special class");
    assert.notOk($items.eq(1).hasClass(DX_HAS_SUBMENU_CLASS), "item without children has not special class");
});

QUnit.test("context menu items with submenu should have item popout", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item1", items: [{ text: "item11" }] }],
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.find("." + DX_MENU_ITEM_POPOUT_CLASS).length, 1, "only one item popout exist");
    assert.equal($items.eq(0).find("." + DX_MENU_ITEM_POPOUT_CLASS).length, 1, "popout is on the first item");
});

QUnit.test("item container should have special class for phone devices", function(assert) {
    var device = devices.current();

    devices.current({ deviceType: "phone" });

    try {
        var instance = new ContextMenu(this.$element, { visible: true });
        assert.ok(instance.itemsContainer().hasClass(DX_MENU_PHONE_CLASS));
    } finally {
        devices.current(device);
    }
});

QUnit.test("context menu should create only root level at first", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11" }] }],
            visible: true
        }),
        submenus = instance.itemsContainer().find("." + DX_SUBMENU_CLASS);

    assert.equal(submenus.length, 1, "only root level rendered");
});

QUnit.test("root level should not be rendered without items", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [], visible: true }),
        submenus = instance.itemsContainer().find("." + DX_SUBMENU_CLASS);

    assert.equal(submenus.length, 0, "there is no submenus in menu");
});

QUnit.test("submenus should not be rendered without items", function(assert) {
    var instance = new ContextMenu(this.$element, {
            visible: true,
            items: [{ text: "item1", items: [] }]
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

    $($rootItem).trigger("dxclick");

    var submenus = instance.itemsContainer().find("." + DX_SUBMENU_CLASS);

    assert.equal(submenus.length, 1, "empty submenu should not rendered");
    assert.equal($itemsContainer.find("." + DX_MENU_ITEM_POPOUT_CLASS).length, 0, "there are no popouts in items");
    assert.notOk($rootItem.hasClass(DX_HAS_SUBMENU_CLASS), "root item has no 'has-submenu' class");
});

QUnit.test("onSubmenuCreated should be fired after submenu was rendered", function(assert) {
    var onSubmenuCreated = sinon.spy(),
        instance = new ContextMenu(this.$element, {
            visible: true,
            onSubmenuCreated: onSubmenuCreated,
            items: [{ text: "item1", items: [{ text: "item11" }] }]
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

    $($rootItem).trigger("dxclick");
    assert.equal(onSubmenuCreated.callCount, 1, "handler was called once");

    $($rootItem).trigger("dxclick");
    assert.equal(onSubmenuCreated.callCount, 1, "handler should not be called after the second click");

    instance.hide();
    instance.show();
    $($rootItem).trigger("dxclick");
    assert.equal(onSubmenuCreated.callCount, 1, "handler should not be called after the second showing");
});

QUnit.test("contextMenu should not create a new overlay after refresh", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: 1 }, { text: 2 }] });

    instance.option("items", [{ text: 3 }, { text: 4 }]);
    instance.show();
    assert.equal($(".dx-overlay").length, 1, "only one overlay should exists");
});

QUnit.test("submenus in the same level should have same horizontal offset", function(assert) {
    var instance = new ContextMenu(this.$element, {
            target: "#menuTarget",
            items: [
            { text: "item1", items: [{ text: "subItem1" }] },
            { text: "item2WithVeryVeryLongCaption", items: [{ text: "subItem2" }] }
            ],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer(),
        $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS),
        offsets = [];

    $($items.eq(0)).trigger("dxclick");
    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);
    offsets[0] = $items.eq(1).offset().left;

    $($items.eq(2)).trigger("dxclick");
    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);
    offsets[1] = $items.eq(3).offset().left;

    assert.equal(offsets[0], offsets[1], "offsets are equal");
});

QUnit.test("event handlers should be bound for detached target", function(assert) {
    var $target = $("#menuTarget"),
        $parent = $target.parent();

    $target.detach();

    var contextMenu = new ContextMenu(this.$element, { target: "#menuTarget", items: [{ text: "a" }] });
    $parent.append($target);
    $($target).trigger("dxcontextmenu");

    assert.ok(contextMenu.option("visible"), "context menu is shown after detached target been attached");
});


QUnit.module("Showing and hiding context menu", moduleConfig);

QUnit.test("visible option should toggle menu's visibility", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: 1, items: [{ text: 11 }] }], visible: true }),
        $itemsContainer = instance.itemsContainer();

    assert.ok($itemsContainer.is(":visible"), "menu is visible");

    instance.option("visible", false);
    assert.notOk($itemsContainer.is(":visible"), "menu is invisible");

    instance.option("visible", true);
    assert.ok($itemsContainer.is(":visible"), "menu is visible");
});

QUnit.test("context menu should not leak overlays", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

    instance.option("items", [{ text: 1 }]);
    assert.equal($(".dx-overlay").length, 1, "overlays cleaned correctly");
});

QUnit.test("show method should toggle menu's visibility", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: false });

    instance.show();
    assert.ok(instance.option("visible"), "option visible was changed to true");
});

QUnit.test("hide method should toggle menu's visibility", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

    instance.hide();
    assert.notOk(instance.option("visible"), "option visible was changed to false");
});

QUnit.test("expanded class should be removed from submenus after hiding menu with hide method", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer();

    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(1)).trigger("dxclick");

    instance.hide();

    var $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $items.each(function(_, item) {
        var $item = $(item),
            itemText = $item.find(".dx-menu-item-text").first().text();

        assert.notOk($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), itemText + " has no expanded class");
    });
});

QUnit.test("expanded class should be removed from submenus after hiding menu with visible option", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer();

    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(1)).trigger("dxclick");

    instance.option("visible", false);

    var $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $items.each(function(_, item) {
        var $item = $(item),
            itemText = $item.find(".dx-menu-item-text").first().text();

        assert.notOk($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), itemText + " has no expanded class");
    });
});

QUnit.test("expanded class should be removed from submenus after hiding menu with outside click", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer();

    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(1)).trigger("dxclick");

    $(document).trigger("dxpointerdown");

    var $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $items.each(function(_, item) {
        var $item = $(item),
            itemText = $item.find(".dx-menu-item-text").first().text();

        assert.notOk($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), itemText + " has no expanded class");
    });
});

QUnit.test("context menu should not be shown if target is disabled", function(assert) {
    try {
        var eventCounter = 0,
            incrementCounter = function() { eventCounter++; },
            instance = new ContextMenu(this.$element, {
                items: [{ text: "item 1" }],
                target: "#menuTarget",
                visible: false,
                onPositioning: incrementCounter,
                onShowing: incrementCounter,
                onShown: incrementCounter,
                onPositioned: incrementCounter
            });

        $("#menuTarget").addClass("dx-state-disabled").trigger("dxcontextmenu");

        assert.notOk(instance.option("visible"), "context menu is not visible");
        assert.equal(eventCounter, 0, "visibility callbacks does not fired");
    } finally {
        $("#menuTarget").removeClass("dx-state-disabled");
    }
});

QUnit.test("context menu should not be shown if it is disabled", function(assert) {
    try {
        var eventCounter = 0,
            incrementCounter = function() { eventCounter++; },
            instance = new ContextMenu(this.$element, {
                items: [{ text: "item 1" }],
                disabled: true,
                target: "#menuTarget",
                visible: false,
                onPositioning: incrementCounter,
                onShowing: incrementCounter,
                onShown: incrementCounter,
                onPositioned: incrementCounter
            });

        $("#menuTarget").trigger("dxcontextmenu");

        assert.notOk(instance.option("visible"), "context menu is not visible");
        assert.equal(eventCounter, 0, "visibility callbacks does not fired");
    } finally {
        $("#menuTarget").removeClass("dx-state-disabled");
    }
});

QUnit.test("context menu should be shown after submenuDirection option change", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: "item 1" }], visible: true }),
        $itemsContainer;

    instance.option("visible", false);
    instance.option("submenuDirection", "left");
    $itemsContainer = instance.itemsContainer();
    assert.ok(!$itemsContainer, "menu is removed");

    instance.show();
    $itemsContainer = instance.itemsContainer();
    assert.ok($itemsContainer.is(":visible"), "menu is rendered again");
});

QUnit.test("context menu's overlay should have flipfit position as native context menu", function(assert) {
    new ContextMenu(this.$element, { items: [{ text: "item 1" }], visible: true });

    var overlay = this.$element.find(".dx-overlay").dxOverlay("instance");
    assert.equal(overlay.option("position").collision, "flipfit", "position is correct");
});

QUnit.test("Document should be default target", function(assert) {
    var showingHandler = sinon.stub();

    new ContextMenu(this.$element, {
        items: [{ text: "item 1" }],
        onShowing: showingHandler
    });

    $(window).trigger("dxcontextmenu");
    assert.equal(showingHandler.callCount, 0, "context menu is not subscribed on the window");

    $(document).trigger("dxcontextmenu");
    assert.equal(showingHandler.callCount, 1, "context menu is subscribed on the document");
});

//T459373
QUnit.test("Show context menu when position and target is defined", function(assert) {
    var overlay,
        instance = new ContextMenu(this.$element, {
            target: $("#menuTarget"),
            items: [{ text: "item 1" }],
            visible: false,
            position: {
                at: "bottom center",
                my: "top center",
                of: $("#menuShower")
            }
        });

    $("#menuTarget").trigger("dxcontextmenu");

    overlay = this.$element.find(".dx-overlay").dxOverlay("instance");
    assert.ok(instance.option("visible"), "context menu is visible");
    assert.deepEqual(overlay.option("position.of").get(0), $("#menuTarget").get(0), "position is correct");
});

QUnit.test("Show context menu when position.of is defined", function(assert) {
    var overlay,
        instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1" }],
            visible: false,
            position: {
                at: "bottom center",
                my: "top center",
                of: $("#menuShower")
            }
        });

    $("#menuShower").trigger("dxcontextmenu");

    overlay = this.$element.find(".dx-overlay").dxOverlay("instance");
    assert.ok(instance.option("visible"), "context menu is visible");
    assert.deepEqual(overlay.option("position.of").get(0), $("#menuShower").get(0), "position is correct");
});

QUnit.test("Show context menu when position is undefined", function(assert) {
    var overlay,
        instance = new ContextMenu(this.$element, {
            target: $("#menuTarget"),
            items: [{ text: "item 1" }],
            visible: false
        });

    $("#menuTarget").trigger("dxcontextmenu");

    overlay = this.$element.find(".dx-overlay").dxOverlay("instance");
    assert.ok(instance.option("visible"), "context menu is visible");
    assert.ok(overlay.option("position.of") instanceof $.Event, "position is correct");
});

QUnit.test("Show context menu via api when position is defined", function(assert) {
    var overlay,
        instance = new ContextMenu(this.$element, {
            target: $("#menuTarget"),
            items: [{ text: "item 1" }],
            visible: false,
            position: {
                at: "bottom center",
                my: "top center",
                of: $("#menuShower")
            }
        });

    instance.show();

    overlay = this.$element.find(".dx-overlay").dxOverlay("instance");
    assert.ok(instance.option("visible"), "context menu is visible");
    assert.deepEqual(overlay.option("position.of").get(0), $("#menuTarget").get(0), "position is correct");
});

QUnit.test("Show context menu via api when position is undefined", function(assert) {
    var overlay,
        instance = new ContextMenu(this.$element, {
            target: $("#menuTarget"),
            items: [{ text: "item 1" }],
            visible: false
        });

    instance.show();

    overlay = this.$element.find(".dx-overlay").dxOverlay("instance");
    assert.ok(instance.option("visible"), "context menu is visible");
    assert.deepEqual(overlay.option("position.of").get(0), $("#menuTarget").get(0), "position is correct");
});


QUnit.module("Showing and hiding submenus", moduleConfig);

QUnit.test("submenu should be shown after click on root item", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item1", items: [{ text: "item11" }] }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

    $($rootItem).trigger("dxclick");

    var submenus = $itemsContainer.find("." + DX_SUBMENU_CLASS);

    assert.equal(submenus.length, 2, "submenu was rendered");
    assert.ok(submenus.eq(1).is(":visible"), "submenu is visible");
    assert.ok($rootItem.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), "expanded class was added");
});

QUnit.test("all submenus should hide after click on item from different branch", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11" }] }, { text: "item 2" }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer(),
        $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");
    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);
    $($items.eq(2)).trigger("dxclick");

    assert.notOk($items.eq(0).is(":visible"), "first submenu item was hidden");
    assert.notOk($items.eq(1).is(":visible"), "second submenu item was hidden");
    assert.notOk($items.eq(0).hasClass(DX_MENU_ITEM_EXPANDED_CLASS), "expanded class was removed from first item");
});

QUnit.test("submenu should not hide after click on parent submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer(),
        $items;

    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(1)).trigger("dxclick");
    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    assert.ok($items.eq(2).is(":visible"), "last submenu item was shown");

    $($items.eq(1)).trigger("dxclick");
    assert.ok($items.eq(1).is(":visible"), "first submenu item is visible");
    assert.ok($items.eq(1).hasClass(DX_MENU_ITEM_EXPANDED_CLASS), "expanded class was not removed");
});

QUnit.test("submenu should not hide after second click on root item", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item1", items: [{ text: "item11" }] }],
            visible: true
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

    $($rootItem).trigger("dxclick");
    $($rootItem).trigger("dxclick");

    var submenus = $itemsContainer.find("." + DX_SUBMENU_CLASS);

    assert.equal(submenus.length, 2, "submenu was rendered");
    assert.ok(submenus.eq(1).is(":visible"), "submenu was expanded");
    assert.ok($rootItem.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), "expanded class was not removed");
});

QUnit.test("context menu should not blink after second hover on root item", function(assert) {
    if(!isDeviceDesktop(assert)) return;

    var hideSubmenu;

    try {
        var instance = new ContextMenu(this.$element, {
                items: [{ text: 1, items: [{ text: 11 }] }],
                visible: true,
                showSubmenuMode: { name: "onHover", delay: 0 }
            }),
            $itemsContainer = instance.itemsContainer(),
            $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

        //todo: remove private spy if better solution will found
        hideSubmenu = sinon.spy(instance, "_hideSubmenu");

        $($itemsContainer).trigger($.Event("dxhoverstart", { target: $rootItem.get(0) }));
        this.clock.tick(0);

        $($itemsContainer).trigger($.Event("dxhoverstart", { target: $rootItem.get(0) }));
        this.clock.tick(0);

        assert.equal(hideSubmenu.callCount, 0, "submenu should not hides anytime");
    } finally {
        hideSubmenu.restore();
    }
});

QUnit.test("custom slide animation should work for submenus", function(assert) {
    var instance = new ContextMenu(this.$element, {
            visible: true,
            animation: {
                show: {
                    type: "slide",
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            },
            items: [{ text: "itemA", items: [{ text: "Item A-A" }] }],
            target: "#menuTarget"
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

    try {
        fx.off = false;
        $($rootItem).trigger("dxclick");
        this.clock.tick(500);
    } finally {
        fx.off = true;
    }

    var $submenus = $itemsContainer.find("." + DX_SUBMENU_CLASS),
        parentLeft = $submenus.eq(0).offset().left,
        childrenLeft = $submenus.eq(1).offset().left;

    assert.ok(parentLeft < childrenLeft, "child item should not overlap parent item");
});


QUnit.module("Visibility callbacks", moduleConfig);

QUnit.test("onHiding and onHidden options with outside click", function(assert) {
    var events = [];

    new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        visible: true,
        onHiding: function() {
            events.push("onHiding");
        },
        onHidden: function() {
            events.push("onHidden");
        }
    });

    $(document).trigger("dxpointerdown");
    assert.deepEqual(events, ["onHiding", "onHidden"], "events triggered and trigger order is correct");
});

QUnit.test("onHiding and onHidden options with hide method", function(assert) {
    var events = [],
        instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: true,
            onHiding: function() {
                events.push("onHiding");
            },
            onHidden: function() {
                events.push("onHidden");
            }
        });

    instance.hide();
    assert.deepEqual(events, ["onHiding", "onHidden"], "events triggered and trigger order is correct");
});

QUnit.test("onHiding and onHidden options with visible option", function(assert) {
    var events = [],
        instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: true,
            onHiding: function() {
                events.push("onHiding");
            },
            onHidden: function() {
                events.push("onHidden");
            }
        });

    instance.option("visible", false);
    assert.deepEqual(events, ["onHiding", "onHidden"], "events triggered and trigger order is correct");
});

QUnit.test("visibility callbacks should not fire for submenus", function(assert) {
    var events = [],
        instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }, { text: 2, items: [{ text: 21 }] }],
            visible: true,
            onHiding: function() {
                events.push("onHiding");
            },
            onHidden: function() {
                events.push("onHidden");
            },
            onShowing: function() {
                events.push("onShowing");
            },
            onShown: function() {
                events.push("onShown");
            }
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    events = [];

    $($items.eq(0)).trigger("dxclick");
    $($items.eq(1)).trigger("dxclick");

    assert.deepEqual(events, [], "events was not triggered");
});

QUnit.test("onShowing and onShown options with show method", function(assert) {
    var events = [],
        instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: false,
            onShowing: function() {
                events.push("onShowing");
            },
            onShown: function() {
                events.push("onShown");
            }
        });

    instance.show();
    assert.deepEqual(events, ["onShowing", "onShown"], "events triggered and trigger order is correct");
});

QUnit.test("onShowing and onShown options should fire when visible is initially true", function(assert) {
    var events = [];

    new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        visible: true,
        onShowing: function() {
            events.push("onShowing");
        },
        onShown: function() {
            events.push("onShown");
        }
    });

    assert.deepEqual(events, ["onShowing", "onShown"], "events triggered and trigger order is correct");
});

QUnit.test("onShowing and onShown options with visible option", function(assert) {
    var events = [],
        instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: false,
            onShowing: function() {
                events.push("onShowing");
            },
            onShown: function() {
                events.push("onShown");
            }
        });

    instance.option("visible", true);
    assert.deepEqual(events, ["onShowing", "onShown"], "events triggered and trigger order is correct");
});


QUnit.module("Options", moduleConfig);

QUnit.test("onItemClick option", function(assert) {
    assert.expect(1);

    var instance = new ContextMenu(this.$element, {
            items: [{ text: "a" }],
            onItemClick: function(e) {
                assert.ok(true, "onItemClick fired");
            },
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");
});

QUnit.test("itemsExpr option", function(assert) {
    var instance = new ContextMenu(this.$element, {
            visible: true,
            items: [{ text: "itemA", subItems: [{ text: "itemB" }] }],
            itemsExpr: "subItems"
        }),
        $item = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS).eq(0);

    $($item).trigger("dxclick");

    var $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.length, 2, "second level is rendered");

});

QUnit.test("target option as string", function(assert) {
    var instance = new ContextMenu(this.$element, {
        visible: false,
        items: [{ text: "itemA" }],
        target: "#menuTarget"
    });

    $("#menuTarget").trigger("dxcontextmenu");

    assert.ok(instance.option("visible"), "menu was shown");
});

QUnit.test("target option as jQuery", function(assert) {
    var instance = new ContextMenu(this.$element, {
        visible: false,
        items: [{ text: "itemA" }],
        target: $("#menuTarget")
    });

    $("#menuTarget").trigger("dxcontextmenu");

    assert.ok(instance.option("visible"), "menu was shown");
});

QUnit.test("target option as DOM element", function(assert) {
    var instance = new ContextMenu(this.$element, {
        visible: false,
        items: [{ text: "itemA" }],
        target: document.getElementById('menuTarget')
    });

    $("#menuTarget").trigger("dxcontextmenu");

    assert.ok(instance.option("visible"), "menu was shown");
});

QUnit.test("target option changing should change the target", function(assert) {
    var instance = new ContextMenu(this.$element, {
        visible: false,
        items: [{ text: "itemA" }],
        target: "#menuTarget"
    });

    instance.option("target", "#menuTarget2");

    $("#menuTarget").trigger("dxcontextmenu");
    assert.notOk(instance.option("visible"), "menu was not shown");

    $("#menuTarget2").trigger("dxcontextmenu");
    assert.ok(instance.option("visible"), "menu was shown");
});

QUnit.test("showSubmenuMode hover without delay", function(assert) {
    if(!isDeviceDesktop(assert)) return;

    var instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: "onHover", delay: 0 }
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0),
        $items;

    $($itemsContainer).trigger($.Event("dxhoverstart", { target: $rootItem.get(0) }));
    this.clock.tick(0);

    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.length, 2, "second item was rendered");
});

QUnit.test("showSubmenuMode hover with custom delay", function(assert) {
    if(!isDeviceDesktop(assert)) return;

    var instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: "onHover", delay: 1 }
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0),
        $items;

    $($itemsContainer).trigger($.Event("dxhoverstart", { target: $rootItem.get(0) }));
    this.clock.tick(1);

    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.length, 2, "second item was rendered");
});

QUnit.test("submenu should not be shown if hover was ended before show delay time exceeded", function(assert) {
    if(!isDeviceDesktop(assert)) return;

    var instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: "onHover", delay: 500 }
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0),
        $items;

    $($itemsContainer).trigger($.Event("dxhoverstart", { target: $rootItem.get(0) }));
    this.clock.tick(400);
    $($itemsContainer).trigger($.Event("dxhoverend", { target: $rootItem.get(0) }));
    this.clock.tick(100);

    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.length, 1, "second item was not rendered");
});

QUnit.test("showSubmenuMode click with custom delay", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: "onClick", delay: 500 }
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0),
        $items;

    $($rootItem).trigger("dxclick");

    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.length, 2, "delay should be ignored");
});

QUnit.test("showSubmenuMode click during hover delay", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: "onHover", delay: 500 }
        }),
        $itemsContainer = instance.itemsContainer(),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0),
        $items;

    $($itemsContainer).trigger($.Event("dxhoverstart", { target: $rootItem.get(0) }));
    this.clock.tick(1);
    $($rootItem).trigger("dxclick");

    $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    assert.equal($items.length, 2, "delay should be ignored");
});

QUnit.test("context menu should not crash when items changing during onShowing event", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }, { text: 2 }],
        onShowing: function() {
            this.option("items", [{ text: 3 }, { text: 4 }]);
        }
    });

    instance.show();
    assert.ok(1, "context menu did not crash");
});

QUnit.test("context menu should not show if showing is prevented during onPositioning action", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        onPositioning: function(e) {
            e.cancel = true;
        }
    });

    $("#menuTarget").trigger("dxcontextmenu");
    assert.notOk(instance.option("visible"));
});

QUnit.test("context menu should not show if showing is prevented during onShowing action", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        onShowing: function(e) {
            e.cancel = true;
        }
    });

    $("#menuTarget").trigger("dxcontextmenu");
    assert.notOk(instance.option("visible"));
});

QUnit.test("default browser menu should not be prevented if context menu showing is prevented", function(assert) {
    new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        onShowing: function(e) {
            e.cancel = true;
        }
    });

    var e = $.Event("dxcontextmenu");

    $("#menuTarget").trigger(e);
    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("default browser menu should not be prevented if context menu positioning is prevented", function(assert) {
    new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        onPositioning: function(e) {
            e.cancel = true;
        }
    });

    var e = $.Event("dxcontextmenu");

    $("#menuTarget").trigger(e);
    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("disabling for nested item should work correctly", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            target: "#menuTarget",
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");
    $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    instance.option("items[0].items[0].disabled", true);

    assert.ok($items.eq(1).hasClass("dx-state-disabled"), "item was disabled");
});

QUnit.test("onItemContextMenu option when context menu initially hidden", function(assert) {
    var fired = 0,
        args = {},
        instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }, { text: 2 }],
            onItemContextMenu: function(e) {
                fired++;
                args = e;
            },
            visible: false
        }),
        eventName = eventUtils.addNamespace(contextMenuEvent.name, instance.NAME);

    instance.show();

    $(document).on(eventName, function() {
        fired++;
    });

    var $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);
    $($items.eq(0)).trigger("dxcontextmenu");

    assert.equal(fired, 1, "event fired only in action");
    assert.strictEqual($(args.itemElement)[0], $items[0], "item element is correct");
    assert.equal(args.itemData.text, "1", "item data is correct");
});

QUnit.test("Separator should not be shown if last rendered item was in other level", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [
                {
                    text: 'Item 1', items: [
                { text: 'Item 11' },
                { text: 'Item 12', beginGroup: true, visible: false }
                    ]
                },
                {
                    text: 'Item 2', items: [
                { text: 'Item 21' }
                    ]
                }
            ],
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");
    $($items.eq(1)).trigger("dxclick");

    assert.equal(instance.itemsContainer().find(".dx-menu-separator").length, 0, "separator should not be rendered");
});

QUnit.test("showEvent can prevent showing", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        showEvent: null
    });

    $("#menuTarget").trigger("dxcontextmenu");

    assert.ok(!instance.option("visible"), "default behaviour was prevented");
});

QUnit.test("showEvent set as string", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        showEvent: "dxclick"
    });

    $("#menuTarget").trigger("dxclick");
    assert.ok(instance.option("visible"), "context menu was shown");
});

QUnit.test("showEvent set as string with several events", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        showEvent: "dxclick dxhover"
    });

    $("#menuTarget").trigger("dxclick");
    assert.ok(instance.option("visible"), "context menu was shown");

    instance.hide();
    assert.ok(!instance.option("visible"));

    $("#menuTarget").trigger("dxhover");
    assert.ok(instance.option("visible"), "context menu was shown");
});

QUnit.test("showEvent set as object", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        showEvent: {
            name: "click",
            delay: 500
        }
    });

    $("#menuTarget").trigger("click");
    assert.ok(!instance.option("visible"));
    this.clock.tick(500);
    assert.ok(instance.option("visible"), "context menu was shown");
});

QUnit.test("showEvent set only as delay", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: 1 }],
        target: "#menuTarget",
        showEvent: {
            delay: 500
        }
    });

    $("#menuTarget").trigger("dxcontextmenu");
    assert.ok(!instance.option("visible"));
    this.clock.tick(500);
    assert.ok(instance.option("visible"), "context menu was shown");
});

QUnit.module("Public api", moduleConfig);

QUnit.test("itemsContainer method should return overlay content", function(assert) {
    var instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

    assert.ok(instance.itemsContainer().hasClass("dx-overlay-content"));
    assert.ok(instance.itemsContainer().hasClass(DX_CONTEXT_MENU_CLASS));
});


QUnit.module("Behavior", moduleConfig);

QUnit.test("it should be possible to update items on item click", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "a" }],
            onItemClick: function(e) {
                e.component.option("items", [{ text: "b" }]);
            }
        }),
        $items;

    instance.show();
    $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);
    assert.equal($items.eq(0).text(), "a", "items was rendered");

    $($items.eq(0)).trigger("dxclick");
    instance.show();
    $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    assert.equal(instance.option("items")[0].text, "b", "items were changed");
    assert.equal($items.eq(0).text(), "b", "items was changed");
});

QUnit.test("context menu should hide after click on item without children", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "a" }],
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");
    assert.notOk(instance.option("visible"), "menu was hidden");
});

QUnit.test("context menu should not hide after click when item.closeMenuOnClick is false", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "a", closeMenuOnClick: false }],
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    $($items.eq(0)).trigger("dxclick");
    assert.ok(instance.option("visible"), "menu is visible");
});

QUnit.test("context menu should hide after outside click", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1", items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
        visible: true
    });

    $(document).trigger("dxpointerdown");

    assert.notOk(instance.option("visible"), "menu was hidden");
});

QUnit.test("context menu should not hide after outsideclick when event is canceled", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1", items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
        visible: true,
        onHiding: function(e) {
            e.cancel = true;
        }
    });

    $(document).trigger("dxpointerdown");

    assert.ok(instance.option("visible"), "menu is visible");
});

QUnit.test("context menu should prevent default behavior if it shows", function(assert) {
    new ContextMenu(this.$element, {
        items: [{ text: "item 1" }],
        target: "#menuTarget",
        visible: false
    });

    var contextMenuEvent = $.Event("contextmenu", { pointerType: "mouse" });

    $("#menuTarget").trigger(contextMenuEvent);
    assert.ok(contextMenuEvent.isDefaultPrevented(), "default prevented");
});

QUnit.test("onItemClick should fire for submenus", function(assert) {
    var itemClickArgs = [],
        items = [{ text: "item 1", customField: "custom 1", items: [{ text: "item 11", customField: "custom 11" }] }],
        instance = new ContextMenu(this.$element, {
            onItemClick: function(arg) {
                itemClickArgs.push(arg.itemData);
            },
            items: items
        }),
        $itemsContainer;

    instance.show();
    $itemsContainer = instance.itemsContainer();

    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    $($itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(1)).trigger("dxclick");

    assert.deepEqual(itemClickArgs, [items[0], items[0].items[0]], "onItemClick fired with correct arguments");
});

QUnit.test("First item should not get focus after menu shown", function(assert) {
    var focusedElementChangeCount = 0,
        instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1" }],
            focusStateEnabled: true,
            target: "#menuTarget",
            onOptionChanged: function(e) {
                if(e.name === "focusedElement") {
                    focusedElementChangeCount++;
                }
            },
            visible: false
        });

    instance.show();

    assert.equal(focusedElementChangeCount, 0, "focusedElement should not be changed");
    assert.equal(instance.option("focusedElement"), null, "focusedElement should be cleared");
    assert.equal(instance.itemsContainer().find("." + DX_STATE_FOCUSED_CLASS).length, 0, "there are no focused elements in ui");
});

QUnit.test("incomplete show animation should be stopped when new submenu item starts to show", function(assert) {
    var origFxStop = fx.stop,
        stopCalls = 0,
        instance = new ContextMenu(this.$element, {
            items: [
            { text: "Item 1", items: [{ text: "Item 11" }] },
            { text: "Item 2", items: [{ text: "Item 21" }] }
            ],
            visible: true
        }),
        $items = instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS);

    fx.stop = function($element) {
        if($element.hasClass(DX_SUBMENU_CLASS)) {
            stopCalls++;
        }
    };

    try {
        fx.off = false;

        $($items.eq(0)).trigger("dxclick");
        $($items.eq(1)).trigger("dxclick");

        assert.equal(stopCalls, 3, "animation should stops before each submenu showing");
    } finally {
        fx.off = true;
        fx.stop = origFxStop;
    }
});


QUnit.module("Selection", moduleConfig);

QUnit.test("select item via item.selected property", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1", items: [{ text: "item 11", selected: true, items: [{ text: "item 111" }] }] }],
            visible: true
        }),
        $itemContainer = instance.itemsContainer();

    assert.equal($itemContainer.find("." + DX_MENU_ITEM_SELECTED_CLASS).length, 0, "no selected items");

    $($itemContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    assert.equal($itemContainer.find("." + DX_MENU_ITEM_SELECTED_CLASS).length, 1, "one selected items");
});

QUnit.test("select item via selectedItem option", function(assert) {
    var items = [{ text: "item 1", selected: true, items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
        instance = new ContextMenu(this.$element, {
            items: items,
            selectedItem: items[0].items[0],
            visible: true
        }),
        $itemContainer = instance.itemsContainer();

    assert.equal($itemContainer.find("." + DX_MENU_ITEM_SELECTED_CLASS).length, 0, "no selected items");
    assert.notOk(items[0].selected, "selection was removed from 1st item");

    $($itemContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    assert.equal($itemContainer.find("." + DX_MENU_ITEM_SELECTED_CLASS).length, 1, "one selected items");
    assert.ok(items[0].items[0].selected, "nested item selected");
});

QUnit.test("changing selection via selectedItem option", function(assert) {
    var items = [{ text: "item 1", selected: true, items: [{ text: "item 11", items: [{ text: "item 111" }] }] }],
        instance = new ContextMenu(this.$element, {
            items: items,
            visible: true
        }),
        $itemContainer = instance.itemsContainer();

    assert.ok(items[0].selected, "1st item is selected");

    $($itemContainer.find("." + DX_MENU_ITEM_CLASS).eq(0)).trigger("dxclick");
    instance.option("selectedItem", items[0].items[0]);

    assert.ok(items[0].items[0].selected, "nested item is selected");
    assert.notOk(items[0].selected, "first item is not selected");
});


QUnit.module("Aria accessibility", moduleConfig);

QUnit.test("aria role", function(assert) {
    new ContextMenu(this.$element, {});

    assert.equal(this.$element.attr("role"), "menu", "aria role is correct");
});

QUnit.test("aria-owns should pointed to overlay", function(assert) {
    var instance = new ContextMenu(this.$element, {}),
        $itemsContainer;

    assert.equal(this.$element.attr("aria-owns"), undefined, "aria-owns is not defined if popup is not visible");

    instance.show();
    $itemsContainer = instance.itemsContainer();
    assert.notEqual(this.$element.attr("aria-owns"), undefined, "aria-owns is defined after show");
    assert.equal($itemsContainer.attr("id"), this.$element.attr("aria-owns"), "aria-owns and overlay's id are equals");
});

QUnit.test("aria role on overlay content", function(assert) {
    var instance = new ContextMenu(this.$element, {}),
        $itemsContainer;

    instance.show();
    $itemsContainer = instance.itemsContainer();
    assert.equal($itemsContainer.attr("role"), "menu", "role of overlay exists after open");
});

QUnit.test("aria-activedescendant should have correct target", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [1, 2, 3],
            focusStateEnabled: true,
        }),
        $itemsContainer;

    instance.show();
    $itemsContainer = instance.itemsContainer();

    assert.notEqual($itemsContainer.attr("aria-activedescendant"), undefined, "aria-activedescendant is on the overlay");
    assert.equal(this.$element.attr("aria-activedescendant"), undefined, "no aria-activedescendant on the element");
});


QUnit.module("Keyboard navigation", moduleConfig);

QUnit.test("onItemClick should fire when enter pressed", function(assert) {
    var itemClicked = 0,
        instance = new ContextMenu(this.$element, {
            items: [1, 2, 3],
            focusStateEnabled: true,
            onItemClick: function() { itemClicked++; }
        });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("enter");

    assert.equal(itemClicked, 1, "press enter on item call item click action");
});

QUnit.test("hide menu when space pressed", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1" }, { text: "item 2" }],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("space");

    assert.notOk(instance.option("visible"));
});

QUnit.test("select item when space pressed", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2" }],
        instance = new ContextMenu(this.$element, {
            items: items,
            selectionByClick: true,
            focusStateEnabled: true,
            selectionMode: "single"
        });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("space");

    assert.equal(instance.option("selectedItem").text, "item 2", "correct item is selected");
    assert.ok(items[1].selected, "item has selected property");
});

QUnit.test("when selectionMode is none, not select item when space pressed", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1" }, { text: "item 2" }],
        selectionByClick: true,
        focusStateEnabled: true,
        selectionMode: "single"
    });

    instance.option("selectionMode", "none");

    instance.show();
    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("space");

    assert.equal(instance.option("selectedItem"), null, "no item is selected");
});

QUnit.test("select item when space pressed on inner level", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2", items: [{ text: "item 21" }, { text: "item 22" }] }],
        instance = new ContextMenu(this.$element, {
            items: items,
            selectionByClick: true,
            focusStateEnabled: true,
            selectionMode: "single"
        });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right")
        .keyDown("down")
        .keyDown("space");

    assert.equal(instance.option("selectedItem").text, "item 22", "correct item is selected");
});

QUnit.test("onSelectionChanged handle fire when space pressed", function(assert) {
    var itemSelected = 0,
        instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1" }],
            selectionByClick: true,
            selectionMode: "single",
            focusStateEnabled: true,
            onSelectionChanged: function() {
                itemSelected++;
            }
        });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("space");

    assert.equal(itemSelected, 1, "press space on item call item select");
});

QUnit.test("when selectionMode is none, onSelectionChanged handle not fire when space pressed", function(assert) {
    var itemSelected = 0,
        instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1" }],
            selectionByClick: true,
            selectionMode: "none",
            focusStateEnabled: true,
            onSelectionChanged: function() {
                itemSelected++;
            }
        });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("space");

    assert.equal(itemSelected, 0, "press space on item call item select");
});

QUnit.test("hide context menu when esc pressed", function(assert) {
    var instance = new ContextMenu(this.$element, { focusStateEnabled: true });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("esc");

    assert.ok(!instance.option("visible"), "context menu is hidden");
});

QUnit.test("when press right arrow key we only show submenu if exist", function(assert) {
    var instance = new ContextMenu(this.$element, {
            items: [{ text: "item 1" }, { text: "item 2", items: [{ text: "item 21" }] }],
            focusStateEnabled: true
        }),
        keyboard;

    instance.show();

    keyboard = keyboardMock(instance.itemsContainer());

    keyboard
        .keyDown("down")
        .keyDown("down")
        .keyDown("right");

    assert.equal(getFocusedItemText(instance), "item 21", "focus on first item of second submenu");
    assert.equal(getVisibleSubmenuCount(instance), 2, "we see two submenus");

    keyboard
        .keyDown("right");

    assert.equal(getFocusedItemText(instance), "item 21", "after second right arrow key press we do nothing because item2-1 has not submenu");
    assert.equal(getVisibleSubmenuCount(instance), 2, "we still see two submenus");
});

QUnit.test("don't open submenu on right key press when item is disabled", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1" }, { text: "item 2", disabled: true, items: [{ text: "item 21" }] }],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right");

    assert.equal(instance.itemsContainer().find("." + DX_MENU_ITEM_CLASS).length, 2, "submenu was not rendered");
});

QUnit.test("end key work only in current submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "item 1" },
            { text: "item 2", items: [{ text: "item 21" }, { text: "item 22" }, { text: "item 23" }] },
            { text: "item 3" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right")
        .keyDown("down")
        .keyDown("end");

    assert.equal(instance.option("focusedElement").text(), "item 23", "focus on last item of current submenu");
});

QUnit.test("home key work only in current submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "item 1" },
            { text: "item 2", items: [{ text: "item 21" }, { text: "item 22" }, { text: "item 23" }] },
            { text: "item 3" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right")
        .keyDown("down")
        .keyDown("home");

    assert.equal(instance.option("focusedElement").text(), "item 21", "focus on first item of current submenu");
});

QUnit.test("down key work only in current submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "item 1" },
            { text: "item 2", items: [{ text: "item 21" }, { text: "item 22" }, { text: "item 23" }] },
            { text: "item 3" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right")
        .keyDown("down")
        .keyDown("down")
        .keyDown("down")
        .keyDown("down");

    assert.equal(instance.option("focusedElement").text(), "item 22", "focus on first item of current submenu");
});

QUnit.test("up key work only in current submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "item 1" },
            { text: "item 2", items: [{ text: "item 21" }, { text: "item 22" }, { text: "item 23" }] },
            { text: "item 3" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right")
        .keyDown("up")
        .keyDown("up")
        .keyDown("up")
        .keyDown("up");

    assert.equal(instance.option("focusedElement").text(), "item 23", "focus on first item of current submenu");
});

QUnit.test("left arrow key should not close context menu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1" }],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("left");

    assert.ok(instance.option("visible"), "context menu is visible");
    assert.equal(getVisibleSubmenuCount(instance), 1, "submenu should not open");
});

QUnit.test("left arrow key should hide only previous submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "item 1" },
            { text: "item 2", items: [{ text: "item 21" }, { text: "item 22", items: [] }, { text: "item 23" }] },
            { text: "item 3" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("right")
        .keyDown("down")
        .keyDown("right")
        .keyDown("left");

    assert.equal(getVisibleSubmenuCount(instance), 1, "only root submenu is visible");
    assert.equal(getFocusedItemText(instance), "item 2", "focus on second item of root submenu");
});

QUnit.test("rtl: when press left arrow key we only show submenu if exist", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1" }, { text: "item 2", items: [{ text: "item 21" }] }],
        rtlEnabled: true,
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("left");

    assert.equal(getFocusedItemText(instance), "item 21", "focus on first item of second submenu");
    assert.equal(getVisibleSubmenuCount(instance), 2, "we see two submenus");

    keyboardMock(instance.itemsContainer())
        .keyDown("left");

    assert.equal(getFocusedItemText(instance), "item 21", "after second right arrow key press we do nothing because item2-1 has not submenu");
    assert.equal(getVisibleSubmenuCount(instance), 2, "we still see two submenus");
});

QUnit.test("rtl: right arrow key should not close context menu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [{ text: "item 1", items: [{ text: "item 11" }] }],
        rtlEnabled: true,
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("right");

    assert.ok(instance.option("visible"), "context menu is visible");
    assert.equal(getVisibleSubmenuCount(instance), 1, "submenu should not open");
});

QUnit.test("rtl: right arrow key should hide only previous submenu", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "item 1" },
            { text: "item 2", items: [{ text: "item 21" }, { text: "item 22", items: [] }, { text: "item 23" }] },
            { text: "item 3" }
        ],
        rtlEnabled: true,
        focusStateEnabled: true
    });

    instance.show();

    keyboardMock(instance.itemsContainer())
        .keyDown("down")
        .keyDown("down")
        .keyDown("left")
        .keyDown("down")
        .keyDown("left")
        .keyDown("right");

    assert.equal(getVisibleSubmenuCount(instance), 1, "only root submenu is visible");
    assert.equal(getFocusedItemText(instance), "item 2", "focus on second item of root submenu");
});

QUnit.test("Moving focus should starts from the hovered item", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "Item 1" },
            { text: "Item 2" },
            { text: "Item 3" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    var $itemsContainer = instance.itemsContainer(),
        $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    $($itemsContainer).trigger({ target: $items.eq(1).get(0), type: "dxpointerenter", pointerType: "mouse" });

    assert.equal($items.filter("." + DX_STATE_FOCUSED_CLASS).length, 0, "There are no focused items on show");
    assert.ok($items.eq(1).hasClass(DX_STATE_HOVER_CLASS), "Item 2 was hovered");
    assert.notOk($items.eq(1).hasClass(DX_STATE_FOCUSED_CLASS), "Item 2 was not focused on hover");

    keyboardMock($itemsContainer)
        .keyDown("down");

    assert.equal($itemsContainer.find("." + DX_STATE_FOCUSED_CLASS).text(), "Item 3", "last item was focused");
});

QUnit.test("Moving focus should starts from the hovered item in nested level", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            {
                text: "Item 1", items: [
                { text: "Item 11" },
                { text: "Item 12" },
                { text: "Item 13" }
                ]
            },
            { text: "Item 2" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    var $itemsContainer = instance.itemsContainer(),
        kb = keyboardMock($itemsContainer),
        $rootItem = $itemsContainer.find("." + DX_MENU_ITEM_CLASS).eq(0);

    kb.keyDown("down");
    $($rootItem).trigger("dxclick");
    assert.ok($rootItem.hasClass(DX_STATE_FOCUSED_CLASS), "root item is stay focused after the click");

    var $items = $itemsContainer.find("." + DX_MENU_ITEM_CLASS);

    $($itemsContainer).trigger({ target: $items.eq(2).get(0), type: "dxpointerenter", pointerType: "mouse" });

    assert.ok($items.eq(2).hasClass(DX_STATE_HOVER_CLASS), "Item 12 was hovered");
    assert.notOk($items.eq(2).hasClass(DX_STATE_FOCUSED_CLASS), "Item 12 was not focused on hover");

    kb.keyDown("down");

    assert.ok($items.eq(3).hasClass(DX_STATE_FOCUSED_CLASS), "Item 13 is focused");
});

QUnit.test("Disabled item should be skipped when keyboard navigation", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "Item 1", disabled: true },
            { text: "Item 2" }
        ],
        focusStateEnabled: true
    });

    instance.show();

    var $itemsContainer = instance.itemsContainer(),
        $items = instance.itemElements(),
        kb = keyboardMock($itemsContainer);

    kb.keyDown("down");

    assert.ok($items.eq(1).hasClass(DX_STATE_FOCUSED_CLASS), "disabled item was skipped");
});

QUnit.test("Focus should follow the nested hovered item if item in the parent level is focused", function(assert) {
    var instance = new ContextMenu(this.$element, {
        items: [
            { text: "Item 1" },
            { text: "Item 2", items: [{ text: "Item 21" }, { text: "Item 22" }] }
        ],
        focusStateEnabled: true
    });

    instance.show();

    var $itemsContainer = instance.itemsContainer(),
        $items = instance.itemElements(),
        kb = keyboardMock($itemsContainer);

    $($items.eq(1)).trigger("dxclick");
    kb.keyDown("up");

    var $nestedItem = instance.itemElements().eq(2);
    $($itemsContainer).trigger({ target: $nestedItem.get(0), type: "dxpointerenter", pointerType: "mouse" });

    assert.ok($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), "Item 1 is focused");
    assert.ok($nestedItem.hasClass(DX_STATE_HOVER_CLASS), "Item 21 is hovered");

    kb.keyDown("down");

    assert.ok(instance.itemElements().eq(3).hasClass(DX_STATE_FOCUSED_CLASS), "Item 22 is focused");
});


function getVisibleSubmenuCount(instance) {
    return instance.itemsContainer().find("." + DX_SUBMENU_CLASS).filter(function() {
        return $(this).css("visibility") === "visible";
    }).length;
}

function getFocusedItemText(instance) {
    return instance.option("focusedElement").children("." + DX_MENU_ITEM_CONTENT_CLASS).text();
}
