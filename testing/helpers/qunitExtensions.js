/* eslint-disable no-console */
/* global jQuery */

!function() {
    var module = QUnit.module;

    QUnit.module = function(_, testEnvironment) {
        if(testEnvironment && (testEnvironment.setup || testEnvironment.teardown)) {
            throw Error('Rename module hooks: The module hooks \'setup\' and \'teardown\' have been renamed to \'beforeEach\' and \'afterEach\'\nhttp://qunitjs.com/upgrade-guide-2.x/#rename-module-hooks');
        }
        return module.apply(this, arguments);
    };

    // compares two float/double numbers with some acceptable epsilon
    QUnit.assert.roughEqual = function(actual, expected, epsilon, message) {
        var delta = Math.abs(expected - actual);
        this.pushResult({
            result: delta < epsilon,
            actual: actual,
            expected: expected + ' ± ' + epsilon,
            message: message
        });
    };

    QUnit.assert.assertPerformance = function(action, limit) {
        var start = new Date();
        action();
        var ms = new Date() - start;
        this.pushResult({
            result: ms < limit,
            actual: ms + ' ms',
            expected: limit + ' ms or less',
            message: 'Performance test (Limit ' + limit + ' ms, took ' + ms + ' ms)'
        });
    };

    var confirmWindowActive = function() {
        var $input;
        try {
            $input = jQuery('<input>')
                .appendTo('body')
                .click()
                .focus();

            return $input.is(':focus');
        } finally {
            $input
                .blur()
                .remove();
        }
    };

    QUnit.testInActiveWindow = function(name, callback) {
        if(confirmWindowActive()) {
            QUnit.test.apply(this, arguments);
        } else {
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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

    var waitFor = window.waitFor = function(predicate, timeout, interval) {
        timeout = timeout || 30000;
        interval = interval || 15;

        var d = jQuery.Deferred(),
            startTime = jQuery.now();

        var checkInterval = setInterval(function() {
            if(predicate()) {
                d.resolve();
            }

            if(jQuery.now() - startTime > timeout) {
                if(window.console) {
                    if(jQuery.isFunction(window.console.error)) {
                        console.error('waitFor: Timeout is expired');
                    } else if(jQuery.isFunction(window.console.log)) {
                        console.log('waitFor: Timeout is expired');
                    }
                }
                d.reject();
            }
        }, interval);

        d.always(function() {
            clearInterval(checkInterval);
        });

        return d.promise();
    };

    window.waitTimeout = function(timeout, callback) {
        var startTime = jQuery.now();
        return waitFor(function() {
            return (jQuery.now() - startTime) >= timeout;
        }).done(callback);
    };

    if(window.console) {
        if(!console.time) {
            console._timers = {};
            console.time = function(st) {
                console.info('start ' + st);
                console._timers[st] = new Date();
            };
            console.timeEnd = function(st) {
                var time = new Date() - console._timers[st];
                console.info('end ' + st + ': ' + time + ' ms');
            };
        }
    }

    window.createTestContainer = function(parent, css) {
        function dashCase(str) {
            return str.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g, function(s, i) {
                return (i > 0 ? '-' : '') + s.toLowerCase();
            });
        }

        var uniqueName = dashCase(QUnit.config.current.testName),
            $container = jQuery('<div />').attr('id', uniqueName);
        css && $container.css(css);
        parent && $container.appendTo(parent);
        return $container;
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
        jQuery('head')
            .append('<link rel="dx-theme" data-theme="generic.light" href="' + SystemJS.normalizeSync('generic_light.css') + '" />')
            .append('<link rel="dx-theme" data-theme="ios7.default" href="' + SystemJS.normalizeSync('ios7_default.css') + '" />')
            .append('<link rel="dx-theme" data-theme="material.blue.light" href="' + SystemJS.normalizeSync('material_blue_light.css') + '" />');
    };

}();


(function clearQUnitFixtureByJQuery() {
    var isMsEdge = 'CollectGarbage' in window && !('ActiveXObject' in window);

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
        var noop = function() { };

        return {
            register: noop,
            unregister: noop,
            applyUnregister: noop,
            clear: noop,
            needSkip: noop
        };
    })();

    if(!QUnit.urlParams['notimers']) {
        return;
    }

    var runAllMode = window.parent !== window.self;

    var createMethodWrapper = function(method, callbacks) {
        var originalMethod = method,
            beforeCall = callbacks['beforeCall'],
            afterCall = callbacks['afterCall'],
            info = {
                originalMethod: originalMethod
            };

        var wrapper = function() {
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

    var getStack = function() {
        var stack = '';
        try { throw Error(''); } catch(ex) { stack = ex.stack; }
        return stack;
    };

    var saveTimerInfo = function(logObject, id, info) {
        if(!runAllMode) {
            info.stack = getStack();
            info.callback = info.callback.toString();
        }
        logObject[id] = info;
    };

    var requestAnimationFrameMethodName = (function() {
        var candidates = [
            'requestAnimationFrame',
            'msRequestAnimationFrame',
            'mozRequestAnimationFrame',
            'webkitRequestAnimationFrame'
        ];

        while(candidates.length) {
            var candidate = candidates.shift();
            if(candidate in window) {
                return candidate;
            }
        }
    })();

    var cancelAnimationFrameMethodName = (function() {
        var candidates = [
            'cancelAnimationFrame',
            'msCancelAnimationFrame',
            'mozCancelAnimationFrame',
            'webkitCancelAnimationFrame'
        ];

        while(candidates.length) {
            var candidate = candidates.shift();
            if(candidate in window) {
                return candidate;
            }
        }
    })();


    var spyWindowMethods = function() {
        var log,
            logEnabled,
            timeouts,
            intervals,
            animationFrames;

        var methodHooks = {
            'setTimeout': {
                'beforeCall': function(info) {
                    if(!logEnabled) {
                        return;
                    }

                    info.originalCallback = info.args[0];
                    var callbackWrapper = info.args[0] = createMethodWrapper(info.originalCallback, {
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
            }
        };

        methodHooks[requestAnimationFrameMethodName] = {
            'beforeCall': function(info) {
                if(!logEnabled) {
                    return;
                }

                info.originalCallback = info.args[0];
                var callBackWrapper = info.args[0] = createMethodWrapper(info.originalCallback, {
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
        };

        methodHooks[cancelAnimationFrameMethodName] = {
            'afterCall': function(info) {
                if(!logEnabled) {
                    return;
                }

                delete animationFrames[info.args[0]];
            }
        };

        for(var name in methodHooks) {
            window[name] = createMethodWrapper(window[name], methodHooks[name]);
        }

        var initLog = function() {
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

    var suppressLogOnTest = function() {
        return /Not cleared timers detected/.test(QUnit.config.current.testName);
    };

    var log = spyWindowMethods();

    QUnit.timerIgnoringCheckers = (function() {
        var checkers = [],
            checkersToUnregister = [];

        var register = function() {
            Array.prototype.push.apply(checkers, arguments);
        };

        var unregister = function() {
            Array.prototype.push.apply(checkersToUnregister, arguments);
        };

        var unregisterSingle = function(checker) {
            var index = checkers.indexOf(checker);

            checkers.splice(index, 1);
        };

        var applyUnregister = function() {
            jQuery.map(checkersToUnregister, unregisterSingle);
            checkersToUnregister = [];
        };

        var clear = function() {
            checkers = [];
            checkersToUnregister = [];
        };

        var needSkip = function(timerInfo) {
            var skip = false;

            jQuery.each(checkers, function(i, checker) {
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
        if(!jQuery) {
            return;
        }

        if(suppressLogOnTest()) {
            return;
        }

        var logGlobalFailure = function(details) {
            var timerInfo = details.timerInfo,
                timeoutString = timerInfo.timeout ? ', timeout: ' + timerInfo.timeout : '',
                message = ['Timer type: ', timerInfo.timerType, ', Id: ', timerInfo.timerId, timeoutString, '\nCallback:\n', timerInfo.callback].join('');

            var testCallback = function() {
                QUnit.pushFailure(message, timerInfo.stack || '1 timer');
            };

            testCallback.validTest = true;

            QUnit.module('Not cleared timers detected! ' + details.moduleName);
            QUnit.test(details.testName, testCallback);
        };

        var isThirdPartyLibraryTimer = function(timerInfo) {
            if(!timerInfo || !timerInfo.callback) {
                return false;
            }
            var callback = String(timerInfo.callback).replace(/\s|"use strict";/g, '');

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

        jQuery.each(['timeouts', 'intervals', 'animationFrames'], function() {
            var type = String(this),
                currentInfo = log.get()[type];

            if(!jQuery.isEmptyObject(currentInfo)) {
                var timerId = Object.keys(currentInfo)[0],
                    normalizedTimerInfo = jQuery.extend({
                        timerType: type,
                        timerId: timerId
                    }, currentInfo, currentInfo[timerId]);

                delete normalizedTimerInfo[timerId];

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
        var dateOnTestStart = Date,
            after = QUnit.config.current.after;

        QUnit.config.current.after = function() {
            if(dateOnTestStart !== Date) {
                QUnit.pushFailure('Not restored Sinon timers detected!', this.stack);
            }
            return after.apply(this, arguments);
        };
    });

})();
