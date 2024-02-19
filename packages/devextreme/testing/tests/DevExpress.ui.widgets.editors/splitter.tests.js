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

        this.getResizeHandles = () => {
            return this.$element.find(`.${RESIZE_HANDLE}`);
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('Splitter should be initialized with Splitter type', function(assert) {
        assert.ok(this.instance instanceof Splitter);
    });

    QUnit.test('items count should be the same as datasource items count', function(assert) {
        this.reinit({ dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }, { text: 'pane 3' }] });

        const items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);

        assert.strictEqual(items.length, 3);
    });

    QUnit.test('items should be able to be initialized with template', function(assert) {
        this.reinit({ dataSource: [{
            template: () => $('<div>').text('Pane 1') }, {
            template: () => $('<div>').text('Pane 2') }, {
            template: () => $('<div>').text('Pane 3') }]
        });

        const items = this.$element.find(`.${SPLITTER_ITEM_CLASS}`);

        assert.strictEqual(items.length, 3);
    });

    QUnit.test('Splitter with three items should have two resize handles', function(assert) {
        this.reinit({ dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }, { text: 'pane 3' }] });

        assert.strictEqual(this.getResizeHandles().length, 2);
    });

    QUnit.test('Splitter with one item should have no handles', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });

        assert.strictEqual(this.getResizeHandles().length, 0);
    });

    QUnit.test('Splitter with no items should have no handles', function(assert) {
        this.reinit({ dataSource: [] });

        assert.strictEqual(this.getResizeHandles().length, 0);
    });
});


QUnit.module('Events', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should be called when handle dragged`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                [eventHandler]: handlerStub,
                dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
            });

            const pointer = pointerMock(this.getResizeHandles().eq(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            this.instance.option(eventHandler, handlerStubAfterUpdate);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
    });
});

QUnit.module('Nested Splitter Events', moduleConfig, () => {
    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} should be called when handle in nested splitter is dragged`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles()[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 1);
        });

        QUnit.test(`nestedSplitter.${eventHandler} should be called instead of parentSplitter.${eventHandler}`, function(assert) {
            const resizeHandlerStub = sinon.stub();
            const nestedSplitterResizeHandlerStub = sinon.stub();
            this.reinit({
                [eventHandler]: resizeHandlerStub,
                items: [{
                    splitter: {
                        [eventHandler]: nestedSplitterResizeHandlerStub,
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            const pointer = pointerMock(this.getResizeHandles()[0]);

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(resizeHandlerStub.callCount, 0);
            assert.strictEqual(nestedSplitterResizeHandlerStub.callCount, 1);
        });

        QUnit.test(`nestedSplitter.${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            const handlerStub = sinon.stub();
            const handlerStubAfterUpdate = sinon.stub();

            this.reinit({
                items: [{
                    splitter: {
                        [eventHandler]: handlerStub,
                        dataSource: [{ text: 'pane 1' }, { text: 'pane 2' }]
                    }
                }]
            });

            let pointer = pointerMock(this.getResizeHandles().get(0));

            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 1);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 0);
            handlerStub.reset();

            this.instance.option(`items[0].splitter.${eventHandler}`, handlerStubAfterUpdate);

            pointer = pointerMock(this.getResizeHandles()[0]);
            pointer.start().dragStart().drag(0, 50).dragEnd();

            assert.strictEqual(handlerStub.callCount, 0);
            assert.strictEqual(handlerStubAfterUpdate.callCount, 1);
        });
    });

    QUnit.test('itemRendered should be called when nested splitter panes are rendered', function(assert) {
        const itemRenderedSpy = sinon.spy();

        this.reinit({
            onItemRendered: itemRenderedSpy,
            items: [{
                text: 'Pane_1',
            }, {
                splitter: {
                    items: [{ text: 'NestedPane_1' }, { text: 'NestedPane_2' }]
                }
            }]
        });

        assert.strictEqual(itemRenderedSpy.callCount, 4, 'itemRendered.callCount');
    });

    QUnit.test('nested splitter itemRendered should be called instead of parent.itemRendered', function(assert) {
        const itemRenderedSpy = sinon.spy();
        const nestedItemRenderedSpy = sinon.spy();

        this.reinit({
            onItemRendered: itemRenderedSpy,
            items: [{
                text: 'Pane_1',
            }, {
                splitter: {
                    onItemRendered: nestedItemRenderedSpy,
                    items: [{ text: 'NestedPane_1' }, { text: 'NestedPane_2' }]
                }
            }]
        });

        assert.strictEqual(itemRenderedSpy.callCount, 2, 'itemRendered.callCount');
        assert.strictEqual(nestedItemRenderedSpy.callCount, 2, 'itemRendered.callCount');
    });
});
