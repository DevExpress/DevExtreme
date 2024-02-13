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
    QUnit.test('ResizeHandle should be initialized with correct type', function(assert) {
        assert.ok(this.instance instanceof ResizeHandle);
    });

    QUnit.test('ResizeHandle  should be initialized with horizontal direction by default', function(assert) {
        assert.strictEqual(this.instance.option('direction'), 'horizontal');
    });

    QUnit.test('every resizeHandle should be initialized with unique name', function(assert) {
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
    QUnit.test('resize event handlers should be correctly added with "on" function', function(assert) {
        const onResizeStartStub = sinon.stub();
        const onResizeStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.instance.on('resize', onResizeStub);
        this.instance.on('resizeStart', onResizeStartStub);
        this.instance.on('resizeEnd', onResizeEndStub);

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(0, 50).drag(0, 50).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeStub.calledTwice);
        assert.ok(onResizeEndStub.calledOnce);
    });

    QUnit.test('resize event handlers should be able to update at runtime', function(assert) {
        const onResizeStartStub = sinon.stub();
        const onResizeStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.reinit({
            onResizeStart: onResizeStartStub,
            onResize: onResizeStub,
            onResizeEnd: onResizeEndStub
        });

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(0, 50).drag(0, 50).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);
        assert.ok(onResizeStub.calledTwice);
        assert.ok(onResizeEndStub.calledOnce);

        const newOnResizeStartStub = sinon.stub();
        const newOnResizeStub = sinon.stub();
        const newOnResizeEndStub = sinon.stub();

        this.instance.option('onResizeStart', newOnResizeStartStub);
        this.instance.option('onResize', newOnResizeStub);
        this.instance.option('onResizeEnd', newOnResizeEndStub);

        pointer.start().dragStart().drag(0, 50).dragEnd();

        assert.ok(newOnResizeStartStub.calledOnce);
        assert.ok(newOnResizeStub.calledOnce);
        assert.ok(newOnResizeEndStub.calledOnce);
    });

    QUnit.test('event handlers should recieve correct arguments', function(assert) {
        const checkArgs = (e) => {
            assert.ok(e.event);
            assert.ok(e.component);
            assert.ok(e.element);
        };

        this.reinit({
            onResizeStart: function(e) {
                checkArgs(e);
            },
            onResize: function(e) {
                checkArgs(e);
            },
            onResizeEnd: function(e) {
                checkArgs(e);
            },
        });

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(0, 10).dragEnd();
    });

    QUnit.test('events should be called once after direction option changed', function(assert) {
        const onResizeStartStub = sinon.stub();

        this.reinit({ onResize: onResizeStartStub });

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(10, 10).dragEnd();

        assert.ok(onResizeStartStub.calledOnce);

        this.instance.option('direction', 'vertical');

        pointer.start().dragStart().drag(10, 10).dragEnd();

        assert.ok(onResizeStartStub.calledTwice);
    });
});
