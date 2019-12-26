import $ from 'jquery';
import devices from 'core/devices';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import MenuBase from 'ui/context_menu/ui.menu_base';
import keyboardMock from '../../helpers/keyboardMock.js';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

import 'common.css!';

QUnit.testStart(function() {
    var markup =
        '<div id="menuContainer1" style="width: 100%; height: 100%"></div>\
        <div id="menuContainer3" style="width: 100%; height: 100%"></div>\
        <div id="menuContainer2" style="width: 100%; height: 100%"></div>\
        <div id="menu"></div>\
        <div class="dx-viewport"></div>';

    $('#qunit-fixture').html(markup);
});

var DX_MENU_CLASS = 'dx-menu',
    DX_MENU_ITEM_CLASS = DX_MENU_CLASS + '-item',
    DX_MENU_ITEM_CONTENT_CLASS = DX_MENU_ITEM_CLASS + '-content',
    DX_MENU_ITEM_TEXT_CLASS = DX_MENU_ITEM_CLASS + '-text',
    DX_MENU_ITEM_POPOUT_CLASS = DX_MENU_ITEM_CLASS + '-popout',
    DX_MENU_ITEM_POPOUT_CONTAINER_CLASS = DX_MENU_ITEM_POPOUT_CLASS + '-container',
    DX_MENU_ITEM_WRAPPER_CLASS = DX_MENU_ITEM_CLASS + '-wrapper',
    DX_ICON_CLASS = 'dx-icon',
    DX_MENU_NO_ICONS_CLASS = DX_MENU_CLASS + '-no-icons',
    DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + '-items-container',
    DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + '-expanded',
    DX_MENU_SEPARATOR_CLASS = DX_MENU_CLASS + '-separator',
    DX_MENU_ITEM_LAST_GROUP_ITEM = DX_MENU_CLASS + '-last-group-item',

    DX_ITEM_SELECTED_CLASS = 'dx-menu-item-selected',
    DX_STATE_DISABLED_CLASS = 'dx-state-disabled',

    DX_ITEM_HAS_TEXT = DX_MENU_ITEM_CLASS + '-has-text',
    DX_ITEM_HAS_ICON = DX_MENU_ITEM_CLASS + '-has-icon',
    DX_ITEM_HAS_SUBMENU = DX_MENU_ITEM_CLASS + '-has-submenu';


var TestComponent = MenuBase.inherit({
    NAME: 'TestComponent',
    _itemDataKey: function() {
        return '123';
    },
    _itemContainer: function() {
        return this.$element();
    }
});

function createMenu(options) {
    var element = $('#menu'),
        instance = new TestComponent(element, options);

    return { instance: instance, element: element };
}

var isDeviceDesktop = function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'if device is not desktop we do not QUnit.test the case');
        return false;
    }
    return true;
};


QUnit.module('Menu rendering', () => {
    QUnit.test('Render root submenu group', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'a' }, { text: 'b' }] }),
            $itemsContainer = menuBase.element.find('.' + DX_MENU_ITEMS_CONTAINER_CLASS),
            $itemWrappers = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS),
            $firstItem = $itemWrappers.first().children();

        assert.equal($itemsContainer.length, 1);
        assert.ok($itemsContainer.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS));

        assert.equal($itemWrappers.length, 2);
        assert.ok($itemWrappers.first().hasClass(DX_MENU_ITEM_WRAPPER_CLASS));
        assert.equal($firstItem.length, 1);
        assert.ok($firstItem.hasClass(DX_MENU_ITEM_CLASS));
    });

    QUnit.test('Render empty item', function(assert) {
        var menuBase = createMenu({ items: [{}] }),
            $itemWrappers = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS),
            $item = $itemWrappers.children(),
            $menuItemContent = $item.children('.' + DX_MENU_ITEM_CONTENT_CLASS),
            $menuItemCaption = $menuItemContent.children();

        assert.equal($itemWrappers.length, 1);
        assert.equal($item.length, 1);
        assert.ok($item.hasClass(DX_MENU_ITEM_CLASS));

        assert.equal($menuItemContent.length, 1);
        assert.equal($menuItemCaption.length, 0);
    });

    QUnit.test('Render string as item', function(assert) {
        var menuBase = createMenu({ items: ['a'] }),
            $itemWrappers = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS),
            $item = $itemWrappers.children(),
            $menuItemContent = $item.children();

        assert.equal($itemWrappers.length, 1, 'there is 1 item wrapper in menu');
        assert.equal($item.length, 1, 'there is 1 item in menu');
        assert.ok($item.hasClass(DX_MENU_ITEM_CLASS), 'item has dx-menu-item class');

        assert.equal($menuItemContent.length, 1, 'there is 1 item content in item');
    });

    QUnit.test('Render popout at item', function(assert) {
        var menuBase = createMenu({ items: [{ text: '', items: [{ text: '' }] }] }),
            $itemWrappers = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS),
            $item = $itemWrappers.children(),
            $menuItemContent = $item.children('.' + DX_MENU_ITEM_CONTENT_CLASS);

        assert.equal($itemWrappers.length, 1, 'there is 1 item wrapper in menu');
        assert.equal($item.length, 1, 'there is 1 item in menu');
        assert.ok($item.hasClass(DX_MENU_ITEM_CLASS), 'item has dx-menu-item class');
        assert.ok($item.hasClass(DX_ITEM_HAS_SUBMENU), 'item has dx-menu-item-has-submenu class');

        assert.equal($menuItemContent.length, 1, 'there is 1 item content in item');

        assert.equal($menuItemContent.children().length, 1, 'there is 1 element inside item-content');
        assert.ok($($menuItemContent.children()[0]).hasClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS), 'content has dx-menu-item-popout-container class');
        assert.ok($($menuItemContent.children()[0]).children().hasClass(DX_MENU_ITEM_POPOUT_CLASS), 'there is popout-class inside popout-container');
    });

    QUnit.test('Render item with imageCSS', function(assert) {
        var menuBase = createMenu({ items: [{ icon: 'imageCssClass' }] }),
            $itemWrappers = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS),
            $item = $itemWrappers.children(),
            $menuItemContent = $item.children('.' + DX_MENU_ITEM_CONTENT_CLASS);

        assert.equal($itemWrappers.length, 1, 'there is 1 item wrapper in menu');
        assert.equal($item.length, 1, 'there is 1 item in menu');
        assert.ok($item.hasClass(DX_MENU_ITEM_CLASS), 'item has dx-menu-item class');
        assert.ok($item.hasClass(DX_ITEM_HAS_ICON), 'item has dx-menu-item-has-icon class');

        assert.equal($menuItemContent.length, 1, 'there is 1 item content in item');

        assert.equal($menuItemContent.children().length, 1, 'there is 1 element inside item-content');
        assert.ok($($menuItemContent.children()[0]).hasClass(DX_ICON_CLASS), 'there is dx-icon class inside item-content');
        assert.ok($($menuItemContent.children()[0]).hasClass('dx-icon-imageCssClass'), 'there is new custom dx-icon-smth class inside item-content');
    });

    QUnit.test('Render item with icon path', function(assert) {
        var menuBase = createMenu({ items: [{ icon: '1.png' }] }),
            $itemWrappers = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS),
            $item = $itemWrappers.children(),
            $menuItemContent = $item.children('.' + DX_MENU_ITEM_CONTENT_CLASS);

        assert.equal($itemWrappers.length, 1, 'there is 1 item wrapper in menu');
        assert.equal($item.length, 1, 'there is 1 item in menu');
        assert.ok($item.hasClass(DX_MENU_ITEM_CLASS), 'item has dx-menu-item class');
        assert.ok($item.hasClass(DX_ITEM_HAS_ICON), 'item has dx-menu-item-has-icon class');

        assert.equal($menuItemContent.length, 1, 'there is 1 item content in item');

        assert.equal($menuItemContent.children().length, 1, 'there is 1 element inside item-content');
        assert.ok($($menuItemContent.children()[0]).hasClass(DX_ICON_CLASS), 'there is dx-icon class inside item-content');
        assert.ok($($menuItemContent.children()[0]).attr('src'), '1.png', 'image is right');
    });

    QUnit.test('Render item with expressions', function(assert) {
        var menuBase = createMenu({
                displayExpr: 'name',
                selectionMode: 'single',
                selectedExpr: 'isSelected',
                itemsExpr: 'children',
                disabledExpr: 'active',
                items: [{ name: 'a', active: true, children: [{ name: 'a1' }] }, { name: 'a', isSelected: true }]
            }),
            $items = menuBase.element.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 2, 'there are 2 items in menu');
        assert.equal($items.eq(0).text(), 'a', 'text is right');

        assert.ok($items.eq(0).hasClass(DX_ITEM_HAS_TEXT), 'item has correct content class');
        assert.ok($items.eq(0).hasClass(DX_ITEM_HAS_SUBMENU), 'item has correct content class');
        assert.ok($items.eq(0).hasClass(DX_STATE_DISABLED_CLASS), 'item is disabled');
        assert.ok($items.eq(1).hasClass(DX_ITEM_SELECTED_CLASS), 'item is selected');
    });

    QUnit.test('Render separator', function(assert) {
        var menuBase = createMenu({ items: [{ text: '1' }, { text: '2', beginGroup: true }] }),
            $item1 = $(menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS)[0]),
            $separators = menuBase.element.find('.' + DX_MENU_SEPARATOR_CLASS);

        assert.equal($separators.length, 1, 'separator rendered');
        assert.ok($item1.hasClass(DX_MENU_ITEM_LAST_GROUP_ITEM));
    });

    QUnit.test('Add rtl class if necessary', function(assert) {
        var menuBase = createMenu({ rtlEnabled: true, items: [{ text: 'testItem', imageCSS: 'imageCssClass' }] });

        assert.ok(menuBase.element.hasClass('dx-rtl'));
    });

    QUnit.test('Separator should not be shown if there is no visible items after it (T289333)', function(assert) {
        var menuBase = createMenu({
            items: [{ text: 'itemA' }, { text: 'itemB', beginGroup: true, visible: false }, { text: 'itemC', beginGroup: true, visible: false }]
        });

        assert.equal(menuBase.element.find('.dx-menu-separator').length, 0, 'there is no separators');
    });

    QUnit.test('Separator should be shown if there are visible items after it (T289333)', function(assert) {
        var menuBase = createMenu({
            items: [{ text: 'itemA' }, { text: 'itemB', beginGroup: true, visible: false }, { text: 'itemC', beginGroup: true, visible: false }, { text: 'itemD' }]
        });

        assert.equal(menuBase.element.find('.dx-menu-separator').length, 1, 'separator is visible');
    });

    QUnit.test('Separator should not be shown if there are no visible items before if', function(assert) {
        var menuBase = createMenu({
            items: [
                { text: '000000', visible: false },
                { text: '1111111', beginGroup: true },
                { text: '2222222' }
            ]
        });

        assert.equal(menuBase.element.find('.dx-menu-separator').length, 0, 'there is no separators');
    });

    QUnit.test('Separator should not be shown if there is an invisible item between two groups', function(assert) {
        var menuBase = createMenu({
            items: [
                { text: 'item 1', beginGroup: true, visible: false },
                { text: 'item 2', visible: false },
                { text: 'item 3', beginGroup: true },
                { text: 'item 4' }
            ]
        });

        assert.equal(menuBase.element.find('.dx-menu-separator').length, 0, 'there is no separators');
    });


    QUnit.test('Render menu with hidden items (T310028)', function(assert) {
        createMenu({ items: [{ text: 'item 1' }, { text: 'item 2', visible: false }, { text: 'item 3' }] });

        assert.equal($('.' + DX_MENU_ITEM_WRAPPER_CLASS).length, 2, 'menu should not render invisible item wrappers');
    });

    QUnit.test('item container should have dx-menu-no-icons class when menu level have no icons', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item 1' }, { text: 'item 3' }] }),
            $itemsContainer = $(menuBase.element.find('.' + DX_MENU_ITEMS_CONTAINER_CLASS));

        assert.ok($itemsContainer.hasClass(DX_MENU_NO_ICONS_CLASS), 'item container has icon class');
    });

    QUnit.test('item container should not have dx-menu-no-icons class when at least one item have icon', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item 1', icon: 'add' }, { text: 'item 3' }] }),
            $itemsContainer = $(menuBase.element.find('.' + DX_MENU_ITEMS_CONTAINER_CLASS));

        assert.notOk($itemsContainer.hasClass(DX_MENU_NO_ICONS_CLASS), 'item container has not icon class');
    });

    QUnit.test('Change item content in runtime', function(assert) {
    // arrange
        var menuBase = createMenu({ items: [{ text: 'item' }] }),
            $item;

        // act
        menuBase.instance.option('items[0].icon', 'add');
        $item = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS).children();

        // assert
        assert.ok($item.hasClass(DX_ITEM_HAS_ICON), 'item has dx-menu-item-has-icon class');
    });

    QUnit.test('Remove extra classes from item frame if content is changed', function(assert) {
    // arrange
        var menuBase = createMenu({ items: [{ text: 'item' }] }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS).children();

        assert.ok($item.hasClass(DX_ITEM_HAS_TEXT), 'item has dx-menu-item-has-text class');

        // act
        menuBase.instance.option('items[0]', { text: '', icon: 'add' });
        $item = menuBase.element.find('.' + DX_MENU_ITEM_WRAPPER_CLASS).children();

        // assert
        assert.notOk($item.hasClass(DX_ITEM_HAS_TEXT), 'dx-menu-item-has-text class was removed');
    });

    QUnit.test('Encode text for default item template', function(assert) {
        var menuBase = createMenu({
                items: [{ text: '<b>Test item</b>' }]
            }),
            $element = menuBase.element;

        assert.equal($element.find('.dx-menu-item-text').first().text(), '<b>Test item</b>');
    });

    QUnit.test('Encoding is not used for html parameter in default item template', function(assert) {
        var menuBase = createMenu({
                items: [{ html: '<b>Test item</b>' }]
            }),
            $element = menuBase.element;

        assert.equal($element.find('.dx-menu-item-content').first().text(), 'Test item');
    });
});

QUnit.module('Menu tests', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
// T428079
    QUnit.test('Menu should work properly with key fields', function(assert) {
        createMenu({ items: [{ text: 'Item 1' }, { text: 'Item 2', id: 1 }] });
        assert.ok(true, 'menu was rendered without exceptions');
    });
});

QUnit.module('ShowSubmenuMode', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Show onClick', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }], showSubmenuMode: { name: 'onClick' } }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $item.trigger('dxclick');
        this.clock.setTimeout(50);
        assert.ok($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS));
    });

    QUnit.test('Show onClick mode set as string', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }], showSubmenuMode: 'onClick' }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $item.trigger('dxclick');
        this.clock.setTimeout(50);
        assert.ok($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS));
    });

    QUnit.test('showSubmenuMode - by default', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }] }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        if(isDeviceDesktop(assert)) {
            menuBase.element.trigger({ target: $item.get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded');
            this.clock.tick(25);
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded yet');
            this.clock.tick(25);
            assert.ok($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is expanded');
        }
    });

    QUnit.test('showSubmenuMode - onHover - set as object and delay set as number', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }], showSubmenuMode: { type: 'onHover', delay: 50 } }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        if(isDeviceDesktop(assert)) {
            menuBase.element.trigger({ target: $item.get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded');
            this.clock.tick(25);
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded yet');
            this.clock.tick(25);
            assert.ok($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is expanded');
        }
    });

    QUnit.test('showSubmenuMode - onHover - function has item element as parameter', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }], showSubmenuMode: { type: 'onHover', delay: 50 } }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        menuBase.instance._showSubmenu = function($item) {
            assert.ok(!!$item);
        };

        if(isDeviceDesktop(assert)) {
            menuBase.element.trigger({ target: $item.get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            this.clock.tick(55);
        }
    });

    QUnit.test('showSubmenuMode - onHover - set as object and delay set as object too', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }], showSubmenuMode: { type: 'onHover', delay: { show: 100, hide: 500 } } }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        if(isDeviceDesktop(assert)) {
            menuBase.element.trigger({ target: $item.get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded');
            this.clock.tick(50);
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded yet');
            this.clock.tick(50);
            assert.ok($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is expanded');
        }
    });

    QUnit.test('showSubmenuMode - onHover - set as string without delay', function(assert) {
        var menuBase = createMenu({ items: [{ text: 'item1', items: [{ text: 'item1-1' }] }], showSubmenuMode: 'onHover' }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        if(isDeviceDesktop(assert)) {
            menuBase.element.trigger({ target: $item.get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded');
            this.clock.tick(25);
            assert.ok(!$item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is not expanded yet');
            this.clock.tick(25);
            assert.ok($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Menu is expanded');
        }
    });

    QUnit.test('previous submenu should not appear if other submenu shown timeout is started', function(assert) {
        var menuBase = createMenu({
                items: [
                    { text: 'item1', items: [{ text: 'item1-1' }] },
                    { text: 'item2', items: [{ text: 'item2-1' }] }
                ],
                showSubmenuMode: { name: 'onHover', delay: 300 }
            }),
            $rootItems = menuBase.element.find('.' + DX_MENU_ITEM_CLASS);

        if(isDeviceDesktop(assert)) {
            menuBase.element.trigger({ target: $rootItems.eq(0).get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            this.clock.tick(25);

            menuBase.element.trigger({ target: $rootItems.eq(1).get(0), type: 'dxpointerenter', pointerType: 'mouse' });
            this.clock.tick(300);

            assert.notOk($rootItems.eq(0).hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'First item is not expanded');
            assert.ok($rootItems.eq(1).hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'Second item is expanded');
        }
    });
});

QUnit.module('Selection', () => {
    QUnit.test('Default value of selectedItem option', function(assert) {
        var menuBase = createMenu({
            items: [{ text: 'item1' }],
            selectionMode: 'single'
        });
        assert.ok(menuBase.instance);
        assert.equal(menuBase.instance.option('selectedItem'), null);
    });

    QUnit.test('Check that selected item updates by reference', function(assert) {
        var dataSource = [
                { text: 'item1', selected: true },
                { text: 'item2' },
                { text: 'item3' }
            ],
            menuBase = createMenu({
                items: dataSource,
                selectionMode: 'single'
            }),
            selectedItem;

        assert.ok(menuBase.instance);
        menuBase.instance.option('selectedItem', dataSource[1]);
        selectedItem = menuBase.instance.option('selectedItem');
        assert.equal(selectedItem.text, 'item2');
    });

    QUnit.test('By default, rendered menu item has no selected class', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' },
                { text: 'item3' },
                { text: 'item4' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 4);
        assert.ok(!$items.eq(0).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok(!$items.eq(1).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok(!$items.eq(2).hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok(!$items.eq(3).hasClass(DX_ITEM_SELECTED_CLASS));
    });

    QUnit.test('Set selected item via item.selected option', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2', selected: true },
                { text: 'item3' },
                { text: 'item4' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_ITEM_SELECTED_CLASS);

        assert.equal($items.length, 1);
        assert.equal($items.find('.' + DX_MENU_ITEM_TEXT_CLASS).text(), 'item2');
    });

    QUnit.test('Priority of selection', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2', selected: true },
                { text: 'item3' }],
            menuBase = createMenu({
                items: items,
                selectedItem: items[2],
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_ITEM_SELECTED_CLASS);

        assert.equal($items.length, 1);
        assert.equal($items.find('.' + DX_MENU_ITEM_TEXT_CLASS).text(), 'item3');
    });

    QUnit.test('Try to set selected state of several items via item.selected option', function(assert) {
        var items = [
                { text: 'item1', selected: true },
                { text: 'item2', selected: true }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_ITEM_SELECTED_CLASS);

        assert.equal($items.length, 1);
        assert.equal($items.find('.' + DX_MENU_ITEM_TEXT_CLASS).text(), 'item2');
    });

    QUnit.test('Set selected item via selectedItem option', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' },
                { text: 'item3' }],
            menuBase = createMenu({
                items: items,
                selectedItem: items[1],
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_ITEM_SELECTED_CLASS);

        assert.equal($items.length, 1);
        assert.equal($items.find('.' + DX_MENU_ITEM_TEXT_CLASS).eq(0).text(), 'item2');
    });

    QUnit.test('Do not select item on click by default', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $item1 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0),
            $item2 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(1);

        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'At start item1 has no selected item class');
        assert.ok(!$item2.hasClass(DX_ITEM_SELECTED_CLASS), 'At start item2 has no selected item class');
        assert.ok(!menuBase.instance.option('selectedItem'), 'No selected item in menu options');

        $item1.trigger('dxclick');
        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Selected item class was not added to item1 after click');
        assert.equal(menuBase.instance.option('selectedItem'), null, '"selectionItem" did not change in menu options');
        assert.ok(!menuBase.instance.option('items')[0].selected, 'Field "selected" did not added to item1');

        $item2.trigger('dxclick');
        assert.ok(!$item2.hasClass(DX_ITEM_SELECTED_CLASS), 'Selected item class was not added to item2 after click');
        assert.equal(menuBase.instance.option('selectedItem'), null, '"selectionItem" did not change in menu options');
        assert.ok(!menuBase.instance.option('items')[1].selected, 'Field "selected" did not added to item2');
    });

    QUnit.test('Select item on click', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single',
                selectByClick: true
            }),
            $item1 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0),
            $item2 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(1);

        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'At start item1 has no selected item class');
        assert.ok(!$item2.hasClass(DX_ITEM_SELECTED_CLASS), 'At start item2 has no selected item class');
        assert.ok(!menuBase.instance.option('selectedItem'), 'No selected item in menu options');

        $item1.trigger('dxclick');
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item1 after click');
        assert.equal(menuBase.instance.option('selectedItem'), items[0], '"selectionItem"=item1 in menu options');
        assert.ok(menuBase.instance.option('items')[0].selected, 'Field "selected" added to item1');

        $item2.trigger('dxclick');
        assert.ok($item2.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item2 after click');
        assert.equal(menuBase.instance.option('selectedItem'), items[1], '"selectionItem"=item2 in menu options');
        assert.ok(menuBase.instance.option('items')[1].selected, 'Field "selected" added to item2');
        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Removed selected item class from item1');
    });

    QUnit.test('Select item after third click', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single',
                selectByClick: true
            }),
            $item1 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        assert.ok(!menuBase.instance.option('selectedItem'), 'No selected item in menu options');

        $item1.trigger('dxclick');
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item1 after click');
        assert.equal(menuBase.instance.option('selectedItem'), items[0], '"selectionItem"=item1 in menu options');
        assert.ok(menuBase.instance.option('items')[0].selected, 'Field "selected" added to item1');

        $item1.trigger('dxclick');
        assert.equal(menuBase.instance.option('selectedItem'), undefined, '"selectionItem"=undefined in menu options');
        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Removed selected item class from item1');
        assert.ok(!menuBase.instance.option('items')[0].selected, 'Field "selected" added to item1');
        assert.ok(!menuBase.instance.option('items')[1].selected, 'Field "selected" added to item1');

        $item1.trigger('dxclick');
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item1 after click');
        assert.equal(menuBase.instance.option('selectedItem'), items[0], '"selectionItem"=item1 in menu options');
        assert.ok(menuBase.instance.option('items')[0].selected, 'Field "selected" added to item1');
    });

    QUnit.test('Select item via selectItem method', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_MENU_ITEM_CLASS),
            $item1 = $items.eq(0),
            $item2 = $items.eq(1);

        menuBase.instance.selectItem($item1[0]);
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item1');
        assert.equal(menuBase.instance.option('selectedItem'), items[0], '"selectionItem"=item1 in menu options');
        assert.ok(menuBase.instance.option('items')[0].selected, 'Field "selected" added to item1');

        menuBase.instance.selectItem($item2[0]);
        assert.ok($item2.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item2 after click');
        assert.equal(menuBase.instance.option('selectedItem'), items[1], '"selectionItem"=item2 in menu options');
        assert.ok(menuBase.instance.option('items')[1].selected, 'Field "selected" added to item2');
        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Removed selected item class from item1');
    });

    QUnit.test('Unselect item via unselectItem method', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_MENU_ITEM_CLASS),
            $item1 = $items.eq(0);

        menuBase.instance.selectItem($item1[0]);
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Added selected item class to item1');
        assert.equal(menuBase.instance.option('selectedItem'), items[0], '"selectionItem"=item1 in menu options');
        assert.ok(menuBase.instance.option('items')[0].selected, 'Field "selected" added to item1');

        menuBase.instance.unselectItem($item1[0]);
        assert.equal(menuBase.instance.option('items')[0].selected, false);
        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS), 'Removed selected item class from item1');
    });

    QUnit.test('fire \'onSelectionChanged\' action', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            actionCount = 0,
            menuBase = createMenu({
                items: items,
                selectionMode: 'single',
                selectByClick: true,
                onSelectionChanged: function() { actionCount++; }
            }),
            $item1 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(0),
            $item2 = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(1);

        $item1.trigger('dxclick');
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS));
        assert.equal(actionCount, 1);

        $item2.trigger('dxclick');
        assert.ok(!$item1.hasClass(DX_ITEM_SELECTED_CLASS));
        assert.equal(actionCount, 2);
    });

    QUnit.test('onSelectionChanged should have correct API (T311914)', function(assert) {
        assert.expect(4);

        var items = [
                { text: 'item1' },
                { text: 'item2' }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single',
                selectByClick: true,
                onSelectionChanged: function(e) {
                    assert.equal(e.component, this, 'e.component should be an instance of menu');
                    assert.ok($(e.element).get(0).nodeType, 'e.element should be dom node or jquery object');
                    assert.ok($.isArray(e.addedItems), 'e.addedItems should be array');
                    assert.ok($.isArray(e.removedItems), 'e.removedItems should be array');
                }
            }),
            $item = menuBase.element.find('.' + DX_MENU_ITEM_CLASS).eq(1);

        $item.trigger('dxclick');
    });

    QUnit.test('Prevent selection item on click', function(assert) {
        var items = [
                { text: 'item1' },
                {
                    text: 'item2',
                    selected: true,
                    items: [
                        { text: 'item2-1' },
                        { text: 'item2-2' }
                    ]
                }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single',
                selectByClick: true
            }),
            $items = menuBase.element.find('.' + DX_MENU_ITEM_CLASS),
            $item1 = $items.eq(1),
            $item2 = $items.eq(2);

        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok(!$item2.hasClass(DX_ITEM_SELECTED_CLASS));

        $item2.children('.' + DX_MENU_ITEM_CLASS).eq(0).trigger('dxclick');
        assert.ok($item1.hasClass(DX_ITEM_SELECTED_CLASS));
        assert.ok(!$item2.hasClass(DX_ITEM_SELECTED_CLASS));
    });

    QUnit.test('Prevent selection', function(assert) {
        var items = [
                { text: 'item1' },
                { text: 'item2', selected: true, selectable: false }
            ],
            menuBase = createMenu({
                items: items,
                selectionMode: 'single'
            }),
            $items = menuBase.element.find('.' + DX_ITEM_SELECTED_CLASS);

        assert.equal($items.length, 0);
    });
});

QUnit.module('Keyboard navigation', () => {
    QUnit.test('select item when space pressed', function(assert) {
        assert.expect(3);

        var menuBase = createMenu({
            selectionMode: 'single',
            items: [
                { text: 'item1' },
                { text: 'item2' }
            ],
            focusStateEnabled: true
        });

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');

        keyboardMock(menuBase.element)
            .keyDown('down')
            .keyDown('space');

        assert.equal(isRenderer(menuBase.instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal(menuBase.instance.option('selectedItem').text, 'item2', 'correct item is selected');
    });

    QUnit.test('if selection mode is none  not select item when space pressed', function(assert) {
        assert.expect(2);

        var menuBase = createMenu({
            selectionMode: 'none',
            items: [
                { text: 'item1' },
                { text: 'item2' }
            ],
            focusStateEnabled: true
        });

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');

        keyboardMock(menuBase.element)
            .keyDown('down')
            .keyDown('down')
            .keyDown('space');

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');
    });

    QUnit.test('if item.selectable is false not select item when space pressed', function(assert) {
        assert.expect(2);

        var menuBase = createMenu({
            selectionMode: 'none',
            items: [
                { text: 'item1' },
                { text: 'item2', selectable: false }
            ],
            focusStateEnabled: true
        });

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');

        keyboardMock(menuBase.element)
            .keyDown('down')
            .keyDown('down')
            .keyDown('space');

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');
    });

    QUnit.test('if selection mode is unknown  not select item when space pressed', function(assert) {
        assert.expect(2);

        var menuBase = createMenu({
            selectionMode: 'myNewAwesomeSelection',
            items: [
                { text: 'item1' },
                { text: 'item2' }
            ],
            focusStateEnabled: true
        });

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');

        keyboardMock(menuBase.element)
            .keyDown('down')
            .keyDown('down')
            .keyDown('space');

        assert.ok(!menuBase.instance.option('selectedItem'), 'there is no selected item');
    });

    QUnit.test('Raise onItemClick on root item click', function(assert) {
        var itemClickArgs = [],
            menuBase = createMenu({
                onItemClick: function(arg) { itemClickArgs.push(arg.itemData); },
                items: [{ text: 'a', customField: 'cf' }]
            }),
            $items = menuBase.element.find('.' + DX_MENU_ITEM_CLASS);
        this.clock = sinon.useFakeTimers();

        $($items[0]).trigger('dxclick');
        assert.equal(itemClickArgs.length, 1);
        assert.equal(itemClickArgs[0].text, 'a');
        assert.equal(itemClickArgs[0].customField, 'cf');

        this.clock.restore();
    });
});

var helper;

QUnit.module('Aria accessibility', {
    beforeEach: () => {
        helper = new ariaAccessibilityTestHelper({
            createWidget: ($element, options) => new TestComponent($element,
                $.extend({
                    focusStateEnabled: true,
                }, options))
        });
    },
    afterEach: () => {
        helper.$widget.remove();
    }
}, () => {
    QUnit.test('Items: [1]', () => {
        helper.createWidget({ items: [1] });
        helper.checkAttributes(helper.$widget, { tabindex: '0' }, 'widget');
        helper.checkItemsAttributes([], { role: 'menuitem', tabindex: '-1' });
    });

    QUnit.test('Items: [{items[{}, {}], {}] -> set focusedElement: items[0]', () => {
        helper.createWidget({
            items: [{ text: 'Item1_1', items: [{ text: 'Item2_1' }, { text: 'Item2_2' }] }, { text: 'item1_2' }]
        });

        helper.checkAttributes(helper.$widget, { tabindex: '0' }, 'widget');
        helper.checkAttributes(helper.getItems().eq(0), { role: 'menuitem', tabindex: '-1', 'aria-haspopup': 'true' }, 'Items[0]');
        helper.checkAttributes(helper.getItems().eq(1), { role: 'menuitem', tabindex: '-1' }, 'Items[1]');

        helper.widget.option('focusedElement', helper.getItems().eq(0));

        helper.checkAttributes(helper.$widget, { 'aria-activedescendant': helper.focusedItemId, tabindex: '0' }, 'widget');
        helper.checkAttributes(helper.getItems().eq(0), { id: helper.focusedItemId, role: 'menuitem', tabindex: '-1', 'aria-haspopup': 'true' }, 'Items[0]');
        helper.checkAttributes(helper.getItems().eq(1), { role: 'menuitem', tabindex: '-1' }, 'Items[1]');
    });
});
