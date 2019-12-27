/* global DATA, internals, initTree */

import $ from 'jquery';
import { noop } from 'core/utils/common';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import devices from 'core/devices';

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

QUnit.test('focus on the item should move scroll position to this item (T226868)', function(assert) {
    assert.expect(1);

    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'unnecessary test on mobile devices');
        return;
    }

    const $treeView = initTree({
        items: [{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2', expanded: true, items: [{ id: 3, text: 'item 3' }] }],
        focusStateEnabled: true,
        height: 40
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(1);
    const scrollable = $treeView.find('.dx-scrollable').dxScrollable('instance');

    scrollable.option('onScroll', function(args) {
        assert.equal(args.scrollOffset.top, 24, 'scrolled to the item');
        scrollable.option('onScroll', noop);
    });

    $item.trigger('dxpointerdown');

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
    // arrange
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

        // assert
        assert.equal(scrollable.scrollTop(), 56, 'scroll top position');

        scrollable.scrollTo({ y: 0 });

        // assert
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        // act
        $treeView.trigger('focusin');

        // assert
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $items.first().trigger('dxpointerdown');
        clock.tick();

        // assert
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');
    } finally {
        clock.restore();
    }
});

QUnit.test('Scroll should not jump down when focusing on Select All (T517945)', function(assert) {
    // arrange
    const $treeView = initTree({
        items: [{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2', expanded: true, items: [{ id: 3, text: 'item 3' }] }],
        showCheckBoxesMode: 'selectAll',
        focusStateEnabled: true,
        height: 40
    });
    const $items = $treeView.find('.' + ITEM_CLASS);
    const scrollable = $treeView.find('.dx-scrollable').dxScrollable('instance');
    const clock = sinon.useFakeTimers();

    try {
        $items.last().trigger('dxpointerdown');

        // assert
        assert.equal(scrollable.scrollTop(), 106, 'scroll top position');

        scrollable.scrollTo({ y: 0 });

        // assert
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        // act
        $treeView.trigger('focusin');

        // assert
        assert.equal(scrollable.scrollTop(), 0, 'scroll top position');

        $treeView.find('.' + SELECT_ALL_ITEM_CLASS).first().trigger('dxpointerdown');
        clock.tick();

        // assert
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
