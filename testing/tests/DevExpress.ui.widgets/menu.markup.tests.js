import $ from "jquery";
import fx from "animation/fx";

import "ui/menu/ui.menu";
import "ui/menu/ui.submenu";

import "common.css!";

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
