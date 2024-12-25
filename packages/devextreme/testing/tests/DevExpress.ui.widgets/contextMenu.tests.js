import $ from 'jquery';
import devices from '__internal/core/m_devices';
import domAdapter from '__internal/core/m_dom_adapter';
import resizeCallbacks from 'core/utils/resize_callbacks';
import support from '__internal/core/utils/m_support';
import { implementationsMap, getWidth, getHeight } from 'core/utils/size';
import fx from 'common/core/animation/fx';
import ContextMenu from 'ui/context_menu';
import { addNamespace } from 'common/core/events/utils/index';
import contextMenuEvent from 'common/core/events/contextmenu';
import holdEvent from 'common/core/events/hold';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import keyboardMock from '../../helpers/keyboardMock.js';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

import 'ui/button';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="simpleMenu"></div>\
        <div id="menuTarget"></div>\
        <div id="menuTarget2"></div>\
        <div id="menuShower"></div>';

    $('#qunit-fixture').html(markup);
});

const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS = 'dx-menu-items-container';
const DX_MENU_ITEM_CLASS = 'dx-menu-item';
const DX_ICON_CLASS = 'dx-icon';
const DX_MENU_ITEM_CONTENT_CLASS = 'dx-menu-item-content';
const DX_MENU_PHONE_CLASS = 'dx-menu-phone-overlay';
const DX_MENU_ITEM_SELECTED_CLASS = 'dx-menu-item-selected';
const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const DX_STATE_FOCUSED_CLASS = 'dx-state-focused';
const DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
const DX_MENU_ITEM_EXPANDED_CLASS = 'dx-menu-item-expanded';
const DX_MENU_ITEM_POPOUT_CLASS = 'dx-menu-item-popout';
const DX_SUBMENU_CLASS = 'dx-submenu';
const DX_HAS_SUBMENU_CLASS = 'dx-menu-item-has-submenu';
const DX_OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';

const isDeviceDesktop = function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'skip this test on mobile devices');
        return false;
    }
    return true;
};

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        this.items = [
            { text: 'Item 1' },
            { text: 'Item 2', items: [] },
            { text: 'Item 3', items: [{ text: 'Item 31', items: [{ text: 'Item 311' }, { text: 'Item 312' }] }] },
            { text: 'Item 4', items: [{ text: 'Item 41' }, { text: 'Item 42' }] }
        ];

        this.$element = $('#simpleMenu');

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('Rendering', moduleConfig, () => {
    QUnit.test('all items in root level should be wrapped in submenu', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 'item1' }], visible: true });
        const $itemsContainer = instance.itemsContainer();

        assert.ok($itemsContainer.children().hasClass(DX_SUBMENU_CLASS), 'items are wrapped in submenu');
    });

    QUnit.test('lazy rendering: not render overlay on init', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 'item1' }] });
        let $itemsContainer = instance.itemsContainer();

        assert.ok(!$itemsContainer, 'no itemsContainer');

        instance.show();
        $itemsContainer = instance.itemsContainer();
        assert.ok($itemsContainer.length, 'overlay is defined');
    });

    QUnit.test('item click should not prevent document click handler', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'a' }]
        });

        const documentClickHandler = sinon.stub();

        $(document).on('click', documentClickHandler);
        instance.show();
        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);
        $($items.eq(0)).trigger('click');

        assert.equal(documentClickHandler.callCount, 1, 'click was not prevented');
        $(document).off('click');
    });

    QUnit.test('context menu items with submenu should have \'has-submenu\' class', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item1', items: [{ text: 'item11' }] }],
            visible: true
        });

        let $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');

        $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        assert.ok($items.eq(0).hasClass(DX_HAS_SUBMENU_CLASS), 'item with children has special class');
        assert.notOk($items.eq(1).hasClass(DX_HAS_SUBMENU_CLASS), 'item without children has not special class');
    });

    QUnit.test('context menu items with submenu should have item popout', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item1', items: [{ text: 'item11' }] }],
            visible: true
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 1, 'only one item popout exist');
        assert.equal($items.eq(0).find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 1, 'popout is on the first item');
    });

    QUnit.test('item container should have special class for phone devices', function(assert) {
        const device = devices.current();

        devices.current({ deviceType: 'phone' });

        try {
            const instance = new ContextMenu(this.$element, { visible: true });
            assert.ok(instance.itemsContainer().hasClass(DX_MENU_PHONE_CLASS));
        } finally {
            devices.current(device);
        }
    });

    QUnit.test('context menu should create only root level at first', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11' }] }],
            visible: true
        });

        const submenus = instance.itemsContainer().find('.' + DX_SUBMENU_CLASS);

        assert.equal(submenus.length, 1, 'only root level rendered');
    });

    QUnit.test('root level should not be rendered without items', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [], visible: true });
        const submenus = instance.itemsContainer().find('.' + DX_SUBMENU_CLASS);

        assert.equal(submenus.length, 0, 'there is no submenus in menu');
    });

    QUnit.test('submenus should not be rendered without items', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: true,
            items: [{ text: 'item1', items: [] }]
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');

        const submenus = instance.itemsContainer().find('.' + DX_SUBMENU_CLASS);

        assert.equal(submenus.length, 1, 'empty submenu should not rendered');
        assert.equal($itemsContainer.find('.' + DX_MENU_ITEM_POPOUT_CLASS).length, 0, 'there are no popouts in items');
        assert.notOk($rootItem.hasClass(DX_HAS_SUBMENU_CLASS), 'root item has no \'has-submenu\' class');
    });

    QUnit.test('onSubmenuCreated should be fired after submenu was rendered', function(assert) {
        const onSubmenuCreated = sinon.spy();

        const instance = new ContextMenu(this.$element, {
            visible: true,
            onSubmenuCreated,
            items: [{ text: 'item1', items: [{ text: 'item11' }] }]
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');
        assert.equal(onSubmenuCreated.callCount, 1, 'handler was called once');

        $($rootItem).trigger('dxclick');
        assert.equal(onSubmenuCreated.callCount, 1, 'handler should not be called after the second click');

        instance.hide();
        instance.show();
        $($rootItem).trigger('dxclick');
        assert.equal(onSubmenuCreated.callCount, 1, 'handler should not be called after the second showing');
    });

    QUnit.test('contextMenu should not create a new overlay after refresh', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 1 }, { text: 2 }] });

        instance.option('items', [{ text: 3 }, { text: 4 }]);
        instance.show();
        this.clock.tick(0);
        assert.equal(this.$element.find('.dx-overlay').length, 1, 'only one overlay should exists');
    });

    QUnit.test('submenus in the same level should have same horizontal offset', function(assert) {
        const instance = new ContextMenu(this.$element, {
            target: '#menuTarget',
            items: [
                { text: 'item1', items: [{ text: 'subItem1' }] },
                { text: 'item2WithVeryVeryLongCaption', items: [{ text: 'subItem2' }] }
            ],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();
        let $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);
        const offsets = [];

        $($items.eq(0)).trigger('dxclick');
        $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);
        offsets[0] = $items.eq(1).offset().left;

        $($items.eq(2)).trigger('dxclick');
        $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);
        offsets[1] = $items.eq(3).offset().left;

        assert.equal(offsets[0], offsets[1], 'offsets are equal');
    });

    QUnit.test('event handlers should be bound for detached target', function(assert) {
        const $target = $('#menuTarget');
        const $parent = $target.parent();

        $target.detach();

        const contextMenu = new ContextMenu(this.$element, { target: '#menuTarget', items: [{ text: 'a' }] });
        $parent.append($target);
        $($target).trigger('dxcontextmenu');

        assert.ok(contextMenu.option('visible'), 'context menu is shown after detached target been attached');
    });

    QUnit.test('not attach keyboard handler on rendering', function(assert) {
        const instance = new ContextMenu(this.$element, {});

        assert.notOk(instance._keyboardListenerId);
    });

    QUnit.test('ContextMenu icon image should have alt attribute with "dxContextMenu item icon" text', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'Item text', icon: 'some_icon.jpg', }],
            visible: true,
        });
        const $icon = instance.itemsContainer().find(`.${DX_MENU_ITEM_CLASS} .${DX_ICON_CLASS}`);

        assert.strictEqual($icon.attr('alt'), 'dxContextMenu item icon');
    });
});

QUnit.module('Repaint', moduleConfig, () => {
    QUnit.test('On repaint all submenus should be hidden without console errors (T1257288)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'Item 1', items: [{ text: 'Item 11' }, { text: 'Item 12' }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 },
            onItemClick: (e) => e.component.repaint(),
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(0);

        const $submenus = $(`.${DX_SUBMENU_CLASS}`);
        const $nestedSubmenu = $submenus.eq(1);
        const $nestedSubmenuItem = $nestedSubmenu.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        assert.strictEqual($submenus.length, 2, 'Nested submenu is shown');

        try {
            $($nestedSubmenuItem).trigger('dxclick');

            assert.ok(true, 'No errors were thrown');
        } catch(e) {
            assert.ok(false, `Error: ${e.message}`);
        }
    });
});

QUnit.module('Rendering Scrollable', moduleConfig, () => {
    const DX_SCROLLABLE_CLASS = 'dx-scrollable';
    const DX_SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
    const DX_SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
    const BORDER_WIDTH = 1;
    const SUBMENU_PADDING = 10;

    QUnit.test('Context menu should init Scrollable', function(assert) {
        new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

        const $submenu = $(`.${DX_SUBMENU_CLASS}`);

        assert.strictEqual($submenu.length, 1, 'only 1 submenu exists');
        assert.ok($submenu.hasClass(DX_SCROLLABLE_CLASS), 'Scrollable initialized');
    });

    QUnit.test('Scrollable should be initialized on a 2nd level submenu', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(0);

        const $submenus = $(`.${DX_SUBMENU_CLASS}`);

        assert.strictEqual($submenus.length, 2, '2 submenu exists');

        const $nestedSubmenu = $submenus.eq(1);
        assert.ok($nestedSubmenu.hasClass(DX_SCROLLABLE_CLASS), 'Scrollable initialized on nested menu');
    });

    QUnit.test('Height of the submenu should not exceed content height', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });

        const $rootSubmenu = $(`.${DX_SUBMENU_CLASS}`);
        const $itemsContainer = $rootSubmenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`);

        assert.roughEqual($rootSubmenu.height(), $itemsContainer.outerHeight(), .1);
    });

    QUnit.test('Nested submenu should be positioned to a clicked item', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })) }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });
        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(0);

        const $submenus = $(`.${DX_SUBMENU_CLASS}`);
        const $nestedSubmenu = $submenus.eq(1);
        const $nestedItemsContainer = $nestedSubmenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`).eq(0);
        assert.strictEqual($rootItem.offset().top, $nestedItemsContainer.offset().top, 'Nested submenu aligned to a clicked item');
        assert.strictEqual(
            $nestedSubmenu.height(),
            $(window).height() - $nestedItemsContainer.offset().top - SUBMENU_PADDING,
            'Nested submenu uses all available space'
        );
    });

    QUnit.test('Flipping 2nd level submenu', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{
                text: 'item 11',
                items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })),
            }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 },
            position: {
                my: 'bottom',
                at: 'bottom',
                of: window,
            }
        });
        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).last();

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(0);

        const $submenus = $(`.${DX_SUBMENU_CLASS}`);
        const $nestedSubmenu = $submenus.eq(1);
        const availableHeight = Math.min($rootItem.offset().top + $($rootItem).outerHeight(), $(window).height()) - SUBMENU_PADDING;

        assert.roughEqual($nestedSubmenu.offset().top, SUBMENU_PADDING - BORDER_WIDTH, .5, 'Nested submenu flipped to top');
        assert.roughEqual($nestedSubmenu.height(), availableHeight, .5, 'Nested submenu aligned to a clicked item');
    });

    QUnit.test('Height of the context menu should be limited', function(assert) {
        new ContextMenu(this.$element, {
            items: (new Array(99)).fill(null).map((_, idx) => ({ text: idx })),
            visible: true,
        });

        const $submenu = $(`.${DX_SUBMENU_CLASS}`);

        assert.ok($submenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`).height() > $(window).height(), 'total height of submenu exceeds the window');
        assert.strictEqual($submenu.outerHeight(), $(window).height(), 'menu uses the full height of the window');
        assert.strictEqual($submenu.offset().top, 0, 'menu does not cross the window border');
    });

    QUnit.test('Selected item should be always visible during keyboard navigation (root menu)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
            focusStateEnabled: true,
            visible: true,
        });
        const $scrollableContainer = $(instance.itemsContainer()).find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $(instance.itemsContainer()).find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        assert.strictEqual($scrollableContent.position().top, 0, 'initial position');

        keyboardMock(instance.itemsContainer())
            .press('up')
            .press('up');

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom'
        );

        keyboardMock(instance.itemsContainer())
            .press('down');

        assert.roughEqual($scrollableContent.position().top, -BORDER_WIDTH, 1, 'scrolled back to the 1st item');
    });

    QUnit.test('Selected item should be always visible during keyboard navigation (nested menu)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) }],
            focusStateEnabled: true,
            visible: true,
        });

        keyboardMock(instance.itemsContainer())
            .press('down')
            .press('right')
            .press('up');

        const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $scrollableContainer = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height(),
            2,
            'scrolled to bottom'
        );

        keyboardMock(instance.itemsContainer())
            .press('down');

        assert.roughEqual($scrollableContent.position().top, 0, 2, 'scrolled back to the 1st item');
    });

    QUnit.test('Scroll position should be set to 0 after reopen (root menu)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })),
            focusStateEnabled: true,
            visible: true,
        });
        const $scrollableContainer = $(instance.itemsContainer()).find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $(instance.itemsContainer()).find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        keyboardMock(instance.itemsContainer())
            .press('up')
            .press('up');

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom'
        );

        instance.hide();
        instance.show();

        assert.roughEqual($scrollableContent.position().top, 0, 1, 'scroll position is reset');
    });

    QUnit.test('Scroll position should be set to 0 after reopen (nested menu, KBN)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) }],
            focusStateEnabled: true,
            visible: true,
        });

        keyboardMock(instance.itemsContainer())
            .press('down')
            .press('right')
            .press('up');

        const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $scrollableContainer = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom'
        );

        keyboardMock(instance.itemsContainer())
            .press('left')
            .press('right');

        assert.roughEqual($scrollableContent.position().top, 0, 1, 'scroll position is reset');
    });

    QUnit.test('Scroll position should be set to 0 after reopen (nested menu, pointer)', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) },
                { text: 2, items: [{ text: 21 }] },
            ],
            focusStateEnabled: true,
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 }
        });
        const $itemsContainer = instance.itemsContainer();
        const item1 = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).first();
        const item2 = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).last();

        keyboardMock(instance.itemsContainer())
            .press('down')
            .press('right')
            .press('up');

        const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
        const $scrollableContainer = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTAINER_CLASS}`);
        const $scrollableContent = $nestedSubmenu.find(`.${DX_SCROLLABLE_CONTENT_CLASS}`);

        assert.roughEqual(
            $scrollableContent.position().top,
            $scrollableContainer.height() - $scrollableContent.height() + BORDER_WIDTH,
            1,
            'scrolled to bottom'
        );

        $(item2).trigger('dxclick');
        $(item1).trigger('dxclick');

        assert.roughEqual($scrollableContent.position().top, 0, 1, 'scroll position is reset');
    });

    QUnit.test('Scrollable content should have min-height: auto to prevent invisible 3rd level submenus bug on iOS', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 },
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(0);

        $(`.${DX_SCROLLABLE_CONTENT_CLASS}`).each((_, scrollableContent) => {
            assert.strictEqual(window.getComputedStyle(scrollableContent).minHeight, '0px', 'min-height = auto');
        });
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
            const instance = new ContextMenu(this.$element, {
                items: [{ text: 1, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) }],
                focusStateEnabled: true,
                visible: true,
                showSubmenuMode: { name: 'onHover', delay: 0 }
            });
            const $itemsContainer = instance.itemsContainer();
            const $item1 = $($itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0));

            $item1.trigger('dxclick');

            const windowHeight = 100;
            this.setWindowHeight(windowHeight);
            resizeCallbacks.fire();

            const $nestedSubmenu = $(`.${DX_SUBMENU_CLASS}`).eq(1);
            const $nestedItemsContainer = $nestedSubmenu.find(`.${DX_CONTEXT_MENU_ITEMS_CONTAINER_CLASS}`).eq(0);

            assert.strictEqual(
                $nestedSubmenu.height(),
                windowHeight - $nestedItemsContainer.offset().top - SUBMENU_PADDING,
                'Nested submenu uses height is updated'
            );
        });

        QUnit.test('Submenu flipping', function(assert) {
            const instance = new ContextMenu(this.$element, {
                items: [
                    { text: 1 },
                    { text: 2 },
                    { text: 3, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) },
                    { text: 4 },
                    { text: 5 },
                ],
                focusStateEnabled: true,
                visible: true,
                showSubmenuMode: { name: 'onHover', delay: 0 }
            });
            const $itemsContainer = instance.itemsContainer();
            const $item = $($itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(2));

            $item.trigger('dxclick');

            const $nestedSubmenu = $item.find(`.${DX_SUBMENU_CLASS}`).eq(0);

            assert.roughEqual($nestedSubmenu.offset().top, $item.offset().top, 1, 'submenu expanded to bottom');

            const windowHeight = 100;
            this.setWindowHeight(windowHeight);
            resizeCallbacks.fire();

            assert.roughEqual($nestedSubmenu.offset().top, SUBMENU_PADDING - BORDER_WIDTH, 1, 'submenu flipped to top');
        });

        QUnit.test('Submenu scrolling to an expanded item', function(assert) {
            const instance = new ContextMenu(this.$element, {
                items: [
                    {
                        text: 'root',
                        items: [
                            { text: 1 },
                            { text: 2 },
                            { text: 3 },
                            { text: 4 },
                            { text: 5, items: (new Array(99)).fill(null).map((_, idx) => ({ text: `item ${idx}` })) },
                        ],
                    },
                ],
                focusStateEnabled: true,
                visible: true,
                showSubmenuMode: { name: 'onHover', delay: 0 }
            });
            const $itemsContainer = instance.itemsContainer();
            const $item = $($itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).first());

            $item.trigger('dxclick');

            const $nestedItem = $item.find(`.${DX_MENU_ITEM_CLASS}`).last();

            $nestedItem.trigger('dxclick');

            const windowHeight = 100;
            this.setWindowHeight(windowHeight);
            resizeCallbacks.fire();

            assert.roughEqual(
                $nestedItem.offset().top,
                windowHeight - SUBMENU_PADDING - $nestedItem.outerHeight(),
                1,
                'expanded item still visible'
            );
        });
    });
});

QUnit.module('Showing and hiding context menu', moduleConfig, () => {
    QUnit.test('visible option should toggle menu\'s visibility', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 1, items: [{ text: 11 }] }], visible: true });
        const $itemsContainer = instance.itemsContainer();

        assert.ok($itemsContainer.is(':visible'), 'menu is visible');

        instance.option('visible', false);
        assert.notOk($itemsContainer.is(':visible'), 'menu is invisible');

        instance.option('visible', true);
        assert.ok($itemsContainer.is(':visible'), 'menu is visible');
    });

    QUnit.test('context menu should not leak overlays', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

        instance.option('items', [{ text: 1 }]);
        this.clock.tick(0);
        assert.equal(this.$element.find('.dx-overlay').length, 1, 'overlays cleaned correctly');
    });

    QUnit.test('show method should toggle menu\'s visibility', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: false });

        instance.show();
        assert.ok(instance.option('visible'), 'option visible was changed to true');
    });

    QUnit.test('hide method should toggle menu\'s visibility', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

        instance.hide();
        assert.notOk(instance.option('visible'), 'option visible was changed to false');
    });

    QUnit.test('expanded class should be removed from submenus after hiding menu with hide method', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();

        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(1)).trigger('dxclick');

        instance.hide();

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $items.each((_, item) => {
            const $item = $(item);
            const itemText = $item.find('.dx-menu-item-text').first().text();

            assert.notOk($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), itemText + ' has no expanded class');
        });
    });

    QUnit.test('expanded class should be removed from submenus after hiding menu with visible option', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();

        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(1)).trigger('dxclick');

        instance.option('visible', false);

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $items.each((_, item) => {
            const $item = $(item);
            const itemText = $item.find('.dx-menu-item-text').first().text();

            assert.notOk($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), itemText + ' has no expanded class');
        });
    });

    QUnit.test('expanded class should be removed from submenus after hiding menu with outside click', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();

        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(1)).trigger('dxclick');

        $(document).trigger('dxpointerdown');

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $items.each((_, item) => {
            const $item = $(item);
            const itemText = $item.find('.dx-menu-item-text').first().text();

            assert.notOk($item.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), itemText + ' has no expanded class');
        });
    });

    QUnit.test('context menu should not be shown if target is disabled', function(assert) {
        try {
            let eventCounter = 0;
            const incrementCounter = () => {
                eventCounter++;
            };

            const instance = new ContextMenu(this.$element, {
                items: [{ text: 'item 1' }],
                target: '#menuTarget',
                visible: false,
                onPositioning: incrementCounter,
                onShowing: incrementCounter,
                onShown: incrementCounter,
                onPositioned: incrementCounter
            });

            $('#menuTarget').addClass('dx-state-disabled').trigger('dxcontextmenu');

            assert.notOk(instance.option('visible'), 'context menu is not visible');
            assert.equal(eventCounter, 0, 'visibility callbacks does not fired');
        } finally {
            $('#menuTarget').removeClass('dx-state-disabled');
        }
    });

    QUnit.test('context menu should not be shown if it is disabled', function(assert) {
        try {
            let eventCounter = 0;
            const incrementCounter = () => {
                eventCounter++;
            };

            const instance = new ContextMenu(this.$element, {
                items: [{ text: 'item 1' }],
                disabled: true,
                target: '#menuTarget',
                visible: false,
                onPositioning: incrementCounter,
                onShowing: incrementCounter,
                onShown: incrementCounter,
                onPositioned: incrementCounter
            });

            $('#menuTarget').trigger('dxcontextmenu');

            assert.notOk(instance.option('visible'), 'context menu is not visible');
            assert.equal(eventCounter, 0, 'visibility callbacks does not fired');
        } finally {
            $('#menuTarget').removeClass('dx-state-disabled');
        }
    });

    QUnit.test('context menu should be shown after submenuDirection option change', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 'item 1' }], visible: true });
        let $itemsContainer;

        instance.option('visible', false);
        instance.option('submenuDirection', 'left');
        $itemsContainer = instance.itemsContainer();
        assert.ok(!$itemsContainer, 'menu is removed');

        instance.show();
        $itemsContainer = instance.itemsContainer();
        assert.ok($itemsContainer.is(':visible'), 'menu is rendered again');
    });

    QUnit.test('context menu\'s overlay should have flipfit position as native context menu', function(assert) {
        new ContextMenu(this.$element, { items: [{ text: 'item 1' }], visible: true });

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.equal(overlay.option('position').collision, 'flipfit', 'position is correct');
    });

    QUnit.test('overlay should have innerOverlay option', function(assert) {
        new ContextMenu(this.$element, { items: [{ text: 'item 1' }], visible: true });

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.ok(overlay.option('innerOverlay'));
    });

    QUnit.test('Document should be default target', function(assert) {
        const showingHandler = sinon.stub();

        new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            onShowing: showingHandler
        });

        $(window).trigger('dxcontextmenu');
        assert.equal(showingHandler.callCount, 0, 'context menu is not subscribed on the window');

        $(document).trigger('dxcontextmenu');
        assert.equal(showingHandler.callCount, 1, 'context menu is subscribed on the document');
    });

    // T459373
    QUnit.test('Show context menu when position and target is defined', function(assert) {
        const instance = new ContextMenu(this.$element, {
            target: $('#menuTarget'),
            items: [{ text: 'item 1' }],
            visible: false,
            position: {
                at: 'bottom center',
                my: 'top center',
                of: $('#menuShower')
            }
        });

        $('#menuTarget').trigger('dxcontextmenu');

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.deepEqual(overlay.option('position.of').get(0), $('#menuTarget').get(0), 'position is correct');
    });

    QUnit.test('Show context menu when position.of is defined', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            visible: false,
            position: {
                at: 'bottom center',
                my: 'top center',
                of: $('#menuShower')
            }
        });

        $('#menuShower').trigger('dxcontextmenu');

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.deepEqual(overlay.option('position.of').get(0), $('#menuShower').get(0), 'position is correct');
    });

    QUnit.test('Show context menu when position is undefined', function(assert) {
        const instance = new ContextMenu(this.$element, {
            target: $('#menuTarget'),
            items: [{ text: 'item 1' }],
            visible: false
        });

        $('#menuTarget').trigger('dxcontextmenu');

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.ok(overlay.option('position.of') instanceof $.Event, 'position is correct');
    });

    QUnit.test('Show context menu via api when position is defined', function(assert) {
        const instance = new ContextMenu(this.$element, {
            target: $('#menuTarget'),
            items: [{ text: 'item 1' }],
            visible: false,
            position: {
                at: 'bottom center',
                my: 'top center',
                of: $('#menuShower')
            }
        });

        instance.show();

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.deepEqual(overlay.option('position.of').get(0), $('#menuTarget').get(0), 'position is correct');
    });

    QUnit.test('Show context menu via api when position is undefined', function(assert) {
        const instance = new ContextMenu(this.$element, {
            target: $('#menuTarget'),
            items: [{ text: 'item 1' }],
            visible: false
        });

        instance.show();

        const overlay = this.$element.find('.dx-overlay').dxOverlay('instance');
        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.deepEqual(overlay.option('position.of').get(0), $('#menuTarget').get(0), 'position is correct');
    });

    QUnit.test('show/hide methods should return Deferred', function(assert) {
        const instance = new ContextMenu(this.$element, {
            target: $('#menuTarget'),
            items: [{ text: 'item 1' }],
            visible: false
        });

        let d = instance.show();

        assert.ok($.isFunction(d.promise), 'type object is the Deferred');

        d = instance.hide();

        assert.ok($.isFunction(d.promise), 'type object is the Deferred');
    });

    QUnit.test('overlay wrapper should have the same size as window (T1102095)', function(assert) {
        const instance = new ContextMenu(this.$element, { target: $('#menuTarget'), visible: false });

        instance.show();

        const $overlayWrapper = $(`.${DX_OVERLAY_WRAPPER_CLASS}`);

        assert.strictEqual(getWidth($overlayWrapper), getWidth($(window)), 'width is equal');
        assert.strictEqual(getHeight($overlayWrapper), getHeight($(window)), 'height is equal');
    });
});

QUnit.module('Showing and hiding submenus', moduleConfig, () => {
    QUnit.test('submenu should be shown after click on root item', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item1', items: [{ text: 'item11' }] }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');

        const submenus = $itemsContainer.find('.' + DX_SUBMENU_CLASS);

        assert.equal(submenus.length, 2, 'submenu was rendered');
        assert.ok(submenus.eq(1).is(':visible'), 'submenu is visible');
        assert.ok($rootItem.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'expanded class was added');
    });

    QUnit.test('all submenus should hide after click on item from different branch', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11' }] }, { text: 'item 2' }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();
        let $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
        $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);
        $($items.eq(2)).trigger('dxclick');

        assert.notOk($items.eq(0).is(':visible'), 'first submenu item was hidden');
        assert.notOk($items.eq(1).is(':visible'), 'second submenu item was hidden');
        assert.notOk($items.eq(0).hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'expanded class was removed from first item');
    });

    QUnit.test('submenu should not hide after click on parent submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();

        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(1)).trigger('dxclick');
        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        assert.ok($items.eq(2).is(':visible'), 'last submenu item was shown');

        $($items.eq(1)).trigger('dxclick');
        assert.ok($items.eq(1).is(':visible'), 'first submenu item is visible');
        assert.ok($items.eq(1).hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'expanded class was not removed');
    });

    QUnit.test('submenu should not hide after second click on root item', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item1', items: [{ text: 'item11' }] }],
            visible: true
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');
        $($rootItem).trigger('dxclick');

        const submenus = $itemsContainer.find('.' + DX_SUBMENU_CLASS);

        assert.equal(submenus.length, 2, 'submenu was rendered');
        assert.ok(submenus.eq(1).is(':visible'), 'submenu was expanded');
        assert.ok($rootItem.hasClass(DX_MENU_ITEM_EXPANDED_CLASS), 'expanded class was not removed');
    });

    QUnit.test('context menu should not blink after second hover on root item', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        let hideSubmenu;

        try {
            const instance = new ContextMenu(this.$element, {
                items: [{ text: 1, items: [{ text: 11 }] }],
                visible: true,
                showSubmenuMode: { name: 'onHover', delay: 0 }
            });

            const $itemsContainer = instance.itemsContainer();
            const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

            // todo: remove private spy if better solution will found
            hideSubmenu = sinon.spy(instance, '_hideSubmenu');

            $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
            this.clock.tick(0);

            $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
            this.clock.tick(0);

            assert.equal(hideSubmenu.callCount, 0, 'submenu should not hides anytime');
        } finally {
            hideSubmenu.restore();
        }
    });

    QUnit.test('custom slide animation should work for submenus', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: true,
            animation: {
                show: {
                    type: 'slide',
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            },
            items: [{ text: 'itemA', items: [{ text: 'Item A-A' }] }],
            target: '#menuTarget'
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        try {
            fx.off = false;
            $($rootItem).trigger('dxclick');
            this.clock.tick(500);
        } finally {
            fx.off = true;
        }

        const $submenus = $itemsContainer.find('.' + DX_SUBMENU_CLASS);
        const parentLeft = $submenus.eq(0).offset().left;
        const childrenLeft = $submenus.eq(1).offset().left;

        assert.ok(parentLeft < childrenLeft, 'child item should not overlap parent item');
    });
});

QUnit.module('Visibility callbacks', moduleConfig, () => {
    QUnit.test('onHiding and onHidden options with outside click', function(assert) {
        const events = [];

        new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: true,
            onHiding() {
                events.push('onHiding');
            },
            onHidden() {
                events.push('onHidden');
            }
        });

        $(document).trigger('dxpointerdown');
        assert.deepEqual(events, ['onHiding', 'onHidden'], 'events triggered and trigger order is correct');
    });

    QUnit.test('onHiding and onHidden options with hide method', function(assert) {
        const events = [];

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: true,
            onHiding() {
                events.push('onHiding');
            },
            onHidden() {
                events.push('onHidden');
            }
        });

        instance.hide();
        assert.deepEqual(events, ['onHiding', 'onHidden'], 'events triggered and trigger order is correct');
    });

    QUnit.test('onHiding and onHidden options with visible option', function(assert) {
        const events = [];

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: true,
            onHiding() {
                events.push('onHiding');
            },
            onHidden() {
                events.push('onHidden');
            }
        });

        instance.option('visible', false);
        assert.deepEqual(events, ['onHiding', 'onHidden'], 'events triggered and trigger order is correct');
    });

    QUnit.test('visibility callbacks should not fire for submenus', function(assert) {
        let events = [];

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }, { text: 2, items: [{ text: 21 }] }],
            visible: true,
            onHiding() {
                events.push('onHiding');
            },
            onHidden() {
                events.push('onHidden');
            },
            onShowing() {
                events.push('onShowing');
            },
            onShown() {
                events.push('onShown');
            }
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        events = [];

        $($items.eq(0)).trigger('dxclick');
        $($items.eq(1)).trigger('dxclick');

        assert.deepEqual(events, [], 'events was not triggered');
    });

    QUnit.test('onShowing and onShown options with show method', function(assert) {
        const events = [];

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: false,
            onShowing() {
                events.push('onShowing');
            },
            onShown() {
                events.push('onShown');
            }
        });

        instance.show();
        assert.deepEqual(events, ['onShowing', 'onShown'], 'events triggered and trigger order is correct');
    });

    QUnit.test('onShowing and onShown options should fire when visible is initially true', function(assert) {
        const events = [];

        new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: true,
            onShowing() {
                events.push('onShowing');
            },
            onShown() {
                events.push('onShown');
            }
        });

        assert.deepEqual(events, ['onShowing', 'onShown'], 'events triggered and trigger order is correct');
    });

    QUnit.test('onShowing and onShown options with visible option', function(assert) {
        const events = [];

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            visible: false,
            onShowing() {
                events.push('onShowing');
            },
            onShown() {
                events.push('onShown');
            }
        });

        instance.option('visible', true);
        assert.deepEqual(events, ['onShowing', 'onShown'], 'events triggered and trigger order is correct');
    });
});

QUnit.module('Options', moduleConfig, () => {
    QUnit.test('onItemClick option', function(assert) {
        assert.expect(1);

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'a' }],
            onItemClick(e) {
                assert.ok(true, 'onItemClick fired');
            },
            visible: true
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
    });

    QUnit.test('itemsExpr option', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: true,
            items: [{ text: 'itemA', subItems: [{ text: 'itemB' }] }],
            itemsExpr: 'subItems'
        });

        const $item = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($item).trigger('dxclick');

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 2, 'second level is rendered');
    });

    QUnit.test('target option as string', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: false,
            items: [{ text: 'itemA' }],
            target: '#menuTarget'
        });

        $('#menuTarget').trigger('dxcontextmenu');

        assert.ok(instance.option('visible'), 'menu was shown');
    });

    QUnit.test('target option as jQuery', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: false,
            items: [{ text: 'itemA' }],
            target: $('#menuTarget')
        });

        $('#menuTarget').trigger('dxcontextmenu');

        assert.ok(instance.option('visible'), 'menu was shown');
    });

    QUnit.test('target option as DOM element', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: false,
            items: [{ text: 'itemA' }],
            target: document.getElementById('menuTarget')
        });

        $('#menuTarget').trigger('dxcontextmenu');

        assert.ok(instance.option('visible'), 'menu was shown');
    });

    QUnit.test('target option changing should change the target', function(assert) {
        const instance = new ContextMenu(this.$element, {
            visible: false,
            items: [{ text: 'itemA' }],
            target: '#menuTarget'
        });

        instance.option('target', '#menuTarget2');

        $('#menuTarget').trigger('dxcontextmenu');
        assert.notOk(instance.option('visible'), 'menu was not shown');

        $('#menuTarget2').trigger('dxcontextmenu');
        assert.ok(instance.option('visible'), 'menu was shown');
    });

    QUnit.test('showSubmenuMode hover without delay', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 0 }
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(0);

        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 2, 'second item was rendered');
    });

    QUnit.test('showSubmenuMode hover with custom delay', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 1 }
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(1);

        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 2, 'second item was rendered');
    });

    QUnit.test('submenu should not be shown if hover was ended before show delay time exceeded', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 500 }
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(400);
        $($itemsContainer).trigger($.Event('dxhoverend', { target: $rootItem.get(0) }));
        this.clock.tick(100);

        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 1, 'second item was not rendered');
    });

    QUnit.test('showSubmenuMode click with custom delay', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onClick', delay: 500 }
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');

        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 2, 'delay should be ignored');
    });

    QUnit.test('showSubmenuMode click during hover delay', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            visible: true,
            showSubmenuMode: { name: 'onHover', delay: 500 }
        });

        const $itemsContainer = instance.itemsContainer();
        const $rootItem = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($itemsContainer).trigger($.Event('dxhoverstart', { target: $rootItem.get(0) }));
        this.clock.tick(1);
        $($rootItem).trigger('dxclick');

        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        assert.equal($items.length, 2, 'delay should be ignored');
    });

    QUnit.test('context menu should not crash when items changing during onShowing event', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }, { text: 2 }],
            onShowing() {
                this.option('items', [{ text: 3 }, { text: 4 }]);
            }
        });

        instance.show();
        assert.ok(1, 'context menu did not crash');
    });

    QUnit.test('context menu should not show if showing is prevented during onPositioning action', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            onPositioning(e) {
                e.cancel = true;
            }
        });

        $('#menuTarget').trigger('dxcontextmenu');
        assert.notOk(instance.option('visible'));
    });

    QUnit.test('context menu should not show if showing is prevented during onShowing action', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            onShowing(e) {
                e.cancel = true;
            }
        });

        $('#menuTarget').trigger('dxcontextmenu');
        assert.notOk(instance.option('visible'));
    });

    QUnit.test('default browser menu should not be prevented if context menu showing is prevented', function(assert) {
        new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            onShowing(e) {
                e.cancel = true;
            }
        });

        const e = $.Event('dxcontextmenu');

        $('#menuTarget').trigger(e);
        assert.notOk(e.isDefaultPrevented(), 'default behavior should not be prevented');
    });

    QUnit.test('default browser menu should not be prevented if context menu positioning is prevented', function(assert) {
        new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            onPositioning(e) {
                e.cancel = true;
            }
        });

        const e = $.Event('dxcontextmenu');

        $('#menuTarget').trigger(e);
        assert.notOk(e.isDefaultPrevented(), 'default behavior should not be prevented');
    });

    QUnit.test('show event should not be handled by other menus targeted on the parent div', function(assert) {
        new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget'
        });

        const e = $.Event('dxcontextmenu');

        $('#menuTarget').trigger(e);
        assert.ok(e.isPropagationStopped(), 'propagation was stopped');
    });

    QUnit.test('disabling for nested item should work correctly', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1, items: [{ text: 11 }] }],
            target: '#menuTarget',
            visible: true
        });

        let $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
        $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        instance.option('items[0].items[0].disabled', true);

        assert.ok($items.eq(1).hasClass('dx-state-disabled'), 'item was disabled');
    });

    QUnit.test('onItemContextMenu option when context menu initially hidden', function(assert) {
        let fired = 0;
        let args = {};

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }, { text: 2 }],
            onItemContextMenu(e) {
                fired++;
                args = e;
            },
            visible: false
        });

        const eventName = addNamespace(contextMenuEvent.name, instance.NAME);

        instance.show();

        $(document).on(eventName, () => {
            fired++;
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);
        $($items.eq(0)).trigger('dxcontextmenu');

        assert.equal(fired, 1, 'event fired only in action');
        assert.strictEqual($(args.itemElement)[0], $items[0], 'item element is correct');
        assert.equal(args.itemData.text, '1', 'item data is correct');
    });

    QUnit.test('Separator should not be shown if last rendered item was in other level', function(assert) {
        const instance = new ContextMenu(this.$element, {
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
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
        $($items.eq(1)).trigger('dxclick');

        assert.equal(instance.itemsContainer().find('.dx-menu-separator').length, 0, 'separator should not be rendered');
    });

    QUnit.test('showEvent can prevent showing', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            showEvent: null
        });

        $('#menuTarget').trigger('dxcontextmenu');

        assert.ok(!instance.option('visible'), 'default behaviour was prevented');
    });

    QUnit.test('showEvent set as string', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            showEvent: 'dxclick'
        });

        $('#menuTarget').trigger('dxclick');
        assert.ok(instance.option('visible'), 'context menu was shown');
    });

    QUnit.test('showEvent set as string with several events', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            showEvent: 'dxclick dxhover'
        });

        $('#menuTarget').trigger('dxclick');
        assert.ok(instance.option('visible'), 'context menu was shown');

        instance.hide();
        assert.ok(!instance.option('visible'));

        $('#menuTarget').trigger('dxhover');
        assert.ok(instance.option('visible'), 'context menu was shown');
    });

    QUnit.test('showEvent set as object', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            showEvent: {
                name: 'click',
                delay: 500
            }
        });

        $('#menuTarget').trigger('click');
        assert.ok(!instance.option('visible'));
        this.clock.tick(500);
        assert.ok(instance.option('visible'), 'context menu was shown');
    });

    QUnit.test('showEvent set only as delay', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
            target: '#menuTarget',
            showEvent: {
                delay: 500
            }
        });

        $('#menuTarget').trigger('dxcontextmenu');
        assert.ok(!instance.option('visible'));
        this.clock.tick(500);
        assert.ok(instance.option('visible'), 'context menu was shown');
    });

    QUnit.test('items change should clear focused item', function(assert) {
        const items1 = [{ text: 'item 1' }, { text: 'item 2' }];
        const items2 = [{ text: 'item 3' }, { text: 'item 4' }];
        const instance = new ContextMenu(this.$element, { items: items1, focusStateEnabled: true, visible: true });

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('enter');

        instance.option('items', items2);
        assert.strictEqual(instance.option('focusedElement'), null, 'focused element is cleaned');
    });

    QUnit.test('items changed should not break keyboard navigation', function(assert) {
        if(!isDeviceDesktop(assert)) {
            return;
        }

        const instance = new ContextMenu(this.$element, {});
        instance.option({ visible: true, items: [{ text: '1' }, { text: '2' }] });

        const overlay = instance.itemsContainer();
        keyboardMock(overlay)
            .keyDown('down');

        assert.equal($(instance.option('focusedElement')).text(), '1', 'focused element is correct');
    });
});

QUnit.module('Public api', moduleConfig, () => {
    QUnit.test('itemsContainer method should return overlay content', function(assert) {
        const instance = new ContextMenu(this.$element, { items: [{ text: 1 }], visible: true });

        assert.ok(instance.itemsContainer().hasClass('dx-overlay-content'));
        assert.ok(instance.itemsContainer().hasClass(DX_CONTEXT_MENU_CLASS));
    });

    QUnit.test('Overlay\'s position should be correct when the target option is changed', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 1 }],
        });

        instance.option('target', '#menuTarget');

        const $target = $('#menuTarget');
        $target
            .trigger($.Event('dxcontextmenu', {
                pageX: 120,
                pageY: 50
            }));

        const position = instance._overlay.option('position');
        assert.equal(position.at, 'top left', 'at of overlay position');
        assert.equal(position.my, 'top left', 'my of overlay position');
        assert.equal(position.of.pageX, 120, 'pageX of overlay position');
        assert.equal(position.of.pageY, 50, 'pageX of overlay position');
        assert.equal(position.of.target, $target.get(0), 'target of overlay position');
    });
});

QUnit.module('Behavior', moduleConfig, () => {
    QUnit.test('it should be possible to update items on item click', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'a' }],
            onItemClick(e) {
                e.component.option('items', [{ text: 'b' }]);
            }
        });

        let $items;

        instance.show();
        $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);
        assert.equal($items.eq(0).text(), 'a', 'items was rendered');

        $($items.eq(0)).trigger('dxclick');
        instance.show();
        $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        assert.equal(instance.option('items')[0].text, 'b', 'items were changed');
        assert.equal($items.eq(0).text(), 'b', 'items was changed');
    });

    QUnit.test('context menu should hide after click on item without children', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'a' }],
            visible: true
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
        assert.notOk(instance.option('visible'), 'menu was hidden');
    });

    QUnit.test('submenu shouldn\'t be hidden after click on item with children (T640708)', function(assert) {
        const contextMenuItems = [
            {
                text: 'item',
                items: [
                    {
                        text: 'item1',
                        items: [
                            { text: 'item1.1' },
                            { text: 'item1.2' }]
                    },
                    { text: 'item1.3' }]
            }
        ];

        const instance = new ContextMenu(this.$element, {
            dataSource: contextMenuItems,
            visible: true
        });

        let $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
        $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);
        $($items.eq(1)).trigger('dxclick');
        $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        assert.equal(getVisibleSubmenuCount(instance), 3, 'All submenus is visible');
    });

    QUnit.test('context menu should not hide after click when item.closeMenuOnClick is false', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'a', closeMenuOnClick: false }],
            visible: true
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        $($items.eq(0)).trigger('dxclick');
        assert.ok(instance.option('visible'), 'menu is visible');
    });

    QUnit.test('context menu should hide after outside click', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }],
            visible: true
        });

        $(document).trigger('dxpointerdown');

        assert.notOk(instance.option('visible'), 'menu was hidden');
    });

    QUnit.testInActiveWindow('Context menu should not be hidden when the component loses focus', function(assert) {
        const instance = new ContextMenu(this.$element, {
            focusStateEnabled: true,
            items: [{ text: 'item 1' }],
        });

        instance.show();

        assert.strictEqual(instance.option('visible'), true, 'menu opened');

        const overlayContent = instance.itemsContainer();

        $(overlayContent).trigger($.Event('focusout', { relatedTarget: $('body') }));

        assert.strictEqual(instance.option('visible'), false, 'menu is hidden');
    });

    QUnit.testInActiveWindow('Context menu should not be hidden when the component loses focus via focusout', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
        });

        instance.show();

        assert.strictEqual(instance.option('visible'), true, 'menu opened');

        const overlayContent = instance.itemsContainer();

        $(overlayContent).trigger('focusout');

        assert.strictEqual(instance.option('visible'), true, 'menu still opened');
    });

    QUnit.testInActiveWindow('Context menu should not be hidden if its item gets focus', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
        });

        instance.show();

        assert.strictEqual(instance.option('visible'), true, 'menu is opened');

        const overlayContent = instance.itemsContainer();

        $(overlayContent.find(`.${DX_MENU_ITEM_CLASS}`).eq(0)).trigger('focusin');

        assert.strictEqual(instance.option('visible'), true, 'menu is still opened');
    });

    QUnit.testInActiveWindow('Context menu should not be hidden if submenu item gets focus', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                {
                    text: 'item 1',
                    items: [{ text: 'item 11' }],
                },
            ],
        });

        instance.show();

        assert.strictEqual(instance.option('visible'), true, 'menu is opened');

        const overlayContent = instance.itemsContainer();
        const $firstSubmenuItem = overlayContent.find(`.${DX_MENU_ITEM_CLASS}`);
        $($firstSubmenuItem).trigger('dxclick');

        const $secondSubmenuItem = $firstSubmenuItem.find(`.${DX_MENU_ITEM_CLASS}`);
        $($secondSubmenuItem).trigger('focusin');

        assert.strictEqual(instance.option('visible'), true, 'menu is still opened');
    });

    QUnit.test('context menu should not hide after outsideclick when event is canceled', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }],
            visible: true,
            onHiding(e) {
                e.cancel = true;
            }
        });

        $(document).trigger('dxpointerdown');

        assert.ok(instance.option('visible'), 'menu is visible');
    });

    ['closeOnOutsideClick', 'hideOnOutsideClick'].forEach(closeOnOutsideClickOptionName => {
        QUnit.test('context menu should not block outside click for other overlays on outside click', function(assert) {
            const otherOverlay = $('<div>').appendTo('#qunit-fixture').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            }).dxOverlay('instance');

            const contextMenu = new ContextMenu(this.$element, { items: [{ text: 'item 1' }], visible: true });

            $(document).trigger('dxpointerdown');

            assert.notOk(otherOverlay.option('visible'), 'other overlay was hidden');
            assert.notOk(contextMenu.option('visible'), 'context menu was hidden');
        });
    });

    QUnit.test('context menu should prevent default behavior if it shows', function(assert) {
        new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            target: '#menuTarget',
            visible: false
        });

        const contextMenuEvent = $.Event('contextmenu', { pointerType: 'mouse' });

        $('#menuTarget').trigger(contextMenuEvent);
        assert.ok(contextMenuEvent.isDefaultPrevented(), 'default prevented');
    });

    QUnit.test('context menu should prevent default behavior if it shows on touch', function(assert) {
        const originalTouch = support.touch;
        const originalIsSimulator = devices.isSimulator;

        try {
            support.touch = true;
            devices.isSimulator = function() { return true; };

            const instance = new ContextMenu(this.$element, {
                items: [{ text: 'item 1' }],
                target: '#menuTarget',
                visible: false
            });

            $('#menuTarget').trigger(holdEvent.name);

            const $itemsContainer = instance.itemsContainer();
            const $rootItem = $itemsContainer.find('.' + DX_SUBMENU_CLASS).eq(0);
            const contextMenuEvent = $.Event('contextmenu', { pointerType: 'mouse', target: $rootItem.get(0) });
            $('#menuTarget').trigger(contextMenuEvent);

            assert.ok(contextMenuEvent.isDefaultPrevented(), 'default prevented');
        } finally {
            support.touch = originalTouch;
            devices.isSimulator = originalIsSimulator;
        }
    });

    QUnit.test('onItemClick should fire for submenus', function(assert) {
        const itemClickArgs = [];
        const items = [{
            text: 'item 1',
            customField: 'custom 1',
            items: [{ text: 'item 11', customField: 'custom 11' }]
        }];

        const instance = new ContextMenu(this.$element, {
            onItemClick(arg) {
                itemClickArgs.push(arg.itemData);
            },
            items
        });

        instance.show();
        const $itemsContainer = instance.itemsContainer();

        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        $($itemsContainer.find('.' + DX_MENU_ITEM_CLASS).eq(1)).trigger('dxclick');

        assert.deepEqual(itemClickArgs, [items[0], items[0].items[0]], 'onItemClick fired with correct arguments');
    });

    QUnit.test('First item should not get focus after menu shown', function(assert) {
        let focusedElementChangeCount = 0;

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            focusStateEnabled: true,
            target: '#menuTarget',
            onOptionChanged(e) {
                if(e.name === 'focusedElement') {
                    focusedElementChangeCount++;
                }
            },
            visible: false
        });

        instance.show();

        assert.equal(focusedElementChangeCount, 0, 'focusedElement should not be changed');
        assert.equal(instance.option('focusedElement'), null, 'focusedElement should be cleared');
        assert.equal(instance.itemsContainer().find('.' + DX_STATE_FOCUSED_CLASS).length, 0, 'there are no focused elements in ui');
    });

    QUnit.test('incomplete show animation should be stopped when new submenu item starts to show', function(assert) {
        const origFxStop = fx.stop;
        let stopCalls = 0;

        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'Item 1', items: [{ text: 'Item 11' }] },
                { text: 'Item 2', items: [{ text: 'Item 21' }] }
            ],
            visible: true
        });

        const $items = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS);

        fx.stop = $element => {
            if($element.hasClass(DX_SUBMENU_CLASS)) {
                stopCalls++;
            }
        };

        try {
            fx.off = false;

            $($items.eq(0)).trigger('dxclick');
            $($items.eq(1)).trigger('dxclick');

            assert.equal(stopCalls, 3, 'animation should stops before each submenu showing');
        } finally {
            fx.off = true;
            fx.stop = origFxStop;
        }
    });

    QUnit.test('Click on disabled submenu item should not raise an error (T1218229)', function(assert) {
        assert.expect(0);

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'subitem 1', disabled: true }] }],
            target: '#menuTarget',
            visible: true
        });
        const $rootItem = instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).eq(0);

        $($rootItem).trigger('dxclick');

        const $disabledItem = instance.itemsContainer().find(`.${DX_STATE_DISABLED_CLASS}.${DX_MENU_ITEM_CLASS}`);

        try {
            $($disabledItem).parent().trigger('dxclick');
        } catch(e) {
            assert.ok(false);
        }
    });
});

QUnit.module('Selection', moduleConfig, () => {
    QUnit.test('select item via item.selected property', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11', selected: true, items: [{ text: 'item 111' }] }] }],
            visible: true
        });

        const $itemContainer = instance.itemsContainer();

        assert.equal($itemContainer.find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');

        $($itemContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        assert.equal($itemContainer.find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 1, 'one selected items');
    });

    QUnit.test('select item via selectedItem option', function(assert) {
        const items = [{ text: 'item 1', selected: true, items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }];

        const instance = new ContextMenu(this.$element, {
            items,
            selectedItem: items[0].items[0],
            visible: true
        });

        const $itemContainer = instance.itemsContainer();

        assert.equal($itemContainer.find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 0, 'no selected items');
        assert.notOk(items[0].selected, 'selection was removed from 1st item');

        $($itemContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        assert.equal($itemContainer.find('.' + DX_MENU_ITEM_SELECTED_CLASS).length, 1, 'one selected items');
        assert.ok(items[0].items[0].selected, 'nested item selected');
    });

    QUnit.test('changing selection via selectedItem option', function(assert) {
        const items = [{ text: 'item 1', selected: true, items: [{ text: 'item 11', items: [{ text: 'item 111' }] }] }];

        const instance = new ContextMenu(this.$element, {
            items,
            visible: true
        });

        const $itemContainer = instance.itemsContainer();

        assert.ok(items[0].selected, '1st item is selected');

        $($itemContainer.find('.' + DX_MENU_ITEM_CLASS).eq(0)).trigger('dxclick');
        instance.option('selectedItem', items[0].items[0]);

        assert.ok(items[0].items[0].selected, 'nested item is selected');
        assert.notOk(items[0].selected, 'first item is not selected');
    });

    QUnit.test('Changing selection: selectByClick=true, item[1].closeMenuOnClick=false, item[2].closeMenuOnClick=true', function(assert) {
        const onSelectionChangedHandler = sinon.spy();
        const items = [{
            text: 'item 1',
            selected: true,
            items: [{ text: 'item 11', closeMenuOnClick: false }, { text: 'item 111', closeMenuOnClick: true }]
        }];

        const instance = new ContextMenu(this.$element, {
            items,
            visible: true,
            selectByClick: true,
            selectionMode: 'single',
            onSelectionChanged: onSelectionChangedHandler
        });

        const $itemContainer = instance.itemsContainer();

        assert.ok(items[0].selected, '1st item is selected');

        let $items = $itemContainer.find(`.${DX_MENU_ITEM_CLASS}`);
        $($items.eq(0)).trigger('dxclick');

        assert.strictEqual(onSelectionChangedHandler.callCount, 0, 'onSelectionChangedHandler.callCount');

        $items = $itemContainer.find(`.${DX_MENU_ITEM_CLASS}`);

        $($items.eq(1)).trigger('dxclick');
        assert.strictEqual(onSelectionChangedHandler.callCount, 1, 'onSelectionChangedHandler.callCount');

        assert.strictEqual(items[0].selected, false, 'root item selected');
        assert.strictEqual(items[0].items[0].selected, true, 'items[0].items[0].selected');
        assert.strictEqual(items[0].items[1].selected, undefined, 'items[0].items[1].selected');

        assert.equal(getVisibleSubmenuCount(instance), 2, 'submenu is open');

        $($items.eq(2)).trigger('dxclick');
        assert.strictEqual(onSelectionChangedHandler.callCount, 2, 'onSelectionChangedHandler.callCount');

        assert.strictEqual(items[0].selected, false, 'root item selected');
        assert.strictEqual(items[0].items[0].selected, false, 'items[0].items[0].selected');
        assert.strictEqual(items[0].items[1].selected, true, 'items[0].items[1].selected');

        assert.equal(getVisibleSubmenuCount(instance), 1, 'submenu is close');
    });
});

let helper;
QUnit.module('Aria accessibility', {
    beforeEach: function() {
        helper = new ariaAccessibilityTestHelper({
            createWidget: ($element, options) => new ContextMenu($element,
                $.extend({
                    focusStateEnabled: true
                }, options))
        });
    },
    afterEach: function() {
        helper.$widget.remove();
    }
}, () => {
    QUnit.test('Items: [] -> show() -> hide()', function() {
        helper.createWidget({ items: [] });
        helper.checkAttributes(helper.$widget, { }, 'widget');
        helper.checkItemsAttributes([], { });

        helper.widget.show();
        helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._overlayContentId }, 'widget');
        helper.checkAttributes(helper.widget._overlay.$content(), { id: helper.widget._overlayContentId, role: 'menu', tabindex: '0' }, 'overlayContent');
        helper.checkItemsAttributes([], { });

        helper.widget.hide();
        helper.checkAttributes(helper.$widget, { }, 'widget');
        helper.checkItemsAttributes([], { });
    });

    QUnit.test('Items: [1, 2, 3] -> show() -> hide()', function() {
        helper.createWidget({ items: [1, 2, 3] });
        helper.checkAttributes(helper.$widget, { }, 'widget');
        helper.checkItemsAttributes([], { });

        helper.widget.show();
        helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._overlayContentId }, 'widget');
        helper.checkAttributes(helper.widget._overlay.$content(), { id: helper.widget._overlayContentId, role: 'menu', tabindex: '0' }, 'overlayContent');
        helper.checkItemsAttributes([], { role: 'menuitem', tabindex: '-1' });

        helper.widget.hide();
        helper.checkAttributes(helper.$widget, { }, 'widget');
        helper.checkItemsAttributes([], { role: 'menuitem', tabindex: '-1' });
    });

    QUnit.test('Items: [1, 2, 3] -> set focusedElement: item[0] -> clean focusedElement', function() {
        helper.createWidget({ items: [1, 2, 3] });
        helper.checkAttributes(helper.$widget, { }, 'widget');
        helper.checkItemsAttributes([], { });

        helper.widget.show();
        helper.widget.option('focusedElement', helper.getItems().eq(0));
        helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._overlayContentId }, 'widget');
        helper.checkAttributes(helper.widget._overlay.$content(), { id: helper.widget._overlayContentId, 'aria-activedescendant': helper.focusedItemId, role: 'menu', tabindex: '0' }, 'overlayContent');
        helper.checkItemsAttributes([], { focusedItemIndex: 0, role: 'menuitem', tabindex: '-1' });

        helper.widget.option('focusedElement', null);
        helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._overlayContentId }, 'widget');
        helper.checkAttributes(helper.widget._overlay.$content(), { id: helper.widget._overlayContentId, role: 'menu', tabindex: '0' }, 'overlayContent');
        helper.checkItemsAttributes([], { role: 'menuitem', tabindex: '-1' });
    });

    QUnit.test('Items: [{items[{}, {}], {}] -> set focusedElement by keyboard on inner level', function() {
        helper.createWidget({
            focusStateEnabled: true,
            items: [{ text: 'Item1_1', items: [{ text: 'Item2_1' }, { text: 'Item2_2' }] }, { text: 'item1_2' }]
        });
        helper.checkAttributes(helper.$widget, { }, 'widget');
        helper.checkItemsAttributes([], { });

        helper.widget.show();

        keyboardMock(helper.widget.itemsContainer()).keyDown('down');
        helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._overlayContentId }, 'widget');
        helper.checkAttributes(helper.widget._overlay.$content(), { id: helper.widget._overlayContentId, 'aria-activedescendant': helper.focusedItemId, role: 'menu', tabindex: '0' }, 'overlayContent');
        helper.checkAttributes(helper.getItems().eq(0), { id: helper.focusedItemId, role: 'menuitem', tabindex: '-1', 'aria-haspopup': 'true' }, 'Items[0]');
        helper.checkAttributes(helper.getItems().eq(1), { role: 'menuitem', tabindex: '-1' }, 'Items[1]');

        keyboardMock(helper.widget.itemsContainer()).keyDown('right');
        helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._overlayContentId }, 'widget');
        helper.checkAttributes(helper.widget._overlay.$content(), { id: helper.widget._overlayContentId, 'aria-activedescendant': helper.focusedItemId, role: 'menu', tabindex: '0' }, 'overlayContent');

        helper.checkAttributes(helper.getItems().eq(0), { role: 'menuitem', tabindex: '-1', 'aria-haspopup': 'true' }, 'Items[0]');
        helper.checkAttributes(helper.getItems().eq(1), { id: helper.focusedItemId, role: 'menuitem', tabindex: '-1' }, 'Items[0].items[0]');
        helper.checkAttributes(helper.getItems().eq(2), { role: 'menuitem', tabindex: '-1' }, 'Items[0],items[1]');
        helper.checkAttributes(helper.getItems().eq(3), { role: 'menuitem', tabindex: '-1' }, 'Items[1]');
    });

    QUnit.test('Nested submenu has the "menu" role', function() {
        helper.createWidget({
            focusStateEnabled: true,
            items: [{ text: 'Item1_1', items: [{ text: 'Item2_1' }, { text: 'Item2_2' }] }, { text: 'item1_2' }]
        });

        helper.widget.show();

        keyboardMock(helper.widget.itemsContainer())
            .keyDown('down')
            .keyDown('right');

        const $submenu = helper.widget._overlay.$content().find(`.${DX_SUBMENU_CLASS}`).eq(1);

        helper.checkAttributes($submenu, { role: 'menu' });
    });

    QUnit.test('Nested submenu items has not "dxPrivateComponent" text in alt', function() {
        helper.createWidget({
            focusStateEnabled: true,
            items: [{ text: 'Item1_1', items: [{ text: 'Item2_1', icon: 'icon.png' }] }],
        });

        helper.widget.show();

        keyboardMock(helper.widget.itemsContainer())
            .keyDown('down')
            .keyDown('right');

        const $icon = helper.widget._overlay.$content().find(`.${DX_ICON_CLASS}`).eq(0);

        helper.checkAttributes($icon, { src: 'icon.png', alt: 'dxContextMenu item icon' });
    });

    // T927422
    QUnit.test('Items: [{items[{}, {}], {}], any <li>, <ul> tags need role=none', function() {
        helper.createWidget({
            focusStateEnabled: true,
            items: [{ text: 'Item1_1', items: [{ text: 'Item2_1' }, { text: 'Item2_2' }] }, { text: 'item1_2' }]
        });

        helper.widget.show();

        keyboardMock(helper.widget.itemsContainer()).keyDown('down');
        keyboardMock(helper.widget.itemsContainer()).keyDown('right');

        helper.checkAttributes(helper.widget._overlay.$content().find('ul'), { role: 'none' }, 'Items[1]');
        const $listItems = helper.widget._overlay.$content().find('li');

        $listItems.each((_, listItem) => {
            helper.checkAttributes($(listItem), { role: 'none' }, 'list item');
        });
    });
});

QUnit.module('Keyboard navigation', moduleConfig, () => {
    QUnit.test('onItemClick should fire when enter pressed', function(assert) {
        let itemClicked = 0;

        const instance = new ContextMenu(this.$element, {
            items: [1, 2, 3],
            focusStateEnabled: true,
            onItemClick() {
                itemClicked++;
            }
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('enter');

        assert.equal(itemClicked, 1, 'press enter on item call item click action');
    });

    QUnit.test('hide menu when space pressed', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('space');

        assert.notOk(instance.option('visible'));
    });

    QUnit.test('select item when space pressed', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];

        const instance = new ContextMenu(this.$element, {
            items,
            selectByClick: true,
            focusStateEnabled: true,
            selectionMode: 'single'
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('space');

        assert.equal(instance.option('selectedItem').text, 'item 2', 'correct item is selected');
        assert.ok(items[1].selected, 'item has selected property');
    });

    QUnit.test('when selectionMode is none, not select item when space pressed', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            selectByClick: true,
            focusStateEnabled: true,
            selectionMode: 'single'
        });

        instance.option('selectionMode', 'none');

        instance.show();
        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('space');

        assert.equal(instance.option('selectedItem'), null, 'no item is selected');
    });

    QUnit.test('select item when space pressed on inner level', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22' }] }];

        const instance = new ContextMenu(this.$element, {
            items,
            selectByClick: true,
            focusStateEnabled: true,
            selectionMode: 'single'
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('down')
            .keyDown('space');

        assert.equal(instance.option('selectedItem').text, 'item 22', 'correct item is selected');
    });

    QUnit.test('onSelectionChanged handle fire when space pressed', function(assert) {
        let itemSelected = 0;

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            selectByClick: true,
            selectionMode: 'single',
            focusStateEnabled: true,
            onSelectionChanged() {
                itemSelected++;
            }
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('space');

        assert.equal(itemSelected, 1, 'press space on item call item select');
    });

    QUnit.test('when selectionMode is none, onSelectionChanged handle not fire when space pressed', function(assert) {
        let itemSelected = 0;

        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            selectByClick: true,
            selectionMode: 'none',
            focusStateEnabled: true,
            onSelectionChanged() {
                itemSelected++;
            }
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('space');

        assert.equal(itemSelected, 0, 'press space on item call item select');
    });

    QUnit.test('hide context menu when esc pressed', function(assert) {
        const instance = new ContextMenu(this.$element, { focusStateEnabled: true });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('esc');

        assert.ok(!instance.option('visible'), 'context menu is hidden');
    });

    QUnit.test('when press right arrow key we only show submenu if exist', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }, { text: 'item 2', items: [{ text: 'item 21' }] }],
            focusStateEnabled: true
        });

        instance.show();

        const keyboard = keyboardMock(instance.itemsContainer());

        keyboard
            .keyDown('down')
            .keyDown('down')
            .keyDown('right');

        assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal(getFocusedItemText(instance), 'item 21', 'focus on first item of second submenu');
        assert.equal(getVisibleSubmenuCount(instance), 2, 'we see two submenus');

        keyboard
            .keyDown('right');

        assert.equal(getFocusedItemText(instance), 'item 21', 'after second right arrow key press we do nothing because item2-1 has not submenu');
        assert.equal(getVisibleSubmenuCount(instance), 2, 'we still see two submenus');
    });

    QUnit.test('don\'t open submenu on right key press when item is disabled', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }, { text: 'item 2', disabled: true, items: [{ text: 'item 21' }] }],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right');

        assert.equal(instance.itemsContainer().find('.' + DX_MENU_ITEM_CLASS).length, 2, 'submenu was not rendered');
    });

    QUnit.test('end key work only in current submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22' }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('down')
            .keyDown('end');

        assert.equal($(instance.option('focusedElement')).text(), 'item 23', 'focus on last item of current submenu');
    });

    QUnit.test('home key work only in current submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22' }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('down')
            .keyDown('home');

        assert.equal($(instance.option('focusedElement')).text(), 'item 21', 'focus on first item of current submenu');
    });

    QUnit.test('down key work only in current submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22' }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('down')
            .keyDown('down')
            .keyDown('down')
            .keyDown('down');

        assert.equal($(instance.option('focusedElement')).text(), 'item 22', 'focus on first item of current submenu');
    });

    QUnit.test('up key work only in current submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22' }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('up')
            .keyDown('up')
            .keyDown('up')
            .keyDown('up');

        assert.equal($(instance.option('focusedElement')).text(), 'item 23', 'focus on first item of current submenu');
    });

    QUnit.test('left arrow key should not close context menu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('left');

        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.equal(getVisibleSubmenuCount(instance), 1, 'submenu should not open');
    });

    QUnit.test('left arrow key should hide only previous submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22', items: [] }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('down')
            .keyDown('right')
            .keyDown('left');

        assert.equal(getVisibleSubmenuCount(instance), 1, 'only root submenu is visible');
        assert.equal(getFocusedItemText(instance), 'item 2', 'focus on second item of root submenu');
    });

    QUnit.test('rtl: when press left arrow key we only show submenu if exist', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1' }, { text: 'item 2', items: [{ text: 'item 21' }] }],
            rtlEnabled: true,
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('left');

        assert.equal(getFocusedItemText(instance), 'item 21', 'focus on first item of second submenu');
        assert.equal(getVisibleSubmenuCount(instance), 2, 'we see two submenus');

        keyboardMock(instance.itemsContainer())
            .keyDown('left');

        assert.equal(getFocusedItemText(instance), 'item 21', 'after second right arrow key press we do nothing because item2-1 has not submenu');
        assert.equal(getVisibleSubmenuCount(instance), 2, 'we still see two submenus');
    });

    QUnit.test('rtl: right arrow key should not close context menu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'item 1', items: [{ text: 'item 11' }] }],
            rtlEnabled: true,
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('right');

        assert.ok(instance.option('visible'), 'context menu is visible');
        assert.equal(getVisibleSubmenuCount(instance), 1, 'submenu should not open');
    });

    QUnit.test('rtl: right arrow key should hide only previous submenu', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22', items: [] }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            rtlEnabled: true,
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('left')
            .keyDown('down')
            .keyDown('left')
            .keyDown('right');

        assert.equal(getVisibleSubmenuCount(instance), 1, 'only root submenu is visible');
        assert.equal(getFocusedItemText(instance), 'item 2', 'focus on second item of root submenu');
    });

    QUnit.test('Moving focus should starts from the hovered item', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        const $itemsContainer = instance.itemsContainer();
        const $items = $itemsContainer.find('.' + DX_MENU_ITEM_CLASS);

        $($itemsContainer).trigger({ target: $items.eq(1).get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        assert.equal($items.filter('.' + DX_STATE_FOCUSED_CLASS).length, 0, 'There are no focused items on show');
        assert.ok($items.eq(1).hasClass(DX_STATE_HOVER_CLASS), 'Item 2 was hovered');
        assert.notOk($items.eq(1).hasClass(DX_STATE_FOCUSED_CLASS), 'Item 2 was not focused on hover');

        keyboardMock($itemsContainer)
            .keyDown('down');

        assert.equal($itemsContainer.find('.' + DX_STATE_FOCUSED_CLASS).text(), 'Item 3', 'last item was focused');
    });

    QUnit.test('Moving focus should starts from the hovered item in nested level', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                {
                    text: 'Item 1', items: [
                        { text: 'Item 11' },
                        { text: 'Item 12' },
                        { text: 'Item 13' }
                    ]
                },
                { text: 'Item 2' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        const $itemsContainer = instance.itemsContainer();
        const keyboard = keyboardMock($itemsContainer);
        const $rootItem = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`).eq(0);

        keyboard.keyDown('down');
        $($rootItem).trigger('dxclick');
        assert.ok($rootItem.hasClass(DX_STATE_FOCUSED_CLASS), 'root item is stay focused after the click');

        const $items = $itemsContainer.find(`.${DX_MENU_ITEM_CLASS}`);

        $($itemsContainer).trigger({ target: $items.eq(2).get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        assert.ok($items.eq(2).hasClass(DX_STATE_HOVER_CLASS), 'Item 12 was hovered');
        assert.notOk($items.eq(2).hasClass(DX_STATE_FOCUSED_CLASS), 'Item 12 was not focused on hover');

        keyboard.keyDown('down');

        assert.ok($items.eq(3).hasClass(DX_STATE_FOCUSED_CLASS), 'Item 13 is focused');
    });

    QUnit.test('Disabled item should not be skipped when keyboard navigation', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'Item 1', disabled: true },
                { text: 'Item 2' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        const $itemsContainer = instance.itemsContainer();
        const $items = instance.itemElements();
        const kb = keyboardMock($itemsContainer);

        kb.keyDown('down');

        assert.ok($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'disabled item was not skipped');
    });

    QUnit.test('Focus should follow the nested hovered item if item in the parent level is focused', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'Item 1' },
                { text: 'Item 2', items: [{ text: 'Item 21' }, { text: 'Item 22' }] }
            ],
            focusStateEnabled: true
        });

        instance.show();

        const $itemsContainer = instance.itemsContainer();
        const $items = instance.itemElements();
        const kb = keyboardMock($itemsContainer);

        $($items.eq(1)).trigger('dxclick');
        kb.keyDown('up');

        const $nestedItem = instance.itemElements().eq(2);
        $($itemsContainer).trigger({ target: $nestedItem.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        assert.ok($items.eq(0).hasClass(DX_STATE_FOCUSED_CLASS), 'Item 1 is focused');
        assert.ok($nestedItem.hasClass(DX_STATE_HOVER_CLASS), 'Item 21 is hovered');

        kb.keyDown('down');

        assert.ok(instance.itemElements().eq(3).hasClass(DX_STATE_FOCUSED_CLASS), 'Item 22 is focused');
    });

    // T806502
    QUnit.test('Keyboard should be work when submenu shown in second time', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'Item 1' }, { text: 'Item 2', items: [{ text: 'Item 2_1' }, { text: 'Item 2_2' }] }],
            focusStateEnabled: true
        });

        instance.show();

        let keyboard = keyboardMock(instance.itemsContainer());

        keyboard
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('down');

        let focusedItem = instance.itemsContainer().find(`.${DX_STATE_FOCUSED_CLASS}`);

        assert.strictEqual(focusedItem.is(instance.option('focusedElement')), true, 'focusedElement');
        assert.strictEqual(getFocusedItemText(instance), 'Item 2_2', 'focusedItem text');
        assert.strictEqual(getVisibleSubmenuCount(instance), 2, 'submenu.count');

        instance.hide();
        instance.show();

        keyboard = keyboardMock(instance.itemsContainer());
        keyboard
            .keyDown('down');

        focusedItem = instance.itemsContainer().find(`.${DX_STATE_FOCUSED_CLASS}`);
        assert.strictEqual(focusedItem.is(instance.option('focusedElement')), true, 'focusedElement');
        assert.strictEqual(getFocusedItemText(instance), 'Item 1', 'focusedItem text');
        assert.strictEqual(getVisibleSubmenuCount(instance), 1, 'submenu.count');
    });

    QUnit.test('FocusedElement should be cleaned when context menu was hidden', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' } ],
            focusStateEnabled: true
        });

        instance.show();

        let keyboard = keyboardMock(instance.itemsContainer());

        keyboard
            .keyDown('down')
            .keyDown('down')
            .keyDown('enter');

        assert.strictEqual(instance.option('focusedElement'), null, 'focusedElement is cleaned');

        instance.show();
        keyboard = keyboardMock(instance.itemsContainer());

        keyboard
            .keyDown('down');

        const focusedItem = instance.itemsContainer().find(`.${DX_STATE_FOCUSED_CLASS}`);
        assert.strictEqual(focusedItem.is(instance.option('focusedElement')), true, 'focusedElement');
        assert.strictEqual(getFocusedItemText(instance), 'Item 1', 'focusedItem text');
        assert.strictEqual(getVisibleSubmenuCount(instance), 1, 'submenu.count');
    });

    [
        (menu, keyboard) => menu.hide(),
        (menu, keyboard) => keyboard.keyDown('esc')
    ].forEach(hideFunction => {
        QUnit.test(`FocusedElement should be cleaned when context menu was hidden by ${hideFunction} function (T952882)`, function(assert) {
            const menu = new ContextMenu(this.$element, {
                items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' } ],
                focusStateEnabled: true
            });
            menu.show();

            const keyboard = keyboardMock(menu.itemsContainer());
            keyboard.keyDown('down');

            hideFunction(menu, keyboard);
            assert.strictEqual(menu.option('focusedElement'), null);
        });
    });

    QUnit.test('vertical keyboard navigation works cyclically (T952882)', function(assert) {
        const instance = new ContextMenu(this.$element, {
            items: [
                { text: 'item 1' },
                { text: 'item 2', items: [{ text: 'item 21' }, { text: 'item 22' }, { text: 'item 23' }] },
                { text: 'item 3' }
            ],
            focusStateEnabled: true
        });

        instance.show();

        keyboardMock(instance.itemsContainer())
            .keyDown('down')
            .keyDown('down')
            .keyDown('right')
            .keyDown('up')
            .keyDown('up')
            .keyDown('up')
            .keyDown('up')
            .keyDown('up');

        assert.equal($(instance.option('focusedElement')).text(), 'item 22');
    });
});


function getVisibleSubmenuCount(instance) {
    return instance.itemsContainer().find(`.${DX_SUBMENU_CLASS}`).filter((_, item) => {
        return $(item).css('visibility') === 'visible';
    }).length;
}

function getFocusedItemText(instance) {
    return $(instance.option('focusedElement')).children(`.${DX_MENU_ITEM_CONTENT_CLASS}`).text();
}
