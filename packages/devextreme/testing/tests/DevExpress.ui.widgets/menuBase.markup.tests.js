import $ from 'jquery';
import MenuBase from 'ui/context_menu/ui.menu_base';

import 'fluent_blue_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="menu"></div>';

    $('#qunit-fixture').html(markup);
});

const DX_MENU_BASE_CLASS = 'dx-menu-base';
const DX_MENU_ITEM_CLASS = 'dx-menu-item';

function createMenu(options) {
    const element = $('#menu');
    const instance = new MenuBase(element, options);

    return { instance, element };
}

QUnit.module('Menu markup', () => {
    QUnit.test('Create menu with default css', function(assert) {
        const menuBase = createMenu();

        assert.ok(menuBase.element.hasClass(DX_MENU_BASE_CLASS));
    });

    QUnit.module('Disabled item cursor style (T1327513)', () => {
        QUnit.test('enabled menu item should have pointer cursor', function(assert) {
            const menuBase = createMenu({
                items: [
                    { text: 'Item 1' },
                    { text: 'Item 2', disabled: true },
                ],
            });

            const $enabledItem = menuBase.element.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);
            const cursor = $enabledItem.css('cursor');

            assert.strictEqual(cursor, 'pointer', 'enabled item has pointer cursor');
        });

        QUnit.test('disabled menu item should have default cursor', function(assert) {
            const menuBase = createMenu({
                items: [
                    { text: 'Item 1' },
                    { text: 'Item 2', disabled: true },
                ],
            });

            const $disabledItem = menuBase.element.find(`.${DX_MENU_ITEM_CLASS}`).eq(1);
            const cursor = $disabledItem.css('cursor');

            assert.strictEqual(cursor, 'default', 'disabled item has default cursor');
        });

        QUnit.test('item should have default cursor when disabled at runtime', function(assert) {
            const menuBase = createMenu({
                items: [
                    { text: 'Item 1', disabled: false },
                    { text: 'Item 2', disabled: false },
                ],
            });

            menuBase.instance.option('items[1].disabled', true);

            const $disabledItem = menuBase.element.find(`.${DX_MENU_ITEM_CLASS}`).eq(1);
            const cursor = $disabledItem.css('cursor');

            assert.strictEqual(cursor, 'default', 'item has default cursor after disabling at runtime');
        });

        QUnit.test('items in disabled menu should have default cursor', function(assert) {
            const menuBase = createMenu({
                disabled: true,
                items: [
                    { text: 'Item 1' },
                    { text: 'Item 2' },
                ],
            });
            const $item = menuBase.element.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);
            const cursor = $item.css('cursor');
            assert.strictEqual(cursor, 'default', 'items in disabled menu have default cursor');
        });

        QUnit.test('menu items with url should have correct cursor', function(assert) {
            const menuBase = createMenu({
                items: [
                    { text: 'Item 1', url: 'https://example.com' },
                    { text: 'Item 2', url: 'https://example.com/disabled', disabled: true },
                ],
            });

            const $enabledItem = menuBase.element.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);
            const enabledItemCursor = $enabledItem.css('cursor');

            const $disabledItem = menuBase.element.find(`.${DX_MENU_ITEM_CLASS}`).eq(1);
            const disabledItemCursor = $disabledItem.css('cursor');

            assert.strictEqual(enabledItemCursor, 'pointer', 'enabled item with url has pointer cursor');
            assert.strictEqual(disabledItemCursor, 'default', 'disabled item with url has default cursor');
        });
    });
});
