/* global DATA, internals, initTree */

import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import devices from 'core/devices';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isDesktopDevice } from '../../../helpers/fileManagerHelpers.js';

const NODE_CLASS = 'dx-treeview-node';
const ITEM_CLASS = 'dx-treeview-item';
const SELECT_ALL_ITEM_CLASS = 'dx-treeview-select-all-item';
const TOGGLE_ITEM_VISIBILITY_CLASS = 'dx-treeview-toggle-item-visibility';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const CHECKBOX_CHECKED_STATE_CLASS = 'dx-checkbox-checked';

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
    assert.ok($node.hasClass(FOCUSED_STATE_CLASS), 'focus state was toggle after click');
});

QUnit.testInActiveWindow('disabled item should have focus-state class after click on it', function(assert) {
    const treeViewData = $.extend(true, [], DATA[0]);
    treeViewData[0].disabled = true;

    const $treeView = initTree({
        items: treeViewData,
        focusStateEnabled: true
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    $item.trigger('dxpointerdown');

    assert.ok($node.hasClass(FOCUSED_STATE_CLASS), 'focus state was toggle after click');
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

    assert.ok(!$node.hasClass(FOCUSED_STATE_CLASS), 'focus state was toggle after click');
});

const configs = [];
['up', 'down', 'left', 'right', 'first', 'last'].forEach(direction => {
    ['item1', 'item1_1', 'item1_1_1', 'item1_1_1_1', 'item2', 'item2_1', 'item2_1_1', 'item2_1_1_1', 'item3', 'item3_1', 'item3_1_1', 'item3_1_1_1', 'item4', 'item4_1', 'item4_1_1', 'item4_1_1_1'].forEach(initialFocusedKey => {
        [false, true].forEach(expanded => {
            configs.push({ expanded, direction, initialFocusedKey });
        });
    });
});

configs.forEach(config => {
    QUnit.test(`all.Expanded: ${config.expanded} -> emulateFocus(key:${config.initialFocusedKey}) -> moveFocus('${config.direction}'); (T226868)`, function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'unnecessary test on mobile devices');
            return;
        }
        const wrapper = new TreeViewTestWrapper({
            items: [
                { id: 'item1', expanded: config.expanded, items: [{ id: 'item1_1', expanded: config.expanded, items: [{ id: 'item1_1_1', expanded: config.expanded, items: [{ id: 'item1_1_1_1_1', expanded: config.expanded }] }] }] },
                { id: 'item2', expanded: config.expanded, items: [{ id: 'item2_1', expanded: config.expanded, items: [{ id: 'item2_1_1', expanded: config.expanded, items: [{ id: 'item2_1_1_1_1', expanded: config.expanded }] }] }] },
                { id: 'item3', expanded: config.expanded, items: [{ id: 'item3_1', expanded: config.expanded, items: [{ id: 'item3_1_1', expanded: config.expanded, items: [{ id: 'item3_1_1_1_1', expanded: config.expanded }] }] }] },
                { id: 'item4', expanded: config.expanded, items: [{ id: 'item4_1', expanded: config.expanded, items: [{ id: 'item4_1_1', expanded: config.expanded, items: [{ id: 'item4_1_1_1_1', expanded: config.expanded }] }] }] }
            ],
            displayExpr: 'id',
            focusStateEnabled: true,
            scrollDirection: 'both',
            height: 150,
            width: 150
        });

        const $nodes = wrapper.getElement().find(`.${NODE_CLASS}`);
        const $node = wrapper.getElement().find(`[data-item-id="${config.initialFocusedKey}"]`);
        if(!$node.length) {
            assert.ok(true, 'not real scenario');
            return;
        }

        const $item = $node.find('.dx-treeview-item').eq(0);
        wrapper.instance.scrollToItem($item);
        $item.trigger('dxpointerdown');

        wrapper.instance._moveFocus(config.direction, {});
        const nextFocusedKey = getNextFocusedKey($nodes, $node, config.direction);
        const actualFocusedItemKey = $(wrapper.instance.option('focusedElement')).attr('data-item-id');
        assert.equal(nextFocusedKey, actualFocusedItemKey);
        wrapper.checkNodeIsInVisibleArea(nextFocusedKey);
    });

    function getNextFocusedKey($nodes, $node, direction) {
        const firstNodeIndex = 0;
        const lastNodeIndex = $nodes.length - 1;
        const currentNodeIndex = $nodes.index($node);

        let nextNodeIndex;
        if(direction === 'up') {
            nextNodeIndex = currentNodeIndex - 1;
        } else if(direction === 'down') {
            nextNodeIndex = currentNodeIndex + 1;
        } else if(direction === 'first') {
            nextNodeIndex = 0;
        } else if(direction === 'last') {
            nextNodeIndex = lastNodeIndex;
        } else if(direction === 'left') {
            nextNodeIndex = $node.attr('aria-expanded') === 'true' || $node.attr('aria-level') === '1'
                ? currentNodeIndex
                : currentNodeIndex - 1;
        } else {
            nextNodeIndex = $node.attr('aria-expanded') !== 'true' || $node.attr('aria-level') === '4'
                ? currentNodeIndex
                : currentNodeIndex + 1;
        }

        if(nextNodeIndex < firstNodeIndex) {
            nextNodeIndex = lastNodeIndex;
        } else if(nextNodeIndex > lastNodeIndex) {
            nextNodeIndex = firstNodeIndex;
        }

        return $nodes.eq(nextNodeIndex).attr('data-item-id');
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
        scrollable.scrollTo({ y: 56 });
        $items.last().trigger('dxpointerdown');
        assert.equal(scrollable.scrollTop(), 56, 'scroll top position');

        scrollable.scrollTo({ y: 0 });
        $treeView.trigger('focusin');
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $items.first().trigger('dxpointerdown');
        clock.tick(10);
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');
    } finally {
        clock.restore();
    }
});

QUnit.test('First node should not has been focused when focusing on SelectAll item (T1109632)', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'item 1' },
            { id: 2, text: 'item 2' }
        ],
        showCheckBoxesMode: 'selectAll',
        focusStateEnabled: true,
        height: 40,
    });
    const $selectAllItem = $treeView.find('.' + SELECT_ALL_ITEM_CLASS).first();
    const $firstItem = $treeView.find('.' + ITEM_CLASS).first();

    const clock = sinon.useFakeTimers();

    try {
        $selectAllItem.trigger('focusin');
        clock.tick(10);

        assert.notOk($firstItem.hasClass(FOCUSED_STATE_CLASS), 'first item has not focus state class');
    } finally {
        clock.restore();
    }
});

QUnit.test('SelectAll item should be focused when focusing a treeview if showCheckBoxesMode:selectAll', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        items: [ { id: 1 } ],
        showCheckBoxesMode: 'selectAll'
    });

    $treeView.trigger('focusin');

    assert.ok($(`.${SELECT_ALL_ITEM_CLASS}`).hasClass(FOCUSED_STATE_CLASS));
});

QUnit.test('SelectAll item should be focused when focusing a treeview second time if showCheckBoxesMode:selectAll', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        items: [ { id: 1 } ],
        showCheckBoxesMode: 'selectAll',
    });

    const $selectAllItem = $(`.${SELECT_ALL_ITEM_CLASS}`);

    const clock = sinon.useFakeTimers();

    try {
        $treeView.trigger('focusin');
        $treeView.trigger('focusin');
        clock.tick(10);

        assert.ok($selectAllItem.hasClass(FOCUSED_STATE_CLASS));
    } finally {
        clock.restore();
    }
});

QUnit.test('First node should be focused when focusing a treeview if showCheckBoxesMode:normal', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        items: [ { id: 1 }, { id: 2 } ],
        showCheckBoxesMode: 'normal',
    });

    const $firstItem = $(`.${NODE_CLASS}`).first();

    $treeView.trigger('focusin');

    assert.ok($firstItem.hasClass(FOCUSED_STATE_CLASS));
});

QUnit.test('SelectAll checkbox should be checked with space key', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        items: [ { id: 1 }],
        showCheckBoxesMode: 'selectAll',
    });

    const $selectAllItem = $(`.${SELECT_ALL_ITEM_CLASS}`);

    $selectAllItem.trigger('focusin');

    keyboardMock($treeView).keyDown('space');

    assert.ok($selectAllItem.hasClass(CHECKBOX_CHECKED_STATE_CLASS));
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
        scrollable.scrollTo({ y: 106 });
        $lastItem.trigger('dxpointerdown');
        assert.equal(scrollable.scrollTop(), 106, 'scroll top position');

        scrollable.scrollTo({ y: 0 });
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $treeView.trigger('focusin');
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $treeView.find('.' + SELECT_ALL_ITEM_CLASS).first().trigger('dxpointerdown');
        clock.tick(10);
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

    assert.ok($treeView.children('.dx-treeview-search').hasClass(FOCUSED_STATE_CLASS), 'search editor is focused');
});
