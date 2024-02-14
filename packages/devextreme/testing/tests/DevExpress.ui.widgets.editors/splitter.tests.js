import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';

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
});

QUnit.module('Events', moduleConfig, () => {
    const checkHandlerCalled = (init, assert, pointer) => {
        const resizeHandlerStub = sinon.stub();
        init(resizeHandlerStub);
        pointer.start().dragStart().drag(0, 50).dragEnd();
        assert.strictEqual(resizeHandlerStub.callCount, 1);
    };

    ['onResizeStart', 'onResize', 'onResizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be fired`, function(assert) {
            checkHandlerCalled((resizeHandlerStub) => this.reinit({ [eventHandler]: resizeHandlerStub }), assert, pointerMock(this.$element));
        });

        QUnit.test(`${eventHandler} event handler should be able to be updated at runtime`, function(assert) {
            checkHandlerCalled((resizeHandlerStub) => this.instance.option(eventHandler, resizeHandlerStub), assert, pointerMock(this.$element));
        });

        QUnit.test(`${eventHandler} should be called once after direction option changed`, function(assert) {
            checkHandlerCalled((resizeHandlerStub) => {
                this.reinit({ [eventHandler]: resizeHandlerStub });
                this.instance.option('direction', 'vertical');
            }, assert, pointerMock(this.$element));
        });
    });

    ['resizeStart', 'resize', 'resizeEnd'].forEach(eventHandler => {
        QUnit.test(`${eventHandler} event handler should be correctly added with "on" function`, function(assert) {
            checkHandlerCalled((resizeHandlerStub) => this.instance.on(eventHandler, resizeHandlerStub), assert, pointerMock(this.$element));
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
