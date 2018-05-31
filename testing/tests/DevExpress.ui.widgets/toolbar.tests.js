"use strict";

require("ui/action_sheet");
require("ui/drop_down_menu");

var $ = require("jquery"),
    Toolbar = require("ui/toolbar"),
    fx = require("animation/fx"),
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    resizeCallbacks = require("core/utils/resize_callbacks"),
    pointerMock = require("../../helpers/pointerMock.js"),
    themes = require("ui/themes");

require("common.css!");
require("ui/button");
require("ui/tabs");

$("#qunit-fixture").html('<style>\
        #toolbarWithMenu .dx-toolbar-menu-container {\
            width: 100px;\
        }\
        .dx-list-item {\
            /* NOTE: to avoid decimal values in geometry */\
            line-height: 1;\
        }\
    </style>\
    \
    <div id="toolbar"></div>\
    <div id="toolbarWithMenu"></div>\
    <div id="widget"></div>\
    <div id="widthRootStyle" style="width: 300px;"></div>');

var TOOLBAR_CLASS = "dx-toolbar",
    TOOLBAR_ITEM_CLASS = "dx-toolbar-item",
    TOOLBAR_BEFORE_CONTAINER_CLASS = "dx-toolbar-before",
    TOOLBAR_AFTER_CONTAINER_CLASS = "dx-toolbar-after",
    TOOLBAR_CENTER_CONTAINER_CLASS = "dx-toolbar-center",
    TOOLBAR_LABEL_CLASS = "dx-toolbar-label",
    TOOLBAR_MENU_BUTTON_CLASS = "dx-toolbar-menu-button",
    TOOLBAR_LIST_VISIBLE_CLASS = "dx-toolbar-list-visible",
    TOOLBAR_ITEMS_CONTAINER_CLASS = "dx-toolbar-items-container",

    DROP_DOWN_MENU_CLASS = "dx-dropdownmenu";

QUnit.module("render", {
    beforeEach: function() {
        this.element = $("#toolbar");
    }
});

QUnit.test("label correctly fits into container", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', text: 'Summary' }
        ]
    });

    var labelElement = this.element.find("." + TOOLBAR_ITEM_CLASS)[0],
        labelMaxWidth = parseInt(labelElement.style.maxWidth);

    labelElement.style.maxWidth = "";

    var labelWidth = labelElement.getBoundingClientRect().width;
    assert.ok(labelWidth <= labelMaxWidth, "Real label width less or equal to the max width");
});

QUnit.test("items - long labels", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', widget: 'button', options: { text: 'Before Button' } },
            { location: 'before', widget: 'button', options: { text: 'Second Before Button' } },
            { location: 'after', widget: 'button', options: { text: 'After Button' } },
            { location: 'center', text: 'Very very very very very very very very very very very long label' }
        ],
        width: "400px"
    });

    var $label = this.element.find("." + TOOLBAR_LABEL_CLASS);

    assert.equal($label.children().eq(0).css("text-overflow"), "ellipsis");
    assert.equal($label.children().eq(0).css("overflow"), "hidden");

    var $centerSection = this.element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS),
        beforeSectionWidth = this.element.find("." + TOOLBAR_BEFORE_CONTAINER_CLASS)[0].getBoundingClientRect().width,
        afterSectionWidth = this.element.find("." + TOOLBAR_AFTER_CONTAINER_CLASS)[0].getBoundingClientRect().width;

    assert.roughEqual(parseFloat($centerSection.css("margin-left")), beforeSectionWidth, 0.1);
    assert.roughEqual(parseFloat($centerSection.css("margin-right")), afterSectionWidth, 0.1);

    var maxLabelWidth = this.element.width() - beforeSectionWidth - afterSectionWidth;

    assert.ok(parseFloat($label.css("max-width")) < maxLabelWidth);

});

QUnit.test("items - long custom html", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', widget: 'button', options: { text: 'Before Button' } },
            { location: 'before', widget: 'button', options: { text: 'Second Before Button' } },
            { location: 'after', widget: 'button', options: { text: 'After Button' } },
            { location: 'center', html: '<b>Very very very very very very very very very very very long label</b>' }
        ],
        width: 400
    });

    var $label = this.element.find("." + TOOLBAR_LABEL_CLASS);

    assert.equal($label.children().eq(0).css("text-overflow"), "ellipsis");
    assert.equal($label.children().eq(0).css("overflow"), "hidden");

    var $centerSection = this.element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS),
        beforeSectionWidth = this.element.find("." + TOOLBAR_BEFORE_CONTAINER_CLASS)[0].getBoundingClientRect().width,
        afterSectionWidth = this.element.find("." + TOOLBAR_AFTER_CONTAINER_CLASS)[0].getBoundingClientRect().width;

    assert.roughEqual(parseFloat($centerSection.css("margin-left")), beforeSectionWidth, 0.1);
    assert.roughEqual(parseFloat($centerSection.css("margin-right")), afterSectionWidth, 0.1);

    var maxLabelWidth = this.element.width() - beforeSectionWidth - afterSectionWidth;

    assert.ok(parseFloat($label.css("max-width")) < maxLabelWidth);
});

QUnit.test("Center element has correct margin with RTL", function(assert) {
    var element = this.element.dxToolbar({
            rtlEnabled: true,
            items: [
                { location: 'before', text: 'before' },
                { location: 'center', text: 'center' }
            ]
        }),
        margin = element.find("." + TOOLBAR_CLASS + "-center").get(0).style.margin;

    assert.equal(margin, "0px auto", "aligned by center");
});

QUnit.test("useFlatButtons change dx-button-flat class in runtime in Material", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };
    var element = this.element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back'
                }
            }]
        }),
        button = element.find(".dx-button").first();

    assert.ok(button.hasClass("dx-button-flat"));

    element.dxToolbar("instance").option("useFlatButtons", false);
    button = element.find(".dx-button").first();

    assert.notOk(button.hasClass("dx-button-flat"));

    themes.isMaterial = origIsMaterial;
});

QUnit.test("Button save elementAttr.class class on container in Material", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };
    var element = this.element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back',
                    elementAttr: { class: 'custom-class1 custom-class2' }
                }
            }]
        }),
        button = element.find(".dx-button").first();

    assert.ok(button.hasClass("dx-button-flat"));
    assert.ok(button.hasClass("custom-class1"));
    assert.ok(button.hasClass("custom-class2"));

    themes.isMaterial = origIsMaterial;
});

QUnit.test("Buttons has default style in generic theme", function(assert) {
    var element = this.element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back'
                }
            }]
        }),
        button = element.find(".dx-button");

    assert.notOk(button.hasClass("dx-button-flat"));
});


QUnit.module("toolbar with menu", {
    beforeEach: function() {
        this.element = $("#toolbar");
        this.instance = this.element.dxToolbar({ renderAs: "bottomToolbar" })
            .dxToolbar("instance");

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("render menu items", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', text: 'item1' },
            { location: 'menu', text: 'item2' },
            { location: 'menu', text: 'item3' }
        ],
        submenuType: "listBottom"
    });

    var items = this.element.find("." + TOOLBAR_ITEM_CLASS);
    assert.equal(items.length, 1);

    items = this.element.find(".dx-list-item");
    assert.equal(items.length, 2);
});

QUnit.test("toolbar item should not be rendered twice after option change", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'menu', text: 'item1' },
            { location: 'before', text: 'item2' },
            { location: 'menu', text: 'item3' },
            { location: 'before', text: 'item4' }
        ],
        submenuType: "listBottom"
    });

    this.element.dxToolbar("option", "items[3].option", true);
    var items = this.element.find("." + TOOLBAR_ITEM_CLASS);
    assert.equal(items.length, 2, "items length is correct");
});

QUnit.test("render menu button", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'menu', text: 'item' }
        ],
        submenuType: "listBottom"
    });

    var menuButton = this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS);

    assert.equal(menuButton.length, 1);

    this.instance.option("items", [{ text: "newItem" }]);
    menuButton = this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS);
    assert.equal(menuButton.length, 1, "win8 appbar mode has menu button");

    this.instance.option("renderAs", "topToolbar");
    menuButton = this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS);
    assert.equal(menuButton.length, 0);
});

QUnit.test("menu type", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', text: 'item1' },
            { location: 'menu', text: 'item2' }
        ],
        submenuType: "listBottom"
    });

    var $submenu = this.element.find(".dx-list");
    assert.equal($submenu.length, 1);

    this.instance.option("submenuType", "actionSheet");
    $submenu = this.element.find(".dx-list");
    assert.equal(this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS).length, 1, "menu button was rendered");
    assert.equal(this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS + " .dx-icon").length, 1, "menu button has icon");

    assert.equal($submenu.length, 0, "previous type is removed");
    $submenu = $(".dx-actionsheet .dx-popup");
    assert.equal($submenu.length, 1);

    this.instance.option("submenuType", "dropDownMenu");
    $submenu = this.element.find("." + DROP_DOWN_MENU_CLASS);
    assert.equal($submenu.length, 1);
    assert.equal(this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS).length, 0, "menu button already rendered in dxDropDownMenu");
});

QUnit.test("menu item click action", function(assert) {
    var count = 0;
    this.element.dxToolbar({
        onItemClick: function() {
            count++;
        },
        items: [
            { location: 'menu', text: 'item1' },
            { location: 'menu', text: 'item2' }
        ],
        submenuType: "listBottom"
    });

    var submenu = this.element.find(".dx-list-item").get(0);
    $(submenu).trigger("dxclick");
    assert.equal(count, 1, "onItemClick was executed");
});

QUnit.test("menu button click doesn't dispatch action", function(assert) {
    var count = 0;
    this.element.dxToolbar({
        onItemClick: function() {
            count++;
        },
        items: [
            { location: 'menu', text: 'item2' }
        ],
        submenuType: "dropDownMenu"
    });

    var button = this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS).get(0);
    $(button).trigger("dxclick");
    assert.equal(count, 0, "onItemClick was not executed");
});

QUnit.test("menu item itemTemplate", function(assert) {
    this.element.dxToolbar({
        menuItemTemplate: function(item, index) {
            return index + ": " + item.text;
        },
        items: [
            { location: 'menu', text: 'a' },
            { location: 'menu', text: 'b' }
        ],
        submenuType: "listBottom"
    });

    var items = this.element.find(".dx-list-item");

    assert.equal(items.eq(0).text(), "0: a");
    assert.equal(items.eq(1).text(), "1: b");

    this.instance.option("menuItemTemplate", function(item, index) {
        return item.text + ": " + index;
    });

    items = this.element.find(".dx-list-item");
    assert.equal(items.eq(0).text(), "a: 0");
    assert.equal(items.eq(1).text(), "b: 1");
});

QUnit.test("renderAs option", function(assert) {
    var instance = this.element.dxToolbar({
        renderAs: "topToolbar",
        submenuType: "listBottom",
        items: [
            { location: 'menu', text: 'a' },
            { location: 'menu', text: 'b' }
        ],
    }).dxToolbar("instance");

    assert.ok(!this.element.hasClass("dx-toolbar-bottom"));
    assert.ok(this.element.find(".dx-list-item:visible").length === 0, "win8 menu was not rendered for topToolbar");

    instance.option("renderAs", "bottomToolbar");
    assert.ok(this.element.hasClass("dx-toolbar-bottom"));
    assert.ok(this.element.find(".dx-list-item").length === 2, "menu was rendered");
});

QUnit.test("toolbar should get 'list-visible' class when menu is visible", function(assert) {
    var $element = this.element.dxToolbar({
        renderAs: "bottomToolbar",
        submenuType: "listBottom",
        items: [
            { location: 'menu', text: 'a' },
            { location: 'menu', text: 'b' }
        ]
    });
    var $menu = $element.find("." + TOOLBAR_MENU_BUTTON_CLASS);

    $($menu).trigger("dxclick");
    assert.ok($element.hasClass(TOOLBAR_LIST_VISIBLE_CLASS), "'list-visible' class is attached when list is shown");

    $($menu).trigger("dxclick");
    assert.ok(!$element.hasClass(TOOLBAR_LIST_VISIBLE_CLASS), "'list-visible' class is removed when list is hidden");
});

QUnit.test("windowResize should not show/hide menu that doesn't created", function(assert) {
    this.element.dxToolbar({
        renderAs: "topToolbar",
        submenuType: "actionSheet",
        items: [],
    });

    resizeCallbacks.fire();
    assert.ok(true);
});

QUnit.test("win8 topToolbar menu", function(assert) {
    this.element.dxToolbar({
        renderAs: "topToolbar",
        submenuType: "listBottom",
        items: [
            { location: 'menu', text: 'a' },
            { location: 'menu', text: 'b' }
        ],
    });

    assert.ok(this.element.find("." + DROP_DOWN_MENU_CLASS).length === 1, "dropdown was rendered");
});

QUnit.test("option visible for menu items", function(assert) {
    var instance = this.element.dxToolbar({
        submenuType: "dropDownMenu",
        items: [
            { location: 'menu', text: 'a', visible: true }
        ],
    }).dxToolbar("instance");

    assert.ok(this.element.find("." + DROP_DOWN_MENU_CLASS).length === 1, "dropdown was rendered");

    instance.option("items", [{ location: 'menu', text: 'a', visible: false }]);
    assert.ok(this.element.find("." + DROP_DOWN_MENU_CLASS).length === 0, "dropdown was not rendered");
});

QUnit.test("option visible", function(assert) {
    this.element.dxToolbar({
        visible: false,
        items: [
            { text: 'a' },
            { location: 'menu', text: 'b' }
        ],
        submenuType: "listBottom"
    });


    var listOverlay = this.instance._listOverlay;
    if(listOverlay) {
        listOverlay.show();
        listOverlay.hide();
    }

    var $content = this.element.find(".dx-overlay-content");
    assert.ok($content.is(":hidden"));

    this.instance.option("visible", true);
    assert.ok($content.is(":visible"));
});

QUnit.test("changing field of item in submenu", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'menu', disabled: true }
        ],
        submenuType: "actionSheet"
    });

    var $button = this.element.find("." + TOOLBAR_MENU_BUTTON_CLASS);
    $($button).trigger("dxclick");
    this.element.dxToolbar("option", "items[0].disabled", false);
    assert.equal($(".dx-state-disabled").length, 0, "disabled state changed");
});

QUnit.test("dropdown menu should have correct position", function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'menu', disabled: true }
        ],
        submenuType: "dropDownMenu"
    });

    var $button = this.element.find("." + DROP_DOWN_MENU_CLASS),
        ddMenu = $button.dxDropDownMenu("instance"),
        position = ddMenu.option("popupPosition");

    assert.equal(position.at, "bottom right", "at position is correct");
    assert.equal(position.my, "top right", "my position is correct");
});


QUnit.module("swipe", {
    beforeEach: function() {
        this.$element = $("#toolbar");

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("container swipe", function(assert) {
    this.$element.dxToolbar({
        items: [
                { text: 'a' },
                { location: 'menu', text: 'b' }
        ],
        submenuType: "listBottom",
        renderAs: "bottomToolbar"
    });

    var $container = this.$element.find(".dx-overlay-content"),
        $itemsContainer = this.$element.find(".dx-toolbar-items-container"),
        pointer = pointerMock($itemsContainer);

    var listHeight = this.$element.find(".dx-list").height(),
        swipeHeight = listHeight + ($itemsContainer.height() - this.$element.height());

    assert.roughEqual($container.position().top, 0, 0.5, "menu hidden at start");

    pointer.start().swipeStart().swipe(-0.5);
    assert.roughEqual($container.position().top, -0.5 * swipeHeight, 0.5);

    pointer.swipeEnd(-1);
    assert.roughEqual($container.position().top, -swipeHeight, 0.5);

    pointer.start().swipeStart().swipe(0.5);
    assert.roughEqual($container.position().top, -0.5 * swipeHeight, 0.5);

    pointer.swipeEnd(1);
    assert.roughEqual($container.position().top, 0, 0.5);
});

QUnit.test("menu button click", function(assert) {
    this.$element.dxToolbar({
        items: [
            { location: 'menu', text: 'item' }
        ],
        submenuType: "listBottom",
        renderAs: "bottomToolbar"
    });

    var $menuButton = this.$element.find("." + TOOLBAR_MENU_BUTTON_CLASS),
        $itemsContainer = this.$element.find(".dx-toolbar-items-container"),
        $container = this.$element.find(".dx-overlay-content");

    var listHeight = this.$element.find(".dx-list").height(),
        swipeHeight = listHeight + ($itemsContainer.height() - this.$element.height());

    var position = $container.position().top;

    $($menuButton).trigger("dxclick");
    assert.equal($container.position().top, -swipeHeight);

    $($menuButton).trigger("dxclick");
    assert.equal($container.position().top, position);
});

QUnit.test("close win8 appbar on 'back' button click", function(assert) {
    this.$element.dxToolbar({
        items: [
            { location: 'menu', text: 'item' }
        ],
        submenuType: "listBottom",
        renderAs: "bottomToolbar"
    });

    var $menuButton = this.$element.find("." + TOOLBAR_MENU_BUTTON_CLASS),
        $itemsContainer = this.$element.find(".dx-toolbar-items-container"),
        $container = this.$element.find(".dx-overlay-content");

    var listHeight = this.$element.find(".dx-list").height(),
        swipeHeight = listHeight + ($itemsContainer.height() - this.$element.height());

    var position = $container.position().top;

    $($menuButton).trigger("dxclick");
    assert.equal($container.position().top, -swipeHeight);

    hideTopOverlayCallback.fire();
    assert.equal($container.position().top, position);
});

QUnit.test("close win8 appbar on menu item click", function(assert) {
    var count = 0;
    this.$element.dxToolbar({
        onItemClick: function() {
            count++;
        },
        items: [
            { location: 'menu', text: 'item1' },
            { location: 'menu', text: 'item2' }
        ],
        submenuType: "listBottom",
        renderAs: "bottomToolbar"
    });

    var $menuButton = this.$element.find("." + TOOLBAR_MENU_BUTTON_CLASS),
        $container = this.$element.find(".dx-overlay-content"),
        position = $container.position().top;

    $($menuButton).trigger("dxclick");

    var submenu = this.$element.find(".dx-list-item").get(0);
    $(submenu).trigger("dxclick");
    assert.equal($container.position().top, position);
});

QUnit.test("appbar state with only menu items", function(assert) {
    var instance = this.$element.dxToolbar({
        items: [
            { location: 'menu', text: 'b' }
        ],
        submenuType: "listBottom"
    }).dxToolbar("instance");

    assert.ok(this.$element.hasClass("dx-toolbar-mini"));

    instance.option("items", [{ text: 'a' }, { location: 'menu', text: 'b' }]);
    assert.ok(!this.$element.hasClass("dx-toolbar-mini"));
});


QUnit.module("submenuType = 'listTop'", {
    beforeEach: function() {
        this.$element = $("#toolbar");
        this.instance = this.$element.dxToolbar({
            items: [
                { location: 'menu', text: 'item1' },
                { location: 'menu', text: 'item2' }
            ],
            submenuType: "listTop",
            renderAs: "bottomToolbar"
        }).dxToolbar("instance");

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("toolbar items container should get correct z-index in 'listTop' strategy", function(assert) {
    var $container = this.$element.find("." + TOOLBAR_ITEMS_CONTAINER_CLASS);
    var $overlayContent = this.$element.find(".dx-overlay-content");

    assert.ok($container.css("zIndex") - $overlayContent.css("zIndex") > 0, "toolbar items container z-index is correct");
});

QUnit.test("toolbar items container should be rendered directly in widget's element", function(assert) {
    var $container = this.$element.children("." + TOOLBAR_ITEMS_CONTAINER_CLASS);
    assert.equal($container.length, 1, "toolbar items container is rendered directly in widget's element");
});

QUnit.test("menu should not be reopened after the menu button click", function(assert) {
    var $container = this.$element.children("." + TOOLBAR_ITEMS_CONTAINER_CLASS);
    var $menuButton = $container.find("." + TOOLBAR_MENU_BUTTON_CLASS);
    var instance = this.instance;

    var pointer = pointerMock($menuButton).start();
    var isMenuVisible = function(toolbar) {
        return toolbar._menuStrategy._menuShown;
    };

    assert.ok(!isMenuVisible(instance), "menu is closed initially");

    pointer.click();
    assert.ok(isMenuVisible(instance), "menu is opened after menu button click");

    pointer.click();
    assert.ok(!isMenuVisible(instance), "menu is closed after menu button second click");
});

QUnit.test("it should be possible to expand toolbar with no items in submenu", function(assert) {
    var instance = $("#widget").dxToolbar({
        submenuType: "listTop",
        renderAs: "bottomToolbar"
    }).dxToolbar("instance");

    var $menuButton = instance.$element().find("." + TOOLBAR_MENU_BUTTON_CLASS);
    var isMenuVisible = function(toolbar) {
        return toolbar._menuStrategy._menuShown;
    };

    $($menuButton).trigger("dxclick");
    assert.ok(isMenuVisible(instance), "toolbar is expanded");
});


QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: 'before', text: 'before' },
                    { location: 'after', text: 'after' },
                    { location: 'center', text: 'center' }
        ]
    });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxToolbar({ width: 400 }),
        instance = $element.dxToolbar("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxToolbar(),
        instance = $element.dxToolbar("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxToolbar(),
        instance = $element.dxToolbar("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.test("text should crop in the label inside the toolbar on toolbar's width changing", function(assert) {
    var $element = $("#widget").dxToolbar({
            items: [
            { location: 'before', text: 'Before long text label' },
            { location: 'after', text: 'after' }
            ],
            width: 300
        }),
        instance = $element.dxToolbar("instance"),
        $before = $element.find(".dx-toolbar-before").eq(0),
        $after = $element.find(".dx-toolbar-after").eq(0);

    instance.option("width", 100);

    assert.roughEqual($before.outerWidth(), 100 - $after.outerWidth(), 1, "width of before element should be changed");
});

QUnit.test("text should crop in the label inside the toolbar on window's width changing", function(assert) {
    var $element = $("#widget").width(300).dxToolbar({
            items: [
                { location: 'before', text: 'Before long text label' },
                { location: 'after', text: 'after' }
            ]
        }),
        $before = $element.find(".dx-toolbar-before").eq(0),
        $after = $element.find(".dx-toolbar-after").eq(0);

    $element.width(100);
    resizeCallbacks.fire();

    assert.roughEqual($before.outerWidth(), 100 - $after.outerWidth(), 1, "width of before element should be changed");
});

QUnit.test("label should positioned correctly inside the toolbar if toolbar-before section is empty", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: 'center', text: 'TextTextTextTextTextTextTe' },
            { location: 'before', template: 'nav-button', visible: false },
            { location: 'after', text: 'after after after' }
        ],
        width: 359
    });

    var $center = $element.find(".dx-toolbar-center").eq(0),
        $label = $center.children(".dx-toolbar-label").eq(0),
        $after = $element.find(".dx-toolbar-after").eq(0);

    assert.ok(Math.floor($label.position().left + $label.outerWidth()) <= Math.floor($element.outerWidth() - $after.outerWidth()), "label is positioned correctly");
});

QUnit.test("title should be centered considering different before/after block widths (big before case)", function(assert) {
    var title = "LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText";

    var $element = $("#widget").dxToolbar({
        onItemRendered: function(args) {
            if($(args.itemElement).text() === title) {
                $(args.itemElement).css("maxWidth", 200);
            }
        },
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", text: title },
            { location: "after", template: function() { return $("<div>").width(50); } }
        ],
        width: 400
    });

    var $center = $element.find(".dx-toolbar-center").eq(0);
    assert.equal(parseInt($center.css("margin-left")), 110);
    assert.equal(parseInt($center.css("margin-right")), 60);
    assert.equal($center.css("float"), "none");
    assert.equal($center.width(), 230);
});


QUnit.test("title should be centered considering different before/after block widths (big after case)", function(assert) {
    var title = "LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText";

    var $element = $("#widget").dxToolbar({
        onItemRendered: function(args) {
            if($(args.itemElement).text() === title) {
                $(args.itemElement).css("maxWidth", 200);
            }
        },
        items: [
            { location: "before", template: function() { return $("<div>").width(50); } },
            { location: "center", text: title },
            { location: "after", template: function() { return $("<div>").width(100); } }
        ],
        width: 400
    });

    var $center = $element.find(".dx-toolbar-center").eq(0);
    assert.equal(parseInt($center.css("margin-left")), 60);
    assert.equal(parseInt($center.css("margin-right")), 110);
    assert.equal($center.css("float"), "right");
    assert.equal($center.width(), 230);
});

QUnit.test("title should be centered considering different before/after block widths after visible option change", function(assert) {
    var title = "LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText";

    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(50); }, visible: false },
            { location: "center", text: title }
        ],
        width: 400
    });
    $element.dxToolbar("option", "items[0].visible", true);

    var $center = $element.find(".dx-toolbar-center").eq(0);
    assert.equal(parseInt($center.css("margin-left")), 60);
});


QUnit.module("adaptivity", {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("center section should be at correct position for huge after section", function(assert) {
    var $element = $("#widget").dxToolbar({
            items: [
            { location: "before", template: function() { return $("<div>").width(50); } },
            { location: "center", template: function() { return $("<div>").width(50); } },
            { location: "after", template: function() { return $("<div>").width(200); } },
            ],
            width: 400
        }),
        $center = $element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0),
        $after = $element.find("." + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

    assert.equal($center.offset().left + $center.outerWidth(), $after.offset().left, "center has correct position");
});

QUnit.test("items in center section should be at correct position after resize", function(assert) {
    var $item = $("<div>").width(50);
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(50); } },
            { location: "center", template: function() { return $item; } },
            { location: "after", template: function() { return $("<div>").width(200); } },
        ],
        width: 400
    });

    $element.dxToolbar("option", "width", 1000);

    var elementCenter = $element.offset().left + $element.outerWidth() * 0.5,
        itemCenter = $item.offset().left + $item.outerWidth() * 0.5;

    assert.equal(itemCenter, elementCenter, "item has correct position");
});

QUnit.test("center section should be at correct position for huge before section", function(assert) {
    var $element = $("#widget").dxToolbar({
            items: [
            { location: "before", template: function() { return $("<div>").width(200); } },
            { location: "center", template: function() { return $("<div>").width(50); } },
            { location: "after", template: function() { return $("<div>").width(50); } },
            ],
            width: 400
        }),
        $before = $element.find("." + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0),
        $center = $element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);


    assert.equal($center.offset().left, $before.offset().left + $before.outerWidth(), "center has correct position");
});

QUnit.test("center section should be at correct position for huge after section after change size", function(assert) {
    var $item = $("<div>").width(200);
    var $element = $("#widget").dxToolbar({
            items: [
            { location: "before", template: function() { return $("<div>").width(50); } },
            { location: "center", template: function() { return $("<div>").width(50); } },
            { location: "after", template: function() { return $item; } },
            ],
            width: 400
        }),
        $center = $element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0),
        $after = $element.find("." + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

    $item.width(190);
    resizeCallbacks.fire();

    assert.equal($center.get(0).getBoundingClientRect().right, $after.get(0).getBoundingClientRect().left, "center has correct position");
});

QUnit.test("center section should be at correct position for huge before section after change size", function(assert) {
    var $item = $("<div>").width(200);
    var $element = $("#widget").dxToolbar({
            items: [
            { location: "before", template: function() { return $item; } },
            { location: "center", template: function() { return $("<div>").width(50); } },
            { location: "after", template: function() { return $("<div>").width(50); } },
            ],
            width: 400
        }),
        $before = $element.find("." + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0),
        $center = $element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);

    $item.width(190);
    resizeCallbacks.fire();

    assert.equal($center.get(0).getBoundingClientRect().left, $before.get(0).getBoundingClientRect().right, "center has correct position");
});

QUnit.test("overflow items should be hidden if there is no free space for them", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    var $visibleItems = $element.find("." + TOOLBAR_ITEM_CLASS + ":visible");
    assert.equal($visibleItems.length, 3, "two items was hidden");
});

QUnit.test("overflow items should be shown if there is free space for them after resize", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(50); } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(60); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    $element.dxToolbar("option", "width", 1000);
    var $visibleItems = $element.find("." + TOOLBAR_ITEM_CLASS + ":visible");
    assert.equal($visibleItems.length, 5, "all items is visible");
});

QUnit.test("dropdown menu should be rendered if there is hidden overflow items", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test("dropdown menu button should be invisible if there is hidden invisible overflow items", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "after", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { locateInMenu: "always", visible: false, template: function() { return $("<div>").width(100); } }
        ]
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);

    assert.equal($dropDownMenu.length, 1, "button is rendered");
    assert.notOk($dropDownMenu.is(":visible"), "button is invisible");
});

QUnit.test("all overflow items should be hidden on render", function(assert) {
    var $element = $("#toolbarWithMenu").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(50); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(50); } }
        ],
        width: 190
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.dxDropDownMenu("option", "items").length, 2);
});

QUnit.test("overflow items should not be rendered twice after resize", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(50); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(50); } }
        ],
        width: 400
    });

    $element.dxToolbar("option", "width", 190);

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    $dropDownMenu.dxDropDownMenu("open");
    $dropDownMenu.dxDropDownMenu("close");
    $element.dxToolbar("option", "width", 188);

    assert.equal($dropDownMenu.dxDropDownMenu("option", "items").length, 1);
});

QUnit.test("dropdown menu should be rendered if there is hidden overflow items after resize", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 1000
    });

    $element.dxToolbar("option", "width", 400);
    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test("dropdown menu shouldn't be closed during resize with open menu if menu has items", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    var dropDown = $element.find("." + DROP_DOWN_MENU_CLASS).dxDropDownMenu("instance");

    dropDown.open();

    $element.dxToolbar("option", "width", 500);
    assert.equal(dropDown.option("opened"), true);
});

QUnit.test("dropdown menu should be closed if after resize with open menu all items become visible", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    var dropDown = $element.find("." + DROP_DOWN_MENU_CLASS).dxDropDownMenu("instance");

    dropDown.open();

    $element.dxToolbar("option", "width", 1000);
    assert.equal(dropDown.option("opened"), false);
});

QUnit.test("dropdown menu strategy should be used if there is overflow widget", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "center", locateInMenu: "auto", widget: "dxButton", options: {} }
        ],
        submenuType: "actionSheet",
        width: 100
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test("dropdown menu strategy should be used if there is overflow widget", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { locateInMenu: "auto", widget: "dxButton", options: { text: "test" }, showText: "inMenu" }
        ]
    });

    var $buttonText = $element.find(".dx-button-text");

    assert.equal($buttonText.length, 1);
    assert.ok($buttonText.is(":hidden"));
});

QUnit.test("dropdown menu strategy should be used if there is overflow widget", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "center", locateInMenu: "auto", text: "test" }
        ],
        submenuType: "actionSheet",
        width: 100
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test("visibility of dropdown menu should be changed if overflow items was hidden/shown after resize", function(assert) {
    var $element = $("#widget").dxToolbar({
            items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
            ],
            width: 400
        }),
        $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);

    $element.dxToolbar("option", "width", 1000);
    assert.ok($dropDownMenu.is(":hidden"), "menu is hidden");

    $element.dxToolbar("option", "width", 400);
    assert.ok($dropDownMenu.is(":visible"), "menu is visible");
});

QUnit.test("hidden overflow items should be rendered in menu", function(assert) {
    var $item = $("<div>").width(100);
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $item; } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu("instance");

    dropDown.option("onItemRendered", function(args) {
        assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), "item was rendered in menu");
    });

    dropDown.open();
});

QUnit.test("items with locateInMenu == 'always' should be rendered in menu if there is free space for them", function(assert) {
    var $item = $("<div>").width(100);
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "center", locateInMenu: "always", template: function() { return $item; } }
        ],
        width: 1000
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu("instance");

    dropDown.option("onItemRendered", function(args) {
        assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), "item was rendered in menu");
    });

    dropDown.open();
});

QUnit.test("visible overflow items should be moved back into widget after resize", function(assert) {
    var $item = $("<div>").width(100);
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "center", template: function() { return $("<div>").width(150); } },
            { location: "center", locateInMenu: "auto", template: function() { return $item; } },
            { location: "center", template: function() { return $("<div>").width(100); } },
            { location: "after", template: function() { return $("<div>").width(100); } },
        ],
        width: 400
    });

    var $itemParent = $item.parent();
    var dropDown = $element.find("." + DROP_DOWN_MENU_CLASS).dxDropDownMenu("instance");

    dropDown.open();
    dropDown.close();
    $element.dxToolbar("option", "width", 1000);
    assert.ok($item.parent().is($itemParent), "item was rendered in toolbar");
});

QUnit.test("dropdown menu should have four sections for items", function(assert) {
    var $beforeItem = $("<div>").width(150);
    var $centerItem = $("<div>").width(150);
    var $afterItem = $("<div>").width(150);

    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", locateInMenu: "auto", template: function() { return $beforeItem; } },
            { location: "center", locateInMenu: "auto", template: function() { return $centerItem; } },
            { location: "after", locateInMenu: "auto", template: function() { return $afterItem; } },
        ],
        width: 100
    });

    var $dropDown = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu("instance");

    dropDown.open();
    dropDown.close();

    var $sections = $dropDown.find(".dx-toolbar-menu-section");

    assert.equal($sections.length, 4, "four sections was rendered");
    assert.ok($.contains($sections.eq(0).get(0), $beforeItem.get(0)));
    assert.ok($.contains($sections.eq(1).get(0), $centerItem.get(0)));

    assert.ok($.contains($sections.eq(2).get(0), $afterItem.get(0)));
    assert.ok($sections.eq(2).hasClass("dx-toolbar-menu-last-section"), "border for last section is removed");
});

QUnit.test("dropdown menu shouldn't be closed after click on editors", function(assert) {
    var $beforeItem = $("<div>").width(150);

    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", locateInMenu: "auto", template: function() { return $beforeItem; } },
        ],
        width: 100
    });

    var $dropDown = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu("instance");
    dropDown.open();

    $($beforeItem).trigger("dxclick");

    assert.ok(dropDown.option("opened"), "dropdown isn't closed");
});

QUnit.test("dropdown menu should be closed after click on button or menu items", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", locateInMenu: "auto", widget: "dxButton", options: { text: "test text" } },
            { location: "before", template: function() { return $("<div>").width(100); } },
            { location: "menu", text: "test text" }
        ],
        width: 100
    });

    var $dropDown = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu("instance");

    dropDown.open();
    dropDown.close();

    var $items = $element.find(".dx-list-item");

    dropDown.open();
    $($items.eq(0)).trigger("dxclick");
    assert.ok(!dropDown.option("opened"), "dropdown is closed");

    dropDown.open();
    $($items.eq(1)).trigger("dxclick");
    assert.ok(!dropDown.option("opened"), "dropdown is closed");
});

QUnit.test("overflow button should be rendered as list item in dropdown", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", locateInMenu: "auto", widget: "dxButton", options: { text: "test text" } },
            { location: "before", template: function() { return $("<div>").width(100); } }
        ],
        width: 100
    });

    var $dropDown = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu("instance");

    dropDown.open();
    dropDown.close();

    var $section = $dropDown.find(".dx-toolbar-menu-section").eq(0);

    assert.equal($section.find(".dx-toolbar-menu-action").length, 1, "click on button should close menu");
    assert.equal($section.find(".dx-toolbar-hidden-button").length, 1, "button has specific class for override styles");
    assert.equal($section.find(".dx-list-item").text(), "test text", "button text was rendered");
});

QUnit.test("overflow item should rendered with correct template in menu and in toolbar", function(assert) {
    assert.expect(4);

    var $toolbarTemplate = $("<div>").width(500),
        $menuTemplate = $("<div>");

    var $element = $("#widget").dxToolbar({
        items: [
            {
                locateInMenu: "auto",
                template: function() { return $toolbarTemplate; },
                menuItemTemplate: function() { return $menuTemplate; }
            }
        ],
        width: 1000
    });

    assert.ok($toolbarTemplate.is(":visible"), "toolbar template was rendered");
    assert.ok($menuTemplate.is(":hidden"), "menu template won't rendered");

    $element.dxToolbar("option", "width", 400);

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu("instance");

    dropDown.option("onItemRendered", function(args) {
        assert.ok($.contains($(args.itemElement).get(0), $menuTemplate.get(0)), "item was rendered in menu");
        assert.ok($toolbarTemplate.is(":hidden"), "toolbar template was hidden");
    });

    dropDown.open();
});

QUnit.test("toolbar menu should have correct focused element", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            {
                location: "before",
                locateInMenu: "always",
                text: "item1"
            },
            {
                location: "center",
                locateInMenu: "always",
                text: "item2"
            }
        ]
    });


    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu("instance");

    if(!dropDown.option("focusStateEnabled")) {
        assert.expect(0);
        return;
    }


    dropDown.open();

    var $item1 = $(".dx-list-item").eq(0),
        $item2 = $(".dx-list-item").eq(1);

    $($item2).trigger("dxpointerdown");
    this.clock.tick();

    assert.ok($item2.hasClass("dx-state-focused"), "only item2 is focused");
    assert.ok(!$item1.hasClass("dx-state-focused"), "only item2 is focused");
});

QUnit.test("toolbar menu should have correct item element", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [{ locateInMenu: "always", text: "item1" }]
    });

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu("instance");

    dropDown.open();
    dropDown.close();

    resizeCallbacks.fire();

    dropDown.open();
    assert.equal($(".dx-list-item").length, 1, "only one item in menu is rendered");
});


QUnit.test("toolbar menu should be rendered after change item visible", function(assert) {
    assert.expect(3);

    var $element = $("#widget").dxToolbar({
            items: [{ locateInMenu: "always", text: "item1", visible: false }]
        }),
        $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);

    assert.equal($dropDownMenu.length, 0, "menu is not rendered");

    var toolbar = $element.dxToolbar("instance");

    toolbar.option("items[0].visible", true);
    $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);

    assert.equal($dropDownMenu.length, 1, "menu is rendered");

    if(!$dropDownMenu.length) return;

    var dropDown = $dropDownMenu.dxDropDownMenu("instance");

    dropDown.open();

    assert.equal($(".dx-list-item").length, 1, "item in menu is rendered");
    dropDown.close();
});

QUnit.test("invisible overflow items should be hidden if there no free space for them", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", locateInMenu: "auto", template: function() { return $("<div>").width(300); } }
        ],
        width: 400
    });

    $element.dxToolbar("option", "items[0].visible", false);
    assert.equal($element.find("." + TOOLBAR_ITEM_CLASS + ":visible").length, 0, "item was hidden");
});

QUnit.test("menu should be hidden if all overflow items were hidden", function(assert) {
    var $element = $("#widget").dxToolbar({
        items: [
            { location: "before", template: function() { return $("<div>").width(300); } },
            { location: "before", locateInMenu: "auto", template: function() { return $("<div>").width(300); } }
        ],
        width: 300
    });

    $element.dxToolbar("option", "items[1].visible", false);

    var $dropDownMenu = $element.find("." + DROP_DOWN_MENU_CLASS);
    assert.ok($dropDownMenu.is(":hidden"), "menu is hidden");
});

QUnit.testInActiveWindow("items should not be rearranged if width is not changed", function(assert) {
    var $input = $("<input>").width(300);

    var $element = $("#widget").dxToolbar({
            items: [
            { location: "before", template: function() { return $("<div>").width(300); } },
            { location: "before", locateInMenu: "auto", template: function() { return $input; } }
            ],
            width: 300
        }),
        dropDown = $element.find("." + DROP_DOWN_MENU_CLASS).dxDropDownMenu("instance");

    dropDown.open();
    $input.focus();
    resizeCallbacks.fire("height");

    assert.ok($input.is(":focus"), "focus is not lost");
});


QUnit.module("default template", {
    prepareItemTest: function(data) {
        var toolbar = new Toolbar($("<div>"), {
            items: [data]
        });

        return toolbar.itemElements().eq(0).find(".dx-item-content").contents();
    }
});

QUnit.test("T430159 dropdown menu should be closed after click on item if location is defined", function(assert) {
    var onClickActionStub = sinon.stub();

    var $element = $("#widget").dxToolbar({
        items: [
            {
                location: "center",
                text: "123",
                locateInMenu: "always",
                isAction: true,
                onClick: onClickActionStub
            }
        ],
        width: 100
    });

    var $dropDown = $element.find("." + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu("instance");

    dropDown.open();
    var $items = $(".dx-dropdownmenu-list .dx-list-item");

    $($items.eq(0)).trigger("dxclick");

    assert.ok(!dropDown.option("opened"), "dropdown is closed");
    assert.equal(onClickActionStub.callCount, 1, "onClick was fired");
});

QUnit.module("adaptivity without hiding in menu", {
    beforeEach: function() {
        this.element = $("#toolbar");
        this.getToolbarItems = function() {
            return this.element.find("." + TOOLBAR_ITEM_CLASS);
        };
    }
});

QUnit.test("items in before section should have correct sizes, width decreases", function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'before', text: 'before1' },
            { location: 'before', text: 'before2' },
            { location: 'before', text: 'before3' }
        ],
        width: 250,
        height: 50
    }).dxToolbar("instance");

    $.each(this.getToolbarItems(), function(index, $item) {
        assert.roughEqual($($item).outerWidth(), 59, 2, "Width is correct");
    });

    toolBar.option("width", 180);

    $.each(this.getToolbarItems(), function(index, $item) {
        if(index < 2) {
            assert.roughEqual($($item).outerWidth(), 59, 1, "Width is correct");
        } else {
            assert.roughEqual($($item).outerWidth(), 42, 1, "Width is correct");
        }
    });

    toolBar.option("width", 100);

    assert.roughEqual(this.getToolbarItems().eq(0).outerWidth(), 59, 1, "Width of the first item is correct");
    assert.roughEqual(this.getToolbarItems().eq(1).outerWidth(), 21, 1, "Width of the second item is correct");
    assert.roughEqual(this.getToolbarItems().eq(2).outerWidth(), 10, 1, "Width of the third item is correct");
});

QUnit.test("items in center section should have correct sizes, width decreases", function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'center', text: 'center1' },
            { location: 'center', text: 'center1' },
            { location: 'center', text: 'center3' }
        ],
        width: 250,
        height: 50
    }).dxToolbar("instance");

    $.each(this.getToolbarItems(), function(index, $item) {
        assert.roughEqual($($item).outerWidth(), 58, 2, "Width is correct");
    });

    toolBar.option("width", 140);

    $.each(this.getToolbarItems(), function(index, $item) {
        if(index < 2) {
            assert.roughEqual($($item).outerWidth(), 58, 1, "Width is correct");
        } else {
            assert.roughEqual($($item).outerWidth(), 10, 1, "Width is correct");
        }
    });

    toolBar.option("width", 100);

    var $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, "Width of the first item is correct");
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 22, 2, "Width of the second item is correct");
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, "Width of the third item is correct");
});

QUnit.test("items in before section should have correct sizes, width increases", function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'before', text: 'before1' },
            { location: 'before', text: 'before2' },
            { location: 'before', text: 'before3' }
        ],
        width: 100,
        height: 50
    }).dxToolbar("instance");

    toolBar.option("width", 180);

    var $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 59, 1, "Width of the first item is correct");
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 32, 1, "Width of the second item is correct");
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, "Width of the third item is correct");

    toolBar.option("width", 250);

    $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 59, 1, "Width of the first item is correct");
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 59, 1, "Width of the second item is correct");
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 21, 1, "Width of the third item is correct");
});

QUnit.test("items in center section should have correct sizes, width increases", function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'center', text: 'center1' },
            { location: 'center', text: 'center1' },
            { location: 'center', text: 'center3' }
        ],
        width: 50,
        height: 50
    }).dxToolbar("instance");

    toolBar.option("width", 140);

    var $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, "Width of the first item is correct");
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 10, 1, "Width of the second item is correct");
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, "Width of the third item is correct");

    toolBar.option("width", 250);

    $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, "Width of the first item is correct");
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 58, 1, "Width of the second item is correct");
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 46, 1, "Width of the third item is correct");
});
