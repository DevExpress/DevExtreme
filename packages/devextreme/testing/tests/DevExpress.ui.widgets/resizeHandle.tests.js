import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import pointerMock from '../../helpers/pointerMock.js';
import ResizeHandle from '__internal/ui/splitter/resize_handle';
import { name as DOUBLE_CLICK_EVENT } from 'common/core/events/double_click';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="resizeHandle"></div>';

    $('#qunit-fixture').html(markup);
});

const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.instance = new ResizeHandle($('#resizeHandle'), options);
            this.$element = $(this.instance.$element());
        };

        init();

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        this.getCollapsePrevButton = () => {
            return $(this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`));
        };

        this.getCollapseNextButton = () => {
            return $(this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`));
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('should be initialized with ResizeHandle type', function(assert) {
        assert.ok(this.instance instanceof ResizeHandle);
    });

    QUnit.test('resizeHandle events should be created with unique names after initialization', function(assert) {
        const firstInstanceResizeStartEventName = this.instance.RESIZE_START_EVENT_NAME;
        const firstInstanceResizeEventName = this.instance.RESIZE_EVENT_NAME;
        const firstInstanceResizeEndEventName = this.instance.RESIZE_END_EVENT_NAME;

        this.reinit();

        const secondInstanceResizeStartEventName = this.instance.RESIZE_START_EVENT_NAME;
        const secondInstanceResizeEventName = this.instance.RESIZE_EVENT_NAME;
        const secondInstanceResizeEndEventName = this.instance.RESIZE_END_EVENT_NAME;

        assert.notStrictEqual(firstInstanceResizeStartEventName, secondInstanceResizeStartEventName);
        assert.notStrictEqual(firstInstanceResizeEventName, secondInstanceResizeEventName);
        assert.notStrictEqual(firstInstanceResizeEndEventName, secondInstanceResizeEndEventName);
    });
});

QUnit.module('Behavior', moduleConfig, () => {
    [
        { handler: 'onCollapsePrev', eventName: 'collapsePrev', button: 'prev', },
        { handler: 'onCollapseNext', eventName: 'collapseNext', button: 'next', },
    ].forEach(({ handler, eventName, button }) => {
        QUnit.test(`${handler} handler should be fired on collapse ${button} button click`, function(assert) {
            assert.expect(1);

            this.reinit({
                [handler]: () => {
                    assert.ok(true, `${handler} handler fired`);
                }
            });

            const $collapseButton = button === 'prev' ? this.getCollapsePrevButton() : this.getCollapseNextButton();

            $collapseButton.trigger('dxclick');
        });

        QUnit.test(`${handler} handler should be correctly updated on runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({ [handler]: handlerStub });

            const $collapseButton = button === 'prev' ? this.getCollapsePrevButton() : this.getCollapseNextButton();

            this.instance.option(handler, handlerStubAfterUpdate);

            $collapseButton.trigger('dxclick');

            assert.strictEqual(handlerStub.callCount, 0);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });

        QUnit.test(`${eventName} event handler should be correctly added with "on" function`, function(assert) {
            const eventHandlerStub = sinon.stub();
            this.instance.on(eventName, eventHandlerStub);

            const $collapseButton = button === 'prev' ? this.getCollapsePrevButton() : this.getCollapseNextButton();

            $collapseButton.trigger('dxclick');

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventName} event handler should recieve correct arguments`, function(assert) {
            assert.expect(5);

            const checkArgs = (e) => {
                assert.strictEqual(e.component, this.instance, 'e.component');
                assert.strictEqual(isRenderer(e.element), !!config().useJQuery, 'element is correct');
                assert.strictEqual($(e.element).get(0), this.$element.get(0), 'element field is correct');
                assert.strictEqual(e.event.type, 'dxclick', 'e.event.type is correct');
                assert.strictEqual($(e.event.target).get(0), $collapseButton.get(0), 'e.event.target is correct');
            };

            this.reinit({
                [handler]: function(e) {
                    checkArgs(e);
                },
            });

            const $collapseButton = button === 'prev' ? this.getCollapsePrevButton() : this.getCollapseNextButton();

            $collapseButton.trigger('dxclick');
        });
    });

    ['prev', 'next', 'both', 'none'].forEach((scenario) => {
        QUnit.test(`double click handler (${scenario} button visible)`, function(assert) {
            const onCollapsePrevStub = sinon.stub();
            const onCollapseNextStub = sinon.stub();
            const onCollapsePrevCallCount = scenario === 'prev' || scenario === 'both' ? 1 : 0;
            const onCollapseNextCallCount = scenario === 'next' ? 1 : 0;

            this.reinit({
                onCollapsePrev: onCollapsePrevStub,
                onCollapseNext: onCollapseNextStub,
                showCollapsePrev: scenario === 'prev' || scenario === 'both',
                showCollapseNext: scenario === 'next' || scenario === 'both',
            });

            this.$element.trigger(DOUBLE_CLICK_EVENT);

            assert.strictEqual(onCollapsePrevStub.callCount, onCollapsePrevCallCount, `onCollapsePrev called ${onCollapsePrevCallCount} times`);
            assert.strictEqual(onCollapseNextStub.callCount, onCollapseNextCallCount, `onCollapseNext called ${onCollapseNextCallCount} times`);
        });
    });

    QUnit.test('Double click should not trigger onCollapsePrev/onCollapseNext (runtime collapse buttons disabling)', function(assert) {
        const onCollapsePrevStub = sinon.stub();
        const onCollapseNextStub = sinon.stub();

        this.reinit({
            onCollapsePrev: onCollapsePrevStub,
            onCollapseNext: onCollapseNextStub,
            showCollapsePrev: true,
            showCollapseNext: true,
        });

        this.instance.option({ showCollapsePrev: false, showCollapseNext: false });

        this.$element.trigger(DOUBLE_CLICK_EVENT);

        assert.strictEqual(onCollapsePrevStub.callCount, 0, 'onCollapsePrev not called');
        assert.strictEqual(onCollapseNextStub.callCount, 0, 'onCollapseNext not called');
    });

    QUnit.test('Double click should trigger onCollapsePrev (runtime collapse prev button enabling)', function(assert) {
        const onCollapsePrevStub = sinon.stub();

        this.reinit({
            onCollapsePrev: onCollapsePrevStub,
            showCollapsePrev: false,
            showCollapseNext: false,
        });

        this.instance.option('showCollapsePrev', true);

        this.$element.trigger(DOUBLE_CLICK_EVENT);

        assert.strictEqual(onCollapsePrevStub.callCount, 1);
    });

    QUnit.test('Double click should trigger onCollapseNext (runtime collapse next button enabling)', function(assert) {
        const onCollapseNextStub = sinon.stub();

        this.reinit({
            onCollapseNext: onCollapseNextStub,
            showCollapsePrev: false,
            showCollapseNext: false,
        });

        this.instance.option('showCollapseNext', true);

        this.$element.trigger(DOUBLE_CLICK_EVENT);

        assert.strictEqual(onCollapseNextStub.callCount, 1);
    });
});

QUnit.module('Cursor', moduleConfig, () => {
    [
        { direction: 'horizontal', expectedCursor: 'col-resize' },
        { direction: 'vertical', expectedCursor: 'row-resize' }
    ].forEach(({ direction, expectedCursor }) => {
        QUnit.test(`resize handle should have "cursor: ${expectedCursor}" with ${direction} orientation`, function(assert) {
            this.reinit({ direction });

            assert.strictEqual(this.$element.css('cursor'), expectedCursor);
        });
    });

    QUnit.test('resize handle should have "cursor: auto" when resizable is disabled', function(assert) {
        this.reinit({ resizable: false });

        assert.strictEqual(this.$element.css('cursor'), 'auto');
    });

    QUnit.test('collapse buttons should have "cursor: pointer"', function(assert) {
        const $collapsePrevButton = this.getCollapsePrevButton();
        const $collapseNextButton = this.getCollapseNextButton();

        assert.strictEqual($collapsePrevButton.css('cursor'), 'pointer');
        assert.strictEqual($collapseNextButton.css('cursor'), 'pointer');
    });
});

QUnit.module('Events', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be fired`, function(assert) {
            const eventHandlerStub = sinon.stub();
            this.reinit({ [eventHandler]: eventHandlerStub });

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const eventHandlerStub = sinon.stub();
            this.instance.option(eventHandler, eventHandlerStub);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime if the handler was declared during initialization`, function(assert) {
            const eventHandlerStub = sinon.stub();
            const newEventHandlerStub = sinon.stub();

            this.reinit({ [eventHandler]: eventHandlerStub });

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            eventHandlerStub.reset();
            this.instance.option(eventHandler, newEventHandlerStub);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 0);
            assert.strictEqual(newEventHandlerStub.callCount, 1);
        });

        ['vertical', 'horizontal'].forEach((direction) => {
            QUnit.test(`${eventHandler} should be initialized with extra data settings`, function(assert) {
                const eventHandlerStub = sinon.stub();
                this.reinit({ direction, [eventHandler]: eventHandlerStub });

                pointerMock(this.$element).start().dragStart().drag(50, 50).dragEnd();

                assert.strictEqual(eventHandlerStub.callCount, 1);
                assert.deepEqual(eventHandlerStub.args[0][0].event.data, { direction, immediate: true });
            });

            QUnit.test(`${eventHandler} should be resubscribed after changing the direction option at runtime`, function(assert) {
                const eventHandlerStub = sinon.stub();
                this.reinit({ direction, [eventHandler]: eventHandlerStub });

                const oppositeDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
                this.instance.option('direction', oppositeDirection);

                pointerMock(this.$element).start().dragStart().drag(50, 50).dragEnd();

                assert.strictEqual(eventHandlerStub.callCount, 1);
                assert.deepEqual(eventHandlerStub.args[0][0].event.data, { direction: oppositeDirection, immediate: true }, `${eventHandler} event data`);
            });
        });

        QUnit.test(`${eventHandler} should not be called when resizable=false on init`, function(assert) {
            const eventHandlerStub = sinon.stub();

            this.reinit({ [eventHandler]: eventHandlerStub, resizable: false });

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 0);
        });

        QUnit.test(`${eventHandler} should not be called when resizable=false on runtime`, function(assert) {
            const eventHandlerStub = sinon.stub();

            this.reinit({ [eventHandler]: eventHandlerStub, resizable: true });
            this.instance.option('resizable', false);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 0);
        });

        QUnit.test(`${eventHandler} should be called when resizable=true on init`, function(assert) {
            const eventHandlerStub = sinon.stub();

            this.reinit({ [eventHandler]: eventHandlerStub, resizable: false });
            this.instance.option('resizable', true);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });
    });

    ['resizeStart', 'resize', 'resizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be correctly added with "on" function`, function(assert) {
            const eventHandlerStub = sinon.stub();
            this.instance.on(eventHandler, eventHandlerStub);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 1);
        });
    });

    [['onResizeStart', 'dxdragstart'], ['onResize', 'dxdrag'], ['onResizeEnd', 'dxdragend']].forEach(eventData => {
        QUnit.test(`${eventData[0]} event handler should recieve correct arguments`, function(assert) {
            assert.expect(5);

            const eventHandlerName = eventData[0];
            const eventName = eventData[1];

            const checkArgs = (e, expectedEventName) => {
                assert.strictEqual(e.component, this.instance, 'e.component');
                assert.strictEqual(isRenderer(e.element), !!config().useJQuery, 'element is correct');
                assert.strictEqual($(e.element).get(0), this.$element.get(0), 'element field is correct');
                assert.strictEqual(e.event.type, expectedEventName, 'e.event.type is correct');
                assert.strictEqual($(e.event.target).get(0), this.$element.get(0), 'e.event.target is correct');
            };

            this.reinit({
                [eventHandlerName]: function(e) {
                    checkArgs(e, eventName);
                },
            });

            const pointer = pointerMock(this.$element);

            pointer.start().dragStart().drag(0, 10).dragEnd();
        });
    });
});

QUnit.module('keyboard navigation', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        [
            { keyDownEventData: { key: 'ArrowLeft', ctrlKey: false }, direction: 'horizontal', expectedOffset: { x: -5 }, },
            { keyDownEventData: { key: 'ArrowRight', ctrlKey: false }, direction: 'horizontal', expectedOffset: { x: 5 }, },
            { keyDownEventData: { key: 'ArrowDown', ctrlKey: false }, direction: 'vertical', expectedOffset: { y: 5 }, },
            { keyDownEventData: { key: 'ArrowUp', ctrlKey: false }, direction: 'vertical', expectedOffset: { y: -5 } },
        ].forEach(({ direction, keyDownEventData, expectedOffset }) => {
            QUnit.test(`default behavior of ${keyDownEventData.key} arrow key should be prevented`, function(assert) {
                const eventHandlerStub = sinon.stub();

                this.reinit({
                    direction,
                    focusStateEnabled: true,
                    [eventHandler]: eventHandlerStub,
                });

                $(this.$element).trigger($.Event('keydown', keyDownEventData));

                assert.strictEqual(eventHandlerStub.callCount, 1, `${eventHandler} was fired when the ${keyDownEventData.key} key was pressed`);

                const event = eventHandlerStub.args[0][0].event;
                assert.strictEqual(event.isDefaultPrevented(), true, 'event is default prevented');
                assert.strictEqual(event.isPropagationStopped(), true, 'propagation was stopped');
            });

            QUnit.test(`${eventHandler} should be fired after pressing the ${keyDownEventData.key} key, provided the command keys is not pressed`, function(assert) {
                const eventHandlerStub = sinon.stub();

                this.reinit({
                    direction,
                    focusStateEnabled: true,
                    [eventHandler]: eventHandlerStub,
                });

                $(this.$element).trigger($.Event('keydown', keyDownEventData));
                assert.strictEqual(eventHandlerStub.callCount, 1, `${eventHandler} was fired when the ${keyDownEventData.key} key was pressed`);

                const event = eventHandlerStub.args[0][0].event;

                assert.deepEqual(event.offset, expectedOffset, 'delta was passed correctly');
            });
        });
    });

    [
        { eventHandler: 'onCollapsePrev', direction: 'horizontal', keyDownEventData: { key: 'ArrowLeft', ctrlKey: true } },
        { eventHandler: 'onCollapseNext', direction: 'horizontal', keyDownEventData: { key: 'ArrowRight', ctrlKey: true } },
        { eventHandler: 'onCollapseNext', direction: 'vertical', keyDownEventData: { key: 'ArrowDown', ctrlKey: true } },
        { eventHandler: 'onCollapsePrev', direction: 'vertical', keyDownEventData: { key: 'ArrowUp', ctrlKey: true } },
        { eventHandler: 'onCollapsePrev', direction: 'horizontal', keyDownEventData: { key: 'ArrowLeft', metaKey: true }, },
        { eventHandler: 'onCollapseNext', direction: 'horizontal', keyDownEventData: { key: 'ArrowRight', metaKey: true }, },
        { eventHandler: 'onCollapseNext', direction: 'vertical', keyDownEventData: { key: 'ArrowDown', metaKey: true }, },
        { eventHandler: 'onCollapsePrev', direction: 'vertical', keyDownEventData: { key: 'ArrowUp', metaKey: true }, },
    ].forEach(({ direction, eventHandler, keyDownEventData }) => {
        QUnit.test(`default behavior of ${keyDownEventData.key} arrow key should be prevented`, function(assert) {
            const eventHandlerStub = sinon.stub();

            this.reinit({
                direction,
                focusStateEnabled: true,
                [eventHandler]: eventHandlerStub,
            });

            $(this.$element).trigger($.Event('keydown', keyDownEventData));

            assert.strictEqual(eventHandlerStub.callCount, 1, `${eventHandler} was fired when the ${keyDownEventData.key} key was pressed`);

            const event = eventHandlerStub.args[0][0].event;
            assert.strictEqual(event.isDefaultPrevented(), true, 'event is default prevented');
            assert.strictEqual(event.isPropagationStopped(), true, 'propagation was stopped');
        });

        QUnit.test(`${eventHandler} should be fired after pressing the ${keyDownEventData.key} key, provided the command keys is not pressed`, function(assert) {
            const eventHandlerStub = sinon.stub();

            this.reinit({
                direction,
                focusStateEnabled: true,
                [eventHandler]: eventHandlerStub,
            });

            $(this.$element).trigger($.Event('keydown', keyDownEventData));

            assert.strictEqual(eventHandlerStub.callCount, 1, `${eventHandler} was fired when the ${keyDownEventData.key} key was pressed`);
        });
    });
});
