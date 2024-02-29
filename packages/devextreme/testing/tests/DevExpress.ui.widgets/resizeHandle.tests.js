import $ from 'jquery';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import ResizeHandle from '__internal/ui/splitter/resize_handle';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="resizeHandle"></div>';

    $('#qunit-fixture').html(markup);
});

const RESIZE_HANDLE_COLLAPSE_PREV_BUTTON_CLASS = 'dx-resize-handle-collapse-prev-button';
const RESIZE_HANDLE_COLLAPSE_NEXT_BUTTON_CLASS = 'dx-resize-handle-collapse-next-button';

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

    QUnit.test('collapse buttons should have "cursor: pointer"', function(assert) {
        const $collapsePrevButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_BUTTON_CLASS}`);
        const $collapseNextButton = this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_BUTTON_CLASS}`);

        assert.strictEqual($collapsePrevButton.css('cursor'), 'pointer');
        assert.strictEqual($collapseNextButton.css('cursor'), 'pointer');
    });
});

QUnit.module('Events', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be fired`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({ [eventHandler]: resizeHandlerStub });

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.instance.option(eventHandler, resizeHandlerStub);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} should be called once after direction option changed`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({ [eventHandler]: resizeHandlerStub });
            this.instance.option('direction', 'vertical');

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });
    });

    ['resizeStart', 'resize', 'resizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be correctly added with "on" function`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.instance.on(eventHandler, resizeHandlerStub);

            pointerMock(this.$element).start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
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
