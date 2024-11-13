define(function(require) {
    const $ = require('jquery');
    const registerEvent = require('common/core/events/core/event_registrator');
    const Class = require('core/class');

    require('integration/jquery');

    if(QUnit.urlParams['nojquery']) {
        return;
    }

    QUnit.testStart(function() {
        const markup =
            '<div id="container">\
				<div id="element"></div>\
			</div>';

        $('#qunit-fixture').html(markup);
    });

    QUnit.module('event registration', {
        beforeEach: function() {
            const impl = Class.inherit({
                ctor: function() {
                    const impl = this;

                    impl.LOG = {};

                    $.each([
                        'setup',
                        'teardown',
                        'add',
                        'remove',
                        'trigger',
                        '_default',
                        'handle'
                    ], function(_, methodName) {
                        impl[methodName] = function() {
                            impl.LOG[methodName] = {
                                context: this,
                                arguments: $.makeArray(arguments)
                            };
                        };
                    });
                },

                noBubble: false,

                delegateType: false,

                bindType: false
            });

            this.testEventImplementer = new impl();

            registerEvent('dxtestevent', this.testEventImplementer);
            this.element = $('#element');
        },

        afterEach: function() {
            delete $.event.special['dxtestevent'];
        }
    });

    QUnit.test('\'noBubble\' property', function(assert) {
        assert.strictEqual($.event.special['dxtestevent'].noBubble, false);
    });

    QUnit.test('\'bindType\' property', function(assert) {
        assert.strictEqual($.event.special['dxtestevent'].bindType, false);
    });

    QUnit.test('\'delegateType\' property', function(assert) {
        assert.strictEqual($.event.special['dxtestevent'].delegateType, false);
    });

    QUnit.test('\'setup\' method', function(assert) {
        const data = {};
        const handler = function() {
        };

        this.element.on('dxtestevent.test1.test2', data, handler);

        const LOG = this.testEventImplementer.LOG.setup;
        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 4, 'arguments count');
        assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
        assert.strictEqual(LOG.arguments[1], data, 'data');
        assert.deepEqual(LOG.arguments[2], ['test1', 'test2'], 'namespaces');
        assert.ok($.isFunction(LOG.arguments[3]), 'eventHandle');
    });

    QUnit.test('\'teardown\' method', function(assert) {
        const data = {};
        const handler = function() {
        };

        this.element
            .on('dxtestevent.test1.test2', data, handler)
            .off('dxtestevent.test1.test2');

        const LOG = this.testEventImplementer.LOG.teardown;

        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 3, 'arguments count');
        assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
        assert.deepEqual(LOG.arguments[1], ['test1', 'test2'], 'namespaces');
        assert.ok($.isFunction(LOG.arguments[2]), 'eventHandle');
    });

    QUnit.test('\'add\' method', function(assert) {
        const data = {};
        const handler = function() {
        };

        this.element
            .on('dxtestevent.test1.test2', '.some', data, handler);

        const LOG = this.testEventImplementer.LOG.add;

        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 2, 'arguments count');
        assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
        assert.ok($.isPlainObject(LOG.arguments[1]), 'handleObj');
        assert.equal(LOG.arguments[1].type, 'dxtestevent', 'handleObj.type');
        assert.equal(LOG.arguments[1].namespace, 'test1.test2', 'handleObj.namespace');
        assert.equal(LOG.arguments[1].selector, '.some', 'handleObj.selector');
        assert.strictEqual(LOG.arguments[1].data, data, 'handleObj.data');
        assert.equal(LOG.arguments[1].handler, handler, 'handleObj.handler');
    });

    QUnit.test('\'remove\' method', function(assert) {
        const data = {};
        const handler = function() {
        };

        this.element
            .on('dxtestevent.test1.test2', '.some', data, handler)
            .off('dxtestevent.test1.test2', handler);

        const LOG = this.testEventImplementer.LOG.add;

        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 2, 'arguments count');
        assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
        assert.ok($.isPlainObject(LOG.arguments[1]), 'handleObj');
        assert.equal(LOG.arguments[1].type, 'dxtestevent', 'handleObj.type');
        assert.equal(LOG.arguments[1].namespace, 'test1.test2', 'handleObj.namespace');
        assert.equal(LOG.arguments[1].selector, '.some', 'handleObj.selector');
        assert.strictEqual(LOG.arguments[1].data, data, 'handleObj.data');
        assert.equal(LOG.arguments[1].handler, handler, 'handleObj.handler');
    });

    QUnit.test('\'trigger\' method', function(assert) {
        const data = {};
        const handler = function() {
        };
        const event = $.Event('dxtestevent');

        this.element
            .on('dxtestevent.test1.test2', handler)
            .trigger(event, data);

        const LOG = this.testEventImplementer.LOG.trigger;
        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 3, 'arguments count');
        assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
        assert.strictEqual(LOG.arguments[1], event, 'event');
        assert.strictEqual(LOG.arguments[2], data, 'data');
    });

    QUnit.test('\'_default\' method', function(assert) {
        const data = {};
        const handler = function() {
        };
        const event = $.Event('dxtestevent');

        this.element
            .on('dxtestevent.test1.test2', data, handler)
            .trigger(event, data);

        const LOG = this.testEventImplementer.LOG._default;
        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 3, 'arguments count');
        assert.strictEqual(LOG.arguments[1], event, 'event');
        assert.strictEqual(LOG.arguments[2], data, 'data');
    });

    QUnit.test('\'handle\' method', function(assert) {
        const data = {};
        const handler = function() {
        };
        const event = $.Event('dxtestevent');

        this.element
            .on('dxtestevent.test1.test2', data, handler)
            .trigger(event, data);

        const LOG = this.testEventImplementer.LOG.handle;
        assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
        assert.equal(LOG.arguments.length, 3, 'arguments count');
        assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
        assert.strictEqual(LOG.arguments[1], event, 'event');
        assert.strictEqual(LOG.arguments[2], data, 'data');
    });
});
