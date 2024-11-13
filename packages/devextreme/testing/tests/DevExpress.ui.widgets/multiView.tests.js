import fx from 'common/core/animation/fx';
import translator from 'common/core/animation/translator';
import 'generic_light.css!';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import { isRenderer } from 'core/utils/type';
import Swipeable from 'common/core/events/gesture/swipeable';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import $ from 'jquery';
import 'ui/multi_view';
import { animation } from '__internal/ui/multi_view/m_multi_view.animation';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';

QUnit.testStart(() => {
    const markup =
        `<style nonce="qunit-test">
            #animated {
                position: absolute;
            }
            #multiView {
                width: 800px;
                height: 1000px;
            }
            #customMultiViewTemplate1 {
                height: 50px;
            }
            #customMultiViewTemplate2 {
                height: 100px;
            }
        </style>
        <div id="animated"></div>
        <div id="container">
            <div id="multiView"></div>
        </div>
        <div id="container2">
            <div id="customMultiView">
                <div id="customMultiViewTemplate1" data-options="dxTemplate: { name: 'template1' }"></div>
                <div id="customMultiViewTemplate2" data-options="dxTemplate: { name: 'template2' }"></div>
            </div>
        </div>
        <div id="container3">
            <div id="customMultiViewWithTemplate">
            </div>
            <div id="template1"><p>Test1</p></div>
            <div id="template2"><p>Test2</p></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

const MULTIVIEW_CLASS = 'dx-multiview';
const MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';

const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
const MULTIVIEW_ITEM_CONTENT_CLASS = 'dx-multiview-item-content';
const MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';

const toSelector = cssClass => `.${cssClass}`;
const position = $element => translator.locate($element).left;

const mockFxAnimate = (animations, type, output, startAction) => {
    animations[type] = ($element, position, duration, endAction) => {
        position = position || 0;

        output.push({
            $element: $element,
            type: type,
            start: translator.locate($element).left,
            duration: duration,
            end: position
        });

        if(startAction) {
            startAction();
        }

        translator.move($element, { left: position });

        if(endAction) {
            endAction();
        }
    };
};

const animationCapturing = {
    start(animationStartAction) {
        this._capturedAnimations = [];

        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, 'moveTo', this._capturedAnimations, animationStartAction);

        return this._capturedAnimations;
    },
    teardown() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};

QUnit.module('rendering', () => {
    QUnit.test('height should be correctly updated on dxshown event', function(assert) {
        let $container;

        try {
            $container = $('<div>');

            const $multiView = $('#customMultiView').appendTo($container).dxMultiView({
                items: [{ template: 'template1' }, { template: 'template2' }],
                selectedIndex: 0,
                height: 'auto'
            });

            $container.appendTo('#qunit-fixture');
            triggerShownEvent($container);

            const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));
            assert.equal($items.eq(0).outerHeight(), $multiView.outerHeight(), 'element has correct height');
        } finally {
            $container.remove();
        }
    });

    QUnit.test('item should be visible if no item.visible property is specified', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1' }
            ]
        });
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        assert.notOk($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'first item is visible');
    });

    QUnit.test('items with visible=false should be hidden', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: false }
            ]
        });
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        assert.notOk($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'first item is visible');
        assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'second item is hidden');
    });

    QUnit.test('multiView should trigger resize event for item content after item visibility changed', function(assert) {
        const resizeHandler = sinon.spy();

        $('#customMultiView').dxMultiView({
            items: [{
                template: function() {
                    return $('<div>', { class: 'dx-visibility-change-handler' }).on('dxresize', resizeHandler);
                }
            }, { template: 'template2' }],
            selectedIndex: 0,
            height: 'auto'
        });

        assert.ok(resizeHandler.called, 'event has been triggered');
    });

    QUnit.test('item content should be rendered correctly when template was changed (T585645)', function(assert) {
        const $multiView = $('#customMultiViewWithTemplate').dxMultiView({
            items: [{ template: $('#template1') }, { template: $('#template1') }],
            selectedIndex: 0
        });
        const multiView = $multiView.dxMultiView('instance');

        multiView.option('items[1].template', $('#template2'));
        multiView.option('selectedIndex', 1);

        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        assert.equal($items.eq(1).text(), 'Test2', 'element has correct content');
    });

    QUnit.test('item should stay hidden after changing template (T613732)', function(assert) {
        const $multiView = $('#customMultiViewWithTemplate').dxMultiView({
            items: [{ template: $('#template1') }, { template: $('#template1') }],
            selectedIndex: 0
        });
        const multiView = $multiView.dxMultiView('instance');

        multiView.option('items[1].template', $('#template2'));

        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        assert.notOk($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'first item is visible');
        assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'second item is still hidden');
    });
});

QUnit.module('nested multiview', () => {
    QUnit.test('inner multiview items should not be overlapped by nested multiview items', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4],
            itemTemplate: function() {
                return $('<div>').dxMultiView({
                    items: [1, 2]
                });
            }
        });
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

        $multiView.dxMultiView('option', 'selectedIndex', 3);

        const $items = $itemContainer.children(toSelector(MULTIVIEW_ITEM_CLASS));
        assert.ok(!$items.eq(3).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'correct item selected');
    });

    QUnit.test('pointerdown should not affect to parent multiview (T306118)', function(assert) {
        if(devices.real() !== 'generic') {
            assert.ok(true, 'skip test on mobile phones');
            return;
        }

        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            itemTemplate: function() {
                return $('<div>').dxMultiView({ items: [3, 4] });
            }
        });
        const outerMultiView = $multiView.dxMultiView('instance');
        const $outerItemElements = $multiView.dxMultiView('itemElements');
        const $outerFirstItem = $outerItemElements.eq(0);
        const $innerMultiView = $outerFirstItem.find('.' + MULTIVIEW_CLASS);
        const $innerSecondItem = $innerMultiView.dxMultiView('itemElements').get(1);

        $($outerItemElements.eq(0)).trigger($.Event('dxpointerdown', { target: $innerSecondItem }));

        assert.equal($(outerMultiView.option('focusedElement')).get(0), $outerItemElements.get(0), 'focusedElement was not changed if event\'s target is not part of the widget');
    });
});

QUnit.module('items positioning', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('selected item should have correct position', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        });
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        assert.equal(position($items.eq(0)), 0, 'first item has correct position');

        $multiView.dxMultiView('option', 'selectedIndex', 2);
        assert.equal(position($items.eq(2)), 0, 'third item has correct position');
    });

    QUnit.test('only selected item should be visible', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        });
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok($items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));

        $multiView.dxMultiView('instance').option('selectedIndex', 1);

        assert.ok($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok(!$items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok($items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));

        $multiView.dxMultiView('instance').option('selectedIndex', 2);

        assert.ok($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok(!$items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    });
});

QUnit.module('animations', {
    beforeEach: function() {
        fx.off = true;

        this.$animated = $('#animated');
    },
    afterEach: function() {
        fx.off = false;

        translator.move(this.$animated, { left: 0 });
    }
}, () => {
    QUnit.test('moveTo', function(assert) {
        translator.move(this.$animated, { left: 100 });

        animation.moveTo(this.$animated, 50);
        assert.strictEqual(position(this.$animated), 50, 'animated to correct position');
    });

    QUnit.test('complete', function(assert) {
        assert.expect(2);

        const origFxStop = fx.stop;

        fx.stop = $.proxy(function(element, complete) {
            assert.equal(element[0], this.$animated[0], 'element correct');
            assert.equal(complete, true, 'animation completed');
        }, this);

        try {
            animation.complete(this.$animated);
        } finally {
            fx.stop = origFxStop;
        }
    });
});

QUnit.module('selected index change animation', {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        this.capturedAnimations = animationCapturing.start(this._animationStartAction);
    },
    afterEach: function() {
        animationCapturing.teardown();

        delete this._animationStartAction;
    }
}, () => {
    QUnit.test('index increment should cause correct animation', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

        multiView.option('selectedIndex', 1);

        assert.equal(this.capturedAnimations[0].$element[0], $itemContainer[0], 'item container animated');
        assert.equal(this.capturedAnimations[0].start, 0, 'correct start position');
        assert.equal(this.capturedAnimations[0].end, -800, 'correct end position');

        assert.equal(position($itemContainer), 0, 'item container moved back');
    });

    QUnit.test('index reduction should cause correct animation', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

        multiView.option('selectedIndex', 1);

        assert.equal(this.capturedAnimations[0].$element[0], $itemContainer[0], 'item container animated');
        assert.equal(this.capturedAnimations[0].start, 0, 'correct start position');
        assert.equal(this.capturedAnimations[0].end, 800, 'correct end position');

        assert.equal(position($itemContainer), 0, 'item container moved back');
    });

    QUnit.test('index change from first to last should prepare items', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        this.animationStartAction = function() {
            assert.equal(position($items.eq(0)), 0, 'first item has correct position');
            assert.equal(position($items.eq(2)), 800, 'third item has correct position');
            assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
            assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
            assert.ok(!$items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        };

        multiView.option('selectedIndex', 2);
    });

    QUnit.test('index change from last to first should prepare items', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

        this.animationStartAction = function() {
            assert.equal(position($items.eq(0)), -800, 'first item has correct position');
            assert.equal(position($items.eq(2)), 0, 'third item has correct position');
            assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
            assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
            assert.ok(!$items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        };

        multiView.option('selectedIndex', 0);
    });

    QUnit.test('item container should be animated with zero duration if option animationEnabled is false', function(assert) {
        $('#multiView').dxMultiView({
            items: [1, 2, 3],
            animationEnabled: false
        });

        const multiView = $('#multiView').dxMultiView('instance');

        multiView.option('selectedIndex', 1);

        assert.equal(this.capturedAnimations[0].duration, 0, 'animation duration is 0');
    });
});

QUnit.module('interaction via click', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('selected index should not be changed by click on item', function(assert) {
        $('#multiView').dxMultiView({
            items: [1, 2, 3],
            animationEnabled: false,
            selectedIndex: 0
        });

        const multiView = $('#multiView').dxMultiView('instance');

        $(multiView.itemElements()).eq(1).trigger('dxclick');
        assert.equal(multiView.option('selectedIndex'), 0, 'selected index not changed');
    });
});

QUnit.module('interaction via swipe', {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        this.completeElement = null;
        animation.complete = $.proxy(function(element) {
            this.completeCount++;
            this.completeElement = element;
        }, this);
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;
    }
}, () => {
    QUnit.module('onSelectionChanging', {
        beforeEach: function() {
            this.selectionChangingStub = sinon.stub();
            this.selectionChangedStub = sinon.stub();
            this.$multiView = $('#multiView').dxMultiView({
                items: [1, 2, 3],
                selectedIndex: 0,
                swipeEnabled: true,
                onSelectionChanging: this.selectionChangingStub,
                onSelectionChanged: this.selectionChangedStub
            });
            this.multiView = $('#multiView').dxMultiView('instance');
            this.pointer = pointerMock(this.$multiView);
        }
    }, () => {
        QUnit.test('should not cancel selection if e.cancel is not modified', function(assert) {
            this.pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            assert.strictEqual(this.selectionChangingStub.callCount, 1, 'onSelectionChanging should be called');
            assert.strictEqual(this.selectionChangedStub.callCount, 1, 'onSelectionChanged should be called');

            assert.strictEqual(this.multiView.option('selectedIndex'), 1, 'selected index is updated');
        });

        QUnit.test('should cancel selection if e.cancel=true', function(assert) {
            this.selectionChangingStub = sinon.spy((e) => {
                e.cancel = true;
            });
            this.multiView.option('onSelectionChanging', this.selectionChangingStub);

            this.pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            assert.strictEqual(this.selectionChangingStub.callCount, 1, 'onSelectionChanging should be called');
            assert.strictEqual(this.selectionChangedStub.callCount, 0, 'onSelectionChanged is not called');

            assert.strictEqual(this.multiView.option('selectedIndex'), 0, 'selected index is not changed');

            const $itemContainer = this.$multiView.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);
            assert.strictEqual(position($itemContainer), 0, 'container position is restored to initial');
        });
    });

    QUnit.test('there should not be infinite loop if try swiping when all items are hidden', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: false },
                { text: '2', visible: false },
                { text: '3', visible: false },
            ],
            selectedIndex: 2,
            loop: true,
            swipeEnabled: true
        });
        const instance = $multiView.dxMultiView('instance');
        const pointer = pointerMock($multiView);

        const isItemVisibleStub = sinon.stub(instance, '_isItemVisible').callsFake(() => {
            if(isItemVisibleStub.callCount === 20) {
                assert.ok(false, 'infinite loop detected');
                return true;
            }
            return false;
        });

        try {
            pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            assert.ok(true, 'no infinite loop');
        } catch(error) {
            isItemVisibleStub.restore();
        }
    });

    QUnit.test('when only one item is visible, swipe action does not move the current visible item', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: false }
            ]
        });
        const instance = $multiView.dxMultiView('instance');
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.1).swipeEnd(1);
        assert.strictEqual(position($itemContainer), 0, 'container did not move');
        assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is not changed');
    });

    QUnit.test('swiping left should select first visible item to right', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: false },
                { text: '3', visible: true }
            ]
        });
        const instance = $multiView.dxMultiView('instance');
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const $thirdItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(2);
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);
        assert.roughEqual(position($itemContainer), position($thirdItem), 1, 'container did move');
        assert.strictEqual(instance.option('selectedIndex'), 2, 'first item visible to the right is selected');
    });

    QUnit.test('swiping right should select first visible item to left', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: false },
                { text: '3', visible: true }
            ],
            selectedIndex: 2
        });

        const instance = $multiView.dxMultiView('instance');
        const $itemContainer = $multiView.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);
        const $firstItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(0);
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.9).swipeEnd(1);
        assert.roughEqual(position($itemContainer), -position($firstItem), 1, 'container did move');
        assert.strictEqual(instance.option('selectedIndex'), 0, 'first item visible to the left is selected');
    });

    QUnit.test('item container should not be moved by swipe if items count less then 2', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1]
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, undefined, 'container was not be moved');
    });

    QUnit.test('widget shouldn\'t handle dxswipe events if swipeEnabled is false', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            swipeEnabled: false
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd();
        assert.equal(multiView.option('selectedIndex'), 0, 'selected index is not changed by swipe');
    });

    QUnit.test('widget shouldn\'t handle dxswipe events if swipeEnabled set to false dynamically', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            swipeEnabled: true
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        multiView.option('swipeEnabled', false);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd();

        assert.equal(multiView.option('selectedIndex'), 0, 'selected index is not changed by swipe');
    });

    QUnit.test('item container should be moved by swipe', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3]
        });
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.1);
        assert.equal(position($itemContainer), -$itemContainer.width() / 10, 'container moved');
        pointer.swipeEnd();
    });

    QUnit.test('selected index should be changed after swipe', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.equal(multiView.option('selectedIndex'), 1, 'selected index was changed');
    });

    QUnit.test('swipe should skip disabled tabs', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, { disabled: true }, 3],
            selectedIndex: 0,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(-1);

        assert.equal(multiView.option('selectedIndex'), 2, 'selected index was changed');
    });

    QUnit.test('item container should be animated back after canceled swipe', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.2).swipeEnd();
        assert.equal(multiView.option('selectedIndex'), 2, 'selected index was not changed');
        assert.equal(this.capturedAnimations[0].end, 0, 'container moved back');
    });

    QUnit.test('item container should not be moved right if selected index is 0', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, 0, 'container was not be moved');
    });

    QUnit.test('item container should not be moved right if first item is disabled and next is selected', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [{ disabled: true }, 2, 3],
            selectedIndex: 1,
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, 0, 'container was not moved');
    });

    QUnit.test('item container should not be moved left if selected index is 0 in RTL mode', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            rtlEnabled: true,
            items: [1, 2, 3],
            selectedIndex: 0
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxLeftOffset, 0, 'container was not be moved');
    });

    QUnit.test('item container should not be moved left if first item is disabled and next is selected in RTL mode', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            rtlEnabled: true,
            items: [{ disabled: true }, 2, 3],
            selectedIndex: 1,
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxLeftOffset, 0, 'container was not moved');
    });

    QUnit.test('item container should not be moved right if selected index is last in RTL mode', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            rtlEnabled: true,
            items: [1, 2, 3],
            selectedIndex: 2
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, 0, 'container was not be moved');
    });

    QUnit.test('item container should not be moved right if last item is disabled and previous is selected in RTL mode', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            rtlEnabled: true,
            items: [1, 2, { disabled: true }],
            selectedIndex: 1,
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, 0, 'container was not moved');
    });

    QUnit.test('item container should not be moved left if selected index is last', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxLeftOffset, 0, 'container was not be moved');
    });

    QUnit.test('item container should not be moved left if last item is disabled and previous is selected', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, { disabled: true }],
            selectedIndex: 1,
        });

        const startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

        assert.strictEqual(startEvent.maxLeftOffset, 0, 'container was not moved');
    });

    QUnit.test('item container left animation should be completed correctly if selected index is last', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        });
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.2);
        assert.equal(this.completeCount, 1, 'previous animation completed');
        assert.equal(this.completeElement[0], $itemContainer[0], 'completed correct animation');
        pointer.swipeEnd();
    });

    QUnit.test('item container should not be moved if option swipeEnabled is false', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            swipeEnabled: false
        });
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.1);
        assert.equal(position($itemContainer), 0, 'container was not moved');
        pointer.swipeEnd();
    });

    QUnit.test('swipe with focusStateEnabled false (T319963)', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            swipeEnabled: true,
            focusStateEnabled: false
        });
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);

        assert.equal($multiView.find('.dx-state-focused').length, 0, 'there is no focused class on any item');
    });

    QUnit.test('selected index should be set to the second item after left swipe from the first', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4, 5],
            selectedIndex: 0,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        assert.strictEqual(multiView.option('selectedIndex'), 1, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to the fourth item after right swipe from the last', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4, 5],
            selectedIndex: 4,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.strictEqual(multiView.option('selectedIndex'), 3, 'selected index changed correctly');
    });
});

QUnit.module('loop', {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        this.capturedAnimations = animationCapturing.start(this._animationStartAction);
    },
    afterEach: function() {
        animationCapturing.teardown();

        delete this.animationStartAction;
    }
}, () => {
    QUnit.test('if first item is invisible and swiped right last item should be selected', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: false },
                { text: '2', visible: true },
                { text: '3', visible: true }
            ],
            loop: true,
            selectedIndex: 1
        });

        const instance = $multiView.dxMultiView('instance');
        const $firstItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);
        const $lastItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(2);
        const pointer = pointerMock($multiView);

        this.animationStartAction = function() {
            assert.equal(position($firstItem), 0, 'item "2" is positioned correctly as the first visible item.');
            assert.equal(position($lastItem), -800, 'item "3" is positioned correctly as the last visible item.');
        };

        pointer.start().swipeStart().swipe(0.1).swipeEnd(1);
        assert.strictEqual(instance.option('selectedIndex'), 2, 'item "3" is selected');
    });

    QUnit.test('if last item is invisible and swiped left first item should be selected', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: true },
                { text: '3', visible: false }
            ],
            loop: true,
            selectedIndex: 1
        });

        const instance = $multiView.dxMultiView('instance');
        const $firstItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(0);
        const $lastItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);
        const pointer = pointerMock($multiView);

        this.animationStartAction = function() {
            assert.equal(position($firstItem), 800, 'item "1" is positioned correctly as the first visible item.');
            assert.equal(position($lastItem), 0, 'item "2" is positioned correctly as the last visible item.');
        };

        pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);
        assert.strictEqual(instance.option('selectedIndex'), 0, 'item "1" is selected');
    });

    QUnit.test('when only one item is visible, swipe action does not move the current visible item', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: false }
            ],
            loop: true
        });
        const instance = $multiView.dxMultiView('instance');
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);
        assert.strictEqual(position($itemContainer), 0, 'container did not move');
        assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex does not change');
    });

    QUnit.test('when swiping left on the first item, show last visible item', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: true },
                { text: '3', visible: false }
            ],
            loop: true
        });
        const instance = $multiView.dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

        assert.strictEqual(instance.option('selectedIndex'), 1, 'Correct item is shown after swiping left');
    });

    QUnit.test('when swiping right on the last item, show first visible item', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: false },
                { text: '2', visible: true },
                { text: '3', visible: true }
            ],
            loop: true,
            selectedIndex: 2
        });
        const instance = $multiView.dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);

        assert.strictEqual(instance.option('selectedIndex'), 1, 'Correct item is shown after swiping right');
    });

    QUnit.test('item container should be moved right if selected index is 0', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        });
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.1);
        assert.equal(position($itemContainer), $itemContainer.width() / 10, 'container was moved');
        pointer.swipeEnd();
    });

    QUnit.test('item container should be moved left if selected index is last', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        });
        const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.1);
        assert.equal(position($itemContainer), -$itemContainer.width() / 10, 'container was  moved');
        pointer.swipeEnd();
    });

    QUnit.test('swipe should skip disabled tabs after items runtime change', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [{ text: 1 }, 2, 3],
            selectedIndex: 0,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.equal(multiView.option('selectedIndex'), 2, 'selected index was changed correct');

        multiView.option('items[0].disabled', true);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(-1);
        assert.equal(multiView.option('selectedIndex'), 1, 'selected index was changed correct');
    });

    QUnit.test('selected index should be set to last item after right swipe from first one', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.equal(multiView.option('selectedIndex'), 2, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to second item after right swipe from first one if last is disabled', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, { disabled: true, text: 3 }],
            selectedIndex: 0,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.equal(multiView.option('selectedIndex'), 1, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to the first item after right swipe from the second if the last is disabled', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, { disabled: true, text: 3 }],
            selectedIndex: 1,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.strictEqual(multiView.option('selectedIndex'), 0, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to the second item after left swipe from the first', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4, 5],
            selectedIndex: 0,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        assert.strictEqual(multiView.option('selectedIndex'), 1, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to the fourth item after right swipe from the last', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4, 5],
            selectedIndex: 4,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.strictEqual(multiView.option('selectedIndex'), 3, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to the first item after left swipe from the last, if the last is disabled', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4, { disabled: true }],
            selectedIndex: 4,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        assert.strictEqual(multiView.option('selectedIndex'), 0, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to the fifth item after right swipe from the first, if the first is disabled', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [{ disabled: true }, 2, 3, 4, 5],
            selectedIndex: 0,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        assert.strictEqual(multiView.option('selectedIndex'), 4, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to first item after left swipe from last one', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        assert.equal(multiView.option('selectedIndex'), 0, 'selected index changed correctly');
    });

    QUnit.test('selected index should be set to second item after left swipe from last one if first is disabled', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [{ disabled: true, text: 1 }, 2, 3],
            selectedIndex: 2,
            loop: true,
        });
        const multiView = $('#multiView').dxMultiView('instance');
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.5).swipeEnd(-1);
        assert.equal(multiView.option('selectedIndex'), 1, 'selected index changed correctly');
    });

    QUnit.test('selected index change from first item to last via right swipe should cause correct animation', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        });
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(0.1).swipeEnd(1);
        assert.equal(this.capturedAnimations[0].end, 800, 'animated correctly');

    });

    QUnit.test('selected index change from last item to first via left swipe should cause correct animation', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        });
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        assert.equal(this.capturedAnimations[0].end, -800, 'animated correctly');
    });

    QUnit.test('index change from first item to last should prepare items', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        });
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));
        const pointer = pointerMock($multiView);

        this.animationStartAction = function() {
            assert.equal(position($items.eq(0)), 0, 'first item has correct position');
            assert.equal(position($items.eq(2)), -800, 'third item has correct position');
        };

        pointer.start().swipeStart().swipe(0.1).swipeEnd(1);
    });

    QUnit.test('index change from last item to first should prepare items', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        });
        const $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));
        const pointer = pointerMock($multiView);

        this.animationStartAction = function() {
            assert.equal(position($items.eq(0)), 800, 'first item has correct position');
            assert.equal(position($items.eq(2)), 0, 'third item has correct position');
        };

        pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);
    });

    QUnit.test('second item should have correct position if swipe present at first one', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            loop: true
        });
        const $item1 = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS)).eq(1);
        const pointer = pointerMock($multiView);

        pointer.start().swipeStart().swipe(-0.01);
        assert.equal(position($item1), 800, 'item positioned correctly');
        pointer.swipe(0.02);
        assert.equal(position($item1), -800, 'item positioned correctly');
        pointer.swipeEnd();
    });
});

QUnit.module('defer rendering', {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        animationCapturing.start(this._animationStartAction);

        this.items = [
            { text: 'Greg' },
            { text: '31' },
            { text: 'Charlotte' },
            { text: 'programmer' }
        ];

        this.$element = $('#multiView');
    },
    afterEach: function() {
        animationCapturing.teardown();
        delete this.animationStartAction;

        this.$element.remove();
    }
}, () => {
    QUnit.test('onItemRendered should be fired after item was rendered', function(assert) {
        const renderedItems = [];
        const $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true,
            onItemRendered: function(args) {
                renderedItems.push(args.itemData);
            }
        });
        const instance = $element.dxMultiView('instance');

        assert.deepEqual(renderedItems, [this.items[0]], 'item was rendered');

        instance.option('selectedIndex', 1);
        assert.deepEqual(renderedItems, [this.items[0], this.items[1]], 'item was rendered');
    });

    QUnit.test('item content should be rendered for selected item if deferRendering is true', function(assert) {
        const $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true
        });
        const instance = $element.dxMultiView('instance');

        assert.equal($element.find('.' + MULTIVIEW_ITEM_CONTENT_CLASS).length, 1, 'only one item is rendered on init');

        instance.option('selectedIndex', 1);
        assert.equal($element.find('.' + MULTIVIEW_ITEM_CONTENT_CLASS).length, 2, 'selected item is rendered');
    });

    QUnit.test('item content should be rendered for animated item if deferRendering is true', function(assert) {
        const $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true
        });
        const instance = $element.dxMultiView('instance');

        this.animationStartAction = function() {
            assert.equal($element.find('.' + MULTIVIEW_ITEM_CLASS).eq(1).find('.' + MULTIVIEW_ITEM_CONTENT_CLASS).length, 1, 'animated item is rendered');
        };
        instance.option('selectedIndex', 1);
    });

    QUnit.test('widget should be rerendered on the deferRendering option change', function(assert) {
        let renderCount = 0;

        const $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true,
            onContentReady: function() {
                renderCount++;
            }
        });

        const instance = $element.dxMultiView('instance');

        let expectedRenderCount = 1;

        instance.option('deferRendering', false);
        expectedRenderCount++;
        assert.equal(renderCount, expectedRenderCount, 'widget was rerendered one time on option changed');

        instance.option('deferRendering', true);
        expectedRenderCount++;
        assert.equal(renderCount, expectedRenderCount, 'widget was rerendered one time on option changed');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        this.capturedAnimations = animationCapturing.start(this._animationStartAction);
    },
    afterEach: function() {
        animationCapturing.teardown();

        delete this.animationStartAction;
    }
}, () => {
    ['right', 'down'].forEach((key) => {
        QUnit.test(`selectedIndex should be correct when one item is not visible using '${key}' arrow key`, function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true }
                ],
                focusStateEnabled: true
            });
            const instance = $multiView.dxMultiView('instance');
            const $lastItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(2);

            $multiView.focusin();
            keyboardMock($multiView).keyDown(key);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'correct index is selected');
            assert.roughEqual(position($multiView), position($lastItem), 1, 'container moved to proper position');
        });
    });

    ['left', 'up'].forEach((key) => {
        QUnit.test(`selectedIndex should be correct when one item is not visible using '${key}' arrow key`, function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true }
                ],
                selectedIndex: 2,
                focusStateEnabled: true
            });
            const instance = $multiView.dxMultiView('instance');
            const $firstItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(0);

            $multiView.focusin();
            keyboardMock($multiView).keyDown(key);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'correct index is selected');
            assert.roughEqual(position($multiView), -position($firstItem), 1, 'container moved to proper position');
        });
    });

    ['left', 'right', 'up', 'down', 'home', 'end'].forEach((key) => {
        QUnit.test(`when only one item is visible, '${key}' key press doesn't moves the current visible view`, function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false }
                ],
                loop: true,
                focusStateEnabled: true
            });
            const instance = $multiView.dxMultiView('instance');
            const $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));
            const keyboard = keyboardMock($multiView);

            $multiView.focusin();
            keyboard.keyDown(key);

            assert.strictEqual(position($itemContainer), 0, 'container did not move');
            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is not changed');
        });
    });

    QUnit.test('item switching should go to first visible element when clicking home button', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: false },
                { text: '2', visible: true },
                { text: '3', visible: true }
            ],
            selectedIndex: 2,
            focusStateEnabled: true
        });
        const instance = $multiView.dxMultiView('instance');
        const $firstVisibleItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);

        $multiView.focusin();
        keyboardMock($multiView).keyDown('home');

        assert.strictEqual(instance.option('selectedIndex'), 1, 'correct index is selected');
        assert.roughEqual(position($multiView), -position($firstVisibleItem), 1, 'container moved to proper position');
    });

    QUnit.test('item switching should go to last visible element when clicking end button', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [
                { text: '1', visible: true },
                { text: '2', visible: true },
                { text: '3', visible: false }
            ],
            focusStateEnabled: true
        });
        const instance = $multiView.dxMultiView('instance');
        const $lastVisibleItem = $multiView.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);

        $multiView.focusin();
        keyboardMock($multiView).keyDown('end');

        assert.strictEqual(instance.option('selectedIndex'), 1, 'correct index is selected');
        assert.roughEqual(position($multiView), position($lastVisibleItem), 1, 'container moved to proper position');
    });

    QUnit.test('selected item should have focus after swipe', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4],
            selectedIndex: 0,
            focusStateEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const $item1 = $(multiView.itemElements()).eq(1);

        pointerMock($multiView).start().swipeStart().swipe(-0.5).swipeEnd(-1);
        assert.equal(isRenderer(multiView.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.ok($item1.hasClass('dx-state-focused'), 'item obtained focus after swipe');
        assert.equal(this.capturedAnimations[0].end, -800, 'animated correctly');
    });

    QUnit.test('items should be animated in correct direction if looping through items from first to last', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            loop: true,
            animationEnabled: true,
            focusStateEnabled: true
        });

        $multiView.focusin();
        keyboardMock($multiView).keyDown('left');
        assert.equal(this.capturedAnimations[0].end, 800, 'animated correctly');
    });

    QUnit.test('items should be animated in correct direction if looping through items from last to first', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 1,
            loop: true,
            animationEnabled: true,
            focusStateEnabled: true
        });

        $multiView.focusin();
        keyboardMock($multiView).keyDown('right');
        assert.equal(this.capturedAnimations[0].end, -800, 'animated correctly');
    });

    QUnit.test('items should be animated in correct direction after looping through items', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 1,
            loop: true,
            animationEnabled: true,
            focusStateEnabled: true
        });

        $multiView.focusin();
        keyboardMock($multiView).keyDown('right');
        keyboardMock($multiView).keyDown('right');
        assert.equal(this.capturedAnimations[1].end, -800, 'animated correctly');
    });
});

QUnit.module('aria accessibility', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    const getMultiViewItemAttributeMap = (index) => {
        return {
            'role': 'group',
            'aria-roledescription': 'View',
            'aria-label': `${index + 1} of 2`,
        };
    };

    function checkAttributes(assert, items) {
        items.forEach((item, index) => {
            const attributeMap = getMultiViewItemAttributeMap(index);

            Object.keys(attributeMap).forEach(key => {
                assert.strictEqual(item.attr(key), attributeMap[key], `${key} attribute is correct`);
            });
        });
    }
    QUnit.test('selected item should have unique id', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            focusStateEnabled: true,
            selectedIndex: 0
        });
        const instance = $multiView.dxMultiView('instance');
        const id = instance.getFocusedItemId().toString();
        const $item0 = $multiView.find('.dx-multiview-item:eq(0)');
        const $item1 = $multiView.find('.dx-multiview-item:eq(1)');

        $multiView.focusin();

        assert.equal($item0.attr('id'), id, 'selected 1st item has correct id');
        assert.equal($item1.attr('id'), undefined, 'unselected item has no id');

        instance.option('selectedIndex', 1);
        instance.option('focusedElement', $item1);

        assert.equal($item1.attr('id'), id, 'selected 2nd item has correct id');
        assert.equal($item0.attr('id'), undefined, 'unselected item has no id');
    });

    QUnit.test('inactive item should have aria-hidden attribute', function(assert) {
        const $element = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            animationEnabled: false
        });
        const $item0 = $element.find('.dx-multiview-item:eq(0)');
        const $item1 = $element.find('.dx-multiview-item:eq(1)');
        const instance = $element.dxMultiView('instance');

        assert.equal($item0.attr('aria-hidden'), undefined, 'aria-hidden does not exist for 1st item');
        assert.equal($item1.attr('aria-hidden'), 'true', 'aria-hidden is true for 2nd item');

        instance.option('selectedIndex', 1);

        assert.equal($item0.attr('aria-hidden'), 'true', 'aria-hidden is true for 1st item');
        assert.equal($item1.attr('aria-hidden'), undefined, 'aria-hidden does not exist for 2nd item');
    });

    QUnit.test('element should contain correct aria attributes', function(assert) {
        const $element = $('#multiView').dxMultiView({ items: [1, 2] });

        const attributeMap = {
            'role': 'group',
            'aria-roledescription': 'MultiView',
            'aria-label': 'Use the arrow keys or swipe to navigate between views',
        };

        Object.keys(attributeMap).forEach(key => {
            assert.strictEqual($element.attr(key), attributeMap[key], `${key} attribute is correct`);
        });
    });

    QUnit.test('items should contain correct aria attributes', function(assert) {
        const $element = $('#multiView').dxMultiView({ items: [1, 2] });
        const $firstItem = $element.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(0);
        const $secondItem = $element.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);

        checkAttributes(assert, [$firstItem, $secondItem]);
    });

    ['dataSource', 'items'].forEach(prop => {
        QUnit.test(`items should contain correct aria attributes when ${prop} was changed in runtime`, function(assert) {
            const $element = $('#multiView').dxMultiView({ [prop]: [1, 2] });
            const instance = $element.dxMultiView('instance');

            instance.option(prop, [3, 4]);

            const $firstItem = $element.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(0);
            const $secondItem = $element.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);

            checkAttributes(assert, [$firstItem, $secondItem]);
        });
    });
});

QUnit.module('swipeable disabled state', () => {
    QUnit.test('{items: [], swipeEnabled: false}', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: false} -> items: [1, 2]', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', [1, 2]);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: false} -> items: [1, 2], swipeEnabled: true', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', [1, 2]);
        multiView.option('swipeEnabled', true);

        assert.equal(swipeable.option('disabled'), false, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: false} -> swipeEnabled: true', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('swipeEnabled', true);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: true}', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: true} -> items: [1, 2]', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', [1, 2]);

        assert.equal(swipeable.option('disabled'), false, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: true} -> items: [1, 2], swipeEnabled: false', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', [1, 2]);
        multiView.option('swipeEnabled', false);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: true} -> swipeEnabled: false', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('swipeEnabled', false);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [], swipeEnabled: true} -> swipeEnabled: false, items: [1, 2]', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('swipeEnabled', false);
        multiView.option('items', [1, 2]);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1], swipeEnabled: false}', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1], swipeEnabled: true}', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: false}', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: false} -> items: [], swipeEnabled: true', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', []);
        multiView.option('swipeEnabled', true);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: false} -> swipeEnabled: true', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('swipeEnabled', true);

        assert.equal(swipeable.option('disabled'), false, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: true}', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option('disabled'), false, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: true} -> items: []', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', []);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: true} -> items: [1]', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', [1]);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: true} -> items: [1,2,3]', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('items', [1, 2, 3]);

        assert.equal(swipeable.option('disabled'), false, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), true, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: true} -> swipeEnabled: false', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('swipeEnabled', false);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });

    QUnit.test('{items: [1, 2], swipeEnabled: true} -> swipeEnabled: false, items: [1,2,3]', function(assert) {
        const $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView('instance');
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option('swipeEnabled', false);
        multiView.option('items', [1, 2, 3]);

        assert.equal(swipeable.option('disabled'), true, 'Swipeable.disabled');
        assert.equal(multiView.option('swipeEnabled'), false, 'MultiView.swipeEnabled');
    });
});

QUnit.module('selectedIndex vs item.visible', () => {
    QUnit.module('on init', () => {
        QUnit.test('selectedIndex should be updated to the next visible item if initially selected item is hidden', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 1
            });
            const instance = $multiView.dxMultiView('instance');

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('selectedIndex should be updated to the next visible item to the left if initially selected item is hidden and RTL is enabled', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 1,
                rtlEnabled: true
            });
            const instance = $multiView.dxMultiView('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('selectedIndex should be zero when all items are not visible', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: false },
                    { text: '2', visible: false },
                    { text: '3', visible: false },
                ],
                selectedIndex: 1
            });
            const instance = $multiView.dxMultiView('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('next visible item should be selected if currently selected item is hidden and loop=true', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: false }
                ],
                selectedIndex: 2,
                loop: true
            });
            const instance = $multiView.dxMultiView('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('first visible item should be selected if current selected item is hidden and it is in the end and loop = true', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: false }
                ],
                selectedIndex: 2,
                loop: true
            });
            const instance = $multiView.dxMultiView('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });
    });

    QUnit.module('on runtime', () => {
        QUnit.test('selectedIndex should be updated to the next visible item if it is changed to a hidden item', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ]
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('selectedIndex', 1);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('selectedIndex should be set to zero if all items became hidden', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option({
                items: [
                    { text: '1', visible: false },
                    { text: '2', visible: false },
                    { text: '3', visible: false },
                ]
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding selected item selectedIndex should be set to next visible item', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 1
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items[1].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding non-selected item before selectedIndex, selectedIndex should not change', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items[1].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding selected item positioned in the end, next visible item to the left is selected', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items[2].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when showing previously invisible item before selectedIndex, selectedIndex should not change', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items[1].visible', true);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when showing previously invisible item after selectedIndex, selectedIndex should not change', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 0
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items[1].visible', true);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding last visible item selectedIndex should return to 0 index', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: false },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items[2].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('after removing selected item selectedIndex should be restored to 0', function(assert) {
            const $multiView = $('#multiView').dxMultiView({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $multiView.dxMultiView('instance');
            instance.option('items', [
                { text: '1', visible: true },
                { text: '2', visible: true },
            ]);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is not changed');
        });
    });
});
