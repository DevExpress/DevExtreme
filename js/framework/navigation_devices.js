require("../integration/jquery");

var $ = require("jquery"),
    noop = require("../core/utils/common").noop,
    window = require("../core/utils/window").getWindow(),
    Class = require("../core/class"),
    Callbacks = require("../core/utils/callbacks"),
    browserAdapters = require("./browser_adapters"),
    SessionStorage = require("../core/utils/storage").sessionStorage,
    devices = require("../core/devices");

var SESSION_KEY = "dxPhoneJSApplication";


var HistoryBasedNavigationDevice = Class.inherit({
    ctor: function(options) {
        options = options || {};

        this._browserAdapter = options.browserAdapter || this._createBrowserAdapter(options);
        this.uriChanged = Callbacks();

        this._browserAdapter.popState.add(this._onPopState.bind(this));
    },

    init: noop,

    getUri: function() {
        return this._browserAdapter.getHash();
    },

    setUri: function(uri, replaceCurrent) {
        if(replaceCurrent) {
            return this._browserAdapter.replaceState(uri);
        } else if(uri !== this.getUri()) {
            return this._browserAdapter.pushState(uri);
        } else {
            return $.Deferred().resolve().promise();
        }
    },

    back: function() {
        return this._browserAdapter.back();
    },

    _onPopState: function() {
        this.uriChanged.fire(this.getUri());
    },

    _isBuggyAndroid2: function() {
        // NOTE: window.location is not updated after history.pushState() changes the URL https://code.google.com/p/android/issues/detail?id=17471
        var realDevice = devices.real();
        var version = realDevice.version;
        return realDevice.platform === "android" && version.length > 1 && (version[0] === 2 && version[1] < 4 || version[0] < 2);
    },

    _isBuggyAndroid4: function() {
        // NOTE: Android 4.0: history.back() to first item sets hash to empty string instead of first item hash value
        var realDevice = devices.real();
        var version = realDevice.version;
        return realDevice.platform === "android" && version.length > 1 && (version[0] === 4 && version[1] === 0);
    },

    _isWindowsPhone8: function() {
        // NOTE: Windows Phone 8 can't work in browser. It works only if packed as native app. Taking into account permanent cordova bugs in each new version:
        // https://issues.apache.org/jira/browse/CB-4873
        // https://issues.apache.org/jira/browse/CB-6763
        // https://issues.apache.org/jira/browse/CB-7356
        // we have to disable some navigation stuff to make everything work
        var realDevice = devices.real();
        return realDevice.platform === "win" && realDevice.phone;
    },

    _createBrowserAdapter: function(options) {
        var sourceWindow = options.window || window,
            supportPushReplace = sourceWindow.history.replaceState && sourceWindow.history.pushState,
            result;

        if(this._isWindowsPhone8()) {
            result = new browserAdapters.BuggyCordovaWP81BrowserAdapter(options);
        } else if(sourceWindow !== sourceWindow.top) {
            result = new browserAdapters.HistorylessBrowserAdapter(options);
        } else if(this._isBuggyAndroid4()) {
            result = new browserAdapters.BuggyAndroidBrowserAdapter(options);
        } else if(this._isBuggyAndroid2() || !supportPushReplace) {
            result = new browserAdapters.OldBrowserAdapter(options);
        } else {
            result = new browserAdapters.DefaultBrowserAdapter(options);
        }

        return result;
    }
});

var StackBasedNavigationDevice = HistoryBasedNavigationDevice.inherit({
    ctor: function(options) {
        this.callBase(options);

        this.backInitiated = Callbacks();
        this._rootStateHandler = null;

        $(window).on("unload", this._saveBrowserState);
    },

    init: function() {
        var that = this;

        if(that._browserAdapter.canWorkInPureBrowser) {
            return that._initRootPage().done(function() {
                if(that._browserAdapter.isRootPage()) {
                    that._browserAdapter.pushState("");
                }
            });
        } else {
            return $.Deferred().resolve().promise();
        }
    },

    setUri: function(uri) {
        return this.callBase(uri, !this._browserAdapter.isRootPage());
    },

    _saveBrowserState: function() {
        var sessionStorage = SessionStorage();

        if(sessionStorage) {
            sessionStorage.setItem(SESSION_KEY, true);
        }
    },

    _initRootPage: function() {
        var hash = this.getUri(),
            sessionStorage = SessionStorage();

        if(!sessionStorage || sessionStorage.getItem(SESSION_KEY)) {
            return $.Deferred().resolve().promise();
        }

        sessionStorage.removeItem(SESSION_KEY);

        this._browserAdapter.createRootPage();

        return this._browserAdapter.pushState(hash);
    },

    _onPopState: function() {
        if(this._browserAdapter.isRootPage()) {
            if(this._rootStateHandler) {
                this._rootStateHandler();
            } else {
                this.backInitiated.fire();
            }
        } else {
            if(!this._rootStateHandler) {
                this._createRootStateHandler();
            }

            this.back();
        }
    },

    _createRootStateHandler: function() {
        var uri = this.getUri();

        this._rootStateHandler = function() {
            this.uriChanged.fire(uri);
            this._rootStateHandler = null;
        };
    }
});

exports.HistoryBasedNavigationDevice = HistoryBasedNavigationDevice;
exports.StackBasedNavigationDevice = StackBasedNavigationDevice;
