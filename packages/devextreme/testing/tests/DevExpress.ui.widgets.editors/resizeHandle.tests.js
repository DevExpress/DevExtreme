import $ from 'jquery';
import fx from 'animation/fx';
import ResizeHandle from 'ui/resize_handle';
import pointerMock from '../../helpers/pointerMock.js';

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
    QUnit.test('resize event handlers should be fired', function(assert) {
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
    });

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

    QUnit.test('onResize event handler should recieve correct arguments when orientation is vertical', function(assert) {
        this.reinit({
            direction: 'vertical',
            onResize: function(e) {

                assert.strictEqual(e.resizeInfo.offsetY, 10);
                assert.strictEqual(e.resizeInfo.offsetX, 0);
            },
        });

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(0, 10).dragEnd();
    });

    QUnit.test('onResize event handler should recieve correct arguments when orientation is horizontal', function(assert) {
        this.reinit({
            direction: 'horizontal',
            onResize: function(e) {
                assert.strictEqual(e.resizeInfo.offsetY, 0);
                assert.strictEqual(e.resizeInfo.offsetX, 10);
            },
        });

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(10, 0).dragEnd();
    });

    QUnit.test('onResize event handler should recieve correct resizeInfo when called twice', function(assert) {
        let isFirstCall = true;
        this.reinit({
            onResize: function(e) {
                if(isFirstCall) {
                    assert.strictEqual(e.resizeInfo.offsetY, 10);
                    isFirstCall = false;
                } else {
                    assert.strictEqual(e.resizeInfo.offsetY, 25);
                }
            },
        });

        const pointer = pointerMock(this.instance.$element());

        pointer.start().dragStart().drag(0, 10).drag(0, 15).dragEnd();
    });

    QUnit.test('onResize event handler should recieve correct resizeInfo when resize stopped and started over again', function(assert) {
        let isFirstCall = true;

        this.reinit({
            onResize: function(e) {
                if(isFirstCall) {
                    assert.strictEqual(e.resizeInfo.offsetY, 10);
                    isFirstCall = false;
                } else {
                    assert.strictEqual(e.resizeInfo.offsetY, 15);
                }
            },
        });

        const pointer = pointerMock(this.instance.$element());
        pointer.start().dragStart().drag(0, 10).dragEnd();
        pointer.start().dragStart().drag(0, 15).dragEnd();
    });
});


// TODO test namespace with GUID !
// test toggle active ?
