require("../integration/jquery");

var $ = require("jquery"),
    Class = require("../core/class"),
    Callbacks = require("../core/utils/callbacks"),
    window = require("../core/utils/window").getWindow(),
    queue = require("../core/utils/queue");

var ROOT_PAGE_URL = "__root__",
    BUGGY_ANDROID_BUFFER_PAGE_URL = "__buffer__";

var DefaultBrowserAdapter = Class.inherit({
    ctor: function(options) {
        options = options || {};
        this._window = options.window || window;

        this.popState = Callbacks();
        $(this._window).on("hashchange", this._onHashChange.bind(this));
        this._tasks = queue.create();
        this.canWorkInPureBrowser = true;
    },

    replaceState: function(uri) {
        var that = this;

        return this._addTask(function() {
            uri = that._normalizeUri(uri);
            that._window.history.replaceState(null, null, "#" + uri);
            that._currentTask.resolve();
        });
    },

    pushState: function(uri) {
        var that = this;

        return this._addTask(function() {
            uri = that._normalizeUri(uri);
            that._window.history.pushState(null, null, "#" + uri);
            that._currentTask.resolve();
        });
    },

    createRootPage: function() {
        return this.replaceState(ROOT_PAGE_URL);
    },

    _onHashChange: function() {
        if(this._currentTask) {
            this._currentTask.resolve();
        }

        this.popState.fire();
    },

    back: function() {
        var that = this;

        return this._addTask(function() {
            that._window.history.back();
        });
    },

    getHash: function() {
        return this._normalizeUri(this._window.location.hash);
    },

    isRootPage: function() {
        return this.getHash() === ROOT_PAGE_URL;
    },

    _normalizeUri: function(uri) {
        return (uri || "").replace(/^#+/, "");
    },

    _addTask: function(task) {
        var that = this,
            d = $.Deferred();

        this._tasks.add(function() {
            that._currentTask = d;

            task();

            return d;
        });

        return d.promise();
    }
});

var OldBrowserAdapter = DefaultBrowserAdapter.inherit({
    ctor: function() {
        this._innerEventCount = 0;
        this.callBase.apply(this, arguments);
        this._skipNextEvent = false;
    },

    replaceState: function(uri) {
        var that = this;

        uri = that._normalizeUri(uri);

        if(that.getHash() !== uri) {
            that._addTask(function() {
                that._skipNextEvent = true;
                that._window.history.back();
            });

            return that._addTask(function() {
                that._skipNextEvent = true;
                that._window.location.hash = uri;
            });
        }

        return $.Deferred().resolve().promise();
    },

    pushState: function(uri) {
        var that = this;

        uri = this._normalizeUri(uri);

        if(this.getHash() !== uri) {
            return that._addTask(function() {
                that._skipNextEvent = true;
                that._window.location.hash = uri;
            });
        }

        return $.Deferred().resolve().promise();
    },

    createRootPage: function() {
        return this.pushState(ROOT_PAGE_URL);
    },

    _onHashChange: function() {
        var currentTask = this._currentTask;

        this._currentTask = null;

        if(this._skipNextEvent) {
            this._skipNextEvent = false;
        } else {
            this.popState.fire();
        }
        if(currentTask) {
            currentTask.resolve();
        }
    }
});

var BuggyAndroidBrowserAdapter = OldBrowserAdapter.inherit({
    createRootPage: function() {
        this.pushState(BUGGY_ANDROID_BUFFER_PAGE_URL);
        return this.callBase();
    }
});

var HistorylessBrowserAdapter = DefaultBrowserAdapter.inherit({
    ctor: function(options) {
        options = options || {};
        this._window = options.window || window;

        this.popState = Callbacks();
        $(this._window).on("dxback", this._onHashChange.bind(this));

        this._currentHash = this._window.location.hash;
    },

    replaceState: function(uri) {
        this._currentHash = this._normalizeUri(uri);

        return $.Deferred().resolve().promise();
    },

    pushState: function(uri) {
        return this.replaceState(uri);
    },

    createRootPage: function() {
        return this.replaceState(ROOT_PAGE_URL);
    },

    getHash: function() {
        return this._normalizeUri(this._currentHash);
    },
    back: function() {
        return this.replaceState(ROOT_PAGE_URL);
    },
    _onHashChange: function() {
        var promise = this.back();

        this.popState.fire();

        return promise;
    }
});

var BuggyCordovaWP81BrowserAdapter = DefaultBrowserAdapter.inherit({
    ctor: function(options) {
        this.callBase(options);
        this.canWorkInPureBrowser = false;
    }
});

exports.DefaultBrowserAdapter = DefaultBrowserAdapter;
exports.OldBrowserAdapter = OldBrowserAdapter;
exports.BuggyAndroidBrowserAdapter = BuggyAndroidBrowserAdapter;
exports.HistorylessBrowserAdapter = HistorylessBrowserAdapter;
exports.BuggyCordovaWP81BrowserAdapter = BuggyCordovaWP81BrowserAdapter;
