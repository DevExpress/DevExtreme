import $ from 'jquery';
import GoogleProvider from 'ui/map/provider.dynamic.google';
import memoryLeaksHelper from '../../helpers/memoryLeaksHelper.js';

import 'bundles/modules/parts/widgets-web';

GoogleProvider.remapConstant('http://fakeUrl');

QUnit.module.skip('eventsOnRefresh', {
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

            this.clock.tick(100);
            const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

            component._refresh();
            this.clock.tick(100);
            const newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

            assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, 'After an option changes and causes re-rendering, no additional event subscriptions must be created');
            memoryLeaksHelper.destroyTestNode(testNode);
        });
    }
});
