"use strict";

var Class = require("../core/class"),
    inArray = require("../core/utils/array").inArray,
    $ = require("jquery");

var MemoryKeyValueStorage = Class.inherit({
    ctor: function() {
        this.storage = {};
    },
    getItem: function(key) {
        return this.storage[key];
    },
    setItem: function(key, value) {
        this.storage[key] = value;
    },
    removeItem: function(key) {
        delete this.storage[key];
    }
});

/**
* @name StateManager
* @publicName StateManager
* @type object
* @module framework/state_manager
* @export default
*/
var StateManager = Class.inherit({
    /**
    * @name StateManageroptions_storage
    * @publicName storage
    * @type object
    */
    ctor: function(options) {
        options = options || {};
        this.storage = options.storage || new MemoryKeyValueStorage();
        this.stateSources = options.stateSources || [];
    },
    /**
    * @name StateManagerMethods_addStateSource
    * @publicName addStateSource(stateSource)
    * @type method
    * @param1 stateSource:object
    */
    addStateSource: function(stateSource) {
        this.stateSources.push(stateSource);
    },
    /**
    * @name StateManagerMethods_removeStateSource
    * @publicName removeStateSource(stateSource)
    * @type method
    * @param1 stateSource:object
    */
    removeStateSource: function(stateSource) {
        var index = inArray(stateSource, this.stateSources);
        if(index > -1) {
            this.stateSources.splice(index, 1);
            stateSource.removeState(this.storage);
        }
    },
    /**
    * @name StateManagerMethods_saveState
    * @publicName saveState()
    * @type method
    */
    saveState: function() {
        var that = this;
        $.each(this.stateSources, function(index, stateSource) {
            stateSource.saveState(that.storage);
        });
    },
    /**
    * @name StateManagerMethods_restoreState
    * @publicName restoreState()
    * @type method
    */
    restoreState: function() {
        var that = this;
        $.each(this.stateSources, function(index, stateSource) {
            stateSource.restoreState(that.storage);
        });
    },
    /**
    * @name StateManagerMethods_clearState
    * @publicName clearState()
    * @type method
    */
    clearState: function() {
        var that = this;
        $.each(this.stateSources, function(index, stateSource) {
            stateSource.removeState(that.storage);
        });
    }
});

module.exports = StateManager;
module.exports.MemoryKeyValueStorage = MemoryKeyValueStorage;
