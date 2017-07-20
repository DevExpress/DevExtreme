"use strict";

var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    errors = require("../widget/ui.errors"),
    browser = require("../../core/utils/browser"),
    sessionStorage = require("../../core/utils/storage").sessionStorage,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    typeUtils = require("../../core/utils/type");

var DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

var parseDates = function(state) {
    if(!state) return;
    each(state, function(key, value) {
        var date;
        if(typeUtils.isPlainObject(value) || Array.isArray(value)) {
            parseDates(value);
        } else if(typeof value === "string") {
            date = DATE_REGEX.exec(value);
            if(date) {
                state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
            }
        }
    });
};

exports.StateStoringController = modules.ViewController.inherit((function() {
    var getStorage = function(options) {
        var storage = options.type === "sessionStorage" ? sessionStorage() : localStorage;

        if(!storage) {
            if(window.location.protocol === "file:" && browser.msie) {
                throw new Error("E1038");
            } else {
                throw new Error("E1007");
            }
        }

        return storage;
    };

    var getUniqueStorageKey = function(options) {
        return typeUtils.isDefined(options.storageKey) ? options.storageKey : "storage";
    };

    return {
        _loadState: function() {
            var options = this.option("stateStoring");

            if(options.type === "custom") {
                return options.customLoad && options.customLoad();
            }
            try {
                return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
            } catch(e) {
                errors.log(e.message);
            }
        },

        _saveState: function(state) {
            var options = this.option("stateStoring");

            if(options.type === "custom") {
                options.customSave && options.customSave(state);
                return;
            }
            try {
                getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
            } catch(e) {
            }
        },

        publicMethods: function() {
            return ["state"];
        },

        isEnabled: function() {
            return this.option("stateStoring.enabled");
        },

        init: function() {
            var that = this;

            that._state = {};
            that._isLoaded = false;
            that._isLoading = false;

            that._windowUnloadHandler = function() {
                if(that._savingTimeoutID !== undefined) {
                    that._saveState(that.state());
                }
            };

            $(window).on("unload", that._windowUnloadHandler);

            return that;
        },

        isLoaded: function() {
            return this._isLoaded;
        },

        isLoading: function() {
            return this._isLoading;
        },

        load: function() {
            var that = this,
                loadResult;

            that._isLoading = true;
            loadResult = that._loadState();

            if(!loadResult || !typeUtils.isFunction(loadResult.done)) {
                loadResult = $.Deferred().resolve(loadResult);
            }

            loadResult.done(function(state) {
                that._isLoaded = true;
                that._isLoading = false;
                that.state(state);
            });
            return loadResult;
        },

        state: function(state) {
            var that = this;

            if(!arguments.length) {
                return extend(true, {}, that._state);
            } else {
                that._state = extend({}, state);
                parseDates(that._state);
            }
        },

        save: function() {
            var that = this;

            clearTimeout(that._savingTimeoutID);
            that._savingTimeoutID = setTimeout(function() {
                that._saveState(that.state());
                that._savingTimeoutID = undefined;
            }, that.option("stateStoring.savingTimeout"));
        },

        optionChanged: function(args) {
            var that = this;

            switch(args.name) {
                case "stateStoring":
                    if(that.isEnabled() && !that.isLoading()) {
                        that.load();
                    }

                    args.handled = true;
                    break;
                default:
                    that.callBase(args);
            }
        },

        dispose: function() {
            clearTimeout(this._savingTimeoutID);
            $(window).off("unload", this._windowUnloadHandler);
        }
    };
})());
