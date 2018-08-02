(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("core/class"),
                require("framework/browser_adapters").DefaultBrowserAdapter,
                require("framework/navigation_devices"),
                require("framework/navigation_manager"),
                require("framework/application").Application
            );
        });
    } else {
        DevExpress.mocks = { framework: {} };

        jQuery.extend(DevExpress.mocks.framework, factory(
            jQuery,
            DevExpress.Class,
            DevExpress.framework.DefaultBrowserAdapter,
            DevExpress.framework.NavigationDevices,
            DevExpress.framework.NavigationManager,
            DevExpress.framework.Application
        ));
    }
}(window, function($, Class, DefaultBrowserAdapter, navigationDevicesModule, navigationManagerModule, Application) {

    var exports = {};

    exports.MockStateSource = Class.inherit({
        ctor: function() {
            this.__saveStateLog = [];
            this.__restoreStateLog = [];
            this.__removeStateLog = [];
        },

        saveState: function(storage) {
            this.__saveStateLog.push(storage);
        },
        restoreState: function(storage) {
            this.__restoreStateLog.push(storage);
        },
        removeState: function(storage) {
            this.__removeStateLog.push(storage);
        }
    });

    var createMethodsHistory = function() {
        var result = {
                __methodsHistory: [ ],
                __clearHistory: function() {
                    this.__methodsHistory.splice(0, this.__methodsHistory.length);
                }
            },
            methods = [ "init", "setUri", "back" ];

        $.each(methods, function(i, methodName) {
            result[methodName] = function() {
                result.__methodsHistory.push({
                    methodName: methodName,
                    args: arguments
                });

                return this.callBase.apply(this, arguments);
            };
        });

        return result;
    };

    exports.MockStackBasedNavigationDevice = navigationDevicesModule.StackBasedNavigationDevice.inherit($.extend(createMethodsHistory(), {
        ctor: function(options) {
            options = options || {};
            this.__clearHistory();
            options.window = options.window || new exports.MockBrowser();
            options.browserAdapter = options.browserAdapter || new DefaultBrowserAdapter({ window: options.window });
            this.callBase(options);
        }
    }));

    exports.MockHistoryBasedNavigationDevice = navigationDevicesModule.HistoryBasedNavigationDevice.inherit($.extend(createMethodsHistory(), {
        ctor: function(options) {
            options = options || {};
            this.__clearHistory();
            options.window = options.window || new exports.MockBrowser();
            options.browserAdapter = options.browserAdapter || new DefaultBrowserAdapter({ window: options.window });
            this.callBase(options);
        }
    }));

    var createHistory = function(browser, isOldBrowser, isAndroid) {
        var oldHistory = {
            _navigatedCount: 0,
            _parent: browser,
            _history: [ { uri: "" } ],
            go: function(count) {
                var current = this._current + count,
                    state = this._history[current];

                if(++this._navigatedCount > 100) {
                    throw Error("Mock browser was navigated more than 100 times.");
                }

                if(!state) {
                    return;
                }
                this._current = current;
                this.state = state;
                this._parent.location.hash = state.uri;

                this._parent.lastHash = this._parent.location.hash;

                $(this._parent).trigger("hashchange", {});
            },
            back: function() {
                if(this._current === 1 && isOldBrowser && isAndroid) {
                    this._history[0] = { uri: "" };
                }
                this.go(-1);
            },
            forward: function() {
                this.go(1);
            },
            length: 1,
            state: undefined,
            _current: 0
        };

        var history = $.extend({}, oldHistory, {
            pushState: function(state, title, uri) {
                uri = uri || "";
                this._history.push({ state: state, title: title, uri: uri });
                this.state = state || null;
                this._current++;
                this._parent.lastHash = this._parent.location.hash = uri || "";
                this.length = this._current + 1;
            },
            replaceState: function(state, title, uri) {
                this._history[this._current] = { state: state, title: title, uri: uri };
                this.state = state || null;
                this._parent.lastHash = this._parent.location.hash = uri || "";
            }
        });

        return isOldBrowser ? oldHistory : history;
    };

    exports.MockBrowser = Class.inherit({
        ctor: function(options) {
            options = options || {};

            this.top = this;
            this.history = createHistory(this, options.isOldBrowser, options.isAndroid);
            this.location = { hash: options.hash || "" };
            this.lastHash = this.location.hash;
            this._firstDoEvents = true;
        },

        _normalizeHash: function(hash) {
            if(hash[0] !== "#") {
                hash = "#" + hash;
            }
            return hash;
        },
        doEvents: function() {
            this.location.hash = this._normalizeHash(this.location.hash);
            if(this._normalizeHash(this.lastHash) === this.location.hash) {
                this._firstDoEvents = false;
                return;
            }

            this.lastHash = this.location.hash;
            if(this._firstDoEvents) {
                this.history._history.pop();
                this._firstDoEvents = false;
            } else {
                this.history._current++;
            }

            this.history.length = this.history._current + 1;
            this.history._history.push({ uri: this.location.hash });

            $(this).trigger("hashchange", {});
        },

        __raiseEvent: function(eventName) {
            $(this).trigger(eventName);
        }
    });

    exports.MockBrowserAdapter = Class.inherit({
        ctor: function(options) {
            options = options || {};
            this.__callHistory = [];
            this.canWorkInPureBrowser = options.canWorkInPureBrowser === undefined ? true : options.canWorkInPureBrowser;
        },
        replaceState: function(uri) {
            this.__callHistory.push({
                name: "replaceState",
                args: arguments
            });
            this.__hash = uri;

            return $.Deferred().resolve().promise();
        },
        pushState: function(uri) {
            this.__callHistory.push({
                name: "pushState",
                args: arguments
            });
            this.__hash = uri;

            return $.Deferred().resolve().promise();
        },
        createRootPage: function() {
            this.__callHistory.push({
                name: "createRootPage",
                args: arguments
            });
            return $.Deferred().resolve().promise();
        },
        back: function() {
            this.__callHistory.push({
                name: "back",
                args: arguments
            });
            return $.Deferred().resolve().promise();
        },
        getHash: function() {
            this.__callHistory.push({
                name: "getHash",
                args: arguments
            });

            return this.__hash;
        },
        isRootPage: function() {
            return this.__isRootPage;
        },
        popState: $.Callbacks(),
        _window: new exports.MockBrowser(),
        __isRootPage: false,
        __canBack: false,
        __hash: ""
    });

    exports.MockStackBasedNavigationManager = navigationManagerModule.StackBasedNavigationManager.inherit({
        ctor: function(options) {
            options = options || {};
            this.callBase($.extend(options, {
                navigationDevice: options.navigationDevice || new exports.MockStackBasedNavigationDevice()
            }));

            var callbacks = [ "navigating", "navigated", "navigationCanceled" ],
                that = this;

            this.__callbacksHistory = [];

            $.each(callbacks, function(i, callbackName) {
                that.__callbacksHistory[callbackName] = 0;
                that.on(callbackName, function() {
                    that.__callbacksHistory[callbackName]++;
                });
            });
        }
    });

    exports.MockHistoryBasedNavigationManager = navigationManagerModule.HistoryBasedNavigationManager.inherit({
    });

    exports.MockRouter = Class.inherit({
        ctor: function(options) {
            this.__parseLog = [];
            this.__formatLog = [];
            this.__parseResult = options.__parseResult;
            this.__parseCallback = options.__parseCallback;
            this.__formatResult = options.__formatResult;
            this.__formatCallback = options.__formatCallback;
        },

        parse: function(uri) {
            this.__parseLog.push(uri);
            if(this.__parseCallback) {
                return this.__parseCallback(uri);
            }
            return this.__parseResult;
        },

        format: function(routeData) {
            this.__formatLog.push(routeData);
            if(this.__formatCallback) {
                return this.__formatCallback(window.uri);
            }
            return this.__formatResult;
        }
    });

    exports.MockApplication = Application.inherit({
        ctor: function(options) {
            options = options || {};
            this.__showViewLog = [];
            this.callBase($.extend(false, {
                ns: {},
                navigationManager: new exports.MockStackBasedNavigationManager(),
                router: options.router || new exports.MockRouter({
                    __parseResult: options.__routeParseResult,
                    __formatResult: options.__routeFormatResult
                })
            }, options));
        },

        _showViewImpl: function(viewInfo) {
            this.__showViewLog.push(viewInfo);
            var deferred = this._showViewImplMockDeferred || $.Deferred().resolve();
            return deferred.promise();
        }

    });

    return exports;

}));
