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
            for(const prop in css) {
                if(Object.prototype.hasOwnProperty.call(css, prop)) {
                    container.style[prop] = css[prop];
                }
            }
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
            'ios7.default',
            'material.blue.light'
        ].forEach(function(theme) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'dx-theme');
            link.setAttribute('data-theme', theme);
            link.setAttribute('href', SystemJS.normalizeSync(theme.replace(/./g, '_') + '.css'));
            head.appendChild(link);
        });
    };

}();


(function clearQUnitFixtureByJQuery() {
    const isMsEdge = 'CollectGarbage' in window && !('ActiveXObject' in window);

    QUnit.testDone(function(options) {
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

    QUnit.timerIgnoringCheckers = (function() {
        const noop = function() { };

        return {
            register: noop,
            unregister: noop,
            applyUnregister: noop,
            clear: noop,
            needSkip: noop
        };
    })();

    const createMethodWrapper = function(method, callbacks) {
        const originalMethod = method;
        const beforeCall = callbacks['beforeCall'];
        const afterCall = callbacks['afterCall'];
        const info = {
            originalMethod: originalMethod
        };

        const wrapper = function() {
            info['context'] = this;
            info['args'] = Array.prototype.slice.call(arguments);

            if(typeof beforeCall === 'function') {
                beforeCall(info);
            }

            info['result'] = originalMethod.apply(info.context, info.args);

            if(typeof afterCall === 'function') {
                afterCall(info);
            }

            return info['result'];
        };

        info['wrapper'] = wrapper;
        wrapper['info'] = info;

        return wrapper;
    };

    const getStack = function() {
        let stack = '';
        try { throw Error(''); } catch(ex) { stack = ex.stack; }
        return stack;
    };

    const saveTimerInfo = function(logObject, id, info) {
        info.stack = getStack();
        info.callback = info.callback.toString();
        logObject[id] = info;
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

                    info.originalCallback = info.args[0];
                    const callbackWrapper = info.args[0] = createMethodWrapper(info.originalCallback, {
                        afterCall: function() {
                            if(!logEnabled) {
                                return;
                            }
                            delete timeouts[callbackWrapper.timerID];
                        }
                    });
                },

                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    info.args[0]['timerID'] = info.result;
                    saveTimerInfo(timeouts, info.result, {
                        callback: info.originalCallback,
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
                    saveTimerInfo(intervals, info.result, {
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

                    info.originalCallback = info.args[0];
                    const callBackWrapper = info.args[0] = createMethodWrapper(info.originalCallback, {
                        afterCall: function() {
                            if(!logEnabled) {
                                return;
                            }
                            delete animationFrames[callBackWrapper.timerID];
                        }
                    });
                },
                'afterCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    info.args[0]['timerID'] = info.result;
                    saveTimerInfo(animationFrames, info.result, {
                        callback: info.originalCallback
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

        let name;
        for(name in methodHooks) {
            windowObj[name] = createMethodWrapper(windowObj[name], methodHooks[name]);
        }

        const initLog = function() {
            log = {};
            timeouts = log['timeouts'] = {},
            intervals = log['intervals'] = {},
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

    QUnit.timersDetector = {
        spyWindowMethods: spyWindowMethods
    };

    if(!QUnit.urlParams['notimers']) {
        return;
    }

    const suppressLogOnTest = function() {
        return /Not cleared timers detected/.test(QUnit.config.current.testName);
    };

    const log = spyWindowMethods();

    QUnit.timerIgnoringCheckers = (function() {
        let checkers = [];
        let checkersToUnregister = [];

        const register = function() {
            Array.prototype.push.apply(checkers, arguments);
        };

        const unregister = function() {
            Array.prototype.push.apply(checkersToUnregister, arguments);
        };

        const unregisterSingle = function(checker) {
            const index = checkers.indexOf(checker);

            checkers.splice(index, 1);
        };

        const applyUnregister = function() {
            checkersToUnregister.forEach(unregisterSingle);
            checkersToUnregister = [];
        };

        const clear = function() {
            checkers = [];
            checkersToUnregister = [];
        };

        const needSkip = function(timerInfo) {
            let skip = false;

            checkers.forEach(function(checker) {
                if(checker(timerInfo)) {
                    skip = true;
                    return false;
                }
            });

            return skip;
        };

        return {
            register: register,
            unregister: unregister,
            applyUnregister: applyUnregister,
            clear: clear,
            needSkip: needSkip
        };
    })();

    QUnit.testStart(function() {
        if(suppressLogOnTest()) {
            return;
        }
        log.start();
    });

    QUnit.testDone(function(args) {
        if(suppressLogOnTest()) {
            return;
        }

        const logGlobalFailure = function(details) {
            const timerInfo = details.timerInfo;
            const timeoutString = timerInfo.timeout ? ', timeout: ' + timerInfo.timeout : '';
            const message = ['Timer type: ', timerInfo.timerType, ', Id: ', timerInfo.timerId, timeoutString, '\nCallback:\n', timerInfo.callback].join('');

            const testCallback = function() {
                QUnit.pushFailure(message, timerInfo.stack || '1 timer');
            };

            testCallback.validTest = true;

            QUnit.module('Not cleared timers detected! ' + details.moduleName);
            QUnit.test(details.testName, testCallback);
        };

        const isThirdPartyLibraryTimer = function(timerInfo) {
            if(!timerInfo || !timerInfo.callback) {
                return false;
            }
            const callback = String(timerInfo.callback).replace(/\s|"use strict";/g, '');

            if(timerInfo.timerType === 'animationFrames' &&
                [
                    'function(){for(vara=0;a<d.length;a++)d[a]();d=[]}',
                    'function(){for(vari=0;i<waitQueue.length;i++){waitQueue[i]();}waitQueue=[];}'
                ].indexOf(callback) > -1) {
                // NOTE: Special thanks for Angular team
                // 1. Implementation: https://github.com/angular/angular.js/blob/v1.5.x/src/ng/raf.js#L29
                // 2. Usage: https://github.com/angular/angular.js/blob/v1.5.x/src/ng/animateRunner.js#L10

                return true;
            }

            if(timerInfo.timerType === 'timeouts' &&
                (callback.indexOf('.Deferred.exceptionHook') > -1 || // NOTE: jQuery.Deferred are now asynchronous
                callback.indexOf('e._drain()') > -1)) { // NOTE: SystemJS Promise polyfill
                return true;
            }

            if(timerInfo.timerType === 'timeouts' &&
                window.navigator.userAgent.indexOf('Edge/') > -1 && // NOTE: Only in Edge
                callback.indexOf('function(){[nativecode]}') > -1) { // NOTE: Native Promise
                return true;
            }
        };

        log.stop();

        ['timeouts', 'intervals', 'animationFrames'].forEach(function(type) {
            const currentInfo = log.get()[type];

            if(Object.keys(currentInfo).length) {
                const timerId = Object.keys(currentInfo)[0];

                const normalizedTimerInfo = {
                    timerType: type,
                    timerId: timerId,
                    callback: currentInfo[timerId].callback || currentInfo.callback,
                    timeout: currentInfo[timerId].timeout || currentInfo.timeout,
                    stack: currentInfo[timerId].stack || currentInfo.stack
                };

                if(isThirdPartyLibraryTimer(normalizedTimerInfo)) {
                    return;
                }

                if(QUnit.timerIgnoringCheckers.needSkip(normalizedTimerInfo)) {
                    return;
                }

                logGlobalFailure({
                    moduleName: args.module,
                    testName: args.name,
                    timerInfo: normalizedTimerInfo
                });
            }
        });

        QUnit.timerIgnoringCheckers.applyUnregister();
        log.clear();
    });
})();

(function checkSinonFakeTimers() {

    QUnit.testStart(function() {
        const dateOnTestStart = Date;
        const after = QUnit.config.current.after;

        QUnit.config.current.after = function() {
            if(dateOnTestStart !== Date) {
                QUnit.pushFailure('Not restored Sinon timers detected!', this.stack);
            }
            return after.apply(this, arguments);
        };
    });

})();
