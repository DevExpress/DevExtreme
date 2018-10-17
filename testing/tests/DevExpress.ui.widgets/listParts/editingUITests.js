require("ui/action_sheet");

var $ = require("jquery"),
    renderer = require("core/renderer"),
    fx = require("animation/fx"),
    errors = require("ui/widget/ui.errors"),
    translator = require("animation/translator"),
    animationFrame = require("animation/frame"),
    holdEvent = require("events/hold"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config"),
    pointerMock = require("../../../helpers/pointerMock.js"),
    contextMenuEvent = require("events/contextmenu"),
    keyboardMock = require("../../../helpers/keyboardMock.js"),
    decoratorRegistry = require("ui/list/ui.list.edit.decorator_registry"),
    SwitchableEditDecorator = require("ui/list/ui.list.edit.decorator.switchable"),
    SwitchableButtonEditDecorator = require("ui/list/ui.list.edit.decorator.switchable.button"),
    themes = require("ui/themes"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store");

require("ui/list");
require("common.css!");

var LIST_ITEM_CLASS = "dx-list-item",
    LIST_ITEM_ICON_CONTAINER_CLASS = "dx-list-item-icon-container",
    LIST_ITEM_CONTENT_CLASS = "dx-list-item-content",
    LIST_ITEM_BEFORE_BAG_CLASS = "dx-list-item-before-bag";

var toSelector = function(cssClass) {
    return "." + cssClass;
};


var SWITCHABLE_DELETE_READY_CLASS = "dx-list-switchable-delete-ready",
    SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS = "dx-list-switchable-menu-shield-positioning",
    SWITCHABLE_DELETE_TOP_SHIELD_CLASS = "dx-list-switchable-delete-top-shield",
    SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS = "dx-list-switchable-delete-bottom-shield",
    SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS = "dx-list-switchable-menu-item-shield-positioning",
    SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS = "dx-list-switchable-delete-item-content-shield";

QUnit.module("switchable menu decorator", {
    beforeEach: function() {
        var testDecorator = SwitchableEditDecorator.inherit({

            modifyElement: function(config) {
                this.callBase.apply(this, arguments);

                var $itemElement = $(config.$itemElement);

                $itemElement.on("dxpreparetodelete", $.proxy(function(e) {
                    this._toggleDeleteReady($itemElement);
                }, this));
            },

            _animateForgetDeleteReady: function() {
                return $.when().promise();
            },

            _animatePrepareDeleteReady: function() {
                return $.when().promise();
            }

        });

        decoratorRegistry.register("menu", "test", testDecorator);
    },
    afterEach: function() {
        delete decoratorRegistry.registry.menu.test;
    }
});

QUnit.test("positioning should be enabled while item prepared to delete", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxpreparetodelete");
    assert.equal($list.hasClass(SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS), true, "shield positioning class added");
    assert.equal($item.hasClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS), true, "positioning class added");
    $item.trigger("dxpreparetodelete");
    assert.equal($list.hasClass(SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS), false, "shield positioning class removed");
    assert.equal($item.hasClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS), false, "positioning class removed");
});

QUnit.test("active state should be enabled while item prepared to delete", function(assert) {
    var clock = sinon.useFakeTimers();

    try {
        var $list = $($("#templated-list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "test"
        }));

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item = $items.eq(0),
            pointer = pointerMock($item);

        $item.trigger("dxpreparetodelete");
        pointer.start("touch").down();
        clock.tick(1000);
        assert.ok(!$item.hasClass("dx-state-active"), "item is not activated");
        $item.trigger("dxpreparetodelete");
        pointer.start("touch").down();
        clock.tick(1000);
        assert.ok($item.hasClass("dx-state-active"), "item is activated");
    } finally {
        clock.restore();
    }
});

QUnit.test("click should remove delete ready class", function(assert) {
    var clickHandled = 0;

    var $list = $("#templated-list").dxList({
        items: ["0", "1"],
        onItemClick: function() {
            clickHandled++;
        },
        allowItemDeleting: true,
        itemDeleteMode: "test"
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxpreparetodelete");
    assert.equal($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), true, "delete ready class added for testing");
    $item.trigger("dxclick");
    assert.equal($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), false, "delete ready class removed");
    assert.equal(clickHandled, 0, "click action is not triggered");
});

QUnit.test("click on item should not remove delete ready class if widget is disabled", function(assert) {
    var clickHandled = 0;

    var $list = $("#templated-list").dxList({
        items: ["0"],
        disabled: true,
        onItemClick: function() {
            clickHandled++;
        },
        allowItemDeleting: true,
        itemDeleteMode: "test"
    });

    $("#templated-list").dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxpreparetodelete");
    $item.trigger("dxclick");
    assert.equal($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), true, "delete ready class not removed");
    assert.equal(clickHandled, 0, "click action is not triggered");
});

QUnit.test("shields should be generated", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2", "3"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $topShield = $list.find(toSelector(SWITCHABLE_DELETE_TOP_SHIELD_CLASS)),
        $bottomShield = $list.find(toSelector(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS));

    assert.ok($topShield.length, "top shield generated");
    assert.ok($bottomShield.length, "bottom shield generated");
    assert.ok($topShield.is(":hidden"), "top shield disabled");
    assert.ok($bottomShield.is(":hidden"), "bottom shield disabled");
});

QUnit.test("prepare delete should add shields before and after element", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2", "3"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(1),
        $topShield = $list.find(toSelector(SWITCHABLE_DELETE_TOP_SHIELD_CLASS)),
        $bottomShield = $list.find(toSelector(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS));

    $item.trigger("dxpreparetodelete");
    assert.ok($topShield.is(":visible"), "top shield enabled");
    assert.ok($bottomShield.is(":visible"), "bottom shield enabled");
    assert.ok(Math.abs($topShield.height() - ($item.offset().top - $list.offset().top)) < 1, "top shield dimensions correct");
    assert.ok(Math.abs($bottomShield.height() - ($list.outerHeight() - $item.outerHeight() - ($item.offset().top - $list.offset().top))) < 1, "bottom shield dimensions correct");
});

QUnit.test("pointerdown on shields should cancel delete", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2", "3"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(1),
        $topShield = $list.find(toSelector(SWITCHABLE_DELETE_TOP_SHIELD_CLASS)),
        $bottomShield = $list.find(toSelector(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS));

    $item.trigger("dxpreparetodelete");
    pointerMock($topShield).start().down();
    assert.equal($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), false, "delete canceled");

    $item.trigger("dxpreparetodelete");
    pointerMock($bottomShield).start().down();
    assert.equal($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), false, "delete canceled");
});

QUnit.test("prepare delete should add shield above item content", function(assert) {
    var $list = $("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "test",
        itemTemplate: function() {
            return $("<div>").append($("<div>").addClass(LIST_ITEM_CONTENT_CLASS));
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemContentShield = function() { return $list.find(toSelector(LIST_ITEM_CONTENT_CLASS)).find(toSelector(SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS)); };

    assert.ok(!itemContentShield().length, "shield not added");
    $item.trigger("dxpreparetodelete");
    assert.ok(itemContentShield().length, "shield added");
    $item.trigger("dxpreparetodelete");
    assert.ok(!itemContentShield().length, "shield removed");
});

QUnit.test("prepare delete should disable scrolling", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "test",
        useNativeScrolling: false
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxpreparetodelete");
    var event = $.Event({ type: "dxscrollstart" });
    $list.find(".dx-scrollable-wrapper").trigger(event);
    assert.equal(event.cancel, true, "scroll disabled");
    $item.trigger("dxpreparetodelete");
    event = $.Event({ type: "dxscrollstart" });
    $list.find(".dx-scrollable-container").trigger(event);
    assert.equal(event.cancel, undefined, "scroll enabled");
});

QUnit.test("forget delete should not enable scrolling that already was disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        scrollView = $list.dxScrollView("instance");

    scrollView.option("disabled", true);
    $item.trigger("dxpreparetodelete");
    assert.equal(scrollView.option("disabled"), true, "scroll disabled");
    $item.trigger("dxpreparetodelete");
    assert.equal(scrollView.option("disabled"), true, "scroll disabled reset");
});


var SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = "dx-list-switchable-delete-button-container",
    SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS = "dx-list-switchable-delete-button-wrapper",
    SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS = "dx-list-switchable-delete-button-inner-wrapper",
    SWITCHABLE_DELETE_BUTTON_CLASS = "dx-list-switchable-delete-button";

QUnit.module("switchable button delete decorator", {
    beforeEach: function() {
        fx.off = true;

        var testDecorator = SwitchableButtonEditDecorator.inherit({

            modifyElement: function(config) {
                this.callBase.apply(this, arguments);

                var $itemElement = $(config.$itemElement);

                $itemElement.on("dxpreparetodelete", $.proxy(function(e) {
                    this._toggleDeleteReady($itemElement);
                }, this));
            }

        });
        decoratorRegistry.register("menu", "test", testDecorator);
    },
    afterEach: function() {
        fx.off = false;

        delete decoratorRegistry.registry.menu.test;
    }
});

QUnit.test("list item markup", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    assert.equal($item.children(toSelector(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS)).length, 0, "delete button won't rendered");
});

QUnit.test("button should be added only when item is ready to delete", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "test"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxpreparetodelete");
    var $deleteButton = $item
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS))
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS))
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS))
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_CLASS));
    assert.ok($deleteButton.hasClass("dx-button"), "button generated");

    $item.trigger("dxpreparetodelete");
    assert.equal($deleteButton.parents().length, 3, "button removed");
});

QUnit.test("delete button click should delete list item", function(assert) {
    assert.expect(1);

    var $list = $($("#templated-list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "test"
        })),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxpreparetodelete");
    list.deleteItem = function($itemElement) {
        assert.equal($itemElement.get(0), $item.get(0), "item is deleted");
        return $.Deferred().resolve().promise();
    };

    var $deleteButton = $item.find(toSelector(SWITCHABLE_DELETE_BUTTON_CLASS));
    $deleteButton.trigger("dxclick");
});

var TOGGLE_DELETE_SWITCH_CLASS = "dx-list-toggle-delete-switch";

QUnit.module("toggle delete decorator");

QUnit.test("toggling delete toggle button should switch delete ready class", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "toggle"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));

    $deleteToggle.trigger("dxclick");
    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), "delete ready class added if toggle pressed");
});


var STATIC_DELETE_BUTTON_CLASS = "dx-list-static-delete-button";

QUnit.module("static delete decorator");

QUnit.test("delete button click should delete list item", function(assert) {
    assert.expect(1);

    var $list = $($("#list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "static"
        })),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    list.deleteItem = function($itemElement) {
        assert.equal($itemElement.get(0), $item.get(0), "item is deleted");
        return $.Deferred().resolve().promise();
    };

    var $deleteButton = $item.find(toSelector(STATIC_DELETE_BUTTON_CLASS));
    $deleteButton.trigger("dxclick");
});

QUnit.test("click on delete button should not raise item click event when item deleting is deferred", function(assert) {
    var clickHandled = 0;

    var $list = $("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "static",
        onItemDeleting: function() {
            return $.Deferred().promise();
        },
        onItemClick: function() {
            clickHandled++;
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $deleteButton = $item.find(toSelector(STATIC_DELETE_BUTTON_CLASS));
    $deleteButton.trigger("dxclick");
    assert.equal(clickHandled, 0, "click action is not triggered");
});


QUnit.module("slideButton delete decorator");

QUnit.test("item swiping should add delete ready class", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideButton"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    pointerMock($item).start().swipeEnd(1);

    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), "delete ready class added if item swiped");
});

QUnit.test("item swiping should not add delete ready class if widget is disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        disabled: true,
        allowItemDeleting: true,
        itemDeleteMode: "slideButton"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var startEvent = pointerMock($item).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "swipe canceled in disabled widget");
});


var SLIDE_MENU_WRAPPER_CLASS = "dx-list-slide-menu-wrapper",

    SLIDE_MENU_CONTENT_CLASS = "dx-list-slide-menu-content",
    SLIDE_MENU_BUTTONS_CONTAINER_CLASS = "dx-list-slide-menu-buttons-container",

    SLIDE_MENU_BUTTONS_CLASS = "dx-list-slide-menu-buttons",
    SLIDE_MENU_BUTTON_CLASS = "dx-list-slide-menu-button",

    SLIDE_MENU_BUTTON_MENU_CLASS = "dx-list-slide-menu-button-menu",

    SLIDE_MENU_CLASS = "dx-list-slide-menu";

var position = function($element) {
    return translator.locate($element).left;
};

QUnit.module("slideItem delete decorator", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("list item markup", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    assert.ok($item.hasClass(SLIDE_MENU_WRAPPER_CLASS), "class added to list item");
    var $itemContent = $item.children(toSelector(SLIDE_MENU_CONTENT_CLASS));
    assert.equal($itemContent.length, 1, "content generated");
    assert.equal($itemContent.text(), "Item Template", "content moved in inner div");

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };
    assert.equal(deleteButtonContent().length, 0, "button is not generated");
});

QUnit.test("icon should not be rendered when custom item template is used", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: [{ icon: "box", text: "Item 1" }],
        itemTemplate: function(data) {
            return $("<div>").text("$: " + data.text);
        }
    }));

    assert.equal($list.find("." + LIST_ITEM_ICON_CONTAINER_CLASS).length, 0, "item content has not been rendered");
});

QUnit.test("swipe should prepare item for delete", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(-0.01);

    var $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS)),
        $deleteButtonContainer = $item.find(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS)),
        $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    assert.ok(position($itemContent) < 0, "item moved");
    var containerPositionDifference = $item.width() - position($deleteButtonContainer);
    assert.ok(containerPositionDifference > 0 && containerPositionDifference < $deleteButton.outerWidth(), "button container moved");
    assert.ok(position($deleteButton) < 0 && position($deleteButton) > -$deleteButton.outerWidth(), "button moved");
    pointer.swipeEnd(-1, -0.5);
    assert.equal(position($itemContent), -$deleteButton.outerWidth(), "item animated");
    assert.equal(position($deleteButtonContainer), $item.width() - $deleteButton.outerWidth(), "button container animated");
    assert.equal(position($deleteButton), 0, "button animated");
    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), "item ready for delete");

    fx.off = false;
    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(position($itemContent), 0, "item animated back");
    assert.equal(position($deleteButtonContainer), $item.width(), "button container animated back");
    assert.equal(position($deleteButton), -$deleteButton.outerWidth(), "button animated back");
});

QUnit.test("swipe should not prepare item for delete if widget is disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        disabled: true,
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var startEvent = pointerMock($item).start().swipeStart().lastEvent();
    assert.ok(startEvent.cancel, "swipe canceled");
});

QUnit.test("swipe should be canceled if swipe in opposite direction", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var startEvent = pointerMock($item).start().swipeStart().swipe(0.1).lastEvent();
    assert.ok(startEvent.cancel, "swipe canceled");
});

QUnit.test("swipe should not be canceled if swipe in opposite direction and item is ready to delete", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    var startEvent = pointerMock($item).start().swipeStart().swipe(0.1).lastEvent();
    assert.ok(!startEvent.cancel, "swipe canceled");
});

QUnit.test("swipe should not move item righter", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));

    pointerMock($item).start().swipeStart().swipe(0.5);
    assert.equal(position($itemContent), 0, "item not moved");
});

QUnit.test("swipe loop should not be canceled", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var startEvent = pointerMock($item).start().swipeStart().swipe(-0.5).swipe(0.5).lastEvent();
    assert.ok(!startEvent.cancel, "item returned back");
});

QUnit.test("click should undo readiness to delete", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS)),
        $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    $itemContent.trigger("dxclick");
    assert.equal(position($itemContent), 0, "item moved back");
    assert.ok(!$item.hasClass(SWITCHABLE_DELETE_READY_CLASS), "item not ready for delete");
    assert.equal($deleteButton.parents().length, 0, "button removed");
});

QUnit.test("click on button should remove item", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "slideItem"
        })),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    list.deleteItem = function($itemElement) {
        assert.equal($itemElement.get(0), $item.get(0), "item is deleted");
        return $.Deferred().resolve().promise();
    };

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    var $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));
    $deleteButton.trigger("dxclick");
});

QUnit.test("click on button should not cause item click event if confirmation present", function(assert) {
    var clickFiredCount = 0;

    var $list = $("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem",
        onItemDeleting: function() {
            return $.Deferred().promise();
        },
        onItemClick: function() {
            clickFiredCount++;
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    var $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));
    $deleteButton.trigger("dxclick");

    assert.equal(clickFiredCount, 0, "item click action not fired");
});

QUnit.test("click on button should not remove item if widget disabled", function(assert) {
    assert.expect(0);

    var $list = $("#templated-list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "slideItem",
            onItemDeleted: function(e) {
                assert.ok(false, "delete action executed");
            }
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    list.option("disabled", true);
    $deleteButton.trigger("dxclick");
});

QUnit.test("button should have no text for the Material theme", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };


    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);

    var $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));

    assert.equal($deleteButton.text(), "", "button has no text for Material theme");

    themes.isMaterial = origIsMaterial;
});

QUnit.test("button should have no text for the Generic theme", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);

    var $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));

    assert.ok($deleteButton.text().length > 0, "button has a text for Generic theme");
});

var INKRIPPLE_WAVE_SHOWING_CLASS = "dx-inkripple-showing",
    INKRIPPLE_MATERIAL_SHOW_TIMEOUT = 100;

QUnit.test("button should have no inkRipple after fast swipe for Material theme", function(assert) {
    var origIsMaterial = themes.isMaterial,
        origCurrent = themes.current,
        clock = sinon.useFakeTimers();

    themes.isMaterial = function() { return true; };
    themes.current = function() { return "material"; };

    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $item = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    var pointer = pointerMock($item);

    var args,
        inkRippleShowingWave,
        testArgs = [{
            afterTouchTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT,
            afterSwipeTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT,
            result: 0,
            message: "button has no inkRipple after short touch before swipe for Material theme",
        }, {
            afterTouchTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT * 1.2,
            afterSwipeTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT * 0.8,
            result: 1,
            message: "button has inkRipple after long touch before swipe for Material theme",
        }];

    for(var i = 0; i < testArgs.length; i++) {
        args = testArgs[i];

        pointer.start("touch").down();
        clock.tick(args.afterTouchTimeout);
        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        clock.tick(args.afterSwipeTimeout);
        inkRippleShowingWave = $item.find(toSelector(INKRIPPLE_WAVE_SHOWING_CLASS));
        assert.equal(inkRippleShowingWave.length, args.result, args.message);
        pointer.start("touch").up();
        clock.tick(400);
    }

    clock.restore();
    themes.isMaterial = origIsMaterial;
    themes.current = origCurrent;
});

QUnit.test("inkRipple feedback should not be broken if swipe in opposite direction", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "slideItem",
        useInkRipple: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        clock = sinon.useFakeTimers(),
        pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(0.01);
    clock.tick(50);
    pointer.start("touch").up();
    clock.tick(50);
    pointer.start("touch").down();
    clock.tick(100);
    var inkRippleShowingWave = $item.find(toSelector(INKRIPPLE_WAVE_SHOWING_CLASS));

    assert.ok(inkRippleShowingWave.length === 1, "inkripple feedback works right after swipe in opposite direction");

    pointer.start("touch").up();
    clock.restore();
});

QUnit.test("swipe should prepare item for delete in RTL mode", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        rtlEnabled: true,
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(0.01);

    var $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS)),
        $deleteButtonContainer = $item.find(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS)),
        $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    assert.ok(position($itemContent) > 0, "item moved");
    var containerPositionDifference = position($deleteButtonContainer);
    assert.ok(containerPositionDifference < 0 && containerPositionDifference > -$deleteButton.outerWidth(), "button container moved");
    assert.ok(position($deleteButton) > 0 && position($deleteButton) < $deleteButton.outerWidth(), "button moved");

    pointer.swipeEnd(1, 0.5);
    assert.equal(position($itemContent), $deleteButton.outerWidth(), "item animated");
    assert.equal(position($deleteButtonContainer), 0, "button container animated");
    assert.equal(position($deleteButton), 0, "button animated");
    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), "item ready for delete");

    fx.off = false;
    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(position($itemContent), 0, "item animated back");
    assert.equal(position($deleteButtonContainer), -$deleteButton.outerWidth(), "button container animated back");
    assert.equal(position($deleteButton), $deleteButton.outerWidth(), "button animated back");
});

QUnit.test("swipe should not move item lefter in RTL mode", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        rtlEnabled: true,
        allowItemDeleting: true,
        itemDeleteMode: "slideItem"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));

    pointerMock($item).start().swipeStart().swipe(-0.5);
    assert.equal(position($itemContent), 0, "item not moved");
});

QUnit.test("multiple swipes should not break deletion", function(assert) {
    var origFxOff = fx.off;
    var clock = sinon.useFakeTimers();

    try {
        fx.off = false;

        var $list = $($("#templated-list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "slideItem"
        }));

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item = $items.eq(0);

        var pointer = pointerMock($item).start();


        pointer.swipeStart().swipe(-0.5).swipeEnd(-1);
        clock.tick(300);
        pointer.swipeStart().swipe(0.5).swipeEnd(1);
        clock.tick(200);
        pointer.swipeStart().swipe(-0.5);
        assert.ok($item.hasClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS), "positioning is turned on");
        pointer.swipeEnd(-1);
        clock.tick(300);

        var $deleteButtonContainer = $item.find(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS));
        assert.ok($deleteButtonContainer.length, "delete button present");
    } finally {
        fx.off = origFxOff;
        clock.restore();
    }
});

QUnit.test("optimizations", function(assert) {
    var origOuterWidth = renderer.fn.outerWidth,
        outerWidthCallCount = 0;

    try {
        var $list = $($("#templated-list").dxList({
            items: ["0"],
            allowItemDeleting: true,
            itemDeleteMode: "slideItem"
        }));

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item = $items.eq(0),
            pointer = pointerMock($item);

        renderer.fn.outerWidth = function() {
            outerWidthCallCount++;
            return origOuterWidth.apply(this, arguments);
        };

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    } finally {
        assert.equal(outerWidthCallCount, 2, "outerWidth should be calculated only once for item and button");
        renderer.fn.outerWidth = origOuterWidth;
    }
});


QUnit.module("slide menu decorator", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("list item markup", function(assert) {
    var $list = $("#templated-list").dxList({
        items: ["0"],
        menuMode: "slide",
        menuItems: [{ text: "menu" }, { text: "menu" }]
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    assert.equal(deleteButtonContent().length, 1, "menu button was generated");
    assert.ok(deleteButtonContent().hasClass(SLIDE_MENU_BUTTON_MENU_CLASS), "menu button has correct class");
    assert.equal(deleteButtonContent().text(), "More", "menu button text is correct");
});

QUnit.test("list item markup with one button", function(assert) {
    var $list = $("#templated-list").dxList({
        items: ["0"],
        menuMode: "slide",
        menuItems: [{ text: "menu" }]
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    assert.equal(deleteButtonContent().length, 1, "menu button was generated");
    assert.ok(deleteButtonContent().hasClass(SLIDE_MENU_BUTTON_MENU_CLASS), "menu button has correct class");
    assert.equal(deleteButtonContent().text(), "menu", "menu button text is correct");
});

QUnit.test("click on menu item should open menu", function(assert) {
    var $list = $("#templated-list").dxList({
        items: ["0"],
        menuMode: "slide",
        menuItems: [{ text: "menu" }, { text: "menu" }]
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger("dxclick");

    var $menu = $list.find(toSelector(SLIDE_MENU_CLASS)),
        menu = $menu.dxActionSheet("instance"),
        $menuItems = $(menu.itemElements());

    assert.equal($menuItems.length, 2, "menu items was rendered");
    assert.equal(menu.option("visible"), true, "menu is shown");
    assert.equal($menuItems.text(), "menumenu", "menu text is correct");
});

QUnit.test("click on menu toggle should not turn off ready to delete", function(assert) {
    var $list = $("#templated-list").dxList({
        items: ["0"],
        menuMode: "slide",
        menuItems: [{ text: "menu" }, { text: "menu" }]
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger("dxclick");

    assert.equal(deleteButtonContent().length, 1, "ready to delete mode is enabled");
});

QUnit.test("menu item action should be fired after item click", function(assert) {
    assert.expect(2);

    var $list = $("#templated-list").dxList({
        items: ["0"],
        menuMode: "slide",
        menuItems: [
            {
                text: "menu",
                action: function(e) {
                    assert.equal($(e.itemElement).get(0), $item.get(0));
                }
            },
            {
                text: "menu"
            }
        ]
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger("dxclick");

    var $menu = $list.find(toSelector(SLIDE_MENU_CLASS)),
        menu = $menu.dxActionSheet("instance"),
        $menuItems = $(menu.itemElements());

    $menuItems.eq(0).trigger("dxclick");
    assert.equal(deleteButtonContent().length, 0, "ready to delete mode is disabled");
});

QUnit.test("menu item action should be fired after item click", function(assert) {
    assert.expect(3);

    var $list = $("#templated-list").dxList({
        items: ["0"],
        menuMode: "slide",
        menuItems: [
            {
                text: "menu",
                action: function(e) {
                    assert.equal(isRenderer(e.itemElement), !!config().useJQuery, "itemElement is correct");
                    assert.equal($(e.itemElement).get(0), $item.get(0));
                }
            }
        ]
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = pointerMock($item);

    var deleteButtonContent = function() {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger("dxclick");
    assert.equal(deleteButtonContent().length, 0, "ready to delete mode is disabled");
});

QUnit.test("click on menu toggle should cause item click event", function(assert) {
    var origFxOff = fx.off;

    try {
        var clickFiredCount = 0;

        var $list = $("#templated-list").dxList({
            items: ["0"],
            menuMode: "slide",
            menuItems: [
                {
                    text: "menu",
                    action: function() {}
                }
            ],
            onItemClick: function() {
                clickFiredCount++;
            }
        });

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item = $items.eq(0),
            pointer = pointerMock($item);

        var deleteButtonContent = function() {
            return $item
                .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
        };

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
        fx.off = false;
        deleteButtonContent().trigger("dxclick");
        assert.equal(clickFiredCount, 0, "click on item not fired");
    } finally {
        fx.off = origFxOff;
    }
});

QUnit.test("click on menu toggle should cause item click event if at least 2 menu items present", function(assert) {
    var origFxOff = fx.off;

    try {
        var clickFiredCount = 0;

        var $list = $("#templated-list").dxList({
            items: ["0"],
            menuMode: "slide",
            menuItems: [
                {
                    text: "menu"
                },
                {
                    text: "menu"
                }
            ],
            onItemClick: function() {
                clickFiredCount++;
            }
        });

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item = $items.eq(0),
            pointer = pointerMock($item);

        var deleteButtonContent = function() {
            return $item
                .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
        };

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
        fx.off = false;
        deleteButtonContent().trigger("dxclick");
        assert.equal(clickFiredCount, 0, "click on item not fired");
    } finally {
        fx.off = origFxOff;
    }
});


QUnit.module("swipe delete decorator", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("delete item by swipe gesture", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            itemDeleteMode: "swipe"
        })),
        list = $list.dxList("instance"),
        $item = $(list.itemElements()).eq(0),
        pointer = pointerMock($item);

    list.deleteItem = function($itemElement) {
        assert.equal($itemElement.get(0), $item.get(0), "item is deleted");
        return $.Deferred().resolve().promise();
    };

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
});

QUnit.test("item should be at normal position if confirmation not passed", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            itemDeleteMode: "swipe"
        })),
        list = $list.dxList("instance"),
        $item = $(list.itemElements()).eq(0),
        pointer = pointerMock($item);

    list.deleteItem = function($itemElement) {
        return $.Deferred().reject();
    };

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);

    assert.equal(position($item), 0, "position returned");
});

QUnit.test("swipe should not delete item if widget is disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            disabled: true,
            allowItemDeleting: true,
            itemDeleteMode: "swipe"
        })),
        list = $list.dxList("instance"),
        $item = $(list.itemElements()).eq(0);

    var startEvent = pointerMock($item).start().swipeStart().lastEvent();
    assert.ok(startEvent.cancel, "swipe canceled");
});

var CONTEXTMENU_CLASS = "dx-list-context-menu",
    CONTEXTMENU_MENUCONTENT_CLASS = "dx-list-context-menucontent",
    CONTEXTMENU_MENUITEM = LIST_ITEM_CLASS;

QUnit.module("context delete decorator", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("overlay content markup", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            itemDeleteMode: "context"
        })),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $deleteMenuItem = $(menu.content()).find(toSelector(CONTEXTMENU_MENUITEM));

    assert.ok($deleteMenuItem.length, "delete menu item generated");
    assert.equal($deleteMenuItem.text(), "Delete", "delete menu item text set");
});

QUnit.test("item should be deleted from menu", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            editEnabled: true,
            allowItemDeleting: true,
            itemDeleteMode: "context"
        })),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $deleteMenuItem = $(menu.content()).find(toSelector(CONTEXTMENU_MENUITEM));

    list.deleteItem = function($itemElement) {
        assert.ok(true, "item is deleted");
        return $.Deferred().resolve().promise();
    };

    $deleteMenuItem.trigger("dxclick");
});

QUnit.module("context menu decorator", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("menu content markup", function(assert) {
    var $list = $("#templated-list").dxList({
            items: [0, 1, 2],
            menuMode: "context",
            menuItems: [{ text: "menu" }]
        }),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $menuContent = $(menu.content()),
        $contextMenuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    assert.ok($menuContent.hasClass(CONTEXTMENU_MENUCONTENT_CLASS), "menu content class set");
    assert.equal($contextMenuItem.length, 1, "context menu item generated");
    assert.equal($contextMenuItem.text(), "menu", "context menu item text set");
});

QUnit.test("delete button should be rendered in menu if delete enabled", function(assert) {
    var $list = $("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            menuMode: "context",
            menuItems: [{ text: "menu" }]
        }),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $menuContent = $(menu.content()),
        $contextMenuItems = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    assert.equal($contextMenuItems.length, 2, "context menu item and delete item menu generated");
    assert.equal($contextMenuItems.eq(1).text(), "Delete", "delete item text set");
});

QUnit.test("item hold should open overlay", function(assert) {
    assert.expect(1);

    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            itemDeleteMode: "context"
        })),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance");

    $item.trigger(contextMenuEvent.name);
    assert.ok(menu.option("visible"), "overlay shown");
});

QUnit.test("item hold should not open overlay if editing disabled", function(assert) {
    assert.expect(1);

    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            itemDeleteMode: "context"
        })),
        list = $list.dxList("instance");

    list.option("allowItemDeleting", false);

    var $menu = list.$element().find(toSelector(CONTEXTMENU_CLASS));
    assert.ok(!$menu.length, "overlay won't created");
});

QUnit.test("item hold should not open overlay if widget is disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: [0, 1, 2],
            disabled: true,
            allowItemDeleting: true,
            itemDeleteMode: "context"
        })),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $menu = list.$element().find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance");

    $item.trigger(contextMenuEvent.name);
    assert.ok(!menu.option("visible"), "overlay shown");
});

QUnit.test("menu item click action should be fired with correct arguments", function(assert) {
    var $list = $("#templated-list").dxList({
            items: [0, 1, 2],
            menuMode: "context",
            menuItems: [
                {
                    text: "menu",
                    action: function(e) {
                        assert.equal($(e.itemElement).get(0), $item.get(0), "itemElement is correct");
                    }
                }
            ]
        }),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $menuContent = $(menu.content()),
        $menuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    $item.trigger(contextMenuEvent.name);
    $menuItem.trigger("dxclick");
});

QUnit.test("delete menu item click should remove item and hide overlay", function(assert) {
    assert.expect(3);

    var $list = $("#templated-list").dxList({
            items: [0, 1, 2],
            allowItemDeleting: true,
            itemDeleteMode: "context",
            onItemHold: function() {
                assert.ok(false, "item hold action fired");
            }
        }),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    list.deleteItem = function(itemElement) {
        assert.ok(true, "delete action executed");
        assert.ok($(itemElement).hasClass(LIST_ITEM_CLASS));
    };

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $menu = list.$element().find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $menuContent = $(menu.content()),
        $deleteMenuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    $item.trigger(contextMenuEvent.name);
    $deleteMenuItem.trigger("dxclick");
    assert.ok(!menu.option("visible"), "overlay shown");
});

QUnit.test("menu should be closed after click", function(assert) {
    var $list = $("#templated-list").dxList({
            items: [0, 1, 2],
            menuMode: "context",
            menuItems: [{ text: "menu" }]
        }),
        list = $list.dxList("instance");

    $(list.itemElements()).eq(0).trigger("dxcontextmenu");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $menu = $list.find(toSelector(CONTEXTMENU_CLASS)),
        menu = $menu.dxOverlay("instance"),
        $menuContent = $(menu.content()),
        $menuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    $item.trigger(contextMenuEvent.name);
    $menuItem.trigger("dxclick");

    assert.ok(!menu.option("visible"), "menu hidden");
});

QUnit.test("onItemHold should not be fired if context menu was opened by hold", function(assert) {
    assert.expect(0);

    var $list = $("#templated-list").dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: "context",
        onItemHold: function() {
            assert.ok(false);
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger({
        type: holdEvent.name,
        pointerType: "touch"
    });
});

QUnit.test("onItemHold should not be fired if context menu was not opened by hold", function(assert) {
    var $list = $("#templated-list").dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: "context",
        onItemHold: function() {
            assert.ok(true);
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger({
        type: holdEvent.name,
        pointerType: "mouse"
    });
});

QUnit.test("rtlEnabled option should be passed to overlay", function(assert) {
    assert.expect(1);

    var $list = $($("#list").dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: "context",
        rtlEnabled: true
    }));

    var menu = $list.find(toSelector(CONTEXTMENU_CLASS)).dxOverlay("instance");

    assert.ok(menu.option("rtlEnabled"), "rtl option is true");
});


QUnit.module("item select decorator");

var SELECT_DECORATOR_ENABLED_CLASS = "dx-list-select-decorator-enabled",

    SELECT_CHECKBOX_CLASS = "dx-list-select-checkbox";

QUnit.test("selection control has focusStateEnabled = false and hoverStateEnabled = false", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        showSelectionControls: true,
        selectionMode: "multiple"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $checkboxContainer = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)),
        checkbox = $checkboxContainer.children(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox("instance");

    assert.ok(!checkbox.option("focusStateEnabled"), "focused state is turned off for the control");
    assert.ok(!checkbox.option("hoverStateEnabled"), "hover state is turned off for the control");
});

QUnit.test("checkbox click should trigger select callback only once with correct itemData", function(assert) {
    assert.expect(1);

    var item = "0";

    var $list = $($("#templated-list").dxList({
            items: [item],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $list.dxList("instance");

    list.selectItem = function() {
        assert.ok(true, "item selected");
    };

    var $checkbox = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0).find(toSelector(SELECT_CHECKBOX_CLASS));

    $checkbox.trigger("dxclick");
});

QUnit.test("checkbox click should trigger unselect callback only once with correct itemData", function(assert) {
    assert.expect(1);

    var item = "0";

    var $list = $($("#templated-list").dxList({
            items: [item],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $list.dxList("instance");

    list.unselectItem = function() {
        assert.ok(true, "item unselected");
    };

    var $checkbox = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0).find(toSelector(SELECT_CHECKBOX_CLASS));

    $checkbox.trigger("dxclick");
    $checkbox.trigger("dxclick");
});

QUnit.test("rendering if selecting is disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        showSelectionControls: true,
        selectionMode: "none"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    var $checkbox = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_CHECKBOX_CLASS));

    assert.strictEqual($checkbox.hasClass("dx-checkbox"), false, "select not generated");
});

QUnit.test("checkbox should be refreshed with correct state", function(assert) {
    assert.expect(1);

    var $list = $($("#templated-list").dxList({
            items: ["0"],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $list.dxList("instance");

    var checkbox = function() {
        return $list.find(toSelector(LIST_ITEM_CLASS)).eq(0).find(toSelector(SELECT_CHECKBOX_CLASS));
    };

    checkbox().trigger("dxclick");
    list._refresh();

    assert.equal(checkbox().dxCheckBox("instance").option("value"), true, "checkbox regenerated successfully");
});

QUnit.test("checkbox should be refreshed when selectItem is called on it", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0"],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $list.dxList("instance");

    var item = function() {
        return $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    };
    var checkbox = function() {
        return item().find(toSelector(SELECT_CHECKBOX_CLASS));
    };

    list.selectItem(item());

    assert.equal(checkbox().dxCheckBox("instance").option("value"), true, "checkbox regenerated successfully");
});

QUnit.test("checkbox should be refreshed when unselectItem is called on it", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0"],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $list.dxList("instance");

    var item = function() {
        return $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    };
    var checkbox = function() {
        return item().find(toSelector(SELECT_CHECKBOX_CLASS));
    };

    checkbox().trigger("dxclick");
    list.unselectItem(item());

    assert.equal(checkbox().dxCheckBox("instance").option("value"), false, "checkbox regenerated successfully");
});

QUnit.test("selection enabled class should be added when needed", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0"],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $list.dxList("instance");

    assert.ok($list.hasClass(SELECT_DECORATOR_ENABLED_CLASS), "class added");
    list.option("showSelectionControls", false);
    assert.ok(!$list.hasClass(SELECT_DECORATOR_ENABLED_CLASS), "class removed");
});

QUnit.test("item click changes checkbox state", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        showSelectionControls: true,
        selectionMode: "multiple"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxclick");

    var checkbox = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox("instance");

    assert.equal(checkbox.option("value"), true, "state changed");
});

QUnit.test("item click should trigger select/unselect callback only once", function(assert) {
    var item = "0",
        selectActionFlag = 0,
        unselectActionFlag = 0;

    var $list = $("#templated-list").dxList({
        items: [item],
        showSelectionControls: true,
        selectionMode: "multiple",
        onSelectionChanged: function(args) {
            if(args.addedItems.length) {
                selectActionFlag++;
            }
            if(args.removedItems.length) {
                unselectActionFlag++;
            }
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxclick");
    $item.trigger("dxclick");

    assert.equal(selectActionFlag, 1, "selection triggered");
    assert.equal(unselectActionFlag, 1, "unselected triggered");
});

QUnit.test("click on checkbox should trigger events only once", function(assert) {
    var item = "0",
        selectActionFlag = 0,
        unselectActionFlag = 0;

    var $list = $("#templated-list").dxList({
        items: [item],
        showSelectionControls: true,
        selectionMode: "multiple",
        onSelectionChanged: function(args) {
            if(args.addedItems.length) {
                selectActionFlag++;
            }
            if(args.addedItems.length) {
                unselectActionFlag++;
            }
        }
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $checkbox = $item.find(toSelector(SELECT_CHECKBOX_CLASS));

    $checkbox.trigger("dxclick");
    $checkbox.trigger("dxclick");

    assert.equal(selectActionFlag, 1, "selected triggered");
    assert.equal(unselectActionFlag, 1, "unselected triggered");
});

QUnit.test("click on item should not change selected state if widget is disabled", function(assert) {
    var $list = $($("#templated-list").dxList({
            disabled: true,
            items: ["0"],
            showSelectionControls: true,
            selectionMode: "multiple"
        })),
        list = $("#templated-list").dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxclick");

    assert.equal(list.option("selectedItems").length, 0, "item is not selected");
});

QUnit.test("click on delete toggle should not change selected state", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemDeleting: true,
        itemDeleteMode: "toggle",
        showSelectionControls: true,
        selectionMode: "multiple"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        checkbox = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox("instance");

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger("dxpointerup");
    assert.equal(checkbox.option("value"), false, "click action is not pass to item");

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger("dxpointerup");
    assert.equal(checkbox.option("value"), false, "click action is not pass to item");
});

QUnit.test("click on item ready to delete with toggle mode should not change selected state", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1"],
        allowItemDeleting: true,
        itemDeleteMode: "toggle",
        showSelectionControls: true,
        selectionMode: "multiple"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $item1 = $items.eq(1),
        checkbox = $item.find(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox("instance");

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger("dxpointerup");
    $item.find($item).trigger("dxclick");
    assert.equal(checkbox.option("value"), false, "click action is not pass to item");

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger("dxpointerup");
    $item.find($item1).trigger("dxclick");
    assert.equal(checkbox.option("value"), false, "click action is not pass to item");
});

QUnit.test("click on item ready to delete with slideButton mode should not change selected state", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1"],
        allowItemDeleting: true,
        itemDeleteMode: "slideButton",
        showSelectionControls: true,
        selectionMode: "multiple"
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        $item1 = $items.eq(1),
        checkbox = $item.find(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox("instance"),
        pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    $item.find($item).trigger("click");
    assert.equal(checkbox.option("value"), false, "click action is not pass to item");

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    $item.find($item1).trigger("dxclick");
    assert.equal(checkbox.option("value"), false, "click action is not pass to item");
});

QUnit.test("item click event should be fired if selectionControls is enabled", function(assert) {
    var itemClickHandler = sinon.spy(),
        $list = $("#templated-list").dxList({
            items: ["0"],
            showSelectionControls: true,
            selectionMode: "all",
            onItemClick: itemClickHandler
        });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxclick");

    assert.equal(itemClickHandler.callCount, 1, "handler was called once");
});

QUnit.test("grouped list with dataSource and store key specified should select items correctly", function(assert) {
    var $list = $("#templated-list").dxList({
        dataSource: new DataSource({
            store: new ArrayStore({
                data: [
                    { id: 0, text: "Item 1", cId: 1 },
                    { id: 1, text: "Item 2", cId: 1 },
                    { id: 2, text: "Item 3", cId: 2 },
                    { id: 3, text: "Item 4", cId: 2 }
                ],
                key: "id"
            }),
            group: "cId"
        }),
        selectionMode: 'multiple',
        grouped: true,
        showSelectionControls: true
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxclick");

    assert.ok($item.hasClass("dx-list-item-selected"), "item is selected");
});


QUnit.module("selectAll for all pages");

QUnit.test("next loaded page should be selected when selectAll is enabled", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        pageLoadMode: "nextButton",
        selectAllMode: "allPages"
    }));

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox"),
        $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    $selectAll.trigger("dxclick");
    $moreButton.trigger("dxclick");

    assert.equal($selectAll.dxCheckBox("option", "value"), true, "selectAll checkbox is in selected state");
    assert.equal($list.dxList("option", "selectedItems").length, 6, "all items are selected");
    assert.equal($list.find(".dx-list-item-selected").length, 4, "all items has selected class");
});

QUnit.test("selectAll should have active state", function(assert) {
    var clock = sinon.useFakeTimers(),
        $list = $("#list").dxList({
            dataSource: new DataSource({
                store: [1, 2, 3, 4, 5, 6],
            }),
            showSelectionControls: true,
            selectionMode: "all",
            selectAllMode: "allPages"
        });

    var $selectAll = $list.find(".dx-list-select-all");

    var pointer = pointerMock($selectAll);
    pointer.start("touch").down();
    clock.tick(100);
    assert.ok($selectAll.hasClass("dx-state-active"), "selectAll has active state");
    clock.restore();
});

QUnit.test("selectAll should not select items if they are not in current filter", function(assert) {
    var ds = new DataSource({
        store: [
            { id: 0, text: "Item 1" },
            { id: 1, text: "Item 2" },
            { id: 2, text: "Item 3" }
        ],
        key: "id",
        selectAllMode: "allPages",
        filter: ["id", 1]
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        selectAllMode: "allPages"
    }));

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox");
    $selectAll.trigger("dxclick");

    assert.equal($selectAll.dxCheckBox("option", "value"), true, "selectAll sheckbox is in selected state");
    assert.equal($list.dxList("option", "selectedItems").length, 1, "just filtered items should be selected");
    assert.equal($list.find(".dx-list-item-selected").length, 1, "selected items should have selected class");
});

QUnit.test("selectAll checkbox should change it's state to undefined when one item was deselected", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        pageLoadMode: "nextButton",
        selectAllMode: "allPages"
    }));

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox"),
        $checkBox = $list.find(".dx-checkbox").eq(1),
        $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    $selectAll.trigger("dxclick");
    $moreButton.trigger("dxclick");
    $checkBox.trigger("dxclick");

    assert.strictEqual($selectAll.dxCheckBox("option", "value"), undefined, "selectAll checkbox is in undefined state");
    assert.equal($list.dxList("option", "selectedItems").length, 5, "all of selected items are in the option");
    assert.equal($list.find(".dx-list-item-selected").length, 3, "all selected items has selected class");
});

QUnit.test("selectAll should change state after page loading when all items was selected in the previous page", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        pageLoadMode: "nextButton",
        selectAllMode: "allPages"
    }));

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox"),
        $checkBox = $list.find(".dx-checkbox:gt(0)"),
        $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    $checkBox.trigger("dxclick");
    assert.strictEqual($selectAll.dxCheckBox("option", "value"), undefined, "selectAll checkbox is in undefined state");

    $moreButton.trigger("dxclick");

    assert.strictEqual($selectAll.dxCheckBox("option", "value"), undefined, "selectAll checkbox is in undefined state");
    assert.equal($list.dxList("option", "selectedItems").length, 2, "all of selected items are in the option");
    assert.equal($list.find(".dx-list-item-selected").length, 2, "all selected items has selected class");
});

QUnit.test("selectAll should change state after page loading if selectAllMode was changed", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        pageLoadMode: "nextButton",
        selectAllMode: "page"
    }));

    $list.dxList("option", "selectAllMode", "allPages");

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox"),
        $checkBox = $list.find(".dx-checkbox").eq(1),
        $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    $selectAll.trigger("dxclick");
    $moreButton.trigger("dxclick");
    $checkBox.trigger("dxclick");

    assert.strictEqual($selectAll.dxCheckBox("option", "value"), undefined, "selectAll checkbox is in undefined state");
    assert.equal($list.dxList("option", "selectedItems").length, 5, "all of selected items are in the option");
    assert.equal($list.find(".dx-list-item-selected").length, 3, "all selected items has selected class");
});

QUnit.test("items should starts from first page after selectAllMode was changed", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        selectionMode: "all",
        pageLoadMode: "nextButton",
        selectAllMode: "page"
    }));

    var $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    $moreButton.trigger("dxclick");

    $list.dxList("option", "selectAllMode", "allPages");

    assert.deepEqual($list.dxList("option", "items"), [1, 2], "items starts from the first page");
});

QUnit.test("more button is shown if selectAllMode was changed after load allpage", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 4,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        pageLoadMode: "nextButton",
        selectAllMode: "page"
    }));

    var $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);
    $moreButton.trigger("dxclick");

    $list.dxList("option", "selectAllMode", "allPages");

    $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    assert.ok($moreButton.length, "morebutton is shown");
});

QUnit.test("selectAll and unselectAll should log warning if selectAllMode is allPages and data is grouped", function(assert) {
    var ds = new DataSource({
        store: [{ key: "1", items: ["1_1", "1_2"] }, { key: "2", items: ["2_1", "2_2"] }],
        pageSize: 2,
        paginate: true
    });

    var $list = $("#list").dxList({
        dataSource: ds,
        grouped: true,
        showSelectionControls: true,
        selectionMode: "all",
        selectAllMode: "allPages"
    });

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox");

    sinon.spy(errors, "log");

    // act
    $selectAll.trigger("dxclick");

    // assert
    assert.equal(errors.log.callCount, 1);
    assert.equal(errors.log.lastCall.args[0], "W1010", "Warning about selectAllMode allPages and grouped data");
    assert.equal($selectAll.dxCheckBox("option", "value"), true, "selectAll checkbox is in selected state");
    assert.equal($list.dxList("option", "selectedItems").length, 0, "items are not selected");


    // act
    $selectAll.trigger("dxclick");

    // assert
    assert.equal(errors.log.callCount, 2);
    assert.equal(errors.log.lastCall.args[0], "W1010", "Warning about selectAllMode allPages and grouped data");
    assert.equal($selectAll.dxCheckBox("option", "value"), false, "selectAll checkbox is in selected state");
    assert.equal($list.dxList("option", "selectedItems").length, 0, "items are not selected");

    errors.log.restore();
});

QUnit.module("item select decorator with all selection mode");

QUnit.test("render selectAll item when showSelectedAll is true", function(assert) {
    var $list = $($("#list").dxList({
        items: [],
        showSelectionControls: true,
        selectionMode: "all",
        selectAllText: "Test"
    }));

    var $multipleContainer = $list.find(".dx-list-select-all");
    assert.ok($multipleContainer.is(":hidden"), "container for SelectAll is hidden");
});

QUnit.test("selectAll updated on init", function(assert) {
    var items = [0, 1];

    var $list = $($("#list").dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    assert.equal($checkbox.dxCheckBox("option", "value"), false, "selectAll updated after init");
});

QUnit.test("selectAll should be removed when editEnabled switched off", function(assert) {
    var $list = $($("#list").dxList({
        items: [0, 1],
        showSelectionControls: false,
        selectionMode: "all"
    }));

    assert.equal($list.find(".dx-list-select-all").length, 0, "selectAll not rendered");

    $list.dxList("option", "showSelectionControls", true);
    assert.equal($list.find(".dx-list-select-all").length, 1, "selectAll rendered");

    $list.dxList("option", "showSelectionControls", false);
    assert.equal($list.find(".dx-list-select-all").length, 0, "selectAll not rendered");
});

QUnit.test("selectAll selects all items", function(assert) {
    var items = [0, 1];

    var $list = $($("#list").dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    $checkbox.trigger("dxclick");

    assert.deepEqual($list.dxList("option", "selectedItems"), items, "all items selected");
});

QUnit.test("selectAll triggers callback when selects all items", function(assert) {
    var items = [0, 1];

    var $list = $("#list").dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: "all",
        onSelectAllValueChanged: function(args) {
            assert.equal(args.value, true, "all items selected");
        }
    });

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    $checkbox.trigger("dxclick");
});

QUnit.test("selectAll unselect all items when all items selected", function(assert) {
    var items = [0, 1];
    var $list = $($("#list").dxList({
        items: items,
        selectedItems: items.slice(),
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    $checkbox.trigger("dxclick");
    assert.equal($list.dxList("option", "selectedItems").length, 0, "all items unselected");
});

QUnit.test("selectAll triggers callback when unselect all items when all items selected", function(assert) {
    var items = [0, 1];
    var $list = $("#list").dxList({
        items: items,
        selectedItems: items.slice(),
        showSelectionControls: true,
        selectionMode: "all",
        onSelectAllValueChanged: function(args) {
            assert.equal(args.value, false, "all items selected");
        }
    });

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    $checkbox.trigger("dxclick");
});

QUnit.test("selectAll selects all items when click on item", function(assert) {
    var items = [0, 1];

    var $list = $($("#list").dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $selectAll = $list.find(".dx-list-select-all");
    $selectAll.trigger("dxclick");

    assert.deepEqual($list.dxList("option", "selectedItems"), items, "all items selected");
});

QUnit.test("selectAll selects all items when click on checkBox and selectionType is item", function(assert) {
    var items = [0, 1];

    var $list = $($("#list").dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    $checkbox.trigger("dxclick");

    assert.deepEqual($list.dxList("option", "selectedItems"), items, "all items selected");
});

QUnit.test("selectAll checkbox is selected when all items selected", function(assert) {
    var $list = $($("#list").dxList({
        items: [0, 1],
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $items = $list.find(".dx-list-item");
    $items.trigger("dxclick");

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    assert.equal($checkbox.dxCheckBox("option", "value"), true, "selectAll checkbox selected");
});

QUnit.test("selectAll checkbox is selected when all items selected (ds w/o totalCount)", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4],
        pageSize: 4,
        paginate: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $items = $list.find(".dx-list-item");
    $items.trigger("dxclick");

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    assert.equal($checkbox.dxCheckBox("option", "value"), true, "selectAll checkbox selected");
});

QUnit.test("selectAll checkbox is selected when all items selected (ds with totalCount)", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4],
        pageSize: 4,
        paginate: true,
        requireTotalCount: true
    });

    var $list = $($("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $items = $list.find(".dx-list-item");
    $items.trigger("dxclick");

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    assert.equal($checkbox.dxCheckBox("option", "value"), true, "selectAll checkbox checked");
});

QUnit.test("", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4],
        pageSize: 2,
        paginate: true
    });

    var $list = $("#list").dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: "all",
        onSelectAllValueChanged: function(args) {
            return false;
        }
    });

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    $checkbox.trigger("dxclick");

    assert.deepEqual($list.dxList("option", "selectedItems"), [], "no items was selected");
});

QUnit.test("selectAll checkbox has indeterminate state when not all items selected", function(assert) {
    var $list = $($("#list").dxList({
        items: [0, 1],
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $items = $list.find(".dx-list-item");
    $items.trigger("dxclick"); // NOTE: select all

    $items.eq(0).trigger("dxclick"); // NOTE: unselect first

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    assert.equal($checkbox.dxCheckBox("option", "value"), undefined, "selectAll checkbox has indeterminate state");
});

QUnit.test("selectAll checkbox is unselected when all items unselected", function(assert) {
    var $list = $($("#list").dxList({
        items: [0, 1],
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $items = $list.find(".dx-list-item");
    $items.trigger("dxclick"); // NOTE: select all

    $items.trigger("dxclick"); // NOTE: unselect all

    var $checkbox = $list.find(".dx-list-select-all .dx-checkbox");
    assert.equal($checkbox.dxCheckBox("option", "value"), false, "selectAll checkbox is unselected");
});

QUnit.test("selectAll checkbox should be updated after load next page", function(assert) {
    var $list = $($("#list").dxList({
        dataSource: new DataSource({
            store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            paginate: true,
            pageSize: 3
        }),
        pageLoadMode: "nextButton",
        showSelectionControls: true,
        selectionMode: "all"
    }));

    var $selectAll = $list.find(".dx-list-select-all .dx-checkbox");
    $selectAll.trigger("dxclick");

    assert.equal($selectAll.dxCheckBox("option", "value"), true, "selectAll checkbox is selected");

    var $moreButton = $list.find(".dx-list-next-button > .dx-button").eq(0);

    $moreButton.trigger("dxclick");

    assert.equal($selectAll.dxCheckBox("option", "value"), undefined, "selectAll checkbox is selected");
});

QUnit.test("onContentReady event should be called after update the state Select All checkbox", function(assert) {
    var clock = sinon.useFakeTimers(),
        $list = $("#list").dxList({
            dataSource: {
                load: function() {
                    var d = $.Deferred();

                    setTimeout(function() {
                        d.resolve([0, 1]);
                    }, 100);

                    return d.promise();
                }
            },
            showSelectionControls: true,
            selectionMode: "all",
            onContentReady: function(e) {
                $(e.element).find(".dx-list-select-all-checkbox").dxCheckBox("instance").option("value", undefined);
            }
        });

    clock.tick(100);

    assert.ok($list.find(".dx-list-select-all-checkbox").hasClass("dx-checkbox-indeterminate"), "checkbox in an indeterminate state");

    clock.restore();
});


QUnit.module("item select decorator with single selection mode");

var SELECT_RADIO_BUTTON_CLASS = "dx-list-select-radiobutton";

QUnit.test("item click changes radio button state only to true in single selection mode", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        showSelectionControls: true,
        selectionMode: 'single'
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0);

    $item.trigger("dxclick");
    $item.trigger("dxclick");

    var radioButton = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_RADIO_BUTTON_CLASS)).dxRadioButton("instance");

    assert.equal(radioButton.option("value"), true, "item selected");
});

QUnit.test("keyboard navigation should work with without selectAll checkbox", function(assert) {
    var $list = $($("#templated-list").dxList({
            focusStateEnabled: true,
            items: ["0", "1"],
            showSelectionControls: true,
            selectionMode: 'single'
        })),
        instance = $list.dxList("instance"),
        keyboard = keyboardMock($list);

    keyboard
        .press("down")
        .press("enter");

    assert.deepEqual(instance.option("selectedItems"), ["1"], "selection is correct");
});


QUnit.module("reordering decorator", {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

var REORDER_HANDLE_CLASS = "dx-list-reorder-handle",

    REOREDERING_ITEM_CLASS = "dx-list-item-reordering",
    REOREDERING_ITEM_GHOST_CLASS = "dx-list-item-ghost-reordering";

var reorderingPointerMock = function($item, clock, usePixel) {
    var itemOffset = $item.offset().top,
        itemHeight = $item.outerHeight(),
        scale = usePixel ? 1 : itemHeight,

        $handle = $item.find(toSelector(REORDER_HANDLE_CLASS)),
        pointer = pointerMock($handle);

    return {
        dragStart: function(offset) {
            offset = offset || 0;

            pointer.start().down(0, itemOffset + scale * offset);

            if(clock) {
                clock.tick(30);
            }

            return this;
        },
        drag: function(offset) {
            offset = offset || 0;

            pointer.move(0, scale * offset);

            return this;
        },
        dragEnd: function() {
            pointer.up();

            return this;
        }
    };
};

var topTranslation = function($item) {
    return translator.locate($item).top;
};

QUnit.test("reordering class should be present on item during drag", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);
    this.clock.tick();
    assert.ok($item.hasClass(REOREDERING_ITEM_CLASS), "class was added");
    pointer.dragEnd();
    assert.ok(!$item.hasClass(REOREDERING_ITEM_CLASS), "class was removed");
});

QUnit.test("reordering should not be possible if item disabled", function(assert) {
    var $list = $("#templated-list").dxList({
        items: [{ text: "0", disabled: true }],
        allowItemReordering: true
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);
    assert.ok(!$item.hasClass(REOREDERING_ITEM_CLASS), "class was not added");
});

QUnit.test("list item should be duplicated on drag start", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);

    this.clock.tick();
    var $ghostItem = $list.find(toSelector(REOREDERING_ITEM_GHOST_CLASS));
    assert.equal($ghostItem.text(), $item.text(), "correct item was duplicated");
    assert.equal($ghostItem.position().top, $item.position().top + 10, "correct ghost position");
    assert.ok(!$ghostItem.hasClass(REOREDERING_ITEM_CLASS), "reordering class is not present");

    pointer.dragEnd();
    $ghostItem = $list.find(toSelector(REOREDERING_ITEM_GHOST_CLASS));
    assert.equal($items.length, 1, "duplicate item was removed");
});

QUnit.test("cached items doesn't contains a ghost item after reordering", function(assert) {
    var $list = $("#list").dxList({
            items: ["0", "1", "2"],
            allowItemReordering: true
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        pointer = reorderingPointerMock($items.first(), this.clock);

    pointer.dragStart(0.5).drag(0.6);
    this.clock.tick();
    pointer.dragEnd();

    var cachedItems = list._itemElements();

    assert.equal(cachedItems.length, 3, "Cached items contains 3 items");
    assert.notOk(cachedItems.hasClass(REOREDERING_ITEM_GHOST_CLASS), "Cached items isn't contain a ghost item");
});

QUnit.test("ghost item should be moved by drag", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);

    assert.equal($list.find(toSelector(REOREDERING_ITEM_GHOST_CLASS)).length, 0, "ghost item should be rendered async");

    this.clock.tick();
    var $ghostItem = $list.find(toSelector(REOREDERING_ITEM_GHOST_CLASS)),
        startPosition = topTranslation($ghostItem);

    pointer.drag(20);
    assert.equal(topTranslation($ghostItem), startPosition + 20, "ghost item was moved");

    pointer.dragEnd();
});

QUnit.test("item position should be reset after drag", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(0, 10);
    assert.equal(topTranslation($item), 0, "position reset");
});

QUnit.test("next item should be moved", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item0 = $items.eq(0),
        $item1 = $items.eq(1),
        $item2 = $items.eq(2),
        pointer = reorderingPointerMock($item1, this.clock);

    var item0Position = $item0.position(),
        item1Position = $item1.position(),
        item2Position = $item2.position();

    pointer.dragStart(0.5).drag(0.4);
    assert.deepEqual($item0.position(), item0Position, "first item was not moved");
    assert.deepEqual($item2.position(), item2Position, "third item was not moved");

    pointer.drag(0.2);
    assert.deepEqual($item0.position(), item0Position, "first item was not moved");
    assert.deepEqual($item2.position(), item1Position, "third item was moved to position of second item");
});

QUnit.test("prev item should be moved", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item0 = $items.eq(0),
        $item1 = $items.eq(1),
        $item2 = $items.eq(2),
        pointer = reorderingPointerMock($item1, this.clock);

    var item0Position = $item0.position(),
        item1Position = $item1.position(),
        item2Position = $item2.position();

    pointer.dragStart(0.5).drag(-0.4);
    assert.deepEqual($item0.position(), item0Position, "first item was not moved");
    assert.deepEqual($item2.position(), item2Position, "third item was not moved");

    pointer.drag(-0.2);
    assert.deepEqual($item0.position(), item1Position, "first item was moved to position of second item");
    assert.deepEqual($item2.position(), item2Position, "third item was not moved");
});

QUnit.test("next item should be moved back if item moved to start position", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item0 = $items.eq(0),
        $item1 = $items.eq(1),
        $item2 = $items.eq(2),
        pointer = reorderingPointerMock($item1, this.clock);

    var item0Position = $item0.position(),
        item2Position = $item2.position();

    pointer.dragStart(0.5).drag(0.6).drag(-0.2);
    assert.deepEqual($item0.position(), item0Position, "first item was not moved");
    assert.deepEqual($item2.position(), item2Position, "third item was moved to position of first item");
});

QUnit.test("prev item should be moved back if item moved to start position", function(assert) {
    var $list = $($("#templated-list").dxList({
        items: ["0", "1", "2"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item0 = $items.eq(0),
        $item1 = $items.eq(1),
        $item2 = $items.eq(2),
        pointer = reorderingPointerMock($item1, this.clock);

    var item0Position = $item0.position(),
        item2Position = $item2.position();

    pointer.dragStart(0.5).drag(-0.6).drag(0.2);
    assert.deepEqual($item0.position(), item0Position, "first item was not moved");
    assert.deepEqual($item2.position(), item2Position, "third item was moved to position of first item");
});

QUnit.test("item should be moved with animation", function(assert) {
    var origFX = fx.animate;
    var animated = false;
    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2"],
            allowItemReordering: true
        }));

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item1 = $items.eq(1),
            pointer = reorderingPointerMock($item1, this.clock);

        pointer.dragStart(0.5).drag(0.6);
        assert.equal(animated, true, "animation present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("item should be dropped with animation", function(assert) {
    var origFX = fx.animate;
    var animated = false;
    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2"],
            allowItemReordering: true
        }));

        var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
            $item1 = $items.eq(1),
            pointer = reorderingPointerMock($item1, this.clock);

        pointer.dragStart(0.5).drag(0.6);
        animated = false;
        pointer.dragEnd();
        assert.equal(animated, true, "animation present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("drop item should reorder list items with correct indexes", function(assert) {
    var $list = $($("#list").dxList({
            items: ["0", "1", "2"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    list.reorderItem = function(itemElement, toItemElement) {
        assert.deepEqual($ghostItem.position(), toItemElement.position(), "animated to target");

        assert.equal(itemElement.text(), $item1.text());
        assert.equal(toItemElement.text(), $item2.text());
    };

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item1 = $items.eq(1),
        $item2 = $items.eq(2),
        pointer = reorderingPointerMock($item1, this.clock);

    pointer.dragStart(0.5).drag(0.6);
    this.clock.tick();
    var $ghostItem = $list.find(toSelector(REOREDERING_ITEM_GHOST_CLASS));
    pointer.dragEnd();
});

QUnit.test("items should reset positions after dragend", function(assert) {
    var $list = $($("#list").dxList({
        items: ["0", "1", "2"],
        allowItemReordering: true
    }));

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item1 = $items.eq(1),
        pointer = reorderingPointerMock($item1, this.clock);

    pointer.dragStart(0.5).drag(0.6).dragEnd();

    $.each($items, function(index, item) {
        var $item = $(item);

        assert.deepEqual(topTranslation($item), 0, "position reset");
    });
});

var REQEST_ANIMATION_FRAME_TIMEOUT = 10;

QUnit.module("reordering decorator", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.originalRAF = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            return window.setTimeout(callback, REQEST_ANIMATION_FRAME_TIMEOUT);
        };

        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this.originalRAF;

        fx.off = false;
    }
});

var mockScrollViewForReordering = function(list) {
    var $items = list.$element().find(toSelector(LIST_ITEM_CLASS)),
        itemHeight = $items.eq(0).outerHeight(),
        listHeight = itemHeight * $items.length,

        scrollTop = 0,
        clientHeight = listHeight,
        scrollHeight = listHeight;

    var optionMethod = list.option;
    list.option = function(name, value) {
        if(name === "height") {
            clientHeight = value;
        } else {
            return optionMethod.apply(this, arguments);
        }
    };

    list.$element().dxScrollView("option", "pushBackValue", 0);

    list.scrollTo = function(y) {
        scrollTop = y;
    };
    list.scrollBy = function(dy) {
        scrollTop += dy;
    };
    list.scrollTop = function() {
        return scrollTop;
    };
    list.clientHeight = function(dy) {
        return clientHeight;
    };
    list.scrollHeight = function() {
        return scrollHeight;
    };
};

QUnit.test("list should be scrolled if drag near bottom continuously", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5);

    pointer.drag(1.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 30);
    assert.equal(list.scrollTop(), 31, "list was scrolled");
});

QUnit.test("last item should be moved with scrolling", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5);

    pointer.drag(1.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 30);
    assert.equal(topTranslation($items.eq(3)), -itemHeight, "item was moved");
});

QUnit.test("item should be moved without timeout if pointerType is mouse", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),
        pointer = reorderingPointerMock($item);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5);
    pointer.drag(1.81);

    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 30);

    assert.equal(topTranslation($items.eq(3)), -itemHeight, "item was moved");
});

QUnit.test("list should not be scrolled greater then scroll height", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5);

    pointer.drag(1.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 100);
    assert.equal(list.scrollTop(), itemHeight, "list was not scrolled grater than can");
});

QUnit.test("list should be scrolled if drag near top continuously", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(3),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);
    list.scrollTo(itemHeight);

    pointer.dragStart(0.5);

    pointer.drag(-1.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 30);
    assert.equal(list.scrollTop(), itemHeight - 31, "list was scrolled");
});

QUnit.test("list should be scrolled less then scroll height", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(3),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);
    list.scrollTo(itemHeight);

    pointer.dragStart(0.5);

    pointer.drag(-1.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 100);
    assert.equal(list.scrollTop(), 0, "list was not scrolled less than can");
});

QUnit.test("animator should be stopped", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5);

    pointer.drag(1.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 10);
    var scrollTop = list.scrollTop();

    pointer.drag(-0.81);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 10);
    assert.equal(list.scrollTop(), scrollTop, "list was not scrolled after moving");
});

QUnit.test("animator should be stopped on drag end", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5).drag(1.81).dragEnd();

    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT * 10);
    assert.equal(list.scrollTop(), 1, "list was not scrolled after drop");
});

QUnit.test("scroll step should be adjusted if scroll bottom", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(0),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);

    pointer.dragStart(0.5).drag(1.81);
    assert.equal(list.scrollTop(), 1, "list was scrolled");

    pointer.drag(0.6);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT);
    assert.equal(list.scrollTop(), 7, "list was scrolled");
});

QUnit.test("scroll step should be adjusted if scroll top", function(assert) {
    var $list = $($("#templated-list").dxList({
            items: ["0", "1", "2", "3"],
            allowItemReordering: true
        })),
        list = $list.dxList("instance");

    mockScrollViewForReordering(list);

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(3),
        itemHeight = $item.outerHeight(),

        pointer = reorderingPointerMock($item, this.clock);

    list.option("height", itemHeight * 3);
    list.scrollTo(itemHeight);

    pointer.dragStart(0.5).drag(-1.81);
    assert.equal(list.scrollTop(), itemHeight - 1, "list was scrolled");

    pointer.drag(-0.6);
    this.clock.tick(REQEST_ANIMATION_FRAME_TIMEOUT);
    assert.equal(list.scrollTop(), itemHeight - 7, "list was scrolled");
});
