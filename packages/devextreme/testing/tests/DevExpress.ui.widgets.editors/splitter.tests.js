import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';

const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const RESIZE_HANDLE = 'dx-resize-handle';

QUnit.testStart(() => {
    const markup =
        '<div id="splitter"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.$element = $('#splitter').dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
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

QUnit.module('Splitter Initialization', moduleConfig, () => {
    QUnit.test('Splitter should be initialized with Splitter type', function(assert) {
        assert.ok(this.instance instanceof Splitter);
    });

    QUnit.test('Splitter items count should be the same as datasource items count', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1')
        }, {
            template: () => $('<div>').text('Pane 2')
        }, {
            template: () => $('<div>').text('Pane 3')
        }] });

        const items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);

        assert.strictEqual(items.length, 3);
    });

    QUnit.test('Splitter with three items should have two resize handles', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1')
        }, {
            template: () => $('<div>').text('Pane 2')
        }, {
            template: () => $('<div>').text('Pane 3')
        }] });

        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        assert.strictEqual(handles.length, 2);
    });

    QUnit.test('Splitter with one item should have no handles', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });
        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        assert.strictEqual(handles.length, 0);
    });

    QUnit.test('Splitter with no items should have no handles', function(assert) {
        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        assert.strictEqual(handles.length, 0);
    });
});


QUnit.module('Splitter Initialization', moduleConfig, () => {
    QUnit.test('Splitter should be initialized with Splitter type', function(assert) {
        assert.ok(this.instance instanceof Splitter);
    });

    QUnit.test('items count should be the same as datasource items count', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1')
        }, {
            template: () => $('<div>').text('Pane 2')
        }, {
            template: () => $('<div>').text('Pane 3')
        }] });

        const items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);

        assert.strictEqual(items.length, 3);
    });

    QUnit.test('Splitter with three items should have two resize handles', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1')
        }, {
            template: () => $('<div>').text('Pane 2')
        }, {
            template: () => $('<div>').text('Pane 3')
        }] });

        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        assert.strictEqual(handles.length, 2);
    });

    QUnit.test('Splitter with one item should have no handles', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });
        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        assert.strictEqual(handles.length, 0);
    });

    QUnit.test('Splitter with no items should have no handles', function(assert) {
        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        assert.strictEqual(handles.length, 0);
    });
});

// TODO: refactor
QUnit.module('Events', moduleConfig, () => {
    QUnit.test('resize events should be raised', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1')
        }, {
            template: () => $('<div>').text('Pane 2')
        }] });

        const onResizeStartStub = sinon.stub();
        const onResizeStub = sinon.stub();
        const onResizeEndStub = sinon.stub();

        this.instance.on('resize', onResizeStub);
        this.instance.on('resizeStart', onResizeStartStub);
        this.instance.on('resizeEnd', onResizeEndStub);

        const handles = this.$element.find(`.${RESIZE_HANDLE}`);

        const pointer = pointerMock(handles[0]);

        pointer.start().dragStart().drag(0, 50).dragEnd();

        assert.strictEqual(onResizeStartStub.callCount, 1);
        assert.strictEqual(onResizeStub.callCount, 1);
        assert.strictEqual(onResizeEndStub.callCount, 1);
    });
});
