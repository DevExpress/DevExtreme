/* global internals */

import $ from 'jquery';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../../helpers/keyboardMock.js';

QUnit.module('Animation', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('expand item should be animated if option animationEnabled is true', function(assert) {
    assert.expect(7);

    const originalAnimation = fx.animate;
    const originalStop = fx.stop;

    try {
        fx.stop = sinon.spy(function($element) {
            const $nodeContainer = $node.find('.' + internals.NODE_CONTAINER_CLASS).eq(0);
            assert.equal($element.get(0), $nodeContainer.get(0), 'correct element was animated');
        });
        fx.animate = sinon.spy(function($element, config) {
            const $nodeContainer = $node.find('.' + internals.NODE_CONTAINER_CLASS).eq(0);

            config.duration = 0;

            assert.equal($element.get(0), $nodeContainer.get(0), 'correct element was animated');
            assert.equal(config.from['maxHeight'], 0, 'starting from zero height');
            assert.equal(config.to['maxHeight'], $nodeContainer.height(), 'starting from zero height');
            assert.ok($nodeContainer.hasClass(internals.OPENED_NODE_CONTAINER_CLASS), 'node container displayed');

            config.complete = (function() {
                const orig = config.complete;
                return function() {
                    orig();

                    assert.equal($nodeContainer.css('maxHeight'), 'none', 'max-height was reset');
                    assert.ok($nodeContainer.hasClass(internals.OPENED_NODE_CONTAINER_CLASS), 'node container displayed');
                };
            })();

            originalAnimation.call(this, $element, config);
        });

        const $treeView = $('#treeView').dxTreeView({
            items: [{
                id: 1, text: 'Item 1',
                items: [{ id: 3, text: 'Item 3' }]
            }],
            animationEnabled: true
        });

        const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
        const $item = $node.find('.' + internals.ITEM_CLASS).eq(0);

        $treeView.dxTreeView('instance').expandItem($item.get(0));
    } finally {
        fx.animate = originalAnimation;
        fx.stop = originalStop;
    }
});

QUnit.test('collapse item should be animated if option animationEnabled is true', function(assert) {
    assert.expect(8);

    const originalAnimation = fx.animate;
    const originalStop = fx.stop;

    try {
        fx.stop = sinon.spy(function($element) {
            assert.equal($element.get(0), $nodeContainer.get(0), 'correct element was animated');
        });
        fx.animate = sinon.spy(function($element, config) {
            assert.notEqual(config.duration, 0, 'not zero duration');
            config.duration = 0;

            assert.equal($element.get(0), $nodeContainer.get(0), 'correct element was animated');

            assert.equal(config.from['maxHeight'], $nodeContainer.height(), 'starting from real height');
            assert.equal(config.to['maxHeight'], 0, 'starting to zero height');
            assert.ok($nodeContainer.hasClass(internals.OPENED_NODE_CONTAINER_CLASS), 'node container displayed');

            config.complete = (function() {
                const orig = config.complete;
                return function() {
                    orig();

                    assert.equal($nodeContainer.css('maxHeight'), 'none', 'max-height was reset');
                    assert.ok(!$nodeContainer.hasClass(internals.OPENED_NODE_CONTAINER_CLASS), 'node container displayed');
                };
            })();

            originalAnimation.call(this, $element, config);
        });

        const $treeView = $('#treeView').dxTreeView({
            items: [{
                id: 1, text: 'Item 1', expanded: true,
                items: [{ id: 3, text: 'Item 3' }]
            }],
            animationEnabled: true
        });

        const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
        const $item = $node.find('.' + internals.ITEM_CLASS).eq(0);
        const $nodeContainer = $node.find('.' + internals.NODE_CONTAINER_CLASS).eq(0);

        $treeView.dxTreeView('instance').collapseItem($item.get(0));
    } finally {
        fx.animate = originalAnimation;
        fx.stop = originalStop;
    }
});

QUnit.test('collapse item should not be animated if option animationEnabled is false', function(assert) {
    const originalAnimation = fx.animate;

    try {
        fx.animate = sinon.spy(function($element, config) {
            assert.equal(config.duration, 0, 'not zero duration');
            originalAnimation.call(this, $element, config);
        });

        const $treeView = $('#treeView').dxTreeView({
            items: [{
                id: 1, text: 'Item 1', expanded: true,
                items: [{ id: 3, text: 'Item 3' }]
            }],
            animationEnabled: false
        });

        const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
        const $item = $node.find('.' + internals.ITEM_CLASS).eq(0);

        $treeView.dxTreeView('instance').collapseItem($item.get(0));
    } finally {
        fx.animate = originalAnimation;
    }
});

QUnit.test('collapse item should not be animated if item is already collapsed', function(assert) {
    assert.expect(0);

    const originalAnimation = fx.animate;

    try {
        fx.animate = sinon.spy(function($element, config) {
            assert.ok(false, 'animation was no run');
        });

        const $treeView = $('#treeView').dxTreeView({
            items: [{
                id: 1, text: 'Item 1', expanded: false,
                items: [{ id: 3, text: 'Item 3' }]
            }]
        });

        const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
        const $item = $node.find('.' + internals.ITEM_CLASS).eq(0);

        $treeView.dxTreeView('instance').collapseItem($item.get(0));
    } finally {
        fx.animate = originalAnimation;
    }
});

QUnit.test('keyboard navigation should stop animation', function(assert) {
    const originalStop = fx.stop;

    try {
        const $treeView = $('#treeView').dxTreeView({
            items: [{
                id: 1, text: 'Item 1', expanded: false,
                items: [{ id: 3, text: 'Item 3' }]
            }],
            focusStateEnabled: true
        });

        const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
        const $item = $node.find('.' + internals.ITEM_CLASS).eq(0);

        $treeView.dxTreeView('instance').expandItem($item.get(0));

        fx.stop = sinon.spy();
        $item.trigger('dxpointerdown');

        const $nodeContainer = $node.find('.' + internals.NODE_CONTAINER_CLASS).eq(0);

        keyboardMock($treeView).keyDown('right');
        assert.ok(fx.stop.calledWith($nodeContainer.get(0)), 'animation stopped');
    } finally {
        fx.stop = originalStop;
    }
});
