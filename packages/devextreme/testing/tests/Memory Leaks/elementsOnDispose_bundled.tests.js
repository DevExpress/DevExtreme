import $ from 'jquery';
import GoogleProvider from '__internal/ui/map/m_provider.dynamic.google';
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
                    if(newDomElements.length - originalDomElements.length <= 11) {
                        // viz widgets create extra style node that can not be deleted
                        ignorePatterns = {
                            'style': /behavior:\surl\(#default#VML\)/gi,
                            'dx-license-trigger': /$/,
                            'dx-license': /$/,
                            'svg': /13.4 12.7 8.7 8 13.4 3.4 12.6 2.6 8 7.3 3.4 2.6 2.6 3.4 7.3 8 2.6 12.6 3.4 13.4 8 8.7 12.7 13.4 13.4 12.7/,
                            'polygon': /$/,
                            'div': /For evaluation purposes only. Redistribution prohibited.|to continue use of DevExpress product libraries|points="13.4 12.7 8.7 8 13.4 3.4 12.6 2.6 8 7.3 3.4 2.6 2.6 3.4 7.3 8 2.6 12.6 3.4 13.4 8 8.7 12.7 13.4 13.4 12.7/,
                            'span': /For evaluation purposes only. Redistribution prohibited.|an existing license|to continue use of DevExpress product libraries/,
                            'a': /purchase a new license|register/,
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
