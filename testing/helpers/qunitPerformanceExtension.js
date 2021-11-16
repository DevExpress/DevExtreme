/* eslint-disable no-console */

(function(root, factory) {
    const useJQuery = !QUnit.urlParams['nojquery'];
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            factory(useJQuery ? require('jquery') : undefined, require('core/utils/size'));
        });
    } else {
        factory(useJQuery ? root.jQuery : undefined, DevExpress.require('core/utils/size'));
    }
}(this, function($, sizeUtils) {
    function ChromeRemote() {
        const that = this;
        that.callbacks = {};
        that.eventHandlers = {};
        that.nextCommandId = 1;

        loadJSON('http://localhost:9223/json', function(data) {
            [...data].forEach(function(item) {
                const div = document.createElement('div');
                div.innerHTML = item.title;
                const title = div.innerText;
                // TODO: Try to find another way (item.title.indexOf(document.title) !== -1))
                if(item.webSocketDebuggerUrl && (title.indexOf(document.title) !== -1 || title.indexOf(window.location.href) !== -1)) {
                    that.connect(item.webSocketDebuggerUrl);
                }
            });
        }, function() {
            that.connect('ws://localhost:8222/devtools/page/2155');
        });
    }

    function loadJSON(path, onSuccess, onError) {
        fetch(path, { method: 'GET' })
            .then(x => x.json())
            .then(x=> onSuccess(x))
            .catch(err => onError(err));
    }

    ChromeRemote.prototype.on = function(eventName, callback) {
        if(!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(callback);
    };
    ChromeRemote.prototype.off = function(eventName, callback) {
        if(!this.eventHandlers[eventName]) {
            return;
        }
        const index = this.eventHandlers[eventName].indexOf(callback);
        if(index > -1) {
            this.eventHandlers[eventName].splice(index, 1);
        }
    };
    ChromeRemote.prototype.trigger = function(eventName, args) {
        const eventRoute = this.eventHandlers[eventName];
        if(!eventRoute) { return; }
        eventRoute.forEach(x => {
            x(eventName, ...args);
        });
    };

    ChromeRemote.prototype.connect = function(url) {
        if(this.ws) return;

        const that = this;
        this.ws = new WebSocket(url);

        this.ws['onopen'] = function() {
            that.onConnect();
        };

        this.ws['onmessage'] = function(e) {
            const data = e.data;
            const message = JSON.parse(data);

            if(message.id) {
                const callback = that.callbacks[message.id];

                if(message.result) {
                    callback(false, message.result);
                } else if(message.error) {
                    callback(true, message.error);
                }

                delete that.callbacks[message.id];
            } else if(message.method) {
                that.trigger(message.method, [message.params]);
            }
        };

        this.ws.onerror = function(err) {
            that.trigger('error');
        };
    };

    ChromeRemote.prototype.send = function(method, params, callback) {
        const id = this.nextCommandId++;
        if(typeof params === 'function') {
            callback = params;
            params = undefined;
        }
        const message = { 'id': id, 'method': method, 'params': params };
        this.ws.send(JSON.stringify(message));

        this.callbacks[id] = callback || function() {};
    };

    const chrome = new ChromeRemote();
    let chromeRemoteIsReady = false;
    let documentIsLoaded = document.readyState === 'complete';

    chrome.onConnect = function() {
        chromeRemoteIsReady = true;
    };


    document.addEventListener('DOMContentLoaded', () => {
        documentIsLoaded = true;
    });

    QUnit.performanceTest = function(name, callback) {
        return QUnit.test.apply(this, arguments);
    };

    QUnit.assert.measureStyleRecalculation = function(measureFunction, standardMeasure, debug) {
        const that = this;
        const done = this.async();

        window.waitFor(function() {
            return chromeRemoteIsReady && documentIsLoaded;
        }).done(function() {
            that.styleRecalculations = [];
            let updateLayout;

            const collectData = function(e, params) {
                const val = params.value;
                const len = val.length;

                for(let i = 0; i < len; i++) {
                    const task = val[i];

                    if(task.name === 'ScheduleStyleRecalculation') {
                        const stackTrace = task.args.data.stackTrace || [];
                        const excludedRestyles = stackTrace.filter(
                            (trace) => (trace.url.indexOf('chrome-devtools') === 0 || trace.functionName === 'readThemeMarker')
                        );

                        if(!excludedRestyles.length && stackTrace.length) {
                            updateLayout = {
                                restyleStackTrace: stackTrace
                            };
                            that.styleRecalculations.push(updateLayout);
                        } else {
                            updateLayout = null;
                        }
                    }

                    if(updateLayout && task.name === 'UpdateLayoutTree') {
                        if(task.ph === 'B') {
                            updateLayout.time = task.ts;
                            updateLayout.layoutStack = task.args.beginData.stackTrace || [];
                        } else if(task.ph === 'E') {
                            updateLayout.elementCount = task.args.elementCount;
                            updateLayout.time = task.ts - updateLayout.time;
                        }
                    }
                }
            };

            const collectEndData = function() {
                chrome.off('Tracing.dataCollected', collectData);
                chrome.off('Tracing.tracingComplete', collectEndData);

                const recalculationsStackString = JSON.stringify(JSON.stringify(that.styleRecalculations, null, 2));
                const assertResult = (typeof standardMeasure === 'function') ? standardMeasure(that.styleRecalculations.length) : standardMeasure === that.styleRecalculations.length;
                const resultMessage = 'Took ' + that.styleRecalculations.length + ' style recalculations';
                const expectedMessage = 'Expected ' + standardMeasure + ' style recalculations';
                const assertMessage = 'Performance test (Expected ' + standardMeasure + ' style recalculations, took ' + that.styleRecalculations.length + ' style recalculations)' + '\r\n' + recalculationsStackString;

                if(debug) {
                    const time = 0;
                    for(let i = 0; i < that.styleRecalculations.length; i++) {
                        console.log(that.styleRecalculations[i]);
                    }

                    console.log('TIME: ' + time);
                }

                that.pushResult({
                    result: assertResult,
                    actual: resultMessage,
                    expected: expectedMessage,
                    message: assertMessage
                });
                done();
            };

            if(!$) {
                [...document.querySelectorAll('body')].forEach(x => sizeUtils.getOuterWidth(x, true));
            } else {
                $('body').outerWidth(true);
            }

            chrome.on('Tracing.dataCollected', collectData);
            chrome.on('Tracing.tracingComplete', collectEndData);

            const categories = [
                'disabled-by-default-devtools.timeline',
                'disabled-by-default-devtools.timeline.invalidationTracking',
                'disabled-by-default-devtools.timeline.stack'
            ];
            chrome.send('Tracing.start', { categories: categories.join(',') }, function(isError) {
                measureFunction();
                if(isError) {
                    collectEndData();
                } else {
                    chrome.send('Tracing.end', {});
                }
            });
        });
    };
}));
