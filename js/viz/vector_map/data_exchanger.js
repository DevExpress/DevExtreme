"use strict";

var _Callbacks = require("jquery").Callbacks;

function DataExchanger() {
    this._store = {};
}

DataExchanger.prototype = {
    constructor: DataExchanger,

    dispose: function() {
        this._store = null;
        return this;
    },

    _get: function(category, name) {
        var store = this._store[category] || (this._store[category] = {});
        return store[name] || (store[name] = { callbacks: _Callbacks() });
    },

    set: function(category, name, data) {
        var item = this._get(category, name);
        item.data = data;
        item.callbacks.fire(data);
        return this;
    },

    bind: function(category, name, callback) {
        var item = this._get(category, name);
        item.callbacks.add(callback);
        item.data && callback(item.data);
        return this;
    },

    unbind: function(category, name, callback) {
        var item = this._get(category, name);
        item.callbacks.remove(callback);
        return this;
    }
};

exports.DataExchanger = DataExchanger;
