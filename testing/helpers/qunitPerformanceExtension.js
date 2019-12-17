/* eslint-disable no-console */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            factory(require('jquery'));
        });
    } else {
        factory(root.jQuery);
    }
}(this, function($) {
    function ChromeRemote() {
        var that = this;
        that.callbacks = {};
        that.nextCommandId = 1;

        loadJSON('http://localhost:9223/json', function(data) {
            $.each(data, function(_, item) {
                var title = $('<div>').html(item.title).text();
                // TODO: Try to find another way (item.title.indexOf(document.title) !== -1))
                if(item.webSocketDebuggerUrl && (title.indexOf(document.title) !== -1 || title.indexOf(window.location.href) !== -1)) {
                    that.connect(item.webSocketDebuggerUrl);
                }
            });
        }, function() {
            that.connect('ws://localhost:8222/devtools/page/2155');
        });
    }

    var loadJSON = function(path, onSuccess, onError) {
        $.ajax({
            type: 'GET',
            url: path,
            success: function(result) {
                onSuccess(result);
            },
            error: function(result) {
                onError(result);
            }
        });
    };

    ChromeRemote.prototype.connect = function(url) {
        if(this.ws) return;

        var that = this;
        this.ws = new WebSocket(url);

        this.ws['onopen'] = function() {
            that.onConnect();
        };

        this.ws['onmessage'] = function(e) {
            var data = e.data;
            var message = JSON.parse(data);

            if(message.id) {
                var callback = that.callbacks[message.id];

                if(message.result) {
                    callback(false, message.result);
                } else if(message.error) {
                    callback(true, message.error);
                }

                delete that.callbacks[message.id];
            } else if(message.method) {
                $(that).trigger(message.method, [message.params]);
            }
        };

        this.ws.onerror = function(err) {
            $(that).trigger('error');
        };
    };

    ChromeRemote.prototype.send = function(method, params, callback) {
        var id = this.nextCommandId++;
        if(typeof params === 'function') {
            callback = params;
            params = undefined;
        }
        var message = { 'id': id, 'method': method, 'params': params };
        this.ws.send(JSON.stringify(message));

        this.callbacks[id] = callback || function() {};
    };

    var chrome = new ChromeRemote();
    var chromeRemoteIsReady = false;
    var documentIsLoaded = document.readyState === 'complete';

    chrome.onConnect = function() {
        chromeRemoteIsReady = true;
    };

    $(function() {
        documentIsLoaded = true;
    });

    QUnit.performanceTest = function(name, callback) {
        return QUnit.test.apply(this, arguments);
    };

    QUnit.assert.measureStyleRecalculation = function(measureFunction, standardMeasure, debug) {
        var that = this;
        var done = this.async();

        window.waitFor(function() {
            return chromeRemoteIsReady && documentIsLoaded;
        }).done(function() {
            that.styleRecalculations = [];
            var updateLayout;

            var collectData = function(e, params) {
                var val = params.value;
                var len = val.length;

                for(var i = 0; i < len; i++) {
                    var task = val[i];

                    if(task.name === 'ScheduleStyleRecalculation') {
                        var stackTrace = task.args.data.stackTrace || [];
                        var excludedRestyles = $.grep(stackTrace, function(trace) {
                            return trace.url.indexOf('chrome-devtools') === 0 || trace.functionName === 'readThemeMarker';
                        });

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

            var collectEndData = function() {
                $(chrome).off('Tracing.dataCollected', collectData);
                $(chrome).off('Tracing.tracingComplete', collectEndData);

                var assertResult = (typeof standardMeasure === 'function') ? standardMeasure(that.styleRecalculations.length) : standardMeasure === that.styleRecalculations.length;
                var resultMessage = 'Took ' + that.styleRecalculations.length + ' style recalculations';
                var expectedMessage = 'Expected ' + standardMeasure + ' style recalculations';
                var assertMessage = 'Performance test (Expected ' + standardMeasure + ' style recalculations, took ' + that.styleRecalculations.length + ' style recalculations)';

                if(debug) {
                    var time = 0;
                    for(var i = 0; i < that.styleRecalculations.length; i++) {
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

            $('body').outerWidth(true);

            $(chrome).on('Tracing.dataCollected', collectData);
            $(chrome).on('Tracing.tracingComplete', collectEndData);

            var categories = [
                'disabled-by-default-devtools.timeline',
                'disabled-by-default-devtools.timeline.invalidationTracking',
                'disabled-by-default-devtools.timeline.stack'
            ];
            chrome.send('Tracing.start', { categories: categories.join(',') }, function(isError) {
                (function() {
                    var result = measureFunction();
                    return result || $.Deferred().resolve();
                })().done(function() {
                    isError ? collectEndData() : chrome.send('Tracing.end', {});
                });
            });
        });
    };
}));
