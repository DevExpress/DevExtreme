import $ from 'jquery';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import ResizeHandle from '__internal/ui/splitter/resize_handle';

QUnit.testStart(() => {
    const markup = '<div id="resizeHandle"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.instance = new ResizeHandle('#resizeHandle', options);
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

QUnit.module('Events', moduleConfig, () => {
    QUnit.test('resize event handlers should be fired', function(assert) {
        const onResizeStartStub = sinon.stub();
        const onResizeStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.reinit({
            onResizeStart: onResizeStartStub,
            onResize: onResizeStub,
            onResizeEnd: onResizeEndStub
        });

        const pointer = pointerMock(this.$element);

        pointer.start().dragStart().drag(0, 50).drag(0, 50).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeStub.calledTwice);
        assert.ok(onResizeEndStub.calledOnce);
    });

    QUnit.test('resize event handlers should be correctly added with "on" function', function(assert) {
        const onResizeStartStub = sinon.stub();
        const onResizeStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.instance.on('resize', onResizeStub);
        this.instance.on('resizeStart', onResizeStartStub);
        this.instance.on('resizeEnd', onResizeEndStub);

        const pointer = pointerMock(this.$element);

        pointer.start().dragStart().drag(0, 50).drag(0, 50).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeStub.calledTwice);
        assert.ok(onResizeEndStub.calledOnce);
    });

    QUnit.test('resize event handlers should be able to update at runtime', function(assert) {
        const pointer = pointerMock(this.$element);

        const onResizeStartStub = sinon.stub();
        const onResizeStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.instance.option('onResizeStart', onResizeStartStub);
        this.instance.option('onResize', onResizeStub);
        this.instance.option('onResizeEnd', onResizeEndStub);

        pointer.start().dragStart().drag(0, 50).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeStub.calledOnce);
        assert.ok(onResizeEndStub.calledOnce);
    });

    QUnit.test('event handlers should recieve correct arguments', function(assert) {
        const checkArgs = (e, expectedEventName) => {
            assert.strictEqual(e.component.NAME, this.instance.NAME);
            assert.strictEqual($(e.element).get(0), this.$element.get(0));
            assert.strictEqual(e.event.type, expectedEventName);
            assert.strictEqual($(e.event.target).get(0), this.$element.get(0));
        };

        this.reinit({
            onResizeStart: function(e) {
                checkArgs(e, 'dxdragstart');
            },
            onResize: function(e) {
                checkArgs(e, 'dxdrag');
            },
            onResizeEnd: function(e) {
                checkArgs(e, 'dxdragend');
            },
        });

        const pointer = pointerMock(this.$element);

        pointer.start().dragStart().drag(0, 10).dragEnd();
    });

    QUnit.test('events should be called once after direction option changed', function(assert) {
        const onResizeStub = sinon.stub();
        const onResizeStartStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.reinit({
            onResizeStart: onResizeStartStub,
            onResize: onResizeStub,
            onResizeEnd: onResizeEndStub
        });

        const pointer = pointerMock(this.$element);

        pointer.start().dragStart().drag(10, 10).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeEndStub.calledOnce);

        this.instance.option('direction', 'vertical');

        pointer.start().dragStart().drag(10, 10).dragEnd();

        assert.ok(onResizeStartStub.calledTwice);
        assert.ok(onResizeStartStub.calledTwice);
        assert.ok(onResizeEndStub.calledTwice);
    });
});
