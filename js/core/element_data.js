"use strict";

var WeakMap = require("./polyfills/weak_map");
var eventsEngine = require("../events/core/events_engine");

var dataMap = new WeakMap();
var strategy;

var beforeCleanData = function() {};
var afterCleanData = function() {};

var setDataStrategy = exports.setDataStrategy = function(value) {
    strategy = value;

    var cleanData = strategy.cleanData;

    strategy.cleanData = function(nodes) {
        beforeCleanData(nodes);

        var result = cleanData.apply(this, arguments);

        afterCleanData(nodes);

        return result;
    };
};

setDataStrategy({
    data: function(element, key, value) {
        if(!element) return;

        var elementData = dataMap.get(element);

        if(!elementData) {
            elementData = {};
            dataMap.set(element, elementData);
        }

        if(key === undefined) {
            return elementData;
        }

        if(arguments.length === 2) {
            return elementData[key];
        }

        elementData[key] = value;
        return value;
    },

    removeData: function(element, key) {
        if(!element) return;
        if(key === undefined) {
            dataMap.delete(element);
        } else {
            var elementData = dataMap.get(element);
            if(elementData) {
                delete elementData[key];
            }
        }
    },

    cleanData: function(elements) {
        for(var i = 0; i < elements.length; i++) {
            eventsEngine.off(elements[i]);
            dataMap.delete(elements[i]);
        }
    }
});

exports.setDataStrategy = setDataStrategy;

exports.getDataStrategy = function() {
    return strategy;
};

exports.data = function() {
    return strategy.data.apply(this, arguments);
};

exports.beforeCleanData = function(callback) {
    beforeCleanData = callback;
};

exports.afterCleanData = function(callback) {
    afterCleanData = callback;
};

exports.cleanData = function(nodes) {
    return strategy.cleanData.apply(this, arguments);
};

exports.removeData = function() {
    return strategy.removeData.apply(this, arguments);
};

exports.cleanDataRecursive = function(element, cleanSelf) {
    if(!(element instanceof Element)) {
        return;
    }

    var childElements = element.getElementsByTagName("*");

    strategy.cleanData(childElements);

    if(cleanSelf) {
        strategy.cleanData([element]);
    }
};
