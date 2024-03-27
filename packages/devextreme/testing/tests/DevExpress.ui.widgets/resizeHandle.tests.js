import $ from 'jquery';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import ResizeHandle from '__internal/ui/splitter/resize_handle';

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
            this.$element = this.instance.$element();
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
        { handler: 'onCollapsePrev', button: 'prev', },
        { handler: 'onCollapseNext', button: 'next', },
    ].forEach(({ handler, button }) => {
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

            $collapseButton.trigger('dxclick');

            this.instance.option(handler, handlerStubAfterUpdate);

            $collapseButton.trigger('dxclick');

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
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

        QUnit.test(`${eventHandler} should be called once after direction option changed`, function(assert) {
            const eventHandlerStub = sinon.stub();
            this.reinit({ [eventHandler]: eventHandlerStub });
            this.instance.option('direction', 'vertical');

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(eventHandlerStub.callCount, 1);
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
            const eventHandlerName = eventData[0];
            const eventName = eventData[1];

            const checkArgs = (e, expectedEventName) => {
                assert.strictEqual(e.component.NAME, this.instance.NAME);
                assert.strictEqual($(e.element).get(0), this.$element.get(0));
                assert.strictEqual(e.event.type, expectedEventName);
                assert.strictEqual($(e.event.target).get(0), this.$element.get(0));
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
