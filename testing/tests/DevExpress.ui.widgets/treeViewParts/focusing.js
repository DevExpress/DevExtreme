/* global DATA, internals, initTree */

import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import devices from 'core/devices';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';

const NODE_CLASS = 'dx-treeview-node';
const ITEM_CLASS = 'dx-treeview-item';
const SELECT_ALL_ITEM_CLASS = 'dx-treeview-select-all-item';
const TOGGLE_ITEM_VISIBILITY_CLASS = 'dx-treeview-toggle-item-visibility';

QUnit.module('Focusing');

QUnit.testInActiveWindow('item should have focus-state class after click on it', function(assert) {
    const treeViewData = DATA[0];
    const $treeView = initTree({
        items: treeViewData,
        focusStateEnabled: true
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    const treeView = $treeView.dxTreeView('instance');

    $item.trigger('dxpointerdown');

    assert.equal(isRenderer(treeView.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($node.hasClass('dx-state-focused'), 'focus state was toggle after click');
});

QUnit.testInActiveWindow('disabled item should not have focus-state class after click on it', function(assert) {
    const treeViewData = $.extend(true, [], DATA[0]);
    treeViewData[0].disabled = true;

    const $treeView = initTree({
        items: treeViewData,
        focusStateEnabled: true
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    $item.trigger('dxpointerdown');

    assert.ok(!$node.hasClass('dx-state-focused'), 'focus state was toggle after click');
});

QUnit.testInActiveWindow('widget should not have focus-state class after click on arrow', function(assert) {
    const treeViewData = DATA[0];
    const $treeView = initTree({
        items: treeViewData,
        focusStateEnabled: true
    });
    const $arrow = $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    $arrow.trigger('dxclick');

    assert.ok(!$node.hasClass('dx-state-focused'), 'focus state was toggle after click');
});

const configs = [];
['up', 'down', 'left', 'right', 'first', 'last'].forEach(direction => {
    [false, true].forEach(expanded => {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(initialFocusedItemKey => {
            configs.push({ expanded, direction, initialFocusedItemKey });
        });
    });
});

configs.forEach(config => {
    QUnit.test(`all.Expanded: ${config.expanded} -> emulateFocus(key:${config.initialFocusedItemKey}) -> moveFocus('${config.direction}'); (T226868)`, function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'unnecessary test on mobile devices');
            return;
        }
        const wrapper = new TreeViewTestWrapper({
            items: [
                { id: 1, text: 'item1', expanded: config.expanded, items: [{ id: 2, text: 'item1_1', expanded: config.expanded, items: [{ id: 3, text: 'item1_1_1' }] }] },
                { id: 4, text: 'item2', expanded: config.expanded, items: [{ id: 5, text: 'item2_1', expanded: config.expanded, items: [{ id: 6, text: 'item1_1_1' }] }] },
                { id: 7, text: 'item3', expanded: config.expanded, items: [{ id: 8, text: 'item3_1', expanded: config.expanded, items: [{ id: 9, text: 'item1_1_1' }] }] },
                { id: 10, text: 'item4', expanded: config.expanded, items: [{ id: 11, text: 'item4_1', expanded: config.expanded, items: [{ id: 12, text: 'item4_1_1' }] }] }
            ],
            focusStateEnabled: true,
            scrollDirection: 'both',
            height: 40,
            width: 40
        });

        const $node = wrapper.getElement().find(`[data-item-id="${config.initialFocusedItemKey}"]`);
        if(!$node.length) {
            assert.ok(true, 'not real scenario');
            return;
        }

        const $item = $node.find('.dx-treeview-item').eq(0);
        wrapper.instance._scrollableContainer.scrollToElement($item);
        $item.trigger('dxpointerdown');

        wrapper.instance._moveFocus(config.direction, {});
        wrapper.checkNodeIsVisibleArea(getNextFocusedItemKey($node, config.initialFocusedItemKey, config.direction, config.expanded));
    });

    function getNextFocusedItemKey($node, key, direction, expanded) {
        const isFirstLevelNode = $node.attr('aria-level') === '1';
        const isLastLevelNode = $node.attr('aria-level') === '3';
        const firstKey = 1;
        const lastKey = expanded ? 12 : 10;

        let nextFocusedItemKey = 1;
        switch(direction) {
            case 'up':
                nextFocusedItemKey = !isFirstLevelNode || expanded
                    ? key - 1
                    : key - 3;
                break;
            case 'down':
                nextFocusedItemKey = !isFirstLevelNode || expanded
                    ? key + 1
                    : key + 3;
                break;
            case 'left':
                nextFocusedItemKey = isFirstLevelNode || expanded
                    ? key
                    : key - 1;
                break;
            case 'right':
                nextFocusedItemKey = isLastLevelNode || !expanded
                    ? key
                    : key + 1;
                break;
            case 'first':
                nextFocusedItemKey = firstKey;
                break;
            case 'last':
                nextFocusedItemKey = lastKey;
                break;
        }

        if(nextFocusedItemKey < firstKey) {
            nextFocusedItemKey = lastKey;
        } else if(nextFocusedItemKey > lastKey) {
            nextFocusedItemKey = firstKey;
        }

        return nextFocusedItemKey;
    }
});

QUnit.test('PointerDown event at checkbox should not be ignored', function(assert) {
    const data = [
        { id: 1, parentId: 0, text: 'Cats' }
    ];

    const $treeView = initTree({
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal'
    });

    const treeView = $treeView.dxTreeView('instance');
    const pointerDownStub = sinon.stub(treeView, '_itemPointerDownHandler');

    const $node = $treeView.find('.' + NODE_CLASS).eq(0);
    const $checkBox = $node.find('.dx-checkbox');

    $checkBox.trigger('dxpointerdown');

    assert.equal(pointerDownStub.callCount, 1, 'itemPointerDownHandler was called');
});

QUnit.test('PointerDown event at expansion arrow should not be ignored', function(assert) {
    const data = [
        { id: 1, parentId: 0, text: 'Cats' },
        { id: 2, parentId: 1, text: 'Maine Coon' }
    ];

    const $treeView = initTree({
        dataSource: data,
        dataStructure: 'plain'
    });

    const treeView = $treeView.dxTreeView('instance');
    const pointerDownStub = sinon.stub(treeView, '_itemPointerDownHandler');

    const $node = $treeView.find('.' + NODE_CLASS).eq(0);
    const $arrow = $node.find('.' + TOGGLE_ITEM_VISIBILITY_CLASS);

    $arrow.trigger('dxpointerdown');

    assert.equal(pointerDownStub.callCount, 1, 'itemPointerDownHandler was called');
});

QUnit.test('Scroll should not jump down when focusing on item (T492496)', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2', expanded: true, items: [{ id: 3, text: 'item 3' }] }],
        focusStateEnabled: true,
        height: 40
    });
    const $items = $treeView.find('.' + ITEM_CLASS);
    const scrollable = $treeView.find('.dx-scrollable').dxScrollable('instance');
    const clock = sinon.useFakeTimers();

    try {
        $items.last().trigger('dxpointerdown');
        $treeView.dxTreeView('instance').scrollToItem($items.last());
        assert.equal(scrollable.scrollTop(), 56, 'scroll top position');

        scrollable.scrollTo({ y: 0 });
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $treeView.trigger('focusin');
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $items.first().trigger('dxpointerdown');
        clock.tick();
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');
    } finally {
        clock.restore();
    }
});

QUnit.test('Scroll should not jump down when focusing on Select All (T517945)', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2', expanded: true, items: [{ id: 3, text: 'item 3' }] }],
        showCheckBoxesMode: 'selectAll',
        focusStateEnabled: true,
        height: 40
    });
    const $lastItem = $treeView.find('.' + ITEM_CLASS).last();
    const scrollable = $treeView.find('.dx-scrollable').dxScrollable('instance');
    const clock = sinon.useFakeTimers();

    try {
        $treeView.dxTreeView('instance').scrollToItem($lastItem);
        $lastItem.trigger('dxpointerdown');
        assert.equal(scrollable.scrollTop(), 106, 'scroll top position');

        scrollable.scrollTo({ y: 0 });
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $treeView.trigger('focusin');
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $treeView.find('.' + SELECT_ALL_ITEM_CLASS).first().trigger('dxpointerdown');
        clock.tick();
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');
    } finally {
        clock.restore();
    }
});

QUnit.testInActiveWindow('Focusing widget when there is search editor', function(assert) {
    const $treeView = initTree({
        items: $.extend(true, [], DATA[0]),
        searchEnabled: true
    });
    const instance = $treeView.dxTreeView('instance');

    instance.focus();

    assert.ok($treeView.children('.dx-treeview-search').hasClass('dx-state-focused'), 'search editor is focused');
});
