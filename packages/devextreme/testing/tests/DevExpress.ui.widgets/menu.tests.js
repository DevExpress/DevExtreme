import $ from 'jquery';
import devices from '__internal/core/m_devices';
import fx from 'common/core/animation/fx';
import renderer from 'core/renderer';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import Submenu from '__internal/ui/menu/m_submenu';
import resizeCallbacks from 'core/utils/resize_callbacks';
import domAdapter from '__internal/core/m_dom_adapter';
import Menu from '__internal/ui/menu/m_menu';
import keyboardMock from '../../helpers/keyboardMock.js';
import fixtures from '../../helpers/positionFixtures.js';
import { CustomStore } from 'common/data/custom_store';
import ArrayStore from 'common/data/array_store';
import eventsEngine from 'common/core/events/core/events_engine';
import { DataSource } from 'common/data/data_source/data_source';
import * as checkStyleHelper from '../../helpers/checkStyleHelper.js';

import 'generic_light.css!';
import { implementationsMap, getHeight, getWidth, getOuterHeight } from 'core/utils/size';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

QUnit.testStart(function() {
    const markup =
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

const DX_MENU_CLASS = 'dx-menu';
const DX_SUBMENU_CLASS = 'dx-submenu';
const DX_MENU_ITEM_CLASS = DX_MENU_CLASS + '-item';
const DX_MENU_ITEM_SELECTED_CLASS = 'dx-menu-item-selected';
const DX_MENU_ITEM_EXPANDED_CLASS = 'dx-menu-item-expanded';
const DX_MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text';
const DX_ICON_CLASS = 'dx-icon';
const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_CONTEXT_MENU_DELIMETER_CLASS = 'dx-context-menu-content-delimiter';
const DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = 'dx-context-menu-container-border';
const DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS = 'dx-menu-items-container';
const DX_MENU_HORIZONTAL = 'dx-menu-horizontal';
const DX_MENU_ITEM_POPOUT_CLASS = DX_MENU_ITEM_CLASS + '-popout';
const DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = DX_MENU_CLASS + '-hamburger-button';
const DX_ADAPTIVE_MODE_CLASS = DX_MENU_CLASS + '-adaptive-mode';
const DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = DX_ADAPTIVE_MODE_CLASS + '-overlay-wrapper';
const DX_TREEVIEW_CLASS = 'dx-treeview';
const DX_TREEVIEW_ITEM_CLASS = DX_TREEVIEW_CLASS + '-item';

const DX_STATE_FOCUSED_CLASS = 'dx-state-focused';
const DX_STATE_ACTIVE_CLASS = 'dx-state-active';
const ITEM_URL_CLASS = 'dx-item-url';

const CLICKTIMEOUT = 51;
const ANIMATION_TIMEOUT = 100;
const MENU_ITEM_WIDTH = 100;
const MOUSETIMEOUT = 50;

const EXPECTED_TREEVIEW_SYNC_OPTIONS = [
    // tested in separate tests: 'dataSource', 'items'
    'rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation',
    'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled',
    'itemsExpr', 'itemTemplate', 'selectedExpr',
    'selectionMode', 'tabIndex', 'visible', 'selectByClick'
];

const isDeviceDesktop = function(assert) {
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
        const options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] };
        const menu = createMenuInWindow(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        const delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(getHeight(delimiter), 3, 'ok');
        assert.notEqual(getWidth(delimiter), 0, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().left + 1, delimiter.offset().left, 1.01, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top - 2.5, delimiter.offset().top, 1.01, 'ok');
    });

    QUnit.test('Render vertical content delimiter', function(assert) {
        const options = { orientation: 'vertical', showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] };
        const menu = createMenuInWindow(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        const delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(getWidth(delimiter), 3, 'ok');
        assert.notEqual(getHeight(delimiter), 0, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().left - 2.5, delimiter.offset().left, 1.01, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top + 1, delimiter.offset().top, 1.01, 'ok');
    });

    QUnit.test('Render horizontal rtl content delimiter', function(assert) {
        const options = { rtlEnabled: true, showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] };
        const menu = createMenuInWindow(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        const delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(getHeight(delimiter), 3, 'ok');
        assert.notEqual(getWidth(delimiter), 0, 'ok');
        assert.roughEqual(rootMenuItem.offset().left + 1, delimiter.offset().left, 1.01, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top - 2.5, delimiter.offset().top, 1.01, 'ok');
    });

    QUnit.test('Render vertical rtl content delimiter', function(assert) {
        const options = { rtlEnabled: true, orientation: 'vertical', showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] };
        const menu = createMenuInWindow(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        $(rootMenuItem).trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));
        const delimiter = submenu.$contentDelimiter;
        assert.ok(delimiter);
        assert.ok(delimiter.hasClass(DX_CONTEXT_MENU_DELIMETER_CLASS));
        assert.equal(getWidth(delimiter), 3, 'ok');
        assert.notEqual(getHeight(delimiter), 0, 'ok');
        assert.roughEqual(rootMenuItem.offset().left - 2.5, delimiter.offset().left, 1.01, 'ok');
        assert.roughEqual($(submenu._overlay.content()).offset().top + 1, delimiter.offset().top, 1.01, 'ok');
    });

    QUnit.test('container border should not be hidden when non-top level submenu hides', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            showSubmenuMode: 'onHover',
            items: [{
                text: 'item 1', items: [
                    { text: 'item 11', items: [{ text: 'item 111' }] },
                    { text: 'item 12' }
                ]
            }]
        });
        const $rootMenuItem = menu.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        // Opening all submenu levels
        $rootMenuItem.trigger('dxclick');
        const firstLevelSubmenu = getSubMenuInstance($rootMenuItem);

        hoverSubmenuItemByIndex(firstLevelSubmenu, 0);
        this.clock.tick(ANIMATION_TIMEOUT);

        const $items = firstLevelSubmenu.itemElements();
        const $border = $rootMenuItem.find('.' + DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS);

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
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('Render items with custom model', function(assert) {
        const menu = createMenu({
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
        });

        const $item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.equal($item1.text(), 'item 1', 'root item rendered correct');
        assert.ok($item1.find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 'popout was rendered');

        $($item1).trigger('dxclick');
        let submenu = getSubMenuInstance($item1)._overlay.$content();
        const $item11 = submenu.find('.' + DX_MENU_ITEM_CLASS).eq(0);
        assert.equal($item11.text(), 'item 11');
        assert.ok($item11.find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 'popout was rendered');

        $($item11).trigger('dxclick');
        submenu = getSubMenuInstance($item1)._overlay.$content();
        const $item111 = submenu.find('.' + DX_MENU_ITEM_CLASS).eq(1);
        assert.equal($item111.text(), 'item 111');
    });

    QUnit.test('Do not render menu with empty items', function(assert) {
        const menu = createMenu({ items: [] });
        const submenus = $(menu.element).find('.' + DX_SUBMENU_CLASS);
        const root = $(menu.element).find('.' + DX_MENU_HORIZONTAL);

        assert.ok(menu);
        assert.equal(submenus.length, 0, 'no levels');
        assert.equal(root.length, 0, 'no root');
    });

    QUnit.test('Do not render submenu with empty items', function(assert) {
        const menu = createMenu({ items: [{ text: 'item1' }, { text: 'item2', items: [] }] });
        const submenus = $(menu.element).find('.' + DX_SUBMENU_CLASS);
        const root = $(menu.element).find('.' + DX_MENU_HORIZONTAL);

        assert.ok(menu);
        assert.equal(submenus.length, 0, 'no levels');
        assert.equal(root.length, 1, 'just root level');
    });

    QUnit.test('Don\'t create submenu on rendering', function(assert) {
        const menu = createMenu({ items: [{ text: 'item1', items: [{}] }] });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.equal($rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length, 0);
    });

    QUnit.test('Render custom template for submenu items', function(assert) {
        const $menu = $('#menuWithCustomTemplates').dxMenu({
            showFirstSubmenuMode: 'onClick',
            items: [{
                text: 'item1',
                items: [{ template: 'custom' }]
            }]
        });

        const rootMenuItem = $($menu.dxMenu('instance').$element()).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.equal($menu.find('.' + DX_MENU_ITEM_CLASS).length, 1);
        rootMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.equal($(submenu._overlay.$content()).find('.' + DX_MENU_ITEM_CLASS).eq(0).text(), 'test');
    });

    QUnit.test('Render custom template via script (T195165)', function(assert) {
        const $menu = $('#menu').dxMenu({
            showFirstSubmenuMode: 'onClick',
            dataSource: [
                {
                    text: 'Open Menu',
                    items: [{ selectable: false, disabled: false, template: $('#menuScriptTemplate') }]
                }]
        });

        const rootMenuItem = $($menu.dxMenu('instance').$element()).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.equal($menu.find('.' + DX_MENU_ITEM_CLASS).length, 1);
        rootMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.equal($.trim($(submenu._overlay.$content()).find('.' + DX_MENU_ITEM_CLASS).eq(0).text()), 'Menu Test');
    });

    QUnit.test('Render horizontal menu with default submenuDirection', function(assert) {
        const menu = createMenuInWindow({
            showFirstSubmenuMode: 'onClick',
            items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }]
        });

        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        rootMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu.option('visible'));
        assert.ok($(submenu._$element[0]).offset().top > $(rootMenuItem[0]).offset().top);
        assert.strictEqual($(submenu._$element[0]).offset().left, $(rootMenuItem[0]).offset().left);
    });

    QUnit.test('Render vertical menu with default submenuDirection', function(assert) {
        fixtures.simple.create();

        const $menu = $('#what').dxMenu({
            orientation: 'vertical',
            showFirstSubmenuMode: 'onClick',
            items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }]
        });

        const rootMenuItem = $($menu.find('.' + DX_MENU_ITEM_CLASS)[0]);

        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        rootMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem)._overlay;
        assert.ok(submenu.option('visible'));
        assert.equal(Math.round($(submenu._$content[0]).offset().top), Math.round($(rootMenuItem[0]).offset().top));
        assert.ok($(submenu._$content[0]).offset().left > $(rootMenuItem[0]).offset().left);
        fixtures.simple.drop();
    });

    QUnit.test('Render menu with leftOrTop submenuDirection', function(assert) {
        fixtures.simple.create();

        const $menu = $('#what').dxMenu({
            showFirstSubmenuMode: 'onClick',
            submenuDirection: 'leftOrTop',
            items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }]
        }).css({
            top: 100,
            left: 100
        });

        const rootMenuItem = $($menu.find('.' + DX_MENU_ITEM_CLASS)[0]);

        assert.ok($menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        rootMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem)._overlay;
        assert.ok(submenu.option('visible'));
        assert.ok($(submenu._$content[0]).offset().top < $(rootMenuItem[0]).offset().top);
        assert.strictEqual($(submenu._$content[0]).offset().left, $(rootMenuItem[0]).offset().left);
        fixtures.simple.drop();
    });

    QUnit.test('Render vertical menu with leftOrTop submenuDirection', function(assert) {
        fixtures.simple.create();

        const $menu = $('#what').dxMenu({ orientation: 'vertical', showFirstSubmenuMode: 'onClick', submenuDirection: 'leftOrTop', items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }] }).css({
            top: 100,
            left: 100
        });

        const rootMenuItem = $($menu.find('.' + DX_MENU_ITEM_CLASS)[0]);

        assert.ok($menu);
        assert.ok(!rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS).length);
        rootMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem)._overlay;
        assert.ok(submenu.option('visible'));
        assert.equal(Math.round($(submenu._$content[0]).offset().top), Math.round($(rootMenuItem[0]).offset().top));
        assert.ok($(submenu._$content[0]).offset().left < $(rootMenuItem[0]).offset().left);
        fixtures.simple.drop();
    });
});

QUnit.module('Rendering Scrollable', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    const DX_SCROLLABLE_CLASS = 'dx-scrollable';
    const DX_SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
    const DX_SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
    const BORDER_WIDTH = 1;
    const SUBMENU_PADDING = 10;
    const FIXTURE_OFFSET = 10000;
    const menuRootOffset = $(window).height() - 50;

    QUnit.test('Submenu should init Scrollable', function(assert) {
        const menu = createMenu({
            items: [{
                text: 'item 1',
                items: [{
                    text: 'item 11',
                }],
            }],
            showFirstSubmenuMode: 'onClick'
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $item1.trigger('dxclick');

        const $submenu = $(`.${DX_SUBMENU_CLASS}`);

        assert.strictEqual($submenu.length, 1, 'only 1 submenu exists');
        assert.ok($submenu.hasClass(DX_SCROLLABLE_CLASS), 'Scrollable initialized');
    });

    QUnit.test('Scrollable should be initialized on a 2nd level submenu', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenu({
            items: [{
                text: 'item 1',
                items: [{
                    text: 'item 11',
                    items: [{
                        text: 'item 111',
                    }],
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $item1.trigger('dxclick');

        const submenu = getSubMenuInstance($item1);

        assert.ok(submenu._overlay.option('visible'));

        const $menuItem = $(submenu._overlay.content()).find(`.${DX_MENU_ITEM_CLASS}`).first();
        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $menuItem.get(0) }));
        $menuItem.trigger('dxpointermove');
        this.clock.tick(0);
        const $submenu = $(submenu._overlay.content()).find(`.${DX_SUBMENU_CLASS}`).eq(1);
        assert.ok($submenu.hasClass(DX_SCROLLABLE_CLASS), 'Scrollable initialized on nested submenu');
    });

    QUnit.test('Submenu should be correctly positioned', function(assert) {
        const menu = createMenuInWindow({
            items: [{
                text: 'item 1',
                items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })),
            }],
            showFirstSubmenuMode: 'onClick',
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $item1.trigger('dxclick');

        const $submenu = $(`.${DX_SUBMENU_CLASS}`);

        assert.ok($submenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`).height() > $(window).height(), 'total height of submenu exceeds the window height');
        assert.roughEqual($submenu.offset().top, $item1.offset().top + $item1.outerHeight(), .1, 'submenu aligned to a clicked item');
        assert.roughEqual(
            $submenu.outerHeight(),
            $(window).height() - $item1.offset().top - $item1.outerHeight() - SUBMENU_PADDING,
            1.5,
            'menu uses all available space'
        );
    });

    QUnit.test('Height of the submenu should not exceed content height', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [{
                text: 'item 1',
                items: [{ text: 'item 11' }],
            }],
            showFirstSubmenuMode: 'onClick',
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $item1.trigger('dxclick');

        const $submenu = $(`.${DX_SUBMENU_CLASS}`);
        const $itemsContainer = $submenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`);

        assert.roughEqual($submenu.height(), $itemsContainer.outerHeight(), .1);
    });

    QUnit.test('Nested submenu should be positioned to a clicked item', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [{
                text: 'item 1',
                items: [{
                    text: 'item 11',
                    items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })),
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $rootItem.trigger('dxclick');

        const submenu = getSubMenuInstance($rootItem);
        const $menuItem = $(submenu._overlay.content()).find(`.${DX_MENU_ITEM_CLASS}`).first();

        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $menuItem.get(0) }));
        $menuItem.trigger('dxpointermove');
        this.clock.tick(0);

        const $nestedSubmenu = $(submenu._overlay.content()).find(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $nestedItemsContainer = $nestedSubmenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`).eq(0);

        assert.roughEqual($nestedItemsContainer.offset().top, $menuItem.offset().top, .1, 'Nested submenu positioned to a clicked item');
        assert.roughEqual(
            $nestedSubmenu.height(),
            $(window).height() - $nestedSubmenu.offset().top - BORDER_WIDTH - SUBMENU_PADDING,
            .1,
            'Nested submenu uses all available space'
        );
    });

    QUnit.test('Flipping root submenu', function(assert) {
        const menu = createMenuInWindow({
            items: [{
                text: 'item 1',
                items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })),
            }],
            showFirstSubmenuMode: 'onClick',
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        menu.element.css('top', FIXTURE_OFFSET + menuRootOffset);
        $item1.trigger('dxclick');

        const $submenu = $(`.${DX_SUBMENU_CLASS}`);

        assert.ok($submenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`).height() > $(window).height(), 'total height of submenu exceeds the window height');
        assert.roughEqual($submenu.offset().top, SUBMENU_PADDING, .1, 'submenu flipped to top');
        assert.roughEqual($submenu.outerHeight(), menuRootOffset - SUBMENU_PADDING, .1, 'menu uses all available space');
    });

    QUnit.test('Flipping 2nd level submenu', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [{
                text: 'item 1',
                items: [{
                    text: 'item 11',
                    items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })),
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        menu.element.css('top', FIXTURE_OFFSET + menuRootOffset);
        $rootItem.trigger('dxclick');

        const submenu = getSubMenuInstance($rootItem);
        const $menuItem = $(submenu._overlay.content()).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $menuItem.get(0) }));
        $menuItem.trigger('dxpointermove');
        this.clock.tick(0);

        const $nestedSubmenu = $(submenu._overlay.content()).find(`.${DX_SUBMENU_CLASS}`).eq(1);
        const availableHeight = Math.min($menuItem.offset().top + $menuItem.outerHeight(), $(window).height()) - SUBMENU_PADDING;

        assert.roughEqual($nestedSubmenu.offset().top, SUBMENU_PADDING - BORDER_WIDTH, .5, 'Nested submenu flipped to top');
        assert.roughEqual($nestedSubmenu.height(), availableHeight, .5, 'Nested submenu aligned to a clicked item');
    });

    QUnit.test('Selected item should be always visible during keyboard navigation (root submenu)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [{
                text: 'Item 1',
                items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const itemsContainer = menu.instance.itemsContainer();

        keyboardMock(itemsContainer)
            .press('down');
        this.clock.tick(0);

        const $scrollableContainer = $(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        assert.strictEqual($scrollableContent.position().top, 0, 'initial position');

        keyboardMock(itemsContainer)
            .press('up')
            .press('up');

        assert.roughEqual($scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height(), 2, 'scrolled to bottom');

        keyboardMock(itemsContainer)
            .press('down');

        assert.roughEqual($scrollableContent.position().top, 0, 2, 'scrolled back to 1st item');
    });

    QUnit.test('Selected item should be always visible during keyboard navigation (nested submenu)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [{
                text: 'Item 1',
                items: [{
                    text: 'Item 11',
                    items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const itemsContainer = menu.instance.itemsContainer();

        keyboardMock(itemsContainer)
            .press('down')
            .press('right');
        this.clock.tick(0);

        const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $scrollableContainer = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        assert.strictEqual($scrollableContent.position().top, 0, 'initial position');

        keyboardMock(itemsContainer)
            .press('up');

        assert.roughEqual($scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height(), 2, 'scrolled to bottom');

        keyboardMock(itemsContainer)
            .press('down');

        assert.roughEqual($scrollableContent.position().top, 0, 2, 'scrolled back to 1st item');
    });

    QUnit.test('Scroll position should be set to 0 after reopen (root submenu)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [{
                text: 'Item 1',
                items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const itemsContainer = menu.instance.itemsContainer();

        keyboardMock(itemsContainer)
            .press('down');

        this.clock.tick(0);

        const $scrollableContainer = $(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        keyboardMock(itemsContainer)
            .press('up')
            .press('up');

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom',
        );

        keyboardMock(itemsContainer)
            .press('left')
            .press('right')
            .press('down');

        assert.roughEqual($scrollableContent.position().top, 0, 1, 'scroll position reset');
    });

    QUnit.test('Scroll position should be set to 0 after reopen (nested submenu, KBN)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [
                {
                    text: 'Item 1',
                    items: [
                        {
                            text: 'Item 11',
                            items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
                        },
                        {
                            text: 'Item 22',
                        },
                    ],
                },
            ],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const itemsContainer = menu.instance.itemsContainer();

        keyboardMock(itemsContainer)
            .press('down')
            .press('right');

        const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $scrollableContainer = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        keyboardMock(itemsContainer)
            .press('up');

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom'
        );

        keyboardMock(itemsContainer)
            .press('left')
            .press('right');

        assert.roughEqual($scrollableContent.position().top, 0, 1, 'scroll position is reset');
    });

    QUnit.test('Scroll position should be set to 0 after reopen (nested submenu, pointer)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenuInWindow({
            items: [
                {
                    text: 'Item 1',
                    items: [
                        {
                            text: 'Item 11',
                            items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
                        },
                        {
                            text: 'Item 22',
                        },
                    ],
                },
                {
                    text: 'Item 2'
                }
            ],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const itemsContainer = menu.instance.itemsContainer();
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        keyboardMock(itemsContainer)
            .press('down')
            .press('right');

        const submenu = getSubMenuInstance($rootItem);
        const $menuItem1 = $(submenu._overlay.content()).find(`.${DX_MENU_ITEM_CLASS}`).first();
        const $menuItem2 = $(submenu._overlay.content()).find(`.${DX_MENU_ITEM_CLASS}`).last();

        $menuItem1.trigger('dxclick');

        const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $scrollableContainer = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        keyboardMock(itemsContainer)
            .press('up');

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom'
        );

        $menuItem2.trigger('dxclick');
        $menuItem1.trigger('dxclick');

        assert.roughEqual($scrollableContent.position().top, 0, 1, 'scroll position is reset');
    });

    QUnit.test('Option focusedElement should be null after reopen root submenu', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const submenuItemText = '1st submenu item';
        const menu = createMenuInWindow({
            items: [{
                text: 'Item 1',
                items: [
                    { text: submenuItemText },
                    { text: 'Another item' },
                ],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const itemsContainer = menu.instance.itemsContainer();
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $rootItem.trigger('dxclick');

        keyboardMock(itemsContainer)
            .press('down');

        assert.strictEqual($(menu.instance.option('focusedElement')).text(), submenuItemText, 'option is set');

        keyboardMock(itemsContainer)
            .press('left')
            .press('right')
            .press('down');

        assert.strictEqual(menu.instance.option('focusedElement'), null, 'option is null');

        keyboardMock(itemsContainer)
            .press('down');

        assert.strictEqual($(menu.instance.option('focusedElement')).text(), submenuItemText, 'option is set');
    });

    QUnit.test('Scrollable content should have min-height: auto to prevent invisible 3rd level submenus bug on iOS', function(assert) {
        const menu = createMenu({
            items: [{
                text: 'root',
                items: [{
                    text: 'item 11',
                    items: [{
                        text: 'item 111',
                    }],
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $rootItem.trigger('dxclick');

        const submenu = getSubMenuInstance($rootItem);
        const $overlayContent = $(submenu._overlay.content());
        const $nestedItem = $overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).first();

        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $nestedItem.get(0) }));
        $nestedItem.trigger('dxpointermove');
        this.clock.tick(0);

        $overlayContent.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`).each((_, scrollableContent) => {
            assert.strictEqual(window.getComputedStyle(scrollableContent).minHeight, '0px', 'min-height = auto');
        });
    });

    QUnit.test('Scrollable instance should have useKeyboard: false to avoid accessibility issues', function(assert) {
        const menu = createMenu({
            items: [{
                text: 'root',
                items: [{
                    text: 'item 11',
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $rootItem.trigger('dxclick');

        const submenu = getSubMenuInstance($rootItem);
        const overlayContent = submenu.getOverlayContent();
        const scrollableInstance = overlayContent.find(`.${DX_SCROLLABLE_CLASS}`).dxScrollable('instance');

        assert.strictEqual(scrollableInstance.option('useKeyboard'), false, 'useKeyboard option = false');
    });

    QUnit.module('On dimension changed', {
        setWindowHeight: function(windowHeight) {
            implementationsMap.getOuterHeight = (el, ...args) => {
                if(el === window) {
                    return windowHeight;
                }
                return this._originalGetOuterHeight(el, ...args);
            };
            implementationsMap.getHeight = (el, ...args) => {
                if(el[0] === window) {
                    return windowHeight;
                }
                return this._originalGetHeight(el, ...args);
            };
            domAdapter.getDocumentElement = function() {
                return {
                    clientWidth: 1200,
                    clientHeight: windowHeight
                };
            };
        },
        beforeEach: function() {
            this._originalGetOuterHeight = implementationsMap.getOuterHeight;
            this._originalGetHeight = implementationsMap.getHeight;
            this._originalGetDocumentElement = domAdapter.getDocumentElement;
        },
        afterEach: function() {
            implementationsMap.getOuterHeight = this._originalGetOuterHeight;
            implementationsMap.getHeight = this._originalGetHeight;
            domAdapter.getDocumentElement = this._originalGetDocumentElement;
        }
    }, () => {
        QUnit.test('Submenu height should be recalculated', function(assert) {
            const menu = createMenuInWindow({
                items: [
                    {
                        text: 'root',
                        items: [{ text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) }],
                    },
                ],
                showFirstSubmenuMode: 'onClick',
                showSubmenuMode: { name: 'onHover', delay: 0 },
            });
            const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

            $rootItem.trigger('dxclick');

            const submenu = getSubMenuInstance($rootItem);
            const $overlayContent = $(submenu._overlay.content());
            const $menuItem1 = $overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).first();

            $menuItem1.trigger('dxclick');

            const windowHeight = 300;
            this.setWindowHeight(windowHeight);
            resizeCallbacks.fire();

            const $nestedSubmenu = $menuItem1.find(`.${DX_SUBMENU_CLASS}`).eq(0);
            const $nestedItemsContainer = $nestedSubmenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`).eq(0);

            assert.roughEqual(
                $nestedSubmenu.height(),
                windowHeight - $nestedItemsContainer.offset().top - SUBMENU_PADDING,
                1,
                'Nested submenu uses height is updated'
            );
        });

        QUnit.test('Submenu flipping', function(assert) {
            const menu = createMenuInWindow({
                items: [
                    {
                        text: 'root',
                        items: [{ text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) }],
                    },
                ],
                showFirstSubmenuMode: 'onClick',
                showSubmenuMode: { name: 'onHover', delay: 0 },
            });
            const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

            $rootItem.trigger('dxclick');

            const submenu = getSubMenuInstance($rootItem);
            const $overlayContent = $(submenu._overlay.content());
            const $menuItem1 = $overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).first();

            $menuItem1.trigger('dxclick');

            const $nestedSubmenu = $menuItem1.find(`.${DX_SUBMENU_CLASS}`).eq(0);

            assert.roughEqual($nestedSubmenu.offset().top + BORDER_WIDTH, $menuItem1.offset().top, 1, 'submenu expanded to bottom');

            const windowHeight = 200;
            this.setWindowHeight(windowHeight);
            resizeCallbacks.fire();

            assert.roughEqual($nestedSubmenu.offset().top, SUBMENU_PADDING - BORDER_WIDTH, 1, 'submenu flipped to top');
        });

        QUnit.test('Submenu scrolling to an expanded item', function(assert) {
            const menu = createMenuInWindow({
                items: [
                    {
                        text: 'root',
                        items: [
                            {
                                text: 'nested',
                                items: [
                                    { text: 1 },
                                    { text: 2 },
                                    { text: 3 },
                                    { text: 4 },
                                    { text: 5 },
                                    { text: 6 },
                                    { text: 7 },
                                    { text: 8 },
                                    { text: 9 },
                                    { text: 10, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) },
                                ]
                            }
                        ],
                    },
                ],
                showFirstSubmenuMode: 'onClick',
                showSubmenuMode: { name: 'onHover', delay: 0 },
            });
            const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

            $rootItem.trigger('dxclick');

            const submenu = getSubMenuInstance($rootItem);
            const $overlayContent = $(submenu._overlay.content());
            const $nestedItem = $overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).first();

            $nestedItem.trigger('dxclick');

            const $lastItem = $nestedItem.find(`.${DX_MENU_ITEM_CLASS}`).last();

            $lastItem.trigger('dxclick');

            const windowHeight = 200;
            this.setWindowHeight(windowHeight);
            resizeCallbacks.fire();

            assert.roughEqual(
                $lastItem.offset().top,
                $nestedItem.offset().top,
                1.5,
                'expanded item still visible'
            );
        });
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

        const items = [{ text: 'root', selected: false, items: [{ text: 'submenu' }] }];
        const changedItems = [{ text: 'root1', selected: true, items: [{ text: 'submenu1' }] }];
        const menu = createMenu({
            items: items,
            selectionMode: 'single',
            showFirstSubmenuMode: 'onHover',
            selectByClick: true,
            onItemClick: function(e) {
                e.component.option('items', changedItems);
            }
        });
        const $rootItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        $($rootItem).trigger('dxpointermove');
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootItem);
        const $submenuItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0));

        $($submenuItem).trigger('dxclick');
        assert.ok(true, 'menu does not crash');
    });

    QUnit.test('Try to set selected state of several items via item.selected option 2', function(assert) {
        const items = [
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
            { text: 'item3', selected: true }
        ];

        const menu = createMenu({
            items: items,
            selectionMode: 'single'
        });

        const $items = $(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS);
        assert.equal($items.length, 1);
        assert.equal($items.find('.' + DX_MENU_ITEM_TEXT_CLASS).text(), 'item3');
    });

    QUnit.test('should be able to select an item via .selectItem() (T1253750)', function(assert) {
        const menu = createMenu({
            items: [
                {
                    text: 'menu item 1',
                    selectable: true,
                },
            ],
        });
        const item = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        menu.instance.selectItem(item[0]);

        assert.strictEqual(item.hasClass(DX_MENU_ITEM_SELECTED_CLASS), true, 'item has the selected class after initialization');
    });

    QUnit.test('should be able to unselect currently selected item (T1253750)', function(assert) {
        const menu = createMenu({
            items: [
                {
                    text: 'menu item 1',
                    selectable: true,
                    selected: true,
                },
            ],
        });
        const item = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        assert.strictEqual(item.hasClass(DX_MENU_ITEM_SELECTED_CLASS), true, 'item has the selected class after initialization');

        menu.instance.unselectItem(item[0]);

        assert.strictEqual(item.hasClass(DX_MENU_ITEM_SELECTED_CLASS), false, 'item does not have the selected class after unselecting');
    });

    QUnit.test('Selection in different submenus', function(assert) {
        const items = [
            { text: 'root1', items: [{ text: 'item1-1' }] },
            { text: 'root2', items: [{ text: 'item2-1' }] },
            { text: 'root3', items: [{ text: 'item3-1' }] }
        ];

        const menu = createMenu({
            items: items,
            showSubmenuMode: 'onClick',
            selectByClick: true,
            selectionMode: 'single'
        });

        const item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        const item2 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(1);
        const item3 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(2);

        assert.ok(menu, 'menu is created');
        assert.equal($(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        item1.trigger('dxclick');
        let submenu = getSubMenuInstance(item1);
        const item11 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        item11.trigger('dxclick');
        assert.ok(item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));

        item2.trigger('dxclick');
        submenu = getSubMenuInstance(item2);
        const item21 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        item21.trigger('dxclick');
        assert.ok(!item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.ok(item21.hasClass(DX_MENU_ITEM_SELECTED_CLASS));

        item3.trigger('dxclick');
        submenu = getSubMenuInstance(item3);
        const item31 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        item31.trigger('dxclick');
        assert.ok(!item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.ok(!item21.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.ok(item31.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
    });

    QUnit.test('Change selection in submenu (T310158)', function(assert) {
        const items = [
            { text: 'root1', items: [{ text: 'item1-1', selected: true }] },
            { text: 'root2', items: [{ text: 'item2-1' }] },
            { text: 'root3', items: [{ text: 'item3-1' }] }
        ];
        const menu = createMenu({
            items: items,
            showFirstSubmenuMode: 'onClick',
            selectByClick: true,
            selectionMode: 'single'
        });
        const $item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($item1).trigger('dxclick');
        const submenu = getSubMenuInstance($item1);
        const $nestedItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_SELECTED_CLASS));

        submenu.unselectItem($nestedItem.get(0));

        assert.expect(0);

    });

    QUnit.test('Change selection via API in single selection mode', function(assert) {
        const items = [
            { text: 'Item 1', items: [{ text: 'Item 11' }] },
            { text: 'Item 2', items: [{ text: 'Item 21' }] },
            { text: 'Item 3', items: [{ text: 'Item 31' }] }
        ];

        const menu = createMenu({
            items: items,
            showFirstSubmenuMode: 'onClick',
            selectByClick: true,
            selectionMode: 'single'
        });

        const $itemElements = menu.instance.itemElements();

        const getSelectedSubmenuItems = function($rootItem) {
            const submenu = getSubMenuInstance($rootItem);
            return submenu.itemElements().filter('.' + DX_MENU_ITEM_SELECTED_CLASS);
        };

        menu.instance.option('selectedItem', items[0].items[0]);
        $($itemElements.eq(0)).trigger('dxclick');
        let $selectedItems = getSelectedSubmenuItems($itemElements.eq(0));
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
        const items = [
            { text: 'root1', items: [{ text: 'item1-1' }] },
            { text: 'root2', items: [{ text: 'item2-1' }] }
        ];

        const menu = createMenu({
            items: items,
            selectByClick: true,
            selectionMode: 'single'
        });

        const $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);
        const $item1 = $items.eq(0);
        const $item2 = $items.eq(1);

        assert.ok(menu, 'menu is created');
        assert.equal($(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        menu.instance.selectItem(items[0].items[0]);
        assert.equal(menu.instance.option('selectedItem').text, 'item1-1');
        $($item1).trigger('dxclick');
        let submenu = getSubMenuInstance($item1);
        assert.equal($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 1);
        const $item11 = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0));

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
        let counter = 0;

        const menu = createMenu({
            items: [{ text: 'root1', items: [{ text: 'item1-1' }] }],
            selectByClick: true,
            selectionMode: 'single',
            onSelectionChanged: function() {
                counter++;
            }
        });

        const item1 = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu, 'menu is created');
        assert.equal($(menu.element).find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        item1.trigger('dxclick');
        assert.equal(counter, 0);
        const submenu = getSubMenuInstance(item1);
        const item11 = $(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        item11.trigger('dxclick');
        this.clock.tick(CLICKTIMEOUT);
        assert.ok(item11.hasClass(DX_MENU_ITEM_SELECTED_CLASS));
        assert.equal(counter, 1);
    });

    // T420860
    QUnit.test('It should be possible to select nested submenu by itemData', function(assert) {
        const items = [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111', selectable: true }] }] }];
        const menu = createMenuInWindow({
            items: items,
            onItemClick: function(e) {
                if(e.itemData.selectable) {
                    e.component.selectItem(e.itemData);
                }
            }
        });
        const $rootItem = menu.instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).eq(0);
        const getSubmenuItem = function(submenu, index) {
            return $(submenu.itemsContainer()).find('.' + DX_MENU_ITEM_CLASS).eq(index);
        };

        try {
            fx.off = false;
            $($rootItem).trigger('dxclick');

            const submenu = getSubMenuInstance($rootItem);
            let $item = getSubmenuItem(submenu, 0);

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
        const options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] };
        const menu = createMenu(options);
        const $itemB = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($itemB).trigger('dxclick');

        const submenu = getSubMenuInstance($itemB);
        assert.ok($itemB.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'expanded submenu should have expanded class');
        assert.ok(submenu.option('visible'), 'submenu was shown');

        $($itemB).trigger('dxclick');

        this.clock.tick(51);
        assert.ok(!$itemB.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'collapsed submenu should not have expanded class');
        assert.ok(!submenu.option('visible'), 'submenu was hidden');
    });

    QUnit.test('Submenu should be shown on touch click', function(assert) {
        const menu = createMenu({
            showFirstSubmenuMode: 'onClick',
            items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }]
        });
        const $itemsContainer = menu.instance.itemsContainer();
        const $rootItem = menu.instance.itemElements().eq(0);
        const e = $.Event('dxpointerdown', { target: $rootItem.get(0) });

        $($itemsContainer).trigger(e);
        assert.notOk(e.isDefaultPrevented(), 'item pointerdown should not be prevented');
    });

    QUnit.test('Hide submenu when click on another item', function(assert) {
        const options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'item 1', items: [{ text: 'item 11' }] }, { text: 'item 2', items: [{ text: 'item 21' }] }] };
        const menu = createMenu(options);
        const $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);
        const $item1 = $items.eq(0);
        const $item2 = $items.eq(1);
        let submenu;

        $($item2).trigger('dxclick');
        submenu = getSubMenuInstance($item2);
        assert.ok(submenu.option('visible'), 'item 21 was shown');

        $($item1).trigger('dxclick');
        assert.ok(!submenu.option('visible'), 'item 21 was hidden');

        submenu = getSubMenuInstance($item1);
        assert.ok(submenu.option('visible'), 'item 11 was shown');
    });

    QUnit.test('Close submenu when the page is scrolled', function(assert) {
        const options = { showFirstSubmenuMode: 'onClick', items: [{ text: 'item 1', items: [{ text: 'item 11' }] }, { text: 'item 2', items: [{ text: 'item 21' }] }] };
        const menu = createMenu(options);
        const $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);
        const $item2 = $items.eq(1);

        $($item2).trigger('dxclick');
        const submenu = getSubMenuInstance($item2);
        assert.ok(submenu.option('visible'), 'submenu was opened');

        eventsEngine.trigger($('body'), 'scroll');
        assert.notOk(submenu.option('visible'), 'submenu was closed');
    });

    QUnit.testInActiveWindow('Submenu should be closed when element loses focus', function(assert) {
        const options = {
            focusStateEnabled: true,
            showFirstSubmenuMode: 'onClick',
            items: [
                {
                    text: 'item 1',
                    items: [{ text: 'item 1_1' }],
                },
            ],
        };
        const menu = createMenu(options);
        const $menuItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $menuItem.trigger('dxclick');

        const submenu = getSubMenuInstance($menuItem);
        assert.strictEqual(submenu.option('visible'), true, 'submenu opened');

        $(menu.element).trigger($.Event('focusout', { relatedTarget: $('body') }));
        assert.strictEqual(submenu.option('visible'), false, 'submenu closed');
    });

    QUnit.testInActiveWindow('Submenu should not be closed when element loses focus by focusout event', function(assert) {
        const options = {
            focusStateEnabled: true,
            showFirstSubmenuMode: 'onClick',
            items: [
                {
                    text: 'item 1',
                    items: [{ text: 'item 1_1' }],
                },
            ],
        };
        const menu = createMenu(options);
        const $menuItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $menuItem.trigger('dxclick');

        const submenu = getSubMenuInstance($menuItem);

        assert.strictEqual(submenu.option('visible'), true, 'submenu opened');

        $(menu.element).trigger('focusout');

        assert.strictEqual(submenu.option('visible'), true, 'submenu still opened');
    });

    QUnit.testInActiveWindow('Submenu should not be closed when submenu item gets focus', function(assert) {
        const options = {
            showFirstSubmenuMode: 'onClick',
            items: [
                {
                    text: 'item 1',
                    items: [{ text: 'item 1_1' }],
                },
            ],
        };
        const menu = createMenu(options);
        const $menuItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $menuItem.trigger('dxclick');

        const submenu = getSubMenuInstance($menuItem);

        assert.strictEqual(submenu.option('visible'), true, 'submenu opened');

        const $submenuItems = submenu.itemElements();
        $($submenuItems.eq(0)).trigger('focusin');

        assert.strictEqual(submenu.option('visible'), true, 'submenu still opened');
    });

    QUnit.testInActiveWindow('Submenu should not be closed when current root menu item gets focus', function(assert) {
        const options = {
            showFirstSubmenuMode: 'onClick',
            items: [
                {
                    text: 'item 1',
                    items: [{ text: 'item 1_1' }],
                },
            ],
        };
        const menu = createMenu(options);

        const $menuItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $menuItem.trigger('dxclick');
        const submenu = getSubMenuInstance($menuItem);
        assert.strictEqual(submenu.option('visible'), true, 'submenu opened');

        $menuItem.trigger('focusin');
        assert.strictEqual(submenu.option('visible'), true, 'submenu still opened');
    });

    QUnit.testInActiveWindow('Submenu should not be closed when another root menu item gets focus', function(assert) {
        const options = {
            showFirstSubmenuMode: 'onClick',
            items: [
                {
                    text: 'item 1',
                    items: [{ text: 'item 1_1' }],
                },
                {
                    text: 'item 2',
                    items: [{ text: 'item 2_1' }],
                },
            ],
        };
        const menu = createMenu(options);

        const $menuItems = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`);

        const $firstMenuItem = $menuItems.eq(0);
        const $secondMenuItem = $menuItems.eq(1);

        $firstMenuItem.trigger('dxclick');
        const submenu = getSubMenuInstance($firstMenuItem);
        assert.strictEqual(submenu.option('visible'), true, 'submenu opened');

        $secondMenuItem.trigger('focusin');
        assert.strictEqual(submenu.option('visible'), true, 'submenu still opened');
    });

    QUnit.test('Don\'t hide submenu when cancel is true', function(assert) {
        let i = 0;

        const options = {
            showFirstSubmenuMode: 'onClick',
            items: [{ text: 'itemA', items: [{ text: 'itemA-A' }] }],
            onSubmenuHiding: function(args) {
                args.cancel = true;
                i++;
            }
        };

        const menu = createMenu(options);
        const $items = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);
        const $itemA = $items.eq(0);
        let submenu = getSubMenuInstance($itemA);

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
        const handlerShowing = sinon.stub();
        const handlerShown = sinon.stub();
        const handlerHiding = sinon.stub();
        const handlerHidden = sinon.stub();
        const options = {
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
        };
        const menu = createMenu(options);
        const $rootItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');
        assert.equal(handlerShowing.callCount, 1);
        assert.equal(handlerShown.callCount, 1);
        assert.equal(handlerHiding.callCount, 0);
        assert.equal(handlerHidden.callCount, 0);

        const submenu = getSubMenuInstance($rootItem);
        const $submenuItems = submenu.itemElements();

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

    QUnit.test('Submenu show/hide events should provide correct arguments', function(assert) {
        const handlerShowing = sinon.spy();
        const handlerShown = sinon.spy();
        const handlerHiding = sinon.spy();
        const handlerHidden = sinon.spy();
        const options = {
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: 'onClick',
            items: [{
                id: 1,
                text: 'rootItem',
                items: [{
                    id: 11,
                    text: 'item1',
                    items: [{ text: 'item1-1' }],
                }, {
                    id: 12,
                    text: 'item2',
                    items: [{ text: 'item2-1' }],
                }]
            }],
            onSubmenuShowing: handlerShowing,
            onSubmenuShown: handlerShown,
            onSubmenuHiding: handlerHiding,
            onSubmenuHidden: handlerHidden
        };
        const menu = createMenuInWindow(options);
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        const checkArgs = function(handler, callNumber, itemData, submenuContainer, comment) {
            assert.strictEqual($(handler.args[callNumber][0].rootItem)[0], $rootItem[0], `${comment} - rootItem`);
            assert.deepEqual(handler.args[callNumber][0].itemData, itemData, `${comment} - itemData`);
            assert.strictEqual($(handler.args[callNumber][0].submenuContainer)[0], submenuContainer, `${comment} - submenuContainer`);
        };

        $($rootItem).trigger('dxclick');

        const submenu = getSubMenuInstance($rootItem);
        const $submenuItems = submenu.itemElements();
        const $subItem1 = $submenuItems.eq(0);
        const $subItem2 = $submenuItems.eq(1);
        const rootSubmenu = $(submenu.getOverlayContent()).find(`.${DX_SUBMENU_CLASS}`)[0];

        checkArgs(handlerShowing, 0, options.items[0], rootSubmenu, '1st level showing');
        checkArgs(handlerShown, 0, options.items[0], rootSubmenu, '1st level shown');

        $($subItem1).trigger('dxclick');

        const nestedSubmenu1 = $subItem1.find(`.${DX_SUBMENU_CLASS}`)[0];

        checkArgs(handlerShowing, 1, options.items[0].items[0], nestedSubmenu1, '2nd level showing submenu1');
        checkArgs(handlerShown, 1, options.items[0].items[0], nestedSubmenu1, '2nd level shown submenu1');

        $($subItem2).trigger('dxclick');

        const nestedSubmenu2 = $subItem2.find(`.${DX_SUBMENU_CLASS}`)[0];

        checkArgs(handlerHiding, 0, options.items[0].items[0], nestedSubmenu1, '2nd level hiding submenu1');
        checkArgs(handlerHidden, 0, options.items[0].items[0], nestedSubmenu1, '2nd level hidden submenu1');
        checkArgs(handlerShowing, 2, options.items[0].items[1], nestedSubmenu2, '2nd level showing submenu2');
        checkArgs(handlerShown, 2, options.items[0].items[1], nestedSubmenu2, '2nd level shown submenu2');

        $(document).trigger('dxpointerdown');

        checkArgs(handlerHiding, 1, options.items[0], rootSubmenu, '1st level hiding root');
        checkArgs(handlerHiding, 2, options.items[0].items[1], nestedSubmenu2, '2nd level hiding submenu2');
        checkArgs(handlerHidden, 1, options.items[0].items[1], nestedSubmenu2, '2nd level hidden submenu2');
        checkArgs(handlerHidden, 2, options.items[0], rootSubmenu, '1st level hidden root');
    });

    QUnit.test('onSubmenuShowing handler should provide ability to change submenu css', function(assert) {
        const options = {
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: 'onClick',
            items: [{
                id: 1,
                text: 'rootItem',
                items: [{
                    id: 11,
                    text: 'item1',
                    items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
                }, {
                    id: 12,
                    text: 'item2',
                    items: [{ text: 'item2-1' }],
                }]
            }],
            onSubmenuShowing: ({ submenuContainer }) => {
                $(submenuContainer).css('maxHeight', 42);
                $(submenuContainer).css('boxSizing', 'border-box');
            },
        };
        const menu = createMenuInWindow(options);
        const $rootItem = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $($rootItem).trigger('dxclick');

        const submenu = getSubMenuInstance($rootItem);
        const $submenuItems = submenu.itemElements();
        const $subItem1 = $submenuItems.eq(0);
        const $rootSubmenu = $(submenu.getOverlayContent()).find(`.${DX_SUBMENU_CLASS}`);

        assert.strictEqual($rootSubmenu.outerHeight(), 42, 'root submenu height');

        $($subItem1).trigger('dxclick');

        const nestedSubmenu = $subItem1.find(`.${DX_SUBMENU_CLASS}`);

        assert.strictEqual($(nestedSubmenu).outerHeight(), 42, 'nestedSubmenu submenu height');
    });

    QUnit.test('Changing event handler via option affects submenu (T955742)', function(assert) {
        const eventLog = [];

        const menu = createMenu({ items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }] });
        ['onItemClick', 'onSubmenuShowing', 'onSubmenuShown', 'onItemRendered', 'onSubmenuHidden', 'onSubmenuHiding'].forEach(e => {
            menu.instance.option(e, function() { eventLog.push(e); });
        });

        const $item1 = $(menu.instance.itemElements().eq(0));
        $item1.trigger('dxclick');

        const $item11 = $(getSubMenuInstance($item1).itemElements().eq(0));
        $item11.trigger('dxclick');
        menu.instance._visibleSubmenu.hide();

        const expectedLog = ['onItemClick',
            'onItemRendered',
            'onSubmenuShowing',
            'onSubmenuShown',
            'onItemClick',
            'onItemRendered',
            'onSubmenuShowing',
            'onSubmenuShown',
            'onSubmenuHiding',
            'onSubmenuHiding',
            'onSubmenuHidden',
            'onSubmenuHidden'];
        assert.deepEqual(eventLog, expectedLog);
    });

    QUnit.test('only visible submenu should be hidden on outside click', function(assert) {
        const hiddenHandler = sinon.spy();
        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }],
            onSubmenuHidden: hiddenHandler
        });
        const $rootItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');
        $(document).trigger('dxpointerdown');

        assert.equal(hiddenHandler.callCount, 1, 'only 1 submenu was hidden');
    });

    QUnit.test('Do not show contextmenu on hover with pressed mouse button', function(assert) {
        const options = { showFirstSubmenuMode: 'onHover', items: [{ text: 'item1', items: [{ text: 'item1-1' }] }] };
        const menu = createMenu(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        const e = $.Event('mouseenter');
        e.which = 1;

        assert.ok(menu);
        $(rootMenuItem).trigger(e);
        const submenu = rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS);
        assert.ok(!submenu.length, 'Menu is not shown');
    });

    QUnit.test('Menu was not shown on some browsers with not synchronized mouse event arguments (T191149)', function(assert) {
        const options = { showFirstSubmenuMode: 'onHover', items: [{ text: 'item1', items: [{ text: 'item1-1' }] }] };
        const menu = createMenu(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        let submenu;
        const $itemContainer = menu.instance.itemsContainer();
        const e = $.Event('dxhoverstart', { target: rootMenuItem.get(0) });
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
        const menu = createMenuForHoverStay({ showFirstSubmenuMode: 'onHover', items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] });
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        let submenu;
        const $itemContainer = menu.instance.itemsContainer();

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
        const menu = createMenuForHoverStay({ showFirstSubmenuMode: { name: 'onHover', delay: { show: 300, hide: 700 } }, items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] });
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        let submenu;
        const $itemContainer = menu.instance.itemsContainer();

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
        const menu = createMenuForHoverStay({ showFirstSubmenuMode: { name: 'onHover', delay: 500 }, items: [{ text: 'itemB', items: [{ text: 'itemB-A' }] }] });
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        let submenu;
        const $itemContainer = menu.instance.itemsContainer();

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
        const items = [
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
            }];

        const options = { items: items };
        const menu = createMenu(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        $(rootMenuItem).trigger('dxclick');
        const submenu = getSubMenuInstance(rootMenuItem);
        assert.ok(submenu._overlay.option('visible'));

        const $menuItem = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS).first());
        assert.equal($menuItem.text(), 'itemA-A');
        $($menuItem).trigger('dxclick');
        const $submenu = $($(submenu._overlay.content()).find('.' + DX_SUBMENU_CLASS).eq(1));
        this.clock.tick(ANIMATION_TIMEOUT);
        assert.equal($submenu.css('visibility'), 'visible');
    });

    QUnit.test('Show submenu and sub-submenu on hover', function(assert) {
        const items = [
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
            }];

        const options = { showFirstSubmenuMode: 'onHover', items: items };
        const menu = createMenu(options);
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        let submenu;
        let $menuItem;
        let $submenu;
        const $itemContainer = menu.instance.itemsContainer();

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
        const items = [
            {
                text: 'itemB',
                disabled: true,
                items: [
                    { text: 'itemB-A' }
                ]
            }
        ];

        const menu = createMenu({ showFirstSubmenuMode: 'onHover', items: items });
        const rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        const $itemContainer = menu.instance.itemsContainer();
        let submenu;

        if(isDeviceDesktop(assert)) {
            $($itemContainer).trigger($.Event('dxhoverstart', { target: rootMenuItem.get(0) }));
            $(rootMenuItem).trigger('dxpointermove');
            submenu = rootMenuItem.children('.' + DX_CONTEXT_MENU_CLASS);
            assert.ok(!submenu.length, 'Submenu is not visible yet');
        }
    });

    QUnit.test('Show submenu on hover and sub-submenu onClick', function(assert) {
        const items = [
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
            }];

        const options = { showFirstSubmenuMode: 'onHover', showSubmenuMode: 'onClick', items: items };
        const menu = createMenu(options);
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        let submenu;
        let $menuItem;
        let $submenu;
        const $itemContainer = menu.instance.itemsContainer();

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
        let calls = 0;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
            showFirstSubmenuMode: 'onClick',
            onItemRendered: function() { calls++; }
        });

        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(menu);
        assert.equal(calls, 1, 'onItemRendered called once');
        $rootMenuItem
            .trigger('dxpointerdown') // it needs to trigger closeOnOutsideClick
            .trigger('dxclick');

        assert.equal(calls, 2, 'onItemRendered called twice');
    });

    QUnit.test('hover should not open menu when mouse button is pressed', function(assert) {

        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
            showFirstSubmenuMode: 'onHover'
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger($.Event('dxpointermove', { pointers: [ 1 ] }));

        this.clock.tick(300);

        const submenu = getSubMenuInstance($rootMenuItem);

        assert.notOk(submenu.option('visible'), 'submenu is invisible');
    });

    QUnit.test('hover on opened menu should not close it (T317062)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
            showFirstSubmenuMode: 'onHover'
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(300);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(300);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu should not hide');

    });

    QUnit.test('Menu should show when show delay is 0', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 }
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');
    });

    QUnit.test('Menu should not be shown if hover was ended before show delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }],
            showFirstSubmenuMode: { name: 'onHover', delay: 500 }
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));
        $($rootMenuItem).trigger('dxpointermove');

        this.clock.tick(400);
        $(menu.element).trigger($.Event('dxhoverend', { target: $rootMenuItem.get(0) }));
        this.clock.tick(100);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.notOk(submenu.option('visible'), 'submenu was not shown');
    });

    QUnit.test('Submenu should not be shown if hover was ended before show delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }],
            showSubmenuMode: { name: 'onHover', delay: 500 }
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootMenuItem).trigger('dxclick');

        const submenu = getSubMenuInstance($rootMenuItem);
        const $itemsContainer = submenu.itemsContainer();
        const $rootItem = submenu.itemElements().eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));

        this.clock.tick(400);
        $($itemsContainer).trigger($.Event('dxhoverend', { target: $rootItem.get(0) }));
        this.clock.tick(100);

        assert.equal(submenu.itemElements().length, 1, 'nested submenu was not rendered');
    });

    QUnit.test('Submenu shoyld not be hidden if other submenu was opened before hide delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [
                { text: 'Item 1', items: [{ text: 'Item 11' }] },
                { text: 'Item 2' },
                { text: 'Item 3', items: [{ text: 'Item 21' }] }
            ],
            showFirstSubmenuMode: { name: 'onHover', delay: { show: 100, hide: 500 } }
        });
        const $rootMenuItems = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItems.eq(0).get(0) }));
        $($rootMenuItems.eq(0)).trigger('dxpointermove');
        this.clock.tick(100);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItems.eq(1).get(0) }));
        $($rootMenuItems.eq(1)).trigger('dxpointermove');
        this.clock.tick(100);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItems.eq(2).get(0) }));
        $($rootMenuItems.eq(2)).trigger('dxpointermove');
        this.clock.tick(500);

        const submenu = getSubMenuInstance($rootMenuItems.eq(2));
        assert.ok(submenu.option('visible'), 'second submenu should be visible');
    });

    QUnit.test('Submenu should not be closed after showFirstSubmenuMode option is changed', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }],
            showFirstSubmenuMode: { name: 'onHover', delay: { show: 500, hide: 400 } }
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootMenuItem).trigger('dxclick');
        let submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu is visible');

        menu.instance.option('showFirstSubmenuMode', 'onClick');
        submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu is still visible');
    });

    QUnit.test('Menu should hide after mouseleave when pointer goes through siblings menus (T325923)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 },
            hideSubmenuOnMouseLeave: true
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $($rootMenuItem.eq(0)).trigger('dxpointermove');
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(1).get(0) }));
        $($rootMenuItem.eq(1)).trigger('dxpointermove');
        this.clock.tick(0);

        assert.notOk(submenu.option('visible'), 'submenu hidden');
    });

    QUnit.test('Link should be programmatically clicked if item.url is set and item is clicked, showSubmenuMode is `onHover` (T1209825)', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const clickSpy = sinon.spy();

        const menu = createMenu({
            items: [{
                text: 'Item_1',
                url: 'http://some_url',
                items: [{
                    text: 'Item_1_1',
                    url: 'http://some_url',
                }, {
                    text: 'Item_1_2',
                    url: 'http://some_url',
                }]
            }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 },
        });

        const $rootMenuItem = menu.element.find('.' + DX_MENU_ITEM_CLASS);
        const $menuItemLink = $rootMenuItem
            .find(`.${ITEM_URL_CLASS}`)
            .get(0);

        $menuItemLink.click = clickSpy;

        menu.element.trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $rootMenuItem.eq(0).trigger('dxpointermove');
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.strictEqual(submenu.option('visible'), true, 'submenu shown');

        const $item = menu.element
            .find(`.${DX_MENU_ITEM_CLASS}`)
            .eq(0);

        const $coveringElement = $item.find(`.${DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS}`);

        $coveringElement.trigger('dxclick');

        assert.strictEqual(clickSpy.callCount, 1, 'link was clicked');
    });

    QUnit.test('Menu should hide after mouseleave when hideOnMouseLeave = true', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 },
            hideSubmenuOnMouseLeave: true
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $($rootMenuItem.eq(0)).trigger('dxpointermove');
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');

        const $item = $($(submenu._overlay.content()).find('.' + DX_MENU_ITEM_CLASS));

        $(menu.element).trigger($.Event('dxhoverstart', { target: $item.eq(0).get(0) }));
        $(menu.element).trigger($.Event('dxhoverend', { target: $item.eq(0).get(0) }));

        $(menu.element).trigger($.Event('dxhoverstart', { target: window }));
        $($(submenu._overlay.content()).find('.dx-submenu')).trigger('dxhoverend');
        this.clock.tick(0);

        assert.notOk(submenu.option('visible'), 'submenu hidden');
    });

    QUnit.test('Menu should not hide after mouseleave to children of a target', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 },
            hideSubmenuOnMouseLeave: true
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        $(menu.element).trigger($.Event('click', { target: $rootMenuItem.eq(0).get(0) }));
        $(menu.element).trigger($.Event('mouseleave', { target: $rootMenuItem.eq(0).get(0), relatedTarget: $rootMenuItem.eq(0).children()[2] }));
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');
    });

    QUnit.test('Menu should show after it\'s submenu has been selected', function(assert) {
        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2' }],
            showFirstSubmenuMode: { name: 'onClick', delay: 0 }
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootMenuItem).trigger('dxclick');

        const submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');

        $(submenu.itemsContainer()).find('.' + DX_MENU_ITEM_CLASS).eq(0).trigger('dxclick');
        assert.ok(!submenu.option('visible'), 'submenu hidden');

        $($rootMenuItem).trigger('dxclick');
        assert.ok(submenu.option('visible'), 'submenu shown again');
    });

    QUnit.test('Menu should not hide when root item clicked', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 }
        });
        const $rootMenuItem = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $(menu.element).trigger($.Event('dxhoverstart', { target: $rootMenuItem.eq(0).get(0) }));
        $($rootMenuItem.eq(0)).trigger('dxpointermove');
        this.clock.tick(0);

        const submenu = getSubMenuInstance($rootMenuItem);
        let hidingCount = 0;

        submenu.option('onHiding', function() {
            hidingCount++;
        });

        $($rootMenuItem).trigger('dxclick');

        assert.ok(submenu.option('visible'), 'submenu shown');
        assert.equal(hidingCount, 0, 'submenu should not hides');
    });

    QUnit.test('Menu should not hide when root item clicked right after mouseleave, hideSubmenuOnMouseLeave: true', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item_1', items: [{ text: 'item_1_1' }] }, { text: 'Item_2', items: [{ text: 'item_2_1' }] }],
            hideSubmenuOnMouseLeave: true
        });
        const $rootMenuItems = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`);
        $($rootMenuItems).eq(0).trigger('dxclick');

        assert.strictEqual(getSubMenuInstance($rootMenuItems.eq(0)).option('visible'), true, 'submenu_1.visible');

        $(menu.element).trigger($.Event('mouseleave', { target: $rootMenuItems.eq(0).get(0), relatedTarget: $rootMenuItems.eq(1).get(0) }));
        $($rootMenuItems.eq(1)).trigger('dxclick');
        this.clock.tick(300);

        assert.strictEqual(getSubMenuInstance($rootMenuItems.eq(0)).option('visible'), false, 'submenu_1.not_visible');
        assert.strictEqual(getSubMenuInstance($rootMenuItems.eq(1)).option('visible'), true, 'submenu_2.visible');
    });
    // T431949
    QUnit.test('Menu should stop show submenu timeout when another level submenu was hovered', function(assert) {
        if(!isDeviceDesktop(assert)) return;

        const menu = createMenu({
            items: [{ text: 'Item 1', items: [{ text: 'item 11' }] }, { text: 'Item 2', items: [{ text: 'item 11' }] }],
            showFirstSubmenuMode: { name: 'onHover', delay: 50 }
        });
        const hoverMenuItem = function($item) {
            $(menu.element).trigger($.Event('dxhoverstart', { target: $item.get(0) }));
            $($item).trigger('dxpointermove');
        };
        const $rootMenuItems = $(menu.element).find('.' + DX_MENU_ITEM_CLASS);

        hoverMenuItem($rootMenuItems.eq(0));
        this.clock.tick(50);

        const submenu = getSubMenuInstance($rootMenuItems.eq(0));
        const $submenuItem = submenu.itemElements().eq(0);

        hoverMenuItem($rootMenuItems.eq(1));
        this.clock.tick(25);

        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $submenuItem.get(0) }));
        this.clock.tick(25);

        assert.ok(submenu.isOverlayVisible(), 'submenu is still visible');
    });

    QUnit.test('click should not be blocked on menu\'s item', function(assert) {
        const menu = createMenu({
            items: [{ text: 'Item 1' }]
        });
        const $item = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        const clickHandler = sinon.stub();

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

        const $menu = $('#menu').dxMenu({
            items: [{
                text: 'Item 1',
                items: [{
                    disabled: true, text: 'item 1_1'
                }]
            }],
            showFirstSubmenuMode: { name: 'onHover', delay: 0 },
            hideSubmenuOnMouseLeave: true
        });
        const $rootMenuItem = $($menu).find('.' + DX_MENU_ITEM_CLASS);

        $menu.trigger($.Event('dxhoverstart', { target: $rootMenuItem.get(0) }));

        $($rootMenuItem).trigger('dxpointermove');
        this.clock.tick(100);

        let submenu = getSubMenuInstance($rootMenuItem);
        const $subMenuItem = hoverSubmenuItemByIndex(submenu, 0);
        const oldQuerySelector = submenu.itemsContainer().get(0).querySelector;
        submenu.itemsContainer().get(0).querySelector = function(selectors) {
            if(selectors === ':hover') {
                return 'this is a DOM element';
            }
            return oldQuerySelector(selectors);
        };

        $menu.trigger($.Event('dxhoverend', { target: $rootMenuItem.get(0), relatedTarget: $subMenuItem }));
        this.clock.tick(100);

        submenu = getSubMenuInstance($rootMenuItem);
        assert.ok(submenu.option('visible'), 'submenu shown');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        const options = {
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
        const itemClickHandler = sinon.spy();

        this.instance.option('onItemClick', itemClickHandler);
        this.keyboard.press('enter');

        assert.equal(itemClickHandler.callCount, 1, 'press enter on item call item click action');
    });

    QUnit.test('process keyboard only for a visible submenu when enter pressed', function(assert) {
        const itemClickHandler = sinon.spy();
        const items = [{
            id: '1',
            text: 'item_1',
            items: [
                { id: '1_1', text: 'item_1_1' },
                { id: '1_2', text: 'item_1_2' }
            ]
        }, {
            id: '2',
            text: 'item_2',
            items: [
                { id: '2_1', text: 'item_2_1' },
                { id: '2_2', text: 'item_2_2' }
            ]
        }];

        this.instance.option('items', items);
        this.instance.option('orientation', 'vertical');
        this.instance.option('onItemClick', itemClickHandler);

        this.keyboard
            .press('right')
            .press('down')
            .press('down')
            .press('enter');

        assert.equal(itemClickHandler.callCount, 1, 'handler.callCount');
        assert.equal(itemClickHandler.args[0][0].itemData.id, '1_2', 'handler.itemData');
        itemClickHandler.resetHistory();

        this.keyboard
            .press('down')
            .press('down')
            .press('right')
            .press('down')
            .press('down')
            .press('enter');

        assert.equal(itemClickHandler.callCount, 1, 'handler.callCount');
        assert.equal(itemClickHandler.args[0][0].itemData.id, '2_2', 'handler.itemData');
        itemClickHandler.resetHistory();

        this.keyboard
            .press('down')
            .press('right')
            .press('down')
            .press('down')
            .press('enter');

        assert.equal(itemClickHandler.callCount, 1, 'handler.callCount');
        assert.equal(itemClickHandler.args[0][0].itemData.id, '1_2', 'handler.itemData');
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

        const visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

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

        const visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

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

        const visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('right');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item3');
    });

    QUnit.test('left key in submenu should move the focus to the next item of the main menu (horizontal mode)', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        const visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

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

        const visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

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

        const visibleSubmenu = Submenu.getInstance(this.instance._visibleSubmenu.$element());

        this.keyboard
            .press('right');

        assert.ok(!visibleSubmenu.option('visible'), 'submenu is hidden');
        assert.equal($(this.instance.option('focusedElement')).text(), 'item1');
    });

    QUnit.test('disabled item should not be skipped when keyboard navigation is used', function(assert) {
        this.instance.option('items', [{ text: 'Item 1', disabled: true }, { text: 'Item 2' }]);

        this.keyboard.press('tab');

        assert.ok(this.instance.itemElements().eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'disabled item was not skipped');
    });

    QUnit.test('submenu should be closed after left button pressed (T321290, vertical mode)', function(assert) {
        const items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }, { text: 'Item 2' }];

        this.instance.option({ 'items': items, orientation: 'vertical' });

        this.keyboard
            .press('right');

        const $item1 = $(this.$element).find('.' + DX_MENU_ITEM_CLASS).eq(0);
        const submenu = getSubMenuInstance($item1);

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

        const $items = this.instance.itemElements();

        this.instance.focus();
        assert.ok($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'first item was focused');

        $($items.eq(1)).trigger('dxpointerdown');
        this.clock.tick(0);

        assert.notOk($items.eq(1).hasClass(DX_STATE_FOCUSED_CLASS), 'item was not focused');
        assert.notOk($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'first item lose focus');
    });

    [
        [{ text: 'item1', items: [{ name: 'item_1_1' }] }],
        [{ icon: 'imageCssClass', items: [{ name: 'item_1_1' }] }],
        [{ text: 'item1', icon: 'imageCssClass', items: [{ name: 'item_1_1' }] }],
    ].forEach(items => {
        checkStyleHelper.testInChromeOnDesktopActiveWindow('root item text should be visible after focusing when it\'s opened (T1227670)', function(assert) {
            this.instance.option('items', items);

            const $rootMenuItem = $(this.instance.itemElements().eq(0));

            $($rootMenuItem).trigger('dxclick');
            this.$element.trigger('focusin');

            assert.ok($rootMenuItem.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'root item should have expanded class');
            assert.ok($rootMenuItem.hasClass(DX_STATE_FOCUSED_CLASS), 'root item should have focused class');
            assert.strictEqual(checkStyleHelper.getColor($rootMenuItem[0]), 'rgb(51, 51, 51)', 'color');
        });
    });

    [false, true].forEach(rtlEnabled => {
        QUnit.test(`rtlEnabled: ${rtlEnabled}, orientation: horizontal. focusedElement is null after expanding and closing submenu with 1 nesting level (T952882)`, function(assert) {
            this.instance.option({ rtlEnabled, orientation: 'horizontal', items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }, { text: 'Item 2' }] });
            this.keyboard.press('down');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);

            this.keyboard.press('down');
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            assert.equal(this.instance._visibleSubmenu, null);

            this.keyboard.press(rtlEnabled ? 'right' : 'left');
            this.keyboard.press('down');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);
        });

        QUnit.test(`rtlEnabled: ${rtlEnabled}, orientation: horizontal. focusedElement is null after expanding and closing submenu with 2 nesting level (T952882)`, function(assert) {
            this.instance.option({ rtlEnabled, orientation: 'horizontal', items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }, { text: 'Item 2' }] });
            this.keyboard.press('down');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);

            this.keyboard.press('down');
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            assert.equal(this.instance._visibleSubmenu, null);

            this.keyboard.press(rtlEnabled ? 'right' : 'left');
            this.keyboard.press('down');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);
        });

        QUnit.test(`rtlEnabled: ${rtlEnabled}, orientation: vertical. focusedElement is null after expanding and closing submenu with 1 nesting level (T952882)`, function(assert) {
            this.instance.option({ rtlEnabled, orientation: 'vertical', items: [{ text: 'Item 1', items: [{ text: 'Item 11' }] }, { text: 'Item 2' }] });
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);

            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            this.keyboard.press('down');
            assert.equal(this.instance._visibleSubmenu, null);

            this.keyboard.press('up');
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);
        });

        QUnit.test(`rtlEnabled: ${rtlEnabled}, orientation: vertical. focusedElement is null after expanding and closing submenu with 2 nesting level (T952882)`, function(assert) {
            this.instance.option({ rtlEnabled, orientation: 'vertical', items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [{ text: 'Item 111' }] }] }, { text: 'Item 2' }] });
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);

            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            this.keyboard.press('down');
            assert.equal(this.instance._visibleSubmenu, null);

            this.keyboard.press('up');
            this.keyboard.press(rtlEnabled ? 'left' : 'right');
            assert.equal(this.instance._visibleSubmenu.option('focusedElement'), null);
        });
    });

    QUnit.test('orientation: horizontal. vertical keyboard navigation works cyclically (T952882)', function(assert) {
        this.instance.option({ orientation: 'horizontal', items: [{ text: 'Item 1', items: [{ text: 'Item 11', items: [ { text: 'Item 111' }, { text: 'Item 112' }, { text: 'Item 113' } ] } ] }] });
        this.keyboard.press('down')
            .press('down')
            .press('right')
            .press('up')
            .press('up')
            .press('up')
            .press('up');

        assert.equal($(this.instance._visibleSubmenu.option('focusedElement')).text(), 'Item 113');
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
        const $template = $('<div>').text('test');
        const options = {
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
        };
        const menu = createMenu(options);
        const $item = $(menu.element).find('.' + DX_MENU_ITEM_CLASS).eq(1);

        $($item).trigger('dxclick');
        const submenu = getSubMenuInstance($item);

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
    QUnit.test('Adds "menubar" role when menu is wider than item', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            width: 1000
        });

        assert.strictEqual(this.$element.attr('role'), 'menubar');
    });

    QUnit.test('No role added when menu is smaller than item', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            width: 20
        });

        assert.strictEqual(this.$element.attr('role'), undefined);
    });

    QUnit.test('Adds "menu bar" role when menu width is increased at runtime', function(assert) {
        const instance = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            width: 20
        });

        assert.strictEqual(this.$element.attr('role'), undefined);

        instance.option('width', 1000);

        assert.strictEqual(this.$element.attr('role'), 'menubar');
    });

    QUnit.test('Removes role when menu width is decreased at runtime', function(assert) {
        const instance = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            width: 1200
        });
        assert.strictEqual(this.$element.attr('role'), 'menubar');

        instance.option('width', 20);

        assert.strictEqual(this.$element.attr('role'), undefined);
    });

    QUnit.test('Hamburger button should be rendered', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS);

        assert.equal($button.length, 1, 'hamburger button was rendered');
    });

    QUnit.test('Adaptive menu is invisible at first', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

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

        const $adaptiveContainer = this.$element.find('.' + DX_ADAPTIVE_MODE_CLASS);
        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS);

        assert.equal($button.length, 0, 'button was not rendered');
        assert.equal($treeview.length, 0, 'treeview was not rendered');
        assert.equal($adaptiveContainer.length, 0, 'adaptiveContainer was not rendered');
    });

    QUnit.test('Adaptive elements should be removed after disabling adaptivity', function(assert) {
        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        menu.option('adaptivityEnabled', false);

        const $adaptiveContainer = this.$element.find('.' + DX_ADAPTIVE_MODE_CLASS);
        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS);
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

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

        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

        assert.ok($treeview.closest('.dx-overlay-content').length, 'treeview is inside of overlay');
    });

    QUnit.test('Overlay content should have adaptive mode class', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const $overlayContent = $treeview.closest('.dx-overlay-content');

        assert.ok($overlayContent.hasClass(DX_ADAPTIVE_MODE_CLASS), 'overlay container has correct class');
    });

    QUnit.test('Overlay should have correct position in rtl mode', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            rtlEnabled: true
        });

        const $overlay = this.$element.find('.dx-overlay').first();
        const overlay = $overlay.dxOverlay('instance');

        assert.equal(overlay.option('position').at, 'bottom right', 'at position is correct');
        assert.equal(overlay.option('position').my, 'top right', 'my position is correct');
    });

    QUnit.test('Overlay should have correct collision strategy', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $overlay = this.$element.find('.dx-overlay').first();
        const overlay = $overlay.dxOverlay('instance');

        assert.equal(overlay.option('position').collision, 'flipfit', 'collision strategy is correct');
    });

    QUnit.test('Overlay should have hideOnParentScroll option', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            rtlEnabled: true
        });

        const $overlay = this.$element.find('.dx-overlay').first();
        const overlay = $overlay.dxOverlay('instance');

        assert.ok(overlay.option('hideOnParentScroll'), 'overlay should close on target scroll');
    });

    QUnit.test('Width option should transfer to the adaptive overlay', function(assert) {
        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            rtlEnabled: true
        });
        const $overlay = this.$element.find('.dx-overlay').first();
        const overlay = $overlay.dxOverlay('instance');

        menu.option('width', 301);

        assert.equal(overlay.option('width'), 301, 'overlay has correct width');
        assert.equal(overlay.option('height'), 'auto', 'overlay has auto height');
    });

    QUnit.test('Defer rendering should be disabled for adaptive overlay', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $overlay = this.$element.find('.dx-overlay').first();
        const overlay = $overlay.dxOverlay('instance');

        assert.equal(overlay.option('deferRendering'), false, 'defer rendering is disabled for overlay');
    });

    QUnit.test('Overlay content should have custom css class if cssClass option in menu was set', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            cssClass: 'custom-class'
        });

        const $overlay = this.$element.find('.dx-overlay-content').first();

        assert.ok(this.$element.hasClass('custom-class'), 'element has custom class');
        assert.ok($overlay.hasClass('custom-class'), 'content has custom class');
    });

    QUnit.test('Adaptivity should be available for horizontal orientation only', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            orientation: 'vertical',
            adaptivityEnabled: true
        });

        const $adaptiveContainer = this.$element.find('.' + DX_ADAPTIVE_MODE_CLASS);
        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS);

        assert.equal($button.length, 0, 'button was not rendered');
        assert.equal($treeview.length, 0, 'treeview was not rendered');
        assert.equal($adaptiveContainer.length, 0, 'adaptiveContainer was not rendered');
    });

    QUnit.test('maxHeight should be 90% of maximum of top or bottom offsets when height of overlay content more windows height', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(100);
        const windowHeight = sinon.stub(implementationsMap, 'getInnerHeight').returns(700);
        const offset = sinon.stub(renderer.fn, 'offset').returns({ left: 0, top: 200 });

        try {
            const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
            const maxHeight = overlay.option('maxHeight');

            assert.ok(Math.floor(maxHeight()) < windowHeight(), 'maxHeight is correct');
            assert.ok(overlay.$wrapper().hasClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS), 'special class for overlay wrapper');
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
        let onSubmenuShown = 0;

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            onSubmenuShown: function(e) {
                onSubmenuShown++;
            }
        });

        const $item = this.$element.find('.' + DX_TREEVIEW_ITEM_CLASS).eq(1);

        $($item).trigger('dxclick');

        assert.equal(onSubmenuShown, 1, 'onSubmenuShown fired');
    });

    QUnit.test('onSubmenuHidden action should be transferred to the treeview', function(assert) {
        let onSubmenuHidden = 0;

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            onSubmenuHidden: function(e) {
                onSubmenuHidden++;
            }
        });

        const $item = this.$element.find('.' + DX_TREEVIEW_ITEM_CLASS).eq(1);

        $($item).trigger('dxclick');
        $($item).trigger('dxclick');

        assert.equal(onSubmenuHidden, 1, 'onSubmenuHidden fired');
    });

    QUnit.test('Some menu options should be transferred to the treeview as is on init', function(assert) {
        const menuOptions = { adaptivityEnabled: true };

        $.each(EXPECTED_TREEVIEW_SYNC_OPTIONS, function(_, option) {
            menuOptions[option] = 'value';
        });

        new Menu(this.$element, menuOptions);

        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const treeview = $treeview.dxTreeView('instance');

        $.each(EXPECTED_TREEVIEW_SYNC_OPTIONS, function(_, option) {
            assert.equal(treeview.option(option), 'value', 'option ' + option + ' was transferred on init');
        });
    });

    QUnit.test('Pass dataSource to treeview on init', function(assert) {
        const menu = new Menu(this.$element, {
            dataSource: ['item1'],
            adaptivityEnabled: true
        });

        assert.strictEqual(menu._treeView.getDataSource().items()[0], 'item1', '_treeView.getDataSource().items()[0]');
    });

    QUnit.test('Pass items to treeview on init', function(assert) {
        const items = ['item1'];
        const menu = new Menu(this.$element, {
            items: items,
            adaptivityEnabled: true
        });

        assert.strictEqual(menu._treeView.option('items'), items, '_treeView.option(items)');
    });

    QUnit.test('Some menu options should be transferred to the treeview as is on optionChanged', function(assert) {
        const menu = new Menu(this.$element, { adaptivityEnabled: true });
        const that = this;

        $.each(EXPECTED_TREEVIEW_SYNC_OPTIONS, function(_, option) {
            if(option === 'animation') {
                return; // complex object, difficult to compare
            }
            const $treeview = that.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
            const treeview = $treeview.dxTreeView('instance');

            menu.option(option, 'value2');
            assert.equal(treeview.option(option), 'value2', 'option ' + option + ' was transferred dynamically');
        });
    });

    QUnit.test('Pass dataSource to treeview on optionChanged', function(assert) {
        const menu = new Menu(this.$element, {
            dataSource: ['item1'],
            adaptivityEnabled: true
        });
        menu.option('dataSource', ['item2']);
        assert.strictEqual(menu._treeView.getDataSource().items()[0], 'item2', '_treeView.getDataSource().items()[0]');
    });

    QUnit.test('Pass items to treeview on optionChanged', function(assert) {
        const menu = new Menu(this.$element, {
            items: ['item1'],
            adaptivityEnabled: true
        });

        const items2 = ['item2'];
        menu.option('dataSource', items2);
        assert.strictEqual(menu._treeView.option('items')[0], 'item2', '_treeView.option(items)[0]');
    });

    QUnit.test('Call option(items[0].disabled, true), adaptivityEnabled: false', function(assert) {
        const menu = new Menu(this.$element, {
            adaptivityEnabled: false,
            items: [
                { text: 'item1', disabled: false },
                { text: 'item2', disabled: false },
            ],
        });

        menu.option('items[0].disabled', true);
        assert.strictEqual(menu.option('items[0].disabled'), true, 'menu.option(items[0].disabled)');
        assert.equal(menu._treeView, null, 'menu._treeView');
    });

    QUnit.test('Call option(items[0].disabled, true), items, adaptivityEnabled:true', function(assert) {
        const menu = new Menu(this.$element, {
            adaptivityEnabled: true,
            items: [
                { text: 'item1', disabled: false },
                { text: 'item2', disabled: false },
            ],
        });

        menu.option('items[0].disabled', true);
        assert.strictEqual(menu.option('items[0].disabled'), true, 'menu.option(items[0].disabled)');
        assert.strictEqual(menu._treeView.option('items[0].disabled'), true, 'menu._treeView.option(items[0].disabled)');
        // TODO: TreeView log is empty - assert.strictEqual(treeViewOptionChangedLog, 'item[0].disabled', 'treeViewOptionChangedLog');
    });

    QUnit.test('Call option(items[0].disabled, true), dataSource, adaptivityEnabled:true', function(assert) {
        const menu = new Menu(this.$element, {
            adaptivityEnabled: true,
            dataSource: [
                { text: 'item1', disabled: false },
                { text: 'item2', disabled: false },
            ],
        });

        menu.option('items[0].disabled', true);
        assert.strictEqual(menu.option('items[0].disabled'), true, 'menu.option(items[0].disabled)');
        assert.strictEqual(menu._treeView.option('items[0].disabled'), true, 'menu._treeView.option(items[0].disabled)');
        // TODO: TreeView log is empty - assert.strictEqual(treeViewOptionChangedLog, 'item[0].disabled', 'treeViewOptionChangedLog');
    });

    QUnit.test('selectByClick option should be transferred to the treeview', function(assert) {
        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            selectByClick: false
        });
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const treeview = $treeview.dxTreeView('instance');

        assert.notOk(treeview.option('selectByClick'), 'selectByClick is correct on init');

        menu.option('selectByClick', true);

        assert.ok(treeview.option('selectByClick'), 'selectByClick is correct on option changed');
    });

    QUnit.test('animationEnabled option should be true in the dxTreeView if animation option in the dxMenu is not null', function(assert) {
        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const treeview = $treeview.dxTreeView('instance');

        assert.strictEqual(treeview.option('animationEnabled'), true, 'animation is enabled in the dxTreeView by default');

        menu.option('animation', null);

        assert.strictEqual(treeview.option('animationEnabled'), false, 'animation has been changed to disabled');
    });

    QUnit.test('Data of tree view doesn\'t load twice when uses the custom store', function(assert) {
        const that = this;
        let dataLoadCounter = 0;
        const clock = sinon.useFakeTimers();

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
        const expectedItems = [
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
        const expectedItems = [
            { text: 'item4' },
            { text: 'item5' }
        ];

        testTreeViewDataSourceItems(assert, new DataSource({ store: this.items }), expectedItems, function(menu) {
            menu.option('dataSource', new DataSource({ store: expectedItems }));
        });
    });

    function testTreeViewDataSourceItems(assert, inputDataSource, expectedData, action) {
        const menu = new Menu($('#menu'), {
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
                    { text: 'item2-1', url: 'http://some_url_item_2-1', linkAttr: { target: '_blank' } },
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
    QUnit.test('link attributes should be set correctly (T1181342)', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $item = this.$element.find(`.${DX_TREEVIEW_ITEM_CLASS}`).eq(1);

        $($item).trigger('dxclick');

        const itemWithAttributes = $(`.${ITEM_URL_CLASS}`)[0];

        assert.strictEqual(itemWithAttributes.getAttribute('href'), 'http://some_url_item_2-1');
        assert.strictEqual(itemWithAttributes.getAttribute('target'), '_blank');
    });

    QUnit.test('link should be clicked programmatically if item.url is set', function(assert) {
        const clickSpy = sinon.spy();

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const parentTreeviewItem = $(`.${DX_TREEVIEW_ITEM_CLASS}`).eq(1);

        parentTreeviewItem.trigger('dxclick');

        const treeviewItem = $(`.${DX_TREEVIEW_ITEM_CLASS}`).eq(2);
        const urlItem = $(`.${ITEM_URL_CLASS}`)[0];
        urlItem.click = clickSpy;

        treeviewItem.trigger('dxclick');

        assert.ok(clickSpy.calledOnce);
    });

    QUnit.test('link should be clicked programmatically with enter key if item.url is set', function(assert) {
        if(!isDeviceDesktop(assert)) {
            assert.ok(true);
            return;
        }

        const clickSpy = sinon.spy();

        new Menu(this.$element, {
            items: [
                { text: 'item1' },
                {
                    text: 'item2', url: 'http://url2',
                    items: [
                        { text: 'item2-1' },
                        { text: 'item2-2' }
                    ]
                }],
            adaptivityEnabled: true
        });

        const $hamburgerButton = $(`.${DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS}`);
        const $treeview = $(`.${ DX_TREEVIEW_CLASS}`);
        const keyboard = keyboardMock($treeview);

        $hamburgerButton.trigger('dxclick');
        $treeview.trigger('focusin');

        const urlItem = $treeview.find(`.${ITEM_URL_CLASS}`)[0];
        urlItem.click = clickSpy;

        keyboard.press('down')
            .press('enter');

        assert.ok(clickSpy.calledOnce);
    });

    QUnit.test('Adaptive menu should be shown when hamburger button clicked', function(assert) {
        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

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

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

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

        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $item = this.$element.find('.' + DX_TREEVIEW_ITEM_CLASS).eq(0);

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

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

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

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

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
        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        menu.option('width', 500);

        assert.ok(this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).is(':hidden'), 'hamburger button is hidden');
    });

    QUnit.test('Menu should toggle it\'s view between adaptive and non adaptive on visibilityChanged event', function(assert) {
        $('#qunit-fixture').width(500);

        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            visible: false
        });
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $('#qunit-fixture').width(50);
        menu.option('visible', true);

        assert.notOk($itemsContainer.is(':visible'), 'non adaptive container should be hidden');
    });

    QUnit.test('Adaptive menu should not flick when the window has been resized with jQuery 3.3.1', function(assert) {
        const getOuterWidth = sinon.spy(implementationsMap, 'getOuterWidth');
        const setOuterWidth = sinon.spy(implementationsMap, 'setOuterWidth');

        try {
            new Menu(this.$element, {
                items: [{ text: 'item 1' }, { text: 'item 2' }],
                adaptivityEnabled: true
            });

            assert.equal(getOuterWidth.callCount + setOuterWidth.callCount, 3, 'itemWidth has been called for each item and container on render');

            resizeCallbacks.fire();
            assert.equal(getOuterWidth.callCount + setOuterWidth.callCount, 4, 'itemWidth has been called just for container on dimension change');
        } finally {
            getOuterWidth.restore();
            setOuterWidth.restore();
        }
    });

    QUnit.test('Adaptive mode should depend on summary item width but not on item container width', function(assert) {
        $('#qunit-fixture').width(500);

        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true,
            visible: false
        });
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $('#qunit-fixture').width(50);
        $itemsContainer.width(50);

        menu.option('visible', true);

        assert.notOk($itemsContainer.is(':visible'), 'non adaptive container should be hidden');
    });

    QUnit.test('Adaptive mode should not show on visibility change when adaptivity is disabled', function(assert) {
        $('#qunit-fixture').width(500);

        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: false,
            visible: false
        });
        const $itemsContainer = this.$element.find('.' + DX_MENU_HORIZONTAL).eq(0);

        $('#qunit-fixture').width(50);
        menu.option('visible', true);

        assert.ok($itemsContainer.is(':visible'), 'non adaptive container should be visible');
    });

    QUnit.test('TreeView items should be collapsed when adaptive menu hiding', function(assert) {
        const items = [{ text: 'item 1', expanded: true, items: [{ text: 'item 11' }] }];

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

        const $item = this.$element.find('.' + DX_MENU_ITEM_CLASS).eq(1);

        $($item).trigger('dxclick');

        const submenu = getSubMenuInstance($item);
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

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

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

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);
        const $item2 = $treeview.find('.dx-treeview-item').eq(1);
        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        const overlayPositioned = sinon.stub();
        const $overlayContent = $(overlay.content());

        overlay.on('positioned', overlayPositioned);

        $($button).trigger('dxclick');
        const height = getOuterHeight($overlayContent);

        $($item2).trigger('dxclick');
        assert.ok(getOuterHeight($overlayContent) > height, 'overlay should be enlarged');
        assert.equal(overlayPositioned.callCount, 2, 'overlay\'s position should be recalculated');

        $($item2).trigger('dxclick');
        assert.equal(getOuterHeight($overlayContent), height, 'overlay should be shrinked');
        assert.equal(overlayPositioned.callCount, 3, 'overlay\'s position should be recalculated');
    });

    QUnit.test('Adaptive width limit should contain only root items', function(assert) {
        const menu = new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });
        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $item2 = menu.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).eq(1);

        $('#qunit-fixture').width(50);
        resizeCallbacks.fire();

        $($item2).trigger('dxclick');

        $('#qunit-fixture').width(MENU_ITEM_WIDTH * this.items.length + 1);
        resizeCallbacks.fire();

        assert.ok($button.is(':hidden'), 'adaptive mode should be disabled');
    });

    QUnit.test('TreeView should be focused after click on hamburger button (T1207839)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        new Menu(this.$element, {
            items: this.items,
            adaptivityEnabled: true
        });

        const $button = this.$element.find('.' + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).eq(0);
        const $treeview = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0);

        $($button).trigger('dxclick');

        assert.ok($treeview.hasClass(DX_STATE_FOCUSED_CLASS), 'treeview is focused');
    });
});

QUnit.module('Aria accessibility', {
    beforeEach: function() {
        this.helper = new ariaAccessibilityTestHelper({});
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('Nested submenu has the "menu" role', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenu({
            items: [{
                text: 'item 1',
                items: [{
                    text: 'item 11',
                    items: [{
                        text: 'item 111',
                    }],
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $item1.trigger('dxclick');

        const submenu = getSubMenuInstance($item1);
        const $overlayContent = $(submenu.getOverlayContent());

        const $menuItem = $overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).first();
        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $menuItem.get(0) }));
        $menuItem.trigger('dxpointermove');
        this.clock.tick(0);
        const $secondLevelSubmenu = $overlayContent.find(`.${DX_SUBMENU_CLASS}`).eq(1);

        this.helper.checkAttributes($secondLevelSubmenu, { role: 'menu' });
    });

    QUnit.test('Nested submenu items has not "dxPrivateComponent" text in alt', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const menu = createMenu({
            items: [{
                text: 'item 1',
                items: [{
                    text: 'item 11',
                    items: [{
                        text: 'item 111',
                        icon: 'icon.png',
                    }],
                }],
            }],
            showFirstSubmenuMode: 'onClick',
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $item1 = $(menu.element).find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $item1.trigger('dxclick');

        const submenu = getSubMenuInstance($item1);
        const $overlayContent = $(submenu.getOverlayContent());

        const $menuItem = $overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).first();
        $(submenu.itemsContainer()).trigger($.Event('dxhoverstart', { target: $menuItem.get(0) }));
        $menuItem.trigger('dxpointermove');
        this.clock.tick(0);

        const $icon = $overlayContent.find(`.${DX_ICON_CLASS}`).eq(0);

        this.helper.checkAttributes($icon, { src: 'icon.png', alt: 'item icon' });
    });
});

function createMenu(options) {
    const $menu = $('#menu').dxMenu(options);
    const menuInstance = $menu.dxMenu('instance');

    return { instance: menuInstance, element: $menu };
}

function getSubMenuInstance($rootItem) {
    const $el = $rootItem.children('.' + DX_CONTEXT_MENU_CLASS);
    return $el.length && Submenu.getInstance($el);
}

function hoverSubmenuItemByIndex(submenu, itemIndex) {
    const $itemContainer = $(submenu.itemsContainer());
    const $item = $itemContainer.find('.' + DX_MENU_ITEM_CLASS).eq(itemIndex);

    $itemContainer.trigger($.Event('dxhoverstart', { target: $item.get(0) }));
    $item.trigger('dxpointermove');
}

function createMenuInWindow(options) {
    const $menu = $($('#simpleMenu').dxMenu(options).css({
        position: 'absolute',
        top: 10100,
        left: 10100,
        background: 'blue'
    }));
    const menuInstance = $menu.dxMenu('instance');

    return { instance: menuInstance, element: $menu };
}

function createMenuForHoverStay(options) {
    const $menu = $($('#simpleMenu').dxMenu(options).css({
        position: 'absolute',
        top: 10000,
        left: 10000,
        background: 'blue'
    }));
    const menuInstance = $menu.dxMenu('instance');

    return { instance: menuInstance, element: $menu };
}

function transferActionTest(eventName, expectedArgs, triggerFunc) {
    QUnit.test(eventName + ' action should be transferred to the treeview when \'on\' binding is used', function(assert) {
        const handler = sinon.spy();

        const menu = new Menu(this.$element, {
            items: [{ text: 'Item 1' }, { text: 'Item 2', items: [{ text: 'Item 21' }] }],
            adaptivityEnabled: true
        });
        const treeView = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0).dxTreeView('instance');

        menu.on(eventName, handler);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 1, 'handler for \'on\' was called once');
        $.each(expectedArgs, function(_, argument) {
            assert.ok(handler.getCall(0).args[0], argument + ' is exist in parameters');
        });

        handler.resetHistory();
        menu.off(eventName);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 0, 'handler for \'on\' was not executed after unsubscribe');
    });

    QUnit.test(eventName + ' action should be transferred to the treeview when option is used', function(assert) {
        const optionName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
        const handler = sinon.spy();

        const menu = new Menu(this.$element, {
            items: [{ text: 'Item 1' }, { text: 'Item 2', items: [{ text: 'Item 21' }] }],
            adaptivityEnabled: true
        });
        const treeView = this.$element.find('.' + DX_TREEVIEW_CLASS).eq(0).dxTreeView('instance');

        menu.option(optionName, handler);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 1, 'handler for option was called once');
        $.each(expectedArgs, function(_, argument) {
            assert.ok(handler.getCall(0).args[0][argument], argument + ' is exist in parameters');
        });

        handler.resetHistory();
        menu.option(optionName, undefined);
        triggerFunc(treeView);
        assert.equal(handler.callCount, 0, 'handler for option was not executed after unsubscribe');
    });
}

QUnit.module('itemRendered event', () => { // T906117
    const testDataSource = [{
        text: 'item1',
        items: [{
            text: 'item1_1',
            items: [{
                text: 'item1_1_1'
            }]
        }]
    }];

    function bindCallback(menu, bindingOption, callback) {
        if(bindingOption === 'property') {
            menu.option('onItemRendered', callback);
        } else {
            menu.on('itemRendered', callback);
        }
    }

    ['property', 'event'].forEach(bindingOption => {
        QUnit.test(`itemRendered callback is called for all level nodes. Binding via ${bindingOption}`, function(assert) {
            const expectedItemsArray = [];
            const callback = (e) => {
                assert.equal(e.component, menu, 'component arg is menu');
                assert.equal(e.element, menu.element(), 'element arg is menu');
                assert.equal($(e.itemElement).text().trim(), e.itemData.text, 'item element text is equals to the item text');
                expectedItemsArray.push(e.itemData.text);
            };

            const menu = $('#menu').dxMenu().dxMenu('instance');
            bindCallback(menu, bindingOption, callback);

            menu.option('dataSource', testDataSource);
            ['item1', 'item1_1']
                .forEach(item => {
                    const element = $(`.${DX_MENU_ITEM_TEXT_CLASS}`);

                    if(element.text().includes(item)) {
                        element.trigger('dxclick');
                    }
                });


            assert.equal(expectedItemsArray.length, 3);
            assert.equal(expectedItemsArray[0], 'item1');
            assert.equal(expectedItemsArray[1], 'item1_1');
            assert.equal(expectedItemsArray[2], 'item1_1_1');
        });

        QUnit.test(`removing callback from menu removes callbacks from submenu too. Binding via ${bindingOption}`, function(assert) {
            const expectedItemsArray = [];
            const callback = (e) => expectedItemsArray.push(e.itemData.text);

            const menu = $('#menu').dxMenu().dxMenu('instance');
            bindCallback(menu, bindingOption, callback);

            if(bindingOption === 'property') {
                menu.option('onItemRendered', null);
            } else {
                menu.off('itemRendered');
            }

            menu.option('dataSource', testDataSource);
            ['item1', 'item1_1']
                .forEach(item => {
                    const element = $(`.${DX_MENU_ITEM_TEXT_CLASS}`);

                    if(element.text().includes(item)) {
                        element.trigger('dxclick');
                    }
                });

            assert.equal(expectedItemsArray.length, 0);
        });
    });

    QUnit.test('itemRendered callback is called for menu & treeview items, adaptivityEnabled: true (T1092214)', function(assert) {
        const onItemRenderedHandler = sinon.stub();

        $('#menu').dxMenu({
            dataSource: testDataSource,
            adaptivityEnabled: true,
            width: 50,
            onItemRendered: onItemRenderedHandler
        });

        const checkRenderedItem = (call, itemText, itemClass) => {
            const itemRenderedHandlerArgs = onItemRenderedHandler.getCall(call).args[0];

            assert.strictEqual(itemRenderedHandlerArgs.itemData.text, itemText);
            assert.ok($(itemRenderedHandlerArgs.itemElement).hasClass(itemClass));
        };

        assert.strictEqual(onItemRenderedHandler.callCount, 2);
        checkRenderedItem(0, 'item1', DX_MENU_ITEM_CLASS);
        checkRenderedItem(1, 'item1', DX_TREEVIEW_ITEM_CLASS);

        const $treeview = $('#menu').find(`.${DX_TREEVIEW_CLASS}`);
        $treeview.find(`.${DX_TREEVIEW_ITEM_CLASS}`).eq(0).trigger('dxclick');
        assert.strictEqual(onItemRenderedHandler.callCount, 3);
        checkRenderedItem(2, 'item1_1', DX_TREEVIEW_ITEM_CLASS);

        $treeview.find(`.${DX_TREEVIEW_ITEM_CLASS}`).eq(1).trigger('dxclick');
        assert.strictEqual(onItemRenderedHandler.callCount, 4);
        checkRenderedItem(3, 'item1_1_1', DX_TREEVIEW_ITEM_CLASS);
    });
});
