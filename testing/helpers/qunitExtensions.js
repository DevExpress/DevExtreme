/* eslint-disable no-console */
/* global jQuery */

!function() {

    // compares two float/double numbers with some acceptable epsilon
    QUnit.assert.roughEqual = function(actual, expected, epsilon, message) {
        const delta = Math.abs(expected - actual);
        this.pushResult({
            result: delta < epsilon,
            actual: actual,
            expected: expected + ' ± ' + epsilon,
            message: message
        });
    };

    const confirmWindowActive = function() {
        let input;
        try {
            input = document.createElement('input');
            document.body.appendChild(input);
            input.click();
            input.focus();
            return document.activeElement === input;
        } finally {
            input.blur();
            document.body.removeChild(input);
        }
    };

    QUnit.testInActiveWindow = function(name, callback) {
        if(confirmWindowActive()) {
            QUnit.test.apply(this, arguments);
        } else {
            const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if(iOS) {
                // do not test
                // do not skip
                return;
            }

            if(window.farmMode) {
                QUnit.test(name, function(assert) {
                    assert.ok(false, 'This test is not able to run in non-active window');
                });
            } else {
                QUnit.skip(name + ' [Inactive Window]');
            }
        }

    };

    QUnit.isInShadowDomMode = function() {
        return QUnit.urlParams['shadowDom'] && QUnit.urlParams['nojquery'];
    };

    QUnit.skipInShadowDomMode = function(name, callback) {
        if(QUnit.isInShadowDomMode()) {
            QUnit.skip(name + ' [Skipped in the ShadowDOM mode]');
        } else {
            QUnit.test.apply(this, arguments);
        }
    };

    window.waitFor = function(predicate, timeout, interval) {
        timeout = timeout || 30000;
        interval = interval || 15;

        let doneCallback;
        const startTime = Date.now();

        const checkIntervalId = setInterval(function() {
            if(predicate()) {
                clearInterval(checkIntervalId);
                doneCallback();
            }

            if(Date.now() - startTime > timeout) {
                clearInterval(checkIntervalId);
                if(window.console) {
                    if(typeof window.console.error === 'function') {
                        console.error('waitFor: Timeout is expired');
                    } else if(typeof window.console.log === 'function') {
                        console.log('waitFor: Timeout is expired');
                    }
                }
            }
        }, interval);

        return {
            done: function(callback) {
                doneCallback = callback;
            }
        };
    };

    window.createTestContainer = function(parentSelector, css) {
        function dashCase(str) {
            return str.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g, function(s, i) {
                return (i > 0 ? '-' : '') + s.toLowerCase();
            });
        }

        const uniqueName = dashCase(QUnit.config.current.testName);
        const container = document.createElement('div');
        container.setAttribute('id', uniqueName);

        if(css) {
            Object.keys(css).forEach(function(prop) {
                container.style[prop] = css[prop];
            });
        }

        const parent = document.querySelector(parentSelector);
        if(parent) {
            parent.appendChild(container);
        } else {
            throw 'Parent element with "' + parentSelector + '" is not found';
        }

        return container;
    };

    window.currentTest = function() {
        return QUnit.config.current.testEnvironment;
    };

    // Use it with great caution!
    // Only when there is no better way to access `assert` object
    window.currentAssert = function() {
        return QUnit.config.current.assert;
    };

    window.includeThemesLinks = function() {
        const head = document.head;

        [
            'generic.light',
            'material.blue.light'
        ].forEach(function(theme) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'dx-theme');
            link.setAttribute('data-theme', theme);
            link.setAttribute('href', SystemJS.normalizeSync(theme.replace(/\./g, '_') + '.css'));
            head.appendChild(link);
        });
    };

    const beforeTestDoneCallbacks = [];

    QUnit.beforeTestDone = function(callback) {
        beforeTestDoneCallbacks.push(callback);
    };

    QUnit.testStart(function() {
        const after = QUnit.config.current.after;

        QUnit.config.current.after = function() {
            beforeTestDoneCallbacks.forEach(function(callback) {
                callback();
            });
            return after.apply(this, arguments);
        };
    });

}();

(function setupShadowDomMode() {
    function getRoot() {
        return document.querySelector('#qunit-fixture').shadowRoot;
    }

    function get(selector) {
        return typeof selector === 'string' && selector ? getRoot().querySelectorAll(selector) : selector;
    }

    function addShadowRootTree() {
        const root = document.querySelector('#qunit-fixture');

        if(!root.shadowRoot) {
            root.attachShadow({ mode: 'open' });
        }

        const shadowContainer = document.createElement('div');
        const style = document.createElement('style');
        style.setAttribute('nonce', 'qunit-extension');

        shadowContainer.className = 'shadow-container';

        style.innerHTML = `
            :host {
                position: static!important;
                top: 0!important;
                left: 0!important;
            }
            :scope .shadow-container {
                position: absolute;
                top: -10000px;
                left: -10000px;
                width: 1000px;
                height: 1000px;
            }

            :scope .shadow-container.qunit-fixture-visible {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
            }
        `;

        root.shadowRoot.appendChild(style);
        root.shadowRoot.appendChild(shadowContainer);
    }

    function clearShadowRootTree() {
        const container = get(':scope div')[0];
        const style = get(':scope style')[0];

        jQuery(container).remove();
        jQuery(style).remove();
    }

    let jQueryInit;

    QUnit.testStart(function() {
        if(!QUnit.isInShadowDomMode()) {
            return;
        }

        addShadowRootTree();

        jQueryInit = jQuery.fn.init;

        jQuery.fn.init = function(selector, context, root) {
            const result = new jQueryInit(selector, context, root);
            const resultElement = result.get(0);

            if(!resultElement) {
                return new jQueryInit(get(selector), context, root);
            }

            if(resultElement === getRoot().host) {
                return new jQueryInit(get(':scope div')[0], context, root);
            }

            return result;
        };
    });

    QUnit.beforeTestDone(function() {
        if(!QUnit.isInShadowDomMode()) {
            return;
        }

        jQuery.fn.init = jQueryInit != null ? jQueryInit : jQuery.fn.init;

        clearShadowRootTree();
    });

    QUnit.config.urlConfig.push({
        id: 'shadowDom',
        label: 'Shadow DOM',
        tooltip: 'Enabling this will test the target control inside the ShadowDOM.'
    });
})();

(function clearQUnitFixtureByJQuery() {
    const isMsEdge = 'CollectGarbage' in window && !('ActiveXObject' in window);

    QUnit.beforeTestDone(function(options) {
        if(!jQuery) {
            return;
        }

        if(isMsEdge) {
            jQuery('#qunit-fixture input[type=date]').attr('type', 'hidden');
        }

        jQuery('#qunit-fixture').empty();
    });
})();

(function checkForTimers() {

    QUnit.config.urlConfig.push({
        id: 'notimers',
        label: 'Check for timers',
        tooltip: 'Enabling this will test if any test introduces timers (setTimeout, setInterval, ....) and does not cleared them on test finalization. Stored as query-strings.'
    });

    const createMethodWrapper = function(method, callbacks) {
        const beforeCall = callbacks.beforeCall;
        const afterCall = callbacks.afterCall;

        return function() {
            const info = {
                method: method,
                context: this,
                args: Array.prototype.slice.call(arguments)
            };

            if(typeof beforeCall === 'function') {
                beforeCall(info);
            }

            info.returnValue = method.apply(info.context, info.args);

            if(typeof afterCall === 'function') {
                afterCall(info);
            }

            return info.returnValue;
        };
    };

    const getStack = function() {
        let stack = '';
        try { throw Error(''); } catch(ex) { stack = ex.stack; }
        return stack;
    };

    const saveTimerInfo = function(logObject, info) {
        info.stack = getStack();
        info.callback = info.callback.toString();
        logObject[info.timerId] = info;
    };

    const spyWindowMethods = function(windowObj) {
        let log;
        let logEnabled;
        let timeouts;
        let intervals;
        let animationFrames;

        windowObj = windowObj || window;

        const methodHooks = {
            'setTimeout': {
                'beforeCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    info.callback = info.args[0];
                    info.args[0] = createMethodWrapper(info.callback, {
                        afterCall: function() {
                            if(!logEnabled) {
                                return;
                            }
                            delete timeouts[info.returnValue];
                        }
                    });
                },

                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    saveTimerInfo(timeouts, {
                        timerType: 'timeouts',
                        timerId: info.returnValue,
                        callback: info.callback,
                        timeout: info.args[1]
                    });
                }
            },

            'clearTimeout': {
                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }
                    delete timeouts[info.args[0]];
                }
            },

            'setInterval': {
                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }
                    const timerId = info.returnValue;
                    saveTimerInfo(intervals, {
                        timerType: 'intervals',
                        timerId: timerId,
                        callback: info.args[0],
                        timeout: info.args[1]
                    });
                }
            },

            'clearInterval': {
                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }
                    delete intervals[info.args[0]];
                }
            },

            'requestAnimationFrame': {
                'beforeCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    info.callback = info.args[0];
                    info.args[0] = createMethodWrapper(info.callback, {
                        afterCall: function() {
                            if(!logEnabled) {
                                return;
                            }
                            delete animationFrames[info.returnValue];
                        }
                    });
                },
                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    saveTimerInfo(animationFrames, {
                        timerType: 'animationFrames',
                        timerId: info.returnValue,
                        callback: info.callback
                    });
                }
            },

            'cancelAnimationFrame': {
                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    delete animationFrames[info.args[0]];
                }
            }
        };

        Object.keys(methodHooks).forEach(function(name) {
            windowObj[name] = createMethodWrapper(windowObj[name], methodHooks[name]);
        });

        const initLog = function() {
            log = {};
            timeouts = log['timeouts'] = {};
            intervals = log['intervals'] = {};
            animationFrames = log['animationFrames'] = {};
        };

        return {
            get: function() {
                return log;
            },

            start: function() {
                if(!log) {
                    initLog();
                }
                logEnabled = true;
            },

            stop: function() {
                logEnabled = false;
            },

            clear: function() {
                initLog();
            }
        };
    };

    const ignoreRules = (function() {
        let rules = [];

        return {
            register: function() {
                Array.prototype.push.apply(rules, arguments);
            },
            unregister: function() {
                Array.prototype.forEach.call(arguments, function(rule) {
                    const index = rules.indexOf(rule);
                    rules.splice(index, 1);
                });
            },
            clear: function() {
                rules = [];
            },
            shouldIgnore: function(timerInfo) {
                let skip = false;

                rules.forEach(function(rule) {
                    if(rule(timerInfo)) {
                        skip = true;
                        return false;
                    }
                });

                return skip;
            }
        };
    })();

    QUnit.timersDetector = {
        spyWindowMethods: spyWindowMethods,
        ignoreRules: ignoreRules
    };

    if(!QUnit.urlParams['notimers']) {
        return;
    }

    const log = spyWindowMethods();

    ignoreRules.register(function isThirdPartyLibraryTimer(timerInfo) {
        const callback = String(timerInfo.callback).replace(/\s/g, '');
        const timerType = timerInfo.timerType;

        if(timerType === 'timeouts') {
            if(
                callback.indexOf('.Deferred.exceptionHook') > -1 || // NOTE: jQuery.Deferred are now asynchronous
                callback.indexOf('e._drain()') > -1 // NOTE: SystemJS Promise polyfill
            ) {
                return true;
            }

            if(
                window.navigator.userAgent.indexOf('Edge/') > -1 && // NOTE: Native Promise in Edge
                callback.indexOf('function(){[nativecode]}') > -1
            ) {
                return true;
            }
        }
    });

    const logTestFailure = function(timerInfo) {
        const timeoutString = timerInfo.timeout ? '\nTimeout: ' + timerInfo.timeout : '';

        const message = [
            'Not cleared timer detected.\n',
            '\n',
            'Timer type: ', timerInfo.timerType, '\n',
            'Id: ', timerInfo.timerId, '\n',
            'Callback:\n', timerInfo.callback, '\n',
            timeoutString
        ].join('');

        QUnit.pushFailure(message, timerInfo.stack);
    };

    QUnit.testStart(function() {
        log.start();
    });

    QUnit.beforeTestDone(function() {
        log.stop();

        ['timeouts', 'intervals', 'animationFrames'].forEach(function(type) {
            const currentInfo = log.get()[type];

            if(Object.keys(currentInfo).length) {
                const timerId = Object.keys(currentInfo)[0];
                const timerInfo = currentInfo[timerId];

                if(ignoreRules.shouldIgnore(timerInfo)) {
                    return;
                }

                logTestFailure(timerInfo);
            }
        });

        log.clear();
    });
})();

(function checkSinonFakeTimers() {

    let dateOnTestStart;
    QUnit.testStart(function() {
        dateOnTestStart = Date;
    });

    QUnit.beforeTestDone(function() {
        if(dateOnTestStart !== Date) {
            QUnit.pushFailure('Not restored Sinon timers detected!', this.stack);
        }
    });

})();
