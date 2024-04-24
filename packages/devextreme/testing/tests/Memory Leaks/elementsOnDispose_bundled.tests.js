import $ from 'jquery';
import GoogleProvider from 'ui/map/provider.dynamic.google';
import memoryLeaksHelper from '../../helpers/memoryLeaksHelper.js';

import 'bundles/modules/parts/widgets-web';

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
            const originalGetScript = $.fn.getScript;
            $.getScript = function() {
                return $.Deferred().promise();
            };

            try {
                const originalDomElements = memoryLeaksHelper.getAllPossibleEventTargets();

                const testNode = memoryLeaksHelper.createTestNode();
                let ignorePatterns;
                let errorMessage;

                $(testNode)[componentName](memoryLeaksHelper.getComponentOptions(componentName))[componentName]('instance');
                this.clock.tick(0);
                memoryLeaksHelper.destroyTestNode(testNode);
                const newDomElements = memoryLeaksHelper.getAllPossibleEventTargets();
                if(newDomElements.length === originalDomElements.length) {
                    assert.ok(true, 'After a component is disposed, additional DOM elements must be removed');
                } else {
                    if(newDomElements.length - originalDomElements.length <= 6) {
                        // viz widgets create extra style node that can not be deleted
                        ignorePatterns = {
                            'style': /behavior:\surl\(#default#VML\)/gi,
                            'dx-license-trigger': /$/,
                            'dx-license': /$/,
                            'span': /For evaluation purposes only. Redistribution not authorized.|to continue use of DevExpress product libraries/,
                            'a': /purchase a license/,
                        };
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
