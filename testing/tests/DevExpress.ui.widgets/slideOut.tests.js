const $ = require('jquery');
const fx = require('animation/fx');
const config = require('core/config');
const typeUtils = require('core/utils/type');
const hideTopOverlayCallback = require('mobile/hide_top_overlay').hideCallback;
const pointerMock = require('../../helpers/pointerMock.js');

require('ui/slide_out');
require('common.css!');

const SLIDEOUT_ITEM_CONTAINER_CLASS = 'dx-slideout-item-container';
const SLIDEOUT_SHIELD = 'dx-slideoutview-shield';

const SLIDEOUT_ITEM_CLASS = 'dx-slideout-item';

const LIST_ITEM_CLASS = 'dx-list-item';


QUnit.testStart(function() {
    const markup = '\
        <div id="slideOut"></div>\
        <div id="slideOutWithTemplate">\
            <div data-options="dxTemplate: { name: \'content\'}">\
                content\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});


QUnit.module('widget options', {
    beforeEach: function() {
        this.$element = $('#slideOut');
    }
}, () => {
    QUnit.test('option onItemClick', function(assert) {
        let count = 0;

        this.$element.dxSlideOut({
            onItemClick: function() {
                count++;
            },
            dataSource: [
                { text: 'testItem1' },
                { text: 'testItem2', disabled: true },
                { text: 'testItem3' }
            ]
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS);

        pointerMock($menuItems.eq(0)).start().click();
        assert.equal(count, 1);

        pointerMock($menuItems.eq(1)).start().click();
        assert.equal(count, 1);

        this.$element.dxSlideOut('instance').option('onItemClick', function() {
            count += 2;
        });

        $menuItems.eq(2).trigger('dxclick');
        assert.equal(count, 3);
    });

    QUnit.test('onItemClick should be fired only after click on list item', function(assert) {
        let count = 0;

        this.$element.dxSlideOut({
            onItemClick: function() {
                count++;
            },
            dataSource: [
                { text: 'testItem1' },
                { text: 'testItem2', disabled: true },
                { text: 'testItem3' }
            ],
            selectedIndex: 0
        });

        const $items = this.$element.find('.' + SLIDEOUT_ITEM_CLASS);
        $items.trigger('dxclick');
        assert.equal(count, 0);
    });

    QUnit.test('selected index', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [
                { text: 'testItem1' },
                { text: 'testItem2', disabled: true },
                { text: 'testItem3' }
            ]
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS), instance = this.$element.dxSlideOut('instance');

        $menuItems.eq(0).trigger('dxclick');
        assert.equal(instance.option('selectedIndex'), 0);

        $menuItems.eq(1).trigger('dxclick');
        assert.equal(instance.option('selectedIndex'), 0);

        $menuItems.eq(2).trigger('dxclick');
        assert.equal(instance.option('selectedIndex'), 2);
    });

    QUnit.test('list should change it\'s selection after selectedIndex option was changed', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS), instance = this.$element.dxSlideOut('instance');

        instance.option('selectedIndex', 1);

        assert.ok($menuItems.eq(1).hasClass('dx-list-item-selected'), 'item is selected');
    });

    QUnit.test('list should change it\'s selection after selectedItem option was changed', function(assert) {
        const items = [
            { text: 'Item 1' },
            { text: 'Item 2' }
        ];

        this.$element.dxSlideOut({
            dataSource: items
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS), instance = this.$element.dxSlideOut('instance');

        instance.option('selectedItem', items[1]);

        assert.ok($menuItems.eq(1).hasClass('dx-list-item-selected'), 'item is selected');
    });

    QUnit.test('grouped list should change it\'s selection after selectedIndex option was changed', function(assert) {
        this.$element.dxSlideOut({
            menuGrouped: true,
            dataSource: [
                { key: 'Group 1', items: [
                    { text: 'Item 1' },
                    { text: 'Item 2' }
                ] }
            ]
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS), instance = this.$element.dxSlideOut('instance');

        instance.option('selectedIndex', 1);

        assert.ok($menuItems.eq(1).hasClass('dx-list-item-selected'), 'item is selected');
    });

    QUnit.test('grouped list should change it\'s selection after selectedItem option was changed', function(assert) {
        const items = [
            { key: 'Group 1', items: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ] }
        ];

        this.$element.dxSlideOut({
            menuGrouped: true,
            dataSource: items
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS), instance = this.$element.dxSlideOut('instance');

        instance.option('selectedItem', items[0].items[1]);

        assert.ok($menuItems.eq(1).hasClass('dx-list-item-selected'), 'item is selected');
    });

    QUnit.test('menu item itemTemplate (dataSource)', function(assert) {
        this.$element.dxSlideOut({
            menuItemTemplate: function(item, index, element) {
                assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
                return index + ': ' + item.text;
            },
            dataSource: [
                { text: 'a' },
                { text: 'b' }
            ]
        });

        let items = this.$element.find('.dx-list-item');
        const instance = this.$element.dxSlideOut('instance');

        assert.equal(items.eq(0).text(), '0: a');
        assert.equal(items.eq(1).text(), '1: b');

        instance.option('menuItemTemplate', function(item, index) {
            return item.text + ': ' + index;
        });

        items = this.$element.find('.dx-list-item');
        assert.equal(items.eq(0).text(), 'a: 0');
        assert.equal(items.eq(1).text(), 'b: 1');
    });

    QUnit.test('menu item itemTemplate (items)', function(assert) {
        this.$element.dxSlideOut({
            menuItemTemplate: function(item, index) {
                return index + ': ' + item.text;
            },
            items: [
                { text: 'a' },
                { text: 'b' }
            ]
        });

        let items = this.$element.find('.dx-list-item');
        const instance = this.$element.dxSlideOut('instance');

        assert.equal(items.eq(0).text(), '0: a');
        assert.equal(items.eq(1).text(), '1: b');

        instance.option('menuItemTemplate', function(item, index) {
            return item.text + ': ' + index;
        });

        items = this.$element.find('.dx-list-item');
        assert.equal(items.eq(0).text(), 'a: 0');
        assert.equal(items.eq(1).text(), 'b: 1');
    });

    QUnit.test('menu should has correct itemTemplateProperty option', function(assert) {
        this.$element.dxSlideOut({
            items: [{ text: 'a' }]
        });

        const list = this.$element.find('.dx-list').dxList('instance');
        assert.equal(list.option('itemTemplateProperty'), 'menuTemplate', 'itemTemplateProperty option is correct');
    });

    QUnit.test('menu items should be rendered after change only one item', function(assert) {
        this.$element.dxSlideOut({
            items: [{ text: 'a' }, { text: 'b' }]
        });

        const instance = this.$element.dxSlideOut('instance');

        instance.option('items[0].text', 'c');
        const $items = this.$element.find('.dx-list-item');
        assert.strictEqual($items.text(), 'cb', 'items rendered correctly');
    });

    QUnit.test('grouped options', function(assert) {
        this.$element.dxSlideOut({});

        const element = this.$element, instance = element.dxSlideOut('instance'), list = element.find('.dx-list').dxList('instance');

        assert.ok(!list.option('grouped'), 'default menu grouped');
        instance.option('menuGrouped', true);
        assert.ok(list.option('grouped'), 'changed menu grouped');

        instance.option('menuGroupTemplate', $('<div>'));
        assert.deepEqual(list._getTemplateByOption('groupTemplate'), instance._getTemplateByOption('menuGroupTemplate'), 'changed menu group template');
    });

    QUnit.test('select grouped menu element', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [{
                key: 'Group 1',
                items: [
                    { text: 'First' },
                    { text: 'Second' },
                    { text: 'Third' }
                ]
            },
            {
                key: 'Group 2',
                items: [
                    { text: 'Fourth' },
                    { text: 'Fifth' },
                    { text: 'Sixth' }
                ]
            }],
            menuGrouped: true
        });

        const element = this.$element, $menuItems = element.find('.' + LIST_ITEM_CLASS);

        $menuItems.eq(0).trigger('dxclick');
        let $slideOutItems = element.find('.' + SLIDEOUT_ITEM_CLASS);
        assert.equal($menuItems.eq(0).text(), 'First', 'select first item');
        assert.equal($slideOutItems.eq(0).text(), 'First', 'select first item');
        $menuItems.eq(4).trigger('dxclick');
        $slideOutItems = element.find('.' + SLIDEOUT_ITEM_CLASS);
        assert.equal($menuItems.eq(4).text(), 'Fifth', 'select fifth item');
        assert.equal($slideOutItems.eq(0).text(), 'Fifth', 'select fifth item');
    });

    QUnit.test('menuGroupTemplate option', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [{
                key: 'Group 1',
                items: [{ text: 'First' }]
            },
            {
                key: 'Group 2',
                items: [{ text: 'Fourth' }]
            }],
            menuGrouped: true
        });

        const $element = this.$element;
        const instance = $element.dxSlideOut('instance');
        let $groupHeader = $element.find('.dx-list-group-header').eq(0);

        assert.equal($groupHeader.text(), 'Group 1', 'correct group name');

        instance.option('menuGroupTemplate', function(item, index, element) {
            assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
            return 'new template';
        });

        $groupHeader = $element.find('.dx-list-group-header').eq(0);
        assert.equal($groupHeader.text(), 'new template', 'correct group name');
    });

    QUnit.test('First list item in first list group should be selected by default', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [
                { key: 'Group 1', items: [{ text: 'Item 11' }, { text: 'Item 12' }] }
            ],
            menuGrouped: true
        });

        assert.ok(this.$element.find('.' + LIST_ITEM_CLASS).eq(0).hasClass('dx-list-item-selected'));
    });

    QUnit.test('First slideout item should be selected if menu grouping is used', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [
                { key: 'Group 1', items: [{ text: 'Item 11' }, { text: 'Item 12' }] }
            ],
            selectedIndex: 1,
            itemTemplate: function(itemData) {
                return itemData.text;
            },
            menuGrouped: true
        });

        assert.equal(this.$element.find('.dx-list-item-selected').text(), 'Item 12', 'item is selected');
        assert.equal(this.$element.find('.dx-slideout-item-content').text(), 'Item 12', 'content was loaded');
    });

    QUnit.test('First slideout item content should be loaded when deferred data source is used', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            this.$element.dxSlideOut({
                dataSource: {
                    load: function() {
                        const d = $.Deferred();

                        setTimeout(function() {
                            d.resolve([{ text: 'Item 1' }, { text: 'Item 2' }]);
                        }, 100);

                        return d.promise();
                    }
                },
                selectedIndex: 1,
                itemTemplate: function(itemData) {
                    return itemData.text;
                }
            });

            clock.tick(200);

            assert.equal(this.$element.find('.dx-list-item-selected').text(), 'Item 2', 'item is selected');
            assert.equal(this.$element.find('.dx-slideout-item-content').text(), 'Item 2', 'content was loaded');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('select item action execution', function(assert) {
        const items = [0, 1];

        this.$element.dxSlideOut({
            dataSource: items,
            onSelectionChanged: function(e) {
                assert.equal(e.addedItems[0], items[1], 'correct item data');
            }
        });

        const $menuItems = this.$element.find('.' + LIST_ITEM_CLASS);
        $menuItems.eq(1).trigger('dxclick');
    });

    QUnit.test('onMenuItemRendered option on init', function(assert) {
        let itemRendered = false;

        const $slideOut = $('#slideOut').dxSlideOut({
            dataSource: [0, 1],
            onMenuItemRendered: function() { itemRendered = true; }
        });

        const slideOut = $slideOut.dxSlideOut('instance');
        const list = $slideOut.find('.dx-list').first().dxList('instance');

        assert.ok(itemRendered, 'onMenuItemRendered was called');
        assert.equal(list.option('onItemRendered'), slideOut.option('onMenuItemRendered'), 'onMenuItemRendered was transferred to list\'s onItemRendered');
    });

    QUnit.test('onMenuItemRendered option change', function(assert) {
        let itemRendered = false;
        const $slideOut = $('#slideOut').dxSlideOut();
        const slideOut = $slideOut.dxSlideOut('instance');
        const list = $slideOut.find('.dx-list').first().dxList('instance');

        slideOut.option('onMenuItemRendered', function() { itemRendered = true; });
        slideOut.option('dataSource', [0, 1]);
        assert.ok(itemRendered, 'onMenuItemRendered was called');
        assert.equal(list.option('onItemRendered'), slideOut.option('onMenuItemRendered'), 'onMenuItemRendered was transferred to list\'s onItemRendered');
    });

    QUnit.test('onMenuGroupRendered option on init', function(assert) {
        let groupRendered = false;

        const $slideOut = $('#slideOut').dxSlideOut({
            dataSource: [
                {
                    key: 'a',
                    items: ['0', '1']
                },
                {
                    key: 'b',
                    items: ['2']
                }
            ],
            menuGrouped: true,
            onMenuGroupRendered: function() { groupRendered = true; }
        });

        const slideOut = $slideOut.dxSlideOut('instance');
        const list = $slideOut.find('.dx-list').first().dxList('instance');

        assert.ok(groupRendered, 'onMenuGroupRendered was called');
        assert.equal(list.option('onGroupRendered'), slideOut.option('onMenuGroupRendered'), 'onMenuGroupRendered was transferred to list\'s onGroupRendered');
    });

    QUnit.test('onMenuGroupRendered option change', function(assert) {
        let groupRendered = false;

        const $slideOut = $('#slideOut').dxSlideOut({
            menuGrouped: true
        });

        const slideOut = $slideOut.dxSlideOut('instance');
        const list = $slideOut.find('.dx-list').first().dxList('instance');

        slideOut.option('onMenuGroupRendered', function() { groupRendered = true; });
        slideOut.option('dataSource', [
            {
                key: 'a',
                items: ['0', '1']
            },
            {
                key: 'b',
                items: ['2']
            }
        ]);

        assert.ok(groupRendered, 'onMenuGroupRendered was called');
        assert.equal(list.option('onGroupRendered'), slideOut.option('onMenuGroupRendered'), 'onMenuGroupRendered was transferred to list\'s onGroupRendered');
    });
});

QUnit.module('swipe', {
    beforeEach: function() {
        this.$element = $('#slideOut');

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('container swipe', function(assert) {
        this.$element.dxSlideOut();

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS), pointer = pointerMock($container);

        instance.showMenu();
        const position = $container.position().left;

        pointer.start().swipeStart().swipe(-0.1);
        assert.equal($container.position().left, position - 0.1 * position);

        pointer.swipeEnd(-1);
        assert.equal($container.position().left, 0);

        pointer.start().swipeStart().swipe(0.1);
        assert.equal($container.position().left, 0.1 * position);

        pointer.swipeEnd(1);
        assert.equal($container.position().left, instance._getListWidth());
    });

    QUnit.test('container swipe in RTL mode', function(assert) {
        this.$element.dxSlideOut({ rtlEnabled: true });

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS), pointer = pointerMock($container);

        instance.showMenu();
        const position = $container.position().left;

        pointer.start().swipeStart().swipe(0.1);
        assert.equal($container.position().left, position - 0.1 * position, 'container moves right after pointer');

        pointer.swipeEnd(1);
        assert.equal($container.position().left, 0, 'menu is closed');

        let startEvent = pointer.start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, 0, 'container was not be moved');

        pointer.swipeEnd(0);

        pointer.start().swipeStart().swipe(-0.1);
        assert.equal($container.position().left, 0.1 * position, 'container moves left after pointer');

        pointer.swipeEnd(-1);
        assert.equal($container.position().left, -instance._getListWidth(), 'menu is opened');

        startEvent = pointer.start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxLeftOffset, 0, 'container was not be moved');

    });

    QUnit.test('container moves to left to show menu in RTL mode', function(assert) {
        this.$element.dxSlideOut({ rtlEnabled: true });

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);

        assert.equal($container.position().left, 0, 'container left == 0, so menu is hidden');

        instance.showMenu();
        assert.equal($container.position().left, -instance._getListWidth(), 'container moved left, so menu is shown');
    });

    QUnit.test('show/hide api', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [{ text: 'a' }]
        });

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);

        instance.showMenu();
        assert.equal($container.position().left, instance._getListWidth());

        instance.hideMenu();
        assert.equal($container.position().left, 0);

        instance.toggleMenuVisibility();
        assert.equal($container.position().left, instance._getListWidth());

        instance.toggleMenuVisibility();
        assert.equal($container.position().left, 0);
    });

    QUnit.test('\'swipeEnabled\' option', function(assert) {
        this.$element.dxSlideOut({ swipeEnabled: false });

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS), pointer = pointerMock($container).start();

        instance.showMenu();
        const position = $container.position().left;

        pointer.swipeStart().swipe(-0.1);
        assert.equal($container.position().left, position);

        instance.option('swipeEnabled', true);

        pointer.swipeStart().swipe(-0.1);
        assert.equal($container.position().left, position - 0.1 * position);

        pointer.swipeEnd(-1);
        assert.equal($container.position().left, 0);

        instance.option('swipeEnabled', false);

        pointer.swipeStart().swipe(0.1);
        assert.equal($container.position().left, 0);
    });

    QUnit.test('menuVisible option', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [{ text: 'a' }],
            menuVisible: true
        });

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);

        assert.equal($container.position().left, instance._getListWidth());

        instance.option('menuVisible', false);
        assert.equal($container.position().left, 0);

        instance.option('menuVisible', true);
        assert.equal($container.position().left, instance._getListWidth());
    });

    QUnit.test('prevent user interactions if navigation menu is open (+ B251300)', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [{ text: 'a' }],
            menuVisible: false
        });

        const instance = this.$element.dxSlideOut('instance'), $container = this.$element.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS), pointer = pointerMock($container);

        const $shield = this.$element.find('.' + SLIDEOUT_SHIELD);
        assert.ok($shield.is(':hidden'), 'shield is not visible if menu is hidden');

        instance.showMenu();
        assert.ok($shield.is(':visible'), 'shield added after menu was shown');

        pointer.start().swipeStart().swipe(-0.1);
        assert.ok($shield.is(':visible'), 'shield visible during swipe');

        pointer.swipeEnd(-1);
        assert.ok($shield.is(':hidden'), 'shield doesn\'t visible when menu is hidden');

        fx.off = false;
        instance.showMenu();
        assert.ok($shield.is(':visible'), 'shield visible during animation');
        fx.off = true;
    });

    QUnit.test('click on slideout item should close menu', function(assert) {
        this.$element.dxSlideOut({
            dataSource: [{ text: 'a' }],
            menuVisible: true
        });

        const instance = this.$element.dxSlideOut('instance'), $shield = this.$element.find('.' + SLIDEOUT_SHIELD);

        $shield.trigger('dxclick');
        assert.ok(!instance.option('menuVisible'), 'menu is hidden after click');
    });
});

QUnit.module('back button callback', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('slideout menu should be hidden after callback fired if menu is visible', function(assert) {
        const instance = $('#slideOut').dxSlideOut({
            menuVisible: true
        }).dxSlideOut('instance');

        hideTopOverlayCallback.fire();
        assert.equal(instance.option('menuVisible'), false, 'hidden after back button event');
    });

    QUnit.test('slideout menu should not be hidden after callback fired if menu is hidden', function(assert) {
        $('#slideOut').dxSlideOut({
            menuVisible: false
        });

        assert.ok(!hideTopOverlayCallback.hasCallback());
    });
});

QUnit.module('contentTemplate option', () => {
    QUnit.test('content should be rendered from content template if specified', function(assert) {
        const $slideOut = $('#slideOut').dxSlideOut({
                      selectedIndex: 0,
                      items: [{ text: 'all content' }, { text: 'unread content' }],
                      contentTemplate: function(element) {
                          assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
                          return '<div>content</div>';
                      }
                  }),
              $itemContainer = $slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);

        assert.equal($itemContainer.text(), 'content', 'content rendered');
    });

    QUnit.test('content should be rendered from content template only once', function(assert) {
        let renderTimes = 0;

        const $slideOut = $('#slideOut').dxSlideOut({
                      selectedIndex: 0,
                      items: [{ text: 'all content' }, { text: 'unread content' }],
                      contentTemplate: function() {
                          renderTimes++;
                          return '<div>content</div>';
                      }
                  }),
              slideOut = $slideOut.dxSlideOut('instance');

        slideOut._refresh();
        assert.equal(renderTimes, 1, 'content rendered only once');
        const $itemContainer = $slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);
        assert.equal($itemContainer.text(), 'content', 'content was not lost');
    });

    QUnit.test('content should not be changed after selected index change', function(assert) {
        const $slideOut = $('#slideOut').dxSlideOut({
                      selectedIndex: 0,
                      items: [{ text: 'all content' }, { text: 'unread content' }],
                      contentTemplate: function() {
                          return '<div>content</div>';
                      }
                  }),
              slideOut = $slideOut.dxSlideOut('instance'),
              $itemContainer = $slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);

        slideOut.option('selectedIndex', 1);
        assert.equal($itemContainer.text(), 'content', 'content was not lost');
    });

    QUnit.test('content should be rerendered if content template changed', function(assert) {
        const $slideOut = $('#slideOut').dxSlideOut({
                      selectedIndex: 0,
                      items: [{ text: 'all content' }, { text: 'unread content' }],
                      contentTemplate: function() {
                          return '<div>content</div>';
                      }
                  }),
              slideOut = $slideOut.dxSlideOut('instance');

        slideOut.option('contentTemplate', function() { return null; }); // TODO: may be null?
        const $itemContainer = $slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS);
        assert.equal($itemContainer.text(), 'all content', 'content rendered');
    });
});

QUnit.module('regression', {
    beforeEach: function() {
        this.$element = $('#slideOut');
    }
}, () => {
    QUnit.test('B252044 - Changing the navigation item visibility leads to incorrect SlideOut layout operation', function(assert) {
        const that = this,
              items = [
                  { title: 'testItem1' },
                  { title: 'testItem2' },
                  { title: 'testItem3' }
              ],
              slideOut = that.$element.dxSlideOut({
                  items: items,
                  selectedIndex: 1
              }).dxSlideOut('instance'),
              getFirstMenuItem = function() {
                  return that.$element.find('.' + LIST_ITEM_CLASS).eq(0);
              },
              getSlideOutItem = function() {
                  return that.$element.find('.' + SLIDEOUT_ITEM_CLASS);
              },
              firstItemText = ' Item 1 text';

        assert.ok(getFirstMenuItem().is(':visible'), 'default menu item visibility');

        getSlideOutItem().text(firstItemText);
        items[0].visible = false;
        slideOut.option('items', items);

        assert.ok(!getFirstMenuItem().is(':visible'), 'slideout item option set to menu');
        assert.equal(getSlideOutItem().text(), firstItemText, 'slideout content does not rerendered');
    });
});

