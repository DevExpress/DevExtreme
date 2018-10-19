"use strict";

var Guid = require("../../core/guid"),
    each = require("../../core/utils/iterator").each;

var InstanceStorage = function() {
    this._storage = {};
};

InstanceStorage.prototype._find = function(condition) {
    var resultInstance;

    each(this._storage, function(guid, storageItem) {
        var instance = storageItem.instance,
            item = storageItem.item;

        if(condition(item)) {
            resultInstance = instance;

            return false;
        }
    });

    return resultInstance;
};

InstanceStorage.prototype.clear = function() {
    this._storage = {};
};

InstanceStorage.prototype.add = function(item, instance, guid) {
    guid = guid || new Guid();
    this._storage[guid] = { item: item, instance: instance };

    return guid;
};

InstanceStorage.prototype.extend = function(instanceStorage) {
    var that = this;

    instanceStorage.each(function(instance, item, guid) {
        if(that._storage[guid]) {
            that._storage[guid].instance = instance;
        } else {
            that.add(item, instance, guid);
        }
    });
};

InstanceStorage.prototype.findByItem = function(item) {
    return this._find(function(storedItem) { return storedItem === item; });
};

InstanceStorage.prototype.findByName = function(name) {
    return this._find(function(item) { return name === item.name; });
};

InstanceStorage.prototype.findByDataField = function(dataField) {
    return this._find(function(item) { return dataField === item.dataField; });
};

InstanceStorage.prototype.each = function(handler) {
    each(this._storage, function(guid, storageItem) {
        var instance = storageItem.instance,
            item = storageItem.item;

        if(instance) {
            handler(instance, item, guid);
        }
    });
};

module.exports = InstanceStorage;
