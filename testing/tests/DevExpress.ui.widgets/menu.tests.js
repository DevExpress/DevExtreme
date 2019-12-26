var $ = require('jquery'),
    devices = require('core/devices'),
    fx = require('animation/fx'),
    renderer = require('core/renderer'),
    isRenderer = require('core/utils/type').isRenderer,
    config = require('core/config'),
    Submenu = require('ui/menu/ui.submenu'),
    resizeCallbacks = require('core/utils/resize_callbacks'),
    Menu = require('ui/menu/ui.menu'),
    keyboardMock = require('../../helpers/keyboardMock.js'),
    fixtures = require('../../helpers/positionFixtures.js'),
    CustomStore = require('data/custom_store'),
    ArrayStore = require('data/array_store'),
    eventsEngine = require('events/core/events_engine'),
    DataSource = require('data/data_source/data_source').DataSource,
    checkStyleHelper = require('../../helpers/checkStyleHelper.js');

require('common.css!');
require('generic_light.css!');

QUnit.testStart(function() {
    var markup =
        '<script type="text/html" id="menuScriptTemplate">\
            <div>\
                <div>Menu Test</div>\
            </div>\
        </script>\
        <div id="simpleMenu"></div>\
        <div id="menu"></div>\
        <div id="menuWithCustomTemplates">\
            <div data-options="dxTemplate: {name: \'custom\' }">test</div>\
        </div>\
        <div id="menuKeyboard"></div>';

    $('#qunit-fixture').html(markup);
});

var DX_MENU_CLASS = 'dx-menu',
    DX_SUBMENU_CLASS = 'dx-submenu',
    DX_MENU_ITEM_CLASS = DX_MENU_CLASS + '-item',
    DX_MENU_ITEM_SELECTED_CLASS = 'dx-menu-item-selected',
    DX_MENU_ITEM_EXPANDED_CLASS = 'dx-menu-item-expanded',
    DX_MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text',
    DX_CONTEXT_MENU_CLASS = 'dx-context-menu',
    DX_CONTEXT_MENU_DELIMETER_CLASS = 'dx-context-menu-content-delimiter',
    DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = 'dx-context-menu-container-border',
    DX_MENU_HORIZONTAL = 'dx-menu-horizontal',
    DX_MENU_ITEM_POPOUT_CLASS = DX_MENU_ITEM_CLASS + '-popout',
    DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = DX_MENU_CLASS + '-hamburger-button',
    DX_ADAPTIVE_MODE_CLASS = DX_MENU_CLASS + '-adaptive-mode',
    DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = DX_ADAPTIVE_MODE_CLASS + '-overlay-wrapper',
    DX_TREEVIEW_CLASS = 'dx-treeview',
    DX_TREEVIEW_ITEM_CLASS = DX_TREEVIEW_CLASS + '-item',

    DX_STATE_FOCUSED_CLASS = 'dx-state-focused',
    DX_STATE_ACTIVE_CLASS = 'dx-state-active',

    CLICKTIMEOUT = 51,
    ANIMATION_TIMEOUT = 100,
    MENU_ITEM_WIDTH = 100,
    MOUSETIMEOUT = 50;

var isDeviceDesktop = function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'if device is not desktop we do not test the case');
        return false;
    }
    return true;
};

QUnit.module('Render content delimiters', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Render horizontal content delimiter', function(assert) {
        var options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] },
            menu = createMenuInWindow(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            delimiter;

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(delimiter.height(), 2, 'ok');
        assert.notEqual(delimiter.width(), 0, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().left + 1, delimiter.offset().left, 1, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top - 1, delimiter.offset().top, 1, 'ok');
    });

    QUnit.test('Render vertical content delimiter', function(assert) {
        var options = { orientation: 'vertical', showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] },
            menu = createMenuInWindow(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            delimiter;

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(delimiter.width(), 2, 'ok');
        assert.notEqual(delimiter.height(), 0, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().left - 1, delimiter.offset().left, 1, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top + 1, delimiter.offset().top, 1, 'ok');
    });

    QUnit.test('Render horizontal rtl content delimiter', function(assert) {
        var options = { rtlEnabled: true, showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] },
            menu = createMenuInWindow(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            delimiter;

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(delimiter.height(), 2, 'ok');
        assert.notEqual(delimiter.width(), 0, 'ok');
        assert.roughEqual(rootMenuItem.offset().left + 1, delimiter.offset().left, 1, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top - 1, delimiter.offset().top, 1, 'ok');
    });

    QUnit.test('Render vertical rtl content delimiter', function(assert) {
        var options = { rtlEnabled: true, orientation: 'vertical', showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] },
            menu = createMenuInWindow(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            delimiter;

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(delimiter.width(), 2, 'ok');
        assert.notEqual(delimiter.height(), 0, 'ok');
        assert.roughEqual(rootMenuItem.offset().left - 1, delimiter.offset().left, 1, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top + 1, delimiter.offset().top, 1, 'ok');
    });

    QUnit.test('container border should not be hidden when non-top level submenu hides', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        var menu = createMenuInWindow({
                showSubmenuMode: 'onHover',
                items: [{
                    text: 'item 1', items: [
                        { text: 'item 11', items: [{ text: 'item 111' }] },
                        { text: 'item 12' }
                    ]
                }]
            }),
            $rootMenuItem = menu.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        // Opening all submenu levels
        $rootMenuItem.trigger('dxclick');
        var firstLevelSubmenu = getSubMenuInstance($rootMenuItem);

        hoverSubmenuItemByIndex(firstLevelSubmenu, 0);
        this.clock.tick(ANIMATION_TIMEOUT);

        var $items = firstLevelSubmenu.itemElements(),
            $border = $rootMenuItem.find('.' + DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS);

        assert.equal($items.length, 3, 'all menus are rendered');
        assert.ok($border.is(':visible'), 'border is visible');

        // Closing second level submenu
        hoverSubmenuItemByIndex(firstLevelSubmenu, 2);
        this.clock.tick(ANIMATION_TIMEOUT);

        assert.ok($border.is(':visible'), 'border is still visible after second level submenu closed');
    });
});

QUnit.module('Menu rendering', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('Render items with custom model', function(assert) {
        var menu = createMenu({
                items: [{
                    name: 'item 1',
                    child: [{
                        name: 'item 11',
                        child: [
                            { name: 'item 111' }
                        ]
                    }]
                }],
                displayExpr: 'name',
                itemsExpr: 'child',
                showFirstSubmenuMode: 'onClick'
            }),
            $item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $item11,
            $item111;

        assert.equal($item1.text(), 'item 1', 'root item rendered correct');
        assert.ok($item1.find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 'popout was rendered');

        $($item1).trigger('dxclick');
        submenu = getSubMenuInstance($item1)._overlay.$content();
        $item11 = submenu.find('.' + DX_MENU_ITEM_CLASS).eq(0);
        assert.equal($item11.text(), 'item 11');
        assert.ok($item11.find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 'popout was rendered');

        $($item11).trigger('dxclick');
        submenu = getSubMenuInstance($item1)._overlay.$content();
        $item111 = submenu.find('.' + DX_MENU_ITEM_CLASS).eq(1);
        assert.equal($item111.text(), 'item 111');
    });

    QUnit.test('Do not render menu with empty items', function(assert) {
        var menu = createMenu({ items: [] }),
            submenus = $(menu.element).find('.' + DX_SUBMENU_CLASS),
            root = $(menu.element).find('.' + DX_MENU_HORIZONTAL);

        assert.ok(menu);
        assert.equal(submenus.length, 0, 'no levels');
        assert.equal(root.length, 0, 'no root');
    });

    QUnit.test('Do not render submenu with empty items', function(assert) {
        var menu = createMenu({ items: [{ text: 'item1' }, { text: 'item2', items: [] }] }),
            submenus = $(menu.element).find('.' + DX_SUBMENU_CLASS),
            root = $(menu.element).find('.' + DX_MENU_HORIZONTAL);

        assert.ok(menu);
        assert.equal(submenus.length, 0, 'no levels');
        assert.equal(root.length, 1, 'just root level');
    });

    QUnit.test('Don\'t create submenu on rendering', function(assert) {
        var menu = createMenu({ items: [{ text: 'item1', items: [{}] }] }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.equal($rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length, 0);
    });

    QUnit.test('Render custom template for submenu items', function(assert) {
        var $menu = $('#menuWithCustomTemplates').dxMenu({
                showFirstSubmenuMode: 'onClick',
                items: [{
                    text: 'item1',
                    items: [{ template: 'custom' }]
                }]
            }),
            rootMenuItem = $($menu.dxMenu('instance').$element()).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu;

        assert.equal($menu.find('.' + DX_MENU_ITEM_CLASS).length, 1);
        rootMenuItem.trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.equal($(submenu._overlay.$content()).find('.' + DX_MENU_ITEM_CLASS).eq(0).text(), 'test');
    });

    QUnit.test('Render custom template via script (T195165)', function(assert) {
        var $menu = $('#menu').dxMenu({
                showFirstSubmenuMode: 'onClick',
                dataSource: [
                    {
                        text: 'Open Menu',
                        items: [{ selectable: false, disabled: false, template: $('#menuScriptTemplate') }]
                    }]
            }),
            rootMenuItem = $($menu.dxMenu('instance').$element()).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu;

        assert.equal($menu.find('.' + DX_MENU_ITEM_CLASS).length, 1);
        rootMenuItem.trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.equal($.trim($(submenu._overlay.$content()).find('.' + DX_MENU_ITEM_CLASS).eq(0).text()), 'Menu Test');
    });

    QUnit.test('Render horizontal menu with default submenuDirection', function(assert) {
        var menu = createMenuInWindow({
                showFirstSubmenuMode: 'onClick',
                items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }]
            }),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu;

        assert.ok(menu);
        assert.ok(!submenu);
        rootMenuItem.trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu.option('visible'));
        assert.ok($(submenu._$element[0]).offset().top > $(rootMenuItem[0]).offset().top);
        assert.ok($(submenu._$element[0]).offset().left === $(rootMenuItem[0]).offset().left);
    });

    QUnit.test('Render vertical menu with default submenuDirection', function(assert) {
        fixtures.simple.create();
        var $menu = $('#what').dxMenu({
                orientation: 'vertical',
                showFirstSubmenuMode: 'onClick',
                items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }]
            }),
            rootMenuItem = $($menu.find('.' + DX_MENU_ITEM_CLASS)[0]),
            submenu;

        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        rootMenuItem.trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem)._overlay;
        assert.ok(submenu.option('visible'));
        assert.equal(Math.round($(submenu._$content[0]).offset().top), Math.round($(rootMenuItem[0]).offset().top));
        assert.ok($(submenu._$content[0]).offset().left > $(rootMenuItem[0]).offset().left);
        fixtures.simple.drop();
    });

    QUnit.test('Render menu with leftOrTop submenuDirection', function(assert) {
        fixtures.simple.create();
        var $menu = $('#what').dxMenu({
                showFirstSubmenuMode: 'onClick',
                submenuDirection: 'leftOrTop',
                items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }]
            }).css({
                top: 100,
                left: 100
            }),
            rootMenuItem = $($menu.find('.' + DX_MENU_ITEM_CLASS)[0]),
            submenu;

        assert.ok($menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        rootMenuItem.trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem)._overlay;
        assert.ok(submenu.option('visible'));
        assert.ok($(submenu._$content[0]).offset().top < $(rootMenuItem[0]).offset().top);
        assert.ok($(submenu._$content[0]).offset().left === $(rootMenuItem[0]).offset().left);
        fixtures.simple.drop();
    });

    QUnit.test('Render vertical menu with leftOrTop submenuDirection', function(assert) {
        fixtures.simple.create();
        var $menu = $('#what').dxMenu({ orientation: 'vertical', showFirstSubmenuMode: 'onClick', submenuDirection: 'leftOrTop', items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }] }).css({
                top: 100,
                left: 100
            }),
            rootMenuItem = $($menu.find('.' + DX_MENU_ITEM_CLASS)[0]),
            submenu;

        assert.ok($menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        rootMenuItem.trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem)._overlay;
        assert.ok(submenu.option('visible'));
        assert.equal(Math.round($(submenu._$content[0]).offset().top), Math.round($(rootMenuItem[0]).offset().top));
        assert.ok($(submenu._$content[0]).offset().left < $(rootMenuItem[0]).offset().left);
        fixtures.simple.drop();
    });
});

QUnit.module('Menu - templates', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    checkStyleHelper.testInChromeOnDesktopActiveWindow('Item template styles when item is not focused', function(assert) {
        const $template = $('<div>').text('test1');
        createMenu({
            items: [{ text: 'item1' }],
            itemTemplate: function() { return $template; }
        });
        $('#input1').focus();

        assert.strictEqual(checkStyleHelper.getColor($template[0]), 'rgb(51, 51, 51)', 'color');
        assert.strictEqual(checkStyleHelper.getBackgroundColor($template[0]), 'rgba(0, 0, 0, 0)', 'backgroundColor');
        assert.strictEqual(checkStyleHelper.getOverflowX($template[0].parentNode), 'visible', 'overflowX');
        assert.strictEqual(checkStyleHelper.getTextOverflow($template[0].parentNode), 'clip', 'textOverflow');
        assert.strictEqual(checkStyleHelper.getWhiteSpace($template[0].parentNode), 'nowrap', 'whiteSpace');
    });

    checkStyleHelper.testInChromeOnDesktopActiveWindow('Item template styles when item is focused', function(assert) {
        const $template = $('<div>').text('test1');
        const menu = createMenu({
            items: [{ text: 'item1' }],
            itemTemplate: function() { return $template; }
        });
        menu.instance.focus();

        assert.strictEqual(checkStyleHelper.getColor($template[0]), 'rgb(255, 255, 255)', 'color');
        assert.strictEqual(checkStyleHelper.getBackgroundColor($template[0]), 'rgb(51, 122, 183)', 'backgroundColor');
        assert.strictEqual(checkStyleHelper.getOverflowX($template[0].parentNode), 'visible', 'overflowX');
        assert.strictEqual(checkStyleHelper.getTextOverflow($template[0].parentNode), 'clip', 'textOverflow');
        assert.strictEqual(checkStyleHelper.getWhiteSpace($template[0].parentNode), 'nowrap', 'whiteSpace');
    });
});

QUnit.module('Menu - selection', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Menu should not crash when items changed (T310030)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var items = [{ text: 'root', selected: false, items: [{ text: 'submenu' }] }],
            changedItems = [{ text: 'root1', selected: true, items: [{ text: 'submenu1' }] }],
            menu = createMenu({
                items: items,
                selectionMode: 'single',
                showFirstSubmenuMode: 'onHover',
                selectByClick: true,
                onItemClick: function(e) {
                    e.component.option('items', changedItems);
                }
            }),
            $rootItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        $($rootItem).trigger('dxpointermove');
        this.clock.tick(0);

        var submenu = getSubMenuInstance($rootItem),
            $submenuItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0));

        $($submenuItem).trigger('dxclick');
        assert.ok(true, 'menu does not crash');
    });

    QUnit.test('Try to set selected state of several items via item.selected option 2', function(assert) {
        var items = [
                { text: 'item1', selected: true },
                {
                    text: 'item2',
                    items: [
                        { text: 'item2-1', selected: true },
                        {
                            text: 'item2-2',
                            items: [{ text: 'item2-2-1', selected: true }]
                        }
                    ]
                },
                { text: 'item3', selected: true }],
            menu, $items;

        menu = createMenu({
            items: items,
            selectionMode: 'single'
        });

        $items = $(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS);
        assert.equal($items.length, 1);
        assert.equal($items.find('.' + DX_MENU_ITEM_TEXT_CLASS).text(), 'item3');
    });

    QUnit.test('Selection in different submenus', function(assert) {
        var items = [
                { text: 'root1', items: [{ text: 'item1-1' }] },
                { text: 'root2', items: [{ text: 'item2-1' }] },
                { text: 'root3', items: [{ text: 'item3-1' }] }
            ],
            menu = createMenu({
                items: items,
                showSubmenuMode: 'onClick',
                selectByClick: true,
                selectionMode: 'single'
            }),
            item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            item2 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(1),
            item3 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(2),
            item11, item21, item31, submenu;


        assert.ok(menu, 'menu is created');
        assert.equal($(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        item1.trigger('dxclick');
        submenu = getSubMenuInstance(item1);
        item11 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        item11.trigger('dxclick');
        assert.ok(item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));

        item2.trigger('dxclick');
        submenu = getSubMenuInstance(item2);
        item21 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        item21.trigger('dxclick');
        assert.ok(!item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.ok(item21.hasClass(DX_MENU_ITEM_SELECTED_CLASS));

        item3.trigger('dxclick');
        submenu = getSubMenuInstance(item3);
        item31 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        item31.trigger('dxclick');
        assert.ok(!item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.ok(!item21.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.ok(item31.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
    });

    QUnit.test('Change selection in submenu (T310158)', function(assert) {
        var items = [
                { text: 'root1', items: [{ text: 'item1-1', selected: true }] },
                { text: 'root2', items: [{ text: 'item2-1' }] },
                { text: 'root3', items: [{ text: 'item3-1' }] }
            ],
            menu = createMenu({
                items: items,
                showFirstSubmenuMode: 'onClick',
                selectByClick: true,
                selectionMode: 'single'
            }),
            $item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($item1).trigger('dxclick');
        var submenu = getSubMenuInstance($item1),
            $nestedItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_SELECTED_CLASS));

        submenu.unselectItem($nestedItem.get(0));

        assert.expect(0);

    });

    QUnit.test('Change selection via API in single selection mode', function(assert) {
        var items = [
            { text: 'Item 1', items: [{ text: 'Item 11' }] },
            { text: 'Item 2', items: [{ text: 'Item 21' }] },
            { text: 'Item 3', items: [{ text: 'Item 31' }] }
        ];

        var menu = createMenu({
            items: items,
            showFirstSubmenuMode: 'onClick',
            selectByClick: true,
            selectionMode: 'single'
        });

        var $itemElements = menu.instance.itemElements();

        var getSelectedSubmenuItems = function($rootItem) {
            var submenu = getSubMenuInstance($rootItem);
            return submenu.itemElements().filter('.' + DX_MENU_ITEM_SELECTED_CLASS);
        };

        menu.instance.option('selectedItem', items[0].items[0]);
        $($itemElements.eq(0)).trigger('dxclick');
        var $selectedItems = getSelectedSubmenuItems($itemElements.eq(0));
        assert.equal($selectedItems.length, 1, 'only one item in first submenu is selected');
        assert.equal($selectedItems.eq(0).text(), 'Item 11', 'selected item is correct');

        menu.instance.option('selectedItem', items[1].items[0]);
        $($itemElements.eq(1)).trigger('dxclick');
        assert.equal(getSelectedSubmenuItems($itemElements.eq(0)).length, 0, 'first submenu has no selected items after option changed');
        $selectedItems = getSelectedSubmenuItems($itemElements.eq(1));
        assert.equal($selectedItems.length, 1, 'only one item in second submenu is selected');
        assert.equal($selectedItems.eq(0).text(), 'Item 21', 'selected item is correct');
    });

    QUnit.test('Change selection via API function .select()', function(assert) {
        var items = [
                { text: 'root1', items: [{ text: 'item1-1' }] },
                { text: 'root2', items: [{ text: 'item2-1' }] }
            ],
            menu = createMenu({
                items: items,
                selectByClick: true,
                selectionMode: 'single'
            }),
            $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS),
            $item1 = $items.eq(0),
            $item2 = $items.eq(1),
            submenu, $item11;

        assert.ok(menu, 'menu is created');
        assert.equal($(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        menu.instance.selectItem(items[0].items[0]);
        assert.equal(menu.instance.option('selectedItem').text, 'item1-1');
        $($item1).trigger('dxclick');
        submenu = getSubMenuInstance($item1);
        assert.equal($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 1);
        $item11 = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0));

        menu.instance.selectItem(items[1].items[0]);
        assert.equal(menu.instance.option('selectedItem').text, 'item2-1');
        assert.ok(!$item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        $($item2).trigger('dxclick');
        submenu = getSubMenuInstance($item2);
        assert.equal($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 1);

        menu.instance.selectItem($item11[0]);
        assert.equal(menu.instance.option('selectedItem').text, 'item1-1');
        $($item1).trigger('dxclick');
        submenu = getSubMenuInstance($item1);
        assert.equal($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 1);
    });

    QUnit.test('onSelectionChanged fires only at childfree item', function(assert) {
        var counter = 0,
            menu = createMenu({
                items: [{ text: 'root1', items: [{ text: 'item1-1' }] }],
                selectByClick: true,
                selectionMode: 'single',
                onSelectionChanged: function() {
                    counter++;
                }
            }),
            item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0), submenu, item11;

        assert.ok(menu, 'menu is created');
        assert.equal($(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        item1.trigger('dxclick');
        assert.equal(counter, 0);
        submenu = getSubMenuInstance(item1);
        item11 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        item11.trigger('dxclick');
        this.clock.tick(CLICKTIMEOUT);
        assert.ok(item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.equal(counter, 1);
    });

    // T420860
    QUnit.test('It should be possible to select nested submenu by itemData', function(assert) {
        var items = [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111', selectable: true }] }] }],
            menu = createMenu({
                items: items,
                onItemClick: function(e) {
                    if(e.itemData.selectable) {
                        e.component.selectItem(e.itemData);
                    }
                }
            }),
            $rootItem = menu.instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).eq(0),
            getSubmenuItem = function(submenu, index) {
                return $(submenu.itemsContainer()).find('.' + DX_MENU_ITEM_CLASS).eq(index);
            };

        try {
            fx.off = false;
            $($rootItem).trigger('dxclick');

            var submenu = getSubMenuInstance($rootItem),
                $item = getSubmenuItem(submenu, 0);

            $($item).trigger('dxclick');

            $item = getSubmenuItem(submenu, 1);
            $($item).trigger('dxclick');

            assert.ok($item.hasClass(DX_MENU_ITEM_SELECTED_CLASS), 'nested item was selected');
        } finally {
            fx.off = true;
        }
    });
});

QUnit.module('Menu tests', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Show submenu onClick', function(assert) {
        var options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] },
            menu = createMenu(options),
            $itemB = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu;

        $($itemB).trigger('dxclick');

        submenu = getSubMenuInstance($itemB);
        assert.ok($itemB.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'expanded submenu should have expanded class');
        assert.ok(submenu.option('visible'), 'submenu was shown');

        $($itemB).trigger('dxclick');

        this.clock.tick(51);
        assert.ok(!$itemB.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'collapsed submenu should not have expanded class');
        assert.ok(!submenu.option('visible'), 'submenu was hidden');
    });

    QUnit.test('Submenu should be shown on touch click', function(assert) {
        var menu = createMenu({
                showFirstSubmenuMode: 'onClick',
                items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }]
            }),
            $itemsContainer = menu.instance.itemsContainer(),
            $rootItem = menu.instance.itemElements().eq(0),
            e = $.Event('dxpointerdown', { target: $rootItem.get(0) });

        $($itemsContainer).trigger(e);
        assert.notOk(e.isDefaultPrevented(), 'item pointerdown should not be prevented');
    });

    QUnit.test('Hide submenu when click on another item', function(assert) {
        var options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'item 1', items: [{ text: 'item 11' }] }, { text: 'item 2', items: [{ text: 'item 21' }] }] },
            menu = createMenu(options),
            $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS),
            $item1 = $items.eq(0),
            $item2 = $items.eq(1),
            submenu;

        $($item2).trigger('dxclick');
        submenu = getSubMenuInstance($item2);
        assert.ok(submenu.option('visible'), 'item 21 was shown');

        $($item1).trigger('dxclick');
        assert.ok(!submenu.option('visible'), 'item 21 was hidden');

        submenu = getSubMenuInstance($item1);
        assert.ok(submenu.option('visible'), 'item 11 was shown');
    });

    QUnit.test('Close submenu when the page is scrolled', function(assert) {
        var options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'item 1', items: [{ text: 'item 11' }] }, { text: 'item 2', items: [{ text: 'item 21' }] }] },
            menu = createMenu(options),
            $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS),
            $item2 = $items.eq(1),
            submenu;

        $($item2).trigger('dxclick');
        submenu = getSubMenuInstance($item2);
        assert.ok(submenu.option('visible'), 'submenu was opened');

        eventsEngine.trigger($('body'), 'scroll');
        assert.notOk(submenu.option('visible'), 'submenu was closed');
    });

    QUnit.test('Don\'t hide submenu when cancel is true', function(assert) {
        var i = 0,
            options = {
                showFirstSubmenuMode: 'onClick',
                items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }],
                onSubmenuHiding: function(args) {
                    args.cancel = true;
                    i++;
                }
            },
            menu = createMenu(options),
            $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS),
            $itemA = $items.eq(0),
            submenu = getSubMenuInstance($itemA);

        assert.ok(menu);
        assert.ok(!submenu, 'submenu does not exists because of lazy rendering');

        $($itemA).trigger('dxclick');
        submenu = getSubMenuInstance($itemA);
        assert.ok(submenu._overlay.option('visible'));

        $(document).trigger('dxpointerdown'); // it needs to trigger closeOnOutsideClick
        assert.ok(submenu._overlay.option('visible'));
        assert.equal(i, 1, 'event triggered');
    });

    QUnit.test('Fire submenu events for all levels', function(assert) {
        var handlerShowing = sinon.stub(),
            handlerShown = sinon.stub(),
            handlerHiding = sinon.stub(),
            handlerHidden = sinon.stub(),
            options = {
                showFirstSubmenuMode: 'onClick',
                showSubmenuMode: 'onClick',
                items: [{
                    text: 'rootItem',
                    items: [{
                        text: 'item1',
                        items: [{ text: 'item1-1' }]
                    }, {
                        text: 'item2',
                        items: [{ text: 'item2-1' }],
                    }]
                }],
                onSubmenuShowing: handlerShowing,
                onSubmenuShown: handlerShown,
                onSubmenuHiding: handlerHiding,
                onSubmenuHidden: handlerHidden
            },
            menu = createMenu(options),
            $rootItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        // show submenu
        $($rootItem).trigger('dxclick');
        assert.equal(handlerShowing.callCount, 1);
        assert.equal(handlerShown.callCount, 1);
        assert.equal(handlerHiding.callCount, 0);
        assert.equal(handlerHidden.callCount, 0);

        var submenu = getSubMenuInstance($rootItem),
            $submenuItems = submenu.itemElements();

        // show second level first time
        $($submenuItems.eq(0)).trigger('dxclick');
        assert.equal(handlerShowing.callCount, 2);
        assert.equal(handlerShown.callCount, 2);
        assert.equal(handlerHiding.callCount, 0);
        assert.equal(handlerHidden.callCount, 0);

        // show second level second time
        $($submenuItems.eq(1)).trigger('dxclick');
        assert.equal(handlerShowing.callCount, 3);
        assert.equal(handlerShown.callCount, 3);
        assert.equal(handlerHiding.callCount, 1);
        assert.equal(handlerHidden.callCount, 1);
    });

    QUnit.test('only visible submenu should be hidden on outside click', function(assert) {
        var hiddenHandler = sinon.spy(),
            menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }],
                onSubmenuHidden: hiddenHandler
            }),
            $rootItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');
        $(document).trigger('dxpointerdown');

        assert.equal(hiddenHandler.callCount, 1, 'only 1 submenu was hidden');
    });

    QUnit.test('Do not show contextmenu on hover with pressed mouse button', function(assert) {
        var options = { showFirstSubmenuMode: 'onHover', items: [{ text: 'item1', items: [{ text: 'item1-1' }] }] },
            menu = createMenu(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            e = $.Event('mouseenter');
        e.which = 1;

        assert.ok(menu);
        $(rootMenuItem).trigger(e);
        submenu = rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS);
        assert.ok(!submenu.length, 'Menu is not shown');
    });

    QUnit.test('Menu was not shown on some browsers with not synchronized mouse event arguments (T191149)', function(assert) {
        var options = { showFirstSubmenuMode: 'onHover', items: [{ text: 'item1', items: [{ text: 'item1-1' }] }] },
            menu = createMenu(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $itemContainer = menu.instance.itemsContainer(),
            e = $.Event('dxhoverstart', { target: rootMenuItem.get(0) });
        e.which = 1;
        e.buttons = 0; // https://bugzilla.mozilla.org/show_bug.cgi?id=1048294

        if(isDeviceDesktop(assert)) {
            assert.ok(menu);
            $($itemContainer).trigger(e);
            $(rootMenuItem).trigger('dxpointermove');
            this.clock.tick(MOUSETIMEOUT);
            submenu = getSubMenuInstance(rootMenuItem),
            assert.ok(submenu._overlay.option('visible'), 'Menu is shown');
        }
    });

    QUnit.test('Show submenu onHover', function(assert) {
        var menu = createMenuForHoverStay({ showFirstSubmenuMode: 'onHover', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] }),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $itemContainer = menu.instance.itemsContainer();

        if(isDeviceDesktop(assert)) {
            $($itemContainer).trigger($.Event('dxhoverstart', { target: rootMenuItem.get(0) }));
            $(rootMenuItem).trigger('dxpointermove');
            submenu = getSubMenuInstance(rootMenuItem);
            this.clock.tick(MOUSETIMEOUT / 2);
            assert.ok(!submenu._overlay.option('visible'), 'Submenu is not visible yet');
            this.clock.tick(MOUSETIMEOUT / 2);
            assert.ok(submenu._overlay.option('visible'), 'Submenu is visible');
        }
    });

    QUnit.test('Show submenu onHover with custom timeout set as an object', function(assert) {
        var menu = createMenuForHoverStay({ showFirstSubmenuMode: { name: 'onHover', delay: { show: 300, hide: 700 } }, items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] }),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $itemContainer = menu.instance.itemsContainer();

        if(isDeviceDesktop(assert)) {
            $($itemContainer).trigger($.Event('dxhoverstart', { target: rootMenuItem.get(0) }));
            $(rootMenuItem).trigger('dxpointermove');
            submenu = getSubMenuInstance(rootMenuItem);
            this.clock.tick(150);
            assert.ok(!submenu._overlay.option('visible'), 'Submenu is not visible yet');
            this.clock.tick(301);
            assert.ok(submenu._overlay.option('visible'), 'Submenu is visible');
        }
    });

    QUnit.test('Show submenu onHover with custom timeout set as a number', function(assert) {
        var menu = createMenuForHoverStay({ showFirstSubmenuMode: { name: 'onHover', delay: 500 }, items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] }),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $itemContainer = menu.instance.itemsContainer();

        if(isDeviceDesktop(assert)) {
            $($itemContainer).trigger($.Event('dxhoverstart', { target: rootMenuItem.get(0) }));
            $(rootMenuItem).trigger('dxpointermove');
            submenu = getSubMenuInstance(rootMenuItem);
            this.clock.tick(250);
            assert.ok(!submenu._overlay.option('visible'), 'Submenu is not visible yet');
            this.clock.tick(501);
            assert.ok(submenu._overlay.option('visible'), 'Submenu is visible');
        }
    });

    QUnit.test('Show submenu and sub-submenu by default', function(assert) {
        var items = [
                {
                    text: 'itemA',
                    items: [
                        {
                            text: 'itemA-A',
                            items: [
                                { text: 'itemA-A-A' }
                            ]
                        }
                    ]
                }],
            options = { items: items },
            menu = createMenu(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $menuItem,
            $submenu;

        assert.ok(menu);
        $(rootMenuItem).trigger('dxclick');
        submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));

        $menuItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).first()),
        assert.equal($menuItem.text(), 'itemA-A');
        $($menuItem).trigger('dxclick');
        $submenu = $($(submenu._overlay.content()).find('.' + DX_SUBMENU_CLASS).eq(1));
        this.clock.tick(ANIMATION_TIMEOUT);
        assert.equal($submenu.css('visibility'), 'visible');
    });

    QUnit.test('Show submenu and sub-submenu on hover', function(assert) {
        var items = [
                {
                    text: 'itemA',
                    items: [
                        {
                            text: 'itemA-A',
                            items: [
                                { text: 'itemA-A-A' }
                            ]
                        }
                    ]
                }],
            options = { showFirstSubmenuMode: 'onHover', items: items },
            menu = createMenu(options),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $menuItem,
            $submenu,
            $itemContainer = menu.instance.itemsContainer();

        if(isDeviceDesktop(assert)) {
            $($itemContainer).trigger($.Event('dxhoverstart', { target: rootMenuItem.get(0) }));
            $(rootMenuItem).trigger('dxpointermove');
            submenu = getSubMenuInstance(rootMenuItem);
            this.clock.tick(MOUSETIMEOUT);
            assert.ok(submenu._overlay.option('visible'));

            $menuItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).first());
            assert.equal($menuItem.text(), 'itemA-A');
            $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $menuItem.get(0) }));
            $($menuItem).trigger('dxpointermove');
            this.clock.tick(ANIMATION_TIMEOUT);
            $submenu = $($(submenu._overlay.content()).find('.' + DX_SUBMENU_CLASS).eq(1));
            assert.equal($submenu.css('visibility'), 'visible');
        }
    });

    QUnit.test('Do not show submenu on hover if item is disabled', function(assert) {
        var items = [
                {
                    text: 'itemB',
                    disabled: true,
                    items: [
                        { text: 'itemB-A' }
                    ]
                }
            ],
            menu = createMenu({ showFirstSubmenuMode: 'onHover', items: items }),
            rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            $itemContainer = menu.instance.itemsContainer(),
            submenu;

        if(isDeviceDesktop(assert)) {
            $($itemContainer).trigger($.Event('dxhoverstart', { target: rootMenuItem.get(0) }));
            $(rootMenuItem).trigger('dxpointermove');
            submenu = rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS);
            assert.ok(!submenu.length, 'Submenu is not visible yet');
        }
    });

    QUnit.test('Show submenu on hover and sub-submenu onClick', function(assert) {
        var items = [
                {
                    text: 'itemA',
                    items: [
                        {
                            text: 'itemA-A',
                            items: [
                                { text: 'itemA-A-A' }
                            ]
                        }
                    ]
                }],
            options = { showFirstSubmenuMode: 'onHover', showSubmenuMode: 'onClick', items: items },
            menu = createMenu(options),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu,
            $menuItem,
            $submenu,
            $itemContainer = menu.instance.itemsContainer();

        if(isDeviceDesktop(assert)) {
            assert.ok(menu);

            $($itemContainer).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
            $($rootMenuItem).trigger('dxpointermove');
            submenu = getSubMenuInstance($rootMenuItem);

            this.clock.tick(MOUSETIMEOUT);
            assert.ok(submenu._overlay.option('visible'));

            $menuItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).first());
            $($menuItem).trigger('dxclick');
            $submenu = $($(submenu._overlay.content()).find('.' + DX_SUBMENU_CLASS).eq(1));
            this.clock.tick(ANIMATION_TIMEOUT);
            assert.equal($submenu.css('visibility'), 'visible');
        }
    });

    QUnit.test('onItemRendered should fire for submenus', function(assert) {
        var calls = 0,
            menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
                showFirstSubmenuMode: 'onClick',
                onItemRendered: function() { calls++; }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        assert.equal(calls, 1, 'onItemRendered called once');
        $rootMenuItem
            .trigger('dxpointerdown') // it needs to trigger closeOnOutsideClick
            .trigger('dxclick');

        assert.equal(calls, 2, 'onItemRendered called twice');
    });

    QUnit.test('hover should not open menu when mouse button is pressed', function(assert) {

        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
                showFirstSubmenuMode: 'onHover'
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger($.Event('dxpointermove', { pointers: [ 1 ] }));

        this.clock.tick(300);

        var submenu = getSubMenuInstance($rootMenuItem);

        assert.notOk(submenu.option('visible'), 'submenu is invisible');
    });

    QUnit.test('hover on opened menu should not close it (T317062)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
                showFirstSubmenuMode: 'onHover'
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(300);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(300);

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu should not hide');

    });

    QUnit.test('Menu should show when show delay is 0', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
                showFirstSubmenuMode: { name: 'onHover', delay: 0 }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(0);

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');
    });

    QUnit.test('Menu should not be shown if hover was ended before show delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }],
                showFirstSubmenuMode: { name: 'onHover', delay: 500 }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');

        this.clock.tick(400);
        $(menu.element).trigger($.Event('dxhoverend', { target: $rootMenuItem.get(0) }));
        this.clock.tick(100);

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.notOk(submenu.option('visible'), 'submenu was not shown');
    });

    QUnit.test('Submenu should not be shown if hover was ended before show delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }],
                showSubmenuMode: { name: 'onHover', delay: 500 }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootMenuItem).trigger('dxclick');

        var submenu = getSubMenuInstance($rootMenuItem),
            $itemsContainer = submenu.itemsContainer(),
            $rootItem = submenu.itemElements().eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));

        this.clock.tick(400);
        $($itemsContainer).trigger($.Event('dxhoverend', { target: $rootItem.get(0) }));
        this.clock.tick(100);

        assert.equal(submenu.itemElements().length, 1, 'nested submenu was not rendered');
    });

    QUnit.test('Submenu shoyld not be hidden if other submenu was opened before hide delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [
                    { text: 'Item 1', items: [{ text: 'Item 11' }] },
                    { text: 'Item 2' },
                    { text: 'Item 3', items: [{ text: 'Item 21' }] }
                ],
                showFirstSubmenuMode: { name: 'onHover', delay: { show: 100, hide: 500 } }
            }),
            $rootMenuItems = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItems.eq(0).get(0) }));
        $($rootMenuItems.eq(0)).trigger('dxpointermove');
        this.clock.tick(100);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItems.eq(1).get(0) }));
        $($rootMenuItems.eq(1)).trigger('dxpointermove');
        this.clock.tick(100);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItems.eq(2).get(0) }));
        $($rootMenuItems.eq(2)).trigger('dxpointermove');
        this.clock.tick(500);

        var submenu = getSubMenuInstance($rootMenuItems.eq(2));
        assert.ok(submenu.option('visible'), 'second submenu should be visible');
    });

    QUnit.test('Submenu should not be closed after showFirstSubmenuMode option is changed', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }],
                showFirstSubmenuMode: { name: 'onHover', delay: { show: 500, hide: 400 } }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootMenuItem).trigger('dxclick');
        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu is visible');

        menu.instance.option('showFirstSubmenuMode', 'onClick');
        submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu is still visible');
    });

    QUnit.test('Menu should hide after mouseleave when pointer goes through siblings menus (T325923)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
                showFirstSubmenuMode: { name: 'onHover', delay: 0 },
                hideSubmenuOnMouseLeave: true
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $($rootMenuItem.eq(0)).trigger('dxpointermove');
        this.clock.tick(0);

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(1).get(0) }));
        $($rootMenuItem.eq(1)).trigger('dxpointermove');
        this.clock.tick(0);

        assert.notOk(submenu.option('visible'), 'submenu hidden');
    });

    QUnit.test('Menu should hide after mouseleave when hideOnMouseLeave = true', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
                showFirstSubmenuMode: { name: 'onHover', delay: 0 },
                hideSubmenuOnMouseLeave: true
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $($rootMenuItem.eq(0)).trigger('dxpointermove');
        this.clock.tick(0);

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');

        var $item = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS));

        $(menu.element).trigger($.Event('dxhoverstart', { target: $item.eq(0).get(0) }));
        $(menu.element).trigger($.Event('dxhoverend', { target: $item.eq(0).get(0) }));

        $(menu.element).trigger($.Event('dxhoverstart', { target: window }));
        $($(submenu._overlay.content()).find('.dx-submenu')).trigger('dxhoverend');
        this.clock.tick(0);

        assert.notOk(submenu.option('visible'), 'submenu hidden');
    });

    QUnit.test('Menu should not hide after mouseleave to children of a target', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
                showFirstSubmenuMode: { name: 'onHover', delay: 0 },
                hideSubmenuOnMouseLeave: true
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('click', { target: $rootMenuItem.eq(0).get(0) }));
        $(menu.element).trigger($.Event('mouseleave', { target: $rootMenuItem.eq(0).get(0), relatedTarget: $rootMenuItem.eq(0).children()[2] }));
        this.clock.tick(0);

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');
    });

    QUnit.test('Menu should show after it\'s submenu has been selected', function(assert) {
        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
                showFirstSubmenuMode: { name: 'onClick', delay: 0 }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootMenuItem).trigger('dxclick');

        var submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');

        $(submenu.itemsContainer()).find('.' + DX_MENU_ITEM_CLASS).eq(0).trigger('dxclick');
        assert.ok(!submenu.option('visible'), 'submenu hidden');

        $($rootMenuItem).trigger('dxclick');
        assert.ok(submenu.option('visible'), 'submenu shown again');
    });

    QUnit.test('Menu should not hide when root item clicked', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
                showFirstSubmenuMode: { name: 'onHover', delay: 0 }
            }),
            $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $($rootMenuItem.eq(0)).trigger('dxpointermove');
        this.clock.tick(0);

        var submenu = getSubMenuInstance($rootMenuItem),
            hidingCount = 0;

        submenu.option('onHiding', function() {
            hidingCount++;
        });

        $($rootMenuItem).trigger('dxclick');

        assert.ok(submenu.option('visible'), 'submenu shown');
        assert.equal(hidingCount, 0, 'submenu should not hides');
    });

    // T431949
    QUnit.test('Menu should stop show submenu timeout when another level submenu was hovered', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu = createMenu({
                items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2', items: [{ text: 'item 11' }] }],
                showFirstSubmenuMode: { name: 'onHover', delay: 50 }
            }),
            hoverMenuItem = function($item) {
                $(menu.element).trigger($.Event('dxhoverstart', { target: $item.get(0) }));
                $($item).trigger('dxpointermove');
            },
            $rootMenuItems = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        hoverMenuItem($rootMenuItems.eq(0));
        this.clock.tick(50);

        var submenu = getSubMenuInstance($rootMenuItems.eq(0)),
            $submenuItem = submenu.itemElements().eq(0);

        hoverMenuItem($rootMenuItems.eq(1));
        this.clock.tick(25);

        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $submenuItem.get(0) }));
        this.clock.tick(25);

        assert.ok(submenu.isOverlayVisible(), 'submenu is still visible');
    });

    QUnit.test('click should not be blocked on menu\'s item', function(assert) {
        var menu = createMenu({
                items: [{ text: 'Item 1' }]
            }),
            $item = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            clickHandler = sinon.stub();

        try {
            $(document).on('click', clickHandler);
            $item.trigger('click');

            assert.equal(clickHandler.callCount, 1, 'click was handled');
        } finally {
            $(document).off('click');
        }
    });

    QUnit.test('Hover root menu item -> move mouse pointer to the first submenu item (disabled)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        var menu$ = $('#menu').dxMenu({
                items: [{
                    text: 'Item 1',
                    items: [{
                        disabled: true, text: 'item 1_1'
                    }]
                }],
                showFirstSubmenuMode: { name: 'onHover', delay: 0 },
                hideSubmenuOnMouseLeave: true
            }),
            $rootMenuItem = $(menu$).find('.' + DX_MENU_ITEM_CLASS);

        menu$.trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));

        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(100);

        var submenu = getSubMenuInstance($rootMenuItem);
        var $subMenuItem = hoverSubmenuItemByIndex(submenu, 0);
        var oldQuerySelector = submenu.itemsContainer().get(0).querySelector;
        submenu.itemsContainer().get(0).querySelector = function(selectors) {
            if(selectors === ':hover') {
                return 'this is a DOM element';
            }
            return oldQuerySelector(selectors);
        };

        menu$.trigger($.Event('dxhoverend', { target: $rootMenuItem.get(0), relatedTarget: $subMenuItem }));
        this.clock.tick(100);

        submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        var options = {
            target: '#menuKeyboard',
            selectionMode: 'single',
            selectByClick: true,
            orientation: 'horizontal',
            items: [
                { text: 'item1' },
                {
                    text: 'item2',
                    items: [
                        { text: 'item2-1' },
                        {
                            text: 'item2-2',
                            items: [
                                { text: 'item2-2-1' },
                                { text: 'item2-2-2' }
                            ]
                        },
                        { text: 'item2-3' },
                        { text: 'item2-4' }
                    ]
                },
                { text: 'item3' }
            ],
            focusStateEnabled: true
        };

        fx.off = true;

        this.$element = $('#menu').dxMenu(options);
        this.instance = this.$element.dxMenu('instance');
        this.$itemsContainer = this.instance.itemsContainer();
        this.keyboard = keyboardMock(this.$itemsContainer);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.testInActiveWindow('rise onItemClick when enter pressed', function(assert) {
        var itemClickHandler = sinon.spy();

        this.instance.option('onItemClick', itemClickHandler);
        this.keyboard.press('enter');

        assert.equal(itemClickHandler.callCount, 1, 'press enter on item call item click action');
    });

    QUnit.test('select item when space pressed', function(assert) {
        this.keyboard
            .press('left')
            .press('space');

        assert.equal(isRenderer(this.instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal(this.instance.option('selectedItem').text, 'item3', 'correct item is selected');
    });

    QUnit.test('don\'t select an item when space pressed and selectionMode is none', function(assert) {
        this.instance.option('selectionMode', 'none');

        this.keyboard
            .press('right')
            .press('space');

        assert.equal(this.instance.option('selectedItem'), null, 'no item is selected');
    });

    QUnit.test('select an item when space pressed on an inner level', function(assert) {
        this.keyboard
            .press('right')
            .press('down')
            .press('down')
            .press('down')
            .press('down')
            .press('space');

        assert.equal(isRenderer(this.instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal(this.instance.option('selectedItem').text, 'item2-3', 'correct item is selected');
    });

    QUnit.testInActiveWindow('show submenu if exists when down key pressed', function(assert) {
        this.keyboard
            .press('right')
            .press('down')
            .press('down');

        assert.equal($(this.instance.option('focusedElement')).text(), 'item2-1', 'focus on first item of second submenu');

        this.keyboard
            .press('right');

        assert.equal($(this.instance.option('focusedElement')).text(), 'item3', 'after second right arrow key press we focus second item in main menu');
    });

    QUnit.testInActiveWindow('show submenu if exists when right key pressed in vertical menu', function(assert) {
        this.instance.option('orientation', 'vertical');
        this.keyboard
            .press('down')
            .press('right');

        this.keyboard
            .press('down');

        assert.equal($(this.instance.option('focusedElement')).text(), 'item2-1', 'focus on first item of second submenu');

        this.keyboard
            .press('right');

        assert.equal($(this.instance.option('focusedElement')).text(), 'item2-1', 'after second right arrow key press we do nothing because item2-1 has not submenu');
    });

    QUnit.test('keyboard navigation should work after a click', function(assert) {
        if(isDeviceDesktop(assert)) {
            this.instance.option('showFirstSubmenuMode', 'onHover');

            $(this.instance.itemsContainer())
                .find('.' + DX_MENU_ITEM_CLASS)
                .eq(1)
                .trigger('mouseenter')
                .trigger('dxclick');

            this.keyboard
                .press('down')
                .press('down');

            assert.equal($(this.instance.option('focusedElement')).text(), 'item2-2', 'after mouseenter and dxclick we can continue navigation');
        }
    });

    QUnit.test('up key should show submenu in horizontal menu', function(assert) {
        this.keyboard
            .press('right')
            .press('up');

        assert.ok(this.instance._visibleSubmenu);
    });

    QUnit.test('down key show submenu in horizontal menu', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        assert.ok(this.instance._visibleSubmenu);
    });

    QUnit.test('up and down keys should move the focus in vertical menu', function(assert) {
        this.instance.option('orientation', 'vertical');

        this.keyboard
            .press('up')
            .press('up')
            .press('down');

        assert.equal($(this.instance.option('focusedElement')).text(), 'item3');
    });

    QUnit.test('down key in submenu should move the focus to the next item of the main menu (vertical mode)', function(assert) {
        this.instance.option('orientation', 'vertical');

        this.keyboard
            .press('down')
            .press('right');

        var visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('down')
            .press('down')
            .press('down')
            .press('down')
            .press('down');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item3');
    });

    QUnit.test('up key in submenu should move the focus to the next item of the main menu (vertical mode)', function(assert) {
        this.instance.option('orientation', 'vertical');

        this.keyboard
            .press('down')
            .press('right');

        var visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('down')
            .press('up');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item1');
    });

    QUnit.test('right key in submenu should move the focus to the next item of the main menu (horizontal mode)', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        var visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('right');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item3');
    });

    QUnit.test('left key in submenu should move the focus to the next item of the main menu (horizontal mode)', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        var visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('left');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item1');
    });

    QUnit.test('RTL: left key in submenu should move the focus to the next item of the main menu (horizontal mode)', function(assert) {
        this.instance.option('rtlEnabled', true);

        this.keyboard
            .press('left')
            .press('down');

        var visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('left');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item3');
    });

    QUnit.test('RTL: right key in submenu should move the focus to the next item of the main menu (horizontal mode)', function(assert) {
        this.instance.option('rtlEnabled', true);

        this.keyboard
            .press('left')
            .press('down');

        var visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('right');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item1');
    });

    QUnit.test('disabled item should be skipped when keyboard navigation is used', function(assert) {
        this.instance.option('items', [{ text: 'Item 1', disabled: true }, { text: 'Item 2' }]);

        this.keyboard
            .press('right');

        assert.ok(this.instance.itemElements().eq(1).hasClass(DX_STATE_FOCUSED_CLASS), 'disabled item was skipped');
    });

    QUnit.test('submenu should be closed after left button pressed (T321290, vertical mode)', function(assert) {
        var items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }, { text: 'Item 2' }];

        this.instance.option({ 'items': items, orientation: 'vertical' });

        this.keyboard
            .press('right');

        var $item1 = $(this.$element).find('.' + DX_MENU_ITEM_CLASS).eq(0),
            submenu = getSubMenuInstance($item1);

        assert.ok(submenu.option('visible'), 'submenu is visible');

        this.keyboard
            .press('left');

        assert.notOk(submenu.option('visible'), 'submenu is invisible');
    });

    QUnit.testInActiveWindow('root item should not get focus on pointerdown when it has submenu', function(assert) {
        this.instance.option({
            'items': [{ text: 'Item 1' }, { text: 'Item 2', items: [{ text: 'Item 21' }] }],
            focusStateEnabled: true
        });

        var $items = this.instance.itemElements();

        this.instance.focus();
        assert.ok($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'first item was focused');

        $($items.eq(1)).trigger('dxpointerdown');
        this.clock.tick(0);

        assert.notOk($items.eq(1).hasClass(DX_STATE_FOCUSED_CLASS), 'item was not focused');
        assert.notOk($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'first item lose focus');
    });
});

QUnit.module('Menu with templates', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('Create items with template', function(assert) {
        var $template = $('<div>').text('test'),
            options = {
                showFirstSubmenuMode: 'onClick',
                items: [
                    { text: 'item1' },
                    {
                        text: 'item2',
                        items: [
                            { text: 'item2-1' },
                            { text: 'item2-2' }
                        ]
                    }
                ],
                itemTemplate: $template
            },
            menu = createMenu(options),
            $item = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(1),
            submenu;

        $($item).trigger('dxclick');
        submenu = getSubMenuInstance($item);

        assert.equal($($item).text(), 'test', 'template rendered');
        assert.equal($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0).text(), 'test', 'template rendered');
        assert.equal($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(1).text(), 'test', 'template rendered');
    });
});

QUnit.module('adaptivity: render', {
    beforeEach: function() {
        $('#qunit-fixture').width(50);
        this.$element = $('#menu'),
        this.items = [
            { text: 'item1' },
            {
                text: 'item2',
                items: [
                    { text: 'item2-1' },
                    { text: 'item2-2' }
                ]
            }];
        fx.off = true;
    },
    afterEach: function() {
        $('#qunit-fixture').width(1000);
        fx.off = false;
    }
}, () => {
    QUnit.test('Hamburger button should be rendered', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS);

        assert.equal($button.length, 1, 'hamburger button was rendered');
    });

    QUnit.test('Adaptive menu is invisible at first', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        assert.ok($button.is(':visible'), 'hamburger button is visible on init');
        assert.ok($treeview.is(':hidden'), 'treeview is hidden on init');
        assert.notOk($button.hasClass(DX_STATE_ACTIVE_CLASS), 'button has no active class');
        assert.ok($itemsContainer.is(':hidden'), 'non adaptive items should be hidden');
    });

    QUnit.test('Adaptive elements should not render if adaptivity is disabled on init', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: false
        });

        var $adaptiveContainer = this.$element.find('.' + DX_ADAPTIVE_MODE_CLASS),
            $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS);

        assert.equal($button.length, 0, 'button was not rendered');
        assert.equal($treeview.length, 0, 'treeview was not rendered');
        assert.equal($adaptiveContainer.length, 0, 'adaptiveContainer was not rendered');
    });

    QUnit.test('Adaptive elements should be removed after disabling adaptivity', function(assert) {
        var menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        menu.option('adaptivityEnabled', false);

        var $adaptiveContainer = this.$element.find('.' + DX_ADAPTIVE_MODE_CLASS),
            $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        assert.equal($button.length, 0, 'button was not rendered');
        assert.equal($treeview.length, 0, 'treeview was not rendered');
        assert.equal($adaptiveContainer.length, 0, 'adaptiveContainer was not rendered');
        assert.ok($itemsContainer.is(':visible'), 'non adaptive items should be shown');
    });

    QUnit.test('Adaptive menu should be inside of overlay', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

        assert.ok($treeview.closest('.dx-overlay-content').length, 'treeview is inside of overlay');
    });

    QUnit.test('Overlay content should have adaptive mode class', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            $overlayContent = $treeview.closest('.dx-overlay-content');

        assert.ok($overlayContent.hasClass(DX_ADAPTIVE_MODE_CLASS), 'overlay container has correct class');
    });

    QUnit.test('Overlay should have correct position in rtl mode', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            rtlEnabled: true
        });

        var $overlay = this.$element.find('.dx-overlay').first(),
            overlay = $overlay.dxOverlay('instance');

        assert.equal(overlay.option('position').at, 'bottom right', 'at position is correct');
        assert.equal(overlay.option('position').my, 'top right', 'my position is correct');
    });

    QUnit.test('Overlay should have correct collision strategy', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $overlay = this.$element.find('.dx-overlay').first(),
            overlay = $overlay.dxOverlay('instance');

        assert.equal(overlay.option('position').collision, 'flipfit', 'collision strategy is correct');
    });

    QUnit.test('Overlay should have closeOnTargetScroll option', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            rtlEnabled: true
        });

        var $overlay = this.$element.find('.dx-overlay').first(),
            overlay = $overlay.dxOverlay('instance');

        assert.ok(overlay.option('closeOnTargetScroll'), 'overlay should close on target scroll');
    });

    QUnit.test('Width option should transfer to the adaptive overlay', function(assert) {
        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true,
                rtlEnabled: true
            }),
            $overlay = this.$element.find('.dx-overlay').first(),
            overlay = $overlay.dxOverlay('instance');

        menu.option('width', 301);

        assert.equal(overlay.option('width'), 301, 'overlay has correct width');
        assert.equal(overlay.option('height'), 'auto', 'overlay has auto height');
    });

    QUnit.test('Defer rendering should be disabled for adaptive overlay', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $overlay = this.$element.find('.dx-overlay').first(),
            overlay = $overlay.dxOverlay('instance');

        assert.equal(overlay.option('deferRendering'), false, 'defer rendering is disabled for overlay');
    });

    QUnit.test('Overlay content should have custom css class if cssClass option in menu was set', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            cssClass: 'custom-class'
        });

        var $overlay = this.$element.find('.dx-overlay-content').first();

        assert.ok($overlay.hasClass('custom-class'), 'content has custom class');
    });

    QUnit.test('Adaptivity should be available for horizontal orientation only', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            orientation: 'vertical',
            adaptivityEnabled: true
        });

        var $adaptiveContainer = this.$element.find('.' + DX_ADAPTIVE_MODE_CLASS),
            $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS);

        assert.equal($button.length, 0, 'button was not rendered');
        assert.equal($treeview.length, 0, 'treeview was not rendered');
        assert.equal($adaptiveContainer.length, 0, 'adaptiveContainer was not rendered');
    });

    QUnit.test('maxHeight should be 90% of maximum of top or bottom offsets when height of overlay content more windows height', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(100),
            windowHeight = sinon.stub(renderer.fn, 'innerHeight').returns(700),
            offset = sinon.stub(renderer.fn, 'offset').returns({ left: 0, top: 200 });

        try {
            var overlay = this.$element.find('.dx-overlay').dxOverlay('instance'),
                maxHeight = overlay.option('maxHeight');

            assert.ok(Math.floor(maxHeight()) < windowHeight(), 'maxHeight is correct');
            assert.ok(overlay._wrapper().hasClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS), 'special class for overlay wrapper');
        } finally {
            scrollTop.restore();
            windowHeight.restore();
            offset.restore();
        }
    });
});

QUnit.module('adaptivity: transfer options', {
    beforeEach: function() {
        $('#qunit-fixture').width(50);
        this.$element = $('#menu'),
        this.items = [
            { text: 'item1' },
            {
                text: 'item2',
                items: [
                    { text: 'item2-1' },
                    { text: 'item2-2' }
                ]
            }];
        fx.off = true;
    },
    afterEach: function() {
        $('#qunit-fixture').width(1000);
        fx.off = false;
    }
}, () => {
    transferActionTest('itemClick', [
        'component', 'element', 'itemData', 'itemElement', 'itemIndex', 'event'
    ], function(treeview) {
        $(treeview.itemElements()).eq(1).trigger('dxclick');
    });

    transferActionTest('itemContextMenu', [
        'component', 'element', 'itemData', 'itemElement', 'itemIndex', 'event'
    ], function(treeview) {
        $(treeview.itemElements()).eq(1).trigger('dxcontextmenu');
    });

    transferActionTest('selectionChanged', [
        'component', 'element'
    ], function(treeview) {
        treeview.selectItem(1);
    });

    transferActionTest('submenuHidden', [
        'component', 'element'
    ], function(treeview) {
        treeview.expandItem(2);
        treeview.collapseItem(2);
    });

    transferActionTest('submenuShown', [
        'component', 'element'
    ], function(treeview) {
        treeview.expandItem(2);
    });

    QUnit.test('onSubmenuShown action should be transferred to the treeview', function(assert) {
        var onSubmenuShown = 0;

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            onSubmenuShown: function(e) {
                onSubmenuShown++;
            }
        });

        var $item = this.$element.find('.' + DX_TREEVIEW_ITEM_CLASS).eq(1);

        $($item).trigger('dxclick');

        assert.equal(onSubmenuShown, 1, 'onSubmenuShown fired');
    });

    QUnit.test('onSubmenuHidden action should be transferred to the treeview', function(assert) {
        var onSubmenuHidden = 0;

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            onSubmenuHidden: function(e) {
                onSubmenuHidden++;
            }
        });

        var $item = this.$element.find('.' + DX_TREEVIEW_ITEM_CLASS).eq(1);

        $($item).trigger('dxclick');
        $($item).trigger('dxclick');

        assert.equal(onSubmenuHidden, 1, 'onSubmenuHidden fired');
    });

    QUnit.test('Some menu options should be transferred to the treeview as is on init', function(assert) {
        var options = [
                'rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation',
                'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled',
                'itemsExpr', 'itemTemplate', 'selectedExpr',
                'selectionMode', 'tabIndex', 'visible'
            ],
            menuOptions = {
                items: this.items,
                adaptivityEnabled: true
            };

        $.each(options, function(_, option) {
            menuOptions[option] = 'value';
        });

        new Menu(this.$element, menuOptions);

        var $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            treeview = $treeview.dxTreeView('instance');

        $.each(options, function(_, option) {
            assert.equal(treeview.option(option), 'value', 'option ' + option + ' was transferred on init');
        });
    });

    QUnit.test('Some menu options should be transferred to the treeview as is on optionChanged', function(assert) {
        var options = [
            'rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation',
            'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled',
            'itemsExpr', 'itemTemplate', 'selectedExpr',
            'selectionMode', 'tabIndex', 'visible'
        ];

        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true
            }),
            that = this;

        $.each(options, function(_, option) {
            menu.option(option, 'value2');
            var $treeview = that.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
                treeview = $treeview.dxTreeView('instance');

            assert.equal(treeview.option(option), 'value2', 'option ' + option + ' was transferred dynamically');
        });
    });

    QUnit.test('selectByClick option should be transferred to the treeview', function(assert) {
        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true,
                selectByClick: false
            }),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            treeview = $treeview.dxTreeView('instance');

        assert.notOk(treeview.option('selectByClick'), 'selectByClick is correct on init');

        menu.option('selectByClick', true);

        assert.ok(treeview.option('selectByClick'), 'selectByClick is correct on option changed');
    });

    QUnit.test('animationEnabled option should be true in the dxTreeView if animation option in the dxMenu is not null', function(assert) {
        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true
            }),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            treeview = $treeview.dxTreeView('instance');

        assert.strictEqual(treeview.option('animationEnabled'), true, 'animation is enabled in the dxTreeView by default');

        menu.option('animation', null);

        assert.strictEqual(treeview.option('animationEnabled'), false, 'animation has been changed to disabled');
    });

    QUnit.test('Data of tree view doesn\'t load twice when uses the custom store', function(assert) {
        var that = this,
            dataLoadCounter = 0,
            clock = sinon.useFakeTimers();

        try {
            new Menu(that.$element, {
                dataSource: {
                    store: new CustomStore({
                        load: function(loadOptions) {
                            return $.Deferred(function(d) {
                                setTimeout(function() {
                                    new ArrayStore(that.items).load(loadOptions).done(function() {
                                        ++dataLoadCounter;
                                        d.resolve.apply(d, arguments);
                                    });
                                }, 300);
                            }).promise();
                        }
                    })
                },
                adaptivityEnabled: true
            });

            clock.tick(600);

            assert.equal(dataLoadCounter, 2);
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Set new data source of menu to tree view', function(assert) {
        testTreeViewDataSourceItems(assert, this.items, this.items);
    });

    QUnit.test('Set new data source to tree view when data source is changed via option', function(assert) {
        var expectedItems = [
            { text: 'item4' },
            { text: 'item5' }
        ];

        testTreeViewDataSourceItems(assert, this.items, expectedItems, function(menu) {
            menu.option('dataSource', expectedItems);
        });
    });

    QUnit.test('Set new data source of menu to tree view when menu uses data source set as instance', function(assert) {
        testTreeViewDataSourceItems(assert, new DataSource({ store: this.items }), this.items);
    });

    QUnit.test('Set new data source of menu to tree view when menu uses data source set as instance and it is changed via option', function(assert) {
        var expectedItems = [
            { text: 'item4' },
            { text: 'item5' }
        ];

        testTreeViewDataSourceItems(assert, new DataSource({ store: this.items }), expectedItems, function(menu) {
            menu.option('dataSource', new DataSource({ store: expectedItems }));
        });
    });

    function testTreeViewDataSourceItems(assert, inputDataSource, expectedData, action) {
        var menu = new Menu($('#menu'), {
            dataSource: inputDataSource,
            adaptivityEnabled: true
        });

        action && action(menu);

        assert.deepEqual(menu._treeView.option('dataSource').items(), expectedData);
    }
});

QUnit.module('adaptivity: behavior', {
    beforeEach: function() {
        $('#qunit-fixture').width(50);
        this.$element = $('#menu');
        this.items = [
            { text: 'item1' },
            {
                text: 'item2',
                items: [
                    { text: 'item2-1' },
                    { text: 'item2-2' }
                ]
            }];
        fx.off = true;
    },
    afterEach: function() {
        $('#qunit-fixture').width(1000);
        fx.off = false;
    }
}, () => {
    QUnit.test('Adaptive menu should be shown when hamburger button clicked', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $($button).trigger('dxclick');

        assert.ok($button.is(':visible'), 'hamburger button was not hidden');
        assert.ok($treeview.is(':visible'), 'treeview was shown');
        assert.ok($button.hasClass(DX_STATE_ACTIVE_CLASS), 'button became active');
        assert.ok($itemsContainer.is(':hidden'), 'non adaptive items should be hidden');
    });

    QUnit.test('Adaptive menu should disappear after the second click on the hamburger', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $($button).trigger('dxclick');
        $($button).trigger('dxclick');

        assert.ok($button.is(':visible'), 'hamburger button is visible');
        assert.ok($treeview.is(':hidden'), 'treeview is hidden');
        assert.notOk($button.hasClass(DX_STATE_ACTIVE_CLASS), 'button has no active class');
        assert.ok($itemsContainer.is(':hidden'), 'non adaptive items should be hidden');
    });

    QUnit.test('Click on list item should hide adaptive menu', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $item = this.$element.find('.' + DX_TREEVIEW_ITEM_CLASS).eq(0);

        $($button).trigger('dxclick');
        $($item).trigger('dxclick');

        assert.ok($treeview.is(':hidden'), 'treeview is hidden');
        assert.notOk($button.hasClass(DX_STATE_ACTIVE_CLASS), 'button has no active class');
    });

    QUnit.test('Outside click should close adaptive menu', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

        $($button).trigger('dxclick');
        $(document).trigger('dxpointerdown');

        assert.ok($treeview.is(':hidden'), 'treeview is hidden');
        assert.notOk($button.hasClass(DX_STATE_ACTIVE_CLASS), 'button has no active class');
    });

    QUnit.test('Click on hamburger button should not call outside click handler', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

        $($button).trigger('dxclick');
        $($button).trigger('dxpointerdown');

        assert.ok($treeview.is(':visible'), 'treeview is visible');
    });

    QUnit.test('Menu should toggle it\'s view between adaptive and non adaptive if container size changed', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        $('#qunit-fixture').width(500);

        resizeCallbacks.fire();

        assert.ok(this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).is(':hidden'), 'hamburger button is hidden');
    });

    QUnit.test('Menu should toggle it\'s view between adaptive and non adaptive if width is not enough', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            width: 500,
            adaptivityEnabled: true
        });

        assert.ok(this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).is(':hidden'), 'hamburger button is hidden');
    });

    QUnit.test('Menu should toggle it\'s view between adaptive and non adaptive if widget size changed', function(assert) {
        var menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        menu.option('width', 500);

        assert.ok(this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).is(':hidden'), 'hamburger button is hidden');
    });

    QUnit.test('Menu should toggle it\'s view between adaptive and non adaptive on visibilityChanged event', function(assert) {
        $('#qunit-fixture').width(500);

        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true,
                visible: false
            }),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $('#qunit-fixture').width(50);
        menu.option('visible', true);

        assert.notOk($itemsContainer.is(':visible'), 'non adaptive container should be hidden');
    });

    QUnit.test('Adaptive menu should not flick when the window has been resized with jQuery 3.3.1', function(assert) {
        var outerWidth = sinon.spy(renderer.fn, 'outerWidth');

        try {
            new Menu(this.$element, {
                items: [{ text: 'item 1' }, { text: 'item 2' }],
                adaptivityEnabled: true
            });

            assert.equal(outerWidth.callCount, 3, 'itemWidth has been called for each item and container on render');

            resizeCallbacks.fire();
            assert.equal(outerWidth.callCount, 4, 'itemWidth has been called just for container on dimension change');
        } finally {
            outerWidth.restore();
        }
    });

    QUnit.test('Adaptive mode should depend on summary item width but not on item container width', function(assert) {
        $('#qunit-fixture').width(500);

        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true,
                visible: false
            }),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $('#qunit-fixture').width(50);
        $itemsContainer.width(50);

        menu.option('visible', true);

        assert.notOk($itemsContainer.is(':visible'), 'non adaptive container should be hidden');
    });

    QUnit.test('Adaptive mode should not show on visibility change when adaptivity is disabled', function(assert) {
        $('#qunit-fixture').width(500);

        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: false,
                visible: false
            }),
            $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $('#qunit-fixture').width(50);
        menu.option('visible', true);

        assert.ok($itemsContainer.is(':visible'), 'non adaptive container should be visible');
    });

    QUnit.test('TreeView items should be collapsed when adaptive menu hiding', function(assert) {
        var items = [{ text: 'item 1', expanded: true, items: [{ text: 'item 11' }] }];

        new Menu(this.$element, {
            items: items,
            adaptivityEnabled: true
        });

        $('#qunit-fixture').width(500);
        resizeCallbacks.fire();

        assert.notOk(items[0].expanded, 'item is collapsed');
    });

    QUnit.test('Visible submenus should be hidden when adaptive mode toggling on', function(assert) {
        $('#qunit-fixture').width(500);

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $item = this.$element.find('.' + DX_MENU_ITEM_CLASS).eq(1),
            submenu;

        $($item).trigger('dxclick');

        submenu = getSubMenuInstance($item);
        assert.ok(submenu.option('visible'), 'submenu is visible');

        $('#qunit-fixture').width(50);
        resizeCallbacks.fire();
        assert.notOk(submenu.option('visible'), 'submenu is hidden');
    });

    QUnit.test('TreeView should disappear when menu transform to common view', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

        $($button).trigger('dxclick');
        $('#qunit-fixture').width(500);
        resizeCallbacks.fire();

        assert.ok($treeview.is(':hidden'), 'treeview is hidden');
    });

    QUnit.test('Overlay should change dimensions after any node expanded or collapsed', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        var $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0),
            $item2 = $treeview.find('.dx-treeview-item').eq(1),
            overlay = this.$element.find('.dx-overlay').dxOverlay('instance'),
            overlayPositioned = sinon.stub(),
            $overlayContent = $(overlay.content());

        overlay.on('positioned', overlayPositioned);

        $($button).trigger('dxclick');
        var height = $overlayContent.outerHeight();

        $($item2).trigger('dxclick');
        assert.ok($overlayContent.outerHeight() > height, 'overlay should be enlarged');
        assert.equal(overlayPositioned.callCount, 2, 'overlay\'s position should be recalculated');

        $($item2).trigger('dxclick');
        assert.equal($overlayContent.outerHeight(), height, 'overlay should be shrinked');
        assert.equal(overlayPositioned.callCount, 3, 'overlay\'s position should be recalculated');
    });

    QUnit.test('Adaptive width limit should contain only root items', function(assert) {
        var menu = new Menu(this.$element, {
                items: this.items,
                adaptivityEnabled: true
            }),
            $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0),
            $item2 = menu.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).eq(1);

        $('#qunit-fixture').width(50);
        resizeCallbacks.fire();

        $($item2).trigger('dxclick');

        $('#qunit-fixture').width(MENU_ITEM_WIDTH * this.items.length + 1);
        resizeCallbacks.fire();

        assert.ok($button.is(':hidden'), 'adaptive mode should be disabled');
    });
});


function createMenu(options) {
    var $menu = $('#menu').dxMenu(options),
        menuInstance = $menu.dxMenu('instance');

    return { instance: menuInstance, element: $menu };
}

function getSubMenuInstance($rootItem) {
    var $el = $rootItem.children('.' + DX_CONTEXT_MENU_CLASS);
    return $el.length && Submenu.getInstance($el);
}

function hoverSubmenuItemByIndex(submenu, itemIndex) {
    var $itemContainer = $(submenu.itemsContainer()),
        $item = $itemContainer.find('.' + DX_MENU_ITEM_CLASS).eq(itemIndex);

    $itemContainer.trigger($.Event('dxhoverstart', { target: $item.get(0) }));
    $item.trigger('dxpointermove');
}

function createMenuInWindow(options) {
    var $menu = $($('#simpleMenu').dxMenu(options).css({
            position: 'absolute',
            top: 10100,
            left: 10100,
            background: 'blue'
        })),
        menuInstance = $menu.dxMenu('instance');

    return { instance: menuInstance, element: $menu };
}

function createMenuForHoverStay(options) {
    var $menu = $($('#simpleMenu').dxMenu(options).css({
            position: 'absolute',
            top: 10000,
            left: 10000,
            background: 'blue'
        })),
        menuInstance = $menu.dxMenu('instance');

    return { instance: menuInstance, element: $menu };
}

function transferActionTest(eventName, expectedArgs, triggerFunc) {
    QUnit.test(eventName + ' action should be transferred to the treeview when \'on\' binding is used', function(assert) {
        var handler = sinon.spy();

        var menu = new Menu(this.$element, {
                items: [{ text: 'Item 1' }, { text: 'Item 2', items: [{ text: 'Item 21' }] }],
                adaptivityEnabled: true
            }),
            treeView = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0).dxTreeView('instance');

        menu.on(eventName, handler);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 1, 'handler for \'on\' was called once');
        $.each(expectedArgs, function(_, argument) {
            assert.ok(handler.getCall(0).args[0], argument + ' is exist in parameters');
        });

        handler.reset();
        menu.off(eventName);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 0, 'handler for \'on\' was not executed after unsubscribe');
    });

    QUnit.test(eventName + ' action should be transferred to the treeview when option is used', function(assert) {
        var optionName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1),
            handler = sinon.spy();

        var menu = new Menu(this.$element, {
                items: [{ text: 'Item 1' }, { text: 'Item 2', items: [{ text: 'Item 21' }] }],
                adaptivityEnabled: true
            }),
            treeView = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0).dxTreeView('instance');

        menu.option(optionName, handler);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 1, 'handler for option was called once');
        $.each(expectedArgs, function(_, argument) {
            assert.ok(handler.getCall(0).args[0][argument], argument + ' is exist in parameters');
        });

        handler.reset();
        menu.option(optionName, undefined);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 0, 'handler for option was not executed after unsubscribe');
    });
}
