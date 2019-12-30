const $ = require('jquery');
const GoogleProvider = require('ui/map/provider.dynamic.google');
const memoryLeaksHelper = require('../../helpers/memoryLeaksHelper.js');

require('bundles/modules/parts/widgets-all');

GoogleProvider.remapConstant('http://fakeUrl');

QUnit.module('eventsOnDispose', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

$.each(DevExpress.ui, function(componentName) {
    if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName)) {
        QUnit.test(componentName + ' should not leak memory by not removing redundant event subscriptions after disposing', function(assert) {
            // NOTE: $.getScript() subscribes load and error event handlers on <script> element
            const originalGetScript = $.fn.getScript;
            $.getScript = function() {
                return $.Deferred().promise();
            };

            try {
                const testNode = memoryLeaksHelper.createTestNode();
                const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
                let newEventSubscriptions;

                $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]('instance'),

                this.clock.tick(0);
                memoryLeaksHelper.destroyTestNode(testNode);
                this.clock.tick(100);
                newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
                assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, 'After a component is disposed, additional event subscriptions must be removed');
            } finally {
                $.getScript = originalGetScript;
            }
        });
    }
});
