var $ = require('jquery'),
    GoogleProvider = require('ui/map/provider.dynamic.google'),
    memoryLeaksHelper = require('../../helpers/memoryLeaksHelper.js');

require('bundles/modules/parts/widgets-all');

GoogleProvider.remapConstant('http://fakeUrl');

QUnit.module('elementsOnDispose', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

$.each(DevExpress.ui, function(componentName) {
    if($.fn[componentName] && memoryLeaksHelper.componentCanBeTriviallyInstantiated(componentName)) {
        QUnit.test(componentName + ' should not leak memory by not removing additional dom elements after disposing', function(assert) {
            // NOTE: $.getScript() create <script> element
            var originalGetScript = $.fn.getScript;
            $.getScript = function() {
                return $.Deferred().promise();
            };

            try {
                var originalDomElements = memoryLeaksHelper.getAllPossibleEventTargets(),
                    testNode = memoryLeaksHelper.createTestNode(),
                    newDomElements,
                    ignorePatterns,
                    errorMessage;

                $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]('instance');
                this.clock.tick(0);
                memoryLeaksHelper.destroyTestNode(testNode);
                this.clock.tick(100);
                newDomElements = memoryLeaksHelper.getAllPossibleEventTargets();
                if(newDomElements.length === originalDomElements.length) {
                    assert.ok(true, 'After a component is disposed, additional DOM elements must be removed');
                } else {
                    if(newDomElements.length - originalDomElements.length === 1) {
                        // viz widgets create extra style node that can not be deleted
                        ignorePatterns = { 'style': /behavior:\surl\(#default#VML\)/gi };
                    }
                    errorMessage = memoryLeaksHelper.compareDomElements(originalDomElements, newDomElements, ignorePatterns);
                    assert.ok(!errorMessage, errorMessage || 'After a component is disposed, additional DOM elements must be removed');
                }
            } finally {
                $.getScript = originalGetScript;
            }
        });
    }
});
