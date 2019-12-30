const $ = require('jquery');
const GoogleProvider = require('ui/map/provider.dynamic.google');
const memoryLeaksHelper = require('../../helpers/memoryLeaksHelper.js');

require('bundles/modules/parts/widgets-all');
require('common.css!');

GoogleProvider.remapConstant('http://fakeUrl');

QUnit.module('eventsOnRefresh', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

$.each(DevExpress.ui, function(componentName) {
    if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName)) {
        QUnit.test(componentName + ' should not leak memory by creating redundant event subscriptions after refreshing', function(assert) {
            const testNode = memoryLeaksHelper.createTestNode();
            const component = $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]('instance');
            let originalEventSubscriptions;
            let newEventSubscriptions;

            this.clock.tick(100);
            originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

            component._refresh();
            this.clock.tick(100);
            newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

            assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, 'After an option changes and causes re-rendering, no additional event subscriptions must be created');
            memoryLeaksHelper.destroyTestNode(testNode);
        });
    }
});
