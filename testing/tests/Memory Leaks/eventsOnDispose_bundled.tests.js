const $ = require('jquery');
const GoogleProvider = require('ui/map/provider.dynamic.google');
const memoryLeaksHelper = require('../../helpers/memoryLeaksHelper.js');

require('bundles/modules/parts/widgets-web');

GoogleProvider.remapConstant('http://fakeUrl');

QUnit.module('eventsOnDispose', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

[
    false, // default disposing
    true, // vue 2 disposing (firstly clears dom, then call dispose)
].forEach((vue2disposing) => {
    $.each(DevExpress.ui, function(componentName) {
        if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName)) {
            QUnit.test(`${componentName} should not leak memory by not removing redundant event subscriptions after disposing (vue2 = ${vue2disposing})`, function(assert) {
                // NOTE: $.getScript() subscribes load and error event handlers on <script> element
                const originalGetScript = $.fn.getScript;
                $.getScript = function() {
                    return $.Deferred().promise();
                };

                try {
                    const testNode = memoryLeaksHelper.createTestNode();
                    const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

                    const component = $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]('instance');

                    this.clock.tick(0);
                    if(vue2disposing) {
                        testNode.get(0).remove();
                        component.dispose();
                    } else {
                        memoryLeaksHelper.destroyTestNode(testNode);
                    }
                    const newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
                    assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, 'After a component is disposed, additional event subscriptions must be removed');
                } finally {
                    $.getScript = originalGetScript;
                }
            });
        }
    });
});
