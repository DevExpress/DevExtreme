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
        QUnit.test(componentName + " should not leak memory by creating redundant dom elements after refreshing", function(assert) {
            var testNode = memoryLeaksHelper.createTestNode(),
                component = $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]("instance"),
                originalDomElements,
                newDomElements;

            clock.tick(0);
            originalDomElements = memoryLeaksHelper.getAllPossibleEventTargets();

            component._refresh();

            clock.tick(0);
            newDomElements = memoryLeaksHelper.getAllPossibleEventTargets();
            if(newDomElements.length === originalDomElements.length) {
                assert.ok(true, "After an option changes and causes re-rendering, no additional dom elements must be created");
            } else {
                assert.ok(false, memoryLeaksHelper.compareDomElements(originalDomElements, newDomElements));
            }
            memoryLeaksHelper.destroyTestNode(testNode);
        });
    }
});
