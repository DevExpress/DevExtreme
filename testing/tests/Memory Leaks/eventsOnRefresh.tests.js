"use strict";

var $ = require("jquery"),
    GoogleProvider = require("ui/map/provider.dynamic.google"),
    memoryLeaksHelper = require("../../helpers/memoryLeaksHelper.js");

require("bundles/modules/parts/widgets-all");
require("common.css!");

GoogleProvider.remapConstant("http://fakeUrl");

var clock = sinon.useFakeTimers();

$.each(DevExpress.ui, function(componentName) {
    if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName)) {
        QUnit.test(componentName + " should not leak memory by creating redundant event subscriptions after refreshing", function(assert) {
            var testNode = memoryLeaksHelper.createTestNode(),
                component = $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]("instance"),
                originalEventSubscriptions,
                newEventSubscriptions;

            clock.tick(0);
            originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

            component._refresh();
            clock.tick(0);
            newEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

            assert.deepEqual(newEventSubscriptions, originalEventSubscriptions, "After an option changes and causes re-rendering, no additional event subscriptions must be created");
            memoryLeaksHelper.destroyTestNode(testNode);
        });
    }
});
