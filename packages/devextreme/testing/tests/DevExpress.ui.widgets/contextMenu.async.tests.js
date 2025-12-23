import $ from 'jquery';
import ContextMenu from 'ui/context_menu';
import devices from '__internal/core/m_devices';
import { SCROLLABLE_CONTAINER_CLASS } from '__internal/ui/scroll_view/consts';

import 'ui/button';

const DX_SUBMENU_CLASS = 'dx-submenu';
const DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS = 'dx-menu-items-container';
const DX_MENU_ITEM_CLASS = 'dx-menu-item';

QUnit.testStart(() => {
    const markup = '\
        <div id="simpleMenu"></div>\
        <div id="menuTarget"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Context menu', () => {
    // T755681
    QUnit.test('Context menu should shown in the same position after repaint()', function(assert) {
        const done = assert.async();

        const menuTargetSelector = '#menuTarget';
        const instance = new ContextMenu($('#simpleMenu'), {
            items: [{ text: 'item 1' }],
            target: menuTargetSelector,
        });

        $(menuTargetSelector).trigger($.Event('dxcontextmenu', {
            pageX: 120,
            pageY: 50
        }));

        const $target = $(menuTargetSelector);

        instance.option('onShown', (e) => {
            const position = e.component._overlay.option('position');
            assert.equal(position.at, 'top left', 'at of overlay position');
            assert.equal(position.my, 'top left', 'my of overlay position');
            assert.equal(position.of.pageX, 120, 'pageX of overlay position');
            assert.equal(position.of.pageY, 50, 'pageX of overlay position');
            assert.equal(position.of.target, $target.get(0), 'target of overlay position');
            done();
        });

        instance.repaint();
    });

    QUnit.test('Add item on positioning', function(assert) {
        const menuTargetSelector = '#menuTarget';
        const instance = new ContextMenu($('#simpleMenu'), {
            items: [{ text: 'item 1' }],
            target: menuTargetSelector,
            onPositioning: (actionArgs) => {
                actionArgs.component.option('items').push({ text: 'item 2' });
            }
        });

        $(menuTargetSelector).trigger($.Event('dxcontextmenu', {
            pageX: 120,
            pageY: 50
        }));

        assert.strictEqual(instance.option('items').length, 2, 'items.length');
    });

    QUnit.test('Context menu should calculate correct height for root submenu on async render (T1306389)', function(assert) {
        const done = assert.async();

        const menuTargetSelector = '#menuTarget';
        const items = [
            { text: 'item 1', template: 'myTemplate' },
            { text: 'item 2', template: 'myTemplate' },
            { text: 'item 3', template: 'myTemplate' },
            { text: 'item 4', template: 'myTemplate' },
            { text: 'item 5', template: 'myTemplate' }
        ];

        const instance = new ContextMenu($('#simpleMenu'), {
            target: menuTargetSelector,
            items,
            templatesRenderAsynchronously: true,
            itemTemplate: 'myTemplate',
            showSubmenuMode: { name: 'onHover', delay: 0 },
            integrationOptions: {
                templates: {
                    myTemplate: {
                        render({ model, container, onRendered }) {
                            setTimeout(() => {
                                $('<div>').text(`Async: ${model.text}`).appendTo(container);
                                onRendered();
                            }, 10);
                        }
                    }
                }
            },
        });

        instance.option('onShown', () => {
            setTimeout(() => {
                const $itemsContainer = $(instance._getItemsContainers());
                const $scrollableContainer = $(instance._overlay.$content()).find(`.${SCROLLABLE_CONTAINER_CLASS}`);

                const itemsHeight = $itemsContainer.outerHeight();
                const scrollableContainerHeight = $scrollableContainer.outerHeight();

                assert.roughEqual(itemsHeight, scrollableContainerHeight, 1,
                    `Items container height (${itemsHeight}) should match scrollable height (${scrollableContainerHeight})`);

                done();
            }, 10);
        });

        $(menuTargetSelector).trigger($.Event('dxcontextmenu'));
    });

    QUnit.test('Context menu should have correct height for submenus on async render (T1258881)', function(assert) {
        const done = assert.async();

        const menuTargetSelector = '#menuTarget';
        const items = [{
            text: 'root',
            items: [
                { text: 'sub 1', template: 'myTemplate' },
                { text: 'sub 2', template: 'myTemplate' },
                { text: 'sub 3', template: 'myTemplate' },
                { text: 'sub 4', template: 'myTemplate' },
                { text: 'sub 5', template: 'myTemplate' },
                { text: 'sub 6', template: 'myTemplate' },
                { text: 'sub 7', template: 'myTemplate' },
            ]
        }];

        const instance = new ContextMenu($('#simpleMenu'), {
            target: menuTargetSelector,
            items,
            templatesRenderAsynchronously: true,
            itemTemplate: 'myTemplate',
            showSubmenuMode: { name: 'onHover', delay: 0 },
            integrationOptions: {
                templates: {
                    myTemplate: {
                        render({ model, container, onRendered }) {
                            setTimeout(() => {
                                $('<div>').text(model.text).appendTo(container);
                                onRendered();
                            });
                        }
                    }
                }
            },
        });

        instance.option('onShown', (e) => {
            setTimeout(() => {
                const $itemsContainer = instance.itemsContainer();
                const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);
                const eventName = devices.real().deviceType === 'desktop' ? 'dxhoverstart' : 'dxclick';

                $($itemsContainer).trigger($.Event(eventName, { target: $rootItem.get(0) }));

                setTimeout(() => {
                    const $submenus = $(`.${DX_SUBMENU_CLASS}`);

                    const $nestedSubmenu = $submenus.eq(1);
                    const $nestedSubmenuItemsContainer = $nestedSubmenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`);
                    const $scrollableContainer = $nestedSubmenu.find(`.${SCROLLABLE_CONTAINER_CLASS}`);
                    const itemsHeight = $nestedSubmenuItemsContainer.outerHeight();
                    const scrollableContainerHeight = $scrollableContainer.outerHeight();

                    assert.roughEqual(itemsHeight, scrollableContainerHeight, 1,
                        `Items container height (${itemsHeight}) should match scrollable height (${scrollableContainerHeight})`);

                    done();
                }, 10);
            }, 10);
        });

        $(menuTargetSelector).trigger($.Event('dxcontextmenu'));
    });
});

