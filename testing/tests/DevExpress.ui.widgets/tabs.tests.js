import $ from 'jquery';
import domUtils from 'core/utils/dom';
import holdEvent from 'events/hold';
import pointerMock from '../../helpers/pointerMock.js';
import { DataSource } from 'data/data_source/data_source';
import { extend } from 'core/utils/extend';

import 'ui/tabs';
import 'common.css!';

QUnit.testStart(function() {
    const markup =
        `<style>
            #scrollableTabs .dx-tab {
                display: table-cell;
                padding: 35px;
            }
            
            .bigtab.dx-tabs-expanded .dx-tab {
                width: 1000px;
            }
        </style>
        <div id="tabs"></div>
        <div id="widget"></div>
        <div id="widthRootStyle" style="width: 300px;"></div>
        <div id="scrollableTabs"></div>`;

    $('#qunit-fixture').html(markup);
});

const TABS_ITEM_CLASS = 'dx-tab';
const TAB_SELECTED_CLASS = 'dx-tab-selected';
const TABS_SCROLLABLE_CLASS = 'dx-tabs-scrollable';
const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';
const TABS_NAV_BUTTONS_CLASS = 'dx-tabs-nav-buttons';
const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';
const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
const BUTTON_NEXT_ICON = 'chevronnext';
const BUTTON_PREV_ICON = 'chevronprev';
const TAB_OFFSET = 30;

const toSelector = cssClass => `.${cssClass}`;

QUnit.module('general');

QUnit.test('mouseup switch selected tab', function(assert) {
    const tabsElement = $('#tabs').dxTabs({
        items: [
            { text: '0' },
            { text: '1' },
            { text: '2' }
        ]
    });
    const tabsInstance = tabsElement.dxTabs('instance');

    $.each(tabsInstance.option('items'), function(clickedTabIndex) {
        const tabs = $(tabsInstance._itemElements());
        tabs.eq(clickedTabIndex).trigger('dxclick');

        tabs.each(function(tabIndex) {
            const tab = $(this);
            const isClickedTab = tabIndex === clickedTabIndex;

            assert.ok(isClickedTab ? tab.hasClass(TAB_SELECTED_CLASS) : !tab.hasClass(TAB_SELECTED_CLASS), 'tab selected state');
        });

        assert.equal(tabsInstance.option('selectedIndex'), clickedTabIndex, 'tabs selectedIndex');
    });
});

QUnit.test('repeated click doesn\'t change selected tab state', function(assert) {
    const tabsElement = $('#tabs').dxTabs({
        items: [
            { text: '0' },
            { text: '1' },
            { text: '2' }
        ]
    });
    const tabsInstance = tabsElement.dxTabs('instance');

    const tabElements = $(tabsInstance._itemElements());
    const tabElement = tabElements.eq(1);

    tabElement.trigger('dxclick');

    assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option('selectedIndex'), 1);

    tabElement.trigger('dxclick');
    assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option('selectedIndex'), 1);
});

QUnit.test('disabled tab can\'t be selected by click', function(assert) {
    const tabsElement = $('#tabs').dxTabs({
        items: [
            { text: '1' },
            {
                text: '2',
                disabled: true
            },
            { text: '3' }
        ]
    });
    const tabsInstance = tabsElement.dxTabs('instance');

    const tabElements = $(tabsInstance._itemElements());

    tabElements.eq(2).trigger('dxclick');

    assert.ok(tabElements.eq(2).hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option('selectedIndex'), 2);

    tabElements.eq(1).trigger('dxclick');
    assert.ok(!tabElements.eq(1).hasClass(TAB_SELECTED_CLASS));
    assert.equal(tabsInstance.option('selectedIndex'), 2);
});

QUnit.test('regression: wrong selectedIndex in tab mouseup handler', function(assert) {
    let selectedIndex;

    var tabsEl = $('#tabs').dxTabs({
        onSelectionChanged: function() {
            selectedIndex = tabsEl.dxTabs('instance').option('selectedIndex');
        },
        items: [
            { text: '0' },
            { text: '1' }
        ]
    });

    tabsEl.find('.dx-tab').eq(1).trigger('dxclick');
    assert.equal(selectedIndex, 1);

});

QUnit.test('select action should not be triggered when disabled item is disabled', function(assert) {
    let selectedIndex;

    var tabsEl = $('#tabs').dxTabs({
        onSelectionChanged: function(e) {
            selectedIndex = tabsEl.dxTabs('instance').option('selectedIndex');
        },
        items: [
            { text: '0' },
            { text: '1', disabled: true }
        ]
    });

    tabsEl.find('.dx-tab').eq(1).trigger('dxclick');
    assert.equal(selectedIndex, undefined);
});


QUnit.module('tab select action');

QUnit.test('should not be triggered when is already selected', function(assert) {
    let count = 0;

    const $tabs = $('#tabs').dxTabs({
        items: [
            { text: '0' },
            { text: '1' },
            { text: '2' },
            { text: '3' }
        ],
        onSelectionChanged: function(e) {
            count += 1;
        }
    });

    const $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(1);

    $tab
        .trigger('dxclick')
        .trigger('dxclick');

    assert.equal(count, 1, 'action triggered only once');
});

QUnit.test('selectedIndex updated on \'onItemClick\'', function(assert) {
    assert.expect(1);

    const $tabs = $('#tabs');

    $tabs.dxTabs({
        items: [1, 2, 3],
        selectedIndex: 1,
        onItemClick: function() {
            assert.equal(this.option('selectedIndex'), 2, 'selectedIndex changed');
        }
    });

    const $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(2);

    pointerMock($tab).click();
});

QUnit.test('regression: B251795', function(assert) {
    assert.expect(2);

    let itemClickFired = 0;
    let itemSelectFired = 0;

    const $tabs = $('#tabs').dxTabs({
        items: [1, 2, 3],

        selectedIndex: 0,

        onItemClick: function() {
            itemClickFired++;
        },

        onSelectionChanged: function() {
            itemSelectFired++;
        }
    });

    $tabs
        .find('.' + TABS_ITEM_CLASS)
        .eq(1)
        .trigger($.Event('touchend', { touches: [1], targetTouches: [1], changedTouches: [{ identifier: 13 }] }))
        .trigger('mouseup');

    assert.equal(itemClickFired, 0);
    assert.equal(itemSelectFired, 0);
});

QUnit.test('Tabs in multiple mode', function(assert) {
    const $element = $('#widget').dxTabs({
        items: [
            { text: 'user' },
            { text: 'analytics' },
            { text: 'customers' },
            { text: 'search' },
            { text: 'favorites' }
        ], width: 400,
        selectionMode: 'multiple',
        selectedIndex: 2
    });
    const instance = $element.dxTabs('instance');

    assert.equal(instance.option('selectedItem').text, 'customers', 'was selected correct item');

    assert.ok(!instance.option('selectOnFocus'), 'option selectOnFocus must be false with turn on multiple mode');

    const $tab = $element.find(toSelector(TABS_ITEM_CLASS)).eq(3);
    pointerMock($tab).click();

    assert.equal(instance.option('selectedItems').length, 2, 'selected two items in multiple mode');
});


QUnit.module('horizontal scrolling');

const SCROLLABLE_CLASS = 'dx-scrollable';

QUnit.test('tabs should be wrapped into scrollable if scrollingEnabled=true', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        scrollingEnabled: true,
        width: 100
    });
    const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

    assert.ok($scrollable.length, 'scroll created');
    assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), 'wrapper class added');
    assert.ok($scrollable.find('.' + TABS_ITEM_CLASS).length, 'items wrapped into scrollable');
});

QUnit.test('tabs should be wrapped into scrollable for some disabled items', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2', disabled: true }, { text: 'item 3', disabled: true }, { text: 'item 4', disabled: true }],
        width: 200
    });
    const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

    assert.ok($scrollable.length, 'scroll created');
    assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), 'wrapper class added');
    assert.ok($scrollable.find('.' + TABS_ITEM_CLASS).length, 'items wrapped into scrollable');
});

QUnit.test('tabs should not be wrapped into scrollable for some invisible items', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2', visible: false }, { text: 'item 3', visible: false }, { text: 'item 4', visible: false }],
        width: 200
    });

    assert.notOk(!!$element.children('.' + SCROLLABLE_CLASS).length, 'no scroll for invisible items');
});

QUnit.test('scrollable should have correct option scrollByContent', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        scrollingEnabled: true,
        scrollByContent: true,
        width: 100
    });
    const instance = $element.dxTabs('instance');
    const $scrollable = $element.children('.' + SCROLLABLE_CLASS);
    const scrollable = $scrollable.dxScrollable('instance');

    assert.ok(scrollable.option('scrollByContent'), 'scrollByContent was set');

    instance.option('scrollByContent', false);
    assert.ok(!scrollable.option('scrollByContent'), 'scrollByContent was set');
});

QUnit.test('tabs should not crash in IE and Firefox after creation', function(assert) {
    $('#tabs').addClass('bigtab').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        scrollingEnabled: true,
        showNavButtons: true
    });

    assert.ok(true, 'widget was inited');
});

QUnit.test('nav buttons class should be added if showNavButtons=true', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        showNavButtons: true,
        width: 100
    });

    assert.ok($element.hasClass(TABS_NAV_BUTTONS_CLASS), 'navs class added');
});

QUnit.test('nav buttons should be rendered when widget is rendered invisible', function(assert) {
    const $container = $('<div>');

    try {
        const $element = $('<div>').appendTo($container).dxTabs({
            items: [
                { text: 'user' },
                { text: 'analytics' },
                { text: 'customers' },
                { text: 'search' },
                { text: 'favorites' }
            ],
            wordWrap: false,
            scrollingEnabled: true,
            showNavButtons: true,
            width: 100
        });

        $container.appendTo('#qunit-fixture');
        domUtils.triggerShownEvent($container);

        assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 2, 'nav buttons are rendered');
    } finally {
        $container.remove();
    }
});

QUnit.test('right nav button should be rendered if showNavButtons=true and possible to scroll right', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.children().eq(-1);

    assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), 'nav class added');
    assert.ok($button.hasClass(TABS_RIGHT_NAV_BUTTON_CLASS), 'right class added');
});

QUnit.test('click on right nav button should scroll tabs to right', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    $($button).trigger('dxclick');
    assert.equal(scrollable.scrollLeft(), TAB_OFFSET, 'scroll position is correct');
});

QUnit.test('hold on right nav button should scroll tabs to right to end', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' },
            { text: 'item 5' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    this.clock = sinon.useFakeTimers();

    $($button).trigger(holdEvent.name);
    this.clock.tick(100);
    $($button).trigger('mouseup');

    assert.equal(scrollable.scrollLeft(), 120, 'scroll position is correct');

    this.clock.restore();
});


QUnit.test('left nav button should be rendered if showNavButtons=true and possible to scroll left', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.children().eq(0);

    assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), 'nav class added');
    assert.ok($button.hasClass(TABS_LEFT_NAV_BUTTON_CLASS), 'left class added');
});

QUnit.test('click on left nav button should scroll tabs to left', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    scrollable.update();
    scrollable.scrollTo(TAB_OFFSET);
    $($button).trigger('dxclick');
    assert.equal(scrollable.scrollLeft(), 0, 'scroll position is correct');
});

QUnit.test('hold on left nav button should scroll tabs to left to end', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' },
            { text: 'item 5' }, { text: 'item 6' }, { text: 'item 7' }, { text: 'item 8' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    this.clock = sinon.useFakeTimers();

    scrollable.update();
    scrollable.scrollTo(200);

    $($button).trigger(holdEvent.name);
    this.clock.tick(100);
    $($button).trigger('mouseup');

    assert.equal(scrollable.scrollLeft(), 80, 'scroll position is correct');

    this.clock.restore();
});

QUnit.test('selected item should be visible after selectedIndex was changed', function(assert) {
    assert.expect(1);
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
        selectedIndex: 0,
        wordWrap: false,
        scrollingEnabled: true,
        width: 100
    });
    const instance = $element.dxTabs('instance');
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    scrollable.scrollToElement = function($item) {
        assert.equal($item.get(0), instance.itemElements().eq(3).get(0), 'scrolled to item');
    };
    instance.option('selectedIndex', 3);
});

QUnit.test('tabs should not be wrapped into scrollable if all items are visible', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }],
        wordWrap: false,
        scrollingEnabled: true,
        width: 250
    });
    const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

    assert.equal($scrollable.length, 0, 'scroll was not created');
});

QUnit.test('left button should be disabled if scrollPosition == 0', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    assert.ok($button.dxButton('instance').option('disabled'));

    scrollable.scrollTo(10);
    assert.ok(!$button.dxButton('instance').option('disabled'));

    scrollable.scrollTo(0);
    assert.ok($button.dxButton('instance').option('disabled'));
});

QUnit.test('right button should be disabled if scrollPosition == scrollWidth', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
    const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

    assert.ok(!$button.dxButton('instance').option('disabled'));

    scrollable.scrollTo(scrollable.scrollWidth() - scrollable.clientWidth());
    assert.ok($button.dxButton('instance').option('disabled'));

    scrollable.scrollTo(0);
    assert.ok(!$button.dxButton('instance').option('disabled'));
});

QUnit.test('button should update disabled state after dxresize', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
        wordWrap: false,
        showNavButtons: true,
        scrollingEnabled: true,
        width: 100
    });
    const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);

    $button.dxButton('instance').option('disabled', true);

    $($element).trigger('dxresize');
    assert.ok(!$button.dxButton('instance').option('disabled'));
});

QUnit.test('tabs should not be refreshed after dimension changed', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }],
        scrollingEnabled: true,
        visible: true,
        width: 100
    });
    const instance = $element.dxTabs('instance');

    instance.itemElements().data('rendered', true);

    $($element).trigger('dxresize');

    assert.ok(instance.itemElements().data('rendered'), 'tabs was not refreshed');
    assert.equal($element.find('.' + TABS_SCROLLABLE_CLASS).length, 1, 'only one scrollable wrapper should exist');
});

QUnit.test('tabs should hide navigation if scrollable is not allowed after resize', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }],
        scrollingEnabled: true,
        visible: true,
        width: 100
    });
    const instance = $element.dxTabs('instance');

    instance.option('width', 700);

    assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 0, 'nav buttons was removed');
    assert.equal($element.find('.' + TABS_SCROLLABLE_CLASS).length, 0, 'scrollable was removed');
    assert.equal($element.find('.' + TABS_WRAPPER_CLASS).length, 1, 'indent wrapper was restored');
});

QUnit.test('tabs should scroll to the selected item on init', function(assert) {
    const items = [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' }, { text: 'item 5' }];
    const $element = $('#scrollableTabs').dxTabs({
        items: items,
        scrollingEnabled: true,
        visible: true,
        selectedItem: items[3],
        width: 200
    });

    const $item = $element.find('.' + TABS_ITEM_CLASS).eq(3);
    const itemOffset = Math.round($item.offset().left);
    const contentLeft = Math.round($element.offset().left);
    const contentRight = Math.round(contentLeft + $element.outerWidth());

    assert.ok(itemOffset <= contentRight - $item.outerWidth(), 'item offset is lower than right boundary');
    assert.ok(itemOffset > contentLeft, 'item offset is greater than left boundary');
});


QUnit.module('RTL');
QUnit.test('nav buttons should have correct icons on init', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
        showNavButtons: true,
        wordWrap: false,
        scrollingEnabled: true,
        rtlEnabled: true,
        width: 100
    });

    const leftButtonIcon = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS).dxButton('option', 'icon');
    const rightButtonIcon = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS).dxButton('option', 'icon');

    assert.equal(leftButtonIcon, BUTTON_NEXT_ICON, 'Left button icon is OK');
    assert.equal(rightButtonIcon, BUTTON_PREV_ICON, 'Right button icon is OK');
});

QUnit.test('nav buttons should have correct icons after rtlEnabled changed', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
        showNavButtons: true,
        wordWrap: false,
        scrollingEnabled: true,
        rtlEnabled: true,
        width: 100
    });

    $element.dxTabs('option', 'rtlEnabled', false);

    const leftButtonIcon = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS).dxButton('option', 'icon');
    const rightButtonIcon = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS).dxButton('option', 'icon');

    assert.equal(leftButtonIcon, BUTTON_PREV_ICON, 'Left button icon is OK');
    assert.equal(rightButtonIcon, BUTTON_NEXT_ICON, 'Right button icon is OK');
});

QUnit.test('tabs should be scrolled to the right position on init in RTL mode', function(assert) {
    const $element = $('#scrollableTabs').dxTabs({
        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
        showNavButtons: true,
        wordWrap: false,
        scrollingEnabled: true,
        rtlEnabled: true,
        width: 100
    });

    const scrollable = $element.find('.dx-scrollable').dxScrollable('instance');

    assert.equal(scrollable.scrollLeft(), Math.round(scrollable.scrollWidth() - scrollable.clientWidth()), 'items are scrolled');
});

QUnit.module('Live Update', {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.data = [{
            id: 0,
            text: '0',
            content: '0 tab content'
        },
        {
            id: 1,
            text: '1',
            content: '1 tab content'
        }];
        this.createTabs = (dataSourceOptions, tabOptions) => {
            const dataSource = new DataSource($.extend({
                paginate: false,
                pushAggregationTimeout: 0,
                load: () => this.data,
                key: 'id'
            }, dataSourceOptions));

            return $('#tabs').dxTabs(
                extend(tabOptions, {
                    dataSource,
                    onContentReady: e => {
                        e.component.option('onItemRendered', this.itemRenderedSpy);
                        e.component.option('onItemDeleted', this.itemDeletedSpy);
                    }
                })).dxTabs('instance');
        };
    }
}, function() {
    QUnit.test('update item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'update', data: {
            id: 1,
            text: '1 Updated',
            content: '1 tab content'
        }, key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check updated item');
    });

    QUnit.test('add item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'insert', data: {
            id: 2,
            text: '2 Inserted',
            content: '2 tab content'
        } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
        assert.ok($(this.itemRenderedSpy.firstCall.args[0].itemElement).parent().hasClass(TABS_WRAPPER_CLASS), 'check item container');
    });

    QUnit.test('remove item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'remove', key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'removed items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.text, '1', 'check removed item');
    });

    QUnit.test('repaintChangesOnly, update item instance', function(assert) {
        const dataSource = this.createTabs({}, { repaintChangesOnly: true }).getDataSource();

        this.data[0] = {
            id: 0,
            text: '0 Updated',
            content: '0 tab content'
        };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '0 Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, add item', function(assert) {
        const dataSource = this.createTabs({}, { repaintChangesOnly: true }).getDataSource();

        this.data.push({
            id: 2,
            text: '2 Inserted',
            content: '2 tab content'
        });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '2 Inserted', 'check added item');
        assert.ok($(this.itemRenderedSpy.firstCall.args[0].itemElement).parent().hasClass(TABS_WRAPPER_CLASS), 'check item container');
    });

    QUnit.test('Show nav buttons when new item is added', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: true,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'insert',
            data: {
                id: 2,
                text: '2 Inserted',
                content: '2 tab content'
            }
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).length, 1, 'left nav button is shown');
        assert.equal($element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).length, 1, 'right nav button is shown');
    });

    QUnit.test('Hide nav buttons when item is removed', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);
        this.data.push({
            id: 2,
            text: 'item 2',
            content: '2 tab content'
        });

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: true,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 2
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).length, 0, 'left nav button is hidden');
        assert.equal($element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).length, 0, 'right nav button is hidden');
    });

    QUnit.test('Enable scrolling when new item is added', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: false,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'insert',
            data: {
                id: 2,
                text: '2 Inserted',
                content: '2 tab content'
            }
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrolling is enabled');
    });

    QUnit.test('Disable scrolling when item is removed', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);
        this.data.push({
            id: 2,
            text: 'item 2',
            content: '2 tab content'
        });

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: false,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 2
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 0, 'scrolling is disabled');
    });
});
