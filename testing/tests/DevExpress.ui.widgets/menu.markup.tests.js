import $ from "jquery";
import fx from "animation/fx";
import checkStyleHelper from "../../helpers/checkStyleHelper.js";

import "ui/menu/ui.menu";
import "ui/menu/ui.submenu";

import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    const markup =
        '<div id="menu"></div>';

    $("#qunit-fixture").html(markup);
});

const DX_MENU_CLASS = "dx-menu",
    DX_MENU_ITEM_CLASS = DX_MENU_CLASS + "-item",
    DX_MENU_ITEM_SELECTED_CLASS = "dx-menu-item-selected",
    DX_MENU_HORIZONTAL = "dx-menu-horizontal",
    DX_MENU_ITEM_POPOUT_CLASS = DX_MENU_ITEM_CLASS + "-popout";

const createMenu = (options) => {
    let $menu = $("#menu").dxMenu(options),
        menuInstance = $menu.dxMenu("instance");

    return { instance: menuInstance, element: $menu };
};

const toSelector = cssClass => "." + cssClass;

QUnit.module("Menu rendering", {
    beforeEach: () => {
        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
});

QUnit.test("Render items with custom model", (assert) => {
    let menu = createMenu({
            items: [{
                name: "item 1",
                child: [{
                    name: "item 11",
                    child: [
                        { name: "item 111" }
                    ]
                }]
            }],
            displayExpr: "name",
            itemsExpr: "child",
            showFirstSubmenuMode: "onClick"
        }),
        $item1 = $(menu.element).find(toSelector(DX_MENU_ITEM_CLASS)).eq(0);

    assert.equal($item1.text(), "item 1", "root item rendered correct");
    assert.ok($item1.find(toSelector(DX_MENU_ITEM_POPOUT_CLASS)).length, "popout was rendered");
});

QUnit.test("Check default css class", (assert) => {
    let menu = createMenu({});

    assert.ok($(menu.element).hasClass(DX_MENU_CLASS));
});

QUnit.test("Do not render menu with empty items", (assert) => {
    let menu = createMenu({ items: [] }),
        root = $(menu.element).find(toSelector(DX_MENU_HORIZONTAL));

    assert.ok(menu);
    assert.equal(root.length, 0, "no root");
});

QUnit.test("Check item template styles - not focused", function(assert) {
    if(!checkStyleHelper.isChromeOnDesktop(assert)) {
        return;
    }

    const $template = $("<div>").text("test1");
    createMenu({
        items: [{ text: "item1" }],
        itemTemplate: function() { return $template; }
    });
    $("#input1").focus();

    checkStyleHelper.checkColor(assert, $template[0], "rgb(51, 51, 51)");
    checkStyleHelper.checkBackgroundColor(assert, $template[0], "rgba(0, 0, 0, 0)");
    checkStyleHelper.checkOverflowX(assert, $template[0], "visible");
    checkStyleHelper.checkTextOverflow(assert, $template[0], "clip");
    checkStyleHelper.checkWhiteSpace(assert, $template[0], "nowrap");
});

QUnit.testInActiveWindow("Check item template styles - focused", function(assert) {
    if(!checkStyleHelper.isChromeOnDesktop(assert)) {
        return;
    }

    const $template = $("<div>").text("test1");
    const menu = createMenu({
        items: [{ text: "item1" }],
        itemTemplate: function() { return $template; }
    });
    menu.instance.focus();

    checkStyleHelper.checkColor(assert, $template[0], "rgb(255, 255, 255)");
    checkStyleHelper.checkBackgroundColor(assert, $template[0], "rgb(51, 122, 183)");
    checkStyleHelper.checkOverflowX(assert, $template[0], "visible");
    checkStyleHelper.checkTextOverflow(assert, $template[0], "clip");
    checkStyleHelper.checkWhiteSpace(assert, $template[0], "nowrap");
});

QUnit.module("Menu - selection", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: () => {
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test("Create root childfree item selected", (assert) => {
    let menu = createMenu({
            items: [{ text: "root", selected: true }],
            selectionMode: "single"
        }),
        item1 = $(menu.element).find(toSelector(DX_MENU_ITEM_CLASS)).eq(0);
    assert.ok(item1.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
});


QUnit.module("Menu with templates", {
    beforeEach: () => {
        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
});

QUnit.test("Create items with template", (assert) => {
    let $template = $("<div>").text("test"),
        options = {
            showFirstSubmenuMode: "onClick",
            items: [
                { text: "item1" },
                {
                    text: "item2",
                    items: [
                        { text: "item2-1" },
                        { text: "item2-2" }
                    ]
                }
            ],
            itemTemplate: $template
        },
        menu = createMenu(options),
        $item = $(menu.element).find(toSelector(DX_MENU_ITEM_CLASS)).eq(1);

    $($item).trigger("dxclick");

    assert.equal($($item).text(), "test", "template rendered");
});


QUnit.module("aria accessibility");

QUnit.test("Aria role", (assert) => {
    let menu = createMenu();

    assert.equal(menu.element.attr("role"), "menubar");
});
