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
});


// TODO test namespace with GUID !
// test toggle active ?
